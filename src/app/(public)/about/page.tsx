import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about DriveRent — your trusted partner for premium car rental. Discover our mission, values, and the story behind 200+ luxury vehicles across 25+ locations.",
};

const VALUES = [
  { icon: Shield, title: "Trust & Safety", description: "Every vehicle undergoes rigorous safety inspections and maintenance checks." },
  { icon: Heart, title: "Customer First", description: "We put our customers at the center of everything we do, ensuring satisfaction at every touchpoint." },
  { icon: Target, title: "Excellence", description: "From our fleet to our service, we maintain the highest standards in the industry." },
  { icon: Globe, title: "Accessibility", description: "Making premium vehicles accessible to everyone through flexible rental options." },
];

const TEAM = [
  { name: "Michael Torres", role: "CEO & Founder", initials: "MT" },
  { name: "Sarah Kim", role: "Head of Operations", initials: "SK" },
  { name: "David Chen", role: "Fleet Director", initials: "DC" },
  { name: "Emily Johnson", role: "Customer Experience Lead", initials: "EJ" },
];

const MILESTONES = [
  { year: "2015", event: "Founded in Miami with a fleet of 20 luxury vehicles" },
  { year: "2017", event: "Expanded to 5 major cities across the East Coast" },
  { year: "2019", event: "Reached 100,000 satisfied customers milestone" },
  { year: "2021", event: "Launched electric vehicle rental program" },
  { year: "2023", event: "Expanded fleet to 200+ vehicles across 25 locations" },
  { year: "2025", event: "Named Best Premium Car Rental Service by Luxury Travel Awards" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 to-purple-950 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-white/10 text-white border-white/20">Our Story</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Redefining the Car Rental Experience</h1>
            <p className="text-gray-300 text-lg">
              DriveRent was born from a simple idea: renting a car should be as enjoyable as driving it.
              We set out to create a premium car rental experience that puts customers first.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At DriveRent, we believe that everyone deserves access to exceptional vehicles.
              Whether it&apos;s a business trip, a family vacation, or a special occasion,
              our mission is to provide a seamless, premium car rental experience that exceeds expectations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We&apos;ve curated a fleet of over 200 vehicles from the world&apos;s most prestigious brands,
              maintained to the highest standards and backed by our dedicated team of automotive enthusiasts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Car, value: "200+", label: "Premium Vehicles" },
              { icon: Users, value: "15K+", label: "Happy Customers" },
              { icon: Award, value: "10+", label: "Years of Excellence" },
              { icon: Globe, value: "25+", label: "Locations Nationwide" },
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
            <h2 className="text-3xl font-bold mb-3">Our Values</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              The principles that guide everything we do.
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
          <h2 className="text-3xl font-bold mb-3">Our Journey</h2>
          <p className="text-muted-foreground">Key milestones in our story</p>
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
            <h2 className="text-3xl font-bold mb-3">Leadership Team</h2>
            <p className="text-muted-foreground">Meet the people driving DriveRent forward</p>
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
            <Badge className="mb-4 bg-green-100 text-green-700 border-0">Sustainability</Badge>
            <h2 className="text-3xl font-bold mb-4">Driving Toward a Greener Future</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We&apos;re committed to reducing our environmental impact. Our growing fleet of electric and hybrid
              vehicles gives customers eco-friendly options without compromising on luxury or performance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By 2030, we aim to have 50% of our fleet be fully electric, contributing to cleaner
              air and a more sustainable future for the communities we serve.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the DriveRent Experience</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            Discover why over 15,000 customers trust us for their premium car rental needs.
          </p>
          <Link href="/cars">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Explore Our Fleet <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
