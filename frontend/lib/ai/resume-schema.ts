import { z } from "zod"

// Mirrors lib/resume-types.ts — used to validate AI output before it's persisted or
// rendered into the resume editor, since the model output is otherwise untyped JSON.

export const personalInfoSchema = z.object({
  photo: z.string().optional(),
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  title: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  github: z.string().optional(),
})

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().default(""),
  isRemote: z.boolean().default(false),
  description: z.string().default(""),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
})

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  gpa: z.string().optional(),
  honors: z.array(z.string()).optional(),
  coursework: z.array(z.string()).optional(),
})

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["technical", "soft", "language", "tool", "certification"]),
  level: z.enum(["beginner", "intermediate", "expert"]).optional(),
})

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(""),
  link: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  outcome: z.string().optional(),
})

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string().default(""),
  date: z.string().default(""),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
})

export const languageSchema = z.object({
  id: z.string(),
  name: z.string(),
  proficiency: z.enum(["native", "fluent", "advanced", "intermediate", "basic"]),
})

export const awardSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string().default(""),
  date: z.string().default(""),
  description: z.string().optional(),
})

export const publicationSchema = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string().default(""),
  date: z.string().default(""),
  link: z.string().optional(),
})

// What the AI is asked to produce: the content sections only, not editor metadata
// (id, createdAt, templateId, sections layout, etc. — those are filled in by the caller).
export const aiResumeContentSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().default(""),
  experience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  languages: z.array(languageSchema).default([]),
  awards: z.array(awardSchema).default([]),
  publications: z.array(publicationSchema).default([]),
})

export type AIResumeContent = z.infer<typeof aiResumeContentSchema>

export const tailorResultSchema = z.object({
  resume: aiResumeContentSchema,
  matchScore: z.number().min(0).max(100),
  rationale: z.string(),
})

export type TailorResult = z.infer<typeof tailorResultSchema>

export const jobMatchResultSchema = z.object({
  score: z.number().min(0).max(100),
  rationale: z.string(),
})

export type JobMatchResult = z.infer<typeof jobMatchResultSchema>

export const outreachDraftSchema = z.object({
  subject: z.string(),
  body: z.string(),
})

export type OutreachDraft = z.infer<typeof outreachDraftSchema>

export const coverLetterResultSchema = z.object({
  content: z.string(),
})

export type CoverLetterResult = z.infer<typeof coverLetterResultSchema>
