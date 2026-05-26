'use client'

import PageFade from '@/components/PageFade'
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type NavItem = {
  href: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'home' },
  { href: '/shelf', label: 'shelf' },
  { href: '/michael_vaden_resume.pdf', label: 'cv' },
]

// scroll lock helpers
let _locked = false

const lockScroll = () => {
  if (typeof window === 'undefined' || _locked) return
  _locked = true
  const y = window.scrollY
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${y}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
}

const unlockScroll = () => {
  if (typeof window === 'undefined' || !_locked) return
  _locked = false
  const top = Math.abs(parseInt(document.body.style.top || '0', 10))
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  window.scrollTo(0, top)
}

const NavLink = ({ href, label }: NavItem) => {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={[
        'text-[12px] tracking-widest uppercase transition-colors duration-200',
        active
          ? 'text-neutral-200'
          : 'text-neutral-500 hover:text-neutral-200',
      ].join(' ')}
      style={{ fontFamily: "'Courier New', Courier, monospace", background: '#0c0c0c', padding: '2px 4px', margin: '-2px -4px' }}
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
    () => (prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }),
    [prefersReducedMotion]
  )
  const enter = useMemo<TargetAndTransition>(
    () =>
      prefersReducedMotion
        ? { opacity: 1, transition: { duration: 0.2 } }
        : { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    [prefersReducedMotion]
  )

  return (
    <>
      <motion.nav
        key={pathname}
        initial={initial}
        animate={enter}
        className="fixed top-0 z-[10000] h-10 w-full"
      >
        <div className="mx-auto h-full px-5 sm:px-8 lg:px-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="Home" className="opacity-50 hover:opacity-90 transition-opacity" style={{ background: '#0c0c0c', padding: '3px', margin: '-3px' }}>
            <Image
              src="/images/pear_white.svg"
              alt="Logo"
              width={13}
              height={13}
              priority
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden sm:flex items-center gap-7">
            {NAV_ITEMS.map(item => (
              <li key={item.href}>
                <NavLink {...item} />
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            className="sm:hidden inline-flex items-center justify-center p-1.5 text-neutral-500 hover:text-neutral-200 transition-colors"
            onClick={() => setOpen(v => !v)}
          >
            <motion.svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              initial={false}
              animate={open ? 'open' : 'closed'}
            >
              <motion.path
                d="M4 7h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={{
                  closed: { d: 'M4 7h16', opacity: 1 },
                  open: { d: 'M6 6l12 12', opacity: 1 },
                }}
                transition={{ duration: 0.18 }}
              />
              <motion.path
                d="M4 12h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                transition={{ duration: 0.18 }}
              />
              <motion.path
                d="M4 17h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={{
                  closed: { d: 'M4 17h16', opacity: 1 },
                  open: { d: 'M6 18L18 6', opacity: 1 },
                }}
                transition={{ duration: 0.18 }}
              />
            </motion.svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="sm:hidden fixed inset-x-0 top-10 z-[10001]"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            >
              <div className="bg-neutral-900/95 border-b border-white/5">
                <ul className="flex flex-col py-3 px-5 gap-4">
                  {NAV_ITEMS.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block text-[12px] tracking-widest uppercase text-neutral-400 hover:text-neutral-100 transition-colors"
                        style={{ fontFamily: "'Courier New', Courier, monospace" }}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <PageFade show={open} onClick={() => setOpen(false)} />
    </>
  )
}

export default Nav
