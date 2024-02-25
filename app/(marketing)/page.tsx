import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-24">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
        <div>
          <span className="rounded-full border-[1px] border-foreground px-2 py-1 text-xs font-semibold">
            100% Open Source
          </span>
        </div>
        <h1 className="text-6xl font-bold">
          A Frontend Cloud for your infrastructure.
        </h1>
        <p className="text-xl">
          Superscale is the Frontend Cloud that you control. Deploy cutting-edge
          JavaScript applications into your own infrastructure, 100% open source
          and self-hostable.
        </p>
        <div className="flex flex-row items-center justify-center gap-2">
          <Button asChild>
            <Link href="#waitlist">Join the Waitlist</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="https://github.com/superscalehq/superscale"
              target="_blank"
              rel="noreferrer"
            >
              Star on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
