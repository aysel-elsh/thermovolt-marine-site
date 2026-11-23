import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV, Link } from '../router';
import wordmark from '../assets/wordmark-dark.png';

export default function NavBar({ route }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setOpen(false), [route]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled || open ? 'bg-paper/95 shadow-[0_1px_0_rgba(14,33,82,.08)] backdrop-blur' : 'bg-transparent'}`}>
      <div className="wrap flex h-[72px] items-center gap-6">
        <Link to="home" className="flex flex-col" aria-label="ThermoVolt Marine home">
          <img src={wordmark} alt="ThermoVolt" className="h-[22px] w-auto sm:h-[24px]" />
          <span className="mt-1 font-display text-[10px] font-bold tracking-[0.42em] text-sky">MARINE</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((p) => {
            const on = route === p.id;
            return (
              <Link
                key={p.id}
                to={p.id}
                aria-current={on ? 'page' : undefined}
                className={`relative rounded-full px-4 py-2 font-display text-[15px] font-bold transition-colors ${on ? 'bg-navy text-white' : 'text-navy hover:bg-mist-light'}`}
              >
                {p.label}
              </Link>
            );
          })}
        </nav>
        <Link to="contact" className="btn-amber hidden md:inline-flex">
          Get in touch
        </Link>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mnav"
          className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <nav id="mnav" className="border-t border-navy/10 bg-paper md:hidden" aria-label="Mobile">
          <ul className="wrap py-4">
            {[...NAV, { id: 'contact', label: 'Get in touch' }].map((p) => (
              <li key={p.id}>
                <Link
                  to={p.id}
                  className={`flex min-h-[56px] items-center border-b border-navy/10 font-display text-2xl font-extrabold ${route === p.id ? 'text-royal' : 'text-navy'}`}
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
