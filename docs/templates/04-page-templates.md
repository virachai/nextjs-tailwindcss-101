# Page Templates

> Complete, production-ready page layouts combining sections and components for
> rapid development following Airbnb design system standards.

## Table of Contents

- [What Are Page Templates?](#what-are-page-templates)
- [Landing Page Template](#landing-page-template)
- [Dashboard Template](#dashboard-template)
- [Blog Post Template](#blog-post-template)
- [Pricing Page Template](#pricing-page-template)
- [Authentication Page Template](#authentication-page-template)
- [Best Practices](#best-practices)

---

## What Are Page Templates?

Page templates are **complete, ready-to-use pages** that combine:

- **Layout structures** (AppShell, containers)
- **Section components** (Hero, Features, CTA)
- **UI components** (Cards, buttons, forms)
- **Design tokens** (Colors, spacing, typography)

### Benefits

- ✅ **Speed** - Ship pages in minutes, not days
- ✅ **Consistency** - Unified design language
- ✅ **Quality** - Pre-tested for accessibility, responsiveness
- ✅ **Scalability** - Easy to maintain and extend

---

## Landing Page Template

**Use Case:** Marketing sites, product launches, SaaS homepages

### Structure

```
┌─────────────────────────────────────────────────┐
│ Header (Navigation)                              │
├─────────────────────────────────────────────────┤
│ Hero Section                                     │
│ - Title, subtitle, CTA buttons                  │
│ - Hero image/screenshot                         │
├─────────────────────────────────────────────────┤
│ Logo Cloud Section                               │
│ - "Trusted by..." logos                         │
├─────────────────────────────────────────────────┤
│ Features Section                                 │
│ - 3-column grid of features                     │
├─────────────────────────────────────────────────┤
│ Social Proof Section                             │
│ - Testimonials/reviews                          │
├─────────────────────────────────────────────────┤
│ CTA Section                                      │
│ - Final conversion push                         │
├─────────────────────────────────────────────────┤
│ Footer                                           │
│ - Links, social, copyright                      │
└─────────────────────────────────────────────────┘
```

### Implementation

```tsx
// src/app/(marketing)/page.tsx
import { AppShell } from '@/templates/layout/AppShell';
import { CTASimple } from '@/templates/sections/CTASimple';
import { FeaturesThreeColumn } from '@/templates/sections/FeaturesThreeColumn';
import { Footer } from '@/templates/sections/Footer';
import { Header } from '@/templates/sections/Header';
import { HeroCentered } from '@/templates/sections/HeroCentered';

export default function LandingPage() {
  return (
    <AppShell
      header={
        <Header
          logo={<span className="text-xl font-bold">YourBrand</span>}
          links={[
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'About', href: '/about' },
          ]}
          ctaButton={{ text: 'Get Started', href: '/signup' }}
        />
      }
      footer={
        <Footer
          logo={<span className="text-xl font-bold">YourBrand</span>}
          sections={[
            {
              title: 'Product',
              links: [
                { label: 'Features', href: '/features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Security', href: '/security' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Careers', href: '/careers' },
              ],
            },
            {
              title: 'Resources',
              links: [
                { label: 'Documentation', href: '/docs' },
                { label: 'Help Center', href: '/help' },
                { label: 'API Reference', href: '/api' },
              ],
            },
          ]}
          copyright="© 2025 YourBrand. All rights reserved."
        />
      }
    >
      {/* Hero Section */}
      <HeroCentered
        title="Build amazing products faster"
        description="The most powerful platform for modern teams to collaborate, ship, and scale products that users love."
        primaryCta={{ text: 'Start Free Trial', href: '/signup' }}
        secondaryCta={{ text: 'Watch Demo', href: '/demo' }}
        imageUrl="/images/hero-dashboard.png"
        imageAlt="Product dashboard interface"
      />

      {/* Logo Cloud */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-12 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-sm font-semibold tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
            Trusted by leading companies
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {/* Logo placeholders */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center justify-center grayscale transition hover:grayscale-0"
              >
                <div className="h-12 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesThreeColumn
        title="Everything you need to succeed"
        description="Built by developers, for developers. Ship faster without compromising on quality."
        features={[
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            ),
            title: 'Lightning Fast',
            description:
              'Optimized for speed with edge caching, CDN delivery, and intelligent preloading.',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            ),
            title: 'Secure by Default',
            description:
              'Enterprise-grade security built into every layer. SOC 2 Type II certified.',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            ),
            title: 'Easy Integration',
            description:
              'Connect with your favorite tools in minutes. REST API, webhooks, and SDKs included.',
          },
        ]}
      />

      {/* Testimonials Section */}
      <section className="bg-neutral-50 py-24 lg:py-32 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              Loved by thousands of teams
            </h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  'This platform transformed how we ship products. We moved from monthly releases to weekly.',
                author: 'Sarah Chen',
                role: 'Head of Engineering',
                company: 'TechCorp',
              },
              {
                quote:
                  'The best investment we made this year. Our team productivity increased by 3x.',
                author: 'Michael Rodriguez',
                role: 'CTO',
                company: 'StartupXYZ',
              },
              {
                quote:
                  'Finally, a platform that just works. No more wrestling with complicated configs.',
                author: 'Emily Taylor',
                role: 'Product Manager',
                company: 'InnovateLabs',
              },
            ].map((testimonial, index) => (
              <div key={index} className="rounded-2xl bg-white p-8 shadow-lg dark:bg-neutral-900">
                <p className="text-neutral-700 dark:text-neutral-300">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASimple
        title="Ready to ship faster?"
        description="Join thousands of teams already building with our platform. Start your free 14-day trial today."
        primaryCta={{ text: 'Start Free Trial', href: '/signup' }}
        secondaryCta={{ text: 'Schedule Demo', href: '/demo' }}
      />
    </AppShell>
  );
}
```

**Key Features:**

- ✅ Fully responsive (mobile-first)
- ✅ Dark mode support
- ✅ Accessible (WCAG 2.1 AA)
- ✅ SEO-optimized structure
- ✅ Fast performance

---

## Dashboard Template

**Use Case:** SaaS dashboards, admin panels, analytics

### Structure

```
┌─────────────────────────────────────────────────┐
│ Header (App navigation)                          │
├──────┬──────────────────────────────────────────┤
│ Side │ Stats Grid                               │
│ bar  │ - Key metrics cards                      │
│      ├──────────────────────────────────────────┤
│ Nav  │ Charts Section                           │
│      │ - Revenue, users, etc.                   │
│      ├──────────────────────────────────────────┤
│      │ Recent Activity Table                    │
│      │ - Latest transactions/events             │
└──────┴──────────────────────────────────────────┘
```

### Implementation

```tsx
// src/app/dashboard/page.tsx
import { Header } from '@/components/dashboard/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AppShell } from '@/templates/layout/AppShell';
import { TwoColumnLayout } from '@/templates/layout/TwoColumnLayout';

export default function DashboardPage() {
  return (
    <AppShell header={<Header />}>
      <TwoColumnLayout sidebar={<Sidebar />}>
        {/* Stats Grid */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Overview of your account performance
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Total Revenue',
                value: '$45,231',
                change: '+12.5%',
                trend: 'up',
              },
              {
                label: 'Active Users',
                value: '2,345',
                change: '+8.2%',
                trend: 'up',
              },
              {
                label: 'Conversion Rate',
                value: '3.24%',
                change: '-1.1%',
                trend: 'down',
              },
              {
                label: 'Avg. Order Value',
                value: '$124',
                change: '+5.4%',
                trend: 'up',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-success-600' : 'text-error-600'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Chart Placeholder */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Revenue Overview
            </h2>
            <div className="mt-6 h-80 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {[
                {
                  user: 'John Doe',
                  action: 'made a purchase',
                  amount: '$249',
                  time: '2 minutes ago',
                },
                {
                  user: 'Jane Smith',
                  action: 'signed up',
                  amount: '-',
                  time: '1 hour ago',
                },
                {
                  user: 'Bob Johnson',
                  action: 'upgraded plan',
                  amount: '$99/mo',
                  time: '3 hours ago',
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-6">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{activity.user}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {activity.action}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {activity.amount}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TwoColumnLayout>
    </AppShell>
  );
}
```

**Key Features:**

- ✅ Sidebar navigation
- ✅ Responsive grid layouts
- ✅ Real-time data visualization
- ✅ Accessible tables
- ✅ Dark mode support

---

## Blog Post Template

**Use Case:** Blog articles, documentation, long-form content

### Structure

```
┌─────────────────────────────────────────────────┐
│ Header (Navigation)                              │
├─────────────────────────────────────────────────┤
│ Article Header                                   │
│ - Title, author, date, tags                     │
├─────────────────────────────────────────────────┤
│ Featured Image                                   │
├─────────────────────────────────────────────────┤
│ Article Content (Centered, max-width)            │
│ - Rich typography, images, code blocks          │
├─────────────────────────────────────────────────┤
│ Author Bio                                       │
├─────────────────────────────────────────────────┤
│ Related Posts                                    │
├─────────────────────────────────────────────────┤
│ Footer                                           │
└─────────────────────────────────────────────────┘
```

### Implementation

```tsx
// src/app/blog/[slug]/page.tsx
import Image from 'next/image';

import { AppShell } from '@/templates/layout/AppShell';
import { CenteredLayout } from '@/templates/layout/CenteredLayout';
import { Footer } from '@/templates/sections/Footer';
import { Header } from '@/templates/sections/Header';

export default function BlogPostPage() {
  return (
    <AppShell header={<Header />} footer={<Footer />}>
      <article>
        {/* Article Header */}
        <div className="border-b border-neutral-200 bg-neutral-50 py-16 dark:border-neutral-800 dark:bg-neutral-950">
          <CenteredLayout maxWidth="lg">
            <div className="space-y-4">
              {/* Category */}
              <div>
                <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                  Product Updates
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                Announcing our Series A funding
              </h1>

              {/* Meta */}
              <div className="flex items-center space-x-4 text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="font-medium">Sarah Johnson</span>
                </div>
                <span>•</span>
                <time dateTime="2025-01-15">Jan 15, 2025</time>
                <span>•</span>
                <span>5 min read</span>
              </div>
            </div>
          </CenteredLayout>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[21/9] overflow-hidden">
          <Image
            src="/images/blog/series-a.jpg"
            alt="Article featured image"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <CenteredLayout maxWidth="lg">
          <div className="prose prose-neutral prose-lg dark:prose-invert mx-auto py-16">
            <p className="lead">
              We&apos;re excited to announce that we&apos;ve raised $20M in Series A funding led by
              Acme Ventures to accelerate our mission of making software development faster and more
              accessible.
            </p>

            <h2>What this means for you</h2>
            <p>
              This funding allows us to double down on our commitment to developers worldwide.
              Here&apos;s what you can expect:
            </p>

            <ul>
              <li>New features shipping weekly</li>
              <li>Expanded team across engineering, design, and support</li>
              <li>New regional data centers for faster performance</li>
            </ul>

            <h2>Our journey so far</h2>
            <p>
              Since launching in 2023, we&apos;ve grown to serve over 100,000 developers across 150
              countries. Our platform has processed over 10 million deployments and counting.
            </p>

            <blockquote>
              <p>
                &quot;This is just the beginning. We&apos;re building the future of software
                development.&quot;
              </p>
            </blockquote>

            <h2>What&apos;s next</h2>
            <p>
              We&apos;re working on some exciting new features that we can&apos;t wait to share.
              Stay tuned for updates in the coming weeks.
            </p>
          </div>
        </CenteredLayout>

        {/* Author Bio */}
        <div className="border-y border-neutral-200 bg-neutral-50 py-12 dark:border-neutral-800 dark:bg-neutral-950">
          <CenteredLayout maxWidth="lg">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 flex-shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Sarah Johnson
                </h3>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                  Co-founder & CEO at YourBrand. Previously led product at BigTech. Passionate about
                  developer tools and open source.
                </p>
              </div>
            </div>
          </CenteredLayout>
        </div>

        {/* Related Posts */}
        <div className="py-16">
          <CenteredLayout maxWidth="lg">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Related Articles
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {[1, 2].map((i) => (
                <a
                  key={i}
                  href={`/blog/post-${i}`}
                  className="group rounded-xl border border-neutral-200 p-6 transition-shadow hover:shadow-lg dark:border-neutral-800"
                >
                  <h3 className="group-hover:text-brand-600 dark:group-hover:text-brand-400 text-lg font-semibold text-neutral-900 dark:text-white">
                    Another interesting article title
                  </h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                    Brief description of the article content goes here...
                  </p>
                  <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500">
                    Jan 10, 2025 • 3 min read
                  </p>
                </a>
              ))}
            </div>
          </CenteredLayout>
        </div>
      </article>
    </AppShell>
  );
}
```

**Key Features:**

- ✅ SEO-optimized article structure
- ✅ Rich typography with Tailwind Typography
- ✅ Optimal reading width
- ✅ Author bio and social sharing
- ✅ Related content recommendations

---

## Pricing Page Template

**Use Case:** SaaS pricing, subscription plans

### Implementation

```tsx
// src/app/pricing/page.tsx
import { AppShell } from '@/templates/layout/AppShell';
import { Container } from '@/templates/layout/Container';
import { Footer } from '@/templates/sections/Footer';
import { Header } from '@/templates/sections/Header';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for trying out our platform',
      features: ['5 projects', '10 team members', 'Basic analytics', 'Community support'],
      cta: 'Start Free',
      href: '/signup',
      featured: false,
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'For growing teams and businesses',
      features: [
        'Unlimited projects',
        'Unlimited team members',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
      ],
      cta: 'Start Trial',
      href: '/signup?plan=pro',
      featured: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'SLA guarantee',
        'Custom contracts',
        'On-premise deployment',
      ],
      cta: 'Contact Sales',
      href: '/contact',
      featured: false,
    },
  ];

  return (
    <AppShell header={<Header />} footer={<Footer />}>
      <section className="py-24 lg:py-32">
        <Container>
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300">
              Choose the plan that&apos;s right for you. All plans include a 14-day free trial.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.featured
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10 shadow-xl'
                    : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-500 inline-flex rounded-full px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">{plan.description}</p>
                  <p className="mt-6">
                    <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.price !== 'Custom' && (
                      <span className="text-neutral-600 dark:text-neutral-400">/month</span>
                    )}
                  </p>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="text-brand-500 mr-3 h-5 w-5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.href}
                  className={`mt-8 block w-full rounded-lg px-6 py-3 text-center font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-brand-600 hover:bg-brand-700 text-white'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </AppShell>
  );
}
```

**Key Features:**

- ✅ Three-tier pricing structure
- ✅ Featured plan highlight
- ✅ Feature comparison
- ✅ Clear CTAs
- ✅ Responsive grid

---

## Authentication Page Template

**Use Case:** Login, signup, password reset

### Implementation

```tsx
// src/app/login/page.tsx
import { SplitScreenLayout } from '@/templates/layout/SplitScreenLayout';

export default function LoginPage() {
  return (
    <SplitScreenLayout
      leftBackground="bg-gradient-to-br from-brand-600 to-brand-800"
      left={
        <div className="text-white">
          <h1 className="text-4xl font-bold">Welcome back</h1>
          <p className="mt-4 text-lg text-white/90">
            Sign in to continue to your account and start building amazing products.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-3">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Secure, encrypted authentication</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Access from any device</span>
            </div>
          </div>
        </div>
      }
      right={
        <div className="w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Sign in</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-brand-600 hover:text-brand-500 font-medium">
                Sign up
              </a>
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="focus:border-brand-500 focus:ring-brand-500 mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="focus:border-brand-500 focus:ring-brand-500 mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-2 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-neutral-300"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300"
                >
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-brand-600 hover:text-brand-500 text-sm font-medium"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 w-full rounded-lg px-4 py-2 font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              Sign in
            </button>
          </form>
        </div>
      }
    />
  );
}
```

**Key Features:**

- ✅ Split-screen layout
- ✅ Form validation (client-side)
- ✅ Accessible form inputs
- ✅ Social login options (optional)
- ✅ Password recovery link

---

## Best Practices

### 1. **SEO Optimization**

```tsx
// Add metadata to every page
export const metadata = {
  title: 'Landing Page | YourBrand',
  description: 'Build amazing products faster with our platform',
  openGraph: {
    title: 'Landing Page',
    description: 'Build amazing products faster',
    images: ['/og-image.png'],
  },
};
```

### 2. **Performance**

```tsx
// Use Next.js Image for optimization
import Image from 'next/image';

<Image
  src="/hero.png"
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>;
```

### 3. **Accessibility**

```tsx
// Include proper ARIA labels and landmarks
<nav aria-label="Main navigation">
<main id="main-content">
<section aria-labelledby="features-heading">
  <h2 id="features-heading">Features</h2>
```

### 4. **Analytics**

```tsx
// Track page views and conversions
useEffect(() => {
  analytics.track('Page View', {
    page: 'Landing Page',
    timestamp: new Date(),
  });
}, []);
```

### 5. **Loading States**

```tsx
// Show loading states for better UX
{
  isLoading ? <div className="animate-pulse">Loading...</div> : <Content />;
}
```

---

**Related:** [Layout Templates](./02-layout-templates.md) |
[Component Templates](./03-component-templates.md)
