
import en from './en.json';
import de from './de.json';
import ar from './ar.json';

export const allTranslations = {
  en: (en as any).default || en,
  de: (de as any).default || de,
  ar: (ar as any).default || ar,
};
