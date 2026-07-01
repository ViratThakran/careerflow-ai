"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

// Lightweight client-side auth check for marketing pages that need to swap
// "Sign In / Start Free" CTAs for "Dashboard" once a session exists, without
// pulling those pages behind middleware (they're meant to stay public).
export function useAuthUser() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  return isLoggedIn
}
