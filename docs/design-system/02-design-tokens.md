# Design Tokens

The foundation of your design system - named entities that store visual design
attributes.

## Table of Contents

- [What are Design Tokens?](#what-are-design-tokens)
- [Token Categories](#token-categories)
- [Naming Conventions](#naming-conventions)
- [Token Architecture](#token-architecture)
- [Implementation](#implementation)
- [Using Tokens](#using-tokens)
- [Token Management](#token-management)

## What are Design Tokens?

Design tokens are the **visual design atoms** of the design system —
specifically, they are named entities that store visual design attributes. We
use them in place of hard-coded values (like hex codes for colors, pixels for
spacing) to maintain a scalable and consistent visual system.

### Why Design Tokens?

**Before Tokens:**

```tsx
// ❌ Hard-coded values scattered everywhere
<button style={{
  background: '#FF5A5F',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '14px'
}}>
  Submit
</button>

// Different developer, different values
<button style={{
  background: '#FF5858',  // Slightly different red!
  padding: '10px 15px',   // Different padding!
  borderRadius: '6px',    // Different radius!
  fontSize: '13px'        // Different font size!
}}>
  Submit
</button>
```

**With Tokens:**

```tsx
// ✅ Consistent, semantic tokens
import { tokens } from '@/design-tokens';

<button style={{
  background: tokens.colors.brand.primary,
  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
  borderRadius: tokens.radius.md,
  fontSize: tokens.typography.fontSize.sm
}}>
  Submit
</button>

// With Tailwind CSS (using token-based config)
<button className="bg-brand-primary px-4 py-3 rounded-md text-sm">
  Submit
</button>
```

### Benefits

✅ **Single source of truth** - Update once, changes everywhere ✅
**Consistency** - Same values = same look ✅ **Scalability** - Easy to add
themes, dark mode ✅ **Communication** - Shared language between design & dev ✅
**Maintainability** - Change brand color in one place

## Token Categories

### 1. Color Tokens

The most common and critical tokens in any design system.

```typescript
// tokens/colors.ts
export const colors = {
  // Brand colors
  brand: {
    primary: '#FF5A5F', // Airbnb Rausch (main brand color)
    primaryHover: '#E00007',
    primaryActive: '#C13515',
    secondary: '#00A699', // Teal
    secondaryHover: '#008489',
  },

  // Neutral colors (grayscale)
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F7F7F7',
      100: '#EBEBEB',
      200: '#DDDDDD',
      300: '#CACACA',
      400: '#AFAFAF',
      500: '#8D8D8D',
      600: '#6F6F6F',
      700: '#525252',
      800: '#393939',
      900: '#222222',
    },
  },

  // Semantic colors (communicate meaning)
  semantic: {
    success: {
      base: '#00A699',
      light: '#E6F7F5',
      dark: '#008489',
    },
    warning: {
      base: '#FFC107',
      light: '#FFF9E6',
      dark: '#FF8F00',
    },
    error: {
      base: '#E74C3C',
      light: '#FDEAE8',
      dark: '#C0392B',
    },
    info: {
      base: '#3498DB',
      light: '#EBF5FB',
      dark: '#2980B9',
    },
  },

  // Text colors
  text: {
    primary: '#222222', // Main text
    secondary: '#717171', // Secondary text
    tertiary: '#B0B0B0', // Muted text
    inverse: '#FFFFFF', // Text on dark backgrounds
    link: '#00A699', // Links
    linkHover: '#008489',
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F7F7F7',
    tertiary: '#EBEBEB',
    inverse: '#222222',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Border colors
  border: {
    default: '#DDDDDD',
    hover: '#222222',
    focus: '#00A699',
    error: '#E74C3C',
  },
};
```

### 2. Spacing Tokens

Consistent spacing creates visual rhythm and hierarchy.

```typescript
// tokens/spacing.ts
export const spacing = {
  // Base unit: 4px
  '0': '0',
  '1': '4px', // 0.25rem
  '2': '8px', // 0.5rem
  '3': '12px', // 0.75rem
  '4': '16px', // 1rem (base)
  '5': '20px', // 1.25rem
  '6': '24px', // 1.5rem
  '8': '32px', // 2rem
  '10': '40px', // 2.5rem
  '12': '48px', // 3rem
  '16': '64px', // 4rem
  '20': '80px', // 5rem
  '24': '96px', // 6rem
  '32': '128px', // 8rem
  '40': '160px', // 10rem

  // Semantic spacing
  componentGap: '16px', // Gap between related elements
  sectionGap: '48px', // Gap between sections
  containerPadding: '24px', // Container padding
  cardPadding: '24px', // Card padding
};

// Usage guidelines
export const spacingGuidelines = {
  // Tight spacing (related elements)
  tight: ['0', '1', '2'], // 0-8px

  // Normal spacing (component internals)
  normal: ['3', '4', '5', '6'], // 12-24px

  // Loose spacing (between components)
  loose: ['8', '10', '12'], // 32-48px

  // Section spacing (major sections)
  section: ['16', '20', '24'], // 64-96px
};
```

### 3. Typography Tokens

Font families, sizes, weights, and line heights.

```typescript
// tokens/typography.ts
export const typography = {
  // Font families
  fontFamily: {
    primary:
      '"Circular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    mono: '"Monaco", "Courier New", monospace',
  },

  // Font sizes (type scale)
  fontSize: {
    '2xs': '10px', // 0.625rem - Fine print
    xs: '12px', // 0.75rem  - Captions
    sm: '14px', // 0.875rem - Small body
    base: '16px', // 1rem     - Body text
    lg: '18px', // 1.125rem - Large body
    xl: '20px', // 1.25rem  - Small heading
    '2xl': '24px', // 1.5rem   - Heading
    '3xl': '30px', // 1.875rem - Large heading
    '4xl': '36px', // 2.25rem  - Display
    '5xl': '48px', // 3rem     - Large display
    '6xl': '64px', // 4rem     - Extra large display
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Predefined text styles
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
  },
  h3: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug,
  },

  // Body
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },

  // Specialized
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },
};
```

### 4. Border Radius Tokens

Rounded corners for components.

```typescript
// tokens/radius.ts
export const radius = {
  none: '0',
  sm: '4px', // Small radius (badges, tags)
  md: '8px', // Medium radius (buttons, inputs)
  lg: '12px', // Large radius (cards)
  xl: '16px', // Extra large radius (modals)
  '2xl': '24px', // Featured cards
  full: '9999px', // Pills, circular elements
};

// Component-specific radius
export const componentRadius = {
  button: radius.md,
  input: radius.md,
  card: radius.lg,
  modal: radius.xl,
  badge: radius.full,
  avatar: radius.full,
};
```

### 5. Shadow Tokens

Elevation and depth through shadows.

```typescript
// tokens/shadows.ts
export const shadows = {
  // Elevation levels
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // Colored shadows (for focus states)
  focus: '0 0 0 3px rgba(0, 166, 153, 0.5)', // Brand color
  focusError: '0 0 0 3px rgba(231, 76, 60, 0.5)', // Error color
};

// Elevation system (inspired by Material Design)
export const elevation = {
  0: shadows.none, // Flat
  1: shadows.sm, // Cards on white background
  2: shadows.md, // Hover state cards
  3: shadows.lg, // Dropdowns, tooltips
  4: shadows.xl, // Modals
  5: shadows['2xl'], // Floating action buttons
};
```

### 6. Breakpoint Tokens

Responsive design breakpoints.

```typescript
// tokens/breakpoints.ts
export const breakpoints = {
  xs: '375px', // Mobile small
  sm: '640px', // Mobile large / Tablet small
  md: '768px', // Tablet
  lg: '1024px', // Desktop
  xl: '1280px', // Desktop large
  '2xl': '1536px', // Desktop extra large
};

// Container max-widths at each breakpoint
export const containerMaxWidth = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
```

### 7. Animation Tokens

Motion and transition settings.

```typescript
// tokens/animation.ts
export const animation = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Custom easings
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },

  // Common transitions
  transition: {
    default: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
```

### 8. Z-Index Tokens

Layering and stacking order.

```typescript
// tokens/zIndex.ts
export const zIndex = {
  // Base layers
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,

  // Semantic layers
  content: 0,
  header: 1000,
  sidebar: 1010,
  overlay: 1040,
  dialog: 1050,
  toast: 1080,
};
```

## Naming Conventions

### Pattern: Category-Property-Modifier-State

```typescript
// Good examples
colors.brand.primary;
colors.brand.primaryHover;
colors.semantic.success.base;
colors.semantic.success.light;
spacing.componentGap;
typography.fontSize.base;
typography.fontWeight.semibold;
shadows.elevation[2];
radius.button;

// Bad examples (avoid)
colors.redColor; // Redundant
spacing.spacingMedium; // Redundant
colors.rgb255000000; // Not semantic
```

### Semantic vs Literal Names

```typescript
// ❌ Literal (tied to specific values)
const colors = {
  red: '#FF0000',
  darkGray: '#333333',
};

// Usage: What if brand changes from red to blue?
<Button color={colors.red} />

// ✅ Semantic (describes purpose)
const colors = {
  brand: {
    primary: '#FF0000',    // Can change to any color
  },
  text: {
    primary: '#333333',    // Describes usage
  },
};

// Usage: Meaning stays same even if color changes
<Button color={colors.brand.primary} />
```

## Token Architecture

### Three-Tier Token System

```typescript
// Tier 1: Raw values (primitives)
const primitives = {
  red50: '#FEF2F2',
  red500: '#EF4444',
  red900: '#7F1D1D',
  blue500: '#3B82F6',
  spacing4: '4px',
  spacing8: '8px',
};

// Tier 2: Semantic tokens (reference primitives)
const semantic = {
  colors: {
    brand: {
      primary: primitives.red500,
      secondary: primitives.blue500,
    },
    feedback: {
      error: primitives.red500,
    },
  },
  spacing: {
    sm: primitives.spacing4,
    md: primitives.spacing8,
  },
};

// Tier 3: Component tokens (reference semantic)
const component = {
  button: {
    background: {
      primary: semantic.colors.brand.primary,
      error: semantic.colors.feedback.error,
    },
    padding: {
      horizontal: semantic.spacing.md,
      vertical: semantic.spacing.sm,
    },
  },
};
```

### Theme Tokens (Light/Dark Mode)

```typescript
// tokens/themes.ts
export const lightTheme = {
  colors: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F7F7F7',
    },
    text: {
      primary: '#222222',
      secondary: '#717171',
    },
  },
};

export const darkTheme = {
  colors: {
    background: {
      primary: '#222222',
      secondary: '#2A2A2A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
};

// Usage with CSS variables
:root {
  --color-bg-primary: #FFFFFF;
  --color-text-primary: #222222;
}

.dark {
  --color-bg-primary: #222222;
  --color-text-primary: #FFFFFF;
}
```

## Implementation

### Option 1: TypeScript/JavaScript Tokens

```typescript
// tokens/index.ts
export const tokens = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  breakpoints,
  animation,
  zIndex,
};

export default tokens;

// Usage in components
import { tokens } from '@/design-tokens';

const Button = () => (
  <button style={{
    backgroundColor: tokens.colors.brand.primary,
    padding: `${tokens.spacing['2']} ${tokens.spacing['4']}`,
    borderRadius: tokens.radius.md,
  }}>
    Click me
  </button>
);
```

### Option 2: CSS Custom Properties

```css
/* tokens/tokens.css */
:root {
  /* Colors */
  --color-brand-primary: #ff5a5f;
  --color-brand-secondary: #00a699;
  --color-text-primary: #222222;
  --color-text-secondary: #717171;

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-4: 16px;
  --spacing-6: 24px;

  /* Typography */
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;

  /* Radius */
  --radius-md: 8px;
  --radius-lg: 12px;
}

/* Usage */
.button {
  background-color: var(--color-brand-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}
```

### Option 3: Tailwind CSS Config

```typescript
// tailwind.config.ts
import { tokens } from './tokens';

const config: Config = {
  theme: {
    colors: tokens.colors,
    spacing: tokens.spacing,
    fontSize: tokens.typography.fontSize,
    fontWeight: tokens.typography.fontWeight,
    borderRadius: tokens.radius,
    boxShadow: tokens.shadows,
    screens: tokens.breakpoints,
  },
};

export default config;

// Usage with Tailwind
<button className="bg-brand-primary px-4 py-2 rounded-md text-sm">
  Click me
</button>
```

## Using Tokens

### In React Components

```tsx
import { tokens } from '@/design-tokens';

// Inline styles
const Card = () => (
  <div style={{
    backgroundColor: tokens.colors.background.primary,
    padding: tokens.spacing['6'],
    borderRadius: tokens.radius.lg,
    boxShadow: tokens.shadows.md,
  }}>
    Content
  </div>
);

// With styled-components
import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: ${tokens.colors.background.primary};
  padding: ${tokens.spacing['6']};
  border-radius: ${tokens.radius.lg};
  box-shadow: ${tokens.shadows.md};
`;

// With Tailwind (using config)
const Card = () => (
  <div className="bg-background-primary p-6 rounded-lg shadow-md">
    Content
  </div>
);
```

### In CSS Modules

```css
/* Card.module.css */
.card {
  background-color: var(--color-background-primary);
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

## Token Management

### Syncing Design & Code

```
Design (Figma) → Figma Tokens Plugin → JSON → Transform → Code Tokens
```

**Tools:**

- **Figma Tokens** - Export tokens from Figma
- **Style Dictionary** - Transform tokens to multiple formats
- **Theo** - Salesforce's token transformer

### Versioning Tokens

```json
// package.json
{
  "name": "@company/design-tokens",
  "version": "2.1.0",
  "description": "Design tokens for Company Design System"
}
```

**Semantic Versioning:**

- **Major (2.0.0)**: Breaking changes (renamed tokens, removed tokens)
- **Minor (2.1.0)**: New tokens added
- **Patch (2.1.1)**: Bug fixes (wrong color values)

### Documentation

```typescript
/**
 * Brand primary color
 * Used for: Primary buttons, links, focus states
 * Accessibility: Meets WCAG AA on white background (4.5:1)
 * @example
 * <button style={{ backgroundColor: colors.brand.primary }}>
 */
export const brandPrimary = '#FF5A5F';
```

## Best Practices

✅ **DO:**

- Use semantic names (primary, not red)
- Document usage context
- Version your tokens
- Sync with design team
- Test accessibility (contrast ratios)
- Use TypeScript for type safety

❌ **DON'T:**

- Use hard-coded values
- Create tokens for every single value
- Use non-semantic names (color1, color2)
- Change token values without migration guide
- Skip documentation

## Next Steps

- [Component Library](./03-component-library.md)
- [Design Principles](./04-design-principles.md)
- [Accessibility](./05-accessibility.md)
