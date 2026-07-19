"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { isLoaded: clerkLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!clerkLoaded) throw new Error("Auth is loading, please try again.");

      console.log("[SignIn] Creating sign-in for:", email.trim());

      const result = await signIn.create({
        identifier: email.trim(),
        strategy: "email_code",
      });

      console.log("[SignIn] signIn.create response:", JSON.stringify({
        status: result.status,
        supportedFirstFactors: result.supportedFirstFactors,
      }, null, 2));

      console.log("[SignIn] Verification code sent to:", email.trim());
      setStep("otp");
    } catch (err: unknown) {
      console.error("[SignIn] handleSendCode error:", err);
      const message = err instanceof Error ? err.message : "Failed to send code. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!clerkLoaded) throw new Error("Auth is loading, please try again.");

      console.log("[SignIn] Attempting verification...");

      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code.trim(),
      });

      console.log("[SignIn] attemptFirstFactor response:", JSON.stringify({
        status: result.status,
        createdSessionId: result.createdSessionId,
      }, null, 2));

      if (result.status === "complete") {
        if (result.createdSessionId) {
          console.log("[SignIn] Verification complete! Activating session:", result.createdSessionId);
          await setActive({ session: result.createdSessionId });
          console.log("[SignIn] Session activated. Redirecting to /dashboard");
          router.replace("/dashboard");
        } else {
          console.error("[SignIn] Status is complete but createdSessionId is missing");
          setError("Sign-in completed but session could not be established. Please try again.");
        }
      } else {
        console.warn("[SignIn] Verification returned non-complete status:", result.status);
        setError(`Sign-in incomplete (status: ${result.status}). Check browser console for details.`);
      }
    } catch (err: unknown) {
      console.error("[SignIn] Verification error:", err);
      const message = err instanceof Error ? err.message : "Invalid code. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Enter Verification Code</h1>
          <p className="text-muted-foreground mt-1">
            We sent a code to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter code from email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
            ) : (
              "Verify & Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <button
            onClick={() => { setStep("email"); setCode(""); setError(""); }}
            className="text-primary hover:underline font-medium"
          >
            Use a different email
          </button>
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

      <form onSubmit={handleSendCode} className="space-y-4">
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
            autoFocus
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending code...</>
          ) : (
            "Send Verification Code"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
