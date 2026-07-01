import { Resume } from "@/lib/resume-types"
import { JobListing } from "./types"

const STOPWORDS = new Set([
  "the", "and", "for", "are", "with", "you", "your", "will", "have", "this", "that",
  "from", "our", "all", "can", "able", "job", "work", "role", "team", "experience",
  "skills", "years", "year", "a", "an", "to", "of", "in", "on", "is", "as", "or", "we",
])

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOPWORDS.has(word))
  )
}

function resumeKeywords(resume: Resume): Set<string> {
  const parts = [
    resume.personalInfo.title,
    resume.summary,
    ...resume.skills.map((s) => s.name),
    ...resume.experience.map((e) => `${e.role} ${e.technologies.join(" ")}`),
    ...resume.projects.map((p) => p.technologies.join(" ")),
  ]
  return tokenize(parts.join(" "))
}

// Cheap 0-100 overlap score so every fetched listing can be ranked without an AI call;
// only the top candidates get sent to the AI for a deeper match (lib/ai/match-job.ts).
export function computeKeywordScore(resume: Resume, listing: JobListing): number {
  const resumeTokens = resumeKeywords(resume)
  const jobTokens = tokenize(`${listing.title} ${listing.description ?? ""}`)

  if (jobTokens.size === 0 || resumeTokens.size === 0) return 0

  let overlap = 0
  for (const token of jobTokens) {
    if (resumeTokens.has(token)) overlap++
  }

  return Math.min(100, Math.round((overlap / jobTokens.size) * 150))
}
