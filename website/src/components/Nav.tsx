'use client'

import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

type NavItem = { href: string; label: string }

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/shelf', label: 'Shelf' },
  { href: '/michael_vaden_resume.pdf', label: 'CV' }
]

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
    <motion.nav
      key={pathname} // replay on route change
      initial={initial}
      animate={enter}
      className="fixed top-0 z-50 h-14 w-full bg-transparent
                 backdrop-blur-md backdrop-saturate-150 backdrop-brightness-110 backdrop-hue-rotate-15"
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

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="sm:hidden fixed inset-0 z-40 bg-transparent backdrop-blur-sm backdrop-saturate-150 backdrop-brightness-110 backdrop-hue-rotate-15"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="sm:hidden absolute inset-x-0 top-14 z-50 px-4 pb-6"
              initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            >
              <motion.div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5" layout>
                <motion.ul
                  className="flex flex-col divide-y divide-black/5 dark:divide-white/5"
                  initial="hidden" animate="show" exit="hidden"
                  variants={{ hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } }, show: { transition: { staggerChildren: 0.05 } } }}
                >
                  {NAV_ITEMS.map(item => (
                    <motion.li key={item.href} variants={{ hidden: { opacity: 0, y: -6 }, show: { opacity: 1, y: 0 } }}>
                      <Link
                        href={item.href}
                        className="block px-4 py-3 text-base text-neutral-900 dark:text-neutral-100 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Nav