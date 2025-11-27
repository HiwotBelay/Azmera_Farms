'use client';

type Locale = 'en' | 'am';

class I18n {
  private locale: Locale = 'en';
  private translations: Record<Locale, Record<string, any>> = {
    en: {},
    am: {},
  };

  constructor() {
    // Load saved locale from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale') as Locale;
      if (saved && (saved === 'en' || saved === 'am')) {
        this.locale = saved;
      }
      // Load translations on initialization
      this.loadTranslations();
    }
  }

  async loadTranslations() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      
      // Load English translations
      const enResponse = await fetch(`${apiUrl}/i18n/translations?locale=en`);
      if (enResponse.ok) {
        this.translations.en = await enResponse.json();
      }

      // Load Amharic translations
      const amResponse = await fetch(`${apiUrl}/i18n/translations?locale=am`);
      if (amResponse.ok) {
        this.translations.am = await amResponse.json();
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  setLocale(locale: Locale) {
    this.locale = locale;
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale);
      // Trigger a custom event to notify components
      window.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }));
    }
  }

  getLocale(): Locale {
    return this.locale;
  }

  t(key: string, fallback?: string): string {
    const keys = key.split('.');
    let value: any = this.translations[this.locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        if (this.locale !== 'en') {
          value = this.translations.en;
          for (const k2 of keys) {
            if (value && typeof value === 'object' && k2 in value) {
              value = value[k2];
            } else {
              return fallback || key;
            }
          }
        } else {
          return fallback || key;
        }
      }
    }

    return typeof value === 'string' ? value : fallback || key;
  }
}

export const i18n = new I18n();

