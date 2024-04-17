interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-2">
        <h1 className="font-heading text-3xl font-medium md:text-4xl">
          {heading}
        </h1>
        {text && <p className="text-md text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}
