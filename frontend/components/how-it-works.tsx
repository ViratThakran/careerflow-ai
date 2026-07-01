"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Upload, Sparkles, Send, Users } from "lucide-react"

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Upload Your Profile",
    description: "Drop your resume or LinkedIn. Our AI extracts every skill, achievement, and keyword in seconds.",
    color: "#111827",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "AI Optimizes Everything",
    description: "For every job, we rewrite your resume to match the exact keywords and requirements. ATS-friendly, human-impressive.",
    color: "#8B5CF6",
  },
  {
    num: "03",
    icon: Send,
    title: "Autonomous Applications",
    description: "Our agent applies to 50-200 matched roles across LinkedIn, Indeed, Greenhouse, Lever, and 40+ other platforms while you sleep.",
    color: "#111827",
  },
  {
    num: "04",
    icon: Users,
    title: "Direct Recruiter Outreach",
    description: "We find hiring manager emails and send personalized outreach with your optimized resume. No gatekeepers.",
    color: "#10B981",
  },
]

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"])

  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden bg-[#F3F4F6]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/5 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#111827]/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#111827] mb-4 block">
            THE PROCESS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Four Steps to Your Next Role
          </h2>
        </motion.div>

        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          {/* Progress line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-[var(--border-subtle)]">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-[#111827] via-[#8B5CF6] to-[#10B981]"
            />
          </div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
                    <motion.div
                      whileHover={{ y: -4, borderColor: step.color }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border border-[var(--border-subtle)] rounded-2xl p-8 relative overflow-hidden group"
                    >
                      {/* Large background number */}
                      <span 
                        className="absolute top-4 right-6 text-[8rem] font-extrabold opacity-[0.03] leading-none pointer-events-none"
                        style={{ color: step.color }}
                      >
                        {step.num}
                      </span>

                      <div className="relative">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                          {step.num} — {step.title}
                        </h3>
                        <p className="text-gray-500 leading-relaxed">{step.description}</p>
                      </div>

                      {/* Hover glow */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${step.color}08 0%, transparent 70%)`
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Icon */}
                  <div className="relative flex-shrink-0 order-first md:order-none z-10">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                      style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: step.color }} />
                    </motion.div>
                    {/* Glow */}
                    <div
                      className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                      style={{ backgroundColor: step.color }}
                    />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
