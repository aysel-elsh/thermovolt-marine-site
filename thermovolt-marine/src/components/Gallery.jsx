import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Photo grid with keyboard-friendly lightbox.
export default function Gallery({ photos }) {
  const [open, setOpen] = useState(-1);
  useEffect(() => {
    if (open < 0) return undefined;
    const on = (e) => {
      if (e.key === 'Escape') setOpen(-1);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [open, photos.length]);

  return (
    <>
      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-2xl bg-frost ${p.wide ? 'md:col-span-2' : ''} ${p.tall ? 'row-span-2' : ''}`}
          >
            <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: p.pos || 'center' }} />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-3 pt-10 text-left text-[13px] font-semibold text-white">{p.caption}</span>
          </button>
        ))}
      </div>
      {open >= 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-deep/90 p-4" role="dialog" aria-modal="true" aria-label={photos[open].caption} onClick={() => setOpen(-1)}>
          <figure className="relative max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={photos[open].src} alt={photos[open].alt} className="max-h-[78vh] w-auto rounded-2xl" />
            <figcaption className="mt-3 text-center text-white">{photos[open].caption}</figcaption>
          </figure>
          <button type="button" className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white" onClick={() => setOpen(-1)} aria-label="Close">
            <X strokeWidth={1.5} />
          </button>
          <button type="button" className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + photos.length) % photos.length); }} aria-label="Previous">
            <ChevronLeft strokeWidth={1.5} />
          </button>
          <button type="button" className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % photos.length); }} aria-label="Next">
            <ChevronRight strokeWidth={1.5} />
          </button>
        </div>
      )}
    </>
  );
}
