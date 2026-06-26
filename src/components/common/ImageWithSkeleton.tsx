import { useState } from 'react';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  imgClassName?: string;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = '',
  loading = 'lazy',
  imgClassName = '',
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur skeleton background while loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-[#E5E5E5] animate-pulse z-0 pointer-events-none" />
      )}
      {error && (
        <div className="absolute inset-0 bg-[#F4F4F3] flex items-center justify-center z-0 pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 border border-[#D5D5D4] rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B8B8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>
        </div>
      )}
      <img
        alt={alt}
        className={`${imgClassName} transition-all duration-700 ${
          loaded && !error
            ? 'opacity-100 blur-0 scale-100'
            : 'opacity-0 blur-xl scale-105'
        } ${!loaded && !error ? 'absolute' : ''}`}
        src={src}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading={loading}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
