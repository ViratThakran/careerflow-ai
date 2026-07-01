import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { chatAboutResume, ChatMessage } from "@/lib/ai/chat-resume"
import { Resume } from "@/lib/resume-types"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { resumeId, history } = body as { resumeId?: string; history?: ChatMessage[] }

  if (!resumeId || !history?.length) {
    return NextResponse.json({ error: "resumeId and history are required" }, { status: 400 })
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
    const reply = await chatAboutResume(resumeRow.parsed_json as Resume, history)
    return NextResponse.json({ reply })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Chat failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
