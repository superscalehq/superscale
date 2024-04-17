'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email(),
});

interface Props {
  providers: Awaited<ReturnType<typeof getProviders>>;
  email?: string;
  invitationId?: string;
}

export default function SignInForm({
  providers,
  invitationId,
  email = '',
}: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email },
  });
  const handleSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    try {
      const emailProvider = providers?.email.id;
      if (!emailProvider) {
        return;
      }

      const data = new URLSearchParams();
      await signIn(
        emailProvider,
        {
          email,
          redirect: false,
          callbackUrl: invitationId
            ? `/auth/invitation/${invitationId}?accept=true`
            : '/',
        },
        data
      );
      router.push(`/auth/check-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error('Error sending email: ', err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="you@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-4 w-full"
          variant="outline"
          disabled={!form.formState.isValid}
        >
          Continue
        </Button>
      </form>
    </Form>
  );
}
