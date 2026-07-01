import { redirect } from "next/navigation"

// The dashboard now lives at "/" (see app/page.tsx + components/dashboard/workspace-section.tsx)
// — this route is kept only so old bookmarks/links don't 404.
export default function ResumeDashboardRedirect() {
  redirect("/")
}
