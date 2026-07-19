import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  Shield,
  Users,
  Award,
  Target,
  Heart,
  Globe,
  Leaf,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  const VALUES = [
    { icon: Shield, title: t("values.trust.title"), description: t("values.trust.description") },
    { icon: Heart, title: t("values.customerFirst.title"), description: t("values.customerFirst.description") },
    { icon: Target, title: t("values.excellence.title"), description: t("values.excellence.description") },
    { icon: Globe, title: t("values.accessibility.title"), description: t("values.accessibility.description") },
  ];

  const TEAM = [
    { name: "Michael Torres", role: t("team.ceo"), initials: "MT" },
    { name: "Sarah Kim", role: t("team.operations"), initials: "SK" },
    { name: "David Chen", role: t("team.fleetDirector"), initials: "DC" },
    { name: "Emily Johnson", role: t("team.customerExperience"), initials: "EJ" },
  ];

  const MILESTONES = [
    { year: "2015", event: t("milestones.2015") },
    { year: "2017", event: t("milestones.2017") },
    { year: "2019", event: t("milestones.2019") },
    { year: "2021", event: t("milestones.2021") },
    { year: "2023", event: t("milestones.2023") },
    { year: "2025", event: t("milestones.2025") },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 to-purple-950 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-white/10 text-white border-white/20">{t("heroBadge")}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("heroTitle")}</h1>
            <p className="text-gray-300 text-lg">
              {t("heroDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t("missionTitle")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t("missionParagraph1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("missionParagraph2")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Car, value: "200+", label: t("stats.premiumVehicles") },
              { icon: Users, value: "15K+", label: t("stats.happyCustomers") },
              { icon: Award, value: "10+", label: t("stats.yearsOfExcellence") },
              { icon: Globe, value: "25+", label: t("stats.locations") },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-5 text-center">
                    <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{t("valuesTitle")}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t("valuesSubtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="text-center border-0 bg-background">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t("journeyTitle")}</h2>
          <p className="text-muted-foreground">{t("journeySubtitle")}</p>
        </div>
        <div className="max-w-2xl mx-auto">
          {MILESTONES.map((milestone, i) => (
            <div key={milestone.year} className="flex gap-6 mb-8 last:mb-0">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {milestone.year.slice(2)}
                </div>
                {i < MILESTONES.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="pb-8">
                <p className="font-semibold text-primary">{milestone.year}</p>
                <p className="text-muted-foreground mt-1">{milestone.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{t("teamTitle")}</h2>
            <p className="text-muted-foreground">{t("teamSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {TEAM.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {member.initials}
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="h-48 w-48 rounded-full bg-green-100 flex items-center justify-center">
              <Leaf className="h-24 w-24 text-green-600" />
            </div>
          </div>
          <div>
            <Badge className="mb-4 bg-green-100 text-green-700 border-0">{t("sustainabilityBadge")}</Badge>
            <h2 className="text-3xl font-bold mb-4">{t("sustainabilityTitle")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t("sustainabilityParagraph1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("sustainabilityParagraph2")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            {t("ctaDescription")}
          </p>
          <Link href="/cars">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              {t("ctaButton")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
