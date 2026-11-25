import { useMemo, useState } from 'react';
import { Fuel, Leaf, Zap, Gauge } from 'lucide-react';
import RangeField from './ui/RangeField';
import { project, VESSELS, MODEL } from '../lib/savings';
import { useTween, fmt } from '../lib/hooks';

function Cascade({ r }) {
  const rows = [
    { label: 'Fuel energy burned', kw: r.fuelKw, share: 1, of: '', color: '#0E2152' },
    { label: 'Lost to cooling water', kw: r.coolingKw, share: MODEL.coolingShare, of: 'of fuel energy', color: '#E4572E' },
    { label: 'Flows through TVM', kw: r.throughKw, share: MODEL.flowThrough, of: 'of the cooling flow', color: '#3B9EF1' },
    { label: 'Turned into electricity', kw: r.powerKw, share: MODEL.conversion, of: 'of that heat', color: '#F5B82E' },
  ];
  return (
    <div className="rounded-card bg-frost p-6 md:p-8">
      <p className="font-display text-lg font-extrabold text-navy">Where the fuel goes</p>
      <p className="text-[14px] text-slate-muted">Each bar is a share of the one above it.</p>
      <ol className="mt-5 space-y-4">
        {rows.map((row, i) => (
          <li key={row.label}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-[15px]">
              <span className="font-semibold text-navy">
                {row.label}
                {i > 0 && (
                  <span className="ml-2 font-normal text-slate-muted">
                    {fmt(row.share * 100, row.share < 0.1 ? 1 : 0)}% {row.of}
                  </span>
                )}
              </span>
              <span className="tnum font-display font-extrabold text-navy">{fmt(row.kw, row.kw < 10 ? 2 : 0)} kW</span>
            </div>
            <div className="mt-1.5 h-3.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(2.5, row.share * 100)}%`, background: row.color }} />
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-[13px] text-slate-muted">
        Model assumes {MODEL.efficiency * 100}% engine efficiency, {MODEL.co2KgPerGal} kg CO₂ per gallon (EPA) and ≈0.11 gal of generator diesel per kWh.
      </p>
    </div>
  );
}

function Stat({ icon: Icon, label, value, unit, big }) {
  return (
    <div className={big ? 'col-span-2' : ''}>
      <p className="flex items-center gap-2 text-[14px] text-white/70">
        <Icon size={16} strokeWidth={1.5} className="text-amber" />
        {label}
      </p>
      <p className={`tnum mt-1 font-display font-extrabold leading-none ${big ? 'text-[clamp(48px,7vw,76px)] text-amber' : 'text-[clamp(26px,3vw,34px)]'}`}>
        {value}
        {unit && <span className={`ml-1 ${big ? 'text-2xl' : 'text-base'} font-bold text-white/80`}>{unit}</span>}
      </p>
    </div>
  );
}

export default function SavingsCalculator() {
  const [kw, setKw] = useState(370);
  const [hours, setHours] = useState(1000);
  const [price, setPrice] = useState(4.5);
  const r = useMemo(() => project({ kw, hours, price }), [kw, hours, price]);
  const preset = VESSELS.find((v) => v.kw === kw && v.hours === hours)?.id;

  const dollars = useTween(r.dollars);
  const gal = useTween(r.gal);
  const co2 = useTween(r.co2t);
  const kwh = useTween(r.kwh);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="card p-6 md:p-8">
          <p className="font-display font-bold text-navy">Start from a boat</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {VESSELS.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={preset === v.id}
                onClick={() => {
                  setKw(v.kw);
                  setHours(v.hours);
                }}
                className={preset === v.id ? 'chip-on' : 'chip-off'}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="mt-8 space-y-7">
            <RangeField id="kw" label="Engine power" value={kw} min={50} max={1200} step={10} format={(v) => `${fmt(v)} kW`} onChange={setKw} hint={`≈ ${fmt(kw * 1.341)} hp`} />
            <RangeField id="hrs" label="Engine hours per year" value={hours} min={50} max={4000} step={50} format={(v) => fmt(v)} onChange={setHours} hint="Weekend boats ~150 · charter ~1,000 · workboats 3,000+" />
            <RangeField id="price" label="Diesel price" value={price} min={3} max={6.5} step={0.05} format={(v) => `$${v.toFixed(2)}/gal`} color="#E4572E" onChange={setPrice} hint="The deck’s base case uses $4.50/gal" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-card bg-navy p-6 text-white md:p-8">
          <span className="absolute right-5 top-5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-white/80">Projected</span>
          <div className="grid grid-cols-2 gap-x-6 gap-y-7">
            <Stat icon={Gauge} label="Fuel cost saved per year" value={`$${fmt(dollars >= 100 ? Math.round(dollars / 10) * 10 : dollars)}`} big />
            <Stat icon={Fuel} label="Diesel saved" value={fmt(gal)} unit="gal/yr" />
            <Stat icon={Leaf} label="CO₂ avoided" value={fmt(co2, co2 < 1 ? 2 : 1)} unit="t/yr" />
            <Stat icon={Zap} label="Recovered power" value={fmt(r.powerKw, 2)} unit="kW" />
            <Stat icon={Zap} label="Electricity per year" value={fmt(kwh)} unit="kWh" />
          </div>
          <p className="mt-8 border-t border-white/15 pt-4 text-[14px] text-white/70">
            More engine hours, more savings. That’s why TVM starts with working boats.
          </p>
        </div>
      </div>
      <Cascade r={r} />
    </div>
  );
}
