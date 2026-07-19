"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Search, Calendar, MapPin, Car, ChevronLeft, ChevronRight, Loader2, Eye, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface BookingItem {
  id: string;
  bookingNumber: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  car: {
    id: string;
    name: string;
    brand: { name: string };
    images: { url: string }[];
  };
  pickupLocation: { name: string; city: string };
  dropoffLocation: { name: string; city: string };
}

export default function DashboardBookingsPage() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const STATUS_FILTERS = [
    { value: "", label: t("allBookings") },
    { value: "PENDING", label: t("pending") },
    { value: "CONFIRMED", label: t("confirmed") },
    { value: "ACTIVE", label: t("active") },
    { value: "COMPLETED", label: t("completed") },
    { value: "CANCELLED", label: t("cancelled") },
  ];

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", String(page));
      params.set("limit", "10");

      const res = await fetch(`/api/bookings?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleCancel = async (id: string) => {
    if (!confirm(t("cancelBookingConfirm"))) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED", cancellationReason: "Cancelled by customer" }),
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("myBookings")}</h1>
        <p className="text-muted-foreground mt-1">{t("myBookingsSubtitle")}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUS_FILTERS.slice(1).map((s) => {
          const count = bookings.filter((b) => b.status === s.value).length;
          return (
            <button
              key={s.value}
              onClick={() => setStatusFilter(statusFilter === s.value ? "" : s.value)}
              className={`p-3 rounded-xl border text-left transition-colors ${statusFilter === s.value ? "bg-primary/10 border-primary" : "bg-card hover:bg-muted/50"}`}
            >
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold mt-1">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchBookingsPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16">
          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl font-medium">{t("noBookingsFound")}</p>
          <p className="text-muted-foreground mt-1">{t("tryDifferentSearch")}</p>
          <Link href="/cars">
            <Button className="mt-4">{t("browseCars")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                {/* Car Image */}
                <div className="sm:w-48 h-32 sm:h-auto bg-muted overflow-hidden flex-shrink-0">
                  {booking.car.images[0] ? (
                    <img src={booking.car.images[0].url} alt={booking.car.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center"><Car className="h-8 w-8 text-muted-foreground" /></div>
                  )}
                </div>

                {/* Details */}
                <CardContent className="flex-1 p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{booking.car.brand.name} {booking.car.name}</h3>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">#{booking.bookingNumber}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(booking.pickupDate)} — {formatDate(booking.returnDate)}</span>
                        <span>{booking.totalDays} {booking.totalDays !== 1 ? tc("days") : tc("day")}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{booking.pickupLocation.name} → {booking.dropoffLocation.name}</span>
                      </div>
                    </div>
                    <div className="text-right sm:text-right">
                      <p className="text-2xl font-bold">{formatCurrency(booking.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">{tc("total")}</p>
                      <div className="flex gap-2 mt-3 justify-end">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}>
                          <Eye className="h-4 w-4 mr-1" /> {t("details")}
                        </Button>
                        {["PENDING", "CONFIRMED"].includes(booking.status) && (
                          <Button size="sm" variant="destructive" onClick={() => handleCancel(booking.id)}>
                            <XCircle className="h-4 w-4 mr-1" /> {t("cancel")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = page <= 3 ? i + 1 : page + i - 2;
            if (p < 1 || p > totalPages) return null;
            return (
              <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)}>
                {p}
              </Button>
            );
          })}
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
