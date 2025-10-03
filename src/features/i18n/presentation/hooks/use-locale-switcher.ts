'use client';

import { useMemo } from 'react';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { GetCurrentLocaleUseCase } from '../../application/use-cases/get-current-locale.use-case';
import { SwitchLocaleUseCase } from '../../application/use-cases/switch-locale.use-case';
import { type LocaleCode, SUPPORTED_LOCALES } from '../../domain/entities/locale.entity';
import { NextLocaleRepository } from '../../infrastructure/repositories/next-locale.repository';

export const useLocaleSwitcher = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const repository = useMemo(
    () => new NextLocaleRepository(params, pathname, router),
    [params, pathname, router]
  );

  const getCurrentLocaleUseCase = useMemo(
    () => new GetCurrentLocaleUseCase(repository),
    [repository]
  );

  const switchLocaleUseCase = useMemo(() => new SwitchLocaleUseCase(repository), [repository]);

  const currentLocale = getCurrentLocaleUseCase.execute();
  const locales = SUPPORTED_LOCALES;

  const switchLocale = (locale: LocaleCode) => {
    switchLocaleUseCase.execute(locale);
  };

  return {
    currentLocale,
    locales,
    switchLocale,
  };
};
