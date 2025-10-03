# Component Library

Build a production-ready component library inspired by industry-leading design
systems.

## Table of Contents

- [Component Architecture](#component-architecture)
- [Component Categories](#component-categories)
- [Component Anatomy](#component-anatomy)
- [Building Components](#building-components)
- [Component API Design](#component-api-design)
- [Composition Patterns](#composition-patterns)
- [Documentation Standards](#documentation-standards)
- [Testing Strategy](#testing-strategy)

## Component Architecture

### Component Hierarchy

```
Components
├── Primitives (Atoms)
│   ├── Button
│   ├── Input
│   ├── Checkbox
│   ├── Radio
│   └── Badge
│
├── Composites (Molecules)
│   ├── FormField
│   ├── SearchBar
│   ├── Card
│   └── MenuItem
│
├── Patterns (Organisms)
│   ├── Header
│   ├── Footer
│   ├── LoginForm
│   └── ProductCard
│
└── Layouts (Templates)
    ├── PageLayout
    ├── DashboardLayout
    └── AuthLayout
```

### Design Principles

**1. Single Responsibility** Each component does one thing well.

```tsx
// ✅ Good - focused component
<Button onClick={handleClick}>Submit</Button>

// ❌ Bad - too many responsibilities
<SuperComponent
  isButton
  isLink
  isCard
  hasIcon
  hasImage
/>
```

**2. Composition Over Configuration** Build complex UIs by combining simple
components.

```tsx
// ✅ Good - composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Text>Content</Text>
  </CardContent>
</Card>

// ❌ Bad - complex configuration
<Card
  title="Title"
  content="Content"
  hasHeader
  hasFooter
  headerAlign="left"
  contentPadding="large"
/>
```

**3. Controlled Components** Let parent manage state for flexibility.

```tsx
// ✅ Good - controlled
<Input
  value={value}
  onChange={setValue}
/>

// ⚠️ Sometimes OK - uncontrolled
<Input defaultValue="initial" />
```

## Component Categories

### 1. Form Components

#### Button

```tsx
// components/Button/Button.tsx
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-primary text-white hover:bg-brand-primary-hover focus-visible:ring-brand-primary',
        secondary:
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        ghost: 'hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500',
        link: 'text-brand-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### Input

```tsx
// components/Input/Input.tsx
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftAddon, rightAddon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftAddon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {leftAddon}
            </div>
          )}

          <input
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
              'placeholder:text-gray-400',
              'focus:border-brand-primary focus:ring-brand-primary focus:ring-1 focus:outline-none',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              leftAddon && 'pl-10',
              rightAddon && 'pr-10',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightAddon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {rightAddon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

#### Select

```tsx
// components/Select/Select.tsx
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <select
          id={selectId}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
            'focus:border-brand-primary focus:ring-brand-primary focus:ring-1 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
```

### 2. Layout Components

#### Container

```tsx
// components/Container/Container.tsx
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  as: Component = 'div',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <Component
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', maxWidthClasses[maxWidth], className)}
    >
      {children}
    </Component>
  );
};
```

#### Stack

```tsx
// components/Stack/Stack.tsx
import { cn } from '@/lib/utils';

interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  spacing?: keyof typeof spacingMap;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  className?: string;
}

const spacingMap = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  12: 'gap-12',
};

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  spacing = 4,
  align = 'stretch',
  justify = 'start',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex',
        direction === 'row' ? 'flex-row' : 'flex-col',
        spacingMap[spacing],
        {
          'items-start': align === 'start',
          'items-center': align === 'center',
          'items-end': align === 'end',
          'items-stretch': align === 'stretch',
          'justify-start': justify === 'start',
          'justify-center': justify === 'center',
          'justify-end': justify === 'end',
          'justify-between': justify === 'between',
          'justify-around': justify === 'around',
        },
        className
      )}
    >
      {children}
    </div>
  );
};
```

### 3. Feedback Components

#### Alert

```tsx
// components/Alert/Alert.tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const alertVariants = cva('relative w-full rounded-lg border p-4', {
  variants: {
    variant: {
      info: 'border-blue-200 bg-blue-50 text-blue-900',
      success: 'border-green-200 bg-green-50 text-green-900',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      error: 'border-red-200 bg-red-50 text-red-900',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

interface AlertProps extends VariantProps<typeof alertVariants> {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  title,
  icon,
  onClose,
  variant,
  className,
}) => {
  return (
    <div className={cn(alertVariants({ variant }), className)} role="alert">
      <div className="flex gap-3">
        {icon && <div className="shrink-0">{icon}</div>}

        <div className="flex-1">
          {title && <h5 className="mb-1 font-medium">{title}</h5>}
          <div className="text-sm">{children}</div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1 hover:bg-black/10"
            aria-label="Close alert"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
```

#### Modal

```tsx
// components/Modal/Modal.tsx
import { useEffect } from 'react';

import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          'relative z-50 w-full rounded-lg bg-white p-6 shadow-xl',
          sizeClasses[size],
          'max-h-[90vh] overflow-y-auto'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="mb-4 flex items-center justify-between">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                aria-label="Close modal"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>,
    document.body
  );
};

// Modal compound components
Modal.Header = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

Modal.Body = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

Modal.Footer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">{children}</div>
);
```

### 4. Data Display Components

#### Card

```tsx
// components/Card/Card.tsx
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, hover, onClick }) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
        hover && 'transition-shadow hover:shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('mb-4 border-b border-gray-200 pb-4', className)}>{children}</div>
);

Card.Title = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
);

Card.Description = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-600">{children}</p>
);

Card.Content = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('text-gray-600', className)}>{children}</div>
);

Card.Footer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('mt-4 border-t border-gray-200 pt-4', className)}>{children}</div>
);
```

## Component API Design

### Props Interface Design

```tsx
// ✅ Good - Clear, typed props
interface ButtonProps {
  /** Button text or content */
  children: React.ReactNode;

  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost';

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Show loading state */
  isLoading?: boolean;

  /** Icon to show on the left */
  leftIcon?: React.ReactNode;

  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** Disable the button */
  disabled?: boolean;
}

// ❌ Bad - unclear, untyped
interface ButtonProps {
  children: any;
  type?: string;
  loading?: any;
  icon?: any;
  click?: Function;
}
```

### Sensible Defaults

```tsx
// ✅ Good - sensible defaults
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  ...props
}) => {
  // Implementation
};

// Usage - minimal props needed
<Button>Click me</Button>;
```

### Flexible but Constrained

```tsx
// Allow className for flexibility
interface ComponentProps {
  className?: string;
  // ... other props
}

// Use cn() to merge classes safely
<div className={cn('base-classes', className)}>
```

## Composition Patterns

### Compound Components

```tsx
// Parent manages shared state
const Tabs: React.FC & {
  List: typeof TabList;
  Tab: typeof Tab;
  Panels: typeof TabPanels;
  Panel: typeof TabPanel;
} = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>
  );
};

// Child components consume context
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// Usage
<Tabs>
  <Tabs.List>
    <Tabs.Tab>Tab 1</Tabs.Tab>
    <Tabs.Tab>Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel>Content 1</Tabs.Panel>
    <Tabs.Panel>Content 2</Tabs.Panel>
  </Tabs.Panels>
</Tabs>;
```

### Render Props

```tsx
const DataFetcher: React.FC<{
  url: string;
  children: (data: any, loading: boolean, error: Error | null) => React.ReactNode;
}> = ({ url, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ... fetch logic

  return <>{children(data, loading, error)}</>;
};

// Usage
<DataFetcher url="/api/users">
  {(data, loading, error) => {
    if (loading) return <Spinner />;
    if (error) return <Alert variant="error">{error.message}</Alert>;
    return <UserList users={data} />;
  }}
</DataFetcher>;
```

## Documentation Standards

### Component Documentation Template

````tsx
/**
 * Button component for user actions
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 * ```
 *
 * @example With icon
 * ```tsx
 * <Button leftIcon={<PlusIcon />}>
 *   Add Item
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementation
};
````

### Storybook Stories

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Add Item',
    leftIcon: <PlusIcon />,
  },
};

export const Loading: Story = {
  args: {
    children: 'Submit',
    isLoading: true,
  },
};
```

## Testing Strategy

### Unit Tests

```tsx
// Button.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Accessibility Tests

```tsx
it('has proper ARIA attributes', () => {
  render(<Button aria-label="Close dialog">×</Button>);
  expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
});

it('is keyboard accessible', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);

  const button = screen.getByRole('button');
  button.focus();
  fireEvent.keyDown(button, { key: 'Enter' });

  expect(handleClick).toHaveBeenCalled();
});
```

## Best Practices

✅ **DO:**

- Use TypeScript for type safety
- Support ref forwarding with `forwardRef`
- Include ARIA attributes
- Use semantic HTML
- Make components controllable
- Document with JSDoc comments
- Write comprehensive tests
- Create Storybook stories

❌ **DON'T:**

- Create overly complex components
- Hardcode values (use tokens)
- Forget error states
- Skip accessibility
- Make components too opinionated
- Ignore edge cases

## Next Steps

- [Design Principles](./04-design-principles.md)
- [Accessibility](./05-accessibility.md)
- Practice building components
- Study production component libraries (shadcn/ui, Radix, Headless UI)
