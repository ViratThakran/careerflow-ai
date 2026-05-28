"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import { Resume, ATSScore, AISuggestion, defaultResume, WorkExperience, Education, Skill, Project, Certification, Language, Award, Publication, ResumeSection } from "./resume-types"

interface ResumeContextType {
  resume: Resume
  setResume: (resume: Resume) => void
  updatePersonalInfo: (field: string, value: string) => void
  updateSummary: (summary: string) => void
  addExperience: (exp: WorkExperience) => void
  updateExperience: (id: string, exp: Partial<WorkExperience>) => void
  removeExperience: (id: string) => void
  addEducation: (edu: Education) => void
  updateEducation: (id: string, edu: Partial<Education>) => void
  removeEducation: (id: string) => void
  addSkill: (skill: Skill) => void
  removeSkill: (id: string) => void
  addProject: (project: Project) => void
  updateProject: (id: string, project: Partial<Project>) => void
  removeProject: (id: string) => void
  addCertification: (cert: Certification) => void
  removeCertification: (id: string) => void
  addLanguage: (lang: Language) => void
  removeLanguage: (id: string) => void
  addAward: (award: Award) => void
  removeAward: (id: string) => void
  addPublication: (pub: Publication) => void
  removePublication: (id: string) => void
  reorderSections: (sections: ResumeSection[]) => void
  toggleSectionVisibility: (sectionId: string) => void
  atsScore: ATSScore
  suggestions: AISuggestion[]
  activeSection: string
  setActiveSection: (section: string) => void
  isAIAssistantOpen: boolean
  setIsAIAssistantOpen: (open: boolean) => void
  isSaving: boolean
  lastSaved: Date | null
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function calculateATSScore(resume: Resume): ATSScore {
  // Format score
  const formatScore = 25
  const formatIssues: string[] = []

  // Keywords score (simplified)
  const keywordsScore = resume.skills.length >= 8 ? 25 : Math.floor((resume.skills.length / 8) * 25)
  const missingKeywords = resume.skills.length < 8 ? ["Add more relevant skills"] : []

  // Length score
  const wordCount = resume.summary.split(" ").filter(Boolean).length
  const lengthScore = wordCount >= 50 && wordCount <= 200 ? 20 : Math.max(10, 20 - Math.abs(wordCount - 100) / 10)
  const lengthMessage = wordCount < 50 ? "Summary is too short" : wordCount > 200 ? "Summary is too long" : "Good length"

  // Readability score
  const readabilityScore = 18
  const readabilitySuggestions: string[] = []

  // Contact score
  const contact = resume.personalInfo
  let contactScore = 0
  const missingContact: string[] = []
  if (contact.email) contactScore += 3
  else missingContact.push("Email")
  if (contact.phone) contactScore += 3
  else missingContact.push("Phone")
  if (contact.location) contactScore += 2
  else missingContact.push("Location")
  if (contact.linkedin) contactScore += 2

  const total = formatScore + keywordsScore + lengthScore + readabilityScore + contactScore

  return {
    total,
    breakdown: {
      format: { score: formatScore, max: 25, issues: formatIssues },
      keywords: { score: keywordsScore, max: 25, missing: missingKeywords },
      length: { score: lengthScore, max: 20, message: lengthMessage },
      readability: { score: readabilityScore, max: 20, suggestions: readabilitySuggestions },
      contact: { score: contactScore, max: 10, missing: missingContact },
    },
  }
}

function generateSuggestions(resume: Resume): AISuggestion[] {
  const suggestions: AISuggestion[] = []

  if (!resume.personalInfo.linkedin) {
    suggestions.push({
      id: generateId(),
      type: "tip",
      section: "personal",
      message: "Add LinkedIn — 73% of recruiters check it",
      action: "Add LinkedIn profile",
    })
  }

  if (resume.summary.length < 100) {
    suggestions.push({
      id: generateId(),
      type: "improvement",
      section: "summary",
      message: "Your summary is quite short. Consider adding more detail about your experience and goals.",
    })
  }

  if (resume.experience.length === 0) {
    suggestions.push({
      id: generateId(),
      type: "warning",
      section: "experience",
      message: "Add your work experience to showcase your professional background.",
      action: "Add experience",
    })
  }

  resume.experience.forEach((exp) => {
    if (exp.achievements.length < 3) {
      suggestions.push({
        id: generateId(),
        type: "improvement",
        section: "experience",
        message: `Add more achievements to "${exp.company}" — aim for 3-5 bullet points with metrics.`,
      })
    }
  })

  if (resume.skills.length < 8) {
    suggestions.push({
      id: generateId(),
      type: "tip",
      section: "skills",
      message: `Add ${8 - resume.skills.length} more skills to improve ATS matching.`,
      action: "Add skills",
    })
  }

  return suggestions.slice(0, 5)
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, setResumeState] = useState<Resume>(defaultResume)
  const [activeSection, setActiveSection] = useState<string>("personal")
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const atsScore = calculateATSScore(resume)
  const suggestions = generateSuggestions(resume)

  // Auto-save effect
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      setIsSaving(true)
      // Simulate save
      setTimeout(() => {
        setIsSaving(false)
        setLastSaved(new Date())
      }, 500)
    }, 2000)

    return () => clearTimeout(saveTimeout)
  }, [resume])

  const setResume = useCallback((newResume: Resume) => {
    setResumeState(newResume)
  }, [])

  const updatePersonalInfo = useCallback((field: string, value: string) => {
    setResumeState((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
      updatedAt: new Date(),
    }))
  }, [])

  const updateSummary = useCallback((summary: string) => {
    setResumeState((prev) => ({ ...prev, summary, updatedAt: new Date() }))
  }, [])

  const addExperience = useCallback((exp: WorkExperience) => {
    setResumeState((prev) => ({
      ...prev,
      experience: [...prev.experience, { ...exp, id: generateId() }],
      updatedAt: new Date(),
    }))
  }, [])

  const updateExperience = useCallback((id: string, exp: Partial<WorkExperience>) => {
    setResumeState((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
      updatedAt: new Date(),
    }))
  }, [])

  const removeExperience = useCallback((id: string) => {
    setResumeState((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
      updatedAt: new Date(),
    }))
  }, [])

  const addEducation = useCallback((edu: Education) => {
    setResumeState((prev) => ({
      ...prev,
      education: [...prev.education, { ...edu, id: generateId() }],
      updatedAt: new Date(),
    }))
  }, [])

  const updateEducation = useCallback((id: string, edu: Partial<Education>) => {
    setResumeState((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
      updatedAt: new Date(),
    }))
  }, [])

  const removeEducation = useCallback((id: string) => {
    setResumeState((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
      updatedAt: new Date(),
    }))
  }, [])

  const addSkill = useCallback((skill: Skill) => {
    setResumeState((prev) => ({
      ...prev,
      skills: [...prev.skills, { ...skill, id: generateId() }],
      updatedAt: new Date(),
    }))
  }, [])

  const removeSkill = useCallback((id: string) => {
    setResumeState((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
      updatedAt: new Date(),
    }))
  }, [])

  const addProject = useCallback((project: Project) => {
    setResumeState((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: generateId() }],
      updatedAt: new Date(),
    }))
  }, [])

  const updateProject = useCallback((id: string, project: Partial<Project>) => {
    setResumeState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
      updatedAt: new Date(),
    }))
  }, [])

  const removeProject = useCallback((id: string) => {
    setResumeState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      updatedAt: new Date(),
    }))
  }, [])

  const addCertification = useCallback((cert: Certification) => {
    setResumeState((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { ...cert, id: generateId() }],
      updatedAt: new Date(),
    }))
  }, [])

  const removeCertification = useCallback((id: string) => {
    setResumeState((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
      updatedAt: new Date(),
    }))
  }, [])

  const addLanguage = useCallback((lang: Language) => {
    setResumeState((prev) => ({
      ...prev,
      languages: [...prev.languages, { ...lang, id: generateId() }],
      updatedAt: new Date(),
    }))
  }, [])

  const removeLanguage = useCallback((id: string) => {
    setResumeState((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
      updatedAt: new Date(),
    }))
  }, [])

  const addAward = useCallback((award: Award) => {
    setResumeState((prev) => ({
      ...prev,
      awards: [...prev.awards, { ...award, id: generateId() }],
      updatedAt: new Date(),
    }))
  }, [])

  const removeAward = useCallback((id: string) => {
    setResumeState((prev) => ({
      ...prev,
      awards: prev.awards.filter((a) => a.id !== id),
      updatedAt: new Date(),
    }))
  }, [])

  const addPublication = useCallback((pub: Publication) => {
    setResumeState((prev) => ({
      ...prev,
      publications: [...prev.publications, { ...pub, id: generateId() }],
      updatedAt: new Date(),
    }))
  }, [])

  const removePublication = useCallback((id: string) => {
    setResumeState((prev) => ({
      ...prev,
      publications: prev.publications.filter((p) => p.id !== id),
      updatedAt: new Date(),
    }))
  }, [])

  const reorderSections = useCallback((sections: ResumeSection[]) => {
    setResumeState((prev) => ({
      ...prev,
      sections: sections.map((s, i) => ({ ...s, order: i })),
      updatedAt: new Date(),
    }))
  }, [])

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setResumeState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
      ),
      updatedAt: new Date(),
    }))
  }, [])

  return (
    <ResumeContext.Provider
      value={{
        resume,
        setResume,
        updatePersonalInfo,
        updateSummary,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        removeSkill,
        addProject,
        updateProject,
        removeProject,
        addCertification,
        removeCertification,
        addLanguage,
        removeLanguage,
        addAward,
        removeAward,
        addPublication,
        removePublication,
        reorderSections,
        toggleSectionVisibility,
        atsScore,
        suggestions,
        activeSection,
        setActiveSection,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isSaving,
        lastSaved,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider")
  }
  return context
}
