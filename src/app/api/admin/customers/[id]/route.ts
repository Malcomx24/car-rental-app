import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const customer = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        isActive: true,
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        bookings: {
          select: {
            id: true,
            bookingNumber: true,
            pickupDate: true,
            returnDate: true,
            totalAmount: true,
            status: true,
            paymentStatus: true,
            car: { select: { name: true, brand: { select: { name: true } } } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            title: true,
            createdAt: true,
            car: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            paymentMethod: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    const totalSpent = await db.booking.aggregate({
      _sum: { totalAmount: true },
      where: { userId: id, status: { in: ["COMPLETED", "ACTIVE"] } },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...customer,
        totalSpent: Number(totalSpent._sum.totalAmount || 0),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/customers/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch customer" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { role, isActive } = body;

    const updated = await db.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/admin/customers/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update customer" }, { status: 500 });
  }
}
