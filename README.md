# Gerador de QR Code

Gerador de QR Code que roda inteiro no navegador: escolha o tipo, preencha os campos e baixe em PNG ou SVG.
Nenhum dado sai da aba — não há backend, upload nem redirecionador no meio do caminho.

Especificação completa em [SPEC.md](SPEC.md).

## Stack

React 19 · Vite 8 · Tailwind CSS v4 · Motion · qr-code-styling · Vitest

Sem UI kit, sem state manager, sem biblioteca de ícones ou de formulário: os ícones são SVG inline e a
validação são funções puras.

## Comandos

```bash
npm install
```

```bash
npm run dev
```

```bash
npm test
```

```bash
npm run build
```

`npm run lint` roda o oxlint. O build faz `tsc -b` antes do bundle.

## Configuração

Copie `.env.example` para `.env` e preencha a chave do formulário de contato do rodapé:

```bash
cp .env.example .env
```

| Variável | Para que serve |
|---|---|
| `VITE_WEB3FORMS_KEY` | Chave de acesso do [Web3Forms](https://web3forms.com). É pública por design: vai no bundle do cliente. Sem ela, o formulário abre mas o envio fica desativado, com aviso. |

## O que o gerador faz

| Tipo | Payload gerado |
|---|---|
| URL | o link literal, sem encurtador no meio |
| Texto | texto cru, até 1000 caracteres |
| Contato | `BEGIN:VCARD` … `END:VCARD` (vCard 3.0) |
| E-mail | `mailto:` com assunto e corpo já preenchidos |
| SMS | `SMSTO:<número>:<mensagem>` |
| Telefone | `tel:<número>` |
| Wi-Fi | `WIFI:T:WPA;S:<rede>;P:<senha>;;` |

PDF, Multi-URL e QR dinâmico ficam para a fase 2: todos precisam de um servidor para hospedar o destino.
As configurações deles seguem no código, comentadas em `TYPE_ORDER`.

Outros recursos:

- Preview ao vivo com debounce de 300 ms; o conteúdo de cada tipo é preservado ao trocar de aba.
- 10 modelos prontos, mais ajuste de estilo dos módulos e das cores de pixels, olhos e fundo.
  Contraste abaixo de 3:1 exibe aviso sem bloquear o download.
- Exportação em PNG e SVG, cópia da imagem para a área de transferência e cópia do payload clicando no campo.
- Tema claro e escuro. O padrão segue o sistema; ao clicar no seletor, a escolha vai para o `localStorage`.

## Estrutura

```
src/
  App.tsx                    composição das seções e o rodapé
  features/qr/
    QrStudio.tsx             estado do estúdio (useReducer) e layout
    QrTypeTabs.tsx           abas por tipo, com scroll horizontal no mobile
    QrForm.tsx               formulário montado a partir da configuração do tipo
    QrPreview.tsx            código, payload clicável e mensagens de erro
    QrActions.tsx            PNG, SVG e copiar imagem
    TemplateRail.tsx         trilho de modelos
    CustomizePanel.tsx       estilo e cores
    schemas.ts               campos, encoders, validadores, modelos e contraste
    useQrCode.ts             instancia o qr-code-styling sob demanda
    icons.tsx                ícones SVG das abas e dos botões
  components/
    ContactModal.tsx         formulário de contato em <dialog> nativo
    contact-rules.ts         validadores do formulário
    ThemeToggle.tsx          seletor de tema
  sections/                  Header, Hero e as seções da landing
  lib/motion.ts              variants e transições compartilhadas
  index.css                  tokens de tema (claro/escuro) + Tailwind
```

## Testes

`npm test` cobre o que concentra o risco: os encoders de payload, os validadores por tipo, o cálculo de
contraste e as regras do formulário de contato. Sem testes de render — a interface é verificada no navegador.

## Decisões que fogem da SPEC

- As seções da landing ficam em um único `sections/Sections.tsx`, não um arquivo por seção.
- Formulários usam `useReducer` e validadores puros no lugar de `react-hook-form` + `zod`: os campos vêm de
  configuração e cada regra cabe em uma linha.
- Trocar de aba preserva o que já foi digitado, então não existe o diálogo de descarte que o site de
  referência mostra.
- Wi-Fi entrou no lugar de App e Social: é offline de verdade e mostra melhor a proposta.

## Créditos

Desenvolvido por Israel Messias Júnior — [www.jrmessias.com.br](https://www.jrmessias.com.br)
