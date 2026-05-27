"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Rocket, PlayCircle, Send, Sparkles, CheckCircle } from "lucide-react"
import { HeroScene } from "./hero-scene"

const companyLogos = ["Google", "Meta", "Amazon", "Netflix", "Spotify"]

const notifications = [
  { icon: Send, text: "Applied to Stripe — Senior Frontend", color: "#00F0FF" },
  { icon: Sparkles, text: "Resume optimized for Netflix", color: "#8B5CF6" },
  { icon: CheckCircle, text: "HR email found at OpenAI", color: "#10B981" },
  { icon: Send, text: "Applied to Figma — Product Designer", color: "#00F0FF" },
  { icon: Sparkles, text: "Cover letter generated for Google", color: "#8B5CF6" },
]

// Text scramble effect hook
function useScrambleText(text: string, delay: number = 0) {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
    let iteration = 0
    const totalIterations = 90
    
    const timeout = setTimeout(() => {
      setIsAnimating(true)
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration / 3) return text[index]
              if (char === " ") return " "
              if (char === "\n") return "\n"
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("")
        )
        
        iteration++
        
        if (iteration >= totalIterations) {
          setDisplayText(text)
          setIsAnimating(false)
          clearInterval(interval)
        }
      }, 1000 / 60)
      
      return () => clearInterval(interval)
    }, delay)
    
    return () => clearTimeout(timeout)
  }, [text, delay])
  
  return displayText
}

export function Hero() {
  const [currentNotification, setCurrentNotification] = useState(0)
  const [notificationStack, setNotificationStack] = useState<number[]>([0])
  const headlineRef = useRef<HTMLHeadingElement>(null)

  // Cycle through notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % notifications.length)
      setNotificationStack((prev) => {
        const next = (prev[prev.length - 1] + 1) % notifications.length
        const newStack = [...prev, next].slice(-3)
        return newStack
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden noise-overlay">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />
      <HeroScene />
      
      {/* Floating orbs */}
      <motion.div 
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#00F0FF]/10 blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-[#8B5CF6]/10 blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          x: [0, 15, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/4 w-[200px] h-[200px] rounded-full bg-[#F43F5E]/8 blur-[100px]" 
      />

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
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#00F0FF]">
                <TypewriterText text="AUTONOMOUS CAREER ENGINE" delay={400} />
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
              <span className="text-[#F9FAFB]">Apply Once.</span>
              <br />
              <span className="text-[#F9FAFB]">Let </span>
              <span className="gradient-text-cyan-violet">AI</span>
              <span className="text-[#F9FAFB]"> Handle</span>
              <br />
              <span className="text-[#F9FAFB]">the Rest.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-lg text-[#9CA3AF] mb-8 max-w-[540px] mx-auto lg:mx-0 leading-relaxed"
            >
              Upload your resume. Our intelligent agent scans thousands of roles, 
              tailors your application for each, applies 24/7, and reaches out to 
              hiring managers directly. You just prepare for interviews.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.6, type: "spring", stiffness: 200 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-[#050505] bg-[#00F0FF] rounded-full shadow-[0_0_40px_rgba(0,240,255,0.5)] hover:shadow-[0_0_60px_rgba(0,240,255,0.7)] transition-all duration-300"
              >
                Launch Your Campaign
                <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, borderColor: "rgba(0,240,255,0.4)" }}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-medium text-[#9CA3AF] border border-[var(--border-subtle)] rounded-full hover:bg-[rgba(0,240,255,0.05)] hover:text-white transition-all duration-300"
              >
                <PlayCircle className="w-5 h-5" />
                See How It Works
              </motion.button>
            </motion.div>

            {/* Trust Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <p className="text-xs text-[#6B7280] uppercase tracking-widest mb-4">
                Trusted by professionals at
              </p>
              <div className="flex items-center gap-6 justify-center lg:justify-start flex-wrap">
                {companyLogos.map((company, i) => (
                  <motion.span
                    key={company}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1.4 + i * 0.1 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    className="text-sm font-medium text-[#6B7280] hover:text-white transition-all cursor-default"
                  >
                    {company}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Content - Status Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="hidden lg:block relative h-[400px]"
          >
            {/* Floating Status Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.03 }}
              className="absolute top-0 right-0 glass rounded-xl p-5 min-w-[220px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/15 flex items-center justify-center">
                  <Send className="w-5 h-5 text-[#00F0FF]" />
                </div>
                <div>
                  <span className="text-3xl font-bold text-[#F9FAFB]">47</span>
                  <p className="text-xs text-[#9CA3AF]">Applications Today</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 }}
              whileHover={{ scale: 1.03 }}
              className="absolute top-24 right-12 glass rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#10B981] pulse-dot" />
                <span className="text-sm font-medium text-[#F9FAFB]">AI Agent: Active</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9 }}
              whileHover={{ scale: 1.03 }}
              className="absolute top-44 right-4 glass rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#111118" strokeWidth="3" />
                    <motion.circle 
                      cx="18" cy="18" r="14" fill="none" 
                      stroke="#00F0FF" strokeWidth="3" 
                      strokeLinecap="round"
                      strokeDasharray="88"
                      initial={{ strokeDashoffset: 88 }}
                      animate={{ strokeDashoffset: 88 - (94 / 100 * 88) }}
                      transition={{ duration: 1.5, delay: 2.2, ease: "easeOut" }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#00F0FF]">94%</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F9FAFB]">Match Rate</p>
                  <p className="text-xs text-[#6B7280]">Above Average</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Live Notifications Stack */}
        <div className="absolute bottom-24 left-6 lg:left-8 hidden md:block">
          <div className="relative h-[120px] w-[300px]">
            <AnimatePresence>
              {notificationStack.map((index, stackIndex) => {
                const notification = notifications[index]
                const Icon = notification.icon
                return (
                  <motion.div
                    key={`${index}-${stackIndex}`}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ 
                      opacity: stackIndex === notificationStack.length - 1 ? 1 : 0.6 - stackIndex * 0.2,
                      y: (notificationStack.length - 1 - stackIndex) * -12,
                      scale: 1 - (notificationStack.length - 1 - stackIndex) * 0.05,
                    }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-0 left-0 glass rounded-xl p-4 flex items-center gap-3 w-full"
                    style={{ zIndex: stackIndex }}
                  >
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${notification.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: notification.color }} />
                    </div>
                    <span className="text-sm text-[#F9FAFB] truncate">{notification.text}</span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
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
            className="w-1 h-2 rounded-full bg-[#00F0FF]"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Typewriter text component
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index))
          index++
        } else {
          clearInterval(interval)
          // Keep cursor blinking after typing is done
        }
      }, 50)
      
      return () => clearInterval(interval)
    }, delay)
    
    return () => clearTimeout(timeout)
  }, [text, delay])
  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])
  
  return (
    <>
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
    </>
  )
}
