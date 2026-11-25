import { useEffect, useRef, useState } from 'react';
import { reducedMotion, useInView } from '../lib/hooks';

// Interactive cutaway: flip TVM on and watch engine heat go to onboard power
// instead of overboard. Illustration, not to scale.
const C = {
  navy: '#0E2152',
  royal: '#1B45C4',
  sky: '#3B9EF1',
  mist: '#BDCDD3',
  frost: '#F2F5F7',
  amber: '#F5B82E',
  heat: '#E4572E',
};
const T = 'transition-all duration-[1100ms] ease-[cubic-bezier(.2,.7,.2,1)]';

function Coral({ x, y, s = 1, color, on }) {
  const fill = on ? color : '#E9EEF2';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className={T} style={{ color: fill }}>
      <path
        d="M0 0 C-3 -18 -16 -24 -18 -42 M0 0 C2 -22 6 -34 3 -54 M0 0 C6 -14 17 -20 21 -36 M3 -30 C10 -34 12 -40 12 -46 M-9 -22 C-16 -26 -22 -28 -25 -34"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        className={T}
      />
    </g>
  );
}

export default function HeroScene() {
  const [on, setOn] = useState(false);
  const touched = useRef(false);
  const [ref, seen] = useInView({ threshold: 0.35 });

  useEffect(() => {
    if (!seen || reducedMotion()) return undefined;
    const t = setTimeout(() => {
      if (!touched.current) setOn(true);
    }, 1400);
    return () => clearTimeout(t);
  }, [seen]);

  const toggle = (v) => {
    touched.current = true;
    setOn(v);
  };

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[28px] bg-white shadow-lift">
      {/* switch */}
      <div className="z-10 flex items-center justify-center gap-3 bg-frost p-3 sm:absolute sm:left-5 sm:top-5 sm:bg-transparent sm:p-0">
        <div role="radiogroup" aria-label="ThermoVolt system" className="flex rounded-full bg-white/90 p-1 shadow-lift backdrop-blur">
          {[
            [false, 'TVM off'],
            [true, 'TVM on'],
          ].map(([v, l]) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={on === v}
              onClick={() => toggle(v)}
              className={`min-h-[40px] rounded-full px-4 font-display text-sm font-bold transition-colors ${on === v ? (v ? 'bg-amber text-navy' : 'bg-navy text-white') : 'text-navy/60 hover:text-navy'}`}
            >
              {l}
            </button>
          ))}
        </div>
        {!touched.current && !on && <span className="pulse hidden h-3 w-3 rounded-full bg-amber sm:block" aria-hidden="true" />}
      </div>

      <svg viewBox="10 84 880 466" className="block h-auto w-full" role="img" aria-label={on ? 'With ThermoVolt on, engine heat is converted to onboard power and the discharge plume is small and cool.' : 'With ThermoVolt off, engine heat is dumped overboard as a large warm plume.'}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F7F9FA" />
            <stop offset="1" stopColor={C.mist} />
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.sky} />
            <stop offset="0.45" stopColor={C.royal} />
            <stop offset="1" stopColor={C.navy} />
          </linearGradient>
          <radialGradient id="plume" cx="0.85" cy="0.3" r="0.9">
            <stop offset="0" stopColor={C.heat} stopOpacity="0.95" />
            <stop offset="0.45" stopColor="#F28C5B" stopOpacity="0.55" />
            <stop offset="1" stopColor={C.heat} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="plumeCool" cx="0.85" cy="0.3" r="0.9">
            <stop offset="0" stopColor="#9CC2DB" stopOpacity="0.9" />
            <stop offset="1" stopColor={C.sky} stopOpacity="0" />
          </radialGradient>
          <clipPath id="hull">
            <path d="M330 262 H800 L862 230 C852 280 815 322 750 334 H362 C344 332 334 320 330 300 Z" />
          </clipPath>
          <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={C.amber} stopOpacity="0.8" />
            <stop offset="1" stopColor={C.amber} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* sky + shore */}
        <rect width="960" height="300" fill="url(#sky)" />
        <path d="M0 292 C120 270 220 284 320 276 C430 266 520 286 640 280 C760 274 860 284 960 276 V300 H0 Z" fill={C.mist} opacity="0.7" />

        {/* sea */}
        <rect y="300" width="960" height="260" fill="url(#sea)" />
        {[340, 390, 450].map((y, i) => (
          <path key={y} d={`M0 ${y} Q120 ${y - 6} 240 ${y} T480 ${y} T720 ${y} T960 ${y}`} stroke="#fff" strokeOpacity={0.06 + i * 0.01} fill="none" />
        ))}

        {/* plume */}
        <g style={{ transformOrigin: '336px 326px', transform: on ? 'scale(0.5)' : 'scale(1)' }} className={T}>
          <ellipse cx="190" cy="352" rx="190" ry="62" fill="url(#plume)" className={T} opacity={on ? 0 : 1} />
          <ellipse cx="190" cy="352" rx="190" ry="62" fill="url(#plumeCool)" className={T} opacity={on ? 1 : 0} />
        </g>

        {/* seabed + coral */}
        <path d="M0 520 C80 508 160 516 240 510 C330 503 420 516 520 512 C640 507 760 518 960 508 V560 H0 Z" fill="#0A1A44" />
        <Coral x={70} y={522} s={1.1} color="#F28C5B" on={on} />
        <Coral x={140} y={516} s={0.8} color={C.amber} on={on} />
        <Coral x={210} y={518} s={1.25} color="#F6A6B2" on={on} />
        <Coral x={290} y={512} s={0.75} color={C.amber} on={on} />
        <ellipse cx="250" cy="514" rx="18" ry="9" className={T} fill={on ? '#7FC4A8' : '#E9EEF2'} />
        <ellipse cx="108" cy="520" rx="14" ry="7" className={T} fill={on ? '#F5B82E' : '#E9EEF2'} />

        {/* boat */}
        <g>
          <path d="M330 262 H800 L862 230 C852 280 815 322 750 334 H362 C344 332 334 320 330 300 Z" fill="#fff" stroke={C.navy} strokeWidth="3" strokeLinejoin="round" />
          <g clipPath="url(#hull)">
            <rect x="320" y="286" width="560" height="10" fill={C.navy} />
            <rect x="320" y="296" width="560" height="60" fill={C.royal} opacity="0.18" />
          </g>
          {/* cabin + bridge */}
          <path d="M556 262 V202 H700 L744 262" fill="#fff" stroke={C.navy} strokeWidth="3" strokeLinejoin="round" />
          <path d="M540 202 H712" stroke={C.navy} strokeWidth="3" />
          {[560, 600, 640, 680].map((x) => (
            <line key={x} x1={x} x2={x} y1="202" y2="176" stroke={C.navy} strokeWidth="2" />
          ))}
          <path d="M548 176 H700" stroke={C.navy} strokeWidth="3" strokeLinecap="round" />
          <path d="M640 176 L604 96" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" />
          {[574, 614, 654].map((x) => (
            <g key={x}>
              <rect x={x} y="214" width="30" height="20" rx="3" fill={on ? C.amber : C.frost} stroke={C.navy} strokeWidth="2" className={T} />
            </g>
          ))}
          <circle cx="630" cy="224" r="70" fill="url(#glow)" className={T} opacity={on ? 0.55 : 0} />
          {/* railing */}
          <path d="M336 250 H540" stroke={C.navy} strokeWidth="2" />
          {[350, 390, 430, 470, 510].map((x) => (
            <line key={x} x1={x} x2={x} y1="250" y2="262" stroke={C.navy} strokeWidth="2" />
          ))}

          {/* cutaway engine room */}
          <rect x="398" y="268" width="226" height="58" rx="6" fill={C.frost} stroke={C.navy} strokeWidth="1.5" strokeDasharray="5 4" />
          <rect x="414" y="278" width="88" height="40" rx="5" fill={C.navy} />
          {[424, 444, 464, 484].map((x) => (
            <rect key={x} x={x} y="272" width="12" height="9" rx="2" fill={C.navy} />
          ))}
          <text x="458" y="303" textAnchor="middle" fontFamily="Poppins" fontSize="11" fontWeight="600" fill="#fff">
            ENGINE
          </text>

          {/* coolant to TVM */}
          <path d="M502 288 H540" stroke={C.heat} strokeWidth="5" strokeLinecap="round" />
          {/* TVM module */}
          <g>
            <rect x="540" y="274" width="42" height="46" rx="5" fill="#fff" stroke={C.navy} strokeWidth="2" />
            <rect x="540" y="274" width="42" height="7" rx="3" fill={C.heat} />
            <rect x="540" y="313" width="42" height="7" rx="3" fill={C.sky} />
            <path d="M564 284 L553 299 H561 L557 311 L570 294 H562 Z" fill={on ? C.amber : C.mist} className={T} />
          </g>
          {/* seawater intake */}
          <path d="M572 334 V320" stroke={C.sky} strokeWidth="5" strokeLinecap="round" />
          {/* discharge to transom */}
          <path d="M548 320 V328 H338" stroke={on ? C.sky : C.heat} strokeWidth="5" strokeLinecap="round" fill="none" className={T} />
          <path d="M548 320 V328 H338" stroke="#fff" strokeWidth="2" fill="none" className="flow" opacity="0.7" />

          {/* battery */}
          <rect x="594" y="284" width="22" height="30" rx="3" fill="#fff" stroke={C.navy} strokeWidth="2" />
          <rect x="601" y="280" width="8" height="5" rx="1" fill={C.navy} />
          <rect x="597" y={on ? 288 : 309} width="16" height={on ? 23 : 2} rx="2" fill={C.amber} className={T} />
          {/* power line */}
          <path d="M582 297 H594" stroke={C.amber} strokeWidth="3" opacity={on ? 1 : 0} className={T} />
          <path d="M605 280 V246 H614 V234" stroke={C.amber} strokeWidth="3" fill="none" opacity={on ? 1 : 0} className={`${T} flow`} />
        </g>

        {/* waterline sheen */}
        <path d="M0 300 Q120 294 240 300 T480 300 T720 300 T960 300" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" fill="none" />
      </svg>

      {/* state caption */}
      <div className="grid grid-cols-1 gap-px border-t border-mist bg-mist sm:grid-cols-3">
        {[
          ['Engine heat goes', on ? 'Through TVM first' : 'Straight overboard', on],
          ['Onboard power', on ? 'Charging, no fuel' : 'From the generator', on],
          ['Water at the stern', on ? 'Cooler, smaller plume' : 'Warm plume', on],
        ].map(([k, v, ok]) => (
          <div key={k} className="bg-white px-5 py-4">
            <p className="text-[13px] text-slate-muted">{k}</p>
            <p className={`font-display text-[17px] font-extrabold transition-colors duration-700 ${ok ? 'text-royal' : 'text-heat'}`}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
