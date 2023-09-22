import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserWithMemberships } from '@/crud/user';
import { t } from '@/lib/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useWizard } from 'react-use-wizard';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
});

interface Props {
  user: UserWithMemberships;
  setLoading: (loading: boolean) => void;
}

export default function NameStep({ user, setLoading }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.username ?? '',
    },
  });
  const router = useRouter();
  const { activeStep, nextStep } = useWizard();
  const updateUser = t.user.update.useMutation();
  const submit = form.handleSubmit(
    async ({ name }: z.infer<typeof formSchema>) => {
      try {
        setLoading(true);
        await updateUser.mutateAsync({ username: name });
        router.refresh();
        nextStep();
      } finally {
        setLoading(false);
      }
    }
  );
  return (
    <>
      <CardHeader>
        <CardTitle>How do we address you?</CardTitle>
        <CardDescription>Tell us your name.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id={`onboarding-step-${activeStep + 1}`} onSubmit={submit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </CardContent>
    </>
  );
}
