export type AtsProvider = "greenhouse" | "lever" | null

export function detectAtsFromUrl(url: string): AtsProvider {
  if (/boards\.greenhouse\.io|job-boards\.greenhouse\.io|greenhouse\.io\/.*\/jobs/.test(url)) {
    return "greenhouse"
  }
  if (/jobs\.lever\.co/.test(url)) {
    return "lever"
  }
  return null
}
