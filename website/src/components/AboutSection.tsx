'use client'

import { motion, type Variants } from 'framer-motion';
import LiquidWord from './LiquidWord';

/* --- mini liquid word just for headings (no hover effects) --- */
function LiquidWordHeading({
  word = 'Salutations',
  className = ''
}: { word?: string; className?: string }) {
  return (
    <div className={['relative select-none', className].join(' ')}>
      <motion.svg
        viewBox="0 0 800 180"
        className="w-full h-auto"
        style={{ overflow: 'visible' }}
        preserveAspectRatio="xMidYMid meet"
        aria-label={word}
      >
        <defs>
          {/* Expanded bounds so warping never clips */}
          <filter id="liquid-filter-heading" filterUnits="userSpaceOnUse" x={-120} y={-120} width={1040} height={420}>
            <motion.feTurbulence
              type="fractalNoise"
              baseFrequency="0.006 0.008"
              numOctaves={2}
              seed={5}
              result="noise"
              animate={{ baseFrequency: ['0.006 0.008', '0.0075 0.010', '0.006 0.008'] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale={10} />
          </filter>
        </defs>

        <motion.text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, ui-sans-serif'
          fontWeight={800}
          letterSpacing="-0.02em"
          fill="currentColor"                      /* follows Tailwind text color */
          filter="url(#liquid-filter-heading)"
          style={{ fontSize: 72 }}                 /* smaller for header */
          className="text-black dark:text-white"
        >
          {word}
        </motion.text>
      </motion.svg>
    </div>
  )
}

/* --- your existing variants --- */
const textParent: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
}

const textChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
}

export default function AboutSection() {
  return (
    <section id="about" className='min-h-screen w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-3 sm:px-4 lg:px-24 py-12'>
      {/* Left: animated text (wider container) */}
      <motion.div
        className='max-w-2xl'
        variants={textParent}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.75, margin: '-10% 0px -10% 0px' }}
      >
        {/* Liquid header + the wave emoji */}
        <motion.div variants={textChild} className="flex items-baseline gap-2">
          <LiquidWord word="Salutations" className="-ml-23 lg:-ml-8 -mb-6" />
        </motion.div>

        <motion.p variants={textChild} className='mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed'>
          I'm Michael, a senior CS student at
          <span
            className="font-bold bg-gradient-to-r from-[#B3A369] to-[#C9A973] bg-clip-text text-transparent"
          >
            &nbsp;Georgia Tech&nbsp;
          </span>
          focusing in Intelligence and Systems and Architecture. From early on I've been drawn to technology, and I've
          harbored a lifelong passion for tinkering. I would say the need to understand how things tick is central to my life.
        </motion.p>
        <motion.p variants={textChild} className='mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed'>
          Over the years I've had the opportunity to explore many corners of computer science, from web and graphics programming,
          to systems and compiler programming, to CAD and electrical work, to big data architecting and analytics. I see each
          project I approach as a platform for learning and connecting the dots across disciplines, and I truly love what I do ❤️.
        </motion.p>
        <motion.p variants={textChild} className='mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed'>
          When I'm not at work or study, I can be found exploring music, traveling the world, reading some classics, and
          watching some of my favorites.
        </motion.p>
      </motion.div>

      {/* Right: image reveal */}
      <div className='w-full flex md:justify-end'>
        <motion.div
          initial={{ scaleX: 0, height: '10px' }}
          whileInView={{ scaleX: [0, 1, 1], height: ['10px', '10px', '500px'] }}
          transition={{ duration: 0.9, times: [0, 0.55, 1], ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.75, margin: '-10% 0px -10% 0px' }}
          className='relative overflow-hidden rounded-2xl shadow-lg shadow-black/10 dark:shadow-white/5 bg-neutral-200/40 dark:bg-neutral-800/40 backdrop-blur-sm'
          style={{ width: '100%', maxWidth: 520, originX: 0.5, willChange: 'transform,height' }}
        >
          <motion.img
            src='/images/me.png'
            alt='picture of Michael'
            className='block w-full h-full object-cover'
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            viewport={{ once: true, amount: 0.75, margin: '-10% 0px -10% 0px' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
