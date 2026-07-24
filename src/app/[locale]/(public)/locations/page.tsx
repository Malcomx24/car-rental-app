"use client";

import { useState, useRef, useEffect, useCallback, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Loader2,
  Car,
  ChevronRight,
  Home,
  Plane,
  Shield,
  Star,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  FileCheck,
  Truck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const GoogleMap = lazy(() =>
  import("@/components/locations/google-map").then((m) => ({ default: m.GoogleMap }))
);

interface Agency {
  id: string;
  name: string;
  slug: string;
  address: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  operatingHours: string | null;
  isAirport: boolean;
  totalBookings: number;
  availableCars: number;
}

const AIRPORT_DATA = [
  { name: "Agadir Al Massira Airport", code: "AGA", distance: "25 min", branch: "Agadir City Center" },
  { name: "Marrakech Menara Airport", code: "RAK", distance: "20 min", branch: "Marrakech Gueliz" },
  { name: "Casablanca Mohammed V Airport", code: "CMN", distance: "35 min", branch: "Casablanca Downtown" },
];

const SERVICE_AREAS = [
  "Agadir", "Taghazout", "Tamraght", "Aourir", "Inezgane", "Drarga",
  "Marrakech", "Casablanca", "Essaouira", "Taroudant",
];

const REVIEWS = [
  {
    name: "Youssef B.",
    avatar: "YB",
    rating: 5,
    content: "Excellent service at the Agadir branch. Quick pickup, spotless car, and the staff were incredibly helpful with route suggestions for Taghazout.",
    vehicle: "Mercedes-Benz C-Class",
    branch: "Agadir",
  },
  {
    name: "Sarah M.",
    avatar: "SM",
    rating: 5,
    content: "The airport pickup was seamless. Our car was ready before we even cleared customs. The Range Rover was perfect for our Atlas Mountains trip.",
    vehicle: "Range Rover Sport",
    branch: "Marrakech",
  },
  {
    name: "Amine K.",
    avatar: "AK",
    rating: 5,
    content: "Third time renting from DriveRent. The online booking is effortless and the cars are always in pristine condition. Highly recommended!",
    vehicle: "BMW 5 Series",
    branch: "Casablanca",
  },
];

const FAQ_ITEMS = [
  { key: "airport", icon: Plane },
  { key: "hotel", icon: Truck },
  { key: "oneWay", icon: ArrowRight },
  { key: "docs", icon: FileCheck },
];

function FaqItem({
  q,
  a,
  icon: Icon,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30">
      <button
        className="w-full flex items-center gap-4 p-5 text-left bg-muted/50 hover:bg-muted transition-colors"
        onClick={onToggle}
      >
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="flex-1 font-semibold text-foreground">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="w-full h-[450px] md:h-[550px] rounded-2xl overflow-hidden bg-muted animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Loading map...</p>
      </div>
    </div>
  );
}

export default function LocationsPage() {
  const t = useTranslations("locations");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["agencies"],
    queryFn: async () => {
      const res = await fetch("/api/locations/agencies");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const agencies: Agency[] = data?.data || [];

  const handleMarkerClick = useCallback(
    (id: string) => {
      setHighlightedId(id);
      if (isMobile) {
        const cardEl = cardRefs.current.get(id);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    },
    [isMobile]
  );

  const handleCardClick = useCallback((id: string) => {
    setHighlightedId(id);
  }, []);

  const registerCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(id, el);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-morocco.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(0,0,0,.75), rgba(0,0,0,.5))" }}
        />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in-up">
            <Home className="h-3.5 w-3.5" />
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{t("title")}</span>
          </nav>
          <Badge className="mb-4 w-fit bg-white/10 text-white border-white/20 hover:bg-white/20 animate-fade-in-up">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            {t("title")}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight animate-fade-in-up-delay-1">
            {t("heroTitle")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Morocco
            </span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed animate-fade-in-up-delay-2">
            {t("heroDescription", { count: agencies.length > 0 ? agencies.length : "3+" })}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-16 relative z-10 mb-16">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 order-1">
            {isLoading ? (
              <MapSkeleton />
            ) : (
              <Suspense fallback={<MapSkeleton />}>
                <GoogleMap
                  locations={agencies}
                  highlightedId={highlightedId}
                  onMarkerClick={handleMarkerClick}
                />
              </Suspense>
            )}
          </div>

          <div className="lg:col-span-2 order-2 max-h-[550px] overflow-y-auto pr-1 space-y-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden border-0">
                    <Skeleton className="h-28 w-full rounded-none" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                ))
              : agencies.length === 0
                ? (
                    <div className="text-center py-12">
                      <MapPin className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
                      <p className="text-muted-foreground">{t("comingSoonTitle")}</p>
                    </div>
                  )
                : (
                    agencies.map((agency) => (
                      <Card
                        key={agency.id}
                        ref={(el) => registerCardRef(agency.id, el)}
                        className={`group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
                          highlightedId === agency.id
                            ? "ring-2 ring-amber-400 shadow-amber-400/20"
                            : ""
                        }`}
                        onClick={() => handleCardClick(agency.id)}
                      >
                        <div className="relative h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-primary/20" />
                          </div>
                          <div className="absolute top-2 left-2 flex gap-1.5">
                            <Badge className="bg-green-500/90 text-white border-0 text-xs font-semibold backdrop-blur-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-white mr-1 inline-block" />
                              {t("open")}
                            </Badge>
                            {agency.isAirport && (
                              <Badge className="bg-blue-500/90 text-white border-0 text-xs font-semibold backdrop-blur-sm">
                                <Plane className="h-3 w-3 mr-1" />
                                Airport
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-1.5 group-hover:text-primary transition-colors">
                            {agency.name}
                          </h3>

                          <div className="space-y-1.5 mb-3 text-sm text-muted-foreground">
                            <p className="flex items-start gap-2">
                              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                              <span>{agency.address}, {agency.city}</span>
                            </p>
                            {agency.phone && (
                              <p className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                {agency.phone}
                              </p>
                            )}
                            <p className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span>Mon-Sat: 8:00 AM - 8:00 PM</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Car className="h-3.5 w-3.5" />
                              {agency.availableCars} {t("carsAvailable")}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              href={`/cars?location=${agency.id}`}
                              className="flex-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant="accent" className="w-full font-semibold rounded-xl text-sm h-9">
                                {t("browseCars")}
                              </Button>
                            </Link>
                            {agency.phone && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0 rounded-xl text-green-600 dark:text-green-400 h-9"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    `https://wa.me/${agency.phone.replace(/[^0-9]/g, "")}`,
                                    "_blank"
                                  );
                                }}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {agency.latitude && agency.longitude && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0 rounded-xl h-9"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    `https://www.google.com/maps/dir/?api=1&destination=${agency.latitude},${agency.longitude}`,
                                    "_blank"
                                  );
                                }}
                              >
                                <Navigation className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-800">
              <Plane className="mr-1.5 h-3.5 w-3.5" />
              {t("airportPickup")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("airportPickup")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("airportPickupDesc")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {AIRPORT_DATA.map((airport) => (
              <Card key={airport.code} className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Plane className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs mb-1">{airport.code}</Badge>
                      <h3 className="font-semibold text-sm">{airport.name}</h3>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>{t("distanceFrom")}</span>
                      <span className="font-medium text-foreground">{airport.distance}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Nearest branch</span>
                      <span className="font-medium text-foreground">{airport.branch}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t("pickupAvailable")}</span>
                      <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Yes
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Shield className="mr-1.5 h-3.5 w-3.5" />
            {t("nearbyAreas")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("nearbyAreas")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("nearbyAreasDesc")}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {SERVICE_AREAS.map((area) => (
            <span
              key={area}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-muted/30 text-sm font-medium text-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 cursor-default"
            >
              <MapPin className="h-3.5 w-3.5 text-primary/60" />
              {area}
            </span>
          ))}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800">
              <Star className="mr-1.5 h-3.5 w-3.5" />
              {t("branchReviews")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("branchReviews")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("branchReviewsDesc")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {REVIEWS.map((review, i) => (
              <Card key={i} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    &ldquo;{review.content}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.branch}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {review.vehicle}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {t("faq")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("faq")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("faqDesc")}</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={item.key}
              icon={item.icon}
              q={t(`faq${item.key.charAt(0).toUpperCase() + item.key.slice(1)}Q` as any)}
              a={t(`faq${item.key.charAt(0).toUpperCase() + item.key.slice(1)}A` as any)}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
