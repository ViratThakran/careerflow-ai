import { describe, it, expect } from "vitest"
import { coverLetterResultSchema, jobMatchResultSchema, outreachDraftSchema } from "./resume-schema"

describe("coverLetterResultSchema", () => {
  it("accepts a valid content string", () => {
    const parsed = coverLetterResultSchema.parse({ content: "Dear Hiring Manager,..." })
    expect(parsed.content).toBe("Dear Hiring Manager,...")
  })

  it("rejects a payload missing content", () => {
    expect(() => coverLetterResultSchema.parse({})).toThrow()
  })
})

describe("jobMatchResultSchema", () => {
  it("rejects a score outside 0-100", () => {
    expect(() => jobMatchResultSchema.parse({ score: 150, rationale: "x" })).toThrow()
    expect(() => jobMatchResultSchema.parse({ score: -1, rationale: "x" })).toThrow()
  })

  it("accepts a valid score", () => {
    const parsed = jobMatchResultSchema.parse({ score: 80, rationale: "Good fit" })
    expect(parsed.score).toBe(80)
  })
})

describe("outreachDraftSchema", () => {
  it("requires both subject and body", () => {
    expect(() => outreachDraftSchema.parse({ subject: "Hi" })).toThrow()
    const parsed = outreachDraftSchema.parse({ subject: "Hi", body: "Hello there" })
    expect(parsed.subject).toBe("Hi")
  })
})
