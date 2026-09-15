import { useState } from 'react'
import { motion } from 'motion/react'
import { lift, tap } from '../../lib/motion'
import { CheckIcon, CopyIcon, DownloadIcon } from './icons'

type Props = {
  disabled: boolean
  onDownload: (extension: 'png' | 'svg') => void
  onCopyImage: () => Promise<void>
}

const buttonClass =
  'flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-transparent px-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:flex-none'

const png = `${buttonClass} bg-accent text-accent-ink`
const svg = `${buttonClass} bg-signal text-accent-ink`
const image = `${buttonClass} bg-tone-3 text-accent-ink`

export function QrActions({ disabled, onDownload, onCopyImage }: Props) {
  const [feedback, setFeedback] = useState('')

  const copy = async () => {
    try {
      await onCopyImage()
      setFeedback('Copiado')
    } catch {
      setFeedback('Não deu')
    }
    setTimeout(() => setFeedback(''), 1600)
  }

  return (
    <div className="grid w-full grid-cols-3 gap-2">
      <motion.button
        type="button"
        whileHover={lift}
        whileTap={tap}
        disabled={disabled}
        onClick={() => onDownload('png')}
        className={png}
      >
        {DownloadIcon}
        PNG
      </motion.button>
      <motion.button
        type="button"
        whileHover={lift}
        whileTap={tap}
        disabled={disabled}
        onClick={() => onDownload('svg')}
        className={svg}
      >
        {DownloadIcon}
        SVG
      </motion.button>
      <motion.button
        type="button"
        whileHover={lift}
        whileTap={tap}
        disabled={disabled}
        onClick={copy}
        className={image}
      >
        {feedback ? CheckIcon : CopyIcon}
        {feedback || 'Copiar'}
      </motion.button>
    </div>
  )
}
