'use client'

import { motion } from 'framer-motion';

interface ILiquidWordProps {
  word?: string
  className?: string
}

const LiquidWord = ({ word = 'Synthesis', className = '' }: ILiquidWordProps ) => {
  return (
    <div
      className={['relative select-none', className].join(' ')}
      style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}
    >
      <motion.svg
        viewBox="0 0 900 220"
        className="w-full h-auto"
        style={{ overflow: 'visible' }}
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
        textRendering="optimizeLegibility"
        colorInterpolationFilters="sRGB"
        aria-label={word}
      >
        <defs>
          <filter
            id="liquid-filter"
            filterUnits="objectBoundingBox"
            x="-40%" y="-80%" width="180%" height="260%"
            filterRes="1200"
          >
            <motion.feTurbulence
              type="fractalNoise"
              baseFrequency="0.005 0.008"
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
              scale={10}
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
          className="
            liquid-word-font text-black dark:text-white
            text-[48px] sm:text-[72px] md:text-[96px]
          "
        >
          {word}
        </motion.text>
      </motion.svg>
    </div>
  )
}

export default LiquidWord