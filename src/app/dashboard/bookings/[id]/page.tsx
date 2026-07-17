"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Calendar, MapPin, Car, Loader2, CreditCard, FileText, XCircle, CheckCircle, Clock } from "lucide-react";

interface BookingDetail {
  id: string;
  bookingNumber: string;
  pickupDate: string;
  returnDate: string;
  actualPickupDate: string | null;
  actualReturnDate: string | null;
  totalDays: number;
  pricePerDay: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  insuranceAmount: number;
  extrasAmount: number;
  totalAmount: number;
  depositAmount: number;
  status: string;
  notes: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
  car: {
    id: string;
    name: string;
    year: number;
    color: string;
    licensePlate: string;
    brand: { name: string };
    category: { name: string };
    images: { url: string; alt: string }[];
  };
  pickupLocation: { name: string; address: string; city: string; phone: string };
  dropoffLocation: { name: string; address: string; city: string; phone: string };
  extras: { id: string; name: string; pricePerDay: number; quantity: number; totalPrice: number }[];
  payments: { id: string; amount: number; status: string; createdAt: string; paymentMethod: string | null }[];
}

export default function DashboardBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`);
      const json = await res.json();
      if (json.success) setBooking(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    params.then(({ id }) => fetchBooking(id));
  }, [params, fetchBooking]);

  const handleCancel = async () => {
    if (!booking || !confirm("Are you sure you want to cancel this booking?")) return;
    const res = await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED", cancellationReason: "Cancelled by customer" }),
    });
    if (res.ok) fetchBooking(booking.id);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!booking) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-medium">Booking not found</p>
        <Link href="/dashboard/bookings"><Button variant="outline" className="mt-4">Back to Bookings</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/bookings" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Booking #{booking.bookingNumber}</h1>
            <p className="text-muted-foreground text-sm">Created {formatDateTime(booking.createdAt)}</p>
          </div>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Car Info */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-56 h-36 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {booking.car.images[0] ? (
                <img src={booking.car.images[0].url} alt={booking.car.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center"><Car className="h-8 w-8 text-muted-foreground" /></div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{booking.car.brand.name} {booking.car.name}</h2>
              <p className="text-sm text-muted-foreground">{booking.car.year} &middot; {booking.car.color} &middot; {booking.car.licensePlate}</p>
              <Link href={`/cars/${booking.car.id}`} className="text-sm text-primary hover:underline mt-1 inline-block">View car details</Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates & Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold flex items-center gap-2"><Calendar className="h-4 w-4" /> Dates</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Pickup</span><span className="font-medium">{formatDate(booking.pickupDate)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Return</span><span className="font-medium">{formatDate(booking.returnDate)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{booking.totalDays} day{booking.totalDays !== 1 ? "s" : ""}</span></div>
              {booking.actualPickupDate && (
                <div className="flex justify-between"><span className="text-muted-foreground">Actual Pickup</span><span className="font-medium">{formatDateTime(booking.actualPickupDate)}</span></div>
              )}
              {booking.actualReturnDate && (
                <div className="flex justify-between"><span className="text-muted-foreground">Actual Return</span><span className="font-medium">{formatDateTime(booking.actualReturnDate)}</span></div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Locations</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Pickup</p>
                <p className="font-medium">{booking.pickupLocation.name}</p>
                <p className="text-xs text-muted-foreground">{booking.pickupLocation.address}, {booking.pickupLocation.city}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Dropoff</p>
                <p className="font-medium">{booking.dropoffLocation.name}</p>
                <p className="text-xs text-muted-foreground">{booking.dropoffLocation.address}, {booking.dropoffLocation.city}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extras */}
      {booking.extras.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-3">Add-ons</h3>
            <div className="space-y-2">
              {booking.extras.map((e) => (
                <div key={e.id} className="flex justify-between text-sm">
                  <span>{e.name} x{e.quantity}</span>
                  <span className="font-medium">{formatCurrency(e.totalPrice)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Breakdown */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-3">Price Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{formatCurrency(booking.pricePerDay)} x {booking.totalDays} days</span><span>{formatCurrency(booking.subtotal)}</span></div>
            {booking.extrasAmount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Extras</span><span>{formatCurrency(booking.extrasAmount)}</span></div>}
            {booking.discountAmount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatCurrency(booking.discountAmount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>{formatCurrency(booking.taxAmount)}</span></div>
            {booking.insuranceAmount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span>{formatCurrency(booking.insuranceAmount)}</span></div>}
            <div className="flex justify-between pt-2 border-t text-lg font-bold"><span>Total</span><span>{formatCurrency(booking.totalAmount)}</span></div>
            {booking.depositAmount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Security deposit</span><span>{formatCurrency(booking.depositAmount)} (refundable)</span></div>}
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Info */}
      {booking.status === "CANCELLED" && booking.cancellationReason && (
        <Card className="border-red-200 bg-red-500/5">
          <CardContent className="p-5">
            <h3 className="font-semibold text-red-600 flex items-center gap-2"><XCircle className="h-4 w-4" /> Cancellation</h3>
            <p className="text-sm mt-1">{booking.cancellationReason}</p>
            {booking.cancelledAt && <p className="text-xs text-muted-foreground mt-1">Cancelled on {formatDateTime(booking.cancelledAt)}</p>}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {["PENDING", "CONFIRMED"].includes(booking.status) && (
        <div className="flex justify-end gap-3">
          <Button variant="destructive" onClick={handleCancel}>
            <XCircle className="h-4 w-4 mr-2" /> Cancel Booking
          </Button>
        </div>
      )}

      {booking.status === "COMPLETED" && (
        <Card>
          <CardContent className="p-5 text-center">
            <CheckCircle className="h-10 w-10 mx-auto text-emerald-500 mb-2" />
            <p className="font-semibold">Booking Completed</p>
            <p className="text-sm text-muted-foreground">Thank you for choosing DriveRent!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
