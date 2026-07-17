"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const monthlyRevenueData = [
  { month: "Jan", revenue: 42000, bookings: 120 },
  { month: "Feb", revenue: 38000, bookings: 105 },
  { month: "Mar", revenue: 55000, bookings: 155 },
  { month: "Apr", revenue: 48000, bookings: 135 },
  { month: "May", revenue: 62000, bookings: 175 },
  { month: "Jun", revenue: 71000, bookings: 200 },
  { month: "Jul", revenue: 85000, bookings: 240 },
  { month: "Aug", revenue: 79000, bookings: 220 },
  { month: "Sep", revenue: 68000, bookings: 190 },
  { month: "Oct", revenue: 58000, bookings: 165 },
  { month: "Nov", revenue: 52000, bookings: 145 },
  { month: "Dec", revenue: 73000, bookings: 205 },
];

interface RevenueChartProps {
  data?: typeof monthlyRevenueData;
}

export function RevenueChart({ data = monthlyRevenueData }: RevenueChartProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Revenue Overview</h3>
        <p className="text-sm text-muted-foreground">
          Monthly revenue and booking trends
        </p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value, name) => [
                name === "revenue" ? `$${Number(value).toLocaleString()}` : value,
                name === "revenue" ? "Revenue" : "Bookings",
              ]}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
