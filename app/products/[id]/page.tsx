"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { use } from "react";
import { useProduct, useCategoryProducts } from "@/services/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Share, ArrowLeft, Star } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { data: product, isLoading: productLoading, isError } = useProduct(id);
  const category = product?.category || "";
  
  const { data: categoryProducts = [] } = useCategoryProducts(category, 6);
  
  if (productLoading) {
      return (
          <div className="flex flex-col grow bg-background py-12 px-6 md:px-16 text-foreground max-w-7xl mx-auto w-full space-y-16">
             <Skeleton className="h-6 w-32 rounded-md" />
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                <Skeleton className="w-full min-h-[500px] border rounded-2xl" />
                <div className="space-y-8 flex flex-col justify-center">
                   <Skeleton className="h-6 w-48 rounded-md" />
                   <Skeleton className="h-16 w-full rounded-md" />
                   <Skeleton className="h-16 w-[80%] rounded-md" />
                   <div className="flex gap-4 pt-8">
                     <Skeleton className="h-12 w-48 rounded-md" />
                     <Skeleton className="h-12 w-12 rounded-md" />
                   </div>
                </div>
             </div>
          </div>
      )
  }

  if (isError || !product) {
    return (
      <div className="grow flex items-center justify-center bg-background min-h-[60vh] p-4">
        <Card className="text-center p-12 shadow-sm border rounded-xl max-w-lg w-full flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Asset Missing</h2>
          <p className="text-muted-foreground">The requested product data could not be resolved from the system index.</p>
          <Link href="/">
             <Button>Return to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const relatedProducts = categoryProducts.filter((p: any) => p._id !== id).slice(0, 5);
  const initialImage = product.image_url || 'https://via.placeholder.com/600?text=NO+IMAGE';
  const storeData = product.price_sources?.[0];
  const price = storeData ? storeData.current_price : 'N/A';
  const storeName = storeData ? storeData.store_name : 'Verified Vendor';

  return (
    <div className="flex flex-col grow bg-background py-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16 w-full">
        
        {/* Navigation Breadcrumb */}
        <Link href={`/categories/${product.category}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
           <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
           Back to {product.category}
        </Link>
        
        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Pristine Image Display */}
          <Card className="w-full flex items-center justify-center bg-white border shadow-sm p-12 relative min-h-[500px] overflow-hidden rounded-2xl group">
            <Badge variant="secondary" className="absolute top-6 left-6 shadow-sm border bg-background/80 backdrop-blur-md">
                 {storeName}
            </Badge>
            <img 
              src={initialImage} 
              alt={product.title} 
              className="w-full max-h-[500px] object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Card>

          {/* Core Details */}
          <div className="space-y-8 flex flex-col">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 text-xs rounded-full">
                  {product.category}
                </Badge>
                {product.brand && (
                  <Badge variant="outline" className="font-semibold px-3 py-1 text-xs rounded-full bg-background">
                    {product.brand}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 pt-2">
                 {product.rating > 0 && (
                    <div className="flex items-center text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      <Star className="w-4 h-4 fill-current mr-1.5" />
                      {product.rating.toFixed(1)} Rating
                    </div>
                 )}
                 <span className="text-sm font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer underline-offset-4 hover:underline">
                   Read Feedback
                 </span>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t">
              <div className="pt-4">
                 <p className="text-sm font-medium text-muted-foreground">Certified Price</p>
                 <div className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mt-1">
                   {price !== 'N/A' ? `Rs. ${price.toLocaleString()}` : price}
                 </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                 <Button size="lg" className="flex-1 h-14 text-lg font-bold rounded-xl shadow-lg transition-transform active:scale-95">
                    <ShoppingCart className="w-5 h-5 mr-3" /> Add to Loadout
                 </Button>
                 <Button size="lg" variant="outline" className="h-14 px-6 rounded-xl bg-background hover:bg-muted transition-colors">
                    <Share className="w-5 h-5" />
                 </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Data Tabs */}
        <div className="w-full pt-8">
           <Tabs defaultValue="specs" className="w-full">
              <TabsList className="w-full justify-start border-b bg-transparent rounded-none h-auto p-0 space-x-6">
                  <TabsTrigger 
                     value="specs" 
                     className="rounded-none pb-4 pt-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground text-sm sm:text-base font-semibold tracking-tight bg-transparent data-[state=active]:shadow-none transition-colors"
                  >
                      Key Specifications
                  </TabsTrigger>
                  <TabsTrigger 
                     value="description" 
                     className="rounded-none pb-4 pt-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground text-sm sm:text-base font-semibold tracking-tight bg-transparent data-[state=active]:shadow-none transition-colors"
                  >
                      Product Overview
                  </TabsTrigger>
              </TabsList>
              
              <div className="pt-8">
                  <TabsContent value="specs" className="mt-0">
                      <Card className="border shadow-sm rounded-2xl overflow-hidden p-6 md:p-10">
                          {product.specifications && Object.keys(product.specifications).length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                                {Object.entries(product.specifications).map(([key, value]) => (
                                   <div key={key} className="flex flex-col border-b border-border/60 pb-3">
                                     <span className="text-xs font-medium text-muted-foreground capitalize mb-1.5">{key.replace(/_/g, ' ')}</span>
                                     <span className="font-semibold text-foreground text-sm sm:text-base">{String(value)}</span>
                                   </div>
                                ))}
                              </div>
                          ) : (
                              <div className="text-center font-medium text-muted-foreground py-12">System index lacks detailed specifications for this component.</div>
                          )}
                      </Card>
                  </TabsContent>
                  
                  <TabsContent value="description" className="mt-0">
                      <Card className="border shadow-sm rounded-2xl p-6 md:p-10">
                          {product.description ? (
                             <p className="text-foreground text-base sm:text-lg leading-relaxed max-w-4xl">
                               {product.description}
                             </p>
                          ) : (
                             <div className="text-center font-medium text-muted-foreground py-12">Awaiting comprehensive description data integration.</div>
                          )}
                      </Card>
                  </TabsContent>
              </div>
           </Tabs>
        </div>

        {/* Dynamic Suggestions Section */}
        {relatedProducts.length > 0 && (
            <div className="w-full pt-16 pb-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Frequently Bought Together</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {relatedProducts.map((relProduct: any) => {
                  const relStoreData = relProduct.price_sources?.[0];
                  const relPrice = relStoreData ? relStoreData.current_price : 'N/A';
                  const relStoreName = relStoreData ? relStoreData.store_name : '';
                  const relInitialImage = relProduct.image_url || 'https://via.placeholder.com/400?text=NO+IMAGE';

                  return (
                    <Link href={`/products/${relProduct._id}`} key={relProduct._id} className="block group">
                      <Card className="h-full border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden relative top-0 hover:-top-1">
                        <div className="h-44 bg-white p-5 flex items-center justify-center relative border-b border-border/50">
                            <img
                              src={relInitialImage}
                              alt={relProduct.title}
                              className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                            {relStoreName && (
                               <Badge variant="secondary" className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-[10px] font-semibold">
                                  {relStoreName}
                               </Badge>
                            )}
                        </div>
                        <CardContent className="p-4 space-y-2.5">
                          <h3 className="font-medium text-foreground tracking-tight line-clamp-2 min-h-[2.5rem] text-xs leading-snug group-hover:text-primary transition-colors">
                            {relProduct.title}
                          </h3>
                          <div className="text-sm font-bold text-foreground">
                            {relPrice !== 'N/A' ? `Rs. ${relPrice.toLocaleString()}` : relPrice}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
        )}

      </div>
    </div>
  );
}
