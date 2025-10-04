// export type LocaleCode = 'en' | 'th';
// export interface Locale {
//   code: LocaleCode;
//   name: string;
//   nativeName: string;
//   flag: string;
//   direction: 'ltr' | 'rtl';
// }
// export const SUPPORTED_LOCALES: Locale[] = [
//   {
//     code: 'en',
//     name: 'English',
//     nativeName: 'English',
//     flag: '🇺🇸',
//     direction: 'ltr',
//   },
//   {
//     code: 'th',
//     name: 'Thai',
//     nativeName: 'ไทย',
//     flag: '🇹🇭',
//     direction: 'ltr',
//   },
// ] as const;
// export const DEFAULT_LOCALE: LocaleCode = 'en';
// import THFlagRaw from '@/../public/flags/th.svg';
// import USFlagRaw from '@/../public/flags/us.svg';
// const USFlag = USFlagRaw as React.FC<React.SVGProps<SVGSVGElement>>;
// const THFlag = THFlagRaw as React.FC<React.SVGProps<SVGSVGElement>>;
// export type LocaleCode = 'en' | 'th';
// export type TextDirection = 'ltr' | 'rtl';
// export interface Locale {
//   code: LocaleCode;
//   name: string;
//   nativeName: string;
//   flag: React.FC<React.SVGProps<SVGSVGElement>>;
//   direction: TextDirection;
// }
// // List of supported locales with relevant data and flags
// export const SUPPORTED_LOCALES: readonly Locale[] = [
//   {
//     code: 'en',
//     name: 'English',
//     nativeName: 'English',
//     flag: USFlag,
//     direction: 'ltr',
//   },
//   {
//     code: 'th',
//     name: 'Thai',
//     nativeName: 'ไทย',
//     flag: THFlag,
//     direction: 'ltr',
//   },
// ];

export type LocaleCode = 'en' | 'th';
export type TextDirection = 'ltr' | 'rtl';

export interface Locale {
  code: LocaleCode;
  name: string;
  nativeName: string;
  flag: string;
  direction: TextDirection;
}

export const SUPPORTED_LOCALES: readonly Locale[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '/flags/us.svg',
    direction: 'ltr',
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    flag: '/flags/th.svg',
    direction: 'ltr',
  },
];

export const DEFAULT_LOCALE: LocaleCode = 'en';
