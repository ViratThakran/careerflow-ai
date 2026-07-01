import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { tailorResume } from "@/lib/ai/tailor-resume"
import { buildResumeFromAIContent } from "@/lib/ai/build-resume"

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
    .select("*")
    .eq("id", resumeId)
    .single()

  if (resumeError || !resumeRow || !resumeRow.parsed_json) {
    return NextResponse.json({ error: "Resume not found or not yet parsed" }, { status: 404 })
  }

  const { data: jobRow, error: jobError } = await supabase
    .from("job_descriptions")
    .insert({ user_id: user.id, title: jobTitle ?? null, company: company ?? null, raw_text: jobDescription })
    .select()
    .single()

  if (jobError || !jobRow) {
    return NextResponse.json({ error: jobError?.message ?? "Failed to save job description" }, { status: 500 })
  }

  try {
    const result = await tailorResume(resumeRow.parsed_json, jobDescription)
    const tailoredResume = buildResumeFromAIContent(result.resume, {
      id: resumeRow.id,
      name: `${resumeRow.title} (tailored)`,
    })

    const { data: tailoredRow, error: tailoredError } = await supabase
      .from("tailored_resumes")
      .insert({
        resume_id: resumeRow.id,
        job_description_id: jobRow.id,
        tailored_json: tailoredResume,
        match_score: result.matchScore,
        rationale: result.rationale,
      })
      .select()
      .single()

    if (tailoredError || !tailoredRow) {
      return NextResponse.json({ error: tailoredError?.message ?? "Failed to save tailored resume" }, { status: 500 })
    }

    return NextResponse.json({
      tailoredResumeId: tailoredRow.id,
      resume: tailoredResume,
      matchScore: result.matchScore,
      rationale: result.rationale,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI tailoring failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
