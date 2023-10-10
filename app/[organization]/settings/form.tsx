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
import { OrganizationWithMembers } from '@/crud/organization';
import { t } from '@/lib/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import cn from 'classnames';
import { useToast } from '@/components/ui/use-toast';
import { TRPCClientError } from '@trpc/client';

interface Props {
  organization: OrganizationWithMembers;
}

const formSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
});

export function OrganizationSettingsForm({ organization }: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const update = t.organization.update.useMutation();
  const { toast } = useToast();
  const submit = form.handleSubmit(async ({ name, slug }) => {
    try {
      setLoading(true);
      await update.mutateAsync({
        organizationId: organization.id,
        name,
        slug,
      });
      setLoading(false);
      toast({ title: 'Organization updated' });
      router.replace(`/${slug}/settings`);
    } catch (error) {
      const message =
        error instanceof TRPCClientError ? error.message : undefined;
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  });

  const prefixRef = useRef<HTMLDivElement>(null);
  const [spanWidth, setSpanWidth] = useState(0);
  useEffect(() => {
    if (prefixRef.current) {
      setSpanWidth(prefixRef.current.offsetWidth);
    }
  }, []);

  return (
    <div
      className={cn('flex flex-col space-y-4', spanWidth === 0 && 'opacity-0')}
    >
      <h3 className="text-lg font-medium">General</h3>
      <Form {...form}>
        <form className="space-y-4" onSubmit={submit}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:w-auto">
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input className="w-72" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Organization URL</FormLabel>
                <FormControl>
                  <div className="relative w-72">
                    <div className="absolute left-3 flex h-full items-center">
                      <span
                        className="text-sm text-muted-foreground"
                        ref={prefixRef}
                      >
                        superscale.app/
                      </span>
                    </div>
                    <Input
                      className="py-[9px]"
                      style={{ paddingLeft: `calc(${spanWidth}px + 0.75rem)` }}
                      type="text"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mb-[1px]" type="submit" loading={loading}>
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
