# Form Actions in Next.js

Complete guide to handling forms in Next.js 15 using Server Actions, Form Actions, and modern React patterns.

## Table of Contents

- [Overview](#overview)
- [Server Actions](#server-actions)
- [Form Actions](#form-actions)
- [Progressive Enhancement](#progressive-enhancement)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Loading States](#loading-states)
- [Revalidation](#revalidation)
- [Best Practices](#best-practices)

## Overview

Next.js 15 provides multiple ways to handle forms:

1. **Server Actions** - Server-side functions that can be called directly from forms
2. **Form Actions** - React 19 form action prop with enhanced capabilities
3. **API Routes** - Traditional approach using API endpoints
4. **Client-side** - Standard React form handling

## Server Actions

Server Actions are asynchronous functions that run on the server and can be invoked directly from Client or Server Components.

### Basic Server Action

```tsx
// app/actions.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // Perform server-side operations
  const user = await db.user.create({
    data: { name, email },
  });

  return { success: true, user };
}
```

### Using in Server Component

```tsx
// app/page.tsx
import { createUser } from './actions';

export default function Page() {
  return (
    <form action={createUser}>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <button type="submit">Create User</button>
    </form>
  );
}
```

### Using in Client Component

```tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { createUser } from './actions';

// app/form.tsx

export function UserForm() {
  const [state, formAction] = useFormState(createUser, { success: false });

  return (
    <form action={formAction}>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <SubmitButton />
      {state?.success && <p>User created successfully!</p>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create User'}
    </button>
  );
}
```

## Form Actions

React 19 introduces the `action` prop for forms, providing native support for async functions.

### Basic Form Action

```tsx
'use client';

import { useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState('');

  async function handleSubmit(formData: FormData) {
    const data = {
      name: formData.get('name'),
      message: formData.get('message'),
    };

    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setStatus('Message sent!');
    }
  }

  return (
    <form action={handleSubmit}>
      <input type="text" name="name" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
      {status && <p>{status}</p>}
    </form>
  );
}
```

### Combining with useFormState

```tsx
'use client';

import { useFormState } from 'react-dom';

import { submitContact } from './actions';

const initialState = {
  message: '',
  errors: {},
};

export function ContactForm() {
  const [state, formAction] = useFormState(submitContact, initialState);

  return (
    <form action={formAction}>
      <input type="text" name="name" />
      {state.errors?.name && <span>{state.errors.name}</span>}

      <input type="email" name="email" />
      {state.errors?.email && <span>{state.errors.email}</span>}

      <button type="submit">Submit</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

## Progressive Enhancement

Forms work without JavaScript enabled using Server Actions.

### Progressive Form Example

```tsx
// app/subscribe/page.tsx
import { subscribe } from './actions';

export default function SubscribePage() {
  return (
    <form action={subscribe}>
      <input type="email" name="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}
```

```tsx
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// app/subscribe/actions.ts

export async function subscribe(formData: FormData) {
  const email = formData.get('email') as string;

  await db.newsletter.create({
    data: { email },
  });

  revalidatePath('/subscribe');
  redirect('/subscribe/success');
}
```

### Enhanced Progressive Form

```tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { subscribe } from './actions';

export function SubscribeForm() {
  const [state, formAction] = useFormState(subscribe, null);

  return (
    <form action={formAction}>
      <input
        type="email"
        name="email"
        required
        aria-describedby={state?.error ? 'error' : undefined}
      />
      <SubmitButton />
      {state?.error && (
        <p id="error" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && <p role="status">Subscribed successfully!</p>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Subscribing...' : 'Subscribe'}
    </button>
  );
}
```

## Validation

### Server-side Validation with Zod

```tsx
'use server';

import { z } from 'zod';

// app/actions.ts

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().min(18, 'Must be 18 or older'),
});

export async function createUser(prevState: any, formData: FormData) {
  const validatedFields = userSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    age: formData.get('age'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }

  const { name, email, age } = validatedFields.data;

  await db.user.create({
    data: { name, email, age },
  });

  return { message: 'User created successfully' };
}
```

### Form with Validation Display

```tsx
'use client';

import { useFormState } from 'react-dom';

import { createUser } from './actions';

const initialState = {
  message: '',
  errors: {},
};

export function UserForm() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" name="name" />
        {state.errors?.name && <p className="text-red-500">{state.errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" />
        {state.errors?.email && <p className="text-red-500">{state.errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input id="age" type="number" name="age" />
        {state.errors?.age && <p className="text-red-500">{state.errors.age[0]}</p>}
      </div>

      <button type="submit">Create User</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

## Error Handling

### Try-Catch in Server Actions

```tsx
'use server';

export async function createPost(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const post = await db.post.create({
      data: { title, content },
    });

    revalidatePath('/posts');
    return { success: true, post };
  } catch (error) {
    console.error('Failed to create post:', error);
    return {
      success: false,
      error: 'Failed to create post. Please try again.',
    };
  }
}
```

### Error Boundaries

```tsx
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Loading States

### Using useFormStatus

```tsx
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ label = 'Submit' }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={pending ? 'cursor-not-allowed opacity-50' : ''}
    >
      {pending ? (
        <>
          <Spinner />
          <span>Processing...</span>
        </>
      ) : (
        label
      )}
    </button>
  );
}
```

### Optimistic Updates

```tsx
'use client';

import { useOptimistic } from 'react';

import { addTodo } from './actions';

export function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos, (state, newTodo: string) => [
    ...state,
    { id: Date.now(), text: newTodo, completed: false },
  ]);

  async function formAction(formData: FormData) {
    const text = formData.get('text') as string;
    addOptimisticTodo(text);
    await addTodo(formData);
  }

  return (
    <>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>

      <form action={formAction}>
        <input type="text" name="text" required />
        <button type="submit">Add Todo</button>
      </form>
    </>
  );
}
```

## Revalidation

### Revalidate Path

```tsx
'use server';

import { revalidatePath } from 'next/cache';

export async function updatePost(id: string, formData: FormData) {
  await db.post.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    },
  });

  // Revalidate specific path
  revalidatePath(`/posts/${id}`);

  // Revalidate all posts
  revalidatePath('/posts');
}
```

### Revalidate Tag

```tsx
'use server';

import { revalidateTag } from 'next/cache';

export async function createProduct(formData: FormData) {
  await db.product.create({
    data: {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
    },
  });

  // Revalidate all data tagged with 'products'
  revalidateTag('products');
}
```

## Best Practices

### 1. Input Validation

Always validate on both client and server:

```tsx
// Client validation
<input type="email" name="email" required pattern="[^@\s]+@[^@\s]+\.[^@\s]+" />;

// Server validation
const schema = z.object({
  email: z.string().email(),
});
```

### 2. Type Safety

Use TypeScript and validated data:

```tsx
type FormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
  };
  data?: {
    name: string;
    email: string;
  };
};

export async function submitForm(prevState: FormState, formData: FormData): Promise<FormState> {
  // Implementation
}
```

### 3. Security

- Never trust client input
- Validate and sanitize all data
- Use CSRF protection (built into Server Actions)
- Implement rate limiting

```tsx
'use server';

import { headers } from 'next/headers';

import { ratelimit } from '@/lib/ratelimit';

export async function createComment(formData: FormData) {
  const ip = headers().get('x-forwarded-for');
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return { error: 'Too many requests' };
  }

  // Process form
}
```

### 4. Accessibility

- Use semantic HTML
- Provide clear labels
- Show validation errors properly
- Support keyboard navigation

```tsx
<form action={formAction}>
  <label htmlFor="username">
    Username
    <span aria-label="required">*</span>
  </label>
  <input
    id="username"
    name="username"
    type="text"
    required
    aria-required="true"
    aria-invalid={!!errors?.username}
    aria-describedby={errors?.username ? 'username-error' : undefined}
  />
  {errors?.username && (
    <p id="username-error" role="alert">
      {errors.username}
    </p>
  )}
</form>
```

### 5. Reset Forms After Success

```tsx
'use client';

import { useEffect, useRef } from 'react';

import { useFormState } from 'react-dom';

export function MyForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(submitForm, null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction}>
      {/* form fields */}
    </form>
  );
}
```

### 6. Handle File Uploads

```tsx
'use server';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    return { error: 'No file provided' };
  }

  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { error: 'Invalid file type' };
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB
    return { error: 'File too large' };
  }

  // Process file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to storage
  const url = await uploadToStorage(buffer, file.name);

  return { success: true, url };
}
```

### 7. Combine Multiple Actions

```tsx
export function FormWithMultipleActions() {
  return (
    <form>
      <input type="text" name="title" />
      <button formAction={saveDraft}>Save Draft</button>
      <button formAction={publish}>Publish</button>
      <button formAction={deletePost}>Delete</button>
    </form>
  );
}
```

## Related Resources

- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React 19 Form Actions](https://react.dev/reference/react-dom/components/form)
- [useFormState Hook](https://react.dev/reference/react-dom/hooks/useFormState)
- [useFormStatus Hook](https://react.dev/reference/react-dom/hooks/useFormStatus)
