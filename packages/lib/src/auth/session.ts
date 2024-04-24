import { user as userCrud } from '@superscale/crud';
import { Session } from 'next-auth';
import { getServerSession as getNextAuthSession } from 'next-auth/next';
import { authOptions } from './authOptions';

/**
 * Retrieves the current user from the session.
 * This function only works in server components.
 *
 * @returns {Promise<userCrud.UserWithMemberships | null>}
 */
export async function getCurrentUser(): Promise<userCrud.UserWithMemberships | null> {
  const { user } = await getServerSession();
  return user;
}

/**
 * Retrieves the current session from the server.
 * This function only works in server components.
 *
 * @returns {Promise<{ session: Session | null, user: userCrud.UserWithMemberships | null }>}
 */
export async function getServerSession(): Promise<{
  session: Session | null;
  user: userCrud.UserWithMemberships | null;
}> {
  const session = await getNextAuthSession(authOptions);
  if (!session?.user) {
    return { session: null, user: null };
  }
  const user = await userCrud.getById(session.user.id);
  return { session, user };
}
