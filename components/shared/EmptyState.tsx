import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  /** Visual density: `compact` for inside cards, `default` for full pages. */
  size?: "compact" | "default";
}

/**
 * Unified empty-state block used anywhere data could be missing — search with no
 * results, an empty category, an unsynced collection. Keeps every page visually
 * consistent when there's nothing to show.
 */
export function EmptyState({ icon: Icon, title, description, action, className, size = "default" }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center text-center mx-auto",
        size === "default" ? "py-16 px-6 max-w-2xl" : "py-10 px-5",
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "rounded-full bg-muted flex items-center justify-center mb-4",
            size === "default" ? "h-14 w-14" : "h-10 w-10"
          )}
        >
          <Icon
            className={cn("text-muted-foreground", size === "default" ? "w-6 h-6" : "w-5 h-5")}
            aria-hidden
          />
        </div>
      )}
      <h3 className={cn("font-semibold tracking-tight text-foreground", size === "default" ? "text-xl" : "text-base")}>
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-md">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
