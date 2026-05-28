"use client"

import { ResumeHeader } from "@/components/resume/resume-header"
import { SectionNavigator } from "@/components/resume/section-navigator"
import { ResumeEditor } from "@/components/resume/resume-editor"
import { AIAssistantSidebar } from "@/components/resume/ai-assistant-sidebar"
import { useResume } from "@/lib/resume-context"

function ResumeBuilderContent() {
  const { isAIAssistantOpen } = useResume()

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
  return <ResumeBuilderContent />
}
