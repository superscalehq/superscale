import { prisma } from '@superscale/prisma';
import { Organization as OrganizationInput } from '@superscale/prisma/client';
import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';
import { TrpcContext } from './context';

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // ensure that user is non-null, only for typing purposes
  return next({ ctx: { ...ctx, user: ctx.user, session: ctx.session } });
});

export const protectedProcedure = t.procedure.use(authMiddleware);

const OrganizationInput = z
  .object({
    organizationId: z.string(),
    organizationName: z.string(),
  })
  .partial()
  .refine(({ organizationId, organizationName }) => {
    if (!organizationId && !organizationName) {
      throw new Error('Either organizationId or organizationName is required');
    }
    return true;
  });

export const memberProcedure = protectedProcedure
  .input(OrganizationInput)
  .use(async ({ next, ctx, input, ...rest }) => {
    const { organizationId, organizationName } = input;
    const { user } = ctx.session;
    const organization = await prisma.organization.findFirst({
      where: {
        OR: [{ id: organizationId }, { name: organizationName }],
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!organization) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return next({ ...rest, ctx: { ...ctx, organization } });
  });

export const adminProcedure = protectedProcedure
  .input(OrganizationInput)
  .use(async ({ next, ctx, input, ...rest }) => {
    const { organizationId, organizationName } = input;
    const { user } = ctx;
    const organization = await prisma.organization.findFirst({
      where: {
        OR: [{ id: organizationId }, { name: organizationName }],
        members: {
          some: {
            userId: user.id,
            role: { in: ['ADMIN', 'OWNER'] },
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!organization) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return next({ ...rest, ctx: { ...ctx, organization } });
  });
