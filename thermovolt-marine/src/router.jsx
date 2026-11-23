import { useEffect, useState } from 'react';

// Minimal hash router: works on any static host with no rewrites (/#technology).
export const PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'technology', label: 'Technology' },
  { id: 'impact', label: 'Savings' },
  { id: 'business', label: 'Business' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];
export const NAV = PAGES.filter((p) => !['home', 'contact'].includes(p.id));

const ids = new Set(PAGES.map((p) => p.id));
const read = () => {
  const h = window.location.hash.replace(/^#\/?/, '');
  return ids.has(h) ? h : 'home';
};

export function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => {
      setRoute(read());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => {
    const p = PAGES.find((x) => x.id === route);
    document.title = route === 'home' ? 'ThermoVolt Marine — Turning wasted engine heat into onboard power' : `${p.label} · ThermoVolt Marine`;
  }, [route]);
  return route;
}

export function Link({ to, children, ...rest }) {
  return (
    <a href={`#${to}`} {...rest}>
      {children}
    </a>
  );
}
