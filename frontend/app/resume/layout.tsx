import { ResumeProvider } from "@/lib/resume-context"

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ResumeProvider>
      <div className="h-screen bg-[var(--bg-primary)] overflow-hidden">
        {children}
      </div>
    </ResumeProvider>
  )
}
