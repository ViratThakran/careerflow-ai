import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

// Read-only, aggregate-only by design: counts across all users, never individual users'
// resume/application/email content. Restricted to ADMIN_EMAIL — same check as
// middleware.ts, repeated here in case this route is ever called directly.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const admin = createAdminClient()
  const usersResult = await admin.auth.admin.listUsers({ perPage: 1 })
  const totalUsers = "total" in usersResult.data ? usersResult.data.total : null

  const [
    resumes,
    applications,
    jobMatches,
    tailoredResumes,
    coverLetters,
    outreachEmails,
    jobListings,
    hrContacts,
  ] = await Promise.all([
    admin.from("resumes").select("status", { count: "exact" }),
    admin.from("applications").select("status", { count: "exact" }),
    admin.from("job_matches").select("id", { count: "exact", head: true }),
    admin.from("tailored_resumes").select("id", { count: "exact", head: true }),
    admin.from("cover_letters").select("id", { count: "exact", head: true }),
    admin.from("outreach_emails").select("status", { count: "exact" }),
    admin.from("job_listings").select("id", { count: "exact", head: true }),
    admin.from("hr_contacts").select("id", { count: "exact", head: true }),
  ])

  const resumesByStatus: Record<string, number> = {}
  for (const row of resumes.data ?? []) resumesByStatus[row.status] = (resumesByStatus[row.status] ?? 0) + 1

  const applicationsByStatus: Record<string, number> = {}
  for (const row of applications.data ?? []) applicationsByStatus[row.status] = (applicationsByStatus[row.status] ?? 0) + 1

  const outreachByStatus: Record<string, number> = {}
  for (const row of outreachEmails.data ?? []) outreachByStatus[row.status] = (outreachByStatus[row.status] ?? 0) + 1

  return NextResponse.json({
    totalUsers,
    resumeCount: resumes.count ?? 0,
    resumesByStatus,
    applicationCount: applications.count ?? 0,
    applicationsByStatus,
    jobMatchCount: jobMatches.count ?? 0,
    tailoredResumeCount: tailoredResumes.count ?? 0,
    coverLetterCount: coverLetters.count ?? 0,
    outreachCount: outreachEmails.count ?? 0,
    outreachByStatus,
    jobListingCount: jobListings.count ?? 0,
    hrContactCount: hrContacts.count ?? 0,
  })
}
