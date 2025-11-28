"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { apiClient } from "@/lib/api-client";

type Locale = "en" | "am";

interface Translations {
  [key: string]: string | Translations;
}

interface TranslationContextType {
  t: (key: string, fallback?: string) => string;
  locale: Locale;
  changeLocale: (locale: Locale) => void;
  isLoading: boolean;
  translationVersion: number; // Add version to force re-renders
}

export const TranslationContext = createContext<
  TranslationContextType | undefined
>(undefined);

const LOCAL_STORAGE_LOCALE_KEY = "app_locale";
const DEFAULT_LOCALE: Locale = "en";

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY) as Locale) ||
        DEFAULT_LOCALE
      );
    }
    return DEFAULT_LOCALE;
  });
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);
  const [translationVersion, setTranslationVersion] = useState(0); // Force re-render counter

  const fetchTranslations = useCallback(async (targetLocale: Locale) => {
    try {
      setIsLoading(true);
      const response = await apiClient.instance.get<Translations>(
        `/i18n/translations?locale=${targetLocale}`
      );
      const newTranslations = response.data || {};
      if (Object.keys(newTranslations).length === 0) {
        console.warn(
          `[TranslationContext] No translations loaded for locale: ${targetLocale}. Check if backend is running and translation files exist.`
        );
      }
      setTranslations(newTranslations);
      setTranslationVersion((prev) => prev + 1);
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, targetLocale);
      }
    } catch (error: any) {
      console.error(
        `[TranslationContext] Failed to load translations for locale ${targetLocale}:`,
        error.response?.data || error.message
      );
      // Don't set empty object, keep previous translations if available
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTranslations(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const t = useCallback(
    (key: string, fallback: string = ""): string => {
      const keys = key.split(".");
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          // Only log missing translations in development mode
          if (
            process.env.NODE_ENV === "development" &&
            Object.keys(translations).length > 0
          ) {
            console.warn(
              `[TranslationContext] Missing translation: ${key} (locale: ${locale})`
            );
          }
          return fallback || key;
        }
      }
      return typeof value === "string" ? value : fallback || key;
    },
    [translations, locale, translationVersion]
  );

  const changeLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale !== locale) {
        setLocale(newLocale);
      }
    },
    [locale]
  );

  // Don't memoize - always create new object to force React to detect changes
  // This ensures all consumers re-render when any part of the context changes
  const contextValue = {
    t,
    locale,
    changeLocale,
    isLoading,
    translationVersion,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}
