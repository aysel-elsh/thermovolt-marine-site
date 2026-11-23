// Labelled range input with a live value.
export default function RangeField({ id, label, value, min, max, step, format, color = '#1B45C4', onChange, hint }) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-display text-[15px] font-bold text-navy">
          {label}
        </label>
        <output htmlFor={id} className="tnum font-display text-xl font-extrabold text-navy">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-1"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--fill': `${fill}%`, '--c': color }}
      />
      {hint && <p className="text-[13px] text-slate-muted">{hint}</p>}
    </div>
  );
}
