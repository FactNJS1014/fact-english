"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AdminActivityChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--text-faint)", fontSize: 12 }}
            axisLine={{ stroke: "var(--line)" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--text-faint)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--brand-soft)" }}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--line-strong)",
              borderRadius: 12,
              color: "var(--text)",
              fontSize: 13,
            }}
            labelStyle={{ color: "var(--text-muted)" }}
          />
          <Bar dataKey="count" fill="var(--brand)" radius={[6, 6, 0, 0]} name="Activities" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
