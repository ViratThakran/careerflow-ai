"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Rocket, FileText, Upload, Layout, Sparkles, ArrowRight,
  CheckCircle2, Star, Users, Zap, Shield, BarChart3
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    description: "Get intelligent suggestions to improve your resume content",
    color: "#111827",
  },
  {
    icon: BarChart3,
    title: "ATS Optimization",
    description: "Real-time scoring to beat applicant tracking systems",
    color: "#10B981",
  },
  {
    icon: Layout,
    title: "12+ Templates",
    description: "Professional designs for every industry and career level",
    color: "#8B5CF6",
  },
  {
    icon: Zap,
    title: "One-Click Optimize",
    description: "Instantly tailor your resume for any job description",
    color: "#F59E0B",
  },
]

export default function ResumeLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111827]">
            <Rocket className="h-4.5 w-4.5 text-white rotate-45" />
          </div>
          <span className="text-lg font-bold text-gray-900">ApplyPilot</span>
        </Link>
        <Link 
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Back to Home
        </Link>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(17,24,39,0.1)] border border-[rgba(17,24,39,0.2)] mb-6"
        >
          <Sparkles className="w-4 h-4 text-[#111827]" />
          <span className="text-sm text-[#111827] font-medium">AI-Powered Resume Builder</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Build a Resume That{" "}
          <span className="gradient-text">Gets Interviews</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto"
        >
          Create a professional, ATS-optimized resume in minutes with our AI-powered 
          builder. Real-time suggestions, beautiful templates, and one-click optimization.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/resume/build">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-[#111827] text-white rounded-full font-semibold text-lg flex items-center gap-2 hover:shadow-[0_0_40px_rgba(17,24,39,0.5)] transition-all"
            >
              <FileText className="w-5 h-5" />
              Build New Resume
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="/resume/upload">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 border border-[var(--border-subtle)] text-gray-900 rounded-full font-semibold text-lg flex items-center gap-2 hover:border-[rgba(17,24,39,0.3)] hover:bg-[rgba(17,24,39,0.05)] transition-all"
            >
              <Upload className="w-5 h-5" />
              Upload Existing Resume
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>50K+ resumes created</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#D4AF37]" />
            <span>4.9/5 rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>100% free to start</span>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[rgba(17,24,39,0.3)] transition-all"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started</h2>
          <p className="text-gray-500">Choose how you want to begin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/resume/build" className="group">
            <div className="p-8 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#111827] transition-all text-center">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(17,24,39,0.1)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgba(17,24,39,0.2)] transition-colors">
                <FileText className="w-8 h-8 text-[#111827]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build from Scratch</h3>
              <p className="text-sm text-gray-500">Create a new resume with our drag-and-drop builder</p>
            </div>
          </Link>

          <Link href="/resume/upload" className="group">
            <div className="p-8 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#8B5CF6] transition-all text-center">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(139,92,246,0.1)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgba(139,92,246,0.2)] transition-colors">
                <Upload className="w-8 h-8 text-[#8B5CF6]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload & Optimize</h3>
              <p className="text-sm text-gray-500">Import your existing resume for AI enhancement</p>
            </div>
          </Link>

          <Link href="/resume/templates" className="group">
            <div className="p-8 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#10B981] transition-all text-center">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(16,185,129,0.1)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgba(16,185,129,0.2)] transition-colors">
                <Layout className="w-8 h-8 text-[#10B981]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Templates</h3>
              <p className="text-sm text-gray-500">Explore 12+ professional resume designs</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
