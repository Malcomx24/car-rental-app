import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createReviewSchema } from "@/validations/review";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("carId");
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    if (!carId) {
      return NextResponse.json({ success: false, error: "carId is required" }, { status: 400 });
    }

    const where = { carId, isApproved: true };

    const [items, total, ratingStats] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.review.count({ where }),
      db.review.aggregate({ where, _avg: { rating: true }, _count: { rating: true } }),
    ]);

    const distribution = await db.review.groupBy({
      by: ["rating"],
      where,
      _count: { rating: true },
    });

    const ratingDistribution = [5, 4, 3, 2, 1].map((r) => ({
      rating: r,
      count: distribution.find((d) => d.rating === r)?._count.rating || 0,
    }));

    return NextResponse.json({
      success: true,
      data: items,
      stats: {
        average: ratingStats._avg.rating || 0,
        total: ratingStats._count.rating,
        distribution: ratingDistribution,
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createReviewSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: validated.error.errors[0].message }, { status: 400 });
    }

    const { carId, rating, title, comment } = validated.data;

    const car = await db.car.findUnique({ where: { id: carId } });
    if (!car) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    const existingReview = await db.review.findUnique({
      where: { userId_carId: { userId: user.id, carId } },
    });
    if (existingReview) {
      return NextResponse.json({ success: false, error: "You have already reviewed this car" }, { status: 409 });
    }

    const completedBooking = await db.booking.findFirst({
      where: {
        userId: user.id,
        carId,
        status: "COMPLETED",
      },
    });

    const review = await db.review.create({
      data: {
        userId: user.id,
        carId,
        rating,
        title,
        comment,
        isApproved: !!completedBooking,
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });

    const approvedReviews = await db.review.aggregate({
      where: { carId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await db.car.update({
      where: { id: carId },
      data: {
        averageRating: approvedReviews._avg.rating || 0,
        totalReviews: approvedReviews._count.rating,
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 });
  }
}
