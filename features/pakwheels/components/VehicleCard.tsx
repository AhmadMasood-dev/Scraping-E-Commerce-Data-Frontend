"use client";

import { PakWheelsVehicle } from "@/services/types";
import Link from "next/link";
import { MapPin, Gauge, Fuel } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/shared/ProductImage";
import { PriceTag } from "@/components/shared/PriceTag";

export function VehicleCard({ v }: { v: PakWheelsVehicle }) {
  const isNew = v.condition === "New";
  return (
    <Link href={`/pakwheels/${v._id}`} className="block group">
      <article className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-orange-500">
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-border/60">
          <p className="text-eyebrow text-orange-700">{v.make}</p>
          {v.condition && (
            <Badge
              variant="secondary"
              className={`rounded-full text-xs font-medium ${
                isNew
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-primary/10 text-primary border border-primary/20"
              }`}
            >
              {v.condition}
            </Badge>
          )}
        </div>
        <div className="h-40 bg-white p-4 flex items-center justify-center border-b border-border/60">
          <ProductImage
            src={v.image_urls?.[0]}
            alt={v.title}
            storeName={v.make}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-5 flex flex-col gap-3 flex-1">
          <h3 className="font-semibold text-foreground tracking-tight text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {v.title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {v.year && <span className="font-medium">{v.year}</span>}
            {v.mileage != null && (
              <span className="inline-flex items-center gap-1">
                <Gauge className="w-3 h-3" aria-hidden /> {v.mileage.toLocaleString()} km
              </span>
            )}
            {v.transmission && <span>{v.transmission}</span>}
            {v.fuel_type && (
              <span className="inline-flex items-center gap-1">
                <Fuel className="w-3 h-3" aria-hidden /> {v.fuel_type}
              </span>
            )}
          </div>

          {v.city && (
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" aria-hidden /> {v.city}
            </p>
          )}

          <div className="mt-auto pt-3 border-t border-border/60">
            <PriceTag amount={typeof v.price === "number" ? v.price : null} size="md" label="Price" />
          </div>
        </div>
      </article>
    </Link>
  );
}
