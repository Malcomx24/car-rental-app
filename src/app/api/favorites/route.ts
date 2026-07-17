import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");

    const [items, total] = await Promise.all([
      db.favorite.findMany({
        where: { userId: user.id },
        include: {
          car: {
            include: {
              brand: true,
              category: true,
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.favorite.count({ where: { userId: user.id } }),
    ]);

    const cars = items.map((fav) => ({
      ...fav.car,
      favoriteId: fav.id,
      favoritedAt: fav.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: cars,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/favorites error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { carId } = await request.json();
    if (!carId) {
      return NextResponse.json({ success: false, error: "carId is required" }, { status: 400 });
    }

    const car = await db.car.findUnique({ where: { id: carId } });
    if (!car) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    const existing = await db.favorite.findUnique({
      where: { userId_carId: { userId: user.id, carId } },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Already in favorites" }, { status: 409 });
    }

    const favorite = await db.favorite.create({
      data: { userId: user.id, carId },
    });

    return NextResponse.json({ success: true, data: favorite }, { status: 201 });
  } catch (error) {
    console.error("POST /api/favorites error:", error);
    return NextResponse.json({ success: false, error: "Failed to add favorite" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("carId");
    if (!carId) {
      return NextResponse.json({ success: false, error: "carId is required" }, { status: 400 });
    }

    await db.favorite.deleteMany({
      where: { userId: user.id, carId },
    });

    return NextResponse.json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    console.error("DELETE /api/favorites error:", error);
    return NextResponse.json({ success: false, error: "Failed to remove favorite" }, { status: 500 });
  }
}
