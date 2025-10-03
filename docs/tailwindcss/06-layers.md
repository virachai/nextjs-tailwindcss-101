# Tailwind CSS Layers

Comprehensive guide to understanding and using Tailwind CSS layers (`@layer`) directive for organizing custom styles.

## Table of Contents
- [Layer Fundamentals](#layer-fundamentals)
- [Base Layer](#base-layer)
- [Components Layer](#components-layer)
- [Utilities Layer](#utilities-layer)
- [Layer Order & Specificity](#layer-order--specificity)
- [Advanced Patterns](#advanced-patterns)
- [Tailwind CSS v4 Changes](#tailwind-css-v4-changes)

---

## Layer Fundamentals

### What are Layers?

Tailwind uses three main layers to organize styles in a specific order:

```css
/* Layer order (lowest to highest specificity) */
@layer base {
  /* HTML element defaults */
}

@layer components {
  /* Reusable component classes */
}

@layer utilities {
  /* Single-purpose utility classes */
}
```

### Why Use Layers?

1. **Predictable Specificity** - Utilities always override components, components override base
2. **Organization** - Clear separation of concerns
3. **Performance** - Proper purging and optimization
4. **Maintainability** - Easier to understand and modify styles

---

## Base Layer

### Purpose
Reset defaults and set global HTML element styles.

### Common Use Cases

```css
@layer base {
  /* Custom resets */
  * {
    @apply border-border;
  }

  /* HTML element defaults */
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Heading defaults */
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold;
  }

  h1 {
    @apply text-4xl;
  }

  /* Link defaults */
  a {
    @apply text-blue-600 hover:text-blue-800 transition-colors;
  }

  /* Form elements */
  input, textarea, select {
    @apply rounded-md border border-gray-300 px-3 py-2;
  }

  /* Focus styles */
  input:focus, textarea:focus, select:focus {
    @apply outline-none ring-2 ring-blue-500;
  }
}
```

### Best Practices

✅ **Do:**
- Set global HTML element styles
- Define typography defaults
- Create consistent form element styles
- Use for accessibility defaults

❌ **Don't:**
- Add component-specific styles
- Use class selectors (use components layer instead)
- Override with !important

---

## Components Layer

### Purpose
Define reusable component classes that combine multiple utilities.

### Component Patterns

```css
@layer components {
  /* Button component */
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
  }

  /* Card component */
  .card {
    @apply rounded-lg border border-gray-200 bg-white p-6 shadow-sm;
  }

  .card-header {
    @apply mb-4 border-b border-gray-200 pb-4;
  }

  /* Form components */
  .form-input {
    @apply w-full rounded-md border border-gray-300 px-3 py-2;
    @apply focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500;
  }

  .form-label {
    @apply mb-2 block text-sm font-medium text-gray-700;
  }

  /* Container patterns */
  .container-custom {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }

  /* Gradient text */
  .gradient-text {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  }
}
```

### When to Use Components Layer

✅ **Use for:**
- Repeated UI patterns (buttons, cards, badges)
- Complex combinations of utilities
- Design system components
- Third-party component overrides

❌ **Don't use for:**
- One-off styles (use inline utilities)
- Simple single-property styles
- Styles that should override utilities

---

## Utilities Layer

### Purpose
Add custom utility classes that work like Tailwind's built-in utilities.

### Custom Utilities

```css
@layer utilities {
  /* Custom spacing */
  .content-auto {
    content-visibility: auto;
  }

  /* Text utilities */
  .text-balance {
    text-wrap: balance;
  }

  .text-pretty {
    text-wrap: pretty;
  }

  /* Scrollbar utilities */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Animation utilities */
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }

  /* Responsive variants */
  .bg-mesh {
    background-image:
      linear-gradient(to right, rgb(0 0 0 / 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(0 0 0 / 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  /* Container queries */
  @container (min-width: 400px) {
    .cq-\[400px\]\:text-xl {
      font-size: 1.25rem;
    }
  }
}
```

### Responsive Utilities

```css
@layer utilities {
  /* Mobile-first responsive utility */
  @media (min-width: 768px) {
    .md\:flex-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
  }

  /* Dark mode utilities */
  @media (prefers-color-scheme: dark) {
    .dark\:scrollbar-dark::-webkit-scrollbar-track {
      background: #1a1a1a;
    }
  }
}
```

---

## Layer Order & Specificity

### Cascade Order

```css
/* 1. Base - Lowest specificity */
@layer base {
  button {
    @apply p-2;
  }
}

/* 2. Components - Medium specificity */
@layer components {
  .btn {
    @apply p-4;
  }
}

/* 3. Utilities - Highest specificity */
@layer utilities {
  .p-6 {
    padding: 1.5rem;
  }
}

/* Result: utility classes always win */
<button class="btn p-6">
  <!-- This will have p-6 (1.5rem), not btn's p-4 -->
</button>
```

### Important Modifier

```css
@layer components {
  .btn-force {
    @apply !p-8; /* Forces padding even against utilities */
  }
}

/* This still gets p-8 despite p-6 utility */
<button class="btn-force p-6">...</button>
```

### Specificity Rules

1. **Unlayered styles** > utilities > components > base
2. **!important** in base < components < utilities < unlayered
3. **Same layer** = last defined wins

---

## Advanced Patterns

### Plugin-like Components

```css
@layer components {
  /* Aspect ratio containers */
  .aspect-video-container {
    @apply relative w-full;
    padding-bottom: 56.25%; /* 16:9 */
  }

  .aspect-video-container > * {
    @apply absolute inset-0 h-full w-full object-cover;
  }

  /* Focus-visible ring */
  .focus-ring {
    @apply outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2;
  }

  /* Truncate with tooltip */
  .truncate-tooltip {
    @apply truncate;
  }

  .truncate-tooltip:hover::after {
    content: attr(data-full-text);
    @apply absolute left-0 top-full z-10 mt-1 rounded bg-gray-900 px-2 py-1 text-sm text-white;
  }
}
```

### Theme-aware Components

```css
@layer components {
  .card-theme {
    @apply rounded-lg border p-6 shadow-sm;
    @apply bg-white border-gray-200;
    @apply dark:bg-gray-800 dark:border-gray-700;
  }

  .input-theme {
    @apply rounded-md border px-3 py-2;
    @apply border-gray-300 bg-white text-gray-900;
    @apply focus:border-blue-500 focus:ring-2 focus:ring-blue-500;
    @apply dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100;
    @apply dark:focus:border-blue-400 dark:focus:ring-blue-400;
  }
}
```

### Nested Layers

```css
@layer components {
  @layer layout {
    .page-container {
      @apply mx-auto max-w-7xl px-4;
    }
  }

  @layer ui {
    .btn {
      @apply rounded px-4 py-2;
    }
  }
}
```

---

## Tailwind CSS v4 Changes

### New `@layer` Syntax

In Tailwind CSS v4 (used in this project), layers work with the CSS-first configuration:

```css
/* globals.css - v4 approach */
@import "tailwindcss";

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}

/* Components use theme() function */
@layer components {
  .btn-custom {
    background: theme(colors.blue.600);
    padding: theme(spacing.4) theme(spacing.6);
    border-radius: theme(borderRadius.lg);
  }
}
```

### Theme Inline Integration

```css
@import "tailwindcss";

/* Define custom theme tokens */
@theme inline {
  --color-brand: #3b82f6;
  --spacing-custom: 2.5rem;
}

/* Use in layers */
@layer components {
  .brand-button {
    background: var(--color-brand);
    padding: var(--spacing-custom);
  }
}
```

### Performance Considerations

1. **Purging** - All layer content is scanned for usage
2. **Order** - v4 maintains layer order automatically
3. **CSS Variables** - Preferred over hard-coded values in v4

---

## Best Practices Summary

### ✅ Do's

1. **Base Layer**
   - Global resets and HTML element defaults
   - Typography base styles
   - Form element defaults

2. **Components Layer**
   - Reusable UI patterns
   - Complex utility combinations
   - Design system components

3. **Utilities Layer**
   - Custom single-purpose utilities
   - Project-specific helpers
   - Animation and transition classes

### ❌ Don'ts

1. **Avoid**
   - Mixing concerns between layers
   - Using !important unless necessary
   - Creating utilities for one-off styles
   - Duplicating Tailwind's built-in utilities

2. **Performance**
   - Don't over-layer (keep it simple)
   - Avoid deep nesting
   - Use CSS variables for theme values

---

## Related Documentation

- [01-fundamentals.md](./01-fundamentals.md) - Tailwind basics
- [02-best-practices.md](./02-best-practices.md) - Code organization
- [03-component-patterns.md](./03-component-patterns.md) - Component examples
- [globals.css](../../src/app/globals.css) - Project layer usage

---

**Last Updated:** Oct 2025
**Tailwind Version:** v4 (CSS-first configuration)
