# Code Style Guide

This document outlines the coding standards and best practices for this
Next.js + TypeScript project, following Airbnb's JavaScript/React style guide
with TypeScript adaptations.

## Table of Contents

- [General Principles](#general-principles)
- [TypeScript](#typescript)
- [React Components](#react-components)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Imports](#imports)
- [Functions](#functions)
- [State Management](#state-management)
- [Styling](#styling)
- [Comments](#comments)
- [Testing](#testing)

## General Principles

### Code Quality

- Write clean, readable, and maintainable code
- Follow the principle of least surprise
- Keep functions small and focused (single responsibility)
- Favor composition over inheritance
- Use TypeScript's type system to catch errors early

### Consistency

- Follow established patterns in the codebase
- Use automated tools (ESLint, Prettier) for formatting
- Review code before committing

## TypeScript

### Type Safety

**Always prefer explicit types for public APIs:**

```typescript
// ✅ Good
interface UserProps {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): Promise<UserProps> => {
  // implementation
};

// ❌ Avoid
const getUser = (id) => {
  // implicit any
};
```

### Avoid `any`

```typescript
// ❌ Bad
const data: any = fetchData();

// ✅ Good - use unknown and type guard
const data: unknown = fetchData();
if (isValidData(data)) {
  // data is now typed
}

// ✅ Better - define proper types
interface ApiResponse {
  status: number;
  data: UserProps[];
}
const data: ApiResponse = fetchData();
```

### Use Type Inference

```typescript
// ✅ Good - let TypeScript infer
const count = 5;
const name = 'John';
const items = [1, 2, 3];

// ❌ Unnecessary
const count: number = 5;
const name: string = 'John';
```

### Prefer `interface` over `type`

```typescript
// ✅ Good - use interface for objects
interface User {
  id: string;
  name: string;
}

// ✅ Good - use type for unions/primitives
type Status = 'pending' | 'active' | 'inactive';
type ID = string | number;

// ❌ Avoid type for objects
type User = {
  id: string;
  name: string;
};
```

### Use `Readonly` for Immutable Data

```typescript
// ✅ Good
interface Props {
  readonly user: Readonly<User>;
  readonly items: ReadonlyArray<Item>;
}

// ✅ React component props are readonly by default
const Component: React.FC<Readonly<Props>> = ({ user }) => {
  // Cannot reassign user
};
```

## React Components

### Function Components with Arrow Functions

**Always use arrow function syntax:**

```typescript
// ✅ Good
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

export default UserProfile;

// ❌ Bad
export default function UserProfile({ user }) {
  return <div>{user.name}</div>;
}
```

### Props Interface

```typescript
// ✅ Good - define props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

// ❌ Bad - inline types
const Button = ({ label, onClick }: { label: string; onClick: () => void }) => {
  // ...
};
```

### Destructure Props

```typescript
// ✅ Good
const UserCard: React.FC<UserCardProps> = ({ name, email, avatar }) => {
  return (
    <div>
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
};

// ❌ Avoid
const UserCard: React.FC<UserCardProps> = (props) => {
  return (
    <div>
      <img src={props.avatar} alt={props.name} />
      <h2>{props.name}</h2>
      <p>{props.email}</p>
    </div>
  );
};
```

### Conditional Rendering

```typescript
// ✅ Good - short circuit
{isLoading && <Spinner />}
{error && <ErrorMessage message={error} />}
{user && <UserProfile user={user} />}

// ✅ Good - ternary for if/else
{isLoggedIn ? <Dashboard /> : <Login />}

// ❌ Avoid - don't use ternary for one condition
{isLoading ? <Spinner /> : null}

// ❌ Avoid - complex logic in JSX
{user && user.role === 'admin' && user.permissions.includes('write') && (
  <AdminPanel />
)}

// ✅ Better - extract to variable
const canAccessAdminPanel = user?.role === 'admin' &&
  user?.permissions.includes('write');

{canAccessAdminPanel && <AdminPanel />}
```

### Component Composition

```typescript
// ✅ Good - composition pattern
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg border bg-white p-6">{children}</div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4 border-b pb-4">{children}</div>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

// Usage
<Card>
  <CardHeader>
    <h2>Title</h2>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>
```

## File Organization

### Directory Structure

```plaintext
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   └── [id]/              # Dynamic routes
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   └── features/          # Feature-specific components
├── lib/                   # Third-party library configs
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── services/              # API services
├── stores/                # State management
├── types/                 # TypeScript types
└── config/                # App configuration
```

### File Naming

```plaintext
// Components - PascalCase
Button.tsx
UserProfile.tsx
DatePicker.tsx

// Utilities - camelCase
formatDate.ts
validateEmail.ts

// Hooks - camelCase with 'use' prefix
useAuth.ts
useLocalStorage.ts

// Types - PascalCase
User.ts
ApiResponse.ts

// Constants - UPPER_SNAKE_CASE or camelCase
constants.ts (file)
export const API_URL = '...';
export const maxRetries = 3;
```

### One Component Per File

```typescript
// ✅ Good - one component per file
// UserCard.tsx
const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

export default UserCard;

// ❌ Bad - multiple exports
export const UserCard = () => { ... };
export const UserList = () => { ... };
export const UserProfile = () => { ... };
```

## Naming Conventions

### Variables and Functions

```typescript
// ✅ camelCase for variables and functions
const userName = 'John';
const getUserById = (id: string) => { ... };

// ✅ PascalCase for classes and components
class UserService { ... }
const UserProfile: React.FC = () => { ... };

// ✅ UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// ✅ Prefix booleans with is/has/should
const isLoading = true;
const hasPermission = false;
const shouldRender = true;
```

### Event Handlers

```typescript
// ✅ Good - prefix with 'handle'
const handleClick = () => { ... };
const handleSubmit = (e: FormEvent) => { ... };
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => { ... };

// Pass as 'on' props
<Button onClick={handleClick} />
<Form onSubmit={handleSubmit} />
```

## Imports

### Order (Managed by Prettier)

Imports are automatically sorted by Prettier plugin. Follow this mental model:

1. React/Next.js core
2. Third-party libraries
3. Internal modules (@/types, @/lib, @/hooks, etc.)
4. Relative imports

```typescript
import { Geist } from 'next/font/google';

import type { Metadata } from 'next';

import './globals.css';
```

### Named vs Default Exports

```typescript
// ✅ Prefer named exports for utilities
export const formatDate = (date: Date) => { ... };
export const validateEmail = (email: string) => { ... };

// ✅ Default export for components (Next.js requirement for pages)
const HomePage: React.FC = () => { ... };
export default HomePage;

// ✅ Named exports for multiple utilities
export { formatDate, parseDate, isValidDate };
```

### Avoid Barrel Exports (index.ts) Overuse

```typescript
// ... 50 more exports
// ✅ Import directly
import { Button } from '@/components/ui/Button';

// ❌ Avoid deep barrel files
// components/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// ✅ Use barrel files for cohesive groups only
// components/ui/index.ts (small, focused)
export { Button } from './Button';
export { Input } from './Input';
```

## Functions

### Arrow Functions

```typescript
// ✅ Good - arrow function for consistency
const add = (a: number, b: number): number => a + b;

const getUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// ❌ Avoid function declarations (except for hoisting needs)
function add(a: number, b: number): number {
  return a + b;
}
```

### Function Length

Keep functions short and focused:

```typescript
// ✅ Good - single responsibility
const validateUser = (user: User): boolean => {
  return isValidEmail(user.email) && isValidAge(user.age);
};

// ❌ Bad - doing too much
const processUser = (user: User) => {
  // Validation
  if (!user.email) return false;
  if (!user.age) return false;
  // Transformation
  user.name = user.name.trim();
  user.email = user.email.toLowerCase();
  // API call
  fetch('/api/users', { method: 'POST', body: JSON.stringify(user) });
  // Logging
  console.log('User processed');
};
```

### Default Parameters

```typescript
// ✅ Good
const greet = (name: string, greeting = 'Hello'): string => {
  return `${greeting}, ${name}!`;
};

// ✅ Good - object destructuring with defaults
interface Options {
  timeout?: number;
  retries?: number;
}

const fetchData = ({ timeout = 5000, retries = 3 }: Options = {}) => {
  // ...
};
```

## State Management

### useState

```typescript
// ✅ Good - clear state names
const [isLoading, setIsLoading] = useState<boolean>(false);
const [user, setUser] = useState<User | null>(null);
const [count, setCount] = useState<number>(0);

// ✅ Good - functional updates
setCount((prevCount) => prevCount + 1);

// ❌ Bad - direct state mutation
const [users, setUsers] = useState<User[]>([]);
users.push(newUser); // Don't mutate directly
setUsers(users);

// ✅ Good - immutable update
setUsers([...users, newUser]);
```

### useEffect

```typescript
// ✅ Good - clear dependency array
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// ✅ Good - cleanup function
useEffect(() => {
  const subscription = subscribeToUpdates();

  return () => {
    subscription.unsubscribe();
  };
}, []);

// ⚠️ Warning - empty dependency array (runs once)
useEffect(() => {
  console.log('Component mounted');
}, []);

// ❌ Bad - missing dependencies
useEffect(() => {
  fetchUser(userId); // userId should be in deps
}, []);
```

### Custom Hooks

```typescript
// ✅ Good - custom hook pattern
const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await getUserById(userId);
        setUser(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, isLoading, error };
};

// Usage
const { user, isLoading, error } = useUser('123');
```

## Styling

### Tailwind CSS

```typescript
// ✅ Good - classes sorted automatically by Prettier
<div className="flex items-center gap-2 rounded-lg bg-white p-4 shadow-md">

// ✅ Good - conditional classes with clsx
import clsx from 'clsx';

<button className={clsx(
  'rounded px-4 py-2',
  variant === 'primary' && 'bg-blue-500 text-white',
  variant === 'secondary' && 'bg-gray-200 text-black',
  disabled && 'cursor-not-allowed opacity-50'
)} />

// ✅ Good - extract complex classes
const buttonClasses = clsx(
  'rounded px-4 py-2 font-semibold transition-colors',
  'hover:bg-blue-600 active:bg-blue-700',
  'disabled:cursor-not-allowed disabled:opacity-50'
);

<button className={buttonClasses} />
```

### Responsive Design

```typescript
// ✅ Good - mobile-first approach
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive Text
</div>

// ✅ Good - responsive layout
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => <Card key={item.id} {...item} />)}
</div>
```

## Comments

### When to Comment

```typescript
// ✅ Good - explain WHY, not WHAT
// Use exponential backoff to avoid overwhelming the server
const delay = Math.pow(2, attempt) * 1000;

// ✅ Good - document complex business logic
// Discount applies only to users who:
// 1. Have been active for > 30 days
// 2. Have made at least 3 purchases
// 3. Are not already using a promotional code
const isEligibleForDiscount = () => { ... };

// ❌ Bad - stating the obvious
// Set loading to true
setIsLoading(true);

// ❌ Bad - outdated comment
// TODO: Fix this later (from 2 years ago)
```

### JSDoc for Public APIs

```typescript
/**
 * Fetches user data from the API
 * @param userId - The unique identifier for the user
 * @returns Promise resolving to User object
 * @throws {ApiError} When the user is not found or API is unavailable
 */
const fetchUser = async (userId: string): Promise<User> => {
  // implementation
};
```

## Testing

### Exam File Naming

```plaintext
Button.tsx
Button.test.tsx  // Unit tests
Button.spec.tsx  // Integration tests
```

### Test Structure

```typescript
describe('Button', () => {
  it('should render with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button label="Click" onClick={() => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Best Practices Summary

✅ **DO:**

- Use TypeScript strictly
- Write small, focused components
- Destructure props
- Use arrow functions for components
- Keep files under 250 lines
- Write meaningful variable names
- Use const over let
- Add types for function parameters and returns
- Extract complex logic to custom hooks
- Use Tailwind CSS utility classes
- Let Prettier/ESLint handle formatting

❌ **DON'T:**

- Use `any` type
- Mutate state directly
- Write components over 200 lines
- Mix business logic with UI
- Use inline styles (except dynamic values)
- Commit code without running linter
- Use `var` keyword
- Write deeply nested code (max 3 levels)
- Use `console.log` in production code
- Ignore TypeScript errors

## References

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)
