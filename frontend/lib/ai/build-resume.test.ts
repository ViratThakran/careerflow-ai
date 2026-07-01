import { describe, it, expect } from "vitest"
import { buildResumeFromAIContent } from "./build-resume"
import { AIResumeContent } from "./resume-schema"

function makeContent(overrides: Partial<AIResumeContent> = {}): AIResumeContent {
  return {
    personalInfo: {
      firstName: "Jane",
      lastName: "Doe",
      title: "Data Analyst",
      email: "jane@example.com",
      phone: "555-1234",
      location: "Bangalore",
    },
    summary: "Experienced data analyst.",
    experience: [
      {
        id: "ignored",
        company: "Acme",
        role: "Analyst",
        startDate: "2022",
        endDate: "Present",
        location: "Bangalore",
        isRemote: false,
        description: "",
        achievements: ["Built dashboards"],
        technologies: ["SQL"],
      },
    ],
    education: [],
    skills: [{ id: "ignored", name: "SQL", category: "technical" }],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    publications: [],
    ...overrides,
  }
}

describe("buildResumeFromAIContent", () => {
  it("fills in editor metadata (id, name, timestamps) not present in AI output", () => {
    const resume = buildResumeFromAIContent(makeContent(), { id: "resume-1", name: "My Resume" })
    expect(resume.id).toBe("resume-1")
    expect(resume.name).toBe("My Resume")
    expect(resume.createdAt).toBeInstanceOf(Date)
    expect(resume.updatedAt).toBeInstanceOf(Date)
    expect(resume.sections.length).toBeGreaterThan(0)
  })

  it("regenerates ids for nested items instead of trusting the AI's ids", () => {
    const resume = buildResumeFromAIContent(makeContent(), { id: "resume-1", name: "My Resume" })
    expect(resume.experience[0].id).not.toBe("ignored")
    expect(resume.skills[0].id).not.toBe("ignored")
    expect(resume.experience[0].id).toBeTruthy()
  })

  it("preserves the actual content fields from AI output", () => {
    const resume = buildResumeFromAIContent(makeContent(), { id: "resume-1", name: "My Resume" })
    expect(resume.personalInfo.firstName).toBe("Jane")
    expect(resume.summary).toBe("Experienced data analyst.")
    expect(resume.experience[0].company).toBe("Acme")
    expect(resume.experience[0].achievements).toEqual(["Built dashboards"])
  })
})
