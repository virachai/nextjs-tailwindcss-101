# Storybook Advanced Patterns

Advanced techniques and patterns for building sophisticated component stories.

## Table of Contents

- [Complex Component Stories](#complex-component-stories)
- [State Management](#state-management)
- [API Mocking](#api-mocking)
- [Form Components](#form-components)
- [Composite Components](#composite-components)
- [Interaction Testing](#interaction-testing)
- [Visual Testing](#visual-testing)
- [Performance Patterns](#performance-patterns)

## Complex Component Stories

### Modal/Dialog Stories

```tsx
// Modal.stories.tsx
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Use a wrapper to control modal state
export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header>
            <h2>Modal Title</h2>
          </Modal.Header>
          <Modal.Body>
            <p>This is the modal content.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// Show modal open by default for documentation
export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
  render: (args) => (
    <Modal {...args}>
      <Modal.Header>
        <h2>Always Open Modal</h2>
      </Modal.Header>
      <Modal.Body>
        <p>This modal is always visible for documentation purposes.</p>
      </Modal.Body>
    </Modal>
  ),
};

// Different sizes
export const Small: Story = {
  args: {
    isOpen: true,
    size: 'sm',
    onClose: () => {},
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    size: 'lg',
    onClose: () => {},
  },
};

// With scrollable content
export const LongContent: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
  render: (args) => (
    <Modal {...args}>
      <Modal.Header>
        <h2>Long Content</h2>
      </Modal.Header>
      <Modal.Body>
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i}>Paragraph {i + 1}</p>
        ))}
      </Modal.Body>
    </Modal>
  ),
};
```

### Dropdown/Menu Stories

```tsx
// Dropdown.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// Basic dropdown
export const Default: Story = {
  args: {
    trigger: <Button>Open Menu</Button>,
    items: [
      { label: 'Edit', onClick: () => console.log('Edit') },
      { label: 'Duplicate', onClick: () => console.log('Duplicate') },
      {
        label: 'Delete',
        onClick: () => console.log('Delete'),
        variant: 'danger',
      },
    ],
  },
};

// With icons
export const WithIcons: Story = {
  args: {
    trigger: <Button>Actions</Button>,
    items: [
      {
        label: 'Edit',
        icon: <EditIcon />,
        onClick: () => {},
      },
      {
        label: 'Share',
        icon: <ShareIcon />,
        onClick: () => {},
      },
      {
        label: 'Delete',
        icon: <TrashIcon />,
        onClick: () => {},
        variant: 'danger',
      },
    ],
  },
};

// With dividers
export const WithDividers: Story = {
  args: {
    trigger: <Button>Menu</Button>,
    items: [
      { label: 'New File', onClick: () => {} },
      { label: 'New Folder', onClick: () => {} },
      { type: 'divider' },
      { label: 'Settings', onClick: () => {} },
      { type: 'divider' },
      { label: 'Logout', onClick: () => {}, variant: 'danger' },
    ],
  },
};

// Show dropdown open for documentation
export const Open: Story = {
  args: {
    defaultOpen: true,
    trigger: <Button>Always Open</Button>,
    items: [
      { label: 'Item 1', onClick: () => {} },
      { label: 'Item 2', onClick: () => {} },
      { label: 'Item 3', onClick: () => {} },
    ],
  },
};
```

## State Management

### With React Hooks

```tsx
// Counter.stories.tsx
import { useState } from 'react';

import { Counter } from './Counter';

export const Interactive: Story = {
  render: (args) => {
    const [count, setCount] = useState(0);

    return (
      <Counter
        {...args}
        count={count}
        onIncrement={() => setCount(count + 1)}
        onDecrement={() => setCount(count - 1)}
        onReset={() => setCount(0)}
      />
    );
  },
};

// Multi-component interaction
export const WithInput: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [items, setItems] = useState<string[]>([]);

    const handleAdd = () => {
      if (value.trim()) {
        setItems([...items, value]);
        setValue('');
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Enter item..."
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <span>{item}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  },
};
```

### With Context

```tsx
// ThemedComponent.stories.tsx
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

export const WithTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

// Theme switcher
export const ThemeSwitcher: Story = {
  render: () => {
    const ThemeDemo = () => {
      const { theme, setTheme } = useTheme();

      return (
        <div className={theme === 'dark' ? 'dark' : ''}>
          <div className="space-y-4 rounded-lg bg-white p-6 dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Theme Demo
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Current theme: {theme}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setTheme('light')}>Light</Button>
              <Button onClick={() => setTheme('dark')}>Dark</Button>
            </div>
          </div>
        </div>
      );
    };

    return (
      <ThemeProvider>
        <ThemeDemo />
      </ThemeProvider>
    );
  },
};
```

## API Mocking

### MSW (Mock Service Worker)

```bash
# Install MSW
pnpm add -D msw msw-storybook-addon
```

```typescript
// .storybook/preview.tsx
import { initialize, mswLoader } from 'msw-storybook-addon';

// Initialize MSW
initialize();

const preview: Preview = {
  loaders: [mswLoader],
  // ... other config
};
```

```tsx
// UserList.stories.tsx
import { http, HttpResponse } from 'msw';

import { UserList } from './UserList';

const meta: Meta<typeof UserList> = {
  title: 'Features/UserList',
  component: UserList,
};

export default meta;
type Story = StoryObj<typeof UserList>;

// Mock successful API response
export const Success: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => {
          return HttpResponse.json([
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
          ]);
        }),
      ],
    },
  },
};

// Mock loading state
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', async () => {
          // Delay response to show loading state
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

// Mock error state
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => {
          return HttpResponse.json(
            { message: 'Failed to fetch users' },
            { status: 500 }
          );
        }),
      ],
    },
  },
};

// Mock empty state
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => {
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};
```

### Manual Mocking

```tsx
// ProductCard.stories.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const WithData: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => {
    // Mock the hook
    jest.spyOn(require('@/hooks/useProduct'), 'useProduct').mockReturnValue({
      data: {
        id: 1,
        name: 'Product Name',
        price: 99.99,
        image: '/product.jpg',
      },
      isLoading: false,
      error: null,
    });

    return <ProductCard productId={1} />;
  },
};
```

## Form Components

### Controlled Form

```tsx
// LoginForm.stories.tsx
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { LoginForm } from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Forms/LoginForm',
  component: LoginForm,
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
  render: (args) => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = (data: typeof formData) => {
      console.log('Form submitted:', data);
    };

    return (
      <LoginForm
        {...args}
        data={formData}
        errors={errors}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
    );
  },
};

// Pre-filled form
export const PreFilled: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      email: 'user@example.com',
      password: 'password123',
    });

    return (
      <LoginForm
        data={formData}
        onChange={setFormData}
        onSubmit={(data) => console.log(data)}
      />
    );
  },
};

// With validation errors
export const WithErrors: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      email: 'invalid-email',
      password: '123',
    });
    const [errors] = useState({
      email: 'Please enter a valid email address',
      password: 'Password must be at least 8 characters',
    });

    return (
      <LoginForm
        data={formData}
        errors={errors}
        onChange={setFormData}
        onSubmit={() => {}}
      />
    );
  },
};

// Submitting state
export const Submitting: Story = {
  render: () => {
    const [isSubmitting] = useState(true);

    return (
      <LoginForm
        data={{ email: 'user@example.com', password: 'password' }}
        isSubmitting={isSubmitting}
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );
  },
};
```

### Form with React Hook Form

```tsx
// SignupForm.stories.tsx
import { useForm } from 'react-hook-form';

import { SignupForm } from './SignupForm';

export const Default: Story = {
  render: () => {
    const FormWrapper = () => {
      const form = useForm({
        defaultValues: {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
      });

      return (
        <SignupForm
          form={form}
          onSubmit={(data) => console.log('Submitted:', data)}
        />
      );
    };

    return <FormWrapper />;
  },
};
```

## Composite Components

### Tabs Component

```tsx
// Tabs.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Tab value="tab1">Account</Tabs.Tab>
        <Tabs.Tab value="tab2">Password</Tabs.Tab>
        <Tabs.Tab value="tab3">Notifications</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel value="tab1">
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences.
          </p>
        </Tabs.Panel>
        <Tabs.Panel value="tab2">
          <h3 className="text-lg font-semibold">Password Settings</h3>
          <p className="mt-2 text-gray-600">
            Update your password and security settings.
          </p>
        </Tabs.Panel>
        <Tabs.Panel value="tab3">
          <h3 className="text-lg font-semibold">Notification Settings</h3>
          <p className="mt-2 text-gray-600">
            Configure your notification preferences.
          </p>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  ),
};

// Controlled tabs
export const Controlled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setActiveTab('tab1')}>
            Go to Tab 1
          </Button>
          <Button size="sm" onClick={() => setActiveTab('tab2')}>
            Go to Tab 2
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tabs content */}
        </Tabs>
      </div>
    );
  },
};
```

### Accordion Component

```tsx
// Accordion.stories.tsx
export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>What is Storybook?</Accordion.Trigger>
        <Accordion.Content>
          Storybook is an open-source tool for developing UI components in
          isolation.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>How do I install it?</Accordion.Trigger>
        <Accordion.Content>
          Run: pnpm dlx storybook@latest init
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>Is it free?</Accordion.Trigger>
        <Accordion.Content>
          Yes! Storybook is completely free and open-source.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

// Multiple items open
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['item-1', 'item-2']}>
      {/* Accordion items */}
    </Accordion>
  ),
};
```

## Interaction Testing

### Play Function

```tsx
// Button.stories.tsx
import { expect, userEvent, within } from '@storybook/test';

export const ClickTest: Story = {
  args: {
    children: 'Click Me',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find button
    const button = canvas.getByRole('button', { name: /click me/i });

    // Verify button exists
    await expect(button).toBeInTheDocument();

    // Click button
    await userEvent.click(button);

    // Verify onClick was called
    await expect(args.onClick).toHaveBeenCalled();
  },
};

// Form submission test
export const FormSubmit: Story = {
  render: () => <LoginForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill email
    const emailInput = canvas.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'user@example.com');

    // Fill password
    const passwordInput = canvas.getByLabelText(/password/i);
    await userEvent.type(passwordInput, 'password123');

    // Submit form
    const submitButton = canvas.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);

    // Verify form was submitted
    await expect(canvas.getByText(/welcome back/i)).toBeInTheDocument();
  },
};

// Keyboard navigation test
export const KeyboardNav: Story = {
  render: () => <Dropdown />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Focus trigger
    const trigger = canvas.getByRole('button');
    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    // Open with keyboard
    await userEvent.keyboard('{Enter}');

    // Navigate with arrow keys
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');

    // Select with Enter
    await userEvent.keyboard('{Enter}');
  },
};
```

### Accessibility Testing

```tsx
// Button.stories.tsx
export const AccessibilityTest: Story = {
  args: {
    children: 'Accessible Button',
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Check ARIA attributes
    await expect(button).not.toHaveAttribute('aria-disabled');

    // Check keyboard accessibility
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};
```

## Visual Testing

### Chromatic Setup

```bash
# Install Chromatic
pnpm add -D chromatic

# Run visual tests
pnpm chromatic --project-token=<your-token>
```

```json
// package.json
{
  "scripts": {
    "chromatic": "chromatic --exit-zero-on-changes"
  }
}
```

### Snapshot Testing

```tsx
// Button.test.tsx
import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';

import * as stories from './Button.stories';

const { Primary, Secondary, Disabled } = composeStories(stories);

test('Primary button matches snapshot', () => {
  const { container } = render(<Primary />);
  expect(container).toMatchSnapshot();
});

test('Secondary button matches snapshot', () => {
  const { container } = render(<Secondary />);
  expect(container).toMatchSnapshot();
});
```

### Delay for Animations

```tsx
export const WithAnimation: Story = {
  parameters: {
    chromatic: {
      delay: 500, // Wait 500ms before snapshot
    },
  },
};

// Pause animations for consistent snapshots
export const PausedAnimation: Story = {
  parameters: {
    chromatic: {
      pauseAnimationAtEnd: true,
    },
  },
};
```

## Performance Patterns

### Lazy Loading Stories

```tsx
// HeavyComponent.stories.tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export const Default: Story = {
  render: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  ),
};
```

### Virtual Scrolling

```tsx
// LargeList.stories.tsx
import { FixedSizeList } from 'react-window';

export const VirtualizedList: Story = {
  render: () => (
    <FixedSizeList height={400} itemCount={1000} itemSize={50} width="100%">
      {({ index, style }) => <div style={style}>Item {index + 1}</div>}
    </FixedSizeList>
  ),
};
```

## Best Practices Summary

✅ **DO:**

- Use render functions for stateful components
- Mock API calls with MSW
- Write interaction tests for critical flows
- Test keyboard navigation
- Use Chromatic for visual regression
- Lazy load heavy components

❌ **DON'T:**

- Put all state in args
- Make real API calls
- Skip accessibility testing
- Forget edge cases
- Ignore performance

## Resources

- [Storybook Interaction Testing](https://storybook.js.org/docs/writing-tests/interaction-testing)
- [MSW Storybook Addon](https://github.com/mswjs/msw-storybook-addon)
- [Chromatic Visual Testing](https://www.chromatic.com/)
