'use client';

import Link from 'next/link';
import { SidebarNavItem } from './types';
import cn from 'classnames';
import { Icons } from '../icons';
import { usePathname } from 'next/navigation';

interface Props {
  items: SidebarNavItem[];
}

export function SideNav({ items }: Props) {
  const path = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {items.map(({ name, href, icon, disabled }) => {
        const Icon = Icons[icon || 'arrowRight'];
        return (
          <Link key={name} href={href}>
            <span
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm  hover:bg-accent hover:text-accent-foreground',
                path === href ? 'font-bold' : 'font-normal',
                disabled && 'cursor-not-allowed opacity-80'
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{name}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
