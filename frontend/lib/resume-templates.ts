export type TemplateFamily = "modern" | "minimal" | "executive"

// The template picker (app/resume/templates/page.tsx) offers 8 named templates as
// marketing-friendly choices, but they render as one of 3 real distinct layouts —
// mapped here rather than building 8 fully separate layouts.
const TEMPLATE_FAMILY_MAP: Record<string, TemplateFamily> = {
  "modern-clean": "modern",
  "minimal-pro": "minimal",
  "creative-edge": "minimal",
  "tech-focus": "modern",
  "executive-suite": "executive",
  "academic-cv": "executive",
  "startup-bold": "modern",
  "healthcare-pro": "modern",
}

export function getTemplateFamily(templateId: string | undefined): TemplateFamily {
  if (!templateId) return "modern"
  return TEMPLATE_FAMILY_MAP[templateId] ?? "modern"
}
