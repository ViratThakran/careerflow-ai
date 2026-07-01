"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useResume } from "@/lib/resume-context"
import { ATSScore, Resume } from "@/lib/resume-types"
import { getTemplateFamily } from "@/lib/resume-templates"
import {
  Sparkles, Target, Check, BarChart3, MessageSquare, Wand2,
  Send, Bot, User, Loader2, ClipboardPaste, X, ChevronRight, ArrowRight
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAssistantSidebar() {
  const { isAIAssistantOpen, setIsAIAssistantOpen, resume, setResume, atsScore, resumeId } = useResume()
  const [activeTab, setActiveTab] = useState<"chat" | "optimize" | "templates">("chat")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI Career Assistant. I can help you optimize your resume, suggest improvements, and tailor it for specific jobs. What would you like to work on?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInputValue("")
    setIsTyping(true)

    if (!resumeId) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I need your resume saved first — upload or open a saved resume, then come back and ask me anything about it.",
          timestamp: new Date(),
        },
      ])
      setIsTyping(false)
      return
    }

    try {
      const res = await fetch("/api/resume-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          history: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Chat failed")

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply, timestamp: new Date() },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Sorry, I couldn't respond — ${err instanceof Error ? err.message : "something went wrong"}.`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  if (!isAIAssistantOpen) return null

  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-80 bg-[var(--bg-elevated)] border-l border-[var(--border-subtle)] flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[rgba(17,24,39,0.2)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#111827]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">AI Career Assistant</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs text-[#10B981]">Ready</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAIAssistantOpen(false)}
            className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 p-1 bg-[rgba(0,0,0,0.05)] rounded-lg">
          {[
            { id: "chat", label: "Chat" },
            { id: "optimize", label: "Optimize" },
            { id: "templates", label: "Templates" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-[#111827] text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <ChatTab
              key="chat"
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSend={handleSendMessage}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
            />
          )}
          {activeTab === "optimize" && (
            <OptimizeTab key="optimize" atsScore={atsScore} resumeId={resumeId} />
          )}
          {activeTab === "templates" && (
            <TemplatesTab key="templates" resume={resume} setResume={setResume} />
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <div className="flex flex-wrap gap-2">
          <QuickAction icon={Target} label="Optimize for Job" />
          <QuickAction icon={Check} label="Fix Grammar" />
          <QuickAction icon={BarChart3} label="Add Metrics" />
          <QuickAction icon={MessageSquare} label="Improve Tone" />
          <QuickAction icon={Wand2} label="Full Review" />
        </div>
      </div>
    </motion.aside>
  )
}

function QuickAction({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[rgba(0,0,0,0.05)] text-gray-500 text-xs hover:text-[#111827] hover:bg-[rgba(17,24,39,0.1)] transition-all">
      <Icon className="w-3 h-3" />
      {label}
    </button>
  )
}

function ChatTab({
  messages,
  inputValue,
  setInputValue,
  onSend,
  isTyping,
  messagesEndRef,
}: {
  messages: Message[]
  inputValue: string
  setInputValue: (v: string) => void
  onSend: () => void
  isTyping: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user"
                  ? "bg-[rgba(139,92,246,0.2)]"
                  : "bg-[rgba(17,24,39,0.2)]"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-[#8B5CF6]" />
              ) : (
                <Bot className="w-4 h-4 text-[#111827]" />
              )}
            </div>
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm ${
                message.role === "user"
                  ? "bg-[rgba(139,92,246,0.2)] text-gray-900"
                  : "bg-[rgba(0,0,0,0.05)] text-gray-700"
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            <div className="w-7 h-7 rounded-full bg-[rgba(17,24,39,0.2)] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#111827]" />
            </div>
            <div className="p-3 rounded-lg bg-[rgba(0,0,0,0.05)]">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#111827] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#111827] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#111827] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-[rgba(0,0,0,0.05)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#111827] transition-colors"
          />
          <button
            onClick={onSend}
            className="p-2 bg-[#111827] text-white rounded-lg hover:shadow-[0_0_20px_rgba(17,24,39,0.4)] transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function OptimizeTab({ atsScore, resumeId }: { atsScore: ATSScore; resumeId: string | null }) {
  const { format, keywords, length, readability, contact } = atsScore.breakdown

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {/* Real ATS Score (computed in lib/resume-context.tsx from the current resume content) */}
      <div className="p-4 rounded-lg bg-[rgba(17,24,39,0.05)] border border-[rgba(17,24,39,0.2)]">
        <div className="text-center mb-3">
          <div className="text-4xl font-bold text-[#111827]">{atsScore.total}</div>
          <div className="text-sm text-gray-500">ATS Score</div>
        </div>
        <div className="space-y-2">
          <ScoreRow label="Format" score={format.score} max={format.max} />
          <ScoreRow label="Keywords" score={keywords.score} max={keywords.max} />
          <ScoreRow label="Length" score={length.score} max={length.max} />
          <ScoreRow label="Readability" score={readability.score} max={readability.max} />
          <ScoreRow label="Contact Info" score={contact.score} max={contact.max} />
        </div>
      </div>

      {/* What's actually missing, from the same scoring logic */}
      {(keywords.missing.length > 0 || contact.missing.length > 0) && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-500">To Improve</h4>
          <ul className="space-y-1 text-xs text-gray-700">
            {keywords.missing.map((m, i) => (
              <li key={`kw-${i}`} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#F59E0B]" /> {m}
              </li>
            ))}
            {contact.missing.map((m, i) => (
              <li key={`contact-${i}`} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#F59E0B]" /> Add {m.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Real AI tailoring lives on its own page (calls Claude via /api/tailor) — link
          out instead of duplicating that flow inline in the sidebar. */}
      <Link
        href={resumeId ? `/resume/tailor?resumeId=${resumeId}` : "/resume/tailor"}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#111827] text-white rounded-lg font-medium text-sm hover:shadow-[0_0_20px_rgba(17,24,39,0.4)] transition-all"
      >
        <Target className="w-4 h-4" />
        Tailor for a specific job
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  )
}

function ScoreRow({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className={pct >= 70 ? "text-[#10B981]" : pct >= 40 ? "text-[#F59E0B]" : "text-red-400"}>
        {score}/{max}
      </span>
    </div>
  )
}

const ACCENT_COLORS = ["#111827", "#8B5CF6", "#10B981", "#F43F5E", "#D4AF37"]

const LAYOUTS: { id: string; family: "modern" | "minimal" | "executive"; label: string }[] = [
  { id: "modern-clean", family: "modern", label: "Modern" },
  { id: "minimal-pro", family: "minimal", label: "Minimal" },
  { id: "executive-suite", family: "executive", label: "Executive" },
]

function TemplatesTab({ resume, setResume }: { resume: Resume; setResume: (r: Resume) => void }) {
  const currentFamily = getTemplateFamily(resume.templateId)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto p-4"
    >
      <p className="text-xs text-gray-500 mb-4">
        Pick a layout and accent color — both apply to your live preview and downloaded PDF immediately.
      </p>

      {/* Layout — three real distinct layouts (lib/resume-templates.ts), not just color */}
      <div className="space-y-2 mb-5">
        <h4 className="text-xs font-medium text-gray-500">Layout</h4>
        <div className="grid grid-cols-3 gap-2">
          {LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setResume({ ...resume, templateId: layout.id, updatedAt: new Date() })}
              className={`px-2 py-2 rounded-lg text-xs border transition-colors ${
                currentFamily === layout.family
                  ? "border-[#111827] text-[#111827] bg-[rgba(17,24,39,0.1)]"
                  : "border-[var(--border-subtle)] text-gray-500 hover:text-gray-900"
              }`}
            >
              {layout.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color Customization — wired to the real resume.accentColor field, reflected in
          app/resume/preview and components/resume/resume-pdf-document.tsx */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-500">Accent Color</h4>
        <div className="flex gap-2">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setResume({ ...resume, accentColor: color, updatedAt: new Date() })}
              className="w-8 h-8 rounded-full transition-colors"
              style={{
                backgroundColor: color,
                border: resume.accentColor === color ? "2px solid white" : "2px solid transparent",
              }}
              aria-label={`Set accent color to ${color}`}
            />
          ))}
        </div>
      </div>

      <Link
        href="/resume/preview"
        className="flex items-center justify-center gap-2 w-full mt-6 py-2.5 border border-[#111827] text-[#111827] rounded-lg text-sm hover:bg-[rgba(17,24,39,0.1)] transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        Preview with this color
      </Link>
    </motion.div>
  )
}
