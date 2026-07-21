"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";

interface AdminCar {
  id: string;
  name: string;
  slug: string;
  pricePerDay: number;
  year: number;
  status: string;
  isFeatured: boolean;
  isPublished: boolean;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  licensePlate: string;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  images: { url: string }[];
}

interface CarTableProps {
  cars: AdminCar[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  search: string;
  statusFilter: string;
  brandFilter: string;
  onSearch: (v: string) => void;
  onStatusFilter: (v: string) => void;
  onBrandFilter: (v: string) => void;
  onPageChange: (p: number) => void;
  onDelete: (id: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/10 text-emerald-600",
  RESERVED: "bg-amber-500/10 text-amber-600",
  RENTED: "bg-blue-500/10 text-blue-600",
  MAINTENANCE: "bg-orange-500/10 text-orange-600",
  CLEANING: "bg-purple-500/10 text-purple-600",
  OUT_OF_SERVICE: "bg-red-500/10 text-red-600",
};

export function CarTable({
  cars,
  total,
  page,
  totalPages,
  loading,
  search,
  statusFilter,
  brandFilter,
  onSearch,
  onStatusFilter,
  onBrandFilter,
  onPageChange,
  onDelete,
}: CarTableProps) {
  const t = useTranslations("admin");
  const [showFilters, setShowFilters] = useState(false);

  const STATUS_OPTIONS = [
    { value: "", label: t("allStatuses") },
    { value: "AVAILABLE", label: "Available" },
    { value: "RESERVED", label: "Reserved" },
    { value: "RENTED", label: "Rented" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "CLEANING", label: "Cleaning" },
    { value: "OUT_OF_SERVICE", label: "Out of Service" },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("carSearchPlaceholder")}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          {t("filters")}
          {(statusFilter || brandFilter) && (
            <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {(statusFilter ? 1 : 0) + (brandFilter ? 1 : 0)}
            </span>
          )}
        </Button>
        <Link href="/admin/cars/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("addCar")}
          </Button>
        </Link>
      </div>

      {/* Filters Row */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg border bg-muted/30">
          <div className="flex-1">
            <label className="text-xs font-medium mb-1 block">
              {t("statusLabel")}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilter(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 outline-none dark:bg-input/30 dark:hover:bg-input/50"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {(statusFilter || brandFilter) && (
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onStatusFilter("");
                  onBrandFilter("");
                }}
              >
                <X className="h-4 w-4 mr-1" /> {t("clearFilters")}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium">
                    {t("carColumn")}
                  </th>
                  <th className="text-left p-4 text-sm font-medium hidden md:table-cell">
                    {t("categoryColumn")}
                  </th>
                  <th className="text-left p-4 text-sm font-medium">
                    {t("pricePerDay")}
                  </th>
                  <th className="text-left p-4 text-sm font-medium hidden sm:table-cell">
                    {t("yearColumn")}
                  </th>
                  <th className="text-left p-4 text-sm font-medium">
                    {t("statusLabel")}
                  </th>
                  <th className="text-left p-4 text-sm font-medium hidden lg:table-cell">
                    {t("ratingColumn")}
                  </th>
                  <th className="text-right p-4 text-sm font-medium">
                    {t("actionsColumn")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : cars.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-muted-foreground"
                    >
                      {t("noCarsFound")}
                    </td>
                  </tr>
                ) : (
                  cars.map((car) => (
                    <tr
                      key={car.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {car.images[0] ? (
                              <img
                                src={car.images[0].url}
                                alt={car.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                                {t("noImg")}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{car.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {car.brand?.name ?? "Unknown"} &middot;{" "}
                              {car.licensePlate}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-sm">
                          {car.category?.name ?? "Unknown"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium">
                          {formatCurrency(car.pricePerDay)}
                        </span>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-sm">{car.year}</span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={STATUS_COLORS[car.status]}
                        >
                          {car.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm">
                            {Number(car.averageRating).toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({car.totalReviews})
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              />
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link
                                href={`/cars/${car.slug}`}
                                target="_blank"
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" /> {t("viewPublic")}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/admin/cars/${car.id}`}
                                className="flex items-center gap-2"
                              >
                                <Pencil className="h-4 w-4" /> {t("edit")}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDelete(car.id)}
                            >
                              <Trash2 className="h-4 w-4" /> {t("delete")}
                            </DropdownMenuItem>
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
            {t("showing")} {(page - 1) * 12 + 1}–{Math.min(page * 12, total)}{" "}
            {t("to")} {total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2;
              if (p < 1 || p > totalPages) return null;
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
