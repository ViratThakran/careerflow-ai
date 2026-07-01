import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { matchJobToResume } from "@/lib/ai/match-job"
import { Resume } from "@/lib/resume-types"
import { JobListing } from "@/lib/jobs/types"

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: match, error: matchError } = await supabase
    .from("job_matches")
    .select("*, resumes(parsed_json), job_listings(*)")
    .eq("id", id)
    .single()

  if (matchError || !match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 })
  }

  const resume = match.resumes?.parsed_json as Resume | undefined
  const listingRow = match.job_listings
  if (!resume || !listingRow) {
    return NextResponse.json({ error: "Resume or listing data missing" }, { status: 400 })
  }

  const listing: JobListing = {
    id: listingRow.id,
    source: listingRow.source,
    externalId: listingRow.external_id,
    title: listingRow.title,
    company: listingRow.company,
    location: listingRow.location,
    url: listingRow.url,
    description: listingRow.description,
    salaryMin: listingRow.salary_min,
    salaryMax: listingRow.salary_max,
    postedAt: listingRow.posted_at,
  }

  try {
    const result = await matchJobToResume(resume, listing)

    const { error: updateError } = await supabase
      .from("job_matches")
      .update({ ai_score: result.score, ai_rationale: result.rationale })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ aiScore: result.score, aiRationale: result.rationale })
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI matching failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
