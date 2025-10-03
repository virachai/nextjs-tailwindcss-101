# Storybook Best Practices

Professional patterns for writing effective stories and maintaining a
high-quality component library.

## Table of Contents

- [Story Organization](#story-organization)
- [Writing Effective Stories](#writing-effective-stories)
- [Args and Controls](#args-and-controls)
- [Decorators](#decorators)
- [Documentation](#documentation)
- [Testing in Storybook](#testing-in-storybook)
- [Performance](#performance)
- [Team Workflow](#team-workflow)

## Story Organization

### File Naming Convention

```
components/
├── Button/
│   ├── Button.tsx              # Component
│   ├── Button.stories.tsx      # Stories
│   ├── Button.test.tsx         # Unit tests
│   └── index.ts                # Barrel export
│
├── Input/
│   ├── Input.tsx
│   ├── Input.stories.tsx
│   ├── Input.test.tsx
│   └── index.ts
```

### Story Titles (Hierarchy)

```tsx
// ✅ Good - Clear hierarchy
const meta: Meta<typeof Button> = {
  title: 'Components/Forms/Button', // Components > Forms > Button
  component: Button,
};

// ✅ Good - Organized by type
('Components/Button'); // Reusable components
('Forms/LoginForm'); // Form patterns
('Layouts/DashboardLayout'); // Layout templates
('Pages/Homepage'); // Full pages

// ❌ Bad - Flat structure
('Button');
('MyButton');
('ButtonComponent');
```

### Story Naming

```tsx
// ✅ Good - Descriptive names
export const Primary: Story = { ... };
export const Secondary: Story = { ... };
export const Small: Story = { ... };
export const WithIcon: Story = { ... };
export const Loading: Story = { ... };
export const Disabled: Story = { ... };

// ✅ Good - State-based names
export const Empty: Story = { ... };
export const WithData: Story = { ... };
export const Error: Story = { ... };

// ❌ Bad - Generic names
export const Story1: Story = { ... };
export const Test: Story = { ... };
export const Example: Story = { ... };
```

## Writing Effective Stories

### One Story, One State

```tsx
// ✅ Good - Each story shows one specific state
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Loading...',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled',
    disabled: true,
  },
};

// ❌ Bad - Too many states in one story
export const AllStates: Story = {
  render: () => (
    <div>
      <Button variant="primary">Primary</Button>
      <Button variant="primary" isLoading>
        Loading
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  ),
};
```

### Cover All Variants

```tsx
// Component with variants
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
}

// ✅ Good - Cover all variants
export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };

export const Small: Story = { args: { size: 'sm' } };
export const Medium: Story = { args: { size: 'md' } };
export const Large: Story = { args: { size: 'lg' } };

// ✅ Good - Matrix view (optional)
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} className="flex gap-4">
          <Button variant={variant} size="sm">
            Small
          </Button>
          <Button variant={variant} size="md">
            Medium
          </Button>
          <Button variant={variant} size="lg">
            Large
          </Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
```

### Show Edge Cases

```tsx
// ✅ Good - Test edge cases
export const LongText: Story = {
  args: {
    children: 'This is a button with very long text that might wrap',
  },
};

export const NoText: Story = {
  args: {
    children: '',
    'aria-label': 'Icon only button',
  },
};

export const WithEmoji: Story = {
  args: {
    children: '🚀 Launch',
  },
};

export const MultilineText: Story = {
  args: {
    children: 'Line 1\nLine 2\nLine 3',
  },
};
```

### Realistic Data

```tsx
// ❌ Bad - Lorem ipsum
export const Default: Story = {
  args: {
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet...',
  },
};

// ✅ Good - Realistic data
export const Default: Story = {
  args: {
    title: 'Ocean View Apartment in Bali',
    description: 'Stunning 2-bedroom apartment with panoramic ocean views. Close to beaches, restaurants, and nightlife.',
    price: 95,
    rating: 4.89,
    reviews: 127,
  },
};

// ✅ Better - Use fixture data
import { mockProperty } from '@/fixtures/properties';

export const Default: Story = {
  args: mockProperty,
};
```

## Args and Controls

### Define ArgTypes

```tsx
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual style of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
};
```

### Control Types

```tsx
// Text input
children: {
  control: 'text',
}

// Number input
count: {
  control: { type: 'number', min: 0, max: 100, step: 1 },
}

// Boolean toggle
disabled: {
  control: 'boolean',
}

// Select dropdown
variant: {
  control: 'select',
  options: ['primary', 'secondary'],
}

// Radio buttons
size: {
  control: 'radio',
  options: ['sm', 'md', 'lg'],
}

// Color picker
color: {
  control: 'color',
}

// Date picker
date: {
  control: 'date',
}

// Object editor
user: {
  control: 'object',
}

// File upload
file: {
  control: 'file',
  accept: '.jpg,.png',
}
```

### Disable Controls When Not Needed

```tsx
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true }, // Disable all controls
  },
};

// Disable specific controls
argTypes: {
  onClick: {
    table: { disable: true }, // Hide from table
  },
}
```

## Decorators

### Layout Decorator

```tsx
// Center content
export const Primary: Story = {
  parameters: {
    layout: 'centered',
  },
};

// Full width
export const Header: Story = {
  parameters: {
    layout: 'fullscreen',
  },
};

// Padded (default)
export const Card: Story = {
  parameters: {
    layout: 'padded',
  },
};
```

### Container Decorator

```tsx
// Add container to story
export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
};

// Dark background
export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="bg-gray-900 p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
```

### Context Providers

```tsx
// Provide theme context
export const ThemedComponent: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme="dark">
        <Story />
      </ThemeProvider>
    ),
  ],
};

// Provide router context
export const WithRouter: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

// Multiple providers
export const FullContext: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider>
            <Story />
          </RouterProvider>
        </AuthProvider>
      </ThemeProvider>
    ),
  ],
};
```

### Global Decorators

```tsx
// .storybook/preview.tsx
const preview: Preview = {
  decorators: [
    // Add spacing around all stories
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),

    // Add theme provider to all stories
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

## Documentation

### Component Documentation

```tsx
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'], // Enable auto-generated docs
  parameters: {
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants and sizes. Follows WCAG 2.1 AA accessibility standards.',
      },
    },
  },
};
```

### Story Documentation

```tsx
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The primary button is used for the main call-to-action on a page.',
      },
    },
  },
};
```

### MDX Documentation

````mdx
{/* Button.mdx */} import { Meta, Canvas, Story, Controls } from
'@storybook/blocks'; import \* as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

Buttons are used to trigger actions or navigate to different pages.

## Usage

```tsx
import { Button } from '@/components/Button';

<Button variant="primary">Click me</Button>;
```
````

## Variants

<Canvas of={ButtonStories.Primary} />
<Canvas of={ButtonStories.Secondary} />
<Canvas of={ButtonStories.Ghost} />

## Sizes

<Canvas of={ButtonStories.Small} />
<Canvas of={ButtonStories.Medium} />
<Canvas of={ButtonStories.Large} />

## Props

<Controls of={ButtonStories.Primary} />

## Guidelines

### When to use

- Primary actions (Submit, Save, Continue)
- Navigational actions (Next, Back)

### When not to use

- For navigation links (use Link component instead)
- More than 2 buttons in a single view

## Accessibility

- Always provide accessible text or aria-label
- Ensure keyboard accessibility (Enter/Space)
- Maintain WCAG 2.1 AA contrast ratio (4.5:1)

````

## Testing in Storybook

### Interaction Tests

```tsx
import { expect } from '@storybook/test';
import { userEvent, within } from '@storybook/test';

export const ClickTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find button
    const button = canvas.getByRole('button', { name: /click me/i });

    // Click button
    await userEvent.click(button);

    // Assert action was called
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  },
};
````

### Accessibility Tests

```tsx
// Enable a11y addon
import { expect } from '@storybook/test';

export const Primary: Story = {
  args: {
    children: 'Primary Button',
  },
  parameters: {
    a11y: {
      // Run accessibility tests
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};
```

### Visual Regression

```bash
# Install Chromatic
pnpm add -D chromatic

# Run visual tests
pnpm chromatic --project-token=<token>
```

## Performance

### Lazy Loading

```tsx
// Lazy load heavy dependencies
export const WithChart: Story = {
  render: () => {
    const Chart = lazy(() => import('recharts'));

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Chart data={data} />
      </Suspense>
    );
  },
};
```

### Exclude from Build

```tsx
// Exclude expensive stories from production build
export const HeavyStory: Story = {
  parameters: {
    chromatic: { disable: true }, // Skip in Chromatic
  },
};
```

### Optimize Assets

```tsx
// Use optimized images
export const WithImage: Story = {
  render: () => (
    <img src="/optimized-image.webp" alt="Description" loading="lazy" />
  ),
};
```

## Team Workflow

### Story Checklist

Before merging:

- [ ] All variants documented
- [ ] Edge cases covered
- [ ] Controls configured
- [ ] Accessibility tested
- [ ] Documentation written
- [ ] Visual regression passed
- [ ] Interactive tests passing

### Naming Conventions

```
Components/          → Reusable UI components
Forms/              → Form-specific components
Layouts/            → Layout templates
Features/           → Feature-specific components
Pages/              → Full page examples
Patterns/           → Common UI patterns
```

### Review Process

1. **Designer Review**
   - Check visual accuracy
   - Verify all states
   - Test interactions

2. **Developer Review**
   - Check code quality
   - Verify props API
   - Test accessibility

3. **QA Review**
   - Test all variants
   - Check edge cases
   - Verify documentation

### Version Control

```bash
# Semantic versioning for component library
npm version patch  # Bug fixes (1.0.0 → 1.0.1)
npm version minor  # New features (1.0.0 → 1.1.0)
npm version major  # Breaking changes (1.0.0 → 2.0.0)
```

## Common Patterns

### Loading States

```tsx
export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const LoadingWithText: Story = {
  args: {
    isLoading: true,
    loadingText: 'Saving...',
  },
};
```

### Error States

```tsx
export const WithError: Story = {
  args: {
    error: 'This field is required',
  },
};

export const WithValidationError: Story = {
  args: {
    error: 'Password must be at least 8 characters',
    value: 'short',
  },
};
```

### Empty States

```tsx
export const Empty: Story = {
  args: {
    items: [],
    emptyMessage: 'No items found',
  },
};

export const EmptyWithAction: Story = {
  args: {
    items: [],
    emptyMessage: 'No items found',
    emptyAction: {
      label: 'Add Item',
      onClick: () => {},
    },
  },
};
```

### Responsive Variants

```tsx
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
```

## Best Practices Summary

✅ **DO:**

- Write one story per component state
- Cover all variants and edge cases
- Use realistic data
- Add proper documentation
- Configure controls appropriately
- Test accessibility
- Keep stories simple and focused

❌ **DON'T:**

- Mix multiple states in one story
- Use Lorem Ipsum
- Forget edge cases
- Skip documentation
- Overcomplicate stories
- Ignore accessibility

## Next Steps

- [Patterns](./03-patterns.md) - Advanced Storybook patterns
- Write stories for your components
- Set up visual regression testing
- Integrate with CI/CD

## Resources

- [Storybook Best Practices](https://storybook.js.org/docs/writing-stories/best-practices)
- [Component Story Format](https://storybook.js.org/docs/api/csf)
- [Interaction Testing](https://storybook.js.org/docs/writing-tests/interaction-testing)
