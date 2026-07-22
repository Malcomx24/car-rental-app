"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Car,
  CreditCard,
  FileText,
  Loader2,
  XCircle,
  CheckCircle,
  Info,
  Shield,
  User,
  PlayCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface AdminBookingDetail {
  id: string;
  bookingNumber: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  pricePerDay: number;
  subtotal: number;
  taxAmount: number;
  extrasAmount: number;
  totalAmount: number;
  depositAmount: number;
  status: string;
  paymentStatus: string | null;
  paymentMethod: string | null;
  paymentReference: string | null;
  paymentNotes: string | null;
  notes: string | null;
  whatsapp: string | null;
  cin: string | null;
  nationality: string | null;
  dateOfBirth: string | null;
  specialRequests: string | null;
  cancellationReason: string | null;
  createdAt: string;
  car: {
    id: string;
    name: string;
    year: number;
    brand: { name: string };
    category: { name: string };
    images: { url: string; isPrimary: boolean }[];
    licensePlate: string;
  };
  pickupLocation: { id: string; name: string; city: string; address: string };
  dropoffLocation: { id: string; name: string; city: string; address: string };
  extras: {
    id: string;
    name: string;
    pricePerDay: number;
    quantity: number;
    totalPrice: number;
  }[];
  payments: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    description: string | null;
  }[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    avatar: string | null;
  };
}

const PAYMENT_STATUS_OPTIONS = [
  "PENDING",
  "AWAITING_TRANSFER",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
];

export default function AdminBookingDetailPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<AdminBookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  const fetchBooking = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setBooking(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const updateStatus = async (status: string, reason?: string) => {
    setUpdating(true);
    try {
      const body: Record<string, string> = { status };
      if (reason) body.cancellationReason = reason;
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) fetchBooking();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const updatePaymentStatus = async (paymentStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus,
          paymentReference: paymentRef || undefined,
          paymentNotes: paymentNotes || undefined,
        }),
      });
      if (res.ok) {
        fetchBooking();
        setPaymentRef("");
        setPaymentNotes("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-24">
        <p className="text-xl font-medium">{t("bookingNotFound")}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/admin/bookings")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> {t("allBookings")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2"
            onClick={() => router.push("/admin/bookings")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> {t("allBookings")}
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              {t("booking")} #{booking.bookingNumber}
            </h1>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="text-muted-foreground mt-1">
            {t("bookedOn")} {formatDateTime(booking.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {booking.status === "PENDING" && (
            <Button
              onClick={() => updateStatus("CONFIRMED")}
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {t("confirm")}
            </Button>
          )}
          {booking.status === "CONFIRMED" && (
            <Button onClick={() => updateStatus("ACTIVE")} disabled={updating}>
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-2" />
              )}
              {t("startRental")}
            </Button>
          )}
          {booking.status === "ACTIVE" && (
            <Button
              onClick={() => updateStatus("COMPLETED")}
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {t("markCompleted")}
            </Button>
          )}
          {["PENDING", "CONFIRMED"].includes(booking.status) && (
            <Button
              variant="destructive"
              onClick={() =>
                updateStatus(
                  "CANCELLED",
                  cancellationReason || "Cancelled by admin",
                )
              }
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {t("cancelBooking")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Info */}
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
                  <img
                    src={booking.car.images[0].url}
                    alt={booking.car.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Car className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold">
                  {booking.car.brand.name} {booking.car.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {booking.car.year} &middot; {booking.car.category.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("licensePlate")}: {booking.car.licensePlate}
                </p>
                <Link href={`/cars/${booking.car.id}`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Info className="h-4 w-4 mr-1" /> {t("viewVehicle")}
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
              <span>
                {formatCurrency(booking.pricePerDay)} x {booking.totalDays}d
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span>{formatCurrency(booking.subtotal)}</span>
            </div>
            {booking.extrasAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("extras")}</span>
                <span>{formatCurrency(booking.extrasAmount)}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>{tc("total")}</span>
              <span>{formatCurrency(booking.totalAmount)}</span>
            </div>
            {booking.depositAmount > 0 && (
              <p className="text-xs text-muted-foreground">
                + {formatCurrency(booking.depositAmount)}{" "}
                {t("refundableDeposit")}
              </p>
            )}
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
              <p className="text-sm text-muted-foreground">
                {t("totalDuration")}
              </p>
              <p className="font-medium">
                {booking.totalDays}{" "}
                {booking.totalDays !== 1 ? tc("days") : tc("day")}
              </p>
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
              <p className="text-sm text-muted-foreground">
                {t("pickupLocation")}
              </p>
              <p className="font-medium">{booking.pickupLocation.name}</p>
              <p className="text-sm text-muted-foreground">
                {booking.pickupLocation.address}, {booking.pickupLocation.city}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("dropoffLocation")}
              </p>
              <p className="font-medium">{booking.dropoffLocation.name}</p>
              <p className="text-sm text-muted-foreground">
                {booking.dropoffLocation.address},{" "}
                {booking.dropoffLocation.city}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" /> {t("customerDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">{t("name")}</p>
              <p className="font-medium">
                {booking.user.firstName} {booking.user.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("email")}</p>
              <p className="font-medium">{booking.user.email}</p>
            </div>
            {booking.user.phone && (
              <div>
                <p className="text-sm text-muted-foreground">{t("phone")}</p>
                <p className="font-medium">{booking.user.phone}</p>
              </div>
            )}
            {booking.whatsapp && (
              <div>
                <p className="text-sm text-muted-foreground">{t("whatsapp")}</p>
                <p className="font-medium">{booking.whatsapp}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Identity Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" /> {t("identityInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {booking.cin && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("cinPassport")}
                </p>
                <p className="font-medium font-mono">{booking.cin}</p>
              </div>
            )}
            {booking.nationality && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("nationality")}
                </p>
                <p className="font-medium">{booking.nationality}</p>
              </div>
            )}
            {booking.dateOfBirth && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("dateOfBirth")}
                </p>
                <p className="font-medium">{formatDate(booking.dateOfBirth)}</p>
              </div>
            )}
            {!booking.cin && !booking.nationality && !booking.dateOfBirth && (
              <p className="text-sm text-muted-foreground">
                {t("noIdentityProvided")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" /> {t("payment")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("paymentMethod")}
              </p>
              <p className="font-medium">
                {booking.paymentMethod === "BANK_TRANSFER"
                  ? t("bankTransfer")
                  : t("payAtPickup")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("paymentStatus")}
              </p>
              <Badge variant="secondary">
                {booking.paymentStatus || "PENDING"}
              </Badge>
            </div>
            {booking.paymentReference && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("paymentReference")}
                </p>
                <p className="font-medium font-mono text-sm">
                  {booking.paymentReference}
                </p>
              </div>
            )}

            {/* Quick Payment Status Update */}
            <div className="space-y-3 pt-2 border-t">
              <p className="text-sm font-medium">{t("updatePaymentStatus")}</p>
              <div>
                <Label className="text-xs">{t("paymentReference")}</Label>
                <Input
                  size={1}
                  placeholder={t("referencePlaceholder")}
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">{t("paymentNotes")}</Label>
                <Input
                  placeholder={t("notesPlaceholder")}
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_STATUS_OPTIONS.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={
                      booking.paymentStatus === status ? "default" : "outline"
                    }
                    onClick={() => updatePaymentStatus(status)}
                    disabled={updating}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        {booking.payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("paymentHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {booking.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(payment.createdAt)}
                      </p>
                      {payment.description && (
                        <p className="text-xs text-muted-foreground">
                          {payment.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary">{payment.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Extras */}
      {booking.extras.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("extras")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {booking.extras.map((extra) => (
                <div
                  key={extra.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{extra.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(extra.pricePerDay)} x {extra.quantity}{" "}
                      {tc("day")}
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(extra.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special Requests / Notes / Cancellation */}
      {(booking.specialRequests ||
        booking.notes ||
        booking.cancellationReason) && (
        <Card>
          <CardContent className="p-5 space-y-4">
            {booking.specialRequests && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("specialRequests")}
                </p>
                <p>{booking.specialRequests}</p>
              </div>
            )}
            {booking.notes && !booking.specialRequests && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("notes")}
                </p>
                <p>{booking.notes}</p>
              </div>
            )}
            {booking.cancellationReason && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("cancellationReason")}
                </p>
                <p className="text-red-600">{booking.cancellationReason}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
