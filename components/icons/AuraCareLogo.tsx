
import React from 'react';

export const AuraCareLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" {...props}>
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow)" opacity="0.3">
      <path d="M32 4C47.464 4 60 16.536 60 32S47.464 60 32 60 4 47.464 4 32 16.536 4 32 4z" />
    </g>
    <path fillRule="evenodd" clipRule="evenodd" d="M32 10c12.15 0 22 9.85 22 22s-9.85 22-22 22S10 44.15 10 32 19.85 10 32 10zm-4.728 12.272a1.5 1.5 0 012.122 0l4.596 4.596a1.5 1.5 0 010 2.122L29.4 33.586a1.5 1.5 0 01-2.122 0l-4.596-4.596a1.5 1.5 0 010-2.122l4.596-4.596zM28 32a1.5 1.5 0 011.5-1.5h5a1.5 1.5 0 010 3h-5A1.5 1.5 0 0128 32zm8.596-4.596a1.5 1.5 0 012.122 0l4.596 4.596a1.5 1.5 0 010 2.122L40.728 38.72a1.5 1.5 0 01-2.122 0l-4.596-4.596a1.5 1.5 0 010-2.122l4.596-4.596z" opacity="0.7" />
    <path d="M30.5 24h3v3h-3v-3zm0 9h3v3h-3v-3zm-9-4.5h3v3h-3v-3zm18 0h3v3h-3v-3z" />
  </svg>
);
