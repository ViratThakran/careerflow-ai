import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { createClient } from "@/lib/supabase/server"
import { Resume } from "@/lib/resume-types"

// Lets a user branch a new version from an existing parsed resume — e.g. one tailored
// toward "Data Analyst" roles and a separate copy tailored toward "BI Analyst" roles —
// without re-uploading or re-parsing the original file.
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: original, error: fetchError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError || !original) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 })
  }

  if (!original.parsed_json) {
    return NextResponse.json({ error: "Only a fully parsed resume can be duplicated" }, { status: 400 })
  }

  const newId = randomUUID()
  const newTitle = `${original.title} (copy)`
  const parsedCopy: Resume = { ...original.parsed_json, id: newId, name: newTitle }

  const { data: copy, error: insertError } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: newTitle,
      raw_text: original.raw_text,
      file_url: original.file_url,
      parsed_json: parsedCopy,
      status: "ready",
    })
    .select()
    .single()

  if (insertError || !copy) {
    return NextResponse.json({ error: insertError?.message ?? "Failed to duplicate resume" }, { status: 500 })
  }

  return NextResponse.json({ resume: copy })
}
