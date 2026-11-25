import { ArrowRight } from 'lucide-react';
import { Link } from '../router';
import PageIntro from '../components/ui/PageIntro';
import Reveal from '../components/ui/Reveal';
import HowItWorks from '../components/HowItWorks';
import LabProof from '../components/LabProof';
import CompareFilter from '../components/CompareFilter';
import diagram from '../assets/install-diagram.webp';

export default function Technology() {
  return (
    <>
      <PageIntro
        kicker="Technology"
        title="A heat harvester on the cooling loop."
        lede="ThermoVolt Marine sits where hot engine coolant meets cool seawater and turns the temperature difference into electricity. No turbines, no pumps, no engine changes."
      />

      <section className="section">
        <div className="wrap">
          <Reveal className="mb-12 max-w-3xl">
            <p className="kicker">How it works</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)]">Capture. Convert. Control.</h2>
          </Reveal>
          <HowItWorks />
        </div>
      </section>

      <section className="bg-frost">
        <div className="wrap section grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]">
          <Reveal>
            <p className="kicker">Installation</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,46px)]">TVM Delta modules stack on the cooling-water return.</h2>
            <p className="mt-5 text-slate">
              Hot water leaving the heat exchanger passes the module stack on its way out. The electrical output runs through a power conditioning unit to the boat’s 24 V DC bus.
            </p>
            <ul className="mt-6 space-y-2 text-[15px]">
              {[
                ['#E4572E', 'Hot: cooling-water return'],
                ['#3B9EF1', 'Cold: cooling-water supply and chilled loop'],
                ['#F5B82E', 'Electrical output to the DC bus'],
              ].map(([c, l]) => (
                <li key={l} className="flex items-center gap-3">
                  <span className="h-2.5 w-8 rounded-full" style={{ background: c }} />
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <figure className="rounded-[28px] bg-white p-4 shadow-lift sm:p-8">
              <img src={diagram} alt="TVM Delta installation: three Delta modules on the cooling-water return line after the heat exchanger, a closed chilled-water loop, and electrical output to a power conditioning unit and 24 V DC power bus." className="h-auto w-full" />
              <figcaption className="mt-3 text-center text-[13px] text-slate-muted">TVM Delta installation diagram</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="mb-12 max-w-3xl">
            <p className="kicker">Proven in the lab</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)]">What we actually measured.</h2>
          </Reveal>
          <LabProof />
        </div>
      </section>

      <section className="bg-mist">
        <div className="wrap section">
          <Reveal className="mb-10 max-w-3xl">
            <p className="kicker">Compared</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)]">Built for the boats big systems ignore.</h2>
          </Reveal>
          <CompareFilter />
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-card bg-navy p-7 text-white">
            <p className="font-display text-xl font-extrabold">What would it save on your boat?</p>
            <Link to="impact" className="btn-amber">
              Open the calculator <ArrowRight size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
