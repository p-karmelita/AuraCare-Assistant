import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const UKFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 60 30" {...props}>
     <clipPath id="uk-clip"><path d="M0 0v30h60V0z"/></clipPath>
     <path d="M0 0v30h60V0z" fill="#00247d"/>
     <g clipPath="url(#uk-clip)">
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
        <path d="M0 0l60 30m0-30L0 30" stroke="#cf142b" strokeWidth="4"/>
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30 0v30M0 15h60" stroke="#cf142b" strokeWidth="6"/>
     </g>
  </svg>
);

const DEFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 5 3" {...props}>
        <rect width="5" height="3" y="0" fill="#000"/>
        <rect width="5" height="2" y="1" fill="#D00"/>
        <rect width="5" height="1" y="2" fill="#FFCE00"/>
    </svg>
);

const SAFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 36 24" {...props}>
        <rect width="36" height="24" fill="#006c35"/>
        <path d="M6 18 L 30 18 L 29 17 L 7 17 Z" fill="#fff"/>
        <path d="M28 17 L 28 16 L 27 16 L 27 15 L 29 15 L 29 17 Z" fill="#fff"/>
    </svg>
);

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useTranslations();

  const languages = [
    { code: 'en' as const, Icon: UKFlagIcon, name: 'English' },
    { code: 'de' as const, Icon: DEFlagIcon, name: 'Deutsch' },
    { code: 'ar' as const, Icon: SAFlagIcon, name: 'العربية' },
  ];

  return (
    <div className="flex items-center space-x-3">
      {languages.map(({ code, Icon, name }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`rounded-sm overflow-hidden transition-all duration-200 focus:outline-none ${
            locale === code 
              ? 'opacity-100 ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-900' 
              : 'opacity-50 hover:opacity-100 focus:ring-2 focus:ring-cyan-400/50'
          }`}
          aria-label={`Switch to ${name}`}
          title={name}
        >
          <Icon className="w-6 h-auto block" />
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
