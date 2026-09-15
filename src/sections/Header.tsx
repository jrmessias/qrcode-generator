import { motion } from 'motion/react'
import { ThemeToggle } from '../components/ThemeToggle'
import { lift, tap } from '../lib/motion'

const links = [
  { href: '#passos', label: 'Como funciona' },
  { href: '#tipos', label: 'Tipos' },
  { href: '#onde', label: 'Onde usar' },
  { href: '#faq', label: 'Dúvidas' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1160px] items-center gap-3 px-5 md:gap-7 md:px-6">
        <a href="#" className="flex flex-none items-center gap-2.5 font-display text-[15px] font-extrabold tracking-tight whitespace-nowrap">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6.5 w-6.5">
            <rect x="1" y="1" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="15" y="1" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="1" y="15" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="15" y="15" width="3" height="3" fill="var(--accent)" />
            <rect x="20" y="20" width="3" height="3" fill="var(--accent)" />
            <rect x="15" y="20" width="3" height="3" fill="currentColor" />
          </svg>
          Gerador de QR Code
        </a>

        <nav className="ml-auto hidden gap-6 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-muted hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <motion.a
          whileHover={lift}
          whileTap={tap}
          href="#estudio"
          className="ml-auto flex min-h-11 flex-none items-center rounded-xl bg-accent px-3.5 text-sm font-semibold whitespace-nowrap text-accent-ink md:ml-0 md:px-4"
        >
          Criar<span className="hidden sm:inline">&nbsp;QR Code</span>
        </motion.a>

        <ThemeToggle />
      </div>
    </header>
  )
}
