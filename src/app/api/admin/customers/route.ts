import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const role = searchParams.get("role") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "12");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role && role !== "all") where.role = role;
    if (status === "active") where.isActive = true;
    if (status === "inactive") where.isActive = false;

    const [items, total, stats] = await Promise.all([
      db.user.findMany({
        where,
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
          _count: {
            select: {
              bookings: true,
              reviews: true,
              favorites: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
      db.user.aggregate({
        _count: { id: true },
        where: { role: "CUSTOMER" },
      }),
    ]);

    const [activeCount, totalBookings, totalRevenue] = await Promise.all([
      db.user.count({ where: { role: "CUSTOMER", isActive: true } }),
      db.booking.count(),
      db.booking.aggregate({ _sum: { totalAmount: true }, where: { status: { in: ["COMPLETED", "ACTIVE"] } } }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: {
        totalCustomers: stats._count.id,
        activeCustomers: activeCount,
        totalBookings,
        totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/customers error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch customers" }, { status: 500 });
  }
}
