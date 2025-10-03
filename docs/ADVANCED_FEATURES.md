# Advanced Next.js 15 Features Guide

คู่มือฟีเจอร์ขั้นสูงที่ทำให้ Next.js project โดดเด่นและไม่ธรรมดา

## Table of Contents

- [🚀 Top 10 Advanced Features](#-top-10-advanced-features)
- [💡 Recommended Features for This Project](#-recommended-features-for-this-project)
<!-- - [📚 Implementation Guides](#-implementation-guides) -->
- [🎯 Feature Comparison Matrix](#-feature-comparison-matrix)
- [🛠️ Quick Start Examples](#️-quick-start-examples)

---

## 🚀 Top 10 Advanced Features

### 1. Partial Prerendering (PPR) ⭐️⭐️⭐️⭐️⭐️

**What it is:**

- ใหม่ล่าสุดใน Next.js 15
- รวม Static + Dynamic content ในหน้าเดียว
- ส่วนที่ static จะ prerender, ส่วนที่ dynamic จะ stream

**Why it's special:**

- ⚡ Performance ดีที่สุด (static shell loads instantly)
- 🔄 Real-time data ได้พร้อมกัน
- 🎯 Best of both worlds

**Use cases:**

- Dashboard with real-time stats
- E-commerce product pages (static content + live inventory)
- News sites (static layout + live comments)

**Difficulty:** 🔥🔥🔥 (Medium-Hard)
**Impact:** 🌟🌟🌟🌟🌟 (Very High)

---

### 2. Server Actions with Optimistic UI ⭐️⭐️⭐️⭐️⭐️

**What it is:**

- เขียน server-side logic โดยตรงใน component
- ไม่ต้องสร้าง API routes
- Update UI ทันทีก่อนที่ server จะตอบกลับ

**Why it's special:**

- 🚀 UX ดีเยี่ยม (no loading state)
- 🔒 Type-safe end-to-end
- 📝 Code น้อยลง
- ♿ Progressive Enhancement (works without JS)

**Use cases:**

- Todo lists
- Like/Unlike buttons
- Forms with instant feedback
- Shopping cart

**Difficulty:** 🔥🔥 (Easy-Medium)
**Impact:** 🌟🌟🌟🌟🌟 (Very High)

---

### 3. Streaming SSR with Suspense ⭐️⭐️⭐️⭐️

**What it is:**

- ส่ง HTML ทีละส่วน (stream)
- ไม่ต้องรอให้ทุกอย่างโหลดเสร็จ
- แสดง loading state อัตโนมัติ

**Why it's special:**

- ⚡ Time to First Byte (TTFB) เร็วสุด
- 🎨 Loading states แบบ declarative
- 📱 Better mobile experience

**Use cases:**

- Slow database queries
- Multiple API calls
- Heavy computations
- Large data rendering

**Difficulty:** 🔥🔥 (Easy-Medium)
**Impact:** 🌟🌟🌟🌟 (High)

---

### 4. Edge Runtime + Middleware ⭐️⭐️⭐️⭐️

**What it is:**

- Run code ใกล้ user (CDN edge)
- Response เร็วมาก (< 50ms)
- Middleware ที่ทำงานก่อน request ถึง server

**Why it's special:**

- 🌍 Global performance
- 🔀 A/B testing
- 🔐 Authentication/Authorization
- 🗺️ Geo-based routing

**Use cases:**

- Feature flags
- IP blocking
- Redirect based on location
- Cookie-based routing

**Difficulty:** 🔥🔥🔥 (Medium)
**Impact:** 🌟🌟🌟🌟 (High)

---

### 5. Parallel Routes & Intercepting Routes ⭐️⭐️⭐️⭐️

**What it is:**

- แสดงหลาย route พร้อมกัน
- Modal ที่มี URL
- Complex layouts

**Why it's special:**

- 🎨 Advanced UX patterns
- 🔗 Shareable modal URLs
- 📱 Mobile-friendly navigation
- 🔄 Seamless transitions

**Use cases:**

- Dashboard with multiple panels
- Photo gallery modals
- Multi-step forms
- Split-screen interfaces

**Difficulty:** 🔥🔥🔥🔥 (Hard)
**Impact:** 🌟🌟🌟🌟 (High)

---

### 6. React Server Components + Direct Database Access ⭐️⭐️⭐️⭐️⭐️

**What it is:**

- เข้าถึง database โดยตรงใน component
- ไม่ต้องสร้าง API layer
- Zero client-side JavaScript

**Why it's special:**

- 🎯 Simplest architecture
- 🔒 Secure by default (database creds ไม่ leak)
- 📦 Smallest bundle size
- ⚡ Fastest data fetching

**Use cases:**

- Data-heavy pages
- Admin panels
- Reports & analytics
- Content management

**Difficulty:** 🔥🔥 (Easy-Medium)
**Impact:** 🌟🌟🌟🌟🌟 (Very High)

---

### 7. Dynamic OG Image Generation ⭐️⭐️⭐️⭐️

**What it is:**

- สร้าง Open Graph images ด้วย code
- ใช้ JSX + CSS สร้างรูป
- Generate on-the-fly

**Why it's special:**

- 🎨 Beautiful social media previews
- 🔄 Dynamic content (titles, images, stats)
- 🚀 No design tools needed
- 📊 Perfect for analytics/stats

**Use cases:**

- Blog post previews
- Product cards
- User profile cards
- Dynamic certificates

**Difficulty:** 🔥🔥 (Easy-Medium)
**Impact:** 🌟🌟🌟🌟 (High)

---

### 8. Streaming API with Server-Sent Events ⭐️⭐️⭐️

**What it is:**

- API ที่ stream ข้อมูล real-time
- Alternative to WebSocket
- ใช้ได้กับ Server Components

**Why it's special:**

- 📡 Real-time updates
- 🔄 Progressive data loading
- 💬 Chat applications
- 📊 Live dashboards

**Use cases:**

- AI chat responses
- Live notifications
- Stock tickers
- Log streaming

**Difficulty:** 🔥🔥🔥 (Medium)
**Impact:** 🌟🌟🌟 (Medium-High)

---

### 9. Advanced Metadata API + JSON-LD ⭐️⭐️⭐️

**What it is:**

- SEO metadata แบบ type-safe
- Structured data สำหรับ Google
- Dynamic per-page metadata

**Why it's special:**

- 🔍 Perfect SEO
- 📊 Rich snippets in search results
- 🎯 Type-safe metadata
- 🔄 Dynamic generation

**Use cases:**

- Blog with rich snippets
- E-commerce products
- Events & recipes
- Organization info

**Difficulty:** 🔥 (Easy)
**Impact:** 🌟🌟🌟 (Medium-High)

---

### 10. ISR with On-Demand Revalidation ⭐️⭐️⭐️⭐️

**What it is:**

- Static pages ที่ update ได้
- Trigger revalidation จาก webhook
- ไม่ต้อง rebuild ทั้ง site

**Why it's special:**

- ⚡ Static performance + fresh data
- 🔄 Update specific pages
- 💰 Cost-effective
- 🎯 Best for CMS integration

**Use cases:**

- Blog with CMS
- Product catalogs
- Documentation sites
- News portals

**Difficulty:** 🔥🔥 (Easy-Medium)
**Impact:** 🌟🌟🌟🌟 (High)

---

## 💡 Recommended Features for This Project

### Priority 1: Must Have 🎯

#### 1. Server Actions with Optimistic UI

**เหมาะสำหรับ:** Todo app, Forms, Interactive features

```tsx
// app/todos/actions.ts
'use server';

import { useOptimistic } from 'react';

// app/todos/actions.ts

// app/todos/actions.ts

// app/todos/actions.ts

export async function addTodo(formData: FormData) {
  const text = formData.get('text');
  const newTodo = await db.todo.create({ data: { text } });
  revalidatePath('/todos');
  return newTodo;
}

// app/todos/page.tsx
('use client');

export function TodoList({ initialTodos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(initialTodos, (state, newTodo) => [
    ...state,
    newTodo,
  ]);

  return (
    <form
      action={async (formData) => {
        addOptimisticTodo({ id: 'temp', text: formData.get('text') });
        await addTodo(formData);
      }}
    >
      <input name="text" />
      <button>Add</button>
    </form>
  );
}
```

**Benefits:**

- ✅ Modern UX pattern
- ✅ Easy to implement
- ✅ Type-safe
- ✅ No API routes needed

---

#### 2. Dynamic OG Image Generator

**เหมาะสำหรับ:** Blog, Portfolio, Social sharing

```tsx
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Default Title';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    openGraph: {
      images: [`/api/og?title=${encodeURIComponent(slug)}`],
    },
  };
}
```

**Benefits:**

- ✅ Professional look
- ✅ Automatic generation
- ✅ Customizable
- ✅ Great for marketing

---

#### 3. Streaming SSR with Suspense

**เหมาะสำหรับ:** Dashboard, Data-heavy pages

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

async function Stats() {
  const stats = await fetchStats(); // Slow query
  return <StatsCards stats={stats} />;
}

async function RecentActivity() {
  const activity = await fetchActivity(); // Another slow query
  return <ActivityList activity={activity} />;
}

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
```

**Benefits:**

- ✅ Fast initial page load
- ✅ Better perceived performance
- ✅ Automatic loading states
- ✅ SEO-friendly

---

### Priority 2: High Impact 🚀

#### 4. Edge Middleware for A/B Testing

**เหมาะสำหรับ:** Feature flags, Experiments

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const bucket = Math.random() > 0.5 ? 'A' : 'B';
  const response = NextResponse.next();

  response.cookies.set('bucket', bucket);
  response.headers.set('x-bucket', bucket);

  // Redirect based on bucket
  if (bucket === 'B' && request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/variant-b', request.url));
  }

  return response;
}

export const config = {
  matcher: '/',
};
```

**Benefits:**

- ✅ Fast edge execution
- ✅ Easy experiments
- ✅ No client-side flicker
- ✅ Analytics-ready

---

#### 5. Parallel Routes Dashboard

**เหมาะสำหรับ:** Admin panel, Complex UI

```plaintext
app/
  dashboard/
    @analytics/
      page.tsx
    @users/
      page.tsx
    @activity/
      page.tsx
    layout.tsx
    page.tsx
```

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  users,
  activity,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  users: React.ReactNode;
  activity: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">{children}</div>
      <div>{analytics}</div>
      <div>{users}</div>
      <div className="col-span-2">{activity}</div>
    </div>
  );
}
```

**Benefits:**

- ✅ Advanced layouts
- ✅ Independent loading states
- ✅ Better organization
- ✅ URL-based state

---

### Priority 3: Advanced 🔥

#### 6. Partial Prerendering (PPR)

**เหมาะสำหรับ:** High-traffic pages with dynamic sections

```tsx
// app/product/[id]/page.tsx
export const experimental_ppr = true;

export default async function ProductPage({ params }) {
  const { id } = await params;

  // Static parts (prerendered)
  const product = await getProduct(id);

  return (
    <div>
      {/* Static content */}
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />

      {/* Dynamic content (streamed) */}
      <Suspense fallback={<SkeletonReviews />}>
        <Reviews productId={id} />
      </Suspense>

      <Suspense fallback={<SkeletonInventory />}>
        <LiveInventory productId={id} />
      </Suspense>
    </div>
  );
}
```

**Benefits:**

- ✅ Maximum performance
- ✅ Fresh dynamic data
- ✅ Best UX
- ✅ Future-proof

---

#### 7. Direct Database Access in Server Components

**เหมาะสำหรับ:** Admin, Reports, Data dashboards

```tsx
// app/admin/users/page.tsx
import { prisma } from '@/lib/db';

export default async function AdminUsersPage() {
  // Direct database access - no API needed!
  const users = await prisma.user.findMany({
    include: {
      posts: { take: 5 },
      _count: { select: { posts: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <table>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user._count.posts} posts</td>
          <td>{user._count.comments} comments</td>
        </tr>
      ))}
    </table>
  );
}
```

**Benefits:**

- ✅ Simplest code
- ✅ Type-safe queries
- ✅ Best performance
- ✅ No API layer

---

#### 8. ISR with On-Demand Revalidation

**เหมาะสำหรับ:** Blog, CMS, Product catalog

```tsx
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

// app/blog/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <Article post={post} />;
}

export async function POST(request: Request) {
  const { path } = await request.json();

  // Webhook from CMS triggers this
  revalidatePath(path);

  return Response.json({ revalidated: true });
}
```

**Benefits:**

- ✅ Static performance
- ✅ Fresh content
- ✅ Cost-effective
- ✅ Scalable

---

## 🎯 Feature Comparison Matrix

| Feature                        | Difficulty    | Impact               | Use Case           | Time to Implement |
| ------------------------------ | ------------- | -------------------- | ------------------ | ----------------- |
| Server Actions + Optimistic UI | 🔥🔥 Easy     | 🌟🌟🌟🌟🌟 Very High | Forms, Interactive | 2-4 hours         |
| Dynamic OG Images              | 🔥🔥 Easy     | 🌟🌟🌟🌟 High        | Social sharing     | 1-2 hours         |
| Streaming SSR                  | 🔥🔥 Easy     | 🌟🌟🌟🌟 High        | Slow pages         | 2-3 hours         |
| Edge Middleware                | 🔥🔥🔥 Medium | 🌟🌟🌟🌟 High        | A/B testing        | 3-5 hours         |
| Parallel Routes                | 🔥🔥🔥🔥 Hard | 🌟🌟🌟🌟 High        | Complex UI         | 4-8 hours         |
| Direct DB Access               | 🔥🔥 Easy     | 🌟🌟🌟🌟🌟 Very High | Data pages         | 1-2 hours         |
| ISR + Revalidation             | 🔥🔥 Easy     | 🌟🌟🌟🌟 High        | CMS integration    | 2-4 hours         |
| PPR                            | 🔥🔥🔥 Medium | 🌟🌟🌟🌟🌟 Very High | High-traffic       | 4-6 hours         |
| Streaming API                  | 🔥🔥🔥 Medium | 🌟🌟🌟 Medium        | Real-time          | 3-5 hours         |
| Advanced Metadata              | 🔥 Easy       | 🌟🌟🌟 Medium        | SEO                | 1-2 hours         |

---

## 🛠️ Quick Start Examples

### Example 1: Todo App with Server Actions

Create a complete todo app in 3 files:

```tsx
// lib/db.ts
export const todos: Todo[] = [];

// app/todos/actions.ts
'use server'
import { revalidatePath } from 'next/cache';
import { todos } from '@/lib/db';

export async function addTodo(formData: FormData) {
  const text = formData.get('text') as string;
  todos.push({ id: Date.now(), text, done: false });
  revalidatePath('/todos');
}

export async function toggleTodo(id: number) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
  revalidatePath('/todos');
}

// app/todos/page.tsx
import { addTodo, toggleTodo } from './actions';

export default function TodosPage() {
  return (
    <div>
      <form action={addTodo}>
        <input name="text" required />
        <button>Add</button>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <form action={toggleTodo.bind(null, todo.id)}>
              <button>{todo.done ? '✅' : '⬜'}</button>
              {todo.text}
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Example 2: Dynamic OG Image

```tsx
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'My App';
  const description = searchParams.get('description') || '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(to bottom, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        {description && (
          <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.9)' }}>{description}</div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

Test at: `http://localhost:3000/api/og?title=Hello&description=World`

---

### Example 3: A/B Testing Middleware

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get or set variant
  let variant = request.cookies.get('variant')?.value;

  if (!variant) {
    variant = Math.random() > 0.5 ? 'A' : 'B';
  }

  const response =
    variant === 'B'
      ? NextResponse.rewrite(new URL('/variant-b', request.url))
      : NextResponse.next();

  response.cookies.set('variant', variant, { maxAge: 60 * 60 * 24 * 30 });

  return response;
}

export const config = {
  matcher: '/',
};
```

---

### Example 4: Streaming Dashboard

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

async function UserStats() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return <div>Users: 1,234</div>;
}

async function Revenue() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <div>Revenue: $12,345</div>;
}

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4 p-8">
      <Suspense fallback={<div className="h-20 animate-pulse bg-gray-200" />}>
        <UserStats />
      </Suspense>

      <Suspense fallback={<div className="h-20 animate-pulse bg-gray-200" />}>
        <Revenue />
      </Suspense>
    </div>
  );
}
```

---

## 📊 Implementation Roadmap

### Week 1: Foundation

- [ ] Setup Server Actions
- [ ] Create basic forms with optimistic UI
- [ ] Add streaming to slow pages
- [ ] Implement dynamic OG images

### Week 2: Enhancement

- [ ] Add Edge middleware for A/B testing
- [ ] Implement ISR with revalidation
- [ ] Add structured metadata
- [ ] Create admin panel with direct DB access

### Week 3: Advanced

- [ ] Setup Parallel Routes for dashboard
- [ ] Enable PPR on key pages
- [ ] Add streaming API for real-time features
- [ ] Implement intercepting routes for modals

### Week 4: Polish

- [ ] Performance optimization
- [ ] Add analytics tracking
- [ ] Create documentation
- [ ] Deploy and monitor

---

## 🎓 Learning Resources

### Official Docs

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [PPR](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)

### Video Tutorials

- [Server Actions Deep Dive](https://www.youtube.com/watch?v=dDpZfOQBMaU)
- [Next.js 15 New Features](https://www.youtube.com/watch?v=gfU1iZnjRZM)

### Example Projects

- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Vercel Templates](https://vercel.com/templates/next.js)

---

## 🎯 Conclusion

**สำหรับ project นี้ แนะนำเริ่มด้วย:**

1. **Server Actions + Optimistic UI** (2-4 ชั่วโมง)
   - Impact สูง, ทำง่าย
   - เหมาะสำหรับ learning

2. **Dynamic OG Images** (1-2 ชั่วโมง)
   - ได้ผลลัพธ์สวยงาม
   - ดูเป็น professional

3. **Streaming SSR** (2-3 ชั่วโมง)
   - Performance boost ชัดเจน
   - UX ดีขึ้นมาก

**Total time:** ~6-9 ชั่วโมง สำหรับ 3 features หลัก

หลังจากนั้นค่อย add:

- Edge Middleware (A/B testing)
- Parallel Routes (Advanced dashboard)

---

**เริ่มจาก feature ไหนดีครับ?** แนะนำ **Server Actions** เพราะ:

- ✅ ใช้งานบ่อยที่สุด
- ✅ เรียนรู้ได้เร็ว
- ✅ ได้ผลชัดเจน
- ✅ Foundation สำหรับ features อื่น
