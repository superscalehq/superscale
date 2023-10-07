import { getCurrentUser } from '@/lib/auth/session';

export default async function Dashboard() {
  const user = await getCurrentUser();

  return (
    <main className="container flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(user, null, 2)}
    </main>
  );
}
