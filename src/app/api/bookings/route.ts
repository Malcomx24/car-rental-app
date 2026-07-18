import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notifyBookingConfirmed, notifyAdminNewBooking } from "@/lib/notifications";

function generateBookingNumber(): string {
  const prefix = "DR";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "12");
    const sort = searchParams.get("sort") || "newest";

    const isAdmin = ["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role);
    const where: Record<string, unknown> = isAdmin ? {} : { userId: user.id };

    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: "insensitive" } },
        { car: { name: { contains: search, mode: "insensitive" } } },
        { car: { brand: { name: { contains: search, mode: "insensitive" } } } },
      ];
    }
    if (status) where.status = status;

    const orderBy = (() => {
      switch (sort) {
        case "pickup-asc": return { pickupDate: "asc" as const };
        case "pickup-desc": return { pickupDate: "desc" as const };
        case "oldest": return { createdAt: "asc" as const };
        default: return { createdAt: "desc" as const };
      }
    })();

    const [items, total] = await Promise.all([
      db.booking.findMany({
        where,
        include: {
          car: {
            include: {
              brand: true,
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          pickupLocation: true,
          dropoffLocation: true,
          extras: true,
          ...(isAdmin ? { user: { select: { firstName: true, lastName: true, email: true, phone: true } } } : {}),
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { carId, pickupLocationId, dropoffLocationId, pickupDate, returnDate, extras, couponCode, notes, paymentMethod } = body;

    if (!carId || !pickupLocationId || !dropoffLocationId || !pickupDate || !returnDate) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const pickup = new Date(pickupDate);
    const dropoff = new Date(returnDate);
    if (dropoff <= pickup) {
      return NextResponse.json({ success: false, error: "Return date must be after pickup date" }, { status: 400 });
    }

    const totalDays = Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));

    const [car, pickupLoc, dropoffLoc] = await Promise.all([
      db.car.findUnique({ where: { id: carId }, include: { brand: true } }),
      db.location.findUnique({ where: { id: pickupLocationId } }),
      db.location.findUnique({ where: { id: dropoffLocationId } }),
    ]);

    if (!car) return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    if (car.status !== "AVAILABLE") return NextResponse.json({ success: false, error: "Car is not available" }, { status: 409 });
    if (!pickupLoc || !dropoffLoc) {
      return NextResponse.json({ success: false, error: "Invalid location" }, { status: 404 });
    }

    const pricePerDay = Number(car.pricePerDay);
    const subtotal = pricePerDay * totalDays;
    const extrasTotal = extras?.reduce((sum: number, e: { pricePerDay: number; quantity?: number }) => sum + e.pricePerDay * totalDays * (e.quantity || 1), 0) || 0;
    const taxRate = 0.08;
    const taxAmount = (subtotal + extrasTotal) * taxRate;
    const totalAmount = subtotal + extrasTotal + taxAmount;

    const booking = await db.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        userId: user.id,
        carId,
        pickupLocationId,
        dropoffLocationId,
        pickupDate: pickup,
        returnDate: dropoff,
        totalDays,
        pricePerDay,
        subtotal,
        extrasAmount: extrasTotal,
        taxAmount,
        totalAmount,
        depositAmount: Number(car.securityDeposit) || 0,
        notes,
        paymentMethod: paymentMethod === "BANK_TRANSFER" ? "BANK_TRANSFER" : "PAY_AT_PICKUP",
        paymentStatus: paymentMethod === "BANK_TRANSFER" ? "AWAITING_TRANSFER" : "PENDING",
        extras: extras?.length
          ? {
              create: extras.map((e: { name: string; description?: string; pricePerDay: number; quantity?: number }) => ({
                name: e.name,
                description: e.description,
                pricePerDay: e.pricePerDay,
                quantity: e.quantity || 1,
                totalPrice: e.pricePerDay * totalDays * (e.quantity || 1),
              })),
            }
          : undefined,
      },
      include: {
        car: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } },
        pickupLocation: true,
        dropoffLocation: true,
        extras: true,
      },
    });

    await db.car.update({ where: { id: carId }, data: { totalBookings: { increment: 1 } } });

    // Fire-and-forget notifications
    notifyBookingConfirmed({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      totalAmount: Number(booking.totalAmount),
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      userId: user.id,
      car: { name: booking.car.name, brand: { name: booking.car.brand.name } },
      pickupLocation: { name: booking.pickupLocation.name },
      paymentMethod: booking.paymentMethod,
    }).catch(console.error);

    notifyAdminNewBooking({
      bookingNumber: booking.bookingNumber,
      totalAmount: Number(booking.totalAmount),
      userId: user.id,
      car: { name: booking.car.name, brand: { name: booking.car.brand.name } },
    }).catch(console.error);

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 });
  }
}
