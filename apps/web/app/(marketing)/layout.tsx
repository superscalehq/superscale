import MarketingFooter from './layout/footer';
import MarketingHeader from './layout/header';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-full w-full flex-col items-center">
      <MarketingHeader className="mx-auto max-w-5xl pt-8" />
      {children}
      <MarketingFooter />
    </main>
  );
}
