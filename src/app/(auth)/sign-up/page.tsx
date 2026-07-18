"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { isLoaded: clerkLoaded, signUp, setActive } = useSignUp();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"details" | "otp">("details");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!clerkLoaded) throw new Error("Auth is loading, please try again.");

      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("otp");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account. Please try again.";
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

      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/dashboard");
      } else {
        setError("Unexpected result. Please try again.");
      }
    } catch (err: unknown) {
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
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
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
              "Verify & Create Account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <button
            onClick={() => { setStep("details"); setCode(""); setError(""); }}
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
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground mt-1">
          Join DriveRent and start driving your dream car
        </p>
      </div>

      <form onSubmit={handleSendCode} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

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
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending code...</>
          ) : (
            "Send Verification Code"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
