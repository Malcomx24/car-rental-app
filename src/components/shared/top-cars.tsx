"use client";

import { Star, TrendingUp } from "lucide-react";

interface TopCar {
  id: string;
  name: string;
  brand: string;
  bookings: number;
  revenue: number;
  rating: number;
  image: string;
}

const topCarsData: TopCar[] = [
  {
    id: "1",
    name: "BMW 3 Series",
    brand: "BMW",
    bookings: 47,
    revenue: 4183,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Tesla Model S",
    brand: "Tesla",
    bookings: 38,
    revenue: 5662,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Porsche 911 Carrera",
    brand: "Porsche",
    bookings: 31,
    revenue: 9269,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "Mercedes C-Class",
    brand: "Mercedes-Benz",
    bookings: 29,
    revenue: 2755,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    name: "Range Rover Sport",
    brand: "Range Rover",
    bookings: 26,
    revenue: 4914,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519245659620-e859806a8d7b?w=100&h=100&fit=crop",
  },
];

interface TopCarsProps {
  data?: TopCar[];
}

export function TopCars({ data = topCarsData }: TopCarsProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Top Performing Cars</h3>
          <p className="text-sm text-muted-foreground">Most booked this month</p>
        </div>
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {data.map((car, index) => (
          <div
            key={car.id}
            className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            <span className="text-sm font-bold text-muted-foreground w-5">
              {index + 1}
            </span>
            <img
              src={car.image}
              alt={car.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{car.name}</p>
              <p className="text-xs text-muted-foreground">{car.brand}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{car.bookings} bookings</p>
              <div className="flex items-center gap-1 justify-end">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">{car.rating}</span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">${car.revenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
