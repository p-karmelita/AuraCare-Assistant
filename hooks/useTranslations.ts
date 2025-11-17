
import { useContext } from 'react';
import { I18nContext } from '../contexts/i18nContext';

export const useTranslations = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within an I18nProvider');
  }
  return context;
};
