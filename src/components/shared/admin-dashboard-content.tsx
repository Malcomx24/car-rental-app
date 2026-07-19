"use client";

import { useTranslations } from "next-intl";
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

export default function AdminDashboardPage() {
  const t = useTranslations("admin");

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
          value="$847,250"
          change={12.5}
          icon={<DollarSign className="h-5 w-5" />}
          description={`$71,250 ${t("thisMonthValue")}`}
        />
        <StatCard
          title={t("totalBookingsStat")}
          value="1,690"
          change={8.2}
          icon={<CalendarDays className="h-5 w-5" />}
          description={`205 ${t("activeCount")}`}
        />
        <StatCard
          title={t("fleetSize")}
          value="18"
          change={5.9}
          icon={<Car className="h-5 w-5" />}
          description={`15 ${t("availableCount")}`}
        />
        <StatCard
          title={t("totalCustomersStat")}
          value="1,247"
          change={15.3}
          icon={<Users className="h-5 w-5" />}
          description={`32 ${t("newThisWeek")}`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <BookingsChart />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Top Cars & Popular Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCars />
        <PopularLocations />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
