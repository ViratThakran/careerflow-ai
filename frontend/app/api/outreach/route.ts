import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { draftOutreachEmail } from "@/lib/ai/draft-outreach"
import { Resume } from "@/lib/resume-types"
import { JobListing } from "@/lib/jobs/types"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { applicationId, hrContactId } = body as { applicationId?: string; hrContactId?: string }
  if (!applicationId || !hrContactId) {
    return NextResponse.json({ error: "applicationId and hrContactId are required" }, { status: 400 })
  }

  const { data: application, error: appError } = await supabase
    .from("applications")
    .select("*, job_listings(*), resumes(parsed_json), tailored_resumes(tailored_json)")
    .eq("id", applicationId)
    .single()

  if (appError || !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  const { data: hrContact, error: contactError } = await supabase
    .from("hr_contacts")
    .select("*")
    .eq("id", hrContactId)
    .single()

  if (contactError || !hrContact) {
    return NextResponse.json({ error: "HR contact not found" }, { status: 404 })
  }

  const resume = (application.tailored_resumes?.tailored_json ?? application.resumes?.parsed_json) as
    | Resume
    | undefined
  const listingRow = application.job_listings

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
    const draft = await draftOutreachEmail(resume, listing, hrContact.name)

    const { data: outreach, error: insertError } = await supabase
      .from("outreach_emails")
      .insert({
        user_id: user.id,
        application_id: applicationId,
        hr_contact_id: hrContactId,
        subject: draft.subject,
        body: draft.body,
        status: "draft",
      })
      .select()
      .single()

    if (insertError || !outreach) {
      return NextResponse.json({ error: insertError?.message ?? "Failed to save draft" }, { status: 500 })
    }

    return NextResponse.json({ outreach })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Drafting failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
