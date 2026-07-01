import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { searchAdzunaJobs } from "@/lib/jobs/adzuna"
import { computeKeywordScore } from "@/lib/jobs/keyword-score"
import { JobPreferences } from "@/lib/jobs/types"
import { Resume } from "@/lib/resume-types"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { resumeId, country } = body as { resumeId?: string; country?: string }

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

  let resumeQuery = supabase
    .from("resumes")
    .select("*")
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(1)

  if (resumeId) resumeQuery = supabase.from("resumes").select("*").eq("id", resumeId)

  const { data: resumeRows, error: resumeError } = await resumeQuery
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
        {
          user_id: user.id,
          resume_id: resumeRow.id,
          job_listing_id: listingRow.id,
          keyword_score: keywordScore,
        },
        { onConflict: "resume_id,job_listing_id" }
      )
      .select()
      .single()

    if (matchError || !matchRow) continue

    matches.push({ ...matchRow, listing: listingRow })
  }

  matches.sort((a, b) => b.keyword_score - a.keyword_score)

  return NextResponse.json({ matches })
}
