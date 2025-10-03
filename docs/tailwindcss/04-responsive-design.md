# Tailwind CSS Responsive Design

Master responsive design patterns used by professional frontend teams at Airbnb and other top companies.

## Table of Contents

- [Breakpoint System](#breakpoint-system)
- [Mobile-First Strategy](#mobile-first-strategy)
- [Responsive Layout Patterns](#responsive-layout-patterns)
- [Responsive Typography](#responsive-typography)
- [Responsive Spacing](#responsive-spacing)
- [Container Queries](#container-queries)
- [Common Responsive Patterns](#common-responsive-patterns)
- [Testing Responsive Designs](#testing-responsive-designs)

## Breakpoint System

### Default Breakpoints

```tsx
// Tailwind's default breakpoints
sm: '640px'   // Small devices (tablets)
md: '768px'   // Medium devices (small laptops)
lg: '1024px'  // Large devices (desktops)
xl: '1280px'  // Extra large devices (large desktops)
2xl: '1536px' // 2X large devices (very large desktops)

// Usage
<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
  {/* Responsive width */}
</div>
```

### Understanding Breakpoint Prefixes

```tsx
// No prefix = all screen sizes (mobile-first base)
<div className="text-sm">
  {/* text-sm applies to ALL sizes */}
</div>

// With prefix = that size and up
<div className="text-sm md:text-base lg:text-lg">
  {/*
    Mobile (0-767px): text-sm
    Tablet (768px+): text-base
    Desktop (1024px+): text-lg
  */}
</div>

// Multiple breakpoints
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {/* Responsive grid columns */}
</div>
```

## Mobile-First Strategy

### Think Mobile-First

```tsx
// ❌ Bad - Desktop-first (requires more overrides)
<div className="w-1/4 md:w-1/3 sm:w-1/2 w-full">

// ✅ Good - Mobile-first (progressive enhancement)
<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
  {/* Start with mobile, enhance for larger screens */}
</div>
```

### Why Mobile-First?

1. **Smaller base styles** - Mobile CSS is smallest
2. **Progressive enhancement** - Add features as screen size grows
3. **Better performance** - Less CSS for mobile devices
4. **Easier maintenance** - Logical progression

### Mobile-First Examples

```tsx
// Navigation
<nav className="
  fixed bottom-0 w-full              {/* Mobile: Bottom nav */}
  md:static md:w-auto                {/* Tablet+: Top nav */}
">

// Hero Section
<div className="
  px-4 py-8                          {/* Mobile: Small padding */}
  md:px-8 md:py-16                   {/* Tablet: Medium padding */}
  lg:px-16 lg:py-24                  {/* Desktop: Large padding */}
">

// Typography
<h1 className="
  text-2xl                           {/* Mobile: 24px */}
  md:text-4xl                        {/* Tablet: 36px */}
  lg:text-5xl                        {/* Desktop: 48px */}
">
```

## Responsive Layout Patterns

### Responsive Grid

```tsx
// Basic responsive grid
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ))}
</div>

// Auto-fit grid (no breakpoints needed)
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  {/* Automatically fits as many 250px columns as possible */}
</div>

// Complex grid layout
<div className="grid grid-cols-4 gap-4 md:grid-cols-12">
  <aside className="col-span-4 md:col-span-3">
    {/* Sidebar */}
  </aside>
  <main className="col-span-4 md:col-span-9">
    {/* Main content */}
  </main>
</div>
```

### Responsive Flexbox

```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="md:w-1/3">Sidebar</div>
  <div className="md:w-2/3">Content</div>
</div>

// Reverse order on mobile
<div className="flex flex-col-reverse md:flex-row">
  <div>Image (bottom on mobile, left on desktop)</div>
  <div>Text (top on mobile, right on desktop)</div>
</div>

// Center on mobile, space-between on desktop
<div className="flex flex-col items-center md:flex-row md:justify-between">
  <div>Left</div>
  <div>Right</div>
</div>
```

### Container Pattern

```tsx
// Responsive container with max-width
<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* Content stays centered and doesn't exceed 80rem */}
</div>

// Responsive container widths
<div className="
  container mx-auto
  max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl
">
  {/* Progressive max-width */}
</div>

// Full-width on mobile, contained on desktop
<div className="w-full lg:mx-auto lg:max-w-7xl">
  <div className="px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</div>
```

### Sidebar Layouts

```tsx
// Collapsible sidebar
const Layout: React.FC = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar (overlay) */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-gray-900/50 lg:hidden',
          sidebarOpen ? 'block' : 'hidden'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform',
          'lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar content */}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-4"
        >
          Menu
        </button>
        {children}
      </main>
    </div>
  );
};
```

## Responsive Typography

### Font Sizes

```tsx
// Responsive headings
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
  Hero Heading
</h1>

<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
  Section Heading
</h2>

<h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">
  Subsection Heading
</h3>

// Body text
<p className="text-sm sm:text-base md:text-lg">
  Responsive paragraph text
</p>

// Small text
<p className="text-xs sm:text-sm">
  Fine print or captions
</p>
```

### Line Height & Letter Spacing

```tsx
// Responsive line height
<p className="leading-relaxed md:leading-loose">
  {/* More line height on larger screens */}
</p>

// Responsive tracking
<h1 className="tracking-tight md:tracking-normal lg:tracking-wide">
  Responsive letter spacing
</h1>
```

### Text Alignment

```tsx
// Center on mobile, left on desktop
<h2 className="text-center md:text-left">
  Heading
</h2>

// Different alignment per breakpoint
<p className="text-center sm:text-left md:text-right lg:text-justify">
  Flexible alignment
</p>
```

## Responsive Spacing

### Padding

```tsx
// Progressive padding
<div className="p-4 sm:p-6 md:p-8 lg:p-12">
  {/* Larger padding on bigger screens */}
</div>

// Asymmetric responsive padding
<section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
  {/* Different horizontal and vertical padding */}
</section>

// Container with responsive padding
<div className="
  mx-auto max-w-7xl
  px-4 sm:px-6 lg:px-8
  py-8 sm:py-12 lg:py-16
">
  {/* Responsive container padding */}
</div>
```

### Margin

```tsx
// Responsive margins
<div className="mb-4 sm:mb-6 md:mb-8 lg:mb-12">
  {/* Growing bottom margin */}
</div>

// Responsive centering
<div className="mx-0 md:mx-auto">
  {/* No margin on mobile, auto centered on desktop */}
</div>
```

### Gap (Flexbox/Grid)

```tsx
// Responsive flex gap
<div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-8">
  {/* Growing gap between items */}
</div>

// Responsive grid gap
<div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
  {/* More columns and larger gap on bigger screens */}
</div>
```

## Container Queries

### Using Container Queries (Tailwind v4+)

```tsx
// Container with query support
<div className="@container">
  <div className="@sm:text-lg @md:text-xl @lg:text-2xl">
    {/* Responds to container size, not viewport */}
  </div>
</div>

// Practical example: Card that adapts to container
const AdaptiveCard: React.FC = ({ children }) => (
  <div className="@container rounded-lg bg-white p-4 shadow-md">
    <div className="flex flex-col @md:flex-row gap-4">
      <div className="@md:w-1/3">
        <img src="/image.jpg" className="rounded" />
      </div>
      <div className="@md:w-2/3">
        {children}
      </div>
    </div>
  </div>
);
```

## Common Responsive Patterns

### Hero Section

```tsx
const Hero: React.FC = () => (
  <section className="
    relative overflow-hidden
    px-4 py-12
    sm:px-6 sm:py-16
    lg:px-8 lg:py-24
  ">
    <div className="mx-auto max-w-7xl">
      <div className="
        grid grid-cols-1 gap-8
        lg:grid-cols-2 lg:gap-12
        items-center
      ">
        {/* Content */}
        <div className="text-center lg:text-left">
          <h1 className="
            text-4xl font-bold
            sm:text-5xl
            lg:text-6xl
            tracking-tight
          ">
            Welcome to Our Platform
          </h1>
          <p className="
            mt-4 text-lg text-gray-600
            sm:mt-6 sm:text-xl
            lg:text-2xl
          ">
            Build amazing things with our tools
          </p>
          <div className="
            mt-8 flex flex-col gap-4
            sm:flex-row sm:justify-center
            lg:justify-start
          ">
            <Button size="lg">Get Started</Button>
            <Button variant="secondary" size="lg">Learn More</Button>
          </div>
        </div>

        {/* Image */}
        <div className="hidden lg:block">
          <img src="/hero.jpg" alt="Hero" className="rounded-lg shadow-2xl" />
        </div>
      </div>
    </div>
  </section>
);
```

### Feature Grid

```tsx
const FeatureGrid: React.FC = ({ features }) => (
  <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    <div className="mx-auto max-w-7xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
          Features
        </h2>
      </div>

      <div className="
        mt-12 grid gap-8
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:gap-12
      ">
        {features.map((feature) => (
          <div key={feature.id} className="text-center lg:text-left">
            <div className="
              mx-auto lg:mx-0
              flex h-12 w-12 items-center justify-center
              rounded-lg bg-blue-600
            ">
              {feature.icon}
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
```

### Product Grid

```tsx
const ProductGrid: React.FC = ({ products }) => (
  <div className="
    grid gap-4
    grid-cols-1
    sm:grid-cols-2 sm:gap-6
    lg:grid-cols-3
    xl:grid-cols-4 xl:gap-8
  ">
    {products.map((product) => (
      <ProductCard key={product.id} {...product} />
    ))}
  </div>
);
```

### Navigation

```tsx
const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.svg" className="h-8 w-auto" />
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <a href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </a>
            <a href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </a>
            <Button>Sign In</Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="space-y-1 px-4 py-3">
            <a href="/" className="block py-2 text-gray-700">
              Home
            </a>
            <a href="/products" className="block py-2 text-gray-700">
              Products
            </a>
            <a href="/about" className="block py-2 text-gray-700">
              About
            </a>
            <Button className="mt-4 w-full">Sign In</Button>
          </div>
        </div>
      )}
    </nav>
  );
};
```

### Footer

```tsx
const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-white">
    <div className="
      mx-auto max-w-7xl
      px-4 py-12
      sm:px-6 sm:py-16
      lg:px-8 lg:py-20
    ">
      <div className="
        grid gap-8
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
      ">
        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-semibold">Company</h3>
          <ul className="mt-4 space-y-2">
            <li><a href="/about">About</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Repeat for other columns */}
      </div>

      {/* Bottom section */}
      <div className="
        mt-12 border-t border-gray-800 pt-8
        flex flex-col gap-4
        sm:flex-row sm:justify-between
        items-center
      ">
        <p className="text-sm text-gray-400">
          © 2024 Company. All rights reserved.
        </p>
        <div className="flex gap-4">
          {/* Social icons */}
        </div>
      </div>
    </div>
  </footer>
);
```

## Testing Responsive Designs

### Browser DevTools

```bash
# Chrome DevTools
1. F12 or Cmd+Option+I
2. Click device toolbar icon (Cmd+Shift+M)
3. Test different device sizes

# Common test sizes
- Mobile: 375px (iPhone SE)
- Mobile: 390px (iPhone 13/14)
- Tablet: 768px (iPad)
- Desktop: 1440px
- Large: 1920px
```

### Tailwind Play

```bash
# Test responsive designs online
https://play.tailwindcss.com/

# Add responsive modifiers and preview
```

### Responsive Design Checklist

- [ ] Test all breakpoints (sm, md, lg, xl, 2xl)
- [ ] Ensure touch targets are at least 44x44px on mobile
- [ ] Check text readability on all screen sizes
- [ ] Verify images scale properly
- [ ] Test navigation on mobile and desktop
- [ ] Ensure forms are usable on mobile
- [ ] Check spacing consistency across breakpoints
- [ ] Test with real devices, not just browser tools
- [ ] Verify horizontal scrolling doesn't occur
- [ ] Check performance on mobile networks

## Best Practices Summary

✅ **DO:**
- Start with mobile styles (no prefix)
- Add larger screen styles progressively (sm:, md:, lg:)
- Use consistent breakpoint progression
- Test on real devices
- Use responsive containers (max-w-*)
- Hide/show elements appropriately (hidden md:block)
- Use responsive spacing (p-4 md:p-6 lg:p-8)
- Consider touch targets on mobile (min h-12 w-12)

❌ **DON'T:**
- Use fixed widths without mobile consideration
- Forget to test mobile landscape orientation
- Ignore tablet sizes (md breakpoint)
- Use too many breakpoints (keep it simple)
- Assume all mobile devices are the same
- Ignore performance on mobile networks
- Forget about hover states on touch devices

## Next Steps

- [Advanced Techniques](./05-advanced-techniques.md)
- Practice building responsive layouts
- Study responsive designs on production sites
- Test on multiple devices
