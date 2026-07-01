import { Resume } from "@/lib/resume-types"
import { JobListing } from "@/lib/jobs/types"
import { generateText, extractJson } from "./gemini"
import { jobMatchResultSchema, JobMatchResult } from "./resume-schema"

const SYSTEM_PROMPT = `You score how well a candidate's resume matches a specific job listing. Consider required skills, experience level, and role alignment — not just keyword overlap. Respond with ONLY a single JSON object: { "score": 0-100, "rationale": "2-3 sentence explanation" }.`

export async function matchJobToResume(resume: Resume, listing: JobListing): Promise<JobMatchResult> {
  const prompt = `JOB LISTING:\nTitle: ${listing.title}\nCompany: ${listing.company ?? "Unknown"}\nDescription: ${(listing.description ?? "").slice(0, 8_000)}\n\nCANDIDATE RESUME SUMMARY:\nTitle: ${resume.personalInfo.title}\nSummary: ${resume.summary}\nSkills: ${resume.skills.map((s) => s.name).join(", ")}\nExperience: ${resume.experience
    .map((e) => `${e.role} at ${e.company} (${e.technologies.join(", ")})`)
    .join("; ")}`

  const text = await generateText({ system: SYSTEM_PROMPT, prompt, maxTokens: 512 })
  const json = extractJson(text)
  return jobMatchResultSchema.parse(json)
}
