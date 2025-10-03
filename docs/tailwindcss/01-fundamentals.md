# Tailwind CSS Fundamentals

Master the core concepts of Tailwind CSS used by professional frontend developers at companies like Airbnb.

## Table of Contents

- [Core Philosophy](#core-philosophy)
- [Utility-First Approach](#utility-first-approach)
- [Class Naming System](#class-naming-system)
- [Layout Fundamentals](#layout-fundamentals)
- [Spacing System](#spacing-system)
- [Typography](#typography)
- [Colors](#colors)
- [Borders & Shadows](#borders--shadows)
- [Essential Utilities](#essential-utilities)

## Core Philosophy

### Think in Utilities, Not Components

```tsx
// ❌ Old way: Custom CSS
<div className="card">
  <h2 className="card-title">Title</h2>
  <p className="card-body">Content</p>
</div>

// ✅ Tailwind way: Utility classes
<div className="rounded-lg bg-white p-6 shadow-md">
  <h2 className="mb-2 text-xl font-bold">Title</h2>
  <p className="text-gray-600">Content</p>
</div>
```

### Mobile-First Design

Tailwind uses mobile-first breakpoints:

```tsx
// Base styles apply to mobile
// Add breakpoint prefixes for larger screens
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* 100% width on mobile */}
  {/* 50% width on tablet (md) */}
  {/* 33% width on desktop (lg) */}
</div>
```

### Consistency Through Constraints

Tailwind's predefined scale ensures design consistency:

```tsx
// ✅ Good - using scale values
<div className="p-4">        {/* 1rem = 16px */}
<div className="p-6">        {/* 1.5rem = 24px */}
<div className="p-8">        {/* 2rem = 32px */}

// ❌ Avoid - arbitrary values (unless necessary)
<div className="p-[17px]">   {/* Breaks consistency */}
```

## Utility-First Approach

### Building Blocks

Every design is composed of utility classes:

```tsx
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary' }) => (
  <button
    className={`
      inline-flex items-center justify-center
      rounded-md px-4 py-2
      text-sm font-medium
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-50
      ${variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}
      ${variant === 'secondary' && 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'}
    `}
  >
    {children}
  </button>
);
```

### Why Utility-First?

1. **No naming overhead** - No need to invent class names
2. **Faster development** - Styles directly in markup
3. **Smaller bundle size** - Reusable utilities
4. **Easier maintenance** - Styles colocated with markup
5. **Design system enforcement** - Limited choices = consistency

## Class Naming System

### Understanding the Pattern

```
[state]:[breakpoint]:[utility]-[value]

Examples:
hover:bg-blue-500           [state]:[utility]-[value]
md:text-lg                  [breakpoint]:[utility]-[value]
dark:hover:bg-gray-800      [state]:[state]:[utility]-[value]
sm:hover:scale-105          [breakpoint]:[state]:[utility]-[value]
```

### Common Prefixes

```tsx
{/* State variants */}
hover:bg-blue-600          // On hover
focus:ring-2               // On focus
active:scale-95            // On click/active
disabled:opacity-50        // When disabled
group-hover:opacity-100    // When parent .group is hovered
peer-focus:border-blue-500 // When sibling .peer is focused

{/* Responsive variants */}
sm:text-base              // ≥640px
md:text-lg                // ≥768px
lg:text-xl                // ≥1024px
xl:text-2xl               // ≥1280px
2xl:text-3xl              // ≥1536px

{/* Dark mode */}
dark:bg-gray-900          // In dark mode
dark:text-white

{/* Combination */}
md:hover:scale-105        // Hover scale on medium+ screens
dark:hover:bg-gray-700    // Hover background in dark mode
```

## Layout Fundamentals

### Display

```tsx
// Block & Inline
<div className="block">Full width block</div>
<span className="inline">Inline element</span>
<div className="inline-block">Inline block (width/height allowed)</div>

// Flex
<div className="flex">Flexbox container</div>
<div className="inline-flex">Inline flex container</div>

// Grid
<div className="grid">Grid container</div>
<div className="inline-grid">Inline grid container</div>

// Hide/Show
<div className="hidden">Completely hidden</div>
<div className="hidden md:block">Hidden on mobile, visible on md+</div>
```

### Flexbox (Most Common)

```tsx
// Direction
<div className="flex flex-row">      {/* Horizontal (default) */}
<div className="flex flex-col">      {/* Vertical */}
<div className="flex flex-row-reverse"> {/* Reversed horizontal */}
<div className="flex flex-col-reverse"> {/* Reversed vertical */}

// Alignment (main axis)
<div className="flex justify-start">     {/* Left */}
<div className="flex justify-center">    {/* Center */}
<div className="flex justify-end">       {/* Right */}
<div className="flex justify-between">   {/* Space between */}
<div className="flex justify-around">    {/* Space around */}

// Alignment (cross axis)
<div className="flex items-start">       {/* Top */}
<div className="flex items-center">      {/* Center */}
<div className="flex items-end">         {/* Bottom */}
<div className="flex items-stretch">     {/* Stretch (default) */}

// Wrap
<div className="flex flex-wrap">         {/* Allow wrapping */}
<div className="flex flex-nowrap">       {/* No wrapping (default) */}

// Gap
<div className="flex gap-4">             {/* Gap between items */}
<div className="flex gap-x-4 gap-y-2">   {/* Different horizontal/vertical gaps */}

// Pro pattern: Centered card
<div className="flex min-h-screen items-center justify-center">
  <div className="card">Perfectly centered</div>
</div>
```

### Grid

```tsx
// Basic grid
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

// Responsive grid
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop, 4 on xl */}
</div>

// Auto-fit columns (responsive without breakpoints)
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  {/* Automatically fits as many 250px columns as possible */}
</div>

// Span multiple columns
<div className="grid grid-cols-6 gap-4">
  <div className="col-span-2">Spans 2 columns</div>
  <div className="col-span-4">Spans 4 columns</div>
  <div className="col-span-full">Spans all columns</div>
</div>

// Pro pattern: Dashboard layout
<div className="grid grid-cols-12 gap-6">
  <aside className="col-span-12 lg:col-span-3">Sidebar</aside>
  <main className="col-span-12 lg:col-span-9">Main content</main>
</div>
```

### Position

```tsx
// Static (default)
<div className="static">Normal flow</div>

// Relative (offset from normal position)
<div className="relative top-4 left-4">Shifted 4 units down and right</div>

// Absolute (removed from flow, positioned relative to nearest positioned ancestor)
<div className="relative">
  <div className="absolute right-0 top-0">Top right corner</div>
</div>

// Fixed (relative to viewport)
<div className="fixed bottom-4 right-4">Chat bubble</div>

// Sticky (sticky positioning)
<div className="sticky top-0">Sticky header</div>

// Pro pattern: Absolute centering
<div className="relative h-64">
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
    Perfectly centered
  </div>
</div>
```

## Spacing System

Tailwind uses a consistent spacing scale: `0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96`

### Padding

```tsx
// All sides
<div className="p-4">1rem padding all sides</div>

// Horizontal (left + right)
<div className="px-4">1rem horizontal padding</div>

// Vertical (top + bottom)
<div className="py-4">1rem vertical padding</div>

// Individual sides
<div className="pt-4">Top padding</div>
<div className="pr-4">Right padding</div>
<div className="pb-4">Bottom padding</div>
<div className="pl-4">Left padding</div>

// Common patterns
<div className="p-4 md:p-6 lg:p-8">Responsive padding</div>
<div className="px-4 py-2">Button padding (horizontal more than vertical)</div>
```

### Margin

```tsx
// Same as padding
<div className="m-4">Margin all sides</div>
<div className="mx-auto">Center block element</div>
<div className="my-8">Vertical margin</div>

// Negative margin
<div className="-mt-4">Pull up by 1rem</div>
<div className="-mx-4">Negative horizontal margin (bleed)</div>

// Auto margin (centering)
<div className="mx-auto max-w-7xl">Centered container</div>

// Common patterns
<div className="mb-4">Space below element</div>
<div className="mt-8">Space above section</div>
```

### Gap (for Flex/Grid)

```tsx
// Flex
<div className="flex gap-4">Gap between flex items</div>
<div className="flex gap-x-4 gap-y-2">Different horizontal/vertical gaps</div>

// Grid
<div className="grid grid-cols-3 gap-6">Gap between grid items</div>

// Responsive gaps
<div className="flex gap-2 md:gap-4 lg:gap-6">Growing gaps</div>
```

### Space Between (Legacy, use gap instead)

```tsx
// Still useful for simple cases
<div className="flex flex-col space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## Typography

### Font Size

```tsx
<p className="text-xs">Extra small (0.75rem)</p>
<p className="text-sm">Small (0.875rem)</p>
<p className="text-base">Base (1rem) - default</p>
<p className="text-lg">Large (1.125rem)</p>
<p className="text-xl">Extra large (1.25rem)</p>
<p className="text-2xl">2XL (1.5rem)</p>
<p className="text-3xl">3XL (1.875rem)</p>
<p className="text-4xl">4XL (2.25rem)</p>
<p className="text-5xl">5XL (3rem)</p>
<p className="text-6xl">6XL (3.75rem)</p>

// With line height included
<p className="text-sm/6">Small with 1.5rem line height</p>
<p className="text-base/loose">Base with loose line height</p>
```

### Font Weight

```tsx
<p className="font-thin">100</p>
<p className="font-extralight">200</p>
<p className="font-light">300</p>
<p className="font-normal">400 - default</p>
<p className="font-medium">500</p>
<p className="font-semibold">600</p>
<p className="font-bold">700</p>
<p className="font-extrabold">800</p>
<p className="font-black">900</p>

// Common usage
<h1 className="text-3xl font-bold">Heading</h1>
<p className="text-sm font-medium">Subheading</p>
<p className="font-normal">Body text</p>
```

### Text Alignment

```tsx
<p className="text-left">Left aligned</p>
<p className="text-center">Center aligned</p>
<p className="text-right">Right aligned</p>
<p className="text-justify">Justified</p>

// Responsive
<p className="text-center md:text-left">Centered on mobile, left on desktop</p>
```

### Text Transform & Decoration

```tsx
// Transform
<p className="uppercase">UPPERCASE</p>
<p className="lowercase">lowercase</p>
<p className="capitalize">Capitalize Each Word</p>
<p className="normal-case">Normal case</p>

// Decoration
<p className="underline">Underlined</p>
<p className="line-through">Strikethrough</p>
<p className="no-underline">Remove underline</p>

// Hover states
<a className="hover:underline">Underline on hover</a>
<a className="underline hover:no-underline">Remove underline on hover</a>
```

### Line Height & Letter Spacing

```tsx
// Line height
<p className="leading-none">1</p>
<p className="leading-tight">1.25</p>
<p className="leading-snug">1.375</p>
<p className="leading-normal">1.5</p>
<p className="leading-relaxed">1.625</p>
<p className="leading-loose">2</p>

// Letter spacing (tracking)
<p className="tracking-tighter">-0.05em</p>
<p className="tracking-tight">-0.025em</p>
<p className="tracking-normal">0em</p>
<p className="tracking-wide">0.025em</p>
<p className="tracking-wider">0.05em</p>
<p className="tracking-widest">0.1em</p>

// Common pattern
<h1 className="text-4xl font-bold leading-tight tracking-tight">
  Tight heading
</h1>
```

### Text Overflow

```tsx
// Truncate (single line)
<p className="truncate">
  This text will be truncated with ellipsis if too long...
</p>

// Multi-line truncate (with line-clamp)
<p className="line-clamp-2">
  This text will be truncated after 2 lines with ellipsis...
  It can span multiple lines but will be cut off after the second line.
</p>

// Overflow behavior
<div className="overflow-hidden">Hidden overflow</div>
<div className="overflow-auto">Scrollable</div>
<div className="overflow-visible">Visible overflow</div>
```

## Colors

### Text Colors

```tsx
// Grayscale
<p className="text-black">Black</p>
<p className="text-white">White</p>
<p className="text-gray-50">Lightest gray</p>
<p className="text-gray-500">Medium gray</p>
<p className="text-gray-900">Darkest gray</p>

// Brand colors (from Tailwind palette)
<p className="text-blue-500">Blue</p>
<p className="text-red-500">Red</p>
<p className="text-green-500">Green</p>

// Opacity
<p className="text-blue-500/50">Blue with 50% opacity</p>
<p className="text-blue-500/75">Blue with 75% opacity</p>

// Dark mode
<p className="text-gray-900 dark:text-white">Adapts to dark mode</p>
```

### Background Colors

```tsx
<div className="bg-white">White background</div>
<div className="bg-gray-50">Light gray</div>
<div className="bg-blue-500">Blue</div>

// Opacity
<div className="bg-blue-500/10">Blue with 10% opacity</div>

// Gradients
<div className="bg-gradient-to-r from-blue-500 to-purple-500">
  Gradient background
</div>

// Dark mode
<div className="bg-white dark:bg-gray-900">Adaptive background</div>
```

### Border Colors

```tsx
<div className="border border-gray-300">Gray border</div>
<div className="border-2 border-blue-500">Thicker blue border</div>
<div className="border-t border-gray-200">Top border only</div>
```

## Borders & Shadows

### Borders

```tsx
// Width
<div className="border">1px all sides</div>
<div className="border-2">2px all sides</div>
<div className="border-4">4px all sides</div>

// Sides
<div className="border-t">Top only</div>
<div className="border-r">Right only</div>
<div className="border-b">Bottom only</div>
<div className="border-l">Left only</div>
<div className="border-x">Horizontal</div>
<div className="border-y">Vertical</div>

// Colors
<div className="border border-gray-300">Gray border</div>
<div className="border-2 border-blue-500">Blue border</div>

// Radius
<div className="rounded">0.25rem radius</div>
<div className="rounded-md">0.375rem</div>
<div className="rounded-lg">0.5rem</div>
<div className="rounded-xl">0.75rem</div>
<div className="rounded-full">Full circle/pill</div>

// Individual corners
<div className="rounded-t-lg">Top corners</div>
<div className="rounded-tl-lg">Top-left corner</div>
```

### Shadows

```tsx
<div className="shadow-sm">Small shadow</div>
<div className="shadow">Default shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
<div className="shadow-xl">Extra large shadow</div>
<div className="shadow-2xl">Huge shadow</div>

// Hover effects
<div className="shadow-md transition-shadow hover:shadow-lg">
  Shadow grows on hover
</div>

// Colored shadows (Tailwind v4)
<div className="shadow-lg shadow-blue-500/50">Blue shadow</div>

// Remove shadow
<div className="shadow-none">No shadow</div>
```

## Essential Utilities

### Width & Height

```tsx
// Fixed
<div className="w-32">8rem width</div>
<div className="h-32">8rem height</div>

// Percentage
<div className="w-1/2">50% width</div>
<div className="w-1/3">33.33% width</div>
<div className="w-full">100% width</div>

// Viewport
<div className="h-screen">100vh height</div>
<div className="w-screen">100vw width</div>

// Min/Max
<div className="min-h-screen">Minimum 100vh</div>
<div className="max-w-7xl">Maximum 80rem</div>
<div className="max-w-prose">Optimal reading width (~65ch)</div>

// Auto
<div className="w-auto">Auto width</div>
```

### Opacity

```tsx
<div className="opacity-0">Invisible</div>
<div className="opacity-50">50% opacity</div>
<div className="opacity-100">Fully visible</div>

// Hover
<div className="opacity-50 hover:opacity-100">Fade in on hover</div>
```

### Cursor

```tsx
<button className="cursor-pointer">Pointer</button>
<button className="cursor-not-allowed" disabled>Not allowed</button>
<div className="cursor-wait">Wait</div>
<div className="cursor-help">Help</div>
```

### Transitions

```tsx
// Simple transition (all properties)
<button className="transition hover:bg-blue-600">
  Smooth transition
</button>

// Specific properties
<button className="transition-colors hover:bg-blue-600">
  Only transition colors
</button>

<button className="transition-transform hover:scale-105">
  Only transition transform
</button>

// Duration
<button className="transition duration-150">150ms</button>
<button className="transition duration-300">300ms (default)</button>
<button className="transition duration-500">500ms</button>

// Timing function
<button className="transition ease-in">Ease in</button>
<button className="transition ease-out">Ease out</button>
<button className="transition ease-in-out">Ease in-out (default)</button>

// Pro pattern
<button className="transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
  Smooth interactive button
</button>
```

## Practice Exercise

Build a card component using fundamentals:

```tsx
const Card: React.FC = () => (
  <div className="mx-auto max-w-sm">
    {/* Card container */}
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
      {/* Image */}
      <img
        src="/placeholder.jpg"
        alt="Card"
        className="h-48 w-full object-cover"
      />

      {/* Content */}
      <div className="p-6">
        {/* Badge */}
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          New
        </span>

        {/* Title */}
        <h2 className="mt-2 text-xl font-bold text-gray-900">
          Card Title
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          This is a description that demonstrates proper typography and spacing.
        </p>

        {/* Button */}
        <button className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Learn More
        </button>
      </div>
    </div>
  </div>
);
```

## Next Steps

Continue to:
- [Best Practices](./02-best-practices.md)
- [Component Patterns](./03-component-patterns.md)
- [Responsive Design](./04-responsive-design.md)
- [Advanced Techniques](./05-advanced-techniques.md)
