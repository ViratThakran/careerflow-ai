import { JobListing, JobPreferences } from "./types"

const ADZUNA_BASE = "https://api.adzuna.com/v1/api/jobs"
const DEFAULT_COUNTRY = "in"

interface AdzunaResult {
  id: string
  title: string
  company?: { display_name?: string }
  location?: { display_name?: string }
  redirect_url: string
  description?: string
  salary_min?: number
  salary_max?: number
  created?: string
}

interface AdzunaResponse {
  results: AdzunaResult[]
}

function mapResult(result: AdzunaResult): JobListing {
  return {
    id: "", // filled in by the caller once upserted into job_listings
    source: "adzuna",
    externalId: result.id,
    title: result.title,
    company: result.company?.display_name ?? null,
    location: result.location?.display_name ?? null,
    url: result.redirect_url,
    description: result.description ?? null,
    salaryMin: result.salary_min ? Math.round(result.salary_min) : null,
    salaryMax: result.salary_max ? Math.round(result.salary_max) : null,
    postedAt: result.created ?? null,
  }
}

export async function searchAdzunaJobs(
  preferences: JobPreferences,
  opts: { country?: string; resultsPerPage?: number } = {}
): Promise<JobListing[]> {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY
  if (!appId || !appKey) {
    throw new Error("ADZUNA_APP_ID / ADZUNA_APP_KEY are not configured")
  }

  const country = opts.country ?? DEFAULT_COUNTRY
  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    "content-type": "application/json",
    results_per_page: String(opts.resultsPerPage ?? 30),
  })

  if (preferences.targetRoles.length > 0) {
    params.set("what", preferences.targetRoles.join(" "))
  }
  if (preferences.locations.length > 0) {
    params.set("where", preferences.locations[0])
  }
  if (preferences.minSalary) {
    params.set("salary_min", String(preferences.minSalary))
  }
  if (preferences.employmentType === "full_time") params.set("full_time", "1")
  if (preferences.employmentType === "part_time") params.set("part_time", "1")
  if (preferences.employmentType === "contract") params.set("contract", "1")

  const res = await fetch(`${ADZUNA_BASE}/${country}/search/1?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Adzuna search failed: ${res.status} ${await res.text()}`)
  }

  const data: AdzunaResponse = await res.json()
  return data.results.map(mapResult)
}
