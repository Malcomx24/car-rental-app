"use client";

import { Star, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";

interface TopCar {
  id: string;
  name: string;
  brand: string;
  bookings: number;
  revenue: number;
  rating: number;
  image: string | null;
}

interface TopCarsProps {
  data?: TopCar[];
}

export function TopCars({ data = [] }: TopCarsProps) {
  const t = useTranslations("admin.topVehicles");

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">{t("noData")}</p>
      ) : (
        <div className="space-y-3">
          {data.map((car, index) => (
            <div
              key={car.id}
              className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <span className="text-sm font-bold text-muted-foreground w-5">
                {index + 1}
              </span>
              {car.image ? (
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  N/A
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{car.name}</p>
                <p className="text-xs text-muted-foreground">{car.brand}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{car.bookings} {t("bookings")}</p>
                <div className="flex items-center gap-1 justify-end">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-muted-foreground">{car.rating}</span>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{formatCurrency(car.revenue)}</p>
                <p className="text-xs text-muted-foreground">{t("revenue")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
