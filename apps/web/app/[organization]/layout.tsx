import { AccountNav } from '@/components/nav/account-nav';
import { MainNav } from '@/components/nav/main-nav';
import { dashboardConfig } from '@/config/dashboard';
import { getCurrentUser } from '@/lib/auth/session';
import { notFound, redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  params: { organization: string };
}

export default async function DashboardLayout({
  children,
  params: { organization },
}: Props) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }

  if (!user.name || user.memberships.length === 0) {
    console.log('redirecting to onboarding');
    redirect('/onboarding');
  }

  if (
    !user.memberships.some(
      (membership) =>
        membership.organization.slug === organization.toLowerCase()
    )
  ) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <AccountNav user={user} />
        </div>
      </header>
      {children}
    </div>
  );
}
