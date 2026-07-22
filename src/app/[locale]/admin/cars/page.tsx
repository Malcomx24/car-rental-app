"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { CarTable } from "@/components/admin/car-table";
import { CarFormDialog } from "@/components/admin/car-form-dialog";
import type { CarFormData } from "@/validations/car";

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

interface Category { id: string; name: string; }

export default function AdminCarsPage() {
  const t = useTranslations("admin");
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editCarId, setEditCarId] = useState<string | null>(null);
  const [editCarData, setEditCarData] = useState<(Partial<CarFormData> & { id?: string; images?: { id?: string; url: string; alt?: string }[] }) | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (brandFilter) params.set("brandId", brandFilter);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`/api/cars?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setCars(json.data.map((c: Record<string, unknown> & { brand: { id: string; name: string }; category: Category; images: { url: string }[] }) => ({
          ...c,
          brand: c.brand,
          category: c.category,
          images: c.images,
        })));
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch cars:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, brandFilter, page]);

  const fetchFilters = useCallback(async () => {
    try {
      const res = await fetch("/api/cars/filters");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch filters:", err);
    }
  }, []);

  useEffect(() => { fetchFilters(); }, [fetchFilters]);
  useEffect(() => { fetchCars(); }, [fetchCars]);

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, brandFilter]);

  const handleCreate = async (data: CarFormData, images: { url: string; alt?: string }[]) => {
    const res = await fetch("/api/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, images }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || t("failedToCreateCar"));
    }
    await fetchCars();
  };

  const handleAdd = () => {
    setEditCarId(null);
    setEditCarData(undefined);
    setFormOpen(true);
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/cars/${id}`);
      const json = await res.json();
      if (json.success) {
        const car = json.data;
        setEditCarId(id);
        setEditCarData({
          id: car.id,
          name: car.name,
          slug: car.slug,
          description: car.description,
          pricePerDay: car.pricePerDay,
          year: car.year,
          mileage: car.mileage,
          fuelType: car.fuelType,
          transmission: car.transmission,
          seats: car.seats,
          doors: car.doors,
          licensePlate: car.licensePlate,
          isFeatured: car.isFeatured,
          isPublished: car.isPublished,
          status: car.status,
          brandId: car.brandId,
          categoryId: car.categoryId,
          images: car.images,
        });
        setFormOpen(true);
      }
    } catch (err) {
      console.error("Failed to load car for editing:", err);
    }
  };

  const handleUpdate = async (data: CarFormData, images: { url: string; alt?: string }[]) => {
    if (!editCarId) return;
    const res = await fetch(`/api/cars/${editCarId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, images }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || t("failedToCreateCar"));
    }
    setEditCarId(null);
    setEditCarData(undefined);
    await fetchCars();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDeleteCar"))) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (res.ok) await fetchCars();
    } catch (err) {
      console.error("Failed to delete car:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("carManagement")}</h1>
          <p className="text-muted-foreground mt-1">{total} {t("vehiclesInFleet")}</p>
        </div>
      </div>

      <CarTable
        cars={cars}
        total={total}
        page={page}
        totalPages={totalPages}
        loading={loading}
        search={search}
        statusFilter={statusFilter}
        brandFilter={brandFilter}
        onSearch={setSearch}
        onStatusFilter={setStatusFilter}
        onBrandFilter={setBrandFilter}
        onPageChange={setPage}
        onDelete={handleDelete}
        onAdd={handleAdd}
        onEdit={handleEdit}
      />

      <CarFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditCarId(null); setEditCarData(undefined); }}
        onSave={editCarId ? handleUpdate : handleCreate}
        initialData={editCarData}
        categories={categories}
      />
    </div>
  );
}
