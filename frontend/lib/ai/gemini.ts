import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "")

// Free-tier Gemini model — chosen over Anthropic for $0 cost while testing.
export const RESUME_MODEL = "gemini-2.0-flash"

export async function generateText({
  system,
  prompt,
  maxTokens = 4096,
}: {
  system: string
  prompt: string
  maxTokens?: number
}): Promise<string> {
  const model = genAI.getGenerativeModel({ model: RESUME_MODEL, systemInstruction: system })
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: maxTokens },
  })
  return result.response.text()
}

// Gemini sometimes wraps JSON in prose or a ```json fence despite instructions — strip
// that before parsing instead of trusting the response is bare JSON.
export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : text
  return JSON.parse(candidate.trim())
}
