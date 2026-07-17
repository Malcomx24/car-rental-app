"use client";

import dynamic from "next/dynamic";

const DashboardOverview = dynamic(
  () => import("@/components/shared/dashboard-content"),
  { ssr: false }
);

export default function DashboardPage() {
  return <DashboardOverview />;
}
