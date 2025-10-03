# Path Aliases Guide - Airbnb Style

## Overview

This guide demonstrates how to use path aliases in the project, following Airbnb engineering best practices for clean, maintainable imports.

## Current Path Alias Configuration

### Configured Aliases ([tsconfig.json](../../tsconfig.json:21-26))

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],              // Root alias (general use)
      "@/core/*": ["./src/core/*"],    // Core utilities & config
      "@/features/*": ["./src/features/*"],  // Feature modules
      "@/shared/*": ["./src/shared/*"] // Shared components & utils
    }
  }
}
```

### ESLint Import Resolver ([.eslintrc.json](../../.eslintrc.json:36-44))

```json
{
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  }
}
```

---

## Import Rules (Airbnb Standard)

### Rule 1: Use Aliases for Cross-Feature/Cross-Layer Imports

**✅ DO:**
```typescript
// ✅ Importing from different features
import { LocaleSwitcher } from '@/features/i18n';
import { ThemeProvider } from '@/features/theme';

// ✅ Importing shared components
import { Button } from '@/shared/components/Button';
import { useDebounce } from '@/shared/hooks/use-debounce';

// ✅ Importing core utilities
import { API_URL } from '@/core/config/env';
import { ROUTES } from '@/core/constants/routes';
```

**❌ DON'T:**
```typescript
// ❌ Relative paths across features
import { LocaleSwitcher } from '../../../features/i18n/presentation/components/locale-switcher';

// ❌ Relative paths across layers
import { Button } from '../../../shared/components/Button';
```

---

### Rule 2: Use Relative Imports Within Same Feature/Module

**✅ DO:**
```typescript
// features/i18n/presentation/components/locale-switcher.tsx

// ✅ Relative import within same feature
import { useLocaleSwitcher } from '../hooks/use-locale-switcher';
import { LocaleSwitcherButton } from './LocaleSwitcherButton';

// ✅ Alias for domain/application layers (different layer)
import { type LocaleCode } from '@/features/i18n';
```

**❌ DON'T:**
```typescript
// ❌ Using alias within same feature for nearby files
import { useLocaleSwitcher } from '@/features/i18n/presentation/hooks/use-locale-switcher';
import { LocaleSwitcherButton } from '@/features/i18n/presentation/components/LocaleSwitcherButton';
```

---

### Rule 3: Barrel Exports (index.ts) for Public API

**✅ DO:**

**Feature barrel export** ([features/i18n/index.ts](../../src/features/i18n/index.ts)):
```typescript
// features/i18n/index.ts
export type { LocaleCode, Locale } from './domain/entities/locale.entity';
export { LocaleSwitcher } from './presentation/components/locale-switcher';
export { useLocaleSwitcher } from './presentation/hooks/use-locale-switcher';
```

**Usage**:
```typescript
// ✅ Import from barrel (public API)
import { LocaleSwitcher, LocaleCode } from '@/features/i18n';
```

**❌ DON'T:**
```typescript
// ❌ Deep imports bypass encapsulation
import { LocaleSwitcher } from '@/features/i18n/presentation/components/locale-switcher';
import { LocaleCode } from '@/features/i18n/domain/entities/locale.entity';

// ❌ Export everything in barrel (leak internal implementation)
export * from './infrastructure/repositories/next-locale.repository'; // NO!
```

---

## Alias Usage by Layer

### 1. Domain Layer (Pure, No Imports)

```typescript
// features/i18n/domain/entities/locale.entity.ts
export type LocaleCode = 'en' | 'th';

export interface Locale {
  code: LocaleCode;
  name: string;
}

// ✅ NO imports needed (pure domain logic)
```

---

### 2. Application Layer (Imports from Domain Only)

```typescript
// features/i18n/application/use-cases/switch-locale.use-case.ts

// ✅ Relative import from domain (same feature)
import { type LocaleCode } from '../../domain/entities/locale.entity';
import { type LocaleRepository } from '../../domain/repositories/locale.repository';

export class SwitchLocaleUseCase {
  constructor(private readonly repository: LocaleRepository) {}

  execute(locale: LocaleCode) {
    this.repository.setLocale(locale);
  }
}
```

---

### 3. Infrastructure Layer (Implements Domain)

```typescript
// features/i18n/infrastructure/repositories/next-locale.repository.ts

// ✅ Framework imports (infrastructure layer)
import { useParams, useRouter } from 'next/navigation';

// ✅ Relative imports from domain (same feature)
import { type LocaleCode } from '../../domain/entities/locale.entity';
import { type LocaleRepository } from '../../domain/repositories/locale.repository';

export class NextLocaleRepository implements LocaleRepository {
  // implementation...
}
```

---

### 4. Presentation Layer (UI Components)

```typescript
// features/i18n/presentation/components/locale-switcher.tsx
'use client';

import type React from 'react'; // ✅ External library

// ✅ Relative import (same feature, same layer)
import { useLocaleSwitcher } from '../hooks/use-locale-switcher';

// ✅ Alias import for other features
import { Button } from '@/shared/components/Button';

export const LocaleSwitcher: React.FC = () => {
  const { switchLocale } = useLocaleSwitcher();
  return <Button onClick={() => switchLocale('th')}>Thai</Button>;
};
```

---

## Import Order (Enforced by Prettier)

Prettier is configured with `@trivago/prettier-plugin-sort-imports` to automatically sort imports.

### Standard Import Order

```typescript
// 1. React/Next.js core (framework)
import React from 'react';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';

// 2. Third-party libraries
import { clsx } from 'clsx';
import { format } from 'date-fns';

// 3. Type imports (from aliases)
import type { LocaleCode } from '@/features/i18n';
import type { User } from '@/features/auth';

// 4. Alias imports (grouped by alias)
import { LocaleSwitcher } from '@/features/i18n';
import { ThemeProvider } from '@/features/theme';
import { Button } from '@/shared/components/Button';
import { API_URL } from '@/core/config/env';

// 5. Relative imports (same feature/module)
import { useLocaleSwitcher } from '../hooks/use-locale-switcher';
import { LocaleSwitcherButton } from './LocaleSwitcherButton';

// 6. Styles (always last)
import styles from './LocaleSwitcher.module.css';
```

### Prettier Configuration (package.json)

```json
{
  "devDependencies": {
    "@trivago/prettier-plugin-sort-imports": "^5.2.2",
    "prettier": "^3.6.2",
    "prettier-plugin-tailwindcss": "^0.6.14"
  }
}
```

**Create `.prettierrc.json`** (recommended):
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "importOrder": [
    "^react$",
    "^next/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/types/(.*)$",
    "^@/core/(.*)$",
    "^@/features/(.*)$",
    "^@/shared/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  "plugins": [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ]
}
```

---

## Common Patterns & Examples

### Pattern 1: Feature Component Using Multiple Features

```typescript
// app/[locale]/layout.tsx

import type { Metadata } from 'next';

import { Geist, Geist_Mono as GeistMono } from 'next/font/google';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

// ✅ Import from feature barrels
import { LocaleSwitcher, routing } from '@/features/i18n';
import { ThemeProvider, ThemeToggle } from '@/features/theme';

import '../globals.css'; // ✅ Relative for local styles

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <ThemeToggle />
          <LocaleSwitcher />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Pattern 2: Custom Hook Using Use Cases

```typescript
// features/i18n/presentation/hooks/use-locale-switcher.ts
'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

// ✅ Relative imports from same feature
import { GetCurrentLocaleUseCase } from '../../application/use-cases/get-current-locale.use-case';
import { SwitchLocaleUseCase } from '../../application/use-cases/switch-locale.use-case';
import { SUPPORTED_LOCALES, type LocaleCode } from '../../domain/entities/locale.entity';
import { NextLocaleRepository } from '../../infrastructure/repositories/next-locale.repository';

export const useLocaleSwitcher = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const repository = useMemo(
    () => new NextLocaleRepository(params, pathname, router),
    [params, pathname, router]
  );

  const switchLocaleUseCase = useMemo(
    () => new SwitchLocaleUseCase(repository),
    [repository]
  );

  return {
    currentLocale: repository.getCurrentLocale(),
    locales: SUPPORTED_LOCALES,
    switchLocale: (locale: LocaleCode) => switchLocaleUseCase.execute(locale),
  };
};
```

---

### Pattern 3: Shared Component with Dependencies

```typescript
// shared/components/Button/Button.tsx

import type React from 'react';

import clsx from 'clsx';

// ✅ Import shared utilities with alias
import { useDebounce } from '@/shared/hooks/use-debounce';

// ✅ Relative import for local styles
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  const debouncedClick = useDebounce(onClick, 300);

  return (
    <button
      type="button"
      onClick={debouncedClick}
      className={clsx(styles.button, styles[variant])}
    >
      {children}
    </button>
  );
};
```

---

### Pattern 4: Page Component Using Features

```typescript
// app/[locale]/page.tsx

import { useTranslations } from 'next-intl';
import Image from 'next/image';

// ✅ Import shared components
import { Card } from '@/shared/components/Card';
import { Container } from '@/shared/components/Container';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <Container>
      <Card>
        <h1>{t('title')}</h1>
        <Image src="/logo.svg" alt={t('logoAlt')} width={200} height={50} />
      </Card>
    </Container>
  );
}
```

---

## Advanced: Adding New Aliases

### Step 1: Update tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/core/*": ["./src/core/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/lib/*": ["./src/lib/*"],        // ✅ New alias
      "@/types/*": ["./src/types/*"]     // ✅ New alias
    }
  }
}
```

### Step 2: Update ESLint Config (if using import restrictions)

```json
{
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  }
}
```

### Step 3: Update Prettier Import Order

```json
{
  "importOrder": [
    "^react$",
    "^next/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/types/(.*)$",        // ✅ New
    "^@/lib/(.*)$",          // ✅ New
    "^@/core/(.*)$",
    "^@/features/(.*)$",
    "^@/shared/(.*)$",
    "^[./]"
  ]
}
```

### Step 4: Restart TypeScript Server (VSCode)

```
Cmd+Shift+P → TypeScript: Restart TS Server
```

---

## Troubleshooting

### Issue 1: Alias Not Resolving

**Solution**: Check tsconfig.json paths and restart TS server

```bash
# Restart TypeScript server in VSCode
Cmd+Shift+P → TypeScript: Restart TS Server

# Verify TypeScript can resolve paths
pnpm type-check
```

---

### Issue 2: ESLint Import Errors

**Error**: `Unable to resolve path to module '@/features/i18n'`

**Solution**: Ensure `eslint-import-resolver-typescript` is configured

```json
{
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  }
}
```

---

### Issue 3: Prettier Not Sorting Imports

**Solution**: Verify Prettier config and plugins

```bash
# Check Prettier plugins are installed
pnpm list @trivago/prettier-plugin-sort-imports

# Create .prettierrc.json with importOrder config
```

---

### Issue 4: Next.js Build Errors

**Error**: `Module not found: Can't resolve '@/features/i18n'`

**Solution**: Ensure Next.js recognizes TypeScript paths

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next.js automatically reads tsconfig.json paths
  // No additional config needed for path aliases
};

export default nextConfig;
```

---

## Best Practices (Airbnb Style)

### ✅ DO

1. **Use barrel exports (index.ts) for public APIs**
   ```typescript
   // features/i18n/index.ts
   export { LocaleSwitcher } from './presentation/components/locale-switcher';
   ```

2. **Use aliases for cross-feature imports**
   ```typescript
   import { LocaleSwitcher } from '@/features/i18n';
   ```

3. **Use relative imports within same feature**
   ```typescript
   import { useLocaleSwitcher } from '../hooks/use-locale-switcher';
   ```

4. **Group imports by source (framework → library → alias → relative)**
   ```typescript
   import React from 'react';
   import { clsx } from 'clsx';
   import { Button } from '@/shared/components/Button';
   import { helper } from './helper';
   ```

5. **Keep paths consistent across team**
   - Document alias conventions
   - Enforce with ESLint rules
   - Use code reviews

### ❌ DON'T

1. **Don't use deep imports**
   ```typescript
   // ❌ Bad
   import { LocaleSwitcher } from '@/features/i18n/presentation/components/locale-switcher';
   ```

2. **Don't mix alias and relative for same location**
   ```typescript
   // ❌ Bad (inconsistent)
   import { useLocaleSwitcher } from '@/features/i18n/presentation/hooks/use-locale-switcher';
   import { LocaleSwitcherButton } from './LocaleSwitcherButton';
   ```

3. **Don't create aliases for every folder**
   ```json
   // ❌ Too many aliases
   {
     "@/components/buttons/*": ["./src/components/buttons/*"],
     "@/components/forms/*": ["./src/components/forms/*"],
     "@/components/modals/*": ["./src/components/modals/*"]
   }
   ```

4. **Don't bypass encapsulation**
   ```typescript
   // ❌ Importing internal implementation
   import { NextLocaleRepository } from '@/features/i18n/infrastructure/repositories/next-locale.repository';
   ```

---

## Quick Reference

| Import Type | When to Use | Example |
|------------|-------------|---------|
| **Framework** | React, Next.js core | `import { useRouter } from 'next/navigation'` |
| **Library** | Third-party packages | `import { clsx } from 'clsx'` |
| **@/features** | Cross-feature imports | `import { LocaleSwitcher } from '@/features/i18n'` |
| **@/shared** | Shared components/hooks | `import { Button } from '@/shared/components/Button'` |
| **@/core** | App config/constants | `import { API_URL } from '@/core/config/env'` |
| **Relative** | Same feature/module | `import { helper } from './helper'` |

---

## VSCode Settings (Recommended)

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "editor.codeActionsOnSave": {
    "source.organizeImports": false,
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## Summary

✅ **Configured Aliases**:
- `@/*` → Root src
- `@/core/*` → Core utilities
- `@/features/*` → Feature modules
- `@/shared/*` → Shared components

✅ **Import Strategy**:
- Use aliases for cross-feature/cross-layer
- Use relative within same feature
- Export public API via barrel (index.ts)
- Enforce with ESLint + Prettier

✅ **Airbnb Standards**:
- Consistent import ordering
- No deep imports
- Encapsulation via barrels
- Clear separation of concerns
