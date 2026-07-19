"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Bell, Mail, Calendar, CreditCard, Star, Shield, Settings } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface Preferences {
  id: string;
  bookingUpdates: boolean;
  paymentUpdates: boolean;
  promotionalEmails: boolean;
  reviewRequests: boolean;
  systemAlerts: boolean;
  adminNotifications: boolean;
}

export default function NotificationPreferencesPage() {
  const t = useTranslations("dashboard");
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const PREF_ITEMS: Array<{
    key: keyof Omit<Preferences, "id">;
    labelKey: string;
    descKey: string;
    icon: typeof Bell;
    categoryKey: string;
  }> = [
    {
      key: "bookingUpdates",
      labelKey: "bookingUpdates",
      descKey: "bookingUpdatesDesc",
      icon: Calendar,
      categoryKey: "bookingsCategory",
    },
    {
      key: "paymentUpdates",
      labelKey: "paymentNotifications",
      descKey: "paymentNotificationsDesc",
      icon: CreditCard,
      categoryKey: "paymentsCategory",
    },
    {
      key: "reviewRequests",
      labelKey: "reviewRequests",
      descKey: "reviewRequestsDesc",
      icon: Star,
      categoryKey: "feedbackCategory",
    },
    {
      key: "systemAlerts",
      labelKey: "systemAlerts",
      descKey: "systemAlertsDesc",
      icon: Shield,
      categoryKey: "systemCategory",
    },
    {
      key: "adminNotifications",
      labelKey: "adminNotifications",
      descKey: "adminNotificationsDesc",
      icon: Settings,
      categoryKey: "communicationCategory",
    },
    {
      key: "promotionalEmails",
      labelKey: "promotionalEmails",
      descKey: "promotionalEmailsDesc",
      icon: Mail,
      categoryKey: "marketingCategory",
    },
  ];

  useEffect(() => {
    fetch("/api/user/notification-preferences")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPreferences(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggle = (key: keyof Omit<Preferences, "id">) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleSave = async () => {
    if (!preferences) return;
    setSaving(true);
    try {
      const res = await fetch("/api/user/notification-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingUpdates: preferences.bookingUpdates,
          paymentUpdates: preferences.paymentUpdates,
          promotionalEmails: preferences.promotionalEmails,
          reviewRequests: preferences.reviewRequests,
          systemAlerts: preferences.systemAlerts,
          adminNotifications: preferences.adminNotifications,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(t("preferencesSaved"));
      } else {
        toast.error(t("preferencesFailed"));
      }
    } catch {
      toast.error(t("preferencesFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("failedToLoadProfile")}</p>
      </div>
    );
  }

  // Group by category
  const categories = PREF_ITEMS.reduce(
    (acc, item) => {
      const catName = t(item.categoryKey);
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(item);
      return acc;
    },
    {} as Record<string, typeof PREF_ITEMS>
  );

  const enabledCount = PREF_ITEMS.filter((item) => preferences[item.key]).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("notificationPreferences")}</h1>
        <p className="text-muted-foreground">
          {t("notificationPreferencesSubtitle")} {enabledCount} / {PREF_ITEMS.length} {t("ofEnabled")}.
        </p>
      </div>

      {Object.entries(categories).map(([category, items], idx) => (
        <Card key={category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{category}</CardTitle>
            <CardDescription>
              {items[0]?.categoryKey === "marketingCategory"
                ? t("controlMarketing")
                : `${t("manageCategorySettings")} ${category.toLowerCase()} ${t("notificationSettings")}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.key}>
                  {i > 0 && <Separator className="my-3" />}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                          {t(item.labelKey)}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">{t(item.descKey)}</p>
                      </div>
                    </div>
                    <Switch
                      id={item.key}
                      checked={preferences[item.key]}
                      onCheckedChange={() => handleToggle(item.key)}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {t("savePreferences")}
        </Button>
      </div>
    </div>
  );
}
