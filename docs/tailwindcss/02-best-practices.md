# Tailwind CSS Best Practices

Professional patterns and techniques used by top-tier frontend developers.

## Table of Contents

- [Code Organization](#code-organization)
- [Component Composition](#component-composition)
- [Reusability Patterns](#reusability-patterns)
- [Performance Optimization](#performance-optimization)
- [Maintainability](#maintainability)
- [Dark Mode](#dark-mode)
- [Accessibility](#accessibility)
- [Common Pitfalls](#common-pitfalls)

## Code Organization

### Group Related Classes

```tsx
// ❌ Bad - random order
<div className="text-blue-500 flex p-4 bg-white items-center rounded-lg shadow-md">

// ✅ Good - logical grouping (auto-sorted by Prettier)
<div className="flex items-center rounded-lg bg-white p-4 text-blue-500 shadow-md">
  {/* Layout → Spacing → Typography → Visual */}
</div>
```

### Use Line Breaks for Complex Components

```tsx
// ❌ Bad - unreadable
<button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">

// ✅ Good - readable with proper formatting
<button
  className="
    inline-flex items-center justify-center
    rounded-md bg-blue-600 px-4 py-2
    text-sm font-medium text-white
    transition-colors hover:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
  "
>
  Submit
</button>
```

### Extract to Variables

```tsx
// ❌ Bad - repeated classes
<div className="rounded-lg bg-white p-6 shadow-md">
  <div className="rounded-lg bg-white p-6 shadow-md">
    {/* Duplicate styles */}
  </div>
</div>

// ✅ Good - extract to variable
const cardClasses = 'rounded-lg bg-white p-6 shadow-md';

<div className={cardClasses}>
  <div className={cardClasses}>
    {/* Reusable */}
  </div>
</div>
```

### Use Template Literals for Conditionals

```tsx
// ❌ Bad - hard to read
<button className={`px-4 py-2 ${variant === 'primary' ? 'bg-blue-600 text-white' : variant === 'secondary' ? 'bg-gray-200 text-gray-900' : 'bg-transparent'}`}>

// ✅ Good - readable conditionals
<button
  className={`
    px-4 py-2
    ${variant === 'primary' && 'bg-blue-600 text-white'}
    ${variant === 'secondary' && 'bg-gray-200 text-gray-900'}
    ${variant === 'ghost' && 'bg-transparent'}
  `}
>

// ✅ Better - use clsx/classnames
import clsx from 'clsx';

<button
  className={clsx(
    'px-4 py-2',
    variant === 'primary' && 'bg-blue-600 text-white',
    variant === 'secondary' && 'bg-gray-200 text-gray-900',
    variant === 'ghost' && 'bg-transparent'
  )}
>
```

## Component Composition

### Build Reusable Components

```tsx
// Base Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',

        // Variants
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        variant === 'secondary' && 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        variant === 'ghost' && 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',

        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',

        // Custom classes
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Usage
<Button variant="primary" size="lg">
  Get Started
</Button>
```

### Composition Pattern

```tsx
// Container components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('rounded-lg bg-white shadow-md', className)}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-b border-gray-200 px-6 py-4">{children}</div>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-6 py-4">{children}</div>
);

const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-t border-gray-200 px-6 py-4">{children}</div>
);

// Usage - flexible composition
<Card>
  <CardHeader>
    <h2 className="text-xl font-bold">Profile</h2>
  </CardHeader>
  <CardContent>
    <p>User information goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Edit Profile</Button>
  </CardFooter>
</Card>
```

### Polymorphic Components

```tsx
// Component that can render as different HTML elements
type ButtonAsButton = {
  as?: 'button';
  onClick?: () => void;
} & ButtonBaseProps;

type ButtonAsLink = {
  as: 'a';
  href: string;
} & ButtonBaseProps;

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button: React.FC<ButtonProps> = ({ as: Component = 'button', children, className, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white';

  return (
    <Component className={clsx(baseClasses, className)} {...props}>
      {children}
    </Component>
  );
};

// Usage
<Button onClick={handleClick}>Button</Button>
<Button as="a" href="/about">Link styled as button</Button>
```

## Reusability Patterns

### Utility Function for Class Merging

```tsx
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Usage - allows overriding classes
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => (
  <div className={cn('rounded-lg bg-white p-6 shadow-md', className)}>
    {children}
  </div>
);

// Override background
<Card className="bg-gray-100">
  {/* bg-white is replaced with bg-gray-100 */}
</Card>
```

### Variant-Based Patterns

```tsx
// Using cva (class-variance-authority)
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'hover:bg-gray-100 text-gray-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant, size, className, children }) => (
  <button className={cn(buttonVariants({ variant, size }), className)}>
    {children}
  </button>
);

// Usage
<Button variant="primary" size="lg">Primary Large</Button>
<Button variant="destructive" size="sm">Delete</Button>
```

### Custom Hooks for Styles

```tsx
// hooks/useButtonStyles.ts
const useButtonStyles = (variant: string, size: string) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return cn(baseStyles, variantStyles[variant], sizeStyles[size]);
};

// Usage
const Button = ({ variant, size, children }) => {
  const styles = useButtonStyles(variant, size);
  return <button className={styles}>{children}</button>;
};
```

## Performance Optimization

### Avoid Arbitrary Values

```tsx
// ❌ Bad - arbitrary values (not purged efficiently)
<div className="w-[247px] h-[93px] p-[23px]">

// ✅ Good - use scale values
<div className="h-24 w-64 p-6">

// ✅ When arbitrary is necessary, use sparingly
<div className="w-[calc(100%-2rem)]">
```

### Use Tailwind's Built-in Values

```tsx
// ❌ Bad - recreating Tailwind values
<div className="shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">

// ✅ Good - use built-in shadow
<div className="shadow-md">

// ❌ Bad - custom color
<div className="bg-[#3b82f6]">

// ✅ Good - use palette
<div className="bg-blue-500">
```

### Optimize Class Lists

```tsx
// ❌ Bad - too many conditional classes
<div
  className={`
    ${condition1 ? 'text-red-500' : ''}
    ${condition2 ? 'bg-blue-500' : ''}
    ${condition3 ? 'p-4' : ''}
    ${condition4 ? 'rounded' : ''}
  `}
>

// ✅ Good - combine conditions
<div
  className={clsx(
    condition1 && 'text-red-500',
    condition2 && 'bg-blue-500',
    condition3 && 'p-4',
    condition4 && 'rounded'
  )}
>
```

### Memoize Complex Class Strings

```tsx
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Expensive class computation
  const cardClasses = useMemo(
    () =>
      cn(
        'rounded-lg bg-white p-6 shadow-md transition-all',
        product.featured && 'border-2 border-blue-500',
        product.onSale && 'bg-yellow-50',
        product.outOfStock && 'opacity-50'
      ),
    [product.featured, product.onSale, product.outOfStock]
  );

  return <div className={cardClasses}>{/* content */}</div>;
};
```

## Maintainability

### Consistent Spacing Scale

```tsx
// ✅ Establish spacing system
// Small: 2, 4
// Medium: 6, 8
// Large: 12, 16
// Extra Large: 20, 24

// Card spacing
<div className="rounded-lg bg-white p-6">  {/* Medium padding */}
  <h2 className="mb-4 text-xl font-bold">  {/* Medium spacing */}
  <p className="mb-6 text-gray-600">       {/* Medium spacing */}
  <button className="px-4 py-2">          {/* Small padding */}
</div>
```

### Consistent Color Usage

```tsx
// Define color roles in your app
const colorRoles = {
  // Text
  textPrimary: 'text-gray-900 dark:text-white',
  textSecondary: 'text-gray-600 dark:text-gray-400',
  textMuted: 'text-gray-500 dark:text-gray-500',

  // Backgrounds
  bgPrimary: 'bg-white dark:bg-gray-900',
  bgSecondary: 'bg-gray-50 dark:bg-gray-800',

  // Borders
  borderDefault: 'border-gray-200 dark:border-gray-700',

  // Brand
  brandPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
  brandSecondary: 'text-blue-600 hover:text-blue-700',
};

// Use consistently
<div className={colorRoles.bgPrimary}>
  <h1 className={colorRoles.textPrimary}>Title</h1>
  <p className={colorRoles.textSecondary}>Description</p>
</div>
```

### Document Custom Patterns

```tsx
/**
 * Standard card component used throughout the app
 * - Rounded corners (lg)
 * - White background
 * - Medium shadow
 * - Hover: Larger shadow
 */
const Card: React.FC = ({ children }) => (
  <div className="rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
    {children}
  </div>
);
```

## Dark Mode

### Use Dark Mode Classes

```tsx
// ✅ Good - dark mode variant
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  <p className="text-gray-600 dark:text-gray-400">
    Description text
  </p>
</div>

// ✅ Better - extract to reusable classes
const themeClasses = {
  card: 'bg-white dark:bg-gray-800',
  textPrimary: 'text-gray-900 dark:text-white',
  textSecondary: 'text-gray-600 dark:text-gray-400',
  border: 'border-gray-200 dark:border-gray-700',
};

<div className={themeClasses.card}>
  <h2 className={themeClasses.textPrimary}>Title</h2>
  <p className={themeClasses.textSecondary}>Description</p>
</div>
```

### Dark Mode Best Practices

```tsx
// ✅ Always pair light and dark
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">

// ❌ Don't forget dark mode pairs
<div className="bg-white">  {/* Missing dark:bg-* */}
  <p className="text-gray-900">  {/* Missing dark:text-* */}

// ✅ Test contrast in both modes
<button className="bg-blue-600 text-white dark:bg-blue-500 dark:text-white">
  {/* Ensure sufficient contrast in both modes */}
</button>

// ✅ Use dark mode for borders and shadows
<div className="border border-gray-200 shadow-md dark:border-gray-700 dark:shadow-gray-900/50">
```

## Accessibility

### Focus States

```tsx
// ✅ Always include focus states
<button className="rounded bg-blue-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Accessible Button
</button>

// ✅ Visible focus indicator
<a href="/" className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Link
</a>

// ✅ Custom focus styles
<input className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
```

### Screen Reader Classes

```tsx
// Visually hidden but available to screen readers
<span className="sr-only">Loading...</span>

// Focus visible (only show on keyboard focus)
<button className="focus-visible:ring-2 focus-visible:ring-blue-500">

// Not sr-only (visible to everyone)
<span className="not-sr-only">
```

### Color Contrast

```tsx
// ✅ Good - sufficient contrast
<p className="text-gray-900">  {/* 21:1 contrast on white */}
<p className="text-gray-700">  {/* 4.5:1+ contrast */}

// ⚠️ Careful - low contrast
<p className="text-gray-400">  {/* May not meet WCAG AA */}

// ✅ Use darker colors for text
<p className="text-gray-600">  {/* Better for readability */}
```

## Common Pitfalls

### ❌ Don't: Overuse Arbitrary Values

```tsx
// ❌ Bad
<div className="mt-[13px] mb-[27px] w-[384px]">

// ✅ Good - use scale
<div className="mb-6 mt-4 w-96">
```

### ❌ Don't: Duplicate Styles

```tsx
// ❌ Bad - repeated classes
<div className="rounded-lg bg-white p-6 shadow-md">
  <div className="rounded-lg bg-white p-6 shadow-md">

// ✅ Good - extract component
const Card = ({ children }) => (
  <div className="rounded-lg bg-white p-6 shadow-md">{children}</div>
);
```

### ❌ Don't: Ignore Responsive Design

```tsx
// ❌ Bad - fixed sizes
<div className="w-64">

// ✅ Good - responsive
<div className="w-full md:w-64">
```

### ❌ Don't: Fight Tailwind

```tsx
// ❌ Bad - custom CSS for what Tailwind provides
<div className="custom-shadow">  {/* shadow-lg exists */}
<div className="custom-rounded"> {/* rounded-lg exists */}

// ✅ Good - use Tailwind utilities
<div className="rounded-lg shadow-lg">
```

### ✅ Do: Use Semantic Class Names

```tsx
// ✅ Good - semantic component names
const PrimaryButton = ({ children }) => (
  <button className="rounded bg-blue-600 px-4 py-2 text-white">
    {children}
  </button>
);

// Not just utility classes everywhere
<PrimaryButton>Submit</PrimaryButton>
```

### ✅ Do: Leverage the Cascade

```tsx
// ✅ Good - set defaults on parent
<div className="text-gray-600">
  <p>Inherits gray-600</p>
  <p className="text-blue-600">Override to blue</p>
  <p>Back to gray-600</p>
</div>
```

## Quick Reference Checklist

- [ ] Group classes logically (layout → spacing → typography → visual)
- [ ] Use `clsx` or `cn()` for conditional classes
- [ ] Extract repeated patterns to components
- [ ] Always include dark mode variants
- [ ] Add focus states for interactive elements
- [ ] Use responsive modifiers (sm, md, lg, xl)
- [ ] Stick to Tailwind's spacing scale
- [ ] Document custom patterns
- [ ] Test accessibility (keyboard navigation, screen readers)
- [ ] Keep class names readable (use line breaks for long lists)

## Next Steps

- [Component Patterns](./03-component-patterns.md)
- [Responsive Design](./04-responsive-design.md)
- [Advanced Techniques](./05-advanced-techniques.md)
