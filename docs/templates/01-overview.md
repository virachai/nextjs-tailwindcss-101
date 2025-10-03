# Modern Website Templates with Tailwind CSS

> Professional-grade templates for building consistent, scalable UI using
> Tailwind CSS design tokens and Airbnb-level best practices.

## Table of Contents

- [What Are Templates?](#what-are-templates)
- [Why Use Templates?](#why-use-templates)
- [Template Architecture](#template-architecture)
- [Design Token System](#design-token-system)
- [Template Categories](#template-categories)
- [Best Practices](#best-practices)
- [Implementation Strategy](#implementation-strategy)

---

## What Are Templates?

Templates are **pre-built, reusable UI patterns** that combine:

1. **Design Tokens** - Consistent colors, spacing, typography
2. **Layout Patterns** - Proven structural compositions
3. **Component Patterns** - Reusable UI elements
4. **Page Patterns** - Complete page layouts

### Templates vs Components vs Pages

```
┌─────────────────────────────────────────────────┐
│ Templates (Reusable Patterns)                   │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Page Templates                           │  │
│  │ - Landing Page                           │  │
│  │ - Dashboard                              │  │
│  │ - Blog                                   │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Layout Templates                         │  │
│  │ - Header + Content + Footer              │  │
│  │ - Sidebar Navigation                     │  │
│  │ - Two-column Layout                      │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Component Templates                      │  │
│  │ - Hero Sections                          │  │
│  │ - Feature Grids                          │  │
│  │ - Card Layouts                           │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## Why Use Templates?

### 1. **Consistency** 🎯

Templates ensure UI consistency across your entire application by using shared
design tokens.

```tsx
// ❌ Inconsistent - Magic numbers everywhere
<div className="mt-5 mb-3 text-[17px] text-[#333]">

// ✅ Consistent - Using design tokens
<div className="my-4 text-base text-neutral-900">
```

### 2. **Speed** ⚡

Build pages 10x faster by copying proven patterns instead of starting from
scratch.

```tsx
// Instead of designing from scratch every time...
// Copy a proven template and customize
import { HeroTemplate } from '@/templates/hero';

<HeroTemplate
  title="Your Custom Title"
  description="Your custom description"
  ctaText="Get Started"
/>;
```

### 3. **Quality** ✨

Templates are pre-tested for:

- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Responsive design (mobile-first)
- ✅ Performance (optimized classes)
- ✅ Dark mode support

### 4. **Scalability** 📈

Templates grow with your project:

- Easy to maintain (change once, update everywhere)
- Simple to extend (add variants)
- Type-safe (TypeScript interfaces)

---

## Template Architecture

### Layered System

```
┌─────────────────────────────────────────────────┐
│ Layer 4: Page Templates                         │
│ Complete pages ready to use                     │
├─────────────────────────────────────────────────┤
│ Layer 3: Section Templates                      │
│ Large compositional patterns (Hero, Features)   │
├─────────────────────────────────────────────────┤
│ Layer 2: Layout Templates                       │
│ Structural patterns (Grid, Flexbox, Container)  │
├─────────────────────────────────────────────────┤
│ Layer 1: Design Tokens                          │
│ Foundation (Colors, Spacing, Typography, etc.)  │
└─────────────────────────────────────────────────┘
```

### File Structure

```
src/
├── templates/
│   ├── layout/
│   │   ├── AppShell.tsx          # Main app container
│   │   ├── TwoColumnLayout.tsx   # Sidebar + content
│   │   └── ThreeColumnLayout.tsx # Sidebar + content + aside
│   ├── sections/
│   │   ├── Hero.tsx              # Hero sections
│   │   ├── Features.tsx          # Feature grids
│   │   ├── Testimonials.tsx      # Social proof
│   │   ├── CTA.tsx               # Call-to-action
│   │   └── Footer.tsx            # Footer sections
│   ├── pages/
│   │   ├── LandingPage.tsx       # Marketing landing
│   │   ├── Dashboard.tsx         # App dashboard
│   │   ├── BlogPost.tsx          # Blog article
│   │   └── PricingPage.tsx       # Pricing table
│   └── index.ts                  # Export all templates
```

---

## Design Token System

All templates use design tokens from
[tailwind.config.ts](../../tailwind.config.ts) for consistency.

### Color System

```tsx
// Brand Colors (Primary actions)
bg - brand - 500; // Primary brand color
bg - brand - 600; // Hover state
bg - brand - 700; // Active state

// Semantic Colors (Meaning)
bg - success - 500; // Success states
bg - warning - 500; // Warning states
bg - error - 500; // Error states
bg - info - 500; // Info states

// Neutral Colors (Text, backgrounds)
text - neutral - 900; // Primary text (dark mode: neutral-50)
text - neutral - 600; // Secondary text
bg - neutral - 50; // Light background
```

### Spacing System (4px base unit)

```tsx
// Consistent spacing across all templates
space - y - 4; // 16px vertical spacing
space - y - 6; // 24px vertical spacing
space - y - 8; // 32px vertical spacing
space - y - 12; // 48px section spacing
space - y - 16; // 64px large section spacing
```

### Typography Scale

```tsx
// Headings
text-4xl font-bold      // Hero title (36px)
text-3xl font-bold      // Section title (30px)
text-2xl font-semibold  // Card title (24px)
text-xl font-semibold   // Subsection title (20px)

// Body Text
text-base               // Body text (16px)
text-sm                 // Small text (14px)
text-xs                 // Helper text (12px)
```

### Border Radius

```tsx
rounded-lg    // 8px - Buttons, cards
rounded-xl    // 12px - Modals, panels
rounded-2xl   // 16px - Hero sections
rounded-full  // Pills, avatars
```

### Shadows

```tsx
shadow-sm     // Subtle elevation
shadow-md     // Default cards
shadow-lg     // Modals, dropdowns
shadow-xl     // Hero sections
shadow-2xl    // Maximum depth
```

### Animations

```tsx
// Fade transitions
animate - fadeIn; // Entrance animations
animate - fadeOut; // Exit animations

// Slide transitions
animate - slideInFromTop; // From top
animate - slideInFromBottom; // From bottom
animate - slideInFromLeft; // From left
animate - slideInFromRight; // From right

// Scale transitions
animate - scaleIn; // Modal entrance
animate - scaleOut; // Modal exit
```

---

## Template Categories

### 1. Layout Templates

Structural patterns for page organization.

```tsx
import { AppShell, TwoColumnLayout } from '@/templates/layout';

// Full app shell with header, sidebar, footer
<AppShell>
  <YourContent />
</AppShell>

// Two-column with sidebar
<TwoColumnLayout sidebar={<Nav />}>
  <YourContent />
</TwoColumnLayout>
```

**Use Cases:**

- Admin dashboards
- Documentation sites
- Blog layouts
- Marketing sites

### 2. Section Templates

Reusable page sections.

```tsx
import { Hero, Features, CTA } from '@/templates/sections';

// Hero section
<Hero
  title="Build amazing products"
  description="The best platform for modern teams"
  ctaText="Get Started"
  ctaHref="/signup"
/>

// Features grid
<Features
  title="Why choose us?"
  features={[
    { icon: '⚡', title: 'Fast', description: 'Lightning quick' },
    { icon: '🔒', title: 'Secure', description: 'Bank-level security' },
  ]}
/>
```

**Use Cases:**

- Landing pages
- Marketing sites
- Product pages

### 3. Page Templates

Complete page layouts.

```tsx
import { LandingPage, Dashboard } from '@/templates/pages';

// Complete landing page
<LandingPage
  hero={{ title: '...', description: '...' }}
  features={[...]}
  testimonials={[...]}
  cta={{ title: '...', buttonText: '...' }}
/>

// Complete dashboard
<Dashboard
  stats={[...]}
  charts={[...]}
  recentActivity={[...]}
/>
```

**Use Cases:**

- Rapid prototyping
- MVPs
- Internal tools

---

## Best Practices

### 1. **Always Use Design Tokens**

```tsx
// ❌ Bad - Arbitrary values
<div className="mt-[18px] text-[#1a1a1a] rounded-[6px]">

// ✅ Good - Design tokens
<div className="mt-4 text-neutral-900 rounded-lg">
```

### 2. **Mobile-First Responsive**

```tsx
// ✅ Start mobile, scale up
<div className="
  grid grid-cols-1      /* Mobile: 1 column */
  md:grid-cols-2        /* Tablet: 2 columns */
  lg:grid-cols-3        /* Desktop: 3 columns */
">
```

### 3. **Consistent Spacing**

```tsx
// ✅ Use consistent vertical rhythm
<section className="py-12 md:py-16 lg:py-24">
  <div className="space-y-8">
    <h2 className="text-3xl font-bold">Title</h2>
    <div className="space-y-4">{/* Content with consistent spacing */}</div>
  </div>
</section>
```

### 4. **Semantic HTML**

```tsx
// ✅ Use proper semantic elements
<section>
  {' '}
  {/* Not <div> */}
  <header>
    {' '}
    {/* Not <div> */}
    <h1>Title</h1>
  </header>
  <article>
    {' '}
    {/* Not <div> */}
    <p>Content</p>
  </article>
</section>
```

### 5. **Accessibility First**

```tsx
// ✅ Include ARIA labels and keyboard navigation
<button
  type="button"
  aria-label="Close menu"
  className="focus:ring-brand-500 focus:ring-2 focus:ring-offset-2 focus:outline-none"
>
  Close
</button>
```

### 6. **Dark Mode Support**

```tsx
// ✅ Design for both light and dark modes
<div className="
  bg-white dark:bg-neutral-900
  text-neutral-900 dark:text-neutral-50
  border border-neutral-200 dark:border-neutral-800
">
```

---

## Implementation Strategy

### Phase 1: Foundation (Week 1)

1. **Set up design tokens** in [tailwind.config.ts](../../tailwind.config.ts) ✅
2. **Create token documentation**
3. **Set up template directories**

### Phase 2: Layout Templates (Week 2)

1. Create `AppShell` template
2. Create `TwoColumnLayout` template
3. Create `ThreeColumnLayout` template
4. Add responsive behavior

### Phase 3: Section Templates (Week 3)

1. Create `Hero` variants
2. Create `Features` grid
3. Create `Testimonials` section
4. Create `CTA` section
5. Create `Footer` section

### Phase 4: Page Templates (Week 4)

1. Create `LandingPage` template
2. Create `Dashboard` template
3. Create `BlogPost` template
4. Create `PricingPage` template

### Phase 5: Testing & Documentation (Week 5)

1. Accessibility testing (axe, WAVE)
2. Responsive testing (all breakpoints)
3. Dark mode testing
4. Performance testing
5. Write documentation

---

## Real-World Examples

### Airbnb Design Language System (DLS)

- **Consistent spacing**: 4px grid system
- **Color palette**: Primary, secondary, semantic colors
- **Typography**: Cereal font family with defined scale
- **Components**: Reusable React components with variants

### Shopify Polaris

- **Design tokens**: CSS custom properties
- **Component library**: 60+ components
- **Templates**: Pre-built page layouts
- **Accessibility**: WCAG 2.1 AA compliant

### Uber Base Web

- **Theming**: Customizable design tokens
- **Components**: Production-ready React components
- **Documentation**: Comprehensive guides
- **TypeScript**: Full type safety

---

## Tools & Resources

### Essential Tools

1. **Tailwind CSS IntelliSense** - VSCode extension for autocomplete
2. **Headless UI** - Unstyled accessible components
3. **Class Variance Authority (CVA)** - Component variants
4. **clsx** / **cn()** - Class name merging

### Useful Resources

- [Tailwind UI](https://tailwindui.com/) - Official templates (paid)
- [Headless UI](https://headlessui.com/) - Unstyled components
- [Tailwind Components](https://tailwindcomponents.com/) - Community templates
- [Flowbite](https://flowbite.com/) - Open-source components

---

## Next Steps

1. **Read [Layout Templates](./02-layout-templates.md)** - Learn structural
   patterns
2. **Read [Component Templates](./03-component-templates.md)** - Build reusable
   sections
3. **Read [Page Templates](./04-page-templates.md)** - Complete page examples
4. **Review [tailwind.config.ts](../../tailwind.config.ts)** - Understand design
   tokens

---

## Quick Start

```tsx
// 1. Import template
import { Hero } from '@/templates/sections/Hero';

// 2. Use with your content
<Hero
  title="Welcome to your app"
  description="Build amazing products faster"
  ctaText="Get Started"
  ctaHref="/signup"
  imageUrl="/hero-image.jpg"
/>

// 3. Customize with design tokens
<Hero
  className="bg-gradient-to-r from-brand-500 to-brand-700"
  titleClassName="text-5xl md:text-6xl"
/>
```

---

**Next:** [Layout Templates →](./02-layout-templates.md)
