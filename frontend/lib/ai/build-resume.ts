import { randomUUID } from "crypto"
import { Resume, defaultResume } from "@/lib/resume-types"
import { AIResumeContent } from "./resume-schema"

// Merges AI-generated resume content into the full Resume shape the editor expects
// (templateId, sections layout, timestamps, etc.), regenerating ids so they're guaranteed
// unique rather than trusting whatever the model produced.
export function buildResumeFromAIContent(
  content: AIResumeContent,
  opts: { id: string; name: string }
): Resume {
  const now = new Date()
  return {
    ...defaultResume,
    id: opts.id,
    name: opts.name,
    createdAt: now,
    updatedAt: now,
    personalInfo: content.personalInfo,
    summary: content.summary,
    experience: content.experience.map((e) => ({ ...e, id: randomUUID() })),
    education: content.education.map((e) => ({ ...e, id: randomUUID() })),
    skills: content.skills.map((s) => ({ ...s, id: randomUUID() })),
    projects: content.projects.map((p) => ({ ...p, id: randomUUID() })),
    certifications: content.certifications.map((c) => ({ ...c, id: randomUUID() })),
    languages: content.languages.map((l) => ({ ...l, id: randomUUID() })),
    awards: content.awards.map((a) => ({ ...a, id: randomUUID() })),
    publications: content.publications.map((p) => ({ ...p, id: randomUUID() })),
  }
}
