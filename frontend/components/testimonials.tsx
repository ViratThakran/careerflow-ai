"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "I applied to 200+ jobs manually and got 2 callbacks. With ApplyPilot, I had 11 interviews in 3 weeks and landed 2 offers.",
    author: "Alexandra Chen",
    role: "Senior Product Manager → Director at Figma",
    avatar: "AC",
    metrics: { before: "0 callbacks", after: "11 interviews" },
  },
  {
    quote: "The AI resume optimization is incredible. Each application felt personalized and recruiters actually responded. My response rate went from 3% to 34%.",
    author: "Marcus Johnson",
    role: "Software Engineer → Staff Engineer at Stripe",
    avatar: "MJ",
    metrics: { before: "3% response rate", after: "34% response rate" },
  },
  {
    quote: "As a career changer, I was invisible to recruiters. ApplyPilot helped me highlight transferable skills and land interviews at top tech companies.",
    author: "Emily Rodriguez",
    role: "Data Analyst → ML Engineer at OpenAI",
    avatar: "ER",
    metrics: { before: "0 interviews in 2 months", after: "7 interviews in 2 weeks" },
  },
  {
    quote: "Watching the AI work while I focused on interview prep gave me peace of mind. I saved 30+ hours a week and landed my dream role.",
    author: "David Park",
    role: "Product Designer → Design Lead at Airbnb",
    avatar: "DP",
    metrics: { before: "40+ hours/week applying", after: "5 hours/week reviewing" },
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused])

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden bg-[#F3F4F6]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#111827]/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#111827] mb-4 block">
            SUCCESS STORIES
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            From Application to Offer
          </h2>
        </motion.div>

        {/* Carousel */}
        <div 
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-[var(--border-subtle)] rounded-[20px] p-8 md:p-12 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-8 right-8 text-[#111827] opacity-10">
                <Quote className="w-16 h-16" />
              </div>

              {/* Quote text */}
              <blockquote className="text-xl md:text-2xl text-gray-900 font-medium mb-8 leading-relaxed italic max-w-3xl">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </blockquote>

              {/* Author info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-gray-900 font-bold border-2 border-[rgba(212,175,55,0.4)]"
                    style={{ backgroundColor: "#111118" }}
                    animate={{ 
                      boxShadow: [
                        "0 0 15px rgba(212, 175, 55, 0.2)",
                        "0 0 25px rgba(212, 175, 55, 0.3)",
                        "0 0 15px rgba(212, 175, 55, 0.2)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {testimonials[currentIndex].avatar}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>

                {/* Before/After */}
                <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                  <span className="text-sm text-gray-500">{testimonials[currentIndex].metrics.before}</span>
                  <span className="text-[#10B981]">→</span>
                  <span className="text-sm font-medium text-[#10B981]">{testimonials[currentIndex].metrics.after}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-[rgba(17,24,39,0.3)] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-[#111827]"
                      : "w-2 bg-[#6B7280]/30 hover:bg-[#6B7280]/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-[rgba(17,24,39,0.3)] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
