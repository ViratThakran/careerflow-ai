"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Briefcase, FileText, LayoutDashboard, Rocket, Settings, Shield } from "lucide-react"

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "#0EA5E9" },
  { href: "/jobs", label: "Find Jobs", icon: Briefcase, color: "#8B5CF6" },
  { href: "/applications", label: "Applications", icon: FileText, color: "#10B981" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, color: "#EC4899" },
  { href: "/settings", label: "Settings", icon: Settings, color: "#D4AF37" },
  { href: "/admin", label: "Admin", icon: Shield, color: "#6B7280" },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)]">
      <Link href="/" className="flex items-center gap-2.5 px-6 h-16 border-b border-[var(--border-subtle)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] shrink-0">
          <Rocket className="h-4 w-4 text-white rotate-45" />
        </div>
        <span className="text-base font-bold tracking-[-0.02em] text-gray-900">Apply<span className="gradient-text">Pilot</span></span>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              style={isActive ? { backgroundColor: `${item.color}14`, color: item.color } : undefined}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-0.5 ${
                isActive ? "" : "text-gray-500 hover:text-gray-900 hover:bg-[rgba(0,0,0,0.04)]"
              }`}
            >
              <Icon
                className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={!isActive ? { color: item.color, opacity: 0.55 } : undefined}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[var(--border-subtle)]">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">ApplyPilot AI &middot; v1.0</p>
      </div>
    </aside>
  )
}
