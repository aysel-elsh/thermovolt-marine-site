import { useState } from 'react';
import { Flame, Zap, Cpu, Smartphone, BatteryCharging, ArrowRight } from 'lucide-react';
import RangeField from './ui/RangeField';

const C = { navy: '#0E2152', royal: '#1B45C4', sky: '#3B9EF1', amber: '#F5B82E', heat: '#E4572E', frost: '#F2F5F7', mist: '#BDCDD3' };

const STEPS = [
  {
    id: 'capture',
    n: 1,
    title: 'Capture',
    icon: Flame,
    body: 'Hot engine coolant runs on one side of each module and cool seawater on the other. Heat has to flow through the module to get from one to the other.',
  },
  {
    id: 'convert',
    n: 2,
    title: 'Convert',
    icon: Zap,
    body: 'The Seebeck effect: a temperature difference across the module pushes electrons through it, producing DC electricity, the same kind a boat battery stores. A bigger difference pushes harder.',
  },
  {
    id: 'control',
    n: 3,
    title: 'Control',
    icon: Cpu,
    body: 'Two boards run the system. Delta is the power board that steadies the voltage to charge the batteries. Oasis is the brain: it measures temperatures and power, balances making electricity against cooling the water, and reports savings to the owner’s phone.',
  },
];

// Legs: alternating N / P, linked in series by copper straps.
const LEGS = Array.from({ length: 8 }, (_, i) => ({ x: 96 + i * 56, type: i % 2 ? 'P' : 'N' }));
const TOP = 108;
const BOT = 262;
// Path the carriers follow: in at the left lead, up N, across, down P, across, ...
const CIRCUIT = (() => {
  let d = `M30 380 V${BOT + 14} H${LEGS[0].x + 18}`;
  LEGS.forEach((l, i) => {
    d += i % 2 === 0 ? ` V${TOP - 4}` : ` V${BOT + 14}`;
    if (i < LEGS.length - 1) d += ` H${LEGS[i + 1].x + 18}`;
  });
  d += ` H610 V380`;
  return d;
})();

function Module({ mode, dT }) {
  const showHeat = mode === 'capture';
  const showCarriers = mode === 'convert';
  const dur = dT <= 0 ? 0 : Math.max(1.6, 14 - dT * 0.2);
  const angle = -90 + Math.min(1, dT / 60) * 180;

  return (
    <svg viewBox="0 0 640 450" className="block h-auto w-full" role="img" aria-label="Cross-section of a thermoelectric module between hot coolant and cool seawater">
      {/* hot side */}
      <rect x="56" y="34" width="528" height="52" rx="10" fill={C.heat} />
      <text x="320" y="66" textAnchor="middle" fontFamily="Montserrat Variable, Montserrat" fontWeight="800" fontSize="16" fill="#fff">
        Hot engine coolant
      </text>
      <rect x="72" y="86" width="496" height="12" fill="#FBE1D8" />
      {/* cold side */}
      <rect x="72" y="276" width="496" height="12" fill="#DCEEFD" />
      <rect x="56" y="288" width="528" height="52" rx="10" fill={C.sky} />
      <text x="320" y="320" textAnchor="middle" fontFamily="Montserrat Variable, Montserrat" fontWeight="800" fontSize="16" fill="#fff">
        Cool seawater
      </text>

      {/* straps */}
      {LEGS.map((l, i) =>
        i % 2 === 0 ? <rect key={`t${i}`} x={l.x} y={TOP - 10} width={92} height="10" rx="2" fill="#C98A4B" /> : null,
      )}
      {LEGS.map((l, i) =>
        i % 2 === 1 && i < LEGS.length - 1 ? <rect key={`b${i}`} x={l.x} y={BOT + 8} width={92} height="10" rx="2" fill="#C98A4B" /> : null,
      )}
      <rect x="20" y={BOT + 8} width={LEGS[0].x + 36 - 20} height="10" rx="2" fill="#C98A4B" />
      <rect x={LEGS[7].x} y={BOT + 8} width={620 - LEGS[7].x} height="10" rx="2" fill="#C98A4B" />

      {/* legs */}
      {LEGS.map((l) => (
        <g key={l.x}>
          <rect x={l.x} y={TOP} width="36" height={BOT - TOP + 8} rx="4" fill={l.type === 'N' ? '#E3EAFB' : '#FDF1D3'} stroke={l.type === 'N' ? C.royal : '#D89A12'} strokeWidth="2" />
          <text x={l.x + 18} y={(TOP + BOT) / 2 + 6} textAnchor="middle" fontFamily="Montserrat Variable, Montserrat" fontWeight="800" fontSize="15" fill={l.type === 'N' ? C.royal : '#B07A00'}>
            {l.type}
          </text>
        </g>
      ))}

      {/* heat arrows */}
      <g opacity={showHeat ? 1 : 0} style={{ transition: 'opacity .5s' }}>
        {LEGS.slice(0, 7).map((l) => (
          <g key={l.x} transform={`translate(${l.x + 46} 118)`}>
            <path d="M0 0 C6 18 -6 36 0 54 C6 72 -6 90 0 108" stroke={C.heat} strokeWidth="3" fill="none" strokeLinecap="round" className="flow" />
            <path d="M-6 100 L0 114 L6 100" stroke={C.heat} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>

      {/* leads + load */}
      <path d="M30 276 V380 H260 M610 276 V380 H380" stroke={C.navy} strokeWidth="3" fill="none" />
      <g transform="translate(320 396)">
        <path d="M-58 0 A58 58 0 0 1 58 0" fill="none" stroke={C.mist} strokeWidth="10" strokeLinecap="round" />
        <path d="M-58 0 A58 58 0 0 1 58 0" fill="none" stroke={C.amber} strokeWidth="10" strokeLinecap="round" pathLength="100" strokeDasharray={`${(angle + 90) / 1.8} 100`} style={{ transition: 'stroke-dasharray .4s' }} />
        <line x1="0" y1="0" x2="0" y2="-46" stroke={C.navy} strokeWidth="4" strokeLinecap="round" style={{ transform: `rotate(${angle}deg)`, transition: 'transform .4s', transformOrigin: '0 0' }} />
        <circle r="7" fill={C.navy} />
        <text y="30" textAnchor="middle" fontFamily="Poppins" fontSize="13" fontWeight="600" fill={C.navy}>
          DC output
        </text>
      </g>

      {/* carriers */}
      {showCarriers && dur > 0 &&
        Array.from({ length: 14 }, (_, i) => (
          <circle key={`${dur}-${i}`} r="5" fill={C.navy}>
            <animateMotion dur={`${dur}s`} begin={`${(-i * dur) / 14}s`} repeatCount="indefinite" path={CIRCUIT} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
          </circle>
        ))}
    </svg>
  );
}

function ControlFlow() {
  const box = 'rounded-2xl bg-white p-5 shadow-lift';
  return (
    <div className="grid h-full grid-cols-1 content-center gap-4 p-5 sm:p-8">
      <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div className={box}>
          <Zap size={22} strokeWidth={1.5} className="text-amber" />
          <p className="mt-2 font-display font-extrabold text-navy">TVM modules</p>
          <p className="text-[14px] text-slate-muted">Raw DC from heat</p>
        </div>
        <ArrowRight className="mx-auto rotate-90 text-mist-deep sm:rotate-0" strokeWidth={1.5} />
        <div className={`${box} ring-2 ring-royal`}>
          <p className="tag text-royal">Delta</p>
          <p className="mt-1 font-display font-extrabold text-navy">Power board</p>
          <p className="text-[14px] text-slate-muted">Steadies voltage to charge batteries</p>
        </div>
        <ArrowRight className="mx-auto rotate-90 text-mist-deep sm:rotate-0" strokeWidth={1.5} />
        <div className={box}>
          <BatteryCharging size={22} strokeWidth={1.5} className="text-royal" />
          <p className="mt-2 font-display font-extrabold text-navy">Onboard DC bus</p>
          <p className="text-[14px] text-slate-muted">Batteries and loads</p>
        </div>
      </div>
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-navy p-5 text-white shadow-lift ring-2 ring-amber">
          <p className="tag text-amber">Oasis</p>
          <p className="mt-1 font-display font-extrabold">The brain</p>
          <ul className="mt-2 space-y-1 text-[14px] text-white/80">
            <li>Measures temperatures and power</li>
            <li>Balances electricity against cooling</li>
            <li>Reports savings to the owner</li>
          </ul>
        </div>
        <div className="mx-auto w-[150px] rounded-[26px] border-[5px] border-navy bg-frost p-3">
          <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-navy/20" />
          <div className="flex items-center gap-1.5">
            <Smartphone size={14} strokeWidth={1.5} className="text-navy" />
            <p className="font-display text-[11px] font-extrabold text-navy">Oasis app</p>
          </div>
          {['Fuel saved', 'Power made', 'Discharge temp'].map((l, i) => (
            <div key={l} className="mt-2 rounded-lg bg-white p-2">
              <p className="text-[10px] text-slate-muted">{l}</p>
              <div className="mt-1 h-1.5 rounded-full bg-mist-light">
                <div className="h-full rounded-full" style={{ width: `${[72, 54, 38][i]}%`, background: [C.royal, C.amber, C.sky][i] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [step, setStep] = useState('capture');
  const [dT, setDT] = useState(35);
  const cur = STEPS.find((s) => s.id === step);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-12">
      <div>
        <div role="tablist" aria-label="How it works" className="flex flex-col gap-3">
          {STEPS.map((s) => {
            const on = s.id === step;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={on}
                aria-controls="how-panel"
                onClick={() => setStep(s.id)}
                className={`group rounded-2xl border-2 p-5 text-left transition-all ${on ? 'border-royal bg-white shadow-lift' : 'border-transparent bg-frost hover:border-mist'}`}
              >
                <span className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-full font-display font-extrabold ${on ? 'bg-royal text-white' : 'bg-white text-navy'}`}>
                    {s.n}
                  </span>
                  <span className="font-display text-xl font-extrabold text-navy">{s.title}</span>
                  <Icon size={20} strokeWidth={1.5} className={`ml-auto ${on ? 'text-amber' : 'text-mist-deep'}`} />
                </span>
                {on && <span className="mt-3 block text-[16px] leading-relaxed text-slate">{s.body}</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-6 rounded-2xl bg-amber-soft px-5 py-4 font-display font-bold text-navy">Bolt-on. Nothing on the engine is modified.</p>
      </div>

      <div id="how-panel" role="tabpanel" aria-label={cur.title} className="overflow-hidden rounded-[28px] bg-frost">
        {step === 'control' ? (
          <ControlFlow />
        ) : (
          <div className="p-4 sm:p-6">
            <Module mode={step} dT={dT} />
            {step === 'convert' && (
              <div className="mx-auto mt-2 max-w-md px-2">
                <RangeField id="dt" label="Temperature difference" value={dT} min={0} max={60} step={1} color={C.heat} format={(v) => `${v} °C`} onChange={setDT} hint="Drag it: more difference, faster electrons, more output. Illustration, not to scale." />
              </div>
            )}
            {step === 'capture' && <p className="px-2 pb-2 text-center text-[14px] text-slate-muted">Heat flows from the hot side, through every leg, into the seawater.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
