import { Ship, Wrench, Factory } from 'lucide-react';
import PageIntro from '../components/ui/PageIntro';
import InquiryForm from '../components/InquiryForm';
import { SITE } from '../config/site';

const WHO = [
  [Ship, 'Fleet operators', 'Charter, dive, ferry, tow or research boats interested in a Year-2 pilot.'],
  [Wrench, 'Marine mechanics', 'Shops that want to become installation partners.'],
  [Factory, 'Builders & researchers', 'Boat and engine builders, and labs working on marine heat.'],
];

export default function Contact() {
  return (
    <>
      <PageIntro kicker="Contact" title="Let’s put TVM on the water." lede="Pilots, partnerships, research or press. Tell us about your boat and we’ll get back to you." />
      <section className="section">
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <InquiryForm />
          <aside className="space-y-4">
            {WHO.map(([Icon, t, d]) => (
              <div key={t} className="flex gap-4 rounded-card bg-frost p-6">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white text-royal shadow-lift">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-display font-extrabold text-navy">{t}</p>
                  <p className="mt-1 text-[15px] text-slate">{d}</p>
                </div>
              </div>
            ))}
            <div className="rounded-card bg-navy p-6 text-white">
              <p className="tag text-amber">Direct</p>
              <p className="mt-2 break-all font-display text-lg font-bold">{SITE.email}</p>
              <p className="mt-1 text-[15px] text-white/70">
                {SITE.founder} · {SITE.place}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
