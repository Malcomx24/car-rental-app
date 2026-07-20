"use client";

import Link from "next/link";
import {
  Plus,
  CalendarDays,
  FileText,
  Download,
  Wrench,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";

const quickActions = [
  {
    labelKey: "addCar" as const,
    href: "/admin/cars/new",
    icon: Plus,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
  },
  {
    labelKey: "viewBookings" as const,
    href: "/admin/bookings",
    icon: CalendarDays,
    color: "text-blue-500",
    bg: "bg-blue-500/10 hover:bg-blue-500/20",
  },
  {
    labelKey: "generateReport" as const,
    href: "/admin/reports",
    icon: FileText,
    color: "text-amber-500",
    bg: "bg-amber-500/10 hover:bg-amber-500/20",
  },
  {
    labelKey: "exportData" as const,
    href: "/admin/reports?export=true",
    icon: Download,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10 hover:bg-cyan-500/20",
  },
  {
    labelKey: "maintenance" as const,
    href: "/admin/maintenance",
    icon: Wrench,
    color: "text-rose-500",
    bg: "bg-rose-500/10 hover:bg-rose-500/20",
  },
];

interface QuickActionsProps {
  metrics?: {
    avgBookingValue: number;
    occupancyRate: number;
    revenuePerCar: number;
    totalRevenue: number;
  };
}

export function QuickActions({ metrics }: QuickActionsProps) {
  const t = useTranslations("admin.quickActions");

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Quick Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-lg font-bold">{formatCurrency(metrics.avgBookingValue)}</p>
            <p className="text-xs text-muted-foreground">{t("avgBookingValue")}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-lg font-bold">{metrics.occupancyRate}%</p>
            <p className="text-xs text-muted-foreground">{t("occupancyRate")}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-lg font-bold">{formatCurrency(metrics.revenuePerCar)}</p>
            <p className="text-xs text-muted-foreground">{t("revenuePerCar")}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-lg font-bold flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              {formatCurrency(metrics.totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground">{t("totalRevenue")}</p>
          </div>
        </div>
      )}

      {/* Action Links */}
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
              <span className="text-xs font-medium">{t(action.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
