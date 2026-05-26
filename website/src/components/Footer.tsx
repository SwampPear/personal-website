'use client'

import Link from 'next/link'

const MONO = `'SF Mono', ui-monospace, 'Cascadia Mono', 'Consolas', 'Menlo', monospace`

const LINKS = [
  { label: 'email',    href: 'mailto:michaelvaden.mjv@gmail.com' },
  { label: 'github',   href: 'https://github.com/SwampPear'      },
  { label: 'linkedin', href: 'https://linkedin.com/in/michaeljvaden' },
  { label: 'cv',       href: '/michael_vaden_resume.pdf'          },
]

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-white/5 px-6 sm:px-10 lg:px-24 py-8"
      style={{ background: '#080808', fontFamily: MONO }}
    >
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[11px] text-neutral-700 tracking-wide">
          © {new Date().getFullYear()} Michael Vaden
        </span>

        <div className="flex items-center gap-6">
          {LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith('http') || href.startsWith('mailto') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
              className="text-[11px] text-neutral-700 hover:text-neutral-300 transition-colors duration-150 tracking-wide"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
