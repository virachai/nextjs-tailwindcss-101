# Prettier Configuration

This document describes the Prettier setup for this Next.js + TypeScript project
with automatic import sorting and Tailwind CSS class ordering.

## Overview

Prettier is configured to work seamlessly with ESLint and provides automatic
code formatting with plugins for import sorting and Tailwind CSS class
organization.

## Installed Packages

### Core

- `prettier@^3.6.2` - Code formatter

### Prettier Plugins

- `@trivago/prettier-plugin-sort-imports` - Automatically sorts imports
- `prettier-plugin-tailwindcss` - Automatically sorts Tailwind CSS classes

### ESLint Integration

- `eslint-config-prettier` - Disables conflicting ESLint rules
- `eslint-plugin-prettier` - Runs Prettier as ESLint rule

## Configuration File

Configuration is located at [prettier.config.mjs](../prettier.config.mjs).

## Core Settings

### Line Length

```javascript
printWidth: 100;
```

Maximum line length before wrapping (100 characters for code, 80 for
JSON/Markdown).

### Indentation

```javascript
tabWidth: 2;
useTabs: false;
```

Use 2 spaces for indentation (no tabs).

### Semicolons

```javascript
semi: true;
```

Always add semicolons at the end of statements.

### Quotes

```javascript
singleQuote: true; // Use single quotes in TS/JS
quoteProps: 'as-needed'; // Quote object properties only when needed
jsxSingleQuote: false; // Use double quotes in JSX
```

**Examples:**

```typescript
// ✅ TypeScript/JavaScript
const message = 'Hello, world!';
const obj = { name: 'John', 'full-name': 'John Doe' };

// ✅ JSX
<Component message="Hello, world!" />
```

### Trailing Commas

```javascript
trailingComma: 'es5';
```

Add trailing commas where valid in ES5 (objects, arrays, etc.).

```typescript
const obj = {
  name: 'John',
  age: 30, // ✅ Trailing comma
};
```

### Brackets

```javascript
bracketSpacing: true; // { foo: bar } not {foo: bar}
bracketSameLine: false; // JSX closing bracket on new line
```

### Arrow Functions

```javascript
arrowParens: 'always';
```

Always include parentheses around arrow function parameters.

```typescript
// ✅ Correct
const fn = (x) => x * 2;

// ❌ Incorrect
const fn = x => x * 2;
```

### Line Endings

```javascript
endOfLine: 'lf';
```

Use Unix-style line endings (LF).

## Import Sorting

Powered by `@trivago/prettier-plugin-sort-imports`.

### Import Order

Imports are automatically organized in this order:

1. **React Core**

   ```typescript
   import React from 'react';

   import ReactDOM from 'react-dom';
   ```

2. **Next.js Core**

   ```typescript
   import type { Metadata } from 'next';

   import { headers } from 'next/headers';
   import Image from 'next/image';
   ```

3. **Third-party Libraries**

   ```typescript
   import axios from 'axios';
   import clsx from 'clsx';
   ```

4. **Internal Modules (by category)**

   ```typescript
   import type { User } from '@/types/user';

   import { API_URL } from '@/config/constants';

   import { prisma } from '@/lib/prisma';

   import { useAuth } from '@/hooks/useAuth';

   import { formatDate } from '@/utils/date';

   import { userService } from '@/services/user';

   import { useUserStore } from '@/stores/user';

   import { Button } from '@/components/ui/Button';

   import { Header } from '@/components/Header';

   import { metadata } from '@/app/layout';
   ```

5. **Relative Imports**
   ```typescript
   import { helper } from './helper';
   import styles from './styles.module.css';
   ```

### Import Sorting Configuration

```javascript
importOrderSeparation: true; // Add blank line between groups
importOrderSortSpecifiers: true; // Sort named imports alphabetically
importOrderGroupNamespaceSpecifiers: true; // Group namespace imports
importOrderCaseInsensitive: true; // Case-insensitive sorting
```

**Example:**

```typescript
// Before formatting
import { z } from './utils';
import { Button } from '@/components/Button';
import axios from 'axios';
import type { User } from 'next-auth';
import React from 'react';

// After formatting
import React from 'react';

import axios from 'axios';
import type { User } from 'next-auth';

import { Button } from '@/components/Button';

import { z } from './utils';
```

## Tailwind CSS Class Sorting

Powered by `prettier-plugin-tailwindcss`.

### Configuration

```javascript
tailwindConfig: './tailwind.config.ts';
tailwindFunctions: ['clsx', 'cn', 'twMerge'];
tailwindAttributes: ['className', 'class'];
```

### How It Works

Classes are sorted according to Tailwind's recommended order:

1. Layout (display, position, etc.)
2. Flexbox/Grid
3. Spacing
4. Sizing
5. Typography
6. Visual (colors, borders, etc.)
7. Transitions/Animations
8. Responsive modifiers
9. Dark mode

**Example:**

```typescript
// Before
<div className="text-center p-4 bg-blue-500 flex items-center gap-2 dark:bg-blue-700">

// After
<div className="flex items-center gap-2 bg-blue-500 p-4 text-center dark:bg-blue-700">
```

### Supported Functions

The plugin recognizes these utility functions:

```typescript
import clsx from 'clsx';
import { cn } from '@/lib/utils';
import { twMerge } from 'tailwind-merge';

// All of these will have sorted classes
<div className={clsx('p-4 bg-white text-black')} />
<div className={cn('p-4 bg-white text-black')} />
<div className={twMerge('p-4 bg-white text-black')} />
```

## File-Specific Overrides

### JSON Files

```javascript
printWidth: 80;
trailingComma: 'none';
```

### Markdown Files

```javascript
proseWrap: 'always';
printWidth: 80;
```

Text wraps at 80 characters for better readability.

### YAML Files

```javascript
tabWidth: 2;
useTabs: false;
singleQuote: false;
```

### CSS/SCSS Files

```javascript
singleQuote: false;
```

Use double quotes in stylesheets.

### TypeScript/JavaScript Files

```javascript
printWidth: 100;
semi: true;
singleQuote: true;
```

## Prettier Ignore

File: [.prettierignore](../.prettierignore)

```
# Dependencies
node_modules/
pnpm-lock.yaml

# Build outputs
.next/
out/
build/
dist/

# Cache
.turbo/

# Environment
.env*

# Generated
next-env.d.ts
```

## Usage

### Available Scripts

```bash
# Format all files
pnpm format

# Check formatting without changes
pnpm format:check

# Format specific files
pnpm prettier --write "src/**/*.{ts,tsx}"
```

### Format on Save (VSCode)

Install the Prettier extension:

```json
{
  "recommendations": ["esbenp.prettier-vscode"]
}
```

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Integration with ESLint

Prettier runs as an ESLint rule through `eslint-plugin-prettier`:

```bash
# This runs both ESLint and Prettier
pnpm lint:fix
```

Conflicts between ESLint and Prettier are automatically resolved by
`eslint-config-prettier`, which disables conflicting ESLint rules.

## Common Use Cases

### Format Entire Project

```bash
pnpm format
```

### Check Without Writing

```bash
pnpm format:check
```

### Format Specific Directory

```bash
pnpm prettier --write "src/components/**/*.tsx"
```

### Format Staged Files (with lint-staged)

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["prettier --write", "eslint --fix"]
  }
}
```

## Troubleshooting

### Import Order Not Working

- Ensure `@trivago/prettier-plugin-sort-imports` is installed
- Check that the plugin is listed in `prettier.config.mjs`
- Restart VSCode or your editor

### Tailwind Classes Not Sorting

- Verify `tailwind.config.ts` path is correct
- Check that `prettier-plugin-tailwindcss` is installed
- Ensure it's listed LAST in the plugins array

### Conflicting with ESLint

- Make sure `eslint-config-prettier` is the LAST item in `.eslintrc.json`
  extends
- Run `pnpm lint:fix` to apply both tools together

## Best Practices

1. **Always run Prettier before committing**

   ```bash
   pnpm format
   ```

2. **Use format on save** in your editor for instant feedback

3. **Check formatting in CI/CD**

   ```bash
   pnpm format:check
   ```

4. **Let Prettier handle formatting**, focus on logic in code reviews

5. **Don't fight Prettier** - if it formats code a certain way, that's
   intentional

## References

- [Prettier Documentation](https://prettier.io/docs/en/)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [@trivago/prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports)
