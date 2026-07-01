"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Copy, FileText, Loader2, Rocket, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Resume } from "@/lib/resume-types"

interface ResumeOption {
  id: string
  title: string
  status: string
}

interface TailorResult {
  resume: Resume
  matchScore: number
  rationale: string
}

export default function TailorPage() {
  return (
    <Suspense>
      <TailorForm />
    </Suspense>
  )
}

function TailorForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [resumes, setResumes] = useState<ResumeOption[]>([])
  const [resumeId, setResumeId] = useState(searchParams.get("resumeId") || "")
  const [jobTitle, setJobTitle] = useState(searchParams.get("jobTitle") || "")
  const [company, setCompany] = useState(searchParams.get("company") || "")
  const [jobDescription, setJobDescription] = useState(searchParams.get("jobDescription") || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TailorResult | null>(null)
  const [generatingLetter, setGeneratingLetter] = useState(false)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [letterError, setLetterError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => res.json())
      .then((data) => {
        if (data.resumes) {
          const ready = data.resumes.filter((r: ResumeOption) => r.status === "ready")
          setResumes(ready)
          if (!resumeId && ready.length > 0) setResumeId(ready[0].id)
        }
      })
  }, [resumeId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobTitle, company, jobDescription }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Tailoring failed")
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateCoverLetter() {
    setLetterError(null)
    setGeneratingLetter(true)
    setCoverLetter(null)
    try {
      const res = await fetch("/api/cover-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobTitle, company, jobDescription }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Cover letter generation failed")
      setCoverLetter(data.coverLetter.content)
    } catch (err) {
      setLetterError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setGeneratingLetter(false)
    }
  }

  async function copyCoverLetter() {
    if (!coverLetter) return
    await navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111827]">
            <Rocket className="h-4.5 w-4.5 text-white rotate-45" />
          </div>
          <span className="text-lg font-bold tracking-[-0.02em] text-gray-900">ApplyPilot</span>
        </Link>
        <Link href="/resume" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          My Resumes
        </Link>
      </header>

      <main className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Tailor Your Resume</h1>
            <p className="text-gray-500 text-lg">Paste a job description and let AI rewrite your resume to match it</p>
          </div>

          {resumes.length === 0 ? (
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-8 text-center">
              <p className="text-gray-500 mb-4">You need a parsed resume before you can tailor it.</p>
              <Button onClick={() => router.push("/resume/upload")}>Upload a resume</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="resumeId">Resume</Label>
                <select
                  id="resumeId"
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm text-gray-900"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[var(--bg-elevated)]">
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="jobTitle">Job title (optional)</Label>
                  <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Data Analyst" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="jobDescription">Job description</Label>
                <Textarea
                  id="jobDescription"
                  required
                  rows={10}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  {loading ? "Tailoring..." : "Tailor My Resume"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={generatingLetter || !jobDescription.trim()}
                  onClick={handleGenerateCoverLetter}
                  className="flex-1"
                >
                  {generatingLetter ? <Loader2 className="animate-spin" /> : <FileText />}
                  {generatingLetter ? "Writing..." : "Generate Cover Letter"}
                </Button>
              </div>
            </form>
          )}

          {letterError && <p className="text-sm text-destructive mt-4">{letterError}</p>}

          {coverLetter && (
            <div className="mt-8 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Cover Letter</h3>
                <Button variant="outline" size="sm" onClick={copyCoverLetter}>
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{coverLetter}</p>
            </div>
          )}

          {result && (
            <div className="mt-8 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Match score</span>
                  <Badge variant={result.matchScore >= 70 ? "default" : "secondary"}>{result.matchScore}/100</Badge>
                </div>
                <Progress value={result.matchScore} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">What changed</h3>
                <p className="text-sm text-gray-500">{result.rationale}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Tailored summary</h3>
                <p className="text-sm text-gray-500">{result.resume.summary}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Experience</h3>
                <div className="space-y-3">
                  {result.resume.experience.map((exp) => (
                    <div key={exp.id} className="border border-[var(--border-subtle)] rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">
                        {exp.role} · {exp.company}
                      </p>
                      <ul className="mt-1 list-disc list-inside text-sm text-gray-500 space-y-0.5">
                        {exp.achievements.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.resume.skills.map((s) => (
                  <Badge key={s.id} variant="outline">
                    {s.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
