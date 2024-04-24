import {
  appRouter,
  createTrpcContext,
  fetchRequestHandler,
} from '@superscale/trpc';
import { NextRequest } from 'next/server';

function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTrpcContext,
  });
}

export { handler as GET, handler as POST };
