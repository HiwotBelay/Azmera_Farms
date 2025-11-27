import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type SupportedLocale = 'en' | 'am';

@Injectable()
export class I18nService {
  private translations: Map<SupportedLocale, Record<string, any>> = new Map();
  private defaultLocale: SupportedLocale = 'en';

  constructor() {
    this.loadTranslations();
  }

  private loadTranslations(): void {
    const locales: SupportedLocale[] = ['en', 'am'];
    
    // Try multiple paths to handle both development and production
    const possiblePaths = [
      path.join(__dirname, 'locales'), // Production (dist)
      path.join(__dirname, '..', '..', 'src', 'common', 'i18n', 'locales'), // Development
      path.join(process.cwd(), 'src', 'common', 'i18n', 'locales'), // Alternative
    ];

    locales.forEach((locale) => {
      let loaded = false;
      for (const localesPath of possiblePaths) {
        try {
          const filePath = path.join(localesPath, `${locale}.json`);
          if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            this.translations.set(locale, JSON.parse(fileContent));
            loaded = true;
            break;
          }
        } catch (error) {
          // Try next path
          continue;
        }
      }
      
      if (!loaded) {
        console.warn(`Failed to load translations for locale: ${locale}, using empty object`);
        // Fallback to empty object if file doesn't exist
        this.translations.set(locale, {});
      }
    });
  }

  translate(key: string, locale: SupportedLocale = this.defaultLocale): string {
    const translations = this.translations.get(locale) || this.translations.get(this.defaultLocale) || {};
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to default locale if key not found
        if (locale !== this.defaultLocale) {
          return this.translate(key, this.defaultLocale);
        }
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  }

  getTranslations(locale: SupportedLocale = this.defaultLocale): Record<string, any> {
    return this.translations.get(locale) || this.translations.get(this.defaultLocale) || {};
  }

  getSupportedLocales(): SupportedLocale[] {
    return ['en', 'am'];
  }

  setDefaultLocale(locale: SupportedLocale): void {
    if (this.getSupportedLocales().includes(locale)) {
      this.defaultLocale = locale;
    }
  }

  getDefaultLocale(): SupportedLocale {
    return this.defaultLocale;
  }
}

