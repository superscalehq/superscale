'use client';

import { queryClient } from '@/lib/react-query';
import { t, trpcClient } from '@/lib/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <t.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </t.Provider>
  );
};
