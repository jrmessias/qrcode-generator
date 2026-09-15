import { describe, expect, it } from 'vitest'
import { ENCODERS, contrastRatio, initialValues, validate } from './schemas'

describe('encoders', () => {
  it('url passa o link adiante sem encurtar', () => {
    expect(ENCODERS.url({ url: ' https://a.com/x ' })).toBe('https://a.com/x')
  })

  it('phone e sms descartam formatação do número', () => {
    expect(ENCODERS.phone({ phone: '+55 (11) 3222-8080' })).toBe('tel:+551132228080')
    expect(ENCODERS.sms({ phone: '11 98877-1200', msg: 'oi' })).toBe('SMSTO:11988771200:oi')
  })

  it('email codifica assunto e corpo', () => {
    expect(ENCODERS.email({ to: 'a@b.com', subject: 'Olá mundo', body: 'a&b' })).toBe(
      'mailto:a@b.com?subject=Ol%C3%A1%20mundo&body=a%26b',
    )
  })

  it('wifi escapa os separadores do formato', () => {
    expect(ENCODERS.wifi({ ssid: 'Casa;2', pass: 'a:b', enc: 'wpa' })).toBe(
      'WIFI:T:WPA;S:Casa\\;2;P:a\\:b;;',
    )
  })

  it('vcard monta um cartão 3.0 sem linhas vazias', () => {
    const out = ENCODERS.vcard({ first: 'Ana', last: 'Ribeiro', phone: '+5511', org: '' })
    expect(out.startsWith('BEGIN:VCARD\nVERSION:3.0')).toBe(true)
    expect(out).toContain('FN:Ana Ribeiro')
    expect(out).toContain('TEL;TYPE=CELL:+5511')
    expect(out).not.toContain('ORG:')
    expect(out.endsWith('END:VCARD')).toBe(true)
  })

  it('campos vazios não produzem payload', () => {
    expect(ENCODERS.phone({ phone: '' })).toBe('')
    expect(ENCODERS.vcard({})).toBe('')
    expect(ENCODERS.wifi({ ssid: '' })).toBe('')
  })
})

describe('validate', () => {
  it('recusa url sem protocolo', () => {
    expect(validate('url', 'exemplo.com')).toContain('http')
    expect(validate('url', 'https://exemplo.com')).toBe('')
  })

  it('recusa payload vazio e tipos adiados', () => {
    expect(validate('text', '   ')).not.toBe('')
    expect(validate('pdf', 'qualquer coisa')).not.toBe('')
  })

  it('recusa texto acima de 1000 caracteres', () => {
    expect(validate('text', 'a'.repeat(1001))).not.toBe('')
    expect(validate('text', 'a'.repeat(1000))).toBe('')
  })
})

describe('apoio', () => {
  it('initialValues cobre todos os campos do tipo', () => {
    expect(Object.keys(initialValues('vcard'))).toHaveLength(7)
  })

  it('contrastRatio separa preto no branco de cinza no cinza', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
    expect(contrastRatio('#777777', '#888888')).toBeLessThan(3)
  })
})
