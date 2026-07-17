import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

export interface AuthUser {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar: string | null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return null;

  return {
    id: user.id,
    clerkId: user.clerkId!,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    avatar: user.avatar,
  };
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return ["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role);
}

export async function isEmployee(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return ["ADMIN", "SUPER_ADMIN", "MANAGER", "EMPLOYEE"].includes(user.role);
}

export async function syncUserToDatabase() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) return null;

  const existingUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existingUser) {
    return db.user.update({
      where: { clerkId: clerkUser.id },
      data: {
        email,
        firstName: clerkUser.firstName || existingUser.firstName,
        lastName: clerkUser.lastName || existingUser.lastName,
        avatar: clerkUser.imageUrl || existingUser.avatar,
        isEmailVerified: clerkUser.emailAddresses?.[0]?.verification?.status === "verified",
        lastLoginAt: new Date(),
      },
    });
  }

  return db.user.create({
    data: {
      clerkId: clerkUser.id,
      email,
      firstName: clerkUser.firstName || "User",
      lastName: clerkUser.lastName || "",
      avatar: clerkUser.imageUrl,
      isEmailVerified: clerkUser.emailAddresses?.[0]?.verification?.status === "verified",
      lastLoginAt: new Date(),
    },
  });
}
