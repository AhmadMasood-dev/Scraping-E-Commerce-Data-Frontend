import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Shape-matched skeleton for ProductCard — same height/spacing/radii. */
export function ProductCardSkeleton() {
  return (
    <Card className="h-full bg-card rounded-2xl overflow-hidden border border-border border-l-4 shadow-soft">
      <div className="h-56 p-6 border-b border-border/60">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-7 w-1/3 mt-1" />
      </CardContent>
    </Card>
  );
}
