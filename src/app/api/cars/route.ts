import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { carSearchSchema } from "@/validations/car";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const validated = carSearchSchema.parse(params);
    const { search, brandId, categoryId, status, fuelType, transmission, minPrice, maxPrice, year, isFeatured, sort, page, limit } = validated;

    const where: Record<string, unknown> = { isPublished: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { licensePlate: { contains: search, mode: "insensitive" } },
        { brand: { name: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (fuelType) where.fuelType = fuelType;
    if (transmission) where.transmission = transmission;
    if (year) where.year = year;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerDay = {};
      if (minPrice !== undefined) (where.pricePerDay as Record<string, number>).gte = minPrice;
      if (maxPrice !== undefined) (where.pricePerDay as Record<string, number>).lte = maxPrice;
    }

    const orderBy = (() => {
      switch (sort) {
        case "price-asc": return { pricePerDay: "asc" as const };
        case "price-desc": return { pricePerDay: "desc" as const };
        case "name-asc": return { name: "asc" as const };
        case "name-desc": return { name: "desc" as const };
        case "oldest": return { createdAt: "asc" as const };
        default: return { createdAt: "desc" as const };
      }
    })();

    const [items, total] = await Promise.all([
      db.car.findMany({
        where,
        include: {
          brand: true,
          category: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
        orderBy,
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
    console.error("GET /api/cars error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { images, ...carData } = body;

    if (carData.brandId) {
      const brand = await db.brand.findUnique({ where: { id: carData.brandId } });
      if (!brand) {
        return NextResponse.json({ success: false, error: "Selected brand not found" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, error: "Brand is required" }, { status: 400 });
    }

    carData.slug = carData.slug || slugify(carData.name);
    carData.pricePerDay = Number(carData.pricePerDay);
    if (carData.weekendPricePerDay) carData.weekendPricePerDay = Number(carData.weekendPricePerDay);
    if (carData.weeklyPrice) carData.weeklyPrice = Number(carData.weeklyPrice);
    if (carData.monthlyPrice) carData.monthlyPrice = Number(carData.monthlyPrice);
    if (carData.securityDeposit) carData.securityDeposit = Number(carData.securityDeposit);
    if (carData.fuelCapacity) carData.fuelCapacity = Number(carData.fuelCapacity);
    if (carData.horsepower) carData.horsepower = Number(carData.horsepower);
    carData.year = Number(carData.year);
    carData.seats = Number(carData.seats);
    carData.doors = Number(carData.doors);
    carData.mileage = Number(carData.mileage);

    const nullableStringFields = ["vin", "exteriorColor", "interiorColor", "engineSize", "torque", "topSpeed", "zeroToSixty", "trunkCapacity"];
    for (const field of nullableStringFields) {
      if (carData[field] === "") carData[field] = null;
    }

    const existing = await db.car.findUnique({ where: { licensePlate: carData.licensePlate } });
    if (existing) {
      return NextResponse.json({ success: false, error: "A car with this license plate already exists" }, { status: 409 });
    }

    const slugExists = await db.car.findUnique({ where: { slug: carData.slug } });
    if (slugExists) {
      carData.slug = `${carData.slug}-${Date.now()}`;
    }

    const car = await db.car.create({
      data: carData,
      include: { brand: true, category: true, images: true },
    });

    if (images && images.length > 0) {
      await db.carImage.createMany({
        data: images.map((img: { url: string; alt?: string }, index: number) => ({
          carId: car.id,
          url: img.url,
          alt: img.alt || "",
          isPrimary: index === 0,
          order: index,
        })),
      });
    }

    const result = await db.car.findUnique({
      where: { id: car.id },
      include: { brand: true, category: true, images: true },
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("POST /api/cars error:", error);
    return NextResponse.json({ success: false, error: "Failed to create car" }, { status: 500 });
  }
}
