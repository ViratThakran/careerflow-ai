import { ReactNode } from "react"
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer"
import type { Style } from "@react-pdf/types"
import { Resume } from "@/lib/resume-types"
import { getTemplateFamily, TemplateFamily } from "@/lib/resume-templates"

// Three real, distinct layouts (not just a color swap) — modern/minimal/executive —
// selected via resume.templateId through lib/resume-templates.ts. The 8 named options on
// the template picker page each map to one of these three families.
const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#111111" },
  pageExecutive: { padding: 44, fontSize: 10, fontFamily: "Times-Roman", color: "#111111" },
  name: { fontSize: 20, fontWeight: 700 },
  nameExecutive: { fontSize: 24, fontWeight: 700, textAlign: "center", letterSpacing: 1 },
  title: { fontSize: 12, marginTop: 2, color: "#374151" },
  titleExecutive: { fontSize: 12, marginTop: 4, color: "#374151", textAlign: "center" },
  contactRow: { flexDirection: "row", gap: 8, marginTop: 6, fontSize: 9, color: "#4B5563" },
  contactRowExecutive: { flexDirection: "row", gap: 8, marginTop: 6, fontSize: 9, color: "#4B5563", justifyContent: "center" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#D1D5DB", marginTop: 12 },
  section: { marginTop: 14 },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  sectionTitleExecutive: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textAlign: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#9CA3AF",
    paddingBottom: 4,
  },
  summary: { fontSize: 10, lineHeight: 1.4 },
  entry: { marginBottom: 8 },
  entryHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  entryTitle: { fontSize: 10.5, fontWeight: 700 },
  entryMeta: { fontSize: 9, color: "#4B5563" },
  bullet: { fontSize: 9.5, lineHeight: 1.4, marginTop: 2, marginLeft: 10 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 2 },
  skillChip: { fontSize: 9, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, backgroundColor: "#F3F4F6" },
  // Minimal (two-column) layout
  minimalPage: { padding: 0, fontSize: 10, fontFamily: "Helvetica", color: "#111111", flexDirection: "row" },
  sidebar: { width: "32%", backgroundColor: "#F3F4F6", padding: 24, minHeight: "100%" },
  mainCol: { width: "68%", padding: 28 },
  sidebarSkill: { fontSize: 9, marginBottom: 3 },
})

function dateRange(start: string, end: string) {
  return `${start || ""} - ${end || ""}`.trim()
}

const SIDEBAR_SECTION_TYPES = new Set(["skills", "languages", "certifications"])

function renderSection(type: string, resume: Resume, accent: string, titleStyle: Style = styles.sectionTitle): ReactNode {
  switch (type) {
    case "summary":
      return resume.summary ? (
        <View key="summary" style={styles.section}>
          <Text style={[titleStyle, { color: accent }]}>Summary</Text>
          <Text style={styles.summary}>{resume.summary}</Text>
        </View>
      ) : null

    case "experience":
      return resume.experience.length > 0 ? (
        <View key="experience" style={styles.section}>
          <Text style={[titleStyle, { color: accent }]}>Experience</Text>
          {resume.experience.map((exp) => (
            <View key={exp.id} style={styles.entry}>
              <View style={styles.entryHeaderRow}>
                <Text style={styles.entryTitle}>
                  {exp.role} · {exp.company}
                </Text>
                <Text style={styles.entryMeta}>{dateRange(exp.startDate, exp.endDate)}</Text>
              </View>
              {exp.location && <Text style={styles.entryMeta}>{exp.isRemote ? "Remote" : exp.location}</Text>}
              {exp.achievements.map((a, i) => (
                <Text key={i} style={styles.bullet}>
                  • {a}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ) : null

    case "education":
      return resume.education.length > 0 ? (
        <View key="education" style={styles.section}>
          <Text style={[titleStyle, { color: accent }]}>Education</Text>
          {resume.education.map((edu) => (
            <View key={edu.id} style={styles.entry}>
              <View style={styles.entryHeaderRow}>
                <Text style={styles.entryTitle}>
                  {edu.degree}
                  {edu.field ? `, ${edu.field}` : ""} · {edu.institution}
                </Text>
                <Text style={styles.entryMeta}>{dateRange(edu.startDate, edu.endDate)}</Text>
              </View>
              {edu.gpa && <Text style={styles.entryMeta}>GPA: {edu.gpa}</Text>}
            </View>
          ))}
        </View>
      ) : null

    case "skills":
      return resume.skills.length > 0 ? (
        <View key="skills" style={styles.section}>
          <Text style={[titleStyle, { color: accent }]}>Skills</Text>
          <View style={styles.skillsRow}>
            {resume.skills.map((s) => (
              <Text key={s.id} style={styles.skillChip}>
                {s.name}
              </Text>
            ))}
          </View>
        </View>
      ) : null

    case "projects":
      return resume.projects.length > 0 ? (
        <View key="projects" style={styles.section}>
          <Text style={[titleStyle, { color: accent }]}>Projects</Text>
          {resume.projects.map((p) => (
            <View key={p.id} style={styles.entry}>
              <Text style={styles.entryTitle}>{p.name}</Text>
              {p.description && <Text style={styles.bullet}>{p.description}</Text>}
              {p.technologies.length > 0 && <Text style={styles.entryMeta}>{p.technologies.join(", ")}</Text>}
            </View>
          ))}
        </View>
      ) : null

    case "certifications":
      return resume.certifications.length > 0 ? (
        <View key="certifications" style={styles.section}>
          <Text style={[titleStyle, { color: accent }]}>Certifications</Text>
          {resume.certifications.map((c) => (
            <Text key={c.id} style={styles.bullet}>
              {c.name} — {c.issuer} ({c.date})
            </Text>
          ))}
        </View>
      ) : null

    case "languages":
      return resume.languages.length > 0 ? (
        <View key="languages" style={styles.section}>
          <Text style={[titleStyle, { color: accent }]}>Languages</Text>
          <Text style={styles.summary}>{resume.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</Text>
        </View>
      ) : null

    case "awards":
      return resume.awards.length > 0 ? (
        <View key="awards" style={styles.section}>
          <Text style={[titleStyle, { color: accent }]}>Awards</Text>
          {resume.awards.map((a) => (
            <Text key={a.id} style={styles.bullet}>
              {a.title} — {a.issuer} ({a.date})
            </Text>
          ))}
        </View>
      ) : null

    case "publications":
      return resume.publications.length > 0 ? (
        <View key="publications" style={styles.section}>
          <Text style={[titleStyle, { color: accent }]}>Publications</Text>
          {resume.publications.map((p) => (
            <Text key={p.id} style={styles.bullet}>
              {p.title} — {p.publisher} ({p.date})
            </Text>
          ))}
        </View>
      ) : null

    default:
      return null
  }
}

function ContactHeader({ resume, accent, family }: { resume: Resume; accent: string; family: TemplateFamily }) {
  const isExecutive = family === "executive"
  return (
    <>
      <Text style={[isExecutive ? styles.nameExecutive : styles.name, { color: accent }]}>
        {resume.personalInfo.firstName} {resume.personalInfo.lastName}
      </Text>
      {resume.personalInfo.title && <Text style={isExecutive ? styles.titleExecutive : styles.title}>{resume.personalInfo.title}</Text>}
      <View style={isExecutive ? styles.contactRowExecutive : styles.contactRow}>
        {resume.personalInfo.email && <Text>{resume.personalInfo.email}</Text>}
        {resume.personalInfo.phone && <Text>{resume.personalInfo.phone}</Text>}
        {resume.personalInfo.location && <Text>{resume.personalInfo.location}</Text>}
        {resume.personalInfo.linkedin && <Link src={resume.personalInfo.linkedin}>LinkedIn</Link>}
        {resume.personalInfo.github && <Link src={resume.personalInfo.github}>GitHub</Link>}
        {resume.personalInfo.portfolio && <Link src={resume.personalInfo.portfolio}>Portfolio</Link>}
      </View>
      {isExecutive && <View style={styles.divider} />}
    </>
  )
}

export function ResumePdfDocument({ resume }: { resume: Resume }) {
  const accent = resume.accentColor || "#00838F"
  const family = getTemplateFamily(resume.templateId)
  const orderedSections = [...resume.sections]
    .filter((s) => s.type !== "personal" && s.isVisible)
    .sort((a, b) => a.order - b.order)

  if (family === "minimal") {
    const sidebarSections = orderedSections.filter((s) => SIDEBAR_SECTION_TYPES.has(s.type))
    const mainSections = orderedSections.filter((s) => !SIDEBAR_SECTION_TYPES.has(s.type))

    return (
      <Document title={resume.name}>
        <Page size="A4" style={styles.minimalPage}>
          <View style={styles.sidebar}>
            <Text style={[styles.name, { color: accent, fontSize: 16 }]}>
              {resume.personalInfo.firstName} {resume.personalInfo.lastName}
            </Text>
            {resume.personalInfo.title && <Text style={[styles.title, { fontSize: 9 }]}>{resume.personalInfo.title}</Text>}
            <View style={{ marginTop: 10, gap: 3 }}>
              {resume.personalInfo.email && <Text style={styles.sidebarSkill}>{resume.personalInfo.email}</Text>}
              {resume.personalInfo.phone && <Text style={styles.sidebarSkill}>{resume.personalInfo.phone}</Text>}
              {resume.personalInfo.location && <Text style={styles.sidebarSkill}>{resume.personalInfo.location}</Text>}
              {resume.personalInfo.linkedin && <Text style={styles.sidebarSkill}>{resume.personalInfo.linkedin}</Text>}
            </View>
            {sidebarSections.map((s) => renderSection(s.type, resume, accent))}
          </View>
          <View style={styles.mainCol}>{mainSections.map((s) => renderSection(s.type, resume, accent))}</View>
        </Page>
      </Document>
    )
  }

  return (
    <Document title={resume.name}>
      <Page size="A4" style={family === "executive" ? styles.pageExecutive : styles.page}>
        <ContactHeader resume={resume} accent={accent} family={family} />
        {orderedSections.map((section) =>
          renderSection(section.type, resume, accent, family === "executive" ? styles.sectionTitleExecutive : styles.sectionTitle)
        )}
      </Page>
    </Document>
  )
}
