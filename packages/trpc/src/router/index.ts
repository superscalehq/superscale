import { router } from '../trpc';
import user from './user';
import organization from './organization';

export const appRouter = router({ user, organization });

export type AppRouter = typeof appRouter;

export default appRouter;
