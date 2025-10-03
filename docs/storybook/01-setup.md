# Storybook Setup for Next.js

Complete guide to setting up Storybook in a Next.js 15 + React 19 + TypeScript + Tailwind CSS project.

## Table of Contents

- [What is Storybook?](#what-is-storybook)
- [Why Use Storybook?](#why-use-storybook)
- [Installation](#installation)
- [Configuration](#configuration)
- [Integration with Next.js](#integration-with-nextjs)
- [Tailwind CSS Setup](#tailwind-css-setup)
- [TypeScript Configuration](#typescript-configuration)
- [First Story](#first-story)
- [Running Storybook](#running-storybook)

## What is Storybook?

Storybook is an **open-source tool for building UI components in isolation**. It allows you to:
- Develop components independently
- Document component APIs
- Test different states and props
- Share components with team
- Build a component library

### Storybook vs Development Environment

```
Regular Development          Storybook Development
├─ Full app context         ├─ Isolated components
├─ Complex state            ├─ Controlled props
├─ API dependencies         ├─ Mocked data
├─ Hard to test edge cases  ├─ Easy to test all states
└─ Slow feedback loop       └─ Instant feedback
```

## Why Use Storybook?

### For Developers

**Faster Development**
- Build components in isolation
- No need to navigate through the app
- Test all component states instantly
- Hot module reloading

**Better Testing**
- Visual regression testing
- Accessibility testing
- Interaction testing
- Test all edge cases

**Documentation**
- Auto-generated docs
- Interactive playground
- Living style guide
- Shareable component library

### For Teams

**Design-Dev Collaboration**
- Designers can review components
- Test components before integration
- Consistent component library
- Reduce back-and-forth

**Quality Assurance**
- QA can test components in isolation
- Check all states and variants
- Visual regression testing
- Accessibility audits

### Real-World Usage

Companies using Storybook:
- **Airbnb** - Design Language System
- **GitHub** - Primer Design System
- **Microsoft** - Fluent UI
- **Shopify** - Polaris
- **Uber** - Base Web
- **Atlassian** - Atlassian Design System

## Installation

### Step 1: Install Storybook

```bash
# Automatic installation (recommended)
pnpm dlx storybook@latest init

# This will:
# 1. Detect your project type (Next.js)
# 2. Install dependencies
# 3. Create configuration files
# 4. Add sample stories
```

### Step 2: Install Additional Addons

```bash
# Essential addons
pnpm add -D @storybook/addon-a11y         # Accessibility testing
pnpm add -D @storybook/addon-interactions # Interaction testing
pnpm add -D @storybook/addon-coverage     # Code coverage

# Optional but useful
pnpm add -D @storybook/addon-themes       # Theme switching
pnpm add -D storybook-dark-mode           # Dark mode toggle
```

### Package Versions

```json
{
  "devDependencies": {
    "@storybook/addon-a11y": "^8.0.0",
    "@storybook/addon-essentials": "^8.0.0",
    "@storybook/addon-interactions": "^8.0.0",
    "@storybook/addon-links": "^8.0.0",
    "@storybook/addon-onboarding": "^8.0.0",
    "@storybook/blocks": "^8.0.0",
    "@storybook/nextjs": "^8.0.0",
    "@storybook/react": "^8.0.0",
    "@storybook/test": "^8.0.0",
    "storybook": "^8.0.0"
  }
}
```

## Configuration

### File Structure

```
project/
├── .storybook/
│   ├── main.ts              # Storybook configuration
│   ├── preview.tsx          # Global decorators & parameters
│   └── manager.ts           # UI customization (optional)
│
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx  # Stories for Button
│   │   │   └── Button.test.tsx
│   │   └── ...
│   └── stories/             # Example stories (can delete)
│
└── package.json
```

### Main Configuration (.storybook/main.ts)

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  // Story files location
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  // Addons
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],

  // Framework
  framework: {
    name: '@storybook/nextjs',
    options: {
      // Next.js options
      nextConfigPath: path.resolve(__dirname, '../next.config.mjs'),
    },
  },

  // Static files
  staticDirs: ['../public'],

  // TypeScript
  typescript: {
    check: false, // Disable type checking for faster builds
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },

  // Docs
  docs: {
    autodocs: 'tag', // Auto-generate docs for components with 'autodocs' tag
  },

  // Core
  core: {
    disableTelemetry: true, // Disable telemetry
  },
};

export default config;
```

### Preview Configuration (.storybook/preview.tsx)

```tsx
// .storybook/preview.tsx
import type { Preview } from '@storybook/react';
import '../src/app/globals.css'; // Import your global styles

const preview: Preview = {
  // Global parameters
  parameters: {
    // Controls
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true, // Expand controls panel by default
    },

    // Actions
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Backgrounds
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
        {
          name: 'gray',
          value: '#f7f7f7',
        },
      ],
    },

    // Viewport
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },

    // Layout
    layout: 'centered', // Center stories by default
  },

  // Global decorators
  decorators: [
    (Story) => (
      <div className="font-sans antialiased">
        <Story />
      </div>
    ),
  ],

  // Tags
  tags: ['autodocs'], // Enable autodocs globally
};

export default preview;
```

## Integration with Next.js

### Next.js Image Component

```typescript
// .storybook/preview.tsx
import * as NextImage from 'next/image';

// Mock Next.js Image component
const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: any) => <OriginalNextImage {...props} unoptimized />,
});
```

### Next.js Router

```tsx
// .storybook/preview.tsx
import { RouterContext } from 'next/dist/shared/lib/router-context';

// Mock Next.js router
const mockRouter = {
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  reload: () => {},
  back: () => {},
  prefetch: () => Promise.resolve(),
  beforePopState: () => {},
  events: {
    on: () => {},
    off: () => {},
    emit: () => {},
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
};

// Add router decorator
export const decorators = [
  (Story) => (
    <RouterContext.Provider value={mockRouter}>
      <Story />
    </RouterContext.Provider>
  ),
];
```

### Next.js Font

```tsx
// Mock Geist fonts in stories
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Add to preview decorator
export const decorators = [
  (Story) => (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      <Story />
    </div>
  ),
];
```

## Tailwind CSS Setup

### PostCSS Configuration

Storybook automatically uses your existing Tailwind config. No additional setup needed!

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  // This automatically picks up your tailwind.config.ts
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
};
```

### Import Global Styles

```tsx
// .storybook/preview.tsx
import '../src/app/globals.css'; // Contains @import "tailwindcss";

const preview: Preview = {
  // Your preview config
};
```

### Dark Mode Support

```bash
# Install dark mode addon
pnpm add -D storybook-dark-mode
```

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  addons: [
    // ... other addons
    'storybook-dark-mode',
  ],
};
```

```tsx
// .storybook/preview.tsx
import { themes } from '@storybook/theming';

const preview: Preview = {
  parameters: {
    darkMode: {
      // Dark mode configuration
      dark: { ...themes.dark },
      light: { ...themes.normal },
      darkClass: 'dark',
      lightClass: 'light',
      stylePreview: true,
    },
  },
};
```

## TypeScript Configuration

### TypeScript Setup

Storybook works with your existing `tsconfig.json`. Ensure paths are configured:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Story TypeScript Support

```typescript
// Use Meta and StoryObj types for type safety
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};
```

## First Story

### Create a Button Component

```tsx
// src/components/Button/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
        secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        ghost: 'hover:bg-gray-100 text-gray-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

### Create Button Stories

```tsx
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary variant
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// Secondary variant
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// Ghost variant
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// With Icon
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Item
      </>
    ),
  },
};

// All variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

// All sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
```

## Running Storybook

### Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "storybook:serve": "pnpm build-storybook && npx http-server storybook-static"
  }
}
```

### Development

```bash
# Start Storybook development server
pnpm storybook

# Storybook will be available at:
# http://localhost:6006
```

### Production Build

```bash
# Build static Storybook
pnpm build-storybook

# Output directory: storybook-static/

# Deploy to:
# - Vercel
# - Netlify
# - GitHub Pages
# - Chromatic
```

### Deployment Example (Vercel)

```json
// vercel.json
{
  "buildCommand": "pnpm build-storybook",
  "outputDirectory": "storybook-static"
}
```

## Useful Addons

### Installed by Default

- **@storybook/addon-essentials** - Controls, Actions, Docs, Viewport, etc.
- **@storybook/addon-links** - Link between stories

### Recommended Additional Addons

```bash
# Accessibility testing
pnpm add -D @storybook/addon-a11y

# Interaction testing
pnpm add -D @storybook/addon-interactions

# Design tokens
pnpm add -D @storybook/addon-designs

# Mock API requests
pnpm add -D msw-storybook-addon

# Performance monitoring
pnpm add -D @storybook/addon-performance
```

## Troubleshooting

### Common Issues

**1. Tailwind classes not working**
```tsx
// Make sure you import globals.css in preview.tsx
import '../src/app/globals.css';
```

**2. Next.js Image not working**
```tsx
// Add unoptimized prop in preview.tsx
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: any) => <OriginalNextImage {...props} unoptimized />,
});
```

**3. Fonts not loading**
```tsx
// Import fonts in preview.tsx and add to decorator
import { Geist } from 'next/font/google';
```

**4. TypeScript errors**
```bash
# Regenerate Storybook types
pnpm storybook --no-manager-cache
```

## Next Steps

- [Best Practices](./02-best-practices.md) - Learn how to write effective stories
- [Patterns](./03-patterns.md) - Advanced patterns and techniques
- Write your first story
- Explore the Storybook UI
- Set up visual regression testing

## Resources

- [Storybook for Next.js](https://storybook.js.org/docs/get-started/nextjs)
- [Storybook Addons](https://storybook.js.org/addons)
- [Chromatic](https://www.chromatic.com/) - Visual testing platform
