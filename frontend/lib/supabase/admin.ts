import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Service-role client for trusted server-side operations (file parsing, AI calls)
// that need to read/write rows on behalf of a user without going through RLS twice.
// Never import this into client components.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )
}
