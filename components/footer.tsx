"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Rocket, Github, Twitter, Linkedin, MessageSquare } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "#" },
    { name: "Changelog", href: "#" },
    { name: "Roadmap", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Press Kit", href: "#" },
  ],
  resources: [
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "Templates", href: "#" },
    { name: "Webinars", href: "#" },
    { name: "Status", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "GDPR", href: "#" },
    { name: "Security", href: "#" },
    { name: "Cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[var(--border-subtle)]">
      <div className="container mx-auto px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand column - spans 2 on mobile, 2 on desktop */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2"
          >
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-lg bg-[#00F0FF] flex items-center justify-center">
                <Rocket className="w-4.5 h-4.5 text-[#050505] rotate-45" />
              </div>
              <span className="text-lg font-bold tracking-[-0.02em] text-[#F9FAFB]">
                CareerFlow
              </span>
            </Link>
            <p className="text-sm text-[#9CA3AF] mb-6 max-w-xs leading-relaxed">
              Autonomous career growth for modern professionals. Let AI handle the applications while you focus on what matters.
            </p>
            
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Github, label: "GitHub" },
                { icon: MessageSquare, label: "Discord" },
              ].map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-[#111118] border border-[var(--border-subtle)] flex items-center justify-center text-[#6B7280] hover:text-white hover:border-[rgba(0,240,255,0.3)] hover:scale-110 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Links columns */}
          {[
            { title: "Product", links: footerLinks.product },
            { title: "Company", links: footerLinks.company },
            { title: "Resources", links: footerLinks.resources },
            { title: "Legal", links: footerLinks.legal },
          ].map((column, i) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6B7280] hover:text-white transition-colors relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00F0FF] group-hover:w-full transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B7280]">
            © 2026 CareerFlow AI. All rights reserved.
          </p>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] pulse-dot" />
            <span className="text-xs font-mono text-[#6B7280]">All Systems Operational</span>
          </div>

          <p className="text-sm text-[#6B7280]">
            Made with <span className="text-[#F43F5E]">♥</span> by AI, for humans
          </p>
        </div>
      </div>
    </footer>
  )
}
