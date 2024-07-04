'use client';
import { usePathname } from 'next/navigation';
import React from 'react';
import { cx } from '../lib/cx';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  return (
    <header
      aria-label="Site Header"
      className={cx(
        'flex items-center h-[var(--navbar-height)] border-b-2 border-gray-100 px-3 lg:px-12',
        isHome && 'bg-dot'
      )}
    >
      <div className="w-full flex h-10 items-center justify-between">
        <Link href={'/'}>
          <div className="flex items-center justify-center gap-1">
            <Image
              src={'assets/heart.svg'}
              width={16}
              height={16}
              alt="logo"
              className="h-8 w-full"
              priority
            />
            <h2 className="text-xl whitespace-nowrap font-bold text-primary">
              Resume Builder and Parser
            </h2>
          </div>
        </Link>
        <nav aria-label="Site Navbar" className="flex items-center gap-2 text-sm font-medium">
          {[
            ['/resume-builder', 'Builder'],
            ['/resume-parser', 'Parser'],
          ].map(([href, text]) => (
            <Link
              key={text}
              href={href}
              className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4"
            >
              {text}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
