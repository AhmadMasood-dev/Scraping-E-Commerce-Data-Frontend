import type { AuthUser } from "@/services/types";

const TOKEN_KEY = "pqc_auth_user";

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("pqc-auth-changed"));
}

export function clearAuthUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("pqc-auth-changed"));
}

export function getAuthToken(): string | null {
  return getAuthUser()?.token ?? null;
}
