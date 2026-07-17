"use client";

import dynamic from "next/dynamic";
import { ProtectedRoute } from "@/components/shared/protected-route";

const DashboardOverview = dynamic(
  () => import("@/components/shared/dashboard-content"),
  { ssr: false }
);

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardOverview />
    </ProtectedRoute>
  );
}
