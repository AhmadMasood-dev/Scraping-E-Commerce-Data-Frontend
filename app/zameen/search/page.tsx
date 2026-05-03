"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useZameenSearch, useZameenCities } from "@/services/hooks";
import { ZameenProperty } from "@/services/types";
import { ZameenSearchParams } from "@/services/api";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const PROPERTY_TYPES = [
  "Flat",
  "House",
  "Upper Portion",
  "Lower Portion",
  "Plot",
  "Commercial Plot",
  "Shop",
  "Office",
  "Penthouse",
  "Farmhouse",
  "Building",
  "Warehouse",
];

const PURPOSES = ["For Sale", "For Rent"];

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ prop }: { prop: ZameenProperty }) {
  return (
    <div className="flex flex-col border border-border rounded-2xl overflow-hidden bg-card hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group">
      <div className="bg-muted px-4 py-3 flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {prop.property_type}
        </span>
        <Badge
          className={`text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0 border ${prop.purpose === "For Sale" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-blue-100 text-blue-800 border-blue-200"}`}
        >
          {prop.purpose}
        </Badge>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
            {[prop.location, prop.city].filter(Boolean).join(", ")}
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs font-medium">
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

        {prop.agency && (
          <p className="text-[11px] text-muted-foreground truncate">
            Agency: {prop.agency}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Price (PKR)
          </p>
          <p className="text-xl font-black text-foreground tracking-tight mt-0.5">
            {prop.price ? `Rs. ${prop.price.toLocaleString()}` : "N/A"}
          </p>
        </div>

        {prop.page_url && (
          <a
            href={prop.page_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
          >
            View on Zameen.com <ChevronRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
interface FilterState {
  q: string;
  city: string;
  property_type: string;
  purpose: string;
  min_price: string;
  max_price: string;
  bedrooms: string;
  baths: string;
}

function FilterPanel({
  filters,
  setFilters,
  cities,
  onSearch,
  onReset,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  cities: string[];
  onSearch: () => void;
  onReset: () => void;
}) {
  const set = (key: keyof FilterState, val: string) =>
    setFilters({ ...filters, [key]: val });

  const inputCls =
    "w-full bg-background border border-input text-foreground text-sm rounded-xl px-3 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";
  const selectCls =
    "w-full bg-background border border-input text-foreground text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary transition-colors";
  const label =
    "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block";

  return (
    <aside className="bg-card border border-border rounded-2xl p-6 space-y-5 sticky top-24 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
        </h2>
        <button
          onClick={onReset}
          className="text-[11px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Free text */}
      <div>
        <label className={label}>Search</label>
        <input
          id="zameen-search-q"
          className={inputCls}
          placeholder="Islamabad, Lahore, DHA..."
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>

      {/* City */}
      <div>
        <label className={label}>City</label>
        <select
          id="zameen-search-city"
          className={selectCls}
          value={filters.city}
          onChange={(e) => set("city", e.target.value)}
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className={label}>Property Type</label>
        <select
          id="zameen-search-type"
          className={selectCls}
          value={filters.property_type}
          onChange={(e) => set("property_type", e.target.value)}
        >
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Purpose */}
      <div>
        <label className={label}>Purpose</label>
        <select
          id="zameen-search-purpose"
          className={selectCls}
          value={filters.purpose}
          onChange={(e) => set("purpose", e.target.value)}
        >
          <option value="">All</option>
          {PURPOSES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className={label}>Price Range (PKR)</label>
        <div className="flex gap-2">
          <input
            id="zameen-search-min-price"
            className={inputCls}
            placeholder="Min"
            type="number"
            value={filters.min_price}
            onChange={(e) => set("min_price", e.target.value)}
          />
          <input
            id="zameen-search-max-price"
            className={inputCls}
            placeholder="Max"
            type="number"
            value={filters.max_price}
            onChange={(e) => set("max_price", e.target.value)}
          />
        </div>
      </div>

      {/* Bedrooms & Baths */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={label}>Beds</label>
          <input
            id="zameen-search-beds"
            className={inputCls}
            placeholder="Any"
            type="number"
            min="0"
            value={filters.bedrooms}
            onChange={(e) => set("bedrooms", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className={label}>Baths</label>
          <input
            id="zameen-search-baths"
            className={inputCls}
            placeholder="Any"
            type="number"
            min="0"
            value={filters.baths}
            onChange={(e) => set("baths", e.target.value)}
          />
        </div>
      </div>

      <button
        id="zameen-search-submit"
        onClick={onSearch}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
      >
        <Search className="w-4 h-4" /> Search Properties
      </button>
    </aside>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────
const EMPTY_FILTERS: FilterState = {
  q: "",
  city: "",
  property_type: "",
  purpose: "",
  min_price: "",
  max_price: "",
  bedrooms: "",
  baths: "",
};

function ZameenSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    q: searchParams.get("q") || "",
    city: searchParams.get("city") || "",
    property_type: searchParams.get("property_type") || "",
    purpose: searchParams.get("purpose") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    baths: searchParams.get("baths") || "",
  });

  const [activeParams, setActiveParams] = useState<ZameenSearchParams>({
    q: filters.q || undefined,
    city: filters.city || undefined,
    property_type: filters.property_type || undefined,
    purpose: filters.purpose || undefined,
    min_price: filters.min_price ? Number(filters.min_price) : undefined,
    max_price: filters.max_price ? Number(filters.max_price) : undefined,
    bedrooms: filters.bedrooms ? Number(filters.bedrooms) : undefined,
    baths: filters.baths ? Number(filters.baths) : undefined,
    page: 1,
    limit: 20,
  });

  const [page, setPage] = useState(1);

  const { data: citiesData } = useZameenCities();
  const cities = citiesData ?? [];

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useZameenSearch({ ...activeParams, page });

  const properties: ZameenProperty[] = result?.data ?? [];
  const pagination = result?.pagination;

  const handleSearch = () => {
    const params: ZameenSearchParams = {
      q: filters.q || undefined,
      city: filters.city || undefined,
      property_type: filters.property_type || undefined,
      purpose: filters.purpose || undefined,
      min_price: filters.min_price ? Number(filters.min_price) : undefined,
      max_price: filters.max_price ? Number(filters.max_price) : undefined,
      bedrooms: filters.bedrooms ? Number(filters.bedrooms) : undefined,
      baths: filters.baths ? Number(filters.baths) : undefined,
      page: 1,
      limit: 20,
    };
    setActiveParams(params);
    setPage(1);

    // Sync URL
    const urlParams = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) urlParams.set(k, v);
    });
    router.replace(`/zameen/search?${urlParams.toString()}`);
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setActiveParams({ page: 1, limit: 20 });
    setPage(1);
    router.replace("/zameen/search");
  };

  // On initial load, run search if URL has params
  useEffect(() => {
    const hasParams = Object.values(filters).some(Boolean);
    if (hasParams) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card px-6 md:px-12 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              Property Search
            </h1>
            <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
              Zameen.pk
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            Search across{" "}
            <span className="text-foreground font-bold">168,446</span> listings
            from Pakistan&apos;s largest real estate platform.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="lg:w-72 shrink-0">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            cities={cities}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        {/* Results */}
        <div className="flex-1 space-y-6">
          {/* Stats bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {pagination && (
                <span className="text-sm text-muted-foreground font-medium">
                  <span className="text-foreground font-bold">
                    {pagination.total.toLocaleString()}
                  </span>{" "}
                  properties found
                </span>
              )}
              {activeFiltersCount > 0 && (
                <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                  active
                </Badge>
              )}
            </div>
            {pagination && pagination.pages > 1 && (
              <span className="text-xs text-muted-foreground">
                Page {page} of {pagination.pages}
              </span>
            )}
          </div>

          {/* Error */}
          {isError && (
            <div className="border border-destructive/30 bg-destructive/10 rounded-2xl p-8 text-destructive text-center">
              <p className="font-bold">Search failed</p>
              <p className="text-sm mt-1">{(error as Error)?.message}</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && properties.length === 0 && (
            <div className="border border-dashed border-border rounded-2xl py-24 text-center space-y-3">
              <Search className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-xl font-black text-muted-foreground uppercase tracking-widest">
                No properties found
              </p>
              <p className="text-sm text-muted-foreground">
                {activeFiltersCount > 0
                  ? "Try adjusting your filters."
                  : "Use the filters to search for properties."}
              </p>
            </div>
          )}

          {/* Grid */}
          {!isLoading && properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {properties.map((prop) => (
                <PropertyCard key={prop._id} prop={prop} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                id="zameen-prev-page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:border-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-sm text-muted-foreground">
                {page} / {pagination.pages}
              </span>
              <button
                id="zameen-next-page"
                disabled={page >= pagination.pages}
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:border-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ZameenSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-foreground font-black text-2xl animate-pulse uppercase tracking-widest">
            Loading…
          </p>
        </div>
      }
    >
      <ZameenSearchContent />
    </Suspense>
  );
}
