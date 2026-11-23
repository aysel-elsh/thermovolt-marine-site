import { useState } from 'react';
import { Check, X, Minus } from 'lucide-react';

// From the deck's competition slide. 1 = yes, 0 = no, 0.5 = partly.
const OPTIONS = [
  { id: 'tvm', name: 'ThermoVolt Marine', sub: 'TVM' },
  { id: 'solar', name: 'Solar panels', sub: 'Onboard' },
  { id: 'orc', name: 'Big-ship heat turbines', sub: 'e.g. Climeon' },
  { id: 'teg', name: 'Big-ship thermoelectric', sub: 'e.g. TEGma' },
  { id: 'none', name: 'Do nothing', sub: 'Status quo' },
];
const CRITERIA = [
  { id: 'heat', label: 'Makes electricity from engine heat', v: [1, 0, 1, 1, 0] },
  { id: 'parts', label: 'No moving parts to break', v: [1, 1, 0, 1, 0] },
  { id: 'small', label: 'Fits small & mid-size boats', v: [1, 1, 0, 0, 1] },
  { id: 'night', label: 'Works at night & in bad weather', v: [1, 0, 1, 1, 0] },
  { id: 'cool', label: 'Sends cooler water back to the sea', v: [1, 0, 0.5, 0, 0] },
];

const Mark = ({ v }) =>
  v === 1 ? (
    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-royal text-white"><Check size={18} strokeWidth={2.5} aria-label="Yes" /></span>
  ) : v === 0.5 ? (
    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-amber-soft text-navy"><Minus size={18} strokeWidth={2.5} aria-label="Partly" /></span>
  ) : (
    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-frost text-mist-deep"><X size={18} strokeWidth={2.5} aria-label="No" /></span>
  );

export default function CompareFilter() {
  const [need, setNeed] = useState(new Set(['heat', 'small']));
  const toggle = (id) => {
    const n = new Set(need);
    n.has(id) ? n.delete(id) : n.add(id);
    setNeed(n);
  };
  const passes = OPTIONS.map((_, oi) => CRITERIA.filter((c) => need.has(c.id)).every((c) => c.v[oi] === 1));
  const survivors = OPTIONS.filter((_, i) => passes[i]);

  return (
    <div>
      <p className="font-display font-bold text-navy">What does your boat need? Tap to filter.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {CRITERIA.map((c) => (
          <button key={c.id} type="button" aria-pressed={need.has(c.id)} onClick={() => toggle(c.id)} className={need.has(c.id) ? 'chip-on' : 'chip-off'}>
            {need.has(c.id) && <Check size={16} strokeWidth={2.5} />}
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-5 text-[15px] text-slate-muted" aria-live="polite">
        {need.size === 0
          ? 'Pick at least one need.'
          : survivors.length === 1
            ? 'Only ThermoVolt Marine meets every need you picked.'
            : `${survivors.length} options meet every need you picked: ${survivors.map((s) => s.name).join(', ')}.`}
      </p>

      <div className="mt-6 overflow-x-auto rounded-card bg-white shadow-lift">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr>
              <th className="w-[30%] p-4" />
              {OPTIONS.map((o, i) => (
                <th key={o.id} className={`p-4 text-center align-bottom transition-opacity duration-300 ${passes[i] ? '' : 'opacity-35'} ${i === 0 ? 'rounded-t-2xl bg-navy text-white' : ''}`}>
                  <span className={`block font-display text-[15px] font-extrabold leading-tight ${i === 0 ? 'text-white' : 'text-navy'}`}>{o.name}</span>
                  <span className={`mt-0.5 block text-[12px] font-normal ${i === 0 ? 'text-amber' : 'text-slate-muted'}`}>{o.sub}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map((c) => (
              <tr key={c.id} className={`border-t border-frost transition-colors ${need.has(c.id) ? 'bg-royal-soft/50' : ''}`}>
                <th scope="row" className="p-4 text-[15px] font-semibold text-navy">{c.label}</th>
                {c.v.map((v, i) => (
                  <td key={i} className={`p-3 text-center transition-opacity duration-300 ${passes[i] ? '' : 'opacity-35'} ${i === 0 ? 'bg-navy/[0.04]' : ''}`}>
                    <Mark v={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-slate-muted">
        Sources: Climeon HeatPower 300 is built for 15 MW+ engines (Marine Log 2022) · IMO GreenVoyage2050: ~10 MW practical floor for ORC · TEGma: DNV GL approval for ships (2018).
      </p>
    </div>
  );
}
