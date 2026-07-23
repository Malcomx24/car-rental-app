"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function SignUpPage() {
  const router = useRouter();
  const locale = useLocale();
  const { isLoaded: clerkLoaded, signUp, setActive } = useSignUp();
  const t = useTranslations("auth");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <h1 className="text-2xl font-bold">{t("createAccount")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("signUpDescription")}
          </p>
        </div>
        <div className="border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            {t("authConfiguring")}
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            {t("signIn")}
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

      console.log("[SignUp] Starting sign-up for:", email.trim());

      const createResult = await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
        password: password,
      });

      console.log("[SignUp] signUp.create response:", JSON.stringify({
        status: createResult.status,
        missingFields: createResult.missingFields,
        unverifiedFields: createResult.unverifiedFields,
        createdSessionId: createResult.createdSessionId,
        createdUserId: createResult.createdUserId,
      }, null, 2));

      if (createResult.status === "complete") {
        console.log("[SignUp] Sign-up already complete. Session:", createResult.createdSessionId);
        await setActive({ session: createResult.createdSessionId });
        router.replace("/dashboard");
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      console.log("[SignUp] Verification code sent to:", email.trim());
      setStep("otp");
    } catch (err: unknown) {
      console.error("[SignUp] handleSendCode error:", err);
      const message = err instanceof Error ? err.message : t("createAccountFailed");
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

      console.log("[SignUp] Attempting email verification...");

      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      console.log("[SignUp] attemptEmailAddressVerification response:", JSON.stringify({
        status: result.status,
        createdSessionId: result.createdSessionId,
        createdUserId: result.createdUserId,
        missingFields: result.missingFields,
        unverifiedFields: result.unverifiedFields,
      }, null, 2));

      if (result.status === "complete") {
        if (result.createdSessionId) {
          console.log("[SignUp] Verification complete! Activating session:", result.createdSessionId);
          await setActive({ session: result.createdSessionId });
          console.log("[SignUp] Session activated. Redirecting to /dashboard");
          router.replace("/dashboard");
        } else {
          console.error("[SignUp] Status is complete but createdSessionId is missing");
          setError(t("accountCreatedSessionError"));
        }
      } else {
        console.warn("[SignUp] Verification returned non-complete status:", result.status);
        console.warn("[SignUp] Missing fields:", result.missingFields);
        console.warn("[SignUp] Unverified fields:", result.unverifiedFields);
        setError(t("verificationIncomplete", { status: String(result.status) }));
      }
    } catch (err: unknown) {
      console.error("[SignUp] Verification error:", err);
      const message = err instanceof Error ? err.message : t("invalidCode");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("verifyYourEmail")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("sentCodeTo")} <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="code">{t("verificationCode")}</Label>
            <Input
              id="code"
              type="text"
              placeholder={t("enterCodeFromEmail")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("verifying")}</>
            ) : (
              t("verifyAndCreateAccount")
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <button
            onClick={() => { setStep("details"); setCode(""); setError(""); }}
            className="text-primary hover:underline font-medium"
          >
            {t("useDifferentEmail")}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("createAccount")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("signUpDescription")}
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
            <Label htmlFor="firstName">{t("firstName")}</Label>
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
            <Label htmlFor="lastName">{t("lastName")}</Label>
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
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("createPassword")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("signingUp")}</>
          ) : (
            t("signUp")
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/sign-in" className="text-primary hover:underline font-medium">
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
