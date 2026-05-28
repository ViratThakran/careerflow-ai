"use client"

import { motion, Reorder, useDragControls } from "framer-motion"
import { useResume } from "@/lib/resume-context"
import { 
  User, FileText, Briefcase, GraduationCap, Wrench, FolderOpen, 
  Award, Languages, Trophy, BookOpen, GripVertical, Plus, Sparkles,
  ChevronDown, Eye, EyeOff
} from "lucide-react"
import { useState } from "react"
import { ResumeSection } from "@/lib/resume-types"

const sectionIcons: Record<string, React.ElementType> = {
  personal: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: FolderOpen,
  certifications: Award,
  languages: Languages,
  awards: Trophy,
  publications: BookOpen,
}

interface SectionItemProps {
  section: ResumeSection
  isActive: boolean
  onClick: () => void
  count?: number
  hasAI?: boolean
}

function SectionItem({ section, isActive, onClick, count, hasAI }: SectionItemProps) {
  const { toggleSectionVisibility, resume } = useResume()
  const controls = useDragControls()
  const Icon = sectionIcons[section.type] || FileText

  // Calculate counts
  const getCounts = () => {
    switch (section.type) {
      case "experience": return resume.experience.length
      case "education": return resume.education.length
      case "skills": return resume.skills.length
      case "projects": return resume.projects.length
      case "certifications": return resume.certifications.length
      case "languages": return resume.languages.length
      case "awards": return resume.awards.length
      case "publications": return resume.publications.length
      default: return undefined
    }
  }

  const itemCount = getCounts()

  return (
    <Reorder.Item
      value={section}
      dragListener={false}
      dragControls={controls}
      className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive 
          ? "bg-[rgba(0,240,255,0.08)] border-l-2 border-l-[#00F0FF]" 
          : "hover:bg-[rgba(0,240,255,0.05)] border-l-2 border-l-transparent"
      } ${!section.isVisible ? "opacity-50" : ""}`}
      onClick={onClick}
    >
      {/* Drag Handle */}
      <motion.div
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-[#6B7280]" />
      </motion.div>

      {/* Icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        isActive ? "bg-[rgba(0,240,255,0.2)]" : "bg-[rgba(255,255,255,0.05)]"
      }`}>
        <Icon className={`w-4 h-4 ${isActive ? "text-[#00F0FF]" : "text-[#9CA3AF]"}`} />
      </div>

      {/* Name & Status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-[#E5E7EB]"}`}>
            {section.title}
          </span>
          {hasAI && (
            <Sparkles className="w-3 h-3 text-[#00F0FF]" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {section.isRequired && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-medium">
              Required
            </span>
          )}
          {itemCount !== undefined && itemCount > 0 && (
            <span className="text-[10px] text-[#6B7280]">
              {itemCount} {itemCount === 1 ? "entry" : "entries"}
            </span>
          )}
        </div>
      </div>

      {/* Visibility Toggle */}
      {!section.isRequired && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleSectionVisibility(section.id)
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[rgba(255,255,255,0.1)] rounded"
        >
          {section.isVisible ? (
            <Eye className="w-4 h-4 text-[#6B7280]" />
          ) : (
            <EyeOff className="w-4 h-4 text-[#6B7280]" />
          )}
        </button>
      )}
    </Reorder.Item>
  )
}

export function SectionNavigator() {
  const { resume, reorderSections, activeSection, setActiveSection, suggestions } = useResume()
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)

  const visibleSections = resume.sections.filter(s => s.isVisible).sort((a, b) => a.order - b.order)
  const hiddenSections = resume.sections.filter(s => !s.isVisible)

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-72 bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)] flex flex-col h-full overflow-hidden"
    >
      {/* Section List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
          Sections
        </h3>
        <Reorder.Group
          axis="y"
          values={visibleSections}
          onReorder={reorderSections}
          className="space-y-1"
        >
          {visibleSections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              isActive={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
              hasAI={section.type === "summary" || section.type === "skills"}
            />
          ))}
        </Reorder.Group>

        {/* Add Section */}
        <div className="mt-4 relative">
          <button
            onClick={() => setIsAddSectionOpen(!isAddSectionOpen)}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-[var(--border-subtle)] text-[#6B7280] hover:text-[#00F0FF] hover:border-[#00F0FF] transition-all group"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Section</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isAddSectionOpen ? "rotate-180" : ""}`} />
          </button>

          {isAddSectionOpen && hiddenSections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg overflow-hidden z-10"
            >
              {hiddenSections.map((section) => {
                const Icon = sectionIcons[section.type] || FileText
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      reorderSections([...visibleSections, { ...section, isVisible: true }])
                      setIsAddSectionOpen(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-[rgba(0,240,255,0.05)] transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-[#9CA3AF]" />
                    <span className="text-sm text-[#E5E7EB]">{section.title}</span>
                  </button>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="border-t border-[var(--border-subtle)] p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#00F0FF]" />
            <span className="text-xs font-semibold text-[#00F0FF]">AI Suggestions</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="p-2 rounded-lg bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)]"
              >
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{suggestion.message}</p>
                {suggestion.action && (
                  <button className="mt-2 text-xs text-[#00F0FF] hover:underline">
                    {suggestion.action}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.aside>
  )
}
