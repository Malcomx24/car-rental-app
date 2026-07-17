"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CarFormDialog } from "@/components/admin/car-form-dialog";
import type { CarFormData } from "@/validations/car";
import { Loader2 } from "lucide-react";

interface Category { id: string; name: string; }

export default function AdminNewCarPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cars/filters")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setCategories(json.data.categories);
        }
      })
      .finally(() => setLoading(false));
  }, []);

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
    router.push("/admin/cars");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Car</h1>
      <CarFormDialog
        open
        onClose={() => router.push("/admin/cars")}
        onSave={handleCreate}
        categories={categories}
      />
    </div>
  );
}
