"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkEnabled = clerkKey && clerkKey !== "pk_test_your_publishable_key";

  if (!isClerkEnabled) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-1">
            Join DriveRent and start driving your dream car
          </p>
        </div>
        <div className="border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Authentication is being configured. Please set up your Clerk keys in <code>.env.local</code>.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground mt-1">
          Join DriveRent and start driving your dream car
        </p>
      </div>

      <div className="flex justify-center">
        <SignUp
          routing="path"
          path="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none border rounded-lg",
            },
          }}
        />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
