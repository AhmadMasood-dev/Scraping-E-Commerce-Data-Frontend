import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Search, Building2, Car } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden border-b bg-card">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.10),transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.08),transparent_55%)]" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        {/* Left: copy + CTAs */}
        <div className="space-y-6">
          <Badge
            variant="secondary"
            className="rounded-full text-xs font-medium border bg-background/60 backdrop-blur"
          >
            Pakistan&apos;s Price &amp; Quality Comparison Engine
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
            Find the best price{" "}
            <span className="text-primary">across every store</span> in Pakistan.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Compare live prices from Telemart, PriceOye, Daraz, Mega and more — plus
            real-estate listings from Zameen.pk and used vehicles from PakWheels —
            all in one place.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="rounded-xl gap-2">
              <Link href="/products">
                <Search className="w-4 h-4" aria-hidden /> Browse catalog
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl gap-2">
              <Link href="/zameen">
                <Building2 className="w-4 h-4" aria-hidden /> Real estate
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl gap-2">
              <Link href="/pakwheels">
                <Car className="w-4 h-4" aria-hidden /> Vehicles
              </Link>
            </Button>
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-4 pt-8 max-w-xl">
            <Stat value="170k+" label="Real-estate listings" />
            <Stat value="6+" label="E-commerce stores" />
            <Stat value="Live" label="Price comparison" />
          </div>
        </div>

        {/* Right: visual placeholder card stack — pure decoration */}
        <div className="hidden lg:block relative h-[420px]">
          <div className="absolute inset-0 rounded-3xl border border-border bg-gradient-to-br from-sky-500/10 via-blue-600/10 to-indigo-600/10" />
          <div className="absolute top-10 left-10 right-10 rounded-2xl bg-card border shadow-soft-hover p-5">
            <p className="text-eyebrow">Best price found</p>
            <p className="text-2xl font-bold tracking-tight mt-1">Rs. 14,343</p>
            <p className="text-xs text-success mt-1 inline-flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> Save Rs. 10,370
            </p>
          </div>
          <div className="absolute bottom-10 right-10 left-20 rounded-2xl bg-card border shadow-soft p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">5 stores compared</span>
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
            </div>
            <div className="flex gap-1.5 mt-3">
              {["bg-green-600", "bg-orange-500", "bg-blue-600", "bg-purple-600", "bg-amber-500"].map((c) => (
                <span key={c} className={`h-2 flex-1 rounded-full ${c}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
