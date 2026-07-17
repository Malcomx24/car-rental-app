"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
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
        setCars(json.data.map((c: Record<string, unknown> & { brand: Brand; category: Category; images: { url: string }[] }) => ({
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
      throw new Error(err.error || "Failed to create car");
    }
    await fetchCars();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
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
          <h1 className="text-3xl font-bold">Car Management</h1>
          <p className="text-muted-foreground mt-1">{total} vehicles in your fleet</p>
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
      />

      <CarFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleCreate}
        categories={categories}
      />
    </div>
  );
}
