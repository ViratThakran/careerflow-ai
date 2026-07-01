"use client"

import { useEffect, useState } from "react"
import { Briefcase, FileText, Loader2, Mail, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

interface AdminStats {
  totalUsers: number | null
  resumeCount: number
  resumesByStatus: Record<string, number>
  applicationCount: number
  applicationsByStatus: Record<string, number>
  jobMatchCount: number
  tailoredResumeCount: number
  coverLetterCount: number
  outreachCount: number
  outreachByStatus: Record<string, number>
  jobListingCount: number
  hrContactCount: number
}

function StatCard({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: number | null }) {
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#111827]" />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value ?? "—"}</p>
    </div>
  )
}

function BreakdownCard({ title, breakdown }: { title: string; breakdown: Record<string, number> }) {
  const entries = Object.entries(breakdown)
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">{title}</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No data yet.</p>
      ) : (
        <div className="space-y-2">
          {entries.map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-sm text-gray-500 capitalize">{status}</span>
              <Badge variant="outline">{count}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load admin stats")
        setStats(data)
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardShell title="Admin" subtitle="Platform-wide aggregate stats — read-only, no individual user data">
      <div>
        {error && (
          <div className="bg-[var(--bg-elevated)] border border-destructive/30 rounded-xl p-4 mb-6 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#111827] animate-spin" />
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} />
              <StatCard icon={FileText} label="Resumes" value={stats.resumeCount} />
              <StatCard icon={Briefcase} label="Applications" value={stats.applicationCount} />
              <StatCard icon={Mail} label="Outreach Sent" value={stats.outreachCount} />
              <StatCard icon={FileText} label="Job Listings Cached" value={stats.jobListingCount} />
              <StatCard icon={Users} label="HR Contacts Found" value={stats.hrContactCount} />
              <StatCard icon={FileText} label="Cover Letters" value={stats.coverLetterCount} />
              <StatCard icon={FileText} label="AI-Tailored Resumes" value={stats.tailoredResumeCount} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <BreakdownCard title="Resumes by Status" breakdown={stats.resumesByStatus} />
              <BreakdownCard title="Applications by Status" breakdown={stats.applicationsByStatus} />
              <BreakdownCard title="Outreach by Status" breakdown={stats.outreachByStatus} />
            </div>
          </>
        ) : null}
      </div>
    </DashboardShell>
  )
}
