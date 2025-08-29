'use client'

import { motion } from 'framer-motion'

export default function AboutSection() {
  return (
    <section className='min-h-screen w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-3 sm:px-4 lg:px-24 py-12'>
      {/* Left: greeting + about text */}
      <div className='max-w-xl'>
        <h1
          className='text-2xl sm:text-3xl font-semibold tracking-tight text-black dark:text-white'
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial'
          }}
        >
          Salutations 👋
        </h1>
        <p className='mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed'>
          I build smooth, performant web experiences and playful interactive visuals.
          I’m into TypeScript, Three.js, and systems work—always chasing that clean,
          minimal feel with crisp micro-interactions.
        </p>
      </div>

      {/* Right: animated image reveal */}
      <div className='w-full flex md:justify-end'>
        <motion.div
          initial={{ width: 0, height: 0 }}
          animate={{ width: ['0%', '100%', '100%'], height: ['0px', '0px', '500px'] }}
          transition={{ duration: 0.9, times: [0, 0.55, 1], ease: 'easeInOut' }}
          className='relative overflow-hidden rounded-2xl shadow-lg shadow-black/10 dark:shadow-white/5
                     bg-neutral-200/40 dark:bg-neutral-800/40 backdrop-blur-sm'
          style={{ maxWidth: 520 }}
        >
          <motion.img
            src='/images/me.png'
            alt='picture of Michael'
            className='block w-full h-full object-cover'
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
