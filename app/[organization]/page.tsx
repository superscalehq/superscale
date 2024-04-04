import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/auth/sign-in`);
  }

  if (user.memberships.length === 0) {
    redirect(`/onboarding`);
  }

  return (
    <main className="container flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(user, null, 2)}
    </main>
  );
}
