# Tailwind CSS Component Patterns

Production-ready component patterns used by professional frontend teams.

## Table of Contents

- [Button Components](#button-components)
- [Input & Form Components](#input--form-components)
- [Card Components](#card-components)
- [Navigation Components](#navigation-components)
- [Modal & Dialog](#modal--dialog)
- [List & Table Components](#list--table-components)
- [Badge & Tag Components](#badge--tag-components)
- [Loading States](#loading-states)

## Button Components

### Basic Button

```tsx
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-md font-medium',
      'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
        link: 'text-blue-600 underline-offset-4 hover:underline',
      }[variant],
      {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      }[size],
      className
    )}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

// Usage
<Button variant="primary" size="lg">Get Started</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="ghost">Menu</Button>
<Button variant="link">Learn More</Button>
```

### Icon Button

```tsx
const IconButton: React.FC<IconButtonProps> = ({ icon, label, ...props }) => (
  <button
    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    aria-label={label}
    {...props}
  >
    {icon}
  </button>
);

// Usage
<IconButton icon={<CloseIcon />} label="Close" onClick={handleClose} />
```

### Button with Icon

```tsx
const ButtonWithIcon: React.FC = ({ icon, children, iconPosition = 'left' }) => (
  <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
    {iconPosition === 'left' && icon}
    {children}
    {iconPosition === 'right' && icon}
  </button>
);

// Usage
<ButtonWithIcon icon={<PlusIcon />}>Add Item</ButtonWithIcon>
<ButtonWithIcon icon={<ArrowRightIcon />} iconPosition="right">
  Next
</ButtonWithIcon>
```

### Loading Button

```tsx
const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  disabled,
  ...props
}) => (
  <button
    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    )}
    {loading ? 'Loading...' : children}
  </button>
);

// Usage
<LoadingButton loading={isSubmitting}>Submit</LoadingButton>
```

## Input & Form Components

### Text Input

```tsx
const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <input
      className={cn(
        'block w-full rounded-md border px-3 py-2',
        'placeholder:text-gray-400',
        'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300',
        className
      )}
      {...props}
    />
    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);

// Usage
<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Password" type="password" error="Password is required" />
```

### Textarea

```tsx
const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  rows = 4,
  ...props
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <textarea
      rows={rows}
      className={cn(
        'block w-full rounded-md border border-gray-300 px-3 py-2',
        'placeholder:text-gray-400',
        'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
      )}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);
```

### Select

```tsx
const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  ...props
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <select
      className={cn(
        'block w-full rounded-md border border-gray-300 px-3 py-2',
        'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);
```

### Checkbox

```tsx
const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => (
  <label className="inline-flex cursor-pointer items-center">
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
      {...props}
    />
    {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
  </label>
);

// Usage
<Checkbox label="I agree to the terms and conditions" />
```

### Radio Group

```tsx
const RadioGroup: React.FC<RadioGroupProps> = ({ options, name, value, onChange }) => (
  <div className="space-y-2">
    {options.map((option) => (
      <label key={option.value} className="inline-flex cursor-pointer items-center">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
      </label>
    ))}
  </div>
);
```

## Card Components

### Basic Card

```tsx
const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('rounded-lg bg-white p-6 shadow-md', className)}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4 border-b border-gray-200 pb-4">{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-xl font-bold text-gray-900">{children}</h3>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-gray-600">{children}</div>
);

const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 border-t border-gray-200 pt-4">{children}</div>
);

// Usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Product Card

```tsx
const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
    {/* Image */}
    <div className="relative aspect-square overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
      {product.badge && (
        <span className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
          {product.badge}
        </span>
      )}
    </div>

    {/* Content */}
    <div className="p-4">
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {product.name}
      </h3>
      <p className="mb-4 line-clamp-2 text-sm text-gray-600">
        {product.description}
      </p>

      {/* Price & Button */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <Button size="sm">Add to Cart</Button>
      </div>
    </div>
  </div>
);
```

### Stats Card

```tsx
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
}) => (
  <div className="rounded-lg bg-white p-6 shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <p
            className={cn(
              'mt-2 flex items-center text-sm font-medium',
              change > 0 ? 'text-green-600' : 'text-red-600'
            )}
          >
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        )}
      </div>
      <div className="rounded-full bg-blue-100 p-3 text-blue-600">
        {icon}
      </div>
    </div>
  </div>
);
```

## Navigation Components

### Navbar

```tsx
const Navbar: React.FC = () => (
  <nav className="border-b border-gray-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <a href="/" className="text-gray-700 hover:text-gray-900">
            Home
          </a>
          <a href="/about" className="text-gray-700 hover:text-gray-900">
            About
          </a>
          <a href="/contact" className="text-gray-700 hover:text-gray-900">
            Contact
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Button variant="ghost">Sign In</Button>
          <Button>Sign Up</Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden">
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  </nav>
);
```

### Tabs

```tsx
const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <div className="border-b border-gray-200">
    <nav className="-mb-px flex gap-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'border-b-2 px-1 py-4 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

// Usage
<Tabs
  tabs={[
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

### Breadcrumbs

```tsx
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <nav className="flex" aria-label="Breadcrumb">
    <ol className="flex items-center gap-2">
      {items.map((item, index) => (
        <li key={item.href} className="flex items-center gap-2">
          {index > 0 && (
            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>
          )}
          {index === items.length - 1 ? (
            <span className="text-sm font-medium text-gray-500">
              {item.label}
            </span>
          ) : (
            <a
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
```

## Modal & Dialog

### Modal

```tsx
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

// Usage
<Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action">
  <p className="mb-4 text-gray-600">
    Are you sure you want to proceed?
  </p>
  <div className="flex justify-end gap-2">
    <Button variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </div>
</Modal>
```

### Alert Dialog

```tsx
const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'warning',
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="space-y-4">
      {/* Icon */}
      <div
        className={cn(
          'mx-auto flex h-12 w-12 items-center justify-center rounded-full',
          variant === 'warning' && 'bg-yellow-100',
          variant === 'danger' && 'bg-red-100'
        )}
      >
        <WarningIcon
          className={cn(
            'h-6 w-6',
            variant === 'warning' && 'text-yellow-600',
            variant === 'danger' && 'text-red-600'
          )}
        />
      </div>

      {/* Description */}
      <p className="text-center text-gray-600">{description}</p>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          variant={variant === 'danger' ? 'destructive' : 'primary'}
          onClick={onConfirm}
          className="flex-1"
        >
          Confirm
        </Button>
      </div>
    </div>
  </Modal>
);
```

## List & Table Components

### Simple List

```tsx
const List: React.FC<ListProps> = ({ items }) => (
  <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
    {items.map((item) => (
      <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </div>
      </li>
    ))}
  </ul>
);
```

### Table

```tsx
const Table: React.FC<TableProps> = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50">
            {columns.map((column) => (
              <td
                key={column.key}
                className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
              >
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

## Badge & Tag Components

### Badge

```tsx
const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
      }[variant]
    )}
  >
    {children}
  </span>
);

// Usage
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Inactive</Badge>
```

### Tag (Removable)

```tsx
const Tag: React.FC<TagProps> = ({ children, onRemove }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
    {children}
    {onRemove && (
      <button
        onClick={onRemove}
        className="text-blue-600 hover:text-blue-800"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    )}
  </span>
);
```

## Loading States

### Spinner

```tsx
const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => (
  <svg
    className={cn(
      'animate-spin',
      { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }[size]
    )}
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);
```

### Skeleton

```tsx
const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-gray-200',
      className
    )}
  />
);

// Usage - Loading card
<div className="rounded-lg bg-white p-6 shadow-md">
  <Skeleton className="mb-4 h-6 w-3/4" />
  <Skeleton className="mb-2 h-4 w-full" />
  <Skeleton className="h-4 w-2/3" />
</div>
```

## Next Steps

- [Responsive Design](./04-responsive-design.md)
- [Advanced Techniques](./05-advanced-techniques.md)
