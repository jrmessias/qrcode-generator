import { useEffect, useRef, useState } from 'react'
import { RULES, validateContact } from './contact-rules'
import type { ContactErrors, ContactValues } from './contact-rules'

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Values = ContactValues
type Errors = ContactErrors

const empty: Values = { name: '', email: '', message: '' }

type Props = {
  open: boolean
  onClose: () => void
}

const fieldBase =
  'w-full rounded-xl border bg-surface px-3.5 py-2.5 text-[15px] text-ink transition-colors placeholder:text-muted focus:outline-none'

export function ContactModal({ open, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  // <dialog> nativo já entrega foco preso, Esc e backdrop
  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  const change = (key: keyof Values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    // depois do primeiro erro, o campo valida a cada tecla para o erro sumir assim que for corrigido
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: RULES[key](value) }))
  }

  const blur = (key: keyof Values) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    setErrors((prev) => ({ ...prev, [key]: RULES[key](values[key]) }))
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ACCESS_KEY) return

    const found = validateContact(values)
    setTouched({ name: true, email: true, message: true })
    setErrors(found)

    const first = (Object.keys(found) as (keyof Values)[])[0]
    if (first) {
      document.getElementById(`contato-${first}`)?.focus()
      return
    }

    setStatus('sending')
    setMessage('')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: '[QRCode] Novo contato pelo Gerador de QR Code',
          from_name: 'Gerador de QR Code',
          ...values,
        }),
      })
      const result = await response.json()

      if (result.success) {
        setValues(empty)
        setTouched({})
        setStatus('sent')
        setMessage('Mensagem enviada. Respondo assim que possível.')
      } else {
        setStatus('error')
        setMessage(result.message ?? 'Não foi possível enviar. Tente de novo em instantes.')
      }
    } catch {
      setStatus('error')
      setMessage('Sem conexão com o servidor de envio. Tente de novo em instantes.')
    }
  }

  const field = (key: keyof Values, label: string, placeholder: string, type = 'text') => {
    const invalid = Boolean(errors[key])
    const id = `contato-${key}`
    const shared = {
      id,
      name: key,
      value: values[key],
      placeholder,
      'aria-invalid': invalid,
      'aria-describedby': invalid ? `${id}-erro` : undefined,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => change(key, e.target.value),
      onBlur: () => blur(key),
      className: `${fieldBase} ${invalid ? 'border-signal focus:border-signal' : 'border-line focus:border-accent'}`,
    }

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-xs font-semibold text-muted">
          {label}
        </label>
        {key === 'message' ? (
          <textarea {...shared} rows={4} className={`${shared.className} resize-y`} />
        ) : (
          <input {...shared} type={type} autoComplete={key === 'email' ? 'email' : 'name'} />
        )}
        <p id={`${id}-erro`} aria-live="polite" className="min-h-4 text-[12.5px] text-signal">
          {errors[key]}
        </p>
      </div>
    )
  }

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose()
      }}
      aria-labelledby="contato-titulo"
      className="m-auto w-[min(440px,calc(100vw-32px))] rounded-2xl border border-line bg-paper p-0 text-ink backdrop:bg-black/55"
    >
      {/* noValidate: as mensagens ficam inline, não nos balões do navegador */}
      <form onSubmit={submit} noValidate className="flex flex-col gap-2 p-6">
        <div className="flex items-start gap-4">
          <div>
            <h2 id="contato-titulo" className="font-display text-xl font-bold">
              Vamos fazer um projeto?
            </h2>
            <p className="mt-1 text-sm text-muted">Conte o que precisa. Respondo no e-mail que você deixar.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="ml-auto flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          {field('name', 'Nome', 'Como te chamo?')}
          {field('email', 'E-mail', 'voce@empresa.com.br', 'email')}
          {field('message', 'Mensagem', 'O que você quer construir?')}
        </div>

        {/* isca para bots: humanos nunca veem este campo */}
        <input type="checkbox" name="botcheck" tabIndex={-1} className="hidden" />

        <button
          type="submit"
          disabled={status === 'sending' || !ACCESS_KEY}
          className="flex min-h-11 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
        </button>

        <p
          aria-live="polite"
          className={`min-h-5 text-center text-[13px] ${status === 'error' ? 'text-signal' : 'text-muted'}`}
        >
          {ACCESS_KEY ? message : 'Envio indisponível: defina VITE_WEB3FORMS_KEY no .env.'}
        </p>
      </form>
    </dialog>
  )
}
