"use client";

import Link from "next/link";
import { usePakWheelsCategories } from "@/services/hooks";
import { VehicleCard } from "@/features/pakwheels/components/VehicleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Search, ArrowRight } from "lucide-react";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";

export default function PakWheelsLanding() {
  const { data: categories, isLoading, isError, error } = usePakWheelsCategories();
  const makes = categories ? Object.keys(categories) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.10),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <Badge
            variant="secondary"
            className="rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"
          >
            PakWheels marketplace
          </Badge>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Pakistan&apos;s <span className="text-orange-600">vehicle</span> marketplace
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Browse new and used cars across Pakistan. Filter by make, model, year, price,
            transmission and fuel type.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-xl bg-orange-600 hover:bg-orange-700 gap-2">
              <Link href="/pakwheels/search">
                <Search className="w-4 h-4" aria-hidden /> Search vehicles
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20 space-y-16">
        {isError && (
          <ErrorAlert
            message={(error as Error)?.message || "Failed to load PakWheels data."}
          />
        )}

        {isLoading && (
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-5">
                <Skeleton className="h-8 w-44 rounded-md" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-72 rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && makes.length === 0 && (
          <EmptyState
            icon={Car}
            title="No vehicle data yet"
            description="Seed the PakWheels collection to populate this view."
          />
        )}

        {makes.map((make) => (
          <ErrorBoundary key={make} label={make}>
            <section className="space-y-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-eyebrow">Make</p>
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">{make}</h2>
                </div>
                <Link
                  href={`/pakwheels/search?make=${encodeURIComponent(make)}`}
                  className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-orange-700 hover:underline shrink-0"
                >
                  View all {make}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categories?.[make].map((v) => (
                  <VehicleCard key={v._id} v={v} />
                ))}
              </div>
            </section>
          </ErrorBoundary>
        ))}
      </section>
    </div>
  );
}
