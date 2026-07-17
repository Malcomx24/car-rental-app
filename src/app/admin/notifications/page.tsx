"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  BellRing,
  CheckCheck,
  Send,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { formatDateTime, cn } from "@/lib/utils";

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  readAt: string | null;
  link: string | null;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; avatar: string | null };
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: { type: string; count: number }[];
}

const TYPE_CONFIG: Record<string, { icon: typeof Info; color: string; bg: string }> = {
  INFO: { icon: Info, color: "text-blue-600", bg: "bg-blue-100" },
  SUCCESS: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  WARNING: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" },
  ERROR: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
};

export default function AdminNotificationsPage() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendForm, setSendForm] = useState({
    title: "",
    message: "",
    type: "INFO" as string,
    targetEmail: "",
    sendEmail: false,
  });

  const isAdmin = ["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(profile?.role || "");

  const { data: notifData, isLoading } = useQuery({
    queryKey: ["admin-notifications", page, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (typeFilter !== "ALL") params.set("type", typeFilter);
      const res = await fetch(`/api/admin/notifications?${params}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: isAdmin,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/read-all", { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (form: typeof sendForm) => {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          message: form.message,
          type: form.type,
          sendEmail: form.sendEmail,
          ...(form.targetEmail ? { userIds: [] } : {}),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Notification sent");
      setSendDialogOpen(false);
      setSendForm({ title: "", message: "", type: "INFO", targetEmail: "", sendEmail: false });
    },
    onError: () => toast.error("Failed to send notification"),
  });

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Access denied</p>
      </div>
    );
  }

  const notifications: AdminNotification[] = notifData?.data || [];
  const stats: NotificationStats = notifData?.stats || { total: 0, unread: 0, byType: [] };
  const pagination = notifData?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage system notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => markAllReadMutation.mutate()} disabled={markAllReadMutation.isPending}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
            <DialogTrigger render={<Button size="sm" />}>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Notification title"
                    value={sendForm.title}
                    onChange={(e) => setSendForm((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Notification message"
                    rows={4}
                    value={sendForm.message}
                    onChange={(e) => setSendForm((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={sendForm.type} onValueChange={(v) => setSendForm((p) => ({ ...p, type: v ?? "INFO" }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INFO">Info</SelectItem>
                      <SelectItem value="SUCCESS">Success</SelectItem>
                      <SelectItem value="WARNING">Warning</SelectItem>
                      <SelectItem value="ERROR">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full"
                  onClick={() => sendMutation.mutate(sendForm)}
                  disabled={sendMutation.isPending || !sendForm.title || !sendForm.message}
                >
                  {sendMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Send
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <BellRing className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.unread}</p>
                <p className="text-xs text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {stats.byType.slice(0, 2).map((t) => {
          const config = TYPE_CONFIG[t.type] || TYPE_CONFIG.INFO;
          const Icon = config.icon;
          return (
            <Card key={t.type}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", config.bg)}>
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{t.count}</p>
                    <p className="text-xs text-muted-foreground capitalize">{t.type.toLowerCase()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {["ALL", "INFO", "SUCCESS", "WARNING", "ERROR"].map((t) => (
          <Button
            key={t}
            variant={typeFilter === t ? "default" : "outline"}
            size="sm"
            onClick={() => { setTypeFilter(t); setPage(1); }}
            className="h-8 text-xs"
          >
            {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm text-muted-foreground">There are no notifications matching this filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.INFO;
            const Icon = config.icon;
            return (
              <Card
                key={notif.id}
                className={cn(
                  "transition-colors hover:bg-accent/50",
                  !notif.isRead && "border-l-4 border-l-primary bg-primary/5"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", config.bg)}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{notif.title}</h4>
                        {!notif.isRead && <Badge className="text-[10px] px-1.5 py-0">New</Badge>}
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">{notif.type.toLowerCase()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          To: {notif.user.firstName} {notif.user.lastName} ({notif.user.email})
                        </span>
                        <span>{formatDateTime(notif.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notif.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => markReadMutation.mutate(notif.id)}
                          disabled={markReadMutation.isPending}
                        >
                          <CheckCheck className="h-3.5 w-3.5 mr-1" />
                          Read
                        </Button>
                      )}
                      {notif.link && (
                        <a href={notif.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
