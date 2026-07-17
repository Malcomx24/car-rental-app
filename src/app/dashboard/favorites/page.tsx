"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Heart, Star, Loader2, Trash2, Car } from "lucide-react";

interface FavoriteCar {
  id: string;
  name: string;
  slug: string;
  pricePerDay: number;
  brand: { name: string };
  category: { name: string };
  averageRating: number;
  totalReviews: number;
  images: { url: string }[];
  favoriteId: string;
}

export default function DashboardFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteCar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites?limit=50");
      const json = await res.json();
      if (json.success) setFavorites(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const removeFavorite = async (carId: string) => {
    try {
      const res = await fetch(`/api/favorites?carId=${carId}`, { method: "DELETE" });
      if (res.ok) setFavorites((prev) => prev.filter((f) => f.id !== carId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Favorite Cars</h1>
        <p className="text-muted-foreground mt-1">{favorites.length} saved vehicle{favorites.length !== 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl font-medium">No favorites yet</p>
          <p className="text-muted-foreground mt-1">Browse our fleet and save cars you love.</p>
          <Link href="/cars"><Button className="mt-4">Browse Cars</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((car) => (
            <Card key={car.id} className="overflow-hidden group">
              <Link href={`/cars/${car.slug || car.id}`}>
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                  {car.images[0] ? (
                    <img src={car.images[0].url} alt={car.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center"><Car className="h-8 w-8 text-muted-foreground" /></div>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{car.brand.name}</p>
                    <p className="font-semibold">{car.name}</p>
                    <p className="text-xs text-muted-foreground">{car.category.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm">{Number(car.averageRating).toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-lg font-bold">${Number(car.pricePerDay).toFixed(0)}<span className="text-xs text-muted-foreground font-normal">/day</span></span>
                  <div className="flex gap-2">
                    <Link href={`/book/${car.id}`}><Button size="sm">Book</Button></Link>
                    <Button size="sm" variant="ghost" onClick={() => removeFavorite(car.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
