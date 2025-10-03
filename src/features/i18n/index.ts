// Domain
export * from './domain/entities/locale.entity';
export type { LocaleRepository } from './domain/repositories/locale.repository';

// Application
export { GetCurrentLocaleUseCase } from './application/use-cases/get-current-locale.use-case';
export { SwitchLocaleUseCase } from './application/use-cases/switch-locale.use-case';

// Infrastructure
export { NextLocaleRepository } from './infrastructure/repositories/next-locale.repository';
export { routing } from './infrastructure/config/routing';

// Presentation
export { LocaleSwitcher } from './presentation/components/locale-switcher';
export { useLocaleSwitcher } from './presentation/hooks/use-locale-switcher';
