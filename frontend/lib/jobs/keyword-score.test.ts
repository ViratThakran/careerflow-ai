import { describe, it, expect } from "vitest"
import { computeKeywordScore } from "./keyword-score"
import { defaultResume } from "@/lib/resume-types"
import { JobListing } from "./types"

function makeListing(overrides: Partial<JobListing> = {}): JobListing {
  return {
    id: "listing-1",
    source: "adzuna",
    externalId: "ext-1",
    title: "Data Analyst",
    company: "Acme",
    location: "Bangalore",
    url: "https://example.com/job/1",
    description: "Looking for a Data Analyst with SQL and Python experience.",
    salaryMin: null,
    salaryMax: null,
    postedAt: null,
    ...overrides,
  }
}

describe("computeKeywordScore", () => {
  it("scores 0 when the resume has no usable keywords", () => {
    const score = computeKeywordScore(defaultResume, makeListing())
    expect(score).toBe(0)
  })

  it("scores higher when resume skills overlap with the job description", () => {
    const resume = {
      ...defaultResume,
      personalInfo: { ...defaultResume.personalInfo, title: "Data Analyst" },
      skills: [
        { id: "1", name: "SQL", category: "technical" as const },
        { id: "2", name: "Python", category: "technical" as const },
      ],
    }
    const score = computeKeywordScore(resume, makeListing())
    expect(score).toBeGreaterThan(0)
  })

  it("scores 0 when the job listing has no description or title content", () => {
    const resume = {
      ...defaultResume,
      skills: [{ id: "1", name: "SQL", category: "technical" as const }],
    }
    const score = computeKeywordScore(resume, makeListing({ title: "", description: "" }))
    expect(score).toBe(0)
  })

  it("caps the score at 100", () => {
    const resume = {
      ...defaultResume,
      personalInfo: { ...defaultResume.personalInfo, title: "Data Analyst" },
      skills: [{ id: "1", name: "Analyst", category: "technical" as const }],
    }
    const score = computeKeywordScore(resume, makeListing({ title: "Analyst", description: "Analyst Analyst Analyst" }))
    expect(score).toBeLessThanOrEqual(100)
  })
})
