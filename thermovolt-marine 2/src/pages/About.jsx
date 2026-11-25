import { ArrowUpRight, ArrowRight, Award, Trophy, Medal, Rocket, FileText, Newspaper, Droplets, Briefcase } from 'lucide-react';
import { Link } from '../router';
import { SITE } from '../config/site';
import Reveal from '../components/ui/Reveal';
import Gallery from '../components/Gallery';
import portrait from '../assets/portrait.webp';
import stage from '../assets/stage.jpg';
import certificate from '../assets/certificate.jpg';
import poster from '../assets/poster.jpg';
import waves from '../assets/future-waves.jpg';
import classroom from '../assets/classroom.jpg';

const RECOGNITION = [
  { icon: Award, title: '2026 National Green Difference Award', detail: '1 of 42 recipients globally' },
  { icon: Trophy, title: '1st Place, Palm Beach Regional SEF', detail: 'Plus Top Sustainability Innovation Award, Florida State SEF' },
  { icon: Droplets, title: '3rd Place, Florida Stockholm Junior Water Prize', detail: 'Water-focused research competition' },
  { icon: Medal, title: 'Top 5, FAU Business Pitch Competition', detail: 'Ocean economy track' },
  { icon: Rocket, title: 'FAU Runway Accelerator', detail: '$100K in funding and resources' },
  { icon: FileText, title: 'Accepted: IOCMSE 2026 (MDPI) and Sigma Xi iFoRE', detail: 'Research abstracts accepted' },
  { icon: Newspaper, title: 'Palm Beach Illustrated', detail: 'Featured, Sept. 2026' },
];

const PHOTOS = [
  { src: stage, alt: 'Aysel presenting on stage', caption: 'Pitching ThermoVolt Marine', tall: true, pos: '50% 20%' },
  { src: classroom, alt: 'Aysel in a lecture hall as the audience applauds', caption: 'Speaking to students', wide: true, pos: '50% 40%' },
  { src: waves, alt: 'Aysel holding a Future Waves award', caption: 'Future Waves award', tall: true, pos: '50% 25%' },
  { src: poster, alt: 'Aysel beside her research poster', caption: 'Presenting the research poster' },
  { src: certificate, alt: 'Aysel holding a first-place certificate and medals', caption: '1st place, Palm Beach Regional SEF', pos: '50% 30%' },
];

export default function About() {
  return (
    <>
      <section className="-mt-[72px] bg-mist pt-[72px]">
        <div className="wrap grid grid-cols-1 items-center gap-10 py-14 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14 md:py-20">
          <img src={portrait} alt="Portrait of Aysel Elshenawy" className="mx-auto h-56 w-56 rounded-full shadow-lift ring-8 ring-white/60 md:h-72 md:w-72" />
          <div>
            <p className="kicker">About</p>
            <h1 className="mt-4 text-[clamp(38px,5.2vw,64px)]">{SITE.founder}</h1>
            <p className="mt-3 font-display text-xl font-bold text-royal">{SITE.founderRole}</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-[15px]">
              {['FAU electrical engineering student', 'Designed the hardware', 'Sole inventor, 20-claim patent filing'].map((t) => (
                <li key={t} className="rounded-full bg-white/70 px-4 py-2 font-semibold text-navy">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <p className="kicker">How it started</p>
            <blockquote className="mt-5 font-display text-[clamp(26px,3.2vw,38px)] font-extrabold leading-tight tracking-tight text-navy">
              “Everyone in the industry worries about oil and plastic. Nobody was measuring the heat.”
            </blockquote>
          </Reveal>
          <Reveal delay={100} className="space-y-5 text-lg leading-relaxed text-slate">
            <p>
              In May 2025 I was talking with my dad, a marine surveyor, about electrical circuits on boats. That conversation is where ThermoVolt Marine began.
            </p>
            <p>
              ThermoVolt Marine started as a bench experiment: a copper loop, six thermoelectric modules and a supercapacitor. It is now a patent-pending system with its own power board and controller, both designed in-house.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-frost">
        <div className="wrap section">
          <Reveal className="mb-12 max-w-3xl">
            <p className="kicker">Validation</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)]">Backed by judges in science, sustainability and business.</h2>
          </Reveal>
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {RECOGNITION.map((r, i) => {
              const Icon = r.icon;
              return (
                <Reveal as="li" key={r.title} delay={(i % 2) * 80} className={`flex items-start gap-5 rounded-card p-6 shadow-lift ${i === 0 ? 'bg-navy text-white md:col-span-2' : 'bg-white'}`}>
                  <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${i === 0 ? 'bg-amber text-navy' : 'bg-royal-soft text-royal'}`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className={`block font-display text-xl font-extrabold ${i === 0 ? 'text-white' : 'text-navy'}`}>{r.title}</span>
                    <span className={`mt-1 block text-[15px] ${i === 0 ? 'text-white/75' : 'text-slate-muted'}`}>{r.detail}</span>
                  </span>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="mb-10 max-w-3xl">
            <p className="kicker">On the road</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)]">Fairs, stages and classrooms.</h2>
          </Reveal>
          <Gallery photos={PHOTOS} />
        </div>
      </section>

      <section className="bg-mist">
        <div className="wrap section grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal className="card p-7 md:p-9">
            <p className="kicker">Research</p>
            <h3 className="mt-3 text-[26px]">Technical preprint on Zenodo</h3>
            <p className="mt-3 text-slate">The full method, data and analysis behind the bench results.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={SITE.zenodoUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Read the preprint <ArrowUpRight size={17} strokeWidth={1.5} />
              </a>
              <a href={SITE.videoUrl} target="_blank" rel="noreferrer" className="btn-outline">
                Watch the demo
              </a>
            </div>
          </Reveal>
          <Reveal delay={90} className="rounded-card bg-navy p-7 text-white md:p-9">
            <Briefcase size={26} strokeWidth={1.5} className="text-amber" />
            <h3 className="mt-3 text-[26px] text-white">Looking for advisors</h3>
            <ul className="mt-4 space-y-3 text-white/85">
              <li>
                <strong className="text-white">Marine engineer:</strong> installs and Coast Guard rules
              </li>
              <li>
                <strong className="text-white">Business mentor:</strong> pricing and sales
              </li>
            </ul>
            <Link to="contact" className="btn-amber mt-6">
              Get in touch <ArrowRight size={17} strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
