import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { locationFormSchema } from "@/validations/location";
import { slugify } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const location = await db.location.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookingsPickup: true,
            bookingsDropoff: true,
          },
        },
      },
    });

    if (!location) {
      return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    console.error("GET /api/locations/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch location" }, { status: 500 });
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
    const validated = locationFormSchema.partial().parse(body);

    const existing = await db.location.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 });
    }

    let slug = existing.slug;
    if (validated.name && validated.name !== existing.name) {
      slug = validated.slug || slugify(validated.name);
      const slugConflict = await db.location.findFirst({
        where: { slug, id: { not: id } },
      });
      if (slugConflict) {
        return NextResponse.json(
          { success: false, error: "A location with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const { slug: _slug, ...rest } = validated;
    const location = await db.location.update({
      where: { id },
      data: { ...rest, slug },
    });

    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("PATCH /api/locations/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update location" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await db.location.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookingsPickup: true,
            bookingsDropoff: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 });
    }

    const totalBookings = existing._count.bookingsPickup + existing._count.bookingsDropoff;
    if (totalBookings > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete "${existing.name}" — ${totalBookings} booking(s) are linked to it. Remove or reassign the bookings first.`,
        },
        { status: 409 }
      );
    }

    await db.location.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Location deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/locations/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete location" }, { status: 500 });
  }
}
