"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
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

export function Navbar() {
  const pathname = usePathname();
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
    : "Account";

  const initials = profile?.firstName && profile?.lastName
    ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    : "U";

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-6 w-6" />
          <span>DriveRent</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === link.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
                <DropdownMenuItem onClick={() => (window.location.href = "/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                {(profile?.role === "ADMIN" || profile?.role === "SUPER_ADMIN" || profile?.role === "MANAGER") && (
                  <DropdownMenuItem onClick={() => (window.location.href = "/admin")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => (window.location.href = "/dashboard/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
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
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/80 transition-colors"
              >
                Sign Up
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                  pathname === link.href
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
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/80 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
