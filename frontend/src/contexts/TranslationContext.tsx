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
      console.log(
        `[TranslationContext] Fetching translations for locale: ${targetLocale}`
      );
      const response = await apiClient.instance.get<Translations>(
        `/i18n/translations?locale=${targetLocale}`
      );
      console.log(`[TranslationContext] Received translations:`, response.data);
      const newTranslations = response.data || {};
      console.log(
        `[TranslationContext] Setting translations with keys:`,
        Object.keys(newTranslations)
      );
      setTranslations(newTranslations);
      setTranslationVersion((prev) => {
        const newVersion = prev + 1;
        console.log(
          `[TranslationContext] Translation version updated to: ${newVersion}`
        );
        return newVersion;
      }); // Force re-render
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, targetLocale);
      }
    } catch (error: any) {
      console.error(
        `[TranslationContext] Failed to load translations for locale ${targetLocale}:`,
        error
      );
      console.error(
        `[TranslationContext] Error details:`,
        error.response?.data || error.message
      );
      // Don't set empty object, keep previous translations if available
      // setTranslations({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(
      `[TranslationContext] useEffect triggered - Locale: ${locale}, fetching translations...`
    );
    fetchTranslations(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]); // fetchTranslations is stable, so we can safely omit it

  const t = useCallback(
    (key: string, fallback: string = ""): string => {
      const keys = key.split(".");
      let value: any = translations;

      console.log(
        `[TranslationContext.t] Called with key: ${key}, locale: ${locale}, translations keys:`,
        Object.keys(translations)
      );

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          // If translation not found and we have translations loaded, log it
          if (Object.keys(translations).length > 0) {
            console.warn(
              `[TranslationContext] Translation key not found: ${key} (locale: ${locale}, version: ${translationVersion})`
            );
          }
          return fallback || key;
        }
      }
      const result = typeof value === "string" ? value : fallback || key;
      console.log(`[TranslationContext.t] Key: ${key} -> Result: ${result}`);
      return result;
    },
    [translations, locale, translationVersion]
  );

  const changeLocale = useCallback(
    (newLocale: Locale) => {
      console.log(
        `[TranslationContext] changeLocale called with: ${newLocale}`
      );
      if (newLocale !== locale) {
        setLocale(newLocale);
        // fetchTranslations will be called by useEffect when locale changes
      } else {
        console.log(
          `[TranslationContext] Locale is already ${newLocale}, skipping update`
        );
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

  console.log(
    `[TranslationContext] Rendering provider - locale: ${locale}, version: ${translationVersion}, translations count: ${
      Object.keys(translations).length
    }`
  );

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}
