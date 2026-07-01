import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { searchAdzunaJobs } from "@/lib/jobs/adzuna"
import { computeKeywordScore } from "@/lib/jobs/keyword-score"
import { JobPreferences } from "@/lib/jobs/types"
import { Resume } from "@/lib/resume-types"
import { tailorResume } from "@/lib/ai/tailor-resume"
import { buildResumeFromAIContent } from "@/lib/ai/build-resume"

// Auto-apply, scoped to what's actually safe: no platform offers a real public API for
// *submitting* an application (see lib/ats/detect.ts), so this never clicks submit on
// anything. What it does instead is the autonomous part that doesn't carry ToS/ban risk —
// search, score, and pre-tailor a resume for every strong match — so a draft application
// is already sitting in /applications, tailored and ready, by the time a human looks at it.
const AUTO_DRAFT_THRESHOLD = 65

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { country } = body as { country?: string }

  const { data: prefsRow } = await supabase
    .from("job_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!prefsRow) {
    return NextResponse.json({ error: "Set your job preferences first" }, { status: 400 })
  }

  const preferences: JobPreferences = {
    targetRoles: prefsRow.target_roles ?? [],
    locations: prefsRow.locations ?? [],
    remoteOnly: prefsRow.remote_only ?? false,
    minSalary: prefsRow.min_salary ?? null,
    employmentType: prefsRow.employment_type ?? null,
  }

  const { data: resumeRows, error: resumeError } = await supabase
    .from("resumes")
    .select("*")
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(1)

  const resumeRow = resumeRows?.[0]
  if (resumeError || !resumeRow || !resumeRow.parsed_json) {
    return NextResponse.json({ error: "No parsed resume found — upload one first" }, { status: 400 })
  }

  const resume = resumeRow.parsed_json as Resume

  let listings
  try {
    listings = await searchAdzunaJobs(preferences, { country })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Job search failed"
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const admin = createAdminClient()
  const matches = []
  const newApplications: { applicationId: string; title: string; company: string | null; matchScore: number }[] = []

  for (const listing of listings) {
    const { data: listingRow, error: upsertError } = await admin
      .from("job_listings")
      .upsert(
        {
          source: listing.source,
          external_id: listing.externalId,
          title: listing.title,
          company: listing.company,
          location: listing.location,
          url: listing.url,
          description: listing.description,
          salary_min: listing.salaryMin,
          salary_max: listing.salaryMax,
          posted_at: listing.postedAt,
        },
        { onConflict: "source,external_id" }
      )
      .select()
      .single()

    if (upsertError || !listingRow) continue

    const keywordScore = computeKeywordScore(resume, { ...listing, id: listingRow.id })

    const { data: matchRow, error: matchError } = await supabase
      .from("job_matches")
      .upsert(
        { user_id: user.id, resume_id: resumeRow.id, job_listing_id: listingRow.id, keyword_score: keywordScore },
        { onConflict: "resume_id,job_listing_id" }
      )
      .select()
      .single()

    if (matchError || !matchRow) continue

    matches.push({ ...matchRow, listing: listingRow })

    if (keywordScore < AUTO_DRAFT_THRESHOLD) continue

    // Already has a draft/application for this listing — don't duplicate or re-tailor.
    const { data: existingApp } = await supabase
      .from("applications")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_listing_id", listingRow.id)
      .maybeSingle()
    if (existingApp) continue

    try {
      const tailorResult = await tailorResume(resume, listingRow.description ?? listingRow.title)
      const tailoredResume = buildResumeFromAIContent(tailorResult.resume, {
        id: resumeRow.id,
        name: `${resumeRow.title} (auto-tailored)`,
      })

      const { data: jobDescRow } = await supabase
        .from("job_descriptions")
        .insert({
          user_id: user.id,
          title: listingRow.title,
          company: listingRow.company,
          raw_text: listingRow.description ?? listingRow.title,
        })
        .select()
        .single()

      let tailoredResumeId: string | null = null
      if (jobDescRow) {
        const { data: tailoredRow } = await supabase
          .from("tailored_resumes")
          .insert({
            resume_id: resumeRow.id,
            job_description_id: jobDescRow.id,
            tailored_json: tailoredResume,
            match_score: tailorResult.matchScore,
            rationale: tailorResult.rationale,
          })
          .select()
          .single()
        tailoredResumeId = tailoredRow?.id ?? null
      }

      const { data: appRow } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          job_listing_id: listingRow.id,
          resume_id: resumeRow.id,
          tailored_resume_id: tailoredResumeId,
          status: "draft",
          notes: "Auto-prepared by the autonomous scan — review and submit manually.",
        })
        .select()
        .single()

      if (appRow) {
        newApplications.push({
          applicationId: appRow.id,
          title: listingRow.title,
          company: listingRow.company,
          matchScore: tailorResult.matchScore,
        })
      }
    } catch {
      // AI tailoring failed for this one listing (e.g. rate limit) — the match itself
      // was still recorded above; just skip auto-drafting and move to the next listing.
      continue
    }
  }

  matches.sort((a, b) => b.keyword_score - a.keyword_score)

  return NextResponse.json({ matches, newApplications })
}
