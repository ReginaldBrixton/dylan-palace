import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

const fallback = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="100%" height="100%" fill="#eeece6"/><text x="50%" y="50%" text-anchor="middle" fill="#86827a" font-family="sans-serif" font-size="24">Dylan\'s Palace</text></svg>')}`;

export default function ProductGallery({ images, productName, activeIndex, onActiveIndexChange }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : [fallback];
  const activeImage = gallery[Math.min(activeIndex, gallery.length - 1)];
  const move = (direction: number) => onActiveIndexChange((activeIndex + direction + gallery.length) % gallery.length);

  return (
    <section className="grid gap-3 lg:grid-cols-[88px_minmax(0,1fr)]" aria-label={`${productName} image gallery`}>
      <div className="order-2 flex gap-2 overflow-x-auto no-scrollbar lg:order-1 lg:flex-col">
        {gallery.map((image, index) => (
          <button key={`${image}-${index}`} type="button" onClick={() => onActiveIndexChange(index)} className={`relative aspect-[4/5] w-16 shrink-0 overflow-hidden border-2 lg:w-full ${activeIndex === index ? 'border-[var(--color-ink)]' : 'border-transparent'}`} aria-label={`Show image ${index + 1}`} aria-pressed={activeIndex === index}>
            <img src={image} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-[4/5] overflow-hidden bg-[var(--color-surface-subtle)] lg:order-2">
        <img src={activeImage} alt={`${productName}, view ${activeIndex + 1}`} className="h-full w-full object-cover" />
        {gallery.length > 1 ? <><button type="button" onClick={() => move(-1)} className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm" aria-label="Previous image"><ChevronLeft size={19} /></button><button type="button" onClick={() => move(1)} className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm" aria-label="Next image"><ChevronRight size={19} /></button></> : null}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold tracking-wider text-white">{activeIndex + 1} / {gallery.length}</span>
      </div>
    </section>
  );
}
