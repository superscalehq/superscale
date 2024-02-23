import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  // TODO: figure out how to redirect users when they don't have an organization
  const user = await getCurrentUser();
  if (user) {
    if (user.memberships.length > 0) {
      redirect(`/${user.memberships[0].organization.slug}`);
    }
    redirect(`/onboarding`);
  }

  return (
    <main className="container flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(user, null, 2)}
    </main>
  );
}
