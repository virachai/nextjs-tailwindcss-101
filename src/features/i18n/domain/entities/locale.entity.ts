export type LocaleCode = 'en' | 'th';

export interface Locale {
  code: LocaleCode;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LOCALES: Locale[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    direction: 'ltr',
  },
] as const;

export const DEFAULT_LOCALE: LocaleCode = 'en';
