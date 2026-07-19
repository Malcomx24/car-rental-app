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
  Car,
} from "lucide-react";

interface Brand {
  id: string;
  name: string;
  logo: string | null;
  country: string | null;
  createdAt: string;
  _count: { cars: number };
}

interface FormData {
  name: string;
  logo: string;
  country: string;
}

const EMPTY_FORM: FormData = { name: "", logo: "", country: "" };

export default function AdminBrandsPage() {
  const t = useTranslations("admin");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/brands?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setBrands(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch {
      showToast("error", t("failedToFetchBrands"));
    } finally {
      setLoading(false);
    }
  }, [search, page, t]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

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
    setEditingBrand(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setForm({
      name: brand.name,
      logo: brand.logo || "",
      country: brand.country || "",
    });
    setErrors({});
    setDialogOpen(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("validationBrandNameRequired");
    if (form.name.trim().length > 100) e.name = t("validationBrandNameMax");
    if (form.logo && !/^https?:\/\/.+/i.test(form.logo)) e.logo = t("validationValidUrl");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        logo: form.logo.trim() || null,
        country: form.country.trim() || null,
      };

      const isEdit = !!editingBrand;
      const url = isEdit ? `/api/brands/${editingBrand.id}` : "/api/brands";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || t("failedToSaveBrand"));
      }

      setDialogOpen(false);
      showToast("success", isEdit ? t("brandUpdated") : t("brandCreated"));
      fetchBrands();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("failedToSaveBrand");
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (!confirm(t("deleteBrandConfirm", { name: brand.name }))) return;
    try {
      const res = await fetch(`/api/brands/${brand.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("failedToDeleteBrand"));
      showToast("success", t("brandDeleted"));
      fetchBrands();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("failedToDeleteBrand");
      showToast("error", msg);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("brandManagement")}</h1>
          <p className="text-muted-foreground mt-1">{total} {t("brandsInSystem")}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addBrand")}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchBrands")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : brands.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">{t("noBrandsFound")}</p>
            <p className="text-muted-foreground text-sm mt-1">
              {search ? t("noResultsSearchDifferent") : t("clickToAddFirst") + " \"" + t("addBrand") + "\" " + t("toCreateFirst") + " " + t("brand")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {brands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold">
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{brand.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {brand.country && <span>{brand.country}</span>}
                      {brand.country && <span>·</span>}
                      <Badge variant="secondary" className="text-xs">
                        {brand._count.cars} {brand._count.cars === 1 ? t("car") : t("carsCount")}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(brand)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(brand)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBrand ? t("editBrand") : t("addNewBrand")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>{t("brandName")} *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder={t("placeholderBrand")}
                className="mt-1"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label>{t("country")}</Label>
              <Input
                value={form.country}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                placeholder={t("placeholderCountry")}
                className="mt-1"
              />
              {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
            </div>
            <div>
              <Label>{t("logoUrl")}</Label>
              <Input
                value={form.logo}
                onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))}
                placeholder="https://example.com/logo.png"
                className="mt-1"
              />
              {errors.logo && <p className="text-xs text-destructive mt-1">{errors.logo}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingBrand ? t("saveChanges") : t("createBrand")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
