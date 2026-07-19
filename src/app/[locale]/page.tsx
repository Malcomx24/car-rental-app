import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
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
  ChevronRight,
  Phone,
  Quote,
} from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations("home");

  const STATS = [
    { label: t("statsCars"), value: "200+", icon: Car },
    { label: t("statsCustomers"), value: "15,000+", icon: Users },
    { label: t("statsLocations"), value: "25+", icon: MapPin },
    { label: t("statsYears"), value: "10+", icon: Award },
  ];

  const FEATURES = [
    { icon: Shield, title: t("feature1Title"), description: t("feature1Desc") },
    { icon: Clock, title: t("feature2Title"), description: t("feature2Desc") },
    { icon: Zap, title: t("feature3Title"), description: t("feature3Desc") },
    { icon: MapPin, title: t("feature4Title"), description: t("feature4Desc") },
  ];

  const TESTIMONIALS = [
    { name: t("testimonial1Name"), role: t("testimonial1Role"), content: t("testimonial1Content"), rating: 5, avatar: "SM" },
    { name: t("testimonial2Name"), role: t("testimonial2Role"), content: t("testimonial2Content"), rating: 5, avatar: "JR" },
    { name: t("testimonial3Name"), role: t("testimonial3Role"), content: t("testimonial3Content"), rating: 5, avatar: "EC" },
  ];

  const STEPS = [
    { number: "01", title: t("step1Title"), description: t("step1Desc") },
    { number: "02", title: t("step2Title"), description: t("step2Desc") },
    { number: "03", title: t("step3Title"), description: t("step3Desc") },
  ];

  return (
    <div className="flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              {t("heroBadge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              {t("heroTitle")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {t("heroTitleHighlight")}
              </span>{" "}
              {t("heroTitleEnd")}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/cars">
                <Button size="lg" className="bg-white text-gray-950 hover:bg-gray-100 px-8">
                  {t("browseFleet")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                  {t("learnMore")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t("featuresTitle")}</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            {t("featuresSubtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group hover:shadow-lg transition-shadow border-0 bg-card/50">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t("howItWorksTitle")}</h2>
            <p className="text-muted-foreground mt-3">{t("howItWorksSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map((step, i) => (
              <div key={step.number} className="text-center">
                <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="hidden md:block h-6 w-6 text-muted-foreground/30 absolute -right-4 top-1/2 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t("testimonialsTitle")}</h2>
          <p className="text-muted-foreground mt-3">{t("testimonialsSubtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.name} className="border-0 shadow-md">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-sm leading-relaxed mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cars">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8">
                {t("bookNow")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8">
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
