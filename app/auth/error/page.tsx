import { buttonVariants } from '@/components/ui/button';
import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import * as z from 'zod';

const schema = z.object({
  error: z.string().toLowerCase().default(''),
});

interface Props {
  searchParams: { [key: string]: string };
}

function copy(error: string) {
  switch (error) {
    case 'verification':
      return (
        <>
          <p className="pb-6 text-muted-foreground">
            The link you used is no longer valid.
          </p>
          <p className="pb-4 text-muted-foreground">
            It was either used already or it expired.
          </p>
        </>
      );
    case 'accessdenied':
      return (
        <>
          <p className="pb-6 text-muted-foreground">
            Looks like you don't have access to this account.
          </p>
          <p className="pb-4 text-muted-foreground">
            Please contact your workspace administrator.
          </p>
        </>
      );
    default:
      return (
        <>
          <p className="pb-6 text-muted-foreground">
            Something seems to have gone wrong on our end.
          </p>
        </>
      );
  }
}

export default function AuthErrorPage({ searchParams }: Props) {
  const params = schema.parse(searchParams);
  return (
    <div className="container h-full">
      <div className="flex h-full w-full flex-col items-center justify-center sm:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-start justify-center">
            <h1 className="pb-8 text-4xl font-bold">
              Oops! We had a problem signing you in.
            </h1>
            {copy(params.error)}
            <Link
              className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}
              href="/sign-in"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="hidden flex-1 flex-col md:flex">
          <Image
            src="/illustrations/error.svg"
            alt={'error-illustration'}
            width="800"
            height="800"
          />
        </div>
      </div>
    </div>
  );
}
