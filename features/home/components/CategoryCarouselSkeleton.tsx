import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/shared/ProductCardSkeleton";

export function CategoryCarouselSkeleton() {
  return (
    <div className="space-y-6 max-w-[1280px] mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-8 w-56 rounded-md" />
        </div>
        <Skeleton className="hidden md:block h-5 w-20 rounded-md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[24rem]">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
