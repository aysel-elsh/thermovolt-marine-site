import { useInView, useCountUp, fmt } from '../lib/hooks';
import { BENCH } from '../config/site';

const ROWS = [
  { label: 'Heat removed from the water', unit: 'W', ...BENCH.heatW, max: 700, d: 0, color: '#E4572E', note: 'Heat pulled out of the discharge, not electricity' },
  { label: 'Cooler discharge', unit: '°C', ...BENCH.dropC, max: 10, d: 2, color: '#3B9EF1', note: 'System on vs. off' },
  { label: 'Peak DC voltage', unit: 'V', ...BENCH.volts, max: 10, d: 2, color: '#F5B82E', note: 'Across a 0.47 F supercapacitor' },
];

function Row({ r, start, i }) {
  const v = useCountUp(r.mean, start, 1300 + i * 150);
  const pct = (x) => `${(x / r.max) * 100}%`;
  return (
    <div className="py-6 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="font-display text-[17px] font-bold text-navy">{r.label}</p>
        <p className="tnum font-display text-navy">
          <span className="text-[clamp(32px,4vw,44px)] font-extrabold leading-none">{fmt(v, r.d)}</span>
          <span className="ml-1 text-lg font-bold">{r.unit}</span>
          <span className="ml-2 text-[15px] font-semibold text-slate-muted">± {r.sd}</span>
        </p>
      </div>
      <div className="relative mt-3 h-3 rounded-full bg-mist-light" aria-hidden="true">
        <div
          className="absolute inset-y-0 rounded-full transition-all duration-[1300ms] ease-out"
          style={{ left: start ? pct(r.mean - r.sd) : pct(r.mean), width: start ? pct(2 * r.sd) : '0%', background: r.color, opacity: 0.35 }}
        />
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow transition-all duration-[1300ms] ease-out"
          style={{ left: start ? pct(r.mean) : '0%', background: r.color }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[12px] text-slate-muted">
        <span>0</span>
        <span>
          {r.max} {r.unit}
        </span>
      </div>
      <p className="mt-1 text-[13px] text-slate-muted">{r.note}</p>
    </div>
  );
}

export default function LabProof() {
  const [ref, seen] = useInView({ threshold: 0.3 });
  return (
    <div ref={ref} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div className="card p-6 md:p-9">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-royal px-3 py-1 font-display text-[12px] font-bold uppercase tracking-wider text-white">Measured</span>
          <span className="text-[15px] text-slate-muted">
            {BENCH.trials} paired trials · mean ± standard deviation · p &lt; 0.001 on every result
          </span>
        </div>
        <div className="divide-y divide-mist-light">
          {ROWS.map((r, i) => (
            <Row key={r.label} r={r} start={seen} i={i} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-card bg-navy p-6 text-white md:p-8">
          <p className="font-display text-[13px] font-bold uppercase tracking-wider text-amber">Electrical output</p>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            {[
              ['≈' + BENCH.currentMa, 'mA', 'avg current'],
              ['≈' + BENCH.powerMw, 'mW', 'avg power'],
              [BENCH.energyJ, 'J', 'per charge'],
            ].map(([v, u, l]) => (
              <div key={l}>
                <dd className="tnum font-display text-[clamp(22px,2.6vw,30px)] font-extrabold leading-none">
                  {v}
                  <span className="ml-0.5 text-sm">{u}</span>
                </dd>
                <dt className="mt-1 text-[13px] text-white/65">{l}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13px] text-white/60">0.47 F charged to 7.81 V, assuming a 2-minute charge.</p>
        </div>
        <div className="rounded-card bg-frost p-6 md:p-8">
          <p className="font-display text-[13px] font-bold uppercase tracking-wider text-royal">How it was tested</p>
          <ul className="mt-3 space-y-2.5 text-[15px]">
            {[
              '6 TEG modules in series on a copper loop carrying heated water, simulating raw-water discharge',
              'Schottky diode → 0.47 F supercapacitor → LED flasher as the proof-of-concept load',
              'Inlet and outlet temperature plus flow give heat removed (Q = ṁ·c·ΔT)',
              'System active vs. baseline (off), paired t-test on every result',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-royal" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-mist pt-4 text-[14px] text-slate-muted">
            <strong className="text-navy">Limits:</strong> lab bench only. Kilowatt-scale power on a vessel has not been tested yet; the Year-2 pilots will measure it.
          </p>
        </div>
      </div>
    </div>
  );
}
