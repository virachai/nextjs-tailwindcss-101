# Biome vs ESLint: Choosing the Right Tool

This document explains why this project uses ESLint + Prettier instead of Biome, and provides guidance for teams considering their options.

## Overview

Both Biome and ESLint are code quality tools, but they have different philosophies and trade-offs.

### Current Project Setup

This project uses:
- **ESLint 8.57.1** with Airbnb configuration
- **Prettier 3.6.2** for code formatting
- **TypeScript ESLint** for TypeScript support
- Multiple plugins for React, imports, accessibility, etc.

## Quick Comparison

| Feature | Biome | ESLint + Prettier |
|---------|-------|-------------------|
| **Speed** | ⚡⚡⚡⚡⚡ 25-50x faster | 🐌 Slower |
| **Setup** | 🎯 Simple (1 tool) | 🔧 Complex (2 tools + plugins) |
| **Configuration** | 📝 Single file | 📚 Multiple configs |
| **Airbnb Preset** | ❌ Not available | ✅ Built-in |
| **Plugin Ecosystem** | 🌱 Growing | 🌳 Mature |
| **Language Support** | TypeScript, JavaScript, JSON | Everything (plugins) |
| **Community** | 🆕 New but growing | 👥 Large, established |
| **Maturity** | ⚠️ Young (v1.0 in 2024) | ✅ Battle-tested |

## Why NOT Use Biome + ESLint Together?

### ❌ Redundancy

Both tools do the same job:

```bash
# Biome does:
✓ Linting (code quality rules)
✓ Formatting (code style)
✓ Import sorting
✓ TypeScript support

# ESLint + Prettier also does:
✓ Linting (code quality rules)
✓ Formatting (code style)
✓ Import sorting
✓ TypeScript support
```

Running both means **duplicate checks** for the same issues.

### ❌ Conflicting Rules

```typescript
// ESLint (Airbnb): Requires arrow functions
const Component: React.FC = () => { ... };

// Biome: May allow function declarations
function Component() { ... }

// Result: Conflicting errors from both tools
```

### ❌ Performance Penalty

```bash
# With ESLint + Prettier
$ pnpm lint
⏱️ ~3-5 seconds

# With Biome only
$ pnpm lint
⏱️ ~0.1-0.2 seconds

# With BOTH (redundant)
$ pnpm lint
⏱️ ~3-5 seconds (ESLint) + ~0.1 seconds (Biome) = slower + waste
```

### ❌ Configuration Complexity

You'd need to maintain:
- `.eslintrc.json` (ESLint rules)
- `prettier.config.mjs` (Prettier formatting)
- `biome.json` (Biome rules)
- Ensure they don't conflict with each other

### ❌ Developer Experience Issues

```bash
# Developer confusion
$ pnpm lint
❌ ESLint error: Missing semicolon
❌ Biome error: Missing semicolon (duplicate)
✓ Prettier: Auto-fixes semicolon

# CI/CD pipeline
$ npm run lint
⚠️ Running 2 linters (slow)
⚠️ Duplicate error reports
⚠️ Harder to debug which tool failed
```

## Why This Project Uses ESLint + Prettier

### ✅ Airbnb Style Guide

The Airbnb JavaScript/React style guide is:
- Industry standard for frontend development
- Used by companies like Airbnb, Netflix, Uber
- Well-documented and battle-tested
- Has comprehensive React + TypeScript rules

**Currently:**
```json
{
  "extends": [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks"
  ]
}
```

**With Biome:**
❌ No Airbnb preset - you'd need to manually configure 100+ rules

### ✅ Mature Ecosystem

ESLint has plugins for:
- `eslint-plugin-react` - React specific rules
- `eslint-plugin-jsx-a11y` - Accessibility rules
- `eslint-plugin-import` - Import/export validation
- `eslint-plugin-react-hooks` - Hooks rules
- `eslint-plugin-prettier` - Prettier integration
- `prettier-plugin-tailwindcss` - Tailwind class sorting

**With Biome:**
Limited plugin support - core features only

### ✅ Team Familiarity

Most developers know:
- ESLint configuration
- Airbnb style guide
- Prettier formatting rules

**With Biome:**
New tool - team would need to learn new configuration format

### ✅ CI/CD Integration

ESLint + Prettier work with all CI/CD platforms:
- GitHub Actions
- GitLab CI
- CircleCI
- Jenkins

```yaml
# .github/workflows/lint.yml
- name: Run ESLint
  run: pnpm lint

- name: Check Prettier
  run: pnpm format:check
```

## When to Use Biome

Biome is excellent when:

### ✅ Performance is Critical

```bash
# Large monorepo with 1000+ files
ESLint + Prettier: 30-60 seconds
Biome: 1-2 seconds
```

### ✅ Simple Projects

```bash
# Small project without complex requirements
biome.json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true
  }
}
```

### ✅ No Style Guide Requirements

If you don't need Airbnb/Standard/Google configs, Biome's defaults are good.

### ✅ Modern Toolchain

Projects using:
- Vite (already fast)
- Turbopack (Next.js)
- Modern build tools

Benefit more from Biome's speed.

## Migration Guide: ESLint → Biome

If you decide to switch, here's how:

### Step 1: Remove ESLint + Prettier

```bash
pnpm remove \
  eslint \
  prettier \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-config-airbnb \
  eslint-config-airbnb-typescript \
  eslint-config-prettier \
  eslint-plugin-prettier \
  eslint-plugin-import \
  eslint-plugin-jsx-a11y \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  prettier-plugin-tailwindcss \
  @trivago/prettier-plugin-sort-imports \
  eslint-import-resolver-typescript
```

### Step 2: Install Biome

```bash
pnpm add -D @biomejs/biome
```

### Step 3: Initialize Biome

```bash
pnpm biome init
```

### Step 4: Configure Biome (biome.json)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noNonNullAssertion": "warn",
        "useConst": "error",
        "useExportType": "error",
        "useImportType": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useHookAtTopLevel": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "es5",
      "semicolons": "always",
      "arrowParentheses": "always",
      "bracketSpacing": true
    }
  },
  "json": {
    "formatter": {
      "enabled": true,
      "indentWidth": 2
    }
  }
}
```

### Step 5: Update package.json Scripts

```json
{
  "scripts": {
    "lint": "biome lint .",
    "lint:fix": "biome lint --write .",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "check": "biome check .",
    "check:fix": "biome check --write ."
  }
}
```

### Step 6: Update VSCode Settings

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

### Step 7: Remove Old Config Files

```bash
rm .eslintrc.json
rm prettier.config.mjs
rm .prettierignore
```

### Step 8: Create .biomeignore

```
# Build outputs
.next/
out/
build/
dist/

# Dependencies
node_modules/

# Cache
.turbo/

# Environment
.env*

# Generated
next-env.d.ts
```

### Step 9: Test

```bash
# Check all files
pnpm check

# Auto-fix issues
pnpm check:fix

# Format code
pnpm format
```

## Hybrid Approach (NOT Recommended)

Some teams try to use both:

```json
{
  "scripts": {
    "lint:eslint": "eslint .",
    "lint:biome": "biome check .",
    "lint": "pnpm lint:eslint && pnpm lint:biome"
  }
}
```

### Why This Fails

1. **Duplicate work** - Both check the same files
2. **Conflicting fixes** - ESLint fix ≠ Biome fix
3. **Slower** - Running two tools sequentially
4. **Confusing errors** - Same issue reported twice
5. **Maintenance burden** - Keep two configs in sync

## Recommendation for This Project

### Stay with ESLint + Prettier ✅

**Reasons:**
1. ✅ Already configured with Airbnb style guide
2. ✅ Team familiar with tooling
3. ✅ Complete documentation in [docs/](.)
4. ✅ Plugin ecosystem for Next.js + React + Tailwind
5. ✅ Project size doesn't require Biome's speed

**When to reconsider:**
- Project grows to 10,000+ files
- Lint times exceed 30 seconds
- Team wants to try modern tooling
- Airbnb config is no longer required

### Performance Optimization (Current Setup)

If ESLint feels slow, optimize instead of switching:

```json
// .eslintrc.json
{
  "ignorePatterns": [
    "node_modules",
    ".next",
    "out",
    "dist",
    "build",
    "public",
    "coverage",
    "*.config.js",
    "*.config.ts",
    "*.config.mjs"
  ]
}
```

```bash
# Lint only staged files (with lint-staged)
pnpm add -D lint-staged husky

# package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## Conclusion

### Choose ONE Tool

| Scenario | Recommended Tool |
|----------|-----------------|
| Need Airbnb style guide | ESLint + Prettier |
| Large monorepo (10k+ files) | Biome |
| Small/medium project | ESLint + Prettier |
| Team familiar with ESLint | ESLint + Prettier |
| Need specific plugins | ESLint + Prettier |
| Want maximum speed | Biome |
| New project, no requirements | Biome |

### This Project's Choice

**ESLint + Prettier** ✅

- Airbnb style guide enforced
- Comprehensive plugin support
- Team expertise
- Well-documented
- Industry standard

**Performance is acceptable** for project size (~10-20 files).

If you still want to experiment with Biome, create a **separate branch** and compare:

```bash
git checkout -b experiment/biome
# Follow migration guide above
# Compare DX, speed, errors
# Make informed decision
```

## References

- [Biome Documentation](https://biomejs.dev/)
- [Biome vs ESLint Performance](https://biomejs.dev/blog/biome-wins-prettier-challenge/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Airbnb Style Guide](https://github.com/airbnb/javascript)

---

**TL;DR:** Don't use Biome + ESLint together. Pick one based on your needs. This project uses ESLint + Prettier for Airbnb style guide compliance.
