export interface HrContact {
  email: string
  name: string | null
  title: string | null
  confidence: number | null
}

interface HunterEmail {
  value: string
  first_name?: string
  last_name?: string
  position?: string
  confidence?: number
  department?: string
}

interface HunterDomainSearchResponse {
  data: { emails: HunterEmail[] }
}

// Guesses a company's primary domain from its display name. Wrong often enough that the
// UI must let the user override it — there's no reliable name->domain mapping otherwise.
export function guessCompanyDomain(companyName: string): string {
  return (
    companyName
      .toLowerCase()
      .replace(/\b(inc|llc|ltd|corp|corporation|co|pvt|private|limited)\b\.?/g, "")
      .replace(/[^a-z0-9]/g, "") + ".com"
  )
}

const HR_KEYWORDS = ["hr", "talent", "recruit", "people", "hiring"]

export async function findHrContacts(domain: string): Promise<HrContact[]> {
  const apiKey = process.env.HUNTER_API_KEY
  if (!apiKey) {
    throw new Error("HUNTER_API_KEY is not configured")
  }

  const params = new URLSearchParams({ domain, api_key: apiKey, limit: "10" })
  const res = await fetch(`https://api.hunter.io/v2/domain-search?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Hunter.io lookup failed: ${res.status} ${await res.text()}`)
  }

  const data: HunterDomainSearchResponse = await res.json()

  const contacts = data.data.emails.map((e) => ({
    email: e.value,
    name: [e.first_name, e.last_name].filter(Boolean).join(" ") || null,
    title: e.position ?? null,
    confidence: e.confidence ?? null,
  }))

  // Prefer HR/recruiting-titled contacts, but fall back to whatever Hunter found —
  // any contact at the company beats none.
  const hrFirst = contacts.filter((c) =>
    HR_KEYWORDS.some((kw) => c.title?.toLowerCase().includes(kw))
  )

  return hrFirst.length > 0 ? hrFirst : contacts
}
