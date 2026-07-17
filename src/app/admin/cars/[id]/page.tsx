"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CarFormDialog } from "@/components/admin/car-form-dialog";
import type { CarFormData } from "@/validations/car";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Pencil, Trash2, ExternalLink, Star, DollarSign, Calendar, Gauge } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface CarDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  year: number;
  pricePerDay: number;
  weekendPricePerDay: number | null;
  weeklyPrice: number | null;
  monthlyPrice: number | null;
  securityDeposit: number;
  fuelType: string;
  transmission: string;
  seats: number;
  doors: number;
  color: string;
  mileage: number;
  licensePlate: string;
  vin: string | null;
  engineSize: string | null;
  horsepower: number | null;
  features: string[];
  status: string;
  isFeatured: boolean;
  isPublished: boolean;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  images: { id: string; url: string; alt: string; isPrimary: boolean; order: number }[];
}

interface Category { id: string; name: string; }

export default function AdminCarEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const fetchData = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const [carRes, filtersRes] = await Promise.all([
        fetch(`/api/cars/${id}`),
        fetch("/api/cars/filters"),
      ]);
      const carJson = await carRes.json();
      const filtersJson = await filtersRes.json();
      if (carJson.success) setCar(carJson.data);
      if (filtersJson.success) {
        setCategories(filtersJson.data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    params.then(({ id }) => fetchData(id));
  }, [params, fetchData]);

  const handleUpdate = async (data: CarFormData, images: { url: string; alt?: string }[]) => {
    if (!car) return;
    const res = await fetch(`/api/cars/${car.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, images }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update car");
    }
    await fetchData(car.id);
  };

  const handleDelete = async () => {
    if (!car || !confirm("Are you sure you want to delete this car?")) return;
    const res = await fetch(`/api/cars/${car.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/cars");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Car not found</p>
        <Link href="/admin/cars"><Button variant="outline" className="mt-4">Back to Cars</Button></Link>
      </div>
    );
  }

  const STATUS_COLORS: Record<string, string> = {
    AVAILABLE: "bg-emerald-500/10 text-emerald-600",
    RESERVED: "bg-amber-500/10 text-amber-600",
    RENTED: "bg-blue-500/10 text-blue-600",
    MAINTENANCE: "bg-orange-500/10 text-orange-600",
    CLEANING: "bg-purple-500/10 text-purple-600",
    OUT_OF_SERVICE: "bg-red-500/10 text-red-600",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/cars" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{car.name}</h1>
            <p className="text-muted-foreground">{car.brand?.name ?? "Unknown"} &middot; {car.year} &middot; {car.licensePlate}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/cars/${car.slug}`} target="_blank">
            <Button variant="outline"><ExternalLink className="h-4 w-4 mr-2" />Public</Button>
          </Link>
          <Button variant="outline" onClick={() => setFormOpen(true)}><Pencil className="h-4 w-4 mr-2" />Edit</Button>
          <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {car.images.map((img) => (
          <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border">
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
            {img.isPrimary && <Badge className="absolute top-2 left-2 text-[10px]">Primary</Badge>}
          </div>
        ))}
        {car.images.length === 0 && (
          <div className="col-span-full aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground">
            No images uploaded
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><DollarSign className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(car.pricePerDay)}</p>
              <p className="text-xs text-muted-foreground">per day</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Star className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{Number(car.averageRating).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">{car.totalReviews} reviews</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{car.totalBookings}</p>
              <p className="text-xs text-muted-foreground">bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Gauge className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{car.mileage.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">miles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">Category</span><p className="font-medium">{car.category?.name ?? "Unknown"}</p></div>
            <div><span className="text-muted-foreground">Status</span><p><Badge className={STATUS_COLORS[car.status]}>{car.status.replace("_", " ")}</Badge></p></div>
            <div><span className="text-muted-foreground">Fuel Type</span><p className="font-medium">{car.fuelType.replace("_", " ")}</p></div>
            <div><span className="text-muted-foreground">Transmission</span><p className="font-medium">{car.transmission.replace("_", " ")}</p></div>
            <div><span className="text-muted-foreground">Seats</span><p className="font-medium">{car.seats}</p></div>
            <div><span className="text-muted-foreground">Doors</span><p className="font-medium">{car.doors}</p></div>
            <div><span className="text-muted-foreground">Color</span><p className="font-medium">{car.color}</p></div>
            <div><span className="text-muted-foreground">Horsepower</span><p className="font-medium">{car.horsepower || "N/A"} {car.horsepower ? "HP" : ""}</p></div>
            <div><span className="text-muted-foreground">Engine</span><p className="font-medium">{car.engineSize || "N/A"}</p></div>
            <div className="col-span-full"><span className="text-muted-foreground">Description</span><p className="mt-1">{car.description}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      {car.features.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <div className="flex flex-wrap gap-2">
              {car.features.map((f) => <Badge key={f} variant="secondary">{f}</Badge>)}
            </div>
          </CardContent>
        </Card>
      )}

      <CarFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleUpdate}
        initialData={{
          name: car.name,
          description: car.description,
          brandId: car.brand.id,
          categoryId: car.category.id,
          year: car.year,
          pricePerDay: Number(car.pricePerDay),
          weekendPricePerDay: car.weekendPricePerDay ? Number(car.weekendPricePerDay) : null,
          weeklyPrice: car.weeklyPrice ? Number(car.weeklyPrice) : null,
          monthlyPrice: car.monthlyPrice ? Number(car.monthlyPrice) : null,
          securityDeposit: Number(car.securityDeposit),
          fuelType: car.fuelType as "GASOLINE" | "DIESEL" | "ELECTRIC" | "HYBRID" | "PLUG_IN_HYBRID",
          transmission: car.transmission as "AUTOMATIC" | "MANUAL" | "SEMI_AUTOMATIC",
          seats: car.seats,
          doors: car.doors,
          color: car.color,
          mileage: car.mileage,
          licensePlate: car.licensePlate,
          vin: car.vin,
          engineSize: car.engineSize,
          horsepower: car.horsepower,
          features: car.features,
          status: car.status as "AVAILABLE" | "RESERVED" | "RENTED" | "MAINTENANCE" | "CLEANING" | "OUT_OF_SERVICE",
          isFeatured: car.isFeatured,
          isPublished: true,
          images: car.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt })),
        }}
        categories={categories}
      />
    </div>
  );
}
