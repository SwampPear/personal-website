'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'

type ShelfItem = {
  id: string
  title: string
  subtitle?: string
  href?: string
}

const SHELF: ShelfItem[] = [
  { id: 's1', title: 'Raytracer', subtitle: 'GPU path tracing', href: '#' },
  { id: 's2', title: 'Portfolio', subtitle: 'Next.js + Motion', href: '#' },
  { id: 's3', title: 'Compiler (Blam)', subtitle: 'AST + IR experiments', href: '#' },
  { id: 's4', title: 'ACE Ticketing', subtitle: 'NFC wallet card', href: '#' },
]

export default function ShelfSection() {
  return (
    <section id="shelf" className="w-full px-3 sm:px-4 lg:px-24 py-12">
      <div className="mt-8 cards mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center sm:place-items-stretch">
        {SHELF.map((item) => (
          <HoloCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

function HoloCard({ item }: { item: ShelfItem }) {
  const ref = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(true)

  const onMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const cy = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    const x = cx - rect.left
    const y = cy - rect.top
    const px = x / rect.width
    const py = y / rect.height

    // gradient & sparkles follow
    const lp = 50 + (px * 100 - 50) / 1.5
    const tp = 50 + (py * 100 - 50) / 1.5
    const spx = 50 + (px * 100 - 50) / 7
    const spy = 50 + (py * 100 - 50) / 7

    // tilt
    const ty = ((tp - 50) / 2) * -1
    const tx = ((lp - 50) / 1.5) * 0.5

    // sparkle opacity
    const pa = (50 - Math.abs(100 - px * 100)) + (50 - Math.abs(100 - py * 100))
    const p_opc = 20 + Math.abs(pa) * 1.5

    // subtle parallax for background image
    const bgx = 50 + (px * 100 - 50) / 8
    const bgy = 50 + (py * 100 - 50) / 8

    el.style.setProperty('--grad-x', `${lp}%`)
    el.style.setProperty('--grad-y', `${tp}%`)
    el.style.setProperty('--sprk-x', `${spx}%`)
    el.style.setProperty('--sprk-y', `${spy}%`)
    el.style.setProperty('--sprk-o', `${p_opc / 100}`)
    el.style.setProperty('--bg-x', `${bgx}%`)
    el.style.setProperty('--bg-y', `${bgy}%`)
    el.style.transform = `rotateX(${ty}deg) rotateY(${tx}deg)`

    if (animated) setAnimated(false)
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.removeProperty('--grad-x')
    el.style.removeProperty('--grad-y')
    el.style.removeProperty('--sprk-x')
    el.style.removeProperty('--sprk-y')
    el.style.removeProperty('--sprk-o')
    el.style.removeProperty('--bg-x')
    el.style.removeProperty('--bg-y')
    setTimeout(() => setAnimated(true), 2500)
  }

  const inner = (
    <div
      ref={ref}
      className={`card ${animated ? 'animated' : ''}`}
      onMouseMove={onMove as any}
      onMouseLeave={onLeave}
      onTouchMove={onMove as any}
      onTouchEnd={onLeave}
    >
      <div className="cardInner" style={{ backgroundImage: 'var(--front)' }} />
      <div className="glow" />
      <div className="sparkle" />
      <div className="content">
        <div className="title">{item.title}</div>
        {item.subtitle && <div className="subtitle">{item.subtitle}</div>}
      </div>
    </div>
  )

  return item.href ? <Link href={item.href} className="block">{inner}</Link> : <div className="block">{inner}</div>
}
