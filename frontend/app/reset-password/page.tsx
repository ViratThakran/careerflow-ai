"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Clicking the email link puts Supabase into a "password recovery" session via the
    // URL hash, handled automatically by supabase-js — we just wait for that session to
    // be ready before letting the user submit a new password.
    const supabase = createClient()
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true)
    })
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
    return () => subscription.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setDone(true)
    setTimeout(() => router.push("/login"), 1500)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6]">
          <Rocket className="h-4.5 w-4.5 text-white rotate-45" />
        </div>
        <span className="text-lg font-bold tracking-[-0.02em] text-gray-900">Apply<span className="gradient-text">Pilot</span></span>
      </Link>

      <div className="w-full max-w-sm bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-8">
        {done ? (
          <p className="text-sm text-[#10B981] text-center py-4">Password updated — redirecting to login...</p>
        ) : !ready ? (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-6 h-6 text-[#111827] animate-spin mb-3" />
            <p className="text-sm text-gray-500">Verifying your reset link...</p>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Set a new password</h1>
            <p className="text-sm text-gray-500 mb-6">Choose a new password for your account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="animate-spin" />}
                Update password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
