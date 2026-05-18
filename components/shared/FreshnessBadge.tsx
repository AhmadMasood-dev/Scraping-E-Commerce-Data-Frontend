import { Clock, Database, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreshnessBadgeProps {
  /** True when the response came from the in-memory cache. */
  fromCache?: boolean;
  /** ISO timestamp of when the data was last updated. */
  updatedAt?: string | Date | null;
  /** "Live" appears on results returned by an actual scrape (not cache, not DB). */
  live?: boolean;
  className?: string;
}

function formatRelative(when: Date): string {
  const diff = Date.now() - when.getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return when.toLocaleDateString();
}

/**
 * Tiny chip surfacing where the price came from. Backend already returns
 * `meta.fromCache` and per-doc `updatedAt` — this just renders them so users
 * know whether they're seeing fresh or cached data.
 */
export function FreshnessBadge({ fromCache, updatedAt, live, className }: FreshnessBadgeProps) {
  let Icon = Clock;
  let label = "";
  let toneClass = "bg-muted text-muted-foreground";

  if (live) {
    Icon = Zap;
    label = "Live";
    toneClass = "bg-success/10 text-success border border-success/20";
  } else if (fromCache) {
    Icon = Database;
    label = "Cached";
    toneClass = "bg-warning/10 text-warning border border-warning/20";
  } else if (updatedAt) {
    const when = typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;
    if (!Number.isNaN(when.getTime())) {
      label = `Updated ${formatRelative(when)}`;
    }
  }

  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClass,
        className
      )}
      title={updatedAt ? `Last updated: ${new Date(updatedAt).toLocaleString()}` : undefined}
    >
      <Icon className="w-3 h-3" aria-hidden />
      {label}
    </span>
  );
}
