import React from 'react';

export const RocheLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" {...props}>
        <text x="0" y="30" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold" fill="currentColor">
            Roche
        </text>
    </svg>
);