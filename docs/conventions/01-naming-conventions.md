# Naming Conventions

## Overview

This document outlines naming standards inspired by leading tech companies (Airbnb, Google, Meta) to ensure consistency, readability, and maintainability across the codebase.

## Table of Contents

1. [File Naming](#file-naming)
2. [Directory Naming](#directory-naming)
3. [Variable & Function Naming](#variable--function-naming)
4. [Component Naming](#component-naming)
5. [Type & Interface Naming](#type--interface-naming)
6. [CSS Class Naming](#css-class-naming)
7. [Test File Naming](#test-file-naming)
8. [Constants & Enums](#constants--enums)

---

## File Naming

### TypeScript/JavaScript Files

| Type             | Convention              | Example                  | Notes                  |
| ---------------- | ----------------------- | ------------------------ | ---------------------- |
| React Components | **PascalCase** + `.tsx` | `LocaleSwitcher.tsx`     | Matches component name |
| Hooks            | **kebab-case** + `.ts`  | `use-locale-switcher.ts` | Prefix with `use-`     |
| Utilities        | **kebab-case** + `.ts`  | `format-date.ts`         | Descriptive verb       |
| Types/Interfaces | **kebab-case** + `.ts`  | `locale.types.ts`        | Suffix with `.types`   |
| Constants        | **kebab-case** + `.ts`  | `api-endpoints.ts`       | Plural if multiple     |
| Configs          | **kebab-case** + `.ts`  | `next.config.ts`         | Framework standard     |

### Special File Names

| Type                | Pattern           | Example                     |
| ------------------- | ----------------- | --------------------------- |
| Entities            | `*.entity.ts`     | `locale.entity.ts`          |
| Repositories        | `*.repository.ts` | `locale.repository.ts`      |
| Use Cases           | `*.use-case.ts`   | `switch-locale.use-case.ts` |
| Services            | `*.service.ts`    | `auth.service.ts`           |
| DTOs                | `*.dto.ts`        | `user-profile.dto.ts`       |
| Tests               | `*.test.ts[x]`    | `locale-switcher.test.tsx`  |
| Specs               | `*.spec.ts[x]`    | `locale-switcher.spec.tsx`  |
| Stories (Storybook) | `*.stories.tsx`   | `button.stories.tsx`        |

### Examples

```
✅ GOOD:
src/features/i18n/
├── domain/
│   ├── entities/
│   │   └── locale.entity.ts
│   └── repositories/
│       └── locale.repository.ts
├── application/
│   └── use-cases/
│       └── switch-locale.use-case.ts
├── presentation/
│   ├── components/
│   │   └── LocaleSwitcher.tsx
│   └── hooks/
│       └── use-locale-switcher.ts
└── index.ts

❌ BAD:
src/features/i18n/
├── domain/
│   ├── entities/
│   │   └── LocaleEntity.ts          ❌ Should be locale.entity.ts
│   └── repositories/
│       └── ILocaleRepository.ts     ❌ Should be locale.repository.ts
├── application/
│   └── usecases/                    ❌ Should be use-cases/
│       └── switchLocale.ts          ❌ Should be switch-locale.use-case.ts
├── components/
│   └── locale-switcher.tsx          ❌ Should be LocaleSwitcher.tsx
└── Index.ts                         ❌ Should be index.ts
```

---

## Directory Naming

### General Rules

| Type              | Convention                   | Example                                      |
| ----------------- | ---------------------------- | -------------------------------------------- |
| Features          | **kebab-case**, **singular** | `i18n/`, `theme/`, `auth/`                   |
| Layer folders     | **kebab-case**, **singular** | `domain/`, `application/`, `infrastructure/` |
| Shared utilities  | **kebab-case**, **plural**   | `hooks/`, `utils/`, `types/`                 |
| Component folders | **kebab-case**               | `locale-switcher/`                           |

### Feature Structure

```
✅ GOOD:
features/
├── i18n/                   # kebab-case, singular
├── theme/                  # kebab-case, singular
├── auth/                   # kebab-case, singular
└── user-profile/           # kebab-case with hyphen

❌ BAD:
features/
├── I18N/                   ❌ Uppercase
├── Themes/                 ❌ Plural
├── authentication/         ❌ Too long, use auth
└── userProfile/            ❌ camelCase, use user-profile
```

### Layer Structure

```
✅ GOOD:
features/i18n/
├── domain/
│   ├── entities/           # Plural
│   ├── value-objects/      # Plural with hyphen
│   └── repositories/       # Plural
├── application/
│   └── use-cases/          # Plural with hyphen
├── infrastructure/
│   ├── repositories/       # Plural
│   ├── api/                # Singular
│   └── config/             # Singular
└── presentation/
    ├── components/         # Plural
    ├── hooks/              # Plural
    └── view-models/        # Plural with hyphen

❌ BAD:
features/i18n/
├── Domain/                 ❌ PascalCase
├── Applications/           ❌ Plural layer name
├── infra/                  ❌ Abbreviated
└── ui/                     ❌ Use presentation
```

---

## Variable & Function Naming

### Variables

```typescript
// ✅ GOOD: camelCase, descriptive
const currentLocale = 'en';
const isLoading = false;
const userProfile = { name: 'John' };
const itemCount = 10;

// ❌ BAD
const CurrentLocale = 'en'; // ❌ PascalCase for variable
const is_loading = false; // ❌ snake_case
const usr = { name: 'John' }; // ❌ Abbreviated
const cnt = 10; // ❌ Unclear abbreviation
```

### Functions

```typescript
// ✅ GOOD: camelCase, verb prefix
function getCurrentLocale(): LocaleCode {}
function switchLocale(locale: LocaleCode): void {}
function formatDate(date: Date): string {}
function validateEmail(email: string): boolean {}
function handleClick(): void {}

// ❌ BAD
function GetCurrentLocale() {} // ❌ PascalCase
function locale_switch() {} // ❌ snake_case
function locale() {} // ❌ No verb
function doStuff() {} // ❌ Vague
```

### Boolean Variables

```typescript
// ✅ GOOD: Prefix with is/has/should/can
const isLoading = true;
const hasError = false;
const shouldRedirect = true;
const canEdit = false;
const isDisabled = true;

// ❌ BAD
const loading = true; // ❌ No prefix
const error = false; // ❌ Not boolean-like
const redirect = true; // ❌ Unclear
```

### Arrays & Collections

```typescript
// ✅ GOOD: Plural nouns
const locales = ['en', 'th'];
const users = [{ name: 'John' }];
const errorMessages = ['Error 1', 'Error 2'];

// ❌ BAD
const localeList = ['en', 'th']; // ❌ Redundant "List"
const userArray = [{ name: 'John' }]; // ❌ Redundant "Array"
const locale = ['en', 'th']; // ❌ Should be plural
```

### Handler Functions

```typescript
// ✅ GOOD: Prefix with handle/on
const handleClick = () => {};
const handleSubmit = () => {};
const onLocaleChange = (locale: LocaleCode) => {};
const onError = (error: Error) => {};

// ❌ BAD
const click = () => {}; // ❌ No prefix
const doSubmit = () => {}; // ❌ Use handle/on
const localeChange = () => {}; // ❌ No prefix
```

---

## Component Naming

### React Components

```typescript
// ✅ GOOD: PascalCase, descriptive
export const LocaleSwitcher: React.FC = () => {};
export const ThemeToggle: React.FC = () => {};
export const UserProfileCard: React.FC = () => {};
export const NavigationMenu: React.FC = () => {};

// ❌ BAD
export const localeSwitcher = () => {}; // ❌ camelCase
export const locale_switcher = () => {}; // ❌ snake_case
export const LS = () => {}; // ❌ Abbreviated
export const Switcher = () => {}; // ❌ Too generic
```

### Component Files

```typescript
// ✅ GOOD: File name matches component name
// LocaleSwitcher.tsx
export const LocaleSwitcher: React.FC = () => { };

// ❌ BAD
// locale-switcher.tsx
export const LocaleSwitcher: React.FC = () => { };  // ❌ Mismatch
```

### Higher-Order Components (HOC)

```typescript
// ✅ GOOD: Prefix with "with"
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {};

export const withLocale = <P extends object>(Component: React.ComponentType<P>) => {};

// ❌ BAD
export const authHOC = () => {}; // ❌ No "with" prefix
export const AuthWrapper = () => {}; // ❌ Use "with" prefix
```

### Render Props Components

```typescript
// ✅ GOOD: Descriptive, ending in "Renderer" or using render prop
<DataFetcher
  render={(data) => <div>{data}</div>}
/>

// ✅ GOOD: Render prop pattern
const LocaleRenderer: React.FC<{
  render: (locale: LocaleCode) => React.ReactNode;
}> = ({ render }) => { };

// ❌ BAD
const RenderData = () => { };              // ❌ Unclear purpose
```

---

## Type & Interface Naming

### Interfaces

```typescript
// ✅ GOOD: PascalCase, prefix with "I" for repository/service interfaces
export interface ILocaleRepository {}
export interface IAuthService {}
export interface IUserRepository {}

// ✅ GOOD: No prefix for data interfaces
export interface Locale {}
export interface User {}
export interface Theme {}

// ❌ BAD
export interface localeRepository {} // ❌ camelCase
export interface locale_repository {} // ❌ snake_case
export interface ILocale {} // ❌ "I" prefix for data interface
```

### Type Aliases

```typescript
// ✅ GOOD: PascalCase
export type LocaleCode = 'en' | 'th';
export type ThemeMode = 'light' | 'dark';
export type UserId = string;

// ❌ BAD
export type localeCode = 'en' | 'th'; // ❌ camelCase
export type LOCALE_CODE = 'en' | 'th'; // ❌ UPPER_CASE
```

### Generics

```typescript
// ✅ GOOD: Single uppercase letter or descriptive PascalCase
function identity<T>(value: T): T { }
function merge<TSource, TTarget>(source: TSource, target: TTarget) { }
function useState<TState>(initial: TState) { }

// ❌ BAD
function identity<t>(value: t): t { }      // ❌ Lowercase
function identity<type>(value: type) { }   // ❌ Lowercase word
```

### Props Interfaces

```typescript
// ✅ GOOD: ComponentName + "Props"
export interface LocaleSwitcherProps {
  onLocaleChange?: (locale: LocaleCode) => void;
  className?: string;
}

export const LocaleSwitcher: React.FC<LocaleSwitcherProps> = (props) => {};

// ❌ BAD
export interface ILocaleSwitcherProps {} // ❌ "I" prefix
export interface Props {} // ❌ Too generic
export interface LocaleSwitcherProperties {} // ❌ Use "Props"
```

---

## CSS Class Naming

### Tailwind CSS (Utility-First)

```tsx
// ✅ GOOD: Utility classes, consistent order
<button className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-background transition-colors hover:bg-foreground/90">
  Switch Locale
</button>

// ❌ BAD: Inconsistent, hard to read
<button className="bg-foreground text-background px-4 rounded-full flex gap-2 items-center py-2">
  Switch Locale
</button>
```

### Custom CSS Classes (BEM Convention)

```css
/* ✅ GOOD: BEM (Block Element Modifier) */
.locale-switcher {
}
.locale-switcher__button {
}
.locale-switcher__button--active {
}
.locale-switcher__icon {
}

/* ❌ BAD */
.LocaleSwitcher {
} /* ❌ PascalCase */
.locale_switcher {
} /* ❌ snake_case */
.localeSwitcher {
} /* ❌ camelCase */
.ls-btn {
} /* ❌ Abbreviated */
```

### CSS Module Classes

```typescript
// locale-switcher.module.css
.container { }
.button { }
.buttonActive { }                  // camelCase for composition

// LocaleSwitcher.tsx
import styles from './locale-switcher.module.css';

<div className={styles.container}>
  <button className={styles.button}>
    Switch
  </button>
</div>
```

---

## Test File Naming

### Unit Tests

```
✅ GOOD:
locale-switcher.test.tsx          # Component test
switch-locale.use-case.test.ts    # Use case test
format-date.test.ts               # Utility test

❌ BAD:
LocaleSwitcher.test.tsx           ❌ Use kebab-case
locale-switcher-test.tsx          ❌ Use .test suffix
test-locale-switcher.tsx          ❌ Prefix with filename
```

### Integration/E2E Tests

```
✅ GOOD:
locale-switcher.spec.tsx          # Integration test
auth-flow.e2e.ts                  # E2E test
user-registration.integration.ts  # Integration test

❌ BAD:
locale-switcher.integration.tsx   ❌ Use .spec for integration
e2e-auth.ts                       ❌ Suffix with .e2e
```

### Test Describe Blocks

```typescript
// ✅ GOOD: Descriptive, grouped by feature
describe('LocaleSwitcher', () => {
  describe('Rendering', () => {
    it('should render all supported locales', () => { });
    it('should highlight current locale', () => { });
  });

  describe('Behavior', () => {
    it('should switch locale on button click', () => { });
    it('should call onLocaleChange callback', () => { });
  });
});

// ❌ BAD
describe('test', () => {                    ❌ Not descriptive
  it('works', () => { });                   ❌ Not descriptive
});
```

---

## Constants & Enums

### Constants

```typescript
// ✅ GOOD: UPPER_SNAKE_CASE for primitive constants
export const MAX_RETRIES = 3;
export const API_BASE_URL = 'https://api.example.com';
export const DEFAULT_TIMEOUT = 5000;

// ✅ GOOD: PascalCase for object constants
export const SupportedLocales = {
  EN: 'en',
  TH: 'th',
} as const;

// ✅ GOOD: camelCase for complex objects
export const themeConfig = {
  colors: {
    primary: '#000',
    secondary: '#fff',
  },
  spacing: {
    small: '8px',
    medium: '16px',
  },
};

// ❌ BAD
export const maxRetries = 3;               ❌ Use UPPER_SNAKE_CASE
export const api_base_url = 'https://...'; ❌ Use UPPER_SNAKE_CASE
export const THEME_CONFIG = { };           ❌ Use camelCase for objects
```

### Enums

```typescript
// ✅ GOOD: PascalCase for enum name, PascalCase for members
export enum LocaleCode {
  English = 'en',
  Thai = 'th',
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

// ❌ BAD
export enum localeCode {                   ❌ camelCase
  ENGLISH = 'en',                          ❌ UPPER_CASE members
  THAI = 'th',
}

export enum THEME_MODE {                   ❌ UPPER_SNAKE_CASE
  light = 'light',                         ❌ lowercase members
  dark = 'dark',
}
```

### Const Enums (Preferred for TypeScript)

```typescript
// ✅ GOOD: Use const enum for better tree-shaking
export const enum LocaleCode {
  English = 'en',
  Thai = 'th',
}

// ✅ BETTER: Use union types for simple enums
export type LocaleCode = 'en' | 'th';
export const LOCALE_CODES = ['en', 'th'] as const;
```

---

## Summary Table

| Category              | Convention              | Example                     |
| --------------------- | ----------------------- | --------------------------- |
| **Files**             |                         |                             |
| React Components      | PascalCase.tsx          | `LocaleSwitcher.tsx`        |
| Hooks                 | kebab-case.ts           | `use-locale-switcher.ts`    |
| Utilities             | kebab-case.ts           | `format-date.ts`            |
| Entities              | kebab-case.entity.ts    | `locale.entity.ts`          |
| Use Cases             | kebab-case.use-case.ts  | `switch-locale.use-case.ts` |
| **Directories**       |                         |                             |
| Features              | kebab-case (singular)   | `i18n/`, `theme/`           |
| Layers                | kebab-case (singular)   | `domain/`, `application/`   |
| Collections           | kebab-case (plural)     | `hooks/`, `utils/`          |
| **Code**              |                         |                             |
| Variables             | camelCase               | `currentLocale`             |
| Functions             | camelCase (verb prefix) | `getCurrentLocale()`        |
| Components            | PascalCase              | `LocaleSwitcher`            |
| Interfaces (DI)       | IPascalCase             | `ILocaleRepository`         |
| Interfaces (Data)     | PascalCase              | `Locale`, `User`            |
| Types                 | PascalCase              | `LocaleCode`                |
| Constants (primitive) | UPPER_SNAKE_CASE        | `MAX_RETRIES`               |
| Constants (object)    | PascalCase/camelCase    | `ThemeConfig`               |
| Enums                 | PascalCase              | `LocaleCode.English`        |
| **CSS**               |                         |                             |
| Custom classes        | kebab-case (BEM)        | `.locale-switcher__button`  |
| Module classes        | camelCase               | `styles.buttonActive`       |
| **Tests**             |                         |                             |
| Unit tests            | kebab-case.test.ts      | `locale-switcher.test.tsx`  |
| Integration tests     | kebab-case.spec.ts      | `auth-flow.spec.ts`         |
| E2E tests             | kebab-case.e2e.ts       | `user-flow.e2e.ts`          |

---

## Common Prefixes & Suffixes

### Prefixes

| Prefix      | Usage                          | Example                       |
| ----------- | ------------------------------ | ----------------------------- |
| `use-`      | Custom React hooks             | `use-locale-switcher.ts`      |
| `with-`     | Higher-Order Components        | `withAuth.tsx`                |
| `is-`       | Boolean variables              | `isLoading`, `isActive`       |
| `has-`      | Boolean variables (possession) | `hasError`, `hasPermission`   |
| `should-`   | Boolean variables (intent)     | `shouldRedirect`              |
| `can-`      | Boolean variables (ability)    | `canEdit`, `canDelete`        |
| `handle-`   | Event handlers                 | `handleClick`, `handleSubmit` |
| `on-`       | Event callbacks (props)        | `onLocaleChange`, `onError`   |
| `get-`      | Getter functions               | `getCurrentLocale()`          |
| `set-`      | Setter functions               | `setLocale()`                 |
| `fetch-`    | API calls                      | `fetchUserProfile()`          |
| `validate-` | Validation functions           | `validateEmail()`             |

### Suffixes

| Suffix           | Usage                                 | Example                     |
| ---------------- | ------------------------------------- | --------------------------- |
| `.entity.ts`     | Domain entities                       | `locale.entity.ts`          |
| `.repository.ts` | Repository interfaces/implementations | `locale.repository.ts`      |
| `.use-case.ts`   | Application use cases                 | `switch-locale.use-case.ts` |
| `.service.ts`    | Services                              | `auth.service.ts`           |
| `.dto.ts`        | Data Transfer Objects                 | `user-profile.dto.ts`       |
| `.types.ts`      | Type definitions                      | `locale.types.ts`           |
| `.test.ts[x]`    | Unit tests                            | `locale-switcher.test.tsx`  |
| `.spec.ts[x]`    | Integration tests                     | `auth-flow.spec.ts`         |
| `.e2e.ts`        | End-to-end tests                      | `user-registration.e2e.ts`  |
| `.stories.tsx`   | Storybook stories                     | `button.stories.tsx`        |
| `.module.css`    | CSS Modules                           | `button.module.css`         |
| `Props`          | Component props interface             | `LocaleSwitcherProps`       |

---

## Tools & Automation

### ESLint Rules

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "function",
        "format": ["camelCase"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      }
    ]
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "semi": true
}
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## References

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [BEM Naming Convention](http://getbem.com/naming/)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
