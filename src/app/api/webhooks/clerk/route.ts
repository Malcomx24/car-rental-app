import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/prisma";
import { notifyWelcome } from "@/lib/notifications";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

interface WebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{
      email_address: string;
      verification?: { status: string };
    }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
}

async function verifyWebhook(payload: string, headers: Record<string, string>) {
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET not configured");
  }

  const wh = new Webhook(webhookSecret);
  return wh.verify(payload, {
    "svix-id": headers["svix-id"],
    "svix-timestamp": headers["svix-timestamp"],
    "svix-signature": headers["svix-signature"],
  }) as WebhookEvent;
}

export async function POST(request: Request) {
  try {
    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET not configured — webhook events will not be processed.");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const payload = await request.text();
    const headerStore = await headers();

    const svixId = headerStore.get("svix-id") ?? "";
    const svixTimestamp = headerStore.get("svix-timestamp") ?? "";
    const svixSignature = headerStore.get("svix-signature") ?? "";

    const event = await verifyWebhook(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });

    const eventType = event.type;
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    switch (eventType) {
      case "user.created": {
        const newUser = await db.user.create({
          data: {
            clerkId: id,
            email,
            firstName: first_name || "",
            lastName: last_name || "",
            avatar: image_url,
            isEmailVerified:
              email_addresses?.[0]?.verification?.status === "verified",
            lastLoginAt: new Date(),
          },
        });

        // Fire-and-forget welcome notification
        notifyWelcome({
          id: newUser.id,
          firstName: newUser.firstName || "there",
          email: newUser.email,
        }).catch(console.error);

        break;
      }

      case "user.updated": {
        await db.user.upsert({
          where: { clerkId: id },
          update: {
            email,
            firstName: first_name || undefined,
            lastName: last_name || undefined,
            avatar: image_url || undefined,
            isEmailVerified:
              email_addresses?.[0]?.verification?.status === "verified",
          },
          create: {
            clerkId: id,
            email,
            firstName: first_name || "",
            lastName: last_name || "",
            avatar: image_url,
            isEmailVerified:
              email_addresses?.[0]?.verification?.status === "verified",
            lastLoginAt: new Date(),
          },
        });
        break;
      }

      case "user.deleted": {
        await db.user.deleteMany({
          where: { clerkId: id },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
