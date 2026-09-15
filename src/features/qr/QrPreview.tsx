import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode, RefObject } from 'react'
import { CopyIcon } from './icons'

type Props = {
  holder: RefObject<HTMLDivElement | null>
  payload: string
  error: string
  /** trilho de modelos, exibido ao lado do código */
  rail: ReactNode
}

export function QrPreview({ holder, payload, error, rail }: Props) {
  const reduced = useReducedMotion()
  const [feedback, setFeedback] = useState('')

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payload)
      setFeedback('Conteúdo copiado')
    } catch {
      setFeedback('O navegador bloqueou a cópia')
    }
    setTimeout(() => setFeedback(''), 1600)
  }

  return (
    <>
      <div className="flex w-full min-w-0 flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center">
        <motion.div
          key={reduced ? undefined : payload}
          initial={reduced ? false : { scale: 0.96, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="grid min-h-62 min-w-62 flex-none place-items-center rounded-2xl border border-panel-line bg-white p-3.5"
        >
          <div ref={holder} className={error ? 'opacity-20' : undefined} />
        </motion.div>
        {rail}
      </div>

      <p aria-live="polite" className="min-h-5 text-sm text-signal">
        {error}
      </p>

      <div className="w-full">
        <button
          type="button"
          disabled={Boolean(error)}
          onClick={copyPayload}
          aria-label="Copiar o conteúdo codificado"
          className="flex max-h-19 w-full cursor-pointer items-start gap-2 overflow-auto rounded-xl border border-panel-line bg-panel-field px-3 py-2.5 text-left font-mono text-[11.5px] break-all text-panel-muted transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:flex-none"
        >
          <span className="min-w-0 flex-1">
            <b className="font-semibold text-panel-ink">payload</b> · {error ? '—' : payload.replace(/\n/g, ' ⏎ ')}
          </span>
          {CopyIcon}
        </button>
        <p aria-live="polite" className="mt-1.5 text-center text-[11.5px] text-panel-muted">
          {feedback || 'Clique no campo para copiar o conteúdo'}
        </p>
      </div>
    </>
  )
}
