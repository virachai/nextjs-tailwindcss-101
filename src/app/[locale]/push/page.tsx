'use client';

import React, { ReactNode } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// import { usePathname, useSearchParams } from 'next/navigation';

interface ActiveLinkProps {
  children: ReactNode;
  href: string;
}

const mockRouter = {
  push: async (url: string) => {
    return (
      url &&
      new Promise((resolve) => {
        setTimeout(resolve, 1000);
      })
    );
  },
};

const ActiveLink: React.FC<ActiveLinkProps> = ({ children, href }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current query string (e.g., "?q=home")
  const currentQuery = searchParams.toString();
  const currentFullPath = `${pathname}${currentQuery ? `?${currentQuery}` : ''}`;

  const isActive = currentFullPath === href;

  const style = {
    marginRight: 10,
    color: isActive ? 'red' : 'black',
  };

  // Make handleClick an async function
  const handleClick = async () => {
    try {
      if (href.includes('home')) {
        router.push(href);
      } else {
        window.history.replaceState(null, '', href);
      }

      await mockRouter.push(href);
    } catch (error) {
      console.error('Navigation failed:', error); // Handle any errors
    }
  };

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault(); // Prevent default behavior
        handleClick().catch((err) => {
          console.error('Error navigating:', err); // Handle navigation error
        });
      }}
      style={style}
    >
      {children}
    </a>
  );
};

const PushPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen p-8">
      <h1>Welcome to PushPage!</h1>
      <nav>
        <ul>
          <li>
            <ActiveLink href="/en/push?q=home">Home</ActiveLink>
          </li>
          <li>
            <ActiveLink href="/en/push?q=about">About</ActiveLink>
          </li>
          <li>
            <ActiveLink href="/en/push?q=contact">Contact</ActiveLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PushPage;
