"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Copy,
  FileText,
  Loader2,
  Mail,
  Plus,
  Sparkles,
  Target,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ResumeRow {
  id: string
  title: string
  status: "uploading" | "parsing" | "ready" | "error"
  error_message: string | null
}

interface ApplicationRow {
  id: string
  status: "draft" | "applied" | "interviewing" | "offer" | "rejected"
  job_listings: { title: string; company: string | null; location: string | null }
}

interface AnalyticsData {
  resumeCount: number
  applicationCount: number
  matchCount: number
  tailoredResumeCount: number
  coverLetterCount: number
  outreachCount: number
}

const STATUS_META: Record<ResumeRow["status"], { label: string; icon: typeof CheckCircle2; className: string }> = {
  uploading: { label: "Uploading", icon: Loader2, className: "text-gray-500" },
  parsing: { label: "Parsing", icon: Loader2, className: "text-[#0EA5E9]" },
  ready: { label: "Ready", icon: CheckCircle2, className: "text-[#10B981]" },
  error: { label: "Error", icon: AlertCircle, className: "text-red-500" },
}

const APP_STATUS_VARIANT: Record<ApplicationRow["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  applied: "default",
  interviewing: "outline",
  offer: "default",
  rejected: "destructive",
}

function StatCard({ icon: Icon, label, value, color, index }: { icon: typeof FileText; label: string; value: number; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(14,165,233,0.15)] transition-shadow rounded-[20px] p-6"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </motion.div>
  )
}

export function WorkspaceSection() {
  const router = useRouter()
  const [resumes, setResumes] = useState<ResumeRow[]>([])
  const [applications, setApplications] = useState<ApplicationRow[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const [resumesRes, appsRes, analyticsRes] = await Promise.all([
      fetch("/api/resumes").then((r) => r.json()),
      fetch("/api/applications").then((r) => r.json()),
      fetch("/api/analytics").then((r) => r.json()),
    ])
    setResumes(resumesRes.resumes ?? [])
    setApplications((appsRes.applications ?? []).slice(0, 5))
    setAnalytics(analyticsRes)
    setLoading(false)
  }

  async function handleDuplicate(resumeId: string) {
    setDuplicatingId(resumeId)
    try {
      const res = await fetch(`/api/resumes/${resumeId}/duplicate`, { method: "POST" })
      if (res.ok) await loadAll()
    } finally {
      setDuplicatingId(null)
    }
  }

  return (
    <section id="my-workspace" className="py-24 md:py-32 bg-[#F3F4F6] scroll-mt-20">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#111827] mb-4 block">
            YOUR WORKSPACE
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything in One Place
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Your resumes, applications, and quick actions — right here on the same page.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#0EA5E9] animate-spin" />
          </div>
        ) : (
          <div className="max-w-[1200px] mx-auto space-y-16">
            {/* Quick stats */}
            {analytics && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard index={0} icon={FileText} label="Resumes" value={analytics.resumeCount} color="#0EA5E9" />
                <StatCard index={1} icon={Briefcase} label="Applications" value={analytics.applicationCount} color="#8B5CF6" />
                <StatCard index={2} icon={Target} label="Matches" value={analytics.matchCount} color="#10B981" />
                <StatCard index={3} icon={Sparkles} label="Tailored" value={analytics.tailoredResumeCount} color="#EC4899" />
                <StatCard index={4} icon={FileText} label="Cover Letters" value={analytics.coverLetterCount} color="#D4AF37" />
                <StatCard index={5} icon={Mail} label="Outreach" value={analytics.outreachCount} color="#0EA5E9" />
              </div>
            )}

            {/* Resumes */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-5">Your Resumes</h3>
              {resumes.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-[var(--border-subtle)] rounded-[20px] p-12 text-center">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No resumes yet — upload one to get started.</p>
                  <Button onClick={() => router.push("/resume/upload")}>
                    <Upload />
                    Upload resume
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {resumes.map((resume, index) => {
                    const meta = STATUS_META[resume.status]
                    const Icon = meta.icon
                    const isReady = resume.status === "ready"
                    return (
                      <motion.div
                        key={resume.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="bg-white border border-[var(--border-subtle)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(14,165,233,0.15)] rounded-2xl p-5 flex items-center justify-between hover:border-[rgba(14,165,233,0.3)] transition-all"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{resume.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Icon
                              className={`w-3.5 h-3.5 ${meta.className} ${
                                resume.status !== "ready" && resume.status !== "error" ? "animate-spin" : ""
                              }`}
                            />
                            <span className="text-xs text-gray-500">{meta.label}</span>
                            {resume.error_message && <span className="text-xs text-red-500">— {resume.error_message}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {isReady && (
                            <Badge variant="outline" className="cursor-pointer" onClick={() => router.push(`/resume/tailor?resumeId=${resume.id}`)}>
                              Tailor
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!isReady || duplicatingId === resume.id}
                            onClick={() => handleDuplicate(resume.id)}
                          >
                            {duplicatingId === resume.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
                            Duplicate
                          </Button>
                          <Button variant="outline" size="sm" disabled={!isReady} onClick={() => router.push(`/resume/build?id=${resume.id}`)}>
                            Open
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Recent applications */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
                {applications.length > 0 && (
                  <button onClick={() => router.push("/applications")} className="text-sm text-[#0EA5E9] hover:underline">
                    View all
                  </button>
                )}
              </div>

              {applications.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-[var(--border-subtle)] rounded-[20px] p-12 text-center">
                  <p className="text-gray-500 mb-4">No applications yet.</p>
                  <Button variant="outline" onClick={() => router.push("/jobs")}>
                    <Briefcase />
                    Find jobs to apply to
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {applications.map((app, index) => (
                    <motion.button
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => router.push(`/applications/${app.id}`)}
                      className="bg-white border border-[var(--border-subtle)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(139,92,246,0.15)] rounded-2xl p-5 flex items-center justify-between text-left hover:border-[rgba(139,92,246,0.3)] transition-all"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{app.job_listings.title}</p>
                        <p className="text-sm text-gray-500">
                          {app.job_listings.company} {app.job_listings.location ? `· ${app.job_listings.location}` : ""}
                        </p>
                      </div>
                      <Badge variant={APP_STATUS_VARIANT[app.status]}>{app.status}</Badge>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
