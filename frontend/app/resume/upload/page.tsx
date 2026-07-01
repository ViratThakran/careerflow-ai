"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Upload, FileText, Linkedin, FileUp, CheckCircle2, 
  Loader2, ArrowRight, Rocket, ChevronLeft, Sparkles,
  Briefcase, GraduationCap, Wrench, X
} from "lucide-react"

type UploadState = "idle" | "uploading" | "parsing" | "complete" | "error"

interface ParsedData {
  personalInfo: { name: string; email: string; phone: string }
  experienceCount: number
  educationCount: number
  skillCount: number
}

export default function ResumeUploadPage() {
  const router = useRouter()
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [resumeId, setResumeId] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const processFile = async (file: File) => {
    setFile(file)
    setError(null)
    setUploadState("uploading")
    setProgress(30)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const uploadRes = await fetch("/api/resumes/upload", { method: "POST", body: formData })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed")

      setProgress(100)
      setUploadState("parsing")

      const parseRes = await fetch(`/api/resumes/${uploadData.resumeId}/parse`, { method: "POST" })
      const parseData = await parseRes.json()
      if (!parseRes.ok) throw new Error(parseData.error || "Parsing failed")

      const resume = parseData.resume
      setResumeId(uploadData.resumeId)
      setParsedData({
        personalInfo: {
          name: `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.trim(),
          email: resume.personalInfo.email,
          phone: resume.personalInfo.phone,
        },
        experienceCount: resume.experience.length,
        educationCount: resume.education.length,
        skillCount: resume.skills.length,
      })
      setUploadState("complete")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setUploadState("error")
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const resetUpload = () => {
    setUploadState("idle")
    setFile(null)
    setParsedData(null)
    setProgress(0)
    setError(null)
    setResumeId(null)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="relative"
            animate={{
              boxShadow: [
                "0 0 15px rgba(17,24,39, 0.2)",
                "0 0 25px rgba(17,24,39, 0.4)",
                "0 0 15px rgba(17,24,39, 0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111827]">
              <Rocket className="h-4.5 w-4.5 text-white rotate-45" />
            </div>
          </motion.div>
          <span className="text-lg font-bold tracking-[-0.02em] text-gray-900">
            ApplyPilot
          </span>
        </Link>
        <Link 
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Upload Your Resume
            </h1>
            <p className="text-gray-500 text-lg">
              Let our AI analyze and optimize your existing resume
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {uploadState === "idle" && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {/* Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative h-80 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                    dragActive
                      ? "border-[#111827] bg-[rgba(17,24,39,0.05)]"
                      : "border-[var(--border-subtle)] hover:border-[rgba(17,24,39,0.3)]"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${
                        dragActive 
                          ? "bg-[rgba(17,24,39,0.2)]" 
                          : "bg-[rgba(0,0,0,0.05)]"
                      }`}
                    >
                      <Upload className={`w-10 h-10 ${dragActive ? "text-[#111827]" : "text-gray-500"}`} />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Drop your resume here
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      PDF, DOCX, TXT — Max 10MB
                    </p>
                    <button className="px-6 py-2.5 bg-[rgba(0,0,0,0.05)] border border-[var(--border-subtle)] rounded-full text-sm text-gray-900 font-medium hover:bg-[rgba(0,0,0,0.1)] transition-colors">
                      Browse Files
                    </button>
                  </div>
                </div>

                {/* Alternative Import Options */}
                <div className="mt-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                    <span className="text-sm text-gray-500">Or import from</span>
                    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] hover:border-[#0A66C2] hover:bg-[rgba(10,102,194,0.1)] transition-all group">
                      <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                      <span className="font-medium text-gray-900">LinkedIn</span>
                    </button>
                    <Link 
                      href="/resume/build"
                      className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[rgba(0,0,0,0.02)] border border-[var(--border-subtle)] hover:border-[#111827] hover:bg-[rgba(17,24,39,0.05)] transition-all group"
                    >
                      <FileText className="w-6 h-6 text-[#111827]" />
                      <span className="font-medium text-gray-900">Start Fresh</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {(uploadState === "uploading" || uploadState === "parsing") && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[rgba(17,24,39,0.1)] flex items-center justify-center">
                    <FileUp className="w-7 h-7 text-[#111827]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{file?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {(file?.size || 0 / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button 
                    onClick={resetUpload}
                    className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {uploadState === "uploading" ? "Uploading..." : "AI is parsing your resume..."}
                    </span>
                    <span className="text-sm font-medium text-[#111827]">
                      {uploadState === "uploading" ? `${progress}%` : ""}
                    </span>
                  </div>
                  <div className="h-2 bg-[rgba(0,0,0,0.1)] rounded-full overflow-hidden">
                    {uploadState === "uploading" ? (
                      <motion.div
                        className="h-full bg-[#111827] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    ) : (
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#111827] to-[#8B5CF6] rounded-full"
                        animate={{ 
                          x: ["-100%", "100%"],
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        style={{ width: "50%" }}
                      />
                    )}
                  </div>
                </div>

                {uploadState === "parsing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(17,24,39,0.05)] border border-[rgba(17,24,39,0.1)]"
                  >
                    <Sparkles className="w-5 h-5 text-[#111827] animate-pulse" />
                    <span className="text-sm text-gray-500">
                      Extracting sections, skills, and experience...
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {uploadState === "complete" && parsedData && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] p-8"
              >
                {/* Success Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.2)] flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Parsed Successfully!</h3>
                  <p className="text-gray-500">We found the following information:</p>
                </div>

                {/* Parsed Data Summary */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)] text-center"
                  >
                    <Briefcase className="w-6 h-6 text-[#8B5CF6] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{parsedData.experienceCount}</div>
                    <div className="text-xs text-gray-500">Work Experiences</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-center"
                  >
                    <GraduationCap className="w-6 h-6 text-[#10B981] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{parsedData.educationCount}</div>
                    <div className="text-xs text-gray-500">Education</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 rounded-xl bg-[rgba(17,24,39,0.1)] border border-[rgba(17,24,39,0.2)] text-center"
                  >
                    <Wrench className="w-6 h-6 text-[#111827] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{parsedData.skillCount}</div>
                    <div className="text-xs text-gray-500">Skills</div>
                  </motion.div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={resetUpload}
                    className="flex-1 py-3 rounded-xl border border-[var(--border-subtle)] text-gray-500 font-medium hover:text-gray-900 hover:border-[rgba(0,0,0,0.2)] transition-all"
                  >
                    Upload Different File
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(resumeId ? `/resume/build?id=${resumeId}` : "/resume/build")}
                    className="flex-1 py-3 rounded-xl bg-[#111827] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(17,24,39,0.5)] transition-all"
                  >
                    Continue to Editor
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {uploadState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[rgba(239,68,68,0.15)] flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload failed</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                  onClick={resetUpload}
                  className="px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-gray-900 font-medium hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
