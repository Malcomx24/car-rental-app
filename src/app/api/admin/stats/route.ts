import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalRevenueResult,
      thisMonthRevenueResult,
      prevMonthRevenueResult,
      totalBookings,
      thisMonthBookings,
      prevMonthBookings,
      activeBookings,
      fleetSize,
      availableFleet,
      prevMonthFleet,
      totalCustomers,
      newCustomersWeek,
      bookingStatuses,
      recentBookings,
      recentCustomers,
      recentReviews,
      topVehicles,
      popularLocations,
    ] = await Promise.all([
      db.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ["COMPLETED", "ACTIVE"] } },
      }),
      db.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ["COMPLETED", "ACTIVE"] }, createdAt: { gte: currentMonthStart } },
      }),
      db.booking.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { in: ["COMPLETED", "ACTIVE"] },
          createdAt: { gte: prevMonthStart, lt: currentMonthStart },
        },
      }),
      db.booking.count(),
      db.booking.count({ where: { createdAt: { gte: currentMonthStart } } }),
      db.booking.count({
        where: { createdAt: { gte: prevMonthStart, lt: currentMonthStart } },
      }),
      db.booking.count({ where: { status: { in: ["ACTIVE", "CONFIRMED", "PENDING"] } } }),
      db.car.count(),
      db.car.count({ where: { status: "AVAILABLE" } }),
      db.car.count({
        where: { createdAt: { lt: currentMonthStart } },
      }),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.user.count({ where: { role: "CUSTOMER", createdAt: { gte: oneWeekAgo } } }),
      db.booking.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      db.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          car: { select: { name: true } },
          user: { select: { firstName: true, lastName: true } },
        },
      }),
      db.user.findMany({
        where: { role: "CUSTOMER" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
        },
      }),
      db.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { firstName: true, lastName: true } },
          car: { select: { name: true } },
        },
      }),
      db.car.findMany({
        orderBy: { totalBookings: "desc" },
        take: 5,
        include: {
          brand: { select: { name: true } },
          images: { where: { isPrimary: true }, take: 1, select: { url: true } },
          _count: { select: { bookings: true } },
        },
      }),
      db.location.findMany({
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          city: true,
          isAirport: true,
          _count: { select: { bookingsPickup: true } },
        },
      }),
    ]);

    // Compute monthly revenue for last 12 months
    const monthlyRevenue: { month: string; revenue: number; bookings: number; monthIndex: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const [revResult, bookCount] = await Promise.all([
        db.booking.aggregate({
          _sum: { totalAmount: true },
          where: {
            status: { in: ["COMPLETED", "ACTIVE"] },
            createdAt: { gte: d, lt: monthEnd },
          },
        }),
        db.booking.count({
          where: { createdAt: { gte: d, lt: monthEnd } },
        }),
      ]);
      monthlyRevenue.push({
        month: d.toLocaleString("fr-MA", { month: "short" }),
        monthIndex: d.getMonth(),
        revenue: Number(revResult._sum.totalAmount || 0),
        bookings: bookCount,
      });
    }

    // Compute revenue change percentage
    const thisMonthRev = Number(thisMonthRevenueResult._sum.totalAmount || 0);
    const prevMonthRev = Number(prevMonthRevenueResult._sum.totalAmount || 0);
    const revenueChange = prevMonthRev > 0 ? ((thisMonthRev - prevMonthRev) / prevMonthRev) * 100 : 0;

    // Compute booking change percentage
    const bookingChange = prevMonthBookings > 0 ? ((thisMonthBookings - prevMonthBookings) / prevMonthBookings) * 100 : 0;

    // Fleet change (new cars added this month)
    const fleetChange = prevMonthFleet > 0 ? ((fleetSize - prevMonthFleet) / prevMonthFleet) * 100 : 0;

    // Quick metrics
    const totalRevenue = Number(totalRevenueResult._sum.totalAmount || 0);
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const occupancyRate = fleetSize > 0 ? ((fleetSize - availableFleet) / fleetSize) * 100 : 0;
    const revenuePerCar = fleetSize > 0 ? totalRevenue / fleetSize : 0;

    // Format booking statuses for chart
    const statusColors: Record<string, string> = {
      COMPLETED: "#10b981",
      ACTIVE: "#3b82f6",
      CONFIRMED: "#f59e0b",
      PENDING: "#8b5cf6",
      CANCELLED: "#ef4444",
    };
    const statusChart = bookingStatuses.map((s) => ({
      name: s.status,
      value: s._count.id,
      color: statusColors[s.status] || "#6b7280",
    }));

    // Format recent activity
    const activity = [
      ...recentBookings.map((b) => ({
        id: b.id,
        type: b.status === "COMPLETED" ? "success" as const : b.status === "CANCELLED" ? "alert" as const : "booking" as const,
        titleKey: b.status === "COMPLETED" ? "bookingCompleted" : b.status === "CANCELLED" ? "bookingCancelled" : "newBooking",
        description: `${b.car.name} — ${b.user.firstName} ${b.user.lastName}`,
        timestamp: b.createdAt.toISOString(),
        user: `${b.user.firstName} ${b.user.lastName}`,
      })),
      ...recentCustomers.map((c) => ({
        id: c.id,
        type: "user" as const,
        titleKey: "newCustomer" as const,
        description: `${c.firstName} ${c.lastName} (${c.email})`,
        timestamp: c.createdAt.toISOString(),
        user: `${c.firstName} ${c.lastName}`,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          thisMonthRevenue: thisMonthRev,
          revenueChange: Math.round(revenueChange * 10) / 10,
          totalBookings,
          activeBookings,
          bookingChange: Math.round(bookingChange * 10) / 10,
          fleetSize,
          availableFleet,
          fleetChange: Math.round(fleetChange * 10) / 10,
          totalCustomers,
          newCustomersWeek,
        },
        monthlyRevenue,
        bookingStatuses: statusChart,
        activity,
        topVehicles: topVehicles.map((v) => ({
          id: v.id,
          name: v.name,
          brand: v.brand.name,
          bookings: v._count.bookings,
          revenue: Number(v.pricePerDay) * v.totalBookings,
          rating: Number(v.averageRating),
          image: v.images[0]?.url || null,
        })),
        popularLocations: popularLocations
          .sort((a, b) => b._count.bookingsPickup - a._count.bookingsPickup)
          .slice(0, 5)
          .map((l) => ({
            id: l.id,
            name: l.name,
            city: l.city,
            bookings: l._count.bookingsPickup,
            isAirport: l.isAirport,
          })),
        quickMetrics: {
          avgBookingValue: Math.round(avgBookingValue * 100) / 100,
          occupancyRate: Math.round(occupancyRate * 10) / 10,
          revenuePerCar: Math.round(revenuePerCar * 100) / 100,
          totalRevenue,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
