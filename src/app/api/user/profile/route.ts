import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    let user = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return NextResponse.json({ user: null }, { status: 404 });
      }

      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      if (!email) {
        return NextResponse.json({ user: null }, { status: 404 });
      }

      const newUser = await db.user.upsert({
        where: { clerkId: userId },
        update: {
          email,
          firstName: clerkUser.firstName || undefined,
          lastName: clerkUser.lastName || undefined,
          avatar: clerkUser.imageUrl || undefined,
          isEmailVerified: clerkUser.emailAddresses?.[0]?.verification?.status === "verified",
          lastLoginAt: new Date(),
        },
        create: {
          clerkId: userId,
          email,
          firstName: clerkUser.firstName || "User",
          lastName: clerkUser.lastName || "",
          avatar: clerkUser.imageUrl,
          isEmailVerified: clerkUser.emailAddresses?.[0]?.verification?.status === "verified",
          lastLoginAt: new Date(),
        },
        select: {
          id: true,
          clerkId: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          avatar: true,
          isEmailVerified: true,
          createdAt: true,
        },
      });

      user = newUser;
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone } = body;

    const updated = await db.user.update({
      where: { clerkId: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, avatar } = body;

    const updated = await db.user.update({
      where: { clerkId: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
