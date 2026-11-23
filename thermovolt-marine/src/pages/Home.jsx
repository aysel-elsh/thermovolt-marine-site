import { ArrowRight, PiggyBank, Waves, ShieldCheck } from 'lucide-react';
import { Link } from '../router';
import { SITE } from '../config/site';
import HeroScene from '../components/HeroScene';
import Reveal from '../components/ui/Reveal';
import { useInView, useCountUp } from '../lib/hooks';
import stage from '../assets/stage.jpg';
import diagram from '../assets/install-diagram.webp';

function BigStat({ to, prefix = '', suffix, label, source, start }) {
  const v = useCountUp(to, start, 1400);
  return (
    <div className="border-t-2 border-navy pt-5">
      <p className="tnum font-display text-[clamp(56px,7.5vw,96px)] font-extrabold leading-none tracking-tight text-navy">
        {prefix}
        {Math.round(v)}
        <span className="text-royal">{suffix}</span>
      </p>
      <p className="mt-3 max-w-[30ch] text-lg text-slate">{label}</p>
      <p className="mt-2 text-[13px] text-slate-muted">{source}</p>
    </div>
  );
}

const WINS = [
  { icon: PiggyBank, title: 'Save', text: 'Fewer fuel and generator hours. The heat is already paid for.', to: 'impact', cta: 'Estimate your savings' },
  { icon: Waves, title: 'Protect', text: 'Cooler water leaves the stern, easing heat stress on reefs and seagrass.', to: 'technology', cta: 'See the lab results' },
  { icon: ShieldCheck, title: 'Comply', text: 'A greener boat without a new engine. TVM bolts onto the cooling loop you have.', to: 'technology', cta: 'How it installs' },
];

export default function Home() {
  const [statRef, statSeen] = useInView({ threshold: 0.3 });
  return (
    <>
      {/* Hero */}
      <section className="-mt-[72px] bg-mist pt-[72px]">
        <div className="wrap grid grid-cols-1 items-center gap-10 pb-16 pt-10 md:pb-24 md:pt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.3fr)] lg:gap-12">
          <div>
            <h1 className="text-[clamp(40px,4.3vw,58px)]">{SITE.tagline}</h1>
            <p className="mt-5 font-display text-[clamp(20px,2.2vw,26px)] font-semibold text-royal">{SITE.subline}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="technology" className="btn-primary">
                See how it works <ArrowRight size={18} strokeWidth={1.5} />
              </Link>
              <Link to="impact" className="btn-outline bg-white/60">
                Calculate your savings
              </Link>
            </div>
          </div>
          <HeroScene />
        </div>
      </section>

      {/* Problem */}
      <section className="section">
        <div className="wrap">
          <Reveal className="max-w-3xl">
            <p className="kicker">The problem</p>
            <h2 className="mt-4 text-[clamp(34px,4.6vw,56px)]">Boats pay for fuel twice.</h2>
            <p className="lede mt-5">They burn extra fuel to make power onboard while dumping engine heat into the sea.</p>
          </Reveal>
          <div ref={statRef} className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
            <BigStat start={statSeen} prefix="~" to={50} suffix="%" label="of a marine engine’s fuel energy is lost as heat." source="Heinen & Hopman, 2021" />
            <BigStat start={statSeen} to={5} prefix="4–" suffix=" °C" label="above normal killed nearly all corals near a heated-water outfall." source="Jokiel & Coles, 1974, Pacific Science (Kahe Point, Oahu)" />
          </div>
        </div>
      </section>

      {/* Why unsolved */}
      <section className="bg-navy text-white">
        <div className="wrap section">
          <Reveal>
            <p className="kicker text-amber">Why it’s still unsolved</p>
            <h2 className="mt-4 max-w-3xl text-[clamp(32px,4.2vw,52px)] text-white">Heat recovery exists. Just not for boats this size.</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              ['Root cause', 'Warm water is free to dump, so nobody measures it.'],
              ['Market gap', 'Today’s heat recovery is built for giant ships, with turbines and pumps to maintain.'],
              ['Why now', '$5 diesel, 2030 and 2050 emissions targets, and heat-stressed reefs.'],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 90} className="rounded-card bg-white/[0.06] p-7 ring-1 ring-white/10">
                <p className="font-display text-sm font-bold uppercase tracking-wider text-amber">{t}</p>
                <p className="mt-3 font-display text-[22px] font-bold leading-snug">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Value */}
      <section className="section">
        <div className="wrap">
          <Reveal className="max-w-3xl">
            <p className="kicker">Free power from heat you already pay for</p>
            <h2 className="mt-4 text-[clamp(32px,4.2vw,52px)]">One bolt-on module. Three wins.</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {WINS.map((w, i) => {
              const Icon = w.icon;
              return (
                <Reveal key={w.title} delay={i * 90}>
                  <Link to={w.to} className="group flex h-full flex-col rounded-card bg-frost p-7 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lift">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber text-navy">
                      <Icon size={26} strokeWidth={1.5} />
                    </span>
                    <span className="mt-6 font-display text-3xl font-extrabold text-navy">{w.title}</span>
                    <span className="mt-3 flex-1 text-[16px] leading-relaxed text-slate">{w.text}</span>
                    <span className="mt-6 inline-flex items-center gap-2 font-display font-bold text-royal">
                      {w.cta} <ArrowRight size={17} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explore */}
      <section className="bg-frost">
        <div className="wrap section grid grid-cols-1 gap-5 md:grid-cols-2">
          <Reveal>
            <Link to="business" className="group relative flex h-full min-h-[340px] flex-col justify-end overflow-hidden rounded-[28px] bg-white p-8 shadow-lift">
              <img src={diagram} alt="" aria-hidden="true" className="absolute inset-x-6 top-6 h-[52%] w-[calc(100%-3rem)] object-contain opacity-60 transition-opacity group-hover:opacity-90" />
              <span className="relative kicker">Business</span>
              <span className="relative mt-2 font-display text-[32px] font-extrabold leading-tight text-navy">Working boats first. Here’s the plan.</span>
              <span className="relative mt-4 inline-flex items-center gap-2 font-display font-bold text-royal">
                Market, pricing and roadmap <ArrowRight size={17} strokeWidth={1.5} />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={90}>
            <Link to="about" className="group relative flex h-full min-h-[340px] flex-col justify-end overflow-hidden rounded-[28px] p-8 text-white shadow-lift">
              <img src={stage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-[50%_20%] transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
              <span className="relative font-display text-[13px] font-bold uppercase tracking-[0.16em] text-amber">About</span>
              <span className="relative mt-2 font-display text-[32px] font-extrabold leading-tight">Designed by a student engineer. Backed by judges and an accelerator.</span>
              <span className="relative mt-4 inline-flex items-center gap-2 font-display font-bold">
                Meet the founder <ArrowRight size={17} strokeWidth={1.5} />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
