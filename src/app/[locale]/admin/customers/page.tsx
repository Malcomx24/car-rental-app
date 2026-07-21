"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  Phone,
  Calendar,
  Shield,
  Star,
  Eye,
  X,
} from "lucide-react";

interface CustomerItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  avatar: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  _count: { bookings: number; reviews: number; favorites: number };
}

interface CustomerDetail extends CustomerItem {
  totalSpent: number;
  bookings: {
    id: string;
    bookingNumber: string;
    pickupDate: string;
    returnDate: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    car: { name: string; brand: { name: string } };
  }[];
  reviews: {
    id: string;
    rating: number;
    title: string;
    createdAt: string;
    car: { name: string };
  }[];
}

interface Stats {
  totalCustomers: number;
  activeCustomers: number;
  totalBookings: number;
  totalRevenue: number;
}

const ROLES = ["", "CUSTOMER", "ADMIN", "SUPER_ADMIN", "MANAGER", "EMPLOYEE"];

const bookingStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmée", className: "bg-blue-100 text-blue-800" },
  ACTIVE: { label: "Active", className: "bg-green-100 text-green-800" },
  COMPLETED: { label: "Terminée", className: "bg-gray-100 text-gray-800" },
  CANCELLED: { label: "Annulée", className: "bg-red-100 text-red-800" },
};

export default function AdminCustomersPage() {
  const t = useTranslations("admin");
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const roleConfig: Record<string, { label: string; className: string }> = {
    CUSTOMER: { label: t("customer"), className: "bg-blue-100 text-blue-800" },
    ADMIN: {
      label: "Administrateur",
      className: "bg-purple-100 text-purple-800",
    },
    SUPER_ADMIN: {
      label: "Super Administrateur",
      className: "bg-red-100 text-red-800",
    },
    MANAGER: { label: "Manager", className: "bg-amber-100 text-amber-800" },
    EMPLOYEE: { label: "Employee", className: "bg-green-100 text-green-800" },
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setCustomers(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
        if (json.stats) setStats(json.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter]);

  const openDetail = async (customerId: string) => {
    setDetailLoading(true);
    setSelectedCustomer(null);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`);
      const json = await res.json();
      if (json.success) setSelectedCustomer(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleActive = async (customer: CustomerItem) => {
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !customer.isActive }),
      });
      if (res.ok) fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("customerManagement")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("viewAndManageCustomers")}
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                <p className="text-xs text-muted-foreground">
                  {t("totalCustomersLabel")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeCustomers}</p>
                <p className="text-xs text-muted-foreground">
                  {t("activeCustomersLabel")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
                <p className="text-xs text-muted-foreground">
                  {t("totalBookingsStatLabel")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("totalRevenueLabel")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchByNameEmailPhone")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 outline-none dark:bg-input/30 dark:hover:bg-input/50"
            >
              <option value="">{t("allRoles")}</option>
              {ROLES.filter(Boolean).map((r) => (
                <option key={r} value={r}>
                  {roleConfig[r]?.label || r}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 outline-none dark:bg-input/30 dark:hover:bg-input/50"
            >
              <option value="all">{t("allStatus")}</option>
              <option value="active">{t("active")}</option>
              <option value="inactive">{t("inactive")}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    {t("customer")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    {t("role")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    {t("bookingsColumn")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    {t("reviewsColumn")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    {t("statusLabel")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    {t("joinedColumn")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      {t("noCustomersFoundMessage")}
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                            {c.avatar ? (
                              <img
                                src={c.avatar}
                                alt=""
                                className="h-9 w-9 rounded-full object-cover"
                              />
                            ) : (
                              `${c.firstName[0]}${c.lastName[0]}`.toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">
                              {c.firstName} {c.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {c.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig[c.role]?.className || "bg-gray-100 text-gray-800"}`}
                        >
                          {roleConfig[c.role]?.label || c.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{c._count.bookings}</td>
                      <td className="px-6 py-4 text-sm">{c._count.reviews}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {c.isActive ? t("active") : t("inactive")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openDetail(c.id)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title={t("viewDetailsTitle")}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                {t("showing")} {(page - 1) * 12 + 1}–
                {Math.min(page * 12, total)} {t("to")} {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t("page")} {page} {t("of")} {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {(selectedCustomer || detailLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-background rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : (
              selectedCustomer && (
                <>
                  <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                        {selectedCustomer.avatar ? (
                          <img
                            src={selectedCustomer.avatar}
                            alt=""
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          `${selectedCustomer.firstName[0]}${selectedCustomer.lastName[0]}`.toUpperCase()
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {selectedCustomer.firstName}{" "}
                          {selectedCustomer.lastName}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomer.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="p-2 rounded-md hover:bg-muted"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {selectedCustomer.phone || t("notProvided")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleConfig[selectedCustomer.role]?.className || ""}`}
                        >
                          {roleConfig[selectedCustomer.role]?.label ||
                            selectedCustomer.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {t("memberSince")}{" "}
                          {new Date(
                            selectedCustomer.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatCurrency(selectedCustomer.totalSpent)}{" "}
                          {t("spent")}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold">
                          {selectedCustomer._count.bookings}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("bookings")}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold">
                          {selectedCustomer._count.reviews}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("reviews")}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold">
                          {selectedCustomer._count.favorites}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("favorites")}
                        </p>
                      </div>
                    </div>

                    {/* Recent Bookings */}
                    {selectedCustomer.bookings.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm mb-3">
                          {t("recentBookings")}
                        </h3>
                        <div className="space-y-2">
                          {selectedCustomer.bookings.map((b) => (
                            <div
                              key={b.id}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm"
                            >
                              <div>
                                <p className="font-medium">
                                  #{b.bookingNumber}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {b.car.brand.name} {b.car.name}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {formatCurrency(Number(b.totalAmount))}
                                </p>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${bookingStatusConfig[b.status]?.className || ""}`}
                                >
                                  {bookingStatusConfig[b.status]?.label ||
                                    b.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Reviews */}
                    {selectedCustomer.reviews.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm mb-3">
                          {t("recentReviews")}
                        </h3>
                        <div className="space-y-2">
                          {selectedCustomer.reviews.map((r) => (
                            <div
                              key={r.id}
                              className="p-3 bg-muted/30 rounded-lg text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                                    />
                                  ))}
                                </div>
                                <span className="font-medium text-xs">
                                  {r.car.name}
                                </span>
                              </div>
                              {r.title && (
                                <p className="mt-1 text-muted-foreground">
                                  {r.title}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2 border-t">
                      <Button
                        variant={
                          selectedCustomer.isActive ? "destructive" : "default"
                        }
                        size="sm"
                        onClick={() => toggleActive(selectedCustomer)}
                      >
                        {selectedCustomer.isActive
                          ? t("deactivateAccount")
                          : t("activateAccount")}
                      </Button>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
