export interface JobPreferences {
  targetRoles: string[]
  locations: string[]
  remoteOnly: boolean
  minSalary: number | null
  employmentType: string | null
}

export interface JobListing {
  id: string
  source: string
  externalId: string
  title: string
  company: string | null
  location: string | null
  url: string
  description: string | null
  salaryMin: number | null
  salaryMax: number | null
  postedAt: string | null
}

export interface JobMatch {
  id: string
  resumeId: string
  jobListingId: string
  keywordScore: number
  aiScore: number | null
  aiRationale: string | null
  listing: JobListing
}
