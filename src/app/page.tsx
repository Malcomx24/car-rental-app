import Link from "next/link";
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
  CheckCircle,
  ChevronRight,
  Phone,
  Quote,
} from "lucide-react";

const STATS = [
  { label: "Cars Available", value: "200+", icon: Car },
  { label: "Happy Customers", value: "15,000+", icon: Users },
  { label: "Locations", value: "25+", icon: MapPin },
  { label: "Years of Service", value: "10+", icon: Award },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Full Coverage Insurance",
    description: "Drive with peace of mind knowing you're fully covered with our comprehensive insurance options.",
  },
  {
    icon: Clock,
    title: "24/7 Roadside Assistance",
    description: "Round-the-clock roadside support wherever you are. Help is always just a call away.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book your dream car in seconds with our streamlined, hassle-free reservation system.",
  },
  {
    icon: MapPin,
    title: "Flexible Locations",
    description: "Pick up and drop off at any of our 25+ locations nationwide — airports, city centers, and more.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Business Traveler",
    content: "DriveRent made my business trip seamless. The Tesla Model S was immaculate and the booking process was incredibly smooth. Will definitely use again!",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "James Rodriguez",
    role: "Vacation Rental",
    content: "Rented a Porsche 911 for our anniversary road trip. The car was pristine and the customer service was outstanding. A truly premium experience.",
    rating: 5,
    avatar: "JR",
  },
  {
    name: "Emily Chen",
    role: "Weekend Getaway",
    content: "The best car rental experience I've ever had. The Range Rover was perfect for our mountain trip. Easy booking, easy return. Five stars all around!",
    rating: 5,
    avatar: "EC",
  },
];

const STEPS = [
  { number: "01", title: "Choose Your Car", description: "Browse our premium fleet and select the perfect vehicle for your needs." },
  { number: "02", title: "Select Dates & Location", description: "Pick your preferred pickup and drop-off dates and locations." },
  { number: "03", title: "Confirm & Drive", description: "Complete your booking, pick up your keys, and hit the road!" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              Premium Car Rental Experience
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Drive Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Dream Car
              </span>{" "}
              Today
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl">
              From luxury sedans to exotic sports cars — access the world&apos;s finest vehicles with just a few clicks.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/cars">
                <Button size="lg" className="bg-white text-gray-950 hover:bg-gray-100 px-8">
                  Browse Fleet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Gradient overlay at bottom */}
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
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose DriveRent?</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            We&apos;re not just a car rental — we&apos;re a premium driving experience.
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
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-3">Three simple steps to your dream ride</p>
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
          <h2 className="text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-3">Trusted by thousands of happy drivers</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            Join over 15,000 satisfied customers who trust DriveRent for their premium car rental needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cars">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8">
                Book Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8">
                <Phone className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
