'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  show: boolean
  onClick?: () => void
  className?: string
}

/** Full-screen overlay via portal; starts below a 56px (h-14) navbar */
export default function PageFade({ show, onClick, className }: Props) {
  const [mounted, setMounted] = useState(false)
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
    let el = document.getElementById('page-fade-root') as HTMLElement | null
    if (!el) {
      el = document.createElement('div')
      el.id = 'page-fade-root'
      document.body.appendChild(el)
    }
    rootRef.current = el
  }, [])

  if (!mounted || !rootRef.current) return null

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-fade"
          className={`fixed inset-x-0 top-0 bottom-0 z-[9999] pointer-events-auto ${className ?? 'bg-black/85 dark:bg-black/90'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClick}
        />
      )}
    </AnimatePresence>,
    rootRef.current
  )
}
