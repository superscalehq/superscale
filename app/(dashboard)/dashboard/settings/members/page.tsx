import { DashboardHeader } from '@/components/header';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { InvitationForm } from './invitation-form';

export default async function MembersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <div>
      <DashboardHeader heading="Team" text="Manage your team here." />
      <Separator className="mt-4" />
      <InvitationForm user={user} />
    </div>
  );
}
