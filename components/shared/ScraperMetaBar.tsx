"use client";

import { ScraperMeta } from "@/services/types";
import { Activity, CheckCircle2, XCircle, Clock } from "lucide-react";
import { FreshnessBadge } from "./FreshnessBadge";

/**
 * Soft chip row above the search results explaining where the data came from
 * — store success/failure counts, total scrape time, cache vs live status, and
 * any NLP translation that was applied to the query.
 */
export function ScraperMetaBar({ meta }: { meta: ScraperMeta | null | undefined }) {
  if (!meta) return null;

  const successCount = meta.successfulStores?.length ?? 0;
  const failedCount = meta.failedStores?.length ?? 0;
  const isLive = !meta.fromCache && successCount > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <FreshnessBadge fromCache={meta.fromCache} live={isLive} />

      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground px-2.5 py-1 text-xs font-medium">
        <Activity className="w-3 h-3" aria-hidden />
        {meta.totalStores} store{meta.totalStores !== 1 ? "s" : ""} queried
      </span>

      {successCount > 0 && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 text-success border border-success/20 px-2.5 py-1 text-xs font-medium">
          <CheckCircle2 className="w-3 h-3" aria-hidden /> {successCount} OK
        </span>
      )}

      {failedCount > 0 && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 px-2.5 py-1 text-xs font-medium">
          <XCircle className="w-3 h-3" aria-hidden /> {failedCount} unavailable
        </span>
      )}

      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground px-2.5 py-1 text-xs font-medium">
        <Clock className="w-3 h-3" aria-hidden /> {meta.durationMs}ms
      </span>

      {meta.nlp?.translated && meta.nlp.language !== "en" && (
        <span className="text-xs text-muted-foreground italic">
          {meta.nlp.language} → &ldquo;{meta.nlp.translated}&rdquo;
        </span>
      )}
    </div>
  );
}
