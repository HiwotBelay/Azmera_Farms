import { Controller, Get, Query, Param } from '@nestjs/common';
import { I18nService, SupportedLocale } from './i18n.service';

@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('locales')
  getSupportedLocales(): { locales: SupportedLocale[]; default: SupportedLocale } {
    return {
      locales: this.i18nService.getSupportedLocales(),
      default: this.i18nService.getDefaultLocale(),
    };
  }

  @Get('translations')
  getTranslations(@Query('locale') locale?: string): Record<string, any> {
    const validLocale = this.validateLocale(locale);
    return this.i18nService.getTranslations(validLocale);
  }

  @Get('translate/:key')
  translate(
    @Param('key') key: string,
    @Query('locale') locale?: string,
  ): { key: string; translation: string; locale: SupportedLocale } {
    const validLocale = this.validateLocale(locale);
    return {
      key,
      translation: this.i18nService.translate(key, validLocale),
      locale: validLocale,
    };
  }

  private validateLocale(locale?: string): SupportedLocale {
    if (locale && ['en', 'am'].includes(locale)) {
      return locale as SupportedLocale;
    }
    return this.i18nService.getDefaultLocale();
  }
}

