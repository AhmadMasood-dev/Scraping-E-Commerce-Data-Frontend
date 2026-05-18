'use client';

import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { queryClient } from './QueryClient';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ErrorBoundary label="App">{children}</ErrorBoundary>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
