import { user as userCrud } from '@superscale/crud';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

const updateUserSchema = z.object({
  name: z.string().optional(),
});

const updateUserHandler = protectedProcedure
  .input(updateUserSchema)
  .mutation(async ({ ctx, input }) => {
    await userCrud.update(ctx.user.id, input);
  });

export default router({
  update: updateUserHandler,
});
