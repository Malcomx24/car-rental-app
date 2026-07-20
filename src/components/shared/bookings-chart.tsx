"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useTranslations } from "next-intl";

interface BookingsChartProps {
  data?: { name: string; value: number; color: string }[];
}

const STATUS_TRANSLATION_KEYS: Record<string, string> = {
  COMPLETED: "dashboard.completed",
  ACTIVE: "dashboard.active",
  CONFIRMED: "dashboard.confirmed",
  PENDING: "dashboard.pending",
  CANCELLED: "dashboard.cancelled",
};

export function BookingsChart({ data = [] }: BookingsChartProps) {
  const tDashboard = useTranslations("dashboard");
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const translatedData = data.map((d) => ({
    ...d,
    name: tDashboard.has(STATUS_TRANSLATION_KEYS[d.name] || "")
      ? tDashboard(STATUS_TRANSLATION_KEYS[d.name] as "completed")
      : d.name,
  }));

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">{tDashboard("totalBookings")}</h3>
        <p className="text-sm text-muted-foreground">
          Distribution of booking statuses
        </p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={translatedData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {translatedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value) => [
                `${value} (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
