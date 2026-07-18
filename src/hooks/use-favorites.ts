"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useFavorites() {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites?limit=999")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((json) => {
        if (json?.success && json.data) {
          setFavoriteIds(new Set(json.data.map((fav: { id: string }) => fav.id)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = useCallback(
    async (carId: string) => {
      const isFavorited = favoriteIds.has(carId);

      // Optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFavorited) {
          next.delete(carId);
        } else {
          next.add(carId);
        }
        return next;
      });

      try {
        if (isFavorited) {
          const res = await fetch(`/api/favorites?carId=${carId}`, { method: "DELETE" });
          if (res.status === 401) {
            // Revert and redirect
            setFavoriteIds((prev) => {
              const next = new Set(prev);
              next.add(carId);
              return next;
            });
            router.push("/sign-in");
          }
        } else {
          const res = await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ carId }),
          });
          if (res.status === 401) {
            setFavoriteIds((prev) => {
              const next = new Set(prev);
              next.delete(carId);
              return next;
            });
            router.push("/sign-in");
          }
        }
      } catch {
        // Revert on network error
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (isFavorited) {
            next.add(carId);
          } else {
            next.delete(carId);
          }
          return next;
        });
      }
    },
    [favoriteIds, router]
  );

  return { favoriteIds, toggleFavorite, loading };
}
