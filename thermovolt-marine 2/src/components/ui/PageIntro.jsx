import bolt from '../../assets/bolt.png';

// Page opening band in the deck's grey-blue, with an optional visual on the right.
const TONES = {
  mist: 'bg-mist blueprint-light',
  frost: 'bg-frost blueprint-light',
  navy: 'bg-navy text-white [&_h1]:text-white',
};

export default function PageIntro({ kicker, title, lede, tone = 'mist', aside, children }) {
  return (
    <section className={`${TONES[tone]} relative -mt-[72px] overflow-hidden pt-[72px]`}>
      {!aside && <img src={bolt} alt="" aria-hidden="true" className="pointer-events-none absolute -right-8 top-1/2 hidden w-[340px] -translate-y-[40%] opacity-[0.16] lg:block" />}
      <div className={`wrap relative grid grid-cols-1 items-center gap-10 py-14 md:py-20 ${aside ? 'lg:grid-cols-[1.15fr_1fr]' : ''}`}>
        <div>
          <p className={`kicker ${tone === 'navy' ? 'text-amber' : ''}`}>{kicker}</p>
          <h1 className="mt-4 text-[clamp(36px,5.2vw,64px)]">{title}</h1>
          {lede && <p className={`mt-6 max-w-[56ch] text-lg leading-relaxed md:text-xl ${tone === 'navy' ? 'text-white/80' : 'text-slate'}`}>{lede}</p>}
          {children}
        </div>
        {aside}
      </div>
    </section>
  );
}
