"use client";

import { useSyncExternalStore } from "react";
import { getAuthUser } from "@/lib/auth";
import type { AuthUser } from "@/services/types";

const subscribe = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("pqc-auth-changed", cb);
  window.addEventListener("storage", cb); // cross-tab sync
  return () => {
    window.removeEventListener("pqc-auth-changed", cb);
    window.removeEventListener("storage", cb);
  };
};

const getSnapshot = () => getAuthUser();
const getServerSnapshot = (): AuthUser | null => null;

/**
 * Auth state hook backed by lib/auth's `pqc-auth-changed` event + the browser's
 * native `storage` event for cross-tab sync. Uses useSyncExternalStore so React
 * tears no UI when the token flips and avoids the setState-in-effect lint rule.
 */
export function useAuth(): { user: AuthUser | null; isAuthed: boolean } {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { user, isAuthed: !!user };
}
