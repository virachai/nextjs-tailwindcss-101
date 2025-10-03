# Tailwind CSS Advanced Techniques

Advanced patterns and techniques used by senior frontend developers at top tech
companies.

## Table of Contents

- [Custom Utilities](#custom-utilities)
- [Dynamic Classes](#dynamic-classes)
- [Animation Patterns](#animation-patterns)
- [Pseudo-Classes & Pseudo-Elements](#pseudo-classes--pseudo-elements)
- [Group & Peer Modifiers](#group--peer-modifiers)
- [Custom Variants](#custom-variants)
- [Performance Optimization](#performance-optimization)
- [Advanced Composition](#advanced-composition)
- [Production Patterns](#production-patterns)

## Custom Utilities

### Extending Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      // Custom colors
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        accent: '#f59e0b',
      },

      // Custom spacing
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },

      // Custom fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },

      // Custom breakpoints
      screens: {
        '3xl': '1600px',
      },

      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Using Custom Values

```tsx
// Use extended values
<div className="bg-brand-500 text-brand-50">
  Brand colors
</div>

<div className="font-display text-4xl">
  Display font
</div>

<div className="animate-fade-in">
  Fade in animation
</div>

<div className="3xl:text-6xl">
  Extra large breakpoint
</div>
```

### Plugin for Custom Utilities

```typescript
// tailwind.config.ts
import plugin from 'tailwindcss/plugin';

const config: Config = {
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
      });
    }),
  ],
};

// Usage
<div className="scrollbar-hide overflow-auto">
  {/* Hidden scrollbar */}
</div>

<h1 className="text-balance">
  {/* Balanced text wrapping */}
</h1>
```

## Dynamic Classes

### Safe Dynamic Classes

```tsx
// ❌ Bad - won't work (Tailwind can't detect dynamic strings)
const bgColor = 'blue';
<div className={`bg-${bgColor}-500`}>

// ✅ Good - complete class names
const bgColor = isActive ? 'bg-blue-500' : 'bg-gray-500';
<div className={bgColor}>

// ✅ Better - use object mapping
const bgColors = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
};
<div className={bgColors[color]}>

// ✅ Best - safelist in config for truly dynamic values
// tailwind.config.ts
safelist: [
  'bg-blue-500',
  'bg-red-500',
  'bg-green-500',
]
```

### Dynamic with Type Safety

```tsx
// Define variants with types
const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
} as const;

type Variant = keyof typeof variants;

interface ButtonProps {
  variant: Variant;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, children }) => (
  <button className={cn('rounded px-4 py-2', variants[variant])}>{children}</button>
);
```

## Animation Patterns

### Hover Animations

```tsx
// Scale on hover
<button className="transition-transform hover:scale-105 active:scale-95">
  Hover me
</button>

// Lift effect
<div className="transition-all hover:-translate-y-1 hover:shadow-lg">
  Card with lift
</div>

// Rotate icon
<button className="group">
  Settings
  <ChevronIcon className="transition-transform group-hover:rotate-180" />
</button>

// Gradient shift
<div className="
  bg-gradient-to-r from-blue-500 to-purple-500
  transition-all duration-300
  hover:from-purple-500 hover:to-blue-500
">
  Gradient shift
</div>
```

### Loading Animations

```tsx
// Pulse
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
</div>

// Spin
<svg className="animate-spin h-5 w-5">
  {/* Spinner icon */}
</svg>

// Bounce
<div className="animate-bounce">
  ↓
</div>

// Custom loading dots
<div className="flex gap-1">
  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
</div>
```

### Entrance Animations

```tsx
// Fade in
<div className="animate-in fade-in duration-500">
  Fades in
</div>

// Slide in from bottom
<div className="animate-in slide-in-from-bottom duration-300">
  Slides up
</div>

// Combined effects
<div className="animate-in fade-in slide-in-from-bottom zoom-in duration-500">
  Multiple animations
</div>

// Stagger children
<div className="space-y-2">
  {items.map((item, i) => (
    <div
      key={item.id}
      className="animate-in fade-in slide-in-from-left"
      style={{ animationDelay: `${i * 100}ms` }}
    >
      {item.name}
    </div>
  ))}
</div>
```

### Scroll Animations

```tsx
// Sticky header with shadow
<header className="
  sticky top-0 z-50
  bg-white transition-shadow
  [&.scrolled]:shadow-md
">

// Parallax effect (with JS)
<div
  className="transition-transform"
  style={{ transform: `translateY(${scrollY * 0.5}px)` }}
>
  Parallax content
</div>

// Reveal on scroll (with Intersection Observer)
const [isVisible, setIsVisible] = useState(false);

<div className={cn(
  'transition-all duration-700',
  isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-10'
)}>
  Reveals on scroll
</div>
```

## Pseudo-Classes & Pseudo-Elements

### Interactive States

```tsx
// Hover, focus, active
<button className="
  bg-blue-600 text-white
  hover:bg-blue-700
  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  active:bg-blue-800
">
  Interactive button
</button>

// Disabled state
<button className="
  bg-blue-600 text-white
  disabled:cursor-not-allowed disabled:opacity-50
" disabled>
  Disabled button
</button>

// Focus visible (keyboard only)
<a className="
  text-blue-600
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
">
  Keyboard focus
</a>

// Visited links
<a className="text-blue-600 visited:text-purple-600">
  Visited link
</a>
```

### Form States

```tsx
// Input states
<input className="
  border border-gray-300
  focus:border-blue-500 focus:ring-1 focus:ring-blue-500
  invalid:border-red-500
  disabled:bg-gray-100
  placeholder:text-gray-400
" />

// Checkbox/Radio
<input type="checkbox" className="
  checked:bg-blue-600
  indeterminate:bg-blue-300
  focus:ring-2 focus:ring-blue-500
" />

// Required indicator
<input required className="
  required:border-red-500
" />
```

### Child Selectors

```tsx
// First, last, odd, even
<ul>
  <li className="first:rounded-t-lg">First</li>
  <li className="even:bg-gray-50">Item</li>
  <li className="odd:bg-white">Item</li>
  <li className="last:rounded-b-lg">Last</li>
</ul>

// Only child
<div className="only:text-center">
  Centered if only child
</div>

// Empty state
<div className="empty:hidden">
  Hidden when empty
</div>
```

### Pseudo-Elements

```tsx
// Before & After
<div className="
  before:content-['↗'] before:mr-1
  after:content-['←'] after:ml-1
">
  Content with arrows
</div>

// Decorative elements
<h2 className="
  relative
  before:absolute before:left-0 before:-bottom-2
  before:h-1 before:w-12 before:bg-blue-500
">
  Underlined heading
</h2>

// Quote marks
<blockquote className="
  before:content-['"'] before:text-4xl before:text-gray-400
  after:content-['"'] after:text-4xl after:text-gray-400
">
  Quote content
</blockquote>
```

## Group & Peer Modifiers

### Group Modifier

```tsx
// Parent hover affects child
<div className="group">
  <img className="group-hover:scale-110 transition-transform" />
  <p className="group-hover:text-blue-600">
    Hover the parent
  </p>
</div>

// Nested groups
<div className="group/card">
  <div className="group/button">
    <button className="group-hover/card:shadow-lg group-hover/button:bg-blue-700">
      Click me
    </button>
  </div>
</div>

// Group with states
<a className="group flex items-center gap-2">
  <span>Link text</span>
  <ArrowIcon className="
    transition-transform
    group-hover:translate-x-1
    group-focus:translate-x-1
  " />
</a>

// Card hover effects
<div className="group relative overflow-hidden">
  <img className="
    transition-all duration-300
    group-hover:scale-110 group-hover:blur-sm
  " />
  <div className="
    absolute inset-0 flex items-center justify-center
    bg-black/0 group-hover:bg-black/50
    opacity-0 group-hover:opacity-100
    transition-all
  ">
    <Button>View Details</Button>
  </div>
</div>
```

### Peer Modifier

```tsx
// Sibling selector
<div>
  <input type="checkbox" className="peer sr-only" id="toggle" />
  <label
    htmlFor="toggle"
    className="
      peer-checked:bg-blue-600
      peer-checked:text-white
      peer-focus:ring-2
    "
  >
    Toggle label
  </label>
</div>

// Form validation feedback
<div>
  <input
    type="email"
    className="peer"
    required
  />
  <p className="hidden peer-invalid:block text-red-600">
    Invalid email
  </p>
</div>

// Radio tabs
<div>
  <input type="radio" name="tab" className="peer/tab1 sr-only" id="tab1" />
  <input type="radio" name="tab" className="peer/tab2 sr-only" id="tab2" />

  <div className="flex gap-2">
    <label
      htmlFor="tab1"
      className="peer-checked/tab1:bg-blue-600 peer-checked/tab1:text-white"
    >
      Tab 1
    </label>
    <label
      htmlFor="tab2"
      className="peer-checked/tab2:bg-blue-600 peer-checked/tab2:text-white"
    >
      Tab 2
    </label>
  </div>

  <div className="hidden peer-checked/tab1:block">Tab 1 content</div>
  <div className="hidden peer-checked/tab2:block">Tab 2 content</div>
</div>
```

## Custom Variants

### Aria Variants

```tsx
// Aria states
<button className="
  aria-expanded:bg-blue-600
  aria-disabled:opacity-50
  aria-selected:font-bold
">
  ARIA button
</button>

// Aria attributes
<div className="
  aria-[current=page]:font-bold
  aria-[sort=ascending]:rotate-0
  aria-[sort=descending]:rotate-180
">
  Custom ARIA
</div>
```

### Data Attributes

```tsx
// Custom data attributes
<div
  data-state="active"
  className="
    data-[state=active]:bg-blue-600
    data-[state=inactive]:bg-gray-300
  "
>
  State-based styling
</div>

// Multiple data attributes
<button
  data-size="lg"
  data-variant="primary"
  className="
    data-[size=sm]:px-2 data-[size=sm]:py-1 data-[size=sm]:text-xs
    data-[size=md]:px-4 data-[size=md]:py-2 data-[size=md]:text-sm
    data-[size=lg]:px-6 data-[size=lg]:py-3 data-[size=lg]:text-base
    data-[variant=primary]:bg-blue-600
    data-[variant=secondary]:bg-gray-200
  "
>
  Button
</button>
```

## Performance Optimization

### Reduce Bundle Size

```typescript
// tailwind.config.ts
const config: Config = {
  // Only include colors you use
  colors: {
    transparent: 'transparent',
    current: 'currentColor',
    white: '#ffffff',
    black: '#000000',
    gray: colors.gray,
    blue: colors.blue,
    // Don't include all colors
  },

  // Purge unused styles
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
```

### Optimize Class Names

```tsx
// ❌ Bad - repetitive classes
<div className="rounded-lg bg-white p-6 shadow-md">
  <div className="rounded-lg bg-white p-6 shadow-md">{/* Duplicate styles */}</div>
</div>;

// ✅ Good - extract to component
const Card = ({ children }) => <div className="rounded-lg bg-white p-6 shadow-md">{children}</div>;

<Card>
  <Card>{/* Nested card */}</Card>
</Card>;
```

### Memoize Complex Classes

```tsx
const getButtonClasses = (variant: string, size: string) => {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium',
    variants[variant],
    sizes[size]
  );
};

// Memoize for expensive calculations
const buttonClasses = useMemo(() => getButtonClasses(variant, size), [variant, size]);

<button className={buttonClasses}>Click</button>;
```

## Advanced Composition

### Compound Components

```tsx
const Card = ({ children, ...props }) => (
  <div className="rounded-lg bg-white shadow-md" {...props}>
    {children}
  </div>
);

Card.Header = ({ children }) => (
  <div className="border-b border-gray-200 px-6 py-4">{children}</div>
);

Card.Body = ({ children }) => <div className="px-6 py-4">{children}</div>;

Card.Footer = ({ children }) => (
  <div className="border-t border-gray-200 px-6 py-4">{children}</div>
);

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>;
```

### Render Props Pattern

```tsx
const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        {typeof children === 'function' ? children({ isOpen }) : children}
      </div>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-sm whitespace-nowrap text-white">
          {content}
        </div>
      )}
    </div>
  );
};

// Usage
<Tooltip content="Click to copy">
  {({ isOpen }) => <button className={cn(isOpen && 'ring-2')}>Copy</button>}
</Tooltip>;
```

## Production Patterns

### Theme Switcher

```tsx
// Context-based theme
const ThemeContext = createContext<'light' | 'dark'>('light');

const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

// Usage
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">Theme-aware content</div>;
```

### Feature Flags with Variants

```tsx
const getFeatureClasses = (features: string[]) => {
  return cn(
    features.includes('new-design') && 'rounded-xl shadow-2xl',
    features.includes('compact-mode') && 'p-2',
    !features.includes('compact-mode') && 'p-6'
  );
};
```

### A/B Testing Variants

```tsx
const variants = {
  control: 'bg-blue-600 hover:bg-blue-700',
  variant_a: 'bg-green-600 hover:bg-green-700',
  variant_b: 'bg-purple-600 hover:bg-purple-700',
};

const Button = ({ variant = 'control', children }) => (
  <button className={cn('rounded px-4 py-2 text-white', variants[variant])}>{children}</button>
);
```

## Next Steps

- Practice building complex components
- Study production codebases (Vercel, shadcn/ui, Tailwind UI)
- Experiment with custom plugins
- Optimize for performance
- Master animation techniques

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Headless UI](https://headlessui.com/)
- [Tailwind Play](https://play.tailwindcss.com/)
