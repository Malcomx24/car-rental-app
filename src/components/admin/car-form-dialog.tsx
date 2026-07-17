"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useImageUpload } from "@/hooks/use-image-upload";
import { carFormSchema, type CarFormData } from "@/validations/car";
import { X, Upload, Loader2, Plus, Check } from "lucide-react";

interface Brand { id: string; name: string; }
interface Category { id: string; name: string; }

interface CarFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CarFormData, images: { url: string; alt?: string }[]) => Promise<void>;
  initialData?: Partial<CarFormData> & { id?: string; images?: { id?: string; url: string; alt?: string }[] };
  categories: Category[];
}

const FUEL_OPTIONS = ["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID", "PLUG_IN_HYBRID"];
const TRANSMISSION_OPTIONS = ["AUTOMATIC", "MANUAL", "SEMI_AUTOMATIC"];
const STATUS_OPTIONS = ["AVAILABLE", "RESERVED", "RENTED", "MAINTENANCE", "CLEANING", "OUT_OF_SERVICE"];

const COMMON_FEATURES = [
  "Air Conditioning", "Bluetooth", "Cruise Control", "Backup Camera", "Heated Seats",
  "Sunroof", "Leather Seats", "Navigation System", "Apple CarPlay", "Android Auto",
  "Keyless Entry", "Blind Spot Monitor", "Lane Departure Warning", "Adaptive Cruise Control",
  "Premium Audio", "Wireless Charging", "USB-C Port", "LED Headlights",
];

function getInitialState(initialData?: CarFormDialogProps["initialData"]) {
  if (!initialData) {
    return {
      form: {
        name: "", description: "",         brandId: "", categoryId: "",
        year: new Date().getFullYear(), pricePerDay: 0,
        weekendPricePerDay: null, weeklyPrice: null, monthlyPrice: null,
        securityDeposit: 0, fuelType: "GASOLINE" as const,
        transmission: "AUTOMATIC" as const, seats: 5, doors: 4,
        color: "", exteriorColor: "", interiorColor: "", mileage: 0,
        licensePlate: "", vin: "", engineSize: "",
        horsepower: null, torque: "", topSpeed: "", zeroToSixty: "",
        fuelCapacity: null, trunkCapacity: "",
        features: [] as string[], status: "AVAILABLE" as const,
        isFeatured: false, isPublished: true,
      },
      images: [] as { url: string; alt: string }[],
      existingImageIds: [] as string[],
    };
  }
  return {
    form: {
      name: initialData.name || "",
      description: initialData.description || "",
      brandId: initialData.brandId || "",
      categoryId: initialData.categoryId || "",
      year: initialData.year || new Date().getFullYear(),
      pricePerDay: initialData.pricePerDay || 0,
      weekendPricePerDay: initialData.weekendPricePerDay || null,
      weeklyPrice: initialData.weeklyPrice || null,
      monthlyPrice: initialData.monthlyPrice || null,
      securityDeposit: initialData.securityDeposit || 0,
      fuelType: initialData.fuelType || "GASOLINE",
      transmission: initialData.transmission || "AUTOMATIC",
      seats: initialData.seats || 5,
      doors: initialData.doors || 4,
      color: initialData.color || "",
      exteriorColor: initialData.exteriorColor || "",
      interiorColor: initialData.interiorColor || "",
      mileage: initialData.mileage || 0,
      licensePlate: initialData.licensePlate || "",
      vin: initialData.vin || "",
      engineSize: initialData.engineSize || "",
      horsepower: initialData.horsepower || null,
      torque: initialData.torque || "",
      topSpeed: initialData.topSpeed || "",
      zeroToSixty: initialData.zeroToSixty || "",
      fuelCapacity: initialData.fuelCapacity || null,
      trunkCapacity: initialData.trunkCapacity || "",
      features: initialData.features || [],
      status: initialData.status || "AVAILABLE",
      isFeatured: initialData.isFeatured || false,
      isPublished: initialData.isPublished ?? true,
    },
    images: (initialData.images || []).map((img) => ({ url: img.url, alt: img.alt || "" })),
    existingImageIds: (initialData.images || []).filter((img) => img.id).map((img) => img.id!),
  };
}

export function CarFormDialog({ open, onClose, onSave, initialData, categories }: CarFormDialogProps) {
  const { upload, uploading, error: uploadError } = useImageUpload();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch("/api/brands?limit=1000")
      .then((r) => r.json())
      .then((json) => { if (json.success) setBrands(json.data); })
      .catch(() => {});
  }, []);

  const initialState = getInitialState(initialData);

  const [images, setImages] = useState<{ url: string; alt: string }[]>(initialState.images);
  const [existingImageIds, setExistingImageIds] = useState<string[]>(initialState.existingImageIds);
  const [featureInput, setFeatureInput] = useState("");
  const [form, setForm] = useState<Partial<CarFormData>>(initialState.form);

  useEffect(() => {
    if (open) {
      const s = getInitialState(initialData);
      setImages(s.images);
      setExistingImageIds(s.existingImageIds);
      setForm(s.form);
      setErrors({});
    }
  }, [open, initialData]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileEntries: { file: File; fileName: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) fileEntries.push({ file, fileName: file.name });
    }
    e.target.value = "";

    for (const { file, fileName } of fileEntries) {
      const result = await upload(file);
      if (result) {
        setImages((prev) => [...prev, { url: result.url, alt: fileName }]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = (feature: string) => {
    if (feature && !form.features?.includes(feature)) {
      setForm((prev) => ({ ...prev, features: [...(prev.features || []), feature] }));
    }
    setFeatureInput("");
  };

  const removeFeature = (feature: string) => {
    setForm((prev) => ({ ...prev, features: prev.features?.filter((f) => f !== feature) || [] }));
  };

  const handleSave = async () => {
    setErrors({});
    try {
      const validated = carFormSchema.parse(form);
      setSaving(true);
      await onSave(validated, images);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        try {
          const zodErr = JSON.parse(err.message);
          const fieldErrors: Record<string, string> = {};
          zodErr.forEach((e: { path: string[]; message: string }) => {
            fieldErrors[e.path.join(".")] = e.message;
          });
          setErrors(fieldErrors);
        } catch {
          setErrors({ _form: err.message });
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof CarFormData>(key: K, value: CarFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? "Edit Car" : "Add New Car"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {errors._form && <p className="text-sm text-destructive">{errors._form}</p>}

          {/* Images */}
          <div>
            <Label className="text-base font-semibold">Photos</Label>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && <Badge className="absolute bottom-1 left-1 text-[10px]">Primary</Badge>}
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                  </>
                )}
              </label>
            </div>
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Car Name *</Label>
              <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. BMW 3 Series 330i" className="mt-1" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label>Brand *</Label>
              <select value={form.brandId || ""} onChange={(e) => updateField("brandId", e.target.value)} className="w-full h-10 rounded-md border bg-background px-3 text-sm mt-1">
                <option value="">Select brand</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              {errors.brandId && <p className="text-xs text-destructive mt-1">{errors.brandId}</p>}
            </div>
            <div>
              <Label>Category *</Label>
              <select value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)} className="w-full h-10 rounded-md border bg-background px-3 text-sm mt-1">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId}</p>}
            </div>
            <div>
              <Label>Year *</Label>
              <Input type="number" value={form.year} onChange={(e) => updateField("year", Number(e.target.value))} className="mt-1" />
            </div>
            <div>
              <Label>License Plate *</Label>
              <Input value={form.licensePlate} onChange={(e) => updateField("licensePlate", e.target.value)} placeholder="ABC-1234" className="mt-1" />
              {errors.licensePlate && <p className="text-xs text-destructive mt-1">{errors.licensePlate}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label>Description *</Label>
              <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} className="mt-1" />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <Label className="text-base font-semibold">Pricing</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <div>
                <Label className="text-xs">Per Day *</Label>
                <Input type="number" step="0.01" value={form.pricePerDay} onChange={(e) => updateField("pricePerDay", Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Weekend/Day</Label>
                <Input type="number" step="0.01" value={form.weekendPricePerDay || ""} onChange={(e) => updateField("weekendPricePerDay", e.target.value ? Number(e.target.value) : null)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Weekly</Label>
                <Input type="number" step="0.01" value={form.weeklyPrice || ""} onChange={(e) => updateField("weeklyPrice", e.target.value ? Number(e.target.value) : null)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Monthly</Label>
                <Input type="number" step="0.01" value={form.monthlyPrice || ""} onChange={(e) => updateField("monthlyPrice", e.target.value ? Number(e.target.value) : null)} className="mt-1" />
              </div>
            </div>
          </div>

          {/* Specs */}
          <div>
            <Label className="text-base font-semibold">Specifications</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <div>
                <Label className="text-xs">Fuel Type</Label>
                <select value={form.fuelType} onChange={(e) => updateField("fuelType", e.target.value as CarFormData["fuelType"])} className="w-full h-10 rounded-md border bg-background px-3 text-sm mt-1">
                  {FUEL_OPTIONS.map((f) => <option key={f} value={f}>{f.replace("_", " ")}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs">Transmission</Label>
                <select value={form.transmission} onChange={(e) => updateField("transmission", e.target.value as CarFormData["transmission"])} className="w-full h-10 rounded-md border bg-background px-3 text-sm mt-1">
                  {TRANSMISSION_OPTIONS.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs">Seats</Label>
                <Input type="number" value={form.seats} onChange={(e) => updateField("seats", Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Doors</Label>
                <Input type="number" value={form.doors} onChange={(e) => updateField("doors", Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Color *</Label>
                <Input value={form.color} onChange={(e) => updateField("color", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Mileage (mi)</Label>
                <Input type="number" value={form.mileage} onChange={(e) => updateField("mileage", Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Horsepower</Label>
                <Input type="number" value={form.horsepower || ""} onChange={(e) => updateField("horsepower", e.target.value ? Number(e.target.value) : null)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Engine Size</Label>
                <Input value={form.engineSize || ""} onChange={(e) => updateField("engineSize", e.target.value)} placeholder="2.0L" className="mt-1" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <Label className="text-base font-semibold">Features</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.features?.map((f) => (
                <Badge key={f} variant="secondary" className="gap-1">
                  {f}
                  <button onClick={() => removeFeature(f)}><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add a feature"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(featureInput); } }}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => addFeature(featureInput)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {COMMON_FEATURES.filter((f) => !form.features?.includes(f)).slice(0, 10).map((f) => (
                <button key={f} onClick={() => addFeature(f)} className="text-xs px-2 py-1 rounded-full border hover:bg-muted transition-colors">
                  + {f}
                </button>
              ))}
            </div>
          </div>

          {/* Status & Flags */}
          <div>
            <Label className="text-base font-semibold">Status & Visibility</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              <div>
                <Label className="text-xs">Status</Label>
                <select value={form.status} onChange={(e) => updateField("status", e.target.value as CarFormData["status"])} className="w-full h-10 rounded-md border bg-background px-3 text-sm mt-1">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateField("isFeatured", e.target.checked)} className="rounded" id="featured" />
                <Label htmlFor="featured" className="text-sm">Featured</Label>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => updateField("isPublished", e.target.checked)} className="rounded" id="published" />
                <Label htmlFor="published" className="text-sm">Published</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || uploading}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
            {initialData?.id ? "Save Changes" : "Create Car"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
