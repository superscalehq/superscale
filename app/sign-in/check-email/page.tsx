import { useSearchParams } from 'next/navigation';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
});

interface Props {
  searchParams: { [key: string]: string };
}

export default function CheckEmailPage({ searchParams }: Props) {
  const params = schema.safeParse(searchParams);
  console.log(searchParams);
  // @ts-ignore
  console.log(params.error);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {params.success ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-semibold leading-3">Check your email</h1>
          <p className="text-center text-muted-foreground">
            We've sent an email to {params.data.email}. Click the link in the
            email to confirm your account.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-semibold leading-3">
            Were you trying to sign in?
          </h1>
          <p className="text-center text-muted-foreground">
            We weren't able to find the email you entered. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}
