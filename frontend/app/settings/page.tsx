"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function SettingsPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
  }, [])

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMessage(null)
    setSavingPassword(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setPasswordMessage({ type: "success", text: "Password updated." })
      setNewPassword("")
    } catch (err) {
      setPasswordMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update password" })
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch("/api/account", { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete account")

      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Something went wrong")
      setDeleting(false)
    }
  }

  return (
    <DashboardShell title="Settings">
      <div className="max-w-xl space-y-6">
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={email ?? ""} disabled />
          </div>
        </div>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            {passwordMessage && (
              <p className={`text-sm ${passwordMessage.type === "success" ? "text-[#10B981]" : "text-destructive"}`}>
                {passwordMessage.text}
              </p>
            )}

            <Button type="submit" disabled={savingPassword}>
              {savingPassword && <Loader2 className="animate-spin" />}
              Update password
            </Button>
          </form>
        </div>

        <div className="bg-[var(--bg-elevated)] border border-destructive/30 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Delete Account
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Permanently deletes your account and all data — resumes, applications, job matches, and outreach
            history. This cannot be undone.
          </p>

          {deleteError && <p className="text-sm text-destructive mb-3">{deleteError}</p>}

          {!confirmDelete ? (
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
              Delete my account
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                {deleting && <Loader2 className="animate-spin" />}
                Yes, permanently delete
              </Button>
              <Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
