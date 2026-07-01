import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { createClient } from "@/lib/supabase/server"
import { extractTextFromFile } from "@/lib/ai/extract-text"

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"]

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 })
  }

  const lowerName = file.name.toLowerCase()
  if (!ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
    return NextResponse.json({ error: "Only PDF, DOCX, and TXT files are supported" }, { status: 400 })
  }

  const storagePath = `${user.id}/${randomUUID()}-${file.name}`
  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(storagePath, file, { contentType: file.type || undefined })

  if (storageError) {
    return NextResponse.json({ error: `Upload failed: ${storageError.message}` }, { status: 500 })
  }

  let rawText: string
  try {
    rawText = await extractTextFromFile(file)
  } catch {
    rawText = ""
  }

  const { data: resume, error: insertError } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: file.name.replace(/\.[^/.]+$/, ""),
      raw_text: rawText,
      file_url: storagePath,
      status: rawText.trim() ? "parsing" : "error",
      error_message: rawText.trim() ? null : "Could not extract any text from this file",
    })
    .select()
    .single()

  if (insertError || !resume) {
    return NextResponse.json({ error: insertError?.message ?? "Failed to save resume" }, { status: 500 })
  }

  return NextResponse.json({ resumeId: resume.id, status: resume.status })
}
