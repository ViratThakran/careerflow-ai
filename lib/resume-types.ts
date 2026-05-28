// Resume Types and Interfaces

export interface PersonalInfo {
  photo?: string
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  portfolio?: string
  github?: string
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string | "Present"
  location: string
  isRemote: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  honors?: string[]
  coursework?: string[]
}

export interface Skill {
  id: string
  name: string
  category: "technical" | "soft" | "language" | "tool" | "certification"
  level?: "beginner" | "intermediate" | "expert"
}

export interface Project {
  id: string
  name: string
  description: string
  link?: string
  technologies: string[]
  outcome?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
}

export interface Language {
  id: string
  name: string
  proficiency: "native" | "fluent" | "advanced" | "intermediate" | "basic"
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description?: string
}

export interface Publication {
  id: string
  title: string
  publisher: string
  date: string
  link?: string
}

export interface ResumeSection {
  id: string
  type: "personal" | "summary" | "experience" | "education" | "skills" | "projects" | "certifications" | "languages" | "awards" | "publications"
  title: string
  isRequired: boolean
  isVisible: boolean
  order: number
}

export interface Resume {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  templateId: string
  accentColor: string
  personalInfo: PersonalInfo
  summary: string
  experience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  awards: Award[]
  publications: Publication[]
  sections: ResumeSection[]
}

export interface ATSScore {
  total: number
  breakdown: {
    format: { score: number; max: number; issues: string[] }
    keywords: { score: number; max: number; missing: string[] }
    length: { score: number; max: number; message: string }
    readability: { score: number; max: number; suggestions: string[] }
    contact: { score: number; max: number; missing: string[] }
  }
}

export interface AISuggestion {
  id: string
  type: "improvement" | "warning" | "tip"
  section: string
  message: string
  action?: string
}

export interface ResumeTemplate {
  id: string
  name: string
  category: "modern" | "minimal" | "creative" | "technical" | "executive" | "academic"
  thumbnail: string
  atsScore: number
  usageCount: number
  rating: number
  colors: string[]
}

// Default resume data
export const defaultResume: Resume = {
  id: "",
  name: "Untitled Resume",
  createdAt: new Date(),
  updatedAt: new Date(),
  templateId: "modern-1",
  accentColor: "#00F0FF",
  personalInfo: {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  publications: [],
  sections: [
    { id: "personal", type: "personal", title: "Personal Info", isRequired: true, isVisible: true, order: 0 },
    { id: "summary", type: "summary", title: "Professional Summary", isRequired: false, isVisible: true, order: 1 },
    { id: "experience", type: "experience", title: "Work Experience", isRequired: false, isVisible: true, order: 2 },
    { id: "education", type: "education", title: "Education", isRequired: false, isVisible: true, order: 3 },
    { id: "skills", type: "skills", title: "Skills", isRequired: false, isVisible: true, order: 4 },
    { id: "projects", type: "projects", title: "Projects", isRequired: false, isVisible: true, order: 5 },
    { id: "certifications", type: "certifications", title: "Certifications", isRequired: false, isVisible: false, order: 6 },
    { id: "languages", type: "languages", title: "Languages", isRequired: false, isVisible: false, order: 7 },
    { id: "awards", type: "awards", title: "Awards", isRequired: false, isVisible: false, order: 8 },
    { id: "publications", type: "publications", title: "Publications", isRequired: false, isVisible: false, order: 9 },
  ],
}
