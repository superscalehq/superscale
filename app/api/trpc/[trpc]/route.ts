import router from '@/server/routers';
import { authOptions } from '../../../../lib/auth/authOptions';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { getServerSession } from 'next-auth/next';
import { NextRequest } from 'next/server';

function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router,
    createContext: async () => {
      const session = await getServerSession(authOptions);
      return { session, organization: null };
    },
  });
}

export { handler as GET, handler as POST };
