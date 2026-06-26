import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, SlidersHorizontal, Search, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { getCachedProductsByCategory } from '../lib/product-cache';
import { CURRENCY } from '../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageWithSkeleton from '../components/common/ImageWithSkeleton';

const CATEGORY_MAP: Record<string, 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS'> = {
  shirts: 'SHIRTS',
  trousers: 'TROUSERS',
  shoes: 'SHOES',
  bags: 'BAGS',
};

export default function ProductListScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentCategory = CATEGORY_MAP[location.pathname.slice(1)] || 'SHIRTS';
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(8);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [filterMode, setFilterMode] = useState<string>('ALL'); // Selected Subtype
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef(false);

  useEffect(() => {
    if (!quickViewProduct) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuickViewProduct(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quickViewProduct]);

  // Reset filters when category changes

  useEffect(() => {
    setFilterMode('ALL');
    setSearchQuery('');
    setSelectedBrand('ALL');
    setSelectedGender('ALL');
    setPriceSort('none');
    setIsFilterExpanded(false);
    setDisplayLimit(8);
    setQuickViewProduct(null);

    setIsLoadingCategory(true);
    getCachedProductsByCategory(currentCategory)
      .then((data) => {
        setProducts(data);
        setIsLoadingCategory(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setIsLoadingCategory(false);
      });
  }, [currentCategory]);

  const baseProducts = products;

  const availableSubCategories = Array.from(
    new Set(baseProducts.map(p => p.subCategory).filter(Boolean))
  ) as string[];

  const availableBrands = Array.from(
    new Set(baseProducts.map(p => p.brand).filter(Boolean))
  ) as string[];

  // Filter products
  let filtered = baseProducts.filter((p) => {
    // 1: Text Search
    if (searchQuery.trim()) {
      if (!p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }
    }
    // 2: Type Filter
    if (filterMode !== 'ALL' && p.subCategory !== filterMode) {
      return false;
    }
    // 3: Brand Filter (if app)
    if (selectedBrand !== 'ALL' && p.brand !== selectedBrand) {
      return false;
    }
    // 4: Gender Filter
    if (selectedGender !== 'ALL' && p.gender !== selectedGender) {
      return false;
    }
    return true;
  });

  // 5: Price sorting
  if (priceSort === 'asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (priceSort === 'desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  const handleProductClick = (product: Product) => {
    if (didLongPressRef.current) return;
    navigate(`/product/${product.id}`);
  };

  const handlePressStart = (product: Product) => {
    didLongPressRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      if (navigator.vibrate) navigator.vibrate(50);
      setQuickViewProduct(product);
    }, 500);
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
  };

  return (
    <div id="product-list-screen" className="w-full flex flex-col pb-32 animate-fade-in relative z-0">

      {/* Sub-header / Filter Strip */}
      <div className="sticky top-[52px] w-full z-40 bg-white/85 backdrop-blur-2xl backdrop-saturate-[180%] border-b border-[#E5E5E5]/50 flex flex-col supports-[backdrop-filter]:bg-white/70 shadow-sm transition-all duration-300">
        {/* Search & Toggle Bar */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="relative flex-1 flex items-center">
            <Search size={14} className="absolute left-3 text-[#8B8B8A]" />
            <input
              type="text"
              placeholder={`SEARCH ${currentCategory}...`}
              className="w-full text-[11px] font-sans font-bold uppercase tracking-widest pl-9 py-2 border border-[#E5E5E5]/60 focus:border-[#111111] transition-all outline-none bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 text-[#8B8B8A] hover:text-[#111111] transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 border transition-all duration-300 outline-none shadow-sm rounded-full ${isFilterExpanded ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E5E5E5]/60 hover:border-[#111111] text-[#111111] bg-white/80 backdrop-blur-sm'}`}
          >
            <SlidersHorizontal size={14} />
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest">FILTERS</span>
          </button>
        </div>

        {/* Expanded Filters Panel */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, translateY: -10 }}
              animate={{ height: 'auto', opacity: 1, translateY: 0 }}
              exit={{ height: 0, opacity: 0, translateY: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-[#E5E5E5]/50 bg-white/40 backdrop-blur-md"
            >
              <div className="p-4 grid grid-cols-2 gap-4">

                {/* Type Filter */}
                {availableSubCategories.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-[#8B8B8A] uppercase tracking-wider">TYPE</span>
                    <select
                      value={filterMode}
                      onChange={e => setFilterMode(e.target.value)}
                      className="w-full appearance-none text-[11px] uppercase tracking-widest bg-white border border-[#E5E5E5] p-2 rounded-none outline-none focus:border-[#111111] cursor-pointer"
                    >
                      <option value="ALL">ALL TYPES</option>
                      {availableSubCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>
                )}

                {/* Brand Filter (Unique to Shoes or categories with brands) */}
                {availableBrands.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-[#8B8B8A] uppercase tracking-wider">BRAND</span>
                    <select
                      value={selectedBrand}
                      onChange={e => setSelectedBrand(e.target.value)}
                      className="w-full appearance-none text-[11px] uppercase tracking-widest bg-white border border-[#E5E5E5] p-2 rounded-none outline-none focus:border-[#111111] cursor-pointer"
                    >
                      <option value="ALL">ALL BRANDS</option>
                      {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                )}

                {/* Gender Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-[#8B8B8A] uppercase tracking-wider">GENDER</span>
                  <select
                    value={selectedGender}
                    onChange={e => setSelectedGender(e.target.value)}
                    className="w-full appearance-none text-[11px] uppercase tracking-widest bg-white border border-[#E5E5E5] p-2 rounded-none outline-none focus:border-[#111111] cursor-pointer"
                  >
                    <option value="ALL">ALL GENDERS</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="UNISEX">UNISEX</option>
                  </select>
                </div>

                {/* Price Sort Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-[#8B8B8A] uppercase tracking-wider">PRICE SORT</span>
                  <select
                    value={priceSort}
                    onChange={e => setPriceSort(e.target.value as any)}
                    className="w-full appearance-none text-[11px] uppercase tracking-widest bg-white border border-[#E5E5E5] p-2 rounded-none outline-none focus:border-[#111111] cursor-pointer"
                  >
                    <option value="none">RECOMMENDED</option>
                    <option value="asc">LOW TO HIGH</option>
                    <option value="desc">HIGH TO LOW</option>
                  </select>
                </div>

              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => setIsFilterExpanded(false)}
                  className="w-full py-2 bg-[#111111] text-white text-[11px] uppercase tracking-widest font-bold"
                >
                  APPLY FILTERS
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="w-full border-b border-[#E5E5E5] overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full bg-[#FFFFFF]">
          <AnimatePresence>
            {isLoadingCategory ? (
              Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col group relative border-r border-b border-[#E5E5E5]"
                >
                  <div className="aspect-square w-full bg-[#E5E5E5]/50 animate-pulse"></div>
                  <div className="p-3 md:p-4 flex flex-col gap-1.5 bg-[#FFFFFF]">
                    <div className="h-2 w-1/3 bg-[#E5E5E5] animate-pulse rounded-full"></div>
                    <div className="h-3 w-3/4 bg-[#E5E5E5] animate-pulse rounded-full"></div>
                    <div className="h-3.5 w-1/4 bg-[#E5E5E5] animate-pulse mt-1 rounded-full"></div>
                  </div>
                </motion.div>
              ))
            ) : filtered.length > 0 ? (
              filtered.slice(0, displayLimit).map((product, index) => (
                <motion.article
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: Math.min(index * 0.04, 0.3) }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  onMouseDown={() => handlePressStart(product)}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressEnd}
                  onTouchStart={() => handlePressStart(product)}
                  onTouchEnd={handlePressEnd}
                  className="flex flex-col border-r border-b border-[#E5E5E5] group cursor-pointer relative bg-[#FFFFFF]"
                >
                  {/* Square Aspect Ratio Image container */}
                  <div className="aspect-square w-full bg-[#eeeeed] overflow-hidden relative">
                    <ImageWithSkeleton src={product.images[0]} alt={product.name} className="w-full h-full" imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                    {/* Quick View Overlay Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#111111] text-[10px] font-bold uppercase tracking-widest w-8 h-8 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex items-center justify-center shadow-sm pointer-events-auto hover:bg-[#111111] hover:text-white"
                      title="Quick View"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                  {/* Info Details Section */}
                  <div className="p-3 md:p-4 flex flex-col gap-0.5 bg-[#FFFFFF] relative z-10 transition-colors group-hover:bg-[#F9F9F8]">
                    {product.brand && (
                      <span className="text-[9px] font-bold text-[#8B8B8A] uppercase tracking-wider">{product.brand}</span>
                    )}
                    <h2 className="text-[12px] md:text-[13px] text-[#111111] truncate">{product.name}</h2>
                    <p className="font-serif text-[15px] font-bold text-[#111111] mt-1">{CURRENCY}{product.price.toFixed(2)}</p>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-2 text-center py-20 px-4 bg-white border-b border-[#E5E5E5]"
              >
                <p className="text-[15px] text-[#8B8B8A]">No items found match your curated parameters.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length > displayLimit && (
            <motion.div
              onViewportEnter={() => setDisplayLimit((prev) => prev + 6)}
              className="col-span-2 flex justify-center items-center py-16 bg-[#F9F9F8] border-b border-[#E5E5E5]"
            >
              <div className="w-6 h-6 border-2 border-[#111111]/20 border-t-[#111111] rounded-full animate-spin" />
            </motion.div>
          )}

          {filtered.length > 0 && filtered.length <= displayLimit && (
            <article className="flex flex-col bg-[#FFFFFF] relative w-full items-center justify-center p-12 select-none text-center col-span-2">
              <div className="w-1.5 h-1.5 bg-[#111111] rounded-full mb-3" />
              <h3 className="font-sans text-[11px] font-bold text-[#111111] uppercase tracking-widest mb-1.5">END OF RESULTS</h3>
              <p className="text-[11px] text-[#8B8B8A] uppercase tracking-widest">{filtered.length} ITEMS DISPLAYED</p>
            </article>
          )}
        </div>
      </main>

      {/* Quick View Modal Overlay */}
      {quickViewProduct && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#111111]/50 backdrop-blur-sm flex items-end sm:items-center sm:justify-center sm:p-6"
          onClick={() => setQuickViewProduct(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[88vh] overflow-hidden flex flex-col sm:flex-row pointer-events-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/95 backdrop-blur text-[#111111] rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-sm"
            >
              <X size={16} />
            </button>

            {/* Image section */}
            <div className="w-full sm:w-[45%] shrink-0 bg-[#eeeeed] relative overflow-hidden">
              <div className="aspect-[4/3] sm:aspect-auto sm:h-full w-full">
                <img
                  src={quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details section */}
            <div className="flex-1 p-4 sm:p-8 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col min-w-0 pr-3">
                  <span className="text-[10px] font-bold text-[#8B8B8A] uppercase tracking-wider mb-1">
                    {quickViewProduct.brand || quickViewProduct.category}
                  </span>
                  <h3 className="font-serif text-[18px] sm:text-[24px] font-bold text-[#111111] leading-tight">
                    {quickViewProduct.name}
                  </h3>
                </div>
                <span className="font-serif text-[16px] sm:text-[20px] font-bold text-[#111111] shrink-0">
                  {CURRENCY}{quickViewProduct.price.toFixed(2)}
                </span>
              </div>

              <p className="text-[13px] sm:text-[14px] text-[#555555] line-clamp-3 sm:line-clamp-4 mb-4 sm:mb-6">
                {quickViewProduct.description}
              </p>

              <div className="flex items-center justify-between border-t border-[#E5E5E5] pt-3 mt-auto">
                <span className="text-[10px] text-[#8B8B8A] uppercase tracking-widest font-bold">
                  {quickViewProduct.sizes.length} SIZES AVAILABLE
                </span>
                <button
                  onClick={() => {
                    setQuickViewProduct(null);
                    handleProductClick(quickViewProduct);
                  }}
                  className="text-[11px] font-bold uppercase tracking-widest text-[#111111] underline decoration-1 underline-offset-4 hover:text-[#4A5D23]"
                >
                  VIEW FULL DETAILS
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}
