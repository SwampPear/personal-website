'use client'
import { useEffect, useState } from 'react'

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // 2-digit hour + tabular figures keep the width constant so the moon beside
  // it doesn't shift as the time ticks.
  const formatted = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  return (
    <span className="inline-block tabular-nums" suppressHydrationWarning>
      {formatted}
    </span>
  )
}