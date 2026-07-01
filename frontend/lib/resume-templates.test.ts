import { describe, it, expect } from "vitest"
import { getTemplateFamily } from "./resume-templates"

describe("getTemplateFamily", () => {
  it("maps known template ids to their family", () => {
    expect(getTemplateFamily("minimal-pro")).toBe("minimal")
    expect(getTemplateFamily("executive-suite")).toBe("executive")
    expect(getTemplateFamily("modern-clean")).toBe("modern")
  })

  it("defaults to modern for unknown or missing ids", () => {
    expect(getTemplateFamily("some-unknown-id")).toBe("modern")
    expect(getTemplateFamily(undefined)).toBe("modern")
  })
})
