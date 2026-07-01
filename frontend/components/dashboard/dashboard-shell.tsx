"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronDown, LogOut } from "lucide-react"
import { useState } from "react"
import { SidebarNav } from "./sidebar-nav"
import { useCurrentUser } from "@/lib/hooks/use-current-user"
import { createClient } from "@/lib/supabase/client"

interface DashboardShellProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

// Shared app shell for every authenticated page — persistent sidebar nav + a corporate-
// style top bar (page title, breadcrumb-ish subtitle, user menu) instead of each page
// re-implementing its own ad-hoc header. Mirrors the layout pattern of an enterprise
// SaaS dashboard (sidebar + topbar + content) rather than a stack of one-off pages.
export function DashboardShell({ title, subtitle, actions, children }: DashboardShellProps) {
  const router = useRouter()
  const { email } = useCurrentUser()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex relative overflow-hidden">
      {/* Ambient color blobs — same blue/violet/pink blend as the marketing pages, kept
          very faint here so app content stays readable while the page doesn't feel flat white */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-[#0EA5E9]/[0.10] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-[#8B5CF6]/[0.10] blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] rounded-full bg-[#EC4899]/[0.07] blur-[150px] pointer-events-none" />

      <SidebarNav />

      <div className="flex-1 min-w-0 relative">
        <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-6">
          <div>
            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-[var(--border-subtle)] hover:border-[rgba(14,165,233,0.4)] transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] text-white text-xs font-semibold flex items-center justify-center">
                  {email?.[0]?.toUpperCase() ?? "?"}
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline max-w-[140px] truncate">{email ?? ""}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[0_12px_32px_rgba(14,165,233,0.12)] rounded-xl overflow-hidden">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-6 py-8 relative"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
