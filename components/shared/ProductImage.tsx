"use client";

import { ImageOff } from "lucide-react";

const PLACEHOLDER_DOMAINS = [
  "placehold.co",
  "via.placeholder.com",
  "placeholder.com",
];

const isPlaceholder = (url: string | null | undefined): boolean => {
  if (!url) return true;
  const lower = url.toLowerCase();
  return PLACEHOLDER_DOMAINS.some((d) => lower.includes(d));
};

interface Props {
  src: string | null | undefined;
  alt: string;
  className?: string;
  storeName?: string;
  storeColorClass?: string; // e.g. "bg-green-600"
}

/**
 * Renders a real product image when one is available; otherwise a clean
 * store-branded fallback (no garish placeholder graphics).
 */
export function ProductImage({ src, alt, className, storeName, storeColorClass }: Props) {
  if (!isPlaceholder(src)) {
    return (
      <img
        src={src!}
        alt={alt}
        className={className ?? "max-h-full max-w-full object-contain mix-blend-multiply"}
        loading="lazy"
        onError={(e) => {
          // If the real image fails to load, fall through to the branded fallback by
          // hiding the broken element. Parent will show whatever it puts behind us.
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  // Branded fallback — no colorful dummy graphic, just a clean panel
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center bg-linear-to-b from-muted/40 to-muted/10">
      <ImageOff className="w-8 h-8 text-muted-foreground/40 mb-3" />
      {storeName && (
        <span className={`text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 px-2 py-0.5 rounded-full ${storeColorClass ?? ""}`}>
          {storeName}
        </span>
      )}
      <span className="mt-2 text-xs font-semibold text-muted-foreground/80 line-clamp-2">
        {alt}
      </span>
      <span className="mt-1 text-[10px] text-muted-foreground/50 italic">
        Image not available
      </span>
    </div>
  );
}
