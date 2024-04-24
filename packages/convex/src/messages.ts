import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const createMessage = mutation({
  args: { authorId: v.string(), ticketId: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const { authorId, ticketId, content } = args;
    return ctx.db.insert('messages', {
      authorId,
      ticketId,
      content,
      createdAt: Date.now(),
    });
  },
});

export const readMessages = query({
  args: { ticketId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query('messages')
      .withIndex('idx_ticket_id', (q) => q.eq('ticketId', args.ticketId))
      .order('desc')
      .take(20);
  },
});
