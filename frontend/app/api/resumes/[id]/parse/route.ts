import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { parseResumeText } from "@/lib/ai/parse-resume"
import { buildResumeFromAIContent } from "@/lib/ai/build-resume"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: resume, error: fetchError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError || !resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 })
  }

  if (!resume.raw_text?.trim()) {
    return NextResponse.json({ error: "No extracted text to parse" }, { status: 400 })
  }

  try {
    const content = await parseResumeText(resume.raw_text)
    const parsedResume = buildResumeFromAIContent(content, { id: resume.id, name: resume.title })

    const { error: updateError } = await supabase
      .from("resumes")
      .update({ parsed_json: parsedResume, status: "ready", error_message: null })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ resume: parsedResume })
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI parsing failed"
    await supabase.from("resumes").update({ status: "error", error_message: message }).eq("id", id)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
