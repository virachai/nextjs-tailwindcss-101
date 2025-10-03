# Next.js 15 Performance Optimization Guide

Complete guide for optimizing Next.js 15 applications with verification methods and actionable checklists.

## Table of Contents

- [Performance Optimization Checklist](#performance-optimization-checklist)
- [1. Image Optimization](#1-image-optimization)
- [2. Font Optimization](#2-font-optimization)
- [3. Code Splitting & Bundle Size](#3-code-splitting--bundle-size)
- [4. Server Components](#4-server-components)
- [5. Caching Strategies](#5-caching-strategies)
- [6. Database & API Optimization](#6-database--api-optimization)
- [7. CSS & Styling](#7-css--styling)
- [8. Third-Party Scripts](#8-third-party-scripts)
- [9. Metadata & SEO](#9-metadata--seo)
- [10. Build & Deployment](#10-build--deployment)
- [Verification & Measurement](#verification--measurement)
- [Performance Workflow](#performance-workflow)

---

## Performance Optimization Checklist

### Quick Wins (Do First)
- [ ] Use Next.js Image component for all images
- [ ] Implement proper font loading with `next/font`
- [ ] Enable Turbopack for faster builds
- [ ] Use Server Components by default
- [ ] Add proper metadata for SEO
- [ ] Enable static generation where possible

### Medium Priority
- [ ] Implement code splitting with dynamic imports
- [ ] Optimize bundle size (analyze with Bundle Analyzer)
- [ ] Add proper caching headers
- [ ] Optimize API routes
- [ ] Use suspense boundaries for loading states
- [ ] Implement proper error boundaries

### Advanced
- [ ] Set up ISR (Incremental Static Regeneration)
- [ ] Implement streaming with React Server Components
- [ ] Add service worker for offline support
- [ ] Optimize for Core Web Vitals
- [ ] Implement partial prerendering (experimental)
- [ ] Set up edge middleware for geo-routing

---

## 1. Image Optimization

### Implementation

```tsx
import Image from 'next/image';

// ✅ Good - Optimized with Next.js Image
export function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // For above-the-fold images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}

// ❌ Bad - Regular img tag
export function UnoptimizedImage() {
  return <img src="/hero.jpg" alt="Hero" />;
}
```

### Best Practices

```tsx
// 1. Remote images - configure in next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
  },
};

// 2. Responsive images
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ objectFit: 'cover' }}
/>

// 3. Loading strategies
<Image src="/hero.jpg" alt="Hero" width={800} height={400} priority />
<Image src="/footer.jpg" alt="Footer" width={800} height={400} loading="lazy" />
```

### Verification

```bash
# Check image formats in Network tab (DevTools)
# Should see: WebP or AVIF formats
# Should NOT see: Large JPEG/PNG files

# Lighthouse audit
pnpm dlx lighthouse http://localhost:3000 --view
# Check: "Properly size images" and "Serve images in modern formats"
```

**Checklist:**
- [ ] All images use `next/image`
- [ ] Above-fold images have `priority` prop
- [ ] Remote images configured in `next.config.ts`
- [ ] Responsive images use `sizes` prop
- [ ] WebP/AVIF formats served (verify in Network tab)

---

## 2. Font Optimization

### Implementation

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

// ✅ Good - Variable fonts with subset
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

// Local fonts
import localFont from 'next/font/local';

const customFont = localFont({
  src: './fonts/CustomFont.woff2',
  display: 'swap',
  variable: '--font-custom',
});
```

### Best Practices

```tsx
// 1. Use variable fonts when possible
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent invisible text
  preload: true, // Preload critical fonts
});

// 2. Limit font weights
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Only load needed weights
});

// 3. Use font-display: swap
display: 'swap' // Shows fallback font while loading
```

### Verification

```bash
# Check in Network tab
# Should see: Font files loaded from _next/static/media
# Should see: Preload links in HTML <head>

# Lighthouse audit
# Check: "Ensure text remains visible during webfont load"
```

**Checklist:**
- [ ] Fonts loaded via `next/font`
- [ ] `display: 'swap'` configured
- [ ] Only necessary font weights loaded
- [ ] Fonts preloaded in HTML head
- [ ] No font-related CLS (Cumulative Layout Shift)

---

## 3. Code Splitting & Bundle Size

### Implementation

```tsx
// ✅ Good - Dynamic imports for client components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Disable SSR for client-only components
});

// ✅ Good - Named exports
const DashboardModal = dynamic(
  () => import('@/components/Dashboard').then((mod) => mod.DashboardModal)
);

// ✅ Good - Conditional loading
'use client';
import { useState } from 'react';

export function VideoPlayer() {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <button onClick={() => setShowPlayer(true)}>Load Player</button>
      {showPlayer && <HeavyVideoPlayer />}
    </>
  );
}
```

### Bundle Analysis

```bash
# Install bundle analyzer
pnpm add -D @next/bundle-analyzer

# Configure next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true pnpm build
```

### Best Practices

```tsx
// 1. Route-based splitting (automatic)
// app/dashboard/page.tsx
// app/settings/page.tsx
// Each route is automatically code-split

// 2. Component-based splitting
const AdminPanel = dynamic(() => import('@/components/AdminPanel'));

// 3. Library optimization
// Use barrel exports carefully
// ❌ Bad
import { Button, Modal, Tooltip } from '@/components';

// ✅ Good
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
```

### Verification

```bash
# Check bundle size
pnpm build
# Look for: "First Load JS" sizes in output

# Analyze chunks
ANALYZE=true pnpm build
# Opens interactive bundle analyzer

# Check in browser DevTools
# Network tab > JS files
# Should see: Multiple small chunks, not one large bundle
```

**Checklist:**
- [ ] Heavy components use dynamic imports
- [ ] Bundle analyzer configured
- [ ] First Load JS < 100KB per route
- [ ] No unnecessary dependencies
- [ ] Tree-shaking working (no unused exports in bundle)

---

## 4. Server Components

### Implementation

```tsx
// ✅ Good - Server Component (default)
// app/page.tsx
export default async function HomePage() {
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}

// ✅ Good - Client Component (only when needed)
// components/Counter.tsx
'use client';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ✅ Good - Hybrid approach
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchServerData();

  return (
    <div>
      <ServerSidebar data={data} /> {/* Server Component */}
      <InteractiveChart data={data} /> {/* Client Component */}
    </div>
  );
}
```

### When to Use Client Components

```tsx
// Use 'use client' when you need:
// - useState, useEffect, other React hooks
// - Event handlers (onClick, onChange, etc.)
// - Browser APIs (window, localStorage, etc.)
// - Third-party libraries that use React hooks

// ✅ Good - Server Component fetching data
async function ServerComponent() {
  const data = await db.query('SELECT * FROM users');
  return <ClientComponent data={data} />;
}

// ❌ Bad - Client Component fetching data
'use client';
function ClientComponent() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setData);
  }, []);
  return <div>{data.map(...)}</div>;
}
```

### Verification

```bash
# Check in browser DevTools
# View Page Source (Ctrl/Cmd+U)
# Should see: HTML content for Server Components
# Should NOT see: <div id="__next"></div> with empty content

# Network tab
# Compare: Server Components (HTML) vs Client Components (JS)
# Server Components = Less JavaScript shipped
```

**Checklist:**
- [ ] Default to Server Components
- [ ] Only use `'use client'` when necessary
- [ ] Data fetching in Server Components
- [ ] No unnecessary client-side state
- [ ] Reduced JavaScript bundle size

---

## 5. Caching Strategies

### Implementation

```tsx
// 1. Fetch Cache
// Cache by default
const data = await fetch('https://api.example.com/data');

// No cache
const data = await fetch('https://api.example.com/data', { cache: 'no-store' });

// Revalidate every 60 seconds
const data = await fetch('https://api.example.com/data', { next: { revalidate: 60 } });

// 2. Route Segment Config
// app/blog/page.tsx
export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-static'; // Force static generation

export default async function BlogPage() {
  const posts = await fetchPosts();
  return <PostList posts={posts} />;
}

// 3. Data Cache with React cache
import { cache } from 'react';

export const getUser = cache(async (id: string) => {
  const user = await db.user.findUnique({ where: { id } });
  return user;
});

// 4. Route Cache Headers
// app/api/data/route.ts
export async function GET() {
  const data = await fetchData();

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
```

### Caching Strategies

```tsx
// Static Site Generation (SSG) - Best performance
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: false }, // Cache forever
  });
  return <Content data={data} />;
}

// Incremental Static Regeneration (ISR)
export const revalidate = 60; // Revalidate every 60 seconds

// Server-Side Rendering (SSR) - Always fresh
export const dynamic = 'force-dynamic';

// Partial Prerendering (Experimental)
export const experimental_ppr = true;
```

### Verification

```bash
# Check caching in DevTools
# Network tab > Response Headers
# Should see: Cache-Control headers

# Check Next.js build output
pnpm build
# Look for:
# ○ (Static) - Statically generated
# ƒ (Dynamic) - Server-side rendered
# ● (SSG) - Static with getStaticProps

# Test revalidation
# 1. Build and start: pnpm build && pnpm start
# 2. Visit page, note content
# 3. Wait for revalidate time
# 4. Refresh, check for updated content
```

**Checklist:**
- [ ] Static pages use SSG/ISR
- [ ] Dynamic pages have proper cache headers
- [ ] API routes use appropriate caching
- [ ] No over-caching (stale data)
- [ ] No under-caching (performance loss)

---

## 6. Database & API Optimization

### Implementation

```tsx
// 1. Connection Pooling
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 2. Parallel Data Fetching
// ✅ Good - Parallel
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments(),
]);

// ❌ Bad - Sequential
const users = await fetchUsers();
const posts = await fetchPosts();
const comments = await fetchComments();

// 3. Database Query Optimization
// ❌ Bad - N+1 query problem
const posts = await db.post.findMany();
for (const post of posts) {
  const author = await db.user.findUnique({ where: { id: post.authorId } });
}

// ✅ Good - Include relation
const posts = await db.post.findMany({
  include: { author: true },
});

// 4. API Route Optimization
// app/api/users/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  const users = await db.user.findMany({
    take: limit,
    skip: offset,
    select: { id: true, name: true, email: true }, // Only needed fields
  });

  return Response.json(users, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
```

### Best Practices

```tsx
// 1. Use database indexes
// schema.prisma
model Post {
  id        String   @id
  title     String   @db.Text
  slug      String   @unique // Indexed
  authorId  String
  createdAt DateTime @default(now())

  @@index([authorId]) // Index for frequent lookups
  @@index([createdAt]) // Index for sorting
}

// 2. Implement pagination
async function getPaginatedPosts(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    db.post.findMany({ skip, take: limit }),
    db.post.count(),
  ]);
  return { posts, total, pages: Math.ceil(total / limit) };
}

// 3. Use streaming for large responses
export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const posts = await fetchLargeDataset();
      for (const post of posts) {
        controller.enqueue(encoder.encode(JSON.stringify(post) + '\n'));
      }
      controller.close();
    },
  });

  return new Response(stream);
}
```

### Verification

```bash
# Monitor database queries
# Enable query logging in Prisma
# Check for:
# - Slow queries (> 100ms)
# - N+1 queries
# - Missing indexes

# API performance testing
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/users

# Load testing
pnpm add -D autocannon
npx autocannon -c 100 -d 10 http://localhost:3000/api/users
```

**Checklist:**
- [ ] Database connection pooling configured
- [ ] No N+1 query problems
- [ ] Database indexes on frequently queried fields
- [ ] Pagination implemented for large datasets
- [ ] API responses cached appropriately
- [ ] Parallel data fetching where possible

---

## 7. CSS & Styling

### Implementation

```tsx
// 1. Tailwind CSS Optimization (already using v4)
// tailwind.config.ts - Already optimized in this project

// 2. CSS Modules for component-specific styles
// components/Button.module.css
.button {
  @apply px-4 py-2 rounded-lg;
}

// 3. Remove unused CSS
// package.json
{
  "scripts": {
    "build": "next build --turbopack",
    "analyze:css": "pnpm build && pnpm dlx tailwindcss-analyzer"
  }
}

// 4. Critical CSS (automatic with Next.js)
// Next.js automatically inlines critical CSS

// 5. CSS-in-JS optimization
// Use styled-components with SWC
// next.config.ts
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
};
```

### Best Practices

```tsx
// ✅ Good - Tailwind utility classes
<div className="flex items-center gap-4 rounded-lg bg-blue-500 p-4">
  <Button />
</div>

// ❌ Bad - Inline styles (no optimization)
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <Button />
</div>

// ✅ Good - Conditional classes with clsx
import clsx from 'clsx';

<button className={clsx(
  'rounded-lg px-4 py-2',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50'
)} />
```

### Verification

```bash
# Check CSS bundle size
pnpm build
# Look for CSS file sizes in .next/static/css

# Analyze unused CSS
pnpm dlx tailwindcss-analyzer

# Check CSS coverage in DevTools
# Coverage tab (Cmd+Shift+P > Show Coverage)
# Should see: High CSS usage % (> 70%)
```

**Checklist:**
- [ ] Tailwind CSS purge working
- [ ] No unused CSS in production
- [ ] CSS bundle size < 50KB
- [ ] Critical CSS inlined
- [ ] No CSS-in-JS runtime overhead (if using)

---

## 8. Third-Party Scripts

### Implementation

```tsx
import Script from 'next/script';

export default function Page() {
  return (
    <>
      {/* ✅ Good - Lazy load analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        strategy="lazyOnload"
      />

      {/* ✅ Good - After interactive for chat widgets */}
      <Script
        src="https://cdn.example.com/chat.js"
        strategy="afterInteractive"
      />

      {/* ✅ Good - Before interactive for critical scripts */}
      <Script
        src="https://cdn.example.com/critical.js"
        strategy="beforeInteractive"
      />

      {/* ✅ Good - Worker strategy (experimental) */}
      <Script
        src="https://cdn.example.com/heavy-analytics.js"
        strategy="worker"
      />
    </>
  );
}
```

### Loading Strategies

```tsx
// 1. beforeInteractive - Blocks page load (use sparingly)
<Script src="/critical.js" strategy="beforeInteractive" />

// 2. afterInteractive - Loads after page interactive (default)
<Script src="/analytics.js" strategy="afterInteractive" />

// 3. lazyOnload - Loads during idle time (best for performance)
<Script src="/chat-widget.js" strategy="lazyOnload" />

// 4. worker - Runs in Web Worker (experimental)
<Script src="/heavy-processing.js" strategy="worker" />
```

### Verification

```bash
# DevTools Network tab
# Check script loading order:
# 1. Critical scripts (beforeInteractive)
# 2. Page scripts
# 3. After interactive scripts
# 4. Lazy scripts

# Lighthouse audit
# Check: "Minimize third-party usage"
# Should see: Scripts loaded with appropriate strategies
```

**Checklist:**
- [ ] All third-party scripts use `next/script`
- [ ] Analytics use `lazyOnload` strategy
- [ ] No blocking scripts in `<head>`
- [ ] Critical scripts minimized
- [ ] Script impact on performance measured

---

## 9. Metadata & SEO

### Implementation

```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My App',
    default: 'My App',
  },
  description: 'My awesome Next.js app',
  openGraph: {
    title: 'My App',
    description: 'My awesome Next.js app',
    url: 'https://myapp.com',
    siteName: 'My App',
    images: [{ url: 'https://myapp.com/og.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'My awesome Next.js app',
    images: ['https://myapp.com/twitter.jpg'],
  },
};

// app/blog/[slug]/page.tsx
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}
```

### Best Practices

```tsx
// 1. Structured data
export default function ArticlePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Article Title',
    author: { '@type': 'Person', name: 'Author Name' },
    datePublished: '2024-01-01',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>...</article>
    </>
  );
}

// 2. Sitemap
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllPosts();

  return [
    { url: 'https://myapp.com', lastModified: new Date() },
    ...posts.map(post => ({
      url: `https://myapp.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ];
}

// 3. Robots.txt
// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: 'https://myapp.com/sitemap.xml',
  };
}
```

### Verification

```bash
# Check metadata in browser
# View Page Source > Check <head> tags

# SEO audit
pnpm dlx lighthouse http://localhost:3000 --view
# Check: SEO score > 90

# Validate structured data
# Google Rich Results Test
# https://search.google.com/test/rich-results

# Check sitemap
curl http://localhost:3000/sitemap.xml
```

**Checklist:**
- [ ] Metadata defined for all pages
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Structured data (JSON-LD) added
- [ ] Sitemap generated
- [ ] Robots.txt configured

---

## 10. Build & Deployment

### Implementation

```bash
# 1. Production build with Turbopack
pnpm build

# 2. Analyze build output
pnpm build | grep "First Load JS"

# 3. Environment-specific configs
# .env.production
DATABASE_URL=production-db-url
NEXT_PUBLIC_API_URL=https://api.production.com

# 4. Output modes
# next.config.ts
const nextConfig = {
  output: 'standalone', // For Docker/self-hosting
  // output: 'export', // For static export
};
```

### Deployment Optimization

```dockerfile
# Dockerfile (production)
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Verification

```bash
# Build size check
pnpm build
# Check: Total build size < 5MB

# Production server test
pnpm build && pnpm start
# Visit: http://localhost:3000
# Check: Response times < 200ms

# Docker build
docker build -t myapp .
docker run -p 3000:3000 myapp

# Performance test
pnpm dlx lighthouse http://localhost:3000 --view
# Target: All scores > 90
```

**Checklist:**
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Static assets optimized
- [ ] Docker build working (if applicable)
- [ ] Deployment previews configured
- [ ] Performance monitoring set up

---

## Verification & Measurement

### Core Web Vitals

```bash
# Lighthouse audit (comprehensive)
pnpm dlx lighthouse http://localhost:3000 --view

# WebPageTest (real-world testing)
# Visit: https://www.webpagetest.org/

# Chrome DevTools Performance tab
# 1. Open DevTools > Performance
# 2. Click Record
# 3. Reload page
# 4. Stop recording
# 5. Analyze: LCP, FID, CLS
```

### Performance Metrics

| Metric | Target | Good | Needs Improvement | Poor |
|--------|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | < 2.5s | 2.5s - 4s | > 4s |
| FID (First Input Delay) | < 100ms | < 100ms | 100ms - 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.1 | 0.1 - 0.25 | > 0.25 |
| TTFB (Time to First Byte) | < 600ms | < 600ms | 600ms - 1.8s | > 1.8s |
| FCP (First Contentful Paint) | < 1.8s | < 1.8s | 1.8s - 3s | > 3s |

### Monitoring Tools

```bash
# 1. Next.js Analytics (Vercel)
# Automatic with Vercel deployment

# 2. Web Vitals library
pnpm add web-vitals

# app/layout.tsx
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

# 3. Custom Web Vitals reporting
// app/web-vitals.ts
'use client';

import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  onCLS(console.log);
  onFID(console.log);
  onFCP(console.log);
  onLCP(console.log);
  onTTFB(console.log);
}
```

### Testing Checklist

- [ ] **Lighthouse Audit**: All scores > 90
- [ ] **LCP**: < 2.5s
- [ ] **FID**: < 100ms
- [ ] **CLS**: < 0.1
- [ ] **Bundle Size**: First Load JS < 100KB per route
- [ ] **Images**: All WebP/AVIF
- [ ] **Fonts**: Preloaded and optimized
- [ ] **API Response**: < 200ms average
- [ ] **Build Time**: < 2 minutes
- [ ] **Server Response**: TTFB < 600ms

---

## Performance Workflow

### Step-by-Step Process

#### 1. Initial Setup (Week 1)
- [ ] Set up performance monitoring (Lighthouse CI, Web Vitals)
- [ ] Configure Turbopack for faster builds
- [ ] Set up bundle analyzer
- [ ] Document baseline metrics

#### 2. Quick Wins (Week 1-2)
- [ ] Implement `next/image` for all images
- [ ] Optimize fonts with `next/font`
- [ ] Add metadata and SEO tags
- [ ] Enable static generation where possible
- [ ] Run initial Lighthouse audit

#### 3. Code Optimization (Week 2-3)
- [ ] Convert to Server Components where possible
- [ ] Implement dynamic imports for heavy components
- [ ] Optimize database queries
- [ ] Add proper caching strategies
- [ ] Run bundle analysis

#### 4. Advanced Optimization (Week 3-4)
- [ ] Implement ISR/SSG strategies
- [ ] Set up edge caching
- [ ] Add service worker (if needed)
- [ ] Optimize third-party scripts
- [ ] Implement streaming

#### 5. Testing & Verification (Ongoing)
- [ ] Run Lighthouse audits (weekly)
- [ ] Monitor Core Web Vitals (daily)
- [ ] Test on real devices
- [ ] Load testing with autocannon
- [ ] Check bundle size on every PR

#### 6. Maintenance (Ongoing)
- [ ] Review bundle size monthly
- [ ] Update dependencies regularly
- [ ] Monitor performance metrics
- [ ] Optimize new features before deployment
- [ ] Run regression tests

### Performance Budget

Set and enforce performance budgets:

```js
// next.config.ts
const nextConfig = {
  experimental: {
    // Set bundle size budgets
    bundlePagesRouterDependencies: true,
  },
};

// lighthouse-budget.json
{
  "budgets": [
    {
      "path": "/*",
      "resourceSizes": [
        { "resourceType": "script", "budget": 200 },
        { "resourceType": "image", "budget": 500 },
        { "resourceType": "stylesheet", "budget": 50 }
      ],
      "timings": [
        { "metric": "interactive", "budget": 3000 },
        { "metric": "first-contentful-paint", "budget": 1800 }
      ]
    }
  ]
}
```

### Automated Checks

```bash
# Add to package.json
{
  "scripts": {
    "perf:check": "pnpm build && pnpm dlx lighthouse http://localhost:3000 --budget-path=lighthouse-budget.json",
    "bundle:analyze": "ANALYZE=true pnpm build",
    "load:test": "npx autocannon -c 100 -d 10 http://localhost:3000"
  }
}

# Run before deployment
pnpm perf:check
```

---

## Quick Reference Commands

```bash
# Performance audits
pnpm dlx lighthouse http://localhost:3000 --view
pnpm dlx lighthouse http://localhost:3000 --only-categories=performance

# Bundle analysis
ANALYZE=true pnpm build

# Build size check
pnpm build | grep "First Load JS"

# Load testing
npx autocannon -c 100 -d 10 http://localhost:3000/api/users

# Web Vitals in browser console
# Paste in DevTools console:
new PerformanceObserver((list) => {
  list.getEntries().forEach(console.log);
}).observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});

# Check cache headers
curl -I http://localhost:3000/api/users

# Monitor memory usage
node --inspect node_modules/.bin/next start
# Then open chrome://inspect
```

---

## Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Next.js Analytics](https://vercel.com/docs/analytics)

---

**Last Updated**: 2025-10-03
**Next.js Version**: 15.5
**Project**: nextjs-tailwindcss-101
