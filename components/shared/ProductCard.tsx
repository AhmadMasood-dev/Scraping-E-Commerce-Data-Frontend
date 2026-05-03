import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProductStoreConfig {
  current_price: number | string;
  store_name: string;
}

export interface ProductType {
  _id: string;
  title: string;
  image_url?: string;
  price_sources?: ProductStoreConfig[];
}

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const storeData =
    product.price_sources && product.price_sources.length > 0
      ? product.price_sources[0]
      : null;
  const price = storeData ? storeData.current_price : "N/A";
  const storeName = storeData ? storeData.store_name : "";
  const initialImage =
    product.image_url || "https://via.placeholder.com/400?text=NO+IMAGE";

  return (
    <Link href={`/products/${product._id}`} className="block group h-full">
      <Card className="h-full border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group cursor-pointer relative top-0 hover:-top-1">
        <div className="h-60 bg-white p-6 flex items-center justify-center relative border-b border-border/50 group-hover:bg-slate-50/50 transition-colors">
          <img
            src={initialImage}
            alt={product.title}
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
          />
          {storeName && (
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-[10px] font-semibold block w-fit"
            >
              {storeName}
            </Badge>
          )}
        </div>
        <CardContent className="p-5 space-y-3">
          <h3 className="font-medium text-foreground tracking-tight line-clamp-2 min-h-[3rem] text-sm leading-relaxed group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold text-foreground">
              {price !== "N/A" ? `Rs. ${price.toLocaleString()}` : price}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
