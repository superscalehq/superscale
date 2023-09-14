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
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email(),
});

interface Props {
  providers: Awaited<ReturnType<typeof getProviders>>;
}

export default function SignInForm({ providers }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  const handleSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    try {
      const emailProvider = providers?.email.id;
      if (!emailProvider) {
        return;
      }

      const res = await signIn(emailProvider, {
        email,
        redirect: false,
        callbackUrl: `${window.location.origin}/sign-in/verify`,
      });
      console.log(res);
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
        ></FormField>
        <Button
          type="submit"
          className="mt-4 w-full"
          loading={form.formState.isSubmitting}
          variant="outline"
          disabled={!form.formState.isValid}
        >
          Continue
        </Button>
      </form>
    </Form>
  );
}
