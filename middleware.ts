export { auth as middleware } from "@/auth";

export const config = {
  // Only run middleware on pages, not API routes or static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
