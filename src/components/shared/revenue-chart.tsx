"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";

const MONTH_KEYS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

interface RevenueChartProps {
  data?: { month: string; revenue: number; bookings: number; monthIndex: number }[];
  locale?: string;
}

export function RevenueChart({ data = [], locale = "fr" }: RevenueChartProps) {
  const t = useTranslations("dashboard.months");

  const chartData = data.map((d) => ({
    ...d,
    month: t.has(MONTH_KEYS[d.monthIndex]) ? t(MONTH_KEYS[d.monthIndex]) : d.month,
  }));

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Aperçu des revenus</h3>
        <p className="text-sm text-muted-foreground">
          Revenus mensuels et tendances des réservations
        </p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k MAD`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value, name) => [
                name === "revenue" ? `${Number(value).toLocaleString("fr-MA")} MAD` : value,
                name === "revenue" ? "Revenu" : "Réservations",
              ]}
            />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Revenu"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
