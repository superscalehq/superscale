import * as invitationCrud from '@/crud/invitation';
import { getCurrentUser } from '@/lib/auth/session';
import { UserInvitationStatus } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import { InvitationCard } from './card';

interface Props {
  params: { invitationId: string };
  searchParams: { accept?: boolean };
}

export default async function AcceptInvitationPage({
  params: { invitationId },
  searchParams: { accept },
}: Props) {
  const invitation = await invitationCrud.findById(invitationId);
  if (!invitation) {
    notFound();
  }

  // already accepted, redirect to dashboard
  if (invitation.status === UserInvitationStatus.ACCEPTED) {
    redirect('/dashboard');
  }

  const user = await getCurrentUser();
  // In this case, the user was asked to sign in and redirected back here.
  if (accept && user && user.email === invitation.email) {
    await invitationCrud.accept(invitationId);
    redirect('/dashboard');
  }

  return (
    <div className="container flex h-full flex-col items-center justify-center">
      <InvitationCard invitation={invitation} user={user} />
    </div>
  );
}
