"use client";

import Link from "next/link";
import { PrimaryProduct, ComparisonEntry } from "@/services/api";
import { ProductImage } from "./ProductImage";
import { StoreBadge } from "./StoreBadge";
import { PriceTag } from "./PriceTag";
// AUTH-DISABLED: import { WishlistButton } from "./WishlistButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowUpRight, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { storeColor } from "@/lib/storeConfig";

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(0, rating));
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i <= Math.round(clamped) ? "fill-amber-400 text-amber-400" : "text-neutral-300"
          )}
        />
      ))}
      <span className="text-sm font-medium text-muted-foreground ml-1">{clamped.toFixed(1)}</span>
    </div>
  );
}

function ComparisonRow({ entry, isCheapest }: { entry: ComparisonEntry; isCheapest: boolean }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5 transition-colors",
        isCheapest ? "bg-success/5" : "hover:bg-muted/40"
      )}
    >
      <div className="min-w-0 flex flex-col gap-0.5">
        <StoreBadge storeName={entry.store_name} size="md" />
        {entry.reviews != null && (
          <p className="text-xs text-muted-foreground">{entry.reviews.toLocaleString()} reviews</p>
        )}
      </div>

      <PriceTag
        amount={entry.price}
        size="md"
        variant={isCheapest ? "cheapest" : "default"}
        label={isCheapest ? "Best Price" : undefined}
        className="items-end text-right"
      />

      <Button
        asChild
        variant={isCheapest ? "default" : "outline"}
        size="sm"
        className="rounded-xl"
      >
        <a href={entry.url} target="_blank" rel="noopener noreferrer">
          Visit
          <ArrowUpRight className="w-3.5 h-3.5 ml-1" aria-hidden />
        </a>
      </Button>
    </div>
  );
}

export function PrimaryProductCard({ primary }: { primary: PrimaryProduct }) {
  if (primary.comparisons.length === 0) return null;

  const cheapest = primary.comparisons[0];
  const expensive = primary.comparisons[primary.comparisons.length - 1];
  const savings = primary.has_comparison && expensive.price > cheapest.price
    ? expensive.price - cheapest.price
    : 0;
  const detailHref = cheapest.product_id ? `/products/${cheapest.product_id}` : null;
  const cheapestColor = storeColor(cheapest.store_name);

  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden shadow-soft",
        "border-l-4",
        cheapestColor.border
      )}
    >
      {/* Header — soft, no caps, just a chip and a savings badge */}
      <header className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-eyebrow">
            {primary.has_comparison
              ? `Compared across ${primary.comparisons.length} stores`
              : "Single source"}
          </span>
        </div>
        {savings > 0 && (
          <Badge className="rounded-full bg-success/10 text-success border border-success/20 hover:bg-success/15 px-3 py-1 text-xs font-semibold gap-1">
            <TrendingDown className="w-3 h-3" aria-hidden />
            Save Rs. {savings.toLocaleString()}
          </Badge>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <div className="bg-white p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-border/60 min-h-[280px] relative">
          {/* AUTH-DISABLED: wishlist overlay hidden until auth is re-enabled.
              {detailHref && (
                <div className="absolute top-4 right-4">
                  <WishlistButton productId={cheapest.product_id!} variant="floating" size="md" />
                </div>
              )}
          */}
          <ProductImage
            src={primary.image_url}
            alt={primary.title}
            storeName={primary.cheapest_store}
            className="max-h-full max-w-full object-contain mix-blend-multiply"
          />
        </div>

        <div className="p-6 md:p-8 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {primary.category && (
              <Badge variant="secondary" className="rounded-full font-medium text-xs">
                {primary.category}
              </Badge>
            )}
            {primary.brand && (
              <Badge variant="outline" className="rounded-full font-medium text-xs">
                {primary.brand}
              </Badge>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-3">
            {primary.title}
          </h2>

          {primary.rating != null && primary.rating > 0 && (
            <div className="mb-4">
              <StarRating rating={primary.rating} />
            </div>
          )}

          {primary.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{primary.description}</p>
          )}

          <div className="mt-auto rounded-xl border border-border overflow-hidden">
            <div className="bg-muted/60 px-5 py-2.5 border-b border-border/60">
              <span className="text-eyebrow">
                {primary.has_comparison
                  ? `Available at ${primary.comparisons.length} stores · cheapest first`
                  : "Available at 1 store"}
              </span>
            </div>
            <div className="divide-y divide-border/60 bg-background">
              {primary.comparisons.map((c) => (
                <ComparisonRow
                  key={`${c.store_name}-${c.product_id ?? c.url}`}
                  entry={c}
                  isCheapest={primary.has_comparison && c.store_name === cheapest.store_name}
                />
              ))}
            </div>
          </div>

          {detailHref && (
            <div className="mt-5">
              <Button asChild variant="ghost" className="rounded-xl gap-2 text-sm font-medium">
                <Link href={detailHref}>
                  View full product details
                  <ArrowUpRight className="w-4 h-4" aria-hidden />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
