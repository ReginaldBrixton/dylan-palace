import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroCampaignProps { image: string; }

export default function HeroCampaign({ image }: HeroCampaignProps) {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-[var(--color-ink)] sm:min-h-[760px] lg:min-h-[min(860px,92vh)]">
      <img src={image} alt="Dylan's Palace seasonal fashion selection" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/28 to-transparent" />
      <div className="store-container relative flex min-h-[680px] items-end pb-12 pt-28 text-white sm:min-h-[760px] sm:pb-16 lg:min-h-[min(860px,92vh)] lg:items-center lg:pb-0">
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl font-bold leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:text-[92px]">A quieter kind of statement.</h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/78 sm:text-base">Considered shirts, trousers, shoes and bags selected for confident everyday dressing.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => navigate('/shirts')} className="flex h-13 items-center justify-center gap-2 bg-white px-7 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink)]">Shop the collection <ArrowRight size={15} /></button>
            <button type="button" onClick={() => navigate('/shoes')} className="h-13 border border-white/50 px-7 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">Explore footwear</button>
          </div>
        </div>
      </div>
    </section>
  );
}
