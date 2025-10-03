'use client';

import type React from 'react';

import { useLocaleSwitcher } from '../hooks/use-locale-switcher';

export const LocaleSwitcher: React.FC = () => {
  const { currentLocale, locales, switchLocale } = useLocaleSwitcher();

  return (
    <div className="fixed top-24 right-8 z-50 flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale.code}
          type="button"
          onClick={() => {
            switchLocale(locale.code);
          }}
          className={`hover:bg-foreground/10 border-foreground/10 flex h-12 min-w-[80px] items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-200 ${
            currentLocale === locale.code
              ? 'bg-foreground text-background hover:bg-foreground/90'
              : 'bg-background text-foreground hover:border-foreground/20'
          } `}
          aria-label={`Switch to ${locale.name}`}
          aria-current={currentLocale === locale.code ? 'true' : 'false'}
        >
          <span className="text-lg" aria-hidden="true">
            {locale.flag}
          </span>
          <span className="font-semibold">{locale.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};
