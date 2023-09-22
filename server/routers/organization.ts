import { z } from 'zod';
import { router, protectedProcedure } from '@/server/trpc';
import * as organizationCrud from '@/crud/organization';

const createOrganizationSchema = z.object({
  organizationName: z.string(),
  userId: z.string(),
});

const createOrgHandler = protectedProcedure
  .input(createOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    await organizationCrud.create(input.organizationName, input.userId);
  });

export default router({
  create: createOrgHandler,
});
