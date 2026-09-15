import { useState } from 'react'
import { ContactModal } from './components/ContactModal'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Cta, Faq, Places, Steps, TypesGrid } from './sections/Sections'

export default function App() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1160px] px-6">
        <Hero />
        <Steps />
        <TypesGrid />
        <Places />
        <Faq />
        <Cta />
      </main>

      <footer className="border-t border-line py-7 pb-11 text-[13.5px] text-muted">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 text-center">
          <span>Desenvolvido por Israel Messias Júnior</span>
          <span aria-hidden="true">·</span>
          <a
            href="https://www.jrmessias.com.br"
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            www.jrmessias.com.br
          </a>
          <span aria-hidden="true">·</span>
          <span>Vamos fazer um projeto?</span>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
          >
            Contato
          </button>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
