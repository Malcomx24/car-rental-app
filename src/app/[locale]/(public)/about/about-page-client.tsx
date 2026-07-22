"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  Shield,
  Users,
  Award,
  ArrowRight,
  MapPin,
  Clock,
  CreditCard,
  Headphones,
  Home,
  Star,
  Sparkles,
  CheckCircle,
  Plane,
  RotateCcw,
  Eye,
  Handshake,
  Heart,
  Target,
  Globe,
  TrendingUp,
  Lock,
  Quote,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/home/animated-counter";

/* ─── Scroll Fade-In Wrapper ─── */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(elRef.current);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={elRef}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const GLASS_STYLE = {
  background: "rgba(17,24,39,.82)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,.12)",
};

export function AboutPageClient() {
  const t = useTranslations();

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════
          1. HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-morocco.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(0,0,0,.8), rgba(0,0,0,.5), rgba(0,0,0,.6))" }}
        />
        <div className="absolute top-20 right-20 h-72 w-72 bg-amber-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 h-60 w-60 bg-orange-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 animate-fade-in-up">
            <Home className="h-3.5 w-3.5" />
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <span className="text-white">About Us</span>
          </nav>

          <Badge className="mb-4 w-fit bg-white/10 text-white border-white/20 hover:bg-white/20 animate-fade-in-up">
            <Award className="mr-1.5 h-3.5 w-3.5" />
            {t("about.heroBadge")}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-3xl animate-fade-in-up-delay-1">
            {t("about.heroTitle")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Since 2015
            </span>
          </h1>
          <p className="text-gray-300 mt-4 max-w-xl text-lg leading-relaxed animate-fade-in-up-delay-2">
            {t("about.heroDescription")}
          </p>
          <div className="flex flex-wrap gap-3 mt-8 animate-fade-in-up-delay-3">
            <Link href="/cars">
              <Button size="lg" variant="accent" className="font-semibold rounded-xl">
                {t("about.ctaButton")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="dark:border-white/20 dark:text-white dark:hover:bg-white/10 rounded-xl">
                {t("about.contactUs")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. OUR STORY
          ═══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <div
                  className="aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: "url('/hero-morocco.jpg')" }}
                />
              </div>
              <div
                className="absolute -bottom-6 -right-6 rounded-2xl p-5 shadow-xl"
                style={GLASS_STYLE}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">10+</p>
                    <p className="text-xs text-gray-400">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Our Story
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("about.missionTitle")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
              {t("about.missionParagraph1")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("about.missionParagraph2")}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, label: "Our Mission", text: t("about.ourMission") },
                { icon: Eye, label: "Our Vision", text: "Making premium mobility accessible across Morocco" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <item.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="font-semibold text-sm mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. COMPANY STATISTICS
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: 200, suffix: "+", label: t("about.stats.premiumVehicles"), icon: Car },
              { value: 15000, suffix: "+", label: t("about.stats.happyCustomers"), icon: Users },
              { value: 25, suffix: "+", label: t("about.stats.locations"), icon: MapPin },
              { value: 10, suffix: "+", label: t("about.stats.yearsOfExcellence"), icon: Clock },
            ].map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 100}>
                <Card className="group text-center border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="h-7 w-7 text-primary" />
                    </div>
                    <p className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. WHY CHOOSE DRIVERENT
          ═══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-24">
        <FadeIn className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Handshake className="mr-1.5 h-3.5 w-3.5" />
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DriveRent</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need for a seamless premium car rental experience in Morocco
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Car, title: "Premium Fleet", desc: "Over 200 meticulously maintained luxury, sports, and exotic vehicles from world-renowned brands" },
            { icon: CreditCard, title: "Transparent Pricing", desc: "No hidden fees, no surprises. What you see is exactly what you pay, guaranteed" },
            { icon: Plane, title: "Airport Pickup", desc: "Convenient vehicle collection at Agadir, Marrakech, and Casablanca airports" },
            { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock roadside assistance and customer support, anywhere in Morocco" },
            { icon: Shield, title: "Fully Insured", desc: "Comprehensive insurance coverage included on every booking for total peace of mind" },
            { icon: RotateCcw, title: "Flexible Returns", desc: "Drop off at any of our 25+ locations with flexible return options and zero hassle" },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 80}>
              <Card className="group h-full border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-card/80 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-8 relative">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <item.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. OUR VALUES
          ═══════════════════════════════════════════ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("about.valuesTitle")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("about.valuesSubtitle")}</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Handshake, title: "Trust", desc: "We build lasting relationships through transparency, honesty, and consistently delivering on our promises." },
              { icon: Award, title: "Luxury", desc: "Every vehicle in our fleet is meticulously maintained to deliver a premium driving experience." },
              { icon: Sparkles, title: "Innovation", desc: "We embrace technology to make car renting seamless, from online booking to digital confirmations." },
              { icon: Heart, title: "Customer First", desc: "Our customers are at the heart of everything we do. Their satisfaction is our top priority." },
            ].map((value, i) => (
              <FadeIn key={i} delay={i * 100}>
                <Card className="group h-full border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-card/80 backdrop-blur-sm overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-8 relative flex items-start gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <value.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. OUR JOURNEY
          ═══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-24">
        <FadeIn className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
            Our Journey
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("about.journeyTitle")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("about.journeySubtitle")}</p>
        </FadeIn>

        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:-translate-x-px" />

          {[
            { year: "2015", title: "Company Founded", desc: "DriveRent was established in Agadir with a fleet of 20 premium vehicles and a vision to redefine car rental in Morocco." },
            { year: "2017", title: "Expanded to Marrakech", desc: "Opened our second major branch in Marrakech, bringing premium vehicle rentals to the Red City." },
            { year: "2019", title: "5,000 Customers", desc: "Reached the milestone of 5,000 satisfied customers, cementing our reputation as a trusted rental partner." },
            { year: "2021", title: "Airport Pickup Service", desc: "Launched convenient airport pickup and drop-off services at Agadir, Marrakech, and Casablanca airports." },
            { year: "2023", title: "Fleet Expansion", desc: "Expanded our fleet to over 200 premium vehicles, including luxury sedans, SUVs, and sports cars." },
            { year: "2025", title: "25+ Locations", desc: "Opened more than 25 service locations nationwide, making premium mobility accessible across Morocco." },
          ].map((milestone, i) => (
            <FadeIn key={milestone.year} delay={i * 100}>
              <div className={`relative flex items-start gap-6 mb-12 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/30">
                    {milestone.year.slice(2)}
                  </div>
                </div>

                <div className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${i % 2 === 0 ? "md:pr-4" : "md:pl-4"}`}>
                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <p className="text-sm font-bold text-primary mb-1">{milestone.year} — {milestone.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {milestone.desc}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. MOROCCO COVERAGE
          ═══════════════════════════════════════════ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              Morocco Coverage
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Morocco with DriveRent</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Premium vehicle rental available in Morocco's most beautiful destinations
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Agadir", gradient: "from-amber-500 to-orange-600", desc: "Sun-kissed beaches and a relaxed coastal atmosphere. Perfect for oceanfront drives along the Corniche." },
              { name: "Marrakech", gradient: "from-red-500 to-rose-600", desc: "The Red City's vibrant souks, palaces, and the Atlas Mountains as your backdrop." },
              { name: "Casablanca", gradient: "from-blue-500 to-indigo-600", desc: "Morocco's economic heart — modern elegance meets Moroccan tradition on every boulevard." },
              { name: "Tangier", gradient: "from-cyan-500 to-teal-600", desc: "Where the Atlantic meets the Mediterranean. A city of culture, history, and stunning coastal drives." },
              { name: "Essaouira", gradient: "from-emerald-500 to-green-600", desc: "Windy beaches, art galleries, and laid-back coastal charm on the Atlantic shore." },
              { name: "Chefchaouen", gradient: "from-blue-400 to-blue-600", desc: "The blue pearl of the Rif Mountains — a breathtaking destination for scenic mountain drives." },
            ].map((city) => (
              <FadeIn key={city.name} delay={0}>
                <div className="group relative overflow-hidden rounded-2xl min-h-[220px] flex flex-col justify-end">
                  <div className={`absolute inset-0 bg-gradient-to-br ${city.gradient}`} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative z-10 p-6">
                    <h3 className="text-white text-xl font-bold mb-2">{city.name}</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">{city.desc}</p>
                    <Link href="/locations">
                      <Button size="sm" variant="outline" className="dark:border-white/30 dark:text-white dark:hover:bg-white/10 border-white/30 text-white hover:bg-white/10 rounded-xl text-xs font-semibold">
                        Explore
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. CUSTOMER TRUST
          ═══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-24">
        <FadeIn className="text-center mb-16">
          <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800">
            <Star className="mr-1.5 h-3.5 w-3.5" />
            Customer Trust
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our reputation speaks for itself — rated highest in Moroccan premium car rental
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <FadeIn delay={0}>
            <Card className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-6 w-6 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-3xl font-bold mb-1">4.9/5</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={100}>
            <Card className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <p className="text-3xl font-bold mb-1">15,000+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={200}>
            <Card className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-3xl font-bold mb-1">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={300}>
            <Card className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <Quote className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-3xl font-bold mb-1">5,000+</p>
                <p className="text-sm text-muted-foreground">Verified Reviews</p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9. SAFETY & QUALITY
          ═══════════════════════════════════════════ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <Badge className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
              <Shield className="mr-1.5 h-3.5 w-3.5" />
              Safety & Quality
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Safety, Our Priority</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every vehicle undergoes rigorous inspections and every booking is fully protected
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: CheckCircle, title: "150-Point Inspection", desc: "Every vehicle passes a comprehensive mechanical, safety, and cleanliness check before each rental." },
              { icon: Shield, title: "Fully Insured", desc: "Comprehensive insurance coverage is included on every booking for total peace of mind." },
              { icon: Star, title: "Verified Reviews", desc: "Real feedback from real customers — every review is verified to ensure authenticity." },
              { icon: Lock, title: "Secure Payments", desc: "256-bit encryption powers every transaction, keeping your financial data completely safe." },
              { icon: Headphones, title: "24/7 Assistance", desc: "Round-the-clock roadside support and customer service, wherever you are in Morocco." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <Card className="group h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all duration-500">
                      <item.icon className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          10. FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-morocco.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(0,0,0,.85), rgba(0,0,0,.6))" }}
        />
        <div className="absolute top-10 left-10 h-40 w-40 bg-amber-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 h-32 w-32 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative container mx-auto px-4 text-center">
          <FadeIn>
            <Badge className="mb-6 bg-white/10 text-white border-white/20">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Get Started
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
              Ready for Your Next Journey?
            </h2>
            <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10">
              Join thousands of satisfied customers who trust DriveRent for their travels across Morocco
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/cars">
                <Button size="lg" variant="accent" className="font-semibold rounded-xl">
                  {t("about.ctaButton")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="dark:border-white/20 dark:text-white dark:hover:bg-white/10 rounded-xl">
                  {t("about.contactUs")}
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
