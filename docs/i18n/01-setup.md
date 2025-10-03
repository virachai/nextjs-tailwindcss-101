# Internationalization (i18n) Setup

## Overview

This project uses `next-intl` for internationalization, supporting English (en)
and Thai (th) locales.

## Architecture

### Core Files

```
src/
├── i18n/
│   ├── routing.ts       # Locale routing configuration
│   └── request.ts       # Request-level i18n config
├── middleware.ts        # i18n middleware for route handling
└── app/
    └── [locale]/        # Locale-based routing structure
        ├── layout.tsx   # Root layout with NextIntlClientProvider
        └── page.tsx     # Home page with translations

messages/
├── en.json             # English translations
└── th.json             # Thai translations

next.config.ts          # Next.js config with next-intl plugin
```

## Configuration

### 1. Routing Configuration ([src/i18n/routing.ts](../../src/i18n/routing.ts))

```typescript
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'th'],
  defaultLocale: 'en',
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

**Key Points:**

- Defines supported locales (`en`, `th`)
- Sets default locale to `en`
- Exports type-safe navigation utilities

### 2. Request Configuration ([src/i18n/request.ts](../../src/i18n/request.ts))

```typescript
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'en' | 'th')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

**Key Points:**

- Validates locale against supported locales
- Falls back to default locale for invalid locales
- Dynamically imports locale-specific message files

### 3. Middleware ([src/middleware.ts](../../src/middleware.ts))

```typescript
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(th|en)/:path*'],
};
```

**Key Points:**

- Handles locale detection and routing
- Matches root path and all locale-prefixed paths
- Redirects users to appropriate locale

### 4. Next.js Configuration ([next.config.ts](../../next.config.ts))

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
```

**Key Points:**

- Wraps Next.js config with `next-intl` plugin
- Points to request configuration file

## Usage

### In Server Components

```typescript
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('HomePage');

  return <h1>{t('title')}</h1>;
}
```

### In Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function ClientComponent() {
  const t = useTranslations('HomePage');

  return <p>{t('description')}</p>;
}
```

### Navigation

Use the navigation utilities from
[src/i18n/routing.ts](../../src/i18n/routing.ts):

```typescript
import { Link, useRouter } from '@/i18n/routing';

// Link component (automatically adds locale prefix)
<Link href="/about">About</Link>

// Router
const router = useRouter();
router.push('/contact');
```

## Message Files

### Structure

Messages are organized by namespace in JSON files:

**[messages/en.json](../../messages/en.json):**

```json
{
  "HomePage": {
    "title": "Next.js Logo",
    "getStarted": "Get started by editing",
    "saveChanges": "Save and see your changes instantly."
  }
}
```

**[messages/th.json](../../messages/th.json):**

```json
{
  "HomePage": {
    "title": "โลโก้ Next.js",
    "getStarted": "เริ่มต้นโดยการแก้ไข",
    "saveChanges": "บันทึกและดูการเปลี่ยนแปลงทันที"
  }
}
```

### Best Practices

1. **Namespace Organization**: Group related translations under namespaces
   (e.g., `HomePage`, `Navigation`)
2. **Key Naming**: Use camelCase for keys (`getStarted`, not `get_started`)
3. **Consistency**: Ensure all locales have the same keys
4. **Placeholders**: Use ICU message syntax for variables

Example with placeholders:

```json
{
  "welcome": "Hello {name}!"
}
```

```typescript
t('welcome', { name: 'John' }); // "Hello John!"
```

## URL Structure

- **Default locale (en)**: `https://example.com/` or `https://example.com/en`
- **Thai locale**: `https://example.com/th`
- **Nested routes**: `https://example.com/th/about`

## Type Safety

For TypeScript type safety, create a `messages.d.ts` file:

```typescript
type Messages = typeof import('./messages/en.json');

declare global {
  interface IntlMessages extends Messages {}
}
```

## Locale Switching

Implement a locale switcher component:

```typescript
'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const switchLocale = (locale: 'en' | 'th') => {
    router.replace(pathname, { ...params, locale });
  };

  return (
    <div>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('th')}>ไทย</button>
    </div>
  );
}
```

## Adding New Locales

1. Update [src/i18n/routing.ts](../../src/i18n/routing.ts):

   ```typescript
   locales: ['en', 'th', 'ja'],
   ```

2. Create message file: `messages/ja.json`

3. Update middleware matcher in [src/middleware.ts](../../src/middleware.ts):

   ```typescript
   matcher: ['/', '/(th|en|ja)/:path*'],
   ```

4. Add type checking in [src/i18n/request.ts](../../src/i18n/request.ts)

## Testing i18n

### Manual Testing

1. Visit `http://localhost:3000` (default: English)
2. Visit `http://localhost:3000/th` (Thai)
3. Verify translations load correctly
4. Test navigation between locales

### Automated Testing

```typescript
// Example with Jest/Testing Library
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/en.json';

test('renders translated content', () => {
  render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <Component />
    </NextIntlClientProvider>
  );

  expect(screen.getByText('Next.js Logo')).toBeInTheDocument();
});
```

## Performance Considerations

1. **Message Loading**: Messages are dynamically imported per locale (code
   splitting)
2. **Server-Side**: Translations happen on the server (no client-side overhead)
3. **Caching**: Next.js caches translated pages automatically

## Common Issues

### Issue: Locale not detected

**Solution**: Check middleware matcher configuration and ensure locale is in URL
path.

### Issue: Missing translations

**Solution**: Verify all locales have the same keys. Use TypeScript for
compile-time checks.

### Issue: Hydration mismatch

**Solution**: Ensure `suppressHydrationWarning` is set on `<html>` tag in
layout.

## References

- [next-intl Documentation](https://next-intl.dev/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Syntax](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
