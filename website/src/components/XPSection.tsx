'use client'

import AsciiReveal from '@/components/AsciiReveal'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'

const MONO = `'SF Mono', ui-monospace, 'Cascadia Mono', 'Consolas', 'Menlo', monospace`

type Item = {
  id:     string
  kind:   'exp' | 'proj'
  title:  string
  org?:   string
  period?: string
  tags?:  string[]
  blurb:  string
  href?:  string
}

const DATA: Item[] = [
  {
    id: 'exp-1', kind: 'exp',
    title: 'Data Co-Op, Tools & Tech', org: 'Delta', period: 'Sep 2023 – May 2025',
    tags: ['AWS', 'Lake Formation', 'Analytics'],
    blurb: 'Architected AWS data pipelines and dashboards for multi-TB datasets.',
    href: 'https://www.delta.com',
  },
  {
    id: 'exp-2', kind: 'exp',
    title: 'SWE Intern', org: 'University of Georgia', period: 'Jan 2022 – Dec 2022',
    tags: ['Django', 'Slurm', 'HPC'],
    blurb: 'Implemented platform for HPC resource provisioning and research group management.',
    href: 'https://gacrc.uga.edu/',
  },
  {
    id: 'exp-3', kind: 'exp',
    title: 'Electrical / Fabrication Specialist', org: 'Black Dog Customs', period: 'May 2019 – May 2021',
    tags: ['CAD', 'Electronics', 'Fabrication'],
    blurb: 'Developed manufacturing processes and products for various automotive applications.',
    href: 'https://www.blackdogcustoms.com',
  },
  {
    id: 'exp-4', kind: 'exp',
    title: 'Web Lead', org: 'Georgia Tech IFC', period: 'Sep 2024 – Nov 2024',
    tags: ['Next.js', 'NGINX', 'UI'],
    blurb: 'Built modern council site with clean information architecture.',
    href: 'https://www.gatechifc.org/',
  },
  {
    id: 'proj-1', kind: 'proj',
    title: 'Polygnome', org: 'Personal', period: '2024 – Present',
    tags: ['Electron', 'Next.js', 'Go', 'Fiber', 'AI Systems'],
    blurb: 'Desktop app for composing and executing structured AI tasks via composable thought chains.',
    href: 'https://github.com/SwampPear/polygnome',
  },
  {
    id: 'proj-2', kind: 'proj',
    title: 'Blam (Language & Compiler)', org: 'Personal', period: 'Aug 2025',
    tags: ['C++', 'LLVM', 'Compilers', 'EBNF'],
    blurb: 'Experimental language with a formal EBNF grammar and LLVM-based compiler in C++.',
    href: 'https://github.com/SwampPear/blam',
  },
  {
    id: 'proj-3', kind: 'proj',
    title: 'Personal Website', org: 'Portfolio', period: 'May 2025',
    tags: ['Next.js', 'Tailwind', 'WebGL'],
    blurb: 'Modern portfolio featuring custom WebGL ASCII art, koi particle system, and DPR-aware rendering.',
    href: 'https://github.com/SwampPear/personal-website',
  },
  {
    id: 'proj-4', kind: 'proj',
    title: 'Djinn Code Generation CLI', org: 'Personal', period: '2024',
    tags: ['Rust', 'CLI', 'Codegen', 'NLP'],
    blurb: 'Rust-based CLI for automated code generation with flexible templating and NLP orchestration.',
    href: 'https://github.com/SwampPear/djinn',
  },
  {
    id: 'proj-5', kind: 'proj',
    title: 'Graph of Experts Model', org: 'Research', period: '2024 – Present',
    tags: ['ML Research', 'Mixture of Experts', 'Graphs'],
    blurb: 'Ongoing research into modular MoE architectures with expert traversal as a trainable graph.',
    href: 'https://github.com/SwampPear/goe',
  },
]

const rowVariants: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4 } },
}

const listVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

export default function XPSection() {
  return (
    <section
      id="xp"
      className="w-full border-t border-white/5 px-6 sm:px-10 lg:px-24 py-20"
      style={{ background: '#080808', fontFamily: MONO }}
    >
      <div className="mx-auto max-w-5xl">

        {/* Label */}
        <p className="text-xs tracking-[0.35em] text-neutral-600 uppercase mb-12">
          <AsciiReveal delay={0.05}>experience / projects</AsciiReveal>
        </p>

        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="divide-y divide-white/5"
        >
          {DATA.map(({ id, kind, title, org, period, tags, blurb, href }) => {
            const external = href?.startsWith('http')

            return (
              <motion.div key={id} variants={rowVariants}>
                <Link
                  href={href ?? '#'}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer noopener' : undefined}
                  className="group block py-6"
                  style={{ cursor: href ? 'pointer' : 'default' }}
                >
                  {/* top row: kind badge + title + period */}
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[10px] tracking-[0.25em] text-neutral-700 uppercase shrink-0">
                      {kind}
                    </span>
                    <span className="text-sm text-neutral-200 group-hover:text-white transition-colors duration-150">
                      {title}
                    </span>
                    {(org || period) && (
                      <span className="text-xs text-neutral-600 ml-auto shrink-0">
                        {[org, period].filter(Boolean).join('  ·  ')}
                      </span>
                    )}
                  </div>

                  {/* blurb */}
                  <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 group-hover:text-neutral-500 transition-colors duration-150">
                    {blurb}
                  </p>

                  {/* tags */}
                  {tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {tags.map(t => (
                        <span key={t} className="text-[10px] text-neutral-700 tracking-wide">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
