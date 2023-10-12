import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    if (user.memberships.length > 0) {
      redirect(`/${user.memberships[0].organization.slug}`);
    }
    redirect(`/onboarding`);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      WELCOME
    </main>
  );
}
