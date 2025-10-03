# Design Principles

Core principles that guide design decisions and ensure consistency across the
design system.

## Table of Contents

- [Foundational Principles](#foundational-principles)
- [Visual Design Principles](#visual-design-principles)
- [Interaction Principles](#interaction-principles)
- [Content Principles](#content-principles)
- [Motion Principles](#motion-principles)
- [Accessibility Principles](#accessibility-principles)
- [Practical Application](#practical-application)

## Foundational Principles

### 1. Consistency Over Perfection

**Principle:** A consistent "good enough" solution used everywhere is better
than a perfect solution used inconsistently.

**Why it matters:**

- Users learn patterns once, apply everywhere
- Reduces cognitive load
- Faster development
- Easier maintenance

**Application:**

```tsx
// ✅ Good - Consistent button usage
<Button variant="primary">Submit</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">More Options</Button>

// ❌ Bad - Inconsistent implementations
<button style={{ background: 'linear-gradient(...)' }}>Submit</button>
<a className="button-like-link">Cancel</a>
<div onClick={...} className="clickable">More</div>
```

**Real Example (Airbnb):**

- All property cards follow the same layout
- Consistent photo aspect ratios
- Uniform spacing and typography
- Same hover states across platform

### 2. Clarity Over Cleverness

**Principle:** Clear, obvious designs are better than clever, subtle ones.

**Why it matters:**

- Reduces user confusion
- Faster task completion
- Lower support costs
- Better accessibility

**Application:**

```tsx
// ✅ Good - Clear button label
<Button variant="destructive">
  Delete Account
</Button>

// ❌ Bad - Clever but unclear
<Button variant="danger">
  💥 Nuke It
</Button>

// ✅ Good - Clear error message
<Alert variant="error">
  Password must be at least 8 characters
</Alert>

// ❌ Bad - Too clever
<Alert variant="error">
  Oops! That password is too smol 🙈
</Alert>
```

### 3. Progressive Disclosure

**Principle:** Show simple options first, reveal complexity as needed.

**Why it matters:**

- Doesn't overwhelm beginners
- Powerful for advanced users
- Scalable complexity

**Application:**

```tsx
// Simple case - just works
<Button>Click me</Button>

// Medium complexity - common customization
<Button variant="primary" size="lg">
  Get Started
</Button>

// Advanced - full control when needed
<Button
  variant="primary"
  size="lg"
  leftIcon={<PlusIcon />}
  isLoading={loading}
  loadingText="Creating..."
  onClick={handleClick}
  aria-label="Create new project"
  className="w-full"
>
  Create Project
</Button>
```

### 4. Flexibility Within Constraints

**Principle:** Provide options, but limit choices to maintain consistency.

**Why it matters:**

- Prevents decision paralysis
- Maintains design integrity
- Allows necessary customization

**Application:**

```tsx
// ✅ Good - Constrained options
<Button
  variant="primary" // Limited to: primary, secondary, ghost
  size="lg"         // Limited to: sm, md, lg
  className="w-full" // Allow layout customization
>

// ❌ Bad - Too flexible (breaks system)
<Button
  style={{
    background: 'linear-gradient(...)', // Custom gradient
    borderRadius: '13px',               // Arbitrary radius
    padding: '17px 23px',              // Random spacing
  }}
>
```

**Real Example (Shopify Polaris):**

- Button variants: Primary, Secondary, Plain, Destructive (4 options)
- Button sizes: Small, Medium, Large (3 options)
- Allows className for layout (flex, width, margin)
- Doesn't allow style prop (prevents breaking system)

## Visual Design Principles

### 1. Hierarchy Through Scale

**Principle:** Use size, weight, and color to establish visual hierarchy.

**Application:**

```tsx
// ✅ Good - Clear hierarchy
<Stack spacing={6}>
  <h1 className="text-5xl font-bold text-gray-900">
    Main Heading
  </h1>
  <h2 className="text-3xl font-semibold text-gray-800">
    Subheading
  </h2>
  <p className="text-base text-gray-600">
    Body text with lower visual weight
  </p>
  <p className="text-sm text-gray-500">
    Supporting text
  </p>
</Stack>

// ❌ Bad - No hierarchy
<div>
  <p className="text-base">Main Heading</p>
  <p className="text-base">Subheading</p>
  <p className="text-base">Body text</p>
</div>
```

### 2. Whitespace as a Design Element

**Principle:** Use spacing intentionally to group related elements and separate
unrelated ones.

**Application:**

```tsx
// ✅ Good - Intentional spacing
<Card className="p-6">
  {/* Tight spacing for related elements */}
  <div className="space-y-2">
    <h3 className="text-xl font-bold">Card Title</h3>
    <p className="text-sm text-gray-600">Subtitle</p>
  </div>

  {/* Medium spacing for section break */}
  <div className="mt-6 space-y-4">
    <p>Content paragraph 1</p>
    <p>Content paragraph 2</p>
  </div>

  {/* Large spacing before footer */}
  <div className="mt-8 border-t pt-4">
    <Button>Action</Button>
  </div>
</Card>

// ❌ Bad - Uniform spacing everywhere
<Card className="p-4">
  <div className="mb-4">
    <h3>Card Title</h3>
  </div>
  <div className="mb-4">
    <p>Subtitle</p>
  </div>
  <div className="mb-4">
    <p>Content 1</p>
  </div>
  <div className="mb-4">
    <Button>Action</Button>
  </div>
</Card>
```

**Spacing Scale (Airbnb-inspired):**

- **0-8px**: Tight (related elements like label + input)
- **12-16px**: Normal (between form fields)
- **24-32px**: Loose (between sections)
- **48-64px**: Section breaks (major content divisions)

### 3. Color with Purpose

**Principle:** Every color should have a clear semantic meaning.

**Color Roles:**

```tsx
// Brand colors - Recognition
brand: {
  primary: '#FF5A5F',    // Main brand actions
  secondary: '#00A699',  // Supporting brand elements
}

// Semantic colors - Communication
semantic: {
  success: '#00A699',    // Positive actions/states
  warning: '#FFC107',    // Caution/attention
  error: '#E74C3C',      // Errors/destructive actions
  info: '#3498DB',       // Informational
}

// Neutral colors - Structure
neutral: {
  white: '#FFFFFF',      // Background
  gray: {...},           // Borders, dividers, muted text
  black: '#000000',      // Primary text
}
```

**Application:**

```tsx
// ✅ Good - Colors convey meaning
<Alert variant="error">
  <p className="text-red-900">Failed to save changes</p>
</Alert>

<Button variant="primary" className="bg-brand-primary">
  Book Now
</Button>

<Badge className="bg-green-100 text-green-800">
  Available
</Badge>

// ❌ Bad - Random colors
<Alert className="bg-purple-100">
  <p className="text-orange-600">Something happened</p>
</Alert>
```

### 4. Alignment Creates Order

**Principle:** Align elements to create visual connections and organization.

```tsx
// ✅ Good - Aligned elements
<div className="grid grid-cols-2 gap-6">
  <div>
    <label className="block text-sm font-medium">Name</label>
    <Input />
  </div>
  <div>
    <label className="block text-sm font-medium">Email</label>
    <Input />
  </div>
</div>

// ❌ Bad - Misaligned
<div className="flex gap-4">
  <div>
    <label>Name</label>
    <Input className="mt-1" />
  </div>
  <div className="mt-2">
    <label>Email</label>
    <Input className="mt-3" />
  </div>
</div>
```

## Interaction Principles

### 1. Immediate Feedback

**Principle:** Provide instant visual feedback for all user actions.

**Application:**

```tsx
// ✅ Good - Clear feedback states
<Button
  className="
    bg-blue-600 text-white
    hover:bg-blue-700
    active:bg-blue-800
    focus:ring-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-150
  "
>
  Submit
</Button>

// Loading state
<Button isLoading>
  <Spinner className="mr-2" />
  Processing...
</Button>

// Success state (temporary)
<Button className="bg-green-600">
  <CheckIcon className="mr-2" />
  Saved!
</Button>
```

### 2. Prevent Errors, Don't Just Report Them

**Principle:** Design to prevent mistakes before they happen.

**Application:**

```tsx
// ✅ Good - Prevent invalid input
<Input
  type="email"
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  aria-invalid={!isValidEmail}
  onChange={(e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(validateEmail(value));
  }}
/>

// Disable submit until valid
<Button
  disabled={!isValidEmail || !agreedToTerms}
  title={!isValidEmail ? 'Please enter a valid email' : ''}
>
  Sign Up
</Button>

// ❌ Bad - Allow invalid submission
<Button onClick={() => {
  if (!isValidEmail) {
    alert('Invalid email!'); // After the fact
  }
}}>
  Sign Up
</Button>
```

### 3. Predictable Behavior

**Principle:** Components should behave consistently across the application.

**Application:**

```tsx
// ✅ Good - Consistent close behavior
// Modals always close with:
// - X button
// - Escape key
// - Clicking backdrop
// - Save/Cancel buttons

<Modal
  isOpen={isOpen}
  onClose={handleClose} // All close actions use this
>
  <Modal.Header>
    <h2>Edit Profile</h2>
    <CloseButton onClick={handleClose} />
  </Modal.Header>
  <Modal.Body>...</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
    <Button onClick={handleSaveAndClose}>Save</Button>
  </Modal.Footer>
</Modal>

// ❌ Bad - Inconsistent behavior
// Some modals close with Escape, some don't
// Some have X button, some don't
// Some close on backdrop click, some don't
```

### 4. Forgiving Design

**Principle:** Make it easy to undo mistakes.

**Application:**

```tsx
// ✅ Good - Confirmation before destructive action
const handleDelete = async () => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Account?',
    description: 'This action cannot be undone.',
    confirmText: 'Delete',
    confirmVariant: 'destructive',
  });

  if (confirmed) {
    // Show undo toast
    const { undo } = showToast({
      message: 'Account deleted',
      action: {
        label: 'Undo',
        onClick: handleUndoDelete,
      },
      duration: 5000,
    });
  }
};

// ❌ Bad - Immediate destruction
<Button onClick={() => deleteAccount()}>Delete</Button>;
```

## Content Principles

### 1. Concise and Scannable

**Principle:** Users scan, they don't read. Make content scannable.

**Application:**

```tsx
// ✅ Good - Scannable content
<Card>
  <CardHeader>
    <CardTitle>Premium Plan</CardTitle>
    <CardDescription>Best for teams</CardDescription>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2">
      <li className="flex items-center">
        <CheckIcon className="mr-2" />
        <span className="font-medium">Unlimited projects</span>
      </li>
      <li className="flex items-center">
        <CheckIcon className="mr-2" />
        <span className="font-medium">Priority support</span>
      </li>
    </ul>
  </CardContent>
  <CardFooter>
    <Button>Get Started</Button>
  </CardFooter>
</Card>

// ❌ Bad - Wall of text
<Card>
  <p>
    Our Premium Plan is designed for teams who need unlimited projects
    and want to get the most out of our platform with priority support
    and advanced features that will help your team collaborate better...
  </p>
</Card>
```

### 2. Action-Oriented Language

**Principle:** Use verbs that describe the action, not the component.

**Application:**

```tsx
// ✅ Good - Clear action
<Button>Save Changes</Button>
<Button>Delete Account</Button>
<Button>Get Started</Button>
<Link>View Details</Link>

// ❌ Bad - Generic or passive
<Button>Submit</Button>
<Button>Click Here</Button>
<Button>OK</Button>
<Link>More</Link>
```

### 3. Contextual Help

**Principle:** Provide help where and when it's needed.

**Application:**

```tsx
// ✅ Good - Contextual guidance
<FormField>
  <Label>
    API Key
    <Tooltip content="Find this in your account settings">
      <InfoIcon className="ml-1 h-4 w-4" />
    </Tooltip>
  </Label>
  <Input
    placeholder="sk_live_..."
    helperText="Your secret key is used to authenticate API requests"
  />
</FormField>

// ❌ Bad - No context
<FormField>
  <Label>API Key</Label>
  <Input />
</FormField>
```

## Motion Principles

### 1. Motion with Purpose

**Principle:** Animate to communicate, not to decorate.

**Purpose of Motion:**

- **Feedback**: Confirm action (button press)
- **Guidance**: Direct attention (highlight changed field)
- **Relationship**: Show spatial connections (menu from button)
- **Continuity**: Smooth transitions between states

**Application:**

```tsx
// ✅ Good - Purposeful motion
// Feedback: Button responds to interaction
<button className="transform transition-transform active:scale-95">
  Click me
</button>

// Guidance: Error field gets attention
<Input
  error={error}
  className={error && 'animate-shake'}
/>

// Relationship: Dropdown comes from button
<Dropdown
  className="origin-top-right animate-in fade-in slide-in-from-top-2"
>

// ❌ Bad - Distracting motion
<div className="animate-bounce animate-infinite">
  Welcome! {/* Constantly bouncing = annoying */}
</div>
```

### 2. Fast and Subtle

**Principle:** Animations should be quick and understated.

**Timing Guidelines:**

- **Micro-interactions**: 100-150ms (hover, focus)
- **Small transitions**: 200-300ms (component state changes)
- **Page transitions**: 300-500ms (route changes)
- **Never exceed**: 500ms (feels slow)

```tsx
// ✅ Good - Fast transitions
<Button className="transition-colors duration-150">
  Hover me
</Button>

<Card className="transition-shadow duration-200 hover:shadow-lg">
  Card
</Card>

// ❌ Bad - Too slow
<Button className="transition-all duration-1000">
  Hover me (too slow!)
</Button>
```

### 3. Respect User Preferences

**Principle:** Honor system preferences for reduced motion.

```tsx
// Respect prefers-reduced-motion
<div className="transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100">
  Content
</div>;

// In Tailwind config
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  variants: {
    extend: {
      transitionProperty: ['motion-reduce'],
    },
  },
};
```

## Accessibility Principles

### 1. Keyboard Navigation

**Principle:** All interactive elements must be keyboard accessible.

```tsx
// ✅ Good - Fully keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  className="focus:ring-2 focus:ring-brand-primary focus:outline-none"
>
  Interactive Element
</button>

// ❌ Bad - Only works with mouse
<div onClick={handleClick}>
  Not keyboard accessible
</div>
```

### 2. Focus Management

**Principle:** Always show clear focus indicators and manage focus
appropriately.

```tsx
// ✅ Good - Clear focus states
<Input className="focus:border-brand-primary focus:ring-brand-primary focus:ring-2 focus:ring-offset-2" />;

// Modal opens → Focus first input
useEffect(() => {
  if (isOpen) {
    firstInputRef.current?.focus();
  }
}, [isOpen]);

// Modal closes → Return focus to trigger
const handleClose = () => {
  setIsOpen(false);
  triggerRef.current?.focus();
};
```

### 3. Color Is Not the Only Indicator

**Principle:** Don't rely solely on color to convey information.

```tsx
// ✅ Good - Multiple indicators
<Alert variant="error">
  <AlertIcon className="h-5 w-5" /> {/* Icon */}
  <div>
    <AlertTitle>Error</AlertTitle> {/* Text label */}
    <AlertDescription className="text-red-900"> {/* Color */}
      Failed to save changes
    </AlertDescription>
  </div>
</Alert>

// ❌ Bad - Color only
<div className="bg-red-100">
  Failed to save
</div>
```

## Practical Application

### Decision Framework

When designing a new component or pattern, ask:

1. **Is it consistent?** Does it follow existing patterns?
2. **Is it clear?** Will users understand it immediately?
3. **Is it accessible?** Can everyone use it?
4. **Is it necessary?** Does it solve a real problem?
5. **Is it scalable?** Will it work at any size/context?

### Example: Designing a New Alert Component

```tsx
// Apply principles:

// 1. Consistency - Follow existing variant pattern
variant: 'info' | 'success' | 'warning' | 'error'

// 2. Clarity - Clear semantic colors and icons
<Alert variant="error">
  <ErrorIcon />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Clear message</AlertDescription>
</Alert>

// 3. Accessibility - Proper ARIA, keyboard closable
<Alert role="alert" aria-live="polite">
  ...
  <CloseButton
    onClick={onClose}
    aria-label="Close alert"
    onKeyDown={handleKeyDown}
  />
</Alert>

// 4. Flexibility within constraints - Allow composition
<Alert>
  <AlertIcon />
  <AlertContent>
    {/* Flexible content */}
  </AlertContent>
  <AlertActions>
    <Button>Action</Button>
  </AlertActions>
</Alert>

// 5. Motion with purpose - Entrance animation
<Alert className="animate-in slide-in-from-top-2 fade-in">
```

## Next Steps

- [Accessibility](./05-accessibility.md)
- Review these principles before designing new components
- Use this as a checklist during design reviews
- Share with team to align on standards

## Resources

- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)
- [Material Design Principles](https://material.io/design/foundation-overview)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Laws of UX](https://lawsofux.com/)
