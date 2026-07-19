"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Search, SlidersHorizontal, Star, Fuel, Users, Settings2, ChevronLeft, ChevronRight, Loader2, Heart, X } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { useTranslations } from "next-intl";

interface Car {
  id: string;
  name: string;
  slug: string;
  description: string;
  year: number;
  pricePerDay: number;
  fuelType: string;
  transmission: string;
  seats: number;
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
  GASOLINE: "Gasoline", DIESEL: "Diesel", ELECTRIC: "Electric", HYBRID: "Hybrid", PLUG_IN_HYBRID: "PHEV",
};

export default function CarsPage() {
  const t = useTranslations("cars");
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({ brands: [], categories: [] });
  const { favoriteIds, toggleFavorite } = useFavorites();

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (brandId) params.set("brandId", brandId);
      if (categoryId) params.set("categoryId", categoryId);
      if (fuelType) params.set("fuelType", fuelType);
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, brandId, categoryId, fuelType, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    fetch("/api/cars/filters").then((r) => r.json()).then((json) => {
      if (json.success) setFilters(json.data);
    });
  }, []);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(timer);
  }, [search, brandId, categoryId, fuelType, minPrice, maxPrice, sort]);

  const activeFilterCount = [brandId, categoryId, fuelType, minPrice, maxPrice].filter(Boolean).length;

  const clearFilters = () => {
    setBrandId("");
    setCategoryId("");
    setFuelType("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-background to-primary/5 border-b">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("heroTitle")} <span className="text-primary">{t("heroTitleHighlight")}</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl text-lg">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {t("filters")}
              {activeFilterCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="newest">{t("sortNewest")}</option>
              <option value="price-asc">{t("sortPriceAsc")}</option>
              <option value="price-desc">{t("sortPriceDesc")}</option>
              <option value="name-asc">{t("sortNameAsc")}</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-4 rounded-xl border bg-card grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block">{t("brand")}</label>
              <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="w-full h-9 rounded-md border bg-background px-3 text-sm">
                <option value="">{t("allBrands")}</option>
                {filters.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">{t("category")}</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full h-9 rounded-md border bg-background px-3 text-sm">
                <option value="">{t("allCategories")}</option>
                {filters.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">{t("fuelType")}</label>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="w-full h-9 rounded-md border bg-background px-3 text-sm">
                <option value="">{t("allFuelTypes")}</option>
                {Object.entries(FUEL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">{t("priceRange")}</label>
              <div className="flex gap-2">
                <Input type="number" placeholder={t("min")} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="h-9 text-sm" />
                <Input type="number" placeholder={t("max")} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-9 text-sm" />
              </div>
            </div>
            {activeFilterCount > 0 && (
              <div className="col-span-full">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" /> {t("clearAllFilters")}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {loading ? t("loading") : t("resultsCount", { count: total })}
        </p>

        {/* Car Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[16/10] bg-muted animate-pulse" />
                <CardContent className="p-5 space-y-3">
                  <div className="h-5 bg-muted rounded animate-pulse w-2/3" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-medium">{t("noCarsFound")}</p>
            <p className="text-muted-foreground mt-2">{t("noCarsFoundHint")}</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>{t("clearFilters")}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Link key={car.id} href={`/cars/${car.slug || car.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
                  <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                    {car.images[0] ? (
                      <img
                        src={car.images[0].url}
                        alt={car.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">{t("noImage")}</div>
                    )}
                    {car.isFeatured && (
                      <Badge className="absolute top-3 left-3 bg-primary">{t("featured")}</Badge>
                    )}
                    <button
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                      onClick={(e) => { e.preventDefault(); toggleFavorite(car.id); }}
                    >
                      <Heart className={`h-4 w-4 ${favoriteIds.has(car.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{car.brand.name}</p>
                        <h3 className="font-semibold text-lg leading-tight">{car.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{Number(car.averageRating).toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({car.totalReviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" />{FUEL_LABELS[car.fuelType] || car.fuelType}</span>
                      <span className="flex items-center gap-1"><Settings2 className="h-3.5 w-3.5" />{car.transmission}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{car.seats}</span>
                    </div>
                    <div className="flex items-end justify-between pt-3 border-t">
                      <div>
                        <span className="text-2xl font-bold">${Number(car.pricePerDay).toFixed(0)}</span>
                        <span className="text-sm text-muted-foreground"> {t("perDay")}</span>
                      </div>
                      <Button size="sm">{t("viewDetails")}</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = page <= 4 ? i + 1 : page + i - 3;
              if (p < 1 || p > totalPages) return null;
              return (
                <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)}>
                  {p}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
