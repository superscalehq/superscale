import { z } from 'zod';
import { protectedProcedure } from '..';
import { api } from '@superscale/convex/api';
import { ConvexHttpClient } from 'convex/browser';

const client = new ConvexHttpClient('http://localhost:8080');

const ticketSchema = z.object({
  organizationId: z.string(),
  messages: z.array(z.string()),
});

const createTicket = protectedProcedure
  .input(ticketSchema)
  .mutation(async ({ ctx, input }) => {
    const { organizationId, messages } = input;
    if (
      !ctx.user.memberships.some((m) => m.organizationId === organizationId)
    ) {
      throw new Error('User is not a member of the organization');
    }
    await client.mutation(api.messages.createMessage, {
      content: messages[0],
      organizationId,
    });
  });
