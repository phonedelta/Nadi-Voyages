import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import messages from "./translations.json";
export type Language = "fr" | "en" | "ar";
type Localized = { fr: string; en: string; ar: string };
export const storage = {
  get: (key: string, session = false) => {
    try {
      return (session ? sessionStorage : localStorage).getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string, session = false) => {
    try {
      (session ? sessionStorage : localStorage).setItem(key, value);
    } catch {
      /* Private browsing may disable storage. */
    }
  },
  remove: (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* Storage optional. */
    }
  },
};
const Context = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  list: (key: string) => string[];
  l: (value: Localized) => string;
} | null>(null);
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = storage.get("nadi-lang");
    return saved === "en" || saved === "fr" ? saved : "ar";
  });
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    storage.set("nadi-lang", lang);
  }, [lang]);
  const dictionary = messages[lang] as Record<string, string | string[]>;
  const value = {
    lang,
    setLang,
    t: (key: string) =>
      typeof dictionary[key] === "string" ? (dictionary[key] as string) : key,
    list: (key: string) =>
      Array.isArray(dictionary[key]) ? (dictionary[key] as string[]) : [],
    l: (text: Localized) => text[lang],
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLanguage() {
  const value = useContext(Context);
  if (!value) throw Error("LanguageProvider required");
  return value;
}
