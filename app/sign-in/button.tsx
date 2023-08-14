'use client';

import { ClientSafeProvider, signIn } from 'next-auth/react';

interface Props {
  provider: ClientSafeProvider;
}

export default function SignInButton({ provider }: Props) {
  const { name, id } = provider;
  const handleSignIn = (id: string) => {
    try {
      signIn(id);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={() => handleSignIn(id)}>Sign in with {name}</button>
    </div>
  );
}
