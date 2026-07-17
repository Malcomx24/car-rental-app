import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ success: false, error: "bookingId is required" }, { status: 400 });
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { car: { select: { name: true, brand: { select: { name: true } } } } },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== user.id && !["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json({ success: false, error: "Cannot pay for cancelled booking" }, { status: 400 });
    }

    const existingPayment = await db.payment.findFirst({
      where: { bookingId, status: "SUCCEEDED" },
    });
    if (existingPayment) {
      return NextResponse.json({ success: false, error: "Booking already paid" }, { status: 409 });
    }

    const totalAmount = Number(booking.totalAmount);
    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        userId: user.id,
        carName: `${booking.car.brand.name} ${booking.car.name}`,
      },
    });

    await db.payment.create({
      data: {
        bookingId: booking.id,
        userId: user.id,
        amount: totalAmount,
        currency: "USD",
        status: "PENDING",
        stripePaymentIntentId: paymentIntent.id,
        description: `Payment for booking #${booking.bookingNumber}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: totalAmount,
      },
    });
  } catch (error) {
    console.error("POST /api/payments/intent error:", error);
    return NextResponse.json({ success: false, error: "Failed to create payment intent" }, { status: 500 });
  }
}
