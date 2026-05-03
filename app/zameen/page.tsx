"use client";

import { useZameenCategories } from "@/services/hooks";
import { ZameenProperty } from "@/services/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ChevronRight,
  Search,
  Tag,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// ─── Property Type Icon Map ───────────────────────────────────────────────────
const TYPE_STYLES: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  Flat: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <Building2 className="w-4 h-4" />,
  },
  House: {
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    icon: <Home className="w-4 h-4" />,
  },
  "Upper Portion": {
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    icon: <Home className="w-4 h-4" />,
  },
  "Lower Portion": {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Home className="w-4 h-4" />,
  },
  Plot: {
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: <Maximize2 className="w-4 h-4" />,
  },
  "Commercial Plot": {
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: <Building2 className="w-4 h-4" />,
  },
  Shop: {
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    icon: <Tag className="w-4 h-4" />,
  },
  Office: {
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: <Building2 className="w-4 h-4" />,
  },
  Penthouse: {
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
    icon: <Building2 className="w-4 h-4" />,
  },
  Farmhouse: {
    color: "text-lime-700",
    bg: "bg-lime-50",
    border: "border-lime-200",
    icon: <Home className="w-4 h-4" />,
  },
};
const DEFAULT_STYLE = {
  color: "text-slate-700",
  bg: "bg-slate-100",
  border: "border-slate-200",
  icon: <Building2 className="w-4 h-4" />,
};

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ prop }: { prop: ZameenProperty }) {
  const style = TYPE_STYLES[prop.property_type ?? ""] ?? DEFAULT_STYLE;

  return (
    <div
      className={`flex flex-col border ${style.border} rounded-2xl overflow-hidden bg-card hover:-translate-y-1 hover:shadow-md transition-all duration-300 group`}
    >
      {/* Type badge header */}
      <div
        className={`${style.bg} px-4 py-3 flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <span className={style.color}>{style.icon}</span>
          <span
            className={`text-xs font-bold uppercase tracking-widest ${style.color}`}
          >
            {prop.property_type}
          </span>
        </div>
        <Badge
          className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${prop.purpose === "For Sale" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-blue-100 text-blue-800 border-blue-200"}`}
        >
          {prop.purpose}
        </Badge>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
            {[prop.location, prop.city, prop.province_name]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-muted-foreground text-xs font-medium">
          {prop.bedrooms != null && prop.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" /> {prop.bedrooms} Bed
            </span>
          )}
          {prop.baths != null && prop.baths > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" /> {prop.baths} Bath
            </span>
          )}
          {prop.area && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" /> {prop.area}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Price (PKR)
          </p>
          <p className="text-xl font-black text-foreground tracking-tight mt-0.5">
            {prop.price ? `Rs. ${prop.price.toLocaleString()}` : "N/A"}
          </p>
        </div>

        {/* CTA */}
        {prop.page_url && (
          <a
            href={prop.page_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${style.bg} ${style.color} border ${style.border} hover:brightness-95 transition-all`}
          >
            View on Zameen.com <ChevronRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ZameenPage() {
  const { data: categories, isLoading, isError, error } = useZameenCategories();
  const typeKeys = categories ? Object.keys(categories) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.14),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 flex flex-col items-start">
          <Badge className="mb-6 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-widest">
            Zameen.pk Dataset · 168,446 Listings
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none">
            Pakistan Real
            <br />
            Estate <span className="text-primary">Explorer</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Browse property listings across Pakistan by type — houses, flats,
            plots, commercial spaces and more. Filter by city, purpose, price
            and bedroom count.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/zameen/search">
              <Button className="rounded-2xl px-6 py-3 h-auto text-sm font-bold shadow-sm">
                <Search className="w-4 h-4" /> Search Properties
              </Button>
            </Link>
            <a
              href="#categories"
              className="flex items-center gap-2 border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground font-bold px-6 py-3 rounded-2xl text-sm transition-colors bg-background"
            >
              Browse Categories <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-20"
      >
        {isError && (
          <div className="border border-destructive/30 bg-destructive/10 rounded-2xl p-8 text-destructive text-center">
            <p className="font-bold text-lg">Failed to load Zameen data</p>
            <p className="text-sm mt-2">{(error as Error)?.message}</p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="h-10 w-48 rounded-xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-64 rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading &&
          !isError &&
          typeKeys.map((type) => {
            const style = TYPE_STYLES[type] ?? DEFAULT_STYLE;
            return (
              <section key={type} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-2 rounded-xl ${style.bg} ${style.color} border ${style.border}`}
                    >
                      {style.icon}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                      {type}
                    </h2>
                    <Badge className="bg-muted text-muted-foreground rounded-full text-xs">
                      {categories?.[type].length} sample
                      {categories?.[type].length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <Link
                    href={`/zameen/search?property_type=${encodeURIComponent(type)}`}
                    className={`hidden md:flex items-center gap-1.5 text-sm font-bold ${style.color} hover:underline transition-all`}
                  >
                    View all {type} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {categories?.[type].map((prop) => (
                    <PropertyCard key={prop._id} prop={prop} />
                  ))}
                </div>

                <div className="md:hidden">
                  <Link
                    href={`/zameen/search?property_type=${encodeURIComponent(type)}`}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl border ${style.border} ${style.color} font-bold text-sm ${style.bg}`}
                  >
                    View all {type} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            );
          })}
      </section>
    </div>
  );
}
