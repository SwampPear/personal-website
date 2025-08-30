'use client'

import { motion } from 'framer-motion';

export default function LiquidWord({
  word = 'Synthesis',
  className = ''
}: { word?: string; className?: string }) {
  return (
    <div
      className={['relative select-none', className].join(' ')}
      // Better font smoothing in browsers
      style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}
    >
      <motion.svg
        // Tighter viewBox than 1200x300; still roomy
        viewBox="0 0 900 220"
        className="w-full h-auto"
        style={{ overflow: 'visible' }}                  // allow overflow beyond viewBox
        preserveAspectRatio="xMidYMid meet"
        // Improve rendering quality
        shapeRendering="geometricPrecision"
        textRendering="optimizeLegibility"
        colorInterpolationFilters="sRGB"
        aria-label={word}
      >
        <defs>
          {/* Use objectBoundingBox + percentages so the filter always extends far past the text bounds */}
          <filter
            id="liquid-filter"
            filterUnits="objectBoundingBox"
            x="-40%" y="-80%" width="180%" height="260%"  // huge padding => no clip
            // Render the filter at higher internal resolution for smoother edges
            filterRes="1200"
          >
            <motion.feTurbulence
              type="fractalNoise"
              baseFrequency="0.005 0.008"                // subtler wobble
              numOctaves={2}
              seed={7}
              result="noise"
              animate={{ baseFrequency: ['0.02 0.008', '0.025 0.010', '0.02 0.008'] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              xChannelSelector="R"
              yChannelSelector="G"
              scale={10}                                  // slightly lower scale reduces jaggies
            />
          </filter>
        </defs>

        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight={800}
          letterSpacing="-0.02em"
          fill="currentColor"
          filter="url(#liquid-filter)"
          // Make it smaller than before (was 120)
          style={{ fontSize: 96 }}
          className="liquid-word-font text-black dark:text-white"
        >
          {word}
        </motion.text>
      </motion.svg>
    </div>
  )
}
