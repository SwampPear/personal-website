'use client'

import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { useEffect, useMemo, useRef, useState } from 'react'

export type PostSection = {
  _key: string
  content?: PortableTextBlock[]
  imageUrl: string | null
}

const FADE_MASK =
  'linear-gradient(to bottom, transparent 0, black 2.5rem, black calc(100% - 2.5rem), transparent 100%)'

function formatDate(value?: string) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PostReader({
  title,
  publishedAt,
  sections,
  isPrivate = false,
}: {
  title: string
  publishedAt?: string
  sections: PostSection[]
  isPrivate?: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const visible = useRef<Record<number, boolean>>({})
  const [activeIndex, setActiveIndex] = useState(0)

  // For each section, the image that should be showing — its own, or the most
  // recent preceding one (the first section's image acts as the cover).
  const effectiveUrls = useMemo(() => {
    let last: string | null = null
    return sections.map((s) => {
      if (s.imageUrl) last = s.imageUrl
      return last
    })
  }, [sections])

  // Distinct images, in first-appearance (reading) order — this also defines
  // the figure numbering. All are stacked so we can cross-fade between them.
  const layers = useMemo(() => {
    const urls = sections
      .map((s) => s.imageUrl)
      .filter((u): u is string => Boolean(u))
    return Array.from(new Set(urls))
  }, [sections])

  const activeUrl = effectiveUrls[activeIndex] ?? null
  const figNumber = activeUrl ? layers.indexOf(activeUrl) + 1 : 0

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.index)
          visible.current[idx] = entry.isIntersecting
        }
        const intersecting = Object.entries(visible.current)
          .filter(([, v]) => v)
          .map(([k]) => Number(k))
        if (intersecting.length) setActiveIndex(Math.min(...intersecting))
      },
      // A thin trigger band ~40% down the scroll viewport.
      { root, rootMargin: '-38% 0px -55% 0px', threshold: 0 },
    )

    const els = sectionRefs.current.filter(Boolean) as HTMLElement[]
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections.length])

  return (
    <div className="flex min-h-0 flex-1 gap-8">
      <div
        ref={scrollRef}
        className="max-w-2xl flex-1 overflow-y-auto py-10"
        style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
      >
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-[22px] font-bold tracking-[0.04em]">
            {title}
          </h1>
          {isPrivate ? (
            <span className="rounded-[2px] border border-[var(--faint)] px-1 py-px font-serif text-[8px] uppercase tracking-[0.12em] text-[var(--muted)]">
              private
            </span>
          ) : null}
        </div>
        <div className="mt-2 font-serif text-[12px] italic tracking-[0.08em] text-[var(--muted)]">
          {formatDate(publishedAt)}
        </div>

        <div className="mt-8 flex flex-col gap-y-4">
          {sections.map((section, i) => (
            <section
              key={section._key}
              data-index={i}
              ref={(el) => {
                sectionRefs.current[i] = el
              }}
              className="flex flex-col gap-y-4 font-serif text-[14px] leading-relaxed tracking-[0.02em]"
            >
              {section.content ? <PortableText value={section.content} /> : null}
            </section>
          ))}
        </div>
      </div>

      {layers.length > 0 ? (
        <figure className="my-10 hidden flex-1 flex-col lg:flex">
          <div className="relative flex-1 overflow-hidden rounded-[3px] border border-white/10">
            {layers.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
                style={{ opacity: url === activeUrl ? 1 : 0 }}
              />
            ))}
          </div>
          <figcaption className="mt-2 font-serif text-[12px] italic tracking-[0.08em] text-[var(--muted)]">
            {figNumber ? `Fig. ${figNumber}` : ''}
          </figcaption>
        </figure>
      ) : null}
    </div>
  )
}
