"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Bell, Mail, Calendar, CreditCard, Star, Shield, Settings } from "lucide-react";
import { toast } from "sonner";

interface Preferences {
  id: string;
  bookingUpdates: boolean;
  paymentUpdates: boolean;
  promotionalEmails: boolean;
  reviewRequests: boolean;
  systemAlerts: boolean;
  adminNotifications: boolean;
}

const PREF_ITEMS: Array<{
  key: keyof Omit<Preferences, "id">;
  label: string;
  description: string;
  icon: typeof Bell;
  category: string;
}> = [
  {
    key: "bookingUpdates",
    label: "Booking Updates",
    description: "Get notified when your booking status changes (confirmed, active, completed, cancelled)",
    icon: Calendar,
    category: "Bookings",
  },
  {
    key: "paymentUpdates",
    label: "Payment Notifications",
    description: "Receive alerts for payment confirmations, receipts, and refund updates",
    icon: CreditCard,
    category: "Payments",
  },
  {
    key: "reviewRequests",
    label: "Review Requests",
    description: "Get a reminder to leave a review after completing a rental",
    icon: Star,
    category: "Feedback",
  },
  {
    key: "systemAlerts",
    label: "System Alerts",
    description: "Important system announcements and service updates",
    icon: Shield,
    category: "System",
  },
  {
    key: "adminNotifications",
    label: "Admin Notifications",
    description: "Receive messages sent by our admin team",
    icon: Settings,
    category: "Communication",
  },
  {
    key: "promotionalEmails",
    label: "Promotional Emails",
    description: "Receive emails about special offers, new cars, and exclusive deals",
    icon: Mail,
    category: "Marketing",
  },
];

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        toast.success("Preferences saved successfully");
      } else {
        toast.error("Failed to save preferences");
      }
    } catch {
      toast.error("Failed to save preferences");
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
        <p className="text-muted-foreground">Failed to load preferences</p>
      </div>
    );
  }

  // Group by category
  const categories = PREF_ITEMS.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof PREF_ITEMS>
  );

  const enabledCount = PREF_ITEMS.filter((item) => preferences[item.key]).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notification Preferences</h1>
        <p className="text-muted-foreground">
          Choose which notifications you&apos;d like to receive. {enabledCount} of {PREF_ITEMS.length} enabled.
        </p>
      </div>

      {Object.entries(categories).map(([category, items], idx) => (
        <Card key={category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{category}</CardTitle>
            <CardDescription>
              {category === "Marketing"
                ? "Control marketing communications"
                : `Manage your ${category.toLowerCase()} notification settings`}
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
                          {item.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
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
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
