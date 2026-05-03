"use client";

import { useAllProducts } from "@/services/hooks";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { ProductGrid } from "@/features/products/components/ProductGrid";

export default function ProductsPage() {
  const { data: products = [], isLoading, isError, error } = useAllProducts(40);

  return (
    <div className="flex flex-col grow bg-background py-12 px-6 md:px-12">
      <div className="max-w-[100rem] mx-auto space-y-12 w-full">
        <div className="flex flex-col space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Global Catalog
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            Browse our entire aggregations network and compare the best prices
            available natively.
          </p>
        </div>

        {isError ? (
          <ErrorAlert
            message={(error as Error)?.message || "Network sync failed."}
          />
        ) : (
          <ProductGrid products={products} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
