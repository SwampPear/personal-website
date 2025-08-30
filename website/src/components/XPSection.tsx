'use client'

import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Briefcase, FolderGit2 } from 'lucide-react'
import Link from 'next/link'
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

/*



*/


const DATA: Item[] = [
  { id: 'exp-1', kind: 'experience', title: 'Data Co-Op, Tools & Tech', org: 'Delta', period: 'Sep 2023 - May 2025', tags: ['AWS', 'Lake Formation', 'Analytics'], blurb: 'Architected AWS data pipelines and dashboards for multi-TB datasets.', href: '#' },
  { id: 'exp-2', kind: 'experience', title: 'SWE Intern', org: 'University of Georgia', period: 'Jan 2022 - Dec 2022', tags: ['Django', 'Slurm', 'HPC'], blurb: 'Implemented platform for HPC resource provisioning and research group management.', href: '#' },
  { id: 'exp-3', kind: 'experience', title: 'Electrical / Fabrication Specialist', org: 'Black Dog Customs', period: 'May 2019 - May 2021', tags: ['CAD', 'Electronics', 'Fabrication'], blurb: 'Developed manufacturing processes and products for various automotive applications.', href: '#' },
  { id: 'exp-4', kind: 'experience', title: 'Web Lead', org: 'Georgia Tech IFC', period: 'Sep 2024 - Nov 2024', tags: ['Next.js', 'NGINX', 'UI'], blurb: 'Built modern council site with clean IA and interactibility.', href: '#' },
  { id: 'proj-1', kind: 'project', title: 'Personal Site', org: 'Portfolio', period: 'May 2025', tags: ['Next.js', 'WebGL', 'Three.js'], blurb: 'Playful interactions, glassmorphism, crisp typography, and 3D modeling.', href: '#' },
  { id: 'proj-2', kind: 'project', title: 'Blam (Lang/Compiler)', org: 'Personal', period: 'Aug 2025', tags: ['C++', 'LLVM', 'Parsers'], blurb: 'Custom tokenizer + AST + IR experiments focused on ergonomics.', href: '#' }
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
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => {
            const href = item.href ?? '#'
            const external = href.startsWith('http')

            return (
              <Link
                key={item.id}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                aria-label={`${item.title} (${item.kind})`}
                className="group block focus:outline-none"
              >
                <motion.div
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }}
                  whileHover={{ y: -2, scale: 1.005 }}     // 👈 smaller lift & scale
                  whileTap={{ scale: 0.997 }}              // 👈 gentler press-in
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="relative rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl backdrop-saturate-150
                     border border-black/5 dark:border-white/5 shadow-lg shadow-black/5 overflow-hidden
                     cursor-pointer ring-0 focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
                >
                  {/* very soft sheen */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 rotate-12
                       bg-gradient-to-r from-white/5 to-transparent dark:from-white/5"
                    initial={{ x: '-120%' }}
                    whileHover={{ x: '140%' }}
                    transition={{ duration: 1.4, ease: 'easeOut' }} // 👈 slower & smoother
                  />

                  <div className="relative p-5 sm:p-6 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-black dark:text-white leading-tight">
                        {item.title}
                      </h3>
                      <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
                        {item.kind === 'experience' ? 'Experience' : 'Project'}
                      </span>
                    </div>

                    {(item.org || item.period) && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {[item.org, item.period].filter(Boolean).join(' • ')}
                      </p>
                    )}

                    <p className="text-neutral-800 dark:text-neutral-200">{item.blurb}</p>

                    {item.tags?.length ? (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-black/10 dark:border-white/10 bg-white/30 dark:bg-white/5
                               px-2 py-1 text-xs text-neutral-800 dark:text-neutral-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {/* subtle shadow change on hover */}
                  <div className="absolute inset-0 transition-[box-shadow,border-color] duration-300
                          group-hover:shadow-lg group-hover:shadow-black/5
                          group-hover:border-black/10 dark:group-hover:border-white/10" />
                </motion.div>
              </Link>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}


