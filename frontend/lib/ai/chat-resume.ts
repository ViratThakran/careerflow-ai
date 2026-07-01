import { Resume } from "@/lib/resume-types"
import { generateText } from "./gemini"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const SYSTEM_PROMPT = `You are a career coach helping a candidate improve their resume. You can see their current resume content below. Answer their question directly and specifically, referencing real details from their resume (companies, roles, skills) rather than generic advice. Keep replies conversational and under 120 words unless they ask for something longer (like a rewritten bullet point or summary). Do not invent experience they don't have.`

export async function chatAboutResume(resume: Resume, history: ChatMessage[]): Promise<string> {
  const resumeContext = `CANDIDATE'S CURRENT RESUME:\nName: ${resume.personalInfo.firstName} ${resume.personalInfo.lastName}\nTitle: ${resume.personalInfo.title}\nSummary: ${resume.summary}\nSkills: ${resume.skills.map((s) => s.name).join(", ")}\nExperience: ${resume.experience
    .map((e) => `${e.role} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.achievements.join("; ")}`)
    .join("\n")}\nEducation: ${resume.education.map((e) => `${e.degree} from ${e.institution}`).join(", ")}`

  const conversation = history.map((m) => `${m.role === "user" ? "Candidate" : "Coach"}: ${m.content}`).join("\n")

  const prompt = `${resumeContext}\n\nCONVERSATION SO FAR:\n${conversation}\n\nRespond as the Coach to the candidate's latest message.`

  return generateText({ system: SYSTEM_PROMPT, prompt, maxTokens: 600 })
}
