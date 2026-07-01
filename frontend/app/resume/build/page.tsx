"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ResumeHeader } from "@/components/resume/resume-header"
import { SectionNavigator } from "@/components/resume/section-navigator"
import { ResumeEditor } from "@/components/resume/resume-editor"
import { AIAssistantSidebar } from "@/components/resume/ai-assistant-sidebar"
import { useResume } from "@/lib/resume-context"

function ResumeBuilderContent() {
  const { resume, setResume, isAIAssistantOpen, loadResume, isLoadingResume, loadError } = useResume()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const templateId = searchParams.get("templateId")
  const accentColor = searchParams.get("accentColor")

  useEffect(() => {
    if (id) loadResume(id)
  }, [id, loadResume])

  // Applying a template from /resume/templates only makes sense on a fresh draft —
  // an already-loaded resume (?id=) keeps its own saved templateId/accentColor.
  useEffect(() => {
    if (!id && (templateId || accentColor)) {
      setResume({
        ...resume,
        templateId: templateId ?? resume.templateId,
        accentColor: accentColor ?? resume.accentColor,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, templateId, accentColor])

  if (id && isLoadingResume) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#111827] animate-spin" />
      </div>
    )
  }

  if (id && loadError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">{loadError}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ResumeHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Section Navigator */}
        <div className="hidden lg:block">
          <SectionNavigator />
        </div>

        {/* Center: Editor */}
        <ResumeEditor />

        {/* Right: AI Assistant */}
        {isAIAssistantOpen && (
          <div className="hidden lg:block">
            <AIAssistantSidebar />
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResumeBuildPage() {
  return (
    <Suspense>
      <ResumeBuilderContent />
    </Suspense>
  )
}
