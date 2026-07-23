"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Location {
  id: string;
  name: string;
  city: string;
  slug: string;
}

interface BookingWidgetProps {
  browseFleetLabel: string;
  pickupLocationLabel: string;
  fromLabel: string;
  toLabel: string;
  selectDatePlaceholder: string;
  bookNowLabel: string;
  requiredFieldError: string;
  returnAfterPickupError: string;
}

export function BookingWidget({
  browseFleetLabel,
  pickupLocationLabel,
  fromLabel,
  toLabel,
  selectDatePlaceholder,
  bookNowLabel,
  requiredFieldError,
  returnAfterPickupError,
}: BookingWidgetProps) {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/locations?limit=50")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          setLocations(json.data);
          const agadir = json.data.find(
            (l: Location) => l.city.toLowerCase() === "agadir" || l.slug.includes("agadir")
          );
          if (agadir) setSelectedLocation(agadir.id);
          else if (json.data.length > 0) setSelectedLocation(json.data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedLocation) {
      newErrors.location = requiredFieldError;
    }
    if (!pickupDate) {
      newErrors.pickupDate = requiredFieldError;
    }
    if (!returnDate) {
      newErrors.returnDate = requiredFieldError;
    }
    if (pickupDate && returnDate && new Date(returnDate) <= new Date(pickupDate)) {
      newErrors.returnDate = returnAfterPickupError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSubmitting(true);

    const locationSlug = locations.find((l) => l.id === selectedLocation)?.slug || selectedLocation;

    const params = new URLSearchParams({
      location: locationSlug,
      pickup: pickupDate,
      return: returnDate,
    });

    router.push(`/cars?${params.toString()}`);
  };

  const selectedLoc = locations.find((l) => l.id === selectedLocation);

  return (
    <div className="rounded-2xl p-8 shadow-2xl max-w-md ml-auto bg-card border border-border backdrop-blur-xl">
      <h3 className="font-semibold text-lg mb-6">{browseFleetLabel}</h3>
      <div className="space-y-4">
        {/* Location Select */}
        <div>
          <label className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1.5 block">
            {pickupLocationLabel}
          </label>
          <Select
            value={selectedLocation}
            onValueChange={(val) => {
              if (val) {
                setSelectedLocation(val);
                if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
              }
            }}
          >
            <SelectTrigger className="w-full h-[52px] bg-muted border-border rounded-lg px-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder={pickupLocationLabel} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name} — {loc.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.location && (
            <p className="text-destructive text-xs mt-1">{errors.location}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1.5 block">
              {fromLabel}
            </label>
            <input
              type="date"
              value={pickupDate}
              min={today}
              onChange={(e) => {
                setPickupDate(e.target.value);
                if (errors.pickupDate) setErrors((prev) => ({ ...prev, pickupDate: "" }));
                if (errors.returnDate) setErrors((prev) => ({ ...prev, returnDate: "" }));
              }}
              className="w-full h-[52px] bg-muted border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
            />
            {errors.pickupDate && (
              <p className="text-destructive text-xs mt-1">{errors.pickupDate}</p>
            )}
          </div>
          <div>
            <label className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1.5 block">
              {toLabel}
            </label>
            <input
              type="date"
              value={returnDate}
              min={pickupDate || today}
              onChange={(e) => {
                setReturnDate(e.target.value);
                if (errors.returnDate) setErrors((prev) => ({ ...prev, returnDate: "" }));
              }}
              className="w-full h-[52px] bg-muted border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
            />
            {errors.returnDate && (
              <p className="text-destructive text-xs mt-1">{errors.returnDate}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          variant="accent"
          className="w-full font-semibold py-6 text-base"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <>
              {bookNowLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
