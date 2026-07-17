"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Loader2, MapPin, Calendar, Car, User, DollarSign, CheckCircle, XCircle, PlayCircle, Clock } from "lucide-react";

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
    images: { url: string }[];
  };
  pickupLocation: { name: string; address: string; city: string };
  dropoffLocation: { name: string; address: string; city: string };
  extras: { id: string; name: string; pricePerDay: number; quantity: number; totalPrice: number }[];
  payments: { id: string; amount: number; status: string; createdAt: string }[];
  user: { firstName: string; lastName: string; email: string; phone: string | null };
}

export default function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  const updateStatus = async (status: string, reason?: string) => {
    if (!booking) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, cancellationReason: reason }),
      });
      if (res.ok) fetchBooking(booking.id);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!booking) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-medium">Booking not found</p>
        <Link href="/admin/bookings"><Button variant="outline" className="mt-4">Back to Bookings</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/bookings" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Booking #{booking.bookingNumber}</h1>
            <p className="text-muted-foreground text-sm">Created {formatDateTime(booking.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BookingStatusBadge status={booking.status} />
          {booking.status === "PENDING" && (
            <Button size="sm" onClick={() => updateStatus("CONFIRMED")} disabled={updating}>
              {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Confirm
            </Button>
          )}
          {booking.status === "CONFIRMED" && (
            <Button size="sm" onClick={() => updateStatus("ACTIVE")} disabled={updating}>
              {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PlayCircle className="h-4 w-4 mr-2" />}
              Start Rental
            </Button>
          )}
          {booking.status === "ACTIVE" && (
            <Button size="sm" onClick={() => updateStatus("COMPLETED")} disabled={updating}>
              {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Complete
            </Button>
          )}
          {["PENDING", "CONFIRMED"].includes(booking.status) && (
            <Button size="sm" variant="destructive" onClick={() => {
              const reason = prompt("Cancellation reason:");
              if (reason) updateStatus("CANCELLED", reason);
            }} disabled={updating}>
              <XCircle className="h-4 w-4 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Car */}
          <Card>
            <CardContent className="p-5">
              <div className="flex gap-4">
                <div className="sm:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {booking.car.images[0] ? (
                    <img src={booking.car.images[0].url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center"><Car className="h-8 w-8 text-muted-foreground" /></div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{booking.car.brand.name} {booking.car.name}</h2>
                  <p className="text-sm text-muted-foreground">{booking.car.year} &middot; {booking.car.color} &middot; {booking.car.licensePlate}</p>
                  <p className="text-sm text-muted-foreground mt-1">{booking.car.category.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold flex items-center gap-2 mb-3"><User className="h-4 w-4" /> Customer</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Name</span><p className="font-medium">{booking.user.firstName} {booking.user.lastName}</p></div>
                <div><span className="text-muted-foreground">Email</span><p className="font-medium">{booking.user.email}</p></div>
                <div><span className="text-muted-foreground">Phone</span><p className="font-medium">{booking.user.phone || "N/A"}</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Locations */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><Calendar className="h-4 w-4" /> Schedule</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Pickup</span><span>{formatDate(booking.pickupDate)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Return</span><span>{formatDate(booking.returnDate)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{booking.totalDays} days</span></div>
                  {booking.actualPickupDate && <div className="flex justify-between"><span className="text-muted-foreground">Actual Pickup</span><span>{formatDateTime(booking.actualPickupDate)}</span></div>}
                  {booking.actualReturnDate && <div className="flex justify-between"><span className="text-muted-foreground">Actual Return</span><span>{formatDateTime(booking.actualReturnDate)}</span></div>}
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pickup Location</p>
                    <p className="font-medium">{booking.pickupLocation.name}</p>
                    <p className="text-xs text-muted-foreground">{booking.pickupLocation.address}, {booking.pickupLocation.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Dropoff Location</p>
                    <p className="font-medium">{booking.dropoffLocation.name}</p>
                    <p className="text-xs text-muted-foreground">{booking.dropoffLocation.address}, {booking.dropoffLocation.city}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extras */}
          {booking.extras.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3">Add-ons</h3>
                <div className="space-y-2 text-sm">
                  {booking.extras.map((e) => (
                    <div key={e.id} className="flex justify-between">
                      <span>{e.name} x{e.quantity}</span>
                      <span className="font-medium">{formatCurrency(e.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {booking.notes && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Cancellation */}
          {booking.status === "CANCELLED" && booking.cancellationReason && (
            <Card className="border-red-200 bg-red-500/5">
              <CardContent className="p-5">
                <h3 className="font-semibold text-red-600 flex items-center gap-2"><XCircle className="h-4 w-4" /> Cancellation</h3>
                <p className="text-sm mt-1">{booking.cancellationReason}</p>
                {booking.cancelledAt && <p className="text-xs text-muted-foreground mt-1">{formatDateTime(booking.cancelledAt)}</p>}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar — Price */}
        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4" /> Payment</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{formatCurrency(booking.pricePerDay)} x {booking.totalDays}d</span><span>{formatCurrency(booking.subtotal)}</span></div>
                {booking.extrasAmount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Extras</span><span>{formatCurrency(booking.extrasAmount)}</span></div>}
                {booking.discountAmount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatCurrency(booking.discountAmount)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(booking.taxAmount)}</span></div>
                <div className="flex justify-between pt-2 border-t text-lg font-bold"><span>Total</span><span>{formatCurrency(booking.totalAmount)}</span></div>
                {booking.depositAmount > 0 && <div className="flex justify-between text-xs"><span className="text-muted-foreground">Deposit (refundable)</span><span>{formatCurrency(booking.depositAmount)}</span></div>}
              </div>

              {/* Payment History */}
              {booking.payments.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Payment History</p>
                  {booking.payments.map((p) => (
                    <div key={p.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{formatDate(p.createdAt)}</span>
                      <span className={p.status === "SUCCEEDED" ? "text-emerald-600" : "text-amber-600"}>
                        {formatCurrency(p.amount)} ({p.status})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
