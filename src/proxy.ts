import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only the pages that need the session: the private area (refresh +
  // guard) and the auth pages (bounce signed-in users). Public pages, the
  // Stripe webhook and the API routes skip the proxy; route handlers read
  // and refresh the session themselves.
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
