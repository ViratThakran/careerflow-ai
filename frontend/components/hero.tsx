"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Rocket, PlayCircle, Send, Sparkles, CheckCircle } from "lucide-react"
import Link from "next/link"
import { HeroScene } from "./hero-scene"
import { useAuthUser } from "@/lib/hooks/use-auth-user"

const companyLogos = ["Google", "Meta", "Amazon", "Netflix", "Spotify"]

const notifications = [
  { icon: Send, text: "Applied to Stripe — Senior Frontend", color: "#111827" },
  { icon: Sparkles, text: "Resume optimized for Netflix", color: "#8B5CF6" },
  { icon: CheckCircle, text: "HR email found at OpenAI", color: "#10B981" },
]

interface RealStats {
  resumeCount: number
  applicationCount: number
  matchCount: number
}

export function Hero() {
  const [currentNotification, setCurrentNotification] = useState(0)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const isLoggedIn = useAuthUser()
  const [stats, setStats] = useState<RealStats | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % notifications.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Once logged in, the floating cards on the right switch from marketing flourish
  // numbers to this account's real data — this page doubles as the dashboard, so
  // nothing on it should look like a fake demo once you're actually signed in.
  useEffect(() => {
    if (!isLoggedIn) return
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) =>
        setStats({
          resumeCount: data.resumeCount ?? 0,
          applicationCount: data.applicationCount ?? 0,
          matchCount: data.matchCount ?? 0,
        })
      )
      .catch(() => {})
  }, [isLoggedIn])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden noise-overlay">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      <HeroScene />

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-[320px] h-[320px] rounded-full bg-[#0EA5E9]/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[280px] h-[280px] rounded-full bg-[#8B5CF6]/20 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-[220px] h-[220px] rounded-full bg-[#EC4899]/15 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-6"
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#111827] cursor-blink">
                {isLoggedIn ? "YOUR CAREER ENGINE" : "AUTONOMOUS CAREER ENGINE"}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              ref={headlineRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.0] tracking-[-0.03em] mb-6 text-glow-cyan"
            >
              <span className="text-gray-900">Apply Once.</span>
              <br />
              <span className="text-gray-900">Let </span>
              <span className="gradient-text-cyan-violet">AI</span>
              <span className="text-gray-900"> Handle</span>
              <br />
              <span className="text-gray-900">the Rest.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-lg text-gray-500 mb-8 max-w-[540px] mx-auto lg:mx-0 leading-relaxed"
            >
              Upload your resume. Our intelligent agent scans thousands of roles,
              tailors your application for each, applies 24/7, and reaches out to
              hiring managers directly. You just prepare for interviews.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={isLoggedIn ? "#my-workspace" : "/signup"}
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-[#111827] rounded-full shadow-[0_0_40px_rgba(17,24,39,0.5)] hover:shadow-[0_0_60px_rgba(17,24,39,0.6)] transition-all duration-300"
                >
                  {isLoggedIn ? "Jump to My Resumes" : "Launch Your Campaign"}
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.a
                href={isLoggedIn ? "/resume/upload" : "#how-it-works"}
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-medium text-gray-500 border border-[var(--border-subtle)] rounded-full hover:border-[rgba(17,24,39,0.3)] hover:bg-[rgba(17,24,39,0.05)] hover:text-gray-900 transition-all duration-300"
              >
                {isLoggedIn ? <Sparkles className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                {isLoggedIn ? "Upload a Resume" : "See How It Works"}
              </motion.a>
            </motion.div>

            {/* Trust Bar */}
            {!isLoggedIn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                  Trusted by professionals at
                </p>
                <div className="flex items-center gap-6 justify-center lg:justify-start">
                  {companyLogos.map((company, i) => (
                    <motion.span
                      key={company}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: 1.4 + i * 0.1 }}
                      whileHover={{ opacity: 1 }}
                      className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-all cursor-default"
                    >
                      {company}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Content - Status Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="hidden lg:block relative"
          >
            {/* Floating Status Cards — real account data once logged in */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
              className="absolute top-0 right-0 glass rounded-xl p-4 min-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {isLoggedIn ? (stats?.applicationCount ?? "—") : 47}
                </span>
                <span className="text-sm text-gray-500">{isLoggedIn ? "Your Applications" : "Applications Today"}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 }}
              className="absolute top-20 right-8 glass rounded-xl p-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] pulse-dot" />
                <span className="text-sm text-gray-900">
                  {isLoggedIn ? `${stats?.resumeCount ?? "—"} Resumes Ready` : "AI Agent: Active"}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9 }}
              className="absolute top-40 right-0 glass rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#111118" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="16" fill="none"
                      stroke="#111827" strokeWidth="3"
                      strokeDasharray="94.2" strokeDashoffset="5.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#111827]">
                    {isLoggedIn ? stats?.matchCount ?? "—" : "94%"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{isLoggedIn ? "Job Matches" : "Match Rate"}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Live Notifications — marketing flourish only, hidden once logged in so it
            never implies activity that didn't really happen on this account */}
        {!isLoggedIn && (
          <div className="absolute bottom-24 right-6 lg:bottom-28 lg:right-8 hidden md:block z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNotification}
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="glass rounded-xl p-4 flex items-center gap-3 min-w-[280px]"
              >
                {(() => {
                  const Icon = notifications[currentNotification].icon
                  return (
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${notifications[currentNotification].color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: notifications[currentNotification].color }} />
                    </div>
                  )
                })()}
                <span className="text-sm text-gray-900">{notifications[currentNotification].text}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-[#6B7280]/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-[#111827]"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
