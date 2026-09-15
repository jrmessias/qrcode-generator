export type QrType =
  | 'url'
  | 'text'
  | 'vcard'
  | 'email'
  | 'sms'
  | 'phone'
  | 'wifi'
  | 'pdf'
  | 'multi'

export type Values = Record<string, string>

export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy' | 'extra-rounded'

export type QrDesign = {
  style: DotStyle
  fg: string
  eye: string
  bg: string
}

export type Field = {
  key: string
  label: string
  type?: 'text' | 'url' | 'email' | 'tel' | 'textarea'
  placeholder?: string
  initial?: string
  /** ocupa meia coluna no grid do formulário */
  half?: boolean
}

export type TypeConfig = {
  label: string
  title: string
  fields: Field[]
  /** motivo pelo qual o tipo não gera código no MVP */
  deferred?: string
}
