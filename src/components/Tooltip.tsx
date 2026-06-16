'use client'
import { ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Placement = 'top' | 'bottom'

const GAP = 8 // px between the trigger and the tooltip
const MARGIN = 16 // 1rem: minimum distance the tooltip keeps from any edge

export default function Tooltip({
  label,
  placement = 'top',
  className = 'inline-flex',
  children,
}: {
  label: ReactNode
  placement?: Placement
  className?: string
  children: ReactNode
}) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)

  // Position against the viewport, then clamp so the tooltip never sits closer
  // than MARGIN to any edge.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tipRef.current) return
    const t = triggerRef.current.getBoundingClientRect()
    const tip = tipRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    let top =
      placement === 'bottom' ? t.bottom + GAP : t.top - tip.height - GAP
    let left = t.left + t.width / 2 - tip.width / 2

    left = Math.min(Math.max(left, MARGIN), vw - tip.width - MARGIN)
    top = Math.min(Math.max(top, MARGIN), vh - tip.height - MARGIN)

    setPos({ left, top })
  }, [open, placement, label])

  return (
    <span
      ref={triggerRef}
      className={className}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false)
        setPos(null)
      }}
    >
      {children}
      {open &&
        createPortal(
          <div
            ref={tipRef}
            role="tooltip"
            className="glass pointer-events-none fixed z-[100] max-w-[16rem] rounded-md px-2.5 py-1.5 font-serif text-[12px] leading-snug tracking-[0.08em] text-foreground shadow-lg transition-opacity duration-200 ease-out"
            style={{
              left: pos?.left ?? -9999,
              top: pos?.top ?? -9999,
              opacity: pos ? 1 : 0,
            }}
          >
            {label}
          </div>,
          document.body,
        )}
    </span>
  )
}
