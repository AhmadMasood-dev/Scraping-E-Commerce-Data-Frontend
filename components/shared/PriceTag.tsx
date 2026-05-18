import { TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  amount: number | null | undefined;
  size?: "sm" | "md" | "lg";
  /** When "cheapest", the price gets emerald accent + a "Best Price" eyebrow. */
  variant?: "default" | "cheapest";
  /** Optional eyebrow label above the price (e.g. "Best Price · Imtiaz"). */
  label?: string;
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<PriceTagProps["size"]>, string> = {
  sm: "text-base font-semibold",
  md: "text-2xl font-bold",
  lg: "text-3xl md:text-4xl font-bold",
};

/**
 * Single source for price rendering across the app. All currency formatting,
 * "N/A" fallback, and the cheapest highlight live here so cards stay
 * visually consistent.
 */
export function PriceTag({ amount, size = "md", variant = "default", label, className }: PriceTagProps) {
  const isValid = typeof amount === "number" && !Number.isNaN(amount);
  const isCheapest = variant === "cheapest";

  return (
    <div className={cn("flex flex-col", className)}>
      {(label || isCheapest) && (
        <span
          className={cn(
            "text-eyebrow flex items-center gap-1",
            isCheapest && "text-success"
          )}
        >
          {isCheapest && <TrendingDown className="w-3 h-3" aria-hidden />}
          {label || "Best Price"}
        </span>
      )}
      <span
        className={cn(
          SIZE_CLASS[size],
          "tracking-tight",
          isCheapest ? "text-success" : "text-foreground"
        )}
      >
        {isValid ? `Rs. ${amount.toLocaleString()}` : "N/A"}
      </span>
    </div>
  );
}
