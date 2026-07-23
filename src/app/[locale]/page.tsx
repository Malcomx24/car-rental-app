import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { AnimatedCounter } from "@/components/home/animated-counter";
import { BookingWidget } from "@/components/home/booking-widget";
import {
  Car,
  Shield,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  Zap,
  Users,
  Award,
  Phone,
  Quote,
  CheckCircle,
  Sparkles,
  Plane,
  Palmtree,
  Mountain,
  Building,
  Landmark,
  Waves,
  Sun,
  CreditCard,
  HeadphonesIcon,
  RotateCcw,
} from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations("home");

  const STATS = [
    { label: t("statsCars"), value: 200, suffix: "+", icon: Car },
    { label: t("statsCustomers"), value: 15000, suffix: "+", icon: Users },
    { label: t("statsLocations"), value: 25, suffix: "+", icon: MapPin },
    { label: t("statsYears"), value: 10, suffix: "+", icon: Award },
  ];

  const WHY_CHOOSE = [
    { icon: Sparkles, title: t("why1Title"), desc: t("why1Desc") },
    { icon: CreditCard, title: t("why2Title"), desc: t("why2Desc") },
    { icon: RotateCcw, title: t("why3Title"), desc: t("why3Desc") },
    { icon: MapPin, title: t("why4Title"), desc: t("why4Desc") },
    { icon: HeadphonesIcon, title: t("why5Title"), desc: t("why5Desc") },
    { icon: CheckCircle, title: t("why6Title"), desc: t("why6Desc") },
  ];

  const DESTINATIONS = [
    { key: "Agadir", icon: Sun, gradient: "from-amber-500 to-orange-600", title: t("destAgadir"), desc: t("destAgadirDesc") },
    { key: "Marrakech", icon: Landmark, gradient: "from-red-500 to-rose-600", title: t("destMarrakech"), desc: t("destMarrakechDesc") },
    { key: "Casablanca", icon: Building, gradient: "from-blue-500 to-indigo-600", title: t("destCasablanca"), desc: t("destCasablancaDesc") },
    { key: "Tangier", icon: Waves, gradient: "from-cyan-500 to-teal-600", title: t("destTangier"), desc: t("destTangierDesc") },
    { key: "Essaouira", icon: Palmtree, gradient: "from-emerald-500 to-green-600", title: t("destEssaouira"), desc: t("destEssaouiraDesc") },
    { key: "Chefchaouen", icon: Mountain, gradient: "from-blue-400 to-blue-600", title: t("destChefchaouen"), desc: t("destChefchaouenDesc") },
  ];

  const TESTIMONIALS = [
    { name: "Youssef El Idrissi", initials: "YE", role: "CEO, TechMaroc", content: "Service exceptionnel. La BMW Serie 7 était impeccable pour mes déplacements professionnels entre Casablanca et Marrakech. DriveRent est devenu mon partenaire de confiance.", rating: 5 },
    { name: "Sarah Mitchell", initials: "SM", role: "Tourist, London", content: "The Porsche 911 was the perfect car for our Moroccan adventure. The booking was seamless and the team was incredibly helpful. A truly world-class experience!", rating: 5 },
    { name: "Amina Benali", initials: "AB", role: "Travel Blogger", content: "J'ai loué un Range Rover pour un road trip d'Agadir à Chefchaouen. La voiture était parfaite, le service au top. Je recommande vivement DriveRent à tous les voyageurs !", rating: 5 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ═══════════════════════════════════════════
          SECTION 1: HERO
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/hero-morocco.jpg')",
            backgroundSize: "cover",
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,.65), rgba(0,0,0,.45))",
          }}
        />

        {/* Content */}
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="max-w-xl">
              <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 animate-fade-in-up">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {t("heroBadge")}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] text-white animate-fade-in-up-delay-1">
                {t("heroTitle")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                  {t("heroTitleHighlight")}
                </span>{" "}
                {t("heroTitleEnd")}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed animate-fade-in-up-delay-2">
                {t("heroSubtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up-delay-3">
                <Link href="/cars">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-base font-semibold shadow-lg shadow-primary/20">
                    {t("browseFleet")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
              <Button size="lg" variant="outline" className="px-8 text-base">
                    {t("learnMore")}
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground animate-fade-in-up-delay-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>4.9/5</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>{t("trustBarText")} <span className="font-medium">{t("trustBarPartners")}</span></span>
                </div>
              </div>
            </div>

            {/* Right: Booking Widget */}
            <div className="hidden lg:block animate-fade-in-up-delay-2">
              <BookingWidget
                browseFleetLabel={t("browseFleet")}
                pickupLocationLabel="Pickup Location"
                fromLabel="From"
                toLabel="To"
                selectDatePlaceholder="Select date"
                bookNowLabel={t("bookNow")}
                requiredFieldError="This field is required"
                returnAfterPickupError="Return must be after pickup"
              />
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2: TRUST BAR
          ═══════════════════════════════════════════ */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Fully Insured</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Plane className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Airport Pickup</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: STATISTICS
          ═══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 pt-12 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold tracking-tight">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5: WHY CHOOSE US
          ═══════════════════════════════════════════ */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">{t("whyChooseUsTitle")}</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">{t("whyChooseUsSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {WHY_CHOOSE.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="group flex gap-4 p-6 rounded-xl bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6: HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              {t("howItWorksTitle")}
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">{t("howItWorksTitle")}</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              {t("howItWorksSubtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", icon: MapPin, title: t("step1Title"), desc: t("step1Desc") },
              { step: "2", icon: Car, title: t("step2Title"), desc: t("step2Desc") },
              { step: "3", icon: Zap, title: t("step3Title"), desc: t("step3Desc") },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="text-center group">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold mb-3">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7: WHY CHOOSE US (FEATURES) - REUSED
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">{t("featuresTitle")}</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">{t("featuresSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: t("feature1Title"), desc: t("feature1Desc") },
              { icon: Clock, title: t("feature2Title"), desc: t("feature2Desc") },
              { icon: Zap, title: t("feature3Title"), desc: t("feature3Desc") },
              { icon: MapPin, title: t("feature4Title"), desc: t("feature4Desc") },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8: POPULAR DESTINATIONS
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">{t("destinationsTitle")}</h2>
            <p className="text-muted-foreground mt-3">{t("destinationsSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DESTINATIONS.map((dest) => {
              const Icon = dest.icon;
              return (
                <Link key={dest.key} href="/locations">
                  <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${dest.gradient} p-6 min-h-[180px] flex flex-col justify-end hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="relative z-10">
                      <Icon className="h-8 w-8 text-white/80 mb-3" />
                      <h3 className="text-white text-xl font-bold">{dest.title}</h3>
                      <p className="text-white/80 text-sm mt-1">{dest.desc}</p>
                      <span className="inline-flex items-center gap-1 text-white/90 text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                        {t("destinationsCta")}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 9: TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {t("testimonialsBadge")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">{t("testimonialsTitle")}</h2>
            <p className="text-muted-foreground mt-3">{t("testimonialsHighlight")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial, i) => (
              <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-card">
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-sm leading-relaxed mb-6 flex-1">{testimonial.content}</p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 10: TRUST / SAFETY
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
              <Shield className="mr-1.5 h-3.5 w-3.5" />
              {t("trustBadge")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">{t("trustTitle")}</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">{t("trustSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: CheckCircle, title: t("trust1Title"), desc: t("trust1Desc") },
              { icon: Shield, title: t("trust2Title"), desc: t("trust2Desc") },
              { icon: Star, title: t("trust3Title"), desc: t("trust3Desc") },
              { icon: CreditCard, title: t("trust4Title"), desc: t("trust4Desc") },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center p-6 rounded-2xl border bg-card/50 hover:shadow-md transition-shadow">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 11: CTA
          ═══════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(245,158,11,0.08),transparent_60%)]" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cars">
              <Button size="lg" variant="accent" className="px-8 text-base font-semibold">
                {t("bookNow")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
                  <Button size="lg" variant="outline" className="px-8 text-base">
                <Phone className="mr-2 h-4 w-4" />
                {t("contactUs")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
