import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const liquidFont = localFont({
  src: [
    { path: '../../public/fonts/SharpGroteskMedium25.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-liquid',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Michael Vaden',
  description: 'Michael Vaden\'s personal portfolio for software development and AI engineering.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${liquidFont.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}
