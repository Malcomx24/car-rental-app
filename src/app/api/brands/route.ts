import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { brandFormSchema } from "@/validations/brand";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      db.brand.findMany({
        where,
        include: { _count: { select: { cars: true } } },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.brand.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/brands error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validated = brandFormSchema.parse(body);

    const existing = await db.brand.findUnique({ where: { name: validated.name } });
    if (existing) {
      return NextResponse.json({ success: false, error: "A brand with this name already exists" }, { status: 409 });
    }

    const brand = await db.brand.create({
      data: {
        name: validated.name,
        logo: validated.logo || null,
        country: validated.country || null,
      },
    });

    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("POST /api/brands error:", error);
    return NextResponse.json({ success: false, error: "Failed to create brand" }, { status: 500 });
  }
}
