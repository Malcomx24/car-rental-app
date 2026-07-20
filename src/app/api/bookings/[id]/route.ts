import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { updateBookingStatusSchema } from "@/validations/booking";
import {
  notifyBookingCancelled,
  notifyBookingActive,
  notifyBookingCompleted,
  notifyPaymentStatusChanged,
} from "@/lib/notifications";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = ["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role);

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        car: {
          include: {
            brand: true,
            category: true,
            images: { orderBy: { order: "asc" } },
          },
        },
        pickupLocation: true,
        dropoffLocation: true,
        extras: true,
        payments: { orderBy: { createdAt: "desc" } },
        invoice: true,
        ...(isAdmin ? { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatar: true } } } : {}),
      },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (!isAdmin && booking.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("GET /api/bookings/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = ["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role);

    const booking = await db.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (!isAdmin && booking.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Customers can only cancel
    const body = await request.json();
    if (!isAdmin) {
      if (body.status === "CANCELLED" && ["PENDING", "CONFIRMED"].includes(booking.status)) {
        const updated = await db.booking.update({
          where: { id },
          data: {
            status: "CANCELLED",
            cancellationReason: body.cancellationReason || "Cancelled by customer",
            cancelledAt: new Date(),
          },
          include: {
            car: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } },
            pickupLocation: true,
            dropoffLocation: true,
            extras: true,
          },
        });

        // Fire-and-forget notification
        const carWithBrand = await db.car.findUnique({
          where: { id: booking.carId },
          include: { brand: true },
        });
        if (carWithBrand) {
          notifyBookingCancelled({
            id: booking.id,
            bookingNumber: booking.bookingNumber,
            userId: booking.userId,
            car: { name: carWithBrand.name, brand: { name: carWithBrand.brand.name } },
            reason: body.cancellationReason,
          }).catch(console.error);
        }

        return NextResponse.json({ success: true, data: updated });
      }
      return NextResponse.json({ success: false, error: "Cannot modify this booking" }, { status: 403 });
    }

    // Admin can update status or payment status

    // Handle payment status updates (doesn't require booking status change)
    if (body.paymentStatus) {
      const { paymentStatus, paymentReference, paymentNotes } = body;

      const updatedBooking = await db.booking.update({
        where: { id },
        data: {
          paymentStatus,
          ...(paymentReference !== undefined && { paymentReference }),
          ...(paymentNotes !== undefined && { paymentNotes }),
        },
        include: {
          car: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } },
          pickupLocation: true,
          dropoffLocation: true,
          extras: true,
          payments: { orderBy: { createdAt: "desc" } },
        },
      });

      if (paymentStatus === "SUCCEEDED") {
        const existingPayment = await db.payment.findFirst({
          where: { bookingId: id, status: "SUCCEEDED" },
        });
        if (!existingPayment) {
          await db.payment.create({
            data: {
              bookingId: booking.id,
              userId: booking.userId,
              amount: booking.totalAmount,
              currency: "MAD",
              status: "SUCCEEDED",
              description: `Payment confirmed — ${booking.paymentMethod || "Pay at Pickup"}`,
            },
          });
        }
      }

      notifyPaymentStatusChanged({
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        userId: booking.userId,
        paymentStatus,
      }).catch(console.error);

      return NextResponse.json({ success: true, data: updatedBooking });
    }

    // Validate booking status update
    const validated = updateBookingStatusSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    const { status, cancellationReason } = validated.data;

    const updateData: Record<string, unknown> = { status };
    if (status === "CANCELLED") {
      updateData.cancellationReason = cancellationReason || "Cancelled by admin";
      updateData.cancelledAt = new Date();
    }
    if (status === "ACTIVE") {
      updateData.actualPickupDate = new Date();
    }
    if (status === "COMPLETED") {
      updateData.actualReturnDate = new Date();
    }

    const updated = await db.booking.update({
      where: { id },
      data: updateData,
      include: {
        car: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } },
        pickupLocation: true,
        dropoffLocation: true,
        extras: true,
      },
    });

    if (status === "CANCELLED" || status === "COMPLETED") {
      await db.car.update({ where: { id: booking.carId }, data: { status: "AVAILABLE" } });
    }
    if (status === "ACTIVE") {
      await db.car.update({ where: { id: booking.carId }, data: { status: "RENTED" } });
    }

    // Fire-and-forget notifications based on status change
    const fullBooking = {
      id: updated.id,
      bookingNumber: updated.bookingNumber,
      userId: booking.userId,
      carId: booking.carId,
      car: { name: updated.car.name, brand: { name: updated.car.brand.name } },
    };

    if (status === "CANCELLED") {
      notifyBookingCancelled({
        ...fullBooking,
        reason: cancellationReason,
      }).catch(console.error);
    } else if (status === "ACTIVE") {
      notifyBookingActive(fullBooking).catch(console.error);
    } else if (status === "COMPLETED") {
      notifyBookingCompleted(fullBooking).catch(console.error);
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 });
  }
}
