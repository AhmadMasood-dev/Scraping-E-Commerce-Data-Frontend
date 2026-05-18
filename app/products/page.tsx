"use client";

import { useAllProducts } from "@/services/hooks";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { PackageSearch } from "lucide-react";

export default function ProductsPage() {
  const { data: products = [], isLoading, isError, error } = useAllProducts(40);

  return (
    <div className="flex flex-col grow bg-background py-12 px-6 md:px-8">
      <div className="max-w-[1440px] mx-auto space-y-8 w-full">
        <header className="space-y-3">
          <p className="text-eyebrow">Catalog</p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Browse all products
            </h1>
            {!isLoading && !isError && products.length > 0 && (
              <Badge variant="secondary" className="rounded-full text-xs font-medium">
                {products.length} {products.length === 1 ? "result" : "results"}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Compare prices across our entire aggregated network. Click any product to see
            cross-store comparisons and price history.
          </p>
        </header>

        {isError ? (
          <ErrorAlert message={(error as Error)?.message || "Failed to load catalog."} />
        ) : !isLoading && products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No products yet"
            description="The catalog is empty. Once stores are scraped or seeded, products will appear here."
          />
        ) : (
          <ProductGrid products={products} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
