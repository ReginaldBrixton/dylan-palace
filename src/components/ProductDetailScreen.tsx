import React, { useState, useMemo } from 'react';
import { Truck, Plus, Minus, Info, Heart, Share2 } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data';

interface ProductDetailScreenProps {
  product: Product;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddtoBag: (product: Product, size: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export default function ProductDetailScreen({ product, wishlist, onToggleWishlist, onAddtoBag, onSelectProduct }: ProductDetailScreenProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [isAdded, setIsAdded] = useState(false);
  
  // Accordion state
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Size guide trigger modal state
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [product.id, product.category]);

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
    onAddtoBag(product, selectedSize);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div id="product-detail-screen" className="w-full flex flex-col pb-40 animate-fade-in bg-[#F9F9F8]">
      
      {/* Immersive Image Carousel (100vw x 120vw container height) */}
      <section className="relative w-full aspect-[4/5] bg-[#eeeeed] overflow-hidden select-none">
        
        {/* Active Image */}
        <div className="w-full h-full relative">
          <img 
            className="w-full h-full object-cover transition-all duration-500" 
            alt={`${product.name} - View ${activeImageIndex + 1}`}
            src={product.images[activeImageIndex]}
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button
            onClick={() => onToggleWishlist(product.id)}
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
        {product.images.length > 1 && (
          <>
            <button 
              onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-black border border-gray-200 hover:bg-white cursor-pointer"
            >
              ←
            </button>
            <button 
              onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-black border border-gray-200 hover:bg-white cursor-pointer"
            >
              →
            </button>
          </>
        )}

        {/* Carousel Pagination dots bottom-centered */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10">
            {product.images.map((_, idx) => (
              <button 
                key={idx}
                aria-label={`Go to image slide ${idx + 1}`}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeImageIndex ? 'bg-[#111111] scale-125' : 'bg-[#E5E5E5]'
                }`}
              ></button>
            ))}
          </div>
        )}
      </section>

      {/* Product Information details */}
      <section className="px-6 pt-8 pb-4 border-b border-[#E5E5E5] bg-white">
        <div className="flex flex-col gap-1.5 label-caps tracking-widest text-[#8B8B8A] mb-1">
          {product.category}
        </div>
        <h1 className="font-serif text-[26px] font-bold text-[#111111] leading-tight mb-2">
          {product.name}
        </h1>
        <p className="text-[20px] font-bold text-[#111111] mb-4">
          GH₵{product.price.toFixed(2)}
        </p>
        <p className="text-[14px] leading-relaxed text-[#555555] max-w-prose">
          {product.description}
        </p>
      </section>

      {/* Inline Delivery / Truck Timeline block */}
      <section className="px-6 py-4 border-b border-[#E5E5E5] flex items-center gap-2 bg-white">
        <Truck size={18} className="text-[#4A5D23]" />
        <span className="text-[12px] font-semibold text-[#4A5D23] uppercase tracking-wider">
          FAST DELIVERY WITHIN ACCRA • FREE PICKUP AT ODORKOR SHOP
        </span>
      </section>

      {/* Size Selector Box grids */}
      <section className="px-6 py-6 border-b border-[#E5E5E5] bg-white">
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
              className={`h-12 border transition-all duration-200 font-semibold text-[13px] uppercase tracking-widest flex items-center justify-center cursor-pointer ${
                selectedSize === size 
                  ? 'border-2 border-[#111111] bg-white text-[#111111] scale-[1.02]' 
                  : 'border-[#E5E5E5] bg-white text-[#8B8B8A] hover:border-[#111111]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Accordion segments */}
      <section className="px-6 py-4 bg-white">
        
        {/* Segment 1: Details & Care */}
        <div className="border-b border-[#E5E5E5]">
          <button 
            onClick={() => toggleSection('details')}
            className="w-full py-4 flex justify-between items-center text-left cursor-pointer hover:opacity-85"
          >
            <h3 className="text-[12px] font-bold text-[#111111] uppercase tracking-wider">
              Details &amp; Care
            </h3>
            <span className="text-[18px] font-mono">{expandedSection === 'details' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'details' && (
            <div className="pb-4 text-[13px] text-[#555555] leading-relaxed animate-fade-in list-disc pl-4 space-y-1.5">
              <p>• 100% premium sourced material, locally inspected.</p>
              <p>• Expertly woven thread with double reinforced edge seams.</p>
              <p>• Machine wash cold or professional dry clean only.</p>
              <p>• Medium-hot iron to preserve crisp silhouette structure.</p>
            </div>
          )}
        </div>

        {/* Segment 2: Shipping & Returns */}
        <div className="border-b border-[#E5E5E5]">
          <button 
            onClick={() => toggleSection('shipping')}
            className="w-full py-4 flex justify-between items-center text-left cursor-pointer hover:opacity-85"
          >
            <h3 className="text-[12px] font-bold text-[#111111] uppercase tracking-wider">
              Shipping &amp; Returns
            </h3>
            <span className="text-[18px] font-mono">{expandedSection === 'shipping' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'shipping' && (
            <div className="pb-4 text-[13px] text-[#555555] leading-relaxed animate-fade-in space-y-2">
              <p>• <strong>Free pickup available</strong> at our Odorkor shop.</p>
              <p>• Delivery options available across Accra and nationwide through registered dispatch services.</p>
              <p>• Safe <strong>Pay on Delivery</strong> options fully supported at checkout for local buyers.</p>
              <p>• In-store exchanges available within 7 days with original receipt.</p>
            </div>
          )}
        </div>

        {/* Segment 3: Sustainability */}
        <div className="border-b border-[#E5E5E5]">
          <button 
            onClick={() => toggleSection('sustainability')}
            className="w-full py-4 flex justify-between items-center text-left cursor-pointer hover:opacity-85"
          >
            <h3 className="text-[12px] font-bold text-[#111111] uppercase tracking-wider">
              Sustainability
            </h3>
            <span className="text-[18px] font-mono">{expandedSection === 'sustainability' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'sustainability' && (
            <div className="pb-4 text-[13px] text-[#555555] leading-relaxed animate-fade-in space-y-2">
              <p>• Carbon-neutral manufacturing processes.</p>
              <p>• Zero single-use plastic tags or synthetic fibers used.</p>
              <p>• Water-recycling treatment certified, supporting global soil preservation efforts.</p>
            </div>
          )}
        </div>

        {/* Segment 4: Reviews */}
        <div>
          <button 
            onClick={() => toggleSection('reviews')}
            className="w-full py-4 flex justify-between items-center text-left cursor-pointer hover:opacity-85"
          >
            <h3 className="text-[12px] font-bold text-[#111111] uppercase tracking-wider">
              Reviews (12)
            </h3>
            <span className="text-[18px] font-mono">{expandedSection === 'reviews' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'reviews' && (
            <div className="pb-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-serif text-[28px] font-bold text-[#111111]">4.8</span>
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
          )}
        </div>
      </section>

      {/* Segment 5: You Might Also Like */}
      <section className="px-6 py-8 bg-[#F9F9F8] border-t border-[#E5E5E5] mb-[60px]">
        <h3 className="text-[12px] font-bold text-[#111111] uppercase tracking-wider mb-4 border-b border-[#E5E5E5] pb-2">
          YOU MIGHT ALSO LIKE
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {relatedProducts.map(related => (
            <div 
              key={related.id} 
              className="flex flex-col cursor-pointer bg-white"
              onClick={() => {
                if (onSelectProduct) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onSelectProduct(related);
                }
              }}
            >
              <div className="aspect-[3/4] w-full bg-[#eeeeed] overflow-hidden mb-2 relative">
                <img src={related.images[0]} alt={related.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <h4 className="text-[10px] font-bold text-[#111111] truncate">{related.name}</h4>
              <p className="text-[10px] text-[#555555]">GH₵{related.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky CTA Footer Button */}
      <div className="fixed bottom-[72px] left-0 w-full bg-white/70 backdrop-blur-2xl border-t border-[#E5E5E5]/50 p-4 z-40 pb-6 supports-[backdrop-filter]:bg-white/60">
        <button 
          onClick={handleAddToBag}
          className={`w-full h-14 font-semibold text-[13px] uppercase tracking-widest flex items-center justify-center transition-all duration-300 active:scale-[0.98] cursor-pointer rounded-lg shadow-lg ${
            isAdded 
              ? 'bg-[#4A5D23] text-white' 
              : 'bg-[#111111] text-white hover:bg-black'
          }`}
        >
          {isAdded ? "ADDED TO BAG" : `ADD TO BAG - GH₵${product.price}.00`}
        </button>
      </div>

      {/* Size Guide Modal/Overlay */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-all animate-fade-in">
          <div className="bg-white border border-[#E5E5E5] max-w-sm w-full p-6 relative">
            <h4 className="font-serif text-[18px] font-bold text-[#111111] uppercase tracking-tight mb-4">
              EDITORIAL SIZE METRICS
            </h4>
            <div className="border border-[#E5E5E5] text-[12px] mb-6">
              <div className="grid grid-cols-3 bg-[#F9F9F8] border-b border-[#E5E5E5] p-2 text-[#8B8B8A] font-bold">
                <span>SIZE</span>
                <span>CHEST (IN)</span>
                <span>HEIGHT (FT)</span>
              </div>
              <div className="grid grid-cols-3 border-b border-[#E5E5E5] p-2">
                <span>S</span>
                <span>36 - 38</span>
                <span>5.6 - 5.8</span>
              </div>
              <div className="grid grid-cols-3 border-b border-[#E5E5E5] p-2">
                <span>M</span>
                <span>38 - 40</span>
                <span>5.8 - 6.0</span>
              </div>
              <div className="grid grid-cols-3 border-b border-[#E5E5E5] p-2">
                <span>L</span>
                <span>40 - 42</span>
                <span>6.0 - 6.2</span>
              </div>
              <div className="grid grid-cols-3 p-2">
                <span>XL</span>
                <span>42 - 44</span>
                <span>6.2- 6.4</span>
              </div>
            </div>
            <button 
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-3 bg-[#111111] text-white text-[11px] font-semibold uppercase tracking-widest cursor-pointer"
            >
              CLOSE GUIDE
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
