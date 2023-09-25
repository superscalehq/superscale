'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import GoogleLogo from './google_logo.svg';

export default function Oauth() {
  return (
    <div>
      <Button
        className="w-full"
        onClick={() => {
          signIn('google', { callbackUrl: '/dashboard' });
        }}
      >
        <GoogleLogo className="mr-2 h-4 w-4" /> Login with Google
      </Button>
    </div>
  );
}
