# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Next.js 15.5 + React 19 + TypeScript + Tailwind CSS 4 learning project using
Turbopack bundler and pnpm package manager.

## Development Commands

### Core Commands

- `pnpm dev` - Start development server with Turbopack (http://localhost:3000)
- `pnpm build` - Production build with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Quality

- `pnpm prettier --write .` - Format all files with Prettier
- `pnpm prettier --check .` - Check formatting without changes

### Package Management

- Uses pnpm with specific built dependencies: `@tailwindcss/oxide`, `sharp`,
  `unrs-resolver`
- Install dependencies: `pnpm install`

## Architecture

### Next.js App Router Structure

- Uses Next.js 15 App Router (`src/app/` directory)
- Root layout at [src/app/layout.tsx](src/app/layout.tsx) configures Geist fonts
  and global metadata
- Main page at [src/app/page.tsx](src/app/page.tsx)

### TypeScript Configuration

- Path alias `@/*` maps to `./src/*` for imports
- Strict mode enabled
- Target ES2017 with ESNext modules

### Styling System

- Tailwind CSS 4 with `@tailwindcss/postcss` plugin
- Uses v4 `@import "tailwindcss"` directive in
  [globals.css](src/app/globals.css:1)
- `@theme inline` directive maps CSS variables to Tailwind tokens
  - Custom colors: `background`, `foreground` (light/dark via CSS variables)
  - Font tokens: `font-sans`, `font-mono` (linked to Geist fonts)
- Automatic dark mode via `prefers-color-scheme: dark` media query
  - Light: `#ffffff` bg / `#171717` fg
  - Dark: `#0a0a0a` bg / `#ededed` fg
- Custom animations in [tailwind.config.ts](tailwind.config.ts):
  - `fadeIn` - 3s fade in effect
  - `zoomPulse` - infinite scaling pulse
  - `swingRotate` - infinite swing rotation
- Content paths: `./src/app/**/*.{ts,tsx}`, `./src/components/**/*.{ts,tsx}`

### Font Configuration

- Uses `next/font/google` for Geist Sans and Geist Mono
- Font variables: `--font-geist-sans`, `--font-geist-mono`
- Applied via className in root layout

### Code Quality Tools

#### ESLint

- Config: Next.js core-web-vitals + TypeScript
- Disabled rules: `react-hooks/exhaustive-deps`, `@next/next/no-img-element`
- Ignores: `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`

#### Prettier

- Plugins: `@trivago/prettier-plugin-sort-imports`,
  `prettier-plugin-tailwindcss`
- Print width: 100 chars (80 for JSON/MD)
- Single quotes for TS/JS, double for JSX
- Import sorting order:
  1. React/Next core
  2. Third-party modules
  3. Project aliases (`@/types`, `@/config`, `@/lib`, `@/hooks`, `@/utils`,
     `@/services`, `@/stores`, `@/components`, `@/app`)
  4. Relative imports
- Tailwind class sorting enabled (uses [tailwind.config.ts](tailwind.config.ts))
- Functions recognized: `clsx`, `cn`, `twMerge`

## Key Implementation Notes

- All development and build commands use `--turbopack` flag
- Project uses Tailwind CSS v4 architecture (CSS-first configuration via
  `@theme inline`)
- Automatic system-preference dark mode (not manual toggle)
- Import sorting enforced via Prettier plugin - follow `@/` alias order
- Project expects components in `src/components/` directory (configured in
  Tailwind/Prettier but not yet populated)
