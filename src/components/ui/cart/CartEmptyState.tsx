interface CartEmptyStateProps {
  onClose: () => void;
}

export default function CartEmptyState({ onClose }: CartEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center flex-grow">
      <div className="w-14 h-14 border-2 border-dashed border-[#E5E5E5] flex items-center justify-center mb-3 text-[#8B8B8A] text-[22px]">
        👜
      </div>
      <h3 className="font-serif text-[16px] font-bold text-[#111111] uppercase tracking-tight mb-2">
        Your bag is empty
      </h3>
      <p className="text-[12px] text-[#8B8B8A] max-w-[220px] mb-5 leading-relaxed">
        Fill it with our curated, high-contrast minimal garments.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-3 bg-[#111111] text-white text-[11px] font-semibold uppercase tracking-widest cursor-pointer rounded-lg hover:bg-[#333333] active:scale-95 transition-all shadow-md"
      >
        KEEP BROWSING
      </button>
    </div>
  );
}
