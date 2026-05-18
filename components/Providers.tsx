"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { queryClient } from "@/providers/QueryClient";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ErrorBoundary label="App">{children}</ErrorBoundary>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
