import type { LocaleCode } from '../entities/locale.entity';

export interface LocaleRepository {
  getCurrentLocale(): LocaleCode;
  setLocale(locale: LocaleCode): void;
  isValidLocale(locale: string): locale is LocaleCode;
}
