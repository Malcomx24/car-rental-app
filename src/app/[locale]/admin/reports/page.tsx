"use client";

import { useTranslations } from "next-intl";

export default function AdminReportsPage() {
  const t = useTranslations("admin");

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("reports")}</h1>
      <p className="text-muted-foreground mt-2">
        {t("viewRevenueBookingsFleet")}
      </p>
    </div>
  );
}
