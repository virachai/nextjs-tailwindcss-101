import type { LocaleCode } from '../../domain/entities/locale.entity';
import type { LocaleRepository } from '../../domain/repositories/locale.repository';

export class SwitchLocaleUseCase {
  constructor(private readonly localeRepository: LocaleRepository) {}

  execute(locale: LocaleCode) {
    if (!this.localeRepository.isValidLocale(locale)) {
      throw new Error(`Invalid locale: ${String(locale)}`);
    }

    this.localeRepository.setLocale(locale);
  }
}
