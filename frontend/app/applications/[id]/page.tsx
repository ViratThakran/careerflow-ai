"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ExternalLink, Loader2, Mail, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

interface ApplicationDetail {
  id: string
  status: string
  job_listings: {
    id: string
    title: string
    company: string | null
    location: string | null
    url: string
    description: string | null
  }
}

interface HrContact {
  id: string
  email: string
  name: string | null
  title: string | null
  confidence: number | null
}

interface OutreachDraft {
  id: string
  subject: string
  body: string
  status: string
}

const STATUSES = ["draft", "applied", "interviewing", "offer", "rejected"]

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>()
  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [applyInfo, setApplyInfo] = useState<{ ats: string | null; listingUrl: string } | null>(null)
  const [domainOverride, setDomainOverride] = useState("")
  const [contacts, setContacts] = useState<HrContact[]>([])
  const [findingContacts, setFindingContacts] = useState(false)
  const [draft, setDraft] = useState<OutreachDraft | null>(null)
  const [drafting, setDrafting] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/applications/${params.id}`)
      .then((res) => res.json())
      .then((data) => setApplication(data.application))
      .finally(() => setLoading(false))
  }, [params.id])

  async function updateStatus(status: string) {
    const res = await fetch(`/api/applications/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, method: status === "applied" ? "manual" : undefined }),
    })
    const data = await res.json()
    if (res.ok) setApplication(data.application)
  }

  async function handleApply() {
    setError(null)
    const res = await fetch(`/api/applications/${params.id}/apply`, { method: "POST" })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      return
    }
    setApplyInfo(data)
  }

  async function findContacts() {
    if (!application) return
    setFindingContacts(true)
    setError(null)
    try {
      const res = await fetch("/api/hr-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobListingId: application.job_listings.id, domainOverride: domainOverride || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Lookup failed")
      setContacts(data.contacts ?? [])
      if ((data.contacts ?? []).length === 0) setError("No contacts found for that domain — try entering it manually above.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setFindingContacts(false)
    }
  }

  async function draftOutreach(hrContactId: string) {
    setDrafting(hrContactId)
    setError(null)
    try {
      const res = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: params.id, hrContactId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Drafting failed")
      setDraft(data.outreach)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setDrafting(null)
    }
  }

  async function sendDraft() {
    if (!draft) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch(`/api/outreach/${draft.id}/send`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Send failed")
      setDraft({ ...draft, status: "sent" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <DashboardShell title="Application">
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#111827] animate-spin" />
        </div>
      </DashboardShell>
    )
  }

  if (!application) {
    return (
      <DashboardShell title="Application">
        <p className="text-destructive">Application not found</p>
      </DashboardShell>
    )
  }

  const listing = application.job_listings

  return (
    <DashboardShell title={listing.title} subtitle={listing.company ?? undefined}>
      <div className="max-w-2xl space-y-6">
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{listing.title}</h2>
              <p className="text-gray-500">
                {listing.company} {listing.location ? `· ${listing.location}` : ""}
              </p>
            </div>
            <Badge>{application.status}</Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  application.status === s
                    ? "border-[#111827] text-[#111827] bg-[rgba(17,24,39,0.1)]"
                    : "border-[var(--border-subtle)] text-gray-500 hover:text-gray-900"
                }`}
              >
                Mark {s}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          {!applyInfo ? (
            <Button onClick={handleApply}>
              <ExternalLink className="w-4 h-4" />
              Apply
            </Button>
          ) : (
            <div className="bg-[rgba(17,24,39,0.05)] border border-[rgba(17,24,39,0.2)] rounded-xl p-4">
              <p className="text-sm text-gray-900 mb-3">
                {applyInfo.ats
                  ? `This listing is hosted on ${applyInfo.ats}. Open it, submit your application, then mark it applied below.`
                  : "Open the listing and submit your application there, then mark it applied below."}
              </p>
              <Button variant="outline" asChild>
                <a href={applyInfo.listingUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Open listing
                </a>
              </Button>
            </div>
          )}
        </div>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Find HR Contact</h2>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Override company domain (optional, e.g. acme.com)"
              value={domainOverride}
              onChange={(e) => setDomainOverride(e.target.value)}
            />
            <Button onClick={findContacts} disabled={findingContacts}>
              {findingContacts ? <Loader2 className="animate-spin" /> : <Mail />}
              Find
            </Button>
          </div>

          {contacts.length > 0 && (
            <div className="space-y-2">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 border border-[var(--border-subtle)] rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">{c.name || c.email}</p>
                    <p className="text-xs text-gray-500">
                      {c.title || "Unknown title"} · {c.email}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => draftOutreach(c.id)} disabled={drafting === c.id}>
                    {drafting === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Draft email
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {draft && (
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] transition-shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Outreach Draft</h2>
            <p className="text-sm text-gray-500 mb-1">Subject</p>
            <p className="text-sm text-gray-900 mb-4">{draft.subject}</p>
            <p className="text-sm text-gray-500 mb-1">Body</p>
            <p className="text-sm text-gray-900 whitespace-pre-wrap mb-4">{draft.body}</p>

            {draft.status === "sent" ? (
              <Badge variant="default">Sent</Badge>
            ) : (
              <Button onClick={sendDraft} disabled={sending}>
                {sending ? <Loader2 className="animate-spin" /> : <Send />}
                Send email
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
