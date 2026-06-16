'use client'
import { useEffect, useState } from 'react'
import { Moon as LunarMoon } from 'lunarphase-js'
import { Sun } from 'lucide-react'
import Tooltip from './Tooltip'

/**
 * Sun altitude (radians) above the horizon for a given instant and location.
 * Standard low-precision algorithm (after SunCalc). > 0 means the sun is up.
 */
function sunAltitude(date: Date, lat: number, lon: number): number {
  const rad = Math.PI / 180
  const days = date.valueOf() / 86400000 - 0.5 + 2440588 - 2451545 // days since J2000
  const e = rad * 23.4397 // obliquity of the ecliptic
  const M = rad * (357.5291 + 0.98560028 * days) // solar mean anomaly
  const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M))
  const L = M + C + rad * 102.9372 + Math.PI // ecliptic longitude
  const dec = Math.asin(Math.sin(e) * Math.sin(L)) // declination
  const ra = Math.atan2(Math.sin(L) * Math.cos(e), Math.cos(L)) // right ascension
  const H = rad * (280.16 + 360.9856235 * days) - rad * -lon - ra // hour angle
  const phi = rad * lat
  return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H))
}

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
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)

  // Ask for location once; sunrise/sunset depend on it. Falls back to a
  // local-clock heuristic if the user declines or it's unavailable.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {},
      { timeout: 8000, maximumAge: 3600000 },
    )
  }, [])

  // Tick every minute so the icon flips around sunrise/sunset.
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null // avoid SSR/client hydration mismatch

  const isDay = coords
    ? sunAltitude(now, coords.lat, coords.lon) > (-0.833 * Math.PI) / 180
    : now.getHours() >= 6 && now.getHours() < 18

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
