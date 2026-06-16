'use client'
import { useEffect, useState } from 'react'
import { Moon as LunarMoon } from 'lunarphase-js'
import { Sun } from 'lucide-react'
import Tooltip from './Tooltip'

/**
 * Draws the moon with its terminator positioned for the current illumination,
 * so the rendered crescent/gibbous matches the real phase.
 */
function MoonPhase({ size, date }: { size: number; date: Date }) {
  const t = LunarMoon.lunarAgePercent(date) // 0 = new, 0.5 = full
  const c = Math.cos(2 * Math.PI * t) // 1 at new, -1 at full
  const waxing = t < 0.5
  const rx = Math.abs(50 * c)
  const sweep = waxing ? (c > 0 ? 0 : 1) : c < 0 ? 0 : 1
  // The unlit limb is the opposite semicircle from the lit one; combined with
  // the terminator ellipse it traces the shadowed region of the disk.
  const limb = waxing ? 'A 50 50 0 0 0 50 100' : 'A 50 50 0 0 1 50 100'
  const shadow = `M 50 0 ${limb} A ${rx} 50 0 0 ${sweep} 50 0 Z`
  return (
    <span
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/moon-icon.svg"
        alt=""
        width={size}
        height={size}
        className="block h-full w-full rounded-full object-cover"
      />
      {/* Phase shadow overlaid on the moon face. */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-hidden="true"
        className="absolute inset-0"
      >
        {/* Scaled slightly about the center so the shadow fully covers the disk edge. */}
        <g transform="translate(50 50) scale(1.05) translate(-50 -50)">
          <path d={shadow} fill="var(--background, #1a1716)" opacity={0.82} />
        </g>
      </svg>
    </span>
  )
}

export default function Moon({ size = 18 }: { size?: number }) {
  const [now, setNow] = useState<Date | null>(null)

  // Tick every minute so the icon flips at 6am/6pm.
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null // avoid SSR/client hydration mismatch

  const isDay = now.getHours() >= 6 && now.getHours() < 18

  if (isDay) {
    return <Sun size={size} aria-label="Daytime" />
  }

  const phase = LunarMoon.lunarPhase(now)
  return (
    <Tooltip
      placement="bottom"
      label={`Tonight is going to be a ${phase.toLowerCase()} moon…`}
    >
      <span className="inline-flex" aria-label={`Nighttime — ${phase} moon`}>
        <MoonPhase size={size} date={now} />
      </span>
    </Tooltip>
  )
}
