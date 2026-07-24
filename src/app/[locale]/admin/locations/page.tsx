"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreHorizontal,
  Loader2,
  MapPin,
  Plane,
  Building2,
} from "lucide-react";

interface Location {
  id: string;
  name: string;
  slug: string;
  address: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  isAirport: boolean;
  isActive: boolean;
  createdAt: string;
  _count: { bookingsPickup: number; bookingsDropoff: number };
}

interface FormData {
  name: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  latitude: string;
  longitude: string;
  isAirport: boolean;
  isActive: boolean;
}

const EMPTY_FORM: FormData = {
  name: "",
  address: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  phone: "",
  email: "",
  latitude: "",
  longitude: "",
  isAirport: false,
  isActive: true,
};

export default function AdminLocationsPage() {
  const t = useTranslations("admin");
  const [locations, setLocations] = useState<Location[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", "20");
      params.set("admin", "true");

      const res = await fetch(`/api/locations?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLocations(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch {
      showToast("error", t("failedToFetchLocations"));
    } finally {
      setLoading(false);
    }
  }, [search, page, t]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const openCreate = () => {
    setEditingLocation(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (location: Location) => {
    setEditingLocation(location);
    setForm({
      name: location.name,
      address: location.address,
      addressLine2: location.addressLine2 || "",
      city: location.city,
      state: location.state,
      country: location.country,
      zipCode: location.zipCode,
      phone: location.phone,
      email: location.email || "",
      latitude: location.latitude?.toString() || "",
      longitude: location.longitude?.toString() || "",
      isAirport: location.isAirport,
      isActive: location.isActive,
    });
    setErrors({});
    setDialogOpen(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("validationLocationNameRequired");
    if (form.name.trim().length > 100) e.name = t("validationLocationNameMax");
    if (!form.address.trim()) e.address = t("validationAddressRequired");
    if (!form.city.trim()) e.city = t("validationCityRequired");
    if (!form.state.trim()) e.state = t("validationStateRequired");
    if (!form.country.trim()) e.country = t("validationCountryRequired");
    if (!form.zipCode.trim()) e.zipCode = t("validationZipCodeRequired");
    if (!form.phone.trim()) e.phone = t("validationPhoneRequired");
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("validationValidEmail");
    if (form.latitude && (isNaN(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90)) {
      e.latitude = t("validationLatitudeRange");
    }
    if (form.longitude && (isNaN(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180)) {
      e.longitude = t("validationLongitudeRange");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        addressLine2: form.addressLine2.trim() || null,
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        zipCode: form.zipCode.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        isAirport: form.isAirport,
        isActive: form.isActive,
      };

      const isEdit = !!editingLocation;
      const url = isEdit ? `/api/locations/${editingLocation.id}` : "/api/locations";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || t("failedToSaveLocation"));
      }

      setDialogOpen(false);
      showToast("success", isEdit ? t("locationUpdated") : t("locationCreated"));
      fetchLocations();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("failedToSaveLocation");
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (location: Location) => {
    const totalBookings = location._count.bookingsPickup + location._count.bookingsDropoff;
    if (totalBookings > 0) {
      showToast("error", t("cannotDeleteLocation", { name: location.name, count: String(totalBookings) }));
      return;
    }
    if (!confirm(t("deleteLocationConfirm", { name: location.name }))) return;
    try {
      const res = await fetch(`/api/locations/${location.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("failedToDeleteLocation"));
      showToast("success", t("locationDeleted"));
      fetchLocations();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("failedToDeleteLocation");
      showToast("error", msg);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-500/15 text-green-700 dark:text-green-400"
              : "bg-red-500/15 text-red-700 dark:text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("locationManagement")}</h1>
          <p className="text-muted-foreground mt-1">{total} {t("pickupDropoffZones")}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addLocation")}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchLocations")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : locations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">{t("noLocationsFound")}</p>
            <p className="text-muted-foreground text-sm mt-1">
              {search ? t("noResultsSearchDifferent") : t("clickToAddFirst") + " \"" + t("addLocation") + "\" " + t("toCreateFirst") + " " + t("locationZone")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {locations.map((location) => {
            const totalBookings = location._count.bookingsPickup + location._count.bookingsDropoff;
            return (
              <Card key={location.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      {location.isAirport ? (
                        <Plane className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{location.name}</p>
                        {location.isAirport && (
                          <Badge variant="secondary" className="text-xs">
                            {t("airport")}
                          </Badge>
                        )}
                        {!location.isActive && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            {t("inactive")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{location.address}</span>
                        <span>·</span>
                        <span>{location.city}, {location.state}</span>
                        <span>·</span>
                        <Badge variant="secondary" className="text-xs">
                          {totalBookings} {totalBookings === 1 ? t("booking") : t("bookingsCount")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(location)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(location)}
                        className="text-destructive focus:text-destructive"
                        disabled={totalBookings > 0}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {t("previous")}
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
            {t("next")}
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && setDialogOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLocation ? t("editLocation") : t("addNewLocation")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>{t("locationName")} *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Downtown Manhattan"
                className="mt-1"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t("address")} *</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="e.g. 350 5th Avenue"
                  className="mt-1"
                />
                {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
              </div>
              <div>
                <Label>{t("addressLine2")}</Label>
                <Input
                  value={form.addressLine2}
                  onChange={(e) => setForm((p) => ({ ...p, addressLine2: e.target.value }))}
                  placeholder="Suite, floor, etc."
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label>{t("city")} *</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="e.g. Casablanca"
                  className="mt-1"
                />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label>{t("state")} *</Label>
                <Input
                  value={form.state}
                  onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                  placeholder="e.g. Casablanca-Settat"
                  className="mt-1"
                />
                {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label>{t("country")} *</Label>
                <Input
                  value={form.country}
                  onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                  placeholder="e.g. US"
                  className="mt-1"
                />
                {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
              </div>
              <div>
                <Label>{t("zipCode")} *</Label>
                <Input
                  value={form.zipCode}
                  onChange={(e) => setForm((p) => ({ ...p, zipCode: e.target.value }))}
                  placeholder="e.g. 10118"
                  className="mt-1"
                />
                {errors.zipCode && <p className="text-xs text-destructive mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t("phone")} *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="e.g. +212 522 12 34 56"
                  className="mt-1"
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label>{t("email")}</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="e.g. location@driverent.com"
                  className="mt-1"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t("latitude")}</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))}
                  placeholder="e.g. 40.7484"
                  className="mt-1"
                />
                {errors.latitude && <p className="text-xs text-destructive mt-1">{errors.latitude}</p>}
              </div>
              <div>
                <Label>{t("longitude")}</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))}
                  placeholder="e.g. -73.9857"
                  className="mt-1"
                />
                {errors.longitude && <p className="text-xs text-destructive mt-1">{errors.longitude}</p>}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAirport}
                  onChange={(e) => setForm((p) => ({ ...p, isAirport: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium">{t("airportLocation")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium">{t("active")}</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingLocation ? t("saveChanges") : t("createLocation")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
