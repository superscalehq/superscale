import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../lib/auth/authOptions';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/auth/sign-in');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(session, null, 2)}
    </main>
  );
}
