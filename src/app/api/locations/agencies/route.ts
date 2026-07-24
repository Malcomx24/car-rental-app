import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const locations = await db.location.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            bookingsPickup: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const carCounts = await db.booking.groupBy({
      by: ["pickupLocationId"],
      where: {
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      _count: { _all: true },
    });

    const carCountMap = new Map<string, number>();
    for (const entry of carCounts) {
      carCountMap.set(entry.pickupLocationId, entry._count._all);
    }

    const agencies = locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
      address: loc.address,
      addressLine2: loc.addressLine2,
      city: loc.city,
      state: loc.state,
      country: loc.country,
      zipCode: loc.zipCode,
      phone: loc.phone,
      email: loc.email,
      latitude: loc.latitude ? Number(loc.latitude) : null,
      longitude: loc.longitude ? Number(loc.longitude) : null,
      operatingHours: loc.operatingHours,
      isAirport: loc.isAirport,
      totalBookings: loc._count.bookingsPickup,
      availableCars: carCountMap.get(loc.id) || 0,
    }));

    return NextResponse.json({ success: true, data: agencies });
  } catch (error) {
    console.error("GET /api/locations/agencies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch agencies" },
      { status: 500 }
    );
  }
}
