'use client'

import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Briefcase, FolderGit2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import LiquidWord from './LiquidWord'
import SegmentedButton from './SegmentedButton'


/* ---------- Data & variants ---------- */
type Item = {
  id: string
  kind: 'experience' | 'project'
  title: string
  org?: string
  period?: string
  tags?: string[]
  blurb: string
  href?: string
}

const DATA: Item[] = [
  { id: 'exp-1', kind: 'experience', title: 'Data Co-Op, Tools & Tech', org: 'Delta', period: 'Sep 2023 – May 2025', tags: ['AWS', 'Lake Formation', 'Athena'], blurb: 'Architected AWS data pipelines and dashboards for multi-TB datasets.', href: '#' },
  { id: 'exp-2', kind: 'experience', title: 'IFC Web Lead', org: 'Georgia Tech IFC', period: '2024 – 2025', tags: ['Next.js', 'Design', 'Perf'], blurb: 'Built modern council site with clean IA and micro-interactions.', href: '#' },
  { id: 'proj-1', kind: 'project', title: 'Personal Site', org: 'Portfolio', period: '2025', tags: ['Next.js', 'Framer Motion', 'Tailwind'], blurb: 'Playful interactions, glassmorphism, and crisp typography.', href: '#' },
  { id: 'proj-2', kind: 'project', title: 'Blam (Lang/Compiler)', org: 'Personal', period: '2025', tags: ['C++', 'LLVM', 'Parsers'], blurb: 'Custom tokenizer + AST + IR experiments focused on ergonomics.', href: '#' },
  { id: 'proj-3', kind: 'project', title: 'THE ACE', org: 'Ticketing', period: '2024 – 2025', tags: ['NFC', 'Tokenomics', 'Mobile'], blurb: 'Wallet-friendly NFC card for fair ticketing & ID verification.', href: '#' }
]

type Filter = 'both' | 'experience' | 'projects'

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
}

/* ---------- Section ---------- */
export default function XPSection() {
  const [filter, setFilter] = useState<Filter>('both')

  const items = useMemo(() => {
    if (filter === 'both') return DATA
    if (filter === 'experience') return DATA.filter(i => i.kind === 'experience')
    return DATA.filter(i => i.kind === 'project')
  }, [filter])

  return (
    <section id='xp' className='min-h-screen w-full px-3 sm:px-4 lg:px-24 py-12'>
      {/* Header + Segmented filter */}
      <div className="mx-auto max-w-6xl mb-4 flex flex-col items-center">
        {/* Centered smaller liquid word */}
        <LiquidWord
          word="Experience / Projects"
          className="w-full max-w-md text-center"  // 👈 smaller max width
        />

        {/* Filter bar below, aligned right */}
        <div className="mt-2 w-full flex justify-end">
          <div className="rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur-xl backdrop-saturate-150 
                    shadow-lg shadow-black/5 border border-black/5 dark:border-white/5 p-1 inline-flex">
            <SegmentedButton
              active={filter === 'both'}
              onClick={() => setFilter('both')}
              label="Both"
            />
            <SegmentedButton
              active={filter === 'experience'}
              onClick={() => setFilter('experience')}
              icon={<Briefcase className="h-4 w-4" />}
              label="Experience"
            />
            <SegmentedButton
              active={filter === 'projects'}
              onClick={() => setFilter('projects')}
              icon={<FolderGit2 className="h-4 w-4" />}
              label="Projects"
            />
          </div>
        </div>
      </div>




      {/* Grid */}
      <motion.div
        className='mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
        variants={containerVariants}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.5 }}
        layout
      >
        <AnimatePresence initial={false} mode='popLayout'>
          {items.map(item => (
            <motion.article
              key={item.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }}
              className='group relative rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl backdrop-saturate-150 border border-black/5 dark:border-white/5 shadow-lg shadow-black/5 overflow-hidden'
            >
              <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5' />
              <div className='relative p-5 sm:p-6 flex flex-col gap-3'>
                <div className='flex items-start justify-between gap-3'>
                  <h3 className='text-lg font-semibold text-black dark:text-white leading-tight'>{item.title}</h3>
                  <span className='rounded-md px-2 py-0.5 text-xs font-medium bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200'>
                    {item.kind === 'experience' ? 'Experience' : 'Project'}
                  </span>
                </div>

                {(item.org || item.period) && (
                  <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                    {[item.org, item.period].filter(Boolean).join(' • ')}
                  </p>
                )}

                <p className='text-neutral-800 dark:text-neutral-200'>{item.blurb}</p>

                {item.tags?.length ? (
                  <div className='mt-1 flex flex-wrap gap-2'>
                    {item.tags.map(t => (
                      <span key={t} className='rounded-full border border-black/10 dark:border-white/10 bg-white/30 dark:bg-white/5 px-2 py-1 text-xs text-neutral-800 dark:text-neutral-200'>
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                {item.href ? (
                  <a href={item.href} className='mt-3 inline-flex items-center text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:underline'>
                    View details →
                  </a>
                ) : null}
              </div>
              <div className='absolute inset-0 transition-transform duration-300 group-hover:-translate-y-0.5' />
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}


