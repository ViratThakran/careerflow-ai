"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Check, X, Sparkles } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for exploring",
    features: [
      { text: "10 AI-powered applications/month", included: true },
      { text: "Basic resume builder", included: true },
      { text: "3 job board connections", included: true },
      { text: "Email support", included: true },
      { text: "HR email finder", included: false },
      { text: "Resume optimization", included: false },
    ],
    cta: "Get Started",
    highlighted: false,
    color: "#9CA3AF",
  },
  {
    name: "Professional",
    price: { monthly: 29, annual: 23 },
    description: "For serious job seekers",
    features: [
      { text: "Unlimited AI applications", included: true },
      { text: "Advanced AI resume optimization", included: true },
      { text: "HR email finder & outreach", included: true },
      { text: "50+ job board integrations", included: true },
      { text: "Priority support (2hr response)", included: true },
      { text: "Interview coaching AI", included: true },
      { text: "Analytics dashboard", included: true },
    ],
    cta: "Start Pro Trial",
    highlighted: true,
    color: "#00F0FF",
  },
  {
    name: "Enterprise",
    price: { monthly: 99, annual: 79 },
    description: "For career accelerators",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Custom job search strategies", included: true },
      { text: "Dedicated AI career strategist", included: true },
      { text: "API access for teams", included: true },
      { text: "White-glove onboarding", included: true },
      { text: "Custom integrations", included: true },
    ],
    cta: "Contact Sales",
    highlighted: false,
    color: "#8B5CF6",
  },
]

function CountUpPrice({ value, isInView }: { value: number; isInView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let current = 0
    const timer = setInterval(() => {
      current += Math.ceil(value / 20)
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, 40)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <>{count}</>
}

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section id="pricing" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-[#050505]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#00F0FF] mb-4 block">
            INVESTMENT
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F9FAFB] mb-4">
            Choose Your Growth Plan
          </h2>
          <p className="text-[#9CA3AF] max-w-xl mx-auto">
            Start free. Scale when you&apos;re ready.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-[#F9FAFB]' : 'text-[#6B7280]'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-8 rounded-full bg-[#111118] border border-[var(--border-subtle)] p-1 transition-colors"
          >
            <motion.div
              animate={{ x: isAnnual ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-6 h-6 rounded-full bg-[#00F0FF]"
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-[#F9FAFB]' : 'text-[#6B7280]'}`}>
            Annual
          </span>
          <span className="text-xs font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
            Save 20%
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.price.annual : plan.price.monthly
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: plan.highlighted ? 0.3 : index * 0.1,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                className={`relative ${plan.highlighted ? "md:-mt-4 md:mb-4 z-10" : ""}`}
              >
                {/* Glow effect for highlighted */}
                {plan.highlighted && (
                  <div 
                    className="absolute -inset-px rounded-[24px] opacity-50 blur-sm"
                    style={{ background: `linear-gradient(135deg, ${plan.color}50, transparent)` }}
                  />
                )}

                <motion.div
                  animate={plan.highlighted ? {
                    y: [0, -6, 0],
                  } : {}}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ y: -8, borderColor: `${plan.color}40` }}
                  className={`relative h-full bg-[#111118] border rounded-[24px] p-8 md:p-10 flex flex-col ${
                    plan.highlighted 
                      ? "border-[rgba(0,240,255,0.3)]" 
                      : "border-[var(--border-subtle)]"
                  }`}
                  style={{ 
                    boxShadow: plan.highlighted ? `0 0 60px ${plan.color}15` : undefined,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Popular badge */}
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#00F0FF] text-[#050505] uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan name */}
                  <h3 className="text-xl font-bold text-[#F9FAFB] mb-2">{plan.name}</h3>
                  <p className="text-sm text-[#6B7280] mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-extrabold text-[#F9FAFB]">
                        ${isInView ? <CountUpPrice value={price} isInView={isInView} /> : price}
                      </span>
                      <span className="text-[#6B7280]">/month</span>
                    </div>
                    {isAnnual && price > 0 && (
                      <p className="text-xs text-[#6B7280] mt-1">
                        Billed annually (${price * 12}/year)
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[var(--border-subtle)] mb-6" />

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-3">
                        <div 
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            feature.included 
                              ? 'bg-[#10B981]/15' 
                              : 'bg-[#6B7280]/10'
                          }`}
                        >
                          {feature.included ? (
                            <Check className="w-3 h-3 text-[#10B981]" />
                          ) : (
                            <X className="w-3 h-3 text-[#6B7280]" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          feature.included ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-4 rounded-full font-semibold transition-all ${
                      plan.highlighted
                        ? "bg-[#00F0FF] text-[#050505] shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)]"
                        : "bg-[#1a1a24] text-[#F9FAFB] border border-[var(--border-subtle)] hover:border-[rgba(0,240,255,0.3)]"
                    }`}
                  >
                    {plan.cta}
                  </motion.button>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-[#6B7280]"
        >
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#10B981]" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#10B981]" />
            14-day free trial
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#10B981]" />
            Cancel anytime
          </span>
        </motion.div>
      </div>
    </section>
  )
}
