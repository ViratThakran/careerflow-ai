"use client"

import { motion } from "framer-motion"
import { useResume } from "@/lib/resume-context"
import { Rocket, Save, Download, Eye, Sparkles, ChevronLeft, Check, Loader2 } from "lucide-react"
import Link from "next/link"

export function ResumeHeader() {
  const { resume, setResume, atsScore, isSaving, lastSaved, isAIAssistantOpen, setIsAIAssistantOpen } = useResume()

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-16 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50"
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="relative"
            animate={{
              boxShadow: [
                "0 0 15px rgba(0, 240, 255, 0.2)",
                "0 0 25px rgba(0, 240, 255, 0.4)",
                "0 0 15px rgba(0, 240, 255, 0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00F0FF]">
              <Rocket className="h-4 w-4 text-[#050505] rotate-45" />
            </div>
          </motion.div>
        </Link>
        <div className="hidden sm:flex items-center gap-2">
          <Link 
            href="/" 
            className="text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </Link>
          <span className="text-[#4B5563]">/</span>
          <span className="text-sm font-medium text-[#00F0FF] font-mono">Resume Builder</span>
        </div>
      </div>

      {/* Center: Resume Name */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          value={resume.name}
          onChange={(e) => setResume({ ...resume, name: e.target.value })}
          className="text-center text-sm font-medium text-white bg-transparent border-none outline-none focus:ring-2 focus:ring-[#00F0FF]/30 rounded-lg px-4 py-1.5 hover:bg-[rgba(255,255,255,0.05)] transition-colors max-w-xs"
          placeholder="Untitled Resume"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* ATS Score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass"
        >
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="12"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
              />
              <motion.circle
                cx="16"
                cy="16"
                r="12"
                fill="none"
                stroke={atsScore.total >= 90 ? "#00F0FF" : atsScore.total >= 60 ? "#10B981" : "#F59E0B"}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: `${atsScore.total * 0.754} 100` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
              {atsScore.total}
            </span>
          </div>
          <span className="text-xs text-[#9CA3AF]">ATS</span>
        </motion.div>

        {/* AI Assistant Toggle */}
        <button
          onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
          className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
            isAIAssistantOpen 
              ? "bg-[#00F0FF] text-[#050505]" 
              : "glass text-[#9CA3AF] hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-medium">AI Assistant</span>
        </button>

        {/* Preview */}
        <Link 
          href="/resume/preview"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[#9CA3AF] hover:text-white hover:border-[rgba(0,240,255,0.3)] transition-all"
        >
          <Eye className="w-4 h-4" />
          <span className="text-xs font-medium">Preview</span>
        </Link>

        {/* Download PDF */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F0FF] text-[#050505] font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download PDF</span>
        </motion.button>

        {/* Save Status */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#6B7280]">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="w-3 h-3 text-[#10B981]" />
              <span>Saved</span>
            </>
          ) : null}
        </div>
      </div>
    </motion.header>
  )
}
