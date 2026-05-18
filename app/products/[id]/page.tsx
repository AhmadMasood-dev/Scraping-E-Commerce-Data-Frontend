"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { use } from "react";
import { useProduct, useCategoryProducts } from "@/services/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share, ArrowLeft, Star, Inbox } from "lucide-react";
import { SentimentPanel } from "@/components/shared/SentimentPanel";
import { PriceHistoryChart } from "@/components/shared/PriceHistoryChart";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ProductImage } from "@/components/shared/ProductImage";
import { ProductCard } from "@/components/shared/ProductCard";
import { PriceTag } from "@/components/shared/PriceTag";
import { StoreBadge } from "@/components/shared/StoreBadge";
// AUTH-DISABLED: import { WishlistButton } from "@/components/shared/WishlistButton";
import { FreshnessBadge } from "@/components/shared/FreshnessBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: product, isLoading: productLoading, isError } = useProduct(id);
  const category = product?.category || "";
  const { data: categoryProducts = [] } = useCategoryProducts(category, 6);

  if (productLoading) {
    return (
      <div className="flex flex-col grow bg-background py-10 px-6 md:px-8 max-w-[1280px] mx-auto w-full space-y-10">
        <Skeleton className="h-5 w-32 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          <Skeleton className="w-full min-h-[480px] rounded-2xl" />
          <div className="space-y-5">
            <Skeleton className="h-5 w-40 rounded-full" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-3/4 rounded-md" />
            <div className="flex gap-3 pt-6">
              <Skeleton className="h-12 w-44 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="grow flex items-center justify-center bg-background min-h-[60vh] p-6">
        <EmptyState
          icon={Inbox}
          title="Product not found"
          description="We couldn't resolve this product in our index. It may have been removed or never existed."
          action={
            <Button asChild className="rounded-xl">
              <Link href="/">Return to home</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const relatedProducts = categoryProducts
    .filter((p) => p._id !== id && p.price_sources.length > 0)
    .slice(0, 5);
  const lowestSource = (product.price_sources || []).length > 0
    ? product.price_sources!.reduce((min, s) =>
        s.current_price < min.current_price ? s : min, product.price_sources![0])
    : null;
  const storeName = lowestSource?.store_name || "Verified vendor";
  const hasHistory = (product.price_sources || []).some((s) => (s.historical_prices?.length || 0) > 1);

  return (
    <div className="flex flex-col grow bg-background py-8 px-6 md:px-8">
      <div className="max-w-[1280px] mx-auto space-y-12 md:space-y-16 w-full">
        {/* Breadcrumb */}
        <Link
          href={product.category ? `/categories/${product.category}` : "/products"}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to {product.category || "catalog"}
        </Link>

        {/* Hero: image + facts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Image card */}
          <Card className="relative w-full flex items-center justify-center bg-white border shadow-soft p-10 md:p-12 min-h-[440px] overflow-hidden rounded-2xl group">
            <div className="absolute top-5 left-5">
              <StoreBadge storeName={storeName} />
            </div>
            {/* AUTH-DISABLED: wishlist overlay hidden until auth is re-enabled.
                <div className="absolute top-5 right-5">
                  <WishlistButton productId={id} variant="floating" size="md" />
                </div>
            */}
            <ProductImage
              src={product.image_url}
              alt={product.title}
              storeName={storeName}
              className="w-full max-h-[440px] object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Card>

          {/* Facts */}
          <div className="space-y-6 flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <Badge className="rounded-full font-medium text-xs">{product.category}</Badge>
              )}
              {product.brand && (
                <Badge variant="outline" className="rounded-full font-medium text-xs">
                  {product.brand}
                </Badge>
              )}
              {product.updatedAt && <FreshnessBadge updatedAt={product.updatedAt} />}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              {product.title}
            </h1>

            <div className="flex items-center gap-4">
              {product.rating > 0 && (
                <div className="inline-flex items-center text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Star className="w-4 h-4 fill-current mr-1.5" />
                  {product.rating.toFixed(1)}
                </div>
              )}
              <a
                href="#feedback"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Read feedback
              </a>
            </div>

            <div className="pt-4 border-t space-y-6">
              <PriceTag
                amount={typeof lowestSource?.current_price === "number" ? lowestSource.current_price : null}
                size="lg"
                variant="cheapest"
                label={`Best price · ${storeName}`}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                {lowestSource?.url && (
                  <Button asChild size="lg" className="flex-1 h-12 rounded-xl gap-2">
                    <a href={lowestSource.url} target="_blank" rel="noopener noreferrer">
                      Buy on {storeName}
                    </a>
                  </Button>
                )}
                <Button size="lg" variant="outline" className="h-12 px-5 rounded-xl" aria-label="Share">
                  <Share className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="w-full justify-start border-b bg-transparent rounded-none h-auto p-0 gap-1 sm:gap-2">
            {[
              { v: "specs",       l: "Specifications" },
              { v: "description", l: "Overview" },
              { v: "history",     l: "Price history" },
              { v: "feedback",    l: "Feedback" },
            ].map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="rounded-none px-3 sm:px-4 pb-3 pt-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground text-sm font-medium tracking-tight bg-transparent data-[state=active]:shadow-none transition-colors"
              >
                {t.l}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="pt-8">
            <TabsContent value="specs" className="mt-0">
              <Card className="border shadow-soft rounded-2xl p-6 md:p-8">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex flex-col border-b border-border/60 pb-3">
                        <span className="text-eyebrow capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="font-semibold text-foreground text-sm sm:text-base mt-1">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-10 text-sm">
                    No detailed specifications available for this product.
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="description" className="mt-0">
              <Card className="border shadow-soft rounded-2xl p-6 md:p-8">
                {product.description ? (
                  <p className="text-foreground text-base leading-relaxed max-w-3xl">
                    {product.description}
                  </p>
                ) : (
                  <div className="text-center text-muted-foreground py-10 text-sm">
                    No description available yet.
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <Card className="border shadow-soft rounded-2xl p-6 md:p-8">
                <ErrorBoundary label="Price chart">
                  {hasHistory ? (
                    <PriceHistoryChart priceSources={product.price_sources || []} />
                  ) : (
                    <div className="text-center text-muted-foreground py-10 italic text-sm">
                      Price history will appear once this product has been re-scraped at a different
                      price.
                    </div>
                  )}
                </ErrorBoundary>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="mt-0" id="feedback">
              <Card className="border shadow-soft rounded-2xl p-6 md:p-8">
                <ErrorBoundary label="Sentiment">
                  <SentimentPanel productId={id} />
                </ErrorBoundary>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {relatedProducts.length > 0 && (
          <section className="space-y-6 pb-16">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-eyebrow">You might also like</p>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mt-1">
                  Frequently bought together
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
