"use client";

import { PriceSource } from "@/services/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#8b5cf6", "#ef4444", "#14b8a6", "#f59e0b"];

interface Props {
  priceSources: PriceSource[];
}

export function PriceHistoryChart({ priceSources }: Props) {
  const allDates = new Set<string>();
  for (const s of priceSources) {
    s.historical_prices?.forEach((p) => allDates.add(new Date(p.date).toISOString().slice(0, 10)));
  }
  const sortedDates = Array.from(allDates).sort();

  const data = sortedDates.map((date) => {
    const row: Record<string, string | number> = { date };
    for (const s of priceSources) {
      const sample = s.historical_prices?.find(
        (p) => new Date(p.date).toISOString().slice(0, 10) === date
      );
      if (sample) row[s.store_name] = sample.price;
    }
    return row;
  });

  if (data.length < 2) {
    return (
      <div className="text-center text-muted-foreground py-12 italic text-sm">
        Not enough price history yet — at least two data points are required to draw a chart.
      </div>
    );
  }

  return (
    <div className="w-full h-72 md:h-80">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `Rs.${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v) => `Rs. ${Number(v).toLocaleString()}`}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {priceSources.map((s, i) => (
            <Line
              key={s.store_name}
              type="monotone"
              dataKey={s.store_name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
