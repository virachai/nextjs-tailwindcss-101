import { getRequestConfig } from 'next-intl/server';

import { type LocaleCode, SUPPORTED_LOCALES } from '../../domain/entities/locale.entity';
import { routing } from './routing';

type Messages = Record<string, unknown>;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  const isValidLocale = SUPPORTED_LOCALES.some((l) => l.code === locale);

  if (!locale || !isValidLocale) {
    locale = routing.defaultLocale;
  }

  const messagesModule = (await import(`../../../../../messages/${locale}.json`)) as {
    default: Messages;
  };

  return {
    locale: locale as LocaleCode,
    messages: messagesModule.default,
  };
});
