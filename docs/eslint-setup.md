# ESLint Configuration

This document describes the ESLint setup for this Next.js + TypeScript project,
configured with Airbnb style guide standards.

## Overview

We use ESLint 8.57.1 with the Airbnb configuration to maintain consistent code
quality and style across the project. The setup includes TypeScript support,
React/Next.js specific rules, and Prettier integration.

## Installed Packages

### Core ESLint

- `eslint@^8.57.0` - ESLint core (v8 for .eslintrc support)

### Airbnb Configuration

- `eslint-config-airbnb` - Airbnb's base ESLint config with ES6+ and React rules
- `eslint-config-airbnb-typescript` - Airbnb config adapted for TypeScript
- `eslint-config-airbnb/hooks` - React Hooks specific rules

### TypeScript Support

- `@typescript-eslint/eslint-plugin@^7.18.0` - TypeScript-specific linting rules
- `@typescript-eslint/parser@^7.18.0` - TypeScript parser for ESLint

### ESLint Plugins

- `eslint-plugin-import` - ES6+ import/export syntax validation
- `eslint-plugin-jsx-a11y` - Accessibility rules for JSX elements
- `eslint-plugin-react` - React specific linting rules
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-prettier` - Runs Prettier as an ESLint rule

### Import Resolution

- `eslint-import-resolver-typescript` - Resolves TypeScript paths for import
  rules

### Prettier Integration

- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier
- `eslint-plugin-prettier` - Integrates Prettier with ESLint

## Configuration File

Configuration is located at [.eslintrc.json](../.eslintrc.json).

### Extends

```json
"extends": [
  "airbnb",
  "airbnb-typescript",
  "airbnb/hooks",
  "plugin:@typescript-eslint/recommended",
  "plugin:@typescript-eslint/recommended-requiring-type-checking",
  "plugin:import/recommended",
  "plugin:import/typescript",
  "plugin:jsx-a11y/recommended",
  "plugin:react/recommended",
  "plugin:react-hooks/recommended",
  "plugin:prettier/recommended",
  "prettier"
]
```

### Parser Configuration

```json
"parser": "@typescript-eslint/parser",
"parserOptions": {
  "project": "./tsconfig.json",
  "ecmaVersion": "latest",
  "sourceType": "module",
  "ecmaFeatures": {
    "jsx": true
  }
}
```

## Key Rules

### React Rules

- **`react/react-in-jsx-scope: off`** - Not needed in Next.js 13+
- **`react/prop-types: off`** - Using TypeScript instead
- **`react/jsx-props-no-spreading: off`** - Allow prop spreading for flexibility
- **`react/require-default-props: off`** - TypeScript handles optional props
- **`react/function-component-definition`** - Enforce arrow function components

  ```typescript
  // ✅ Correct
  const MyComponent: React.FC = () => { ... };

  // ❌ Incorrect
  function MyComponent() { ... }
  ```

### Next.js Specific

- **`react/jsx-filename-extension`** - Only allow JSX in `.tsx` and `.jsx` files

### Import Rules

- **`import/prefer-default-export: off`** - Allow named exports
- **`import/no-default-export: off`** - Allow default exports (required for
  Next.js pages)
- **`import/extensions`** - Never include file extensions for imports
- **`import/order: off`** - Disabled to avoid conflicts with Prettier plugin

### TypeScript Rules

- **`@typescript-eslint/no-unused-vars`** - Error on unused variables
  - Ignore variables starting with `_`

  ```typescript
  // ✅ Correct
  const _unusedVar = 'ignored';

  // ❌ Incorrect
  const unusedVar = 'error';
  ```

- **`@typescript-eslint/no-explicit-any: warn`** - Warn when using `any` type
- **`@typescript-eslint/explicit-module-boundary-types: off`** - Type inference
  is sufficient
- **`@typescript-eslint/no-non-null-assertion: warn`** - Warn on `!` operator
  usage

### General Rules

- **`no-console: warn`** - Warn on console.log, allow console.warn/error

  ```typescript
  // ⚠️ Warning
  console.log('debug');

  // ✅ Allowed
  console.warn('warning');
  console.error('error');
  ```

- **`@typescript-eslint/no-unused-expressions`** - Allow short-circuit and
  ternary

## Ignored Patterns

The following files and directories are ignored:

```json
[
  "node_modules",
  ".next",
  "out",
  "build",
  "dist",
  "public",
  "*.config.js",
  "*.config.ts",
  "*.config.mjs",
  "next-env.d.ts"
]
```

## Usage

### Available Scripts

```bash
# Run ESLint
pnpm lint

# Auto-fix ESLint issues
pnpm lint:fix

# Run ESLint on specific files
pnpm eslint src/app/**/*.tsx
```

### VSCode Integration

Install the ESLint extension for VSCode:

```json
{
  "recommendations": ["dbaeumer.vscode-eslint"]
}
```

Add to your `.vscode/settings.json`:

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Common Issues

### Peer Dependency Warnings

Some peer dependency warnings are expected due to version mismatches between
Airbnb config and ESLint 8. These are non-breaking and can be safely ignored.

### Type Checking Performance

The `@typescript-eslint/recommended-requiring-type-checking` ruleset requires
type information and may slow down linting. For faster feedback during
development:

```bash
# Type-check separately
pnpm type-check
```

## Migration from ESLint 9

This project uses ESLint 8 instead of 9 because the Airbnb configuration is
based on the legacy `.eslintrc.json` format. ESLint 9 uses the new flat config
format by default.

To migrate to ESLint 9 in the future, you'll need to:

1. Convert `.eslintrc.json` to `eslint.config.mjs`
2. Wait for Airbnb to release a flat config compatible version
3. Update all plugin configurations to the new format

## References

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
