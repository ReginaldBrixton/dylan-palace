import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rotate3d, ArrowRight } from 'lucide-react';
import { Screen } from '../types';
import { img } from '../imageMap';
import { TrousersInteractive, BagsInteractive, ShoesInteractive } from './AtelierInteractive';
import ImageWithSkeleton from './ImageWithSkeleton';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectCategory: (category: 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS') => void;
}

const SHOWCASE_SHOES = [
  {
    id: 'p_sh_gen1',
    name: 'Minimal Street Sneaker',
    price: 320,
    image: img('shoes/shoe-p_sh_gen1.jpg'),
    description: 'Minimal high-fashion street sneaker with concrete floor studio lighting.',
    subText: 'Futuristic design'
  },
  {
    id: 'p_sh_gen2',
    name: 'Industrial Leather Boot',
    price: 480,
    image: img('shoes/shoe-p_sh_gen2.jpg'),
    description: 'Bold, brutalist heavy-duty platform boot with high-contrast shadows.',
    subText: 'Brutalist high-fashion'
  },
  {
    id: 'p_sh_gen3',
    name: 'Classic Dark Loafer',
    price: 280,
    image: img('shoes/shoe-p_sh_gen3.jpg'),
    description: 'Polished modern luxury slipper loafer styled on warm organic linen fabric.',
    subText: 'Minimal modern luxury'
  }
];

export default function HomeScreen({ onNavigate, onSelectCategory }: HomeScreenProps) {
  const [activeShoeIndex, setActiveShoeIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });
  const [spinCount, setSpinCount] = useState(0);

  const activeShoe = SHOWCASE_SHOES[activeShoeIndex];

  const handleShopCategory = (cat: 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS') => {
    onSelectCategory(cat);
    onNavigate('plp');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range: -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range: -0.5 to 0.5
    setTilt({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  const trigger3dSpin = () => {
    setSpinCount(prev => prev + 1);
  };

  return (
    <div id="home-screen" className="w-full flex flex-col pb-32 animate-fade-in">

      {/* Editorial Hero Banner */}
      <section className="relative w-full h-[70vh] min-h-[500px] border-b border-[#E5E5E5] overflow-hidden">
        <ImageWithSkeleton
          className="absolute inset-0 w-full h-full"
          imgClassName="w-full h-full object-cover select-none pointer-events-none"
          alt="A striking, high-contrast fashion editorial shot of a person wearing a crisp, minimalist white linen shirt."
          src={img('shirts/shirt-p1_1.jpg')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 via-[#111111]/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col items-start z-10">
          <h2 className="font-serif text-[32px] md:text-[40px] text-[#FFFFFF] mb-4 uppercase tracking-tighter leading-tight">
            THE SUMMER SHIFT
          </h2>
          <button
            id="hero-cta"
            onClick={() => handleShopCategory('SHIRTS')}
            className="bg-[#111111] text-[#FFFFFF] text-[13px] font-semibold uppercase tracking-[0.1em] px-8 py-3.5 w-full sm:w-auto hover:bg-[#FFFFFF] hover:text-[#111111] border border-[#111111] transition-all duration-300 active:scale-95 cursor-pointer rounded-lg"
          >
            SHOP SHIRTS
          </button>
        </div>
      </section>

      {/* 3D Interactive Lab Area */}
      <section className="w-full py-12 px-4 bg-[#F2F2F1] border-b border-[#E5E5E5]">
        <div className="max-w-md mx-auto flex flex-col gap-6">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B8B8A] block mb-1">
              Interactive 3D Preview
            </span>
            <h2 className="font-serif text-[28px] font-bold text-[#111111] tracking-tighter uppercase leading-none">
              FOOTWEAR LAB
            </h2>
            <p className="text-[12px] text-[#555555] max-w-xs mx-auto mt-2 tracking-wide">
              Move cursor over the footwear container to tilt and preview leather specs under dynamic lighting.
            </p>
          </div>

          {/* Interactive 3D Perspective Card Container */}
          <div
            className="relative w-full h-[360px] cursor-grab active:cursor-grabbing select-none"
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={trigger3dSpin}
          >
            <motion.div
              className="absolute inset-0 bg-white border border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden flex flex-col p-6 transition-colors duration-500 ease-out"
              animate={{
                rotateY: spinCount * 360 + (tilt.active ? tilt.x * 28 : 0),
                rotateX: tilt.active ? tilt.y * -28 : 0,
                scale: tilt.active ? 1.02 : 1
              }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
            >
              {/* Dynamic light refraction flare overlay effect */}
              {tilt.active && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-300 z-10"
                  style={{
                    background: `radial-gradient(circle 140px at ${50 + tilt.x * 100}% ${50 + tilt.y * 100}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 80%)`
                  }}
                />
              )}

              {/* Top lab parameters */}
              <div className="flex justify-between items-start w-full z-10">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-[#8B8B8A] uppercase tracking-wider">
                    SPEC_ {activeShoe.id}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase text-[#111111] tracking-tight mt-0.5">
                    {activeShoe.subText}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F9F9F8] border border-[#E5E5E5]/60 rounded-full">
                  <Rotate3d size={12} className="text-[#111111] animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="font-mono text-[9px] text-[#444748] tracking-widest uppercase">
                    3D_SENSE
                  </span>
                </div>
              </div>

              {/* Centered Image display block with dynamic floating zoom */}
              <div className="flex-grow flex items-center justify-center relative w-full h-1/2 overflow-hidden py-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeShoe.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex items-center justify-center relative"
                  >
                    <ImageWithSkeleton
                      className="w-full h-full"
                      imgClassName="w-full h-full max-h-[160px] object-contain rounded-lg drop-shadow-2xl transition-transform duration-500 hover:scale-105 pointer-events-none"
                      alt={activeShoe.name}
                      src={activeShoe.image}
                      loading="eager"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footwear metadata cards details row */}
              <div className="flex flex-col w-full z-10 pt-2 gap-1.5">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif text-[20px] font-bold text-[#111111] uppercase tracking-tight">
                    {activeShoe.name}
                  </h4>
                  <span className="font-serif text-[18px] font-bold text-[#4A5D23]">
                    GH₵{activeShoe.price}
                  </span>
                </div>
                <p className="text-[11px] text-[#666666] leading-relaxed line-clamp-2 h-8">
                  {activeShoe.description}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShopCategory('SHOES');
                  }}
                  className="w-full mt-2 h-11 bg-[#111111] text-white rounded-lg flex items-center justify-center text-[11px] font-bold uppercase tracking-widest gap-2 hover:bg-[#333333] active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  ACQUIRE Footwear <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Interactive Footwear Index controller bars selector */}
          <div className="flex justify-center items-center gap-3 mt-1 select-none">
            {SHOWCASE_SHOES.map((shoe, idx) => (
              <button
                key={shoe.id}
                onClick={() => {
                  setActiveShoeIndex(idx);
                  trigger3dSpin();
                }}
                className={`py-1.5 px-3 rounded-full border text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 active:scale-90 cursor-pointer ${activeShoeIndex === idx
                  ? 'bg-[#111111] text-white border-[#111111] scale-105 shadow-sm'
                  : 'bg-white text-[#555555] border-[#E5E5E5] opacity-75'
                  }`}
              >
                {shoe.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Atelier Category Grid */}
      <section className="w-full flex flex-col gap-0">

        {/* TROUSERS SECTION */}
        <div className="w-full border-b border-[#E5E5E5] bg-[#FAF9F6] py-12 px-4 sm:px-6 md:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column: Image cover (Clickable, redirects to plp) */}
            <div
              id="cat-preview-trousers"
              onClick={() => handleShopCategory('TROUSERS')}
              className="relative w-full h-[360px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <ImageWithSkeleton
                className="absolute inset-0 w-full h-full"
                imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none"
                alt="Wide-leg pleated trousers."
                src={img('trousers/trouser-p_tr_l1.jpg')}
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9C9C7] mb-1">
                  Atelier Apparel
                </span>
                <h4 className="font-serif text-[32px] md:text-[38px] text-white uppercase tracking-tighter font-extrabold mb-4 leading-none">
                  TROUSERS
                </h4>
                <span className="inline-flex items-center gap-1.5 text-xs text-white uppercase font-bold tracking-widest border-b border-white pb-0.5 self-start group-hover:gap-3 transition-all">
                  DISCOVER SLATE <ArrowRight size={14} />
                </span>
              </div>
            </div>

            {/* Right Column: Mini Interactive Tailoring Lab */}
            <div className="w-full h-[360px]">
              <TrousersInteractive />
            </div>
          </div>
        </div>

        {/* BAGS SECTION */}
        <div className="w-full border-b border-[#E5E5E5] bg-[#FAF9F6] py-12 px-4 sm:px-6 md:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column: 3D hardware & opening clasp mechanism */}
            <div className="w-full h-[360px] order-2 md:order-1">
              <BagsInteractive />
            </div>

            {/* Right Column: Campaign card */}
            <div
              id="cat-preview-bags"
              onClick={() => handleShopCategory('BAGS')}
              className="relative w-full h-[360px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer order-1 md:order-2"
            >
              <ImageWithSkeleton
                className="absolute inset-0 w-full h-full"
                imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none"
                alt="Minimalist structured black leather bag on pedestal."
                src={img('bags/bag-p8.jpg')}
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9C9C7] mb-1">
                  Grained Leather
                </span>
                <h4 className="font-serif text-[32px] md:text-[38px] text-white uppercase tracking-tighter font-extrabold mb-4 leading-none">
                  BAGS
                </h4>
                <span className="inline-flex items-center gap-1.5 text-xs text-white uppercase font-bold tracking-widest border-b border-white pb-0.5 self-start group-hover:gap-3 transition-all">
                  EXPLORE HARDWARE <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SHOES SECTION */}
        <div className="w-full border-b border-[#E5E5E5] bg-[#FAF9F6] py-12 px-4 sm:px-6 md:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column: Campaign card */}
            <div
              id="cat-preview-shoes"
              onClick={() => handleShopCategory('SHOES')}
              className="relative w-full h-[360px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <ImageWithSkeleton
                className="absolute inset-0 w-full h-full"
                imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none"
                alt="Avant-garde black leather shoes."
                src={img('shoes/shoe-p9.jpg')}
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9C9C7] mb-1">
                  Bespoke Soles
                </span>
                <h4 className="font-serif text-[32px] md:text-[38px] text-white uppercase tracking-tighter font-extrabold mb-4 leading-none">
                  SHOES
                </h4>
                <span className="inline-flex items-center gap-1.5 text-xs text-white uppercase font-bold tracking-widest border-b border-white pb-0.5 self-start group-hover:gap-3 transition-all">
                  TEST WEAVING <ArrowRight size={14} />
                </span>
              </div>
            </div>

            {/* Right Column: ShoesInteractive tension control */}
            <div className="w-full h-[360px]">
              <ShoesInteractive />
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
