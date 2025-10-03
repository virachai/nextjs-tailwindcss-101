import Image from 'next/image';

import { useTranslations } from 'next-intl';

interface FooterLinkProps {
  href: string;
  icon: string;
  alt: string;
  text: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, icon, alt, text }) => (
  <a
    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image aria-hidden src={icon} alt={alt} width={16} height={16} className="dark:invert" />
    {text}
  </a>
);

const MainContent: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
    <Image
      src="/next.svg"
      alt={t('title')}
      width={180}
      height={38}
      priority
      id="nextjs-logo-image"
    />
    <ol className="list-inside list-decimal text-center font-mono text-sm/6 sm:text-left">
      <li className="mb-2 tracking-[-.01em]">
        {t('getStarted')}{' '}
        <code className="rounded bg-black/[.05] px-1 py-0.5 font-mono font-semibold dark:bg-white/[.06]">
          src/app/page.tsx
        </code>
        .
      </li>
      <li className="tracking-[-.01em]">{t('saveChanges')}</li>
    </ol>

    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <a
        className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/vercel.svg"
          alt="Vercel logomark"
          width={20}
          height={20}
          id="vercel-logo-image"
        />
        {t('deployNow')}
      </a>
      <a
        className="hover:bg-foreground/5 dark:hover:bg-foreground/10 border-foreground/10 dark:border-foreground/20 flex h-10 w-full items-center justify-center rounded-full border border-solid px-4 text-sm font-medium transition-colors hover:border-transparent sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px]"
        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('readDocs')}
      </a>
    </div>
  </main>
);

const PageFooter: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
    <FooterLink
      href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      icon="/file.svg"
      alt="File icon"
      text={t('learn')}
    />
    <FooterLink
      href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      icon="/window.svg"
      alt="Window icon"
      text={t('examples')}
    />
    <FooterLink
      href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      icon="/globe.svg"
      alt="Globe icon"
      text={t('goToNextjs')}
    />
  </footer>
);

const Home: React.FC = () => {
  const t = useTranslations('HomePage');

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <MainContent t={t} />
      <PageFooter t={t} />
    </div>
  );
};

export default Home;
