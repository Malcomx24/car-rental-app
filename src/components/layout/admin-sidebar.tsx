"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  Car,
  LogOut,
  ChevronLeft,
  LayoutDashboard,
  CalendarDays,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Wrench,
  Bell,
  FileText,
  Star,
  Tag,
  FolderOpen,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AdminSidebar() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: t("dashboard"), href: "/admin", icon: LayoutDashboard },
    { label: t("carManagement"), href: "/admin/cars", icon: Car },
    { label: t("brandManagement"), href: "/admin/brands", icon: Tag },
    { label: t("categoryManagement"), href: "/admin/categories", icon: FolderOpen },
    { label: t("locationManagement"), href: "/admin/locations", icon: MapPin },
    { label: t("bookingManagement"), href: "/admin/bookings", icon: CalendarDays },
    { label: t("customerManagement"), href: "/admin/customers", icon: Users },
    { label: t("reviewManagement"), href: "/admin/reviews", icon: Star },
    { label: t("paymentManagement"), href: "/admin/payments", icon: CreditCard },
    { label: "Maintenance", href: "/admin/maintenance", icon: Wrench },
    { label: t("reportManagement"), href: "/admin/reports", icon: BarChart3 },
    { label: t("notificationManagement"), href: "/admin/notifications", icon: Bell },
    { label: "Invoices", href: "/admin/invoices", icon: FileText },
    { label: t("settings"), href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
            <Car className="h-6 w-6 text-primary" />
            <span>DriveRent</span>
          </Link>
        )}
        {collapsed && <Car className="h-6 w-6 text-primary mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hidden lg:flex h-8 w-8 shrink-0",
            collapsed && "mx-auto mt-2"
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-sidebar-accent/50 text-sidebar-foreground/60",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>{tc("backToSite")}</span>}
        </Link>
      </div>
    </aside>
  );
}
