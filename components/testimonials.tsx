"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "I applied to 200+ jobs manually and got 2 callbacks. With CareerFlow, I had 11 interviews in 3 weeks and landed 2 offers.",
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
    metrics: { before: "3% response", after: "34% response" },
  },
  {
    quote: "As a career changer, I was invisible to recruiters. CareerFlow helped me highlight transferable skills and land interviews at top tech companies.",
    author: "Emily Rodriguez",
    role: "Data Analyst → ML Engineer at OpenAI",
    avatar: "ER",
    metrics: { before: "0 in 2 months", after: "7 in 2 weeks" },
  },
  {
    quote: "Watching the AI work while I focused on interview prep gave me peace of mind. I saved 30+ hours a week and landed my dream role.",
    author: "David Park",
    role: "Product Designer → Design Lead at Airbnb",
    avatar: "DP",
    metrics: { before: "40+ hrs/week", after: "5 hrs/week" },
  },
  {
    quote: "The direct recruiter outreach feature is a game-changer. I got responses from hiring managers who never would have seen my application otherwise.",
    author: "Sarah Williams",
    role: "Marketing Lead → VP Marketing at Notion",
    avatar: "SW",
    metrics: { before: "ATS rejections", after: "Direct responses" },
  },
  {
    quote: "I was skeptical at first, but the quality of applications was better than what I could write myself. The AI truly understands what recruiters want.",
    author: "James Mitchell",
    role: "Backend Engineer → Principal at Vercel",
    avatar: "JM",
    metrics: { before: "2% callback", after: "28% callback" },
  },
]

// Duplicate testimonials for seamless loop
const allTestimonials = [...testimonials, ...testimonials]

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-[350px] md:w-[400px] group"
    >
      <div className="h-full bg-[#111118] border border-[var(--border-subtle)] rounded-[20px] p-8 relative overflow-hidden transition-all duration-300 hover:border-[rgba(0,240,255,0.2)] hover:-translate-y-2">
        {/* Quote icon */}
        <div className="absolute top-6 right-6 text-[#00F0FF] opacity-10">
          <Quote className="w-12 h-12" />
        </div>

        {/* Quote text */}
        <blockquote className="text-lg text-[#F9FAFB] font-medium mb-6 leading-relaxed italic relative z-10">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Author info */}
        <div className="flex items-center gap-4 mb-4">
          <motion.div 
            className="w-14 h-14 rounded-full flex items-center justify-center text-[#F9FAFB] font-bold border-2 border-[rgba(212,175,55,0.4)] bg-[#111118]"
            animate={{ 
              boxShadow: [
                "0 0 10px rgba(212, 175, 55, 0.15)",
                "0 0 20px rgba(212, 175, 55, 0.25)",
                "0 0 10px rgba(212, 175, 55, 0.15)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {testimonial.avatar}
          </motion.div>
          <div>
            <p className="font-semibold text-[#F9FAFB]">{testimonial.author}</p>
            <p className="text-sm text-[#9CA3AF]">{testimonial.role}</p>
          </div>
        </div>

        {/* Before/After badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 w-fit">
          <span className="text-xs text-[#9CA3AF]">{testimonial.metrics.before}</span>
          <span className="text-[#10B981]">→</span>
          <span className="text-xs font-medium text-[#10B981]">{testimonial.metrics.after}</span>
        </div>
      </div>
    </motion.div>
  )
}

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section id="testimonials" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#00F0FF]/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative mb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#00F0FF] mb-4 block">
            SUCCESS STORIES
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F9FAFB] mb-4">
            From Application to Offer
          </h2>
        </motion.div>
      </div>

      {/* Infinite scroll carousel */}
      <div className="relative overflow-hidden">
        {/* Gradient fade left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
        
        {/* Gradient fade right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <motion.div
          animate={isInView ? {
            x: [0, -50 * allTestimonials.length / 2 * 24],
          } : {}}
          transition={{
            x: {
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className="flex gap-6 py-4"
          style={{ width: "fit-content" }}
        >
          {allTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={`${testimonial.author}-${index}`} 
              testimonial={testimonial} 
              index={index % testimonials.length}
            />
          ))}
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="container mx-auto px-6 lg:px-8 relative mt-16">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { value: "50,000+", label: "Professionals Helped" },
            { value: "2.4M+", label: "Applications Sent" },
            { value: "94%", label: "Would Recommend" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#6B7280] uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
