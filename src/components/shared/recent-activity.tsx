"use client";

import {
  Clock,
  UserPlus,
  Car,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ActivityItem {
  id: string;
  type: string;
  titleKey: string;
  description: string;
  timestamp: string;
  user?: string;
}

const iconMap = {
  booking: <CheckCircle2 className="h-4 w-4 text-blue-500" />,
  payment: <CreditCard className="h-4 w-4 text-emerald-500" />,
  user: <UserPlus className="h-4 w-4 text-violet-500" />,
  car: <Car className="h-4 w-4 text-amber-500" />,
  alert: <AlertTriangle className="h-4 w-4 text-red-500" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
};

const bgMap = {
  booking: "bg-blue-500/10",
  payment: "bg-emerald-500/10",
  user: "bg-violet-500/10",
  car: "bg-amber-500/10",
  alert: "bg-red-500/10",
  success: "bg-emerald-500/10",
};

function timeAgo(timestamp: string, t: ReturnType<typeof useTranslations>): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return t("justNow");
  if (diffMin < 60) return t("minutesAgo", { count: diffMin });
  if (diffHr < 24) return t("hoursAgo", { count: diffHr });
  return t("daysAgo", { count: diffDay });
}

interface RecentActivityProps {
  data?: ActivityItem[];
}

export function RecentActivity({ data = [] }: RecentActivityProps) {
  const t = useTranslations("admin.recentActivity");
  const tDashboard = useTranslations("dashboard");

  const titleMap: Record<string, string> = {
    newBooking: tDashboard("active"),
    bookingCompleted: tDashboard("completed"),
    bookingCancelled: tDashboard("cancelled"),
    newCustomer: tDashboard("favorites"),
  };

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="px-6 pb-6">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t("noActivity")}</p>
        ) : (
          <div className="space-y-1">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <div className={`mt-0.5 rounded-lg p-2 ${bgMap[item.type as keyof typeof bgMap]}`}>
                  {iconMap[item.type as keyof typeof iconMap]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {titleMap[item.titleKey] || item.titleKey}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {timeAgo(item.timestamp, t)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
