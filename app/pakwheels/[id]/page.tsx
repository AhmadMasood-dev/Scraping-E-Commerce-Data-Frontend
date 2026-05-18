"use client";

import { use } from "react";
import Link from "next/link";
import { usePakWheelsVehicle } from "@/services/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Fuel, Gauge, Calendar, Settings2, ArrowUpRight, Inbox, Car, Cog, Palette, Factory, FileText } from "lucide-react";
import { ProductImage } from "@/components/shared/ProductImage";
import { PriceTag } from "@/components/shared/PriceTag";
import { EmptyState } from "@/components/shared/EmptyState";

function Spec({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
        <Icon className="w-4 h-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-eyebrow">{label}</p>
        <p className="font-semibold text-foreground text-sm mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: v, isLoading, isError } = usePakWheelsVehicle(id);

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto p-6 md:p-8 space-y-6">
        <Skeleton className="h-5 w-32" />
        <div className="grid lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-8 w-2/3 rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !v) {
    return (
      <div className="grow flex items-center justify-center min-h-[60vh] p-6">
        <EmptyState
          icon={Inbox}
          title="Vehicle not found"
          description="The vehicle you're looking for could not be located."
          action={
            <Button asChild className="rounded-xl">
              <Link href="/pakwheels">Back to PakWheels</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto p-6 md:p-8 space-y-10">
      <Link
        href="/pakwheels/search"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to search
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Gallery */}
        <Card className="overflow-hidden p-0 rounded-2xl border shadow-soft">
          <div className="aspect-video bg-white flex items-center justify-center p-6">
            <ProductImage
              src={v.image_urls?.[0]}
              alt={v.title}
              storeName={v.make}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          {v.image_urls && v.image_urls.length > 1 && (
            <div className="grid grid-cols-4 gap-2 p-3 bg-muted/50 border-t border-border/60">
              {v.image_urls.slice(1, 5).map((u, i) => (
                <div key={i} className="aspect-video bg-white rounded-lg overflow-hidden flex items-center justify-center p-2 border border-border/60">
                  <ProductImage
                    src={u}
                    alt={`${v.title} ${i + 2}`}
                    storeName={v.make}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Facts */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {v.make && (
              <Badge variant="secondary" className="rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                {v.make}
              </Badge>
            )}
            {v.body_type && (
              <Badge variant="secondary" className="rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                {v.body_type}
              </Badge>
            )}
            {v.condition && (
              <Badge variant="outline" className="rounded-full text-xs font-medium">
                {v.condition}
              </Badge>
            )}
            {v.assembly && (
              <Badge variant="outline" className="rounded-full text-xs font-medium">
                {v.assembly}
              </Badge>
            )}
            {v.seller_type && (
              <Badge variant="outline" className="rounded-full text-xs font-medium">
                {v.seller_type}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            {v.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {v.year             && <Spec icon={Calendar}   label="Year"           value={String(v.year)} />}
            {v.mileage != null  && <Spec icon={Gauge}      label="Mileage"        value={`${v.mileage.toLocaleString()} km`} />}
            {v.fuel_type        && <Spec icon={Fuel}       label="Fuel"           value={v.fuel_type} />}
            {v.transmission     && <Spec icon={Settings2}  label="Transmission"   value={v.transmission} />}
            {v.engine_capacity  && <Spec icon={Cog}        label="Engine"         value={`${v.engine_capacity} cc`} />}
            {v.body_type        && <Spec icon={Car}        label="Body type"      value={v.body_type} />}
            {v.color            && <Spec icon={Palette}    label="Color"          value={v.color} />}
            {v.assembly         && <Spec icon={Factory}    label="Assembly"       value={v.assembly} />}
            {v.registered_in    && <Spec icon={FileText}   label="Registered in"  value={v.registered_in} />}
            {v.city             && <Spec icon={MapPin}     label="City"           value={v.province ? `${v.city}, ${v.province}` : v.city} />}
          </div>

          <div className="border-t pt-5">
            <PriceTag
              amount={typeof v.price === "number" ? v.price : null}
              size="lg"
              variant="cheapest"
              label="Listed price"
            />
          </div>

          {v.description && (
            <Card className="p-5 rounded-2xl border shadow-soft">
              <p className="text-eyebrow mb-2">Description</p>
              <p className="text-foreground leading-relaxed text-sm whitespace-pre-line">{v.description}</p>
            </Card>
          )}

          {v.features && v.features.length > 0 && (
            <Card className="p-5 rounded-2xl border shadow-soft">
              <p className="text-eyebrow mb-3">Features</p>
              <div className="flex flex-wrap gap-2">
                {v.features.map((f) => (
                  <Badge
                    key={f}
                    variant="secondary"
                    className="rounded-full text-xs font-medium bg-muted text-foreground/80 border border-border"
                  >
                    {f}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {v.source_url && (
            <Button asChild size="lg" className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 gap-2">
              <a href={v.source_url} target="_blank" rel="noopener noreferrer">
                View on PakWheels.com
                <ArrowUpRight className="w-4 h-4" aria-hidden />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
