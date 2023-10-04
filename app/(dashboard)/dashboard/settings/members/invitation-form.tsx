'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserWithMemberships } from '@/crud/user';
import { t } from '@/lib/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  role: z.enum([OrganizationRole.ADMIN, OrganizationRole.MEMBER]),
});

interface Props {
  user: UserWithMemberships;
}

export function InvitationForm({ user }: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: OrganizationRole.MEMBER,
    },
  });
  const [loading, setLoading] = useState(false);
  // TODO: this should be derived from a slug, preferably
  const [membership] = user.memberships ?? [];
  // it's not supposed to be possible to get here without belonging to an organization.
  if (!membership) {
    redirect('/onboarding');
  }

  const invite = t.organization.invite.useMutation();
  const submit = form.handleSubmit(async ({ email, role }) => {
    try {
      setLoading(true);
      await invite.mutateAsync({
        email,
        role,
        organizationId: membership.organizationId,
      });
    } catch (err) {
      console.error('Error inviting user: ', err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="mb-10">
      <div className="mt-4">
        <h3 className="text-lg font-medium">Invite a team member</h3>
        <p className="text-md">Send an invitation to a team member</p>
      </div>
      <Form {...form}>
        <form className="flex flex-row items-end space-x-4" onSubmit={submit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage className="sm:absolute" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a role." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={OrganizationRole.ADMIN}>
                      Admin
                    </SelectItem>
                    <SelectItem value={OrganizationRole.MEMBER}>
                      Member
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button className="mb-[1px]" type="submit" loading={loading}>
            Invite
          </Button>
        </form>
      </Form>
    </div>
  );
}
