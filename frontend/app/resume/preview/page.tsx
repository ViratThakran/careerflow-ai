"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Download, Loader2 } from "lucide-react"
import { useResume } from "@/lib/resume-context"
import { Resume } from "@/lib/resume-types"
import { getTemplateFamily, TemplateFamily } from "@/lib/resume-templates"

function dateRange(start: string, end: string) {
  return `${start || ""} - ${end || ""}`.trim()
}

const SIDEBAR_SECTION_TYPES = new Set(["skills", "languages", "certifications"])

// Mirrors the section-by-type switch in components/resume/resume-pdf-document.tsx so the
// live preview and the downloaded PDF stay in sync with the editor's show/hide + reorder
// controls (lib/resume-context.tsx reorderSections/toggleSectionVisibility) and the
// selected template family (lib/resume-templates.ts).
function renderSection(type: string, resume: Resume, accent: string, titleClassName: string): ReactNode {
  switch (type) {
    case "summary":
      return resume.summary ? (
        <section key="summary" className="mt-6">
          <h2 className={titleClassName} style={{ color: accent }}>
            Summary
          </h2>
          <p className="text-sm mt-1 leading-relaxed">{resume.summary}</p>
        </section>
      ) : null

    case "experience":
      return resume.experience.length > 0 ? (
        <section key="experience" className="mt-6">
          <h2 className={titleClassName} style={{ color: accent }}>
            Experience
          </h2>
          <div className="space-y-3 mt-2">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">
                    {exp.role} · {exp.company}
                  </span>
                  <span className="text-gray-500 text-xs">{dateRange(exp.startDate, exp.endDate)}</span>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-0.5">
                  {exp.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null

    case "education":
      return resume.education.length > 0 ? (
        <section key="education" className="mt-6">
          <h2 className={titleClassName} style={{ color: accent }}>
            Education
          </h2>
          <div className="space-y-2 mt-2">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between text-sm">
                <span className="font-semibold">
                  {edu.degree}
                  {edu.field ? `, ${edu.field}` : ""} · {edu.institution}
                </span>
                <span className="text-gray-500 text-xs">{dateRange(edu.startDate, edu.endDate)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null

    case "skills":
      return resume.skills.length > 0 ? (
        <section key="skills" className="mt-6">
          <h2 className={titleClassName} style={{ color: accent }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {resume.skills.map((s) => (
              <span key={s.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      ) : null

    case "projects":
      return resume.projects.length > 0 ? (
        <section key="projects" className="mt-6">
          <h2 className={titleClassName} style={{ color: accent }}>
            Projects
          </h2>
          <div className="space-y-2 mt-2">
            {resume.projects.map((p) => (
              <div key={p.id} className="text-sm">
                <p className="font-semibold">{p.name}</p>
                {p.description && <p className="text-gray-700">{p.description}</p>}
                {p.technologies.length > 0 && <p className="text-gray-500 text-xs">{p.technologies.join(", ")}</p>}
              </div>
            ))}
          </div>
        </section>
      ) : null

    case "certifications":
      return resume.certifications.length > 0 ? (
        <section key="certifications" className="mt-6">
          <h2 className={titleClassName} style={{ color: accent }}>
            Certifications
          </h2>
          <div className="space-y-1 mt-2 text-sm text-gray-700">
            {resume.certifications.map((c) => (
              <p key={c.id}>
                {c.name} — {c.issuer} ({c.date})
              </p>
            ))}
          </div>
        </section>
      ) : null

    case "languages":
      return resume.languages.length > 0 ? (
        <section key="languages" className="mt-6">
          <h2 className={titleClassName} style={{ color: accent }}>
            Languages
          </h2>
          <p className="text-sm mt-1">{resume.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </section>
      ) : null

    case "awards":
      return resume.awards.length > 0 ? (
        <section key="awards" className="mt-6">
          <h2 className={titleClassName} style={{ color: accent }}>
            Awards
          </h2>
          <div className="space-y-1 mt-2 text-sm text-gray-700">
            {resume.awards.map((a) => (
              <p key={a.id}>
                {a.title} — {a.issuer} ({a.date})
              </p>
            ))}
          </div>
        </section>
      ) : null

    case "publications":
      return resume.publications.length > 0 ? (
        <section key="publications" className="mt-6">
          <h2 className={titleClassName} style={{ color: accent }}>
            Publications
          </h2>
          <div className="space-y-1 mt-2 text-sm text-gray-700">
            {resume.publications.map((p) => (
              <p key={p.id}>
                {p.title} — {p.publisher} ({p.date})
              </p>
            ))}
          </div>
        </section>
      ) : null

    default:
      return null
  }
}

const TITLE_CLASS: Record<TemplateFamily, string> = {
  modern: "text-sm font-bold uppercase tracking-wide",
  minimal: "text-sm font-bold uppercase tracking-wide",
  executive: "text-sm font-bold uppercase tracking-widest text-center border-b border-gray-300 pb-1",
}

function ResumeHeader({ resume, accent, family }: { resume: Resume; accent: string; family: TemplateFamily }) {
  const isExecutive = family === "executive"
  return (
    <div className={isExecutive ? "text-center pb-4 border-b border-gray-300 mb-2" : ""}>
      <h1 className={`text-2xl font-bold ${isExecutive ? "font-serif tracking-wide" : ""}`} style={{ color: accent }}>
        {resume.personalInfo.firstName} {resume.personalInfo.lastName}
      </h1>
      {resume.personalInfo.title && <p className="text-gray-600 mt-1">{resume.personalInfo.title}</p>}
      <div className={`flex flex-wrap gap-3 text-xs text-gray-500 mt-2 ${isExecutive ? "justify-center" : ""}`}>
        {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
        {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
        {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
        {resume.personalInfo.github && <span>{resume.personalInfo.github}</span>}
      </div>
    </div>
  )
}

export default function ResumePreviewPage() {
  const { resume } = useResume()
  const [downloading, setDownloading] = useState(false)
  const accent = resume.accentColor || "#00838F"
  const family = getTemplateFamily(resume.templateId)
  const titleClassName = TITLE_CLASS[family]
  const orderedSections = [...resume.sections]
    .filter((s) => s.type !== "personal" && s.isVisible)
    .sort((a, b) => a.order - b.order)

  async function handleDownload() {
    setDownloading(true)
    try {
      const { pdf } = await import("@react-pdf/renderer")
      const { ResumePdfDocument } = await import("@/components/resume/resume-pdf-document")
      const blob = await pdf(<ResumePdfDocument resume={resume} />).toBlob()

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${resume.name || "resume"}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  const sidebarSections = orderedSections.filter((s) => SIDEBAR_SECTION_TYPES.has(s.type))
  const mainSections = orderedSections.filter((s) => !SIDEBAR_SECTION_TYPES.has(s.type))

  return (
    <div className="h-full overflow-y-auto bg-[var(--bg-primary)]">
      <header className="p-6 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/resume/build" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Back to editor
        </Link>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827] text-white font-semibold text-sm disabled:opacity-60"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {downloading ? "Generating..." : "Download PDF"}
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-16">
        {family === "minimal" ? (
          <div className="bg-white text-gray-900 rounded-lg shadow-xl overflow-hidden flex">
            <div className="w-[32%] bg-gray-100 p-6">
              <h1 className="text-lg font-bold" style={{ color: accent }}>
                {resume.personalInfo.firstName} {resume.personalInfo.lastName}
              </h1>
              {resume.personalInfo.title && <p className="text-gray-600 text-xs mt-1">{resume.personalInfo.title}</p>}
              <div className="flex flex-col gap-1 text-xs text-gray-500 mt-3">
                {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
                {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
                {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
              </div>
              {sidebarSections.map((s) => renderSection(s.type, resume, accent, titleClassName))}
            </div>
            <div className="w-[68%] p-7">{mainSections.map((s) => renderSection(s.type, resume, accent, titleClassName))}</div>
          </div>
        ) : (
          <div className="bg-white text-gray-900 rounded-lg shadow-xl p-10">
            <ResumeHeader resume={resume} accent={accent} family={family} />
            {orderedSections.map((section) => renderSection(section.type, resume, accent, titleClassName))}
          </div>
        )}
      </main>
    </div>
  )
}
