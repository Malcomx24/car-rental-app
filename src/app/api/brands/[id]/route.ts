import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { brandFormSchema } from "@/validations/brand";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const brand = await db.brand.findUnique({
      where: { id },
      include: { _count: { select: { cars: true } } },
    });

    if (!brand) {
      return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    console.error("GET /api/brands/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch brand" }, { status: 500 });
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
    const validated = brandFormSchema.partial().parse(body);

    const existing = await db.brand.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404 });
    }

    if (validated.name && validated.name !== existing.name) {
      const nameConflict = await db.brand.findFirst({
        where: { name: validated.name, id: { not: id } },
      });
      if (nameConflict) {
        return NextResponse.json({ success: false, error: "A brand with this name already exists" }, { status: 409 });
      }
    }

    const brand = await db.brand.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("PATCH /api/brands/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await db.brand.findUnique({
      where: { id },
      include: { _count: { select: { cars: true } } },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404 });
    }

    if (existing._count.cars > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete "${existing.name}" — ${existing._count.cars} car(s) are linked to it. Remove or reassign the cars first.` },
        { status: 409 }
      );
    }

    await db.brand.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/brands/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete brand" }, { status: 500 });
  }
}
