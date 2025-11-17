import React from 'react';

export const BayerLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" {...props}>
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" fill="none" />
    <path d="M25,50 h50 M50,25 v50" stroke="currentColor" strokeWidth="15" />
  </svg>
);