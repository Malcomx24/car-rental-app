"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, Loader2, Eye, MoreHorizontal, CheckCircle, XCircle, PlayCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AdminBookingItem {
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
  user: { firstName: string; lastName: string; email: string };
}

const STATUS_FILTERS = ["", "PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"];

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBookingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", String(page));
      params.set("limit", "12");

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

  const updateStatus = async (id: string, status: string, reason?: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, cancellationReason: reason }),
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-muted-foreground mt-1">{total} total bookings</p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {s ? s.replace("_", " ") : "All"}
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by booking number, car, or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium">Booking</th>
                  <th className="text-left p-4 text-sm font-medium hidden md:table-cell">Customer</th>
                  <th className="text-left p-4 text-sm font-medium hidden lg:table-cell">Dates</th>
                  <th className="text-left p-4 text-sm font-medium">Amount</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-right p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No bookings found</td></tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {b.car.images[0] ? (
                              <img src={b.car.images[0].url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">#{b.bookingNumber}</p>
                            <p className="text-xs text-muted-foreground">{b.car.brand.name} {b.car.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-sm">{b.user.firstName} {b.user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{b.user.email}</p>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <p className="text-sm">{formatDate(b.pickupDate)}</p>
                        <p className="text-xs text-muted-foreground">to {formatDate(b.returnDate)} ({b.totalDays}d)</p>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium">{formatCurrency(b.totalAmount)}</span>
                      </td>
                      <td className="p-4">
                        <BookingStatusBadge status={b.status} />
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={updating === b.id} />
                          }>
                              {updating === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/admin/bookings/${b.id}`} className="flex items-center gap-2">
                                <Eye className="h-4 w-4" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            {b.status === "PENDING" && (
                              <DropdownMenuItem onClick={() => updateStatus(b.id, "CONFIRMED")}>
                                <CheckCircle className="h-4 w-4" /> Confirm
                              </DropdownMenuItem>
                            )}
                            {b.status === "CONFIRMED" && (
                              <DropdownMenuItem onClick={() => updateStatus(b.id, "ACTIVE")}>
                                <PlayCircle className="h-4 w-4" /> Start Rental
                              </DropdownMenuItem>
                            )}
                            {b.status === "ACTIVE" && (
                              <DropdownMenuItem onClick={() => updateStatus(b.id, "COMPLETED")}>
                                <CheckCircle className="h-4 w-4" /> Complete
                              </DropdownMenuItem>
                            )}
                            {["PENDING", "CONFIRMED"].includes(b.status) && (
                              <DropdownMenuItem className="text-destructive" onClick={() => updateStatus(b.id, "CANCELLED", "Cancelled by admin")}>
                                <XCircle className="h-4 w-4" /> Cancel
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * 12) + 1}–{Math.min(page * 12, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
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
        </div>
      )}
    </div>
  );
}
