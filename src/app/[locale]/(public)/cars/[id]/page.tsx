"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft, Star, Fuel, Users, Settings2, Gauge, Palette,
  Calendar, Shield, ChevronRight, Loader2, Heart, Share2,
  MapPin, Check, Info
} from "lucide-react";
import { CarReviews } from "@/components/shared/car-reviews";
import { ReviewForm } from "@/components/shared/review-form";
import { useFavorites } from "@/hooks/use-favorites";
import { useTranslations } from "next-intl";

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
  engineSize: string | null;
  horsepower: number | null;
  topSpeed: string | null;
  zeroToSixty: string | null;
  features: string[];
  status: string;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  brand: { name: string; logo: string | null };
  category: { name: string };
  images: { id: string; url: string; alt: string; isPrimary: boolean; order: number }[];
}

const FUEL_LABELS: Record<string, string> = {
  GASOLINE: "Gasoline", DIESEL: "Diesel", ELECTRIC: "Electric", HYBRID: "Hybrid", PLUG_IN_HYBRID: "Plug-in Hybrid",
};

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations("carDetail");
  const router = useRouter();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { favoriteIds, toggleFavorite } = useFavorites();

  const fetchCar = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cars/${id}`);
      const json = await res.json();
      if (json.success) setCar(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    params.then(({ id }) => fetchCar(id));
  }, [params, fetchCar]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-medium">{t("notFound")}</p>
        <Link href="/cars"><Button variant="outline">{t("browseCars")}</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">{t("breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/cars" className="hover:text-foreground transition-colors">{t("breadcrumbCars")}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{car.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted">
                {car.images[selectedImage] ? (
                  <img
                    src={car.images[selectedImage].url}
                    alt={car.images[selectedImage].alt || car.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">{t("noImageAvailable")}</div>
                )}
                {car.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-primary">{t("featured")}</Badge>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                    onClick={() => toggleFavorite(car.id)}
                  >
                    <Heart className={`h-5 w-5 ${favoriteIds.has(car.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                  <button className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {car.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {car.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                      }`}
                    >
                      <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Info */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">{car.brand.name}</p>
                  <h1 className="text-3xl font-bold mt-1">{car.name}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary">{car.category.name}</Badge>
                    <Badge variant="secondary">{car.year}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{Number(car.averageRating).toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({car.totalReviews} {t("reviews")})</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mt-4 leading-relaxed">{car.description}</p>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {[
                { icon: <Fuel className="h-5 w-5" />, label: t("specFuel"), value: FUEL_LABELS[car.fuelType] || car.fuelType },
                { icon: <Settings2 className="h-5 w-5" />, label: t("specTransmission"), value: car.transmission.replace("_", " ") },
                { icon: <Users className="h-5 w-5" />, label: t("specSeats"), value: `${car.seats} ${t("specSeatsValue")}` },
                { icon: <Palette className="h-5 w-5" />, label: t("specColor"), value: car.color },
                { icon: <Gauge className="h-5 w-5" />, label: t("specMileage"), value: `${car.mileage.toLocaleString("fr-MA")} km` },
              ].map((spec) => (
                <Card key={spec.label}>
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center text-primary mb-2">{spec.icon}</div>
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                    <p className="text-sm font-medium capitalize">{spec.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features */}
            {car.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">{t("featuresTitle")}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {car.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Specs */}
            {(car.engineSize || car.horsepower || car.topSpeed || car.zeroToSixty) && (
              <div>
                <h2 className="text-xl font-semibold mb-3">{t("performanceTitle")}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {car.engineSize && (
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">{t("specEngine")}</p>
                      <p className="font-semibold">{car.engineSize}</p>
                    </div>
                  )}
                  {car.horsepower && (
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">{t("specHorsepower")}</p>
                      <p className="font-semibold">{car.horsepower} HP</p>
                    </div>
                  )}
                  {car.topSpeed && (
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">{t("specTopSpeed")}</p>
                      <p className="font-semibold">{car.topSpeed}</p>
                    </div>
                  )}
                  {car.zeroToSixty && (
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">{t("specZeroToSixty")}</p>
                      <p className="font-semibold">{car.zeroToSixty}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{t("reviewsTitle")}</h2>
              <CarReviews carId={car.id} />
              <div className="mt-6">
                <ReviewForm carId={car.id} />
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("startingFrom")}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${Number(car.pricePerDay).toFixed(0)}</span>
                      <span className="text-muted-foreground">/{t("day")}</span>
                    </div>
                  </div>

                  {/* Pricing Tiers */}
                  {(car.weekendPricePerDay || car.weeklyPrice || car.monthlyPrice) && (
                    <div className="space-y-2 text-sm">
                      {car.weekendPricePerDay && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("weekendRate")}</span>
                          <span className="font-medium">${Number(car.weekendPricePerDay).toFixed(0)}/{t("day")}</span>
                        </div>
                      )}
                      {car.weeklyPrice && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("weeklyRate")}</span>
                          <span className="font-medium">${Number(car.weeklyPrice).toFixed(0)}/{t("week")}</span>
                        </div>
                      )}
                      {car.monthlyPrice && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("monthlyRate")}</span>
                          <span className="font-medium">${Number(car.monthlyPrice).toFixed(0)}/{t("month")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {car.status === "AVAILABLE" ? (
                    <Link href={`/book/${car.id}`} className="block">
                      <Button size="lg" className="w-full text-lg">{t("bookNow")}</Button>
                    </Link>
                  ) : (
                    <Button size="lg" className="w-full text-lg" disabled>
                      {car.status.replace("_", " ")}
                    </Button>
                  )}

                  {car.securityDeposit > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4 shrink-0" />
                      <span>${Number(car.securityDeposit).toFixed(0)} {t("refundableDeposit")}</span>
                    </div>
                  )}

                  <div className="space-y-3 pt-3 border-t text-sm">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium">{t("fullInsurance")}</p>
                        <p className="text-xs text-muted-foreground">{t("addAtCheckout")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium">{t("freeCancellation")}</p>
                        <p className="text-xs text-muted-foreground">{t("cancellationDetail")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium">{t("bookingsCount", { count: car.totalBookings })}</p>
                        <p className="text-xs text-muted-foreground">{t("popularVehicle")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
