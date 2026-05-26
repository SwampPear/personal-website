'use client'

import { useEffect, useRef, useState } from 'react'

const SRC = '.,:;|!+*#@%'

function rand(ch: string) {
  return ch === ' ' ? ' ' : SRC[Math.floor(Math.random() * SRC.length)]
}

interface Props {
  children: string
  className?: string
  /** seconds before the wave starts */
  delay?: number
  /** ms between each character settling (lower = faster sweep) */
  speed?: number
}

/**
 * Renders text that scrambles then resolves character-by-character
 * when scrolled into view.  Always a <span> — wrap in your own element.
 */
export default function AsciiReveal({ children: text, className, delay = 0, speed = 45 }: Props) {
  const ref    = useRef<HTMLSpanElement>(null)
  const rafRef = useRef(0)
  const t0Ref  = useRef(0)
  const [active,    setActive]    = useState(false)
  const [displayed, setDisplayed] = useState(() => text.split('').map(rand).join(''))

  // Trigger when element enters viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Run scramble animation
  useEffect(() => {
    if (!active) return
    t0Ref.current = 0

    const tick = (now: number) => {
      if (!t0Ref.current) t0Ref.current = now
      const elapsed = now - t0Ref.current - delay * 1000

      let out = ''
      let done = true
      for (let i = 0; i < text.length; i++) {
        if (elapsed > i * speed) {
          out += text[i]
        } else {
          out += rand(text[i])
          done = false
        }
      }
      setDisplayed(out)
      if (!done) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, text, delay, speed])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {displayed}
    </span>
  )
}
