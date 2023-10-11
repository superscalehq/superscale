import { DashboardHeader } from '@/components/header';
import { Separator } from '@/components/ui/separator';
import * as organizationCrud from '@/crud/organization';
import { OrganizationSettingsForm } from './form';
import { getCurrentUser } from '@/lib/auth/session';

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

  return (
    <div className="flex flex-col">
      <DashboardHeader
        heading="General"
        text="Manage general organization settings here."
      />
      <Separator className="mb-4 mt-6" />
      <OrganizationSettingsForm user={user} organization={organization} />
    </div>
  );
}
