"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Rocket, ChevronLeft, Star, Users, Check, X, 
  Sparkles, Eye, Download
} from "lucide-react"

const templates = [
  {
    id: "modern-clean",
    name: "Modern Clean",
    category: "Modern",
    atsScore: 98,
    rating: 4.9,
    users: "24K+",
    colors: ["#111827", "#8B5CF6", "#10B981"],
    bestFor: "Tech, Startups, Design",
    features: ["ATS-Optimized", "1-2 Pages", "Clean Layout"],
  },
  {
    id: "minimal-pro",
    name: "Minimal Pro",
    category: "Minimal",
    atsScore: 96,
    rating: 4.8,
    users: "18K+",
    colors: ["#374151", "#9CA3AF", "#F9FAFB"],
    bestFor: "Corporate, Finance, Legal",
    features: ["ATS-Optimized", "Single Page", "Conservative"],
  },
  {
    id: "creative-edge",
    name: "Creative Edge",
    category: "Creative",
    atsScore: 85,
    rating: 4.7,
    users: "12K+",
    colors: ["#F43F5E", "#8B5CF6", "#F59E0B"],
    bestFor: "Marketing, Design, Media",
    features: ["Visual Focus", "Portfolio Style", "Bold Colors"],
  },
  {
    id: "tech-focus",
    name: "Tech Focus",
    category: "Technical",
    atsScore: 97,
    rating: 4.9,
    users: "31K+",
    colors: ["#111827", "#10B981", "#3B82F6"],
    bestFor: "Engineering, DevOps, Data",
    features: ["ATS-Optimized", "Skills Grid", "Project Section"],
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    category: "Executive",
    atsScore: 94,
    rating: 4.8,
    users: "8K+",
    colors: ["#D4AF37", "#1F2937", "#F9FAFB"],
    bestFor: "C-Level, Directors, VPs",
    features: ["Premium Feel", "2-3 Pages", "Achievement Focus"],
  },
  {
    id: "academic-cv",
    name: "Academic CV",
    category: "Academic",
    atsScore: 92,
    rating: 4.6,
    users: "6K+",
    colors: ["#1E40AF", "#7C3AED", "#059669"],
    bestFor: "Research, Education, PhD",
    features: ["Publications", "Citations", "Grants Section"],
  },
  {
    id: "startup-bold",
    name: "Startup Bold",
    category: "Modern",
    atsScore: 95,
    rating: 4.8,
    users: "15K+",
    colors: ["#8B5CF6", "#EC4899", "#F59E0B"],
    bestFor: "Product, Growth, Founders",
    features: ["Impact Metrics", "Timeline View", "Modern"],
  },
  {
    id: "healthcare-pro",
    name: "Healthcare Pro",
    category: "Technical",
    atsScore: 96,
    rating: 4.7,
    users: "9K+",
    colors: ["#10B981", "#3B82F6", "#F9FAFB"],
    bestFor: "Medical, Nursing, Research",
    features: ["Certifications", "Clinical Focus", "Clean"],
  },
]

const categories = ["All", "Modern", "Minimal", "Creative", "Technical", "Executive", "Academic"]

export default function TemplatesPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null)

  const filteredTemplates = activeCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === activeCategory)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111827]">
                <Rocket className="h-4.5 w-4.5 text-white rotate-45" />
              </div>
              <span className="text-lg font-bold text-gray-900">ApplyPilot</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#111827]">Templates</span>
            </div>
          </div>
          <Link 
            href="/resume/build"
            className="px-5 py-2 bg-[#111827] text-white rounded-full font-semibold text-sm hover:shadow-[0_0_30px_rgba(17,24,39,0.5)] transition-all"
          >
            Start Building
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Professional Resume Templates
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-500 max-w-2xl mx-auto"
        >
          Choose from our collection of ATS-optimized templates designed by career experts
        </motion.p>
      </section>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-[#111827] text-white"
                  : "bg-[rgba(0,0,0,0.05)] text-gray-500 hover:text-gray-900 hover:bg-[rgba(0,0,0,0.1)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div 
                  onClick={() => setSelectedTemplate(template)}
                  className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden cursor-pointer hover:border-[#111827] transition-all hover:shadow-[0_0_40px_rgba(17,24,39,0.15)]"
                >
                  {/* Preview */}
                  <div className="aspect-[3/4] bg-gradient-to-b from-[rgba(0,0,0,0.02)] to-transparent p-4 relative">
                    {/* Simplified resume preview */}
                    <div className="w-full h-full bg-white rounded-lg p-3 shadow-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: template.colors[0] }}
                        />
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded w-20 mb-1" />
                          <div className="h-1.5 bg-gray-100 rounded w-14" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-1.5 bg-gray-100 rounded w-full" />
                        <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                        <div className="h-1.5 bg-gray-100 rounded w-4/6" />
                      </div>
                      <div 
                        className="h-0.5 my-3 rounded"
                        style={{ backgroundColor: template.colors[0] }}
                      />
                      <div className="space-y-2">
                        <div className="h-1.5 bg-gray-100 rounded w-full" />
                        <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                        <div className="h-1.5 bg-gray-100 rounded w-full" />
                        <div className="h-1.5 bg-gray-100 rounded w-3/4" />
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button className="px-4 py-2 bg-[#111827] text-white rounded-lg font-medium text-sm flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/resume/build?templateId=${template.id}&accentColor=${encodeURIComponent(template.colors[0])}`)
                        }}
                        className="px-4 py-2 bg-white text-white rounded-lg font-medium text-sm"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-xs text-gray-500">{template.category}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                        <span className="text-gray-900">{template.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        {template.users} users
                      </div>
                      <div className={`px-2 py-0.5 rounded-full ${
                        template.atsScore >= 95 
                          ? "bg-[rgba(16,185,129,0.2)] text-[#10B981]"
                          : template.atsScore >= 90
                          ? "bg-[rgba(17,24,39,0.2)] text-[#111827]"
                          : "bg-[rgba(245,158,11,0.2)] text-[#F59E0B]"
                      }`}>
                        {template.atsScore}% ATS
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Template Detail Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Preview */}
                <div className="flex-1 bg-gradient-to-b from-[rgba(0,0,0,0.02)] to-transparent p-8 flex items-center justify-center">
                  <div className="w-full max-w-xs bg-white rounded-lg p-4 shadow-2xl aspect-[3/4]">
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-12 h-12 rounded-full"
                        style={{ backgroundColor: selectedTemplate.colors[0] }}
                      />
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1.5" />
                        <div className="h-2 bg-gray-100 rounded w-16" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-2 bg-gray-100 rounded w-full" />
                      <div className="h-2 bg-gray-100 rounded w-5/6" />
                      <div className="h-2 bg-gray-100 rounded w-4/6" />
                    </div>
                    <div 
                      className="h-0.5 my-4 rounded"
                      style={{ backgroundColor: selectedTemplate.colors[0] }}
                    />
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i}>
                          <div className="h-2 bg-gray-200 rounded w-1/3 mb-1" />
                          <div className="h-1.5 bg-gray-100 rounded w-full" />
                          <div className="h-1.5 bg-gray-100 rounded w-5/6 mt-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="w-full md:w-80 p-6 border-t md:border-t-0 md:border-l border-[var(--border-subtle)]">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTemplate.name}</h2>
                  <p className="text-gray-500 mb-6">Best for: {selectedTemplate.bestFor}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#111827]">{selectedTemplate.atsScore}%</div>
                      <div className="text-xs text-gray-500">ATS Score</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                        <span className="text-lg font-bold text-gray-900">{selectedTemplate.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{selectedTemplate.users}</div>
                      <div className="text-xs text-gray-500">Users</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Features</h4>
                    <div className="space-y-2">
                      {selectedTemplate.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#10B981]" />
                          <span className="text-sm text-gray-900">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Color Variants</h4>
                    <div className="flex gap-2">
                      {selectedTemplate.colors.map((color) => (
                        <div
                          key={color}
                          className="w-8 h-8 rounded-full border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        router.push(
                          `/resume/build?templateId=${selectedTemplate.id}&accentColor=${encodeURIComponent(selectedTemplate.colors[0])}`
                        )
                      }
                      className="w-full py-3 bg-[#111827] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(17,24,39,0.5)] transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Use This Template
                    </motion.button>
                    <button className="w-full py-3 border border-[var(--border-subtle)] text-gray-500 rounded-xl font-medium hover:text-gray-900 hover:border-[rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Preview
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
