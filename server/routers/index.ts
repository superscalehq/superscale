import { router } from '@/server/trpc';
import user from './user';
import organization from './organization';

const appRouter = router({ user, organization });

export type AppRouter = typeof appRouter;

export default appRouter;
