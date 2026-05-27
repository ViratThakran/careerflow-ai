"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { TrendingUp, ArrowUp } from "lucide-react"

interface LogEntry {
  id: number
  timestamp: string
  type: "info" | "success" | "warning" | "action"
  message: string
}

const logMessages = [
  { type: "info" as const, message: "Scanning LinkedIn for \"Senior Product Manager\" roles..." },
  { type: "success" as const, message: "Found 23 new postings matching profile" },
  { type: "info" as const, message: "Analyzing Netflix — Senior PM, Growth (94% match)" },
  { type: "action" as const, message: "Optimizing resume: adding \"A/B testing\", \"funnel analysis\"" },
  { type: "success" as const, message: "Application submitted to Netflix Greenhouse ✓" },
  { type: "info" as const, message: "Finding hiring manager: Sarah Chen, VP Product" },
  { type: "action" as const, message: "Composing personalized outreach email..." },
  { type: "success" as const, message: "Email sent to sarah.chen@netflix.com ✓" },
  { type: "info" as const, message: "Next target: Spotify — Product Lead (91% match)..." },
  { type: "action" as const, message: "Customizing resume for streaming platform experience..." },
  { type: "success" as const, message: "Application submitted to Spotify — Job ID: #SPOT-4521" },
  { type: "warning" as const, message: "Rate limit approaching on Indeed — switching to Glassdoor" },
  { type: "info" as const, message: "Scanning Glassdoor for Product Manager roles..." },
  { type: "success" as const, message: "Found 18 matching positions at target companies" },
  { type: "action" as const, message: "Prioritizing based on salary range and location..." },
  { type: "info" as const, message: "Top match: Stripe PM — 96% skill alignment" },
  { type: "action" as const, message: "Generating tailored cover letter for fintech focus..." },
  { type: "success" as const, message: "Application submitted to Stripe — Job ID: #STRP-7892" },
]

function getTimestamp() {
  const now = new Date()
  return now.toLocaleTimeString("en-US", { hour12: false })
}

let logIdCounter = 0

export function LiveTelemetry() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isInView) return

    // Initialize with a few logs
    const initialLogs: LogEntry[] = logMessages.slice(0, 3).map((msg, i) => {
      logIdCounter += 1
      return {
        id: logIdCounter,
        timestamp: getTimestamp(),
        ...msg,
      }
    })
    setLogs(initialLogs)

    let currentIndex = 3
    const interval = setInterval(() => {
      logIdCounter += 1
      const newLog: LogEntry = {
        id: logIdCounter,
        timestamp: getTimestamp(),
        ...logMessages[currentIndex % logMessages.length],
      }
      setLogs((prevLogs) => [...prevLogs.slice(-12), newLog])
      currentIndex++
    }, 1500)

    return () => clearInterval(interval)
  }, [isInView])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs])

  const getTypeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success": return "#10B981"
      case "warning": return "#D4AF37"
      case "action": return "#8B5CF6"
      default: return "#00F0FF"
    }
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-[#050505]">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#00F0FF] mb-4 block cursor-blink">
            LIVE OPERATIONS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F9FAFB] mb-4">
            See the Agent in Action
          </h2>
        </motion.div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Terminal (60%) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-[#111118] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
              {/* macOS-style header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0a0f] border-b border-[var(--border-subtle)]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F43F5E]" />
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>
                <span className="ml-3 text-xs font-mono text-[#6B7280]">
                  careerflow-agent — zsh
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] pulse-dot" />
                  <span className="text-xs text-[#10B981] font-mono">LIVE</span>
                </div>
              </div>

              {/* Terminal content */}
              <div
                ref={containerRef}
                className="p-4 h-[400px] overflow-y-auto font-mono text-sm hide-scrollbar"
              >
                {logs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2 mb-2"
                  >
                    <span className="text-[#00F0FF] shrink-0">[{log.timestamp}]</span>
                    <span className="text-[#F9FAFB]">
                      {index === logs.length - 1 && isMounted ? (
                        <TypewriterText text={log.message} color={getTypeColor(log.type)} />
                      ) : (
                        <span>
                          {log.type === "success" && <span className="text-[#10B981]">✓ </span>}
                          {log.message}
                        </span>
                      )}
                    </span>
                  </motion.div>
                ))}
                {isMounted && (
                  <div className="flex items-center gap-2 text-[#6B7280] mt-2">
                    <span className="animate-pulse text-[#00F0FF]">▌</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Metrics Panel (40%) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Today's Applications */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Today&apos;s Applications</span>
                <span className="flex items-center gap-1 text-xs text-[#10B981]">
                  <ArrowUp className="w-3 h-3" />
                  +12%
                </span>
              </div>
              <CountUpNumber value={47} className="text-4xl font-bold text-[#F9FAFB]" />
            </div>

            {/* Response Rate Gauge */}
            <div className="glass rounded-xl p-5">
              <span className="text-sm text-[#6B7280] block mb-3">Response Rate</span>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#111118" strokeWidth="3" />
                    <motion.circle 
                      cx="18" cy="18" r="14" fill="none" 
                      stroke="#00F0FF"
                      strokeWidth="3" 
                      strokeLinecap="round"
                      strokeDasharray="88"
                      initial={{ strokeDashoffset: 88 }}
                      whileInView={{ strokeDashoffset: 88 - (23 / 100 * 88) }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[#00F0FF]">
                    23%
                  </span>
                </div>
              </div>
            </div>

            {/* Active Campaigns */}
            <div className="glass rounded-xl p-5">
              <span className="text-sm text-[#6B7280] block mb-3">Active Campaigns</span>
              <div className="flex flex-wrap gap-2">
                {["Product Manager", "Software Engineer", "Data Scientist"].map((role) => (
                  <span key={role} className="text-xs px-3 py-1.5 rounded-full bg-[#111118] text-[#F9FAFB] border border-[var(--border-subtle)]">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="glass rounded-xl p-5">
              <span className="text-sm text-[#6B7280] block mb-3">Success Timeline (7 days)</span>
              <div className="flex items-end gap-2 h-16">
                {[35, 48, 42, 55, 38, 62, 47].map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(value / 62) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-[#00F0FF]/50 to-[#00F0FF] rounded-sm"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TypewriterText({ text, color }: { text: string; color: string }) {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [text])

  return <>{displayText}</>
}

function CountUpNumber({ value, className }: { value: number; className?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let current = 0
    const timer = setInterval(() => {
      current += Math.ceil(value / 30)
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <span ref={ref} className={className}>{count}</span>
}
