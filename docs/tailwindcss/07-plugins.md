# Tailwind CSS Plugins

Complete guide to extending Tailwind CSS functionality through plugins.

## Overview

Plugins let you register new styles for Tailwind to inject into the user's
stylesheet using JavaScript instead of CSS.

## Plugin Basics

### Creating a Plugin

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(function ({ addUtilities, addComponents, addBase, theme, e, config }) {
      // Add your custom styles here
    }),
  ],
};
```

### Plugin Function Arguments

- `addUtilities()` - Register new utility styles
- `addComponents()` - Register new component styles
- `addBase()` - Register new base styles
- `addVariant()` - Register custom variants
- `matchUtilities()` - Register dynamic utilities
- `matchComponents()` - Register dynamic components
- `theme()` - Access theme values
- `e()` - Escape strings for class names
- `config()` - Access config values

## Adding Utilities

### Static Utilities

```js
plugin(function ({ addUtilities }) {
  addUtilities({
    '.content-auto': {
      'content-visibility': 'auto',
    },
    '.content-hidden': {
      'content-visibility': 'hidden',
    },
    '.content-visible': {
      'content-visibility': 'visible',
    },
  });
});
```

Usage:

```html
<div class="content-auto">
  <!-- Content -->
</div>
```

### With Variants

```js
addUtilities(
  {
    '.scroll-snap-none': {
      'scroll-snap-type': 'none',
    },
    '.scroll-snap-x': {
      'scroll-snap-type': 'x mandatory',
    },
    '.scroll-snap-y': {
      'scroll-snap-type': 'y mandatory',
    },
  },
  ['responsive', 'hover']
);
```

Usage:

```html
<div class="scroll-snap-x md:scroll-snap-y hover:scroll-snap-none">
  <!-- Content -->
</div>
```

### Dynamic Utilities

```js
plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      'text-shadow': (value) => ({
        textShadow: value,
      }),
    },
    {
      values: theme('textShadow'),
      type: 'shadow',
    }
  );
});
```

Theme configuration:

```js
module.exports = {
  theme: {
    textShadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 2px 4px rgba(0, 0, 0, 0.1)',
      lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
  },
};
```

Usage:

```html
<h1 class="text-shadow-md">Shadowed text</h1>
```

## Adding Components

### Static Components

```js
plugin(function ({ addComponents }) {
  addComponents({
    '.btn': {
      padding: '.5rem 1rem',
      borderRadius: '.25rem',
      fontWeight: '600',
    },
    '.btn-blue': {
      backgroundColor: '#3490dc',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#2779bd',
      },
    },
  });
});
```

Usage:

```html
<button class="btn btn-blue">Click me</button>
```

### Using Theme Values

```js
plugin(function ({ addComponents, theme }) {
  addComponents({
    '.card': {
      backgroundColor: theme('colors.white'),
      borderRadius: theme('borderRadius.lg'),
      padding: theme('spacing.6'),
      boxShadow: theme('boxShadow.xl'),
    },
  });
});
```

## Adding Base Styles

### Custom Reset

```js
plugin(function ({ addBase, theme }) {
  addBase({
    h1: {
      fontSize: theme('fontSize.4xl'),
      fontWeight: theme('fontWeight.bold'),
    },
    h2: {
      fontSize: theme('fontSize.3xl'),
      fontWeight: theme('fontWeight.semibold'),
    },
    h3: {
      fontSize: theme('fontSize.2xl'),
      fontWeight: theme('fontWeight.medium'),
    },
  });
});
```

### Typography Defaults

```js
plugin(function ({ addBase }) {
  addBase({
    body: {
      fontFeatureSettings: '"kern" 1',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
  });
});
```

## Custom Variants

### Simple Variant

```js
plugin(function ({ addVariant }) {
  addVariant('hocus', ['&:hover', '&:focus']);
});
```

Usage:

```html
<button class="hocus:bg-blue-700 bg-blue-500">Button</button>
```

### Parent-Based Variant

```js
plugin(function ({ addVariant }) {
  addVariant('group-optional', ':merge(.group)[data-optional] &');
});
```

Usage:

```html
<div class="group" data-optional>
  <p class="group-optional:italic">Text</p>
</div>
```

### Child Variant

```js
plugin(function ({ addVariant }) {
  addVariant('child', '& > *');
});
```

Usage:

```html
<div class="child:p-4">
  <div>Padded child</div>
  <div>Padded child</div>
</div>
```

### Complex Variant

```js
plugin(function ({ addVariant, e }) {
  addVariant('supports-grid', '@supports (display: grid)');
});
```

Usage:

```html
<div class="flex supports-grid:grid">
  <!-- Content -->
</div>
```

## Real-World Plugin Examples

### Text Clamp Plugin

```js
plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      'line-clamp': (value) => ({
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': value,
        overflow: 'hidden',
      }),
    },
    {
      values: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
      },
    }
  );
});
```

### Container Queries Plugin

```js
plugin(function ({ matchVariant }) {
  matchVariant('container', (value) => `@container (min-width: ${value})`, {
    values: {
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
    },
  });
});
```

### Debug Screens Plugin

```js
plugin(function ({ addBase, theme }) {
  const screens = theme('screens');

  addBase({
    'body::before': {
      position: 'fixed',
      bottom: '0',
      left: '0',
      padding: '.5rem',
      fontSize: '.875rem',
      fontWeight: 'bold',
      backgroundColor: '#000',
      color: '#fff',
      content: '"xs"',
      zIndex: '9999',

      [`@media (min-width: ${screens.sm})`]: {
        content: '"sm"',
      },
      [`@media (min-width: ${screens.md})`]: {
        content: '"md"',
      },
      [`@media (min-width: ${screens.lg})`]: {
        content: '"lg"',
      },
      [`@media (min-width: ${screens.xl})`]: {
        content: '"xl"',
      },
      [`@media (min-width: ${screens['2xl']})`]: {
        content: '"2xl"',
      },
    },
  });
});
```

## Official Plugins

### Forms Plugin

```bash
npm install @tailwindcss/forms
```

```js
module.exports = {
  plugins: [require('@tailwindcss/forms')],
};
```

Provides beautiful form styles out of the box.

### Typography Plugin

```bash
npm install @tailwindcss/typography
```

```js
module.exports = {
  plugins: [require('@tailwindcss/typography')],
};
```

Adds `prose` classes for styling rich text content.

### Aspect Ratio Plugin

```bash
npm install @tailwindcss/aspect-ratio
```

```js
module.exports = {
  plugins: [require('@tailwindcss/aspect-ratio')],
};
```

Adds composable aspect ratio utilities (built into Tailwind v3.1+).

### Container Queries Plugin - Official Plugins

```bash
npm install @tailwindcss/container-queries
```

```js
module.exports = {
  plugins: [require('@tailwindcss/container-queries')],
};
```

Adds container query utilities for responsive design.

## Plugin Best Practices

### 1. Use Appropriate Layer

```js
// ✅ Good - utilities in utilities layer
addUtilities({ '.rotate-45': { transform: 'rotate(45deg)' } });

// ❌ Bad - utilities in components layer
addComponents({ '.rotate-45': { transform: 'rotate(45deg)' } });
```

### 2. Leverage Theme Values

```js
// ✅ Good - uses theme
plugin(function ({ addComponents, theme }) {
  addComponents({
    '.card': {
      padding: theme('spacing.4'),
      borderRadius: theme('borderRadius.lg'),
    },
  });
});

// ❌ Bad - hardcoded values
plugin(function ({ addComponents }) {
  addComponents({
    '.card': {
      padding: '1rem',
      borderRadius: '0.5rem',
    },
  });
});
```

### 3. Support Variants When Needed

```js
// For utilities that should be responsive/state-based
addUtilities(styles, ['responsive', 'hover']);

// For component-like utilities
addComponents(styles); // No variants needed
```

### 4. Use Semantic Naming

```js
// ✅ Good
('.text-shadow-sm', '.btn-primary', '.container-narrow');

// ❌ Bad
('.ts1', '.b1', '.c1');
```

### 5. Document Your Plugin

```js
/**
 * Text Shadow Plugin
 *
 * Adds text-shadow utilities with configurable theme values.
 *
 * @example
 * <h1 class="text-shadow-lg">Shadowed heading</h1>
 *
 * Theme configuration:
 * theme: {
 *   textShadow: {
 *     sm: '0 1px 2px rgba(0,0,0,0.05)',
 *     DEFAULT: '0 2px 4px rgba(0,0,0,0.1)',
 *     lg: '0 4px 8px rgba(0,0,0,0.15)',
 *   }
 * }
 */
```

## Plugin Distribution

### Package Structure

```plaintext
my-tailwind-plugin/
├── index.js
├── package.json
├── README.md
└── test/
```

### package.json

```json
{
  "name": "@yourname/tailwindcss-text-shadow",
  "version": "1.0.0",
  "main": "index.js",
  "peerDependencies": {
    "tailwindcss": ">=3.0.0"
  },
  "keywords": ["tailwindcss", "tailwindcss-plugin", "text-shadow"]
}
```

### index.js

```js
const plugin = require('tailwindcss/plugin');

module.exports = plugin.withOptions(
  function (options = {}) {
    return function ({ addUtilities, matchUtilities, theme }) {
      // Plugin implementation
    };
  },
  function (options) {
    return {
      theme: {
        textShadow: {
          sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
          DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.1)',
          lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    };
  }
);
```

## Summary

Plugins extend Tailwind CSS with:

- **Utilities** - Single-purpose classes (`addUtilities`, `matchUtilities`)
- **Components** - Multi-property reusable styles (`addComponents`)
- **Base styles** - Global element defaults (`addBase`)
- **Variants** - Custom modifiers (`addVariant`, `matchVariant`)

Use official plugins for common needs, create custom plugins for
project-specific patterns, and distribute plugins as packages for reusable
solutions across projects.
