'use client'

import { motion } from 'framer-motion';

export default function LiquidWord({
  word = 'Synthesis',
  className = ''
}: { word?: string; className?: string }) {
  return (
    <div className={['relative select-none', className].join(' ')}>
      <motion.svg
        viewBox="0 0 1200 300"
        className="w-full h-auto"
        initial="rest"
        whileHover="hover"
        aria-label={word}
      >
        <defs>
          {/* pretty gradient fill */}
          <linearGradient id="liquid-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(17 24 39)" />        {/* slate-900 */}
            <stop offset="100%" stopColor="rgb(99 102 241)" />     {/* indigo-500 */}
          </linearGradient>

          {/* liquid filter: turbulence -> displacement */}
          <filter id="liquid-filter">
            <motion.feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.012"
              numOctaves={2}
              seed={7}
              result="noise"
              variants={{
                rest: { baseFrequency: '0.007 0.010' },
                hover: { baseFrequency: '0.012 0.018' }
              }}
              animate={{
                // gentle breathing loop even at rest
                baseFrequency: ['0.007 0.010', '0.009 0.014', '0.007 0.010']
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              xChannelSelector="R"
              yChannelSelector="G"
              scale={18}
              variants={{
                rest: { scale: 14 },
                hover: { scale: 26 }
              }}
              transition={{ type: 'spring', stiffness: 80, damping: 12 }}
            />
          </filter>
        </defs>

        {/* the liquid word */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, ui-sans-serif'
          fontWeight={800}
          letterSpacing="-0.02em"
          fill="url(#liquid-grad)"
          filter="url(#liquid-filter)"
          // responsive-ish sizing: tweak as needed
          style={{ fontSize: 160 }}
        >
          {word}
        </motion.text>
      </motion.svg>
    </div>
  )
}
