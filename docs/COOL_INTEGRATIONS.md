# Cool Next.js 15 Integrations Guide 2025

คู่มือรวม integrations ที่ทำให้ Next.js project โดดเด่นและทันสมัย

## Table of Contents

- [🏆 Top Tech Stacks 2025](#-top-tech-stacks-2025)
- [💾 Database & ORM](#-database--orm)
- [🔐 Authentication](#-authentication)
- [🎨 UI & Styling](#-ui--styling)
- [🤖 AI & LLM](#-ai--llm)
- [📊 State Management](#-state-management)
- [✅ Validation & Forms](#-validation--forms)
- [💳 Payments & Commerce](#-payments--commerce)
- [📧 Email & Communication](#-email--communication)
- [📈 Analytics & Monitoring](#-analytics--monitoring)
- [🚀 Recommended Tech Stacks](#-recommended-tech-stacks)
- [💡 Complete Implementation Examples](#-complete-implementation-examples)

---

## 🏆 Top Tech Stacks 2025

### The T3 Stack (Modern & Type-Safe)

**Stack:** Next.js + tRPC + Tailwind CSS + Prisma/Drizzle

- ⭐ **Coolness:** 🔥🔥🔥🔥🔥
- 🎯 **Use Case:** Type-safe full-stack apps
- 💪 **Strength:** End-to-end type safety, no API boilerplate
- 📦 **Template:** [create-t3-app](https://create.t3.gg/)

### The Supabase Stack (Backend-as-a-Service)

**Stack:** Next.js + Supabase + Prisma + Shadcn/ui

- ⭐ **Coolness:** 🔥🔥🔥🔥🔥
- 🎯 **Use Case:** Rapid development, real-time apps
- 💪 **Strength:** Auth, Database, Storage, Realtime out of the box
- 🆓 **Free Tier:** Generous free tier

### The AI-First Stack

**Stack:** Next.js + Vercel AI SDK + Shadcn/ui + Supabase

- ⭐ **Coolness:** 🔥🔥🔥🔥🔥
- 🎯 **Use Case:** AI-powered applications
- 💪 **Strength:** Latest AI patterns, streaming responses
- 🤖 **Models:** OpenAI, Anthropic, Google, local models

### The Enterprise Stack

**Stack:** Next.js + Clerk + Drizzle + tRPC + Zod

- ⭐ **Coolness:** 🔥🔥🔥🔥
- 🎯 **Use Case:** Production-ready SaaS
- 💪 **Strength:** Enterprise auth, type safety, scalability
- 💼 **Best For:** B2B applications

### The Minimal Modern Stack

**Stack:** Next.js 15 + Shadcn/ui + Tailwind v4 + Zod

- ⭐ **Coolness:** 🔥🔥🔥🔥
- 🎯 **Use Case:** Quick projects, prototypes
- 💪 **Strength:** Simple, fast, beautiful
- ⚡ **Speed:** Fastest to start

---

## 💾 Database & ORM

### 1. Prisma ⭐⭐⭐⭐⭐

**Why it's cool:**

- 🔷 Type-safe database client
- 📊 Visual Studio for database (Prisma Studio)
- 🔄 Auto-generated migrations
- 🎯 Works with PostgreSQL, MySQL, SQLite, MongoDB

**Quick Start:**

```bash
pnpm add prisma @prisma/client
pnpm prisma init
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
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}
```

```tsx
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// app/users/page.tsx (Server Component)
import { prisma } from '@/lib/db';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: { posts: true },
  });

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.posts.length} posts</p>
        </div>
      ))}
    </div>
  );
}
```

**Best With:** Supabase, Neon, PlanetScale, Railway
**Coolness:** 🔥🔥🔥🔥🔥

---

### 2. Drizzle ORM ⭐⭐⭐⭐⭐

**Why it's cool:**

- ⚡ Lightweight & fast (5x faster than Prisma)
- 🎯 SQL-like TypeScript API
- 0️⃣ Zero dependencies
- 🔧 Full SQL control

**Quick Start:**

```bash
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

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
  content: text('content'),
  published: boolean('published').default(false),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

// app/users/page.tsx
import { db } from '@/lib/db';
import { users, posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function UsersPage() {
  const allUsers = await db
    .select()
    .from(users)
    .leftJoin(posts, eq(posts.authorId, users.id));

  return <div>{/* render users */}</div>;
}
```

**Best With:** Neon, Vercel Postgres, Supabase
**Coolness:** 🔥🔥🔥🔥🔥

---

### 3. Supabase ⭐⭐⭐⭐⭐

**Why it's cool:**

- 🔥 PostgreSQL + Auth + Storage + Realtime
- 🆓 Generous free tier
- 🔓 Open source (can self-host)
- 📡 Real-time subscriptions

**Quick Start:**

```bash
pnpm add @supabase/supabase-js
```

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// app/posts/page.tsx
'use client';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch initial data
    supabase
      .from('posts')
      .select('*')
      .then(({ data }) => setPosts(data));

    // Subscribe to realtime changes
    const channel = supabase
      .channel('posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
      }, (payload) => {
        console.log('Change received!', payload);
        // Update UI
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return <div>{/* render posts */}</div>;
}
```

**Best With:** Prisma (for type safety), Next.js Auth
**Coolness:** 🔥🔥🔥🔥🔥

---

### 4. Firebase (Firestore) ⭐⭐⭐⭐

**Why it's cool:**

- 🔥 Complete BaaS platform
- 📱 Great for mobile + web
- 🔄 Real-time NoSQL database
- 🎯 Easy to start

**Quick Start:**

```bash
pnpm add firebase
```

```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// app/posts/page.tsx
'use client';
import { db } from '@/lib/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Real-time listener
    const unsubscribe = onSnapshot(
      collection(db, 'posts'),
      (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );

    return () => unsubscribe();
  }, []);

  return <div>{/* render posts */}</div>;
}
```

**Best With:** Firebase Auth, Firebase Storage
**Coolness:** 🔥🔥🔥🔥

---

## 🔐 Authentication

### 1. Clerk ⭐⭐⭐⭐⭐

**Why it's cool:**

- 🎨 Beautiful pre-built UI components
- 🔐 Multi-factor authentication built-in
- 👥 Organizations & teams support
- 📊 User management dashboard

**Quick Start:**

```bash
pnpm add @clerk/nextjs
```

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

// app/page.tsx
import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Please sign in</div>;
  }

  return <div>Welcome, {userId}</div>;
}

// Server Actions with Clerk
'use server';
import { auth } from '@clerk/nextjs/server';

export async function createPost(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Create post...
}
```

**Pricing:** Free tier (10k MAUs), Pro from $25/mo
**Best With:** Drizzle, Prisma, Supabase
**Coolness:** 🔥🔥🔥🔥🔥

---

### 2. NextAuth.js (Auth.js v5) ⭐⭐⭐⭐⭐

**Why it's cool:**

- 🆓 Completely free & open source
- 🔌 50+ OAuth providers
- 🎯 Full control over auth flow
- 🔒 Secure by default

**Quick Start:**

```bash
pnpm add next-auth@beta
```

```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
});

// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;

// app/page.tsx
import { auth } from '@/auth';
import { SignIn, SignOut } from '@/components/auth-buttons';

export default async function Home() {
  const session = await auth();

  return (
    <div>
      {session ? (
        <>
          <p>Welcome, {session.user.name}</p>
          <SignOut />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

// Server Action with auth
'use server';
import { auth } from '@/auth';

export async function protectedAction() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  // Do something...
}
```

**Pricing:** Free
**Best With:** Prisma Adapter, Drizzle Adapter
**Coolness:** 🔥🔥🔥🔥🔥

---

### 3. Supabase Auth ⭐⭐⭐⭐

**Why it's cool:**

- 📧 Email, Social, Magic Links
- 🔐 Row Level Security (RLS)
- 🎯 Integrated with Supabase DB
- 📱 Mobile SDKs

**Quick Start:**

```typescript
// lib/supabase.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// app/login/actions.ts
'use server';
import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
}

// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Welcome, {user.email}</div>;
}
```

**Pricing:** Free tier included
**Best With:** Supabase Database
**Coolness:** 🔥🔥🔥🔥

---

## 🎨 UI & Styling

### 1. Shadcn/ui ⭐⭐⭐⭐⭐

**Why it's cool:**

- 🎨 Beautiful, accessible components
- 📦 Copy-paste, not npm install
- 🎯 Fully customizable
- 🔧 Built with Radix UI + Tailwind

**Quick Start:**

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add dialog
```

```tsx
// components/ui/button.tsx is auto-generated
// app/page.tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Home() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Cancel</Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

**Pricing:** Free
**Best With:** Tailwind CSS v4, React Hook Form, Zod
**Coolness:** 🔥🔥🔥🔥🔥

---

### 2. Tailwind CSS v4 ⭐⭐⭐⭐⭐

**Why it's cool:**

- ⚡ Lightning fast (up to 10x faster)
- 🎨 CSS-first configuration
- 🔧 Better IntelliSense
- 📦 Smaller bundle size

**Already in this project!** See [CLAUDE.md](CLAUDE.md) for configuration.

**Coolness:** 🔥🔥🔥🔥🔥

---

### 3. Framer Motion ⭐⭐⭐⭐

**Why it's cool:**

- 🎬 Production-ready animations
- 🎯 Simple API
- ⚡ Performance optimized
- 🎨 Gesture support

**Quick Start:**

```bash
pnpm add framer-motion
```

```tsx
'use client';

import { motion } from 'framer-motion';

export default function AnimatedPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Animated Content</h1>
    </motion.div>
  );
}

// Stagger children animation
export function StaggerList({ items }) {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {items.map((item) => (
        <motion.li
          key={item.id}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

**Coolness:** 🔥🔥🔥🔥

---

## 🤖 AI & LLM

### 1. Vercel AI SDK ⭐⭐⭐⭐⭐

**Why it's cool:**

- 🤖 Support all major LLMs (OpenAI, Anthropic, Google, etc.)
- 📡 Streaming responses out of the box
- 🎯 React hooks for UI
- 🔧 Tool calling & function execution

**Quick Start:**

```bash
pnpm add ai @ai-sdk/openai
```

```tsx
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
// Tool calling example
import { generateText, tool } from 'ai';
import { useChat } from 'ai/react';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}

// app/chat/page.tsx
('use client');

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      <div className="messages">
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.role}: </strong>
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} placeholder="Say something..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

const result = await generateText({
  model: openai('gpt-4-turbo'),
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

**Pricing:** Free SDK, pay for LLM API usage
**Best With:** Shadcn/ui, React
**Coolness:** 🔥🔥🔥🔥🔥

---

### 2. LangChain.js ⭐⭐⭐⭐

**Why it's cool:**

- 🔗 Chain multiple LLM calls
- 💾 Vector store integrations
- 📚 Document loaders
- 🎯 RAG (Retrieval Augmented Generation)

**Quick Start:**

```bash
pnpm add langchain @langchain/openai
```

```typescript
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({ temperature: 0.9 });

const promptTemplate = PromptTemplate.fromTemplate('Tell me a joke about {topic}');

const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

const result = await chain.invoke({ topic: 'bears' });
```

**Coolness:** 🔥🔥🔥🔥

---

## 📊 State Management

### 1. Zustand ⭐⭐⭐⭐⭐

**Why it's cool:**

- 🪶 Tiny (1KB)
- 🎯 Simple API
- 🔧 No boilerplate
- ⚡ Fast

**Quick Start:**

```bash
pnpm add zustand
```

```typescript
// store/use-user-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: { name: string; email: string } | null;
  setUser: (user: UserState['user']) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

// components/user-profile.tsx
'use client';
import { useUserStore } from '@/store/use-user-store';

export function UserProfile() {
  const { user, logout } = useUserStore();

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>{user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Coolness:** 🔥🔥🔥🔥🔥

---

### 2. Jotai ⭐⭐⭐⭐

**Why it's cool:**

- ⚛️ Atomic state management
- 🎯 React-like API
- 🔧 Composable atoms
- 📦 TypeScript first

**Quick Start:**

```bash
pnpm add jotai
```

```typescript
// store/atoms.ts
import { atom } from 'jotai';

export const countAtom = atom(0);
export const doubleCountAtom = atom((get) => get(countAtom) * 2);

// components/counter.tsx
'use client';
import { useAtom, useAtomValue } from 'jotai';
import { countAtom, doubleCountAtom } from '@/store/atoms';

export function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const double = useAtomValue(doubleCountAtom);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {double}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**Coolness:** 🔥🔥🔥🔥

---

## ✅ Validation & Forms

### 1. Zod ⭐⭐⭐⭐⭐

**Why it's cool:**

- 🔷 TypeScript-first schema validation
- 🎯 Infer types from schemas
- 🔧 Runtime validation
- 📝 Works perfectly with forms

**Quick Start:**

```bash
pnpm add zod
```

```typescript
import { z } from 'zod';

// Define schema
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  age: z.number().min(18).max(100),
  role: z.enum(['admin', 'user']),
});

// Infer TypeScript type
type User = z.infer<typeof userSchema>;

// Validate data
const result = userSchema.safeParse({
  email: 'john@example.com',
  name: 'John',
  age: 25,
  role: 'user',
});

if (result.success) {
  console.log(result.data); // Type-safe!
} else {
  console.log(result.error.issues);
}

// Server Action validation
('use server');
export async function createUser(formData: FormData) {
  const data = {
    email: formData.get('email'),
    name: formData.get('name'),
    age: parseInt(formData.get('age') as string),
    role: formData.get('role'),
  };

  const result = userSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  // Create user with result.data
}
```

**Best With:** React Hook Form, Server Actions
**Coolness:** 🔥🔥🔥🔥🔥

---

### 2. React Hook Form + Zod ⭐⭐⭐⭐⭐

**Why it's cool:**

- ⚡ Best performance (minimal re-renders)
- 🎯 Easy validation
- 🔧 Works with Shadcn/ui forms
- 📝 TypeScript support

**Quick Start:**

```bash
pnpm add react-hook-form @hookform/resolvers
pnpm dlx shadcn@latest add form
```

```tsx
'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

**Coolness:** 🔥🔥🔥🔥🔥

---

## 💳 Payments & Commerce

### 1. Stripe ⭐⭐⭐⭐⭐

**Why it's cool:**

- 💳 Industry standard
- 🌍 Global payments
- 🔐 PCI compliant
- 🎯 Great developer experience

**Quick Start:**

```bash
pnpm add stripe @stripe/stripe-js
```

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// app/api/create-checkout/route.ts
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const { priceId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    success_url: `${req.headers.get('origin')}/success`,
    cancel_url: `${req.headers.get('origin')}/cancel`,
  });

  return Response.json({ url: session.url });
}

// app/checkout/page.tsx
'use client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const handleCheckout = async () => {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: 'price_xxx' }),
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  return <button onClick={handleCheckout}>Checkout</button>;
}

// Webhooks
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Fulfill order
  }

  return Response.json({ received: true });
}
```

**Coolness:** 🔥🔥🔥🔥🔥

---

### 2. LemonSqueezy ⭐⭐⭐⭐

**Why it's cool:**

- 🍋 Merchant of record (handles taxes & VAT)
- 💼 Perfect for digital products
- 🎯 Simple API
- 💰 Lower fees than Stripe for some use cases

**Quick Start:**

```bash
pnpm add @lemonsqueezy/lemonsqueezy.js
```

```typescript
import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

export async function POST() {
  const checkout = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    process.env.LEMONSQUEEZY_VARIANT_ID!,
    {
      checkoutData: {
        email: 'customer@example.com',
      },
    }
  );

  return Response.json({ url: checkout.data.attributes.url });
}
```

**Coolness:** 🔥🔥🔥🔥

---

## 📧 Email & Communication

### 1. Resend ⭐⭐⭐⭐⭐

**Why it's cool:**

- 📧 Modern email API
- ⚛️ React Email support
- 📊 Built-in analytics
- 🎯 Developer-first

**Quick Start:**

```bash
pnpm add resend react-email
```

```tsx
// emails/welcome.tsx
import { Html, Button } from '@react-email/components';

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <h1>Welcome, {name}!</h1>
      <p>Thanks for signing up.</p>
      <Button href="https://example.com/dashboard">
        Go to Dashboard
      </Button>
    </Html>
  );
}

// app/api/send-email/route.ts
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name } = await req.json();

  const { data, error } = await resend.emails.send({
    from: 'onboarding@example.com',
    to: email,
    subject: 'Welcome!',
    react: WelcomeEmail({ name }),
  });

  if (error) {
    return Response.json({ error }, { status: 400 });
  }

  return Response.json({ data });
}
```

**Coolness:** 🔥🔥🔥🔥🔥

---

## 📈 Analytics & Monitoring

### 1. Vercel Analytics ⭐⭐⭐⭐⭐

**Why it's cool:**

- ⚡ Zero impact on performance
- 📊 Web Vitals tracking
- 🎯 Privacy-friendly
- 🔧 One-line setup

**Quick Start:**

```bash
pnpm add @vercel/analytics @vercel/speed-insights
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Pricing:** Free on Vercel (Hobby), included in Pro
**Coolness:** 🔥🔥🔥🔥🔥

---

### 2. Sentry ⭐⭐⭐⭐

**Why it's cool:**

- 🐛 Error tracking
- 📊 Performance monitoring
- 🎯 Source maps support
- 🔔 Real-time alerts

**Quick Start:**

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// Use in components
try {
  // something
} catch (error) {
  Sentry.captureException(error);
}
```

**Coolness:** 🔥🔥🔥🔥

---

## 🚀 Recommended Tech Stacks

### Stack 1: The Modern Full-Stack SaaS

**Perfect for:** Production-ready SaaS applications

```
✅ Next.js 15 (App Router + Server Actions)
✅ Clerk (Authentication)
✅ Drizzle ORM
✅ Neon Postgres (Serverless)
✅ Shadcn/ui + Tailwind CSS v4
✅ React Hook Form + Zod
✅ Stripe (Payments)
✅ Resend (Emails)
✅ Vercel Analytics
```

**Time to MVP:** 2-3 weeks
**Coolness:** 🔥🔥🔥🔥🔥

---

### Stack 2: The AI-Powered App

**Perfect for:** AI chatbots, assistants, content generators

```
✅ Next.js 15
✅ Vercel AI SDK
✅ Supabase (Database + Auth)
✅ Shadcn/ui + Tailwind CSS v4
✅ Zustand (State)
✅ Zod (Validation)
✅ OpenAI / Anthropic
```

**Time to MVP:** 1-2 weeks
**Coolness:** 🔥🔥🔥🔥🔥

---

### Stack 3: The Type-Safe T3

**Perfect for:** Developers who love TypeScript

```
✅ Next.js 15
✅ tRPC (API)
✅ Prisma (ORM)
✅ NextAuth.js v5
✅ Tailwind CSS v4
✅ Zod (Validation)
```

**Time to MVP:** 2-3 weeks
**Coolness:** 🔥🔥🔥🔥🔥

---

### Stack 4: The Real-time Dashboard

**Perfect for:** Analytics, monitoring, live data

```
✅ Next.js 15 (Streaming SSR)
✅ Supabase (Real-time DB)
✅ Shadcn/ui + Tailwind CSS v4
✅ Recharts (Charts)
✅ Zustand (State)
```

**Time to MVP:** 1-2 weeks
**Coolness:** 🔥🔥🔥🔥

---

### Stack 5: The Minimal Starter

**Perfect for:** Quick prototypes, learning projects

```
✅ Next.js 15
✅ Shadcn/ui + Tailwind CSS v4
✅ Zod
✅ Server Actions (no API routes)
```

**Time to MVP:** 2-3 days
**Coolness:** 🔥🔥🔥🔥

---

## 💡 Complete Implementation Examples

### Example 1: Full-Stack Todo App (T3 Stack)

```bash
# Setup
pnpm create t3-app@latest my-todo-app
cd my-todo-app
pnpm install
```

```typescript
// prisma/schema.prisma
model Todo {
  id        String   @id @default(cuid())
  text      String
  completed Boolean  @default(false)
  userId    String
  createdAt DateTime @default(now())
}

// server/api/routers/todo.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.todo.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }),

  create: protectedProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          text: input.text,
          userId: ctx.session.user.id,
        },
      });
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todo.findUnique({
        where: { id: input.id },
      });

      return ctx.db.todo.update({
        where: { id: input.id },
        data: { completed: !todo?.completed },
      });
    }),
});

// app/page.tsx
'use client';
import { api } from '@/trpc/react';

export default function TodoPage() {
  const utils = api.useUtils();
  const { data: todos } = api.todo.getAll.useQuery();

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => utils.todo.getAll.invalidate(),
  });

  const toggleTodo = api.todo.toggle.useMutation({
    onSuccess: () => utils.todo.getAll.invalidate(),
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          createTodo.mutate({ text: formData.get('text') as string });
          e.currentTarget.reset();
        }}
      >
        <input name="text" required />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo.mutate({ id: todo.id })}
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Example 2: AI Chat App (Vercel AI SDK)

```bash
# Setup
pnpm add ai @ai-sdk/openai
pnpm dlx shadcn@latest add button input
```

```tsx
// app/api/chat/route.ts
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { useChat } from 'ai/react';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}

// app/chat/page.tsx
('use client');

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-4">
            <div className="font-bold">{m.role === 'user' ? 'You' : 'AI'}</div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 p-4">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </form>
    </div>
  );
}
```

---

### Example 3: SaaS with Stripe (Clerk + Drizzle)

```bash
# Setup
pnpm add @clerk/nextjs drizzle-orm postgres stripe
pnpm add -D drizzle-kit
```

```typescript
// db/schema.ts
import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  subscriptionId: text('subscription_id'),
  subscriptionStatus: text('subscription_status'),
  createdAt: timestamp('created_at').defaultNow(),
});

// app/api/create-subscription/route.ts
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [{ price: 'price_xxx', quantity: 1 }],
    mode: 'subscription',
    success_url: `${req.headers.get('origin')}/dashboard`,
    cancel_url: `${req.headers.get('origin')}/pricing`,
    metadata: { userId },
  });

  return Response.json({ url: session.url });
}

// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    await db
      .update(users)
      .set({
        subscriptionId: session.subscription as string,
        subscriptionStatus: 'active',
      })
      .where(eq(users.id, session.metadata!.userId));
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;

    await db
      .update(users)
      .set({ subscriptionStatus: 'canceled' })
      .where(eq(users.subscriptionId, subscription.id));
  }

  return Response.json({ received: true });
}

// middleware.ts - Protect routes
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

---

## 🎯 Which Stack Should You Choose?

### Choose **Supabase Stack** if:

- ✅ Need real-time features
- ✅ Want all-in-one backend
- ✅ Building MVP quickly
- ✅ Want generous free tier

### Choose **T3 Stack** if:

- ✅ Love TypeScript
- ✅ Want end-to-end type safety
- ✅ Need full control
- ✅ Building complex app

### Choose **AI Stack** if:

- ✅ Building AI features
- ✅ Need streaming responses
- ✅ Want modern UX
- ✅ Using LLMs

### Choose **Enterprise Stack** if:

- ✅ Building B2B SaaS
- ✅ Need enterprise auth
- ✅ Want scalability
- ✅ Have budget

---

## 📚 Resources

### Official Documentation

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Clerk](https://clerk.com/docs)
- [Supabase](https://supabase.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [Drizzle](https://orm.drizzle.team/)

### Templates & Starters

- [T3 Stack](https://create.t3.gg/)
- [Vercel Templates](https://vercel.com/templates/next.js)
- [Shadcn Starters](https://ui.shadcn.com/examples)

### Learning

- [Next.js Learn](https://nextjs.org/learn)
- [Vercel Ship](https://vercel.com/ship)

---

**สำหรับ project นี้ แนะนำเริ่มด้วย:**

1. **Shadcn/ui + Zod** (มีอยู่แล้ว: Tailwind v4)
2. **Supabase** (Database + Auth + Realtime)
3. **Vercel AI SDK** (ถ้าอยากทำ AI features)
4. **Clerk** (ถ้าต้องการ enterprise auth)

**เริ่มจากอันไหนดีครับ?** 🚀
