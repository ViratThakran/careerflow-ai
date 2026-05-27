"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
      setEmail("")
    }
  }

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#050505] min-h-[60vh] flex items-center">
      {/* Background gradients */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, transparent 50%, rgba(139, 92, 246, 0.08) 100%)'
          }}
        />
        
        {/* Animated mesh blobs */}
        <motion.div
          animate={{
            x: [0, 100, 50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00F0FF]/10 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 40, 0],
            y: [0, 60, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#8B5CF6]/10 blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-[#00F0FF] mb-6 block"
          >
            START TODAY
          </motion.span>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#F9FAFB] mb-6 leading-tight"
          >
            Stop Applying.
            <br />
            <span className="gradient-text-cyan-violet">Start Getting Hired.</span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#9CA3AF] mb-10 max-w-lg mx-auto"
          >
            Join 50,000+ professionals who automated their job search and reclaimed 20+ hours a week.
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto"
          >
            <div className="relative flex-1 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:w-[320px] h-14 px-6 bg-[#111118] border border-[var(--border-subtle)] rounded-full text-[#F9FAFB] placeholder:text-[#6B7280] focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/30 transition-all"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="h-14 px-8 bg-[#00F0FF] text-[#050505] font-bold rounded-full shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {isSubmitted ? (
                <>
                  <Check className="w-5 h-5" />
                  Success!
                </>
              ) : (
                <>
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Trust text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-sm text-[#6B7280] mt-6 flex items-center justify-center gap-2 flex-wrap"
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#10B981]" />
              No credit card required
            </span>
            <span className="text-[#6B7280]/50">•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#10B981]" />
              14-day free trial
            </span>
            <span className="text-[#6B7280]/50">•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#10B981]" />
              Cancel anytime
            </span>
          </motion.p>
        </div>
      </div>
    </section>
  )
}
