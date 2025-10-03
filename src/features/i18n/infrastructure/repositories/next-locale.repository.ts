'use client';

import { useParams, useRouter } from 'next/navigation';

import { type LocaleCode, SUPPORTED_LOCALES } from '../../domain/entities/locale.entity';
import type { LocaleRepository } from '../../domain/repositories/locale.repository';

export class NextLocaleRepository implements LocaleRepository {
  constructor(
    private readonly params: ReturnType<typeof useParams>,
    private readonly pathname: string,
    private readonly router: ReturnType<typeof useRouter>
  ) {}

  getCurrentLocale(): LocaleCode {
    const locale = this.params.locale as string;
    return this.isValidLocale(locale) ? locale : 'en';
  }

  setLocale(locale: LocaleCode): void {
    const currentLocale = this.getCurrentLocale();

    if (locale === currentLocale) return;

    // Replace current locale in pathname with new locale
    const newPathname = this.pathname.replace(`/${currentLocale}`, `/${locale}`);

    this.router.replace(newPathname);
  }

  // eslint-disable-next-line class-methods-use-this
  isValidLocale(locale: string): locale is LocaleCode {
    return SUPPORTED_LOCALES.some((l) => l.code === locale);
  }
}
