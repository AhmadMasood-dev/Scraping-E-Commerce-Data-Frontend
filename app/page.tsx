"use client";

import { useLandingData } from "@/services/hooks";
import { HeroSection } from "@/features/home/components/HeroSection";
import { CategoryCarousel } from "@/features/home/components/CategoryCarousel";
import { CategoryCarouselSkeleton } from "@/features/home/components/CategoryCarouselSkeleton";
import { Footer } from "@/components/shared/Footer";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

export default function LandingPage() {
  const { data: categoriesData, isLoading, isError, error } = useLandingData();

  const categoryKeys = categoriesData ? Object.keys(categoriesData) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-col grow">
        <HeroSection />

        <div className="w-full py-20 px-6 md:px-16 space-y-24">
          {isError && (
            <ErrorAlert
              message={(error as Error)?.message || "Network Error"}
            />
          )}

          {isLoading ? (
            <CategoryCarouselSkeleton />
          ) : categoryKeys.length === 0 && !isError ? (
            <div className="text-center text-muted-foreground py-24 border border-dashed rounded-xl max-w-3xl mx-auto">
              <p className="text-xl font-medium tracking-tight">
                Catalog Initialization Pending
              </p>
              <p className="mt-2 text-sm">
                Please stand by while the system aggregates inventory mapping.
              </p>
            </div>
          ) : (
            categoryKeys.map((category) => (
              <CategoryCarousel
                key={category}
                category={category}
                products={categoriesData?.[category] || []}
              />
            ))
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}
