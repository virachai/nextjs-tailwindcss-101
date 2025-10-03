'use client';

import { ThemeToggle } from '@/components/theme-toggle';

const ShowcasePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-500 to-brand-700 px-8 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="animate-fadeIn mb-4 text-5xl font-bold md:text-7xl">
            Tailwind CSS Showcase
          </h1>
          <p className="animate-fadeIn text-xl opacity-90 md:text-2xl">
            Explore custom configurations, animations, and design system tokens
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-8 py-16">
        {/* Colors Section */}
        <section>
          <h2 className="mb-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Color Palette
          </h2>

          {/* Brand Colors */}
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
              Brand Colors
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                <div key={shade} className="group cursor-pointer">
                  <div
                    className={`mb-2 h-20 rounded-lg bg-brand-${shade} shadow-md transition-transform duration-200 hover:scale-105`}
                  />
                  <p className="text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {shade}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div>
            <h3 className="mb-4 text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
              Semantic Colors
            </h3>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Success
                </p>
                <div className="space-y-2">
                  <div className="h-12 rounded-lg bg-success-500 shadow-md" />
                  <div className="h-12 rounded-lg bg-success-600 shadow-md" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Warning
                </p>
                <div className="space-y-2">
                  <div className="h-12 rounded-lg bg-warning-500 shadow-md" />
                  <div className="h-12 rounded-lg bg-warning-600 shadow-md" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Error
                </p>
                <div className="space-y-2">
                  <div className="h-12 rounded-lg bg-error-500 shadow-md" />
                  <div className="h-12 rounded-lg bg-error-600 shadow-md" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Info
                </p>
                <div className="space-y-2">
                  <div className="h-12 rounded-lg bg-info-500 shadow-md" />
                  <div className="h-12 rounded-lg bg-info-600 shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="mb-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Typography
          </h2>
          <div className="space-y-4 rounded-xl bg-white p-8 shadow-lg dark:bg-neutral-900">
            <p className="text-9xl font-black text-neutral-900 dark:text-neutral-50">9xl</p>
            <p className="text-8xl font-extrabold text-neutral-800 dark:text-neutral-100">8xl</p>
            <p className="text-7xl font-bold text-neutral-700 dark:text-neutral-200">7xl</p>
            <p className="text-6xl font-semibold text-neutral-700 dark:text-neutral-200">6xl</p>
            <p className="text-5xl font-medium text-neutral-600 dark:text-neutral-300">5xl</p>
            <p className="text-4xl text-neutral-600 dark:text-neutral-300">4xl</p>
            <p className="text-3xl text-neutral-500 dark:text-neutral-400">3xl</p>
            <p className="text-2xl text-neutral-500 dark:text-neutral-400">2xl</p>
            <p className="text-xl text-neutral-500 dark:text-neutral-400">xl</p>
            <p className="text-base text-neutral-500 dark:text-neutral-400">base</p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">sm</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">xs</p>
          </div>
        </section>

        {/* Animations Section */}
        <section>
          <h2 className="mb-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Animations
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-neutral-900">
              <div className="mb-4 flex h-24 items-center justify-center">
                <div className="h-16 w-16 animate-fadeIn rounded-full bg-brand-500" />
              </div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">Fade In</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-neutral-900">
              <div className="mb-4 flex h-24 items-center justify-center">
                <div className="h-16 w-16 animate-zoomPulse rounded-full bg-success-500" />
              </div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">Zoom Pulse</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-neutral-900">
              <div className="mb-4 flex h-24 items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-lg bg-warning-500" />
              </div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">Spin</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-neutral-900">
              <div className="mb-4 flex h-24 items-center justify-center">
                <div className="h-16 w-16 animate-bounce rounded-full bg-error-500" />
              </div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">Bounce</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-neutral-900">
              <div className="mb-4 flex h-24 items-center justify-center">
                <div className="h-16 w-16 animate-slideInFromLeft rounded-full bg-info-500" />
              </div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                Slide From Left
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-neutral-900">
              <div className="mb-4 flex h-24 items-center justify-center">
                <div className="h-16 w-16 animate-slideInFromRight rounded-full bg-brand-600" />
              </div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                Slide From Right
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-neutral-900">
              <div className="mb-4 flex h-24 items-center justify-center">
                <div className="h-16 w-16 animate-scaleIn rounded-full bg-success-600" />
              </div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">Scale In</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-neutral-900">
              <div className="mb-4 flex h-24 items-center justify-center">
                <div className="relative">
                  <div className="absolute h-16 w-16 animate-ping rounded-full bg-warning-500 opacity-75" />
                  <div className="relative h-16 w-16 rounded-full bg-warning-600" />
                </div>
              </div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">Ping</p>
            </div>
          </div>
        </section>

        {/* Shadows Section */}
        <section>
          <h2 className="mb-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Shadows
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
              <div
                key={size}
                className={`rounded-xl bg-white p-8 text-center shadow-${size} dark:bg-neutral-900`}
              >
                <p className="font-semibold text-neutral-700 dark:text-neutral-300">shadow-{size}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius Section */}
        <section>
          <h2 className="mb-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Border Radius
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].map((size) => (
              <div key={size} className="text-center">
                <div
                  className={`mx-auto mb-2 h-24 w-24 bg-brand-500 rounded-${size} shadow-md`}
                />
                <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                  rounded-{size}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="mb-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Button Styles
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-brand-600 hover:shadow-lg">
              Primary
            </button>
            <button className="rounded-lg bg-success-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-success-600 hover:shadow-lg">
              Success
            </button>
            <button className="rounded-lg bg-warning-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-warning-600 hover:shadow-lg">
              Warning
            </button>
            <button className="rounded-lg bg-error-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-error-600 hover:shadow-lg">
              Error
            </button>
            <button className="rounded-lg border-2 border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-700 shadow-md transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800">
              Outline
            </button>
            <button className="rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Gradient
            </button>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="mb-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Card Components
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-neutral-900">
              <div className="h-48 bg-gradient-to-br from-brand-400 to-brand-600" />
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  Feature Card
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Beautiful card component with hover effects and gradient background.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-neutral-900">
              <div className="h-48 bg-gradient-to-br from-success-400 to-success-600" />
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  Success Card
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Card component with success color scheme and smooth animations.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-neutral-900">
              <div className="h-48 bg-gradient-to-br from-warning-400 to-warning-600" />
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  Warning Card
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Attention-grabbing card with warning colors and transform effects.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShowcasePage;
