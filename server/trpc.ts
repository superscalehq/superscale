import { TRPCError, initTRPC } from '@trpc/server';
import { type Session } from 'next-auth';
import superjson from 'superjson';

export type TRPCContext = {
  session: Session | null;
};

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // ensure that user is non-null, only for typing purposes
  return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});

export const protectedProcedure = t.procedure.use(authMiddleware);
