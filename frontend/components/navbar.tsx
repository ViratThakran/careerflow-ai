"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Rocket } from "lucide-react"
import Link from "next/link"
import { useAuthUser } from "@/lib/hooks/use-auth-user"

const marketingLinks = [
  { name: "Product", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Success Stories", href: "#testimonials" },
  { name: "Pricing", href: "#pricing" },
]

const appLinks = [
  { name: "Upload Resume", href: "/resume/upload" },
  { name: "Find Jobs", href: "/jobs" },
  { name: "Job Preferences", href: "/jobs/preferences" },
  { name: "Tailor a Resume", href: "/resume/tailor" },
  { name: "Settings", href: "/settings" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isLoggedIn = useAuthUser()
  const navLinks = isLoggedIn ? appLinks : marketingLinks

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          isScrolled
            ? "glass border-b border-[var(--border-subtle)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="relative"
              animate={{
                boxShadow: [
                  "0 0 15px rgba(14,165,233, 0.3)",
                  "0 0 25px rgba(139,92,246, 0.45)",
                  "0 0 15px rgba(14,165,233, 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6]">
                <Rocket className="h-4.5 w-4.5 text-white rotate-45" />
              </div>
            </motion.div>
            <span className="text-lg font-bold tracking-[-0.02em] text-gray-900">
              Apply<span className="gradient-text">Pilot</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className="relative text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#111827] transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-[#111827] px-6 py-2.5 rounded-full hover:shadow-[0_0_30px_rgba(17,24,39,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] pulse-dot" />
                  Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-full border border-[var(--border-subtle)] hover:border-[rgba(17,24,39,0.3)] inline-block"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/signup"
                    className="text-sm font-semibold text-white bg-[#111827] px-6 py-2.5 rounded-full hover:shadow-[0_0_30px_rgba(17,24,39,0.5)] transition-all duration-300 inline-block"
                  >
                    Start Free
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-500"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-semibold text-gray-900 hover:text-[#111827] transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Link
                  href={isLoggedIn ? "/" : "/signup"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-8 text-lg font-semibold text-white bg-[#111827] px-8 py-3 rounded-full inline-block"
                >
                  {isLoggedIn ? "Dashboard" : "Start Free"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
