import type { Transition, Variants } from 'motion/react'

export const ease = [0.22, 1, 0.36, 1] as const

export const base: Transition = { duration: 0.3, ease }

/** entrada das seções: parte de um estado já legível, nunca de opacidade zero */
export const rise: Variants = {
  hidden: { opacity: 0.4, y: 16 },
  show: { opacity: 1, y: 0, transition: base },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export const tap = { scale: 0.98 }
export const lift = { y: -1 }
