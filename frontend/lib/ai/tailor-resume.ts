import { Resume } from "@/lib/resume-types"
import { generateText, extractJson } from "./gemini"
import { tailorResultSchema, TailorResult } from "./resume-schema"

const SYSTEM_PROMPT = `You tailor a candidate's resume to a specific job description. Rewrite the professional summary and reorder/rephrase experience bullet points and skills to emphasize relevance to the job — but never invent employers, titles, dates, or skills the candidate doesn't have. You may rephrase, reprioritize, and tighten wording; you may not fabricate experience.

Also compute a matchScore (0-100) for how well the ORIGINAL resume matches the job description, and a short rationale (2-3 sentences) explaining the score and what was changed.

Respond with ONLY a single JSON object of this shape:
{
  "resume": { "personalInfo": {...}, "summary": "", "experience": [...], "education": [...], "skills": [...], "projects": [...], "certifications": [...], "languages": [...], "awards": [...], "publications": [...] },
  "matchScore": 0,
  "rationale": ""
}
The "resume" object must follow the same field shape as the input resume.`

export async function tailorResume(resume: Resume, jobDescription: string): Promise<TailorResult> {
  const prompt = `JOB DESCRIPTION:\n${jobDescription.slice(0, 20_000)}\n\nCANDIDATE RESUME (JSON):\n${JSON.stringify(
    {
      personalInfo: resume.personalInfo,
      summary: resume.summary,
      experience: resume.experience,
      education: resume.education,
      skills: resume.skills,
      projects: resume.projects,
      certifications: resume.certifications,
      languages: resume.languages,
      awards: resume.awards,
      publications: resume.publications,
    },
    null,
    2
  )}`

  const text = await generateText({ system: SYSTEM_PROMPT, prompt })
  const json = extractJson(text)
  return tailorResultSchema.parse(json)
}
