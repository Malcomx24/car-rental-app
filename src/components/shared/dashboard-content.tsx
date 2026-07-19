"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CalendarDays, Car, DollarSign, Heart, Loader2, ArrowRight, MapPin, Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardStats {
  activeBookings: number;
  totalSpent: number;
  totalBookings: number;
  favorites: number;
}

interface RecentBooking {
  id: string;
  bookingNumber: string;
  pickupDate: string;
  totalAmount: number;
  status: string;
  car: {
    name: string;
    brand: { name: string };
    images: { url: string }[];
  };
}

interface FavoriteCar {
  id: string;
  name: string;
  pricePerDay: number;
  brand: { name: string };
  category: { name: string };
  averageRating: number;
  images: { url: string }[];
}

export default function DashboardOverview() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const tNav = useTranslations("nav");
  const [stats, setStats] = useState<DashboardStats>({ activeBookings: 0, totalSpent: 0, totalBookings: 0, favorites: 0 });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [favorites, setFavorites] = useState<FavoriteCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bookingsRes, favsRes] = await Promise.all([
          fetch("/api/bookings?limit=5"),
          fetch("/api/favorites?limit=4"),
        ]);
        const bookingsJson = await bookingsRes.json();
        const favsJson = await favsRes.json();

        if (bookingsJson.success) {
          const bookings = bookingsJson.data;
          setRecentBookings(bookings);
          setStats({
            activeBookings: bookings.filter((b: { status: string }) => ["PENDING", "CONFIRMED", "ACTIVE"].includes(b.status)).length,
            totalSpent: bookings.filter((b: { status: string }) => ["CONFIRMED", "ACTIVE", "COMPLETED"].includes(b.status)).reduce((sum: number, b: { totalAmount: number }) => sum + b.totalAmount, 0),
            totalBookings: bookingsJson.pagination.total,
            favorites: 0,
          });
        }
        if (favsJson.success) {
          setFavorites(favsJson.data);
          setStats((prev) => ({ ...prev, favorites: favsJson.pagination?.total || favsJson.data.length }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const quickLinks = [
    { label: t("browseCars"), href: "/cars", icon: <Car className="h-5 w-5" /> },
    { label: t("myBookings"), href: "/dashboard/bookings", icon: <CalendarDays className="h-5 w-5" /> },
    { label: t("invoices"), href: "/dashboard/invoices", icon: <DollarSign className="h-5 w-5" /> },
    { label: tNav("settings"), href: "/dashboard/settings", icon: <Heart className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t("welcomeBack")}</h1>
        <p className="text-muted-foreground mt-1">{t("overviewSubtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10"><Car className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t("activeBookings")}</p>
              <p className="text-2xl font-bold">{stats.activeBookings}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalSpent")}</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><CalendarDays className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalBookings")}</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10"><Heart className="h-5 w-5 text-red-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t("favorites")}</p>
              <p className="text-2xl font-bold">{stats.favorites}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t("recentBookings")}</h2>
          <Link href="/dashboard/bookings">
            <Button variant="ghost" size="sm">{tc("viewAll")} <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">{t("noBookingsYet")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("startByBrowsing")}</p>
              <Link href="/cars"><Button className="mt-4" size="sm">{t("browseCars")}</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <Link key={b.id} href={`/dashboard/bookings/${b.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-14 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {b.car.images[0] ? (
                        <img src={b.car.images[0].url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center"><Car className="h-5 w-5 text-muted-foreground" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{b.car.brand.name} {b.car.name}</p>
                        <BookingStatusBadge status={b.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(b.pickupDate)}</p>
                    </div>
                    <p className="font-semibold text-right">{formatCurrency(b.totalAmount)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t("yourFavorites")}</h2>
            <Link href="/dashboard/favorites">
              <Button variant="ghost" size="sm">{tc("viewAll")} <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favorites.map((car) => (
              <Link key={car.id} href={`/cars/${car.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="aspect-[16/10] bg-muted overflow-hidden">
                    {car.images[0] ? (
                      <img src={car.images[0].url} alt={car.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center"><Car className="h-6 w-6 text-muted-foreground" /></div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">{car.brand.name}</p>
                    <p className="font-medium text-sm truncate">{car.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">${Number(car.pricePerDay).toFixed(0)}<span className="text-xs text-muted-foreground font-normal">{tc("perDay")}</span></span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs">{Number(car.averageRating).toFixed(1)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-primary">{link.icon}</div>
                <span className="font-medium text-sm">{link.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
