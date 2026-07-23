"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  SlidersHorizontal,
  Star,
  Fuel,
  Users,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
  Car,
  MapPin,
  LayoutGrid,
  List,
  Sparkles,
  Shield,
  Clock,
  CreditCard,
  Plane,
  DoorOpen,
  Luggage,
  Snowflake,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { useTranslations } from "next-intl";

interface CarItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  year: number;
  pricePerDay: number;
  fuelType: string;
  transmission: string;
  seats: number;
  doors: number;
  color: string;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  brand: { name: string };
  category: { name: string };
  images: { url: string; isPrimary: boolean }[];
}

interface Filters {
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

const FUEL_LABELS: Record<string, string> = {
  GASOLINE: "Gasoline",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  HYBRID: "Hybrid",
  PLUG_IN_HYBRID: "PHEV",
};

function CarsPageContent() {
  const t = useTranslations("cars");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<CarItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Filters>({
    brands: [],
    categories: [],
  });
  const { favoriteIds, toggleFavorite } = useFavorites();

  // Booking search params from homepage
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [hasBookingParams, setHasBookingParams] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    const loc = searchParams.get("location");
    const pickup = searchParams.get("pickup");
    const ret = searchParams.get("return");
    if (pickup && ret) {
      setPickupDate(pickup);
      setReturnDate(ret);
      setHasBookingParams(true);
    }
    if (loc) {
      setPickupLocation(loc);
    }
  }, [searchParams]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      // If we have booking dates, use the availability endpoint
      if (pickupDate && returnDate) {
        const params = new URLSearchParams({
          pickupDate,
          returnDate,
          page: String(page),
          limit: "50",
        });
        const res = await fetch(`/api/cars/availability?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          let results = json.data;
          // Apply client-side filters on top of availability results
          if (search) {
            const q = search.toLowerCase();
            results = results.filter(
              (c: CarItem) =>
                c.name.toLowerCase().includes(q) ||
                c.brand.name.toLowerCase().includes(q) ||
                c.description?.toLowerCase().includes(q)
            );
          }
          if (brandId) results = results.filter((c: CarItem) => (c as unknown as { brandId: string }).brandId === brandId);
          if (categoryId) results = results.filter((c: CarItem) => (c as unknown as { categoryId: string }).categoryId === categoryId);
          if (fuelType) results = results.filter((c: CarItem) => c.fuelType === fuelType);
          if (transmission) results = results.filter((c: CarItem) => c.transmission === transmission);
          if (minPrice) results = results.filter((c: CarItem) => c.pricePerDay >= Number(minPrice));
          if (maxPrice) results = results.filter((c: CarItem) => c.pricePerDay <= Number(maxPrice));

          setTotal(results.length);
          setTotalPages(1);
          setCars(results);
        }
      } else {
        // No booking dates — use normal cars API
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (brandId) params.set("brandId", brandId);
        if (categoryId) params.set("categoryId", categoryId);
        if (fuelType) params.set("fuelType", fuelType);
        if (transmission) params.set("transmission", transmission);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", "12");

        const res = await fetch(`/api/cars?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setCars(json.data);
          setTotal(json.pagination.total);
          setTotalPages(json.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, brandId, categoryId, fuelType, transmission, minPrice, maxPrice, sort, page, pickupDate, returnDate]);

  useEffect(() => {
    fetch("/api/cars/filters")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setFilters(json.data);
      });
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(timer);
  }, [search, brandId, categoryId, fuelType, transmission, minPrice, maxPrice, sort, pickupDate, returnDate]);

  const activeFilterCount = [
    brandId,
    categoryId,
    fuelType,
    transmission,
    minPrice,
    maxPrice,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setBrandId("");
    setCategoryId("");
    setFuelType("");
    setTransmission("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setPickupDate("");
    setReturnDate("");
    setPickupLocation("");
    setHasBookingParams(false);
    // Clear URL params
    router.replace("/cars");
  };

  const clearBookingFilters = () => {
    setPickupDate("");
    setReturnDate("");
    setPickupLocation("");
    setHasBookingParams(false);
    router.replace("/cars");
  };

  /* ─── Filter Panel Content (shared between desktop sidebar & mobile sheet) ─── */
  const FilterPanelContent = ({ onApply }: { onApply?: () => void }) => (
    <div className="space-y-6">
      {/* Brand */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          {t("filterBrand")}
        </label>
        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          className="w-full h-10 rounded-xl border border-border bg-muted px-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        >
          <option value="">{t("allBrands")}</option>
          {filters.brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          {t("filterCategory")}
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full h-10 rounded-xl border border-border bg-muted px-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        >
          <option value="">{t("allCategories")}</option>
          {filters.categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          {t("transmission")}
        </label>
        <select
          value={transmission}
          onChange={(e) => setTransmission(e.target.value)}
          className="w-full h-10 rounded-xl border border-border bg-muted px-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        >
          <option value="">{t("allTransmissions")}</option>
          <option value="AUTOMATIC">{t("automatic")}</option>
          <option value="MANUAL">{t("manual")}</option>
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          {t("filterFuel")}
        </label>
        <select
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          className="w-full h-10 rounded-xl border border-border bg-muted px-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        >
          <option value="">{t("allFuelTypes")}</option>
          {Object.entries(FUEL_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Seats */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          {t("seats")}
        </label>
        <div className="flex gap-2">
          {[2, 4, 5, 6, 7, 8].map((s) => (
            <button
              key={s}
              className="h-9 w-9 rounded-lg border border-border bg-muted text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          {t("filterPriceRange")}
        </label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder={t("min")}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-10 rounded-xl text-sm"
          />
          <span className="text-muted-foreground flex items-center">–</span>
          <Input
            type="number"
            placeholder={t("max")}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-10 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-1.5" />
            {t("clearAll")}
          </Button>
        )}
        {onApply && (
          <Button size="sm" onClick={onApply} className="flex-1">
            {t("applyFilters")}
          </Button>
        )}
      </div>
    </div>
  );

  /* ─── Car Card ─── */
  const CarCard = ({ car }: { car: CarItem }) => (
    <Link href={`/cars/${car.slug || car.id}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-card/80 backdrop-blur-sm h-full">
        {/* Image */}
        <div className="relative aspect-[16/10] bg-muted overflow-hidden">
          {car.images[0] ? (
            <img
              src={car.images[0].url}
              alt={car.name}
              loading="lazy"
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Car className="h-12 w-12 text-muted-foreground/20" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {car.isFeatured && (
              <Badge className="bg-amber-500 text-white border-0 text-xs font-semibold shadow-lg">
                <Sparkles className="h-3 w-3 mr-1" />
                {t("featured")}
              </Badge>
            )}
            <Badge className="bg-green-500/90 text-white border-0 text-xs font-semibold backdrop-blur-sm">
              Available
            </Badge>
          </div>

          {/* Wishlist */}
          <button
            className="absolute top-3 right-3 p-2.5 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(car.id);
            }}
            aria-label="Toggle wishlist"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${favoriteIds.has(car.id) ? "fill-red-500 text-red-500" : "text-white"}`}
            />
          </button>

          {/* Price overlay on mobile */}
          <div className="absolute bottom-3 left-3 lg:hidden">
            <div className="bg-black/60 backdrop-blur-md rounded-lg px-3 py-1.5">
              <span className="text-white font-bold text-lg">{formatCurrency(car.pricePerDay)}</span>
              <span className="text-white/70 text-xs"> {t("perDay")}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Brand + Name + Rating */}
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">
                {car.brand.name}
              </p>
              <h3 className="font-bold text-lg leading-tight truncate group-hover:text-primary transition-colors">
                {car.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-3">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold">{Number(car.averageRating).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({car.totalReviews})</span>
            </div>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5" />
              {car.transmission === "AUTOMATIC" ? t("automatic") : t("manual")}
            </span>
            <span className="flex items-center gap-1.5">
              <Fuel className="h-3.5 w-3.5" />
              {FUEL_LABELS[car.fuelType] || car.fuelType}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {car.seats} {t("seats")}
            </span>
            {car.doors && (
              <span className="flex items-center gap-1.5">
                <DoorOpen className="h-3.5 w-3.5" />
                {car.doors} {t("doors")}
              </span>
            )}
          </div>

          {/* Price + Actions */}
          <div className="flex items-end justify-between pt-4 border-t border-border/50">
            <div>
              <span className="text-2xl font-bold tracking-tight">
                {formatCurrency(car.pricePerDay)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">{t("perDay")}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => e.preventDefault()}
              >
                {t("viewDetails")}
              </Button>
              <Button size="sm" className="shadow-lg shadow-primary/20">
                {t("reserveNow")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  /* ─── Car List Item ─── */
  const CarListItem = ({ car }: { car: CarItem }) => (
    <Link href={`/cars/${car.slug || car.id}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative sm:w-80 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-full bg-muted overflow-hidden">
            {car.images[0] ? (
              <img
                src={car.images[0].url}
                alt={car.name}
                loading="lazy"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 min-h-[200px]">
                <Car className="h-12 w-12 text-muted-foreground/20" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              {car.isFeatured && (
                <Badge className="bg-amber-500 text-white border-0 text-xs font-semibold">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {t("featured")}
                </Badge>
              )}
              <Badge className="bg-green-500/90 text-white border-0 text-xs font-semibold backdrop-blur-sm">
                Available
              </Badge>
            </div>
            <button
              className="absolute top-3 right-3 p-2.5 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-all"
              onClick={(e) => { e.preventDefault(); toggleFavorite(car.id); }}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-4 w-4 ${favoriteIds.has(car.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
            </button>
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">{car.brand.name}</p>
                  <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{car.name}</h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold">{Number(car.averageRating).toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({car.totalReviews})</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5">
                  <Settings2 className="h-3.5 w-3.5" />
                  {car.transmission === "AUTOMATIC" ? t("automatic") : t("manual")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Fuel className="h-3.5 w-3.5" />
                  {FUEL_LABELS[car.fuelType] || car.fuelType}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {car.seats} {t("seats")}
                </span>
                {car.doors && (
                  <span className="flex items-center gap-1.5">
                    <DoorOpen className="h-3.5 w-3.5" />
                    {car.doors} {t("doors")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div>
                <span className="text-2xl font-bold tracking-tight">{formatCurrency(car.pricePerDay)}</span>
                <span className="text-sm text-muted-foreground ml-1">{t("perDay")}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">{t("viewDetails")}</Button>
                <Button size="sm" className="shadow-lg shadow-primary/20">{t("reserveNow")}</Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );

  /* ─── Loading Skeleton ─── */
  const CardSkeleton = () => (
    <Card className="overflow-hidden border-0">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-2/3" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex justify-between pt-3 border-t">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative h-[420px] overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-morocco.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(0,0,0,.7), rgba(0,0,0,.5))" }}
        />

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <Badge className="mb-4 w-fit bg-white/10 text-white border-white/20 hover:bg-white/20 animate-fade-in-up">
            <Car className="mr-1.5 h-3.5 w-3.5" />
            {t("title")}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight animate-fade-in-up-delay-1">
            {t("heroTitle")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              {t("heroTitleHighlight")}
            </span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed animate-fade-in-up-delay-2">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FLOATING SEARCH CARD
          ═══════════════════════════════════════════ */}
      <div className="container mx-auto px-4 -mt-16 relative z-10 mb-12">
        <div className="rounded-[20px] p-6 shadow-2xl bg-card border border-border backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {t("searchPlaceholder")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder={t("searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-[52px] pl-10 pr-4 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {t("filterBrand")}
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full h-[52px] rounded-xl border border-border bg-muted px-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="">{t("allBrands")}</option>
                {filters.brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {t("filterCategory")}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-[52px] rounded-xl border border-border bg-muted px-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="">{t("allCategories")}</option>
                {filters.categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                {t("filterPriceRange")}
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  placeholder={t("min")}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full h-[52px] rounded-xl border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <input
                  type="number"
                  placeholder={t("max")}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-[52px] rounded-xl border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              variant="accent"
              className="h-[52px] font-semibold rounded-xl shadow-lg shadow-primary/20"
              onClick={() => { setPage(1); fetchCars(); }}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════ */}
      <div className="container mx-auto px-4 pb-20">
        <div className="flex gap-8">
          {/* ─── Desktop Sidebar Filters ─── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    {t("filters")}
                  </h3>
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </div>
                <FilterPanelContent />
              </div>

              {/* Trust indicators */}
              <div className="mt-6 rounded-2xl border bg-card/50 backdrop-blur-sm p-5 shadow-sm space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Why DriveRent</h4>
                {[
                  { icon: Shield, text: "Fully Insured" },
                  { icon: Clock, text: "24/7 Support" },
                  { icon: CreditCard, text: "Secure Payments" },
                  { icon: Plane, text: "Airport Delivery" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ─── Results Area ─── */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {loading ? t("loading") : t("resultsCount", { count: total })}
                </h2>
                {(activeFilterCount > 0 || hasBookingParams) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hasBookingParams && (
                      <Badge variant="secondary" className="gap-1.5 bg-primary/10 text-primary">
                        <MapPin className="h-3 w-3" />
                        {pickupLocation || "Location"}
                        {pickupDate && ` · ${pickupDate}`}
                        {returnDate && ` → ${returnDate}`}
                        <button onClick={clearBookingFilters}><X className="h-3 w-3" /></button>
                      </Badge>
                    )}
                    {brandId && (
                      <Badge variant="secondary" className="gap-1.5">
                        {filters.brands.find((b) => b.id === brandId)?.name}
                        <button onClick={() => setBrandId("")}><X className="h-3 w-3" /></button>
                      </Badge>
                    )}
                    {categoryId && (
                      <Badge variant="secondary" className="gap-1.5">
                        {filters.categories.find((c) => c.id === categoryId)?.name}
                        <button onClick={() => setCategoryId("")}><X className="h-3 w-3" /></button>
                      </Badge>
                    )}
                    {fuelType && (
                      <Badge variant="secondary" className="gap-1.5">
                        {FUEL_LABELS[fuelType]}
                        <button onClick={() => setFuelType("")}><X className="h-3 w-3" /></button>
                      </Badge>
                    )}
                    {transmission && (
                      <Badge variant="secondary" className="gap-1.5">
                        {transmission === "AUTOMATIC" ? t("automatic") : t("manual")}
                        <button onClick={() => setTransmission("")}><X className="h-3 w-3" /></button>
                      </Badge>
                    )}
                    <button
                      onClick={clearFilters}
                      className="text-xs text-primary hover:underline ml-1"
                    >
                      {t("clearAll")}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter trigger */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger render={<Button variant="outline" className="lg:hidden" />}>
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {t("filters")}
                    {activeFilterCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[320px] sm:w-[380px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5" />
                        {t("filters")}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="p-4">
                      <FilterPanelContent onApply={() => setMobileFiltersOpen(false)} />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 rounded-xl border border-input bg-transparent px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 outline-none transition-all"
                >
                  <option value="newest">{t("sortNewest")}</option>
                  <option value="price-asc">{t("sortPriceAsc")}</option>
                  <option value="price-desc">{t("sortPriceDesc")}</option>
                  <option value="name-asc">{t("sortNameAsc")}</option>
                </select>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-input rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ─── Car Grid / List ─── */}
            {loading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : cars.length === 0 ? (
              /* ─── Empty State ─── */
              <div className="text-center py-24">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
                  <Car className="h-10 w-10 text-muted-foreground/30" />
                </div>
                {hasBookingParams ? (
                  <>
                    <h3 className="text-xl font-semibold mb-2">No vehicles available for the selected dates</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Try different dates or clear your filters to see all available vehicles.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button variant="outline" onClick={clearBookingFilters} className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Change Dates
                      </Button>
                      <Button variant="outline" onClick={clearFilters} className="gap-2">
                        <X className="h-4 w-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2">{t("noCarsFound")}</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t("noCarsFoundHint")}</p>
                    <Button variant="outline" onClick={clearFilters} className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      {t("clearFilters")}
                    </Button>
                  </>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {cars.map((car) => (
                  <CarListItem key={car.id} car={car} />
                ))}
              </div>
            )}

            {/* ─── Pagination ─── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("previous")}
                </Button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = page <= 4 ? i + 1 : page + i - 3;
                  if (p < 1 || p > totalPages) return null;
                  return (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p)}
                      className={`rounded-xl min-w-[36px] ${p === page ? "shadow-lg shadow-primary/20" : ""}`}
                    >
                      {p}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-xl"
                >
                  {t("next")}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense>
      <CarsPageContent />
    </Suspense>
  );
}
