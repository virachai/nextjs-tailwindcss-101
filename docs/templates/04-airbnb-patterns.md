# Airbnb-Level UI Patterns & Consistency Guide

> Professional frontend development patterns inspired by Airbnb's design system for building scalable, consistent, and maintainable user interfaces.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Consistency Principles](#consistency-principles)
- [Advanced Component Patterns](#advanced-component-patterns)
- [Real-World Examples](#real-world-examples)
- [Quality Standards](#quality-standards)

---

## Design Philosophy

### Core Principles

1. **Consistency Over Creativity** - Reuse patterns before creating new ones
2. **Accessibility First** - Every component must be keyboard and screen-reader friendly
3. **Progressive Enhancement** - Start with semantic HTML, enhance with CSS/JS
4. **Mobile-First Responsive** - Design for smallest screen, scale up
5. **Performance Conscious** - Optimize for Core Web Vitals
6. **Design Tokens** - Use theme values, never magic numbers

---

## Consistency Principles

### 1. Visual Hierarchy

**Spacing Rhythm (8px base)**
```typescript
// Micro spacing (within components)
const spacing = {
  xs: 'space-x-1',   // 4px - Icon + text
  sm: 'space-x-2',   // 8px - Related items
  md: 'space-x-4',   // 16px - Component sections
  lg: 'space-x-6',   // 24px - Major sections
  xl: 'space-x-8',   // 32px - Page sections
};

// Example: Card with consistent spacing
<div className="space-y-6 rounded-2xl bg-white p-6 shadow-md">
  <h2 className="text-2xl font-semibold">Title</h2>
  <div className="space-y-4">
    <p className="text-neutral-600">Description</p>
    <div className="flex gap-2">
      <button>Primary</button>
      <button>Secondary</button>
    </div>
  </div>
</div>
```

**Typography Hierarchy**
```typescript
// Consistent type scale
const typography = {
  hero: 'text-6xl font-bold leading-tight',        // Hero sections
  h1: 'text-4xl font-bold',                        // Page titles
  h2: 'text-3xl font-semibold',                    // Section headers
  h3: 'text-2xl font-semibold',                    // Subsections
  h4: 'text-xl font-medium',                       // Card titles
  body: 'text-base text-neutral-700',              // Body text
  small: 'text-sm text-neutral-600',               // Captions
  xs: 'text-xs text-neutral-500',                  // Meta info
};

// Usage
<article className="space-y-4">
  <h1 className="text-4xl font-bold">Article Title</h1>
  <p className="text-sm text-neutral-500">Published 2 hours ago</p>
  <p className="text-base text-neutral-700">Article content...</p>
</article>
```

### 2. Color Consistency

**State-Based Colors**
```typescript
// Interactive states for buttons
const buttonStates = {
  default: 'bg-brand-500 text-white',
  hover: 'hover:bg-brand-600',
  active: 'active:bg-brand-700',
  focus: 'focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
  disabled: 'disabled:bg-neutral-300 disabled:cursor-not-allowed',
};

// Usage
<button
  className={clsx(
    'rounded-lg px-4 py-2 font-medium transition-all duration-200',
    'bg-brand-500 text-white',
    'hover:bg-brand-600',
    'active:bg-brand-700',
    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
    'disabled:bg-neutral-300 disabled:cursor-not-allowed'
  )}
  disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

**Semantic Feedback Colors**
```typescript
// Alert/notification colors
const feedback = {
  success: {
    bg: 'bg-success-50 dark:bg-success-900/20',
    border: 'border-l-4 border-success-500',
    text: 'text-success-700 dark:text-success-400',
    icon: 'text-success-500',
  },
  warning: {
    bg: 'bg-warning-50 dark:bg-warning-900/20',
    border: 'border-l-4 border-warning-500',
    text: 'text-warning-700 dark:text-warning-400',
    icon: 'text-warning-500',
  },
  error: {
    bg: 'bg-error-50 dark:bg-error-900/20',
    border: 'border-l-4 border-error-500',
    text: 'text-error-700 dark:text-error-400',
    icon: 'text-error-500',
  },
  info: {
    bg: 'bg-info-50 dark:bg-info-900/20',
    border: 'border-l-4 border-info-500',
    text: 'text-info-700 dark:text-info-400',
    icon: 'text-info-500',
  },
};
```

### 3. Component Sizing

**Consistent Heights (Touch-Friendly)**
```typescript
const componentHeights = {
  xs: 'h-8',   // 32px - Compact UI
  sm: 'h-10',  // 40px - Default buttons
  md: 'h-12',  // 48px - Input fields
  lg: 'h-14',  // 56px - Large CTAs
  xl: 'h-16',  // 64px - Hero CTAs
};

// Button sizes
export const Button = ({ size = 'md', children }) => (
  <button
    className={clsx(
      'rounded-lg px-4 font-medium transition-colors',
      size === 'sm' && 'h-10 text-sm',
      size === 'md' && 'h-12 text-base',
      size === 'lg' && 'h-14 text-lg'
    )}
  >
    {children}
  </button>
);
```

---

## Advanced Component Patterns

### 1. Compound Components

**Tabs Component (Airbnb-style)**
```typescript
import type { FC, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

// Context for tab state
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('useTabs must be used within Tabs');
  return context;
};

// Main component
interface TabsProps {
  defaultTab: string;
  children: ReactNode;
}

export const Tabs: FC<TabsProps> = ({ defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="space-y-4">{children}</div>
    </TabsContext.Provider>
  );
};

// Tab list
interface TabListProps {
  children: ReactNode;
}

const TabList: FC<TabListProps> = ({ children }) => (
  <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
    {children}
  </div>
);

// Individual tab
interface TabProps {
  value: string;
  children: ReactNode;
}

const Tab: FC<TabProps> = ({ value, children }) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={clsx(
        'relative px-4 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'text-brand-500'
          : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
      )}
    </button>
  );
};

// Panel
interface TabPanelProps {
  value: string;
  children: ReactNode;
}

const TabPanel: FC<TabPanelProps> = ({ value, children }) => {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;

  return <div className="animate-fadeIn">{children}</div>;
};

// Exports
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage
<Tabs defaultTab="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="details">Details</Tabs.Tab>
    <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="details">Details content</Tabs.Panel>
  <Tabs.Panel value="reviews">Reviews content</Tabs.Panel>
</Tabs>
```

### 2. Property Card (Airbnb-Inspired)

```typescript
import type { FC } from 'react';
import Image from 'next/image';
import { HeartIcon, StarIcon } from '@/components/icons';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

export const PropertyCard: FC<PropertyCardProps> = ({
  id,
  title,
  location,
  price,
  rating,
  reviewCount,
  images,
  isFavorite = false,
  onFavoriteToggle,
}) => {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl transition-shadow hover:shadow-xl">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.(id);
          }}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon
            className={clsx(
              'h-5 w-5 transition-colors',
              isFavorite ? 'fill-error-500 text-error-500' : 'text-neutral-700'
            )}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="space-y-2 p-4">
        {/* Location & Rating */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <h3 className="truncate font-semibold text-neutral-900 dark:text-neutral-50">
              {title}
            </h3>
            <p className="truncate text-sm text-neutral-600 dark:text-neutral-400">
              {location}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <StarIcon className="h-4 w-4 fill-neutral-900 dark:fill-neutral-50" />
            <span className="text-sm font-medium">{rating.toFixed(2)}</span>
            <span className="text-sm text-neutral-500">({reviewCount})</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2">
          <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            ${price.toLocaleString()}
          </span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400"> / night</span>
        </div>
      </div>
    </article>
  );
};
```

### 3. Search Bar (Airbnb-Style)

```typescript
import type { FC } from 'react';
import { SearchIcon, MapPinIcon, CalendarIcon, UsersIcon } from '@/components/icons';

interface SearchBarProps {
  onSearch?: (query: SearchQuery) => void;
}

interface SearchQuery {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center overflow-hidden rounded-full border border-neutral-200 bg-white shadow-lg transition-shadow hover:shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
        {/* Location */}
        <div className="flex flex-1 items-center gap-3 border-r border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <MapPinIcon className="h-5 w-5 text-neutral-400" />
          <div className="flex-1">
            <label htmlFor="location" className="block text-xs font-semibold">
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Where are you going?"
              className="w-full border-none bg-transparent p-0 text-sm placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex flex-1 items-center gap-3 border-r border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <CalendarIcon className="h-5 w-5 text-neutral-400" />
          <div className="flex-1">
            <label htmlFor="check-in" className="block text-xs font-semibold">
              Check in
            </label>
            <input
              id="check-in"
              type="date"
              className="w-full border-none bg-transparent p-0 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="flex flex-1 items-center gap-3 border-r border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <CalendarIcon className="h-5 w-5 text-neutral-400" />
          <div className="flex-1">
            <label htmlFor="check-out" className="block text-xs font-semibold">
              Check out
            </label>
            <input
              id="check-out"
              type="date"
              className="w-full border-none bg-transparent p-0 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex flex-1 items-center gap-3 px-6 py-4">
          <UsersIcon className="h-5 w-5 text-neutral-400" />
          <div className="flex-1">
            <label htmlFor="guests" className="block text-xs font-semibold">
              Guests
            </label>
            <input
              id="guests"
              type="number"
              min="1"
              placeholder="Add guests"
              className="w-full border-none bg-transparent p-0 text-sm placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          className="m-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
```

### 4. Rating System

```typescript
import type { FC } from 'react';
import { StarIcon } from '@/components/icons';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const Rating: FC<RatingProps> = ({
  rating,
  reviewCount,
  size = 'md',
  showNumber = true,
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-2">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={clsx(
              sizeClasses[size],
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-neutral-200 text-neutral-200 dark:fill-neutral-700 dark:text-neutral-700'
            )}
          />
        ))}
      </div>

      {/* Rating Number */}
      {showNumber && (
        <div className={clsx('flex items-center gap-1', textSizeClasses[size])}>
          <span className="font-semibold text-neutral-900 dark:text-neutral-50">
            {rating.toFixed(1)}
          </span>
          {reviewCount !== undefined && (
            <span className="text-neutral-500">({reviewCount.toLocaleString()})</span>
          )}
        </div>
      )}
    </div>
  );
};
```

### 5. Filter Panel

```typescript
import type { FC } from 'react';
import { useState } from 'react';

interface FilterPanelProps {
  onFilterChange?: (filters: Filters) => void;
}

interface Filters {
  priceRange: [number, number];
  propertyType: string[];
  amenities: string[];
}

export const FilterPanel: FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const propertyTypes = ['Entire place', 'Private room', 'Shared room'];
  const amenities = ['WiFi', 'Kitchen', 'Parking', 'Pool', 'Gym', 'Pet-friendly'];

  return (
    <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-medium">Price range</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-brand-500"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              ${priceRange[0]}
            </span>
            <span className="text-neutral-600 dark:text-neutral-400">
              ${priceRange[1]}+
            </span>
          </div>
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-4">
        <h3 className="font-medium">Property type</h3>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label key={type} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTypes([...selectedTypes, type]);
                  } else {
                    setSelectedTypes(selectedTypes.filter((t) => t !== type));
                  }
                }}
                className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-2 focus:ring-brand-500 dark:border-neutral-700"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="font-medium">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity) => (
            <button
              key={amenity}
              onClick={() => {
                if (selectedAmenities.includes(amenity)) {
                  setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                } else {
                  setSelectedAmenities([...selectedAmenities, amenity]);
                }
              }}
              className={clsx(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                selectedAmenities.includes(amenity)
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
              )}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <button className="w-full rounded-lg bg-brand-500 py-3 font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
        Show results
      </button>
    </div>
  );
};
```

---

## Real-World Examples

### Hero Section (Landing Page)

```typescript
export const Hero: FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950 dark:to-brand-900">
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Content */}
        <div className="space-y-8">
          <h1 className="text-5xl font-bold leading-tight text-neutral-900 dark:text-neutral-50 lg:text-6xl">
            Find your perfect
            <span className="text-brand-500"> vacation rental</span>
          </h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300">
            Discover unique homes, apartments, and experiences around the world.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-lg bg-brand-500 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:bg-brand-600 hover:shadow-xl active:scale-95">
              Start exploring
            </button>
            <button className="rounded-lg border-2 border-neutral-300 px-8 py-4 text-lg font-medium text-neutral-900 transition-all hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-800">
              Learn more
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
          <Image
            src="/hero-image.jpg"
            alt="Beautiful vacation home"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);
```

### Feature Grid

```typescript
const features = [
  {
    icon: HomeIcon,
    title: 'Verified listings',
    description: 'All properties are verified and reviewed by our team.',
  },
  {
    icon: ShieldIcon,
    title: 'Secure booking',
    description: 'Your payment information is protected with bank-level security.',
  },
  {
    icon: SupportIcon,
    title: '24/7 Support',
    description: 'Get help anytime with our dedicated customer support.',
  },
  {
    icon: StarIcon,
    title: 'Best prices',
    description: 'Find the best deals and exclusive offers on thousands of homes.',
  },
];

export const Features: FC = () => (
  <section className="bg-white py-24 dark:bg-neutral-900">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          Why choose us
        </h2>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Everything you need for the perfect vacation
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/30">
              <Icon className="h-8 w-8 text-brand-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              {title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
```

---

## Quality Standards

### 1. Code Review Checklist

**Component Quality**
- [ ] Uses TypeScript with proper interfaces
- [ ] Arrow function components (Airbnb standard)
- [ ] Proper prop destructuring
- [ ] Default prop values defined
- [ ] No inline styles (use Tailwind classes)
- [ ] Responsive design (mobile-first)
- [ ] Dark mode support
- [ ] Accessibility attributes (ARIA, labels)
- [ ] Keyboard navigation support
- [ ] Focus states visible

**Performance**
- [ ] Images use Next.js `<Image>` component
- [ ] No unnecessary re-renders (memoization where needed)
- [ ] CSS animations use `transform`/`opacity`
- [ ] No layout shifts (proper dimensions)
- [ ] Lazy loading for below-fold content

**Consistency**
- [ ] Uses design tokens from [tailwind.config.ts](../../tailwind.config.ts)
- [ ] Follows spacing rhythm (4px/8px base)
- [ ] Typography scale respected
- [ ] Color usage follows semantic patterns
- [ ] Component sizing consistent

### 2. Testing Checklist

**Manual Testing**
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1440px width)
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test keyboard navigation (Tab, Enter, Esc)
- [ ] Test screen reader (VoiceOver/NVDA)
- [ ] Test with reduced motion preference
- [ ] Test loading states
- [ ] Test error states

### 3. Performance Metrics

**Core Web Vitals Targets**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Optimization Techniques**
```typescript
// Image optimization
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={isAboveFold}
  loading={isAboveFold ? 'eager' : 'lazy'}
/>

// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // If client-only
});

// Memoization for expensive computations
const sortedItems = useMemo(
  () => items.sort((a, b) => a.price - b.price),
  [items]
);
```

---

## Resources

### Design Inspiration
- [Airbnb Design](https://airbnb.design/) - Official design blog
- [Dribbble - Airbnb](https://dribbble.com/tags/airbnb) - Community designs
- [Behance - Booking Platforms](https://www.behance.net/search/projects?search=booking%20platform)

### Technical References
- [Tailwind Config](../../tailwind.config.ts) - Theme configuration
- [Component Templates](README.md) - Basic component library
- [Setup Guide](00-setup-guide.md) - Project configuration
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Tools
- [clsx](https://github.com/lukeed/clsx) - Conditional class names
- [React Hook Form](https://react-hook-form.com/) - Form management
- [Zod](https://zod.dev/) - Schema validation
- [Radix UI](https://www.radix-ui.com/) - Unstyled accessible components

---

**Version:** 1.0.0
**Last Updated:** 2025-10-03
**Focus:** Airbnb-level consistency and professional patterns
