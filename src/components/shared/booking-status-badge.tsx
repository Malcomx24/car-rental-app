"use client";

import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600 border-blue-200" },
  ACTIVE: { label: "Active", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  COMPLETED: { label: "Completed", className: "bg-gray-500/10 text-gray-600 border-gray-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-600 border-red-200" },
};

export function BookingStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || { label: status, className: "" };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}
