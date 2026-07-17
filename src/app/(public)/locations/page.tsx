"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Navigation, Loader2 } from "lucide-react";
import Link from "next/link";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  operatingHours: string | null;
  isActive: boolean;
}

export default function LocationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await fetch("/api/locations");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const locations: Location[] = data?.data || [];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 to-purple-950 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Locations</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Find a DriveRent location near you. We have {locations.length > 0 ? locations.length : "25+"} locations across the country for your convenience.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Locations Coming Soon</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;re rapidly expanding! Check back soon for locations near you, or contact us for special arrangements.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.filter(l => l.isActive).map((location) => (
              <Card key={location.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{location.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {location.address}, {location.city}, {location.state} {location.zipCode}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">Active</Badge>
                  </div>

                  <div className="space-y-3 mt-4">
                    {location.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{location.phone}</span>
                      </div>
                    )}
                    {location.operatingHours && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{location.operatingHours}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span>{location.city}, {location.state}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link href={`/cars?location=${location.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Browse Cars
                      </Button>
                    </Link>
                    {location.latitude && location.longitude && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(
                          `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
                          "_blank"
                        )}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
