import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { findHrContacts, guessCompanyDomain } from "@/lib/outreach/hunter"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { jobListingId, domainOverride } = body as { jobListingId?: string; domainOverride?: string }
  if (!jobListingId) {
    return NextResponse.json({ error: "jobListingId is required" }, { status: 400 })
  }

  const { data: listing, error: listingError } = await supabase
    .from("job_listings")
    .select("*")
    .eq("id", jobListingId)
    .single()

  if (listingError || !listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 })
  }

  const domain = domainOverride?.trim() || guessCompanyDomain(listing.company || listing.title)

  try {
    const contacts = await findHrContacts(domain)

    const admin = createAdminClient()
    const rows = contacts.map((c) => ({
      job_listing_id: jobListingId,
      email: c.email,
      name: c.name,
      title: c.title,
      confidence: c.confidence,
    }))

    let savedContacts = []
    if (rows.length > 0) {
      const { data, error: upsertError } = await admin
        .from("hr_contacts")
        .upsert(rows, { onConflict: "job_listing_id,email" })
        .select()

      if (upsertError) {
        return NextResponse.json({ error: upsertError.message }, { status: 500 })
      }
      savedContacts = data ?? []
    }

    return NextResponse.json({ domain, contacts: savedContacts })
  } catch (err) {
    const message = err instanceof Error ? err.message : "HR contact lookup failed"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
