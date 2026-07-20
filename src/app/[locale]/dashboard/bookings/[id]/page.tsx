"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft, Calendar, MapPin, Car, CreditCard, FileText,
  Loader2, XCircle, CheckCircle, Info, Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface BookingDetail {
  id: string;
  bookingNumber: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  pricePerDay: number;
  subtotal: number;
  taxes: number;
  insurance: number;
  totalAmount: number;
  status: string;
  paymentStatus: string | null;
  paymentMethod: string | null;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  car: {
    id: string;
    name: string;
    brand: { name: string };
    category: { name: string };
    images: { url: string; isPrimary: boolean }[];
  };
  pickupLocation: { id: string; name: string; city: string };
  dropoffLocation: { id: string; name: string; city: string };
  extras: { id: string; name: string; pricePerDay: number; quantity: number }[];
  payments: { id: string; amount: number; currency: string; status: string; createdAt: string }[];
  invoice: { id: string; invoiceNumber: string; totalAmount: number; status: string } | null;
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  SUCCEEDED: "bg-emerald-500/10 text-emerald-600",
  PENDING: "bg-amber-500/10 text-amber-600",
  FAILED: "bg-red-500/10 text-red-600",
  REFUNDED: "bg-gray-500/10 text-gray-600",
};

export default function BookingDetailPage() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const justBooked = searchParams.get("booked") === "true";
  const justPaid = searchParams.get("paid") === "true";

  const fetchBooking = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setBooking(json.data);
      } else {
        setError(json.error || "Booking not found");
      }
    } catch {
      setError("Failed to load booking");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => { fetchBooking(); }, [fetchBooking]);

  const handleCancel = async () => {
    if (!confirm(t("cancelBookingConfirm"))) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED", cancellationReason: "Cancelled by customer" }),
      });
      if (res.ok) {
        fetchBooking();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-24">
        <p className="text-xl font-medium">{error || tc("error")}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/bookings")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> {t("myBookings")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Banners */}
      {justBooked && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-200">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-emerald-700">{t("bookingConfirmed")}</p>
            <p className="text-sm text-emerald-600">{t("bookingConfirmedMessage")}</p>
          </div>
        </div>
      )}
      {justPaid && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-200">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-emerald-700">{t("paymentReceived")}</p>
            <p className="text-sm text-emerald-600">{t("paymentReceivedMessage")}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => router.push("/dashboard/bookings")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t("myBookings")}
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{t("bookingDetails")}</h1>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="text-muted-foreground mt-1">#{booking.bookingNumber}</p>
        </div>
        {["PENDING", "CONFIRMED"].includes(booking.status) && (
          <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
            {t("cancel")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Car Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="h-5 w-5" /> {t("vehicle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-64 h-44 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {booking.car.images[0] ? (
                  <img src={booking.car.images[0].url} alt={booking.car.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Car className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold">{booking.car.brand.name} {booking.car.name}</h3>
                <p className="text-sm text-muted-foreground">{booking.car.category.name}</p>
                <Link href={`/cars/${booking.car.id}`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Info className="h-4 w-4 mr-1" /> {t("viewCar")}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" /> {t("priceSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("pricePerDay")}</span>
              <span>{formatCurrency(booking.pricePerDay)} x {booking.totalDays} {booking.totalDays !== 1 ? tc("days") : tc("day")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span>{formatCurrency(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("taxes")}</span>
              <span>{formatCurrency(booking.taxes)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("insurance")}</span>
              <span>{formatCurrency(booking.insurance)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>{tc("total")}</span>
              <span>{formatCurrency(booking.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rental Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" /> {t("rentalDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("pickupDate")}</p>
              <p className="font-medium">{formatDate(booking.pickupDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("returnDate")}</p>
              <p className="font-medium">{formatDate(booking.returnDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalDuration")}</p>
              <p className="font-medium">{booking.totalDays} {booking.totalDays !== 1 ? tc("days") : tc("day")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" /> {t("locations")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("pickupLocation")}</p>
              <p className="font-medium">{booking.pickupLocation.name}</p>
              <p className="text-sm text-muted-foreground">{booking.pickupLocation.city}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("dropoffLocation")}</p>
              <p className="font-medium">{booking.dropoffLocation.name}</p>
              <p className="text-sm text-muted-foreground">{booking.dropoffLocation.city}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" /> {t("payment")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("paymentStatus")}</p>
              <Badge variant="secondary" className={PAYMENT_STATUS_COLORS[booking.paymentStatus || "PENDING"] || ""}>
                {booking.paymentStatus || "PENDING"}
              </Badge>
            </div>
            {booking.paymentMethod && (
              <div>
                <p className="text-sm text-muted-foreground">{t("paymentMethod")}</p>
                <p className="font-medium">{booking.paymentMethod}</p>
              </div>
            )}
            {booking.invoice && (
              <div>
                <p className="text-sm text-muted-foreground">{t("invoice")}</p>
                <Link href="/dashboard/invoices" className="font-medium text-primary hover:underline">
                  {booking.invoice.invoiceNumber} - {formatCurrency(booking.invoice.totalAmount)}
                </Link>
              </div>
            )}
            {booking.payments.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("paymentHistory")}</p>
                {booking.payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between text-sm py-1">
                    <span className="text-muted-foreground">{formatDateTime(payment.createdAt)}</span>
                    <span className="font-medium">{formatCurrency(payment.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Extras */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("extras")}</CardTitle>
          </CardHeader>
          <CardContent>
            {booking.extras.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noExtras")}</p>
            ) : (
              <div className="space-y-3">
                {booking.extras.map((extra) => (
                  <div key={extra.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{extra.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(extra.pricePerDay)} x {extra.quantity} {tc("day")}
                      </p>
                    </div>
                    <span className="font-medium">{formatCurrency(extra.pricePerDay * extra.quantity * booking.totalDays)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes & Cancellation */}
      {(booking.notes || booking.cancellationReason) && (
        <Card>
          <CardContent className="p-5 space-y-4">
            {booking.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("notes")}</p>
                <p>{booking.notes}</p>
              </div>
            )}
            {booking.cancellationReason && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("cancellationReason")}</p>
                <p className="text-red-600">{booking.cancellationReason}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Footer timestamp */}
      <p className="text-sm text-muted-foreground text-center">
        {t("bookedOn")} {formatDateTime(booking.createdAt)}
      </p>
    </div>
  );
}
