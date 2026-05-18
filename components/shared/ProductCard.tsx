"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { PriceTag } from "./PriceTag";
import { StoreBadge } from "./StoreBadge";
// AUTH-DISABLED: import { WishlistButton } from "./WishlistButton";
import { storeColor } from "@/lib/storeConfig";

interface ProductStoreConfig {
  current_price: number | string;
  store_name: string;
}

export interface ProductType {
  _id: string;
  title: string;
  image_url?: string;
  price_sources?: ProductStoreConfig[];
  rating?: number;
}

interface ProductCardProps {
  product: ProductType;
  /** Show wishlist heart on hover (default true). Disable for compact contexts. */
  showWishlist?: boolean;
}

/**
 * Unified product card used everywhere except the search-page cross-store
 * comparison (PrimaryProductCard) — landing carousels, catalog grid, category
 * pages, related products, DB matches in search results.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProductCard({ product, showWishlist = true }: ProductCardProps) {
  const storeData = product.price_sources && product.price_sources.length > 0
    ? product.price_sources[0]
    : null;
  const price = typeof storeData?.current_price === "number" ? storeData.current_price : null;
  const storeName = storeData?.store_name;
  const color = storeColor(storeName);

  return (
    <Link href={`/products/${product._id}`} className="block group h-full">
      <Card
        className={`relative h-full bg-card text-card-foreground rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 transition-all duration-300 ${color.border} border-l-4 cursor-pointer`}
      >
        {/* AUTH-DISABLED: wishlist heart hidden until auth is re-enabled.
            {showWishlist && (
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <WishlistButton productId={product._id} variant="floating" size="sm" />
              </div>
            )}
        */}

        <div className="h-56 bg-white p-6 flex items-center justify-center relative border-b border-border/60">
          <ProductImage
            src={product.image_url}
            alt={product.title}
            storeName={storeName}
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
          />
        </div>

        <CardContent className="p-5 space-y-3">
          {storeName && <StoreBadge storeName={storeName} />}

          <h3 className="font-semibold text-foreground tracking-tight line-clamp-2 min-h-[2.75rem] text-base leading-snug group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <div className="flex items-end justify-between pt-1">
            <PriceTag amount={price} size="md" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
