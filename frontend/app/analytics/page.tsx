"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Briefcase, FileText, Loader2, Mail, Sparkles, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

interface AnalyticsData {
  resumeCount: number
  applicationCount: number
  applicationsByStatus: Record<string, number>
  matchCount: number
  tailoredResumeCount: number
  coverLetterCount: number
  outreachCount: number
  outreachByStatus: Record<string, number>
}

const STATUS_ORDER = ["draft", "applied", "interviewing", "offer", "rejected"]

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  index,
}: {
  icon: typeof FileText
  label: string
  value: number
  color: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-5 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
  )
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardShell title="Analytics" subtitle="Your real activity across the platform">
      <div>
        {loading || !data ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#111827] animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard index={0} icon={FileText} label="Resumes" value={data.resumeCount} color="#0EA5E9" />
              <StatCard index={1} icon={Briefcase} label="Applications" value={data.applicationCount} color="#8B5CF6" />
              <StatCard index={2} icon={Target} label="Job Matches Found" value={data.matchCount} color="#10B981" />
              <StatCard index={3} icon={Sparkles} label="AI-Tailored Resumes" value={data.tailoredResumeCount} color="#EC4899" />
              <StatCard index={4} icon={FileText} label="Cover Letters" value={data.coverLetterCount} color="#D4AF37" />
              <StatCard index={5} icon={Mail} label="Outreach Emails" value={data.outreachCount} color="#0EA5E9" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Applications by Status</h2>
                {data.applicationCount === 0 ? (
                  <p className="text-sm text-gray-500">
                    No applications yet —{" "}
                    <button onClick={() => router.push("/jobs")} className="text-[#111827] hover:underline">
                      find jobs to apply to
                    </button>
                    .
                  </p>
                ) : (
                  <div className="space-y-2">
                    {STATUS_ORDER.filter((s) => data.applicationsByStatus[s]).map((status) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 capitalize">{status}</span>
                        <Badge variant="outline">{data.applicationsByStatus[status]}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Outreach Emails</h2>
                {data.outreachCount === 0 ? (
                  <p className="text-sm text-gray-500">No outreach emails drafted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(data.outreachByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 capitalize">{status}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  )
}
