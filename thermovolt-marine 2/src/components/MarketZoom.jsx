import { useState } from 'react';
import { ZoomIn, RotateCcw } from 'lucide-react';
import { fmt } from '../lib/hooks';

const STAGES = [
  { key: 'all', tag: 'All boats', value: 1030000, label: 'Florida registered boats', note: 'Mostly recreational, ~150 engine hours a year. Not our first target.', money: null },
  { key: 'com', tag: 'Commercial', value: 25700, label: 'Commercial vessels', note: 'Registered for commercial use in Florida.', money: null },
  { key: 'sam', tag: 'SAM', value: 6650, label: 'Working boats 26 ft and over', note: 'Our addressable market at a ~$5.5K average kit.', money: '≈$37M' },
  { key: 'som', tag: 'SOM', value: 420, label: 'Kits per year by Year 5', note: '~6% of the working fleet each year.', money: '≈$2.5M / yr' },
];

export default function MarketZoom() {
  const [i, setI] = useState(0);
  const s = STAGES[i];
  const prev = STAGES[i - 1];
  const share = prev ? s.value / prev.value : 1;
  const filled = share * 100;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
      <div className="rounded-[28px] bg-navy p-6 sm:p-8">
        <div className="grid grid-cols-10 gap-1.5" role="img" aria-label={prev ? `${s.label} are ${fmt(filled, 1)}% of ${prev.label.toLowerCase()}` : s.label}>
          {Array.from({ length: 100 }, (_, k) => {
            const part = Math.max(0, Math.min(1, filled - k));
            return (
              <div key={`${i}-${k}`} className="relative aspect-square overflow-hidden rounded-[4px] bg-white/10">
                <div
                  className="absolute inset-y-0 left-0 bg-amber"
                  style={{ width: `${part * 100}%`, transition: `width .35s ${k * 6}ms ease-out` }}
                />
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[14px] text-white/70">
          {prev ? (
            <>
              Grid = {prev.label.toLowerCase()} ({fmt(prev.value)}). Lit = <strong className="text-amber">{fmt(filled, filled < 10 ? 1 : 0)}%</strong>.
            </>
          ) : (
            'Every registered boat in Florida.'
          )}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Market level">
          {STAGES.map((x, k) => (
            <button key={x.key} role="tab" aria-selected={k === i} onClick={() => setI(k)} className={k === i ? 'chip-on' : 'chip-off'}>
              {x.tag}
            </button>
          ))}
        </div>
        <p className="tnum mt-8 font-display text-[clamp(52px,8vw,88px)] font-extrabold leading-none tracking-tight text-navy" aria-live="polite">
          {s.value >= 1e6 ? `${(s.value / 1e6).toFixed(2)}M` : fmt(s.value)}
        </p>
        <p className="mt-2 font-display text-xl font-extrabold text-royal">{s.label}</p>
        <p className="mt-3 max-w-[44ch] text-slate">{s.note}</p>
        {s.money && <p className="mt-3 inline-block rounded-full bg-amber-soft px-4 py-1.5 font-display font-bold text-navy">{s.money}</p>}
        <div className="mt-8">
          {i < STAGES.length - 1 ? (
            <button type="button" onClick={() => setI(i + 1)} className="btn-primary">
              <ZoomIn size={18} strokeWidth={1.5} /> Zoom in
            </button>
          ) : (
            <button type="button" onClick={() => setI(0)} className="btn-outline">
              <RotateCcw size={18} strokeWidth={1.5} /> Start over
            </button>
          )}
        </div>
        <p className="mt-6 text-[13px] text-slate-muted">Sources: FLHSMV 2024 vessel statistics (26 ft+ commercial: 4,933 + 1,433 + 290) · FWC 2024.</p>
      </div>
    </div>
  );
}
