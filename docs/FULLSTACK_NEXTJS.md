# Full-Stack Next.js Development Guide

Complete guide for building full-stack web applications using Next.js as both frontend and backend

## Table of Contents

- [Full-Stack Next.js Development Guide](#full-stack-nextjs-development-guide)
  - [Table of Contents](#table-of-contents)
  - [🚀 Why Next.js for Full-Stack?](#-why-nextjs-for-full-stack)
    - [Traditional Stack vs Next.js Full-Stack](#traditional-stack-vs-nextjs-full-stack)
    - [Benefits](#benefits)
  - [🏗️ Full-Stack Architecture](#️-full-stack-architecture)
    - [Next.js Full-Stack Layers](#nextjs-full-stack-layers)
    - [Technology Stack](#technology-stack)
  - [📝 Complete CRUD Example](#-complete-crud-example)
    - [Blog Post CRUD](#blog-post-crud)
  - [🗄️ Database Integration](#️-database-integration)
    - [Prisma Setup (Recommended)](#prisma-setup-recommended)
    - [Drizzle ORM Alternative](#drizzle-orm-alternative)
  - [🔐 Authentication](#-authentication)
    - [Option 1: Clerk (Easiest)](#option-1-clerk-easiest)
    - [Option 2: NextAuth.js v5](#option-2-nextauthjs-v5)
  - [📤 File Upload](#-file-upload)
    - [Using Vercel Blob](#using-vercel-blob)
  - [💳 Payment Integration](#-payment-integration)
    - [Stripe Integration](#stripe-integration)
  - [📧 Email Sending](#-email-sending)
    - [Resend Integration](#resend-integration)
  - [🔍 Search \& Filtering](#-search--filtering)
  - [📊 Real-time Features](#-real-time-features)
    - [Using Server-Sent Events (SSE)](#using-server-sent-events-sse)
  - [🎨 Full-Stack Patterns](#-full-stack-patterns)
    - [1. Optimistic UI Updates](#1-optimistic-ui-updates)
    - [2. Infinite Scroll](#2-infinite-scroll)
    - [3. Form with Server Actions](#3-form-with-server-actions)
  - [✅ Complete App Example](#-complete-app-example)
    - [Todo App (Full-Stack)](#todo-app-full-stack)

---

## 🚀 Why Next.js for Full-Stack?

### Traditional Stack vs Next.js Full-Stack

**Traditional:**

```plaintext
Frontend (React) ← HTTP → Backend (Node.js/Express) ← Database
- Separate codebases
- Duplicate types
- CORS issues
- Deploy 2+ services
```

**Next.js:**

```plaintext
Next.js (Frontend + Backend + API) ← Database
- One codebase
- Shared types
- No CORS
- Deploy once
```

### Benefits

✅ **One Language** - JavaScript/TypeScript everywhere
✅ **Shared Code** - Types, utilities, validation
✅ **No CORS** - Same origin
✅ **Type Safety** - End-to-end with tRPC
✅ **Fast Development** - Less context switching
✅ **Easy Deployment** - Single service
✅ **Better DX** - Hot reload for everything

---

## 🏗️ Full-Stack Architecture

### Next.js Full-Stack Layers

```plaintext
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  • Pages (app/*)                        │
│  • Components (React)                   │
│  • Client-side state (Zustand/Jotai)   │
├─────────────────────────────────────────┤
│         Application Layer               │
│  • Server Actions                       │
│  • API Routes                           │
│  • Business Logic                       │
│  • Validation (Zod)                     │
├─────────────────────────────────────────┤
│          Data Layer                     │
│  • Database (Prisma/Drizzle)            │
│  • Cache (Redis)                        │
│  • File Storage (S3)                    │
│  • External APIs                        │
└─────────────────────────────────────────┘
```

### Technology Stack

**Recommended Stack:**

- **Framework:** Next.js 15
- **Database:** PostgreSQL (Supabase/Neon)
- **ORM:** Prisma or Drizzle
- **Auth:** Clerk or NextAuth.js
- **Validation:** Zod
- **UI:** Shadcn/ui + Tailwind
- **Forms:** React Hook Form
- **State:** Zustand (client-side)
- **Email:** Resend
- **Storage:** Vercel Blob or S3

---

## 📝 Complete CRUD Example

### Blog Post CRUD

```typescript
// 1. Database Schema (Prisma)
// prisma/schema.prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 2. Validation Schema (Zod)
// lib/validations/post.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  published: z.boolean().default(false),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

// 3. Server Actions (Create, Update, Delete)
// app/posts/actions.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createPostSchema, updatePostSchema } from '@/lib/validations/post';

export async function createPost(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    published: formData.get('published') === 'true',
  };

  const validatedData = createPostSchema.parse(rawData);

  const post = await prisma.post.create({
    data: {
      ...validatedData,
      authorId: userId,
    },
  });

  revalidatePath('/posts');
  redirect(`/posts/${post.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Check ownership
  const post = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!post || post.authorId !== userId) {
    throw new Error('Forbidden');
  }

  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    published: formData.get('published') === 'true',
  };

  const validatedData = updatePostSchema.parse(rawData);

  await prisma.post.update({
    where: { id },
    data: validatedData,
  });

  revalidatePath(`/posts/${id}`);
  revalidatePath('/posts');
}

export async function deletePost(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const post = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!post || post.authorId !== userId) {
    throw new Error('Forbidden');
  }

  await prisma.post.delete({ where: { id } });

  revalidatePath('/posts');
  redirect('/posts');
}

// 4. Read (Server Component)
// app/posts/page.tsx
import { prisma } from '@/lib/db';
import { PostCard } from '@/components/post-card';
import { CreatePostButton } from '@/components/create-post-button';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Blog Posts</h1>
        <CreatePostButton />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

// 5. Single Post (Server Component)
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { EditPostButton } from '@/components/edit-post-button';
import { DeletePostButton } from '@/components/delete-post-button';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-5xl font-bold">{post.title}</h1>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>By {post.author.name}</p>
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        {post.content}
      </div>

      <div className="mt-8 flex gap-4">
        <EditPostButton postId={post.id} />
        <DeletePostButton postId={post.id} />
      </div>
    </article>
  );
}

// 6. Create Form (Client Component)
// app/posts/new/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema } from '@/lib/validations/post';
import { createPost } from '../actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function NewPostPage() {
  const form = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      published: false,
    },
  });

  async function onSubmit(data: any) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('published', String(data.published));

    await createPost(formData);
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-4xl font-bold">Create New Post</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your post content..."
                    className="min-h-[300px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Publish immediately</FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" size="lg">
            Create Post
          </Button>
        </form>
      </Form>
    </div>
  );
}
```

---

## 🗄️ Database Integration

### Prisma Setup (Recommended)

```bash
# Install
pnpm add prisma @prisma/client
pnpm add -D prisma

# Initialize
pnpm prisma init

# Create schema
# prisma/schema.prisma
```

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}
```

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

```bash
# Generate client
pnpm prisma generate

# Create migration
pnpm prisma migrate dev --name init

# Push schema (for development)
pnpm prisma db push

# Open Prisma Studio
pnpm prisma studio
```

### Drizzle ORM Alternative

```typescript
// lib/db/schema.ts
import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  published: boolean('published').default(false),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

// Usage
import { db } from '@/lib/db';
import { posts, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Select
const allPosts = await db.select().from(posts);

// Select with join
const postsWithAuthor = await db
  .select()
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id));

// Insert
await db.insert(posts).values({
  title: 'New Post',
  content: 'Content here',
  authorId: userId,
});

// Update
await db
  .update(posts)
  .set({ published: true })
  .where(eq(posts.id, postId));

// Delete
await db.delete(posts).where(eq(posts.id, postId));
```

---

## 🔐 Authentication

### Option 1: Clerk (Easiest)

```bash
pnpm add @clerk/nextjs
```

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/posts/new',
  '/posts/*/edit',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

// Server Components
import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <div>Dashboard for {userId}</div>;
}

// Server Actions
'use server';
import { auth } from '@clerk/nextjs/server';

export async function createPost(data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Create post...
}

// Client Components
import { useUser } from '@clerk/nextjs';

export function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return <div>Hello, {user?.firstName}</div>;
}
```

### Option 2: NextAuth.js v5

```bash
pnpm add next-auth@beta
```

```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !verifyPassword(credentials.password, user.passwordHash)) {
          return null;
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;

// Server Components
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <div>Hello, {session.user.name}</div>;
}

// Server Actions
'use server';
import { auth } from '@/auth';

export async function createPost(data: any) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  // Create post...
}
```

---

## 📤 File Upload

### Using Vercel Blob

```bash
pnpm add @vercel/blob
```

```typescript
// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return Response.json({ error: 'File too large' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ error: 'Invalid file type' }, { status: 400 });
  }

  // Upload to Vercel Blob
  const blob = await put(`uploads/${userId}/${file.name}`, file, {
    access: 'public',
  });

  return Response.json({ url: blob.url });
}

// Client Component
'use client';
import { useState } from 'react';

export function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const { url } = await response.json();
    setUrl(url);
    setUploading(false);
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {url && <img src={url} alt="Uploaded" />}
    </div>
  );
}
```

---

## 💳 Payment Integration

### Stripe Integration

```bash
pnpm add stripe @stripe/stripe-js
```

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// app/api/checkout/route.ts
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const { userId, user } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { priceId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    customer_email: user?.emailAddresses[0]?.emailAddress,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${req.headers.get('origin')}/dashboard?success=true`,
    cancel_url: `${req.headers.get('origin')}/pricing?canceled=true`,
    metadata: {
      userId,
    },
  });

  return Response.json({ url: session.url });
}

// Webhook handler
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      await prisma.user.update({
        where: { id: session.metadata!.userId },
        data: {
          subscriptionId: session.subscription as string,
          subscriptionStatus: 'active',
        },
      });
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;

      await prisma.user.update({
        where: { subscriptionId: subscription.id },
        data: { subscriptionStatus: 'canceled' },
      });
      break;
  }

  return Response.json({ received: true });
}

// Client Component
'use client';
export function PricingButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });

    const { url } = await response.json();
    window.location.href = url;
  }

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Loading...' : 'Subscribe'}
    </button>
  );
}
```

---

## 📧 Email Sending

### Resend Integration

```bash
pnpm add resend react-email
```

```tsx
// emails/welcome.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>Welcome to Our App!</Heading>
          <Text>Hi {name},</Text>
          <Text>Thanks for signing up. We're excited to have you on board.</Text>
          <Button href="https://example.com/dashboard">
            Get Started
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

// lib/email.ts
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@yourapp.com',
    to,
    subject: 'Welcome to Our App!',
    react: WelcomeEmail({ name }),
  });

  if (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }

  return data;
}

// Server Action
'use server';
import { sendWelcomeEmail } from '@/lib/email';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;

  // Create user...
  const user = await prisma.user.create({
    data: { email, name },
  });

  // Send welcome email
  await sendWelcomeEmail(email, name);

  return { success: true };
}
```

---

## 🔍 Search & Filtering

```typescript
// app/posts/page.tsx
import { prisma } from '@/lib/db';
import { PostCard } from '@/components/post-card';
import { SearchForm } from '@/components/search-form';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>;
}) {
  const { q, tag, page = '1' } = await searchParams;
  const pageSize = 10;
  const skip = (parseInt(page) - 1) * pageSize;

  const where = {
    published: true,
    ...(q && {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { content: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
    ...(tag && {
      tags: { some: { name: tag } },
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { name: true } },
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto py-8">
      <SearchForm />

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={parseInt(page)} totalPages={totalPages} />
      )}
    </div>
  );
}

// components/search-form.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(formData: FormData) {
    const q = formData.get('q') as string;
    const params = new URLSearchParams(searchParams);

    if (q) {
      params.set('q', q);
    } else {
      params.delete('q');
    }

    router.push(`/posts?${params.toString()}`);
  }

  return (
    <form action={handleSearch}>
      <div className="flex gap-2">
        <Input
          name="q"
          placeholder="Search posts..."
          defaultValue={searchParams.get('q') || ''}
        />
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}
```

---

## 📊 Real-time Features

### Using Server-Sent Events (SSE)

```typescript
// app/api/notifications/route.ts
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial data
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
      );

      // Poll for new notifications
      const interval = setInterval(async () => {
        const notifications = await prisma.notification.findMany({
          where: {
            userId,
            read: false,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        });

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(notifications)}\n\n`)
        );
      }, 5000); // Poll every 5 seconds

      // Cleanup on close
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

// Client Component
'use client';
import { useEffect, useState } from 'react';

export function NotificationStream() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      {notifications.map((notification) => (
        <div key={notification.id}>{notification.message}</div>
      ))}
    </div>
  );
}
```

---

## 🎨 Full-Stack Patterns

### 1. Optimistic UI Updates

```typescript
'use client';
import { useOptimistic } from 'react';
import { likePost } from './actions';

export function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state, amount: number) => state + amount
  );

  async function handleLike() {
    addOptimisticLike(1); // Update UI immediately
    await likePost(postId); // Update server
  }

  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes}
    </button>
  );
}
```

### 2. Infinite Scroll

```typescript
'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export function InfinitePosts({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView]);

  async function loadMore() {
    const response = await fetch(`/api/posts?page=${page + 1}`);
    const newPosts = await response.json();

    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts([...posts, ...newPosts]);
      setPage(page + 1);
    }
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {hasMore && <div ref={ref}>Loading...</div>}
    </>
  );
}
```

### 3. Form with Server Actions

```typescript
// Server Action
'use server';
export async function submitForm(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().email(),
    message: z.string().min(10),
  });

  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Process form...
  await sendEmail(validatedFields.data);

  return { success: true };
}

// Client Component
'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { submitForm } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitForm, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <textarea name="message" required />
      {state?.errors?.message && <p>{state.errors.message}</p>}

      <SubmitButton />

      {state?.success && <p>Message sent!</p>}
    </form>
  );
}
```

---

## ✅ Complete App Example

### Todo App (Full-Stack)

```bash
# Setup
pnpm create next-app@latest my-todo-app
cd my-todo-app
pnpm add prisma @prisma/client @clerk/nextjs zod
pnpm add -D prisma
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input checkbox
```

**See complete code in previous CRUD example section!**

---

Note: **Next.js is the perfect full-stack framework - one language, one framework, infinite possibilities! 🚀**
