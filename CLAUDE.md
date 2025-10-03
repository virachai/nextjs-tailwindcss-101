# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15.5 + React 19 + TypeScript + Tailwind CSS 4 learning project using Turbopack bundler and pnpm package manager.

## Development Commands

### Core Commands
- `pnpm dev` - Start development server with Turbopack (http://localhost:3000)
- `pnpm build` - Production build with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Package Management
- Uses pnpm with specific built dependencies: `@tailwindcss/oxide`, `sharp`, `unrs-resolver`
- Install dependencies: `pnpm install`

## Architecture

### Next.js App Router Structure
- Uses Next.js 15 App Router (`src/app/` directory)
- Root layout at [src/app/layout.tsx](src/app/layout.tsx) configures Geist fonts and global metadata
- Main page at [src/app/page.tsx](src/app/page.tsx)

### TypeScript Configuration
- Path alias `@/*` maps to `./src/*` for imports
- Strict mode enabled
- Target ES2017 with ESNext modules

### Styling System
- Tailwind CSS 4 with PostCSS integration
- Custom animations defined in [tailwind.config.ts](tailwind.config.ts):
  - `fadeIn` - 3s fade in effect
  - `zoomPulse` - infinite scaling pulse
  - `swingRotate` - infinite swing rotation
- Content paths: `./src/app/**/*.{ts,tsx}`, `./src/components/**/*.{ts,tsx}`

### Font Configuration
- Uses `next/font/google` for Geist Sans and Geist Mono
- Font variables: `--font-geist-sans`, `--font-geist-mono`
- Applied via className in root layout

### Linting
- ESLint with Next.js core-web-vitals and TypeScript configs
- Ignores: `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`

## Key Implementation Notes

- All development and build commands use `--turbopack` flag
- Project expects components in `src/components/` directory (configured in Tailwind but not yet populated)
- Dark mode styling uses `dark:` prefix classes
