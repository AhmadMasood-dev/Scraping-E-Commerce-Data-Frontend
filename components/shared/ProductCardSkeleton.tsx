import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="h-full border bg-card text-card-foreground shadow-sm rounded-xl overflow-hidden">
      <div className="h-60 p-6 flex flex-col items-center justify-center relative border-b border-border/50">
        <Skeleton className="w-full h-full rounded" />
      </div>
      <CardContent className="p-5 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
}
