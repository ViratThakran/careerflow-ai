"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useResume } from "@/lib/resume-context"
import { 
  Sparkles, Target, Check, BarChart3, MessageSquare, Wand2,
  Send, Bot, User, Loader2, ClipboardPaste, X, ChevronRight
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAssistantSidebar() {
  const { isAIAssistantOpen, setIsAIAssistantOpen, resume, atsScore } = useResume()
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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I've analyzed your resume and found a few areas we can improve. Your professional summary could be more impactful - would you like me to rewrite it with stronger action verbs?",
        "Great question! Based on your experience, I'd recommend highlighting your leadership skills more prominently. Your role at the previous company shows strong team management abilities.",
        "I noticed your skills section could use some optimization for ATS systems. Let me suggest adding some industry-standard keywords that match your target roles.",
        "Looking at your work experience, I can help you quantify your achievements. For example, 'Managed team' could become 'Led cross-functional team of 8, delivering 15% productivity increase.'",
      ]
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
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
            <div className="w-8 h-8 rounded-lg bg-[rgba(0,240,255,0.2)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI Career Assistant</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs text-[#10B981]">Ready</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAIAssistantOpen(false)}
            className="p-1.5 text-[#6B7280] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 p-1 bg-[rgba(255,255,255,0.05)] rounded-lg">
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
                  ? "bg-[#00F0FF] text-[#050505]"
                  : "text-[#9CA3AF] hover:text-white"
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
            <OptimizeTab key="optimize" atsScore={atsScore} />
          )}
          {activeTab === "templates" && (
            <TemplatesTab key="templates" />
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
    <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[rgba(255,255,255,0.05)] text-[#9CA3AF] text-xs hover:text-[#00F0FF] hover:bg-[rgba(0,240,255,0.1)] transition-all">
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
                  : "bg-[rgba(0,240,255,0.2)]"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-[#8B5CF6]" />
              ) : (
                <Bot className="w-4 h-4 text-[#00F0FF]" />
              )}
            </div>
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm ${
                message.role === "user"
                  ? "bg-[rgba(139,92,246,0.2)] text-white"
                  : "bg-[rgba(255,255,255,0.05)] text-[#E5E7EB]"
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
            <div className="w-7 h-7 rounded-full bg-[rgba(0,240,255,0.2)] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#00F0FF]" />
            </div>
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-bounce" style={{ animationDelay: "300ms" }} />
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
            className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4B5563] outline-none focus:border-[#00F0FF] transition-colors"
          />
          <button
            onClick={onSend}
            className="p-2 bg-[#00F0FF] text-[#050505] rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function OptimizeTab({ atsScore }: { atsScore: any }) {
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchScore, setMatchScore] = useState<number | null>(null)

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setMatchScore(Math.floor(Math.random() * 30) + 65)
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {/* Job Description Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#9CA3AF]">Paste Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to optimize your resume..."
          className="w-full h-32 bg-[rgba(255,255,255,0.02)] border border-[var(--border-subtle)] rounded-lg p-3 text-sm text-white placeholder:text-[#4B5563] outline-none focus:border-[#00F0FF] resize-none transition-colors"
        />
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00F0FF] text-[#050505] rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              Analyze Match
            </>
          )}
        </button>
      </div>

      {/* Match Score */}
      {matchScore !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-lg bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.2)]"
        >
          <div className="text-center mb-3">
            <div className="text-4xl font-bold text-[#00F0FF]">{matchScore}%</div>
            <div className="text-sm text-[#9CA3AF]">Job Match Score</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9CA3AF]">Skills Match</span>
              <span className="text-[#10B981]">8/10 found</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9CA3AF]">Keywords</span>
              <span className="text-[#F59E0B]">5 missing</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9CA3AF]">Experience Level</span>
              <span className="text-[#10B981]">Good match</span>
            </div>
          </div>
          <button className="w-full mt-4 py-2 text-sm text-[#00F0FF] border border-[#00F0FF] rounded-lg hover:bg-[rgba(0,240,255,0.1)] transition-colors">
            Apply All Optimizations
          </button>
        </motion.div>
      )}

      {/* Missing Keywords */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-[#9CA3AF]">Suggested Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {["Agile", "Scrum", "CI/CD", "AWS", "Kubernetes"].map((keyword) => (
            <button
              key={keyword}
              className="px-2.5 py-1 rounded-full text-xs bg-[rgba(139,92,246,0.2)] text-[#8B5CF6] hover:bg-[rgba(139,92,246,0.3)] transition-colors"
            >
              + {keyword}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function TemplatesTab() {
  const templates = [
    { id: "modern-1", name: "Modern Clean", category: "Modern", atsScore: 98 },
    { id: "minimal-1", name: "Minimal Pro", category: "Minimal", atsScore: 96 },
    { id: "creative-1", name: "Creative Edge", category: "Creative", atsScore: 85 },
    { id: "technical-1", name: "Tech Focus", category: "Technical", atsScore: 97 },
    { id: "executive-1", name: "Executive", category: "Executive", atsScore: 94 },
    { id: "academic-1", name: "Academic CV", category: "Academic", atsScore: 92 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto p-4"
    >
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--border-subtle)] hover:border-[#00F0FF] transition-all text-left group"
          >
            {/* Placeholder for template preview */}
            <div className="aspect-[3/4] rounded bg-[rgba(255,255,255,0.05)] mb-2 flex items-center justify-center">
              <div className="w-12 h-16 bg-[rgba(0,240,255,0.1)] rounded" />
            </div>
            <div className="text-xs font-medium text-white truncate">{template.name}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-[#6B7280]">{template.category}</span>
              <span className="text-[10px] text-[#10B981]">{template.atsScore}% ATS</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Color Customization */}
      <div className="mt-6 space-y-2">
        <h4 className="text-xs font-medium text-[#9CA3AF]">Accent Color</h4>
        <div className="flex gap-2">
          {["#00F0FF", "#8B5CF6", "#10B981", "#F43F5E", "#D4AF37"].map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white transition-colors"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
