import { useState } from 'react';

const YEARS = [
  { y: 'Y1', year: 2027, title: 'Build + protect', kits: 0, unit: 'kits', body: 'Finish the production prototype, protect the design and run independent tests.' },
  { y: 'Y2', year: 2028, title: 'Paid pilots', kits: 6, unit: 'pilots', body: 'Six paid pilots on working boats replace the projections with measured, on-the-water numbers.' },
  { y: 'Y3', year: 2029, title: 'Launch', kits: 60, unit: 'kits', body: 'Commercial launch through partner marine mechanics. Projected break-even year.' },
  { y: 'Y4', year: 2030, title: 'Scale Florida', kits: 180, unit: 'kits', body: 'Grow across South Florida’s charter, dive, ferry and towing fleets.' },
  { y: 'Y5', year: 2031, title: 'Expand + OEM', kits: 420, unit: 'kits', body: 'Expand beyond Florida and license TVM to boat and engine builders for a ~4% royalty.' },
];
const MAX = 420;

export default function Roadmap() {
  const [sel, setSel] = useState(1);
  const s = YEARS[sel];
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
      <div className="flex h-[300px] items-end gap-2 sm:gap-4" role="tablist" aria-label="Roadmap year">
        {YEARS.map((x, i) => {
          const on = i === sel;
          const h = x.kits === 0 ? 4 : Math.max(10, (x.kits / MAX) * 100);
          return (
            <button key={x.y} role="tab" aria-selected={on} onClick={() => setSel(i)} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className={`tnum font-display text-[15px] font-extrabold ${on ? 'text-royal' : 'text-navy/60'}`}>{x.kits}</span>
              <span
                className={`w-full rounded-t-xl transition-all duration-500 ${on ? 'bg-royal' : 'bg-mist group-hover:bg-mist-deep'}`}
                style={{ height: `${h}%` }}
              />
              <span className={`font-display text-sm font-extrabold ${on ? 'text-navy' : 'text-navy/60'}`}>{x.year}</span>
            </button>
          );
        })}
      </div>
      <div className="card p-6 md:p-8" aria-live="polite">
        <p className="kicker">
          {s.y} · {s.year}
        </p>
        <p className="mt-2 font-display text-3xl font-extrabold text-navy">{s.title}</p>
        <p className="tnum mt-1 font-display text-lg font-bold text-royal">
          {s.kits} {s.unit}
        </p>
        <p className="mt-4 text-slate">{s.body}</p>
        <p className="mt-6 text-[13px] text-slate-muted">Base-case projection.</p>
      </div>
    </div>
  );
}
