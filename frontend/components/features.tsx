"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Bot,
  ToggleRight,
  Gauge,
  Crosshair,
  Filter,
  Mail,
  Check
} from "lucide-react"

const features = [
  {
    id: "agent",
    icon: Bot,
    title: "24/7 Autonomous Agent",
    description: "Works while you sleep. Monitors job boards, analyzes postings, and executes applications without human intervention.",
    span: "md:col-span-2 md:row-span-2",
    color: "#0EA5E9",
    hasTerminal: true,
  },
  {
    id: "autoapply",
    icon: ToggleRight,
    title: "One-Click Deploy",
    description: "Set your preferences. Deploy hundreds of applications with a single command.",
    metric: "127",
    metricLabel: "applications/week",
    span: "md:col-span-1",
    color: "#8B5CF6",
  },
  {
    id: "ats",
    icon: Gauge,
    title: "ATS Compatibility",
    description: "Real-time scoring against job descriptions. Never get filtered by algorithms again.",
    metric: "94",
    metricLabel: "% average match rate",
    span: "md:col-span-1",
    color: "#10B981",
    hasGauge: true,
  },
  {
    id: "matching",
    icon: Crosshair,
    title: "Precision Matching Engine",
    description: "Not just keyword matching. Our AI understands role context, company stage, and culture fit.",
    tags: ["Semantic Analysis", "Culture Fit", "Growth Stage"],
    span: "md:col-span-2",
    color: "#EC4899",
  },
  {
    id: "filter",
    icon: Filter,
    title: "Intelligent Filtering",
    description: "Exclude companies by size, industry, remote policy, salary range, or glassdoor rating.",
    span: "md:col-span-1",
    color: "#8B5CF6",
  },
  {
    id: "mailer",
    icon: Mail,
    title: "Direct Outreach",
    description: "Finds verified hiring manager emails and sends personalized messages that get responses.",
    metric: "34",
    metricLabel: "% response rate",
    span: "md:col-span-1",
    color: "#D4AF37",
  },
]

const terminalLines = [
  "[14:32:01] Scanning LinkedIn for \"Senior Engineer\"...",
  "[14:32:03] Found 23 new postings matching profile",
  "[14:32:05] Application submitted to Netflix ✓",
  "[14:32:07] Optimizing resume for Google...",
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const Icon = feature.icon
  const [gaugeValue, setGaugeValue] = useState(0)
  const [metricValue, setMetricValue] = useState(0)

  useEffect(() => {
    if (isInView && feature.hasGauge) {
      const timer = setTimeout(() => {
        setGaugeValue(94)
      }, 500)
      return () => clearTimeout(timer)
    }
    if (isInView && feature.metric) {
      const end = parseInt(feature.metric)
      let current = 0
      const timer = setInterval(() => {
        current += Math.ceil(end / 30)
        if (current >= end) {
          setMetricValue(end)
          clearInterval(timer)
        } else {
          setMetricValue(current)
        }
      }, 50)
      return () => clearInterval(timer)
    }
  }, [isInView, feature])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
      className={`${feature.span} group`}
    >
      <motion.div
        whileHover={{ y: -6, borderColor: `${feature.color}40` }}
        transition={{ duration: 0.3 }}
        className="h-full bg-white border border-[var(--border-subtle)] rounded-[20px] p-8 relative overflow-hidden"
        style={{ boxShadow: "0 0 0 0 transparent" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 24px 48px rgba(0,0,0,0.5), 0 0 30px ${feature.color}15`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 0 transparent"
        }}
      >
        {/* Hover gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${feature.color}08 0%, transparent 60%)`
          }}
        />

        <div className="relative">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ backgroundColor: `${feature.color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color: feature.color }} />
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            {feature.description}
          </p>

          {/* Terminal for Agent card */}
          {feature.hasTerminal && (
            <div className="mt-6 bg-[#0d0d14] rounded-lg p-4 border border-[rgba(255,255,255,0.07)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-xs text-[#4B5563] ml-2 font-mono">agent.log</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {terminalLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + i * 0.2 }}
                    className="text-[#9CA3AF]"
                  >
                    <span className="text-[#4B5563]">{line.substring(0, 11)}</span>
                    {line.substring(11)}
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[rgba(255,255,255,0.07)]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] pulse-dot" />
                <span className="text-xs text-[#10B981]">Agent Status: ACTIVE</span>
              </div>
            </div>
          )}

          {/* Gauge for ATS card */}
          {feature.hasGauge && (
            <div className="mt-4 flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#111118" strokeWidth="3" />
                  <motion.circle
                    cx="18" cy="18" r="14" fill="none"
                    stroke={feature.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="88"
                    initial={{ strokeDashoffset: 88 }}
                    animate={isInView ? { strokeDashoffset: 88 - (gaugeValue / 100 * 88) } : {}}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: feature.color }}>
                  {gaugeValue}%
                </span>
              </div>
            </div>
          )}

          {/* Metric */}
          {feature.metric && !feature.hasGauge && (
            <div className="mt-2">
              <span className="text-2xl font-bold" style={{ color: feature.color }}>
                {metricValue}
              </span>
              <span className="text-sm text-gray-500 ml-1">{feature.metricLabel}</span>
            </div>
          )}

          {/* Tags */}
          {feature.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {feature.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-50 text-gray-500 border border-[var(--border-subtle)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-[#F3F4F6]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full bg-[#0EA5E9]/10 blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/10 blur-[150px]" />
        <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] rounded-full bg-[#EC4899]/8 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#111827] mb-4 block">
            CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your AI Agent&apos;s Toolkit
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every feature designed to maximize your interview rate
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1200px] mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
