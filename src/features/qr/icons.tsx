import type { QrType } from './types'

const props = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const TYPE_ICONS: Record<QrType, React.ReactNode> = {
  url: (
    <svg {...props}>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  ),
  text: (
    <svg {...props}>
      <path d="M4 7V5h16v2M12 5v14M9 19h6" />
    </svg>
  ),
  vcard: (
    <svg {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
    </svg>
  ),
  email: (
    <svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  sms: (
    <svg {...props}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
    </svg>
  ),
  phone: (
    <svg {...props}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1Z" />
    </svg>
  ),
  wifi: (
    <svg {...props}>
      <path d="M2 8.8a16 16 0 0 1 20 0M5.5 12.6a11 11 0 0 1 13 0M9 16.4a6 6 0 0 1 6 0" />
      <circle cx="12" cy="20" r="1" />
    </svg>
  ),
  pdf: (
    <svg {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
    </svg>
  ),
  multi: (
    <svg {...props}>
      <path d="M4 6h16M4 12h16M4 18h9" />
    </svg>
  ),
}

export const DownloadIcon = (
  <svg {...props}>
    <path d="M12 4v11M8 11l4 4 4-4M5 19h14" />
  </svg>
)

export const CopyIcon = (
  <svg {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a1 1 0 0 1 1-1h9" />
  </svg>
)

export const CheckIcon = (
  <svg {...props}>
    <path d="m5 13 4 4L19 7" />
  </svg>
)
