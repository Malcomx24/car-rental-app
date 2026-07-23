"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  Home,
  ChevronRight,
  Plane,
  Building2,
  Car,
  Headphones,
  Calendar,
  Zap,
  MessageCircle,
  Star,
  Users,
  Shield,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  ExternalLink,
  Quote,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  const [elRef, setElRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(elRef);
    return () => obs.disconnect();
  }, [elRef, delay]);

  return (
    <div
      ref={setElRef}
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
  background: "var(--color-card)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid var(--color-border)",
};

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function ContactPage() {
  const t = useTranslations("contact");

  const CONTACT_INFO = [
    {
      icon: Phone,
      label: t("info.phone.label"),
      value: "+212 661 23 45 67",
      description: t("info.phone.description"),
      action: "tel:+212661234567",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Mail,
      label: t("info.email.label"),
      value: "contact@driverent.ma",
      description: t("info.email.description"),
      action: "mailto:contact@driverent.ma",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: MapPin,
      label: t("info.headquarters.label"),
      value: "Boulevard Mohammed V, Agadir, Maroc",
      description: "",
      action: "https://maps.google.com/?q=Boulevard+Mohammed+V+Agadir+Morocco",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Clock,
      label: t("info.hours.label"),
      value: t("info.hours.value"),
      description: t("info.hours.description"),
      action: undefined,
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Headphones,
      label: "Emergency Roadside",
      value: "+212 600 000 000",
      description: "Available 24/7 for emergencies",
      action: "tel:+212600000000",
      color: "from-red-500 to-rose-600",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp Support",
      value: "+212 661 23 45 67",
      description: "Quick replies on WhatsApp",
      action: "https://wa.me/212661234567",
      color: "from-green-500 to-emerald-600",
    },
  ];

  const INQUIRY_TYPES = [
    t("inquiryTypes.general"),
    t("inquiryTypes.booking"),
    t("inquiryTypes.billing"),
    t("inquiryTypes.partnership"),
    t("inquiryTypes.press"),
    t("inquiryTypes.technical"),
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.email || !form.message) {
        toast.error(t("fillRequiredFields"));
        return;
      }
      setSending(true);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to send");
        setSent(true);
        toast.success(t("messageSentSuccess"));
      } catch {
        toast.error(t("failedToSend"));
      } finally {
        setSending(false);
      }
    },
    [form, t]
  );

  const WHY_CONTACT = [
    { icon: Plane, title: "Airport Pickup", desc: "Convenient vehicle collection at all major Moroccan airports including Agadir, Marrakech, and Casablanca" },
    { icon: Building2, title: "Corporate Rentals", desc: "Tailored fleet solutions for businesses with dedicated account managers and flexible billing" },
    { icon: Car, title: "Luxury Fleet", desc: "Access to premium vehicles from Mercedes, BMW, Porsche, and Range Rover for special occasions" },
    { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock customer service and roadside assistance across Morocco" },
    { icon: Calendar, title: "Flexible Booking", desc: "Free cancellation up to 24 hours before pickup with no hidden fees or charges" },
    { icon: Zap, title: "Fast Response", desc: "Guaranteed response within 2 hours during business hours for all inquiries" },
  ];

  const SOCIAL_LINKS = [
    { icon: Facebook, label: "Facebook", href: "https://facebook.com/driverent", color: "hover:bg-blue-600" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/driverent", color: "hover:bg-pink-600" },
    { icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.28 8.28 0 0 0 4.87 1.56V6.98a4.83 4.83 0 0 1-1.11-.29z" />
      </svg>
    ), label: "TikTok", href: "https://tiktok.com/@driverent", color: "hover:bg-foreground hover:text-background" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/driverent", color: "hover:bg-blue-700" },
    { icon: Star, label: "Google Reviews", href: "https://g.page/driverent/review", color: "hover:bg-amber-500" },
  ];

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
          style={{ background: "linear-gradient(135deg, rgba(0,0,0,.8), rgba(0,0,0,.55), rgba(0,0,0,.65))" }}
        />
        {/* Floating gradient orbs */}
        <div className="absolute top-16 right-16 h-64 w-64 bg-amber-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-16 left-16 h-48 w-48 bg-orange-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in-up">
            <Home className="h-3.5 w-3.5" />
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{t("title")}</span>
          </nav>

          <Badge className="mb-4 w-fit bg-white/10 text-white border-white/20 hover:bg-white/20 animate-fade-in-up">
            <Headphones className="mr-1.5 h-3.5 w-3.5" />
            Premium Customer Support
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-3xl animate-fade-in-up-delay-1">
            {t("heroTitle")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Our Team
            </span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed animate-fade-in-up-delay-2">
            {t("heroDescription")}
          </p>
          <div className="flex flex-wrap gap-3 mt-8 animate-fade-in-up-delay-3">
            <a href="tel:+212661234567">
              <Button size="lg" variant="accent" className="font-semibold rounded-xl">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </a>
            <Link href="/cars">
              <Button size="lg" variant="outline" className="rounded-xl">
                <Car className="mr-2 h-4 w-4" />
                Browse Fleet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. CONTACT SECTION
          ═══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* LEFT: Contact Form */}
          <FadeIn className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8 md:p-10">
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{t("messageSentTitle")}</h3>
                    <p className="text-muted-foreground max-w-sm mb-8">
                      {t("messageSentDescription")}
                    </p>
                    <Button
                      variant="accent" className="font-semibold rounded-xl"
                      onClick={() => {
                        setSent(false);
                        setForm({ name: "", email: "", phone: "", inquiryType: "", message: "" });
                      }}
                    >
                      {t("sendAnotherMessage")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold mb-1">{t("sendUsMessage")}</h2>
                      <p className="text-sm text-muted-foreground">We&apos;ll get back to you within 24 hours</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">{t("form.fullName")} *</Label>
                        <Input
                          id="name"
                          placeholder="Mohamed Alaoui"
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          required
                          className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">{t("form.email")} *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="mohamed@exemple.com"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          required
                          className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">{t("form.phone")}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+212 661 23 45 67"
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{t("form.inquiryType")}</Label>
                        <Select value={form.inquiryType} onValueChange={(v) => setForm((p) => ({ ...p, inquiryType: v ?? "" }))}>
                          <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50">
                            <SelectValue placeholder={t("form.selectTopic")} />
                          </SelectTrigger>
                          <SelectContent>
                            {INQUIRY_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">{t("form.message")} *</Label>
                      <Textarea
                        id="message"
                        placeholder={t("form.howCanWeHelp")}
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        required
                        className="rounded-xl bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={sending}
                      variant="accent" className="h-12 px-8 font-semibold rounded-xl text-base"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {t("form.sending")}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t("form.sendMessage")}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* RIGHT: Contact Info Cards */}
          <FadeIn className="lg:col-span-2" delay={200}>
            <div className="space-y-4">
              {CONTACT_INFO.map((info, i) => {
                const Wrapper = info.action ? "a" : "div";
                const wrapperProps = info.action
                  ? { href: info.action, target: info.action.startsWith("http") ? "_blank" : undefined, rel: info.action.startsWith("http") ? "noopener noreferrer" : undefined }
                  : {};
                return (
                  <Wrapper key={info.label} {...wrapperProps} className="block">
                    <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 bg-card/80 backdrop-blur-sm cursor-pointer">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <info.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm mb-0.5">{info.label}</p>
                          <p className="text-sm text-foreground truncate">{info.value}</p>
                          {info.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{info.description}</p>
                          )}
                        </div>
                        {info.action && (
                          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </CardContent>
                    </Card>
                  </Wrapper>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. GOOGLE MAPS
          ═══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 pb-24">
        <FadeIn className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            Find Our Office
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Find Our Office</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Visit us in Agadir, Morocco
          </p>
        </FadeIn>

        <FadeIn>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.846!2d-9.597!3d30.427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDI1JzQzLjIiTiA5wrAzNSc0OS4yIlc!5e0!3m2!1sen!2sma!4v1"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DriveRent Office Location - Agadir, Morocco"
              className="w-full"
            />
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════
          4. WHY CONTACT US
          ═══════════════════════════════════════════ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Shield className="mr-1.5 h-3.5 w-3.5" />
              Why Contact Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Can We Help?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our team is ready to assist you with any questions about our services
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CONTACT.map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <Card className="group h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-7">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <item.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. TRUST SECTION (Animated Stats)
          ═══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { target: 15000, suffix: "+", label: "Happy Customers", icon: Users },
            { target: 49, suffix: "", label: "Google Rating", icon: Star, display: "4.9" },
            { target: 200, suffix: "+", label: "Vehicles", icon: Car },
            { target: 24, suffix: "/7", label: "Support", icon: Headphones },
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 100}>
              <Card className="group text-center border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                    {stat.display ? (
                      <>
                        {stat.display}
                        <span className="text-amber-400">★</span>
                      </>
                    ) : (
                      <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. SOCIAL MEDIA
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Globe className="mr-1.5 h-3.5 w-3.5" />
              Follow Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Connected</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10">
              Follow us on social media for the latest updates, promotions, and travel inspiration
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {SOCIAL_LINKS.map((social, i) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm text-sm font-medium hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${social.color}`}
                >
                  <social.icon className="h-5 w-5" />
                  {social.label}
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. FINAL CTA
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
              Ready to Drive Across Morocco?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Book your premium vehicle today and experience the best of Moroccan roads
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/cars">
                <Button size="lg" variant="accent" className="font-semibold rounded-xl">
                  <Car className="mr-2 h-4 w-4" />
                  Reserve Your Vehicle
                </Button>
              </Link>
              <Link href="/cars">
              <Button size="lg" variant="outline" className="rounded-xl">
                  Browse Fleet
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
