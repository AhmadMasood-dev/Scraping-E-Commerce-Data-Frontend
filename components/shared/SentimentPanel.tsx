"use client";

import { useProductSentiment } from "@/services/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "./ErrorAlert";
import { EmptyState } from "./EmptyState";
import { Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  Positive: "bg-success/10 border-success/20 text-success",
  Neutral:  "bg-warning/10 border-warning/20 text-warning",
  Negative: "bg-destructive/10 border-destructive/20 text-destructive",
};

export function SentimentPanel({ productId }: { productId: string }) {
  const { data, isLoading, isError, error } = useProductSentiment(productId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }
  if (isError) return <ErrorAlert message={(error as Error)?.message || "Failed to load sentiment"} />;
  if (!data || data.total_reviews === 0) {
    return <EmptyState icon={MessageSquare} title="No reviews yet" description="This product hasn't received any feedback in the system." size="compact" />;
  }

  const { distribution, total_reviews, quality_score, reviews } = data;
  const cards = [
    { label: "Positive", pct: distribution.positive, tone: TONE.Positive },
    { label: "Neutral",  pct: distribution.neutral,  tone: TONE.Neutral },
    { label: "Negative", pct: distribution.negative, tone: TONE.Negative },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={cn("p-5 border rounded-2xl", c.tone)}>
            <p className="text-eyebrow">{c.label}</p>
            <p className="text-3xl font-bold tracking-tight mt-1">{c.pct.toFixed(0)}%</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4 text-sm">
        <p>
          <span className="text-eyebrow mr-2">Quality Score</span>
          <span className="font-semibold text-foreground">{quality_score.toFixed(2)}</span>
        </p>
        <p className="text-muted-foreground">
          Based on {total_reviews.toLocaleString()} review{total_reviews !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-3">
        {reviews.slice(0, 10).map((r) => (
          <article key={r._id} className="border-l-2 border-border pl-4 py-2">
            <div className="flex items-center gap-3 mb-1.5">
              {r.rating != null && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                  <Star className="w-3 h-3 fill-current" aria-hidden /> {r.rating.toFixed(1)}
                </span>
              )}
              {r.sentiment_label && (
                <span
                  className={cn(
                    "text-eyebrow",
                    r.sentiment_label === "Positive" && "text-success",
                    r.sentiment_label === "Negative" && "text-destructive",
                    r.sentiment_label === "Neutral"  && "text-warning"
                  )}
                >
                  {r.sentiment_label}
                </span>
              )}
            </div>
            {r.text && <p className="text-sm text-foreground/90 leading-relaxed">{r.text}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
