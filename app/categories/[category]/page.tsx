"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { use } from "react";
import { useCategoryProducts } from "@/services/hooks";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  
  const { data: products = [], isLoading, isError, error } = useCategoryProducts(category, 40);

  return (
    <div className="flex flex-col grow bg-background py-8 px-6 md:px-12">
      <div className="max-w-[100rem] mx-auto space-y-10 w-full">
        
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group mb-2">
           <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
           Back to Dashboard
        </Link>

        <div className="flex flex-col space-y-4">
          <Badge variant="outline" className="w-fit bg-primary/5 text-primary text-xs px-3 py-1 border-primary/20 rounded-full">
             Curated Hierarchy
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground capitalize">{category} Category</h1>
          <p className="text-muted-foreground max-w-xl text-lg">Finely sourced component data extracted securely from top network aggregators.</p>
        </div>

        {isLoading ? (
           <div className="py-32 text-center font-medium text-muted-foreground text-xl tracking-tight animate-pulse">
              Initializing {category} Layout...
           </div>
        ) : isError ? (
           <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-destructive text-center font-medium">
              Data acquisition failed: {error?.message}
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product: any) => {
              const storeData = product.price_sources?.[0];
              const price = storeData ? storeData.current_price : 'N/A';
              const storeName = storeData ? storeData.store_name : '';
              const initialImage = product.image_url || 'https://via.placeholder.com/200?text=No+Image';

              return (
                <Link href={`/products/${product._id}`} key={product._id} className="block group">
                  <Card className="h-full border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden relative top-0 hover:-top-1">
                    <div className="h-56 bg-white p-6 flex flex-col items-center justify-center relative border-b border-border/50 group-hover:bg-slate-50/50 transition-colors">
                        <img
                          src={initialImage}
                          alt={product.title}
                          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 will-change-transform ease-out"
                        />
                        {storeName && (
                           <Badge variant="secondary" className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-[10px] font-semibold">
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
                          {price !== 'N/A' ? `Rs. ${price.toLocaleString()}` : price}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
