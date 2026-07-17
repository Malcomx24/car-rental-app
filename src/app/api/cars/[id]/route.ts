import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const car = await db.car.findUnique({
      where: isUuid ? { id } : { slug: id },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { order: "asc" } },
        reviews: {
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { bookings: true, reviews: true, favorites: true } },
      },
    });

    if (!car) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: car });
  } catch (error) {
    console.error("GET /api/cars/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch car" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { images, deleteImageIds, ...carData } = body;

    const existing = await db.car.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    if (carData.name && !body.slug) {
      carData.slug = slugify(carData.name);
      const slugConflict = await db.car.findFirst({ where: { slug: carData.slug, id: { not: id } } });
      if (slugConflict) carData.slug = `${carData.slug}-${Date.now()}`;
    }

    Object.keys(carData).forEach((key) => {
      const val = carData[key];
      if (["pricePerDay", "weekendPricePerDay", "weeklyPrice", "monthlyPrice", "securityDeposit", "fuelCapacity"].includes(key)) {
        if (val !== undefined && val !== null) carData[key] = Number(val);
      }
      if (["year", "seats", "doors", "mileage", "horsepower"].includes(key)) {
        if (val !== undefined && val !== null) carData[key] = Number(val);
      }
    });

    if (carData.licensePlate && carData.licensePlate !== existing.licensePlate) {
      const plateConflict = await db.car.findFirst({ where: { licensePlate: carData.licensePlate, id: { not: id } } });
      if (plateConflict) {
        return NextResponse.json({ success: false, error: "A car with this license plate already exists" }, { status: 409 });
      }
    }

    const nullableStringFields = ["vin", "exteriorColor", "interiorColor", "engineSize", "torque", "topSpeed", "zeroToSixty", "trunkCapacity"];
    for (const field of nullableStringFields) {
      if (carData[field] === "") carData[field] = null;
    }

    await db.car.update({ where: { id }, data: carData });

    if (deleteImageIds && deleteImageIds.length > 0) {
      await db.carImage.deleteMany({ where: { id: { in: deleteImageIds }, carId: id } });
    }

    if (images && images.length > 0) {
      const existingImageCount = await db.carImage.count({ where: { carId: id } });
      await db.carImage.createMany({
        data: images.map((img: { url: string; alt?: string }, index: number) => ({
          carId: id,
          url: img.url,
          alt: img.alt || "",
          isPrimary: existingImageCount === 0 && index === 0,
          order: existingImageCount + index,
        })),
      });
    }

    const car = await db.car.findUnique({
      where: { id },
      include: { brand: true, category: true, images: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json({ success: true, data: car });
  } catch (error) {
    console.error("PATCH /api/cars/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update car" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await db.car.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    if (existing._count.bookings > 0) {
      await db.car.update({ where: { id }, data: { isPublished: false } });
      return NextResponse.json({
        success: true,
        message: "Car hidden from listings (has existing bookings)",
      });
    }

    await db.car.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/cars/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete car" }, { status: 500 });
  }
}
