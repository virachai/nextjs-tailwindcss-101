# Enterprise Next.js Architecture Guide

Complete guide for building production-ready, scalable, enterprise-grade Next.js applications

## Table of Contents

- [🏢 Enterprise Requirements](#-enterprise-requirements)
- [🏗️ Architecture Patterns](#️-architecture-patterns)
- [📦 Monorepo Setup](#-monorepo-setup)
- [🎯 Clean Architecture](#-clean-architecture)
- [🔷 Domain-Driven Design (DDD)](#-domain-driven-design-ddd)
- [🧱 Project Structure](#-project-structure)
- [🔧 Configuration Management](#-configuration-management)
- [🧪 Testing Strategy](#-testing-strategy)
- [📊 Monitoring & Observability](#-monitoring--observability)
- [🚀 CI/CD Pipeline](#-cicd-pipeline)
- [📈 Scalability Patterns](#-scalability-patterns)
- [👥 Team Collaboration](#-team-collaboration)
- [✅ Enterprise Checklist](#-enterprise-checklist)

---

## 🏢 Enterprise Requirements

### What Makes an Application "Enterprise-Grade"?

✅ **Scalability** - Handle 10K+ concurrent users
✅ **Security** - OWASP Top 10 compliance
✅ **Performance** - < 2s page load, Core Web Vitals
✅ **Reliability** - 99.9% uptime
✅ **Maintainability** - Clean code, documentation
✅ **Testability** - 80%+ code coverage
✅ **Observability** - Logging, monitoring, tracing
✅ **Compliance** - GDPR, SOC2, ISO 27001
✅ **Multi-tenancy** - Support multiple organizations
✅ **Internationalization** - Multiple languages/regions

### Key Stakeholder Concerns

**Business:**

- Time to market
- Cost efficiency
- Feature velocity
- Competitive advantage

**Engineering:**

- Code quality
- Developer experience
- Technical debt
- System reliability

**Operations:**

- Deployment frequency
- Mean time to recovery (MTTR)
- Infrastructure costs
- Security posture

---

## 🏗️ Architecture Patterns

### 1. Clean Architecture (Recommended) ⭐⭐⭐⭐⭐

**Concept:** Keep business logic independent of frameworks, UI, database

```plaintext
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (UI Components, Pages, API Routes)     │
├─────────────────────────────────────────┤
│          Application Layer              │
│    (Use Cases, Business Logic)          │
├─────────────────────────────────────────┤
│           Domain Layer                  │
│      (Entities, Value Objects)          │
├─────────────────────────────────────────┤
│        Infrastructure Layer             │
│  (Database, External APIs, Cache)       │
└─────────────────────────────────────────┘
```

**Benefits:**

- ✅ Testable (mock dependencies)
- ✅ Independent of frameworks
- ✅ Easy to replace infrastructure
- ✅ Clear separation of concerns

---

### 2. Feature-Sliced Design ⭐⭐⭐⭐

**Concept:** Organize by business features, not technical layers

```plaintext
src/
  features/
    user-management/
      domain/
      application/
      infrastructure/
      presentation/
    billing/
      domain/
      application/
      infrastructure/
      presentation/
  shared/
    ui/
    lib/
    config/
```

**Benefits:**

- ✅ Team autonomy (feature teams)
- ✅ Parallel development
- ✅ Easy to extract microservices
- ✅ Clear boundaries

---

### 3. Hexagonal Architecture (Ports & Adapters) ⭐⭐⭐⭐

**Concept:** Business logic at center, adapters for external systems

```plaintext
         ┌────────────────┐
         │   Web API      │
         │   (Adapter)    │
         └────────┬───────┘
                  │
    ┌─────────────▼─────────────┐
    │      Application Core     │
    │    (Business Logic)       │
    │       (Ports)             │
    └─────────────┬─────────────┘
                  │
         ┌────────▼───────┐
         │   Database     │
         │   (Adapter)    │
         └────────────────┘
```

**Benefits:**

- ✅ Easy to swap adapters (DB, API)
- ✅ Testable (mock ports)
- ✅ Technology agnostic core
- ✅ Clear dependencies

---

### 4. CQRS (Command Query Responsibility Segregation) ⭐⭐⭐

**Concept:** Separate read and write operations

```typescript
// Commands (Write)
class CreateUserCommand {
  constructor(public readonly data: CreateUserDto) {}
}

class CreateUserHandler {
  async execute(command: CreateUserCommand) {
    // Write to database
    return await this.userRepo.create(command.data);
  }
}

// Queries (Read)
class GetUserQuery {
  constructor(public readonly id: string) {}
}

class GetUserHandler {
  async execute(query: GetUserQuery) {
    // Read from read-optimized store (cache, read replica)
    return await this.userReadRepo.findById(query.id);
  }
}
```

**Benefits:**

- ✅ Optimized read/write models
- ✅ Scalable (separate read/write DBs)
- ✅ Clear intent (command vs query)
- ✅ Event sourcing compatible

---

## 📦 Monorepo Setup

### Why Monorepo for Enterprise?

✅ **Code sharing** - Shared libraries, components
✅ **Atomic changes** - Update multiple apps at once
✅ **Consistent tooling** - Same linting, testing
✅ **Simplified dependencies** - One node_modules
✅ **Better collaboration** - All code in one place

### Recommended: Turborepo + pnpm

```bash
# Create Turborepo
pnpm dlx create-turbo@latest

# Structure
my-enterprise-app/
  apps/
    web/              # Main Next.js app
    admin/            # Admin dashboard
    docs/             # Documentation site
  packages/
    ui/               # Shared UI components
    config/           # Shared configs (ESLint, TS)
    database/         # Prisma schema
    auth/             # Auth utilities
    email/            # Email templates
  tooling/
    eslint-config/
    typescript-config/
  package.json        # Root package.json
  turbo.json          # Turborepo config
  pnpm-workspace.yaml
```

### Turborepo Configuration

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
```

### Package Scripts

```json
// package.json (root)
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "test:e2e": "turbo run test:e2e",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "prettier": "^3.4.2",
    "@turbo/gen": "^2.3.0"
  }
}
```

---

## 🎯 Clean Architecture

### Complete Implementation Example

```typescript
// 1. Domain Layer (Core Business Logic)
// domain/entities/user.entity.ts
export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    private passwordHash: string,
    public readonly role: UserRole,
    public readonly createdAt: Date
  ) {}

  static create(data: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
  }): User {
    // Business rules validation
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    return new User(
      generateId(),
      data.email,
      data.name,
      hashPassword(data.password),
      data.role,
      new Date()
    );
  }

  updatePassword(oldPassword: string, newPassword: string): void {
    if (!this.verifyPassword(oldPassword)) {
      throw new Error('Invalid old password');
    }

    this.passwordHash = hashPassword(newPassword);
  }

  private verifyPassword(password: string): boolean {
    return verifyHash(password, this.passwordHash);
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

// 2. Application Layer (Use Cases)
// application/use-cases/create-user.use-case.ts
export class CreateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(data: CreateUserDto): Promise<UserResponseDto> {
    // Check if user exists
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create user entity (business logic)
    const user = User.create(data);

    // Save to repository
    await this.userRepo.save(user);

    // Return DTO
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}

// application/dtos/create-user.dto.ts
export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

// 3. Infrastructure Layer (Implementations)
// infrastructure/repositories/prisma-user.repository.ts
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    if (!data) return null;
    return this.toDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { email } });
    if (!data) return null;
    return this.toDomain(data);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: this.toPersistence(user),
      update: this.toPersistence(user),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private toDomain(data: any): User {
    // Map from DB to Domain Entity
    return new User(
      data.id,
      data.email,
      data.name,
      data.passwordHash,
      data.role,
      data.createdAt
    );
  }

  private toPersistence(user: User): any {
    // Map from Domain Entity to DB
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: (user as any).passwordHash,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

// 4. Presentation Layer (Next.js)
// app/api/users/route.ts
import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { PrismaUserRepository } from '@/infrastructure/repositories/prisma-user.repository';
import { prisma } from '@/infrastructure/database/prisma';

export async function POST(req: Request) {
  const data = await req.json();

  // Dependency injection
  const userRepo = new PrismaUserRepository(prisma);
  const createUserUseCase = new CreateUserUseCase(userRepo);

  try {
    const user = await createUserUseCase.execute(data);
    return Response.json(user, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// Better: Use Dependency Injection Container
// infrastructure/di/container.ts
export class DIContainer {
  private static userRepository: IUserRepository;

  static getUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new PrismaUserRepository(prisma);
    }
    return this.userRepository;
  }

  static getCreateUserUseCase(): CreateUserUseCase {
    return new CreateUserUseCase(this.getUserRepository());
  }
}

// app/api/users/route.ts (simplified)
import { DIContainer } from '@/infrastructure/di/container';

export async function POST(req: Request) {
  const data = await req.json();
  const useCase = DIContainer.getCreateUserUseCase();

  try {
    const user = await useCase.execute(data);
    return Response.json(user, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

**Key Benefits:**

- ✅ Business logic in entities (not controllers)
- ✅ Easy to test (mock repositories)
- ✅ Easy to swap databases (just change repository)
- ✅ Clear dependency flow (domain → application → infrastructure)

---

## 🔷 Domain-Driven Design (DDD)

### When to Use DDD?

✅ Complex business domain
✅ Long-term project (3+ years)
✅ Large team (10+ developers)
✅ Changing requirements
✅ Need for domain experts involvement

### DDD Building Blocks

```typescript
// 1. Entity (has identity)
export class Order {
  constructor(
    public readonly id: OrderId,
    public readonly customerId: CustomerId,
    private items: OrderItem[],
    private status: OrderStatus,
    public readonly createdAt: Date
  ) {}

  addItem(product: Product, quantity: number): void {
    const item = new OrderItem(product, quantity);
    this.items.push(item);
  }

  complete(): void {
    if (this.items.length === 0) {
      throw new Error('Cannot complete empty order');
    }
    this.status = OrderStatus.COMPLETED;
  }
}

// 2. Value Object (no identity, immutable)
export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {}

  static create(amount: number, currency: string): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    return new Money(amount, currency);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return Money.create(this.amount + other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}

// 3. Aggregate (cluster of entities)
export class Order {
  // Order is aggregate root
  private items: OrderItem[] = [];

  addItem(product: Product, quantity: number): void {
    // Business logic
    const item = new OrderItem(product, quantity);
    this.items.push(item);
    this.recalculateTotal();
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter(item => item.id !== itemId);
    this.recalculateTotal();
  }

  // Consistency boundary
  private recalculateTotal(): void {
    this.total = this.items.reduce(
      (sum, item) => sum.add(item.getTotal()),
      Money.create(0, 'USD')
    );
  }
}

// 4. Domain Service (doesn't belong to entity)
export class OrderPricingService {
  calculateDiscount(order: Order, customer: Customer): Money {
    if (customer.isVIP()) {
      return order.getTotal().multiply(0.1); // 10% discount
    }
    return Money.create(0, 'USD');
  }
}

// 5. Repository (persistence abstraction)
export interface IOrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  save(order: Order): Promise<void>;
  findByCustomer(customerId: CustomerId): Promise<Order[]>;
}

// 6. Domain Events
export class OrderCompletedEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly customerId: CustomerId,
    public readonly total: Money,
    public readonly occurredAt: Date
  ) {}
}

export class Order {
  private domainEvents: DomainEvent[] = [];

  complete(): void {
    if (this.items.length === 0) {
      throw new Error('Cannot complete empty order');
    }

    this.status = OrderStatus.COMPLETED;

    // Raise domain event
    this.domainEvents.push(
      new OrderCompletedEvent(
        this.id,
        this.customerId,
        this.total,
        new Date()
      )
    );
  }

  getDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
```

### Bounded Context

Divide large domains into smaller contexts:

```plaintext
E-commerce Application:

┌──────────────────────────────────────────────┐
│          Orders Context                      │
│  - Order, OrderItem                          │
│  - OrderRepository                           │
│  - PlaceOrderUseCase                         │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│         Inventory Context                    │
│  - Product, Stock                            │
│  - InventoryRepository                       │
│  - ReserveStockUseCase                       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│         Shipping Context                     │
│  - Shipment, Address                         │
│  - ShippingRepository                        │
│  - CreateShipmentUseCase                     │
└──────────────────────────────────────────────┘
```

**Communication between contexts:**

- Domain Events
- API calls
- Message queues

---

## 🧱 Project Structure

### Enterprise-Grade Structure

```plaintext
my-enterprise-app/
├── apps/
│   ├── web/                          # Main customer-facing app
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router
│   │   │   │   ├── (auth)/          # Route group: auth pages
│   │   │   │   ├── (dashboard)/     # Route group: dashboard
│   │   │   │   ├── api/             # API routes
│   │   │   │   └── layout.tsx
│   │   │   ├── features/            # Feature modules
│   │   │   │   ├── user-management/
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   └── value-objects/
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── use-cases/
│   │   │   │   │   │   ├── dtos/
│   │   │   │   │   │   └── ports/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   ├── adapters/
│   │   │   │   │   │   └── mappers/
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── components/
│   │   │   │   │       ├── hooks/
│   │   │   │   │       └── pages/
│   │   │   │   ├── billing/
│   │   │   │   └── analytics/
│   │   │   ├── shared/
│   │   │   │   ├── lib/              # Shared utilities
│   │   │   │   ├── types/            # Shared types
│   │   │   │   └── constants/
│   │   │   └── infrastructure/
│   │   │       ├── di/               # Dependency injection
│   │   │       ├── database/
│   │   │       ├── cache/
│   │   │       └── logging/
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── e2e/
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── admin/                        # Admin dashboard
│   └── docs/                         # Documentation site
│
├── packages/
│   ├── ui/                           # Shared UI components
│   │   ├── src/
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── database/                     # Database schema & migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   └── client.ts
│   │   └── package.json
│   │
│   ├── auth/                         # Auth utilities
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   └── types/
│   │   └── package.json
│   │
│   ├── email/                        # Email templates
│   │   ├── templates/
│   │   └── src/
│   │
│   └── config/                       # Shared configuration
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── tooling/
│   ├── eslint-config/
│   └── typescript-config/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-web.yml
│       └── deploy-admin.yml
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── development/
│
├── scripts/
│   ├── migrate.sh
│   └── seed.sh
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## 🔧 Configuration Management

### Environment-Specific Configs

```typescript
// packages/config/src/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),

  // Redis
  REDIS_URL: z.string().url(),
  REDIS_MAX_RETRIES: z.coerce.number().default(3),

  // Auth
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url(),

  // External APIs
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  SENDGRID_API_KEY: z.string(),

  // Observability
  SENTRY_DSN: z.string().url().optional(),
  DATADOG_API_KEY: z.string().optional(),

  // Feature Flags
  ENABLE_AI_FEATURES: z.coerce.boolean().default(false),
  ENABLE_ANALYTICS: z.coerce.boolean().default(true),

  // Environment
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export const env = envSchema.parse(process.env);

// Type-safe access
export type Env = z.infer<typeof envSchema>;
```

### Feature Flags

```typescript
// packages/config/src/feature-flags.ts
export const featureFlags = {
  enableAIChat: env.ENABLE_AI_FEATURES,
  enableAnalytics: env.ENABLE_ANALYTICS,
  enableBetaFeatures: env.NODE_ENV !== 'production',
  maxUploadSize: env.NODE_ENV === 'production' ? 10_000_000 : 50_000_000,
} as const;

// Usage
import { featureFlags } from '@repo/config';

if (featureFlags.enableAIChat) {
  // Show AI chat feature
}
```

---

## 🧪 Testing Strategy

### Test Pyramid

```plaintext
        ┌──────────────┐
        │     E2E      │  10%  (Slow, High confidence)
        └──────────────┘
       ┌────────────────┐
       │  Integration   │  20%  (Medium speed)
       └────────────────┘
      ┌──────────────────┐
      │      Unit        │  70%  (Fast, Low overhead)
      └──────────────────┘
```

### 1. Unit Tests (Vitest)

```typescript
// features/user-management/domain/entities/user.entity.test.ts
import { describe, expect, it } from 'vitest';

import { User } from './user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a valid user', () => {
      const user = User.create({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: 'USER',
      });

      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('USER');
    });

    it('should throw error for invalid email', () => {
      expect(() =>
        User.create({
          email: 'invalid-email',
          name: 'Test',
          password: 'password123',
          role: 'USER',
        })
      ).toThrow('Invalid email format');
    });

    it('should throw error for short password', () => {
      expect(() =>
        User.create({
          email: 'test@example.com',
          name: 'Test',
          password: 'short',
          role: 'USER',
        })
      ).toThrow('Password must be at least 8 characters');
    });
  });
});
```

### 2. Integration Tests

```typescript
// features/user-management/application/use-cases/create-user.use-case.test.ts
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUserRepository } from '../../infrastructure/repositories/in-memory-user.repository';
import { CreateUserUseCase } from './create-user.use-case';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepo: InMemoryUserRepository;

  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(userRepo);
  });

  it('should create a new user', async () => {
    const result = await useCase.execute({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      role: 'USER',
    });

    expect(result.email).toBe('test@example.com');
    expect(result.name).toBe('Test User');

    // Verify saved in repository
    const saved = await userRepo.findByEmail('test@example.com');
    expect(saved).not.toBeNull();
  });

  it('should throw error if user already exists', async () => {
    await useCase.execute({
      email: 'test@example.com',
      name: 'User 1',
      password: 'password123',
      role: 'USER',
    });

    await expect(
      useCase.execute({
        email: 'test@example.com',
        name: 'User 2',
        password: 'password456',
        role: 'USER',
      })
    ).rejects.toThrow('User already exists');
  });
});
```

### 3. E2E Tests (Playwright)

```typescript
// tests/e2e/user-registration.spec.ts
import { expect, test } from '@playwright/test';

test.describe('User Registration', () => {
  test('should register a new user', async ({ page }) => {
    await page.goto('/register');

    // Fill form
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="name"]', 'New User');
    await page.fill('[name="password"]', 'SecurePass123!');

    // Submit
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome, New User');
  });

  test('should show error for existing email', async ({ page }) => {
    await page.goto('/register');

    await page.fill('[name="email"]', 'existing@example.com');
    await page.fill('[name="name"]', 'Test');
    await page.fill('[name="password"]', 'password123');

    await page.click('button[type="submit"]');

    await expect(page.locator('.error')).toContainText('User already exists');
  });
});
```

### Test Configuration

```typescript
// vitest.config.ts
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '**/*.spec.ts', '**/*.test.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 📊 Monitoring & Observability

### The Three Pillars

1. **Metrics** - What's happening?
2. **Logs** - Why is it happening?
3. **Traces** - Where is it happening?

### 1. Structured Logging

```typescript
// infrastructure/logging/logger.ts
import pino from 'pino';

export const logger = pino({
  level: env.LOG_LEVEL,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
  ...(env.NODE_ENV === 'production'
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }),
});

// Usage
logger.info({ userId: '123', action: 'login' }, 'User logged in');
logger.error({ err: error, userId: '123' }, 'Failed to create user');
```

### 2. Application Metrics (Prometheus)

```typescript
// infrastructure/monitoring/metrics.ts
import { Counter, Histogram, Registry } from 'prom-client';

export const register = new Registry();

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const userCreatedTotal = new Counter({
  name: 'users_created_total',
  help: 'Total number of users created',
  registers: [register],
});

// Middleware
export function metricsMiddleware(req: Request, res: Response, next: Function) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route.path, res.statusCode.toString())
      .observe(duration);
    httpRequestTotal.labels(req.method, req.route.path, res.statusCode.toString()).inc();
  });

  next();
}

// Expose metrics endpoint
// app/api/metrics/route.ts
export async function GET() {
  const metrics = await register.metrics();
  return new Response(metrics, {
    headers: { 'Content-Type': register.contentType },
  });
}
```

### 3. Distributed Tracing (OpenTelemetry)

```typescript
// infrastructure/monitoring/tracing.ts
// Usage in code
import { trace } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

export async function createUser(data: CreateUserDto) {
  const tracer = trace.getTracer('user-service');

  return tracer.startActiveSpan('createUser', async (span) => {
    span.setAttribute('user.email', data.email);

    try {
      const user = await userRepo.save(data);
      span.setStatus({ code: SpanStatusCode.OK });
      return user;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### 4. Error Tracking (Sentry)

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
  beforeSend(event) {
    // Don't send PII
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm test --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test:e2e

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm audit

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Cache build
        uses: actions/cache/save@v4
        with:
          path: apps/*/. next
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}
```

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

      - name: Run migrations
        run: pnpm prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Notify Sentry
        run: |
          curl -sL https://sentry.io/get-cli/ | bash
          sentry-cli releases new ${{ github.sha }}
          sentry-cli releases deploys ${{ github.sha }} new -e production
```

---

## 📈 Scalability Patterns

### 1. Caching Strategy

```typescript
// infrastructure/cache/redis-cache.service.ts
import { Redis } from 'ioredis';

export class RedisCacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage in repository
export class CachedUserRepository implements IUserRepository {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly cache: RedisCacheService
  ) {}

  async findById(id: string): Promise<User | null> {
    // Check cache first
    const cached = await this.cache.get<User>(`user:${id}`);
    if (cached) return cached;

    // Fetch from DB
    const user = await this.userRepo.findById(id);
    if (user) {
      await this.cache.set(`user:${id}`, user, 3600); // 1 hour TTL
    }

    return user;
  }

  async save(user: User): Promise<void> {
    await this.userRepo.save(user);
    // Invalidate cache
    await this.cache.del(`user:${user.id}`);
  }
}
```

### 2. Database Read Replicas

```typescript
// infrastructure/database/prisma-client.ts
import { PrismaClient } from '@prisma/client';

// Write database (primary)
export const prismaWrite = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

// Read database (replica)
export const prismaRead = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_READ_REPLICA_URL,
    },
  },
});

// Repository using read replicas
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    // Use read replica for queries
    return prismaRead.user.findUnique({ where: { id } });
  }

  async save(user: User): Promise<void> {
    // Use primary for writes
    await prismaWrite.user.upsert({
      where: { id: user.id },
      create: user,
      update: user,
    });
  }
}
```

### 3. Queue-Based Processing

```typescript
// infrastructure/queues/bull-queue.service.ts
import Bull from 'bull';

export const emailQueue = new Bull('email', env.REDIS_URL);

// Producer
export async function sendWelcomeEmail(userId: string) {
  await emailQueue.add('welcome-email', {
    userId,
  });
}

// Consumer
emailQueue.process('welcome-email', async (job) => {
  const { userId } = job.data;
  const user = await userRepo.findById(userId);

  await sendEmail({
    to: user.email,
    template: 'welcome',
    data: { name: user.name },
  });
});
```

---

## 👥 Team Collaboration

### Code Review Guidelines

```markdown
# Code Review Checklist

## Functionality

- [ ] Does the code do what it's supposed to do?
- [ ] Are edge cases handled?
- [ ] Are error cases handled?

## Code Quality

- [ ] Is the code readable and maintainable?
- [ ] Are variable names descriptive?
- [ ] Is there unnecessary complexity?
- [ ] Is code duplicated?

## Tests

- [ ] Are there unit tests?
- [ ] Do tests cover edge cases?
- [ ] Are tests readable?

## Security

- [ ] Is user input validated?
- [ ] Are SQL injection vulnerabilities prevented?
- [ ] Are secrets properly handled?

## Performance

- [ ] Are there N+1 queries?
- [ ] Is caching used appropriately?
- [ ] Are large datasets paginated?

## Documentation

- [ ] Are complex functions documented?
- [ ] Is the PR description clear?
- [ ] Are breaking changes noted?
```

### Git Workflow

```bash
# Feature branches from develop
git checkout -b feature/user-authentication

# Conventional commits
git commit -m "feat(auth): add user login endpoint"
git commit -m "fix(users): correct email validation"
git commit -m "docs(api): update authentication docs"

# Types: feat, fix, docs, style, refactor, test, chore

# Rebase before merging
git rebase develop

# Squash and merge to develop
# Merge develop → main for releases
```

---

## ✅ Enterprise Checklist

### Architecture

- [ ] Clean Architecture / DDD implemented
- [ ] Monorepo setup with Turborepo
- [ ] Feature-based folder structure
- [ ] Dependency injection container
- [ ] Bounded contexts defined

### Code Quality

- [ ] TypeScript strict mode enabled
- [ ] ESLint configured
- [ ] Prettier configured
- [ ] Husky pre-commit hooks
- [ ] Code coverage > 80%

### Testing

- [ ] Unit tests (Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Visual regression tests
- [ ] Performance tests

### Security

- [ ] OWASP Top 10 addressed
- [ ] Security headers configured
- [ ] Content Security Policy
- [ ] Input validation (Zod)
- [ ] Dependency scanning

### Performance

- [ ] Core Web Vitals optimized
- [ ] Caching strategy implemented
- [ ] Database indexes
- [ ] CDN configured
- [ ] Image optimization

### Observability

- [ ] Structured logging (Pino)
- [ ] Error tracking (Sentry)
- [ ] Metrics (Prometheus)
- [ ] Distributed tracing (OpenTelemetry)
- [ ] Uptime monitoring

### CI/CD

- [ ] Automated tests in pipeline
- [ ] Security scanning
- [ ] Build caching
- [ ] Automated deployments
- [ ] Rollback strategy

### Documentation

- [ ] Architecture documentation
- [ ] API documentation
- [ ] Runbook for on-call
- [ ] Onboarding guide
- [ ] ADR (Architecture Decision Records)

---

Note: **Enterprise-grade Next.js is achievable! Start with Clean Architecture, add proper testing, implement observability, and scale from there. 🚀**
