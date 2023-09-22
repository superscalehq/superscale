import { AppRouter } from '@/server/routers';
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import superjson from 'superjson';

function baseUrl() {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;
}

export const t = createTRPCReact<AppRouter>();

export const trpcClient = t.createClient({
  links: [
    httpBatchLink({
      url: baseUrl() + '/api/trpc',
    }),
  ],
  transformer: superjson,
});
