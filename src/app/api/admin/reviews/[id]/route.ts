import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function recalcCarRating(carId: string) {
  const stats = await db.review.aggregate({
    where: { carId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await db.car.update({
    where: { id: carId },
    data: {
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.rating,
    },
  });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const review = await db.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    const updated = await db.review.update({
      where: { id },
      data: { isApproved: body.isApproved },
      include: {
        user: { select: { firstName: true, lastName: true } },
        car: { select: { name: true, brand: { select: { name: true } } } },
      },
    });

    await recalcCarRating(review.carId);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/admin/reviews/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const review = await db.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    await db.review.delete({ where: { id } });
    await recalcCarRating(review.carId);

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/reviews/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete review" }, { status: 500 });
  }
}
