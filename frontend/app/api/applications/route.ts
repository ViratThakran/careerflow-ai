import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: applications, error } = await supabase
    .from("applications")
    .select("*, job_listings(*)")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ applications })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { jobListingId, resumeId, tailoredResumeId } = body as {
    jobListingId?: string
    resumeId?: string
    tailoredResumeId?: string
  }

  if (!jobListingId || !resumeId) {
    return NextResponse.json({ error: "jobListingId and resumeId are required" }, { status: 400 })
  }

  const { data: application, error } = await supabase
    .from("applications")
    .upsert(
      {
        user_id: user.id,
        job_listing_id: jobListingId,
        resume_id: resumeId,
        tailored_resume_id: tailoredResumeId ?? null,
      },
      { onConflict: "user_id,job_listing_id" }
    )
    .select("*, job_listings(*)")
    .single()

  if (error || !application) {
    return NextResponse.json({ error: error?.message ?? "Failed to create application" }, { status: 500 })
  }

  return NextResponse.json({ application })
}
