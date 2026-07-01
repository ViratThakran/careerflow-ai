"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Github, Twitter, Linkedin, Rocket } from "lucide-react"
import { useAuthUser } from "@/lib/hooks/use-auth-user"

const marketingFooterLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "FAQ", href: "#faq" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "API Reference", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR", href: "#" },
  ],
}

const appFooterLinks = {
  workspace: [
    { name: "Upload Resume", href: "/resume/upload" },
    { name: "Find Jobs", href: "/jobs" },
    { name: "Job Preferences", href: "/jobs/preferences" },
    { name: "Tailor a Resume", href: "/resume/tailor" },
  ],
  account: [
    { name: "Applications", href: "/applications" },
    { name: "Analytics", href: "/analytics" },
    { name: "Settings", href: "/settings" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
}

export function Footer() {
  const isLoggedIn = useAuthUser()

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className={`grid grid-cols-2 ${isLoggedIn ? "md:grid-cols-4" : "md:grid-cols-5"} gap-8 mb-12`}>
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-ocean-violet flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gray-900" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Apply<span className="gradient-text">Pilot</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              AI-powered job applications that land you interviews while you sleep.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </div>

          {isLoggedIn ? (
            <>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Workspace</h4>
                <ul className="space-y-3">
                  {appFooterLinks.workspace.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Account</h4>
                <ul className="space-y-3">
                  {appFooterLinks.account.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-3">
                  {appFooterLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Product</h4>
                <ul className="space-y-3">
                  {marketingFooterLinks.product.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-3">
                  {marketingFooterLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Resources</h4>
                <ul className="space-y-3">
                  {marketingFooterLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-3">
                  {marketingFooterLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Large wordmark — text pops up as rocket approaches, rocket flies into it */}
      <div className="relative border-t border-border py-10 md:py-14 overflow-hidden">
        {/* Text pops BIG on impact, bounces back */}
        <motion.p
          className="text-center font-bold tracking-[-0.04em] text-gray-900 leading-none text-[clamp(3rem,14vw,9rem)] select-none"
          animate={{
            scale:      [1, 1, 1, 1, 1.45, 1.08, 1],
            textShadow: [
              "0 0 0px rgba(14,165,233,0)",
              "0 0 0px rgba(14,165,233,0)",
              "0 0 0px rgba(14,165,233,0)",
              "0 0 0px rgba(14,165,233,0)",
              "0 0 90px rgba(14,165,233,0.55), 0 0 160px rgba(139,92,246,0.4)",
              "0 0 30px rgba(14,165,233,0.2)",
              "0 0 0px rgba(14,165,233,0)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeOut",
            times: [0, 0.15, 0.35, 0.62, 0.74, 0.88, 1],
          }}
        >
          ApplyPilot
        </motion.p>

        {/* Rocket — shoots in from left, slams into text centre, vanishes */}
        <motion.div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{
            left:    ["-8%", "-8%", "12%", "50%", "50%", "50%", "50%"],
            scale:   [0,     0.7,   1,     1.9,   0.3,   0,     0],
            opacity: [0,     1,     1,     1,     0.5,   0,     0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeIn",
            times: [0, 0.15, 0.38, 0.70, 0.80, 0.88, 1],
          }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] shadow-[0_0_28px_rgba(139,92,246,0.7)]">
            <Rocket className="w-5 h-5 text-white rotate-45" />
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="container mx-auto px-6 lg:px-8">
        <div className="pt-8 pb-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ApplyPilot AI. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
