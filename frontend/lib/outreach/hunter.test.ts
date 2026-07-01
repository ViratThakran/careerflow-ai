import { describe, it, expect } from "vitest"
import { guessCompanyDomain } from "./hunter"

describe("guessCompanyDomain", () => {
  it("strips legal suffixes and lowercases", () => {
    expect(guessCompanyDomain("Acme Inc.")).toBe("acme.com")
    expect(guessCompanyDomain("Acme Corp")).toBe("acme.com")
    expect(guessCompanyDomain("Acme Pvt Ltd")).toBe("acme.com")
  })

  it("removes spaces, punctuation, and legal suffixes together", () => {
    // "Co." is stripped as a legal suffix before punctuation removal, leaving just "acme"
    expect(guessCompanyDomain("Acme & Co.")).toBe("acme.com")
  })

  it("handles already-clean names", () => {
    expect(guessCompanyDomain("Stripe")).toBe("stripe.com")
  })
})
