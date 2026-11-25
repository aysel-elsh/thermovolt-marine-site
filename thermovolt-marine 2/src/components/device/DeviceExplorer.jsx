import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildModule } from './buildModule';
import boltUrl from '../../assets/bolt.png';

// Listed top → bottom, like a teardown.
export const LAYERS = [
  { key: 'lid', n: '01', name: 'Enclosure', body: 'Marine housing with ports for coolant, seawater and the DC cable. A status light shows when the module is making power.' },
  { key: 'pcb', n: '02', name: 'Control boards', body: 'Delta steadies the voltage for the boat’s DC bus. Oasis reads temperatures and power and balances electricity against cooling.' },
  { key: 'hot', n: '03', name: 'Hot-side block', body: 'Engine coolant runs through this copper block and heats the top face of every module.' },
  { key: 'teg', n: '04', name: 'Thermoelectric array', body: 'Six modules wired in series, the same count as the bench build. Heat crossing them becomes DC current.' },
  { key: 'cold', n: '05', name: 'Cold-side block', body: 'Raw seawater flows through here and pulls heat out of the bottom face before it leaves the hull.' },
];
const MODES = [
  { id: 'render', label: 'Render' },
  { id: 'thermal', label: 'Thermal' },
  { id: 'xray', label: 'X-ray' },
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const canWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
};

export default function DeviceExplorer() {
  const sectionRef = useRef(null);
  const canvasHost = useRef(null);
  const labelRefs = useRef({});
  const lineRefs = useRef({});
  const progRef = useRef(null);
  const progTxt = useRef(null);
  const api = useRef({ sel: null, mode: 'render', manual: null, desktop: true });

  const [userSel, setUserSel] = useState(null);
  const [scrollSel, setScrollSel] = useState(null);
  const [mode, setMode] = useState('render');
  const [manual, setManual] = useState(null); // null = follow scroll
  const [desktop, setDesktop] = useState(true);
  const [webgl, setWebgl] = useState(true);
  const [hover, setHover] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const sel = userSel ?? scrollSel;
  api.current.sel = sel;
  api.current.mode = mode;
  api.current.manual = manual;
  api.current.desktop = desktop;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (!canWebGL()) {
      setWebgl(false);
      return undefined;
    }
    const host = canvasHost.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'pan-y';

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    const key = new THREE.DirectionalLight('#ffffff', 1.4);
    key.position.set(4, 8, 5);
    scene.add(key, new THREE.HemisphereLight('#cfe3ff', '#081638', 0.5));
    const rim = new THREE.DirectionalLight('#3B9EF1', 1.2);
    rim.position.set(-6, 3, -5);
    scene.add(rim);

    const bolt = new THREE.TextureLoader().load(boltUrl);
    bolt.colorSpace = THREE.SRGBColorSpace;
    const model = buildModule({ boltTexture: bolt });
    const pivot = new THREE.Group();
    pivot.add(model.root);
    model.root.position.set(0, 0, 0);
    scene.add(pivot);

    // Soft contact shadow
    const sc = document.createElement('canvas');
    sc.width = sc.height = 256;
    const sctx = sc.getContext('2d');
    const grd = sctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grd.addColorStop(0, 'rgba(0,0,0,0.55)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = grd;
    sctx.fillRect(0, 0, 256, 256);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 4.6).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
    shadow.position.y = -0.02;
    pivot.add(shadow);

    // Blueprint floor grid
    const grid = new THREE.GridHelper(14, 28, '#2A4C9C', '#16306E');
    grid.position.y = -0.03;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    pivot.add(grid);

    const byKey = Object.fromEntries(model.layers.map((l) => [l.key, l]));
    const stackIndex = Object.fromEntries(model.layers.map((l, i) => [l.key, i]));

    // Size
    let W = 1;
    let H = 1;
    const resize = () => {
      W = host.clientWidth;
      H = host.clientHeight;
      renderer.setSize(W, H, false);
      renderer.domElement.style.width = `${W}px`;
      renderer.domElement.style.height = `${H}px`;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // Drag to rotate
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let rotY = -1.25;
    let rotX = 0;
    let dragY = 0; // user drag offset on top of the scroll-driven spin
    let tRotX = 0;
    let lastInteract = -1e9;
    const onDown = (e) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        dragY = clamp(dragY + dx * 0.008, -1.4, 1.4);
        tRotX = clamp(tRotX + dy * 0.004, -0.18, 0.28);
        lastX = e.clientX;
        lastY = e.clientY;
        lastInteract = performance.now();
      } else {
        const k = pick(e);
        renderer.domElement.style.cursor = k ? 'pointer' : 'grab';
        setHover((h) => (h === k ? h : k));
      }
    };
    const onUp = (e) => {
      if (dragging && moved < 6) {
        const k = pick(e);
        if (k) setUserSel((s) => (s === k ? null : k));
      }
      dragging = false;
    };
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pickables = [];
    model.layers.forEach((l) => l.parts.forEach((p) => pickables.push(p.mesh)));
    const pick = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(pickables, false)[0];
      return hit ? hit.object.userData.layer : null;
    };
    const el = renderer.domElement;
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointerleave', () => setHover(null));

    // Visibility gating
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) loop();
    });
    io.observe(host);

    let explode = 0;
    let lastStage = null;
    let lastOpen = null;
    let raf = 0;
    let prev = performance.now();
    const v = new THREE.Vector3();
    const lift = {};
    const fade = {};
    model.layers.forEach((l) => {
      lift[l.key] = 0;
      fade[l.key] = 1;
    });
    let appliedMode = null;

    const applyMode = (m) => {
      model.layers.forEach((l) =>
        l.parts.forEach((p) => {
          p.mesh.material = m === 'thermal' ? p.thermal : m === 'xray' ? p.xray : p.render;
          p.edges.visible = m === 'xray';
        }),
      );
      byKey.pcb.silk.visible = m === 'render';
      byKey.lid.logo.visible = m !== 'thermal';
      model.particles.visible = m === 'thermal';
      grid.material.opacity = m === 'xray' ? 0.6 : 0.35;
      appliedMode = m;
    };

    const loop = () => {
      cancelAnimationFrame(raf);
      if (!visible) return;
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const s = api.current;

      // Scroll progress through the pinned section drives everything
      const rect = sectionRef.current.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? clamp(-rect.top / span, 0, 1) : 0;
      const scrollTarget = smooth(0.03, 0.3, p);
      const stage = p < 0.36 ? null : LAYERS[Math.min(4, Math.floor((p - 0.36) / 0.12))].key;
      if (stage !== lastStage) {
        lastStage = stage;
        setScrollSel(stage);
        setUserSel(null);
        setManual(null);
      }
      if (progRef.current) progRef.current.style.transform = `scaleY(${p})`;
      if (progTxt.current) progTxt.current.textContent = `${String(Math.round(p * 100)).padStart(3, '0')}%`;
      const spin = -1.25 + smooth(0, 1, p) * 1.9; // the model turns as you scroll
      const elev = 0.66 - smooth(0, 0.45, p) * 0.2; // and the camera drops toward eye level
      const target = s.manual !== null ? (s.manual ? 1 : 0) : scrollTarget;
      explode += (target - explode) * (reduce ? 1 : Math.min(1, dt * 6));
      const open = explode > 0.5;
      if (open !== lastOpen) {
        lastOpen = open;
        setIsOpen(open);
      }

      if (appliedMode !== s.mode) applyMode(s.mode);

      // Layer positions, selection lift and fade
      model.layers.forEach((l) => {
        const i = stackIndex[l.key];
        const on = s.sel === l.key;
        lift[l.key] += ((on ? 0.22 : 0) - lift[l.key]) * Math.min(1, dt * 8);
        const f = s.sel && !on ? (s.mode === 'xray' ? 0.3 : 0.22) : 1;
        fade[l.key] += (f - fade[l.key]) * Math.min(1, dt * 8);
        l.group.position.y = l.baseY + i * 0.95 * explode + lift[l.key];
        l.parts.forEach((p) => {
          const m = p.mesh.material;
          m.opacity = (s.mode === 'xray' ? 0.05 : 1) * fade[l.key];
          m.depthWrite = fade[l.key] > 0.9 && s.mode !== 'xray';
          p.edges.material.opacity = 0.85 * fade[l.key];
        });
        if (l.silk) l.silk.material.opacity = fade[l.key];
        if (l.logo) l.logo.material.opacity = fade[l.key];
      });
      if (model.particles.visible) model.updateParticles(dt);

      // Rotation: scroll spin plus any drag; drag eases back after a pause
      if (now - lastInteract > 2500) dragY += (0 - dragY) * Math.min(1, dt * 1.5);
      const tRotY = spin + dragY;
      rotY += (tRotY - rotY) * (reduce ? 1 : Math.min(1, dt * 5));
      rotX += (tRotX - rotX) * Math.min(1, dt * 7);
      pivot.rotation.y = rotY;

      // Camera frames the stack as it grows
      const midY = 0.8 + explode * 1.85;
      const dist = (s.desktop ? 13.5 : 16) + explode * (s.desktop ? 7 : 9.5);
      const el2 = elev + rotX;
      const shift = s.desktop ? explode * 1.5 : 0; // make room for the label column
      camera.position.set(shift, midY + Math.sin(el2) * dist, Math.cos(el2) * dist);
      camera.lookAt(shift, midY, 0);
      renderer.render(scene, camera);

      // Labels: project each layer's anchor, pin labels to a right-hand column
      const showLabels = s.desktop && explode > 0.55;
      const colX = W - 210;
      model.layers.forEach((l) => {
        const lab = labelRefs.current[l.key];
        const line = lineRefs.current[l.key];
        if (!lab || !line) return;
        v.copy(l.anchor);
        l.group.localToWorld(v);
        v.project(camera);
        const x = (v.x * 0.5 + 0.5) * W;
        const y = (-v.y * 0.5 + 0.5) * H;
        const op = showLabels ? clamp((explode - 0.55) / 0.3, 0, 1) : 0;
        lab.style.transform = `translate(${colX + 12}px, ${y - 10}px)`;
        lab.style.opacity = op;
        line.setAttribute('x1', String(Math.min(x + 8, colX - 4)));
        line.setAttribute('y1', String(y));
        line.setAttribute('x2', String(colX));
        line.setAttribute('y2', String(y));
        line.style.opacity = op * (s.sel && s.sel !== l.key ? 0.35 : 1);
      });
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      model.dispose();
      shadow.geometry.dispose();
      shadow.material.map.dispose();
      shadow.material.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      bolt.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(el);
    };
  }, []);

  const pickLayer = (k) => setUserSel((s) => (s === k ? null : k));
  const cur = LAYERS.find((l) => l.key === sel);

  return (
    <section ref={sectionRef} className="relative h-[420vh] bg-navy-deep text-white" aria-labelledby="inside-title">
      <div className="blueprint sticky top-0 h-[100svh] overflow-hidden">
        {/* scroll progress rail */}
        <div className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex lg:left-5" aria-hidden="true">
          <span className="tag text-[10px] text-white/40">Scan</span>
          <div className="h-44 w-px bg-white/15">
            <div ref={progRef} className="h-full w-full origin-top bg-amber" style={{ transform: 'scaleY(0)' }} />
          </div>
          <span ref={progTxt} className="tag text-[10px] text-amber">000%</span>
        </div>

        <div className="wrap flex h-full flex-col pb-4 pt-[84px] lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-10 lg:pb-0 lg:pt-0">
          {/* Copy */}
          <div className="relative z-10 lg:col-start-1 lg:row-start-1 lg:self-end lg:pt-[72px]">
            <p className="kicker text-sky">Inside the module</p>
            <h2 id="inside-title" className="mt-3 max-w-[16ch] text-[clamp(26px,3.3vw,46px)] text-white lg:mt-4">
              Five layers between the engine and the sea.
            </h2>
            <p className="mt-4 hidden max-w-[46ch] text-[17px] text-white/70 lg:block">
              Keep scrolling and the module turns and comes apart. Pick a layer to isolate it, or drag to rotate.
            </p>
          </div>

          {/* 3D stage */}
          <div className="relative mt-3 min-h-0 flex-1 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:h-[calc(100vh-72px)] lg:flex-none lg:self-end">
            {webgl ? (
              <>
                <div ref={canvasHost} className="absolute inset-0" aria-hidden="true" />
                <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                  {LAYERS.map((l) => (
                    <line key={l.key} ref={(n) => (lineRefs.current[l.key] = n)} stroke={sel === l.key ? '#5FD0D8' : 'rgba(255,255,255,.55)'} strokeWidth="1.25" style={{ opacity: 0 }} />
                  ))}
                </svg>
                {LAYERS.map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    tabIndex={-1}
                    ref={(n) => (labelRefs.current[l.key] = n)}
                    onClick={() => pickLayer(l.key)}
                    className={`tag absolute left-0 top-0 whitespace-nowrap transition-colors ${sel === l.key ? 'text-[#5FD0D8]' : hover === l.key ? 'text-white' : 'text-white/75'}`}
                    style={{ opacity: 0 }}
                  >
                    {l.name}
                  </button>
                ))}
              </>
            ) : (
              <div className="flex h-full items-center justify-center rounded-3xl border border-white/10 text-white/60">3D view needs WebGL. Use the list to explore the layers.</div>
            )}

            {/* HUD */}
            <div className="absolute left-0 right-0 top-0 flex flex-wrap items-center justify-between gap-3 lg:top-[88px]">
              <div className="flex rounded-full border border-white/15 bg-navy-deep/70 p-1 backdrop-blur" role="radiogroup" aria-label="View mode">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={mode === m.id}
                    onClick={() => setMode(m.id)}
                    className={`tag min-h-[36px] rounded-full px-3.5 transition-colors ${mode === m.id ? 'bg-white text-navy-deep' : 'text-white/70 hover:text-white'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setManual(!isOpen)}
                className="tag min-h-[36px] rounded-full border border-white/15 bg-navy-deep/70 px-4 text-white/80 backdrop-blur hover:text-white"
              >
                {isOpen ? 'Assemble' : 'Explode'}
              </button>
            </div>
            {mode === 'thermal' && (
              <div className="absolute bottom-2 left-0 flex items-center gap-3 lg:bottom-6">
                <span className="tag text-white/60">Cold</span>
                <span className="h-2 w-28 rounded-full sm:w-40" style={{ background: 'linear-gradient(90deg,#2B2F9E,#5B2A8C,#C8346B,#F07A3A,#FFC24D,#FFE7A3)' }} />
                <span className="tag text-white/60">Hot</span>
              </div>
            )}
            <p className="tag absolute bottom-6 right-0 hidden text-white/40 lg:block">Concept model · drag to rotate</p>
          </div>

          {/* Mobile: current layer card */}
          <div className="relative z-10 lg:hidden">
            <div className="min-h-[118px] rounded-2xl border border-white/10 bg-navy-deep/80 p-4 backdrop-blur" aria-live="polite">
              {cur ? (
                <>
                  <p className="tag text-sky">{cur.n} / 05</p>
                  <p className="mt-1 font-display text-xl font-bold">{cur.name}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-white/70">{cur.body}</p>
                </>
              ) : (
                <p className="text-[15px] leading-relaxed text-white/70">Keep scrolling: the module turns and comes apart layer by layer. Tap a part to isolate it.</p>
              )}
            </div>
            <div className="mt-1 flex gap-1.5" role="group" aria-label="Layers">
              {LAYERS.map((l) => (
                <button key={l.key} type="button" aria-label={l.name} aria-pressed={sel === l.key} onClick={() => pickLayer(l.key)} className="flex-1 py-3">
                  <span className={`block h-1.5 rounded-full transition-colors ${sel === l.key ? 'bg-sky' : 'bg-white/15'}`} />
                </button>
              ))}
            </div>
            <p className="tag text-center text-[10px] text-white/35">Concept model</p>
          </div>

          {/* Desktop: layer list */}
          <div className="relative z-10 hidden lg:col-start-1 lg:row-start-2 lg:block lg:self-start">
            <ol className="mt-7 border-t border-white/10">
              {LAYERS.map((l) => {
                const on = sel === l.key;
                const hov = hover === l.key;
                return (
                  <li key={l.key} className="border-b border-white/10">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => pickLayer(l.key)}
                      onMouseEnter={() => setHover(l.key)}
                      onMouseLeave={() => setHover(null)}
                      className={`group flex w-full items-start gap-5 px-4 py-3.5 text-left transition-colors duration-300 ${on ? 'bg-sky text-navy-deep' : hov ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'}`}
                    >
                      <span className={`tag mt-1 ${on ? 'text-navy-deep/70' : 'text-white/45'}`}>{l.n}</span>
                      <span className="flex-1">
                        <span className={`block font-display text-lg font-bold ${on ? 'text-navy-deep' : 'text-white'}`}>{l.name}</span>
                        <span className={`grid transition-all duration-300 ${on ? 'mt-1 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                          <span className="overflow-hidden text-[15px] leading-relaxed text-navy-deep/85">{l.body}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <dl className="mt-6 grid grid-cols-3 gap-4 [@media(max-height:820px)]:hidden">
              {[
                ['Moving parts', '0'],
                ['Engine changes', 'None'],
                ['Install', 'Bolt-on'],
              ].map(([k, val]) => (
                <div key={k}>
                  <dt className="tag text-white/45">{k}</dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
