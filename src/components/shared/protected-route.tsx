"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRoles,
  fallback,
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      fallback ?? (
        <div className="flex flex-col gap-4 p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-64 w-full" />
        </div>
      )
    );
  }

  if (!isSignedIn) {
    return null;
  }

  if (requiredRoles) {
    if (!role) {
      return (
        <div className="flex flex-col gap-4 p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }

    if (!requiredRoles.includes(role)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <p className="text-6xl font-bold text-muted-foreground">403</p>
          <h1 className="text-2xl font-bold mt-4">Access Denied</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
