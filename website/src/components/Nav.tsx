'use client'

import PageFade from '@/components/PageFade'
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type NavItem = { 
  href: string; 
  label: string 
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/shelf', label: 'Shelf' },
  { href: '/michael_vaden_resume.pdf', label: 'CV' }
]

// Navbar glass (WITH blur)
const NAV_GLASS =
  'bg-white/60 dark:bg-neutral-900/60 supports-[backdrop-filter]:bg-white/10 dark:supports-[backdrop-filter]:bg-neutral-900/10 ' +
  'backdrop-blur-md backdrop-saturate-150 backdrop-brightness-110 backdrop-hue-rotate-15 shadow-lg shadow-black/10'

// Navbar tint (NO blur) — used when menu is open
const NAV_TINT_NO_BLUR =
  'bg-white/60 dark:bg-neutral-900/60 supports-[backdrop-filter]:bg-white/10 dark:supports-[backdrop-filter]:bg-neutral-900/10 ' +
  'shadow-lg shadow-black/10' // no backdrop-blur classes here

// Panel tint (no blur; overlay handles page fade)
const PANEL_TINT =
  'bg-white/60 dark:bg-neutral-900/60 supports-[backdrop-filter]:bg-white/10 dark:supports-[backdrop-filter]:bg-neutral-900/10 ' +
  'shadow-lg shadow-black/10'

// scroll lock (preserves scroll position)
let _locked = false

interface ScrollLockState {
  position: string
  top?: string
  left: string
  right: string
  width: string
  overflow: string
}

const setScrollLockState = ( state: ScrollLockState ) => {
  const y = window.scrollY
  const b = document.body

  b.style.overflow = state.overflow
  b.style.position = state.position

  b.style.top      = !state.top ? '' : `${y}px`
  b.style.left     = state.left
  b.style.right    = state.right
  b.style.width    = state.width
}

const lockScroll = () => {
  if (typeof window === 'undefined' || _locked) return
  _locked = true

  setScrollLockState({  overflow: 'hidden', position: 'fixed', left: '0', right: '0', width: '100%' })
}

const unlockScroll = () => {
  if (typeof window === 'undefined' || !_locked) return
  _locked = false

  setScrollLockState({  overflow: '', position: '', top: '', left: '', right: '', width: '' })

  const y = window.scrollY
  window.scrollTo(0, y ? y : 0)
}

const NavLink = ({ href, label }: NavItem) => {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link
      href={href}
      className="px-2 py-1 text-sm transition-colors text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}

const Nav = () => {
  const [open, setOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (open) lockScroll()
    else unlockScroll()
    return () => unlockScroll()
  }, [open])

  const initial = useMemo<TargetAndTransition>(
    () => (prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }),
    [prefersReducedMotion]
  )
  const enter = useMemo<TargetAndTransition>(
    () =>
      prefersReducedMotion
        ? { opacity: 1, transition: { duration: 0.2 } }
        : { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 30 } },
    [prefersReducedMotion]
  )

  return (
    <>
      {/* Fixed navbar; blur removed when `open` */}
      <motion.nav
        key={pathname}
        initial={initial}
        animate={enter}
        className={`fixed top-0 z-[10000] h-14 w-full ${open ? NAV_TINT_NO_BLUR : NAV_GLASS} isolate`}
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
        }}
      >
        <div className="mx-auto h-full px-3 sm:px-4 lg:px-24 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-black dark:text-white">
            <Image src="/images/pear_white.svg" alt="Logo" width={16} height={16} priority className="invert dark:invert-0" />
          </Link>

          {/* desktop */}
          <motion.ul
            className="hidden sm:flex items-center gap-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
              show: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {NAV_ITEMS.map(item => (
              <motion.li
                key={item.href}
                variants={
                  prefersReducedMotion
                    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                    : { hidden: { opacity: 0, y: -6 }, show: { opacity: 1, y: 0 } }
                }
              >
                <NavLink {...item} />
              </motion.li>
            ))}
          </motion.ul>

          {/* mobile */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition"
            onClick={() => setOpen(v => !v)}
          >
            <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" initial={false} animate={open ? 'open' : 'closed'}>
              <motion.path d="M4 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                variants={{ closed: { d: 'M4 7h16', opacity: 1 }, open: { d: 'M6 6l12 12', opacity: 1 } }}
                transition={{ duration: 0.2 }}
              />
              <motion.path d="M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                transition={{ duration: 0.2 }}
              />
              <motion.path d="M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                variants={{ closed: { d: 'M4 17h16', opacity: 1 }, open: { d: 'M6 18L18 6', opacity: 1 } }}
                transition={{ duration: 0.2 }}
              />
            </motion.svg>
          </button>
        </div>

        {/* mobile dropdown (panel only; the overlay is the separate PageFade portal) */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="sm:hidden fixed inset-x-0 top-14 z-[10001]"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            >
              <motion.div className={`${PANEL_TINT} rounded-none border-b border-black/10 dark:border-white/10`}>
                <motion.ul
                  className="flex flex-col py-2"
                  initial="hidden" animate="show" exit="hidden"
                  variants={{
                    hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                    show: { transition: { staggerChildren: 0.05 } }
                  }}
                >
                  {NAV_ITEMS.map(item => (
                    <motion.li
                      key={item.href}
                      className="px-4"
                      variants={{ hidden: { opacity: 0, y: -6 }, show: { opacity: 1, y: 0 } }}
                    >
                      <Link
                        href={item.href}
                        className="block w-full px-4 py-3 text-base text-neutral-100 hover:bg-white/5 rounded-xl"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <PageFade show={open} onClick={() => setOpen(false)} />
    </>
  )
}

export default Nav
