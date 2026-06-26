import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, Heart, Share2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { getCachedProductById, getRelatedProducts } from '../lib/product-cache';
import { CURRENCY } from '../constants';
import { useApp } from '../context/AppContext';
import ImageWithSkeleton from '../components/common/ImageWithSkeleton';

export default function ProductDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, handleAddtoBag } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isAdded, setIsAdded] = useState(false);

  // Accordion state
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Size guide trigger modal state
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSizeGuide) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSizeGuide(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSizeGuide]);

  useEffect(() => {
    setLoading(true);
    setActiveImageIndex(0);
    setIsAdded(false);
    setExpandedSection(null);
    if (!id) return;
    getCachedProductById(id)
      .then((p) => {
        if (p) {
          setProduct(p);
          setSelectedSize(p.sizes[0] || 'M');
          getRelatedProducts(p, 8).then(setRelatedProducts);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] pt-[52px] animate-pulse select-none">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 p-4">
          {/* Image carousel skeleton */}
          <div className="w-full md:w-1/2 aspect-square bg-[#E5E5E5]/50 rounded-2xl" />
          {/* Details skeleton */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 pt-2">
            <div className="h-3 w-24 bg-[#E5E5E5] rounded-full" />
            <div className="h-7 w-3/4 bg-[#E5E5E5] rounded-full" />
            <div className="h-6 w-32 bg-[#E5E5E5] rounded-full" />
            <div className="h-px w-full bg-[#E5E5E5]/50" />
            <div className="flex gap-2 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-12 h-12 bg-[#E5E5E5]/50 rounded-lg" />
              ))}
            </div>
            <div className="h-px w-full bg-[#E5E5E5]/50 mt-2" />
            <div className="h-4 w-full bg-[#E5E5E5] rounded-full" />
            <div className="h-4 w-5/6 bg-[#E5E5E5] rounded-full" />
            <div className="h-4 w-2/3 bg-[#E5E5E5] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Dylan's Palace - ${product.name}`,
          text: `Check out ${product.name} at Dylan's Palace!`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that do not support navigator.share
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleAddToBag = () => {
    setIsAdded(true);
    handleAddtoBag(product, selectedSize);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div id="product-detail-screen" className="w-full flex flex-col pb-40 animate-fade-in bg-[#F9F9F8]">

      {/* Immersive Image Carousel */}
      <section className="relative w-full h-[52vh] sm:h-[60vh] lg:aspect-[4/5] lg:h-auto bg-[#eeeeed] overflow-hidden select-none">

        {/* Active Image */}
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIndex}
              initial={{ opacity: 0, x: 30, scale: 1.03 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <ImageWithSkeleton
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
                alt={`${product.name} - View ${activeImageIndex + 1}`}
                src={product.images[activeImageIndex]}
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button
            onClick={() => toggleWishlist(product.id)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#111111] hover:bg-white shadow-sm transition-colors"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={20} className={isWishlisted ? "fill-[#111111] text-[#111111]" : "text-[#111111]"} />
          </button>

          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#111111] hover:bg-white shadow-sm transition-colors"
            aria-label="Share product"
          >
            <Share2 size={20} className="text-[#111111]" />
          </button>
        </div>

        {/* Horizontal Navigation indicators */}
        {
          product.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-[#111111] border border-gray-200/60 hover:bg-white hover:scale-110 active:scale-95 cursor-pointer transition-all duration-200 shadow-sm"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-[#111111] border border-gray-200/60 hover:bg-white hover:scale-110 active:scale-95 cursor-pointer transition-all duration-200 shadow-sm"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )
        }

        {/* Carousel Pagination dots bottom-centered */}
        {
          product.images.length > 1 && (
            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to image slide ${idx + 1}`}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`rounded-full transition-all duration-300 ${idx === activeImageIndex ? 'w-6 h-2 bg-[#111111]' : 'w-2 h-2 bg-[#111111]/30 hover:bg-[#111111]/50'
                    }`}
                ></button>
              ))}
            </div>
          )
        }
      </section >

      {/* Product Information details */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 pt-4 pb-4 border-b border-[#E5E5E5] bg-white"
      >
        <h1 className="font-serif text-[20px] sm:text-[24px] lg:text-[26px] font-bold text-[#111111] leading-tight mb-3">
          {product.name}
        </h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-[#111111]/5 border border-[#111111]/10 rounded-full px-4 py-1.5 mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D23] animate-pulse" />
          <span className="font-mono text-[15px] sm:text-[17px] font-bold text-[#111111] tracking-tight">
            {CURRENCY}{product.price.toFixed(2)}
          </span>
        </motion.div>
        <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#555555] max-w-prose">
          {product.description}
        </p>
      </motion.section>

      {/* Inline Delivery / Truck Timeline block */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 py-4 border-b border-[#E5E5E5] flex items-center gap-2 bg-white"
      >
        <Truck size={18} className="text-[#4A5D23]" />
        <span className="text-[10px] sm:text-[12px] font-semibold text-[#4A5D23] uppercase tracking-wider">
          FAST DELIVERY WITHIN ACCRA • FREE PICKUP AT ODORKOR SHOP
        </span>
      </motion.section>

      {/* Size Selector Box grids */}
      < section className="px-6 py-6 border-b border-[#E5E5E5] bg-white" >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[12px] font-bold text-[#8B8B8A] uppercase tracking-wider">
            Select Size
          </h2>
          <button
            onClick={() => setShowSizeGuide(true)}
            className="text-[12px] text-[#111111] uppercase tracking-wider underline decoration-1 underline-offset-4 cursor-pointer hover:text-[#4A5D23] transition-colors"
          >
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
              className={`h-11 sm:h-12 border transition-all duration-200 font-semibold text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center justify-center cursor-pointer ${selectedSize === size
                ? 'border-2 border-[#111111] bg-white text-[#111111] scale-[1.02]'
                : 'border-[#E5E5E5] bg-white text-[#8B8B8A] hover:border-[#111111]'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </section >

      {/* Interactive Accordion segments */}
      < section className="px-6 py-4 bg-white" >

        {/* Segment 1: Details & Care */}
        < div className="border-b border-[#E5E5E5]" >
          <button
            onClick={() => toggleSection('details')}
            className="w-full py-4 flex justify-between items-center text-left cursor-pointer hover:opacity-85"
          >
            <h3 className="text-[12px] font-bold text-[#111111] uppercase tracking-wider">
              Details &amp; Care
            </h3>
            <span className="text-[18px] font-mono">{expandedSection === 'details' ? '−' : '+'}</span>
          </button>
          {
            expandedSection === 'details' && (
              <div className="pb-4 text-[13px] text-[#555555] leading-relaxed animate-fade-in list-disc pl-4 space-y-1.5">
                <p>• 100% premium sourced material, locally inspected.</p>
                <p>• Expertly woven thread with double reinforced edge seams.</p>
                <p>• Machine wash cold or professional dry clean only.</p>
                <p>• Medium-hot iron to preserve crisp silhouette structure.</p>
              </div>
            )
          }
        </div >

        {/* Segment 3: Sustainability */}
        < div className="border-b border-[#E5E5E5]" >
          <button
            onClick={() => toggleSection('sustainability')}
            className="w-full py-4 flex justify-between items-center text-left cursor-pointer hover:opacity-85"
          >
            <h3 className="text-[12px] font-bold text-[#111111] uppercase tracking-wider">
              Sustainability
            </h3>
            <span className="text-[18px] font-mono">{expandedSection === 'sustainability' ? '−' : '+'}</span>
          </button>
          {
            expandedSection === 'sustainability' && (
              <div className="pb-4 text-[13px] text-[#555555] leading-relaxed animate-fade-in space-y-2">
                <p>• Carbon-neutral manufacturing processes.</p>
                <p>• Zero single-use plastic tags or synthetic fibers used.</p>
                <p>• Water-recycling treatment certified, supporting global soil preservation efforts.</p>
              </div>
            )
          }
        </div >

        {/* Segment 4: Reviews */}
        < div >
          <button
            onClick={() => toggleSection('reviews')}
            className="w-full py-4 flex justify-between items-center text-left cursor-pointer hover:opacity-85"
          >
            <h3 className="text-[12px] font-bold text-[#111111] uppercase tracking-wider">
              Reviews (12)
            </h3>
            <span className="text-[18px] font-mono">{expandedSection === 'reviews' ? '−' : '+'}</span>
          </button>
          {
            expandedSection === 'reviews' && (
              <div className="pb-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-serif text-[22px] sm:text-[28px] font-bold text-[#111111]">4.8</span>
                  <div className="flex text-[#111111]">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className={i < 4 ? 'opacity-100' : 'opacity-20'}>★</span>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8B8B8A] uppercase tracking-widest ml-2">12 Ratings</span>
                </div>
                <div className="space-y-4">
                  <div className="border border-[#E5E5E5] p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-[#111111] uppercase tracking-wider">ALEXANDER D.</span>
                      <span className="text-[#111111] text-[10px]">★★★★★</span>
                    </div>
                    <p className="text-[13px] text-[#555555] leading-relaxed">
                      "Exceptional quality. The material feels much more premium than what you'd find at this price point. Highly recommended if you want something architectural."
                    </p>
                  </div>
                  <div className="border border-[#E5E5E5] p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-[#111111] uppercase tracking-wider">CHRISTIAN M.</span>
                      <span className="text-[#111111] text-[10px]">★★★★</span>
                    </div>
                    <p className="text-[13px] text-[#555555] leading-relaxed">
                      "Fits true to size. Delivery was delayed by one day but the packaging was gorgeous. Great addition to the summer rotation."
                    </p>
                  </div>
                </div>
              </div>
            )
          }
        </div >
      </section >

      {/* Segment 5: You Might Also Like */}
      <section className="px-6 py-8 bg-[#F9F9F8] border-t border-[#E5E5E5] mb-[60px]">
        <div className="flex items-center justify-between mb-4 border-b border-[#E5E5E5] pb-2">
          <h3 className="text-[12px] font-bold text-[#111111] uppercase tracking-wider">
            YOU MIGHT ALSO LIKE
          </h3>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                const c = carouselRef.current;
                if (c) c.scrollBy({ left: -c.clientWidth * 0.8, behavior: 'smooth' });
              }}
              className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => {
                const c = carouselRef.current;
                if (c) c.scrollBy({ left: c.clientWidth * 0.8, behavior: 'smooth' });
              }}
              className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div
          ref={carouselRef}
          className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {relatedProducts.map(related => (
            <div
              key={related.id}
              className="flex flex-col cursor-pointer bg-white shrink-0 w-[120px] sm:w-[160px] snap-start"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate(`/product/${related.id}`);
              }}
            >
              <div className="aspect-[3/4] w-full bg-[#eeeeed] overflow-hidden mb-2 relative">
                <ImageWithSkeleton
                  src={related.images[0]}
                  alt={related.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
              <h4 className="text-[10px] font-bold text-[#111111] truncate">{related.name}</h4>
              <p className="text-[10px] text-[#555555]">{CURRENCY}{related.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Compact CTA Bar - sits on top of BottomNav */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="fixed bottom-[72px] left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-[#E5E5E5]/60 px-3 py-2"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0 pl-1">
            <p className="text-[8px] font-bold text-[#8B8B8A] uppercase tracking-widest leading-none mb-0.5">
              {isAdded ? 'Added!' : 'Price'}
            </p>
            <p className="font-mono text-[14px] sm:text-[16px] font-bold text-[#111111] leading-none truncate">
              {CURRENCY}{product.price.toFixed(2)}
            </p>
          </div>
          <motion.button
            onClick={handleAddToBag}
            whileTap={{ scale: 0.96 }}
            animate={isAdded ? { scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`shrink-0 px-5 sm:px-7 h-10 sm:h-11 font-semibold text-[11px] sm:text-[12px] uppercase tracking-widest flex items-center justify-center cursor-pointer rounded-xl shadow-md transition-colors duration-300 ${isAdded
              ? 'bg-[#4A5D23] text-white'
              : 'bg-[#111111] text-white hover:bg-black'
              }`}
          >
            {isAdded ? '✓ ADDED' : 'ADD TO BAG'}
          </motion.button>
        </div>
      </motion.div>

      {/* Size Guide Bottom Sheet */}
      {createPortal(
        <AnimatePresence>
          {showSizeGuide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-[#111111]/50 backdrop-blur-sm flex items-end sm:items-center sm:justify-center sm:p-6"
              onClick={() => setShowSizeGuide(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-5 sm:p-6 relative max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Grab handle */}
                <div className="w-10 h-1 bg-[#E5E5E5] rounded-full mx-auto mb-4 sm:hidden" />

                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-[#8B8B8A] hover:text-[#111111] hover:bg-[#F5F5F4] rounded-full transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                <h4 className="font-serif text-[16px] sm:text-[18px] font-bold text-[#111111] uppercase tracking-tight mb-4 pr-8">
                  Editorial Size Metrics
                </h4>
                <div className="border border-[#E5E5E5] text-[12px] mb-5 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-3 bg-[#F9F9F8] border-b border-[#E5E5E5] p-2.5 text-[#8B8B8A] font-bold uppercase tracking-wider text-[10px]">
                    <span>Size</span>
                    <span>Chest (in)</span>
                    <span>Height (ft)</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-[#E5E5E5] p-2.5">
                    <span className="font-bold">S</span>
                    <span>36 - 38</span>
                    <span>5.6 - 5.8</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-[#E5E5E5] p-2.5">
                    <span className="font-bold">M</span>
                    <span>38 - 40</span>
                    <span>5.8 - 6.0</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-[#E5E5E5] p-2.5">
                    <span className="font-bold">L</span>
                    <span>40 - 42</span>
                    <span>6.0 - 6.2</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5">
                    <span className="font-bold">XL</span>
                    <span>42 - 44</span>
                    <span>6.2 - 6.4</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="w-full py-3 bg-[#111111] text-white text-[11px] font-semibold uppercase tracking-widest cursor-pointer rounded-lg hover:bg-black transition-colors"
                >
                  CLOSE GUIDE
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div >
  );
}
