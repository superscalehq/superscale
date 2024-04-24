import { z } from 'zod';

export const authConfigSchema = z.object({
  NEXTAUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export const authConfig = authConfigSchema.parse(process.env);
