import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CategoryShowcaseProps { title: string; description: string; image: string; href: string; index: string; }

export default function CategoryShowcase({ title, description, image, href, index }: CategoryShowcaseProps) {
  const navigate = useNavigate();
  return (
    <article className="group relative min-h-[420px] overflow-hidden bg-[var(--color-surface-subtle)] sm:min-h-[520px]">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <button type="button" onClick={() => navigate(href)} className="absolute inset-0 z-10" aria-label={`Shop ${title}`} />
      <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-white sm:p-7 pointer-events-none">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/58">{index}</p><h3 className="mt-1 font-serif text-3xl font-bold tracking-[-0.04em] sm:text-4xl">{title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-white/70">{description}</p></div>
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/35 bg-white/10 backdrop-blur"><ArrowUpRight size={19} /></span>
        </div>
      </div>
    </article>
  );
}
