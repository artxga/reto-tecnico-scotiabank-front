"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { es } from "@/locales/es";
import { en } from "@/locales/en";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang === "es" || savedLang === "en") {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en" || browserLang === "es") {
        setLanguageState(browserLang as Language);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    window.dispatchEvent(new Event("language-change"));
  };

  const t = (key: string, variables?: Record<string, string | number>) => {
    const dictionary = language === "en" ? en : es;

    // Support nested keys like "settings.profile.title"
    const keys = key.split(".");
    let value: unknown = dictionary;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined) {
      return key; // Fallback to key itself if not found
    }

    let text = String(value);

    // Replace variables like {count} or {requester}
    if (variables) {
      Object.entries(variables).forEach(([k, val]) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), String(val));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback implementation for tests or standalone usage
    const tFallback = (key: string, variables?: Record<string, string | number>) => {
      const dictionary = es;
      const keys = key.split(".");
      let value: unknown = dictionary;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          value = undefined;
          break;
        }
      }

      if (value === undefined) {
        return key;
      }

      let text = String(value);
      if (variables) {
        Object.entries(variables).forEach(([k, val]) => {
          text = text.replace(new RegExp(`{_${k}_|{${k}}`, "g"), String(val));
        });
      }
      return text;
    };

    return {
      language: "es" as Language,
      setLanguage: () => {},
      t: tFallback,
    };
  }
  return context;
}
