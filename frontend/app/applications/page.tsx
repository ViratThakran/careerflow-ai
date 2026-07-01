"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

interface ApplicationRow {
  id: string
  status: "draft" | "applied" | "interviewing" | "offer" | "rejected"
  method: "ats_auto" | "manual" | null
  applied_at: string | null
  job_listings: {
    title: string
    company: string | null
    location: string | null
    url: string
  }
}

const STATUS_VARIANT: Record<ApplicationRow["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  applied: "default",
  interviewing: "outline",
  offer: "default",
  rejected: "destructive",
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<ApplicationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setApplications(data.applications ?? []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter)
  const statusCounts = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <DashboardShell title="Application Tracker" subtitle={`${applications.length} total`}>
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "draft", "applied", "interviewing", "offer", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              filter === status
                ? "border-[#111827] text-[#111827] bg-[rgba(17,24,39,0.1)]"
                : "border-[var(--border-subtle)] text-gray-500 hover:text-gray-900"
            }`}
          >
            {status === "all" ? "All" : status[0].toUpperCase() + status.slice(1)}
            {status !== "all" && statusCounts[status] ? ` (${statusCounts[status]})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#111827] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[var(--bg-elevated)] border border-dashed border-[var(--border-subtle)] rounded-2xl p-12 text-center">
          <p className="text-gray-500 mb-4">No applications yet.</p>
          <button onClick={() => router.push("/jobs")} className="text-[#111827] hover:underline text-sm">
            Find jobs to apply to
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((app) => (
            <button
              key={app.id}
              onClick={() => router.push(`/applications/${app.id}`)}
              className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-xl p-4 flex items-center justify-between text-left hover:border-[rgba(17,24,39,0.3)] transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{app.job_listings.title}</p>
                <p className="text-sm text-gray-500">
                  {app.job_listings.company} {app.job_listings.location ? `· ${app.job_listings.location}` : ""}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[app.status]}>{app.status}</Badge>
            </button>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
