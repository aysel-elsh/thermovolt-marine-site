import * as THREE from 'three';

// Procedural concept model of a TVM module: cold block, TEG array, hot block,
// control boards and enclosure. Units are arbitrary; footprint ≈ 3.2 × 2.2.

const W = 3.2;
const D = 2.2;

function roundedRect(w, d, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r);
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d);
  s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// Rounded slab sitting on y = 0, height h.
function slab(w, d, h, r, bevel = 0.04) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - bevel * 2, d - bevel * 2, Math.max(0.01, r - bevel)), {
    depth: Math.max(0.001, h - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 14,
  });
  g.rotateX(-Math.PI / 2);
  g.translate(0, bevel, 0);
  return g;
}

function box(w, h, d) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(0, h / 2, 0);
  return g;
}

function cyl(r, h, seg = 24) {
  const g = new THREE.CylinderGeometry(r, r, h, seg);
  g.translate(0, h / 2, 0);
  return g;
}

// Pipe stub sticking out of the back face (−z).
function pipe(r, len) {
  const g = new THREE.CylinderGeometry(r, r, len, 24);
  g.rotateX(Math.PI / 2);
  g.translate(0, 0, -len / 2);
  return g;
}

const std = (color, rough, metal, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });

// Thermal-camera palette (ironbow-style).
const THERMAL = {
  hottest: '#FFE7A3',
  hot: '#FFC24D',
  warm: '#F07A3A',
  mid: '#C8346B',
  cool: '#5B2A8C',
  cold: '#2B2F9E',
  ambient: '#1E1A4F',
};

function silkscreenTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 704;
  const ctx = c.getContext('2d');
  const draw = () => {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = 'rgba(232,195,106,0.55)';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const paths = [
      [[90, 120], [300, 120], [360, 180], [360, 300]],
      [[90, 170], [270, 170], [320, 220], [320, 420]],
      [[420, 520], [600, 520], [650, 470], [880, 470]],
      [[420, 570], [640, 570], [700, 620], [930, 620]],
      [[200, 560], [200, 460], [260, 400]],
      [[560, 120], [700, 120], [760, 180], [900, 180]],
      [[560, 170], [680, 170], [730, 220], [730, 330]],
    ];
    paths.forEach((p) => {
      ctx.beginPath();
      p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    });
    ctx.fillStyle = 'rgba(232,195,106,0.8)';
    [[90, 120], [90, 170], [930, 620], [880, 470], [900, 180], [200, 560]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = 'rgba(244,246,250,0.85)';
    ctx.font = '700 40px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillText('TVM DELTA', 70, 650);
    ctx.fillText('OASIS', 760, 90);
    ctx.font = '500 26px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillStyle = 'rgba(244,246,250,0.5)';
    ctx.fillText('POWER', 70, 600);
    ctx.fillText('BRAIN', 760, 130);
    ctx.strokeStyle = 'rgba(244,246,250,0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(500, 20, 4, 664);
  };
  draw();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  document.fonts?.ready?.then(() => {
    draw();
    tex.needsUpdate = true;
  });
  return tex;
}

export function buildModule({ boltTexture }) {
  const root = new THREE.Group();
  const layers = [];

  // part(): register a mesh with its render + thermal colours for a layer.
  const makeLayer = (key, baseY, anchorY) => {
    const g = new THREE.Group();
    g.position.y = baseY;
    root.add(g);
    const layer = { key, group: g, baseY, parts: [], anchor: new THREE.Vector3(W / 2 + 0.05, anchorY, 0.2) };
    layers.push(layer);
    return layer;
  };
  const part = (layer, geo, renderMat, thermalColor, pos = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(geo, renderMat);
    mesh.position.set(...pos);
    mesh.userData.layer = layer.key;
    const thermal = new THREE.MeshBasicMaterial({ color: thermalColor, transparent: true });
    const xray = new THREE.MeshBasicMaterial({ color: '#3B9EF1', transparent: true, opacity: 0.05, depthWrite: false });
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 15),
      new THREE.LineBasicMaterial({ color: '#7CC4FF', transparent: true, opacity: 0.85 }),
    );
    edges.visible = false;
    mesh.add(edges);
    renderMat.transparent = true;
    layer.group.add(mesh);
    layer.parts.push({ mesh, render: renderMat, thermal, xray, edges });
    return mesh;
  };

  // 0 — cold-side block (seawater)
  const cold = makeLayer('cold', 0, 0.2);
  part(cold, slab(W, D, 0.4, 0.42, 0.05), std('#3C78C8', 0.32, 0.75), THERMAL.cold);
  [-0.85, 0.85].forEach((x) => {
    part(cold, pipe(0.12, 0.55), std('#2F64B0', 0.3, 0.8), THERMAL.cold, [x, 0.2, -D / 2 + 0.02]);
    part(cold, pipe(0.16, 0.12), std('#C9D1DC', 0.25, 0.9), THERMAL.cool, [x, 0.2, -D / 2 - 0.38]);
  });

  // 1 — TEG array (6 modules)
  const teg = makeLayer('teg', 0.4, 0.08);
  [-0.95, 0, 0.95].forEach((x) =>
    [-0.47, 0.47].forEach((z) => {
      part(teg, box(0.8, 0.035, 0.8), std('#F4F2EC', 0.6, 0), THERMAL.hot, [x, 0.125, z]);
      part(teg, box(0.8, 0.035, 0.8), std('#ECEAE3', 0.6, 0), THERMAL.mid, [x, 0, z]);
      part(teg, box(0.72, 0.09, 0.72), std('#BFC6D1', 0.45, 0.3), THERMAL.warm, [x, 0.035, z]);
    }),
  );
  part(teg, cyl(0.025, 0.5), std('#E4572E', 0.4, 0.1), THERMAL.warm, [1.42, 0.06, -0.47]).rotation.z = Math.PI / 2;
  part(teg, cyl(0.025, 0.5), std('#1A1D24', 0.4, 0.1), THERMAL.mid, [1.42, 0.06, -0.3]).rotation.z = Math.PI / 2;

  // 2 — hot-side block (engine coolant)
  const hot = makeLayer('hot', 0.56, 0.17);
  part(hot, slab(W, D, 0.34, 0.42, 0.05), std('#C8763F', 0.28, 1), THERMAL.hottest);
  [-0.85, 0.85].forEach((x) => {
    part(hot, pipe(0.12, 0.55), std('#B5652F', 0.3, 1), THERMAL.hottest, [x, 0.17, -D / 2 + 0.02]);
    part(hot, pipe(0.16, 0.12), std('#D9DEE5', 0.25, 0.9), THERMAL.hot, [x, 0.17, -D / 2 - 0.38]);
  });

  // 3 — control boards (Delta + Oasis)
  const pcb = makeLayer('pcb', 1.0, 0.12);
  part(pcb, slab(3.0, 2.0, 0.06, 0.3, 0.015), std('#173A8F', 0.55, 0.15), THERMAL.mid);
  const silk = new THREE.Mesh(
    new THREE.PlaneGeometry(2.9, 1.95).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: silkscreenTexture(), transparent: true, depthWrite: false }),
  );
  silk.position.y = 0.062;
  silk.userData.layer = 'pcb';
  pcb.group.add(silk);
  pcb.silk = silk;
  // Delta (power) side
  part(pcb, box(0.46, 0.32, 0.46), std('#5D6470', 0.4, 0.7), THERMAL.warm, [-0.9, 0.06, -0.15]);
  part(pcb, box(0.3, 0.06, 0.3), std('#121418', 0.5, 0.2), THERMAL.hot, [-0.35, 0.06, -0.3]);
  [-1.15, -0.95, -0.75].forEach((x) => part(pcb, cyl(0.09, 0.26), std('#AEB6C2', 0.3, 0.8), THERMAL.warm, [x, 0.06, 0.45]));
  // Oasis (brain) side
  part(pcb, box(1.0, 0.1, 0.66), std('#B9C1CC', 0.25, 0.95), THERMAL.warm, [0.7, 0.06, 0.25]);
  part(pcb, box(0.26, 0.05, 0.26), std('#121418', 0.5, 0.2), THERMAL.mid, [0.55, 0.06, -0.5]);
  part(pcb, box(0.7, 0.2, 0.22), std('#F2F2EE', 0.5, 0), THERMAL.mid, [0, 0.06, -0.82]);
  part(pcb, box(0.08, 0.05, 0.08), std('#F5B82E', 0.3, 0, { emissive: '#F5B82E', emissiveIntensity: 1.6 }), THERMAL.hottest, [1.25, 0.06, -0.8]);
  [-1.3, 1.3].forEach((x) => [-0.8, 0.8].forEach((z) => part(pcb, cyl(0.05, 0.1), std('#C9A44B', 0.3, 1), THERMAL.warm, [x, -0.1, z])));

  // 4 — enclosure
  const lid = makeLayer('lid', 0.9, 0.34);
  part(lid, slab(W + 0.1, D + 0.1, 0.64, 0.5, 0.11), std('#0E2152', 0.42, 0.35), THERMAL.ambient);
  const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.72, 0.82).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: boltTexture, transparent: true, depthWrite: false }),
  );
  logo.position.set(-0.9, 0.645, 0.35);
  logo.userData.layer = 'lid';
  lid.group.add(logo);
  lid.logo = logo;
  part(lid, cyl(0.07, 0.02), std('#5FD0D8', 0.3, 0, { emissive: '#5FD0D8', emissiveIntensity: 2 }), THERMAL.cool, [1.15, 0.635, 0.6]);
  part(lid, cyl(0.16, 0.03), std('#0A1840', 0.6, 0.2), THERMAL.ambient, [1.15, 0.63, 0.15]);

  // Heat-flow particles (thermal mode): hot block → TEG → cold block.
  const N = 90;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const seeds = [];
  for (let i = 0; i < N; i += 1) {
    seeds.push({ x: (Math.random() - 0.5) * 2.8, z: (Math.random() - 0.5) * 1.8, t: Math.random(), v: 0.25 + Math.random() * 0.35 });
  }
  const pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pgeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const particles = new THREE.Points(pgeo, new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false }));
  particles.visible = false;
  root.add(particles);
  const cHot = new THREE.Color(THERMAL.hottest);
  const cCold = new THREE.Color('#4A6BFF');
  const tmp = new THREE.Color();

  const updateParticles = (dt) => {
    const top = hot.group.position.y + 0.02;
    const bottom = cold.group.position.y + 0.4;
    for (let i = 0; i < N; i += 1) {
      const s = seeds[i];
      s.t = (s.t + dt * s.v) % 1;
      pos[i * 3] = s.x;
      pos[i * 3 + 1] = top + (bottom - top) * s.t;
      pos[i * 3 + 2] = s.z;
      tmp.copy(cHot).lerp(cCold, s.t);
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    pgeo.attributes.position.needsUpdate = true;
    pgeo.attributes.color.needsUpdate = true;
  };

  // Stack order bottom → top; explode spreads by index.
  const order = ['cold', 'teg', 'hot', 'pcb', 'lid'];
  layers.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));

  const dispose = () => {
    root.traverse((o) => {
      o.geometry?.dispose?.();
      const m = o.material;
      if (m) (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose?.());
    });
    layers.forEach((l) => l.parts.forEach((p) => {
      p.thermal.dispose();
      p.xray.dispose();
    }));
  };

  return { root, layers, particles, updateParticles, dispose };
}
