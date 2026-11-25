import { ArrowUpRight } from 'lucide-react';
import { PAGES, Link } from '../router';
import { SITE } from '../config/site';
import wordmark from '../assets/wordmark-light.png';
import bolt from '../assets/bolt.png';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <img src={bolt} alt="" aria-hidden="true" className="pointer-events-none absolute -right-10 -top-6 w-[260px] opacity-[0.07]" />
      <div className="wrap relative py-16 md:py-20">
        <p className="max-w-[24ch] font-display text-[clamp(26px,3.4vw,40px)] font-extrabold leading-tight tracking-tight">
          {SITE.closing}
        </p>
        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-white/15 pt-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src={wordmark} alt="ThermoVolt" className="h-[22px] w-auto" />
            <p className="mt-1 font-display text-[10px] font-bold tracking-[0.42em] text-sky">MARINE</p>
            <p className="mt-5 text-[15px] text-white/70">
              {SITE.founder}, {SITE.founderRole}
              <br />
              {SITE.place}
            </p>
          </div>
          <div>
            <p className="font-display text-sm font-bold text-amber">Explore</p>
            <ul className="mt-3 space-y-1.5">
              {PAGES.filter((p) => p.id !== 'contact').map((p) => (
                <li key={p.id}>
                  <Link to={p.id} className="text-[15px] text-white/80 hover:text-white">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-sm font-bold text-amber">Research</p>
            <ul className="mt-3 space-y-1.5">
              {[
                ['Technical preprint', SITE.zenodoUrl],
                ['Video demonstration', SITE.videoUrl],
              ].map(([l, h]) => (
                <li key={l}>
                  <a href={h} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[15px] text-white/80 hover:text-white">
                    {l} <ArrowUpRight size={14} strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-sm font-bold text-amber">Contact</p>
            <p className="mt-3 break-all text-[15px] text-white/80">{SITE.email}</p>
            <Link to="contact" className="btn-amber mt-4 min-h-[44px] px-5 text-sm">
              Get in touch
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-3 text-[13px] text-white/50">
          <span>© {new Date().getFullYear()} ThermoVolt Marine · Patent pending</span>
          <span>Built in Boca Raton, Florida</span>
        </div>
      </div>
    </footer>
  );
}
