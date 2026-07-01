import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { detectAtsFromUrl } from "@/lib/ats/detect"

// No ATS (Greenhouse/Lever included) has a stable, documented public API for
// *submitting* an application — only for reading postings. Auto-submitting against an
// undocumented embed-form endpoint would be exactly the kind of fragile, ToS-grey
// automation already ruled out for LinkedIn/Naukri/Indeed. So every listing gets the
// same manual-apply + one-click "mark as applied" flow; this route just tells the UI
// which ATS (if any) is hosting the listing so it can show a cleaner "open application"
// link and let the user confirm once they've submitted by hand.
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: application, error } = await supabase
    .from("applications")
    .select("*, job_listings(*)")
    .eq("id", id)
    .single()

  if (error || !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  const ats = detectAtsFromUrl(application.job_listings.url)

  return NextResponse.json({
    requiresManual: true,
    ats,
    listingUrl: application.job_listings.url,
  })
}
