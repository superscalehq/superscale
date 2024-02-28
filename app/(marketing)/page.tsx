import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Feature from './components/feature';

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-24 px-12 py-24">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
        <div>
          <span className="rounded-full border-[1px] border-foreground bg-neogreen-01 px-2 py-1 text-xs font-semibold">
            100% Open Source
          </span>
        </div>
        <h1 className="text-6xl font-bold">
          A Frontend Cloud in your infrastructure.
        </h1>
        <p className="text-xl">
          Superscale is the Frontend Cloud that you control. Deploy cutting-edge
          JavaScript applications into your own infrastructure, 100% open source
          and self-hostable.
        </p>
        <div className="flex flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link href="#waitlist">Join the Waitlist</Link>
          </Button>
          <Button variant="secondary" asChild>
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
      <div className="mx-auto grid max-w-4xl grid-cols-12 gap-4">
        <div className="col-span-12 mb-6 text-center">
          <h1 className="mb-6 text-4xl font-bold">
            Best-in-class DX, 100% control
          </h1>
          <p className="text-lg">
            Superscale delivers the developer experience of a best-in-class
            Frontend Cloud while deploying into your infrastructure. No lock in,
            opaque pricing, hidden costs, or surprise bills.
          </p>
        </div>
        <Feature
          className="col-span-12 bg-slimegreen-01 md:col-span-4"
          icon="cloud"
          header="BYO Cloud"
          description="Since we deploy into your infrastructure, you can easily integrate existing systems with Superscale-managed frontends."
        />
        <Feature
          className="col-span-12 bg-gray-200 md:col-span-4"
          icon="server"
          header="Self-host"
          description="Does your organization have exceptional needs? Superscale is 100% open source and self-hostable."
        />
        <Feature
          className="col-span-12 bg-primary-01 md:col-span-4"
          icon="nextjs"
          header="Next.js support"
          description="Superscale has first-class support for Next.js, including state-of-the-art features like caching and ISR."
        />
        <Feature
          className="col-span-12 bg-gray-200 md:col-span-4"
          icon="refresh"
          header="Push-to-deploy"
          description="Superscale automatically builds and deploys your changes, saving your from fighting brittle CI/CD pipelines."
        />
        <Feature
          className="col-span-12 bg-topaz-01 md:col-span-4"
          icon="dollar"
          header="Cost control"
          description="Advanced cost controls allow you to set budgets and alerts for, and see exactly where your money is going."
        />
        <Feature
          className="col-span-12 bg-gray-200 md:col-span-4"
          icon="rollback"
          header="Instant Rollback"
          description="Deploy on Friday with full confidence with one-click rollbacks."
        />
      </div>
    </div>
  );
}
