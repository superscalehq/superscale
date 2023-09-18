'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSelectedLayoutSegment } from 'next/navigation';
import cn from 'classnames';

interface NavItem {
  name: string;
  href: string;
  disabled?: boolean;
}

interface NavProps {
  items: NavItem[];
}

export function MainNav({ items }: NavProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex md:gap-10">
      <Link className="hidden items-center space-x-2 md:flex" href="/">
        <Image width={50} height={50} src="/logo.png" alt="Superscale" />
        <span className="hidden font-bold sm:inline-block">Superscale</span>
      </Link>
      {items.length ? (
        <nav className="hidden gap-6 md:flex">
          {items.map((item) => (
            <Link
              className={cn(
                'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                item.href.startsWith(`/${segment}`)
                  ? 'text-foreground'
                  : 'text-foreground/60',
                item.disabled && 'cursor-not-allowed opacity-80'
              )}
              href={item.href}
              key={item.href}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
