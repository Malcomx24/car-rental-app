import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("carId");
    const pickupDate = searchParams.get("pickupDate");
    const returnDate = searchParams.get("returnDate");

    if (!carId || !pickupDate || !returnDate) {
      return NextResponse.json({ success: false, error: "carId, pickupDate, and returnDate are required" }, { status: 400 });
    }

    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);

    const conflictingBookings = await db.booking.findMany({
      where: {
        carId,
        status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
        AND: [
          { pickupDate: { lt: returnD } },
          { returnDate: { gt: pickup } },
        ],
      },
      select: { pickupDate: true, returnDate: true },
    });

    const available = conflictingBookings.length === 0;

    const totalDays = Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));

    const car = await db.car.findUnique({
      where: { id: carId },
      select: { pricePerDay: true, weekendPricePerDay: true, securityDeposit: true },
    });

    let pricePerDay = car ? Number(car.pricePerDay) : 0;
    const weekendRate = car?.weekendPricePerDay ? Number(car.weekendPricePerDay) : null;
    if (weekendRate) {
      let weekendDays = 0;
      const d = new Date(pickup);
      while (d < returnD) {
        if (d.getDay() === 0 || d.getDay() === 6) weekendDays++;
        d.setDate(d.getDate() + 1);
      }
      if (weekendDays > 0) pricePerDay = weekendRate;
    }

    const subtotal = pricePerDay * totalDays;
    const taxRate = 0.08;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return NextResponse.json({
      success: true,
      data: {
        available,
        conflictingBookings,
        totalDays,
        pricePerDay,
        subtotal,
        taxAmount,
        total,
        securityDeposit: car?.securityDeposit ? Number(car.securityDeposit) : 0,
      },
    });
  } catch (error) {
    console.error("GET /api/bookings/availability error:", error);
    return NextResponse.json({ success: false, error: "Failed to check availability" }, { status: 500 });
  }
}
