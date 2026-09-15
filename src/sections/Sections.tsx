import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { rise, stagger } from '../lib/motion'

type HeadProps = { eyebrow: string; title: string; lead?: string }

function Head({ eyebrow, title, lead }: HeadProps) {
  return (
    <div className="mb-8 flex max-w-[620px] flex-col gap-2.5">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-[clamp(25px,3vw,34px)] font-bold tracking-tight">{title}</h2>
      {lead && <p className="text-muted">{lead}</p>}
    </div>
  )
}

const band = 'border-t border-line py-16'

const STEPS = [
  {
    n: 'PASSO 01',
    title: 'Escolha o tipo',
    text: 'Cada tipo tem seu encoder: contato vira BEGIN:VCARD, Wi-Fi vira WIFI:T:WPA;S:…;P:…;;',
  },
  {
    n: 'PASSO 02',
    title: 'Ajuste a aparência',
    text: 'Estilo dos módulos, cor dos pixels, dos olhos e do fundo. Contraste abaixo de 3:1 avisa, mas não bloqueia.',
  },
  {
    n: 'PASSO 03',
    title: 'Baixe ou copie',
    text: 'PNG para tela e slides, SVG para impressão. Copiar usa a Clipboard API, com download como alternativa.',
  },
]

export function Steps() {
  return (
    <section id="passos" className={band}>
      <Head
        eyebrow="Fluxo"
        title="Três passos, nenhuma etapa escondida"
        lead="O mesmo fluxo do estúdio acima, que é a jornada mínima até o download."
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid md:grid-cols-3"
      >
        {STEPS.map((step, i) => (
          <motion.div
            key={step.n}
            variants={rise}
            className={`py-6 md:py-0 ${i === 0 ? '' : 'border-t border-line pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6'} ${i === 0 ? 'md:pr-6' : 'md:pr-6'}`}
          >
            <span className="font-mono text-xs font-semibold tracking-widest text-accent">{step.n}</span>
            <h3 className="mt-2.5 mb-2 text-lg font-bold">{step.title}</h3>
            <p className="text-[15px] text-muted">{step.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

const KINDS = [
  { tag: 'MVP', title: 'URL', text: 'Link direto, sem encurtador no meio. O QR carrega a URL real.' },
  { tag: 'MVP', title: 'Texto', text: 'Até 1000 caracteres. Funciona sem internet: senha, código, instruções.' },
  { tag: 'MVP', title: 'Contato (vCard)', text: 'vCard 3.0 salvo direto na agenda de quem escaneia.' },
  { tag: 'MVP', title: 'E-mail', text: 'mailto: com assunto e corpo já preenchidos.' },
  { tag: 'MVP', title: 'SMS', text: 'SMSTO: com número e mensagem prontos para enviar.' },
  { tag: 'MVP', title: 'Telefone', text: 'Abre o discador com o número já digitado.' },
  { tag: 'MVP', title: 'Wi-Fi', text: 'SSID, senha e criptografia no código. Conecta sem digitar nada.' },
  // fase 2, reativar quando o backend existir:
  // { tag: 'FASE 2', title: 'PDF e arquivos', text: 'Precisa hospedar o arquivo. No MVP, use um link já publicado.' },
  // { tag: 'FASE 2', title: 'Multi-URL', text: 'Precisa de uma página de destino servida por nós.' },
  // { tag: 'FASE 2', title: 'QR dinâmico', text: 'Redirecionamento editável e contagem de scans exigem backend.' },
]

export function TypesGrid() {
  return (
    <section id="tipos" className={band}>
      <Head
        eyebrow="Cobertura"
        title="Os tipos que você pode gerar agora"
        lead="Tudo é codificado no próprio payload, então cada código funciona offline e não depende de servidor."
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {KINDS.map((kind) => (
          <motion.article
            key={kind.title}
            variants={rise}
            className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4.5 transition-colors hover:border-accent"
          >
            <span
              className={`self-start rounded px-1.5 py-0.5 font-mono text-[10.5px] tracking-widest uppercase ${
                kind.tag === 'MVP' ? 'bg-accent-soft text-accent' : 'bg-signal/15 text-signal'
              }`}
            >
              {kind.tag}
            </span>
            <h3 className="text-base font-bold">{kind.title}</h3>
            <p className="text-sm text-muted">{kind.text}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}

const PLACES = [
  { title: 'Embalagem', text: 'Manual, vídeo de montagem, garantia. Imprima com no mínimo 2,5 cm de lado.' },
  { title: 'Cartão de visita', text: 'vCard com telefone e site. Deixe 4 módulos de margem branca.' },
  { title: 'Vitrine e fachada', text: 'Escaneado de 1 a 3 m: cada metro de distância pede ~10 cm de código.' },
  { title: 'Mesa e balcão', text: 'Cardápio, avaliação, gorjeta. Evite plástico brilhante, que reflete o flash.' },
  { title: 'Assinatura de e-mail', text: 'Exporte em SVG: não pixeliza em tela retina nem ao ser reencaminhado.' },
  { title: 'Cartaz e panfleto', text: 'Uma chamada ao lado do código aumenta bastante a taxa de leitura.' },
]

export function Places() {
  return (
    <section id="onde" className={band}>
      <Head
        eyebrow="Aplicação"
        title="Onde o código costuma ser escaneado"
        lead="O tamanho impresso decide a versão do QR: abaixo de 2 cm em papel, reduza o conteúdo ou suba a correção de erro."
      />
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLACES.map((place) => (
          <div key={place.title}>
            <div className="mb-3 h-[3px] w-8 rounded-full bg-accent" />
            <h3 className="mb-1 text-[15.5px] font-bold">{place.title}</h3>
            <p className="text-sm text-muted">{place.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const FAQ = [
  {
    q: 'Esse QR Code expira?',
    a: 'Não. O conteúdo está codificado nos próprios módulos — não há servidor intermediário para sair do ar. Só o QR dinâmico da fase 2 dependerá de um destino hospedado.',
  },
  {
    q: 'Por que meu código não escaneia?',
    a: 'Nesta ordem: contraste baixo entre pixels e fundo, margem branca menor que 4 módulos, tamanho impresso insuficiente, logo cobrindo mais de 30% da área, ou conteúdo longo demais para a versão gerada.',
  },
  {
    q: 'Meus dados são enviados para algum lugar?',
    a: 'Não. A geração roda inteira no navegador com qr-code-styling. Sem requisição de rede, o payload nunca sai da aba.',
  },
  {
    q: 'PNG ou SVG?',
    a: 'SVG para impressão e para qualquer coisa que será redimensionada. PNG para redes sociais, slides e onde SVG não é aceito.',
  },
]

export function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className={band}>
      <Head eyebrow="Dúvidas" title="Perguntas frequentes" />
      <div className="flex flex-col border-t border-line">
        {FAQ.map((item, i) => (
          <div key={item.q} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="flex w-full items-center gap-3 py-4 text-left text-[16.5px] font-semibold"
            >
              {item.q}
              <span aria-hidden="true" className="ml-auto font-mono text-xl text-accent">
                {open === i ? '–' : '+'}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[70ch] pb-5 text-muted">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Cta() {
  return (
    <div className="mb-18 flex flex-wrap items-center justify-between gap-7 rounded-3xl bg-panel px-10 py-11 text-panel-ink">
      <div>
        <h2 className="max-w-[18ch] text-[clamp(24px,3vw,32px)] font-bold tracking-tight">
          Tudo acontece no cliente, inclusive o download
        </h2>
        <p className="mt-2 text-[15.5px] text-panel-muted">
          Sem conta, sem upload, sem redirecionador no meio do caminho.
        </p>
      </div>
      <a
        href="#estudio"
        className="flex min-h-11 items-center rounded-xl bg-accent px-5.5 text-[15.5px] font-semibold text-accent-ink"
      >
        Gerar meu QR Code
      </a>
    </div>
  )
}
