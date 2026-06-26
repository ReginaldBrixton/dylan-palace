export default function PageSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#F9F9F8] animate-pulse select-none">
      {/* Skeleton Header */}
      <div className="fixed top-0 left-0 w-full h-[52px] bg-white/90 backdrop-blur-xl border-b border-[#E5E5E5]/50 flex items-center justify-between px-4 z-50">
        <div className="w-6 h-6 bg-[#E5E5E5] rounded-md" />
        <div className="h-4 w-28 bg-[#E5E5E5] rounded-full" />
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-[#E5E5E5] rounded-full" />
          <div className="w-5 h-5 bg-[#E5E5E5] rounded-full" />
        </div>
      </div>

      {/* Skeleton Content Area */}
      <div className="pt-[52px] px-4 pb-32">
        {/* Hero Banner Skeleton */}
        <div className="w-full h-[50vh] bg-[#E5E5E5]/60 rounded-2xl mb-6" />

        {/* Section Title Skeleton */}
        <div className="h-6 w-48 bg-[#E5E5E5] rounded-full mb-4" />

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-square w-full bg-[#E5E5E5]/50 rounded-xl" />
              <div className="h-2 w-1/3 bg-[#E5E5E5] rounded-full" />
              <div className="h-3 w-3/4 bg-[#E5E5E5] rounded-full" />
              <div className="h-3 w-1/4 bg-[#E5E5E5] rounded-full" />
            </div>
          ))}
        </div>

        {/* Interactive Section Skeleton */}
        <div className="w-full h-[200px] bg-[#E5E5E5]/40 rounded-2xl mb-6" />

        {/* Second Product Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-square w-full bg-[#E5E5E5]/50 rounded-xl" />
              <div className="h-2 w-1/3 bg-[#E5E5E5] rounded-full" />
              <div className="h-3 w-3/4 bg-[#E5E5E5] rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full h-[72px] bg-white/90 backdrop-blur-xl border-t border-[#E5E5E5]/50 flex items-center justify-around px-4 z-50">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 bg-[#E5E5E5] rounded-md" />
            <div className="h-2 w-12 bg-[#E5E5E5] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
