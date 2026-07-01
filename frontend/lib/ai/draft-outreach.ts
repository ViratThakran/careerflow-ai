import { Resume } from "@/lib/resume-types"
import { JobListing } from "@/lib/jobs/types"
import { generateText, extractJson } from "./gemini"
import { outreachDraftSchema, OutreachDraft } from "./resume-schema"

const SYSTEM_PROMPT = `You draft a short, professional cold-outreach email from a job candidate to a recruiter/HR contact. Keep it under 150 words: a one-line intro, why this specific role/company interests them, 1-2 concrete strengths that map to the job, and a polite close asking to connect. No generic filler, no overclaiming. Respond with ONLY a single JSON object: { "subject": "", "body": "" }. The body should be plain text (no markdown), with the candidate's name as the signature.`

export async function draftOutreachEmail(
  resume: Resume,
  listing: JobListing,
  contactName: string | null
): Promise<OutreachDraft> {
  const prompt = `RECRUITER NAME: ${contactName ?? "Hiring Team"}\n\nJOB: ${listing.title} at ${listing.company ?? "the company"}\nJOB DESCRIPTION EXCERPT: ${(listing.description ?? "").slice(0, 2000)}\n\nCANDIDATE:\nName: ${resume.personalInfo.firstName} ${resume.personalInfo.lastName}\nTitle: ${resume.personalInfo.title}\nSummary: ${resume.summary}\nKey skills: ${resume.skills.map((s) => s.name).join(", ")}\nMost recent role: ${resume.experience[0] ? `${resume.experience[0].role} at ${resume.experience[0].company}` : "N/A"}`

  const text = await generateText({ system: SYSTEM_PROMPT, prompt, maxTokens: 1024 })
  const json = extractJson(text)
  return outreachDraftSchema.parse(json)
}
