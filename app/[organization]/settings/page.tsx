import { DashboardHeader } from '@/components/header';
import { Separator } from '@/components/ui/separator';
import * as organizationCrud from '@/crud/organization';
import { getCurrentUser } from '@/lib/auth/session';
import { DeleteOrganization } from './delete-org';
import { OrganizationSettingsForm } from './org-details-form';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    organization: string;
  };
}

export default async function SettingsPage({
  params: { organization: slug },
}: Props) {
  const organization = await organizationCrud.getBySlug(slug);
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        heading="General"
        text="Manage general organization settings here."
      />
      <Separator className="mb-4 mt-6" />
      <OrganizationSettingsForm user={user} organization={organization} />
      <Separator className="mb-4 mt-6" />
      <DeleteOrganization user={user} organization={organization} />
    </div>
  );
}
