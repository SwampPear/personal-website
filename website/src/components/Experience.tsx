'use client'

import { motion } from 'framer-motion'

type Entry = {
  title: string
  org: string
  year: string
  href?: string
}

const EXPERIENCE: Entry[] = [
  { title: 'Software Engineer', org: 'Vertice AI', year: 'Apr 2026 – Present', href: 'https://www.verticeanalytics.ai' },
  { title: 'Data Engineering Co-Op, Tools & Tech', org: 'Delta Air Lines', year: 'Sep 2023 – May 2025', href: 'https://www.delta.com' },
  { title: 'Web Lead', org: 'Georgia Tech IFC', year: 'Sep 2024 – Nov 2024', href: 'https://www.gatechifc.org/' },
  { title: 'SWE Intern', org: 'UGA, Georgia Advanced Computing Resource Center', year: 'Jan 2022 – Dec 2022', href: 'https://gacrc.uga.edu/' },
  { title: 'Automotive Electrical Fabrication / Design', org: 'Black Dog Customs', year: 'May 2019 – May 2021', href: 'https://www.blackdogcustoms.com' },
]

function Row({ entry }: { entry: Entry }) {
  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className="shrink-0 truncate font-serif text-[13px] tracking-[0.08em] text-foreground">
          {entry.title}
        </span>
        <span
          aria-hidden
          className="flex-1 border-b border-dotted border-[var(--faint)]"
        />
        <span className="shrink-0 font-serif text-[13px] tracking-[0.08em] text-[var(--muted)]">
          {entry.year}
        </span>
      </div>
      <div className="truncate font-serif text-[13px] tracking-[0.08em] text-[var(--muted)]">
        {entry.org}
      </div>
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      {entry.href ? (
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block py-1"
        >
          {content}
        </a>
      ) : (
        <div className="block py-1">{content}</div>
      )}
    </motion.div>
  )
}

export default function Experience() {
  return (
    <div className="mt-14">
      <div className="font-serif text-[13px] tracking-[0.08em]">
        Over the years I&apos;ve had the chance to work on some cool &thinsp;
        <a href="https://github.com/SwampPear" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">things</a>.
        I learn best through self-play and side projects, but I&apos;ve also had the opportunity to 
        work with some great teams at some great organizations. Here's some highlights:
      </div>
      <div className="mt-4">
        {EXPERIENCE.map((entry) => (
          <Row key={entry.title} entry={entry} />
        ))}
      </div>
    </div>
  )
}
