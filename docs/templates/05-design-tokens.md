# Design Tokens Reference Guide

> Complete design token system for building consistent, scalable UIs with
> Tailwind CSS 4. All tokens are defined in
> [tailwind.config.ts](../../tailwind.config.ts).

## Table of Contents

- [Color Tokens](#color-tokens)
- [Typography Tokens](#typography-tokens)
- [Spacing Tokens](#spacing-tokens)
- [Layout Tokens](#layout-tokens)
- [Effect Tokens](#effect-tokens)
- [Motion Tokens](#motion-tokens)
- [Usage Patterns](#usage-patterns)

---

## Color Tokens

### Brand Colors (Primary Identity)

**Palette:** Sky blue (11 shades from 50 to 950)

```typescript
// Token reference
colors.brand[50] = '#f0f9ff'; // Lightest - backgrounds
colors.brand[100] = '#e0f2fe';
colors.brand[200] = '#bae6fd';
colors.brand[300] = '#7dd3fc';
colors.brand[400] = '#38bdf8';
colors.brand[500] = '#0ea5e9'; // Base - primary actions
colors.brand[600] = '#0284c7'; // Hover state
colors.brand[700] = '#0369a1'; // Active state
colors.brand[800] = '#075985';
colors.brand[900] = '#0c4a6e';
colors.brand[950] = '#082f49'; // Darkest - text on light bg
```

**Usage Examples:**

```tsx
// Buttons
<button className="bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white">
  Primary Action
</button>

// Backgrounds
<div className="bg-brand-50 dark:bg-brand-950">
  <h2 className="text-brand-900 dark:text-brand-50">Branded Section</h2>
</div>

// Links
<a href="#" className="text-brand-600 hover:text-brand-700 underline">
  Learn more
</a>

// Badges
<span className="bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
  New
</span>
```

### Semantic Colors (Contextual Feedback)

#### Success (Green)

```typescript
colors.success[50] = '#f0fdf4'; // Background
colors.success[100] = '#dcfce7'; // Light background
colors.success[500] = '#22c55e'; // Base icon/border
colors.success[600] = '#16a34a'; // Hover
colors.success[700] = '#15803d'; // Text
```

**Usage:**

```tsx
// Alert
<div className="border-l-4 border-success-500 bg-success-50 p-4 dark:bg-success-900/20">
  <p className="text-success-700 dark:text-success-400">Operation successful!</p>
</div>

// Badge
<span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-900/30 dark:text-success-400">
  Active
</span>

// Button
<button className="bg-success-500 hover:bg-success-600 text-white">
  Confirm
</button>
```

#### Warning (Amber)

```typescript
colors.warning[50] = '#fffbeb';
colors.warning[100] = '#fef3c7';
colors.warning[500] = '#f59e0b'; // Base
colors.warning[600] = '#d97706'; // Hover
colors.warning[700] = '#b45309'; // Text
```

**Usage:**

```tsx
// Alert
<div className="border-l-4 border-warning-500 bg-warning-50 p-4 dark:bg-warning-900/20">
  <h4 className="font-medium text-warning-700 dark:text-warning-400">Warning</h4>
  <p className="mt-1 text-sm text-warning-600 dark:text-warning-300">
    Please review before proceeding.
  </p>
</div>

// Icon
<ExclamationIcon className="h-5 w-5 text-warning-500" />
```

#### Error (Red)

```typescript
colors.error[50] = '#fef2f2';
colors.error[100] = '#fee2e2';
colors.error[500] = '#ef4444'; // Base
colors.error[600] = '#dc2626'; // Hover
colors.error[700] = '#b91c1c'; // Text
```

**Usage:**

```tsx
// Alert
<div className="border-l-4 border-error-500 bg-error-50 p-4 dark:bg-error-900/20">
  <p className="text-error-700 dark:text-error-400">An error occurred</p>
</div>

// Input error
<input className="border-error-500 focus:ring-error-500" />
<p className="mt-1 text-sm text-error-600">Invalid email address</p>

// Destructive button
<button className="bg-error-500 hover:bg-error-600 text-white">
  Delete
</button>
```

#### Info (Blue)

```typescript
colors.info[50] = '#eff6ff';
colors.info[100] = '#dbeafe';
colors.info[500] = '#3b82f6'; // Base
colors.info[600] = '#2563eb'; // Hover
colors.info[700] = '#1d4ed8'; // Text
```

**Usage:**

```tsx
// Info banner
<div className="border-info-500 bg-info-50 dark:bg-info-900/20 border-l-4 p-4">
  <div className="flex items-start gap-3">
    <InfoIcon className="text-info-500 h-5 w-5" />
    <p className="text-info-700 dark:text-info-400">
      This feature is in beta. Learn more about what's new.
    </p>
  </div>
</div>
```

### Neutral Colors (Gray Scale)

```typescript
colors.neutral[50] = '#fafafa'; // Lightest backgrounds
colors.neutral[100] = '#f5f5f5'; // Subtle backgrounds
colors.neutral[200] = '#e5e5e5'; // Borders
colors.neutral[300] = '#d4d4d4'; // Input borders
colors.neutral[400] = '#a3a3a3'; // Disabled text
colors.neutral[500] = '#737373'; // Placeholder text
colors.neutral[600] = '#525252'; // Secondary text
colors.neutral[700] = '#404040'; // Body text
colors.neutral[800] = '#262626'; // Headings
colors.neutral[900] = '#171717'; // Primary text
colors.neutral[950] = '#0a0a0a'; // Darkest
```

**Usage:**

```tsx
// Text hierarchy
<h1 className="text-neutral-900 dark:text-neutral-50">Main Heading</h1>
<p className="text-neutral-700 dark:text-neutral-300">Body text</p>
<span className="text-neutral-600 dark:text-neutral-400">Secondary text</span>
<small className="text-neutral-500">Muted text</small>

// Backgrounds
<div className="bg-neutral-50 dark:bg-neutral-900">
  <div className="bg-white dark:bg-neutral-800">Card content</div>
</div>

// Borders
<div className="border border-neutral-200 dark:border-neutral-800">
  <input className="border border-neutral-300 dark:border-neutral-700" />
</div>

// Disabled states
<button disabled className="bg-neutral-300 text-neutral-500 cursor-not-allowed">
  Disabled
</button>
```

---

## Typography Tokens

### Font Sizes with Line Heights

```typescript
// Size reference
fontSize['2xs'] = ['0.625rem', { lineHeight: '0.875rem' }]; // 10px/14px
fontSize.xs = ['0.75rem', { lineHeight: '1rem' }]; // 12px/16px
fontSize.sm = ['0.875rem', { lineHeight: '1.25rem' }]; // 14px/20px
fontSize.base = ['1rem', { lineHeight: '1.5rem' }]; // 16px/24px
fontSize.lg = ['1.125rem', { lineHeight: '1.75rem' }]; // 18px/28px
fontSize.xl = ['1.25rem', { lineHeight: '1.75rem' }]; // 20px/28px
fontSize['2xl'] = ['1.5rem', { lineHeight: '2rem' }]; // 24px/32px
fontSize['3xl'] = ['1.875rem', { lineHeight: '2.25rem' }]; // 30px/36px
fontSize['4xl'] = ['2.25rem', { lineHeight: '2.5rem' }]; // 36px/40px
fontSize['5xl'] = ['3rem', { lineHeight: '1' }]; // 48px/1
fontSize['6xl'] = ['3.75rem', { lineHeight: '1' }]; // 60px/1
fontSize['7xl'] = ['4.5rem', { lineHeight: '1' }]; // 72px/1
fontSize['8xl'] = ['6rem', { lineHeight: '1' }]; // 96px/1
fontSize['9xl'] = ['8rem', { lineHeight: '1' }]; // 128px/1
```

**Usage by Context:**

```tsx
// Hero sections
<h1 className="text-6xl font-bold lg:text-7xl">Hero Title</h1>

// Page titles
<h1 className="text-4xl font-bold">Page Title</h1>

// Section headers
<h2 className="text-3xl font-semibold">Section Header</h2>

// Subsections
<h3 className="text-2xl font-semibold">Subsection</h3>

// Card titles
<h4 className="text-xl font-medium">Card Title</h4>

// Body text
<p className="text-base">Regular paragraph text with optimal readability.</p>

// Small text
<p className="text-sm text-neutral-600">Caption or helper text</p>

// Meta information
<span className="text-xs text-neutral-500">Posted 2 hours ago</span>

// Micro copy
<span className="text-2xs text-neutral-400">Fine print</span>
```

### Font Weights

```typescript
fontWeight.thin = '100'; // Rarely used
fontWeight.extralight = '200'; // Rarely used
fontWeight.light = '300'; // Subtle emphasis
fontWeight.normal = '400'; // Body text (default)
fontWeight.medium = '500'; // Slight emphasis
fontWeight.semibold = '600'; // Headings, buttons
fontWeight.bold = '700'; // Strong headings
fontWeight.extrabold = '800'; // Hero text
fontWeight.black = '900'; // Maximum impact
```

**Usage Patterns:**

```tsx
// Headings hierarchy
<h1 className="text-4xl font-bold">Bold heading (700)</h1>
<h2 className="text-3xl font-semibold">Semibold heading (600)</h2>
<h3 className="text-2xl font-semibold">Semibold subheading (600)</h3>
<h4 className="text-xl font-medium">Medium heading (500)</h4>

// Body text
<p className="font-normal">Regular text (400)</p>
<p className="font-medium">Emphasized text (500)</p>
<strong className="font-semibold">Strong text (600)</strong>

// UI elements
<button className="font-medium">Medium button (500)</button>
<span className="font-semibold">Semibold badge (600)</span>

// Display text
<h1 className="text-7xl font-extrabold">Hero title (800)</h1>
```

### Font Families

```css
/* Defined in globals.css and layout.tsx */
--font-sans: var(--font-geist-sans); /* Geist Sans - UI text */
--font-mono: var(--font-geist-mono); /* Geist Mono - Code */
```

**Usage:**

```tsx
// Default (sans-serif)
<p className="font-sans">UI text uses Geist Sans</p>

// Monospace for code
<code className="font-mono text-sm">const value = 42;</code>
<pre className="font-mono text-xs">...</pre>

// Inline code
<p>Use <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm">useState</code> hook</p>
```

---

## Spacing Tokens

### Base Scale (4px increment)

```typescript
// Standard spacing scale
spacing[0] = '0px'; // 0
spacing[1] = '0.25rem'; // 4px
spacing[2] = '0.5rem'; // 8px
spacing[3] = '0.75rem'; // 12px
spacing[4] = '1rem'; // 16px - Base unit
spacing[5] = '1.25rem'; // 20px
spacing[6] = '1.5rem'; // 24px
spacing[8] = '2rem'; // 32px
spacing[10] = '2.5rem'; // 40px
spacing[12] = '3rem'; // 48px
spacing[16] = '4rem'; // 64px
spacing[20] = '5rem'; // 80px
spacing[24] = '6rem'; // 96px
spacing[32] = '8rem'; // 128px
spacing[40] = '10rem'; // 160px
spacing[48] = '12rem'; // 192px
spacing[56] = '14rem'; // 224px
spacing[64] = '16rem'; // 256px
```

### Custom Values

```typescript
spacing['4.5'] = '1.125rem'; // 18px
spacing['13'] = '3.25rem'; // 52px
spacing['15'] = '3.75rem'; // 60px
spacing['17'] = '4.25rem'; // 68px
spacing['18'] = '4.5rem'; // 72px
spacing['112'] = '28rem'; // 448px
spacing['128'] = '32rem'; // 512px
spacing['144'] = '36rem'; // 576px
```

**Usage Patterns:**

```tsx
// Padding (internal spacing)
<div className="p-4">16px padding all sides</div>
<div className="px-6 py-4">24px horizontal, 16px vertical</div>
<div className="pt-8 pb-12">32px top, 48px bottom</div>

// Margin (external spacing)
<div className="mb-6">24px bottom margin</div>
<div className="mt-8 mb-12">32px top, 48px bottom</div>

// Gap (flexbox/grid spacing)
<div className="flex gap-4">16px gap between items</div>
<div className="grid grid-cols-3 gap-6">24px gap</div>

// Space between children
<div className="space-y-4">16px vertical spacing</div>
<div className="space-x-2">8px horizontal spacing</div>

// Component-level spacing
<button className="px-4 py-2">16px horizontal, 8px vertical</button>
<input className="px-4 py-3">16px horizontal, 12px vertical</input>

// Section spacing
<section className="py-16 lg:py-24">64px mobile, 96px desktop</section>

// Container spacing
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  Responsive container padding
</div>
```

**Spacing Rhythm Guidelines:**

```tsx
// Within a component (tight)
<div className="space-y-2">
  <label>Label</label>
  <input />
</div>

// Between related components (medium)
<div className="space-y-4">
  <FormField />
  <FormField />
</div>

// Between sections (loose)
<div className="space-y-8">
  <Section />
  <Section />
</div>

// Page-level spacing (very loose)
<div className="space-y-16">
  <Hero />
  <Features />
  <CTA />
</div>
```

---

## Layout Tokens

### Border Radius

```typescript
borderRadius.none = '0';
borderRadius.sm = '0.125rem'; // 2px - Subtle rounding
borderRadius.DEFAULT = '0.25rem'; // 4px - Default
borderRadius.md = '0.375rem'; // 6px - Medium
borderRadius.lg = '0.5rem'; // 8px - Buttons, inputs
borderRadius.xl = '0.75rem'; // 12px - Large buttons
borderRadius['2xl'] = '1rem'; // 16px - Cards
borderRadius['3xl'] = '1.5rem'; // 24px - Large cards
borderRadius.full = '9999px'; // Circle/pill
```

**Usage:**

```tsx
// Buttons
<button className="rounded-lg">8px radius</button>
<button className="rounded-full">Pill button</button>

// Cards
<div className="rounded-2xl">16px radius card</div>
<div className="rounded-3xl">24px radius large card</div>

// Inputs
<input className="rounded-lg" />

// Images
<img className="rounded-xl" />  // 12px for photos
<img className="rounded-full" />  // Avatars

// Mixed corners
<div className="rounded-t-2xl rounded-b-none">
  Top rounded, bottom square
</div>
```

### Box Shadow (Elevation)

```typescript
boxShadow.xs = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
boxShadow.sm = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)';
boxShadow.DEFAULT = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
boxShadow.md = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
boxShadow.lg = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
boxShadow.xl = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
boxShadow['2xl'] = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
boxShadow.inner = 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)';
boxShadow.none = 'none';
```

**Elevation Hierarchy:**

```tsx
// Level 0 - Flat (no shadow)
<div>Base content</div>

// Level 1 - Subtle lift (shadow-xs)
<button className="shadow-xs">Subtle button</button>

// Level 2 - Slight elevation (shadow-sm/md)
<div className="shadow-md">Card</div>

// Level 3 - Raised (shadow-lg)
<div className="shadow-lg hover:shadow-xl">Interactive card</div>

// Level 4 - Floating (shadow-xl)
<div className="shadow-xl">Dropdown menu</div>

// Level 5 - Maximum depth (shadow-2xl)
<div className="shadow-2xl">Modal overlay</div>

// Interactive elevation
<div className="shadow-md transition-shadow hover:shadow-xl">
  Hover for more depth
</div>

// Inner shadow (inset)
<input className="shadow-inner" />
```

### Z-Index (Layering)

```typescript
zIndex[0] = '0';
zIndex[10] = '10';
zIndex[20] = '20';
zIndex[30] = '30';
zIndex[40] = '40';
zIndex[50] = '50';
zIndex.auto = 'auto';
zIndex.dropdown = '1000'; // Dropdown menus
zIndex.sticky = '1020'; // Sticky headers
zIndex.fixed = '1030'; // Fixed elements
zIndex.modal = '1040'; // Modal dialogs
zIndex.popover = '1050'; // Popovers
zIndex.tooltip = '1060'; // Tooltips (highest)
```

**Layering Strategy:**

```tsx
// Base content (z-0 or no z-index)
<div className="relative">Base layer</div>

// Stacked elements (z-10 to z-50)
<div className="relative z-10">Above siblings</div>
<div className="relative z-20">Above z-10</div>

// UI elements (semantic values)
<nav className="sticky top-0 z-sticky">Sticky header (1020)</nav>
<div className="fixed bottom-4 right-4 z-fixed">Chat widget (1030)</div>

// Overlays
<div className="fixed inset-0 z-modal bg-black/50">Modal overlay (1040)</div>
<div className="absolute z-popover">Popover (1050)</div>
<div className="absolute z-tooltip">Tooltip (1060)</div>

// Dropdown pattern
<div className="relative">
  <button>Menu</button>
  <div className="absolute z-dropdown mt-2">
    Dropdown content (1000)
  </div>
</div>
```

---

## Effect Tokens

### Backdrop Blur

```typescript
backdropBlur.xs = '2px'; // Custom subtle blur
backdropBlur.sm = '4px'; // Default Tailwind
backdropBlur.DEFAULT = '8px';
backdropBlur.md = '12px';
backdropBlur.lg = '16px';
backdropBlur.xl = '24px';
backdropBlur['2xl'] = '40px';
backdropBlur['3xl'] = '64px';
```

**Usage:**

```tsx
// Glass morphism
<div className="bg-white/80 backdrop-blur-md">
  Frosted glass effect
</div>

// Modal overlay
<div className="fixed inset-0 bg-black/30 backdrop-blur-sm">
  <div className="modal-content">...</div>
</div>

// Sticky header
<nav className="sticky top-0 bg-white/90 backdrop-blur-lg dark:bg-neutral-900/90">
  Navigation
</nav>

// Card overlay
<div className="relative">
  <img src="bg.jpg" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent backdrop-blur-xs">
    <h2 className="text-white">Title</h2>
  </div>
</div>
```

### Background Gradients

```typescript
backgroundImage['gradient-radial'] = 'radial-gradient(var(--tw-gradient-stops))';
backgroundImage['gradient-conic'] =
  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))';
```

**Usage:**

```tsx
// Linear gradients (Tailwind default)
<div className="bg-gradient-to-r from-brand-500 to-brand-700">
  Horizontal gradient
</div>

<div className="bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600">
  Diagonal gradient with middle stop
</div>

// Radial gradient (custom)
<div className="bg-gradient-radial from-brand-300 to-brand-600">
  Radial gradient
</div>

// Conic gradient (custom)
<div className="bg-gradient-conic from-brand-500 to-brand-700">
  Conic gradient
</div>

// Text gradient
<h1 className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
  Gradient text
</h1>

// Overlay gradients
<div className="relative">
  <img src="hero.jpg" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
    <h2 className="text-white">Content over image</h2>
  </div>
</div>
```

---

## Motion Tokens

### Transition Duration

```typescript
transitionDuration[0] = '0ms';
transitionDuration[75] = '75ms'; // Instant
transitionDuration[100] = '100ms'; // Very quick
transitionDuration[150] = '150ms'; // Quick
transitionDuration[200] = '200ms'; // Default fast
transitionDuration[300] = '300ms'; // Default
transitionDuration[500] = '500ms'; // Slow
transitionDuration[700] = '700ms'; // Very slow
transitionDuration[1000] = '1000ms'; // Extra slow
```

**Usage:**

```tsx
// Fast interactions (hover, focus)
<button className="transition-colors duration-200 hover:bg-brand-600">
  Button
</button>

// Default transitions
<div className="transition-all duration-300">Default speed</div>

// Slow, dramatic transitions
<div className="transition-transform duration-500 hover:scale-110">
  Slow zoom
</div>

// Combined properties
<div className="transition-all duration-200 hover:shadow-xl hover:scale-105">
  Quick multi-property
</div>
```

### Animations

```typescript
// Keyframes defined in tailwind.config.ts
keyframes.fadeIn; // Opacity 0 → 1
keyframes.fadeOut; // Opacity 1 → 0
keyframes.slideInFromTop; // Slide + fade from top
keyframes.slideInFromBottom; // Slide + fade from bottom
keyframes.slideInFromLeft; // Slide + fade from left
keyframes.slideInFromRight; // Slide + fade from right
keyframes.scaleIn; // Scale 0.95 → 1
keyframes.scaleOut; // Scale 1 → 0.95
keyframes.zoomPulse; // Infinite scale pulse
keyframes.swingRotate; // Infinite swing rotation
keyframes.spin; // 360° rotation
keyframes.ping; // Scale + fade ping
keyframes.bounce; // Bounce effect

// Animation utilities
animation.fadeIn = 'fadeIn 0.3s ease-in-out forwards';
animation.fadeOut = 'fadeOut 0.3s ease-in-out forwards';
animation.slideInFromTop = 'slideInFromTop 0.3s ease-out forwards';
animation.slideInFromBottom = 'slideInFromBottom 0.3s ease-out forwards';
animation.slideInFromLeft = 'slideInFromLeft 0.3s ease-out forwards';
animation.slideInFromRight = 'slideInFromRight 0.3s ease-out forwards';
animation.scaleIn = 'scaleIn 0.2s ease-out forwards';
animation.scaleOut = 'scaleOut 0.2s ease-in forwards';
animation.zoomPulse = 'zoomPulse 2s ease-in-out infinite';
animation.swingRotate = 'swingRotate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite';
animation.spin = 'spin 1s linear infinite';
animation.ping = 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite';
animation.bounce = 'bounce 1s infinite';
```

**Usage:**

```tsx
// Fade animations
<div className="animate-fadeIn">Fades in on mount</div>

// Slide animations (directional)
<aside className="animate-slideInFromLeft">Sidebar slides in</aside>
<div className="animate-slideInFromBottom">Bottom sheet</div>

// Scale animations
<div className="animate-scaleIn">Modal appears</div>

// Loading indicators
<div className="animate-spin">⟳</div>
<div className="animate-pulse">Loading skeleton</div>
<div className="animate-bounce">↓ Scroll indicator</div>

// Attention seekers (infinite)
<div className="animate-zoomPulse">●</div>
<div className="animate-ping">Notification dot</div>

// Stagger animation
<div className="space-y-4">
  <div className="animate-slideInFromLeft" style={{ animationDelay: '0ms' }}>Item 1</div>
  <div className="animate-slideInFromLeft" style={{ animationDelay: '100ms' }}>Item 2</div>
  <div className="animate-slideInFromLeft" style={{ animationDelay: '200ms' }}>Item 3</div>
</div>

// Conditional animation
<div className={isVisible ? 'animate-fadeIn' : 'animate-fadeOut'}>
  Toggleable content
</div>
```

---

## Usage Patterns

### Token Selection Decision Tree

**1. Choose Color**

```
Is it interactive? → Use brand colors
Is it feedback? → Use semantic colors (success/warning/error/info)
Is it text/UI? → Use neutral colors
```

**2. Choose Typography**

```
Hero/Landing? → 6xl-7xl, font-extrabold
Page title? → 4xl, font-bold
Section header? → 3xl, font-semibold
Card title? → xl, font-medium
Body text? → base, font-normal
Caption? → sm, font-normal
```

**3. Choose Spacing**

```
Within component? → 1-4 (4px-16px)
Between components? → 4-8 (16px-32px)
Between sections? → 8-16 (32px-64px)
Page sections? → 16-24 (64px-96px)
```

**4. Choose Elevation**

```
Flat element? → No shadow
Subtle card? → shadow-sm/md
Interactive card? → shadow-lg + hover:shadow-xl
Dropdown/menu? → shadow-xl
Modal? → shadow-2xl
```

### Consistency Checklist

When creating a component:

- [ ] Uses only tokens from [tailwind.config.ts](../../tailwind.config.ts)
- [ ] No arbitrary values (`[#hex]`, `[123px]`)
- [ ] Color usage follows semantic meaning
- [ ] Spacing follows 4px/8px rhythm
- [ ] Typography scale maintained
- [ ] Dark mode variants included
- [ ] Interactive states defined (hover, focus, active, disabled)
- [ ] Responsive breakpoints use mobile-first
- [ ] Animations use transform/opacity (GPU-accelerated)
- [ ] Accessibility attributes included

---

## Resources

- [Tailwind Config](../../tailwind.config.ts) - Token definitions
- [Component Templates](README.md) - Token usage examples
- [Airbnb Patterns](04-airbnb-patterns.md) - Professional patterns
- [Tailwind CSS Docs](https://tailwindcss.com/docs/customizing-colors) -
  Customization guide

---

**Version:** 1.0.0 **Last Updated:** 2025-10-03 **Token Count:** 200+ design
tokens
