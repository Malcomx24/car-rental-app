"use client";

import { useAuth } from "./use-auth";
import type { UserRole } from "@prisma/client";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  CUSTOMER: 0,
  EMPLOYEE: 1,
  MANAGER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

export function useRole() {
  const { role, isLoading } = useAuth();

  function hasRole(requiredRole: UserRole): boolean {
    if (!role) return false;
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole];
  }

  function hasAnyRole(roles: UserRole[]): boolean {
    if (!role) return false;
    return roles.some((r) => hasRole(r));
  }

  function isAdmin() {
    return hasRole("ADMIN");
  }

  function isManager() {
    return hasRole("MANAGER");
  }

  function isEmployee() {
    return hasRole("EMPLOYEE");
  }

  function isCustomer() {
    return role === "CUSTOMER";
  }

  return {
    role,
    isLoading,
    hasRole,
    hasAnyRole,
    isAdmin,
    isManager,
    isEmployee,
    isCustomer,
  };
}
