"use client";

import { useState, useEffect } from "react";
import type { UserRole } from "@prisma/client";

interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar: string | null;
}

export function useAuth() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let active = true;
    const timeout = setTimeout(() => {
      if (active) {
        setIsLoaded(true);
        setIsSignedIn(false);
      }
    }, 10000);

    fetch("/api/user/profile")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (active) {
          clearTimeout(timeout);
          setIsLoaded(true);
          setIsSignedIn(!!data?.user);
          setProfile(data?.user ?? null);
        }
      })
      .catch(() => {
        if (active) {
          clearTimeout(timeout);
          setIsLoaded(true);
          setIsSignedIn(false);
        }
      });

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, []);

  return {
    isLoaded,
    isSignedIn,
    profile,
    isLoading: !isLoaded,
    role: profile?.role,
  };
}
