import { useState } from 'react';
import RangeField from './ui/RangeField';
import { FLEET, MODEL } from '../lib/savings';
import { useTween, fmt } from '../lib/hooks';

const DOTS = 100;
const PRICE = 4.5;

function Boat({ on }) {
  return (
    <svg viewBox="0 0 24 16" className="h-auto w-full" aria-hidden="true">
      <path d="M2 9 H20 L23 6 C22 11 19 14 15 14 H5 C3.5 14 2.4 12 2 9 Z" fill={on ? '#1B45C4' : '#D6E2EA'} style={{ transition: 'fill .3s' }} />
      <path d="M9 9 V4 H15 L17 9" fill={on ? '#F5B82E' : '#E8EEF2'} style={{ transition: 'fill .3s' }} />
    </svg>
  );
}

export default function FleetImpact() {
  const [boats, setBoats] = useState(FLEET.defaultBoats);
  const gal = boats * FLEET.galPerBoat;
  const tGal = useTween(gal);
  const tUsd = useTween(gal * PRICE);
  const tCo2 = useTween((gal * MODEL.co2KgPerGal) / 1000);
  const lit = Math.round((boats / FLEET.sam) * DOTS);
  const pct = (boats / FLEET.sam) * 100;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
      <div>
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2" role="img" aria-label={`${boats} of ${FLEET.sam} working boats running TVM`}>
          {Array.from({ length: DOTS }, (_, i) => (
            <Boat key={i} on={i < lit} />
          ))}
        </div>
        <p className="mt-3 text-[13px] text-slate-muted">Each boat = {Math.round(FLEET.sam / DOTS)} of Florida’s ≈{fmt(FLEET.sam)} working boats 26 ft and over.</p>
      </div>
      <div>
        <RangeField id="fleet" label="Boats running TVM" value={boats} min={0} max={FLEET.sam} step={5} format={(v) => `${fmt(v)} · ${fmt((v / FLEET.sam) * 100, 0)}%`} onChange={setBoats} />
        <div className="mt-2 flex flex-wrap gap-2">
          {[0.01, 0.1, 0.25].map((p) => (
            <button key={p} type="button" onClick={() => setBoats(Math.round(FLEET.sam * p))} className={Math.abs(pct - p * 100) < 0.1 ? 'chip-on' : 'chip-off'}>
              {p * 100}% of the fleet
            </button>
          ))}
        </div>
        <dl className="mt-8 grid grid-cols-3 gap-4">
          {[
            [fmt(tGal / 1000, 0) + 'K', 'gal diesel saved / yr'],
            ['$' + fmt(tUsd / 1000, 0) + 'K', 'fuel cost saved / yr'],
            [fmt(Math.round(tCo2 / 10) * 10), 't CO₂ avoided / yr'],
          ].map(([v, l]) => (
            <div key={l} className="rounded-2xl bg-white p-4 shadow-lift">
              <dd className="tnum font-display text-[clamp(22px,2.8vw,32px)] font-extrabold leading-none text-royal">{v}</dd>
              <dt className="mt-2 text-[13px] leading-snug text-slate-muted">{l}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13px] text-slate-muted">
          Projected. Uses charter-boat savings ({FLEET.galPerBoat} gal per boat per year) at ${PRICE.toFixed(2)}/gal.
        </p>
      </div>
    </div>
  );
}
