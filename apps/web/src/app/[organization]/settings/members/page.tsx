import { DashboardHeader } from '@/components/header';
import { Separator } from '@/components/ui/separator';
import {
  invitation as invitationCrud,
  organization as organizationCrud,
} from '@superscale/crud';
import { OrganizationWithMembers } from '@superscale/crud/types';
import { getCurrentUser } from '@superscale/lib/auth/session';
import { redirect } from 'next/navigation';
import { InvitationForm } from './invitation-form';
import { MembersTable } from './tables';
import { RowData } from './tables/columns';

async function fetchData(organization: OrganizationWithMembers) {
  const invitations = await invitationCrud.listByOrganization(organization.id);

  const data: RowData[] = [];
  for (const member of organization.members ?? []) {
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

interface Props {
  params: {
    organization: string;
  };
}

export default async function MembersPage({
  params: { organization: slug },
}: Props) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }
  const organization = await organizationCrud.getBySlug(slug);
  const data = await fetchData(organization);
  return (
    <div className="flex flex-col">
      <DashboardHeader heading="Team" text="Manage your team here." />
      <Separator className="mb-4 mt-6" />
      <InvitationForm user={user} organization={organization} />
      <Separator className="mb-8 mt-6" />
      <MembersTable user={user} organization={organization} data={data} />
    </div>
  );
}
