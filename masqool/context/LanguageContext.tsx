'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation, TranslationKey, Lang } from '@/data/translations';

interface LanguageContextType {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  t: (key: TranslationKey) => string;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  dir: 'rtl',
  t: (key) => key,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const toggleLang = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));

  const t = (key: TranslationKey) => getTranslation(key, lang);

  return (
    <LanguageContext.Provider value={{ lang, dir, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

