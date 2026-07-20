"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { StatCard } from "@/components/shared/stat-card";
import { RevenueChart } from "@/components/shared/revenue-chart";
import { BookingsChart } from "@/components/shared/bookings-chart";
import { RecentActivity } from "@/components/shared/recent-activity";
import { QuickActions } from "@/components/shared/quick-actions";
import { TopCars } from "@/components/shared/top-cars";
import { PopularLocations } from "@/components/shared/popular-locations";
import {
  DollarSign,
  CalendarDays,
  Car,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardData {
  stats: {
    totalRevenue: number;
    thisMonthRevenue: number;
    revenueChange: number;
    totalBookings: number;
    activeBookings: number;
    bookingChange: number;
    fleetSize: number;
    availableFleet: number;
    fleetChange: number;
    totalCustomers: number;
    newCustomersWeek: number;
  };
  monthlyRevenue: { month: string; revenue: number; bookings: number; monthIndex: number }[];
  bookingStatuses: { name: string; value: number; color: string }[];
  activity: { id: string; type: string; titleKey: string; description: string; timestamp: string; user?: string }[];
  topVehicles: { id: string; name: string; brand: string; bookings: number; revenue: number; rating: number; image: string | null }[];
  popularLocations: { id: string; name: string; city: string; bookings: number; isAirport: boolean }[];
  quickMetrics: { avgBookingValue: number; occupancyRate: number; revenuePerCar: number; totalRevenue: number };
}

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || "Failed to load dashboard");
        }
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border animate-pulse h-24" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 animate-pulse h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <p className="text-muted-foreground">{error || t("failedToFetchCars")}</p>
      </div>
    );
  }

  const { stats, monthlyRevenue, bookingStatuses, activity, topVehicles, popularLocations, quickMetrics } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border">
        <h2 className="text-2xl font-bold">{t("welcomeBackAdmin")}</h2>
        <p className="text-muted-foreground mt-1">
          {t("fleetToday")}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("totalRevenueStat")}
          value={formatCurrency(stats.totalRevenue)}
          change={stats.revenueChange}
          changeLabel={t("thisMonthValue")}
          icon={<DollarSign className="h-5 w-5" />}
          description={`${formatCurrency(stats.thisMonthRevenue)} ${t("thisMonthValue")}`}
        />
        <StatCard
          title={t("totalBookingsStat")}
          value={stats.totalBookings.toLocaleString()}
          change={stats.bookingChange}
          changeLabel={t("thisMonthValue")}
          icon={<CalendarDays className="h-5 w-5" />}
          description={`${stats.activeBookings} ${t("activeCount")}`}
        />
        <StatCard
          title={t("fleetSize")}
          value={stats.fleetSize.toString()}
          change={stats.fleetChange}
          changeLabel={t("thisMonthValue")}
          icon={<Car className="h-5 w-5" />}
          description={`${stats.availableFleet} ${t("availableCount")}`}
        />
        <StatCard
          title={t("totalCustomersStat")}
          value={stats.totalCustomers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          description={`${stats.newCustomersWeek} ${t("newThisWeek")}`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenue} locale={locale} />
        </div>
        <div>
          <BookingsChart data={bookingStatuses} />
        </div>
      </div>

      {/* Quick Metrics */}
      <QuickActions metrics={quickMetrics} />

      {/* Top Cars & Popular Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCars data={topVehicles} />
        <PopularLocations data={popularLocations} />
      </div>

      {/* Recent Activity */}
      <RecentActivity data={activity} />
    </div>
  );
}
