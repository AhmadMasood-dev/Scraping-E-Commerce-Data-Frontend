/**
 * Centralized store identity colors. Used by `<StoreBadge>` and the per-store
 * left-strip on cards. Each store gets a single role color; UI components pick
 * the right utility class for their context.
 *
 * Add new stores here — never inline these in components.
 */
export interface StoreColor {
  name: string;
  /** Tailwind 600-shade utility for solid backgrounds (e.g. dot, left strip). */
  bg: string;
  /** Tailwind text utility for store-name text on white-ish backgrounds. */
  text: string;
  /** Tailwind border utility for the left identity strip on cards. */
  border: string;
}

export const STORE_COLORS: Record<string, StoreColor> = {
  Telemart:               { name: "Telemart",               bg: "bg-green-600",   text: "text-green-700",   border: "border-l-green-600" },
  Daraz:                  { name: "Daraz",                  bg: "bg-orange-500",  text: "text-orange-600",  border: "border-l-orange-500" },
  PriceOye:               { name: "PriceOye",               bg: "bg-blue-600",    text: "text-blue-700",    border: "border-l-blue-600" },
  Mega:                   { name: "Mega",                   bg: "bg-purple-600",  text: "text-purple-700",  border: "border-l-purple-600" },
  Imtiaz:                 { name: "Imtiaz",                 bg: "bg-red-500",     text: "text-red-600",     border: "border-l-red-500" },
  "Punjab Cash & Carry":  { name: "Punjab Cash & Carry",    bg: "bg-teal-500",    text: "text-teal-600",    border: "border-l-teal-500" },
  Metro:                  { name: "Metro",                  bg: "bg-amber-500",   text: "text-amber-600",   border: "border-l-amber-500" },
  "MEGA.PK":              { name: "MEGA.PK",                bg: "bg-purple-600",  text: "text-purple-700",  border: "border-l-purple-600" },
  Kaggle_Seed:            { name: "Catalog",                bg: "bg-slate-500",   text: "text-slate-600",   border: "border-l-slate-500" },
};

export const DEFAULT_STORE_COLOR: StoreColor = {
  name: "Store",
  bg: "bg-neutral-500",
  text: "text-neutral-600",
  border: "border-l-neutral-500",
};

export function storeColor(name: string | undefined | null): StoreColor {
  if (!name) return DEFAULT_STORE_COLOR;
  return STORE_COLORS[name] ?? DEFAULT_STORE_COLOR;
}
