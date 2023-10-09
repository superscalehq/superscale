import * as userCrud from '@/crud/user';
import { authOptions } from '@/lib/auth/authOptions';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Onboarding from './steps';

export enum Steps {
  WELCOME,
  NAME,
  ORG,
}

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/auth/sign-in');
  }

  const user = await userCrud.getById(session.user.id);

  if (user.name && user.memberships.length > 0) {
    return redirect(`/${user.memberships[0].organization.slug}`);
  }

  return (
    <main className="container flex h-screen w-screen flex-col items-center justify-center space-y-12 py-24">
      <div className="flex flex-col items-center justify-center">
        <Image src="/logo.png" height={120} width={120} alt="logo" />
        <h1 className="text-4xl font-bold">Superscale</h1>
      </div>
      <Onboarding user={user} />
    </main>
  );
}
