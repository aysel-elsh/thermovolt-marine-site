import { useState } from 'react';
import { Check } from 'lucide-react';
import RangeField from './ui/RangeField';
import { useTween, fmt } from '../lib/hooks';

const KITS = [
  { id: 'delta', name: 'TVM Delta Kit', for: 'Charter boats', price: 3900 },
  { id: 'pro', name: 'TVM Delta Pro', for: 'Workboats + ferries', price: 7900 },
];
const ADDONS = [
  { id: 'oasis', name: 'Oasis Monitoring', detail: '$15/mo per vessel · fleet tier $29/mo', yearly: 15 * 12 },
  { id: 'care', name: 'Care Plan', detail: 'Inspection + module swap · $299/yr', yearly: 299 },
];

export default function PackageBuilder() {
  const [kit, setKit] = useState('delta');
  const [boats, setBoats] = useState(2);
  const [add, setAdd] = useState(new Set(['oasis']));
  const k = KITS.find((x) => x.id === kit);
  const upfront = useTween(k.price * boats);
  const yearly = useTween(ADDONS.filter((a) => add.has(a.id)).reduce((s, a) => s + a.yearly, 0) * boats);

  const toggle = (id) => {
    const n = new Set(add);
    n.has(id) ? n.delete(id) : n.add(id);
    setAdd(n);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Kit">
          {KITS.map((x) => {
            const on = kit === x.id;
            return (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setKit(x.id)}
                className={`relative rounded-card border-2 p-6 text-left transition-all ${on ? 'border-royal bg-white shadow-lift' : 'border-mist-light bg-white hover:border-mist'}`}
              >
                {on && (
                  <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-royal text-white">
                    <Check size={16} strokeWidth={2.5} />
                  </span>
                )}
                <p className="text-[14px] font-semibold text-royal">{x.for}</p>
                <p className="mt-1 font-display text-xl font-extrabold text-navy">{x.name}</p>
                <p className="tnum mt-4 font-display text-4xl font-extrabold text-navy">
                  ${fmt(x.price)}
                  <span className="ml-1 text-base font-bold text-slate-muted">installed</span>
                </p>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ADDONS.map((a) => {
            const on = add.has(a.id);
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(a.id)}
                className={`flex items-start gap-4 rounded-card border-2 p-5 text-left transition-all ${on ? 'border-amber bg-amber-soft' : 'border-mist-light bg-white hover:border-mist'}`}
              >
                <span className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 ${on ? 'border-navy bg-navy text-white' : 'border-mist-deep'}`}>
                  {on && <Check size={14} strokeWidth={3} />}
                </span>
                <span>
                  <span className="block font-display font-extrabold text-navy">{a.name}</span>
                  <span className="block text-[14px] text-slate-muted">{a.detail}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="card p-6">
          <RangeField id="boats" label="Boats in your fleet" value={boats} min={1} max={15} step={1} format={(v) => `${v}`} onChange={setBoats} />
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-card bg-mist p-6 md:p-8">
        <div>
          <p className="font-display text-lg font-extrabold text-navy">Your package</p>
          <p className="text-[15px] text-slate">
            {boats} × {k.name}
            {add.size > 0 && ` + ${[...add].map((id) => ADDONS.find((a) => a.id === id).name).join(' + ')}`}
          </p>
          <dl className="mt-8 space-y-6">
            <div>
              <dt className="text-[14px] text-slate">Upfront, installed</dt>
              <dd className="tnum font-display text-[clamp(40px,5vw,56px)] font-extrabold leading-none text-navy">${fmt(upfront)}</dd>
            </div>
            <div>
              <dt className="text-[14px] text-slate">Per year after</dt>
              <dd className="tnum font-display text-[clamp(28px,3.4vw,38px)] font-extrabold leading-none text-royal">${fmt(yearly)}</dd>
            </div>
          </dl>
        </div>
        <p className="mt-8 text-[13px] text-slate">Installed by partner marine mechanics. Target pricing; pilots will confirm final costs.</p>
      </div>
    </div>
  );
}
