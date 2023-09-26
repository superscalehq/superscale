import * as userCrud from '@/crud/user';
import { protectedProcedure, router } from '@/server/trpc';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().optional(),
});

const updateUserHandler = protectedProcedure
  .input(updateUserSchema)
  .mutation(async ({ ctx, input }) => {
    await userCrud.update(ctx.session.user.id, input);
  });

export default router({
  update: updateUserHandler,
});
