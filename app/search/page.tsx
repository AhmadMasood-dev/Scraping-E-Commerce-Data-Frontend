"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Star, ArrowUpRight, SearchX, Loader2 } from "lucide-react";

import { useSearchProducts } from "@/services/hooks";
import { StoreResult } from "@/services/api";
import { Product } from "@/services/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ScraperMetaBar } from "@/components/shared/ScraperMetaBar";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ProductImage } from "@/components/shared/ProductImage";
import { PrimaryProductCard } from "@/components/shared/PrimaryProductCard";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/ProductCardSkeleton";
import { StoreBadge } from "@/components/shared/StoreBadge";
import { PriceTag } from "@/components/shared/PriceTag";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { storeColor } from "@/lib/storeConfig";
import { cn } from "@/lib/utils";

// ─── Star rating chip ────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(0, rating));
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i <= Math.round(clamped)
              ? "fill-amber-400 text-amber-400"
              : "text-neutral-300",
          )}
        />
      ))}
      <span className="text-xs font-medium text-muted-foreground ml-1">
        {clamped.toFixed(1)}
      </span>
    </div>
  );
}

// ─── Per-store card (used inside the "More listings" details panel) ─────────
function StoreCard({ item }: { item: StoreResult }) {
  const color = storeColor(item.store_name);
  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 transition-all border-l-4",
        color.border,
      )}
    >
      <div className="h-44 bg-white p-5 flex items-center justify-center border-b border-border/60 overflow-hidden">
        <ProductImage
          src={item.image_url}
          alt={item.title}
          storeName={item.store_name}
          className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <StoreBadge storeName={item.store_name} />
        <h3 className="font-semibold text-foreground tracking-tight text-sm leading-snug line-clamp-2 flex-1">
          {item.title}
        </h3>
        <div className="flex items-center justify-between">
          <StarRating rating={item.rating} />
          {item.reviews != null && (
            <span className="text-xs text-muted-foreground">
              {item.reviews.toLocaleString()} reviews
            </span>
          )}
        </div>
        <PriceTag amount={item.price} size="md" />
        <div className="flex gap-2 mt-1">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl"
          >
            <Link href={`/products/${item._id}`}>Details</Link>
          </Button>
          <Button asChild size="sm" className="flex-1 rounded-xl gap-1.5">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              Visit <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

// ─── Search content ──────────────────────────────────────────────────────────
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const lang = (searchParams.get("lang") as "en" | "ur" | "ro") || "en";

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useSearchProducts(query, lang);

  const dbProducts: Product[] = response?.data || [];
  const storeResults: StoreResult[] = response?.storeResults || [];
  const primary = response?.primary ?? null;
  const meta = response?.meta;
  const isScraping = response?.isScraping;

  const totalResults = (primary ? 1 : 0) + dbProducts.length;
  const isEmpty = !isLoading && !isError && !primary && dbProducts.length === 0;

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 space-y-8">
        {/* Header */}
        <header className="space-y-3">
          <p className="text-eyebrow">Search</p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search"}
            </h1>
            {totalResults > 0 && (
              <Badge
                variant="secondary"
                className="rounded-full text-xs font-medium"
              >
                {totalResults} {totalResults === 1 ? "result" : "results"}
              </Badge>
            )}
          </div>
          {meta && (
            <div className="pt-1">
              <ErrorBoundary label="Scraper meta">
                <ScraperMetaBar meta={meta} />
              </ErrorBoundary>
            </div>
          )}
        </header>

        {/* Empty pre-search */}
        {!query && !isLoading && (
          <EmptyState
            icon={SearchX}
            title="Enter a search term"
            description="Use the search bar above to find products across our network."
          />
        )}

        {/* Error */}
        {isError && (
          <ErrorAlert
            message={(error as Error)?.message || "Failed to process search."}
          />
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-8">
            <Skeleton className="h-72 rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Genuinely no results — distinct from "no query" */}
        {query && isEmpty && !isError && (
          <EmptyState
            icon={SearchX}
            title="No matches found"
            description={
              isScraping
                ? "Live scrape returned no items. Try a different term."
                : "Try different keywords or check the catalog directly."
            }
            action={
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/products">Browse all products</Link>
              </Button>
            }
          />
        )}

        {/* Primary cross-store comparison — the focal point */}
        {!isLoading && primary && (
          <ErrorBoundary label="Primary comparison">
            <section className="space-y-4">
              <div>
                <p className="text-eyebrow">
                  {primary.has_comparison
                    ? "Top match · cross-store comparison"
                    : "Top match"}
                </p>
              </div>
              <PrimaryProductCard primary={primary} />
            </section>
          </ErrorBoundary>
        )}

        {/* More listings — only when there are genuinely extra items beyond the primary */}
        {!isLoading &&
          primary &&
          storeResults.length > primary.comparisons.length && (
            <ErrorBoundary label="Other listings">
              <details className="rounded-2xl border border-border bg-card shadow-soft group">
                <summary className="cursor-pointer select-none list-none px-5 py-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      More listings from this scrape
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Top item per store ({storeResults.length} listings)
                    </p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-open:hidden">
                    Show
                  </span>
                  <span className="text-xs font-medium text-muted-foreground hidden group-open:inline">
                    Hide
                  </span>
                </summary>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5 border-t border-border/60">
                  {storeResults.map((item, i) => (
                    <StoreCard key={`${item.store_name}-${i}`} item={item} />
                  ))}
                </div>
              </details>
            </ErrorBoundary>
          )}

        {/* DB cache matches */}
        {!isLoading && dbProducts.length > 0 && (
          <ErrorBoundary label="Saved comparisons">
            <section className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-eyebrow">From our catalog</p>
                  <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mt-1">
                    {dbProducts.length} matching{" "}
                    {dbProducts.length === 1 ? "product" : "products"}
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {dbProducts
                  .filter((p) => (p.price_sources?.length || 0) > 0)
                  .map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
              </div>
            </section>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center bg-background">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
            <span className="text-sm font-medium">Loading…</span>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
