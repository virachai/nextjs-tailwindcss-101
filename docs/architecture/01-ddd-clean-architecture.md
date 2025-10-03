# DDD & Clean Architecture Implementation

## Overview

This project follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles, inspired by Airbnb's frontend engineering standards. The architecture promotes:

- **Separation of Concerns**: Clear boundaries between business logic and implementation
- **Testability**: Isolated layers that can be tested independently
- **Maintainability**: Feature-based organization for scalable growth
- **Flexibility**: Easy to swap implementations without affecting business logic

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                │
│  (UI Components, Hooks, View Models)        │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          Application Layer                  │
│       (Use Cases, Services)                 │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│            Domain Layer                     │
│    (Entities, Value Objects, Interfaces)    │
└─────────────────────────────────────────────┘
                  ▲
┌─────────────────┴───────────────────────────┐
│        Infrastructure Layer                 │
│  (External APIs, Repositories, Configs)     │
└─────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   └── [locale]/                 # Locale-based routing
│       ├── layout.tsx            # Root layout (presentation)
│       └── page.tsx              # Home page (presentation)
│
├── features/                     # Feature modules (DDD)
│   ├── i18n/                     # Internationalization feature
│   │   ├── domain/               # Business logic & rules
│   │   │   ├── entities/         # Core domain objects
│   │   │   │   └── locale.entity.ts
│   │   │   └── repositories/     # Repository interfaces
│   │   │       └── locale.repository.ts
│   │   │
│   │   ├── application/          # Use cases & orchestration
│   │   │   └── use-cases/
│   │   │       ├── get-current-locale.use-case.ts
│   │   │       └── switch-locale.use-case.ts
│   │   │
│   │   ├── infrastructure/       # External implementations
│   │   │   ├── config/           # Framework configurations
│   │   │   │   ├── routing.ts    # next-intl routing setup
│   │   │   │   └── request.ts    # next-intl request config
│   │   │   └── repositories/     # Repository implementations
│   │   │       └── next-locale.repository.ts
│   │   │
│   │   ├── presentation/         # UI layer
│   │   │   ├── components/
│   │   │   │   └── locale-switcher.tsx
│   │   │   └── hooks/
│   │   │       └── use-locale-switcher.ts
│   │   │
│   │   └── index.ts              # Public API (Barrel export)
│   │
│   └── theme/                    # Theme feature
│       ├── domain/
│       │   └── entities/
│       │       └── theme.entity.ts
│       ├── presentation/
│       │   └── components/
│       │       ├── theme-provider.tsx
│       │       └── theme-toggle.tsx
│       └── index.ts
│
├── shared/                       # Shared utilities (future)
│   ├── components/               # Reusable UI components
│   ├── hooks/                    # Shared custom hooks
│   └── utils/                    # Helper functions
│
├── core/                         # Core utilities (future)
│   ├── config/                   # Global configurations
│   └── constants/                # Global constants
│
└── middleware.ts                 # Next.js middleware
```

## Layer Responsibilities

### 1. Domain Layer (`domain/`)

**Purpose**: Contains pure business logic, independent of frameworks

**Components**:
- **Entities**: Core business objects with identity
  ```typescript
  // locale.entity.ts
  export type LocaleCode = 'en' | 'th';

  export interface Locale {
    code: LocaleCode;
    name: string;
    nativeName: string;
    flag: string;
  }
  ```

- **Value Objects**: Immutable objects without identity
- **Repository Interfaces**: Contracts for data access
  ```typescript
  // locale.repository.ts
  export interface ILocaleRepository {
    getCurrentLocale(): LocaleCode;
    setLocale(locale: LocaleCode): void;
  }
  ```

**Rules**:
- ✅ No framework dependencies (React, Next.js)
- ✅ Pure TypeScript/JavaScript
- ✅ Only interfaces, types, classes
- ❌ No external imports (except types)
- ❌ No UI logic

### 2. Application Layer (`application/`)

**Purpose**: Orchestrates domain logic and coordinates workflows

**Components**:
- **Use Cases**: Single-purpose business operations
  ```typescript
  // switch-locale.use-case.ts
  export class SwitchLocaleUseCase {
    constructor(private localeRepository: ILocaleRepository) {}

    execute(locale: LocaleCode) {
      if (!this.localeRepository.isValidLocale(locale)) {
        throw new Error(`Invalid locale: ${locale}`);
      }
      this.localeRepository.setLocale(locale);
    }
  }
  ```

- **Services**: Complex orchestration of multiple entities/use cases
- **DTOs**: Data Transfer Objects for cross-boundary communication

**Rules**:
- ✅ Depends on Domain layer only
- ✅ Framework-agnostic
- ✅ Contains business workflows
- ❌ No direct UI dependencies
- ❌ No infrastructure details

### 3. Infrastructure Layer (`infrastructure/`)

**Purpose**: Implements external concerns (APIs, databases, frameworks)

**Components**:
- **Repository Implementations**: Concrete data access
  ```typescript
  // next-locale.repository.ts
  export class NextLocaleRepository implements ILocaleRepository {
    constructor(
      private router: ReturnType<typeof useRouter>,
      private pathname: string
    ) {}

    setLocale(locale: LocaleCode): void {
      this.router.replace(`/${locale}${this.pathname}`);
    }
  }
  ```

- **API Clients**: External service integrations
- **Config Files**: Framework-specific configurations
- **Adapters**: Third-party library wrappers

**Rules**:
- ✅ Implements Domain interfaces
- ✅ Framework-specific code allowed
- ✅ External dependencies
- ❌ No business logic

### 4. Presentation Layer (`presentation/`)

**Purpose**: UI components and user interaction logic

**Components**:
- **Components**: React components
  ```typescript
  // locale-switcher.tsx
  export const LocaleSwitcher: React.FC = () => {
    const { currentLocale, switchLocale } = useLocaleSwitcher();

    return (
      <button onClick={() => switchLocale('th')}>
        Switch to Thai
      </button>
    );
  };
  ```

- **Hooks**: Custom React hooks that bridge Use Cases
  ```typescript
  // use-locale-switcher.ts
  export const useLocaleSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();

    const repository = new NextLocaleRepository(router, pathname);
    const useCase = new SwitchLocaleUseCase(repository);

    return { switchLocale: useCase.execute };
  };
  ```

- **View Models**: Presentation state management

**Rules**:
- ✅ React/Next.js components
- ✅ Calls Application Use Cases
- ✅ UI state management
- ❌ No direct Domain manipulation
- ❌ No business logic

## Dependency Flow

```
Presentation → Application → Domain ← Infrastructure
     │              │           ↑           │
     │              └───────────┘           │
     └────────────────────────────────────┘
```

**Key Principle**: Dependencies point inward
- Outer layers depend on inner layers
- Inner layers are independent
- Domain has NO dependencies

## Feature Module Structure

Each feature follows the same pattern:

```
features/[feature-name]/
├── domain/              # Core business logic
│   ├── entities/
│   ├── value-objects/
│   └── repositories/
│
├── application/         # Use cases
│   └── use-cases/
│
├── infrastructure/      # External implementations
│   ├── repositories/
│   ├── api/
│   └── config/
│
├── presentation/        # UI layer
│   ├── components/
│   ├── hooks/
│   └── view-models/
│
└── index.ts            # Public API
```

## Example: i18n Feature

### Domain Layer

**[locale.entity.ts](../../src/features/i18n/domain/entities/locale.entity.ts)**
```typescript
export type LocaleCode = 'en' | 'th';

export interface Locale {
  code: LocaleCode;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LOCALES: Locale[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', direction: 'ltr' },
];
```

**[locale.repository.ts](../../src/features/i18n/domain/repositories/locale.repository.ts)**
```typescript
export interface ILocaleRepository {
  getCurrentLocale(): LocaleCode;
  setLocale(locale: LocaleCode): void;
  isValidLocale(locale: string): locale is LocaleCode;
}
```

### Application Layer

**[switch-locale.use-case.ts](../../src/features/i18n/application/use-cases/switch-locale.use-case.ts)**
```typescript
export class SwitchLocaleUseCase {
  constructor(private localeRepository: ILocaleRepository) {}

  execute(locale: LocaleCode) {
    if (!this.localeRepository.isValidLocale(locale)) {
      throw new Error(`Invalid locale: ${locale}`);
    }
    this.localeRepository.setLocale(locale);
  }
}
```

### Infrastructure Layer

**[next-locale.repository.ts](../../src/features/i18n/infrastructure/repositories/next-locale.repository.ts)**
```typescript
export class NextLocaleRepository implements ILocaleRepository {
  constructor(
    private params: ReturnType<typeof useParams>,
    private pathname: string,
    private router: ReturnType<typeof useRouter>,
  ) {}

  getCurrentLocale(): LocaleCode {
    const locale = this.params.locale as string;
    return this.isValidLocale(locale) ? locale : 'en';
  }

  setLocale(locale: LocaleCode): void {
    const newPathname = this.pathname.replace(
      `/${this.getCurrentLocale()}`,
      `/${locale}`
    );
    this.router.replace(newPathname);
  }

  isValidLocale(locale: string): locale is LocaleCode {
    return SUPPORTED_LOCALES.some((l) => l.code === locale);
  }
}
```

### Presentation Layer

**[use-locale-switcher.ts](../../src/features/i18n/presentation/hooks/use-locale-switcher.ts)**
```typescript
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

**[locale-switcher.tsx](../../src/features/i18n/presentation/components/locale-switcher.tsx)**
```typescript
export const LocaleSwitcher: React.FC = () => {
  const { currentLocale, locales, switchLocale } = useLocaleSwitcher();

  return (
    <div>
      {locales.map((locale) => (
        <button
          key={locale.code}
          onClick={() => switchLocale(locale.code)}
          className={currentLocale === locale.code ? 'active' : ''}
        >
          {locale.flag} {locale.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
```

## Path Aliases

Configured in [tsconfig.json](../../tsconfig.json):

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/core/*": ["./src/core/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

**Usage Examples**:
```typescript
// Feature imports
import { LocaleSwitcher } from '@/features/i18n';
import { ThemeProvider } from '@/features/theme';

// Shared imports (future)
import { Button } from '@/shared/components/button';
import { useDebounce } from '@/shared/hooks/use-debounce';

// Core imports (future)
import { API_URL } from '@/core/config';
```

## Benefits of This Architecture

### 1. **Testability**
```typescript
// Easy to test in isolation
describe('SwitchLocaleUseCase', () => {
  it('should switch locale', () => {
    const mockRepo: ILocaleRepository = {
      getCurrentLocale: () => 'en',
      setLocale: jest.fn(),
      isValidLocale: (locale) => ['en', 'th'].includes(locale),
    };

    const useCase = new SwitchLocaleUseCase(mockRepo);
    useCase.execute('th');

    expect(mockRepo.setLocale).toHaveBeenCalledWith('th');
  });
});
```

### 2. **Framework Independence**
- Switch from Next.js to Remix? Only change Infrastructure layer
- Change state management? Only affect Presentation layer
- Domain logic remains untouched

### 3. **Scalability**
- Add new features without affecting existing ones
- Each feature is self-contained
- Clear boundaries prevent coupling

### 4. **Maintainability**
- Easy to locate code (feature-based structure)
- Clear responsibilities (layer separation)
- Predictable patterns across features

### 5. **Team Collaboration**
- Multiple developers can work on different layers simultaneously
- Clear contracts (interfaces) between layers
- Reduced merge conflicts

## Best Practices

### DO ✅

1. **Keep Domain Pure**
   ```typescript
   // ✅ Good: Pure TypeScript
   export interface Locale {
     code: LocaleCode;
     name: string;
   }
   ```

2. **Use Dependency Injection**
   ```typescript
   // ✅ Good: Inject dependencies
   class SwitchLocaleUseCase {
     constructor(private repository: ILocaleRepository) {}
   }
   ```

3. **Define Interfaces in Domain**
   ```typescript
   // ✅ Good: Interface in Domain
   // domain/repositories/locale.repository.ts
   export interface ILocaleRepository { ... }

   // infrastructure/repositories/next-locale.repository.ts
   export class NextLocaleRepository implements ILocaleRepository { ... }
   ```

4. **Barrel Exports**
   ```typescript
   // ✅ Good: Public API via index.ts
   // features/i18n/index.ts
   export { LocaleSwitcher } from './presentation/components/locale-switcher';
   export type { LocaleCode } from './domain/entities/locale.entity';
   ```

### DON'T ❌

1. **No Framework Code in Domain**
   ```typescript
   // ❌ Bad: React in Domain
   export interface Locale {
     component: React.FC; // NO!
   }
   ```

2. **No Business Logic in Components**
   ```typescript
   // ❌ Bad: Logic in component
   const LocaleSwitcher = () => {
     const switchLocale = (locale) => {
       if (!['en', 'th'].includes(locale)) { // NO!
         throw new Error('Invalid');
       }
       // ...
     };
   };
   ```

3. **No Direct Infrastructure in Presentation**
   ```typescript
   // ❌ Bad: Direct API call
   const Component = () => {
     const switchLocale = () => {
       fetch('/api/locale', ...); // NO!
     };
   };

   // ✅ Good: Through Use Case
   const Component = () => {
     const { switchLocale } = useLocaleSwitcher();
     switchLocale('th');
   };
   ```

4. **No Circular Dependencies**
   ```typescript
   // ❌ Bad: Domain depends on Infrastructure
   // domain/entities/locale.entity.ts
   import { NextLocaleRepository } from '../../infrastructure'; // NO!
   ```

## Migration Guide

### Adding a New Feature

1. **Create feature directory**
   ```bash
   mkdir -p src/features/[feature-name]/{domain,application,infrastructure,presentation}
   ```

2. **Start with Domain**
   - Define entities
   - Define repository interfaces
   - No implementation yet

3. **Add Application layer**
   - Create use cases
   - Use domain interfaces

4. **Implement Infrastructure**
   - Implement repository interfaces
   - Add external integrations

5. **Build Presentation**
   - Create components
   - Create hooks that use use cases
   - Export via index.ts

### Converting Existing Code

```typescript
// Before: Monolithic component
const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (locale: string) => {
    if (!['en', 'th'].includes(locale)) {
      throw new Error('Invalid locale');
    }
    router.replace(`/${locale}${pathname}`);
  };

  return <button onClick={() => switchLocale('th')}>Thai</button>;
};

// After: Layered architecture
// 1. Domain
export type LocaleCode = 'en' | 'th';
export interface ILocaleRepository {
  setLocale(locale: LocaleCode): void;
}

// 2. Application
export class SwitchLocaleUseCase {
  constructor(private repo: ILocaleRepository) {}
  execute(locale: LocaleCode) { this.repo.setLocale(locale); }
}

// 3. Infrastructure
export class NextLocaleRepository implements ILocaleRepository {
  setLocale(locale: LocaleCode) { router.replace(`/${locale}${pathname}`); }
}

// 4. Presentation
export const LocaleSwitcher = () => {
  const { switchLocale } = useLocaleSwitcher();
  return <button onClick={() => switchLocale('th')}>Thai</button>;
};
```

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Next.js Documentation](https://nextjs.org/docs)

## Future Enhancements

- [ ] Add `shared/` components library
- [ ] Implement `core/` utilities
- [ ] Add Domain Events pattern
- [ ] Implement CQRS for complex features
- [ ] Add E2E testing with Cypress/Playwright
- [ ] Implement Feature Flags
- [ ] Add API Gateway pattern
