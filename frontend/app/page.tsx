"use client"

import { Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { MarketingHome } from "@/components/marketing-home"
import { WorkspaceSection } from "@/components/dashboard/workspace-section"
import { useAuthUser } from "@/lib/hooks/use-auth-user"

// This single page is the whole dashboard once logged in — same hero, same visual
// language as the marketing site, just with real account data and a workspace section
// (resumes, applications, quick actions) appended below instead of a separate app shell.
export default function Home() {
  const isLoggedIn = useAuthUser()

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#0EA5E9] animate-spin" />
      </div>
    )
  }

  if (isLoggedIn) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <WorkspaceSection />
        <Footer />
      </main>
    )
  }

  return <MarketingHome />
}
