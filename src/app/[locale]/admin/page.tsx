"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboardContent = dynamic(
  () => import("@/components/shared/admin-dashboard-content"),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    ),
  }
);

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
