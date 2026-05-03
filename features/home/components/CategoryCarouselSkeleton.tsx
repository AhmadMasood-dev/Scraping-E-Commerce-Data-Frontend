import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/shared/ProductCardSkeleton";

export function CategoryCarouselSkeleton() {
  return (
    <div className="space-y-12 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-end border-b pb-4 mb-4">
        <div className="space-y-3 w-full max-w-sm">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-10 w-64 rounded-md" />
        </div>
      </div>
      <div className="flex gap-6 overflow-hidden">
        <div className="h-88 min-w-72">
          <ProductCardSkeleton />
        </div>
        <div className="h-88 min-w-72 hidden sm:block">
          <ProductCardSkeleton />
        </div>
        <div className="h-88 min-w-72 hidden md:block">
          <ProductCardSkeleton />
        </div>
        <div className="h-88 min-w-72 hidden lg:block">
          <ProductCardSkeleton />
        </div>
      </div>
    </div>
  );
}
