"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, MoreHorizontal, ChevronLeft, ChevronRight, Loader2, DollarSign, CreditCard, RotateCcw } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId: string | null;
  paymentMethod: string | null;
  description: string | null;
  refundAmount: number | null;
  createdAt: string;
  booking: {
    id: string;
    bookingNumber: string;
    car: { name: string; brand: { name: string } };
  };
}

const STATUS_COLORS: Record<string, string> = {
  SUCCEEDED: "bg-emerald-500/10 text-emerald-600",
  PENDING: "bg-amber-500/10 text-amber-600",
  FAILED: "bg-red-500/10 text-red-600",
  REFUNDED: "bg-purple-500/10 text-purple-600",
};

export default function AdminPaymentsPage() {
  const t = useTranslations("admin");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/payments?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setPayments(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const totalRevenue = payments.filter((p) => p.status === "SUCCEEDED").reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter((p) => p.status === "REFUNDED").reduce((sum, p) => sum + (p.refundAmount || p.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("paymentManagement")}</h1>
        <p className="text-muted-foreground mt-1">{total} {t("totalTransactions")}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalRevenue")}</p>
              <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><CreditCard className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t("pending")}</p>
              <p className="text-xl font-bold">{formatCurrency(payments.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0))}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10"><RotateCcw className="h-5 w-5 text-purple-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t("refunded")}</p>
              <p className="text-xl font-bold">{formatCurrency(totalRefunded)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchByBookingNumber")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium">{t("transaction")}</th>
                  <th className="text-left p-4 text-sm font-medium hidden md:table-cell">{t("bookingNumberColumn")}</th>
                  <th className="text-left p-4 text-sm font-medium">{t("amount")}</th>
                  <th className="text-left p-4 text-sm font-medium">{t("statusLabel")}</th>
                  <th className="text-left p-4 text-sm font-medium hidden lg:table-cell">{t("dateColumn")}</th>
                  <th className="text-right p-4 text-sm font-medium">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
                ) : payments.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">{t("noPaymentsFound")}</td></tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-mono">{p.id.slice(0, 8)}...</p>
                        <p className="text-xs text-muted-foreground">{p.description || t("na")}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Link href={`/admin/bookings/${p.booking.id}`} className="text-sm text-primary hover:underline">
                          #{p.booking.bookingNumber}
                        </Link>
                        <p className="text-xs text-muted-foreground">{p.booking.car.brand.name} {p.booking.car.name}</p>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium">{formatCurrency(p.amount)}</span>
                        {p.refundAmount && p.refundAmount > 0 && (
                          <p className="text-xs text-red-600">{t("refundedLabel")}: {formatCurrency(p.refundAmount)}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={STATUS_COLORS[p.status]}>
                          {p.status === "PENDING" ? t("pending") :
                           p.status === "SUCCEEDED" ? t("succeeded") :
                           p.status === "FAILED" ? t("failed") :
                           p.status === "REFUNDED" ? t("refunded") : p.status}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-sm">{formatDate(p.createdAt)}</span>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="h-8 w-8" />
                          }>
                              <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/admin/bookings/${p.booking.id}`} className="flex items-center gap-2">
                                {t("viewBooking")}
                              </Link>
                            </DropdownMenuItem>
                            {p.stripePaymentIntentId && (
                              <DropdownMenuItem className="text-xs text-muted-foreground">
                                PI: {p.stripePaymentIntentId.slice(0, 20)}...
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("showing")} {((page - 1) * 15) + 1}–{Math.min(page * 15, total)} {t("to")} {total}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
