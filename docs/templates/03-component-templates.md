# Component Templates

> Production-ready section templates for building consistent, scalable UIs
> following Airbnb design system standards.

## Table of Contents

- [What Are Component Templates?](#what-are-component-templates)
- [Hero Section Templates](#hero-section-templates)
- [Feature Section Templates](#feature-section-templates)
- [CTA Section Templates](#cta-section-templates)
- [Navigation Templates](#navigation-templates)
- [Footer Templates](#footer-templates)
- [Card Templates](#card-templates)
- [Form Section Templates](#form-section-templates)
- [Best Practices](#best-practices)

---

## What Are Component Templates?

Component templates are **reusable page sections** that combine multiple UI
elements into cohesive patterns:

- **Hero Sections** - First impression, value proposition
- **Feature Sections** - Product benefits, capabilities
- **CTA Sections** - Conversion-focused call-to-actions
- **Navigation** - Site navigation patterns
- **Footers** - Site footer patterns
- **Cards** - Content containers
- **Forms** - Data collection sections

---

## Hero Section Templates

### 1. Hero with Image (Centered)

**Use Case:** Landing pages, product launches

```tsx
// src/templates/sections/HeroCentered.tsx
import React from 'react';

import Image from 'next/image';

import { Container } from '@/templates/layout/Container';

interface HeroCenteredProps {
  title: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  imageUrl: string;
  imageAlt: string;
}

export const HeroCentered: React.FC<HeroCenteredProps> = ({
  title,
  description,
  primaryCta,
  secondaryCta,
  imageUrl,
  imageAlt,
}) => {
  return (
    <section className="from-brand-600 to-brand-800 relative overflow-hidden bg-gradient-to-br py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="bg-gradient-radial absolute inset-0 opacity-30" />

      <Container>
        <div className="relative space-y-12 text-center">
          {/* Title & Description */}
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="text-lg text-white/90 sm:text-xl">{description}</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={primaryCta.href}
              className="text-brand-600 focus:ring-offset-brand-600 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold shadow-lg transition-all hover:bg-neutral-50 hover:shadow-xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
            >
              {primaryCta.text}
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="hover:text-brand-600 focus:ring-offset-brand-600 inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-semibold text-white transition-all hover:bg-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
              >
                {secondaryCta.text}
              </a>
            )}
          </div>

          {/* Hero Image */}
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

// Usage
<HeroCentered
  title="Build amazing products faster"
  description="The most powerful platform for modern teams to collaborate and ship products that users love."
  primaryCta={{ text: 'Get Started Free', href: '/signup' }}
  secondaryCta={{ text: 'Watch Demo', href: '/demo' }}
  imageUrl="/hero-dashboard.png"
  imageAlt="Product dashboard"
/>;
```

### 2. Hero with Side Image

**Use Case:** SaaS products, app marketing

```tsx
// src/templates/sections/HeroSideImage.tsx
import React from 'react';

import Image from 'next/image';

import { Container } from '@/templates/layout/Container';

interface HeroSideImageProps {
  title: string;
  description: string;
  features?: string[];
  primaryCta: { text: string; href: string };
  imageUrl: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
}

export const HeroSideImage: React.FC<HeroSideImageProps> = ({
  title,
  description,
  features,
  primaryCta,
  imageUrl,
  imageAlt,
  imagePosition = 'right',
}) => {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div
            className={`flex flex-col justify-center ${imagePosition === 'right' ? 'lg:order-first' : 'lg:order-last'}`}
          >
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl dark:text-white">
              {title}
            </h1>
            <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300">
              {description}
            </p>

            {/* Feature List */}
            {features && features.length > 0 && (
              <ul className="mt-8 space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="text-brand-500 mr-3 h-6 w-6 flex-shrink-0"
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
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            <div className="mt-10">
              <a
                href={primaryCta.href}
                className="bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                {primaryCta.text}
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

// Usage
<HeroSideImage
  title="Ship faster with our platform"
  description="Everything you need to build and scale your product, all in one place."
  features={[
    'Lightning-fast development workflow',
    'Built-in analytics and monitoring',
    'Enterprise-grade security',
  ]}
  primaryCta={{ text: 'Start Building', href: '/signup' }}
  imageUrl="/product-screenshot.png"
  imageAlt="Product interface"
  imagePosition="right"
/>;
```

---

## Feature Section Templates

### 1. Three-Column Feature Grid

**Use Case:** Highlighting product benefits, services

```tsx
// src/templates/sections/FeaturesThreeColumn.tsx
import React from 'react';

import { Container } from '@/templates/layout/Container';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesThreeColumnProps {
  title: string;
  description?: string;
  features: Feature[];
}

export const FeaturesThreeColumn: React.FC<FeaturesThreeColumnProps> = ({
  title,
  description,
  features,
}) => {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
              {description}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              <div className="space-y-4">
                {/* Icon */}
                <div className="bg-brand-100 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400 flex h-12 w-12 items-center justify-center rounded-xl">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-600 dark:text-neutral-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

// Usage
<FeaturesThreeColumn
  title="Everything you need to succeed"
  description="Built by developers, for developers"
  features={[
    {
      icon: <svg>...</svg>,
      title: 'Lightning Fast',
      description: 'Optimized for speed with edge caching and CDN.',
    },
    {
      icon: <svg>...</svg>,
      title: 'Secure by Default',
      description: 'Enterprise-grade security built into every layer.',
    },
    {
      icon: <svg>...</svg>,
      title: 'Easy Integration',
      description: 'Connect with your favorite tools in minutes.',
    },
  ]}
/>;
```

### 2. Feature with Screenshot

**Use Case:** Detailed feature showcase

```tsx
// src/templates/sections/FeatureWithScreenshot.tsx
import React from 'react';

import Image from 'next/image';

import { Container } from '@/templates/layout/Container';

interface FeatureWithScreenshotProps {
  title: string;
  description: string;
  features: { title: string; description: string }[];
  imageUrl: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
}

export const FeatureWithScreenshot: React.FC<FeatureWithScreenshotProps> = ({
  title,
  description,
  features,
  imageUrl,
  imageAlt,
  imagePosition = 'right',
}) => {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div
            className={`flex flex-col justify-center ${imagePosition === 'right' ? 'lg:order-first' : 'lg:order-last'}`}
          >
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              {title}
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
              {description}
            </p>

            <div className="mt-8 space-y-6">
              {features.map((feature, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshot */}
          <div className="relative">
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
```

---

## CTA Section Templates

### 1. Simple CTA

**Use Case:** Newsletter signup, free trial, download

```tsx
// src/templates/sections/CTASimple.tsx
import React from 'react';

import { Container } from '@/templates/layout/Container';

interface CTASimpleProps {
  title: string;
  description: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
}

export const CTASimple: React.FC<CTASimpleProps> = ({
  title,
  description,
  primaryCta,
  secondaryCta,
}) => {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="bg-brand-600 rounded-3xl px-6 py-16 text-center shadow-2xl sm:px-12 lg:px-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
            {description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={primaryCta.href}
              className="text-brand-600 focus:ring-offset-brand-600 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold shadow-lg transition-all hover:bg-neutral-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
            >
              {primaryCta.text}
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center justify-center text-base font-semibold text-white hover:text-white/80"
              >
                {secondaryCta.text} →
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

// Usage
<CTASimple
  title="Ready to get started?"
  description="Join thousands of teams already building with our platform."
  primaryCta={{ text: 'Start Free Trial', href: '/signup' }}
  secondaryCta={{ text: 'Schedule Demo', href: '/demo' }}
/>;
```

---

## Navigation Templates

### 1. Header with Navigation

**Use Case:** Marketing sites, documentation

```tsx
// src/templates/sections/Header.tsx
'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { Container } from '@/templates/layout/Container';

// src/templates/sections/Header.tsx

// src/templates/sections/Header.tsx

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  logo: React.ReactNode;
  links: NavLink[];
  ctaButton?: { text: string; href: string };
}

export const Header: React.FC<HeaderProps> = ({ logo, links, ctaButton }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="z-sticky sticky top-0 border-b border-neutral-200 bg-white/80 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-900/80">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {logo}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          {ctaButton && (
            <div className="hidden md:block">
              <Link
                href={ctaButton.href}
                className="bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                {ctaButton.text}
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-200 py-4 md:hidden dark:border-neutral-800">
            <div className="flex flex-col space-y-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {ctaButton && (
                <Link
                  href={ctaButton.href}
                  className="bg-brand-600 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white"
                >
                  {ctaButton.text}
                </Link>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

// Usage
<Header
  logo={<span className="text-xl font-bold">Logo</span>}
  links={[
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '/docs' },
  ]}
  ctaButton={{ text: 'Get Started', href: '/signup' }}
/>;
```

---

## Footer Templates

### 1. Four-Column Footer

**Use Case:** Marketing sites, large apps

```tsx
// src/templates/sections/Footer.tsx
import React from 'react';

import Link from 'next/link';

import { Container } from '@/templates/layout/Container';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo: React.ReactNode;
  sections: FooterSection[];
  socialLinks?: { icon: React.ReactNode; href: string; label: string }[];
  copyright: string;
}

export const Footer: React.FC<FooterProps> = ({
  logo,
  sections,
  socialLinks,
  copyright,
}) => {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div>{logo}</div>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                Building amazing products for modern teams.
              </p>
              {/* Social Links */}
              {socialLinks && (
                <div className="mt-6 flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Link Sections */}
            {sections.map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {copyright}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

// Usage
<Footer
  logo={<span className="text-xl font-bold">Logo</span>}
  sections={[
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Changelog', href: '/changelog' },
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
        { label: 'API Reference', href: '/api' },
        { label: 'Support', href: '/support' },
      ],
    },
  ]}
  copyright="© 2025 Your Company. All rights reserved."
/>;
```

---

## Best Practices

### 1. **Consistent Spacing**

```tsx
// ✅ Use standard section spacing
<section className="py-24 lg:py-32">

// ✅ Use consistent internal spacing
<div className="space-y-8">
<div className="space-y-12">
```

### 2. **Responsive Images**

```tsx
// ✅ Use Next.js Image with proper sizing
<Image
  src="/hero.png"
  alt="Hero"
  fill
  className="object-cover"
  priority // For hero images
/>
```

### 3. **Accessibility**

```tsx
// ✅ Include proper ARIA labels
<button aria-label="Close menu">
<nav aria-label="Main navigation">
<section aria-labelledby="features-title">
```

### 4. **Dark Mode**

```tsx
// ✅ Always include dark mode variants
<div className="bg-white dark:bg-neutral-900">
<h1 className="text-neutral-900 dark:text-white">
```

### 5. **Type Safety**

```tsx
// ✅ Define clear interfaces
interface HeroProps {
  title: string;
  description: string;
  primaryCta: { text: string; href: string };
}
```

---

**Next:** [Page Templates →](./04-page-templates.md)
