import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let preferences = await db.notificationPreference.findUnique({
      where: { userId: user.id },
    });

    // Create default preferences if none exist
    if (!preferences) {
      preferences = await db.notificationPreference.create({
        data: { userId: user.id },
      });
    }

    return NextResponse.json({ success: true, data: preferences });
  } catch (error) {
    console.error("GET /api/user/notification-preferences error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      bookingUpdates,
      paymentUpdates,
      promotionalEmails,
      reviewRequests,
      systemAlerts,
      adminNotifications,
    } = body;

    const preferences = await db.notificationPreference.upsert({
      where: { userId: user.id },
      update: {
        ...(typeof bookingUpdates === "boolean" && { bookingUpdates }),
        ...(typeof paymentUpdates === "boolean" && { paymentUpdates }),
        ...(typeof promotionalEmails === "boolean" && { promotionalEmails }),
        ...(typeof reviewRequests === "boolean" && { reviewRequests }),
        ...(typeof systemAlerts === "boolean" && { systemAlerts }),
        ...(typeof adminNotifications === "boolean" && { adminNotifications }),
      },
      create: {
        userId: user.id,
        bookingUpdates: typeof bookingUpdates === "boolean" ? bookingUpdates : true,
        paymentUpdates: typeof paymentUpdates === "boolean" ? paymentUpdates : true,
        promotionalEmails: typeof promotionalEmails === "boolean" ? promotionalEmails : false,
        reviewRequests: typeof reviewRequests === "boolean" ? reviewRequests : true,
        systemAlerts: typeof systemAlerts === "boolean" ? systemAlerts : true,
        adminNotifications: typeof adminNotifications === "boolean" ? adminNotifications : true,
      },
    });

    return NextResponse.json({ success: true, data: preferences });
  } catch (error) {
    console.error("PATCH /api/user/notification-preferences error:", error);
    return NextResponse.json({ success: false, error: "Failed to update preferences" }, { status: 500 });
  }
}
