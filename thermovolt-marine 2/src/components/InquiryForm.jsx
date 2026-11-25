import { useState } from 'react';
import { Send, Copy, Check } from 'lucide-react';
import { SITE } from '../config/site';

const ROLES = ['Boat owner / fleet operator', 'Marine mechanic / installer', 'Boat or engine builder', 'Researcher', 'Investor / program', 'Press', 'Other'];
const TOPICS = ['Pilot program', 'Spec sheet', 'Partnership', 'Research', 'Something else'];

export default function InquiryForm() {
  const [f, setF] = useState({ name: '', email: '', org: '', role: ROLES[0], topic: TOPICS[0], message: '' });
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const subject = `ThermoVolt Marine: ${f.topic}`;
  const body = `${f.message}\n\n${f.name}${f.org ? `, ${f.org}` : ''}\n${f.role}\n${f.email}`;

  const submit = (e) => {
    e.preventDefault();
    setOpened(true);
    try {
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch {
      /* no mail app; the panel below shows the address */
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${SITE.email}\nSubject: ${subject}\n\n${body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  const L = ({ children, req }) => (
    <span className="font-display text-[15px] font-bold text-navy">
      {children}
      {req && <span className="text-heat"> *</span>}
    </span>
  );

  return (
    <form onSubmit={submit} className="card grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 md:p-9">
      <div className="sm:col-span-2">
        <L>What’s this about?</L>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
          {TOPICS.map((t) => (
            <label key={t} className={`relative cursor-pointer ${f.topic === t ? 'chip-on' : 'chip-off'}`}>
              <input type="radio" name="topic" value={t} checked={f.topic === t} onChange={set('topic')} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </div>
      <label className="flex flex-col gap-2">
        <L req>Name</L>
        <input required value={f.name} onChange={set('name')} className="field" autoComplete="name" />
      </label>
      <label className="flex flex-col gap-2">
        <L req>Email</L>
        <input required type="email" value={f.email} onChange={set('email')} className="field" autoComplete="email" />
      </label>
      <label className="flex flex-col gap-2">
        <L>Organization or boat</L>
        <input value={f.org} onChange={set('org')} className="field" autoComplete="organization" />
      </label>
      <label className="flex flex-col gap-2">
        <L>I’m a</L>
        <select value={f.role} onChange={set('role')} className="field">
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 sm:col-span-2">
        <L req>Message</L>
        <textarea required rows={5} value={f.message} onChange={set('message')} className="field resize-y" placeholder="Tell us about your boat or fleet: engine, hours per year, cooling setup." />
      </label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className="btn-primary">
          <Send size={17} strokeWidth={1.5} /> Send message
        </button>
        <span className="text-[14px] text-slate-muted">Opens your email app, ready to send.</span>
      </div>
      {opened && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-sky-soft p-4 text-[15px] text-navy sm:col-span-2" role="status">
          <span>
            No email window? Send it to <strong>{SITE.email}</strong>.
          </span>
          <button type="button" onClick={copy} className="btn-outline ml-auto min-h-[40px] px-4 text-sm">
            {copied ? <Check size={16} /> : <Copy size={16} strokeWidth={1.5} />}
            {copied ? 'Copied' : 'Copy message'}
          </button>
        </div>
      )}
    </form>
  );
}
