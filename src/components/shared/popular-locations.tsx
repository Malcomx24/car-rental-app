"use client";

import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PopularLocation {
  id: string;
  name: string;
  city: string;
  bookings: number;
  carsAvailable: number;
  isAirport: boolean;
}

const popularLocationsData: PopularLocation[] = [
  { id: "1", name: "Downtown Manhattan", city: "New York", bookings: 156, carsAvailable: 24, isAirport: false },
  { id: "2", name: "JFK International Airport", city: "Queens", bookings: 132, carsAvailable: 38, isAirport: true },
  { id: "3", name: "Miami Beach", city: "Miami", bookings: 98, carsAvailable: 18, isAirport: false },
  { id: "4", name: "LAX Airport", city: "Los Angeles", bookings: 87, carsAvailable: 32, isAirport: true },
  { id: "5", name: "Las Vegas Strip", city: "Las Vegas", bookings: 76, carsAvailable: 20, isAirport: false },
];

interface PopularLocationsProps {
  data?: PopularLocation[];
}

export function PopularLocations({ data = popularLocationsData }: PopularLocationsProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Popular Locations</h3>
          <p className="text-sm text-muted-foreground">Most active pickup points</p>
        </div>
        <Link
          href="/admin/locations"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {data.map((location) => (
          <div
            key={location.id}
            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{location.name}</p>
                {location.isAirport && (
                  <span className="text-[10px] font-medium bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded">
                    Airport
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{location.city}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{location.bookings}</p>
              <p className="text-xs text-muted-foreground">bookings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
