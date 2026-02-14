
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const translations = {
  en: {
    settings: 'Settings',
    terms: 'Terms and Conditions',
    privacy: 'Privacy Policy',
    support: 'Support',
    upgrade: 'Upgrade to Pro',
    changeLanguage: 'Change App Language',
    trademark: '© whiskey-code 2026',
  },
  es: {
    settings: 'Configuración',
    terms: 'Términos y condiciones',
    privacy: 'Política de privacidad',
    support: 'Soporte',
    upgrade: 'Actualizar a Pro',
    changeLanguage: 'Cambiar idioma de la aplicación',
    trademark: '© whiskey-code 2026',
  },
};

const LocaleContext = createContext({
  locale: 'en',
  setLocale: (locale: string) => {},
  t: (key: string) => key,
});

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const t = useCallback(
    (key: string) => translations[locale]?.[key] || translations['en'][key] || key,
    [locale]
  );
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
