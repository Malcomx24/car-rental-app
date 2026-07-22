"use client";

import { Link, usePathname } from "@/i18n/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
  Car,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

function stripLocale(path: string): string {
  return path.replace(/^\/(en|fr|ar)(\/|$)/, "/") || "/";
}

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
}

export function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
  const rawPathname = usePathname();
  const locale = rawPathname.match(/^\/(en|fr|ar)/)?.[1] || "fr";
  const pathname = stripLocale(rawPathname);
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "Admin";

  const initials = profile?.firstName && profile?.lastName
    ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    : "AD";

  const pageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    return last ? last.charAt(0).toUpperCase() + last.slice(1) : "Admin";
  };

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-lg flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{pageTitle()}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 w-64 bg-muted/50"
          />
        </div>

        {/* Notifications */}
        <Link
          href="/admin/notifications"
          className="relative inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Link>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="sm" className="gap-2" />
          }>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={displayName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium">{displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {profile?.role || "Admin"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => (window.location.href = "/" + locale + "/admin")}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = "/" + locale + "/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = "/" + locale)}>
              <Car className="mr-2 h-4 w-4" />
              View Site
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => (window.location.href = "/")}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
