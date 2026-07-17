"use client";

import Link from "next/link";
import {
  Plus,
  Car,
  CalendarDays,
  UserPlus,
  FileText,
  Download,
  Wrench,
} from "lucide-react";

const quickActions = [
  {
    label: "Add New Car",
    href: "/admin/cars/new",
    icon: Plus,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
  },
  {
    label: "View Bookings",
    href: "/admin/bookings",
    icon: CalendarDays,
    color: "text-blue-500",
    bg: "bg-blue-500/10 hover:bg-blue-500/20",
  },
  {
    label: "Add Customer",
    href: "/admin/customers/new",
    icon: UserPlus,
    color: "text-violet-500",
    bg: "bg-violet-500/10 hover:bg-violet-500/20",
  },
  {
    label: "Generate Report",
    href: "/admin/reports",
    icon: FileText,
    color: "text-amber-500",
    bg: "bg-amber-500/10 hover:bg-amber-500/20",
  },
  {
    label: "Export Data",
    href: "/admin/reports?export=true",
    icon: Download,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10 hover:bg-cyan-500/20",
  },
  {
    label: "Maintenance",
    href: "/admin/maintenance",
    icon: Wrench,
    color: "text-rose-500",
    bg: "bg-rose-500/10 hover:bg-rose-500/20",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all duration-200 ${action.bg}`}
            >
              <Icon className={`h-5 w-5 ${action.color}`} />
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
