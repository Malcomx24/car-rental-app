import { z } from "zod";

export const createBookingSchema = z.object({
  carId: z.string().uuid("Please select a car"),
  pickupLocationId: z.string().uuid("Please select a pickup location"),
  dropoffLocationId: z.string().uuid("Please select a dropoff location"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  returnDate: z.string().min(1, "Return date is required"),
  extras: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        pricePerDay: z.number().positive(),
        quantity: z.number().min(1).default(1),
      })
    )
    .default([]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateBookingData = z.infer<typeof createBookingSchema>;

export const bookingSearchSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sort: z.enum(["newest", "oldest", "pickup-asc", "pickup-desc"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"]),
  cancellationReason: z.string().optional(),
});
