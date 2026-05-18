"use client";

import { useZameenCategories } from "@/services/hooks";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home, Building2, Maximize2, ArrowRight, Search, Tag,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";
import { PropertyCard } from "@/features/zameen/components/PropertyCard";
import { cn } from "@/lib/utils";

// Icon-only style map for category section headers (PropertyCard handles its own styling)
type TypeStyle = { icon: React.ReactNode };
const TYPE_STYLES: Record<string, TypeStyle> = {
  Flat:             { icon: <Building2 className="w-4 h-4" /> },
  House:            { icon: <Home className="w-4 h-4" /> },
  "Upper Portion":  { icon: <Home className="w-4 h-4" /> },
  "Lower Portion":  { icon: <Home className="w-4 h-4" /> },
  Plot:             { icon: <Maximize2 className="w-4 h-4" /> },
  "Commercial Plot":{ icon: <Building2 className="w-4 h-4" /> },
  Shop:             { icon: <Tag className="w-4 h-4" /> },
  Office:           { icon: <Building2 className="w-4 h-4" /> },
  Penthouse:        { icon: <Building2 className="w-4 h-4" /> },
  Farmhouse:        { icon: <Home className="w-4 h-4" /> },
};
const DEFAULT_STYLE: TypeStyle = { icon: <Building2 className="w-4 h-4" /> };

// ─── Main page ───────────────────────────────────────────────────────────────
export default function ZameenPage() {
  const { data: categories, isLoading, isError, error } = useZameenCategories();
  const typeKeys = categories ? Object.keys(categories) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.10),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <Badge
            variant="secondary"
            className="rounded-full text-xs font-medium bg-success/10 text-success border border-success/20"
          >
            Zameen.pk · 168,446 listings
          </Badge>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Pakistan real estate <span className="text-success">explorer</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Browse property listings across Pakistan by type — houses, flats, plots, commercial
            spaces and more. Filter by city, purpose, price, and bedroom count.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-xl gap-2">
              <Link href="/zameen/search">
                <Search className="w-4 h-4" aria-hidden /> Search properties
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl gap-2">
              <a href="#categories">
                Browse categories
                <ArrowRight className="w-4 h-4" aria-hidden />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20 space-y-16"
      >
        {isError && <ErrorAlert message={(error as Error)?.message || "Failed to load Zameen data."} />}

        {isLoading && (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-5">
                <Skeleton className="h-8 w-44 rounded-md" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-64 rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && typeKeys.length === 0 && (
          <EmptyState
            icon={Home}
            title="No property types yet"
            description="Run the Zameen seeder to populate this view."
          />
        )}

        {!isLoading && !isError && typeKeys.map((type) => {
          const style = TYPE_STYLES[type] ?? DEFAULT_STYLE;
          return (
            <section key={type} className="space-y-5">
              <div className="flex items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={cn("p-2 rounded-xl bg-muted text-muted-foreground")}>
                    {style.icon}
                  </span>
                  <div>
                    <p className="text-eyebrow">Property type</p>
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">
                      {type}
                    </h2>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-xs font-medium">
                    {categories?.[type].length} sample{categories?.[type].length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <Link
                  href={`/zameen/search?property_type=${encodeURIComponent(type)}`}
                  className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-success hover:underline shrink-0"
                >
                  View all {type}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categories?.[type].map((prop) => (
                  <PropertyCard key={prop._id} prop={prop} />
                ))}
              </div>

              <div className="md:hidden">
                <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link href={`/zameen/search?property_type=${encodeURIComponent(type)}`}>
                    View all {type}
                  </Link>
                </Button>
              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}
