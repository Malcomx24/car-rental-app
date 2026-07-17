"use client";

import { useState, useCallback } from "react";
import type { ApiResponse } from "@/types";

interface BookingWithDetails {
  id: string;
  bookingNumber: string;
  userId: string;
  carId: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  pricePerDay: number;
  extras: { id: string; name: string; pricePerDay: number; quantity: number }[];
  subtotal: number;
  taxes: number;
  insurance: number;
  total: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  car: {
    id: string;
    name: string;
    brand: { name: string };
    images: { url: string; isPrimary: boolean }[];
  };
  dropoffLocationData: { id: string; name: string; city: string };
  pickupLocationData: { id: string; name: string; city: string };
  extrasDetails: { id: string; name: string; pricePerDay: number; quantity: number; totalPrice: number }[];
  user?: { firstName: string; lastName: string; email: string; phone: string | null };
}

export function useBookings() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (params: Record<string, string | number | undefined> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== "") searchParams.set(key, String(val));
      });
      const res = await fetch(`/api/bookings?${searchParams.toString()}`);
      const json: ApiResponse<BookingWithDetails[]> & { pagination?: typeof pagination } = await res.json();
      if (json.success && json.data) {
        setBookings(json.data);
        if (json.pagination) setPagination(json.pagination);
      } else {
        setError(json.error || "Failed to fetch bookings");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { bookings, pagination, loading, error, fetchBookings };
}

export function useBooking(id: string | null) {
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`);
      const json: ApiResponse<BookingWithDetails> = await res.json();
      if (json.success && json.data) setBooking(json.data as BookingWithDetails);
      else setError(json.error || "Failed to fetch booking");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { booking, loading, error, fetchBooking };
}
