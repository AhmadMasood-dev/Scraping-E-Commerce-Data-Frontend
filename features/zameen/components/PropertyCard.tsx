"use client";

import { ZameenProperty } from "@/services/types";
import { Building2, Home, MapPin, Bed, Bath, Maximize2, Tag, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/shared/PriceTag";
import { cn } from "@/lib/utils";

type TypeStyle = { border: string; icon: React.ReactNode };
const TYPE_STYLES: Record<string, TypeStyle> = {
  Flat:             { border: "border-l-emerald-500", icon: <Building2 className="w-4 h-4" /> },
  House:            { border: "border-l-sky-500",     icon: <Home className="w-4 h-4" /> },
  "Upper Portion":  { border: "border-l-violet-500",  icon: <Home className="w-4 h-4" /> },
  "Lower Portion":  { border: "border-l-amber-500",   icon: <Home className="w-4 h-4" /> },
  Plot:             { border: "border-l-rose-500",    icon: <Maximize2 className="w-4 h-4" /> },
  "Commercial Plot":{ border: "border-l-orange-500",  icon: <Building2 className="w-4 h-4" /> },
  Shop:             { border: "border-l-cyan-500",    icon: <Tag className="w-4 h-4" /> },
  Office:           { border: "border-l-indigo-500",  icon: <Building2 className="w-4 h-4" /> },
  Penthouse:        { border: "border-l-pink-500",    icon: <Building2 className="w-4 h-4" /> },
  Farmhouse:        { border: "border-l-lime-500",    icon: <Home className="w-4 h-4" /> },
};
const DEFAULT_STYLE: TypeStyle = { border: "border-l-slate-400", icon: <Building2 className="w-4 h-4" /> };

export function PropertyCard({ prop }: { prop: ZameenProperty }) {
  const style = TYPE_STYLES[prop.property_type ?? ""] ?? DEFAULT_STYLE;
  const isForSale = prop.purpose === "For Sale";

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 transition-all duration-300 group border-l-4",
        style.border
      )}
    >
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          {style.icon}
          <span className="text-eyebrow">{prop.property_type}</span>
        </div>
        {prop.purpose && (
          <Badge
            variant="secondary"
            className={cn(
              "rounded-full text-xs font-medium",
              isForSale
                ? "bg-success/10 text-success border border-success/20"
                : "bg-primary/10 text-primary border border-primary/20"
            )}
          >
            {prop.purpose}
          </Badge>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" aria-hidden />
          <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
            {[prop.location, prop.city, prop.province_name].filter(Boolean).join(", ")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs font-medium">
          {prop.bedrooms != null && prop.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {prop.bedrooms} Bed</span>
          )}
          {prop.baths != null && prop.baths > 0 && (
            <span className="inline-flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {prop.baths} Bath</span>
          )}
          {prop.area && (
            <span className="inline-flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {prop.area}</span>
          )}
        </div>

        {prop.agency && (
          <p className="text-xs text-muted-foreground truncate">Agency: {prop.agency}</p>
        )}

        <div className="mt-auto pt-3 border-t border-border/60">
          <PriceTag amount={typeof prop.price === "number" ? prop.price : null} size="md" label="Price" />
        </div>

        {prop.page_url && (
          <Button asChild variant="outline" size="sm" className="rounded-xl gap-1.5">
            <a href={prop.page_url} target="_blank" rel="noopener noreferrer">
              View on Zameen.com
              <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}
