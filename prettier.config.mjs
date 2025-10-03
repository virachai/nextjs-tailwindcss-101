/**
 * Prettier Configuration for Next.js Project
 * TMN Campaign Fundraising Web Application
 *
 * This configuration ensures consistent code formatting across the entire codebase
 * following industry best practices and team conventions.
 */

const config = {
  // Line Length
  printWidth: 100,

  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Semicolons
  semi: true,

  // Quotes
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,

  // Trailing Commas
  trailingComma: 'es5',

  // Brackets
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow Functions
  arrowParens: 'always',

  // Range (format entire file)
  rangeStart: 0,
  rangeEnd: Infinity,

  // Prose Wrap (for markdown)
  proseWrap: 'preserve',

  // HTML Whitespace Sensitivity
  htmlWhitespaceSensitivity: 'css',

  // Vue files (not used in this project, but good to have)
  vueIndentScriptAndStyle: false,

  // Line Endings
  endOfLine: 'lf',

  // Embedded Language Formatting
  embeddedLanguageFormatting: 'auto',

  // TypeScript specific
  experimentalTernaries: false,

  // Plugins for better formatting
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],

  // Import Sorting Configuration
  importOrder: [
    '^react$',
    '^react-dom$',
    '^next$',
    '^next/(.*)$',
    '^@next/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@/types/(.*)$',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/utils/(.*)$',
    '^@/services/(.*)$',
    '^@/stores/(.*)$',
    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',
    '^@/app/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,

  // Tailwind CSS Class Sorting
  tailwindConfig: './tailwind.config.ts',
  tailwindFunctions: ['clsx', 'cn', 'twMerge'],
  tailwindAttributes: ['className', 'class'],

  // Override for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        trailingComma: 'none',
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 80,
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
        useTabs: false,
        singleQuote: false,
      },
    },
    {
      files: ['*.css', '*.scss', '*.sass'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.tsx', '*.ts'],
      options: {
        printWidth: 100,
        semi: true,
        singleQuote: true,
      },
    },
    {
      files: ['*.jsx', '*.js'],
      options: {
        printWidth: 100,
        semi: true,
        singleQuote: true,
      },
    },
  ],
};

export default config;
