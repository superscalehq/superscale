import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { InvitationForm } from './invitation-form';

import { DashboardHeader } from '@/components/header';
import * as invitationCrud from '@/crud/invitation';
import * as organizationCrud from '@/crud/organization';
import { DataTable } from './tables';
import { RowData, columns } from './tables/columns';

async function fetchData(organizationId: string) {
  const [members, invitations] = await Promise.all([
    organizationCrud.members(organizationId),
    invitationCrud.listByOrganization(organizationId),
  ]);

  const data: RowData[] = [];
  for (const member of members ?? []) {
    data.push({
      type: 'member',
      name: member.user.name!!,
      email: member.user.email!!,
      role: member.role,
    });
  }
  for (const invitation of invitations ?? []) {
    data.push({
      type: 'invitation',
      email: invitation.email,
      role: invitation.role,
    });
  }
  return data;
}

export default async function MembersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }
  const data = await fetchData(user.memberships[0].organization.id);

  return (
    <div>
      <DashboardHeader heading="Team" text="Manage your team here." />
      <Separator className="mt-4" />
      <InvitationForm user={user} />
      <DataTable data={data} columns={columns} />
    </div>
  );
}
