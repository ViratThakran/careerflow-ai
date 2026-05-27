"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "Is this legal? Will companies know I'm using AI?",
    answer: "Yes, it's completely legal. We submit legitimate applications on your behalf using your real credentials and qualifications. Companies see a polished, professional application that accurately represents you. Our AI simply helps you apply more efficiently and present yourself in the best light—similar to how a career coach or professional resume writer would help you.",
  },
  {
    question: "How does the AI customize my resume for each job?",
    answer: "Our AI analyzes each job description to identify key requirements, skills, and keywords. It then reorganizes and rephrases your resume to highlight the most relevant experience, incorporates ATS-friendly keywords naturally, and adjusts the emphasis based on what each specific employer is looking for. The result is a resume that reads authentically while being optimized for both human reviewers and applicant tracking systems.",
  },
  {
    question: "Which job boards and platforms do you support?",
    answer: "We integrate with 50+ platforms including LinkedIn, Indeed, Glassdoor, ZipRecruiter, Greenhouse, Lever, Workday, and most major company career pages. We continuously add new integrations based on user demand. Our agents can also find and apply to jobs posted on company websites directly, even if they're not on major job boards.",
  },
  {
    question: "Can I review applications before they're sent?",
    answer: "Absolutely. You have full control over the process. You can require manual approval for every application, or set up smart filters to auto-approve applications that meet specific criteria (job title, salary range, company size, etc.). Many users start with manual approval while they learn to trust the system, then gradually enable auto-apply for certain job types.",
  },
  {
    question: "What happens when I get an interview request?",
    answer: "You receive an instant notification via email and in-app alert when any recruiter responds. We provide a summary of the role, company, and your submitted application for quick context. Our Pro and Enterprise plans include an AI interview prep assistant that helps you prepare with company-specific research, likely questions, and practice sessions.",
  },
  {
    question: "How do you find hiring manager email addresses?",
    answer: "Our system uses multiple data sources including LinkedIn, company websites, professional directories, and public databases to identify and verify hiring manager contacts. We use advanced verification to ensure email addresses are valid before sending outreach. This direct approach bypasses ATS filters entirely and puts your resume directly in decision-makers' inboxes.",
  },
  {
    question: "Is my data secure? Who sees my information?",
    answer: "We take security seriously. All data is encrypted with AES-256 both in transit and at rest. We're SOC 2 Type II compliant and conduct regular security audits. Your information is never sold to third parties. Only you and the companies you apply to see your application materials. You can export or delete all your data at any time.",
  },
  {
    question: "Can I cancel or pause my campaign anytime?",
    answer: "Yes, you have complete control. You can pause applications with a single click—useful when you have enough interviews or need a break. You can also adjust the pace (more aggressive or slower), change target criteria, or cancel entirely. There are no long-term contracts, and you can cancel your subscription anytime with no penalty.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 md:py-32 relative overflow-hidden bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#00F0FF]/5 blur-[150px]" />
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
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#00F0FF] mb-4 block">
            QUESTIONS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F9FAFB] mb-4">
            Everything You Need to Know
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
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`border-b border-[var(--border-subtle)] ${
                openIndex === index ? 'bg-[rgba(0,240,255,0.02)]' : ''
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 text-left flex items-center justify-between gap-4 group"
              >
                <span className={`text-lg font-semibold transition-all duration-300 ${
                  openIndex === index 
                    ? 'text-[#F9FAFB]' 
                    : 'text-[#F9FAFB] group-hover:text-[#00F0FF] group-hover:translate-x-2'
                }`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === index 
                      ? 'bg-[rgba(0,240,255,0.1)]' 
                      : 'bg-transparent group-hover:bg-[rgba(0,240,255,0.05)]'
                  }`}
                >
                  <Plus className={`w-5 h-5 transition-colors ${
                    openIndex === index ? 'text-[#00F0FF]' : 'text-[#00F0FF]'
                  }`} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ 
                      height: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
                      opacity: { duration: 0.2, delay: 0.1 }
                    }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-12 text-[#9CA3AF] leading-relaxed max-w-[90%]">
                      {faq.answer}
                    </p>
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
