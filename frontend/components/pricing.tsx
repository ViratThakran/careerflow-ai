"use client"

import { motion } from "framer-motion"
import { Check, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Explore AI-powered job search",
    features: [
      "10 AI applications/month",
      "Basic resume optimization",
      "Job matching algorithm",
      "Email notifications",
    ],
    cta: "Get Started",
    highlighted: false,
    color: "#9CA3AF",
  },
  {
    name: "Pro",
    price: "$39",
    period: "/month",
    description: "For serious job seekers ready to land faster",
    features: [
      "Unlimited AI applications",
      "Advanced resume tailoring",
      "Cover letter generation",
      "Direct recruiter outreach",
      "Interview prep assistant",
      "Real-time analytics dashboard",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    color: "#0EA5E9",
  },
  {
    name: "Enterprise",
    price: "$139",
    period: "/month",
    description: "For teams and career coaches",
    features: [
      "Everything in Pro",
      "Team management dashboard",
      "White-label applications",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
    color: "#8B5CF6",
  },
]

export function Pricing() {
  const router = useRouter()

  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden bg-[#F3F4F6]">
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
          className="text-center mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#111827] mb-4 block">
            PRICING
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Invest in Your Career
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            All plans include a 14-day free trial. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Glow effect for highlighted */}
              {plan.highlighted && (
                <div 
                  className="absolute -inset-px rounded-[20px] opacity-50 blur-sm"
                  style={{ background: `linear-gradient(135deg, ${plan.color}50, transparent)` }}
                />
              )}

              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={`relative h-full border rounded-[20px] p-8 flex flex-col ${
                  plan.highlighted
                    ? "bg-[#13131e] border-[rgba(14,165,233,0.3)]"
                    : "bg-[#1a1a28] border-[rgba(255,255,255,0.08)]"
                }`}
                style={{
                  boxShadow: plan.highlighted
                    ? "0 0 50px rgba(14,165,233,0.1), 0 0 100px rgba(139,92,246,0.07)"
                    : "0 4px 24px rgba(0,0,0,0.2)",
                }}
              >
                {/* Popular badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white">
                      <Zap className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <h3 className="text-lg font-bold mb-2 text-white">{plan.name}</h3>
                <p className="text-sm mb-6 text-[#9CA3AF]">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className={`text-4xl md:text-5xl font-extrabold ${plan.highlighted ? "gradient-text-cyan-violet" : "text-white"}`}>
                    {plan.price}
                  </span>
                  <span className="text-[#9CA3AF]">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${plan.color}30` }}
                      >
                        <Check className="w-3 h-3" style={{ color: plan.color }} />
                      </div>
                      <span className="text-sm text-[#D1D5DB]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (plan.cta === "Contact Sales") {
                      window.location.href = "mailto:sales@applypilot.ai?subject=Enterprise%20plan%20inquiry"
                    } else {
                      router.push("/signup")
                    }
                  }}
                  className={`w-full py-3.5 rounded-full font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white shadow-[0_0_25px_rgba(14,165,233,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.45)]"
                      : "bg-white/10 text-white border border-white/15 hover:bg-white/15"
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500"
        >
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#10B981]" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#10B981]" />
            Cancel anytime
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#10B981]" />
            Money-back guarantee
          </span>
        </motion.div>
      </div>
    </section>
  )
}
