import { generateText, extractJson } from "./gemini"
import { aiResumeContentSchema, AIResumeContent } from "./resume-schema"

const SYSTEM_PROMPT = `You convert raw resume text into structured JSON. Extract every section you can find — personal info, summary, work experience, education, skills, projects, certifications, languages, awards, publications. Do not invent information that isn't in the source text. Leave fields empty ("" or []) if not present rather than guessing. Respond with ONLY a single JSON object, no prose, matching this shape:

{
  "personalInfo": { "firstName": "", "lastName": "", "title": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": "", "github": "" },
  "summary": "",
  "experience": [{ "company": "", "role": "", "startDate": "", "endDate": "", "location": "", "isRemote": false, "description": "", "achievements": [""], "technologies": [""] }],
  "education": [{ "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "", "gpa": "", "honors": [""], "coursework": [""] }],
  "skills": [{ "name": "", "category": "technical|soft|language|tool|certification", "level": "beginner|intermediate|expert" }],
  "projects": [{ "name": "", "description": "", "link": "", "technologies": [""], "outcome": "" }],
  "certifications": [{ "name": "", "issuer": "", "date": "", "expiryDate": "", "credentialId": "" }],
  "languages": [{ "name": "", "proficiency": "native|fluent|advanced|intermediate|basic" }],
  "awards": [{ "title": "", "issuer": "", "date": "", "description": "" }],
  "publications": [{ "title": "", "publisher": "", "date": "", "link": "" }]
}`

export async function parseResumeText(rawText: string): Promise<AIResumeContent> {
  const text = await generateText({ system: SYSTEM_PROMPT, prompt: rawText.slice(0, 50_000) })
  const json = extractJson(text)
  return aiResumeContentSchema.parse(json)
}
