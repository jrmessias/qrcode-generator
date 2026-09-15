import { QrStudio } from '../features/qr/QrStudio'

export function Hero() {
  return (
    <section id="estudio" className="pt-14 pb-6">
      <div className="flex max-w-[660px] flex-col gap-3.5">
        <h1 className="text-[clamp(34px,4.4vw,52px)] font-bold tracking-tight">
          QR Code gerado <em className="text-accent not-italic">no seu navegador</em>, sem conta e sem servidor.
        </h1>
        <p className="max-w-[56ch] text-lg text-muted">
          Escolha o tipo, preencha os campos e baixe em PNG ou SVG. O payload é montado localmente — nada do que
          você digita sai desta página.
        </p>
      </div>
      <QrStudio />
    </section>
  )
}
