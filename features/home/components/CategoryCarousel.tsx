import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, ProductType } from "@/components/shared/ProductCard";

interface CategoryCarouselProps {
  category: string;
  products: ProductType[];
}

export function CategoryCarousel({
  category,
  products,
}: CategoryCarouselProps) {
  return (
    <section className="space-y-6 max-w-[1280px] mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow">Category</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground capitalize mt-1">
            {category}
          </h2>
        </div>
        <Link
          href={`/categories/${category}`}
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline shrink-0"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {products
            .filter((p) => (p.price_sources?.length || 0) > 0)
            .map((product) => (
              <CarouselItem
                key={product._id}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
        </CarouselContent>
        <div className="hidden lg:flex justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 w-9 h-9 rounded-full bg-background border hover:bg-accent" />
          <CarouselNext className="static translate-y-0 w-9 h-9 rounded-full bg-background border hover:bg-accent" />
        </div>
      </Carousel>

      <div className="md:hidden mt-4">
        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link href={`/categories/${category}`}>View all {category}</Link>
        </Button>
      </div>
    </section>
  );
}
