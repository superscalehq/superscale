import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/authOptions';
import * as userCrud from '@/crud/user';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/auth/sign-in');
  }

  const user = await userCrud.getById(session.user.id);
  if (user?.memberships.length === 0) {
    return redirect('/onboarding');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(session, null, 2)}
      {JSON.stringify(user, null, 2)}
    </main>
  );
}
