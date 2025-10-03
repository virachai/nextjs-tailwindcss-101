# Project Structure Rules

## Overview

Enterprise-grade structure rules for Next.js + DDD/Clean Architecture, inspired by Airbnb, Google, and Meta engineering practices.

## Core Principles

1. **Feature-Based Organization** - Group by business capability, not technical type
2. **Layer Separation** - Clear boundaries between Domain, Application, Infrastructure, Presentation
3. **Dependency Rules** - Dependencies point inward (outer layers depend on inner)
4. **Scalability** - Easy to add features without refactoring
5. **Discoverability** - Consistent patterns for finding code

---

## Directory Structure Rules

### ✅ Rule 1: Feature-First Organization

**DO**:

```
src/
├── features/              # ✅ Group by business domain
│   ├── i18n/
│   ├── theme/
│   ├── auth/
│   └── user-profile/
```

**DON'T**:

```
src/
├── components/            # ❌ Technical grouping
├── hooks/
├── utils/
└── services/
```

**Rationale**: Feature-based structure scales better, reduces cognitive load, and enables team autonomy.

---

### ✅ Rule 2: Strict Layer Hierarchy

**Required Structure** (every feature):

```
features/[feature-name]/
├── domain/                # ✅ REQUIRED: Business logic
│   ├── entities/          # Core objects with identity
│   ├── value-objects/     # Immutable objects (optional)
│   └── repositories/      # Interface contracts
│
├── application/           # ✅ REQUIRED: Use cases
│   ├── use-cases/         # Business operations
│   └── services/          # Cross-use-case logic (optional)
│
├── infrastructure/        # ✅ REQUIRED: External concerns
│   ├── repositories/      # Implementations
│   ├── api/               # API clients (optional)
│   └── config/            # Framework configs (optional)
│
├── presentation/          # ✅ REQUIRED: UI layer
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks
│   └── view-models/       # Presentation state (optional)
│
└── index.ts               # ✅ REQUIRED: Public API
```

**Enforcement**:

- Linter should error if layers are missing
- Pre-commit hook validates structure

---

### ✅ Rule 3: Single Responsibility Per File

**DO**:

```typescript
// ✅ locale.entity.ts - Only entity definition
export type LocaleCode = 'en' | 'th';
export interface Locale {
  code: LocaleCode;
  name: string;
}

// ✅ locale.repository.ts - Only repository interface
export interface ILocaleRepository {
  getCurrentLocale(): LocaleCode;
}
```

**DON'T**:

```typescript
// ❌ locale.ts - Multiple responsibilities
export type LocaleCode = 'en' | 'th';
export interface Locale {}
export interface ILocaleRepository {}
export class LocaleService {} // ❌ Mixed concerns
```

---

### ✅ Rule 4: Barrel Exports (index.ts)

**DO**:

```typescript
// features/i18n/index.ts
// ✅ Export only public API
export type { LocaleCode, Locale } from './domain/entities/locale.entity';
export { LocaleSwitcher } from './presentation/components/LocaleSwitcher';
export { useLocaleSwitcher } from './presentation/hooks/use-locale-switcher';

// ❌ Do NOT export internal implementations
// export { NextLocaleRepository } from './infrastructure/...'; // ❌
```

**Usage**:

```typescript
// ✅ Clean imports
import { LocaleSwitcher, useLocaleSwitcher } from '@/features/i18n';

// ❌ Deep imports (violates encapsulation)
import { LocaleSwitcher } from '@/features/i18n/presentation/components/LocaleSwitcher';
```

---

### ✅ Rule 5: Dependency Direction

**Rule**: Dependencies MUST flow inward

```
┌─────────────────────────────────────┐
│       Presentation Layer            │
│    ✓ Can import: Application        │
│    ✗ Cannot import: Infrastructure  │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│      Application Layer              │
│    ✓ Can import: Domain             │
│    ✗ Cannot import: Infrastructure  │
│    ✗ Cannot import: Presentation    │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│        Domain Layer                 │
│    ✗ Cannot import: ANY OTHER LAYER │
└─────────────────────────────────────┘
              ▲
┌─────────────┴───────────────────────┐
│    Infrastructure Layer             │
│    ✓ Can import: Domain             │
│    ✗ Cannot import: Application     │
│    ✗ Cannot import: Presentation    │
└─────────────────────────────────────┘
```

**Enforcement**:

```typescript
// ESLint rule (see setup section)
"@typescript-eslint/no-restricted-imports": [
  "error",
  {
    "patterns": [
      {
        "group": ["**/infrastructure/**"],
        "importNames": ["*"],
        "message": "Domain cannot import from Infrastructure"
      }
    ]
  }
]
```

---

### ✅ Rule 6: Domain Layer Purity

**DO**:

```typescript
// ✅ domain/entities/locale.entity.ts
// Pure TypeScript, no framework dependencies
export type LocaleCode = 'en' | 'th';

export interface Locale {
  code: LocaleCode;
  name: string;
  validate(): boolean; // ✅ Business logic
}

export const DEFAULT_LOCALE: LocaleCode = 'en';
```

**DON'T**:

```typescript
// ❌ domain/entities/locale.entity.ts
// ❌ Framework import
import React from 'react';

import { useRouter } from 'next/navigation';

// ❌ Framework import

export interface Locale {
  component: React.FC; // ❌ UI concern in domain
}
```

---

### ✅ Rule 7: Use Case Naming

**Pattern**: `{Verb}{Noun}.use-case.ts`

**DO**:

```
application/use-cases/
├── get-current-locale.use-case.ts       # ✅
├── switch-locale.use-case.ts            # ✅
├── validate-locale.use-case.ts          # ✅
└── fetch-supported-locales.use-case.ts  # ✅
```

**DON'T**:

```
application/use-cases/
├── locale.ts                            # ❌ No verb
├── getCurrentLocale.ts                  # ❌ camelCase
├── locale-getter.use-case.ts            # ❌ Noun-Verb order
└── useCase.ts                           # ❌ Generic name
```

---

### ✅ Rule 8: Repository Naming

**Pattern**: `{Entity}.repository.ts` for interface, `{Framework}{Entity}.repository.ts` for implementation

**DO**:

```
# Interface
domain/repositories/
└── locale.repository.ts                 # ✅

# Implementation
infrastructure/repositories/
└── next-locale.repository.ts            # ✅ (Next.js implementation)
└── api-locale.repository.ts             # ✅ (API implementation)
```

**DON'T**:

```
domain/repositories/
└── ILocaleRepository.ts                 # ❌ Capital "I" prefix
└── LocaleRepo.ts                        # ❌ Abbreviated

infrastructure/repositories/
└── locale-repository-impl.ts            # ❌ Generic "impl"
└── LocaleRepository.ts                  # ❌ Same name as interface
```

---

### ✅ Rule 9: Component Co-location

**DO**: Keep related files together

```
presentation/components/LocaleSwitcher/
├── LocaleSwitcher.tsx                   # ✅ Main component
├── LocaleSwitcher.test.tsx              # ✅ Tests
├── LocaleSwitcher.stories.tsx           # ✅ Storybook (optional)
├── LocaleSwitcher.module.css            # ✅ Styles (if needed)
├── LocaleSwitcherButton.tsx             # ✅ Sub-component
└── index.ts                             # ✅ Re-export

# OR simpler (preferred for small components):
presentation/components/
└── LocaleSwitcher.tsx                   # ✅ Single file
```

**DON'T**: Separate by type

```
presentation/
├── components/
│   └── LocaleSwitcher.tsx               # ❌
├── tests/
│   └── LocaleSwitcher.test.tsx          # ❌ Separated
├── stories/
│   └── LocaleSwitcher.stories.tsx       # ❌ Separated
└── styles/
    └── LocaleSwitcher.module.css        # ❌ Separated
```

---

### ✅ Rule 10: Shared Code Structure

**DO**:

```
src/
├── shared/                              # ✅ Cross-feature utilities
│   ├── components/                      # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   ├── hooks/                           # Utility hooks
│   │   ├── use-debounce.ts
│   │   └── use-local-storage.ts
│   ├── utils/                           # Pure functions
│   │   ├── format-date.ts
│   │   └── validate-email.ts
│   └── types/                           # Shared types
│       └── common.types.ts
│
├── core/                                # ✅ App-wide configuration
│   ├── config/
│   │   ├── env.ts                       # Environment variables
│   │   └── app.config.ts                # App constants
│   └── constants/
│       └── routes.ts                    # Route definitions
```

**DON'T**:

```
src/
├── utils/                               # ❌ Too generic
├── helpers/                             # ❌ Vague
├── common/                              # ❌ Ambiguous
└── lib/                                 # ❌ Unclear purpose
```

---

### ✅ Rule 11: Test File Placement

**DO**: Co-locate with source

```
features/i18n/
├── domain/
│   └── entities/
│       ├── locale.entity.ts             # ✅ Source
│       └── locale.entity.test.ts        # ✅ Test alongside
├── application/
│   └── use-cases/
│       ├── switch-locale.use-case.ts    # ✅ Source
│       └── switch-locale.use-case.test.ts # ✅ Test alongside
```

**DON'T**: Separate test directory

```
features/i18n/
├── domain/
│   └── entities/
│       └── locale.entity.ts
└── __tests__/                           # ❌ Separated
    └── locale.entity.test.ts
```

**Exception**: E2E tests can be separate

```
tests/
└── e2e/
    └── locale-switching.e2e.ts          # ✅ OK for E2E
```

---

### ✅ Rule 12: Configuration Files

**DO**: Centralize infrastructure configs

```
features/i18n/
└── infrastructure/
    └── config/
        ├── routing.ts                   # ✅ next-intl routing
        ├── request.ts                   # ✅ next-intl request config
        └── middleware.ts                # ✅ Middleware (if complex)
```

**DON'T**: Mix with business logic

```
features/i18n/
├── domain/
│   └── routing.config.ts                # ❌ Config in domain
└── application/
    └── next-intl.config.ts              # ❌ Framework config in application
```

---

## File Size Limits

| File Type | Max Lines | Rationale                       |
| --------- | --------- | ------------------------------- |
| Component | 300       | Split into sub-components       |
| Hook      | 150       | Extract logic to use cases      |
| Use Case  | 100       | Single Responsibility Principle |
| Entity    | 200       | Extract value objects           |
| Utility   | 50        | One function per file preferred |

**Enforcement**:

```json
// .eslintrc.json
{
  "rules": {
    "max-lines": [
      "error",
      {
        "max": 300,
        "skipBlankLines": true,
        "skipComments": true
      }
    ]
  }
}
```

---

## Import Order Rules

**Required Order** (enforced by Prettier):

```typescript
// 1. React/Next.js core
import React from 'react';

import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { clsx } from 'clsx';
import { format } from 'date-fns';

// 3. Alias imports (@/*)
import type { LocaleCode } from '@/features/i18n';

import { Button } from '@/shared/components/Button';

import styles from './LocaleSwitcher.module.css';
// 4. Relative imports
import { LocaleSwitcherButton } from './LocaleSwitcherButton';
```

**Configuration** (already in [.prettierrc](../../.prettierrc)):

```json
{
  "importOrder": [
    "^react$",
    "^next/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/utils/(.*)$",
    "^@/services/(.*)$",
    "^@/stores/(.*)$",
    "^@/components/(.*)$",
    "^@/app/(.*)$",
    "^[./]"
  ]
}
```

---

## Path Alias Rules

**Configured Aliases** (in [tsconfig.json](../../tsconfig.json)):

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/core/*": ["./src/core/*"],
    "@/features/*": ["./src/features/*"],
    "@/shared/*": ["./src/shared/*"]
  }
}
```

**DO**:

```typescript
// ✅ Use aliases for cross-feature imports
import { API_URL } from '@/core/config/env';

import { LocaleSwitcher } from '@/features/i18n';

import { Button } from '@/shared/components/Button';

import { useLocaleSwitcher } from '../hooks/use-locale-switcher';
// ✅ Use relative for same-feature imports
import { LocaleSwitcherButton } from './LocaleSwitcherButton';
```

**DON'T**:

```typescript
// ❌ Deep imports violate encapsulation
import { NextLocaleRepository } from '@/features/i18n/infrastructure/repositories/next-locale.repository';

// ❌ Relative imports across features
import { ThemeToggle } from '../../../theme/presentation/components/ThemeToggle';
```

---

## Type Definition Rules

### ✅ Rule 13: Interface vs Type

**Use Interface** when:

- Defining object shapes
- Need to extend/implement
- Repository/Service contracts

```typescript
// ✅ Interface for objects
export interface Locale {
  code: LocaleCode;
  name: string;
}

// ✅ Interface for contracts
export interface ILocaleRepository {
  getCurrentLocale(): LocaleCode;
}
```

**Use Type** when:

- Union types
- Primitive aliases
- Mapped types

```typescript
// ✅ Type for unions
export type LocaleCode = 'en' | 'th';

// ✅ Type for primitives
export type UserId = string;

// ✅ Type for mapped types
export type Readonly<T> = { readonly [K in keyof T]: T[K] };
```

---

### ✅ Rule 14: Type File Organization

**DO**: Group related types

```typescript
// locale.types.ts
export type LocaleCode = 'en' | 'th';
export type LocaleDirection = 'ltr' | 'rtl';

export interface LocaleMetadata {
  code: LocaleCode;
  direction: LocaleDirection;
}
```

**DON'T**: One file per type

```
domain/types/
├── locale-code.type.ts                  # ❌ Too granular
├── locale-direction.type.ts             # ❌ Too granular
└── locale-metadata.type.ts              # ❌ Too granular
```

---

## Documentation Rules

### ✅ Rule 15: Required Documentation

**Must Document**:

````typescript
// ✅ Public API (exported from index.ts)
/**
 * Switches the application locale.
 *
 * @param locale - The target locale code
 * @throws {Error} If locale is invalid
 *
 * @example
 * ```ts
 * switchLocale('th'); // Switch to Thai
 * ```
 */
export function switchLocale(locale: LocaleCode): void;

// ✅ Complex business logic
/**
 * Validates locale code against supported locales.
 * Performs case-insensitive comparison.
 */
function validateLocale(locale: string): boolean;
````

**Optional Documentation**:

```typescript
// ✓ Simple, self-explanatory functions
export function getCurrentLocale(): LocaleCode {
  return currentLocale;
}
```

---

## Checklist: Adding New Feature

```markdown
- [ ] Create feature directory: `features/[feature-name]/`
- [ ] Add layer directories:
  - [ ] `domain/entities/`
  - [ ] `domain/repositories/`
  - [ ] `application/use-cases/`
  - [ ] `infrastructure/repositories/`
  - [ ] `presentation/components/`
  - [ ] `presentation/hooks/`
- [ ] Define entities (domain layer)
- [ ] Define repository interfaces (domain layer)
- [ ] Implement use cases (application layer)
- [ ] Implement repositories (infrastructure layer)
- [ ] Create components (presentation layer)
- [ ] Create hooks (presentation layer)
- [ ] Create barrel export (`index.ts`)
- [ ] Write unit tests (co-located with source)
- [ ] Update path aliases (if needed)
- [ ] Document public API
```

---

## Enforcement Tools

### 1. ESLint Configuration

See [.eslintrc.json](../../.eslintrc.json) for full config.

Key rules:

```json
{
  "rules": {
    "max-lines": ["error", 300],
    "max-lines-per-function": ["error", 50],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "import/no-restricted-paths": [
      "error",
      {
        "zones": [
          {
            "target": "./src/features/*/domain",
            "from": "./src/features/*/infrastructure"
          }
        ]
      }
    ]
  }
}
```

### 2. Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate structure
npm run validate:structure

# Run linter
npm run lint

# Run tests
npm run test
```

### 3. Structure Validation Script

```json
// package.json
{
  "scripts": {
    "validate:structure": "node scripts/validate-structure.js"
  }
}
```

```javascript
// scripts/validate-structure.js
const fs = require('fs');
const path = require('path');

const REQUIRED_LAYERS = ['domain', 'application', 'infrastructure', 'presentation'];
const FEATURES_DIR = path.join(__dirname, '../src/features');

// Validate each feature has required layers
fs.readdirSync(FEATURES_DIR).forEach((feature) => {
  REQUIRED_LAYERS.forEach((layer) => {
    const layerPath = path.join(FEATURES_DIR, feature, layer);
    if (!fs.existsSync(layerPath)) {
      throw new Error(`Missing ${layer} layer in feature: ${feature}`);
    }
  });

  // Validate index.ts exists
  const indexPath = path.join(FEATURES_DIR, feature, 'index.ts');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Missing index.ts in feature: ${feature}`);
  }
});

console.log('✅ Structure validation passed');
```

---

## Migration Strategy

### Phase 1: New Features (Immediate)

- All new features MUST follow structure
- Use feature template/generator

### Phase 2: Existing Features (Gradual)

- Refactor during feature updates
- No need to refactor stable features

### Phase 3: Shared Code (Planned)

- Extract common components to `shared/`
- Consolidate utilities

---

## Summary

| Rule                  | Description                                          | Enforcement            |
| --------------------- | ---------------------------------------------------- | ---------------------- |
| Feature-First         | Group by business domain                             | Directory structure    |
| Layer Hierarchy       | domain → application → infrastructure → presentation | ESLint import rules    |
| Single Responsibility | One concern per file                                 | Code review            |
| Barrel Exports        | Public API via index.ts                              | Linter + code review   |
| Dependency Direction  | Inner layers independent                             | ESLint import rules    |
| Domain Purity         | No framework in domain                               | ESLint import rules    |
| Use Case Naming       | {Verb}{Noun}.use-case.ts                             | File naming convention |
| Co-location           | Tests with source                                    | Directory structure    |
| Type Placement        | Interfaces in domain                                 | Directory structure    |
| Import Order          | Consistent ordering                                  | Prettier               |

---

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
