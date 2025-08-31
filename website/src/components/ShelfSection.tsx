'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

type ShelfItem = {
  title: string
  subtitle?: string
  href?: string
  imageSrc: string
}

const SHELF: ShelfItem[] = [
  {
    title: 'Allan\'s Wing Pizza',
    subtitle: 'Rocky Mountain Pizza Company, Atlanta',
    href: '#',
    imageSrc: '/images/allans_wing.png'
  },
  {
    title: 'Attic Sessions',
    subtitle: 'Arcy Drive',
    href: '#',
    imageSrc: '/images/attic_sessions.jpeg'
  },
  {
    title: 'Being So normal',
    subtitle: 'Peach Pit',
    href: '#',
    imageSrc: '/images/being_so_normal.jpeg'
  },
  {
    title: 'Bifana',
    subtitle: 'O Trevo, Lisbon',
    href: '#',
    imageSrc: '/images/bifana.png'
  },
  {
    title: 'Breezin\'',
    subtitle: 'Wes Montgomery',
    href: '#',
    imageSrc: '/images/breezin.jpg'
  },
  {
    title: 'Checkered Strat',
    subtitle: 'Luthiery Project',
    href: '#',
    imageSrc: '/images/checkered_strat.png'
  },
  {
    title: 'Field Guide to North American Birds',
    subtitle: 'Audubon Society',
    href: '#',
    imageSrc: '/images/field_guide_to_north_american_birds.png'
  },
  {
    title: 'Georgia Sunshine',
    subtitle: 'Jerry Reed',
    href: '#',
    imageSrc: '/images/georgia_sunshine.png'
  },
  {
    title: 'The Hairy Lemon',
    subtitle: 'The Hairy Lemon, Dublin',
    href: '#',
    imageSrc: '/images/hairy_lemon.jpg'
  },
  {
    title: 'Infinite Jest',
    subtitle: 'David Foster Wallace',
    href: '#',
    imageSrc: '/images/infinite_jest.jpg'
  },
  {
    title: 'Last Chance To See',
    subtitle: 'Douglas Adams',
    href: '#',
    imageSrc: '/images/last_chance_to_see.jpg'
  },
  {
    title: 'Mario',
    subtitle: 'Franco Luambo',
    href: '#',
    imageSrc: '/images/mario.png'
  },
  {
    title: 'Mother Earth\'s Plantasia',
    subtitle: 'Mort Garson',
    href: '#',
    imageSrc: '/images/mother_earths_plantasia.png'
  },
  {
    title: 'Oracolo',
    subtitle: 'Skinshape',
    href: '#',
    imageSrc: '/images/oracolo.jpg'
  },
  {
    title: 'Porco Rosso',
    subtitle: 'Studio Ghibli',
    href: '#',
    imageSrc: '/images/porco_rosso.png'
  },
  {
    title: 'The Autobiography of Benjamin Franklin',
    subtitle: 'Benjamin Franklin',
    href: '#',
    imageSrc: '/images/the_autobiography_of_benjamin_franklin.jpg'
  },
  {
    title: 'The Feynman Lectures On Physics',
    subtitle: 'Richard Feynman',
    href: '#',
    imageSrc: '/images/the_feynman_lectures.jpg'
  },
  {
    title: 'Who Is The Government',
    subtitle: 'Michael Lewis',
    href: '#',
    imageSrc: '/images/who_is_the_government.jpg'
  }
]

export default function ShelfSection() {
  return (
    <section id="shelf" className="w-full px-3 sm:px-4 lg:px-24 py-12">
      <div className="mt-8 cards mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center sm:place-items-stretch">
        {SHELF.map((item, key) => (
          <HoloCard key={key} item={item} />
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
      {/* Optional base texture (off by default): set --front to a URL if you want both */}
      <div className="cardInner" /* style={{ backgroundImage: 'var(--front)' }} */ />

      {/* holo layers */}
      <div className="glow" />
      <div className="sparkle" />

      {/* Real image */}


      {/* content */}
      <div className="content">
        <div className="mediaWrap flex items-center justify-center h-full">
          <Image
            src={item.imageSrc}
            alt={item.title}
            width={1000}           // any reasonable intrinsic size
            height={1000}          // (Next.js needs these)
            className="object-contain rounded-md"
            style={{
              maxHeight: 200,      // ⬅️ cap height at 128px
              height: 'auto',      // keep aspect ratio
              width: 'auto',
              maxWidth: '100%'     // don’t overflow horizontally
            }}
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          />
        </div>

        <div className="title">{item.title}</div>
        {item.subtitle && <div className="subtitle">{item.subtitle}</div>}
      </div>
    </div>
  )

  return item.href ? <Link href={item.href} className="block">{inner}</Link> : <div className="block">{inner}</div>
}
