import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/outreach/resend"

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: outreach, error } = await supabase
    .from("outreach_emails")
    .select("*, hr_contacts(email)")
    .eq("id", id)
    .single()

  if (error || !outreach) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 })
  }

  if (outreach.status === "sent") {
    return NextResponse.json({ error: "Already sent" }, { status: 400 })
  }

  try {
    await sendEmail({
      to: outreach.hr_contacts.email,
      subject: outreach.subject,
      html: outreach.body.replace(/\n/g, "<br/>"),
    })

    const { error: updateError } = await supabase
      .from("outreach_emails")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed"
    await supabase.from("outreach_emails").update({ status: "failed" }).eq("id", id)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
