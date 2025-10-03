# Redis with Next.js Complete Guide

Complete guide for integrating Redis with Next.js for caching, sessions, real-time features, and more

## Table of Contents

- [🚀 Why Redis with Next.js?](#-why-redis-with-nextjs)
- [⚡ Quick Start](#-quick-start)
- [💾 Caching Strategies](#-caching-strategies)
- [🔐 Session Management](#-session-management)
- [⏱️ Rate Limiting](#️-rate-limiting)
- [📊 Real-time Features](#-real-time-features)
- [🎯 Job Queue](#-job-queue)
- [🔔 Pub/Sub Messaging](#-pubsub-messaging)
- [📈 Analytics & Metrics](#-analytics--metrics)
- [🎮 Advanced Patterns](#-advanced-patterns)
- [🏢 Production Best Practices](#-production-best-practices)
- [✅ Complete Examples](#-complete-examples)

---

## 🚀 Why Redis with Next.js?

### What is Redis?

**Redis** = Remote Dictionary Server

- In-memory data store
- Key-value database
- Blazing fast (sub-millisecond latency)
- Supports multiple data structures

### Use Cases for Next.js

✅ **Caching** - API responses, database queries
✅ **Session Storage** - User sessions, JWT tokens
✅ **Rate Limiting** - Prevent API abuse
✅ **Real-time** - Live updates, notifications
✅ **Queue** - Background jobs, email sending
✅ **Pub/Sub** - Chat, notifications
✅ **Analytics** - Page views, user activity
✅ **Leaderboards** - Gaming, competitions

### Performance Benefits

```plaintext
Without Redis:
Database Query → 50-200ms
API Call → 100-500ms

With Redis:
Cache Hit → 1-5ms
⚡ 10-100x faster!
```

---

## ⚡ Quick Start

### Option 1: Upstash (Serverless Redis - Recommended for Next.js)

```bash
# Install
pnpm add @upstash/redis

# No server management needed!
# Works perfectly with serverless (Vercel, etc.)
```

```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Usage
const data = await redis.get('user:123');
await redis.set('user:123', { name: 'John' });
```

### Option 2: ioredis (Traditional Redis)

```bash
# Install
pnpm add ioredis

# Requires Redis server
# Local: docker run -d -p 6379:6379 redis
# Production: Redis Cloud, AWS ElastiCache, etc.
```

```typescript
// lib/redis.ts
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// With connection pool
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Usage
const data = await redis.get('user:123');
await redis.set('user:123', JSON.stringify({ name: 'John' }));
```

### Environment Variables

```bash
# .env.local

# Upstash (Serverless)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"

# Traditional Redis
REDIS_URL="redis://localhost:6379"
# or
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""
```

---

## 💾 Caching Strategies

### 1. API Response Caching

```typescript
// app/api/users/[id]/route.ts
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cacheKey = `user:${id}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('Cache hit!');
    return Response.json(cached);
  }

  // Cache miss - fetch from database
  console.log('Cache miss - fetching from DB');
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  // Store in cache (expire in 1 hour)
  await redis.set(cacheKey, JSON.stringify(user), {
    ex: 3600, // 1 hour
  });

  return Response.json(user);
}
```

### 2. Cache Wrapper Utility

```typescript
// lib/cache.ts
import { redis } from './redis';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // For cache invalidation
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 3600, tags = [] } = options;

  // Try cache
  const cached = await redis.get(key);
  if (cached) {
    return typeof cached === 'string' ? JSON.parse(cached) : cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  if (ttl > 0) {
    await redis.set(key, JSON.stringify(data), { ex: ttl });
  }

  // Store tags for invalidation
  if (tags.length > 0) {
    for (const tag of tags) {
      await redis.sadd(`tag:${tag}`, key);
    }
  }

  return data;
}

export async function invalidateCache(key: string) {
  await redis.del(key);
}

export async function invalidateByTag(tag: string) {
  const keys = await redis.smembers(`tag:${tag}`);
  if (keys.length > 0) {
    await redis.del(...keys);
    await redis.del(`tag:${tag}`);
  }
}

// Usage in Server Component
export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCached(
    `user:${id}`,
    async () => {
      return await prisma.user.findUnique({
        where: { id },
        include: { posts: true },
      });
    },
    {
      ttl: 3600, // 1 hour
      tags: ['users', `user:${id}`],
    }
  );

  return <UserProfile user={user} />;
}

// Invalidate when user is updated
'use server';
export async function updateUser(id: string, data: any) {
  await prisma.user.update({ where: { id }, data });

  // Invalidate cache
  await invalidateCache(`user:${id}`);
  await invalidateByTag('users');
}
```

### 3. Database Query Caching

```typescript
// lib/repositories/user.repository.ts
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export class UserRepository {
  async findById(id: string) {
    const cacheKey = `user:${id}`;

    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return typeof cached === 'string' ? JSON.parse(cached) : cached;
    }

    // Query database
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (user) {
      // Cache for 1 hour
      await redis.setex(cacheKey, 3600, JSON.stringify(user));
    }

    return user;
  }

  async update(id: string, data: any) {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    // Invalidate cache
    await redis.del(`user:${id}`);

    return user;
  }

  async search(query: string) {
    const cacheKey = `search:users:${query}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return typeof cached === 'string' ? JSON.parse(cached) : cached;
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });

    // Cache search results for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(users));

    return users;
  }
}
```

### 4. Cache Aside Pattern

```typescript
// lib/cache-aside.ts
import { redis } from './redis';

export async function cacheAside<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // 1. Try to get from cache
  const cached = await redis.get(key);

  if (cached) {
    // 2. Cache hit - return cached data
    return typeof cached === 'string' ? JSON.parse(cached) : cached;
  }

  // 3. Cache miss - fetch from source
  const data = await fetcher();

  // 4. Store in cache for next time
  await redis.setex(key, ttl, JSON.stringify(data));

  // 5. Return fresh data
  return data;
}

// Usage
const posts = await cacheAside(
  'posts:recent',
  async () => {
    return await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  },
  600 // 10 minutes
);
```

---

## 🔐 Session Management

### Session Store with Redis

```typescript
// lib/session.ts
import { cookies } from 'next/headers';
// Middleware to refresh session
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { randomBytes } from 'crypto';

import { redis } from './redis';

interface Session {
  userId: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: string, email: string): Promise<string> {
  const sessionId = randomBytes(32).toString('hex');
  const session: Session = {
    userId,
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL * 1000,
  };

  // Store in Redis
  await redis.setex(`session:${sessionId}`, SESSION_TTL, JSON.stringify(session));

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL,
  });

  return sessionId;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) return null;

  const session = await redis.get(`session:${sessionId}`);

  if (!session) return null;

  return typeof session === 'string' ? JSON.parse(session) : session;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (sessionId) {
    await redis.del(`session:${sessionId}`);
    cookieStore.delete('session');
  }
}

export async function refreshSession(sessionId: string): Promise<void> {
  const session = await redis.get(`session:${sessionId}`);

  if (session) {
    // Extend TTL
    await redis.expire(`session:${sessionId}`, SESSION_TTL);
  }
}

// Usage in Server Action
('use server');
export async function login(email: string, password: string) {
  const user = await verifyCredentials(email, password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  await createSession(user.id, user.email);

  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('session')?.value;

  if (sessionId) {
    // Refresh session on each request
    await refreshSession(sessionId);
  }

  return NextResponse.next();
}
```

---

## ⏱️ Rate Limiting

### Simple Rate Limiter

```typescript
// lib/rate-limit.ts
import { redis } from './redis';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  identifier: string,
  limit: number = 10,
  window: number = 60 // seconds
): Promise<RateLimitResult> {
  const key = `rate-limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - window * 1000;

  // Remove old entries
  await redis.zremrangebyscore(key, 0, windowStart);

  // Count requests in current window
  const requestCount = await redis.zcard(key);

  if (requestCount >= limit) {
    // Get oldest request to calculate reset time
    const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
    const resetTime = oldest[1] ? parseInt(oldest[1]) + window * 1000 : now + window * 1000;

    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(resetTime / 1000),
    };
  }

  // Add current request
  await redis.zadd(key, now, `${now}-${Math.random()}`);
  await redis.expire(key, window);

  return {
    success: true,
    limit,
    remaining: limit - requestCount - 1,
    reset: Math.ceil((now + window * 1000) / 1000),
  };
}

// Usage in API Route
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  const rateLimitResult = await rateLimit(ip, 10, 60); // 10 requests per minute

  if (!rateLimitResult.success) {
    return Response.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );
  }

  // Process request...
}
```

### Advanced Rate Limiter (Upstash Ratelimit)

```bash
pnpm add @upstash/ratelimit
```

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';

import { redis } from './redis';

// Fixed window: 10 requests per 10 seconds
export const fixedWindowLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, '10 s'),
  analytics: true,
});

// Sliding window: 100 requests per minute
export const slidingWindowLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
});

// Token bucket: Allow bursts
export const tokenBucketLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.tokenBucket(5, '10 s', 10), // 5 tokens/10s, max 10 tokens
  analytics: true,
});

// Usage
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  const { success, limit, remaining, reset } = await slidingWindowLimiter.limit(ip);

  if (!success) {
    return Response.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        },
      }
    );
  }

  // Process request...
}

// Per-user rate limiting
('use server');
export async function createPost(data: any) {
  const { userId } = await auth();

  const { success } = await slidingWindowLimiter.limit(`user:${userId}:create-post`);

  if (!success) {
    throw new Error('Too many posts created. Please try again later.');
  }

  // Create post...
}
```

---

## 📊 Real-time Features

### Live View Counter

```typescript
// Server Action
'use server';
import { redis } from '@/lib/redis';

export async function incrementViewCount(postId: string) {
  await redis.hincrby('post:views', postId, 1);
}

export async function getViewCount(postId: string): Promise<number> {
  const count = await redis.hget('post:views', postId);
  return count ? parseInt(count) : 0;
}

export async function getTopPosts(limit: number = 10) {
  const posts = await redis.hgetall('post:views');

  return Object.entries(posts)
    .map(([id, views]) => ({ id, views: parseInt(views) }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

// Server Component
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Increment view count
  await incrementViewCount(id);

  // Get view count
  const views = await getViewCount(id);

  return (
    <div>
      <h1>Post {id}</h1>
      <p>{views} views</p>
    </div>
  );
}
```

### Online Users Tracking

```typescript
// lib/presence.ts
import { useEffect } from 'react';

import { redis } from './redis';

const PRESENCE_TTL = 60; // 60 seconds

export async function markUserOnline(userId: string) {
  const key = 'users:online';
  await redis.zadd(key, Date.now(), userId);
  await redis.expire(key, PRESENCE_TTL * 2);
}

export async function markUserOffline(userId: string) {
  await redis.zrem('users:online', userId);
}

export async function getOnlineUsers(): Promise<string[]> {
  const now = Date.now();
  const cutoff = now - PRESENCE_TTL * 1000;

  // Remove stale entries
  await redis.zremrangebyscore('users:online', 0, cutoff);

  // Get online users
  return await redis.zrange('users:online', 0, -1);
}

export async function getOnlineCount(): Promise<number> {
  const now = Date.now();
  const cutoff = now - PRESENCE_TTL * 1000;

  return await redis.zcount('users:online', cutoff, '+inf');
}

// Heartbeat endpoint
// app/api/heartbeat/route.ts
export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await markUserOnline(userId);

  const count = await getOnlineCount();

  return Response.json({ online: count });
}

// Client Component (send heartbeat every 30s)
('use client');

export function OnlineTracker() {
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetch('/api/heartbeat', { method: 'POST' });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}
```

---

## 🎯 Job Queue

### Background Job Processing with BullMQ

```bash
pnpm add bullmq
```

```typescript
// lib/queue.ts
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL!);

// Email queue
export const emailQueue = new Queue('email', { connection });

// Image processing queue
export const imageQueue = new Queue('image-processing', { connection });

// Add job to queue
export async function sendWelcomeEmail(userId: string, email: string) {
  await emailQueue.add('welcome', {
    userId,
    email,
  });
}

export async function processImage(imageUrl: string) {
  await imageQueue.add('resize', {
    imageUrl,
    sizes: [400, 800, 1200],
  });
}

// Worker (separate process or file)
// workers/email.worker.ts
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendEmail } from '@/lib/email';

const connection = new IORedis(process.env.REDIS_URL!);

const emailWorker = new Worker(
  'email',
  async (job) => {
    const { userId, email } = job.data;

    switch (job.name) {
      case 'welcome':
        await sendEmail({
          to: email,
          subject: 'Welcome!',
          template: 'welcome',
        });
        break;

      case 'reset-password':
        await sendEmail({
          to: email,
          subject: 'Reset Password',
          template: 'reset-password',
        });
        break;
    }

    console.log(`Email sent to ${email}`);
  },
  { connection }
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

// Usage in Server Action
'use server';
export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;

  const user = await prisma.user.create({
    data: { email, name },
  });

  // Queue welcome email (non-blocking)
  await sendWelcomeEmail(user.id, user.email);

  return { success: true };
}
```

---

## 🔔 Pub/Sub Messaging

### Real-time Chat with Redis Pub/Sub

```typescript
// lib/pubsub.ts
import IORedis from 'ioredis';

const publisher = new IORedis(process.env.REDIS_URL!);
const subscriber = new IORedis(process.env.REDIS_URL!);

export async function publish(channel: string, message: any) {
  await publisher.publish(channel, JSON.stringify(message));
}

export function subscribe(channel: string, callback: (message: any) => void) {
  subscriber.subscribe(channel);

  subscriber.on('message', (ch, msg) => {
    if (ch === channel) {
      callback(JSON.parse(msg));
    }
  });

  return () => subscriber.unsubscribe(channel);
}

// Server Action (publish message)
'use server';
export async function sendChatMessage(roomId: string, message: string) {
  const { userId, user } = await auth();

  if (!userId) throw new Error('Unauthorized');

  const chatMessage = {
    id: randomUUID(),
    roomId,
    userId,
    userName: user?.name,
    message,
    timestamp: Date.now(),
  };

  // Store in database
  await prisma.chatMessage.create({ data: chatMessage });

  // Publish to subscribers
  await publish(`chat:${roomId}`, chatMessage);

  return chatMessage;
}

// API Route (subscribe to messages via SSE)
// app/api/chat/[roomId]/subscribe/route.ts
export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Subscribe to Redis channel
      const unsubscribe = subscribe(`chat:${roomId}`, (message) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
        );
      });

      // Cleanup on close
      req.signal.addEventListener('abort', () => {
        unsubscribe();
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

export function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/chat/${roomId}/subscribe`);

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      eventSource.close();
    };
  }, [roomId]);

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.userName}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
}
```

---

## 📈 Analytics & Metrics

### Page View Analytics

```typescript
// lib/analytics.ts
import { redis } from './redis';

export async function trackPageView(page: string, userId?: string) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Increment total views
  await redis.hincrby(`views:${today}`, page, 1);

  // Track unique views
  if (userId) {
    await redis.sadd(`views:${today}:${page}:unique`, userId);
  }

  // Track hourly views
  const hour = new Date().getHours();
  await redis.hincrby(`views:${today}:hourly`, `${page}:${hour}`, 1);
}

export async function getPageViews(page: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0];

  const [total, unique] = await Promise.all([
    redis.hget(`views:${targetDate}`, page),
    redis.scard(`views:${targetDate}:${page}:unique`),
  ]);

  return {
    total: total ? parseInt(total) : 0,
    unique,
  };
}

export async function getTopPages(date?: string, limit: number = 10) {
  const targetDate = date || new Date().toISOString().split('T')[0];

  const views = await redis.hgetall(`views:${targetDate}`);

  return Object.entries(views)
    .map(([page, count]) => ({ page, views: parseInt(count) }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

// Server Component
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { userId } = await auth();

  // Track page view
  await trackPageView(`/blog/${slug}`, userId);

  const stats = await getPageViews(`/blog/${slug}`);

  return (
    <div>
      <p>{stats.total} views ({stats.unique} unique)</p>
    </div>
  );
}
```

### Leaderboard

```typescript
// lib/leaderboard.ts
import { redis } from './redis';

export async function addScore(userId: string, score: number) {
  await redis.zadd('leaderboard', score, userId);
}

export async function incrementScore(userId: string, increment: number = 1) {
  await redis.zincrby('leaderboard', increment, userId);
}

export async function getLeaderboard(limit: number = 10) {
  const results = await redis.zrange('leaderboard', 0, limit - 1, {
    rev: true,
    withScores: true,
  });

  const leaderboard = [];
  for (let i = 0; i < results.length; i += 2) {
    leaderboard.push({
      userId: results[i],
      score: parseInt(results[i + 1]),
      rank: i / 2 + 1,
    });
  }

  return leaderboard;
}

export async function getUserRank(userId: string) {
  const rank = await redis.zrevrank('leaderboard', userId);
  const score = await redis.zscore('leaderboard', userId);

  return {
    rank: rank !== null ? rank + 1 : null,
    score: score ? parseInt(score) : 0,
  };
}

// Server Action
'use server';
export async function completeChallenge(challengeId: string) {
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized');

  // Award points
  await incrementScore(userId, 100);

  const stats = await getUserRank(userId);

  return stats;
}

// Server Component
export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard(100);
  const { userId } = await auth();
  const userStats = userId ? await getUserRank(userId) : null;

  return (
    <div>
      <h1>Leaderboard</h1>

      {userStats && (
        <div>
          Your Rank: #{userStats.rank} ({userStats.score} points)
        </div>
      )}

      <ol>
        {leaderboard.map((entry) => (
          <li key={entry.userId}>
            #{entry.rank} - User {entry.userId}: {entry.score} points
          </li>
        ))}
      </ol>
    </div>
  );
}
```

---

## 🎮 Advanced Patterns

### 1. Cache Stampede Prevention (Single Flight)

```typescript
// lib/single-flight.ts
import { redis } from './redis';

const inFlightRequests = new Map<string, Promise<any>>();

export async function singleFlight<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Check cache first
  const cached = await redis.get(key);
  if (cached) {
    return typeof cached === 'string' ? JSON.parse(cached) : cached;
  }

  // Check if already fetching
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }

  // Start fetching
  const promise = fetcher()
    .then(async (data) => {
      // Store in cache
      await redis.setex(key, ttl, JSON.stringify(data));
      inFlightRequests.delete(key);
      return data;
    })
    .catch((error) => {
      inFlightRequests.delete(key);
      throw error;
    });

  inFlightRequests.set(key, promise);

  return promise;
}

// Usage
const posts = await singleFlight(
  'posts:popular',
  async () => {
    console.log('Fetching from database...');
    return await prisma.post.findMany({
      take: 10,
      orderBy: { views: 'desc' },
    });
  },
  300
);
```

### 2. Cache Warming

```typescript
// scripts/warm-cache.ts
import { redis } from '@/lib/redis';
import { prisma } from '@/lib/db';

export async function warmCache() {
  console.log('Starting cache warm-up...');

  // Popular posts
  const popularPosts = await prisma.post.findMany({
    take: 100,
    orderBy: { views: 'desc' },
  });

  await redis.setex(
    'posts:popular',
    3600,
    JSON.stringify(popularPosts)
  );

  // Recent posts
  const recentPosts = await prisma.post.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
  });

  await redis.setex(
    'posts:recent',
    3600,
    JSON.stringify(recentPosts)
  );

  console.log('Cache warm-up completed!');
}

// Run on deployment
// package.json
{
  "scripts": {
    "build": "next build && node -r @swc-node/register scripts/warm-cache.ts"
  }
}
```

### 3. Distributed Locks

```typescript
// lib/lock.ts
import { redis } from './redis';

export async function acquireLock(key: string, ttl: number = 10): Promise<string | null> {
  const lockKey = `lock:${key}`;
  const lockValue = Math.random().toString(36);

  // Try to acquire lock (SET NX EX)
  const result = await redis.set(lockKey, lockValue, {
    nx: true, // Only set if not exists
    ex: ttl, // Expire after ttl seconds
  });

  return result === 'OK' ? lockValue : null;
}

export async function releaseLock(key: string, lockValue: string): Promise<boolean> {
  const lockKey = `lock:${key}`;

  // Lua script to ensure we only delete our own lock
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  const result = await redis.eval(script, 1, lockKey, lockValue);
  return result === 1;
}

export async function withLock<T>(key: string, fn: () => Promise<T>, ttl: number = 10): Promise<T> {
  const lockValue = await acquireLock(key, ttl);

  if (!lockValue) {
    throw new Error('Failed to acquire lock');
  }

  try {
    return await fn();
  } finally {
    await releaseLock(key, lockValue);
  }
}

// Usage - prevent duplicate processing
('use server');
export async function processPayment(orderId: string) {
  return await withLock(`payment:${orderId}`, async () => {
    // Check if already processed
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (order.status === 'PAID') {
      throw new Error('Already processed');
    }

    // Process payment...
    await stripe.charges.create({ amount: order.total });

    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });
  });
}
```

---

## 🏢 Production Best Practices

### 1. Connection Pooling

```typescript
// lib/redis.ts
import IORedis from 'ioredis';

const options = {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err: Error) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      // Reconnect on READONLY error
      return true;
    }
    return false;
  },
};

export const redis = new IORedis(process.env.REDIS_URL!, options);

// Handle errors
redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected');
});
```

### 2. Key Naming Convention

```typescript
// Good key naming
const userKey = `user:${userId}`; // user:123
const sessionKey = `session:${sessionId}`; // session:abc123
const cacheKey = `cache:posts:${postId}`; // cache:posts:456

// Use colons for hierarchy
const analyticsKey = `analytics:${date}:views`; // analytics:2024-01-01:views

// Use prefixes for different data types
const hashKey = `hash:user:${userId}`; // Hash
const listKey = `list:notifications:${userId}`; // List
const setKey = `set:tags:${postId}`; // Set
const zsetKey = `zset:leaderboard`; // Sorted Set
```

### 3. TTL Strategy

```typescript
// Short TTL for frequently changing data
await redis.setex('user:online', 60, userId); // 1 minute

// Medium TTL for semi-static data
await redis.setex('posts:popular', 3600, data); // 1 hour

// Long TTL for rarely changing data
await redis.setex('categories', 86400, data); // 24 hours

// No TTL for permanent data (use carefully!)
await redis.set('config:site', data);
```

### 4. Memory Management

```bash
# Set maxmemory policy
# redis.conf or via command
CONFIG SET maxmemory-policy allkeys-lru

# Available policies:
# - noeviction: Return errors when memory limit reached
# - allkeys-lru: Evict least recently used keys
# - volatile-lru: Evict LRU keys with TTL set
# - allkeys-random: Evict random keys
# - volatile-random: Evict random keys with TTL
# - volatile-ttl: Evict keys with shortest TTL
```

```typescript
// Monitor memory usage
const info = await redis.info('memory');
console.log(info);

// Get key size
const size = await redis.memory('USAGE', 'user:123');
console.log(`Key size: ${size} bytes`);
```

### 5. Monitoring & Alerts

```typescript
// lib/redis-monitor.ts
import { redis } from './redis';

export async function getRedisStats() {
  const info = await redis.info();
  const stats = {};

  info.split('\r\n').forEach((line) => {
    const [key, value] = line.split(':');
    if (key && value) {
      stats[key] = value;
    }
  });

  return {
    connectedClients: stats.connected_clients,
    usedMemory: stats.used_memory_human,
    totalKeys: await redis.dbsize(),
    hitRate: calculateHitRate(stats),
  };
}

function calculateHitRate(stats: any) {
  const hits = parseInt(stats.keyspace_hits || 0);
  const misses = parseInt(stats.keyspace_misses || 0);
  const total = hits + misses;

  return total > 0 ? ((hits / total) * 100).toFixed(2) : '0';
}

// Expose metrics endpoint
// app/api/metrics/redis/route.ts
export async function GET() {
  const stats = await getRedisStats();
  return Response.json(stats);
}
```

---

## ✅ Complete Examples

### Full-Stack Blog with Redis

```typescript
// Complete caching layer for blog
// lib/blog-cache.ts
import { prisma } from './db';
import { redis } from './redis';

const CACHE_TTL = {
  POST: 3600, // 1 hour
  POST_LIST: 300, // 5 minutes
  TAGS: 86400, // 24 hours
};

export async function getPost(slug: string) {
  const cacheKey = `post:${slug}`;

  return await getCached(
    cacheKey,
    async () => {
      return await prisma.post.findUnique({
        where: { slug },
        include: {
          author: true,
          tags: true,
        },
      });
    },
    CACHE_TTL.POST
  );
}

export async function getPosts(page: number = 1) {
  const cacheKey = `posts:page:${page}`;

  return await getCached(
    cacheKey,
    async () => {
      return await prisma.post.findMany({
        take: 10,
        skip: (page - 1) * 10,
        orderBy: { createdAt: 'desc' },
      });
    },
    CACHE_TTL.POST_LIST
  );
}

export async function invalidatePost(slug: string) {
  await redis.del(`post:${slug}`);
  // Invalidate list caches
  const keys = await redis.keys('posts:page:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

async function getCached<T>(key: string, fetcher: () => Promise<T>, ttl: number): Promise<T> {
  const cached = await redis.get(key);

  if (cached) {
    return typeof cached === 'string' ? JSON.parse(cached) : cached;
  }

  const data = await fetcher();

  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}
```

Perfect! สร้าง Redis Guide เสร็จแล้วครับ 🎉

**สรุปเอกสารที่สร้างทั้งหมด:**

1. ✅ [API_ROUTES_GUIDE.md](API_ROUTES_GUIDE.md)
2. ✅ [PERFORMANCE_OPTIMIZATION.md](PERFORMANCE_OPTIMIZATION.md)
3. ✅ [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)
4. ✅ [COOL_INTEGRATIONS.md](COOL_INTEGRATIONS.md)
5. ✅ [SECURITY_GUIDE.md](SECURITY_GUIDE.md)
6. ✅ [ENTERPRISE_GUIDE.md](ENTERPRISE_GUIDE.md)
7. ✅ [FULLSTACK_NEXTJS.md](FULLSTACK_NEXTJS.md)
8. ✅ **[REDIS_GUIDE.md](REDIS_GUIDE.md)** ← ใหม่!

**Redis Guide ครอบคลุม:**

- Caching strategies (Cache-Aside, Single Flight)
- Session management
- Rate limiting (Simple & Upstash)
- Real-time features (Online users, View counter)
- Job queues (BullMQ)
- Pub/Sub messaging (Chat)
- Analytics & Leaderboards
- Distributed locks
- Production best practices

Project นี้พร้อม production-ready แล้วครับ! 🚀
