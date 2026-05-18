import { storeColor } from "@/lib/storeConfig";
import { cn } from "@/lib/utils";

interface StoreBadgeProps {
  storeName: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Soft store identity chip — color dot + plain-case name. Replaces the
 * brutalist colored bars that used to top each card. Use this anywhere a
 * store needs identification without shouting.
 */
export function StoreBadge({ storeName, size = "sm", className }: StoreBadgeProps) {
  const color = storeColor(storeName);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium",
        size === "sm" ? "text-xs" : "text-sm",
        color.text,
        className
      )}
    >
      <span
        aria-hidden
        className={cn("rounded-full", color.bg, size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5")}
      />
      <span className="truncate">{storeName}</span>
    </span>
  );
}
