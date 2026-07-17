"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkEnabled = clerkKey && clerkKey !== "pk_test_your_publishable_key";

  if (!isClerkEnabled) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">
            Sign in to your DriveRent account
          </p>
        </div>
        <div className="border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Authentication is being configured. Please set up your Clerk keys in <code>.env.local</code>.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-1">
          Sign in to your DriveRent account
        </p>
      </div>

      <div className="flex justify-center">
        <SignIn
          routing="path"
          path="/sign-in"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none border rounded-lg",
            },
          }}
        />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
