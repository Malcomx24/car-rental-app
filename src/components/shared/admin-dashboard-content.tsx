"use client";

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
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border">
        <h2 className="text-2xl font-bold">Welcome back, Admin</h2>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your fleet today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$847,250"
          change={12.5}
          icon={<DollarSign className="h-5 w-5" />}
          description="$71,250 this month"
        />
        <StatCard
          title="Total Bookings"
          value="1,690"
          change={8.2}
          icon={<CalendarDays className="h-5 w-5" />}
          description="205 active"
        />
        <StatCard
          title="Fleet Size"
          value="18"
          change={5.9}
          icon={<Car className="h-5 w-5" />}
          description="15 available"
        />
        <StatCard
          title="Total Customers"
          value="1,247"
          change={15.3}
          icon={<Users className="h-5 w-5" />}
          description="32 new this week"
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
