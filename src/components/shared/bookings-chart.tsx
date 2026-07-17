"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const bookingStatusData = [
  { name: "Completed", value: 425, color: "#10b981" },
  { name: "Active", value: 85, color: "#3b82f6" },
  { name: "Confirmed", value: 120, color: "#f59e0b" },
  { name: "Pending", value: 45, color: "#8b5cf6" },
  { name: "Cancelled", value: 30, color: "#ef4444" },
];

interface BookingsChartProps {
  data?: typeof bookingStatusData;
}

export function BookingsChart({ data = bookingStatusData }: BookingsChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Booking Status</h3>
        <p className="text-sm text-muted-foreground">
          Distribution of booking statuses this month
        </p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
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
                `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
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
