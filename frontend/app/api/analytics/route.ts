import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// All counts are scoped to the current user via RLS — every table here has an
// "owner" policy keyed on auth.uid(), so these queries can't leak another user's data.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [resumes, applications, matches, tailoredResumes, coverLetters, outreachEmails] = await Promise.all([
    supabase.from("resumes").select("id", { count: "exact", head: true }),
    supabase.from("applications").select("status", { count: "exact" }),
    supabase.from("job_matches").select("id", { count: "exact", head: true }),
    supabase.from("tailored_resumes").select("id", { count: "exact", head: true }),
    supabase.from("cover_letters").select("id", { count: "exact", head: true }),
    supabase.from("outreach_emails").select("status", { count: "exact" }),
  ])

  const applicationsByStatus: Record<string, number> = {}
  for (const row of applications.data ?? []) {
    applicationsByStatus[row.status] = (applicationsByStatus[row.status] ?? 0) + 1
  }

  const outreachByStatus: Record<string, number> = {}
  for (const row of outreachEmails.data ?? []) {
    outreachByStatus[row.status] = (outreachByStatus[row.status] ?? 0) + 1
  }

  return NextResponse.json({
    resumeCount: resumes.count ?? 0,
    applicationCount: applications.count ?? 0,
    applicationsByStatus,
    matchCount: matches.count ?? 0,
    tailoredResumeCount: tailoredResumes.count ?? 0,
    coverLetterCount: coverLetters.count ?? 0,
    outreachCount: outreachEmails.count ?? 0,
    outreachByStatus,
  })
}
