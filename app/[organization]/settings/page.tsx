import { DashboardHeader } from '@/components/header';
import { Separator } from '@/components/ui/separator';
import * as organizationCrud from '@/crud/organization';
import { OrganizationSettingsForm } from './form';

interface Props {
  params: {
    organization: string;
  };
}

export default async function SettingsPage({
  params: { organization: slug },
}: Props) {
  const organization = await organizationCrud.getBySlug(slug);

  return (
    <div className="flex flex-col">
      <DashboardHeader
        heading="General"
        text="Manage general organization settings here."
      />
      <Separator className="mb-4 mt-6" />
      <OrganizationSettingsForm organization={organization} />
    </div>
  );
}
