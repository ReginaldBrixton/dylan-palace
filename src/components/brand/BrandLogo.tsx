import React from 'react';

export interface BrandLogoProps {
  variant?: 'wordmark' | 'monogram' | 'symbol';
  tone?: 'dark' | 'light';
  className?: string;
  title?: string;
}

export default function BrandLogo({
  variant = 'wordmark',
  tone = 'dark',
  className = '',
  title = "Dylan's Palace",
}: BrandLogoProps) {
  const color = tone === 'light' ? '#ffffff' : 'currentColor';

  if (variant === 'wordmark') {
    return (
      <svg
        viewBox="0 0 286 42"
        role="img"
        aria-label={title}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 35V7h10.4c10.2 0 16.7 5.2 16.7 13.9C31.1 29.8 24.3 35 14 35H4Zm7-5.8h3.3c6.1 0 9.7-2.8 9.7-8.2 0-5.3-3.6-8.1-9.7-8.1H11v16.3Z" fill={color}/>
        <path d="m31.8 7 9.5 17.3V35h7V24.3L57.8 7H50l-5.2 10.8L39.6 7h-7.8ZM61.6 35V7h7v22.1h12.7V35H61.6ZM84.8 35 95.4 7h7.9L114 35h-7.4l-1.8-5.4H93.6L91.8 35h-7Zm10.7-11h7.4l-3.7-11-3.7 11ZM117.3 35V7h6.4l12.7 16.7V7h6.8v28H137l-12.9-16.9V35h-6.8ZM149.6 18l2.2-11h6.9l-4 11h-5.1ZM168.1 35.6c-6.8 0-11.8-3.2-13.6-8.2l6.1-2.8c1.2 3.3 4 5.2 7.8 5.2 3.1 0 5-1.1 5-3 0-1.8-1.2-2.6-4.8-3.5l-3.8-1c-5.8-1.5-8.5-4-8.5-8.1 0-4.9 4.4-7.8 11-7.8 6 0 10.1 2.5 12.2 6.6l-5.7 3c-1.2-2.6-3.5-4-6.8-4-2.7 0-4.3 1-4.3 2.6 0 1.5 1.2 2.4 4.6 3.2l4.1 1c5.7 1.4 8.5 4.1 8.5 8.2 0 5.4-4.7 8.6-11.8 8.6ZM187 35V7h11.2c7.1 0 11.5 3.6 11.5 9.5 0 6.1-4.4 9.8-11.5 9.8H194V35h-7Zm7-14.4h3.7c3.3 0 5-1.4 5-4.1 0-2.5-1.7-3.8-5-3.8H194v7.9ZM207.4 35 218 7h7.9l10.7 28h-7.4l-1.8-5.4h-11.2l-1.8 5.4h-7Zm10.7-11h7.4l-3.7-11-3.7 11ZM239.9 35V7h7v22.1h12.7V35h-19.7ZM258.9 35 269.5 7h7.9L288 35h-7.4l-1.8-5.4H267l-1.8 5.4h-6.3Zm10-11h7.4l-3.7-11-3.7 11Z" fill={color}/>
      </svg>
    );
  }

  if (variant === 'monogram') {
    return (
      <svg viewBox="0 0 64 64" role="img" aria-label={title} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="60" height="60" rx="16" stroke={color} strokeWidth="2"/>
        <path d="M17 45V19h9.5c9.2 0 15.1 4.8 15.1 13s-5.9 13-15.1 13H17Zm6.3-5.5h3.3c5.4 0 8.5-2.5 8.5-7.5s-3.1-7.5-8.5-7.5h-3.3v15Z" fill={color}/>
        <path d="M42.8 45V19H50c7 0 11 3.3 11 9 0 5.9-4 9.3-11 9.3h-1V45h-6.2Zm6.2-13h.8c3.2 0 4.9-1.3 4.9-3.9 0-2.4-1.7-3.7-4.9-3.7H49V32Z" fill={color}/>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={title} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 49h44" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <path d="M14 44V27l8 6 10-16 10 16 8-6v17H14Z" stroke={color} strokeWidth="3" strokeLinejoin="round"/>
      <path d="M22 44V33M32 44V26M42 44V33" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="32" cy="12" r="3" fill={color}/>
    </svg>
  );
}
