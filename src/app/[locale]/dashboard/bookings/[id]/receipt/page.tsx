"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingReceipt } from "@/components/receipt";
import type {
  ReceiptData,
  ApiBookingResponse,
  ApiUserProfile,
  ApiBankingDetails,
} from "@/components/receipt/receipt-data";
import { mapBookingToReceipt } from "@/components/receipt/receipt-data";

export default function BookingReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    setError(null);

    try {
      // Fetch booking + user profile in parallel
      const [bookingRes, userRes] = await Promise.all([
        fetch(`/api/bookings/${bookingId}`),
        fetch("/api/user/profile"),
      ]);

      const bookingJson = await bookingRes.json();
      if (!bookingJson.success || !bookingJson.data) {
        setError(bookingJson.error || "Booking not found");
        setLoading(false);
        return;
      }

      const booking: ApiBookingResponse = bookingJson.data;
      const userJson = await userRes.json();
      const user: ApiUserProfile | null = userJson.user ?? null;

      // Fetch banking details if bank transfer
      let bankingDetails: ApiBankingDetails | null = null;
      if (booking.paymentMethod === "BANK_TRANSFER") {
        try {
          const bankRes = await fetch("/api/banking-details");
          const bankJson = await bankRes.json();
          if (bankJson.success && bankJson.data) {
            bankingDetails = bankJson.data;
          }
        } catch {
          // Banking details are optional
        }
      }

      setReceiptData(mapBookingToReceipt(booking, user, bankingDetails));
    } catch {
      setError("Failed to load booking data");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !receiptData) {
    return (
      <div className="text-center py-24">
        <p className="text-xl font-medium">{error || "Receipt not found"}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push(`/dashboard/bookings/${bookingId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Booking
        </Button>
      </div>
    );
  }

  return <BookingReceipt data={receiptData} />;
}
