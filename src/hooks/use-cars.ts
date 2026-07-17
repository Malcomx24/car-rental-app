"use client";

import { useState, useCallback } from "react";
import type { Car, PaginatedResponse, ApiResponse } from "@/types";

interface UseCarsOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function useCars(options: UseCarsOptions = {}) {
  const { initialPage = 1, initialLimit = 12 } = options;
  const [cars, setCars] = useState<Car[]>([]);
  const [pagination, setPagination] = useState({ page: initialPage, limit: initialLimit, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async (params: Record<string, string | number | boolean | undefined> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== "" && val !== null) {
          searchParams.set(key, String(val));
        }
      });

      const res = await fetch(`/api/cars?${searchParams.toString()}`);
      const json: ApiResponse<Car[]> & { pagination?: typeof pagination } = await res.json();

      if (json.success && json.data) {
        setCars(json.data);
        if (json.pagination) setPagination(json.pagination);
      } else {
        setError(json.error || "Failed to fetch cars");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { cars, pagination, loading, error, fetchCars };
}

export function useCar(id: string | null) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCar = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cars/${id}`);
      const json: ApiResponse<Car> = await res.json();
      if (json.success && json.data) {
        setCar(json.data as Car);
      } else {
        setError(json.error || "Failed to fetch car");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { car, loading, error, fetchCar };
}
