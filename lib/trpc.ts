import { AppRouter } from '@/server/routers';
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import superjson from 'superjson';
import { baseUrl } from './utils';

export const t = createTRPCReact<AppRouter>();

export const trpcClient = t.createClient({
  links: [
    httpBatchLink({
      url: baseUrl() + '/api/trpc',
    }),
  ],
  transformer: superjson,
});
