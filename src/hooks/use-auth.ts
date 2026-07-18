"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@clerk/nextjs";
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
  const { session, isLoaded: sessionLoaded } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const isSignedIn = !!session;

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data?.user ?? null);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    } finally {
      setProfileLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!sessionLoaded) return;

    if (session) {
      fetchProfile();
    } else {
      setProfile(null);
      setProfileLoaded(true);
    }
  }, [sessionLoaded, session, fetchProfile]);

  return {
    isLoaded: sessionLoaded && profileLoaded,
    isSignedIn,
    profile,
    isLoading: !sessionLoaded || !profileLoaded,
    role: profile?.role,
  };
}
