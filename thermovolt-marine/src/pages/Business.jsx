import { ArrowRight, Anchor, Factory, Wrench, Smartphone, Hammer } from 'lucide-react';
import { Link } from '../router';
import PageIntro from '../components/ui/PageIntro';
import Reveal from '../components/ui/Reveal';
import MarketZoom from '../components/MarketZoom';
import PackageBuilder from '../components/PackageBuilder';
import Roadmap from '../components/Roadmap';

const DEMAND = [
  ['~$180/yr', 'Boaters already pay this for remote monitoring', 'Panbo'],
  ['Big ships', 'Already buy heat recovery, at 15 MW+ scale', 'Marine Log 2022'],
  ['$4.60–$5.60', 'Diesel per gallon in 2026', 'EIA 2026'],
  ['$0.96B → $1.72B', 'Thermoelectric generator market by 2032', 'SNS Insider 2025'],
];

export default function Business() {
  return (
    <>
      <PageIntro
        kicker="Business"
        title="Working boats first."
        lede="Engine hours equal savings. Boats that run 1,000 to 3,000+ hours a year pay back fastest and give us the best data, so that’s where TVM starts."
      />

      <section className="section">
        <div className="wrap">
          <Reveal className="mb-12 max-w-3xl">
            <p className="kicker">Market</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)]">From every Florida boat to our first customers.</h2>
          </Reveal>
          <MarketZoom />
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEMAND.map(([v, l, s], i) => (
              <Reveal key={l} delay={i * 70} className="rounded-card bg-frost p-6">
                <p className="font-display text-2xl font-extrabold text-navy">{v}</p>
                <p className="mt-2 text-[15px] text-slate">{l}</p>
                <p className="mt-3 text-[12px] text-slate-muted">{s}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist">
        <div className="wrap section">
          <Reveal className="mb-12 max-w-3xl">
            <p className="kicker">Customers</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)]">Who buys first, and why.</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
            <Reveal className="card p-7 md:p-9">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-royal text-white">
                <Anchor size={24} strokeWidth={1.5} />
              </span>
              <p className="kicker mt-5">Primary</p>
              <h3 className="mt-2 text-[28px]">South Florida working-boat operators</h3>
              <p className="mt-2 text-slate">Charter · dive · water taxi · ferry · tow · research</p>
              <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {[
                  ['Who', 'Owner-operators, 35–65, running 1 to 15 diesel boats'],
                  ['Behavior', '1,000–3,000+ engine hours a year'],
                  ['Needs', 'Lower fuel and generator costs'],
                  ['Buys through', 'Mechanics they trust; cares about payback and warranties'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-display text-[13px] font-bold uppercase tracking-wider text-royal">{k}</dt>
                    <dd className="mt-1 text-[15px] text-slate">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <div className="grid grid-cols-1 gap-5">
              <Reveal delay={80} className="card p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber text-navy">
                  <Factory size={24} strokeWidth={1.5} />
                </span>
                <p className="kicker mt-5">Secondary</p>
                <h3 className="mt-2 text-2xl">Boat & engine builders</h3>
                <p className="mt-2 text-[15px] text-slate">License TVM into new boats. No retrofit needed.</p>
              </Reveal>
              <Reveal delay={160} className="rounded-card bg-navy p-7 text-white">
                <p className="font-display text-[13px] font-bold uppercase tracking-wider text-amber">Persona · composite, not a real interview</p>
                <p className="mt-2 font-display text-2xl font-extrabold">Capt. Mike Reyes, 47</p>
                <p className="mt-1 text-[15px] text-white/75">Two 38-ft charter boats at Boynton Beach Inlet, ~1,000 engine hours a year each.</p>
                <p className="mt-4 text-[15px] text-white/85">
                  <strong className="text-white">Says yes to:</strong> a bolt-on install, done by his own mechanic, with savings he can see in an app.
                </p>
                <Link to="impact" className="mt-5 inline-flex items-center gap-2 font-display font-bold text-amber">
                  Run his numbers <ArrowRight size={17} strokeWidth={1.5} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="mb-12 max-w-3xl">
            <p className="kicker">Products & pricing</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)]">Build a package.</h2>
            <p className="lede mt-5">A kit for each class of boat, plus the app and a care plan.</p>
          </Reveal>
          <PackageBuilder />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              [Wrench, 'Partner installs', 'Marine mechanics the owner already trusts do the work.'],
              [Smartphone, 'Recurring software', 'Oasis keeps paying after the kit is sold.'],
              [Hammer, 'OEM licensing', 'From Year 5, boat and engine builders license the design.'],
            ].map(([Icon, t, d]) => (
              <div key={t} className="flex gap-4 rounded-card bg-frost p-6">
                <Icon size={24} strokeWidth={1.5} className="flex-none text-royal" />
                <div>
                  <p className="font-display font-extrabold text-navy">{t}</p>
                  <p className="mt-1 text-[15px] text-slate">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-frost">
        <div className="wrap section">
          <Reveal className="mb-12 max-w-3xl">
            <p className="kicker">Roadmap</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)]">From prototype to fleet. Tap a year.</h2>
          </Reveal>
          <Roadmap />
        </div>
      </section>
    </>
  );
}
