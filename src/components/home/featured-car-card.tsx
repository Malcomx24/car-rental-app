"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Car,
  Star,
  ArrowRight,
  Sparkles,
  Fuel,
  Settings2,
  Users,
  Heart,
} from "lucide-react";

export interface FeaturedCar {
  id: string;
  name: string;
  slug: string;
  year: number;
  pricePerDay: { toString(): string };
  fuelType: string;
  transmission: string;
  seats: number;
  status: string;
  isFeatured: boolean;
  averageRating: { toString(): string };
  totalReviews: number;
  brand: { name: string };
  category: { name: string };
  images: Array<{ url: string; alt: string; isPrimary: boolean }>;
}

interface FeaturedCarCardProps {
  car: FeaturedCar;
  viewDetailsLabel: string;
  featuredLabel: string;
  availableLabel: string;
  perDayLabel: string;
}

export function FeaturedCarCard({
  car,
  viewDetailsLabel,
  featuredLabel,
  availableLabel,
  perDayLabel,
}: FeaturedCarCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const primaryImage = car.images[0];
  const rating = Number(car.averageRating.toString());

  return (
    <Link href={`/cars/${car.slug}`} className="block h-full">
      <div className="group relative rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] bg-muted overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || car.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Car className="h-12 w-12 text-muted-foreground/20" />
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge className="bg-background/80 backdrop-blur-sm border-0 text-xs font-semibold shadow-md">
              {car.brand.name}
            </Badge>
            {car.isFeatured && (
              <Badge className="bg-amber-500 text-white border-0 text-xs font-semibold shadow-md">
                <Sparkles className="h-3 w-3 mr-1" />
                {featuredLabel}
              </Badge>
            )}
          </div>

          {/* Availability badge */}
          <div className="absolute top-3 right-3">
            <Badge
              className={`text-xs font-semibold border-0 backdrop-blur-sm shadow-md ${
                car.status === "AVAILABLE"
                  ? "bg-green-500/90 text-white"
                  : "bg-red-500/90 text-white"
              }`}
            >
              {availableLabel}
            </Badge>
          </div>

          {/* Favorite heart */}
          <button
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              setIsFavorited((prev) => !prev);
            }}
            aria-label="Toggle favorite"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorited
                  ? "fill-red-500 text-red-500"
                  : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category + Year */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {car.category.name}
            </Badge>
            <span className="text-xs text-muted-foreground">{car.year}</span>
          </div>

          {/* Name */}
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors duration-300">
            {car.name}
          </h3>

          {/* Specs row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground mt-3">
            <span className="flex items-center gap-1">
              <Settings2 className="h-3.5 w-3.5" />
              {car.transmission === "AUTOMATIC" ? "Auto" : "Manual"}
            </span>
            <span className="flex items-center gap-1">
              <Fuel className="h-3.5 w-3.5" />
              {car.fuelType}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {car.seats}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price + Rating + View Details */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-border/50">
            <div>
              <span className="text-2xl font-bold tracking-tight">
                {formatCurrency(car.pricePerDay.toString())}
              </span>
              <span className="text-muted-foreground text-sm ml-1">
                {perDayLabel}
              </span>
              {rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({car.totalReviews})
                  </span>
                </div>
              )}
            </div>
            <Button
              size="sm"
              className="font-semibold rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
            >
              {viewDetailsLabel}
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
