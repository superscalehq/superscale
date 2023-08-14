import { getProviders } from 'next-auth/react';
import SignInButton from './button';

export default async function SignIn() {
  const providers = await getProviders();
  return (
    <div>
      {Object.values(providers!!).map((provider) => (
        <div key={provider.name}>
          <SignInButton provider={provider} />
        </div>
      ))}
    </div>
  );
}
