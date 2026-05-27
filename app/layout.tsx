import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'CareerFlow AI - Autonomous AI Job Application Platform',
  description: 'Upload your resume. Our intelligent AI agent scans thousands of roles, tailors your application for each, applies 24/7, and reaches out to hiring managers directly. You just prepare for interviews.',
  generator: 'v0.app',
  keywords: ['AI job search', 'auto apply jobs', 'job application automation', 'career automation', 'resume optimization', 'AI career agent'],
  openGraph: {
    title: 'CareerFlow AI - Autonomous AI Job Application Platform',
    description: 'Let AI handle your job applications while you focus on interviews. Apply to hundreds of matched roles automatically.',
    type: 'website',
    siteName: 'CareerFlow AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerFlow AI - Autonomous AI Job Application Platform',
    description: 'Let AI handle your job applications while you focus on interviews.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
