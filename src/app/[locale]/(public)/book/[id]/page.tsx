"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EXTRAS } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Shield,
  CreditCard,
  CheckCircle,
  Loader2,
  Car,
  Info,
  ChevronRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

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
  total: number;
  securityDeposit: number;
}

interface BookingResult {
  id: string;
  bookingNumber: string;
  totalAmount: number;
}

export default function BookingFlowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations("booking");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [car, setCar] = useState<CarInfo | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [pickupLocationId, setPickupLocationId] = useState("");
  const [dropoffLocationId, setDropoffLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "PAY_AT_PICKUP" | "BANK_TRANSFER"
  >("PAY_AT_PICKUP");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");

  const [availability, setAvailability] = useState<AvailabilityResult | null>(
    null,
  );
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const STEPS = [
    t("stepDates"),
    t("stepExtras"),
    t("stepPayment"),
    t("stepReview"),
  ];

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
      const p = new URLSearchParams({ carId: car.id, pickupDate, returnDate });
      const res = await fetch(`/api/bookings/availability?${p.toString()}`);
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
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
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
    if (!car || !availability) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          pickupLocationId,
          dropoffLocationId,
          pickupDate: `${pickupDate}T${pickupTime}:00`,
          returnDate: `${returnDate}T${pickupTime}:00`,
          extras: selectedExtras.map((id) => {
            const extra = EXTRAS.find((e) => e.id === id)!;
            return {
              name: extra.name,
              description: extra.description,
              pricePerDay: extra.pricePerDay,
              quantity: 1,
            };
          }),
          paymentMethod: selectedPaymentMethod,
          phone: phone.trim(),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const booking: BookingResult = json.data;
        router.push(`/dashboard/bookings/${booking.id}?booked=true`);
      } else {
        const err = await res.json();
        alert(err.error || t("bookingFailed"));
      }
    } catch {
      alert(t("networkError"));
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
        <p className="text-xl font-medium">{t("carNotFound")}</p>
        <Link href="/cars">
          <Button variant="outline">{t("browseCars")}</Button>
        </Link>
      </div>
    );
  }

  const isDatesStepValid =
    pickupLocationId &&
    dropoffLocationId &&
    pickupDate &&
    returnDate &&
    availability?.available;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/cars/${car.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> {t("backToCar")}
            </Link>
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium ${
                      i <= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={`text-sm hidden sm:inline ${i === step ? "font-medium" : "text-muted-foreground"}`}
                  >
                    {s}
                  </span>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
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
            {/* Step 0: Dates & Locations */}
            {step === 0 && (
              <Card>
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> {t("selectDatesTitle")}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{t("pickupLocation")}</Label>
                      <select
                        value={pickupLocationId}
                        onChange={(e) => setPickupLocationId(e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 outline-none dark:bg-input/30 dark:hover:bg-input/50 mt-1"
                      >
                        <option value="">{t("selectLocation")}</option>
                        {locations.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name} — {l.city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>{t("dropoffLocation")}</Label>
                      <select
                        value={dropoffLocationId}
                        onChange={(e) => setDropoffLocationId(e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 outline-none dark:bg-input/30 dark:hover:bg-input/50 mt-1"
                      >
                        <option value="">{t("selectLocation")}</option>
                        {locations.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name} — {l.city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>{t("pickupDate")}</Label>
                      <Input
                        type="date"
                        value={pickupDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>{t("returnDate")}</Label>
                      <Input
                        type="date"
                        value={returnDate}
                        min={
                          pickupDate || new Date().toISOString().split("T")[0]
                        }
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Pickup Time</Label>
                      <Input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <p className="text-xs text-muted-foreground">
                        Return time matches pickup time ({pickupTime})
                      </p>
                    </div>
                  </div>

                  {checkingAvailability && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />{" "}
                      {t("checkingAvailability")}
                    </div>
                  )}
                  {availability && !availability.available && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 p-3 rounded-lg">
                      <Info className="h-4 w-4" />
                      {t("notAvailable")}
                    </div>
                  )}
                  {availability && availability.available && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-500/5 p-3 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      {t("availableForDays", { count: availability.totalDays })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 1: Extras */}
            {step === 1 && (
              <Card>
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" /> {t("optionalAddons")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("enhanceExperience")}
                  </p>

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
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {extra.description}
                              </p>
                            </div>
                            <div
                              className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-primary mt-2">
                            +{formatCurrency(extra.pricePerDay)}/{t("day")}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t("paymentMethod")}</h3>
                <p className="text-sm text-muted-foreground">{t("choosePayment")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("PAY_AT_PICKUP")}
                    className={`relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      selectedPaymentMethod === "PAY_AT_PICKUP"
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedPaymentMethod === "PAY_AT_PICKUP"
                            ? "border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPaymentMethod === "PAY_AT_PICKUP" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {t("payAtPickup")}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("payAtPickupDesc")}
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("BANK_TRANSFER")}
                    className={`relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      selectedPaymentMethod === "BANK_TRANSFER"
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedPaymentMethod === "BANK_TRANSFER"
                            ? "border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPaymentMethod === "BANK_TRANSFER" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {t("bankTransfer")}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("bankTransferDesc")}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {selectedPaymentMethod === "BANK_TRANSFER" && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      {t("bankTransferNotice")}
                    </p>
                  </div>
                )}

                {selectedPaymentMethod === "PAY_AT_PICKUP" && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      {t("payAtPickupNotice")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <Card>
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-semibold">
                    {t("reviewBooking")}
                  </h2>

                  {/* Car Summary */}
                  <div className="flex gap-4 p-4 rounded-xl bg-muted/50">
                    <div className="h-20 w-28 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {car.images[0] ? (
                        <img
                          src={car.images[0].url}
                          alt={car.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Car className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {car.brand.name} {car.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {car.year} &middot; {car.category.name}
                      </p>
                      {availability && (
                        <p className="text-sm font-medium text-primary mt-1">
                          {formatCurrency(availability.pricePerDay)}{" "}
                          {t("perDay")} &middot; {availability.totalDays}{" "}
                          {availability.totalDays > 1 ? t("days") : t("day")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rental Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t("pickup")}</p>
                      <p className="font-medium">
                        {pickupDate ? formatDate(pickupDate) : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        at {pickupTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {locations.find((l) => l.id === pickupLocationId)?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("return")}</p>
                      <p className="font-medium">
                        {returnDate ? formatDate(returnDate) : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        at {pickupTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {
                          locations.find((l) => l.id === dropoffLocationId)
                            ?.name
                        }
                      </p>
                    </div>
                  </div>

                  {/* Extras */}
                  {selectedExtras.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">
                        {t("selectedExtras")}
                      </p>
                      <div className="space-y-1">
                        {selectedExtras.map((id) => {
                          const extra = EXTRAS.find((e) => e.id === id);
                          if (!extra) return null;
                          return (
                            <div
                              key={id}
                              className="flex justify-between text-sm"
                            >
                              <span>{extra.name}</span>
                              <span>
                                {formatCurrency(extra.pricePerDay)}/{t("day")}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <p className="text-sm font-medium mb-1">
                      {t("paymentMethod")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPaymentMethod === "BANK_TRANSFER"
                        ? t("bankTransfer")
                        : t("payAtPickup")}
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div className="border-t pt-4">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Required for booking confirmation and contact at pickup
                    </p>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+212 6XX XX XX XX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> {t("back")}
              </Button>
              {step < 3 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 0 && !isDatesStepValid}
                >
                  {t("continue")} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleBook}
                  disabled={
                    submitting || !availability?.available || !phone.trim()
                  }
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {t("confirmBooking")} — {formatCurrency(getTotal())}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar — Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">{t("orderSummary")}</h3>

                  <div className="flex gap-3">
                    <div className="h-16 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {car.images[0] ? (
                        <img
                          src={car.images[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Car className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {car.brand.name} {car.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {car.year}
                      </p>
                    </div>
                  </div>

                  {pickupDate && (
                    <div className="space-y-1 text-xs text-muted-foreground border-t pt-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {locations.find((l) => l.id === pickupLocationId)
                            ?.name || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {locations.find((l) => l.id === dropoffLocationId)
                            ?.name || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {pickupDate
                            ? `${formatDate(pickupDate)} at ${pickupTime}`
                            : "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {returnDate
                            ? `${formatDate(returnDate)} at ${pickupTime}`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  )}

                  {availability && (
                    <div className="space-y-2 text-sm border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {formatCurrency(availability.pricePerDay)} x{" "}
                          {availability.totalDays}
                          {t("day")}
                        </span>
                        <span>{formatCurrency(availability.subtotal)}</span>
                      </div>
                      {getExtrasTotal() > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("extras")} ({selectedExtras.length})
                          </span>
                          <span>{formatCurrency(getExtrasTotal())}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t text-lg font-bold">
                        <span>{t("total")}</span>
                        <span>{formatCurrency(getTotal())}</span>
                      </div>
                      {availability.securityDeposit > 0 && (
                        <p className="text-xs text-muted-foreground">
                          + {formatCurrency(availability.securityDeposit)}{" "}
                          {t("refundableDeposit")}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 shrink-0" />
                    <span>{t("freeCancellation")}</span>
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
