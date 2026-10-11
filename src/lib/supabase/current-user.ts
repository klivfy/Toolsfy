import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * The signed-in user for the current request. Wrapped in React's cache()
 * so the dashboard layout and the page share a single Auth round trip.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
