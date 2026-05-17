import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { allTranslations } from '../locales/translations';

type Locale = 'en' | 'de' | 'ar';
type Translations = { [key: string]: string };

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
    // Access translations directly from the imported objects, handling potential .default wrapper
    const translationsObj = allTranslations[locale];
    const translations = (translationsObj?.default || translationsObj || {}) as Translations;
    
    const englishTranslationsObj = allTranslations['en'];
    const englishTranslations = (englishTranslationsObj?.default || englishTranslationsObj || {}) as Translations;

    let translation = translations[key] || englishTranslations[key] || key;
    
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
