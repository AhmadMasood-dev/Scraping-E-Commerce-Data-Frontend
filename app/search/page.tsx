"use client";

import { useSearchParams } from "next/navigation";
import { useSearchProducts } from "@/services/hooks";
import { StoreResult } from "@/services/api";
import { Product } from "@/services/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Terminal, Star, ShoppingBag, ArrowRight } from "lucide-react";
import { Suspense } from "react";

// ─── Store Brand Config ────────────────────────────────────────────────────────
const STORE_CONFIG: Record<string, { color: string; bg: string; text: string }> = {
  Telemart:             { color: "border-green-600",   bg: "bg-green-600",   text: "text-white" },
  Daraz:                { color: "border-orange-500",  bg: "bg-orange-500",  text: "text-white" },
  PriceOye:             { color: "border-blue-600",    bg: "bg-blue-600",    text: "text-white" },
  Mega:                 { color: "border-purple-600",  bg: "bg-purple-600",  text: "text-white" },
  Imtiaz:               { color: "border-red-500",     bg: "bg-red-500",     text: "text-white" },
  "Punjab Cash & Carry":{ color: "border-teal-500",    bg: "bg-teal-500",    text: "text-white" },
  Metro:                { color: "border-amber-500",   bg: "bg-amber-500",   text: "text-white" },
};
const DEFAULT_STORE = { color: "border-neutral-600", bg: "bg-neutral-700", text: "text-white" };

// ─── Star Rating Component ─────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(0, rating));
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(clamped) ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`}
        />
      ))}
      <span className="text-xs font-bold text-muted-foreground ml-1">{clamped.toFixed(1)}</span>
    </div>
  );
}

// ─── Per-Store Card (from live scrape) ────────────────────────────────────────
function StoreCard({ item }: { item: StoreResult }) {
  const cfg = STORE_CONFIG[item.store_name] ?? DEFAULT_STORE;
  const img = item.image_url || `https://placehold.co/400x400/888888/ffffff?text=NO+IMAGE`;

  return (
    <Link href={`/products/${item._id}`} className="group block">
      <div className={`flex flex-col border-4 ${cfg.color} bg-card rounded-none overflow-hidden transition-all hover:-translate-y-1.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)]`}>
        {/* Store Header Bar */}
        <div className={`${cfg.bg} ${cfg.text} px-4 py-2.5 flex items-center justify-between`}>
          <span className="font-black uppercase tracking-widest text-xs">{item.store_name}</span>
          <ShoppingBag className="w-4 h-4 opacity-80" />
        </div>

        {/* Product Image */}
        <div className="h-52 bg-white p-5 flex items-center justify-center border-b-4 border-inherit overflow-hidden">
          <img
            src={img}
            alt={item.title}
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-4 space-y-3">
          {/* Product Name */}
          <h3 className="font-black text-foreground uppercase tracking-tight text-xs leading-relaxed line-clamp-3 flex-1">
            {item.title}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center justify-between">
            <StarRating rating={item.rating} />
            {item.reviews != null && (
              <span className="text-[10px] text-muted-foreground font-bold">
                {item.reviews.toLocaleString()} reviews
              </span>
            )}
          </div>

          {/* Price */}
          <div className="pt-2 border-t-2 border-dashed border-neutral-200 dark:border-neutral-700">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</p>
            <p className="text-2xl font-black text-foreground tracking-tighter mt-0.5">
              Rs. {item.price?.toLocaleString() ?? 'N/A'}
            </p>
          </div>

          {/* CTA — goes to internal product detail page */}
          <div className={`mt-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-foreground text-background font-black uppercase tracking-widest text-xs group-hover:opacity-80 transition-opacity`}>
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── DB Product Card (from MongoDB cache) ─────────────────────────────────────
function DbProductCard({ product }: { product: Product }) {
  const lowestSource = product.price_sources?.length > 0
    ? product.price_sources.reduce((min, s) => s.current_price < min.current_price ? s : min, product.price_sources[0])
    : null;
  const img = product.image_url || "https://via.placeholder.com/400?text=NO+IMAGE";
  const cfg = lowestSource ? (STORE_CONFIG[lowestSource.store_name] ?? DEFAULT_STORE) : DEFAULT_STORE;

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="flex flex-col border-4 border-foreground bg-card rounded-none overflow-hidden transition-all hover:-translate-y-1.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]">
        {/* Stores Count Header */}
        <div className="bg-foreground text-background px-4 py-2.5 flex items-center justify-between">
          <span className="font-black uppercase tracking-widest text-xs">
            {product.price_sources?.length ?? 0} store{product.price_sources?.length !== 1 ? "s" : ""} compared
          </span>
          <ShoppingBag className="w-4 h-4 opacity-80" />
        </div>

        <div className="h-52 bg-white p-5 flex items-center justify-center border-b-4 border-foreground overflow-hidden">
          <img src={img} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
        </div>

        <div className="flex flex-col flex-1 p-4 space-y-3">
          <h3 className="font-black text-foreground uppercase tracking-tight text-xs leading-relaxed line-clamp-3 flex-1">
            {product.title}
          </h3>
          {product.rating > 0 && <StarRating rating={product.rating} />}

          {lowestSource && (
            <div className="pt-2 border-t-2 border-dashed border-neutral-200 dark:border-neutral-700">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Best Price · {lowestSource.store_name}</p>
              <p className="text-2xl font-black text-foreground tracking-tighter mt-0.5">
                Rs. {lowestSource.current_price.toLocaleString()}
              </p>
            </div>
          )}

          <div className={`mt-auto flex items-center justify-center gap-2 py-2.5 px-4 ${cfg.bg} ${cfg.text} font-black uppercase tracking-widest text-xs`}>
            View Comparison →
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Search Content ────────────────────────────────────────────────────────────
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: response, isLoading, isError, error } = useSearchProducts(query);

  const dbProducts: Product[] = response?.data || [];
  const storeResults: StoreResult[] = response?.storeResults || [];
  const isScraping = response?.isScraping;
  const wasScraped = response?.wasScraped;

  const totalResults = storeResults.length > 0 ? storeResults.length : dbProducts.length;
  const isEmpty = !isLoading && !isError && storeResults.length === 0 && dbProducts.length === 0;

  return (
    <div className="w-full py-16 px-6 md:px-16 min-h-screen bg-background flex flex-col items-center">
      <div className="max-w-400 w-full space-y-10">

        {/* Header */}
        <header className="border-b-4 border-foreground pb-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Search Results</h1>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <p className="text-muted-foreground text-lg font-medium tracking-wide">
              QUERY: {query ? `"${query}"` : "NONE"}
            </p>
            {totalResults > 0 && (
              <Badge className="font-black uppercase rounded-none bg-foreground text-background">
                {totalResults} result{totalResults !== 1 ? "s" : ""}
              </Badge>
            )}
            {wasScraped && (
              <Badge className="font-black uppercase rounded-none bg-green-600 text-white">
                Live Scraped
              </Badge>
            )}
          </div>
        </header>

        {/* Alerts */}
        {wasScraped && storeResults.length > 0 && (
          <Alert className="border-4 border-green-600 bg-green-600/10 text-green-700 dark:text-green-400 rounded-none">
            <Terminal className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-black uppercase tracking-widest">Live Scrape Complete</AlertTitle>
            <AlertDescription className="font-bold tracking-wide mt-1">
              Showing real-time results from <strong>{storeResults.length}</strong> stores. Each card links directly to that store&apos;s listing.
            </AlertDescription>
          </Alert>
        )}

        {isScraping && (
          <Alert className="border-4 border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-none">
            <Terminal className="h-5 w-5 text-yellow-500" />
            <AlertTitle className="font-black uppercase tracking-widest">Background Retry Queued</AlertTitle>
            <AlertDescription className="font-bold tracking-wide mt-1">
              Live scrape returned no results. Please try again in a few moments.
            </AlertDescription>
          </Alert>
        )}

        {isError && (
          <div className="bg-red-600/10 border-4 border-red-600 p-8 text-red-600 font-bold uppercase tracking-widest">
            <h2 className="text-2xl mb-2">System Error</h2>
            <p>{(error as Error)?.message || "Failed to process search."}</p>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-107.5 rounded-none border-4 border-neutral-200 dark:border-neutral-700" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && (
          <div className="text-center py-24 border-4 border-dashed border-neutral-800">
            <p className="text-2xl font-black uppercase tracking-widest text-neutral-400">0 Entities Found</p>
            <p className="text-sm text-muted-foreground mt-3 font-medium">
              {isScraping ? "Scrapers are active — check back soon." : "Try a different search term."}
            </p>
          </div>
        )}

        {/* Live Scraped: one card per store */}
        {!isLoading && storeResults.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground border-b-2 border-dashed border-neutral-300 dark:border-neutral-700 pb-3">
              Live Store Results — {storeResults.length} platforms scraped
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {storeResults.map((item, i) => (
                <StoreCard key={`${item.store_name}-${i}`} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* DB Cached: one card per product (multi-source comparison) */}
        {!isLoading && dbProducts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground border-b-2 border-dashed border-neutral-300 dark:border-neutral-700 pb-3">
              Saved Comparisons — {dbProducts.length} product{dbProducts.length !== 1 ? "s" : ""} from database
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dbProducts.map((p) => (
                <DbProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
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
          <h1 className="text-4xl font-black tracking-widest uppercase animate-pulse">Initializing...</h1>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
