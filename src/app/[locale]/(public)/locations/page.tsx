"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  CreditCard,
  Star,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Globe,
  Calendar,
  FileCheck,
  Truck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface Location {
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
  isActive: boolean;
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

/* ─── Morocco Map SVG ─── */
function MoroccoMap({
  locations,
  highlightedId,
  onMarkerClick,
}: {
  locations: Location[];
  highlightedId: string | null;
  onMarkerClick: (id: string) => void;
}) {
  const cityCoords: Record<string, { x: number; y: number }> = {
    "Agadir": { x: 240, y: 310 },
    "Marrakech": { x: 260, y: 260 },
    "Casablanca": { x: 220, y: 220 },
    "Essaouira": { x: 210, y: 290 },
    "Rabat": { x: 230, y: 180 },
    "Tangier": { x: 215, y: 100 },
    "Fes": { x: 285, y: 180 },
    "Ouarzazate": { x: 310, y: 290 },
  };

  return (
    <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto">
      <svg viewBox="0 0 500 450" className="w-full h-full">
        <defs>
          <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(234,179,8)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="rgb(249,115,22)" stopOpacity="0.08" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Morocco outline */}
        <path
          d="M180,90 L220,85 L250,95 L280,90 L310,100 L330,120 L340,150 L350,180 L360,200 L350,230 L340,260 L330,280 L320,300 L300,320 L280,340 L260,350 L240,345 L220,335 L200,320 L190,300 L180,270 L175,240 L170,210 L172,180 L175,150 L178,120 Z"
          fill="url(#mapGrad)"
          stroke="rgb(234,179,8)"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Grid lines */}
        {[150, 200, 250, 300].map((y) => (
          <line key={`h${y}`} x1="160" y1={y} x2="370" y2={y} stroke="rgb(255,255,255)" strokeOpacity="0.04" strokeWidth="0.5" />
        ))}
        {[200, 250, 300, 350].map((x) => (
          <line key={`v${x}`} x1={x} y1="80" x2={x} y2="360" stroke="rgb(255,255,255)" strokeOpacity="0.04" strokeWidth="0.5" />
        ))}

        {/* Location markers */}
        {locations.map((loc) => {
          const coords = cityCoords[loc.city] || { x: 250, y: 220 };
          const isHighlighted = highlightedId === loc.id;
          return (
            <g
              key={loc.id}
              className="cursor-pointer"
              onClick={() => onMarkerClick(loc.id)}
              filter={isHighlighted ? "url(#glow)" : undefined}
            >
              {isHighlighted && (
                <circle cx={coords.x} cy={coords.y} r="18" fill="rgb(234,179,8)" opacity="0.15">
                  <animate attributeName="r" from="12" to="22" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.2" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isHighlighted ? "8" : "6"}
                fill={isHighlighted ? "rgb(234,179,8)" : "rgb(249,115,22)"}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              <text
                x={coords.x}
                y={coords.y - 14}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="600"
                className="pointer-events-none"
              >
                {loc.city}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── FAQ Accordion Item ─── */
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

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function LocationsPage() {
  const t = useTranslations("locations");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await fetch("/api/locations");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const locations: Location[] = data?.data || [];
  const activeLocations = locations.filter((l) => l.isActive);

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
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
          {/* Breadcrumb */}
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
            {t("heroDescription", { count: activeLocations.length > 0 ? activeLocations.length : "3+" })}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MAP SECTION
          ═══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 -mt-16 relative z-10 mb-16">
        <div
          className="rounded-2xl p-6 md:p-8 shadow-2xl bg-card border border-border backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{t("mapTitle")}</h2>
              <p className="text-muted-foreground text-sm">{t("mapPlaceholderDesc")}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <MoroccoMap
              locations={activeLocations}
              highlightedId={highlightedId}
              onMarkerClick={setHighlightedId}
            />
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LOCATIONS GRID
          ═══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            {t("airports")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("heroTitle")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("heroSubtitle")}</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activeLocations.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
              <MapPin className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("comingSoonTitle")}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">{t("comingSoonDescription")}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeLocations.map((location) => (
              <Card
                key={location.id}
                className={`group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-card/80 backdrop-blur-sm cursor-pointer ${
                  highlightedId === location.id ? "ring-2 ring-amber-400 shadow-amber-400/20" : ""
                }`}
                onMouseEnter={() => setHighlightedId(location.id)}
                onMouseLeave={() => setHighlightedId(null)}
              >
                {/* Image placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-primary/20" />
                  </div>
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-green-500/90 text-white border-0 text-xs font-semibold backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-white mr-1.5 inline-block" />
                      {t("open")}
                    </Badge>
                    {location.isAirport && (
                      <Badge className="bg-blue-500/90 text-white border-0 text-xs font-semibold backdrop-blur-sm">
                        <Plane className="h-3 w-3 mr-1" />
                        Airport
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    {location.name}
                  </h3>

                  <div className="space-y-2.5 mb-5">
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      {location.address}, {location.city}, {location.state}
                    </p>
                    {location.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0" />
                        {location.phone}
                      </p>
                    )}
                    {location.operatingHours && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0" />
                        {String(location.operatingHours)}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Car className="h-3.5 w-3.5" />
                      12 {t("carsAvailable")}
                    </span>
                    {location.isAirport && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Plane className="h-3.5 w-3.5" />
                        {t("pickupAvailable")}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/cars?location=${location.id}`} className="flex-1">
                      <Button variant="accent" className="w-full font-semibold rounded-xl">
                        {t("browseCars")}
                      </Button>
                    </Link>
                    {location.latitude && location.longitude && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 rounded-xl"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`,
                            "_blank"
                          )
                        }
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    )}
                    {location.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 rounded-xl text-green-600 dark:text-green-400"
                        onClick={() =>
                          window.open(
                            `https://wa.me/${location.phone.replace(/[^0-9]/g, "")}`,
                            "_blank"
                          )
                        }
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          AIRPORT PICKUP SECTION
          ═══════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════
          SERVICE COVERAGE AREAS
          ═══════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════
          BRANCH REVIEWS
          ═══════════════════════════════════════════ */}
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
                  {/* Stars */}
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
                        <p className="text-xs text-muted-foreground">{t("branchReviews")}</p>
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

      {/* ═══════════════════════════════════════════
          FAQ SECTION
          ═══════════════════════════════════════════ */}
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
