"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useResume } from "@/lib/resume-context"
import { 
  Camera, Mail, Phone, MapPin, Linkedin, Globe, Github,
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Sparkles,
  Calendar, Building2, Briefcase, Check, X
} from "lucide-react"
import { useState, useRef } from "react"
import { WorkExperience, Education, Skill, Project } from "@/lib/resume-types"

// Personal Info Section
function PersonalInfoEditor() {
  const { resume, updatePersonalInfo } = useResume()
  const { personalInfo } = resume
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Photo Upload */}
      <div className="flex items-start gap-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-28 h-28 rounded-full border-2 border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center cursor-pointer hover:border-[#111827] transition-colors group relative overflow-hidden"
        >
          {personalInfo.photo ? (
            <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <>
              <Camera className="w-6 h-6 text-gray-500 group-hover:text-[#111827] transition-colors" />
              <span className="text-xs text-gray-500 mt-1 group-hover:text-[#111827]">Upload</span>
            </>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (e) => updatePersonalInfo("photo", e.target?.result as string)
                reader.readAsDataURL(file)
              }
            }}
          />
        </div>

        <div className="flex-1 space-y-4">
          {/* Name */}
          <div className="flex gap-4">
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
              placeholder="First Name"
              className="flex-1 bg-transparent border-b border-[var(--border-subtle)] focus:border-[#111827] text-2xl font-bold text-gray-900 placeholder:text-gray-400 outline-none pb-2 transition-colors"
            />
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
              placeholder="Last Name"
              className="flex-1 bg-transparent border-b border-[var(--border-subtle)] focus:border-[#111827] text-2xl font-bold text-gray-900 placeholder:text-gray-400 outline-none pb-2 transition-colors"
            />
          </div>

          {/* Title */}
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => updatePersonalInfo("title", e.target.value)}
            placeholder="Professional Title (e.g. Senior Product Manager)"
            className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[#111827] text-lg text-gray-500 placeholder:text-gray-400 outline-none pb-2 transition-colors"
          />
        </div>
      </div>

      {/* Contact Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContactInput 
          icon={Mail} 
          placeholder="Email address" 
          value={personalInfo.email}
          onChange={(v) => updatePersonalInfo("email", v)}
          type="email"
        />
        <ContactInput 
          icon={Phone} 
          placeholder="Phone number" 
          value={personalInfo.phone}
          onChange={(v) => updatePersonalInfo("phone", v)}
          type="tel"
        />
        <ContactInput 
          icon={MapPin} 
          placeholder="Location (City, State)" 
          value={personalInfo.location}
          onChange={(v) => updatePersonalInfo("location", v)}
        />
        <ContactInput 
          icon={Linkedin} 
          placeholder="LinkedIn URL" 
          value={personalInfo.linkedin || ""}
          onChange={(v) => updatePersonalInfo("linkedin", v)}
          type="url"
        />
        <ContactInput 
          icon={Globe} 
          placeholder="Portfolio website" 
          value={personalInfo.portfolio || ""}
          onChange={(v) => updatePersonalInfo("portfolio", v)}
          type="url"
        />
        <ContactInput 
          icon={Github} 
          placeholder="GitHub profile" 
          value={personalInfo.github || ""}
          onChange={(v) => updatePersonalInfo("github", v)}
          type="url"
        />
      </div>
    </motion.div>
  )
}

function ContactInput({ 
  icon: Icon, 
  placeholder, 
  value, 
  onChange,
  type = "text"
}: { 
  icon: React.ElementType
  placeholder: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = (val: string) => {
    if (!val) return setIsValid(null)
    if (type === "email") setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
    else if (type === "tel") setIsValid(/^[\d\s\-\+\(\)]{7,}$/.test(val))
    else if (type === "url") setIsValid(/^https?:\/\/.+/.test(val))
    else setIsValid(true)
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] focus-within:border-[#111827] transition-colors group">
      <Icon className="w-5 h-5 text-gray-500 group-focus-within:text-[#111827] transition-colors" />
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          validate(e.target.value)
        }}
        onBlur={(e) => validate(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
      />
      {isValid !== null && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            isValid ? "bg-[#10B981]/20" : "bg-[#F43F5E]/20"
          }`}
        >
          {isValid ? (
            <Check className="w-3 h-3 text-[#10B981]" />
          ) : (
            <X className="w-3 h-3 text-[#F43F5E]" />
          )}
        </motion.div>
      )}
    </div>
  )
}

// Summary Section
function SummaryEditor() {
  const { resume, updateSummary } = useResume()
  const [showAIToolbar, setShowAIToolbar] = useState(false)
  const wordCount = resume.summary.split(" ").filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="relative">
        <textarea
          value={resume.summary}
          onChange={(e) => updateSummary(e.target.value)}
          onFocus={() => setShowAIToolbar(true)}
          onBlur={() => setTimeout(() => setShowAIToolbar(false), 200)}
          placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
          className="w-full h-40 bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] focus:border-[#111827] rounded-lg p-4 text-gray-900 placeholder:text-gray-400 outline-none resize-none transition-colors"
        />

        {/* AI Toolbar */}
        <AnimatePresence>
          {showAIToolbar && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-2 left-4 right-4 transform translate-y-full flex items-center gap-2 p-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg shadow-xl z-10"
            >
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgba(17,24,39,0.1)] text-[#111827] text-xs font-medium hover:bg-[rgba(17,24,39,0.2)] transition-colors">
                <Sparkles className="w-3 h-3" />
                Rewrite with AI
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-gray-500 text-xs font-medium hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                Optimize for Job
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-gray-500 text-xs font-medium hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                Keyword Boost
              </button>
              <div className="ml-auto flex items-center gap-2">
                <span className={`text-xs ${wordCount < 50 || wordCount > 200 ? "text-[#F59E0B]" : "text-[#10B981]"}`}>
                  {wordCount} words
                </span>
                <span className="text-xs text-gray-500">Ideal: 50-200</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Experience Section
function ExperienceEditor() {
  const { resume, addExperience, updateExperience, removeExperience } = useResume()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: "",
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      location: "",
      isRemote: false,
      description: "",
      achievements: [""],
      technologies: [],
    }
    addExperience(newExp)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {resume.experience.map((exp) => (
        <ExperienceCard
          key={exp.id}
          experience={exp}
          isExpanded={expandedId === exp.id}
          onToggle={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
          onUpdate={(updates) => updateExperience(exp.id, updates)}
          onRemove={() => removeExperience(exp.id)}
        />
      ))}

      <button
        onClick={handleAddExperience}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-[var(--border-subtle)] text-gray-500 hover:text-[#111827] hover:border-[#111827] transition-all group"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Work Experience</span>
      </button>
    </motion.div>
  )
}

function ExperienceCard({
  experience,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
}: {
  experience: WorkExperience
  isExpanded: boolean
  onToggle: () => void
  onUpdate: (updates: Partial<WorkExperience>) => void
  onRemove: () => void
}) {
  return (
    <motion.div
      layout
      className="bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded-lg overflow-hidden"
    >
      {/* Header - Always Visible */}
      <div 
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors"
        onClick={onToggle}
      >
        <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
        <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.2)] flex items-center justify-center">
          <Building2 className="w-5 h-5 text-[#8B5CF6]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 truncate">
            {experience.company || "Company Name"}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {experience.role || "Job Title"}
          </div>
        </div>
        <div className="text-sm text-gray-500 font-mono">
          {experience.startDate || "Start"} — {experience.endDate || "End"}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="p-2 text-gray-500 hover:text-[#F43F5E] transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[var(--border-subtle)]"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) => onUpdate({ company: e.target.value })}
                  placeholder="Company Name"
                  className="bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#111827] transition-colors"
                />
                <input
                  type="text"
                  value={experience.role}
                  onChange={(e) => onUpdate({ role: e.target.value })}
                  placeholder="Job Title"
                  className="bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#111827] transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={experience.startDate}
                    onChange={(e) => onUpdate({ startDate: e.target.value })}
                    placeholder="Start Date"
                    className="flex-1 bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#111827] transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={experience.endDate}
                    onChange={(e) => onUpdate({ endDate: e.target.value })}
                    placeholder="End Date or Present"
                    className="flex-1 bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#111827] transition-colors"
                  />
                </div>
                <input
                  type="text"
                  value={experience.location}
                  onChange={(e) => onUpdate({ location: e.target.value })}
                  placeholder="Location"
                  className="bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#111827] transition-colors"
                />
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Key Achievements</span>
                  <button className="flex items-center gap-1 text-xs text-[#111827] hover:underline">
                    <Sparkles className="w-3 h-3" />
                    AI Enhance All
                  </button>
                </div>
                {experience.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-[#111827] mt-2.5">•</span>
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => {
                        const newAchievements = [...experience.achievements]
                        newAchievements[index] = e.target.value
                        onUpdate({ achievements: newAchievements })
                      }}
                      placeholder="Describe an achievement with metrics..."
                      className="flex-1 bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#111827] transition-colors"
                    />
                    <button className="p-2 text-gray-500 hover:text-[#111827] transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => onUpdate({ achievements: [...experience.achievements, ""] })}
                  className="text-sm text-gray-500 hover:text-[#111827] transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add achievement
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Education Section
function EducationEditor() {
  const { resume, addEducation, updateEducation, removeEducation } = useResume()

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: "",
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
    }
    addEducation(newEdu)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {resume.education.map((edu) => (
        <div
          key={edu.id}
          className="bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.2)] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  placeholder="Institution Name"
                  className="bg-transparent font-semibold text-gray-900 placeholder:text-gray-400 outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="Degree"
                    className="bg-transparent text-sm text-gray-500 placeholder:text-gray-400 outline-none"
                  />
                  <span className="text-gray-400">in</span>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                    placeholder="Field of Study"
                    className="bg-transparent text-sm text-gray-500 placeholder:text-gray-400 outline-none"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => removeEducation(edu.id)}
              className="p-2 text-gray-500 hover:text-[#F43F5E] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 text-sm">
            <input
              type="text"
              value={edu.startDate}
              onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
              placeholder="Start Year"
              className="bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded px-3 py-1.5 text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#111827] w-24"
            />
            <span className="text-gray-400 py-1.5">—</span>
            <input
              type="text"
              value={edu.endDate}
              onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
              placeholder="End Year"
              className="bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded px-3 py-1.5 text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#111827] w-24"
            />
            <input
              type="text"
              value={edu.gpa || ""}
              onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
              placeholder="GPA (optional)"
              className="bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded px-3 py-1.5 text-gray-500 placeholder:text-gray-400 outline-none focus:border-[#111827] w-28"
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleAddEducation}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-[var(--border-subtle)] text-gray-500 hover:text-[#111827] hover:border-[#111827] transition-all"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Education</span>
      </button>
    </motion.div>
  )
}

// Skills Section  
function SkillsEditor() {
  const { resume, addSkill, removeSkill } = useResume()
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill({
        id: "",
        name: newSkill.trim(),
        category: "technical",
        level: "intermediate",
      })
      setNewSkill("")
    }
  }

  const categories = ["technical", "soft", "tool", "language"] as const
  const categoryLabels = {
    technical: "Technical Skills",
    soft: "Soft Skills",
    tool: "Tools & Technologies",
    language: "Languages",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Add Skill Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          placeholder="Type a skill and press Enter..."
          className="flex-1 bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#111827] transition-colors"
        />
        <button
          onClick={handleAddSkill}
          className="px-4 py-2.5 bg-[#111827] text-white rounded-lg font-medium hover:shadow-[0_0_20px_rgba(17,24,39,0.4)] transition-all"
        >
          Add
        </button>
      </div>

      {/* AI Suggestions */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(17,24,39,0.05)] border border-[rgba(17,24,39,0.1)]">
        <Sparkles className="w-4 h-4 text-[#111827]" />
        <span className="text-sm text-gray-500">
          Suggested: <span className="text-[#111827] cursor-pointer hover:underline">React</span>,{" "}
          <span className="text-[#111827] cursor-pointer hover:underline">TypeScript</span>,{" "}
          <span className="text-[#111827] cursor-pointer hover:underline">Node.js</span>
        </span>
      </div>

      {/* Skills by Category */}
      {categories.map((category) => {
        const skills = resume.skills.filter((s) => s.category === category)
        if (skills.length === 0) return null

        return (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">{categoryLabels[category]}</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(17,24,39,0.1)] border border-[rgba(17,24,39,0.2)] group"
                >
                  <span className="text-sm text-gray-900">{skill.name}</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-gray-500 hover:text-[#F43F5E]" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )
      })}

      {resume.skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No skills added yet. Start typing above to add skills.</p>
        </div>
      )}
    </motion.div>
  )
}

// Import GraduationCap for Education
import { GraduationCap } from "lucide-react"

// Main Editor Component
export function ResumeEditor() {
  const { activeSection } = useResume()

  const sectionComponents: Record<string, React.ReactNode> = {
    personal: <PersonalInfoEditor />,
    summary: <SummaryEditor />,
    experience: <ExperienceEditor />,
    education: <EducationEditor />,
    skills: <SkillsEditor />,
  }

  const sectionTitles: Record<string, string> = {
    personal: "Personal Information",
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
    awards: "Awards & Honors",
    publications: "Publications",
  }

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)] p-8 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          key={activeSection}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          {sectionTitles[activeSection] || "Section"}
        </motion.h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {sectionComponents[activeSection] || (
              <div className="text-center py-12 text-gray-500">
                <p>This section editor is coming soon.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
