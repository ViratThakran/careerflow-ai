"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, Loader2, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }

    setSubmitted(true)
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
        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto mb-4" />
            <h1 className="text-lg font-bold text-gray-900 mb-2">Check your inbox</h1>
            <p className="text-sm text-gray-500">
              We sent a confirmation link to <span className="text-gray-900">{email}</span>. Confirm it, then log in.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
            <p className="text-sm text-gray-500 mb-6">Start tailoring resumes with AI</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
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
                Sign up
              </Button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-[#111827] hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
