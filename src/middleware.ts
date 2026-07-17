import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
  "/api/webhooks/(.*)",
];

const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

const isPublicRoute = createRouteMatcher(publicRoutes);
const isAuthRoute = createRouteMatcher(authRoutes);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isPublicRoute(req)) {
    return;
  }

  if (isAuthRoute(req)) {
    if (userId) {
      return Response.redirect(new URL("/dashboard", req.url));
    }
    return;
  }

  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
