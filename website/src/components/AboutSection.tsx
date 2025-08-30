'use client'

import { motion, type Variants } from 'framer-motion'

const textParent: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
}

const textChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function AboutSection() {
  return (
    <section className='min-h-screen w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-3 sm:px-4 lg:px-24 py-12'>
      {/* Left: animated text (wider container) */}
      <motion.div
        className='max-w-2xl'
        variants={textParent}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.75, margin: '-10% 0px -10% 0px' }}
      >
        <motion.h1
          variants={textChild}
          className='text-2xl sm:text-3xl font-semibold tracking-tight text-black dark:text-white'
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial' }}
        >
          Salutations 👋
        </motion.h1>
        <motion.p variants={textChild} className='mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed'>
          I'm Michael, a senior CS student at Georgia Tech with concentrations in Intelligence and Systems and
          Architecture. From early on I've been drawn to technology, and I've harbored a lifelong passion for tinkering.
          I would tinker—because I have an insatiable need to understand how things work.
        </motion.p>
        <motion.p variants={textChild} className='mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed'>
          I've built my own guitar, I fix my own car, and I've coded numerous personal apps that live quietly on my
          devices (and a few that are out there in the world). My endeavors in my field have allowed me to experiment
          in diverse areas of Computer Science from full-stack web programming and UI design to systems programming to
          graphics programming.
        </motion.p>
        <motion.p variants={textChild} className='mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed'>
          When I'm not at work or study, I can be found exploring music, traveling to far reaching areas of the world,
          reading some classics, and watching Studio Ghibli films.
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
