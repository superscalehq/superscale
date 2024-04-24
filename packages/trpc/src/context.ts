import { getServerSession } from '@superscale/lib/auth/session';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export async function createTrpcContext({ req }: FetchCreateContextFnOptions) {
  const { session, user } = await getServerSession();
  return { session, user, req };
}

export type TrpcContext = Awaited<ReturnType<typeof createTrpcContext>>;
