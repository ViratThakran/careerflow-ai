import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateCoverLetter } from "@/lib/ai/draft-cover-letter"
import { Resume } from "@/lib/resume-types"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: coverLetters, error } = await supabase
    .from("cover_letters")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ coverLetters })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { resumeId, jobTitle, company, jobDescription } = body as {
    resumeId?: string
    jobTitle?: string
    company?: string
    jobDescription?: string
  }

  if (!resumeId || !jobDescription?.trim()) {
    return NextResponse.json({ error: "resumeId and jobDescription are required" }, { status: 400 })
  }

  const { data: resumeRow, error: resumeError } = await supabase
    .from("resumes")
    .select("parsed_json")
    .eq("id", resumeId)
    .single()

  if (resumeError || !resumeRow || !resumeRow.parsed_json) {
    return NextResponse.json({ error: "Resume not found or not yet parsed" }, { status: 404 })
  }

  try {
    const result = await generateCoverLetter(resumeRow.parsed_json as Resume, jobTitle ?? "", company ?? "", jobDescription)

    const { data: coverLetter, error: insertError } = await supabase
      .from("cover_letters")
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        job_title: jobTitle ?? null,
        company: company ?? null,
        job_description: jobDescription,
        content: result.content,
      })
      .select()
      .single()

    if (insertError || !coverLetter) {
      return NextResponse.json({ error: insertError?.message ?? "Failed to save cover letter" }, { status: 500 })
    }

    return NextResponse.json({ coverLetter })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cover letter generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
