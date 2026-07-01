import { Resume } from "@/lib/resume-types"
import { generateText, extractJson } from "./gemini"
import { coverLetterResultSchema, CoverLetterResult } from "./resume-schema"

const SYSTEM_PROMPT = `You write a professional cover letter for a job application. 3-4 short paragraphs: an opening hook naming the role and company, 1-2 paragraphs connecting the candidate's real experience (from their resume) to the job's actual requirements, and a closing paragraph expressing interest and inviting next steps. Never invent employers, titles, or skills the candidate doesn't have — only use what's in their resume. Plain text, no markdown, no placeholder brackets like "[Company Name]" — use the real values given. Respond with ONLY a single JSON object: { "content": "" }.`

export async function generateCoverLetter(
  resume: Resume,
  jobTitle: string,
  company: string,
  jobDescription: string
): Promise<CoverLetterResult> {
  const prompt = `JOB TITLE: ${jobTitle || "the role"}\nCOMPANY: ${company || "the company"}\nJOB DESCRIPTION:\n${jobDescription.slice(0, 8_000)}\n\nCANDIDATE RESUME:\nName: ${resume.personalInfo.firstName} ${resume.personalInfo.lastName}\nTitle: ${resume.personalInfo.title}\nSummary: ${resume.summary}\nSkills: ${resume.skills.map((s) => s.name).join(", ")}\nExperience: ${resume.experience
    .map((e) => `${e.role} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.achievements.join("; ")}`)
    .join("\n")}\nEducation: ${resume.education.map((e) => `${e.degree} from ${e.institution}`).join(", ")}`

  const text = await generateText({ system: SYSTEM_PROMPT, prompt, maxTokens: 1500 })
  const json = extractJson(text)
  return coverLetterResultSchema.parse(json)
}
