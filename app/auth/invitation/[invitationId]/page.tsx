import * as invitationCrud from '@/crud/invitation';
import { getCurrentUser } from '@/lib/auth/session';
import { InvitationCard } from './card';
import { redirect } from 'next/navigation';

interface Props {
  params: { invitationId: string };
  searchParams: { accept?: boolean };
}

export default async function AcceptInvitationPage({
  params: { invitationId },
  searchParams: { accept },
}: Props) {
  const user = await getCurrentUser();
  const invitation = await invitationCrud.findById(invitationId);
  if (accept && invitation && user && user.email === invitation.email) {
    await invitationCrud.accept(invitationId);
    redirect('/dashboard');
  }

  return (
    <div className="container flex h-full flex-col items-center justify-center">
      <InvitationCard invitation={invitation} />
    </div>
  );
}
