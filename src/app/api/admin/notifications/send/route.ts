import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, userIds, title, message, type, sendEmail } = body;

    if (!title || !message) {
      return NextResponse.json({ success: false, error: "Title and message are required" }, { status: 400 });
    }

    const targetUserIds: string[] = userIds || (userId ? [userId] : []);

    if (targetUserIds.length === 0) {
      return NextResponse.json({ success: false, error: "At least one user must be specified" }, { status: 400 });
    }

    const results = await Promise.all(
      targetUserIds.map(async (uid: string) => {
        const targetUser = await db.user.findUnique({ where: { id: uid } });
        if (!targetUser) return null;

        return createNotification({
          userId: uid,
          title,
          message,
          type: type || "INFO",
          link: `/dashboard/notifications`,
          sendEmail: sendEmail === true,
          email: targetUser.email,
          emailSubject: `DriveRent — ${title}`,
          emailHtml: `
            <!DOCTYPE html><html><head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                .header { background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 32px 24px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 20px; }
                .content { padding: 32px 24px; color: #374151; line-height: 1.6; }
                .footer { padding: 24px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
              </style>
            </head><body>
              <div class="container">
                <div class="header"><h1>${title}</h1></div>
                <div class="content"><p>${message}</p></div>
                <div class="footer"><p>DriveRent &copy; ${new Date().getFullYear()}</p></div>
              </div>
            </body></html>
          `,
        });
      })
    );

    const sent = results.filter(Boolean).length;

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${sent} user(s)`,
      data: { sent, total: targetUserIds.length },
    });
  } catch (error) {
    console.error("POST /api/admin/notifications/send error:", error);
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 });
  }
}
