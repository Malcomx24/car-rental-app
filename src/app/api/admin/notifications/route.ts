import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");
    const type = searchParams.get("type") || undefined;
    const unreadOnly = searchParams.get("unread") === "true";
    const userId = searchParams.get("userId") || undefined;

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (unreadOnly) where.isRead = false;
    if (userId) where.userId = userId;

    const [items, total, unreadCount, stats] = await Promise.all([
      db.notification.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.notification.count({ where }),
      db.notification.count({ where: { isRead: false } }),
      db.notification.groupBy({
        by: ["type"],
        _count: true,
        orderBy: { type: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      stats: {
        total,
        unread: unreadCount,
        byType: stats.map((t) => ({ type: t.type, count: t._count })),
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/admin/notifications error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 });
  }
}
