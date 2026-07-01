"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, ExternalLink, Loader2, MapPin, Sliders, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

interface JobListingRow {
  id: string
  title: string
  company: string | null
  location: string | null
  url: string
  description: string | null
  salary_min: number | null
  salary_max: number | null
}

interface JobMatchRow {
  id: string
  resume_id: string
  keyword_score: number
  ai_score: number | null
  ai_rationale: string | null
  listing: JobListingRow
}

export default function JobsPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<JobMatchRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matchingId, setMatchingId] = useState<string | null>(null)
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [autoScanning, setAutoScanning] = useState(false)
  const [autoScanResult, setAutoScanResult] = useState<{
    title: string
    company: string | null
    matchScore: number
    applicationId: string
  }[] | null>(null)

  useEffect(() => {
    runSearch()
  }, [])

  async function runSearch() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/jobs/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Search failed")
      setMatches(data.matches ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function runAutoScan() {
    setAutoScanning(true)
    setError(null)
    setAutoScanResult(null)
    try {
      const res = await fetch("/api/jobs/auto-scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Autonomous scan failed")
      setMatches(data.matches ?? [])
      setAutoScanResult(data.newApplications ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setAutoScanning(false)
    }
  }

  async function getAiMatch(matchId: string) {
    setMatchingId(matchId)
    try {
      const res = await fetch(`/api/jobs/${matchId}/match`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "AI match failed")
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, ai_score: data.aiScore, ai_rationale: data.aiRationale } : m))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setMatchingId(null)
    }
  }

  function tailorForJob(match: JobMatchRow) {
    const params = new URLSearchParams({
      resumeId: match.resume_id,
      jobTitle: match.listing.title,
      company: match.listing.company ?? "",
      jobDescription: match.listing.description ?? "",
    })
    router.push(`/resume/tailor?${params.toString()}`)
  }

  async function applyToJob(match: JobMatchRow) {
    setApplyingId(match.id)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobListingId: match.listing.id, resumeId: match.resume_id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create application")
      router.push(`/applications/${data.application.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <DashboardShell
      title="Matching Jobs"
      actions={
        <>
          <Button variant="outline" onClick={() => router.push("/jobs/preferences")}>
            <Sliders />
            Preferences
          </Button>
          <Button variant="outline" onClick={runSearch} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Refresh
          </Button>
        </>
      }
    >
      <div>
        <div className="bg-gradient-to-r from-[rgba(17,24,39,0.08)] to-[rgba(139,92,246,0.08)] border border-[rgba(17,24,39,0.2)] rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#111827]" />
              Autonomous Scan
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Searches jobs, scores every match, and auto-tailors + drafts an application for anything that scores
              high — ready to review in Applications. Never auto-submits anything.
            </p>
          </div>
          <Button onClick={runAutoScan} disabled={autoScanning} className="shrink-0">
            {autoScanning ? <Loader2 className="animate-spin" /> : <Zap />}
            {autoScanning ? "Scanning..." : "Run Autonomous Scan"}
          </Button>
        </div>

        {autoScanResult && (
          <div className="bg-[var(--bg-elevated)] border border-[rgba(16,185,129,0.3)] rounded-xl p-4 mb-6">
            {autoScanResult.length === 0 ? (
              <p className="text-sm text-gray-500">Scan complete — no matches scored high enough to auto-draft this time.</p>
            ) : (
              <>
                <p className="text-sm font-medium text-[#10B981] mb-2">
                  Auto-prepared {autoScanResult.length} tailored application{autoScanResult.length > 1 ? "s" : ""}:
                </p>
                <div className="space-y-1.5">
                  {autoScanResult.map((a) => (
                    <button
                      key={a.applicationId}
                      onClick={() => router.push(`/applications/${a.applicationId}`)}
                      className="flex items-center justify-between w-full text-left text-sm text-gray-900 hover:text-[#111827] transition-colors"
                    >
                      <span>
                        {a.title} {a.company ? `· ${a.company}` : ""}
                      </span>
                      <Badge variant="outline">{a.matchScore}/100</Badge>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="bg-[var(--bg-elevated)] border border-destructive/30 rounded-xl p-4 mb-6 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#111827] animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-[var(--bg-elevated)] border border-dashed border-[var(--border-subtle)] rounded-2xl p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-500 mb-6">Set your preferences and we&apos;ll search for matching jobs.</p>
            <Button onClick={() => router.push("/jobs/preferences")}>
              <Sliders />
              Set preferences
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{match.listing.title}</p>
                    <p className="text-sm text-gray-500">{match.listing.company}</p>
                    {match.listing.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {match.listing.location}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant={match.keyword_score >= 50 ? "default" : "secondary"}>{match.keyword_score}% keyword match</Badge>
                    {match.ai_score !== null && <Badge variant="outline">{match.ai_score}/100 AI score</Badge>}
                  </div>
                </div>

                {match.ai_rationale && <p className="text-sm text-gray-500 mt-3">{match.ai_rationale}</p>}

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={match.listing.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" />
                      View listing
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => getAiMatch(match.id)} disabled={matchingId === match.id}>
                    {matchingId === match.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Get AI match score
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => tailorForJob(match)}>
                    Tailor my resume
                  </Button>
                  <Button size="sm" onClick={() => applyToJob(match)} disabled={applyingId === match.id}>
                    {applyingId === match.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Briefcase className="w-3.5 h-3.5" />}
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
