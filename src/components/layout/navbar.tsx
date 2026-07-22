"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

function extractLocale(path: string): string {
  return path.match(/^\/(en|fr|ar)/)?.[1] || "fr";
}

function stripLocale(path: string): string {
  return path.replace(/^\/(en|fr|ar)(\/|$)/, "/") || "/";
}
import {
  Car,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";
import { useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = extractLocale(pathname);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isLoaded, isSignedIn, profile } = useAuth();
  const { signOut } = useClerk();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : t("myAccount");

  const initials = profile?.firstName && profile?.lastName
    ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    : "U";

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("cars"), href: "/cars" },
    { label: t("locations"), href: "/locations" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-6 w-6" />
          <span>DriveRent</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                stripLocale(pathname) === link.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}

          {!isLoaded && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
              <div className="h-8 w-16 rounded-md bg-primary/20 animate-pulse" />
            </div>
          )}

          {isLoaded && isSignedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="sm" className="gap-2" />
              }>
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={displayName}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <span className="hidden sm:inline-block text-sm font-medium">
                    {displayName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {profile?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => (window.location.href = "/" + locale + "/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t("dashboard")}
                </DropdownMenuItem>
                {(profile?.role === "ADMIN" || profile?.role === "SUPER_ADMIN" || profile?.role === "MANAGER") && (
                  <DropdownMenuItem onClick={() => (window.location.href = "/" + locale + "/admin")}>
                    <Settings className="mr-2 h-4 w-4" />
                    {t("adminPanel")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => (window.location.href = "/" + locale + "/dashboard/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t("settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isLoaded && !isSignedIn && (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-lg bg-black text-white hover:bg-neutral-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80 px-3 py-1.5 text-sm font-medium transition-colors"
              >
                {t("signUp")}
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col gap-1 p-4">
            {navItems.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                  stripLocale(pathname) === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isSignedIn && (
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg bg-black text-white hover:bg-neutral-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80 px-4 py-2 text-sm font-medium transition-colors"
                >
                  {t("signUp")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
