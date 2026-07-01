import { describe, it, expect } from "vitest"
import { detectAtsFromUrl } from "./detect"

describe("detectAtsFromUrl", () => {
  it("detects Greenhouse board URLs", () => {
    expect(detectAtsFromUrl("https://boards.greenhouse.io/acme/jobs/123456")).toBe("greenhouse")
    expect(detectAtsFromUrl("https://job-boards.greenhouse.io/acme/jobs/123456")).toBe("greenhouse")
  })

  it("detects Lever posting URLs", () => {
    expect(detectAtsFromUrl("https://jobs.lever.co/acme/abc-123")).toBe("lever")
  })

  it("returns null for unrecognized URLs", () => {
    expect(detectAtsFromUrl("https://www.linkedin.com/jobs/view/123456")).toBeNull()
    expect(detectAtsFromUrl("https://www.naukri.com/job-listings-123")).toBeNull()
    expect(detectAtsFromUrl("https://example.com/careers/123")).toBeNull()
  })
})
