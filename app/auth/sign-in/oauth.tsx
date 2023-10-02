'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import GoogleLogo from './google_logo.svg';

interface Props {
  invitationId?: string;
}

export default function Oauth({ invitationId }: Props) {
  return (
    <div>
      <Button
        className="w-full"
        onClick={() => {
          signIn('google', {
            callbackUrl: invitationId
              ? `/auth/invitation/${invitationId}?accept=true`
              : '/dashboard',
          });
        }}
      >
        <GoogleLogo className="mr-2 h-4 w-4" /> Login with Google
      </Button>
    </div>
  );
}
