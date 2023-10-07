import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { InvitationForm } from './invitation-form';

import { DashboardHeader } from '@/components/header';
import * as invitationCrud from '@/crud/invitation';
import * as organizationCrud from '@/crud/organization';
import { UserWithMemberships } from '@/crud/user';
import { DataTable } from './tables';
import { RowData } from './tables/columns';

async function fetchData(user: UserWithMemberships) {
  const {
    organization: { id: organizationId },
  } = user.memberships[0];
  const [members, invitations] = await Promise.all([
    organizationCrud.members(organizationId),
    invitationCrud.listByOrganization(organizationId),
  ]);

  const data: RowData[] = [];
  for (const member of members ?? []) {
    data.push({
      type: 'member',
      userId: member.userId,
      name: member.user.name!!,
      email: member.user.email!!,
      role: member.role,
      imageUrl: member.user.image,
    });
  }
  for (const invitation of invitations ?? []) {
    data.push({
      type: 'invitation',
      email: invitation.email,
      role: invitation.role,
      invitationId: invitation.id,
    });
  }
  return data;
}

export default async function MembersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }
  const { organization } = user.memberships[0];
  const data = await fetchData(user);
  return (
    <div className="flex flex-col">
      <DashboardHeader heading="Team" text="Manage your team here." />
      <Separator className="mb-4 mt-6" />
      <InvitationForm user={user} />
      <DataTable user={user} organization={organization} data={data} />
    </div>
  );
}
