"use client";

import { ClerkProvider as NextClerkProvider } from "@clerk/nextjs";
import { type ReactNode } from "react";

interface ClerkProviderProps {
  children: ReactNode;
}

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function ClerkProvider({ children }: ClerkProviderProps) {
  if (!clerkPubKey || clerkPubKey === "pk_test_your_publishable_key") {
    return <>{children}</>;
  }

  return (
    <NextClerkProvider
      publishableKey={clerkPubKey}
      afterSignOutUrl="/"
      afterSignInUrl="/fr/dashboard"
      afterSignUpUrl="/fr/dashboard"
    >
      {children}
    </NextClerkProvider>
  );
}
