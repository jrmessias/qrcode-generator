import { useEffect, useRef, useState } from 'react'
import type QRCodeStyling from 'qr-code-styling'
import type { QrDesign } from './types'

const SIZE = 220

/** instancia o qr-code-styling sob demanda e mantém as opções sincronizadas */
export function useQrCode(payload: string, design: QrDesign) {
  const holder = useRef<HTMLDivElement>(null)
  const qr = useRef<QRCodeStyling | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!payload) return
    let cancelled = false

    const options = {
      width: SIZE,
      height: SIZE,
      data: payload,
      margin: 8,
      qrOptions: { errorCorrectionLevel: 'M' as const },
      dotsOptions: { type: design.style, color: design.fg },
      cornersSquareOptions: {
        type: design.style === 'square' ? ('square' as const) : ('extra-rounded' as const),
        color: design.eye,
      },
      cornersDotOptions: { color: design.eye },
      backgroundOptions: { color: design.bg },
    }

    if (qr.current) {
      // o wrapper animado troca de nó a cada payload, então o canvas precisa voltar para o novo nó
      if (holder.current && !holder.current.hasChildNodes()) qr.current.append(holder.current)
      qr.current.update(options)
      return
    }

    // carregado só no primeiro render do estúdio, fora do bundle inicial
    import('qr-code-styling').then(({ default: QRCodeStylingCtor }) => {
      if (cancelled || !holder.current) return
      qr.current = new QRCodeStylingCtor(options)
      qr.current.append(holder.current)
      setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [payload, design])

  const download = (extension: 'png' | 'svg', name: string) =>
    qr.current?.download({ name, extension })

  const copy = async () => {
    const blob = await qr.current?.getRawData('png')
    if (!blob) throw new Error('sem imagem')
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob as Blob })])
  }

  return { holder, ready, download, copy }
}
