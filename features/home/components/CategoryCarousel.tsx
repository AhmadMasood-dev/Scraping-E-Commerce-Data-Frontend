import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
    <section className="space-y-8 max-w-400 mx-auto">
      <div className="flex items-end justify-between border-b pb-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground capitalize">
            {category} Collection
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Finest selection of aggregated {category.toLowerCase()} data.
          </p>
        </div>
        <Link
          href={`/categories/${category}`}
          className="hidden md:block text-sm font-medium text-primary hover:underline transition-all"
        >
          View All {category} &rarr;
        </Link>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product._id}
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
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
      <div className="md:hidden mt-6">
        <Link href={`/categories/${category}`}>
          <Button variant="outline" className="w-full">
            View All {category}
          </Button>
        </Link>
      </div>
    </section>
  );
}
