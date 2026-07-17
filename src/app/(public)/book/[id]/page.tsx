"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EXTRAS } from "@/lib/constants";
import {
  ArrowLeft, ArrowRight, Calendar, MapPin, Shield, CreditCard,
  CheckCircle, Loader2, Car, Info, ChevronRight,
} from "lucide-react";
import { PaymentForm } from "@/components/shared/payment-form";

interface CarInfo {
  id: string;
  name: string;
  year: number;
  pricePerDay: number;
  weekendPricePerDay: number | null;
  securityDeposit: number;
  brand: { name: string };
  category: { name: string };
  images: { url: string; isPrimary: boolean }[];
}

interface Location {
  id: string;
  name: string;
  city: string;
  isAirport: boolean;
}

interface AvailabilityResult {
  available: boolean;
  totalDays: number;
  pricePerDay: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  securityDeposit: number;
}

interface BookingResult {
  id: string;
  bookingNumber: string;
  totalAmount: number;
}

const STEPS = ["Dates", "Extras", "Review", "Payment"];

export default function BookingFlowPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [car, setCar] = useState<CarInfo | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [dropoffLocationId, setDropoffLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  useEffect(() => {
    params.then(async ({ id }) => {
      try {
        const [carRes, locRes] = await Promise.all([
          fetch(`/api/cars/${id}`),
          fetch("/api/locations"),
        ]);
        const carJson = await carRes.json();
        const locJson = await locRes.json();
        if (carJson.success) setCar(carJson.data);
        if (locJson.success) setLocations(locJson.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  const checkAvailability = useCallback(async () => {
    if (!car || !pickupDate || !returnDate) return;
    setCheckingAvailability(true);
    try {
      const params = new URLSearchParams({
        carId: car.id,
        pickupDate,
        returnDate,
      });
      const res = await fetch(`/api/bookings/availability?${params.toString()}`);
      const json = await res.json();
      if (json.success) setAvailability(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingAvailability(false);
    }
  }, [car, pickupDate, returnDate]);

  useEffect(() => {
    if (pickupDate && returnDate) checkAvailability();
  }, [pickupDate, returnDate, checkAvailability]);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const getExtrasTotal = () => {
    if (!availability) return 0;
    return selectedExtras.reduce((sum, id) => {
      const extra = EXTRAS.find((e) => e.id === id);
      return sum + (extra ? extra.pricePerDay * availability.totalDays : 0);
    }, 0);
  };

  const getTotal = () => {
    if (!availability) return 0;
    return availability.total + getExtrasTotal();
  };

  const handleBook = async () => {
    if (!car || !availability || createdBookingId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          pickupLocationId,
          dropoffLocationId,
          pickupDate,
          returnDate,
          extras: selectedExtras.map((id) => {
            const extra = EXTRAS.find((e) => e.id === id)!;
            return { name: extra.name, description: extra.description, pricePerDay: extra.pricePerDay, quantity: 1 };
          }),
          notes,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const booking: BookingResult = json.data;
        setCreatedBookingId(booking.id);

        const payRes = await fetch("/api/payments/intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: booking.id }),
        });
        const payJson = await payRes.json();
        if (payJson.success) {
          setClientSecret(payJson.data.clientSecret);
          setStep(3);
        } else {
          router.push(`/dashboard/bookings/${booking.id}?booked=true`);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create booking");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-medium">Car not found</p>
        <Link href="/cars"><Button variant="outline">Browse Cars</Button></Link>
      </div>
    );
  }

  const isDatesStepValid = pickupLocationId && dropoffLocationId && pickupDate && returnDate && availability?.available;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/cars/${car.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to car
            </Link>
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-sm hidden sm:inline ${i === step ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
                  {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 0: Dates */}
            {step === 0 && (
              <Card>
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-semibold flex items-center gap-2"><Calendar className="h-5 w-5" /> Select Dates & Locations</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Pickup Location</Label>
                      <select
                        value={pickupLocationId}
                        onChange={(e) => setPickupLocationId(e.target.value)}
                        className="w-full h-10 rounded-md border bg-background px-3 text-sm mt-1"
                      >
                        <option value="">Select location</option>
                        {locations.map((l) => (
                          <option key={l.id} value={l.id}>{l.name} — {l.city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Dropoff Location</Label>
                      <select
                        value={dropoffLocationId}
                        onChange={(e) => setDropoffLocationId(e.target.value)}
                        className="w-full h-10 rounded-md border bg-background px-3 text-sm mt-1"
                      >
                        <option value="">Select location</option>
                        {locations.map((l) => (
                          <option key={l.id} value={l.id}>{l.name} — {l.city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Pickup Date</Label>
                      <Input
                        type="date"
                        value={pickupDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Return Date</Label>
                      <Input
                        type="date"
                        value={returnDate}
                        min={pickupDate || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Availability Status */}
                  {checkingAvailability && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Checking availability...
                    </div>
                  )}
                  {availability && !availability.available && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-500/5 p-3 rounded-lg">
                      <Info className="h-4 w-4" />
                      This car is not available for the selected dates. Please try different dates.
                    </div>
                  )}
                  {availability && availability.available && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-500/5 p-3 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      Available for {availability.totalDays} day{availability.totalDays !== 1 ? "s" : ""}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 1: Extras */}
            {step === 1 && (
              <Card>
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-semibold flex items-center gap-2"><Shield className="h-5 w-5" /> Optional Add-ons</h2>
                  <p className="text-sm text-muted-foreground">Enhance your rental experience with these extras.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EXTRAS.map((extra) => {
                      const isSelected = selectedExtras.includes(extra.id);
                      return (
                        <button
                          key={extra.id}
                          onClick={() => toggleExtra(extra.id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "hover:border-muted-foreground/30"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{extra.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{extra.description}</p>
                            </div>
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                            }`}>
                              {isSelected && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-primary mt-2">
                            +${extra.pricePerDay}/day
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <Card>
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-semibold">Review Your Booking</h2>

                  {/* Car Summary */}
                  <div className="flex gap-4 p-4 rounded-xl bg-muted/50">
                    <div className="h-20 w-28 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {car.images[0] ? (
                        <img src={car.images[0].url} alt={car.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center"><Car className="h-6 w-6 text-muted-foreground" /></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{car.brand.name} {car.name}</p>
                      <p className="text-sm text-muted-foreground">{car.year} &middot; {car.category.name}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Pickup</p>
                      <p className="font-medium">{pickupDate ? formatDate(pickupDate) : "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{locations.find((l) => l.id === pickupLocationId)?.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Return</p>
                      <p className="font-medium">{returnDate ? formatDate(returnDate) : "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{locations.find((l) => l.id === dropoffLocationId)?.name}</p>
                    </div>
                  </div>

                  {/* Extras */}
                  {selectedExtras.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Selected Extras</p>
                      <div className="space-y-1">
                        {selectedExtras.map((id) => {
                          const extra = EXTRAS.find((e) => e.id === id);
                          if (!extra) return null;
                          return (
                            <div key={id} className="flex justify-between text-sm">
                              <span>{extra.name}</span>
                              <span>${extra.pricePerDay}/day</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <Label>Notes (optional)</Label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests or notes..."
                      className="w-full h-20 rounded-md border bg-background px-3 py-2 text-sm mt-1 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 3 && clientSecret && (
              <Card>
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-semibold flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payment</h2>
                  <p className="text-sm text-muted-foreground">Complete your booking by entering your payment details below.</p>
                  <PaymentForm
                    clientSecret={clientSecret}
                    bookingId={createdBookingId!}
                    amount={getTotal()}
                    onSuccess={() => {
                      router.push(`/dashboard/bookings/${createdBookingId}?paid=true`);
                    }}
                  />
                </CardContent>
              </Card>
            )}
            {step < 3 && (
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={(step === 0 && !isDatesStepValid)}
                >
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleBook} disabled={submitting || !availability?.available}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                  Confirm Booking — {formatCurrency(getTotal())}
                </Button>
              )}
            </div>
            )}
          </div>

          {/* Sidebar — Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">Order Summary</h3>

                  <div className="flex gap-3">
                    <div className="h-16 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {car.images[0] ? (
                        <img src={car.images[0].url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center"><Car className="h-5 w-5 text-muted-foreground" /></div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{car.brand.name} {car.name}</p>
                      <p className="text-xs text-muted-foreground">{car.year}</p>
                    </div>
                  </div>

                  {availability && (
                    <div className="space-y-2 text-sm border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{formatCurrency(availability.pricePerDay)} x {availability.totalDays}d</span>
                        <span>{formatCurrency(availability.subtotal)}</span>
                      </div>
                      {getExtrasTotal() > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Extras ({selectedExtras.length})</span>
                          <span>{formatCurrency(getExtrasTotal())}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (8%)</span>
                        <span>{formatCurrency(availability.taxAmount)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t text-lg font-bold">
                        <span>Total</span>
                        <span>{formatCurrency(getTotal())}</span>
                      </div>
                      {availability.securityDeposit > 0 && (
                        <p className="text-xs text-muted-foreground">
                          + {formatCurrency(availability.securityDeposit)} refundable deposit
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 shrink-0" />
                    <span>Free cancellation up to 24 hours before pickup</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
