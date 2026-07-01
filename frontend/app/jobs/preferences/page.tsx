"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function JobPreferencesPage() {
  const router = useRouter()
  const [targetRoles, setTargetRoles] = useState("")
  const [locations, setLocations] = useState("")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [minSalary, setMinSalary] = useState("")
  const [employmentType, setEmploymentType] = useState("full_time")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/job-preferences")
      .then((res) => res.json())
      .then((data) => {
        const p = data.preferences
        if (p) {
          setTargetRoles((p.target_roles ?? []).join(", "))
          setLocations((p.locations ?? []).join(", "))
          setRemoteOnly(p.remote_only ?? false)
          setMinSalary(p.min_salary ? String(p.min_salary) : "")
          setEmploymentType(p.employment_type ?? "full_time")
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const res = await fetch("/api/job-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRoles: targetRoles.split(",").map((s) => s.trim()).filter(Boolean),
          locations: locations.split(",").map((s) => s.trim()).filter(Boolean),
          remoteOnly,
          minSalary: minSalary ? Number(minSalary) : null,
          employmentType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save preferences")
      router.push("/jobs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardShell title="Job Preferences">
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#111827] animate-spin" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Job Preferences" subtitle="Tell us what you're looking for and we'll find matching jobs">
      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="targetRoles">Target roles (comma-separated)</Label>
            <Input
              id="targetRoles"
              value={targetRoles}
              onChange={(e) => setTargetRoles(e.target.value)}
              placeholder="Data Analyst, Business Analyst, BI Analyst"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="locations">Locations (comma-separated)</Label>
            <Input
              id="locations"
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              placeholder="Bangalore, Delhi, Remote"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="minSalary">Minimum salary (optional)</Label>
              <Input
                id="minSalary"
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="600000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employmentType">Employment type</Label>
              <select
                id="employmentType"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm text-gray-900"
              >
                <option value="full_time" className="bg-[var(--bg-elevated)]">Full-time</option>
                <option value="part_time" className="bg-[var(--bg-elevated)]">Part-time</option>
                <option value="contract" className="bg-[var(--bg-elevated)]">Contract</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remoteOnly" checked={remoteOnly} onCheckedChange={(checked) => setRemoteOnly(checked === true)} />
            <Label htmlFor="remoteOnly">Remote only</Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={saving} className="w-full">
            {saving && <Loader2 className="animate-spin" />}
            Save & Find Jobs
          </Button>
        </form>
      </div>
    </DashboardShell>
  )
}
