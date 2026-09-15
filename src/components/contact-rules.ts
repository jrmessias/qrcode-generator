export type ContactValues = { name: string; email: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactValues, string>>

/** validadores puros, um por campo; string vazia significa campo válido */
export const RULES: Record<keyof ContactValues, (value: string) => string> = {
  name: (v) => (v.trim().length < 2 ? 'Escreva seu nome, ao menos 2 letras.' : ''),
  email: (v) =>
    !v.trim()
      ? 'Preencha o e-mail para eu conseguir responder.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? 'Esse e-mail parece incompleto. Confira o domínio.'
        : '',
  message: (v) => (v.trim().length < 10 ? 'Conte um pouco mais: pelo menos 10 caracteres.' : ''),
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {}
  for (const key of Object.keys(RULES) as (keyof ContactValues)[]) {
    const error = RULES[key](values[key])
    if (error) errors[key] = error
  }
  return errors
}
