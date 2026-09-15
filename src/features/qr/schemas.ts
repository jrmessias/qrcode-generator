import type { QrDesign, QrType, TypeConfig, Values } from './types'

export const TYPES: Record<QrType, TypeConfig> = {
  url: {
    label: 'URL',
    title: 'Redirecionar para uma URL existente',
    fields: [
      {
        key: 'url',
        label: 'URL',
        type: 'url',
        placeholder: 'https://exemplo.com/promo',
        initial: 'https://exemplo.com/promo',
      },
    ],
  },
  text: {
    label: 'Texto',
    title: 'Mostrar um texto ao escanear',
    fields: [
      {
        key: 'text',
        label: 'Texto (até 1000 caracteres)',
        type: 'textarea',
        initial: 'Retire seu pedido no balcão 2 e informe o código A-114.',
      },
    ],
  },
  vcard: {
    label: 'Contato',
    title: 'Compartilhar seus dados de contato',
    fields: [
      { key: 'first', label: 'Nome', initial: 'Ana', half: true },
      { key: 'last', label: 'Sobrenome', initial: 'Ribeiro', half: true },
      { key: 'org', label: 'Empresa', initial: 'Estúdio Bandeira', half: true },
      { key: 'role', label: 'Cargo', initial: 'Diretora de operações', half: true },
      { key: 'email', label: 'E-mail', type: 'email', initial: 'ana@estudiobandeira.com.br', half: true },
      { key: 'phone', label: 'Celular', type: 'tel', initial: '+55 11 98877-1200', half: true },
      { key: 'site', label: 'Site', type: 'url', initial: 'https://estudiobandeira.com.br' },
    ],
  },
  email: {
    label: 'E-mail',
    title: 'Abrir um e-mail já preenchido',
    fields: [
      { key: 'to', label: 'Para', type: 'email', initial: 'contato@estudiobandeira.com.br' },
      { key: 'subject', label: 'Assunto', initial: 'Orçamento para 500 cartões' },
      {
        key: 'body',
        label: 'Mensagem',
        type: 'textarea',
        initial: 'Olá! Vi o QR no cartaz e gostaria de um orçamento.',
      },
    ],
  },
  sms: {
    label: 'SMS',
    title: 'Abrir um SMS já preenchido',
    fields: [
      { key: 'phone', label: 'Número', type: 'tel', initial: '+55 11 98877-1200' },
      { key: 'msg', label: 'Mensagem', type: 'textarea', initial: 'QUERO participar do sorteio de setembro.' },
    ],
  },
  phone: {
    label: 'Telefone',
    title: 'Ligar com um toque',
    fields: [{ key: 'phone', label: 'Número', type: 'tel', initial: '+55 11 3222-8080' }],
  },
  wifi: {
    label: 'Wi-Fi',
    title: 'Conectar ao Wi-Fi sem digitar a senha',
    fields: [
      { key: 'ssid', label: 'Rede (SSID)', initial: 'Bandeira-Visitantes', half: true },
      { key: 'pass', label: 'Senha', initial: 'cafe-com-leite-2026', half: true },
      { key: 'enc', label: 'Criptografia (WPA, WEP ou nopass)', initial: 'WPA' },
    ],
  },
  pdf: {
    label: 'PDF',
    title: 'PDF (arquivo)',
    fields: [],
    deferred: 'Hospedar o arquivo exige backend. No MVP, cole um link já publicado no tipo URL.',
  },
  multi: {
    label: 'Multi-URL',
    title: 'Vários destinos em um código',
    fields: [],
    deferred: 'Vários destinos exigem uma página servida por nós, prevista para a fase 2.',
  },
}

// 'pdf' e 'multi' saem da barra de abas até a fase 2 (dependem de backend para hospedar o destino)
export const TYPE_ORDER: QrType[] = ['url', 'text', 'vcard', 'email', 'sms', 'phone', 'wifi']
// export const TYPE_ORDER: QrType[] = ['url', 'text', 'vcard', 'email', 'sms', 'phone', 'wifi', 'pdf', 'multi']

const digits = (v = '') => v.replace(/[^\d+]/g, '')
/** escapa os separadores do formato WIFI: e do vCard */
const escapeWifi = (v = '') => v.replace(/([\\;,:"])/g, '\\$1')

export const ENCODERS: Record<QrType, (v: Values) => string> = {
  url: (v) => (v.url ?? '').trim(),
  text: (v) => v.text ?? '',
  phone: (v) => (digits(v.phone) ? `tel:${digits(v.phone)}` : ''),
  sms: (v) => (digits(v.phone) ? `SMSTO:${digits(v.phone)}:${v.msg ?? ''}` : ''),
  email: (v) =>
    v.to
      ? `mailto:${v.to}?subject=${encodeURIComponent(v.subject ?? '')}&body=${encodeURIComponent(v.body ?? '')}`
      : '',
  wifi: (v) =>
    v.ssid
      ? `WIFI:T:${(v.enc || 'WPA').toUpperCase()};S:${escapeWifi(v.ssid)};P:${escapeWifi(v.pass)};;`
      : '',
  vcard: (v) => {
    const name = [v.first, v.last].filter(Boolean).join(' ')
    if (!name && !v.org) return ''
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${v.last ?? ''};${v.first ?? ''}`,
      `FN:${name}`,
      v.org && `ORG:${v.org}`,
      v.role && `TITLE:${v.role}`,
      v.phone && `TEL;TYPE=CELL:${v.phone}`,
      v.email && `EMAIL:${v.email}`,
      v.site && `URL:${v.site}`,
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n')
  },
  pdf: () => '',
  multi: () => '',
}

/** retorna a mensagem de erro, ou string vazia quando o payload pode ser gerado */
export function validate(type: QrType, payload: string): string {
  if (TYPES[type].deferred) return 'Escolha outro tipo para gerar um código agora.'
  if (!payload.trim()) return 'Preencha os campos para gerar o código.'
  if (type === 'url' && !/^https?:\/\/[^\s.]+\.[^\s]+$/.test(payload))
    return 'A URL precisa começar com http:// ou https://'
  if (type === 'text' && payload.length > 1000) return 'O texto passa de 1000 caracteres.'
  return ''
}

export function initialValues(type: QrType): Values {
  return Object.fromEntries(TYPES[type].fields.map((f) => [f.key, f.initial ?? '']))
}

export const TEMPLATES: QrDesign[] = [
  { fg: '#0f141b', eye: '#2743e3', bg: '#ffffff', style: 'rounded' },
  { fg: '#0f141b', eye: '#0f141b', bg: '#ffffff', style: 'square' },
  { fg: '#1f3a8a', eye: '#c9522f', bg: '#ffffff', style: 'dots' },
  { fg: '#14532d', eye: '#14532d', bg: '#f2f7f0', style: 'classy' },
  { fg: '#3b1d5e', eye: '#c9522f', bg: '#fbf5ff', style: 'extra-rounded' },
  { fg: '#111111', eye: '#c9522f', bg: '#fff4e8', style: 'rounded' },
  { fg: '#7c2d12', eye: '#ea580c', bg: '#fff7ed', style: 'rounded' },
  { fg: '#0c4a6e', eye: '#0284c7', bg: '#f0f9ff', style: 'dots' },
  { fg: '#1f2937', eye: '#be123c', bg: '#ffffff', style: 'classy' },
  { fg: '#052e16', eye: '#65a30d', bg: '#f7fee7', style: 'extra-rounded' },
]

/** contraste WCAG entre duas cores hex; abaixo de 3:1 o código costuma falhar na leitura */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string) => {
    const n = hex.replace('#', '')
    const full = n.length === 3 ? n.split('').map((c) => c + c).join('') : n
    const [r, g, bl] = [0, 2, 4].map((i) => {
      const c = parseInt(full.slice(i, i + 2), 16) / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}
