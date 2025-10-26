'use client'

import { motion, type Variants } from 'framer-motion'
import { Github, Linkedin, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const container: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
}

interface IFooterColProps {
  title: string
  children: React.ReactNode
}

const FooterCol = ({ title, children }: IFooterColProps ) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-black dark:text-white tracking-tight">{title}</h4>
      <ul className="space-y-2">{children}</ul>
    </div>
  )
}

interface IFooterLink {
  href: string
  children: React.ReactNode
}

const FooterLink = ({ href, children }: IFooterLink ) => {
  const pathname = usePathname()

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    // index hash
    if (href.startsWith('#')) {
      e.preventDefault()

      const id = href.slice(1)
      const el = document.getElementById(id)

      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })

      return
    }

    // same path hash
    const [path, hash] = href.split('#')
    if (hash && path === pathname) {
      e.preventDefault()

      const el = document.getElementById(hash)

      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })

      return
    }
  }

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}

interface ISocialProps {
  href: string
  label: string
  children: React.ReactNode
}

const Social = ({ href, label, children }: ISocialProps ) => {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex items-center justify-center h-8 w-8 rounded-full 
                 bg-neutral-100 dark:bg-neutral-800
                 text-neutral-900 dark:text-neutral-100
                 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
    >
      {children}
    </a>
  )
}

const Footer = () => {
  return (
    <footer className="w-full mt-16">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-24 pt-12 pb-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand / blurb */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-lg font-semibold text-black dark:text-white tracking-tight">
                <Image src="/images/pear_white.svg" alt="Logo" width={16} height={16} priority className="invert dark:invert-0" />
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Social href="mailto:michaelvaden.mjv@gmail.com" label="Email">
                <Mail className="h-4 w-4" />
              </Social>
              <Social href="https://github.com/SwampPear" label="GitHub">
                <Github className="h-4 w-4" />
              </Social>
              <Social href="https://linkedin.com/in/michaeljvaden" label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Social>
            </div>
          </div>

          <FooterCol title="Site">
            <FooterLink href="#about">About</FooterLink>
            <FooterLink href="#xp">XP / Projects</FooterLink>
            <FooterLink href="/shelf">Shelf</FooterLink>
          </FooterCol>

          <FooterCol title="Work">
            <FooterLink href="/michael_vaden_resume.pdf">CV</FooterLink>
          </FooterCol>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-black dark:text-white tracking-tight">
              Currently open to opportunities
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              This site made with ❤️.
            </p>
          </div>
        </div>

        {/* divider */}
        <div className="mt-10 h-px bg-black/5 dark:bg-white/10" />

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} Michael Vaden. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-700 dark:text-neutral-300">
            <a href="#top" className="hover:underline">Back to top</a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer