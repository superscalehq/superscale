import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  messages: defineTable({
    authorId: v.string(),
    ticketId: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index('idx_ticket_id', ['ticketId'])
    .index('idx_created_at', ['createdAt']),
});
