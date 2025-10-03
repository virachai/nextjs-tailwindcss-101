# Layout Templates

> Structural patterns for consistent page organization following Airbnb-level
> architecture standards.

## Table of Contents

- [What Are Layout Templates?](#what-are-layout-templates)
- [Core Layout Patterns](#core-layout-patterns)
- [Production-Ready Templates](#production-ready-templates)
- [Responsive Strategies](#responsive-strategies)
- [Best Practices](#best-practices)

---

## What Are Layout Templates?

Layout templates define the **structural skeleton** of your pages:

- **Container patterns** - Maximum width, padding, centering
- **Grid systems** - Column-based layouts
- **Flexbox patterns** - Flexible alignment
- **App shells** - Complete page structures

### Layout Hierarchy

```plaintext
┌─────────────────────────────────────────────────┐
│ App Shell (Full page structure)                 │
│                                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ Header/Navigation                          │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ Main Content Area                          │ │
│  │                                            │ │
│  │  ┌──────────────┐  ┌──────────────────┐   │ │
│  │  │ Sidebar      │  │ Content          │   │ │
│  │  │ (Optional)   │  │                  │   │ │
│  │  └──────────────┘  └──────────────────┘   │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ Footer                                     │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## Core Layout Patterns

### 1. Container Pattern

**Purpose:** Constrain content width and center on large screens.

```tsx
// Basic Container
export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

// Usage
<Container>
  <h1>Your content here</h1>
</Container>
```

**Breakpoint Widths:**

```tsx
max-w-7xl    // 1280px - Marketing pages
max-w-6xl    // 1152px - Blog content
max-w-5xl    // 1024px - Documentation
max-w-4xl    // 896px  - Long-form articles
```

**Padding System:**

```tsx
px-4         // 16px mobile
sm:px-6      // 24px tablet (640px+)
lg:px-8      // 32px desktop (1024px+)
```

### 2. Section Pattern

**Purpose:** Vertical spacing between page sections.

```tsx
export const Section: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <section className={`py-12 md:py-16 lg:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
};

// Usage
<Section>
  <h2>Section Title</h2>
  <p>Section content...</p>
</Section>
```

**Vertical Spacing Scale:**

```tsx
py-12        // 48px mobile
md:py-16     // 64px tablet
lg:py-24     // 96px desktop
```

### 3. Grid Layout Pattern

**Purpose:** Responsive multi-column layouts.

```tsx
// Two-Column Grid
export const TwoColumnGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {children}
    </div>
  );
};

// Three-Column Grid
export const ThreeColumnGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
};

// Four-Column Grid
export const FourColumnGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
};
```

**Responsive Grid Progression:**

```
Mobile:  [■■■■■■■■■■■■]  1 column
Tablet:  [■■■■■][■■■■■]  2 columns
Desktop: [■■■][■■■][■■■] 3 columns
```

### 4. Flexbox Pattern

**Purpose:** Flexible horizontal/vertical alignment.

```tsx
// Horizontal Stack
export const HStack: React.FC<{
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
}> = ({ children, spacing = 'md', align = 'center' }) => {
  const spacingMap = {
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-8',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  };

  return (
    <div className={`flex ${spacingMap[spacing]} ${alignMap[align]}`}>
      {children}
    </div>
  );
};

// Vertical Stack
export const VStack: React.FC<{
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
}> = ({ children, spacing = 'md' }) => {
  const spacingMap = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-8',
  };

  return <div className={`flex flex-col ${spacingMap[spacing]}`}>{children}</div>;
};
```

---

## Production-Ready Templates

### 1. App Shell Template

**Purpose:** Complete page structure with header, content, footer.

```tsx
// src/templates/layout/AppShell.tsx
import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  header,
  footer,
}) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-sticky border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          {header}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {footer && (
        <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
          {footer}
        </footer>
      )}
    </div>
  );
};

// Usage Example
import { AppShell } from '@/templates/layout/AppShell';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Page() {
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <YourContent />
    </AppShell>
  );
}
```

**Key Features:**

- ✅ Sticky header with `sticky top-0`
- ✅ Flex-grow content area with `flex-1`
- ✅ Dark mode support
- ✅ Proper z-index layering

### 2. Two-Column Layout (Sidebar + Content)

**Purpose:** Dashboard, documentation, app pages with sidebar navigation.

```tsx
// src/templates/layout/TwoColumnLayout.tsx
import React from 'react';

interface TwoColumnLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  sidebar,
  children,
  sidebarPosition = 'left',
}) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarPosition === 'left' ? 'order-first' : 'order-last'}
          hidden w-64 flex-shrink-0 border-neutral-200 bg-neutral-50
          dark:border-neutral-800 dark:bg-neutral-950
          lg:block
          ${sidebarPosition === 'left' ? 'border-r' : 'border-l'}
        `}
      >
        <div className="sticky top-0 h-screen overflow-y-auto p-6">
          {sidebar}
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

// Usage Example
import { TwoColumnLayout } from '@/templates/layout/TwoColumnLayout';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardPage() {
  return (
    <TwoColumnLayout sidebar={<Sidebar />}>
      <h1>Dashboard Content</h1>
    </TwoColumnLayout>
  );
}
```

**Responsive Behavior:**

```
Mobile (<1024px):  [■■■■■■■■■■■■]  Full-width content, hidden sidebar
Desktop (≥1024px): [■■■][■■■■■■■]  Sidebar + Content
```

**Key Features:**

- ✅ Responsive (sidebar hidden on mobile)
- ✅ Sticky sidebar with scroll
- ✅ Configurable sidebar position
- ✅ Dark mode support

### 3. Three-Column Layout (Sidebar + Content + Aside)

**Purpose:** Documentation sites, complex dashboards.

```tsx
// src/templates/layout/ThreeColumnLayout.tsx
import React from 'react';

interface ThreeColumnLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  aside: React.ReactNode;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  sidebar,
  children,
  aside,
}) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto p-6">
          {sidebar}
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Right Aside (Table of Contents, etc.) */}
      <aside className="hidden w-64 flex-shrink-0 border-l border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 xl:block">
        <div className="sticky top-0 h-screen overflow-y-auto p-6">
          {aside}
        </div>
      </aside>
    </div>
  );
};

// Usage Example (Documentation Site)
import { ThreeColumnLayout } from '@/templates/layout/ThreeColumnLayout';

export default function DocsPage() {
  return (
    <ThreeColumnLayout
      sidebar={<Navigation />}
      aside={<TableOfContents />}
    >
      <article>
        <h1>Documentation Content</h1>
      </article>
    </ThreeColumnLayout>
  );
}
```

**Responsive Behavior:**

```
Mobile (<1024px):   [■■■■■■■■■■■■]     Full-width
Desktop (1024-1280):[■■■][■■■■■■■]     Sidebar + Content
XL (≥1280px):       [■■][■■■■■][■■]    Sidebar + Content + Aside
```

### 4. Centered Content Layout

**Purpose:** Blog posts, articles, long-form content.

```tsx
// src/templates/layout/CenteredLayout.tsx
import React from 'react';

interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CenteredLayout: React.FC<CenteredLayoutProps> = ({
  children,
  maxWidth = 'lg',
}) => {
  const widthMap = {
    sm: 'max-w-2xl',  // 672px
    md: 'max-w-3xl',  // 768px
    lg: 'max-w-4xl',  // 896px
    xl: 'max-w-5xl',  // 1024px
  };

  return (
    <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className={`mx-auto ${widthMap[maxWidth]}`}>
        {children}
      </div>
    </div>
  );
};

// Usage Example (Blog Post)
import { CenteredLayout } from '@/templates/layout/CenteredLayout';

export default function BlogPost() {
  return (
    <CenteredLayout maxWidth="lg">
      <article className="prose dark:prose-invert">
        <h1>Article Title</h1>
        <p>Article content...</p>
      </article>
    </CenteredLayout>
  );
}
```

**Content Width Guide:**

```
sm (672px):  Tight reading width, poetry, quotes
md (768px):  Optimal reading width for articles
lg (896px):  Standard blog posts
xl (1024px): Wide content, code examples
```

### 5. Split Screen Layout

**Purpose:** Landing pages, authentication pages.

```tsx
// src/templates/layout/SplitScreenLayout.tsx
import React from 'react';

interface SplitScreenLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftBackground?: string;
  rightBackground?: string;
}

export const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({
  left,
  right,
  leftBackground = 'bg-brand-600',
  rightBackground = 'bg-white dark:bg-neutral-900',
}) => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side */}
      <div className={`flex items-center justify-center p-8 ${leftBackground}`}>
        <div className="w-full max-w-md">{left}</div>
      </div>

      {/* Right Side */}
      <div className={`flex items-center justify-center p-8 ${rightBackground}`}>
        <div className="w-full max-w-md">{right}</div>
      </div>
    </div>
  );
};

// Usage Example (Login Page)
import { SplitScreenLayout } from '@/templates/layout/SplitScreenLayout';

export default function LoginPage() {
  return (
    <SplitScreenLayout
      left={
        <div className="text-white">
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="mt-4 text-lg">Sign in to continue to your account</p>
        </div>
      }
      right={<LoginForm />}
    />
  );
}
```

**Responsive Behavior:**

```
Mobile (<1024px):  [■■■■■■■■■■■■]  Stacked vertically
Desktop (≥1024px): [■■■■■][■■■■■]  Side by side
```

---

## Responsive Strategies

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens.

```tsx
// ✅ Mobile-first (Recommended)
<div className="
  flex flex-col        /* Mobile: Vertical stack */
  md:flex-row          /* Tablet: Horizontal row */
  lg:space-x-8         /* Desktop: Add spacing */
">

// ❌ Desktop-first (Not recommended)
<div className="
  flex flex-row lg:flex-row md:flex-row sm:flex-col
">
```

### Breakpoint System

```tsx
// Tailwind breakpoints
sm:  640px   // Small tablets
md:  768px   // Tablets
lg:  1024px  // Laptops
xl:  1280px  // Desktops
2xl: 1536px  // Large desktops
```

### Container Queries (Modern CSS)

For component-specific responsiveness:

```tsx
// Tailwind CSS 4+ supports container queries
<div className="@container">
  <div className="@lg:flex @lg:space-x-4">
    {/* Responsive based on parent container */}
  </div>
</div>
```

---

## Best Practices

### 1. **Consistent Spacing**

Use design tokens from [tailwind.config.ts](../../tailwind.config.ts):

```tsx
// ✅ Good - Design tokens
<div className="space-y-8">      {/* 32px */}
<div className="space-y-12">     {/* 48px */}
<div className="space-y-16">     {/* 64px */}

// ❌ Bad - Arbitrary values
<div className="space-y-[35px]">
```

### 2. **Semantic HTML**

Use correct HTML elements for accessibility:

```tsx
// ✅ Good
<header>...</header>
<nav>...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>

// ❌ Bad
<div className="header">...</div>
<div className="nav">...</div>
```

### 3. **Flexible Layouts**

Avoid fixed heights; let content determine size:

```tsx
// ✅ Good - Flexible
<div className="min-h-screen">

// ❌ Bad - Fixed
<div className="h-screen">  {/* Can cause overflow */}
```

### 4. **Dark Mode Support**

Always design for both light and dark modes:

```tsx
// ✅ Include dark mode variants
<div className="
  bg-white dark:bg-neutral-900
  text-neutral-900 dark:text-neutral-50
  border border-neutral-200 dark:border-neutral-800
">
```

### 5. **Accessibility**

Ensure proper focus management and keyboard navigation:

```tsx
// ✅ Skip to main content link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-brand-500 focus:text-white focus:p-4"
>
  Skip to main content
</a>

<main id="main-content">
  {/* Content */}
</main>
```

### 6. **Performance**

Avoid deep nesting and excessive DOM nodes:

```tsx
// ✅ Good - Flat structure
<Container>
  <Section>
    <Content />
  </Section>
</Container>

// ❌ Bad - Over-nested
<div><div><div><div><div><div>
  <Content />
</div></div></div></div></div></div>
```

---

## Common Layout Patterns

### Hero Section Layout

```tsx
<section className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 py-24 lg:py-32">
  <Container>
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-white lg:text-6xl">
          Hero Title
        </h1>
        <p className="mt-6 text-lg text-white/90">
          Hero description...
        </p>
        <div className="mt-8 flex gap-4">
          <Button>Get Started</Button>
        </div>
      </div>
      <div>
        <img src="/hero.png" alt="Hero" />
      </div>
    </div>
  </Container>
</section>
```

### Feature Grid Layout

```tsx
<Section>
  <Container>
    <div className="text-center">
      <h2 className="text-3xl font-bold">Features</h2>
      <p className="mt-4 text-lg text-neutral-600">Why choose us</p>
    </div>
    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <FeatureCard key={feature.id} {...feature} />
      ))}
    </div>
  </Container>
</Section>
```

### Card Grid Layout

```tsx
<Section>
  <Container>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardImage src={item.image} />
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </Card>
      ))}
    </div>
  </Container>
</Section>
```

---

## Testing Checklist

- [ ] Test on all breakpoints (mobile, tablet, desktop)
- [ ] Test with different content lengths (short, medium, long)
- [ ] Test dark mode appearance
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test print layout (if applicable)
- [ ] Validate HTML semantics
- [ ] Check for layout shifts (CLS)
- [ ] Verify focus states
- [ ] Test RTL (right-to-left) if needed

---

**Next:** [Component Templates →](./03-component-templates.md)
