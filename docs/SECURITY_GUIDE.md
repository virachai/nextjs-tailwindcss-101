# Next.js 15 Security Guide

Complete security guide for building secure Next.js applications with OWASP best practices

## Table of Contents

- [🔒 Security Overview](#-security-overview)
- [🛡️ OWASP Top 10 for Next.js](#️-owasp-top-10-for-nextjs)
- [🔐 Authentication & Authorization](#-authentication--authorization)
- [🚫 XSS Prevention](#-xss-prevention)
- [🔑 CSRF Protection](#-csrf-protection)
- [📋 Content Security Policy (CSP)](#-content-security-policy-csp)
- [🔒 Security Headers](#-security-headers)
- [💾 Data Security](#-data-security)
- [🔍 Input Validation](#-input-validation)
- [🌐 API Security](#-api-security)
- [🔐 Environment Variables](#-environment-variables)
- [📦 Dependency Security](#-dependency-security)
- [🚀 Deployment Security](#-deployment-security)
- [✅ Security Checklist](#-security-checklist)
- [🧪 Security Testing](#-security-testing)

---

## 🔒 Security Overview

### Next.js 15 Built-in Security Features

Next.js 15 provides several security features out of the box:

✅ **Server Components** - Code runs on server, secrets never exposed
✅ **Server Actions** - Built-in CSRF protection
✅ **Automatic escaping** - XSS protection in JSX
✅ **Origin validation** - Server Actions validate request origin
✅ **Type safety** - TypeScript prevents many vulnerabilities
✅ **Middleware** - Request filtering before reaching routes

### Security Principles

1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimal permissions required
3. **Fail Securely** - Secure defaults, explicit opt-in
4. **Don't Trust User Input** - Validate everything
5. **Keep Secrets Secret** - Environment variables, not code

---

## 🛡️ OWASP Top 10 for Next.js

### 1. Injection Attacks ⚠️ CRITICAL

**Threat:** SQL injection, NoSQL injection, command injection

**Prevention:**

```typescript
// ❌ BAD - SQL Injection vulnerability
const userId = req.query.id;
const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ GOOD - Parameterized queries with Prisma
import { prisma } from '@/lib/db';

export default async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
}

// ✅ GOOD - Drizzle ORM with prepared statements
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getUser(userId: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  return user;
}

// ✅ GOOD - Input validation first
import { z } from 'zod';

const userIdSchema = z.string().uuid();

export async function getUser(userId: string) {
  const validatedId = userIdSchema.parse(userId);
  const user = await prisma.user.findUnique({
    where: { id: validatedId },
  });
  return user;
}
```

**Key Points:**
- ✅ Always use ORMs (Prisma, Drizzle)
- ✅ Never concatenate user input into queries
- ✅ Validate input with Zod/Valibot
- ✅ Use prepared statements

---

### 2. Broken Authentication ⚠️ CRITICAL

**Threat:** Weak passwords, session hijacking, credential stuffing

**Prevention:**

```typescript
// ✅ Use established auth libraries - Clerk
import { auth } from '@clerk/nextjs/server';

export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <div>Protected content</div>;
}

// ✅ Or NextAuth.js v5
import { auth } from '@/auth';

export default async function ProtectedPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <div>Protected content</div>;
}

// ✅ Server Actions with auth check
'use server';
import { auth } from '@clerk/nextjs/server';

export async function deletePost(postId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Verify ownership
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (post.authorId !== userId) {
    throw new Error('Forbidden');
  }

  await prisma.post.delete({ where: { id: postId } });
}

// ✅ Middleware protection
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/protected(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

**Key Points:**
- ✅ Use Clerk, NextAuth, or Supabase Auth
- ✅ Implement MFA (Multi-Factor Authentication)
- ✅ Enforce strong password policies
- ✅ Use secure session management
- ✅ Implement rate limiting

---

### 3. Sensitive Data Exposure ⚠️ CRITICAL

**Threat:** Exposing API keys, database credentials, user data

**Prevention:**

```typescript
// ❌ BAD - API key in client component
'use client';
const API_KEY = 'sk-1234567890'; // NEVER DO THIS!

// ✅ GOOD - Use environment variables
// .env.local
DATABASE_URL="postgresql://..."
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_API_URL="https://api.example.com"

// Server Component or API Route
export default async function ServerComponent() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // Safe - runs on server only
}

// Client Component - only public env vars
'use client';
export default function ClientComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Only NEXT_PUBLIC_* vars are available here
}

// ✅ GOOD - Protect sensitive data in responses
export async function GET() {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      // Don't select password, tokens, etc.
    },
  });

  return Response.json(user);
}

// ✅ GOOD - Use server-only package
import 'server-only';

export const db = new PrismaClient();
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ✅ GOOD - Redact sensitive data in logs
export function logUser(user: User) {
  console.log({
    id: user.id,
    email: user.email.replace(/(?<=.{2}).*(?=@)/, '***'),
    // Don't log passwords, tokens, etc.
  });
}
```

**Key Points:**
- ✅ Never commit secrets to git
- ✅ Use `.env.local` for local secrets
- ✅ Use `NEXT_PUBLIC_` prefix only for public variables
- ✅ Use Vercel/platform secret management
- ✅ Import `server-only` in server-only files
- ✅ Redact sensitive data in logs and responses

---

### 4. XML External Entities (XXE) ⚠️ HIGH

**Threat:** XML parsing vulnerabilities

**Prevention:**

```typescript
// ❌ BAD - Unsafe XML parsing
import * as xml2js from 'xml2js';

export async function parseXML(xmlString: string) {
  const parser = new xml2js.Parser();
  return parser.parseString(xmlString); // Vulnerable!
}

// ✅ GOOD - Disable external entities
import * as xml2js from 'xml2js';

export async function parseXML(xmlString: string) {
  const parser = new xml2js.Parser({
    explicitCharkey: false,
    xmlns: false,
    explicitRoot: false,
  });

  // Better: Use JSON instead of XML when possible
  return parser.parseString(xmlString);
}

// ✅ BEST - Use JSON APIs instead
export async function POST(req: Request) {
  const data = await req.json(); // JSON is safer than XML
  return Response.json({ data });
}
```

**Key Points:**
- ✅ Prefer JSON over XML
- ✅ Disable external entity processing
- ✅ Use safe parsing libraries

---

### 5. Broken Access Control ⚠️ CRITICAL

**Threat:** Unauthorized access to resources

**Prevention:**

```typescript
// ❌ BAD - No authorization check
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return Response.json({ success: true });
}

// ✅ GOOD - Verify ownership
import { auth } from '@clerk/nextjs/server';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!post) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  if (post.authorId !== userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.post.delete({ where: { id } });
  return Response.json({ success: true });
}

// ✅ GOOD - Role-based access control
type Role = 'admin' | 'user';

export async function canDeletePost(userId: string, postId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role === 'admin') {
    return true; // Admins can delete any post
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  return post?.authorId === userId; // Users can delete own posts
}

// ✅ GOOD - Middleware for route protection
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.redirect(new URL('/sign-in', req.url));
    }

    if (sessionClaims?.role !== 'admin') {
      return Response.redirect(new URL('/unauthorized', req.url));
    }
  }
});
```

**Key Points:**
- ✅ Always verify user authentication
- ✅ Check resource ownership
- ✅ Implement role-based access control (RBAC)
- ✅ Use middleware for route protection
- ✅ Follow principle of least privilege

---

### 6. Security Misconfiguration ⚠️ HIGH

**Threat:** Default credentials, verbose errors, missing headers

**Prevention:**

```typescript
// next.config.ts
const nextConfig = {
  // ✅ Disable x-powered-by header
  poweredByHeader: false,

  // ✅ Enable strict mode
  reactStrictMode: true,

  // ✅ Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

// ❌ BAD - Exposing error details in production
export async function GET() {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ✅ GOOD - Generic error messages in production
export async function GET() {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching data:', error); // Log for debugging

    return Response.json(
      {
        error: process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : error.message,
      },
      { status: 500 }
    );
  }
}
```

**Key Points:**
- ✅ Set security headers
- ✅ Disable verbose error messages in production
- ✅ Keep dependencies updated
- ✅ Use environment-specific configs
- ✅ Remove default credentials

---

### 7. Cross-Site Scripting (XSS) ⚠️ HIGH

**Threat:** Injecting malicious scripts into web pages

**Prevention:**

```tsx
// ✅ React automatically escapes by default
export default function SafeComponent({ userInput }: { userInput: string }) {
  return <div>{userInput}</div>; // Automatically escaped
}

// ❌ DANGEROUS - dangerouslySetInnerHTML
export default function UnsafeComponent({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />; // XSS risk!
}

// ✅ GOOD - Sanitize HTML with DOMPurify
import DOMPurify from 'isomorphic-dompurify';

export default function SafeHTMLComponent({ html }: { html: string }) {
  const sanitizedHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href'],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
}

// ✅ GOOD - Use markdown libraries with XSS protection
import ReactMarkdown from 'react-markdown';

export default function MarkdownComponent({ content }: { content: string }) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}

// ❌ BAD - Inline event handlers from user input
const userScript = "alert('XSS')";
<div onClick={() => eval(userScript)} />; // NEVER DO THIS!

// ✅ GOOD - No eval, no Function constructor
// Just don't use eval() or new Function() with user input

// ✅ GOOD - Validate URLs
import { z } from 'zod';

const urlSchema = z.string().url().refine(
  (url) => {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  },
  { message: 'Only HTTP/HTTPS URLs allowed' }
);

export function SafeLink({ href, children }: { href: string; children: React.ReactNode }) {
  try {
    const validUrl = urlSchema.parse(href);
    return <a href={validUrl} rel="noopener noreferrer">{children}</a>;
  } catch {
    return <span>{children}</span>;
  }
}

// ✅ GOOD - Content Security Policy (CSP)
// See CSP section below
```

**Key Points:**
- ✅ React escapes by default - use it!
- ✅ Never use `dangerouslySetInnerHTML` without sanitization
- ✅ Use DOMPurify for HTML sanitization
- ✅ Avoid `eval()`, `Function()`, `setTimeout(string)`
- ✅ Validate and sanitize user URLs
- ✅ Implement Content Security Policy

---

### 8. Insecure Deserialization ⚠️ HIGH

**Threat:** Untrusted data causing remote code execution

**Prevention:**

```typescript
// ❌ BAD - Deserializing untrusted data
const userData = JSON.parse(untrustedInput);

// ✅ GOOD - Validate after parsing
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().max(100),
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = userSchema.parse(body); // Throws if invalid
    // Use validatedData...
  } catch (error) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }
}

// ✅ GOOD - Type-safe API with tRPC
import { z } from 'zod';
import { publicProcedure, router } from './trpc';

export const appRouter = router({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      // input is type-safe and validated!
      return await db.user.create({ data: input });
    }),
});
```

**Key Points:**
- ✅ Always validate deserialized data with Zod
- ✅ Use type-safe APIs (tRPC)
- ✅ Don't trust serialized data from clients
- ✅ Set size limits on request bodies

---

### 9. Using Components with Known Vulnerabilities ⚠️ HIGH

**Threat:** Vulnerable npm packages

**Prevention:**

```bash
# ✅ Regular dependency audits
pnpm audit
pnpm audit --fix

# ✅ Use Dependabot (GitHub)
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10

# ✅ Use Snyk for vulnerability scanning
pnpm dlx snyk test
pnpm dlx snyk monitor

# ✅ Check licenses
pnpm dlx license-checker --summary
```

```json
// package.json - Use exact versions for critical packages
{
  "dependencies": {
    "next": "15.0.5", // Exact version
    "@clerk/nextjs": "^6.4.0" // Minor updates OK
  },
  "overrides": {
    "vulnerable-package": "1.2.3" // Force specific version
  }
}
```

**Key Points:**
- ✅ Run `pnpm audit` regularly
- ✅ Enable Dependabot/Renovate
- ✅ Keep dependencies updated
- ✅ Review CVE databases
- ✅ Use package lock files

---

### 10. Insufficient Logging & Monitoring ⚠️ MEDIUM

**Threat:** Cannot detect or respond to breaches

**Prevention:**

```typescript
// ✅ GOOD - Structured logging
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = await auth();

  try {
    const result = await sensitiveOperation();

    // Log successful operation
    console.log({
      timestamp: new Date().toISOString(),
      userId,
      action: 'sensitive_operation',
      status: 'success',
      ip: req.headers.get('x-forwarded-for'),
    });

    return Response.json(result);
  } catch (error) {
    // Log failed operation
    console.error({
      timestamp: new Date().toISOString(),
      userId,
      action: 'sensitive_operation',
      status: 'error',
      error: error.message,
      ip: req.headers.get('x-forwarded-for'),
    });

    return Response.json({ error: 'Operation failed' }, { status: 500 });
  }
}

// ✅ GOOD - Use Sentry for error tracking
import * as Sentry from '@sentry/nextjs';

export async function sensitiveAction() {
  try {
    await riskyOperation();
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        action: 'sensitive_operation',
      },
      user: {
        id: userId,
      },
    });
    throw error;
  }
}

// ✅ GOOD - Rate limiting with monitoring
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const { success, limit, remaining } = await ratelimit.limit(ip);

  if (!success) {
    console.warn({
      timestamp: new Date().toISOString(),
      event: 'rate_limit_exceeded',
      ip,
      limit,
    });

    return Response.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // Process request...
}
```

**Key Points:**
- ✅ Log authentication events
- ✅ Log authorization failures
- ✅ Log sensitive operations
- ✅ Use structured logging
- ✅ Implement alerting (Sentry, Datadog)
- ✅ Monitor rate limits

---

## 🔑 CSRF Protection

### Built-in Protection

Next.js 15 Server Actions have built-in CSRF protection:

```typescript
// ✅ Server Actions are automatically protected
'use server';

export async function updateProfile(formData: FormData) {
  // 1. POST method only
  // 2. Origin header checked against Host header
  // 3. Same-site cookie enforcement
  // Protected by default!
}
```

### Manual CSRF Protection for API Routes

```typescript
// lib/csrf.ts
import { headers } from 'next/headers';

export async function validateCSRF() {
  const headersList = await headers();
  const origin = headersList.get('origin');
  const host = headersList.get('host');

  if (!origin || !host) {
    throw new Error('Missing origin or host header');
  }

  const originUrl = new URL(origin);
  if (originUrl.host !== host) {
    throw new Error('CSRF validation failed');
  }
}

// app/api/update/route.ts
import { validateCSRF } from '@/lib/csrf';

export async function POST(req: Request) {
  await validateCSRF(); // Validate before processing

  const data = await req.json();
  // Process request...
}

// ✅ GOOD - Use CSRF tokens with forms
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function generateCSRFToken() {
  const token = randomBytes(32).toString('hex');
  const cookieStore = await cookies();

  cookieStore.set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return token;
}

export async function validateCSRFToken(token: string) {
  const cookieStore = await cookies();
  const storedToken = cookieStore.get('csrf-token')?.value;

  if (!storedToken || storedToken !== token) {
    throw new Error('Invalid CSRF token');
  }
}
```

**Key Points:**
- ✅ Server Actions have built-in CSRF protection
- ✅ Validate Origin vs Host for API routes
- ✅ Use SameSite cookies
- ✅ Implement CSRF tokens for forms
- ✅ Use POST for state-changing operations

---

## 📋 Content Security Policy (CSP)

### Strict CSP with Nonces

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate nonce for this request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline';
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const response = NextResponse.next();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Nonce', nonce);

  return response;
}

// app/layout.tsx
import { headers } from 'next/headers';
import Script from 'next/script';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const nonce = headersList.get('X-Nonce') || undefined;

  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.example.com/script.js"
          nonce={nonce}
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### CSP in next.config.ts

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.vercel-insights.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https:;
              font-src 'self' data:;
              connect-src 'self' https://vitals.vercel-insights.com;
              frame-ancestors 'none';
              base-uri 'self';
              form-action 'self';
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};
```

**Important:** When using nonces, all pages must be dynamically rendered.

**Key Points:**
- ✅ Start with strict `default-src 'self'`
- ✅ Use nonces for inline scripts
- ✅ Avoid `'unsafe-eval'` and `'unsafe-inline'`
- ✅ Use `strict-dynamic` for modern browsers
- ✅ Set `frame-ancestors 'none'` to prevent clickjacking
- ✅ Test CSP in report-only mode first

---

## 🔒 Security Headers

### Complete Security Headers Setup

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN', // or 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // CSP header (see above)
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

### Test Security Headers

```bash
# Check headers
curl -I https://yoursite.com

# Use SecurityHeaders.com
# Visit: https://securityheaders.com/?q=https://yoursite.com

# Use Mozilla Observatory
# Visit: https://observatory.mozilla.org/
```

**Key Headers Explained:**

- **Strict-Transport-Security (HSTS)** - Force HTTPS
- **X-Frame-Options** - Prevent clickjacking
- **X-Content-Type-Options** - Prevent MIME sniffing
- **X-XSS-Protection** - Legacy XSS filter
- **Referrer-Policy** - Control referrer information
- **Permissions-Policy** - Disable unused browser features
- **Content-Security-Policy** - Prevent XSS and injection

---

## 💾 Data Security

### Encrypt Sensitive Data

```typescript
// lib/crypto.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Usage in database
export async function saveUser(email: string, ssn: string) {
  const encryptedSSN = encrypt(ssn);

  await prisma.user.create({
    data: {
      email,
      ssn: encryptedSSN, // Store encrypted
    },
  });
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });

  return {
    ...user,
    ssn: user.ssn ? decrypt(user.ssn) : null,
  };
}
```

### Hash Passwords (if not using auth library)

```typescript
import bcrypt from 'bcryptjs';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Usage
'use server';
export async function registerUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword, // Never store plain text!
    },
  });
}
```

**Key Points:**
- ✅ Use AES-256-GCM for encryption
- ✅ Use bcrypt/argon2 for password hashing
- ✅ Never store passwords in plain text
- ✅ Rotate encryption keys periodically
- ✅ Use environment variables for keys

---

## 🔍 Input Validation

### Comprehensive Validation with Zod

```typescript
import { z } from 'zod';

// ✅ Email validation
const emailSchema = z.string().email().toLowerCase().trim();

// ✅ Strong password validation
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password too long')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');

// ✅ URL validation (prevent javascript: URLs)
const urlSchema = z.string().url().refine(
  (url) => {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  },
  { message: 'Only HTTP/HTTPS URLs allowed' }
);

// ✅ File upload validation
const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(5_000_000, 'File must be less than 5MB'),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp']),
});

// ✅ User input sanitization
const userInputSchema = z
  .string()
  .max(1000)
  .trim()
  .transform((val) => val.replace(/<script.*?>.*?<\/script>/gi, '')); // Remove script tags

// ✅ Pagination validation
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Usage in Server Action
'use server';
export async function createUser(formData: FormData) {
  const schema = z.object({
    email: emailSchema,
    password: passwordSchema,
    website: urlSchema.optional(),
  });

  const result = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    website: formData.get('website'),
  });

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  // result.data is now validated and type-safe!
  await createUserInDB(result.data);
}
```

**Key Points:**
- ✅ Validate all user input with Zod
- ✅ Sanitize HTML content
- ✅ Validate file uploads (size, type)
- ✅ Use allow-lists, not deny-lists
- ✅ Validate on both client and server

---

## 🌐 API Security

### Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
});

// Usage in API route
import { ratelimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  // Process request...
}

// Different limits for different endpoints
const authRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 login attempts per 15 min
});

const apiRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 API calls per minute
});
```

### API Key Authentication

```typescript
// lib/api-key.ts
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function validateAPIKey(): Promise<boolean> {
  const headersList = await headers();
  const apiKey = headersList.get('x-api-key');

  if (!apiKey) {
    return false;
  }

  // Hash the API key for comparison
  const hashedKey = crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');

  // Compare with stored hash
  return hashedKey === process.env.API_KEY_HASH;
}

// Usage
export async function GET(req: Request) {
  const isValid = await validateAPIKey();

  if (!isValid) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Process request...
}
```

### CORS Configuration

```typescript
// lib/cors.ts
import { NextResponse } from 'next/server';

const allowedOrigins = [
  'https://yourdomain.com',
  'https://app.yourdomain.com',
];

export function cors(req: Request, res: NextResponse) {
  const origin = req.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Max-Age', '86400');
  }

  return res;
}

// Usage in API route
export async function GET(req: Request) {
  const data = await fetchData();
  const response = NextResponse.json(data);
  return cors(req, response);
}

export async function OPTIONS(req: Request) {
  return cors(req, new NextResponse(null, { status: 200 }));
}
```

**Key Points:**
- ✅ Implement rate limiting
- ✅ Use API keys for service-to-service auth
- ✅ Configure CORS properly
- ✅ Validate content-type
- ✅ Set request size limits

---

## 🔐 Environment Variables

### Secure Environment Variable Management

```bash
# .env.local (NEVER commit this file!)
DATABASE_URL="postgresql://..."
STRIPE_SECRET_KEY="sk_test_..."
ENCRYPTION_KEY="64_char_hex_string"
API_KEY_HASH="sha256_hash"

# Public variables (available in browser)
NEXT_PUBLIC_API_URL="https://api.example.com"
NEXT_PUBLIC_SITE_URL="https://example.com"

# .env.example (commit this)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
STRIPE_SECRET_KEY="sk_test_xxx"
NEXT_PUBLIC_API_URL="https://api.example.com"
```

```typescript
// lib/env.ts - Type-safe environment variables
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  ENCRYPTION_KEY: z.string().length(64),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

// Usage
import { env } from '@/lib/env';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
```

```gitignore
# .gitignore
.env*.local
.env.production
```

**Key Points:**
- ✅ Never commit `.env.local`
- ✅ Use `NEXT_PUBLIC_` prefix for client-side vars
- ✅ Validate env vars with Zod
- ✅ Use platform secrets (Vercel, etc.)
- ✅ Rotate secrets regularly
- ✅ Use different secrets per environment

---

## 📦 Dependency Security

### Security Audit Workflow

```bash
# Check for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit --fix

# Use Snyk
pnpm dlx snyk test
pnpm dlx snyk monitor

# Check for outdated packages
pnpm outdated

# Update dependencies
pnpm update

# Use exact versions for critical packages
pnpm add next@15.0.5 --save-exact
```

### Automated Dependency Updates

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-team"
    commit-message:
      prefix: "chore"
      include: "scope"
```

### Package Verification

```bash
# Verify package integrity
pnpm install --frozen-lockfile

# Check for malicious packages
pnpm dlx socket security audit

# Review package permissions
pnpm why <package-name>
```

**Key Points:**
- ✅ Run `pnpm audit` before every deployment
- ✅ Enable Dependabot/Renovate
- ✅ Review dependency changes in PRs
- ✅ Use lock files (`pnpm-lock.yaml`)
- ✅ Monitor for CVEs

---

## 🚀 Deployment Security

### Vercel Security Checklist

```bash
# Set environment variables in Vercel dashboard
# Never commit secrets to git

# Enable security headers in vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}

# Use Vercel Firewall (Pro plan)
# Configure in Vercel dashboard:
# - Rate limiting
# - IP blocking
# - Attack Challenge Mode (ACM)

# Enable DDoS protection (automatic on Vercel)

# Use Vercel Authentication for sensitive branches
```

### Docker Security (Self-Hosting)

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install dependencies as root
FROM base AS deps
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

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Key Points:**
- ✅ Use environment-specific secrets
- ✅ Enable security headers
- ✅ Use HTTPS only
- ✅ Run containers as non-root
- ✅ Scan Docker images for vulnerabilities
- ✅ Use minimal base images (alpine)

---

## ✅ Security Checklist

### Pre-Deployment Checklist

#### Authentication & Authorization
- [ ] Using established auth library (Clerk, NextAuth, Supabase)
- [ ] MFA enabled for admin accounts
- [ ] Strong password policy enforced
- [ ] Session timeout configured
- [ ] Account lockout after failed attempts

#### Data Protection
- [ ] All sensitive data encrypted at rest
- [ ] Passwords hashed with bcrypt/argon2
- [ ] Environment variables not committed to git
- [ ] API keys rotated regularly
- [ ] Database backups encrypted

#### Input Validation
- [ ] All user input validated with Zod
- [ ] File upload validation (size, type)
- [ ] SQL injection prevention (using ORM)
- [ ] XSS prevention (no dangerouslySetInnerHTML without sanitization)
- [ ] URL validation (no javascript: URLs)

#### Security Headers
- [ ] Content-Security-Policy configured
- [ ] Strict-Transport-Security enabled
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] Referrer-Policy configured

#### API Security
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] API authentication required
- [ ] Request size limits set
- [ ] CSRF protection for API routes

#### Monitoring & Logging
- [ ] Error tracking configured (Sentry)
- [ ] Security events logged
- [ ] Failed login attempts logged
- [ ] Anomaly detection alerts set up
- [ ] Log retention policy defined

#### Dependencies
- [ ] All dependencies up to date
- [ ] No critical vulnerabilities (`pnpm audit`)
- [ ] Dependabot/Renovate enabled
- [ ] Package lock file committed
- [ ] Unused dependencies removed

#### Deployment
- [ ] HTTPS enforced
- [ ] Environment variables in platform (not code)
- [ ] Security headers deployed
- [ ] DDoS protection enabled
- [ ] Firewall rules configured

---

## 🧪 Security Testing

### Automated Security Testing

```bash
# Vulnerability scanning
pnpm audit
pnpm dlx snyk test

# OWASP ZAP (Zed Attack Proxy)
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://yoursite.com

# Lighthouse security audit
pnpm dlx lighthouse https://yoursite.com --view

# Test security headers
curl -I https://yoursite.com

# SQL injection testing
pnpm dlx sqlmap -u "https://yoursite.com/api/endpoint" --batch

# XSS testing with payload
curl -X POST https://yoursite.com/api/comment \
  -d '{"content": "<script>alert(1)</script>"}'
```

### Manual Security Testing

```typescript
// test/security.test.ts
import { describe, it, expect } from 'vitest';

describe('Security Tests', () => {
  it('should reject SQL injection attempts', async () => {
    const maliciousInput = "1' OR '1'='1";
    const response = await fetch('/api/user?id=' + maliciousInput);
    expect(response.status).toBe(400);
  });

  it('should sanitize XSS payloads', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    const response = await fetch('/api/comment', {
      method: 'POST',
      body: JSON.stringify({ content: xssPayload }),
    });
    const data = await response.json();
    expect(data.content).not.toContain('<script>');
  });

  it('should enforce rate limiting', async () => {
    const requests = Array(20).fill(null).map(() =>
      fetch('/api/endpoint')
    );

    const responses = await Promise.all(requests);
    const tooManyRequests = responses.filter(r => r.status === 429);

    expect(tooManyRequests.length).toBeGreaterThan(0);
  });

  it('should require authentication', async () => {
    const response = await fetch('/api/protected');
    expect(response.status).toBe(401);
  });

  it('should validate CSRF tokens', async () => {
    const response = await fetch('/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'test' }),
    });
    expect(response.status).toBe(403);
  });
});
```

### Penetration Testing Checklist

- [ ] SQL Injection testing
- [ ] XSS payload testing
- [ ] CSRF token bypass attempts
- [ ] Authentication bypass attempts
- [ ] Authorization escalation attempts
- [ ] Rate limit testing
- [ ] Session hijacking tests
- [ ] File upload vulnerabilities
- [ ] API endpoint fuzzing
- [ ] Security header validation

---

## 📚 Resources

### Official Documentation
- [Next.js Security](https://nextjs.org/docs/app/guides/data-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)

### Security Tools
- [Snyk](https://snyk.io/) - Vulnerability scanning
- [Dependabot](https://github.com/dependabot) - Dependency updates
- [Sentry](https://sentry.io/) - Error tracking
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [SecurityHeaders.com](https://securityheaders.com/) - Header testing

### Learning Resources
- [Web Security Academy](https://portswigger.net/web-security)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [HackerOne](https://www.hackerone.com/hackers/hacker101)

---

## 🎯 Quick Security Wins

1. **Enable all security headers** (5 minutes)
2. **Add rate limiting to API routes** (30 minutes)
3. **Implement CSP** (1 hour)
4. **Add input validation with Zod** (2 hours)
5. **Set up Dependabot** (10 minutes)
6. **Configure error tracking with Sentry** (30 minutes)
7. **Enable HTTPS and HSTS** (15 minutes)
8. **Run security audit** `pnpm audit` (5 minutes)

**Start with these 8 items for immediate security improvement!**

---

**Last Updated:** 2025-10-03
**Next.js Version:** 15.5
**Security Level:** Production-Ready ✅
