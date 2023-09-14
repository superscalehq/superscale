import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getProviders, signIn } from 'next-auth/react';
import Image from 'next/image';
import GoogleLogo from './google_logo.svg';
import SignInForm from './form';

export default async function SignIn() {
  const providers = await getProviders();
  return (
    <div className="flex min-h-full flex-1 flex-row items-center justify-center py-12 sm:px-6 lg:px-8">
      <Card className="w-[380px] p-6">
        <CardHeader>
          <div className="mb-6 flex flex-row items-center">
            <Image alt="logo" src="/logo.png" width={65} height={65} />
            <h1 className="text-4xl font-semibold leading-3">Superscale</h1>
          </div>
          <CardTitle className="leading-2">Let's get started.</CardTitle>
          <CardDescription>
            Use your work email to make it easier to invite your co-workers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            <GoogleLogo className="mr-2 h-4 w-4" /> Login with Google
          </Button>
          <div className="relative my-4">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          <SignInForm providers={providers} />
        </CardContent>
      </Card>
    </div>
  );
}
