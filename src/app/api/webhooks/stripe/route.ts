import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { notifyPaymentReceived, notifyBookingConfirmed } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ success: false, error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata.bookingId;

        await db.payment.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: "SUCCEEDED" },
        });

        if (bookingId) {
          await db.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
          });

          const invoiceCount = await db.invoice.count();
          const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(6, "0")}`;

          const booking = await db.booking.findUnique({ where: { id: bookingId } });
          if (booking) {
            await db.invoice.create({
              data: {
                invoiceNumber,
                bookingId,
                userId: booking.userId,
                subtotal: Number(booking.subtotal),
                taxAmount: Number(booking.taxAmount),
                discountAmount: Number(booking.discountAmount),
                totalAmount: Number(booking.totalAmount),
                status: "PAID",
                paidAt: new Date(),
                dueDate: new Date(),
              },
            });

            // Fire-and-forget payment notification
            notifyPaymentReceived({
              id: booking.id,
              bookingNumber: booking.bookingNumber,
              userId: booking.userId,
              totalAmount: Number(booking.totalAmount),
            }).catch(console.error);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        await db.payment.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: "FAILED" },
        });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        if (charge.payment_intent) {
          const refundAmount = (charge.amount_refunded || 0) / 100;
          await db.payment.updateMany({
            where: { stripePaymentIntentId: charge.payment_intent as string },
            data: {
              status: "REFUNDED",
              refundAmount,
              refundedAt: new Date(),
              stripeRefundId: charge.id,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ success: false, error: "Webhook handler failed" }, { status: 500 });
  }
}
