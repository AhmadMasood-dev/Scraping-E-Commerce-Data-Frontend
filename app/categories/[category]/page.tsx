"use client";

import Link from "next/link";
import { use } from "react";
import { useCategoryProducts } from "@/services/hooks";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const { data: products = [], isLoading, isError, error } = useCategoryProducts(category, 40);

  return (
    <div className="flex flex-col grow bg-background py-12 px-6 md:px-8">
      <div className="max-w-[1440px] mx-auto space-y-8 w-full">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        <header className="space-y-3">
          <p className="text-eyebrow">Category</p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground capitalize">
              {category}
            </h1>
            {!isLoading && !isError && products.length > 0 && (
              <Badge variant="secondary" className="rounded-full text-xs font-medium">
                {products.length} {products.length === 1 ? "product" : "products"}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Aggregated {category.toLowerCase()} listings from Pakistan&apos;s top retailers.
          </p>
        </header>

        {isError ? (
          <ErrorAlert message={(error as Error)?.message || "Failed to load category."} />
        ) : !isLoading && products.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title={`No ${category.toLowerCase()} yet`}
            description="This category is empty for now. Try a search or browse the full catalog."
          />
        ) : (
          <ProductGrid products={products} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
