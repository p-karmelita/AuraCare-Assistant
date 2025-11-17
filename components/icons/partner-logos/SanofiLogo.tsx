import React from 'react';

export const SanofiLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="10" cy="20" r="4" fill="currentColor"/>
        <text x="22" y="30" fontFamily="Arial, sans-serif" fontSize="30" fontWeight="bold" fill="currentColor">
            SANOFI
        </text>
    </svg>
);