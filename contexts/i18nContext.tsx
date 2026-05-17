import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '../locales/en.json';
import de from '../locales/de.json';
import ar from '../locales/ar.json';

type Locale = 'en' | 'de' | 'ar';
type Translations = { [key: string]: string };

const allTranslations: Record<Locale, Translations> = {
  en: en as Translations,
  de: de as Translations,
  ar: ar as Translations,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  // Update document language and direction
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    // Access translations directly from the imported objects
    const translations = allTranslations[locale];
    let translation = translations[key] || (allTranslations['en'] as Translations)[key] || key;
    
    if (replacements && typeof translation === 'string') {
      Object.keys(replacements).forEach(placeholder => {
        translation = (translation as string).replace(`{{${placeholder}}}`, String(replacements[placeholder]));
      });
    }
    return translation;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};
