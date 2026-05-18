"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useZameenSearch, useZameenCities } from "@/services/hooks";
import { ZameenProperty } from "@/services/types";
import { ZameenSearchParams } from "@/services/api";
import {
  Search, ChevronRight, ChevronLeft, SlidersHorizontal, X, Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/features/zameen/components/PropertyCard";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";

const PROPERTY_TYPES = [
  "Flat", "House", "Upper Portion", "Lower Portion", "Plot", "Commercial Plot",
  "Shop", "Office", "Penthouse", "Farmhouse", "Building", "Warehouse",
];
const PURPOSES = ["For Sale", "For Rent"];

const inputCls =
  "w-full bg-background border border-input text-foreground text-sm rounded-xl px-3 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all";
const selectCls = inputCls + " appearance-none cursor-pointer";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-eyebrow mb-1.5 block">{children}</label>;
}

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

const EMPTY_FILTERS: FilterState = {
  q: "", city: "", property_type: "", purpose: "",
  min_price: "", max_price: "", bedrooms: "", baths: "",
};

function FilterPanel({
  filters, setFilters, cities, onSearch, onReset,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  cities: string[];
  onSearch: () => void;
  onReset: () => void;
}) {
  const set = (key: keyof FilterState, val: string) => setFilters({ ...filters, [key]: val });

  return (
    <aside className="bg-card border border-border rounded-2xl p-6 space-y-5 lg:sticky lg:top-20 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-success" /> Filters
        </h2>
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
        >
          <X className="w-3 h-3" /> Reset
        </button>
      </div>

      <div>
        <FieldLabel>Search</FieldLabel>
        <input
          id="zameen-search-q"
          className={inputCls}
          placeholder="Islamabad, Lahore, DHA…"
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>

      <div>
        <FieldLabel>City</FieldLabel>
        <select
          id="zameen-search-city"
          className={selectCls}
          value={filters.city}
          onChange={(e) => set("city", e.target.value)}
        >
          <option value="">All cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <FieldLabel>Property type</FieldLabel>
        <select
          id="zameen-search-type"
          className={selectCls}
          value={filters.property_type}
          onChange={(e) => set("property_type", e.target.value)}
        >
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <FieldLabel>Purpose</FieldLabel>
        <select
          id="zameen-search-purpose"
          className={selectCls}
          value={filters.purpose}
          onChange={(e) => set("purpose", e.target.value)}
        >
          <option value="">All</option>
          {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div>
        <FieldLabel>Price range (PKR)</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
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

      <div className="grid grid-cols-2 gap-2">
        <div>
          <FieldLabel>Beds</FieldLabel>
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
        <div>
          <FieldLabel>Baths</FieldLabel>
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

      <Button id="zameen-search-submit" onClick={onSearch} className="w-full rounded-xl gap-2">
        <Search className="w-4 h-4" aria-hidden /> Search properties
      </Button>
    </aside>
  );
}

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

  const { data: result, isLoading, isError, error } = useZameenSearch({ ...activeParams, page });
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

    const urlParams = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) urlParams.set(k, v); });
    router.replace(`/zameen/search?${urlParams.toString()}`);
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setActiveParams({ page: 1, limit: 20 });
    setPage(1);
    router.replace("/zameen/search");
  };

  // On initial load, run search if URL has params. Schedule the synchronous
  // setState chain via queueMicrotask to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    const hasParams = Object.values(filters).some(Boolean);
    if (hasParams) queueMicrotask(handleSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card px-6 md:px-8 py-10">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-eyebrow">Zameen.pk</p>
          <div className="flex items-end justify-between gap-3 mt-2 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Property search</h1>
            <Badge variant="secondary" className="rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
              168,446 listings
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-3 max-w-2xl">
            Search across the largest property dataset in Pakistan — filter by city,
            type, price, and bedroom count.
          </p>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-72 shrink-0">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            cities={cities}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        <div className="flex-1 space-y-5">
          {/* Stats bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap text-sm">
              {pagination ? (
                <span className="text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    {pagination.total.toLocaleString()}
                  </span>{" "}
                  propert{pagination.total === 1 ? "y" : "ies"} found
                </span>
              ) : isLoading ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching…
                </span>
              ) : null}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                </Badge>
              )}
            </div>
            {pagination && pagination.pages > 1 && (
              <span className="text-xs text-muted-foreground">
                Page {page} of {pagination.pages}
              </span>
            )}
          </div>

          {isError && <ErrorAlert message={(error as Error)?.message || "Search failed."} />}

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          )}

          {!isLoading && !isError && properties.length === 0 && (
            <EmptyState
              icon={Search}
              title="No properties found"
              description={
                activeFiltersCount > 0
                  ? "Try adjusting your filters."
                  : "Use the filters to begin searching."
              }
              action={
                activeFiltersCount > 0 ? (
                  <Button variant="outline" className="rounded-xl" onClick={handleReset}>
                    Reset filters
                  </Button>
                ) : undefined
              }
            />
          )}

          {!isLoading && properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {properties.map((prop) => (
                <PropertyCard key={prop._id} prop={prop} />
              ))}
            </div>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                id="zameen-prev-page"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl gap-1"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden /> Previous
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                {page} / {pagination.pages}
              </span>
              <Button
                id="zameen-next-page"
                variant="outline"
                size="sm"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                className="rounded-xl gap-1"
              >
                Next <ChevronRight className="w-4 h-4" aria-hidden />
              </Button>
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
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
            <span className="text-sm font-medium">Loading…</span>
          </div>
        </div>
      }
    >
      <ZameenSearchContent />
    </Suspense>
  );
}
