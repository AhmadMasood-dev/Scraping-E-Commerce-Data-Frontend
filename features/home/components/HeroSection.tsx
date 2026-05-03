import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full h-[70vh] min-h-110 flex items-center justify-center overflow-hidden border-b bg-card">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.16),transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,rgba(14,165,233,0.14),transparent_55%)]" />

      <div className="relative text-center space-y-6 px-4 max-w-4xl mx-auto">
        <Badge
          variant="secondary"
          className="px-4 py-1.5 rounded-full text-sm font-medium border shadow-sm"
        >
          Next Generation PQC Engine
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground drop-shadow-sm">
          Empower Your <span className="text-primary">E-Commerce</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Aggregating the best prices, comparing real-world specifications, and
          delivering unmatched value directly to your cart.
        </p>
        <div className="pt-6 flex gap-4 justify-center items-center">
          <Link href="/products">
            <Button
              size="lg"
              className="rounded-full px-8 text-base shadow-lg transition-transform hover:scale-105"
            >
              Browse Catalog
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 text-base bg-background transition-transform hover:scale-105"
          >
            View Features
          </Button>
        </div>
      </div>
    </section>
  );
}
