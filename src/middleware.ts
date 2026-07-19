import createMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);

const publicRoutes = [
  "/",
  "/cars",
  "/cars/(.*)",
  "/about",
  "/contact",
  "/locations",
  "/blog",
  "/privacy",
  "/terms",
  "/api/cars",
  "/api/cars/(.*)",
  "/api/cars/filters",
  "/api/locations",
  "/api/webhooks/(.*)",
];

const authRoutes = [
  "/sign-in",
  "/sign-in/(.*)",
  "/sign-up",
  "/sign-up/(.*)",
  "/forgot-password",
  "/forgot-password/(.*)",
  "/reset-password",
  "/reset-password/(.*)",
  "/sso-callback",
  "/sso-callback/(.*)",
];

const isPublicRoute = createRouteMatcher(publicRoutes);
const isAuthRoute = createRouteMatcher(authRoutes);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isPublicRoute(req)) {
    return handleI18nRouting(req);
  }

  if (isAuthRoute(req)) {
    if (userId) {
      const locale = req.nextUrl.pathname.split("/")[1] || "fr";
      return Response.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
    return handleI18nRouting(req);
  }

  if (!userId) {
    const locale = req.nextUrl.pathname.split("/")[1] || "fr";
    const signInUrl = new URL(`/${locale}/sign-in`, req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return Response.redirect(signInUrl);
  }

  return handleI18nRouting(req);
});

export const config = {
  matcher: [
    "/((?!_next|api|.*\\..*).*)",
  ],
};
