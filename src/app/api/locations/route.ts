import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { locationFormSchema } from "@/validations/location";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");
    const admin = searchParams.get("admin") === "true";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    if (!admin) {
      where.isActive = true;
    }

    const [items, total] = await Promise.all([
      db.location.findMany({
        where,
        include: {
          _count: {
            select: {
              bookingsPickup: true,
              bookingsDropoff: true,
            },
          },
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.location.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/locations error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validated = locationFormSchema.parse(body);

    const slug = validated.slug || slugify(validated.name);

    const existing = await db.location.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A location with this slug already exists" },
        { status: 409 }
      );
    }

    const location = await db.location.create({
      data: {
        name: validated.name,
        slug,
        address: validated.address,
        addressLine2: validated.addressLine2 || null,
        city: validated.city,
        state: validated.state,
        country: validated.country,
        zipCode: validated.zipCode,
        phone: validated.phone,
        email: validated.email || null,
        latitude: validated.latitude ?? null,
        longitude: validated.longitude ?? null,
        isAirport: validated.isAirport,
        isActive: validated.isActive,
      },
    });

    return NextResponse.json({ success: true, data: location }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("POST /api/locations error:", error);
    return NextResponse.json({ success: false, error: "Failed to create location" }, { status: 500 });
  }
}
