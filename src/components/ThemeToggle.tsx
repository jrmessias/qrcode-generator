import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

/** escolha salva pelo usuário; null significa seguir o sistema */
const stored = (): Theme | null => {
  try {
    const value = localStorage.getItem('theme')
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

const query = () => window.matchMedia('(prefers-color-scheme: dark)')

export function ThemeToggle() {
  const [choice, setChoice] = useState<Theme | null>(stored)
  const [system, setSystem] = useState<Theme>(() => (query().matches ? 'dark' : 'light'))

  // enquanto o usuário não escolher, o tema do sistema manda — inclusive se ele mudar com a página aberta
  useEffect(() => {
    const media = query()
    const onChange = () => setSystem(media.matches ? 'dark' : 'light')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (choice) {
      document.documentElement.dataset.theme = choice
    } else {
      delete document.documentElement.dataset.theme
    }
    try {
      if (choice) localStorage.setItem('theme', choice)
      else localStorage.removeItem('theme')
    } catch {
      // modo privativo: a escolha vale só nesta sessão
    }
  }, [choice])

  const theme = choice ?? system
  const next: Theme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setChoice(next)}
      aria-label={next === 'dark' ? 'Usar tema escuro' : 'Usar tema claro'}
      title={next === 'dark' ? 'Tema escuro' : 'Tema claro'}
      className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-line text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  )
}
