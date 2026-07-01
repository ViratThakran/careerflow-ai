import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  return NextResponse.json({ application })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { status, method, notes } = body as { status?: string; method?: string; notes?: string }

  const update: Record<string, unknown> = {}
  if (status) {
    update.status = status
    if (status === "applied") update.applied_at = new Date().toISOString()
  }
  if (method) update.method = method
  if (notes !== undefined) update.notes = notes

  const { data: application, error } = await supabase
    .from("applications")
    .update(update)
    .eq("id", id)
    .select("*, job_listings(*)")
    .single()

  if (error || !application) {
    return NextResponse.json({ error: error?.message ?? "Failed to update application" }, { status: 500 })
  }

  return NextResponse.json({ application })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase.from("applications").delete().eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
