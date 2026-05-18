"use client";

import { ErrorBoundary as REB } from "react-error-boundary";
import { ReactNode } from "react";
import { ErrorAlert } from "./ErrorAlert";

interface Props {
  children: ReactNode;
  label?: string;
  fallback?: ReactNode;
}

function DefaultFallback({ error, label }: { error: Error; label?: string }) {
  return (
    <ErrorAlert
      message={`${label ? `[${label}] ` : ""}${error.message || "Something went wrong"}`}
    />
  );
}

export function ErrorBoundary({ children, label, fallback }: Props) {
  return (
    <REB
      fallbackRender={({ error }) =>
        fallback ?? <DefaultFallback error={error as Error} label={label} />
      }
    >
      {children}
    </REB>
  );
}
