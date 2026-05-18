"use client";

import { useLandingData } from "@/services/hooks";
import { HeroSection } from "@/features/home/components/HeroSection";
import { CategoryCarousel } from "@/features/home/components/CategoryCarousel";
import { CategoryCarouselSkeleton } from "@/features/home/components/CategoryCarouselSkeleton";
import { Footer } from "@/components/shared/Footer";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { EmptyState } from "@/components/shared/EmptyState";
import { Boxes } from "lucide-react";

export default function LandingPage() {
  const { data: categoriesData, isLoading, isError, error } = useLandingData();
  const categoryKeys = categoriesData ? Object.keys(categoriesData) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-col grow">
        <HeroSection />

        <div className="w-full px-6 md:px-8 py-16 md:py-20 space-y-16 md:space-y-20">
          {isError && <ErrorAlert message={(error as Error)?.message || "Network Error"} />}

          {isLoading ? (
            <CategoryCarouselSkeleton />
          ) : categoryKeys.length === 0 && !isError ? (
            <EmptyState
              icon={Boxes}
              title="Catalog is initializing"
              description="The product catalog is being aggregated. Check back in a few minutes."
            />
          ) : (
            categoryKeys.filter((gen)=>gen!== 'General').map((category) => (
              <ErrorBoundary key={category} label={category}>
                <CategoryCarousel
                  category={category}
                  products={categoriesData?.[category] || []}
                />
              </ErrorBoundary>
            ))
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}
