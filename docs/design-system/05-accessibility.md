# Accessibility (A11y)

Build inclusive products that everyone can use, following WCAG 2.1 AA standards
and industry best practices.

## Table of Contents

- [Why Accessibility Matters](#why-accessibility-matters)
- [WCAG Principles (POUR)](#wcag-principles-pour)
- [Keyboard Navigation](#keyboard-navigation)
- [Screen Readers](#screen-readers)
- [Color & Contrast](#color--contrast)
- [Focus Management](#focus-management)
- [ARIA Attributes](#aria-attributes)
- [Forms Accessibility](#forms-accessibility)
- [Testing Accessibility](#testing-accessibility)

## Why Accessibility Matters

### The Numbers

- **15% of the world** has some form of disability (WHO)
- **1 in 4 adults in the US** has a disability (CDC)
- **71% of users with disabilities** will leave a website that is difficult to
  use
- **Legal requirement** in many countries (ADA, Section 508, AODA)

### Business Impact

**Larger Audience**

- 15% more potential customers
- Better SEO (accessible sites rank higher)
- Improved usability for everyone

**Legal Protection**

- Avoid lawsuits (Target: $6M, Domino's: $4M)
- Compliance with regulations
- Corporate reputation

**Better UX for All**

- Captions help in noisy environments
- Keyboard navigation is faster for power users
- High contrast helps in bright sunlight

## WCAG Principles (POUR)

### 1. Perceivable

Information must be presentable to users in ways they can perceive.

**Requirements:**

- Text alternatives for images
- Captions for videos
- Content adaptable to different formats
- Sufficient color contrast

**Application:**

```tsx
// ✅ Good - Perceivable image
<img
  src="/product.jpg"
  alt="Red running shoes with white laces, size 10"
/>

// ❌ Bad - Missing alt text
<img src="/product.jpg" />

// ✅ Good - Decorative image (empty alt)
<img src="/decorative-line.svg" alt="" />

// ✅ Good - High contrast text
<p className="text-gray-900 bg-white"> {/* 21:1 ratio */}
  Body text
</p>

// ❌ Bad - Low contrast
<p className="text-gray-400 bg-white"> {/* 2.5:1 ratio */}
  Hard to read
</p>
```

### 2. Operable

User interface components must be operable.

**Requirements:**

- Keyboard accessible
- Enough time to read/use content
- No seizure-inducing content
- Easy navigation

**Application:**

```tsx
// ✅ Good - Keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Submit
</button>

// ❌ Bad - Mouse only
<div onClick={handleClick}>
  Not keyboard accessible
</div>

// ✅ Good - Skip navigation link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### 3. Understandable

Information and operation must be understandable.

**Requirements:**

- Readable text
- Predictable functionality
- Input assistance

**Application:**

```tsx
// ✅ Good - Clear error messages
<Input
  type="email"
  error="Please enter a valid email address (e.g., name@example.com)"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" className="text-red-600">
  Please enter a valid email address (e.g., name@example.com)
</span>

// ❌ Bad - Vague error
<Input error="Invalid" />

// ✅ Good - Clear button labels
<Button>Save Changes</Button>
<Button>Delete Account</Button>

// ❌ Bad - Ambiguous labels
<Button>Submit</Button>
<Button>OK</Button>
```

### 4. Robust

Content must be robust enough to be interpreted by assistive technologies.

**Requirements:**

- Valid HTML
- Compatible with assistive technologies
- Semantic HTML

**Application:**

```tsx
// ✅ Good - Semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>

<footer>
  <p>&copy; 2024 Company</p>
</footer>

// ❌ Bad - Non-semantic
<div class="nav">
  <div class="link">Home</div>
  <div class="link">About</div>
</div>

<div class="content">
  <div class="title">Article Title</div>
  <div class="text">Content...</div>
</div>
```

## Keyboard Navigation

### Tab Order

```tsx
// ✅ Good - Logical tab order
<form>
  <Input name="firstName" />      {/* Tab index 1 */}
  <Input name="lastName" />        {/* Tab index 2 */}
  <Input name="email" />           {/* Tab index 3 */}
  <Button type="submit">Submit</Button> {/* Tab index 4 */}
</form>

// ❌ Bad - Broken tab order with tabIndex
<form>
  <Input name="email" tabIndex={1} />
  <Button type="submit" tabIndex={3}>Submit</Button>
  <Input name="firstName" tabIndex={2} />
</form>
```

### Keyboard Shortcuts

```tsx
const handleKeyPress = (e: KeyboardEvent) => {
  // Enter or Space = Activate
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }

  // Escape = Close
  if (e.key === 'Escape') {
    handleClose();
  }

  // Arrow keys for navigation
  if (e.key === 'ArrowDown') {
    focusNext();
  }
  if (e.key === 'ArrowUp') {
    focusPrevious();
  }
};

// Standard keyboard shortcuts
// Tab: Next element
// Shift+Tab: Previous element
// Enter/Space: Activate button/link
// Escape: Close modal/dropdown
// Arrow keys: Navigate lists/menus
// Home: First item
// End: Last item
```

### Focus Trap (Modal)

```tsx
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus first focusable element
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

    firstElement?.focus();

    // Trap focus inside modal
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      {children}
    </div>
  );
};
```

## Screen Readers

### Screen Reader Only Content

```tsx
// Visually hidden but available to screen readers
<span className="sr-only">
  Loading data, please wait
</span>

// Tailwind CSS sr-only class
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Descriptive Text

```tsx
// ✅ Good - Descriptive for screen readers
<button>
  <TrashIcon className="h-5 w-5" />
  <span className="sr-only">Delete item</span>
</button>

// Alternative with aria-label
<button aria-label="Delete item">
  <TrashIcon className="h-5 w-5" />
</button>

// ❌ Bad - No description
<button>
  <TrashIcon />
</button>
```

### Live Regions

```tsx
// Announce dynamic content changes
<div aria-live="polite" aria-atomic="true">
  {message}
</div>;

// aria-live values:
// - off: Don't announce (default)
// - polite: Announce when user is idle
// - assertive: Interrupt and announce immediately

// Example: Form validation
const [error, setError] = useState('');

<form>
  <Input onChange={validate} />

  <div role="alert" aria-live="assertive">
    {error}
  </div>
</form>;
```

## Color & Contrast

### WCAG Contrast Requirements

**Level AA (Minimum):**

- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

**Level AAA (Enhanced):**

- Normal text: 7:1
- Large text: 4.5:1

### Checking Contrast

```tsx
// ✅ Good - High contrast (21:1)
<p className="text-gray-900 bg-white">
  Black text on white background
</p>

// ✅ Good - Meets AA (4.52:1)
<p className="text-gray-700 bg-white">
  Dark gray text on white
</p>

// ⚠️ Caution - Borderline (4.5:1)
<p className="text-gray-600 bg-white">
  Medium gray text
</p>

// ❌ Bad - Fails AA (2.8:1)
<p className="text-gray-400 bg-white">
  Light gray text - hard to read
</p>
```

### Tools for Checking Contrast

```bash
# Browser extensions
- WAVE (Web Accessibility Evaluation Tool)
- axe DevTools
- Lighthouse (Chrome DevTools)

# Online tools
- WebAIM Contrast Checker
- Colorable
- Contrast Ratio by Lea Verou

# Design tools
- Figma plugins: Stark, A11y - Color Contrast Checker
```

### Don't Rely on Color Alone

```tsx
// ✅ Good - Multiple indicators
<Alert variant="error">
  <AlertIcon className="text-red-600"> {/* Icon */}
    <ExclamationIcon />
  </AlertIcon>
  <AlertTitle>Error</AlertTitle> {/* Text label */}
  <AlertDescription className="text-red-900"> {/* Color */}
    Failed to save changes
  </AlertDescription>
</Alert>

// Form field states
<Input
  error="Required field" // Text
  className="border-red-500" // Color
  aria-invalid="true" // Screen reader
  leftAddon={<ErrorIcon />} // Icon
/>

// ❌ Bad - Color only
<div className="text-red-600">
  Error (color is the only indicator)
</div>
```

## Focus Management

### Visible Focus Indicators

```tsx
// ✅ Good - Clear focus ring
<button className="
  rounded-md bg-blue-600 px-4 py-2 text-white
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:ring-offset-2
">
  Button with visible focus
</button>

// ✅ Good - Different focus for keyboard vs mouse
<button className="
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-blue-500
">
  Only shows focus on keyboard navigation
</button>

// ❌ Bad - No focus indicator
<button className="focus:outline-none">
  No visible focus
</button>
```

### Focus Order

```tsx
// ✅ Good - Logical focus order
<form>
  {/* Focus flows naturally top to bottom */}
  <Input name="name" />
  <Input name="email" />
  <Checkbox label="Subscribe" />
  <Button type="submit">Submit</Button>
</form>

// ❌ Bad - Illogical focus order
<form>
  <Button type="submit" />     {/* Jumps to submit first */}
  <Input name="name" />
  <Input name="email" />
</form>
```

### Managing Focus Programmatically

```tsx
// Focus management example
const Modal: React.FC = ({ isOpen, onClose }) => {
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Move focus to modal
      firstFocusableRef.current?.focus();
    } else {
      // Return focus to previous element
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div role="dialog" aria-modal="true">
      <button ref={firstFocusableRef} onClick={onClose}>
        Close
      </button>
      {/* Modal content */}
    </div>
  );
};
```

## ARIA Attributes

### Common ARIA Attributes

```tsx
// Roles
role="button"          // Identifies element purpose
role="navigation"
role="dialog"
role="alert"
role="tab"
role="tabpanel"

// States
aria-expanded="true"   // Expandable element state
aria-selected="true"   // Selected state
aria-checked="true"    // Checkbox/radio state
aria-disabled="true"   // Disabled state
aria-hidden="true"     // Hide from screen readers

// Properties
aria-label="Close"     // Accessible name
aria-labelledby="id"   // Reference to label
aria-describedby="id"  // Reference to description
aria-live="polite"     // Live region
aria-required="true"   // Required field
aria-invalid="true"    // Validation state
```

### ARIA Examples

```tsx
// Button with icon
<button aria-label="Delete item">
  <TrashIcon />
</button>

// Expandable section
<button
  aria-expanded={isOpen}
  aria-controls="content-1"
  onClick={() => setIsOpen(!isOpen)}
>
  Toggle Content
</button>
<div id="content-1" hidden={!isOpen}>
  Content
</div>

// Tab interface
<div role="tablist">
  <button
    role="tab"
    aria-selected={activeTab === 0}
    aria-controls="panel-0"
    id="tab-0"
  >
    Tab 1
  </button>
</div>
<div
  role="tabpanel"
  id="panel-0"
  aria-labelledby="tab-0"
  hidden={activeTab !== 0}
>
  Panel 1 content
</div>

// Form field with error
<div>
  <label htmlFor="email-input">Email</label>
  <input
    id="email-input"
    type="email"
    aria-invalid={!!error}
    aria-describedby="email-error"
  />
  {error && (
    <span id="email-error" role="alert">
      {error}
    </span>
  )}
</div>
```

## Forms Accessibility

### Labels

```tsx
// ✅ Good - Explicit label
<label htmlFor="email-input">Email Address</label>
<input id="email-input" type="email" />

// ✅ Good - Implicit label
<label>
  Email Address
  <input type="email" />
</label>

// ✅ Good - aria-label when visual label isn't possible
<input type="search" aria-label="Search products" />

// ❌ Bad - No label
<input type="email" placeholder="Email" /> {/* Placeholder is not a label */}
```

### Error Messages

```tsx
// ✅ Good - Accessible error message
<div>
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    aria-invalid={!!error}
    aria-describedby="password-error password-requirements"
  />

  {/* Requirements (always visible) */}
  <p id="password-requirements" className="text-sm text-gray-600">
    Must be at least 8 characters
  </p>

  {/* Error (conditionally visible) */}
  {error && (
    <p id="password-error" role="alert" className="text-sm text-red-600">
      {error}
    </p>
  )}
</div>
```

### Required Fields

```tsx
// ✅ Good - Multiple indicators
<label htmlFor="name-input">
  Full Name
  <span className="text-red-500" aria-label="required">*</span>
</label>
<input
  id="name-input"
  type="text"
  required
  aria-required="true"
/>

// Form instructions
<p id="form-instructions">
  Fields marked with * are required
</p>
<form aria-describedby="form-instructions">
  {/* Form fields */}
</form>
```

## Testing Accessibility

### Automated Testing

```bash
# Install testing tools
pnpm add -D @axe-core/react
pnpm add -D jest-axe
```

```tsx
// Automated accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

**Keyboard Testing:**

1. Unplug your mouse
2. Navigate using Tab, Shift+Tab, Enter, Escape, Arrow keys
3. Ensure all functionality is accessible
4. Check focus indicators are visible

**Screen Reader Testing:**

- **Mac**: VoiceOver (Cmd+F5)
- **Windows**: NVDA (free) or JAWS
- **Mobile**: TalkBack (Android) or VoiceOver (iOS)

**Color Blind Testing:**

- Use browser extensions (Colorblinding, NoCoffee)
- Test in grayscale mode
- Check contrast ratios

### Accessibility Checklist

- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All functionality works with keyboard
- [ ] Focus indicators are visible
- [ ] Forms have labels
- [ ] Error messages are clear and associated with fields
- [ ] Page has proper heading hierarchy (h1 → h2 → h3)
- [ ] Interactive elements have focus states
- [ ] Links have descriptive text (not "click here")
- [ ] Buttons have clear labels
- [ ] Content works with zoom up to 200%
- [ ] No motion for users with motion sensitivity
- [ ] ARIA attributes are used correctly
- [ ] Screen reader can access all content
- [ ] Page is usable in high contrast mode

## Resources

### Guidelines

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Learning

- [WebAIM](https://webaim.org/)
- [A11ycasts (YouTube)](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g)
- [The A11y Project](https://www.a11yproject.com/)

---

**Remember:** Accessibility is not a feature, it's a requirement. Build it in
from the start, not as an afterthought.
