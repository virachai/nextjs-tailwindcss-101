# Modern Website Templates with Tailwind CSS

> Production-ready component patterns and templates for building consistent,
> professional UIs following Airbnb-level frontend standards.

## Table of Contents

- [Design System Overview](#design-system-overview)
- [Component Templates](#component-templates)
- [Layout Patterns](#layout-patterns)
- [Best Practices](#best-practices)
- [Accessibility Standards](#accessibility-standards)

---

## Design System Overview

Our Tailwind configuration ([tailwind.config.ts](../../tailwind.config.ts))
provides a comprehensive design system for UI consistency.

### Color System

**Brand Colors** - Primary brand identity

```tsx
// 11 shades from 50 (lightest) to 950 (darkest)
<button className="bg-brand-500 hover:bg-brand-600 text-white">
  Primary Action
</button>
```

**Semantic Colors** - Contextual feedback

```tsx
// Success (green), Warning (amber), Error (red), Info (blue)
<div className="border-success-500 bg-success-50 border-l-4 p-4">
  <p className="text-success-700">Operation successful</p>
</div>
```

**Neutral Colors** - Gray scale for text and backgrounds

```tsx
<div className="bg-neutral-50 dark:bg-neutral-900">
  <p className="text-neutral-900 dark:text-neutral-50">Content</p>
</div>
```

### Typography Scale

Consistent type system with line heights:

```tsx
<h1 className="text-4xl font-bold">Page Title (36px)</h1>
<h2 className="text-3xl font-semibold">Section (30px)</h2>
<h3 className="text-2xl font-semibold">Subsection (24px)</h3>
<p className="text-base">Body text (16px)</p>
<small className="text-sm text-neutral-600">Caption (14px)</small>
```

### Spacing System

4px base unit for consistent spacing:

```tsx
// Standard scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64...
<div className="p-4 mb-6 space-y-8">
  {/* 16px padding, 24px bottom margin, 32px vertical gaps */}
</div>

// Custom values: 18px, 52px, 60px, 68px, 72px
<div className="pt-4.5 pb-13"> {/* 18px top, 52px bottom */}
```

### Shadow System

7 elevation levels for depth hierarchy:

```tsx
<div className="shadow-xs">Subtle card</div>
<div className="shadow-md">Default card</div>
<div className="shadow-xl">Elevated modal</div>
<div className="shadow-2xl">Maximum depth</div>
```

### Border Radius

Rounded corner system:

```tsx
<button className="rounded-lg">Standard (8px)</button>
<div className="rounded-2xl">Large card (16px)</div>
<img className="rounded-full" /> {/* Circle/pill */}
```

### Z-Index Scale

Layering system for overlapping elements:

```tsx
// Semantic layers
<nav className="z-sticky">Sticky header (1020)</nav>
<div className="z-modal">Modal dialog (1040)</div>
<div className="z-tooltip">Tooltip (1060)</div>

// Numeric scale: 0, 10, 20, 30, 40, 50
<div className="relative z-10">Above siblings</div>
```

---

## Component Templates

### Button Variants

```tsx
// Primary Button
<button className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
  Primary Action
</button>

// Secondary Button
<button className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">
  Secondary Action
</button>

// Ghost Button
<button className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:text-neutral-200 dark:hover:bg-neutral-800">
  Tertiary Action
</button>

// Destructive Button
<button className="inline-flex items-center justify-center rounded-lg bg-error-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 active:scale-95">
  Delete
</button>

// Icon Button
<button className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:text-neutral-200 dark:hover:bg-neutral-800">
  <svg className="h-5 w-5">...</svg>
</button>
```

### Card Patterns

```tsx
// Basic Card
<div className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-200 hover:shadow-xl dark:bg-neutral-800">
  <div className="p-6">
    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
      Card Title
    </h3>
    <p className="mt-2 text-neutral-600 dark:text-neutral-300">
      Card description text goes here
    </p>
  </div>
</div>

// Card with Image
<div className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-200 hover:shadow-xl dark:bg-neutral-800">
  <img src="/image.jpg" alt="" className="h-48 w-full object-cover" />
  <div className="p-6">
    <h3 className="text-xl font-semibold">Card Title</h3>
    <p className="mt-2 text-neutral-600 dark:text-neutral-300">Description</p>
  </div>
</div>

// Interactive Card
<button className="w-full overflow-hidden rounded-2xl bg-white text-left shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-neutral-800">
  <div className="p-6">
    <h3 className="text-xl font-semibold">Clickable Card</h3>
    <p className="mt-2 text-neutral-600 dark:text-neutral-300">Interactive content</p>
  </div>
</button>
```

### Form Inputs

```tsx
// Text Input
<div className="space-y-1">
  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
    Email address
  </label>
  <input
    type="email"
    id="email"
    className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 shadow-sm transition-colors duration-200 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:focus:border-brand-400"
    placeholder="you@example.com"
  />
  <p className="text-xs text-neutral-500 dark:text-neutral-400">Helper text goes here</p>
</div>

// Textarea
<textarea
  className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 shadow-sm transition-colors duration-200 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50"
  rows={4}
  placeholder="Enter your message..."
/>

// Select
<select className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 shadow-sm transition-colors duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

// Checkbox
<label className="flex items-center space-x-3">
  <input
    type="checkbox"
    className="h-4 w-4 rounded border-neutral-300 text-brand-500 transition-colors duration-200 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-neutral-700"
  />
  <span className="text-sm text-neutral-700 dark:text-neutral-200">
    I agree to the terms
  </span>
</label>

// Radio Button
<label className="flex items-center space-x-3">
  <input
    type="radio"
    name="option"
    className="h-4 w-4 border-neutral-300 text-brand-500 transition-colors duration-200 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-neutral-700"
  />
  <span className="text-sm text-neutral-700 dark:text-neutral-200">Option A</span>
</label>
```

### Alert/Banner Components

```tsx
// Success Alert
<div className="flex items-start space-x-3 rounded-lg border-l-4 border-success-500 bg-success-50 p-4 dark:bg-success-900/20">
  <svg className="h-5 w-5 flex-shrink-0 text-success-500" />
  <div className="flex-1">
    <h4 className="font-medium text-success-700 dark:text-success-400">Success</h4>
    <p className="mt-1 text-sm text-success-600 dark:text-success-300">
      Your changes have been saved successfully.
    </p>
  </div>
</div>

// Warning Alert
<div className="flex items-start space-x-3 rounded-lg border-l-4 border-warning-500 bg-warning-50 p-4 dark:bg-warning-900/20">
  <svg className="h-5 w-5 flex-shrink-0 text-warning-500" />
  <div className="flex-1">
    <h4 className="font-medium text-warning-700 dark:text-warning-400">Warning</h4>
    <p className="mt-1 text-sm text-warning-600 dark:text-warning-300">
      Please review before proceeding.
    </p>
  </div>
</div>

// Error Alert
<div className="flex items-start space-x-3 rounded-lg border-l-4 border-error-500 bg-error-50 p-4 dark:bg-error-900/20">
  <svg className="h-5 w-5 flex-shrink-0 text-error-500" />
  <div className="flex-1">
    <h4 className="font-medium text-error-700 dark:text-error-400">Error</h4>
    <p className="mt-1 text-sm text-error-600 dark:text-error-300">
      There was a problem processing your request.
    </p>
  </div>
</div>
```

### Badge/Tag Components

```tsx
// Status Badges
<span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-900/30 dark:text-success-400">
  Active
</span>

<span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
  Pending
</span>

<span className="inline-flex items-center rounded-full bg-error-100 px-2.5 py-0.5 text-xs font-medium text-error-700 dark:bg-error-900/30 dark:text-error-400">
  Inactive
</span>

// Removable Tag
<span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
  Tag Name
  <button className="rounded-full hover:bg-brand-200 dark:hover:bg-brand-800">
    <svg className="h-3 w-3" />
  </button>
</span>
```

### Loading States

```tsx
// Spinner
<div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-brand-500" />

// Skeleton Loader
<div className="space-y-4 animate-fadeIn">
  <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
  <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
  <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-700" />
</div>

// Pulsing Card
<div className="animate-pulse space-y-4 rounded-2xl bg-white p-6 shadow-md dark:bg-neutral-800">
  <div className="h-6 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
  <div className="space-y-2">
    <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
    <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-700" />
  </div>
</div>
```

---

## Layout Patterns

### Container System

```tsx
// Max-width containers
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* 1280px max width with responsive padding */}
</div>

// Narrow container (for reading content)
<div className="mx-auto max-w-3xl px-4">
  {/* 768px max width */}
</div>
```

### Grid Layouts

```tsx
// Responsive Grid
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Auto-responsive cards */}
</div>

// Auto-fit Grid (CSS Grid power)
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
  {/* Automatically fits columns */}
</div>

// Dashboard Layout
<div className="grid gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2">{/* Main content (2/3) */}</div>
  <div className="lg:col-span-1">{/* Sidebar (1/3) */}</div>
</div>
```

### Flexbox Patterns

```tsx
// Centered Layout
<div className="flex min-h-screen items-center justify-center">
  {/* Vertically and horizontally centered */}
</div>

// Split Layout
<div className="flex items-center justify-between">
  <div>{/* Left side */}</div>
  <div>{/* Right side */}</div>
</div>

// Stack with Gap
<div className="flex flex-col space-y-4">
  {/* Vertical stack with 16px gaps */}
</div>

// Horizontal List
<div className="flex items-center space-x-2">
  {/* Horizontal items with 8px gaps */}
</div>
```

### Navigation Patterns

```tsx
// Header Navigation
<header className="sticky top-0 z-sticky border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80">
  <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <div className="flex items-center space-x-8">
      <a href="/" className="text-xl font-bold text-brand-500">Logo</a>
      <div className="hidden space-x-4 md:flex">
        <a href="#" className="text-sm font-medium text-neutral-700 hover:text-brand-500 dark:text-neutral-200">
          Features
        </a>
        <a href="#" className="text-sm font-medium text-neutral-700 hover:text-brand-500 dark:text-neutral-200">
          Pricing
        </a>
      </div>
    </div>
    <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
      Sign In
    </button>
  </nav>
</header>

// Sidebar Navigation
<aside className="fixed inset-y-0 left-0 z-fixed w-64 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
  <nav className="space-y-1 p-4">
    <a href="#" className="flex items-center space-x-3 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
      <svg className="h-5 w-5" />
      <span>Dashboard</span>
    </a>
    <a href="#" className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800">
      <svg className="h-5 w-5" />
      <span>Settings</span>
    </a>
  </nav>
</aside>
```

### Modal/Dialog Pattern

```tsx
// Modal Overlay + Dialog
<div className="z-modal fixed inset-0 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm">
  <div className="animate-scaleIn w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-800">
    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
      Modal Title
    </h2>
    <p className="mt-2 text-neutral-600 dark:text-neutral-300">
      Modal content goes here
    </p>
    <div className="mt-6 flex justify-end space-x-3">
      <button className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700">
        Cancel
      </button>
      <button className="bg-brand-500 hover:bg-brand-600 rounded-lg px-4 py-2 text-sm font-medium text-white">
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

## Best Practices

### 1. Consistent Spacing

Always use the spacing scale from the config:

```tsx
// ✅ Good - Uses scale
<div className="p-4 mb-6 space-y-8">

// ❌ Bad - Arbitrary values
<div className="p-[17px] mb-[23px] space-y-[35px]">
```

### 2. Color Usage

Use semantic colors for context:

```tsx
// ✅ Good - Semantic
<button className="bg-error-500 hover:bg-error-600">Delete</button>
<div className="text-success-700">Success message</div>

// ❌ Bad - Direct colors
<button className="bg-red-500">Delete</button>
<div className="text-green-700">Success message</div>
```

### 3. Dark Mode Support

Always provide dark mode variants:

```tsx
// ✅ Good - Dark mode support
<div className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50">

// ❌ Bad - Light mode only
<div className="bg-white text-black">
```

### 4. Interactive States

Include all interactive states:

```tsx
// ✅ Good - All states
<button className="bg-brand-500 hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 active:scale-95 disabled:opacity-50">

// ❌ Bad - Only default
<button className="bg-brand-500">
```

### 5. Responsive Design

Use mobile-first responsive breakpoints:

```tsx
// ✅ Good - Mobile first
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

// ❌ Bad - Desktop first
<div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1">
```

### 6. Animation Performance

Use transform/opacity for animations:

```tsx
// ✅ Good - GPU accelerated
<div className="transition-transform duration-200 hover:scale-105">

// ❌ Bad - Causes reflow
<div className="transition-all duration-200 hover:w-64">
```

### 7. Accessibility Focus States

Always provide visible focus indicators:

```tsx
// ✅ Good - Visible focus
<button className="focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">

// ❌ Bad - No focus indicator
<button className="outline-none">
```

### 8. Consistent Border Radius

Use the border radius scale:

```tsx
// ✅ Good - Scale values
<div className="rounded-lg"> {/* 8px */}
<div className="rounded-2xl"> {/* 16px */}

// ❌ Bad - Arbitrary
<div className="rounded-[13px]">
```

### 9. Z-Index Management

Use semantic z-index values:

```tsx
// ✅ Good - Semantic layers
<nav className="z-sticky">
<div className="z-modal">

// ❌ Bad - Magic numbers
<nav className="z-[999]">
<div className="z-[9999]">
```

### 10. Component Composition

Build reusable component patterns:

```tsx
// ✅ Good - Reusable base + variants
const baseButton = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2";
const primaryButton = `${baseButton} bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500`;

// ❌ Bad - Duplicate classes everywhere
<button className="inline-flex items-center justify-center rounded-lg px-4 py-2...">
<button className="inline-flex items-center justify-center rounded-lg px-4 py-2...">
```

---

## Accessibility Standards

### ARIA Labels

```tsx
// Icon buttons
<button aria-label="Close menu">
  <svg className="h-5 w-5" />
</button>

// Form inputs
<input aria-describedby="email-help" />
<p id="email-help">We'll never share your email</p>
```

### Keyboard Navigation

```tsx
// Focusable interactive elements
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
  className="focus:ring-2"
>
  Interactive div
</div>
```

### Screen Reader Support

```tsx
// Hide decorative elements
<svg aria-hidden="true" className="h-4 w-4" />

// Provide alternative text
<img src="chart.png" alt="Revenue growth chart showing 23% increase" />

// Loading states
<div role="status" aria-live="polite">
  {loading ? 'Loading...' : 'Content loaded'}
</div>
```

### Color Contrast

Ensure WCAG AA compliance (4.5:1 for normal text):

```tsx
// ✅ Good - High contrast
<p className="text-neutral-900 dark:text-neutral-50">Primary text</p>
<p className="text-neutral-600 dark:text-neutral-300">Secondary text</p>

// ❌ Bad - Low contrast
<p className="text-neutral-400">Hard to read</p>
```

### Focus Management

```tsx
// Trap focus in modals
useEffect(() => {
  const modal = modalRef.current;
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  firstElement?.focus();

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  };

  modal.addEventListener('keydown', handleTab);
  return () => modal.removeEventListener('keydown', handleTab);
}, []);
```

---

## Animation Usage

### Micro-interactions

```tsx
// Fade in on mount
<div className="animate-fadeIn">Content</div>

// Slide in from directions
<div className="animate-slideInFromLeft">Sidebar</div>
<div className="animate-slideInFromBottom">Notification</div>

// Scale on interaction
<button className="transition-transform duration-200 active:scale-95">
  Press me
</button>
```

### Loading Animations

```tsx
// Spinner
<div className="animate-spin">⟳</div>

// Pulse
<div className="animate-pulse">Loading...</div>

// Custom zoom pulse
<div className="animate-zoomPulse">●</div>
```

### Page Transitions

```tsx
// Stagger children animation
<div className="space-y-4">
  <div className="animate-slideInFromLeft" style={{ animationDelay: '0ms' }}>
    Item 1
  </div>
  <div className="animate-slideInFromLeft" style={{ animationDelay: '100ms' }}>
    Item 2
  </div>
  <div className="animate-slideInFromLeft" style={{ animationDelay: '200ms' }}>
    Item 3
  </div>
</div>
```

---

## Quick Reference

### Common Class Combinations

```tsx
// Card container
'rounded-2xl bg-white p-6 shadow-md dark:bg-neutral-800';

// Primary button
'rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:ring-2 focus:ring-brand-500';

// Input field
'w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-800';

// Section heading
'text-3xl font-semibold text-neutral-900 dark:text-neutral-50';

// Body text
'text-base text-neutral-700 dark:text-neutral-300';

// Centered container
'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
```

---

## Resources

- [Tailwind Config](../../tailwind.config.ts) - Full theme configuration
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Official documentation
- [Headless UI](https://headlessui.com/) - Unstyled accessible components
- [Radix UI](https://www.radix-ui.com/) - Primitive component library
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility
  standards

---

**Version:** 1.0.0 **Last Updated:** 2025-10-03 **Maintained by:** Frontend Team
