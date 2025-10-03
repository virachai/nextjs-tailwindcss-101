# Tailwind CSS Theme Setup & Configuration Guide

> Complete guide to setting up and configuring Tailwind CSS 4 with Next.js 15, TypeScript, and professional development tools following Airbnb-level standards.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Theme Configuration](#theme-configuration)
- [Development Tools](#development-tools)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

This is a modern Next.js 15 application configured with:
- **Framework:** Next.js 15.5 with App Router
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4 (CSS-first configuration)
- **Bundler:** Turbopack (Next.js experimental)
- **Package Manager:** pnpm
- **Code Quality:** ESLint (Airbnb config) + Prettier
- **Fonts:** Geist Sans & Geist Mono (via next/font)

---

## Technology Stack

### Core Dependencies

```json
{
  "next": "15.5.4",           // React framework
  "react": "19.1.0",          // UI library
  "react-dom": "19.1.0"       // React DOM renderer
}
```

### Styling

```json
{
  "tailwindcss": "^4",                // CSS framework
  "@tailwindcss/postcss": "^4"        // PostCSS plugin
}
```

**Key Feature:** Tailwind CSS v4 uses CSS-first configuration via `@theme inline` directive instead of traditional JS config exports.

### Development Tools

```json
{
  "typescript": "^5",

  // ESLint (Airbnb configuration)
  "eslint": "^8.57.1",
  "eslint-config-airbnb": "^19.0.4",
  "eslint-config-airbnb-typescript": "^18.0.0",
  "eslint-plugin-import": "^2.32.0",
  "eslint-plugin-jsx-a11y": "^6.10.2",
  "eslint-plugin-react": "^7.37.5",
  "eslint-plugin-react-hooks": "^6.1.0",

  // Prettier
  "prettier": "^3.6.2",
  "@trivago/prettier-plugin-sort-imports": "^5.2.2",
  "prettier-plugin-tailwindcss": "^0.6.14",

  // Integration
  "eslint-config-prettier": "^10.1.8",
  "eslint-plugin-prettier": "^5.5.4"
}
```

---

## Installation & Setup

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd nextjs-tailwindcss-101

# Install dependencies (pnpm recommended)
pnpm install

# Or with npm
npm install

# Or with yarn
yarn install
```

### 2. Project Structure

```
nextjs-tailwindcss-101/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Tailwind CSS imports + theme
│   └── components/             # React components (to be created)
├── docs/
│   ├── templates/              # Template documentation
│   ├── tailwindcss/            # Tailwind guides
│   └── design-system/          # Design system docs
├── public/                     # Static assets
├── .eslintrc.json             # ESLint configuration
├── prettier.config.mjs        # Prettier configuration
├── tailwind.config.ts         # Tailwind theme config
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js configuration
├── postcss.config.mjs         # PostCSS configuration
└── package.json               # Dependencies & scripts
```

### 3. Development Commands

```bash
# Start development server (http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint              # Check for errors
pnpm lint:fix          # Auto-fix issues

# Formatting
pnpm format            # Format all files
pnpm format:check      # Check formatting

# Type checking
pnpm type-check        # TypeScript validation
```

---

## Theme Configuration

### 1. Tailwind Config ([tailwind.config.ts](../../tailwind.config.ts))

The theme is configured in TypeScript with comprehensive design tokens:

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors (11 shades)
        brand: { 50: '#f0f9ff', ..., 950: '#082f49' },

        // Semantic colors
        success: { 50: '#f0fdf4', 500: '#22c55e', ... },
        warning: { 50: '#fffbeb', 500: '#f59e0b', ... },
        error: { 50: '#fef2f2', 500: '#ef4444', ... },
        info: { 50: '#eff6ff', 500: '#3b82f6', ... },

        // Neutral scale
        neutral: { 50: '#fafafa', ..., 950: '#0a0a0a' },
      },
      spacing: {
        '4.5': '1.125rem',  // 18px
        '13': '3.25rem',    // 52px
        // Custom spacing values
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        // Typography scale with line heights
      },
      // ... more theme tokens
    },
  },
  plugins: [],
} satisfies Config;
```

**Key Features:**
- **Color System:** Brand, semantic (success/warning/error/info), and neutral colors
- **Spacing:** 4px-based system with custom values
- **Typography:** Complete scale from 2xs to 9xl with line heights
- **Shadows:** 7-level elevation system
- **Animations:** Fade, slide, scale, pulse, spin, bounce
- **Z-Index:** Semantic layers (dropdown, sticky, modal, tooltip, etc.)

### 2. Global CSS ([src/app/globals.css](../../src/app/globals.css:1))

Tailwind v4 uses CSS-first configuration:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

**Key Features:**
- `@import "tailwindcss"` - Imports Tailwind v4 base
- `@theme inline` - Maps CSS variables to Tailwind tokens
- Automatic dark mode via `prefers-color-scheme`
- Font variables linked to Geist fonts

### 3. Font Configuration ([src/app/layout.tsx](../../src/app/layout.tsx))

Uses next/font for optimized Google Fonts:

```typescript
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

**Benefits:**
- Automatic font optimization
- Self-hosted fonts (no external requests)
- CSS variables for easy theme integration
- Antialiasing for crisp text rendering

### 4. PostCSS Configuration ([postcss.config.mjs](../../postcss.config.mjs))

Minimal config for Tailwind v4:

```javascript
export default {
  plugins: ["@tailwindcss/postcss"],
};
```

---

## Development Tools

### 1. TypeScript Configuration ([tsconfig.json](../../tsconfig.json))

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]  // Path alias for imports
    }
  }
}
```

**Usage:**
```typescript
// Instead of: import { Button } from '../../../components/Button'
import { Button } from '@/components/Button';
```

### 2. ESLint Configuration ([.eslintrc.json](../../.eslintrc.json))

Professional-grade linting with Airbnb standards:

```json
{
  "extends": [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/function-component-definition": ["error", {
      "namedComponents": "arrow-function"
    }],
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_"
    }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**Features:**
- Airbnb JavaScript/React style guide
- TypeScript-specific rules
- Import organization validation
- Accessibility checks (jsx-a11y)
- React Hooks rules enforcement
- Prettier integration

### 3. Prettier Configuration ([prettier.config.mjs](../../prettier.config.mjs))

Automatic code formatting with import sorting and Tailwind class ordering:

```javascript
export default {
  // Code style
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',

  // Plugins
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ],

  // Import sorting
  importOrder: [
    '^react$',
    '^next/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@/types/(.*)$',
    '^@/components/(.*)$',
    '^[./]'
  ],
  importOrderSeparation: true,

  // Tailwind class sorting
  tailwindConfig: './tailwind.config.ts',
  tailwindFunctions: ['clsx', 'cn', 'twMerge'],
};
```

**Benefits:**
- Automatic import organization (React → Next → 3rd party → @/ aliases → relative)
- Tailwind classes sorted in recommended order
- Consistent code style across team
- Integrates with ESLint

### 4. Next.js Configuration ([next.config.ts](../../next.config.ts))

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

**Development:**
- Turbopack bundler (experimental, faster than Webpack)
- Enabled via `--turbopack` flag in scripts

---

## Best Practices

### 1. Component Organization

```
src/components/
├── ui/              # Basic UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── forms/           # Form components
├── layouts/         # Layout components
└── features/        # Feature-specific components
```

### 2. Import Order (Auto-sorted by Prettier)

```typescript
// 1. React
import React from 'react';

// 2. Next.js
import type { Metadata } from 'next';
import Image from 'next/image';

// 3. Third-party
import clsx from 'clsx';

// 4. Internal (@/ aliases by category)
import type { User } from '@/types/user';
import { Button } from '@/components/ui/Button';

// 5. Relative imports
import { helper } from './helper';
import styles from './styles.module.css';
```

### 3. Component Structure

```typescript
import type { FC } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({ variant = 'primary', children }) => {
  return (
    <button
      className={clsx(
        'rounded-lg px-4 py-2 font-medium transition-colors',
        variant === 'primary' && 'bg-brand-500 text-white hover:bg-brand-600',
        variant === 'secondary' && 'border border-neutral-300 hover:bg-neutral-50'
      )}
    >
      {children}
    </button>
  );
};
```

**Key Points:**
- Arrow function components (Airbnb standard)
- Typed props with interfaces
- Use `clsx` for conditional classes
- Tailwind classes auto-sorted by Prettier

### 4. File Naming Conventions

```
PascalCase.tsx     # Components
camelCase.ts       # Utilities, hooks, services
kebab-case.css     # Stylesheets
UPPERCASE.md       # Documentation (README, CHANGELOG)
```

### 5. Tailwind Usage

```typescript
// ✅ Good - Use theme tokens
<div className="bg-brand-500 text-white p-4 rounded-lg">

// ❌ Bad - Avoid arbitrary values
<div className="bg-[#0ea5e9] text-[#fff] p-[16px] rounded-[8px]">

// ✅ Good - Dark mode support
<div className="bg-white dark:bg-neutral-900">

// ✅ Good - Responsive design (mobile-first)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// ✅ Good - Use semantic colors
<button className="bg-error-500 hover:bg-error-600">Delete</button>
```

### 6. Accessibility Standards

```typescript
// ✅ Good - Semantic HTML
<button onClick={handleClick}>Click me</button>

// ❌ Bad - Non-semantic
<div onClick={handleClick}>Click me</div>

// ✅ Good - ARIA labels for icons
<button aria-label="Close menu">
  <IconX className="h-5 w-5" />
</button>

// ✅ Good - Focus states
<button className="focus:outline-none focus:ring-2 focus:ring-brand-500">
  Action
</button>
```

### 7. Performance Optimization

```typescript
// Use next/image for optimized images
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>

// Use next/font for optimized fonts (already configured)
// Use CSS transforms for animations (GPU-accelerated)
<div className="transition-transform hover:scale-105">
```

---

## Troubleshooting

### Issue: Tailwind classes not applying

**Solution:**
1. Check content paths in [tailwind.config.ts](../../tailwind.config.ts:4)
2. Ensure files are in `src/app/**` or `src/components/**`
3. Restart dev server: `pnpm dev`

### Issue: Import sorting not working

**Solution:**
1. Check Prettier plugin: `@trivago/prettier-plugin-sort-imports`
2. Verify [prettier.config.mjs](../../prettier.config.mjs) has correct plugin order
3. Run manually: `pnpm format`

### Issue: ESLint errors in IDE

**Solution:**
1. Install VSCode extensions: ESLint, Prettier
2. Add to `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Issue: Type errors from Next.js

**Solution:**
1. Run type check: `pnpm type-check`
2. Check [tsconfig.json](../../tsconfig.json) paths
3. Restart TypeScript server in IDE

### Issue: Turbopack build errors

**Solution:**
1. Clear cache: `rm -rf .next`
2. Reinstall: `pnpm install`
3. If persistent, use Webpack: remove `--turbopack` flag

### Issue: Dark mode not working

**Solution:**
1. Check `darkMode: 'class'` in [tailwind.config.ts](../../tailwind.config.ts:5)
2. Toggle with `<html class="dark">` in [layout.tsx](../../src/app/layout.tsx)
3. Or use `prefers-color-scheme` (automatic, already configured)

---

## Quick Start Checklist

- [ ] Clone repository
- [ ] Run `pnpm install`
- [ ] Start dev server: `pnpm dev`
- [ ] Install VSCode extensions (ESLint, Prettier, Tailwind IntelliSense)
- [ ] Configure editor settings for auto-format
- [ ] Review [tailwind.config.ts](../../tailwind.config.ts) theme tokens
- [ ] Read [README.md](README.md) for component templates
- [ ] Follow import order and naming conventions
- [ ] Run `pnpm lint` before committing
- [ ] Run `pnpm format` before committing

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
- [Tailwind CSS v4](https://tailwindcss.com/docs) - Styling framework
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Language guide
- [Airbnb Style Guide](https://airbnb.io/javascript/react/) - React best practices

### Internal Guides
- [Component Templates](README.md) - UI component patterns
- [Tailwind Fundamentals](../tailwindcss/01-fundamentals.md) - Tailwind basics
- [Design System](../design-system/01-overview.md) - Design token system
- [Prettier Setup](../prettier-setup.md) - Formatting configuration
- [ESLint Setup](../eslint-setup.md) - Linting configuration

### Tools
- [Tailwind IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VSCode extension
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatter
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Linter

---

**Version:** 1.0.0
**Last Updated:** 2025-10-03
**Maintained by:** Frontend Team
