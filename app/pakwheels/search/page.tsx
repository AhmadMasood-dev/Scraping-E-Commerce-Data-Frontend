"use client";

import { Suspense } from "react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { usePakWheelsSearch, usePakWheelsMakes, usePakWheelsBodyTypes, usePakWheelsCities } from "@/services/hooks";
import { VehicleCard } from "@/features/pakwheels/components/VehicleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, ChevronLeft, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "CNG"];
const TRANSMISSIONS = ["Manual", "Automatic"];
const CONDITIONS = ["New", "Used"] as const;
const SORTS = [
  { value: "newest",     label: "Newest" },
  { value: "price_asc",  label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "year_desc",  label: "Year: newest first" },
];

// Unified input/select chrome — matches the rest of the form system
const inputCls =
  "w-full bg-background border border-input text-foreground text-sm rounded-xl px-3 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all";
const selectCls = inputCls + " appearance-none cursor-pointer";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-eyebrow mb-1.5 block">{children}</label>;
}

function PakWheelsSearchContent() {
  const [filters, setFilters] = useQueryStates({
    q:            parseAsString.withDefault(""),
    make:         parseAsString.withDefault(""),
    model:        parseAsString.withDefault(""),
    city:         parseAsString.withDefault(""),
    fuel_type:    parseAsString.withDefault(""),
    transmission: parseAsString.withDefault(""),
    condition:    parseAsString.withDefault(""),
    body_type:    parseAsString.withDefault(""),
    assembly:     parseAsString.withDefault(""),
    min_year:     parseAsInteger,
    max_year:     parseAsInteger,
    min_price:    parseAsInteger,
    max_price:    parseAsInteger,
    sort:         parseAsString.withDefault("newest"),
    page:         parseAsInteger.withDefault(1),
  });

  const { data: makesData } = usePakWheelsMakes();
  const makes = makesData ?? [];
  const { data: bodyTypesData } = usePakWheelsBodyTypes();
  const bodyTypes = bodyTypesData ?? [];
  const { data: citiesData } = usePakWheelsCities();
  const cities = citiesData ?? [];

  const params = {
    q: filters.q || undefined,
    make: filters.make || undefined,
    model: filters.model || undefined,
    city: filters.city || undefined,
    fuel_type: filters.fuel_type || undefined,
    transmission: filters.transmission || undefined,
    condition: (filters.condition || undefined) as "New" | "Used" | undefined,
    body_type: filters.body_type || undefined,
    assembly: filters.assembly || undefined,
    min_year: filters.min_year ?? undefined,
    max_year: filters.max_year ?? undefined,
    min_price: filters.min_price ?? undefined,
    max_price: filters.max_price ?? undefined,
    sort: (filters.sort as "newest" | "price_asc" | "price_desc" | "year_desc") || "newest",
    page: filters.page,
    limit: 20,
  };

  const { data, isLoading, isError, error } = usePakWheelsSearch(params);
  const vehicles = data?.data ?? [];
  const pagination = data?.pagination;

  const reset = () =>
    setFilters({
      q: "", make: "", model: "", city: "", fuel_type: "", transmission: "", condition: "",
      body_type: "", assembly: "",
      min_year: null, max_year: null, min_price: null, max_price: null, sort: "newest", page: 1,
    });

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => k !== "page" && k !== "sort" && v !== "" && v !== null && v !== undefined
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card px-6 md:px-8 py-10">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-eyebrow">PakWheels</p>
          <div className="flex items-end justify-between gap-3 mt-2 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Vehicle search</h1>
            <Badge variant="secondary" className="rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
              Browse new &amp; used vehicles
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col lg:flex-row gap-8">
        {/* Filter sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5 lg:sticky lg:top-20 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-orange-600" /> Filters
              </h2>
              <button
                onClick={reset}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" /> Reset
              </button>
            </div>

            <div>
              <FieldLabel>Search</FieldLabel>
              <input
                className={inputCls}
                placeholder="Toyota, Civic, GLi…"
                value={filters.q}
                onChange={(e) => setFilters({ q: e.target.value, page: 1 })}
              />
            </div>
            <div>
              <FieldLabel>Make</FieldLabel>
              <select
                className={selectCls}
                value={filters.make}
                onChange={(e) => setFilters({ make: e.target.value, page: 1 })}
              >
                <option value="">All makes</option>
                {makes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Body type</FieldLabel>
              <select
                className={selectCls}
                value={filters.body_type}
                onChange={(e) => setFilters({ body_type: e.target.value, page: 1 })}
              >
                <option value="">All body types</option>
                {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Model</FieldLabel>
              <input
                className={inputCls}
                placeholder="Corolla, Civic…"
                value={filters.model}
                onChange={(e) => setFilters({ model: e.target.value, page: 1 })}
              />
            </div>
            <div>
              <FieldLabel>City</FieldLabel>
              <select
                className={selectCls}
                value={filters.city}
                onChange={(e) => setFilters({ city: e.target.value, page: 1 })}
              >
                <option value="">All cities</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>Fuel</FieldLabel>
                <select
                  className={selectCls}
                  value={filters.fuel_type}
                  onChange={(e) => setFilters({ fuel_type: e.target.value, page: 1 })}
                >
                  <option value="">Any</option>
                  {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Transmission</FieldLabel>
                <select
                  className={selectCls}
                  value={filters.transmission}
                  onChange={(e) => setFilters({ transmission: e.target.value, page: 1 })}
                >
                  <option value="">Any</option>
                  {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>Condition</FieldLabel>
                <select
                  className={selectCls}
                  value={filters.condition}
                  onChange={(e) => setFilters({ condition: e.target.value, page: 1 })}
                >
                  <option value="">Any</option>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Assembly</FieldLabel>
                <select
                  className={selectCls}
                  value={filters.assembly}
                  onChange={(e) => setFilters({ assembly: e.target.value, page: 1 })}
                >
                  <option value="">Any</option>
                  <option value="Local">Local</option>
                  <option value="Imported">Imported</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>Min year</FieldLabel>
                <input
                  className={inputCls}
                  type="number"
                  value={filters.min_year ?? ""}
                  onChange={(e) =>
                    setFilters({ min_year: e.target.value ? Number(e.target.value) : null, page: 1 })
                  }
                />
              </div>
              <div>
                <FieldLabel>Max year</FieldLabel>
                <input
                  className={inputCls}
                  type="number"
                  value={filters.max_year ?? ""}
                  onChange={(e) =>
                    setFilters({ max_year: e.target.value ? Number(e.target.value) : null, page: 1 })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>Min price</FieldLabel>
                <input
                  className={inputCls}
                  type="number"
                  value={filters.min_price ?? ""}
                  onChange={(e) =>
                    setFilters({ min_price: e.target.value ? Number(e.target.value) : null, page: 1 })
                  }
                />
              </div>
              <div>
                <FieldLabel>Max price</FieldLabel>
                <input
                  className={inputCls}
                  type="number"
                  value={filters.max_price ?? ""}
                  onChange={(e) =>
                    setFilters({ max_price: e.target.value ? Number(e.target.value) : null, page: 1 })
                  }
                />
              </div>
            </div>
            <div>
              <FieldLabel>Sort by</FieldLabel>
              <select
                className={selectCls}
                value={filters.sort}
                onChange={(e) => setFilters({ sort: e.target.value, page: 1 })}
              >
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap text-sm">
              {pagination ? (
                <span className="text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    {pagination.total.toLocaleString()}
                  </span>{" "}
                  vehicle{pagination.total === 1 ? "" : "s"} found
                </span>
              ) : isLoading ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Searching…
                </span>
              ) : null}
              {activeCount > 0 && (
                <Badge variant="secondary" className="rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                  {activeCount} filter{activeCount > 1 ? "s" : ""} active
                </Badge>
              )}
            </div>
            {pagination && pagination.pages > 1 && (
              <span className="text-xs text-muted-foreground">
                Page {filters.page} of {pagination.pages}
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

          {!isLoading && !isError && vehicles.length === 0 && (
            <EmptyState
              icon={Search}
              title="No vehicles found"
              description={
                activeCount > 0
                  ? "Try adjusting your filters."
                  : "Use the filters or a search term to begin."
              }
              action={
                activeCount > 0 ? (
                  <Button variant="outline" className="rounded-xl" onClick={reset}>
                    Reset filters
                  </Button>
                ) : undefined
              }
            />
          )}

          {!isLoading && vehicles.length > 0 && (
            <ErrorBoundary label="Vehicle grid">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {vehicles.map((v) => (
                  <VehicleCard key={v._id} v={v} />
                ))}
              </div>
            </ErrorBoundary>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page <= 1}
                onClick={() => setFilters({ page: Math.max(1, filters.page - 1) })}
                className="rounded-xl gap-1"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden /> Previous
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                {filters.page} / {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page >= pagination.pages}
                onClick={() => setFilters({ page: Math.min(pagination.pages, filters.page + 1) })}
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

export default function PakWheelsSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
            <span className="text-sm font-medium">Loading…</span>
          </div>
        </div>
      }
    >
      <PakWheelsSearchContent />
    </Suspense>
  );
}
