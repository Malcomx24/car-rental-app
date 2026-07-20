"use client";

import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface PopularLocation {
  id: string;
  name: string;
  city: string;
  bookings: number;
  isAirport: boolean;
}

interface PopularLocationsProps {
  data?: PopularLocation[];
}

export function PopularLocations({ data = [] }: PopularLocationsProps) {
  const t = useTranslations("admin.popularLocations");

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Link
          href="/admin/locations"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {t("viewAll")} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">{t("noData")}</p>
      ) : (
        <div className="space-y-3">
          {data.map((location) => (
            <div
              key={location.id}
              className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{location.name}</p>
                  {location.isAirport && (
                    <span className="text-[10px] font-medium bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded">
                      {t("airport")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{location.city}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{location.bookings}</p>
                <p className="text-xs text-muted-foreground">{t("bookings")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
