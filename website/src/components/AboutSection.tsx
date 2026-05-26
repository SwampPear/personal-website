'use client'

import AsciiReveal from '@/components/AsciiReveal'
import { motion, type Variants } from 'framer-motion'

const MONO = `'SF Mono', ui-monospace, 'Cascadia Mono', 'Consolas', 'Menlo', monospace`

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const BIO = [
  `I'm Michael, studying CS at Georgia Tech focusing in Intelligence and Systems \
and Architecture. From early on I've been drawn to technology, and I've harbored \
a lifelong passion for tinkering. The need to understand how things tick is central \
to my life.`,
  `Over the years I've had the opportunity to explore many corners of computer \
science — from web and graphics programming, to systems and compiler work, to CAD \
and electronics, to big data architectures and analytics. I see each project as a \
platform for learning and connecting the dots across disciplines.`,
  `When I'm not at work or study, I can be found exploring music, traveling, \
reading some classics, and watching some of my favorites.`,
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full border-t border-white/5 px-6 sm:px-10 lg:px-24 py-20"
      style={{ background: '#080808', fontFamily: MONO }}
    >
      <div className="mx-auto max-w-5xl">

        {/* Label */}
        <p className="text-xs tracking-[0.35em] text-neutral-600 uppercase mb-12">
          <AsciiReveal delay={0.05}>about</AsciiReveal>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-14 items-start">

          {/* Text */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-5"
          >
            {BIO.map((para, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-sm leading-relaxed text-neutral-400"
              >
                {para}
              </motion.p>
            ))}
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/me.png"
              alt="Michael Vaden"
              className="w-full object-cover grayscale opacity-50"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
