import { describe, expect, it } from 'vitest'
import { RULES, validateContact } from './contact-rules'

describe('RULES.name', () => {
  it('recusa vazio, espaços e uma letra só', () => {
    expect(RULES.name('')).not.toBe('')
    expect(RULES.name('   ')).not.toBe('')
    expect(RULES.name('A')).not.toBe('')
  })

  it('aceita nome com duas letras ou mais', () => {
    expect(RULES.name('Ana')).toBe('')
    expect(RULES.name('  Jô  ')).toBe('')
  })
})

describe('RULES.email', () => {
  it('cobra o campo quando está vazio', () => {
    expect(RULES.email('')).toContain('Preencha')
    expect(RULES.email('   ')).toContain('Preencha')
  })

  it('recusa endereço incompleto', () => {
    for (const value of ['ana', 'ana@', 'ana@empresa', 'ana@empresa.c', 'a b@empresa.com', '@empresa.com.br']) {
      expect(RULES.email(value), value).toContain('incompleto')
    }
  })

  it('aceita endereços válidos, inclusive com espaços nas pontas', () => {
    for (const value of ['ana@empresa.com.br', ' ana.ribeiro+qr@sub.empresa.io ', 'a@b.co']) {
      expect(RULES.email(value), value).toBe('')
    }
  })
})

describe('RULES.message', () => {
  it('recusa mensagem curta demais, contando sem os espaços das pontas', () => {
    expect(RULES.message('oi')).not.toBe('')
    expect(RULES.message('         ')).not.toBe('')
    expect(RULES.message('  123456  ')).not.toBe('')
  })

  it('aceita a partir de 10 caracteres', () => {
    expect(RULES.message('1234567890')).toBe('')
  })
})

describe('validateContact', () => {
  it('devolve um erro por campo inválido', () => {
    expect(validateContact({ name: '', email: '', message: '' })).toEqual({
      name: expect.any(String),
      email: expect.any(String),
      message: expect.any(String),
    })
  })

  it('devolve objeto vazio quando tudo está preenchido', () => {
    expect(
      validateContact({
        name: 'Ana',
        email: 'ana@empresa.com.br',
        message: 'Preciso de um gerador de QR para a loja.',
      }),
    ).toEqual({})
  })

  it('isola o campo com problema', () => {
    const errors = validateContact({
      name: 'Ana',
      email: 'ana@empresa',
      message: 'Preciso de um gerador de QR para a loja.',
    })
    expect(Object.keys(errors)).toEqual(['email'])
  })
})
