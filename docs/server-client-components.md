# Server and Client Components in Next.js

## Overview

Next.js 13+ uses React Server Components (RSC) architecture, introducing a fundamental
distinction between Server and Client Components. This guide covers the differences,
use cases, and best practices for both.

## Server Components (Default)

### What Are Server Components?

Server Components render **only on the server** and send rendered HTML to the client.
They don't include JavaScript in the client bundle.

**All components in the App Router are Server Components by default** unless marked
with `'use client'`.

### Characteristics

- ✅ **Zero JavaScript** sent to client (smaller bundle size)
- ✅ **Direct database/filesystem access** without API routes
- ✅ **Secure** - can use secrets, API keys safely
- ✅ **Better SEO** - fully rendered HTML
- ✅ **Faster initial page load**
- ❌ **No interactivity** (no state, effects, or event handlers)
- ❌ **No browser APIs** (localStorage, window, etc.)
- ❌ **No React hooks** (useState, useEffect, etc.)

### Example: Server Component

```tsx
// app/products/page.tsx
// No 'use client' = Server Component by default
import { db } from '@/lib/database';

export default async function ProductsPage() {
  // Direct database access - runs only on server
  const products = await db.product.findMany();

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### When to Use Server Components

- Fetching data from databases or APIs
- Accessing server-only resources (filesystem, environment variables)
- Reducing client-side JavaScript bundle size
- SEO-critical content rendering
- Static content that doesn't need interactivity

## Client Components

### What Are Client Components?

Client Components render on **both server (initial SSR) and client** (hydration +
re-renders). They enable interactivity and use browser APIs.

**Mark with `'use client'` directive** at the top of the file.

### Characteristics Checklist

- ✅ **Interactive** - event handlers, state, effects
- ✅ **React hooks** (useState, useEffect, useContext, etc.)
- ✅ **Browser APIs** (localStorage, window, geolocation, etc.)
- ✅ **Real-time updates** and user interactions
- ❌ **Increases bundle size** (JavaScript shipped to client)
- ❌ **No direct server resource access** (database, filesystem)
- ❌ **Cannot use async/await** at component level

### Example: Client Component

```tsx
'use client';

import { useState } from 'react';

// components/AddToCartButton.tsx

export default function AddToCartButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = async () => {
    setIsAdding(true);
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    setCount((c) => c + 1);
    setIsAdding(false);
  };

  return (
    <button onClick={handleClick} disabled={isAdding}>
      {isAdding ? 'Adding...' : `Add to Cart (${count})`}
    </button>
  );
}
```

### When to Use Client Components

- Interactive UI elements (buttons, forms, modals)
- State management (useState, useReducer)
- Side effects (useEffect, useLayoutEffect)
- Browser-only APIs (localStorage, geolocation, etc.)
- Event listeners (onClick, onChange, onSubmit)
- Custom hooks that use client-only features
- Third-party libraries requiring browser APIs

## Composition Patterns

### Pattern 1: Server Component with Client Children

**Recommended:** Keep Server Components at the top level, nest Client Components inside.

```tsx
// app/products/page.tsx (Server Component)
// Server Component
import AddToCartButton from '@/components/AddToCartButton';
import ProductList from '@/components/ProductList';

// Client Component

export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products').then((r) => r.json());

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
          {/* Client Component for interactivity */}
          <AddToCartButton productId={product.id} />
        </div>
      ))}
    </div>
  );
}
```

### Pattern 2: Passing Server Components as Props to Client Components

You can pass Server Components as children/props to Client Components.

```tsx
// components/ClientWrapper.tsx
'use client';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

```tsx
// app/page.tsx (Server Component)
import ClientWrapper from '@/components/ClientWrapper';
import ServerContent from '@/components/ServerContent';

// Server Component

export default function Page() {
  return (
    <ClientWrapper>
      {/* ServerContent remains a Server Component */}
      <ServerContent />
    </ClientWrapper>
  );
}
```

### Pattern 3: Shared Components (Third-Party)

Third-party components often need `'use client'`. Create wrapper components:

```tsx
'use client';

import { MapContainer } from 'react-leaflet';

// components/Map.tsx

export default function Map({ coordinates }: { coordinates: [number, number] }) {
  return (
    <MapContainer center={coordinates} zoom={13}>
      {/* ... */}
    </MapContainer>
  );
}
```

## Data Fetching

### Server Components: Direct Async/Await

```tsx
// app/posts/page.tsx
export default async function PostsPage() {
  // Fetch directly in component
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'force-cache', // or 'no-store' for dynamic
  }).then((r) => r.json());

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  );
}
```

### Client Components: useEffect or SWR/React Query

```tsx
'use client';

import { useEffect, useState } from 'react';

// components/LivePosts.tsx

export default function LivePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then(setPosts);
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  );
}
```

## Common Mistakes and Solutions

### ❌ Mistake 1: Using Hooks in Server Components

```tsx
// app/page.tsx - WRONG
export default function Page() {
  const [count, setCount] = useState(0); // Error! Server Component can't use hooks
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**✅ Solution:** Add `'use client'` directive

```tsx
// app/page.tsx - CORRECT
'use client';

export default function Page() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### ❌ Mistake 2: Importing Server-Only Code in Client Components

```tsx
'use client';

import { db } from '@/lib/database';

// components/UserProfile.tsx - WRONG
// Error! Can't import server-only code

export default function UserProfile() {
  // ...
}
```

**✅ Solution:** Move server logic to Server Components or API routes

```tsx
// app/profile/page.tsx (Server Component)
import UserProfileClient from '@/components/UserProfileClient';
import { db } from '@/lib/database';

export default async function ProfilePage() {
  const user = await db.user.findFirst();
  return <UserProfileClient user={user} />;
}
```

### ❌ Mistake 3: Entire Page as Client Component

```tsx
// app/dashboard/page.tsx - INEFFICIENT
'use client';

export default function DashboardPage() {
  const [theme, setTheme] = useState('light');

  return (
    <div>
      <StaticHeader /> {/* Doesn't need interactivity */}
      <StaticSidebar /> {/* Doesn't need interactivity */}
      <ThemeToggle theme={theme} setTheme={setTheme} />
    </div>
  );
}
```

**✅ Solution:** Only make interactive parts Client Components

```tsx
// app/dashboard/page.tsx (Server Component)
import StaticHeader from '@/components/StaticHeader';
// Server Component
import StaticSidebar from '@/components/StaticSidebar';
// Server Component
import ThemeToggle from '@/components/ThemeToggle';

// Client Component

export default function DashboardPage() {
  return (
    <div>
      <StaticHeader />
      <StaticSidebar />
      <ThemeToggle />
    </div>
  );
}
```

## Performance Best Practices

### 1. Use Server Components by Default

Start with Server Components. Only add `'use client'` when needed.

### 2. Move Client Boundaries Down

Push `'use client'` as deep as possible in the component tree.

**❌ Bad:**

```tsx
'use client';

export default function Page() {
  return (
    <div>
      <Header /> {/* All children become Client Components */}
      <Content />
      <InteractiveButton /> {/* Only this needs 'use client' */}
    </div>
  );
}
```

**✅ Good:**

```tsx
// page.tsx (Server Component)
export default function Page() {
  return (
    <div>
      <Header /> {/* Stays Server Component */}
      <Content /> {/* Stays Server Component */}
      <InteractiveButton /> {/* Only this is Client Component */}
    </div>
  );
}
```

### 3. Serialize Props

Only pass serializable data to Client Components (JSON-compatible).

**❌ Bad:**

```tsx
<ClientComponent
  date={new Date()} // ❌ Not serializable
  callback={() => {}} // ❌ Functions can't be serialized
/>
```

**✅ Good:**

```tsx
<ClientComponent
  date={date.toISOString()} // ✅ String is serializable
  onAction="submit" // ✅ String identifier instead of function
/>
```

### 4. Use Streaming and Suspense

Combine Server Components with Suspense for optimal loading:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

import DashboardData from '@/components/DashboardData';

// Server Component (async)

export default function DashboardPage() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <DashboardData />
    </Suspense>
  );
}
```

## Decision Tree

```text
Do you need interactivity (state, events, effects)?
├─ NO → Use Server Component (default)
│       - Fetch data directly
│       - Access server resources
│       - Better performance
│
└─ YES → Use Client Component ('use client')
         - Add event handlers
         - Use React hooks
         - Access browser APIs
```

## Migration Checklist

When converting between component types:

**Server → Client:**

- [ ] Add `'use client'` at top of file
- [ ] Ensure no direct database/filesystem access
- [ ] Replace async component with useEffect for data fetching
- [ ] Verify all imports are client-safe

**Client → Server:**

- [ ] Remove `'use client'` directive
- [ ] Remove all hooks (useState, useEffect, etc.)
- [ ] Remove event handlers
- [ ] Make component async if fetching data
- [ ] Use direct server resource access

## Summary

| Feature                   | Server Components | Client Components |
| ------------------------- | ----------------- | ----------------- |
| **Default in App Router** | ✅ Yes            | ❌ No             |
| **Directive**             | None              | `'use client'`    |
| **Interactivity**         | ❌ No             | ✅ Yes            |
| **React Hooks**           | ❌ No             | ✅ Yes            |
| **Browser APIs**          | ❌ No             | ✅ Yes            |
| **Direct Data Fetching**  | ✅ Yes (async)    | ❌ No             |
| **Server Resources**      | ✅ Yes            | ❌ No             |
| **Bundle Size Impact**    | None (0 KB)       | Increases         |
| **SEO**                   | ✅ Excellent      | ⚠️ Requires SSR   |
| **Environment Variables** | All               | `NEXT_PUBLIC_*`   |
| **Streaming/Suspense**    | ✅ Yes            | Partial           |

## Server-Only Code Protection

### What is `'use server'`?

The `'use server'` directive marks code that should **only execute on the server**. It's the opposite of `'use client'` and provides an extra security layer.

### Two Use Cases

#### 1. Server Actions (Functions)

Mark async functions as Server Actions for form submissions and mutations:

```tsx
'use server';

import { db } from '@/lib/database';

// app/actions.ts

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // Direct database access - only runs on server
  const user = await db.user.create({
    data: { name, email },
  });

  return { success: true, userId: user.id };
}
```

#### 2. Server-Only Utilities (Files)

Mark entire files/modules to prevent accidental client-side bundling:

```tsx
'use server';

import { headers } from 'next/headers';

// lib/server-utils.ts

export async function getServerSideData() {
  const headersList = await headers();
  const apiKey = process.env.API_KEY; // Safe - never exposed to client

  // Server-only logic
  return fetch('https://api.example.com/data', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}
```

### Key Differences: `'use server'` vs Server Components

| Feature              | `'use server'`                 | Server Components         |
| -------------------- | ------------------------------ | ------------------------- |
| **Purpose**          | Explicitly server-only code    | Default rendering mode    |
| **Used For**         | Server Actions, utility files  | React components          |
| **Protection**       | Prevents client bundling       | Implicit server execution |
| **Can Be Called By** | Client Components (via import) | Only rendered server-side |
| **Typical Use**      | Form actions, API calls        | Data fetching, rendering  |

### Usage Example: Client Component Calling Server Action

```tsx
// app/actions.ts
'use server';

export async function submitForm(data: FormData) {
  const result = await db.user.create({
    data: { name: data.get('name') },
  });
  return result;
}
```

```tsx
'use client';

import { submitForm } from '@/app/actions';

// components/UserForm.tsx

export default function UserForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await submitForm(formData); // Calls server-side function
    console.log(result);
  };

  return (
    <form action={handleSubmit}>
      <input name="name" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### When to Use `'use server'`

- ✅ Server Actions for form submissions
- ✅ Protecting sensitive server utilities from client exposure
- ✅ Database operations called from Client Components
- ✅ API routes replacement (simpler than creating `/api` endpoints)
- ✅ Environment variable access in shared utilities

### Security Benefits

```tsx
// ❌ Without 'use server' - risky if imported in client
// lib/dangerous.ts
export function getApiKey() {
  return process.env.SECRET_API_KEY; // Could leak if bundled in client!
}
```

```tsx
// ✅ With 'use server' - guaranteed server-only
// lib/safe.ts
'use server';

export function getApiKey() {
  return process.env.SECRET_API_KEY; // Safe - will error if client tries to import
}
```

## Resources

- [Next.js Server Components Docs](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Server Actions Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [When to Use Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
