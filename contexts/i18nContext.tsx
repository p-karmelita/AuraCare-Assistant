import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

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
  const [translations, setTranslations] = useState<Translations>({});
  const [defaultTranslations, setDefaultTranslations] = useState<Translations>({});

  // Fetch default English translations on mount
  useEffect(() => {
    fetch('/locales/en.json')
      .then(response => response.json())
      .then(data => setDefaultTranslations(data))
      .catch(error => console.error('Failed to load default translations:', error));
  }, []);

  // Fetch translations for the current locale when it changes
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';

    fetch(`/locales/${locale}.json`)
      .then(response => response.json())
      .then(data => setTranslations(data))
      .catch(error => {
        console.error(`Failed to load translations for ${locale}:`, error);
        setTranslations({}); // Fallback to empty if load fails
      });
  }, [locale]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    // Use loaded translations for the current locale, fallback to English, then to the key itself
    let translation = translations[key] || defaultTranslations[key] || key;
    
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
      });
    }
    return translation;
  }, [translations, defaultTranslations]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};
