import { z } from 'zod';
import { router, protectedProcedure } from '@/app/api/trpc/routes';
import * as userCrud from '@/crud/user';

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

const updateUserHandler = protectedProcedure
  .input(updateUserSchema)
  .mutation(async ({ ctx, input }) => {
    await userCrud.update(ctx.session.user.id, input);
  });

export default router({
  updateUser: updateUserHandler,
});
