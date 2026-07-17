"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-1">
          Follow the link in your email to reset your password.
        </p>
      </div>

      <div className="border rounded-lg p-6 text-center">
        <p className="text-muted-foreground text-sm">
          If you requested a password reset, check your email for a reset link.
          The link will open a form where you can set your new password.
        </p>
      </div>

      <Link
        href="/sign-in"
        className="inline-flex items-center justify-center w-full rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        Back to Sign In
      </Link>
    </div>
  );
}
