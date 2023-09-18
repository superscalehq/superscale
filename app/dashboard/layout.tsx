import { MainNav } from '@/components/nav/main-nav';
import { dashboardConfig } from '../../config/dashboard';
import { AccountNav } from '@/components/nav/account-nav';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
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
