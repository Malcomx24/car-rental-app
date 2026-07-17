"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function UserSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Attempt to sync user profile on mount
    // This triggers the server to create/update the user in Prisma
    fetch("/api/user/profile")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.user) {
          queryClient.setQueryData(["user-profile"], data);
        }
      })
      .catch(() => {
        // Silently fail
      });
  }, [queryClient]);

  return null;
}
