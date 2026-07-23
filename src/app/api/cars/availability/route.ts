import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pickupDate = searchParams.get("pickupDate");
    const returnDate = searchParams.get("returnDate");
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "50");

    if (!pickupDate || !returnDate) {
      return NextResponse.json(
        { success: false, error: "pickupDate and returnDate are required" },
        { status: 400 }
      );
    }

    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);

    if (returnD <= pickup) {
      return NextResponse.json(
        { success: false, error: "returnDate must be after pickupDate" },
        { status: 400 }
      );
    }

    // Find car IDs that have conflicting bookings during the requested period
    const conflictingBookings = await db.booking.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
        AND: [
          { pickupDate: { lt: returnD } },
          { returnDate: { gt: pickup } },
        ],
      },
      select: { carId: true },
      distinct: ["carId"],
    });

    const bookedCarIds = conflictingBookings.map((b) => b.carId);

    // Fetch all available, active, published cars that are NOT in the booked list
    const where: Record<string, unknown> = {
      isPublished: true,
      status: "AVAILABLE",
    };

    if (bookedCarIds.length > 0) {
      where.id = { notIn: bookedCarIds };
    }

    const [items, total] = await Promise.all([
      db.car.findMany({
        where,
        include: {
          brand: true,
          category: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.car.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/cars/availability error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
