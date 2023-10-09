'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserWithMemberships } from '@/crud/user';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface Props {
  user: UserWithMemberships;
}

export function WorkspaceNav({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex h-12 flex-col items-start px-4 py-2"
          variant="ghost"
        >
          <span className="text-xs font-light text-muted-foreground">
            Signed in as:
          </span>
          <span className="text-sm font-semibold">{user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user?.memberships.map((membership) => (
          <DropdownMenuItem key={membership.organization.id}>
            <Link href={`/${membership.organization.slug}`}>
              {membership.organization.name}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/auth/sign-in`,
            });
          }}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
