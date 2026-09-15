# Especificação — Gerador de QR Code

Referência analisada: https://www.the-qrcode-generator.com/ (TQRCG), acessado em 2026-09-15.
Escopo desta spec: clone funcional do **gerador** (hero tool) + landing page de apoio, 100% client-side.

---

## 1. Escopo

### 1.1 Dentro do escopo (MVP)

- Geração de QR Code estático no navegador, com preview em tempo real (debounce).
- 10 tipos de conteúdo: URL, PDF, Multi-URL, Contato (vCard), Texto, App, SMS, E-mail, Telefone, Social.
- Customização visual: estilo dos módulos, cores (fundo/olhos/pixels), logo central, templates pré-definidos.
- Exportação: PNG (com escolha de tamanho) e SVG.
- Copiar imagem para a área de transferência.
- Landing page: como funciona (3 passos), tipos de QR, casos de uso, indústrias, FAQ com accordion, CTA final.
- Responsivo (mobile-first), tema claro, acessível (WCAG 2.1 AA).

### 1.2 Fora do escopo (MVP)

- QR Codes dinâmicos, redirecionamento, tracking de scans, analytics.
- Autenticação, contas, dashboard, planos/pricing, times.
- Backend, persistência remota, upload de arquivos para servidor.
- i18n multi-idioma (estrutura preparada, mas só `pt-BR` + `en` de conteúdo).

> Justificativa: tudo que é dinâmico exige backend + banco + domínio de redirecionamento. O MVP entrega valor completo no que é puramente client-side; o resto entra em fase 2 com API própria.

---

## 2. Stack

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | React 19 + Vite | SPA estática, sem necessidade de SSR no MVP |
| Estilo | Tailwind CSS v4 | tokens via `@theme`, zero config file |
| Animação | `motion` (motion/react) | API de `framer-motion`, bundle menor |
| QR engine | `qr-code-styling` | estilos de módulo, olhos, logo, export PNG/SVG em uma dependência |
| Forms | estado próprio (`useReducer`) + validadores puros | os formulários são gerados por configuração; `react-hook-form` + `zod` não pagariam o próprio peso aqui |
| Ícones | SVG inline | evita uma dependência para ~12 ícones |
| Testes | Vitest | cobre os encoders e validadores, que é onde mora o risco |

Nada além disso. Sem state manager global, sem UI kit.

---

## 3. Arquitetura

```
src/
  App.tsx                   # composição das seções
  features/qr/
    QrStudio.tsx            # container do gerador (estado + layout)
    QrTypeTabs.tsx          # barra de tipos, scrollável no mobile
    QrForm.tsx              # formulário gerado a partir da config do tipo
    QrPreview.tsx           # render do QR + payload
    QrActions.tsx           # Download PNG / SVG / Copiar
    TemplateRail.tsx        # trilho de templates
    CustomizePanel.tsx      # estilo e cores
    schemas.ts              # config de campos, encoders e validadores por tipo
    schemas.test.ts
    useQrCode.ts            # instancia qr-code-styling, sincroniza opções
    types.ts
  components/               # Toggle, Accordion
  sections/                 # Header, Hero, Steps, TypesGrid, Places, Faq, Cta, Footer
  lib/motion.ts             # variants e transitions compartilhados
  index.css                 # tokens de tema + Tailwind
```

### 3.1 Estado do gerador

Um único `useReducer` em `QrStudio`:

```ts
type QrState = {
  type: QrType;                    // 'url' | 'vcard' | ...
  values: Record<QrType, Values>;  // conteúdo por tipo, preservado ao trocar de aba
  design: QrDesign;                // style, cores, template
};
```

- Payload do QR = `ENCODERS[type](values[type])` — funções puras, testáveis isoladamente.
- Preview recalcula com debounce de **300 ms** após digitação.
- O conteúdo de cada tipo é preservado ao trocar de aba, então não existe diálogo de descarte (a referência descarta; preservar é melhor e mais barato).

---

## 4. Tipos de QR Code

| Tipo | Campos | Payload |
|---|---|---|
| URL | url (obrigatório, `https?://`) | url literal |
| Texto | textarea (máx. 1000 chars) | texto cru |
| Contato | nome, sobrenome, empresa, cargo, e-mail, celular, site | `BEGIN:VCARD…VERSION:3.0…END:VCARD` |
| E-mail | destinatário, assunto, corpo | `mailto:?subject=&body=` |
| SMS | telefone, mensagem | `SMSTO:<tel>:<msg>` |
| Telefone | telefone | `tel:<num>` |
| Wi-Fi | SSID, senha, criptografia | `WIFI:T:WPA;S:<ssid>;P:<senha>;;` |
| PDF | — | **fase 2**: hospedar arquivo exige backend |
| Multi-URL | — | **fase 2**: exige página de destino servida por nós |

Validação: validadores puros por tipo; erro inline com `aria-live`. Preview só atualiza quando o payload é válido.

---

## 5. Customização

- **Estilo** — Clássico, Arredondado, Círculos, Elegante, Suave (`dotsOptions.type`).
- **Cor** — pixels, olhos e fundo, via `<input type="color">`.
- **Templates** — trilho com presets de `design`.
- **Logo** — fase 2 (upload local ≤ 1 MB, tamanho e margem).

Regra de contraste: contraste entre pixels e fundo < 3:1 exibe alerta "QR pode não ser lido" — sem bloquear.

---

## 6. Exportação

- **PNG** e **SVG** via `qr-code-styling`, nome `qrcode-<tipo>.<ext>`.
- **Copiar**: `navigator.clipboard.write` com `ClipboardItem` PNG; fallback para download.
- Margem branca (quiet zone) de 4 módulos sempre presente.

---

## 7. Motion

Variants em `lib/motion.ts`. Transição padrão: `{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }`.

| Elemento | Animação |
|---|---|
| Seções da landing | fade + `y: 16 → 0` com `whileInView`, partindo de estado visível |
| Troca de tipo de QR | `AnimatePresence mode="wait"` no formulário |
| Indicador da aba ativa | `layoutId="tab-indicator"` |
| Preview do QR | `key` no payload + `scale: 0.96 → 1` (180 ms) |
| Accordion do FAQ | `height: 'auto'` animado |
| Botões | `whileHover={{ y: -1 }}`, `whileTap={{ scale: 0.98 }}` |

**Reduced motion**: `useReducedMotion()` — quando `true`, só opacidade anima.

---

## 8. Layout e responsividade

- **≥ 1024 px**: cartão escuro do estúdio em grid `1.35fr .9fr` — formulário à esquerda, preview + trilho + ações à direita.
- **768–1023 px**: coluna única, preview abaixo do formulário.
- **< 768 px**: abas em scroll horizontal; ações em linha sob o preview.
- Alvos de toque mínimo 44×44 px.

---

## 9. Acessibilidade

- Abas com `role="tablist"/"tab"`, navegação por setas, `aria-selected`.
- Erros e payload em regiões `aria-live="polite"`.
- Contraste AA no cartão escuro.
- Foco sempre visível; nenhuma funcionalidade exclusiva de hover.

---

## 10. Performance

- LCP < 2,0 s em 4G simulado; CLS < 0,1.
- `qr-code-styling` carregado com `import()` dinâmico no primeiro render do estúdio.
- Bundle inicial alvo: < 180 kB gzip.

---

## 11. Critérios de aceite

1. Digitar uma URL válida atualiza o preview em até 400 ms, sem recarregar a página.
2. Cada tipo ativo produz payload que, escaneado por câmera de celular, dispara a ação correta.
3. O conteúdo de um tipo é preservado ao voltar para ele depois de visitar outro.
4. Download em PNG e SVG produz arquivo escaneável.
5. Com `prefers-reduced-motion: reduce`, nenhuma animação de posição ou escala ocorre.
6. Navegação completa por teclado do header ao CTA final, com foco sempre visível.
7. Testes unitários cobrindo todos os encoders e validadores.

---

## 12. Fases

- **Fase 1 (MVP)**: seções 1.1, 3–10.
- **Fase 2**: backend (Node + Postgres), QR dinâmico, redirecionamento, tracking, contas, logo, PDF e Multi-URL.
- **Fase 3**: pricing, times, extensão de navegador, i18n completo.
