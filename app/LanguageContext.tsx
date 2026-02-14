import React, { createContext, useContext, useState } from 'react';

type LanguageContextType = {
  sourceLang: string;
  setSourceLang: (value: string) => void;
  targetLang: string;
  setTargetLang: (value: string) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  sourceLang: 'en',
  setSourceLang: () => {},
  targetLang: 'es',
  setTargetLang: () => {},
});

type Props = { children: React.ReactNode };
export function LanguageProvider({ children }: Props) {
  const [sourceLang, setSourceLang] = useState<string>('en');
  const [targetLang, setTargetLang] = useState<string>('es');
  return (
    <LanguageContext.Provider value={{ sourceLang, setSourceLang, targetLang, setTargetLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Default export for Expo Router
export default LanguageProvider;

export function useLanguage() {
  return useContext(LanguageContext);
}
