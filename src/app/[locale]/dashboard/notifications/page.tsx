"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { Bell, CheckCheck, Loader2, Info, CheckCircle, AlertTriangle, XCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; className: string }> = {
  INFO: { icon: <Info className="h-4 w-4" />, className: "bg-blue-500/10 text-blue-600" },
  SUCCESS: { icon: <CheckCircle className="h-4 w-4" />, className: "bg-emerald-500/10 text-emerald-600" },
  WARNING: { icon: <AlertTriangle className="h-4 w-4" />, className: "bg-amber-500/10 text-amber-600" },
  ERROR: { icon: <XCircle className="h-4 w-4" />, className: "bg-red-500/10 text-red-600" },
};

export default function DashboardNotificationsPage() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (filter === "unread") params.set("unread", "true");
      const res = await fetch(`/api/notifications?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
        setUnreadCount(json.unreadCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notifications.find((n) => n.id === id && !n.isRead)) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("notifications")}</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} ${unreadCount !== 1 ? t("unreadNotificationsPlural") : t("unreadNotifications")}` : t("allCaughtUp")}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" /> {t("markAllRead")}
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          {tc("all")}
        </Button>
        <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>
          {t("unread")} ({unreadCount})
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl font-medium">{filter === "unread" ? t("noUnreadNotifications") : t("noNotificationsYet")}</p>
          <p className="text-muted-foreground mt-1">{t("willNotifyYou")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.INFO;
            return (
              <Card
                key={n.id}
                className={`transition-colors ${!n.isRead ? "bg-primary/5 border-primary/20" : ""}`}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${config.className}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{n.title}</p>
                      {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDateTime(n.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.isRead && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(n.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteNotification(n.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
