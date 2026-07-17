"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded: clerkLoaded, signIn } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!clerkLoaded) {
        throw new Error("Authentication is loading, please try again.");
      }

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });

      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="text-muted-foreground mt-1">
            If an account exists with {email}, you&apos;ll receive a password reset
            link shortly.
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground mt-1">
          Enter your email to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending reset link..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/sign-in"
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
