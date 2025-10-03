import type { LocaleRepository } from '../../domain/repositories/locale.repository';

export class GetCurrentLocaleUseCase {
  constructor(private readonly localeRepository: LocaleRepository) {}

  execute() {
    return this.localeRepository.getCurrentLocale();
  }
}
