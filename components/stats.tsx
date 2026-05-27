"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Send, TrendingUp, Briefcase, Star } from "lucide-react"

interface StatItemProps {
  value: number
  suffix: string
  label: string
  delay: number
  icon: React.ReactNode
  color: string
}

function StatItem({ value, suffix, label, delay, icon, color }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const stepValue = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += stepValue
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current * 10) / 10)
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  const displayValue = suffix === "M+" 
    ? count.toFixed(1) 
    : suffix === "/5" 
    ? count.toFixed(1) 
    : Math.floor(count).toLocaleString()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="text-center relative group"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" }}
        className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <div style={{ color }}>{icon}</div>
      </motion.div>

      {/* Number */}
      <div className="relative inline-block">
        <motion.span 
          className="text-4xl md:text-5xl font-extrabold gradient-text-white"
          animate={isInView ? { 
            textShadow: [
              "0 0 20px rgba(255,255,255,0)",
              "0 0 30px rgba(255,255,255,0.2)",
              "0 0 20px rgba(255,255,255,0)"
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: delay + 1 }}
        >
          {displayValue}{suffix}
        </motion.span>
      </div>
      
      {/* Label */}
      <p className="mt-3 text-[#6B7280] text-xs uppercase tracking-widest font-medium">
        {label}
      </p>
    </motion.div>
  )
}

export function Stats() {
  const stats = [
    { value: 2.4, suffix: "M+", label: "Applications Delivered", icon: <Send className="w-5 h-5" />, color: "#00F0FF" },
    { value: 87, suffix: "%", label: "Interview Conversion", icon: <TrendingUp className="w-5 h-5" />, color: "#10B981" },
    { value: 14000, suffix: "+", label: "Jobs Applied Today", icon: <Briefcase className="w-5 h-5" />, color: "#8B5CF6" },
    { value: 4.9, suffix: "/5", label: "User Satisfaction", icon: <Star className="w-5 h-5" />, color: "#D4AF37" },
  ]

  return (
    <section className="py-16 md:py-20 relative overflow-hidden bg-[#0a0a0f] border-y border-[var(--border-subtle)]">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className="relative">
              <StatItem
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={index * 0.15}
                icon={stat.icon}
                color={stat.color}
              />
              {/* Divider */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-20 bg-[var(--border-subtle)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
