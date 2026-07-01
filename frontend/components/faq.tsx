"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "How does ApplyPilot find and apply to jobs?",
    answer:
      "Our AI agents scan LinkedIn, Indeed, Glassdoor, company career pages, and 40+ job boards 24/7. For each matching position, we analyze the job requirements, optimize your resume with relevant keywords, generate a tailored cover letter, and submit the complete application—all autonomously.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Yes. We use enterprise-grade AES-256 encryption for all data. Your information is never sold or shared. You control exactly what goes into each application, and you can delete all data at any time. We're SOC 2 Type II compliant.",
  },
  {
    question: "Can employers tell I used AI to apply?",
    answer:
      "No. Our AI generates unique, natural-sounding applications that maintain your voice and style. Each resume and cover letter is genuinely customized—not template-based. Many users receive compliments on their \"well-crafted\" applications.",
  },
  {
    question: "What's the direct recruiter outreach feature?",
    answer:
      "We use AI to find verified email addresses of hiring managers and recruiters at your target companies. Then we send personalized outreach emails on your behalf, introducing you and attaching your optimized resume. This bypasses ATS filters entirely.",
  },
  {
    question: "Can I review applications before they're sent?",
    answer:
      "Absolutely. You can require approval for every application, or set auto-apply for positions meeting specific criteria (salary, company size, role level). You always have full visibility through the dashboard.",
  },
  {
    question: "What if I get too many interview requests?",
    answer:
      "That's the goal! You can pause the agent anytime, narrow your targeting, or reduce application volume. We also provide interview scheduling tools to help manage multiple opportunities efficiently.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 md:py-32 relative overflow-hidden bg-[#F3F4F6]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#111827]/5 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/5 blur-[150px]" />
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
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Common Questions
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full bg-white border rounded-xl p-5 text-left flex items-center justify-between transition-all duration-300 ${
                  openIndex === index 
                    ? "border-[rgba(17,24,39,0.3)]" 
                    : "border-[var(--border-subtle)] hover:border-[rgba(17,24,39,0.2)]"
                }`}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: openIndex === index ? "rgba(17,24,39,0.1)" : "transparent" }}
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-[#111827]" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-500" />
                  )}
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 text-gray-500 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
