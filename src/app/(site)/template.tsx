'use client'

import { motion } from 'framer-motion'

/**
 * App-level template re-mounts on every navigation, so this fade plays as you
 * move between the main page and the shelf — pages dissolve through the black
 * background rather than hard-cutting.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-0 flex-1 flex-col"
    >
      {children}
    </motion.div>
  )
}
