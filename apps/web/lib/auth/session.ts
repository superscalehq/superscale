import { getServerSession } from 'next-auth/next';

import { authOptions } from './authOptions';
import * as userCrud from '@/crud/user';

/**
 * Retrieves the current user from the session.
 * This function only works in server components.
 *
 * @returns {Promise<userCrud.UserWithMemberships | null>}
 */
export async function getCurrentUser(): Promise<userCrud.UserWithMemberships | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  return userCrud.getById(session.user.id);
}
