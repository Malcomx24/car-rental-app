"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_LINKS } from "@/lib/constants";
import { Car, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navContent = (
    <nav className="flex flex-col gap-1 p-2">
      {DASHBOARD_NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === link.href
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <div className="hidden lg:flex flex-col w-64 border-r bg-muted/30 min-h-full">
        <div className="flex items-center gap-2 p-4 font-bold text-lg">
          <Car className="h-6 w-6" />
          <span>My Account</span>
        </div>
        {navContent}
        <div className="mt-auto p-2 border-t">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Back to Site</span>
          </Link>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button size="icon" className="rounded-full shadow-lg h-12 w-12" />}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center gap-2 p-4 font-bold text-lg border-b">
              <Car className="h-6 w-6" />
              <span>My Account</span>
            </div>
            {navContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
