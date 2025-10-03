import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../../domain/entities/locale.entity';

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES.map((locale) => locale.code),
  defaultLocale: DEFAULT_LOCALE,
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
