# UX Redesign — Exploração Gamificada: Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Payments Knowledge System from a dark, dense documentation site into a light, gamified learning platform (Duolingo-inspired) with XP, badges, streaks, levels, quizzes, and simplified navigation.

**Architecture:** Light mode CSS-first redesign. New gamification system built on localStorage hooks (following existing `useTrailProgress` pattern). Sidebar reduced from 30+ items to 5. Homepage becomes a student dashboard. Content pages gain accordions, quizzes, and completion cards.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4, CSS custom properties, localStorage, TypeScript

**Critical constraint:** `* { margin: 0; padding: 0; }` in globals.css breaks Tailwind spacing. Use inline `style={{ }}` or custom CSS classes for all spacing.

**Design doc:** `docs/plans/2026-03-21-ux-redesign-exploracao-gamificada.md`

---

## Task 1: Light Mode Design System

**Files:**
- Modify: `frontend/src/app/globals.css:1-52` (CSS variables)
- Modify: `frontend/src/app/globals.css:36-52` (remove dark mode override)
- Modify: `frontend/src/app/globals.css` (add new component classes)

**Step 1: Replace CSS custom properties**

In `globals.css`, replace the `:root` block (lines 3-34) with the new light mode palette:

```css
:root {
  --background: #FAFBFC;
  --foreground: #111827;
  --primary: #6366F1;
  --primary-light: #818CF8;
  --primary-lighter: #A5B4FC;
  --primary-dark: #4F46E5;
  --primary-bg: #EEF2FF;
  --accent: #818CF8;
  --accent-light: #E0E7FF;
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --surface: #FFFFFF;
  --surface-hover: #F3F4F6;
  --surface-active: #E5E7EB;
  --border: #E5E7EB;
  --border-hover: #6366F1;
  --text-muted: #6B7280;
  --text-light: #9CA3AF;
  --sidebar-width: 240px;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  --card-shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.08);
  --card-shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.1);
  --glow: 0 0 20px rgba(99, 102, 241, 0.15);
  --accent-amber: #F59E0B;
  --accent-emerald: #10B981;
  --accent-violet: #8B5CF6;
  --accent-rose: #F43F5E;
  --accent-sky: #0EA5E9;
  --accent-teal: #14B8A6;
  --xp-gold: #F59E0B;
  --streak-orange: #F97316;
  --danger: #EF4444;
  --gradient-primary: linear-gradient(135deg, #6366F1 0%, #818CF8 100%);
  --gradient-subtle: linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(129, 140, 248, 0.03) 100%);
}
```

**Step 2: Remove the dark mode media query**

Delete the entire `@media (prefers-color-scheme: dark)` block (lines 36-52).

**Step 3: Update body styles**

Ensure `html, body` styles use the new palette. The body should have `background: var(--background); color: var(--foreground);`.

**Step 4: Add new component classes**

Append these new classes to globals.css:

```css
/* ── Accordion ─────────────────────────────────────── */
.accordion-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--foreground);
  transition: all 0.2s;
}
.accordion-trigger:hover {
  background: var(--surface-hover);
  border-color: var(--primary);
}
.accordion-trigger[data-open="true"] {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-color: var(--primary);
  background: var(--primary-bg);
}
.accordion-content {
  border: 1px solid var(--border);
  border-top: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 1.25rem;
  background: var(--surface);
}

/* ── Trail Bar ─────────────────────────────────────── */
.trail-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: var(--primary-bg);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
  font-size: 0.8125rem;
  color: var(--foreground);
}
.trail-bar-progress {
  flex: 1;
  height: 6px;
  background: rgba(99, 102, 241, 0.15);
  border-radius: 3px;
  overflow: hidden;
}
.trail-bar-progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* ── Quiz Card ─────────────────────────────────────── */
.quiz-card {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}
.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--gradient-subtle);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
}
.quiz-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9375rem;
  transition: all 0.15s;
}
.quiz-option:hover {
  background: var(--surface-hover);
  border-color: var(--primary);
}
.quiz-option[data-selected="true"] {
  border-color: var(--primary);
  background: var(--primary-bg);
}
.quiz-option[data-correct="true"] {
  border-color: var(--success);
  background: rgba(16, 185, 129, 0.08);
}
.quiz-option[data-incorrect="true"] {
  border-color: var(--danger);
  background: rgba(239, 68, 68, 0.08);
}

/* ── Completion Card ───────────────────────────────── */
.completion-card {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(16, 185, 129, 0.06) 100%);
  border: 2px solid var(--success);
  border-radius: 16px;
}

/* ── XP Badge ──────────────────────────────────────── */
.xp-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: rgba(245, 158, 11, 0.12);
  color: var(--xp-gold);
  font-weight: 700;
  font-size: 0.75rem;
  border-radius: 999px;
}

/* ── Streak Badge ──────────────────────────────────── */
.streak-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: rgba(249, 115, 22, 0.12);
  color: var(--streak-orange);
  font-weight: 700;
  font-size: 0.75rem;
  border-radius: 999px;
}

/* ── Level Progress ────────────────────────────────── */
.level-bar {
  width: 100%;
  height: 8px;
  background: var(--surface-hover);
  border-radius: 4px;
  overflow: hidden;
}
.level-bar-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* ── Badge Grid ────────────────────────────────────── */
.badge-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  text-align: center;
  font-size: 0.75rem;
  transition: all 0.2s;
}
.badge-cell[data-unlocked="true"] {
  background: var(--surface);
  border-color: var(--xp-gold);
}
.badge-cell[data-unlocked="false"] {
  background: var(--surface-hover);
  opacity: 0.5;
  filter: grayscale(1);
}

/* ── Learning Objectives ───────────────────────────── */
.learning-objectives {
  padding: 1rem 1.25rem;
  background: var(--primary-bg);
  border-left: 3px solid var(--primary);
  border-radius: 0 12px 12px 0;
}
.learning-objectives li {
  list-style: none;
  padding: 0.25rem 0;
  font-size: 0.9375rem;
  color: var(--foreground);
}
.learning-objectives li::before {
  content: "✓ ";
  color: var(--primary);
  font-weight: 700;
}

/* ── Confetti animation ────────────────────────────── */
@keyframes confetti-pop {
  0% { transform: scale(0) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
}
@keyframes xp-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-confetti { animation: confetti-pop 0.5s ease-out; }
.animate-xp-bounce { animation: xp-bounce 0.4s ease-out; }
```

**Step 5: Verify the app compiles**

Run: `cd frontend && npm run dev` — check no CSS errors.

**Step 6: Commit**

```bash
git add frontend/src/app/globals.css
git commit -m "feat: light mode design system with gamification CSS components"
```

---

## Task 2: Gamification Data & Types

**Files:**
- Create: `frontend/src/data/badges.ts`
- Create: `frontend/src/data/quizzes.ts`
- Create: `frontend/src/data/levels.ts`

**Step 1: Create badge definitions**

Create `frontend/src/data/badges.ts`:

```typescript
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "explorer" | "student" | "trailblazer" | "consistency";
  xpReward: number;
  condition: {
    type: "pages_visited" | "quizzes_perfect" | "quizzes_completed" | "trails_completed" | "streak_days";
    threshold: number;
  };
}

export const BADGES: Badge[] = [
  // Explorer
  { id: "first-step", name: "Primeiro Passo", icon: "🌟", description: "Visitou sua primeira página", category: "explorer", xpReward: 10, condition: { type: "pages_visited", threshold: 1 } },
  { id: "dedicated-reader", name: "Leitor Dedicado", icon: "📚", description: "Visitou 10 páginas", category: "explorer", xpReward: 25, condition: { type: "pages_visited", threshold: 10 } },
  { id: "explorer", name: "Explorador", icon: "🗺️", description: "Visitou 20 páginas", category: "explorer", xpReward: 50, condition: { type: "pages_visited", threshold: 20 } },
  { id: "cartographer", name: "Cartógrafo", icon: "🌍", description: "Visitou todas as 30 páginas", category: "explorer", xpReward: 100, condition: { type: "pages_visited", threshold: 30 } },
  // Student
  { id: "curious", name: "Curioso", icon: "🧠", description: "Completou seu primeiro quiz", category: "student", xpReward: 10, condition: { type: "quizzes_completed", threshold: 1 } },
  { id: "precision", name: "Precisão", icon: "🎯", description: "Acertou 3 quizzes com 100%", category: "student", xpReward: 30, condition: { type: "quizzes_perfect", threshold: 3 } },
  { id: "perfection", name: "Perfeição", icon: "💯", description: "Acertou todos os quizzes com 100%", category: "student", xpReward: 200, condition: { type: "quizzes_perfect", threshold: 99 } },
  // Trailblazer
  { id: "takeoff", name: "Decolagem", icon: "🏁", description: "Completou sua primeira trilha", category: "trailblazer", xpReward: 50, condition: { type: "trails_completed", threshold: 1 } },
  { id: "specialist", name: "Especialista", icon: "⭐", description: "Completou 3 trilhas", category: "trailblazer", xpReward: 100, condition: { type: "trails_completed", threshold: 3 } },
  { id: "master", name: "Mestre", icon: "🏆", description: "Completou todas as trilhas", category: "trailblazer", xpReward: 300, condition: { type: "trails_completed", threshold: 99 } },
  // Consistency
  { id: "on-fire", name: "Em Chamas", icon: "🔥", description: "Streak de 3 dias", category: "consistency", xpReward: 20, condition: { type: "streak_days", threshold: 3 } },
  { id: "unstoppable", name: "Imparável", icon: "⚡", description: "Streak de 7 dias", category: "consistency", xpReward: 50, condition: { type: "streak_days", threshold: 7 } },
  { id: "legendary", name: "Lendário", icon: "💎", description: "Streak de 30 dias", category: "consistency", xpReward: 200, condition: { type: "streak_days", threshold: 30 } },
];

export const BADGE_CATEGORIES = [
  { id: "explorer" as const, name: "Explorador", icon: "🧭" },
  { id: "student" as const, name: "Estudante", icon: "📖" },
  { id: "trailblazer" as const, name: "Trilheiro", icon: "🥾" },
  { id: "consistency" as const, name: "Consistência", icon: "📅" },
];
```

**Step 2: Create level definitions**

Create `frontend/src/data/levels.ts`:

```typescript
export interface Level {
  level: number;
  name: string;
  minXP: number;
}

export const LEVELS: Level[] = [
  { level: 1, name: "Iniciante", minXP: 0 },
  { level: 2, name: "Curioso", minXP: 100 },
  { level: 3, name: "Estudante", minXP: 250 },
  { level: 4, name: "Analista", minXP: 400 },
  { level: 5, name: "Especialista", minXP: 700 },
  { level: 6, name: "Mestre em Pagamentos", minXP: 1000 },
];

export function getLevelForXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp: number): Level | null {
  const current = getLevelForXP(xp);
  const idx = LEVELS.findIndex((l) => l.level === current.level);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getLevelProgress(xp: number): { current: Level; next: Level | null; percent: number } {
  const current = getLevelForXP(xp);
  const next = getNextLevel(xp);
  if (!next) return { current, next: null, percent: 100 };
  const range = next.minXP - current.minXP;
  const progress = xp - current.minXP;
  return { current, next, percent: Math.round((progress / range) * 100) };
}
```

**Step 3: Create quiz data**

Create `frontend/src/data/quizzes.ts`:

```typescript
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PageQuiz {
  pageRoute: string;
  questions: QuizQuestion[];
}

export const QUIZZES: PageQuiz[] = [
  {
    pageRoute: "/explore/payments-map",
    questions: [
      { id: "pm-1", question: "Qual camada do stack de pagamentos lida diretamente com o usuário final?", options: ["Processamento", "Experiência", "Rede", "Liquidação"], correctIndex: 1, explanation: "A camada de Experiência inclui checkout UI, seleção de método de pagamento e SDKs mobile — tudo que o cliente vê e interage." },
      { id: "pm-2", question: "O que faz a camada de Orquestração?", options: ["Processa transações bancárias", "Roteia pagamentos e gerencia retentativas", "Autentica o portador do cartão", "Liquida fundos entre bancos"], correctIndex: 1, explanation: "A Orquestração é responsável por smart routing, retry logic, cascading entre adquirentes e split de pagamentos." },
      { id: "pm-3", question: "Quantas camadas tem o stack moderno de pagamentos?", options: ["3", "4", "6", "8"], correctIndex: 2, explanation: "São 6 camadas: Experiência, Orquestração, Processamento, Rede, Bancário e Liquidação." },
    ],
  },
  {
    pageRoute: "/explore/payment-rails",
    questions: [
      { id: "pr-1", question: "Qual trilho oferece liquidação instantânea no Brasil?", options: ["Cartão de crédito", "PIX", "SEPA", "ACH"], correctIndex: 1, explanation: "PIX é o sistema de pagamento instantâneo do Banco Central do Brasil, com liquidação em segundos, 24/7." },
      { id: "pr-2", question: "Qual é a faixa típica de taxas para cartões de crédito?", options: ["0% - 0.5%", "0.5% - 1%", "1.5% - 3.5%", "5% - 10%"], correctIndex: 2, explanation: "Cartões tipicamente cobram entre 1.5% e 3.5% incluindo interchange, taxa da bandeira e markup do adquirente." },
      { id: "pr-3", question: "O que significa 'reversibilidade' em trilhos de pagamento?", options: ["Velocidade de liquidação", "Capacidade de estornar/disputar uma transação", "Taxa de conversão", "Cobertura geográfica"], correctIndex: 1, explanation: "Reversibilidade refere-se à capacidade de desfazer uma transação — cartões têm chargeback, PIX tem MED, transferências bancárias são geralmente irreversíveis." },
    ],
  },
  {
    pageRoute: "/explore/transaction-flows",
    questions: [
      { id: "tf-1", question: "Em um pagamento com cartão, quem autoriza a transação?", options: ["O adquirente", "A bandeira", "O emissor", "O gateway"], correctIndex: 2, explanation: "O emissor (banco do portador) é quem autoriza ou recusa a transação baseado no saldo, limites e regras de fraude." },
      { id: "tf-2", question: "O que acontece na etapa de 'clearing'?", options: ["Dinheiro é transferido", "Transações são reconciliadas entre partes", "Cartão é validado", "Fraude é detectada"], correctIndex: 1, explanation: "Clearing é o processo de reconciliação onde as transações são agrupadas e os valores líquidos são calculados antes da liquidação." },
    ],
  },
  {
    pageRoute: "/explore/ecosystem-map",
    questions: [
      { id: "em-1", question: "Qual é o papel de um PSP (Payment Service Provider)?", options: ["Emitir cartões", "Intermediar entre comerciante e adquirente", "Regular o mercado", "Liquidar transações"], correctIndex: 1, explanation: "PSPs como Stripe, Adyen e PagSeguro fazem a intermediação entre o comerciante e a infraestrutura de pagamentos, simplificando a integração." },
      { id: "em-2", question: "O que diferencia um adquirente de um sub-adquirente?", options: ["O volume de transações", "O adquirente tem conexão direta com as bandeiras", "O sub-adquirente é mais barato", "Não há diferença"], correctIndex: 1, explanation: "O adquirente tem conexão direta com as bandeiras (Visa, Mastercard). O sub-adquirente usa o adquirente como intermediário, facilitando a entrada de pequenos comerciantes." },
    ],
  },
  {
    pageRoute: "/explore/financial-system",
    questions: [
      { id: "fs-1", question: "O que é um sistema RTGS?", options: ["Sistema de cartões", "Sistema de liquidação bruta em tempo real", "Rede de criptomoedas", "Protocolo de autenticação"], correctIndex: 1, explanation: "RTGS (Real-Time Gross Settlement) liquida transações individualmente em tempo real, usado para transferências de alto valor entre bancos." },
      { id: "fs-2", question: "Qual a função de uma câmara de compensação (clearing house)?", options: ["Emitir moeda", "Ser contraparte central e reduzir risco", "Processar cartões", "Regular fintechs"], correctIndex: 1, explanation: "Câmaras de compensação atuam como contraparte central (CCP), garantindo que ambas as partes cumpram suas obrigações e reduzindo risco sistêmico." },
    ],
  },
  {
    pageRoute: "/infrastructure/banking-systems",
    questions: [
      { id: "bs-1", question: "O que é o core banking system?", options: ["Sistema de internet banking", "Sistema central que processa operações bancárias", "Sistema de segurança", "Sistema de atendimento"], correctIndex: 1, explanation: "Core banking é o sistema central que gerencia contas, transações, saldos e operações fundamentais do banco, funcionando 24/7." },
      { id: "bs-2", question: "O que significa 'ledger' no contexto bancário?", options: ["Protocolo de rede", "Livro-razão de transações", "Tipo de conta", "Sistema de fraude"], correctIndex: 1, explanation: "Ledger é o livro-razão que registra todas as transações contábeis, mantendo o registro autoritativo de saldos e movimentações." },
    ],
  },
  {
    pageRoute: "/infrastructure/settlement-systems",
    questions: [
      { id: "ss-1", question: "Qual a diferença entre liquidação bruta e líquida?", options: ["Bruta é mais rápida", "Bruta liquida individualmente, líquida compensa antes", "Líquida é mais cara", "Não há diferença prática"], correctIndex: 1, explanation: "Liquidação bruta (RTGS) processa cada transação individualmente. Liquidação líquida (DNS) compensa as transações entre si primeiro, transferindo apenas o saldo líquido." },
    ],
  },
  {
    pageRoute: "/infrastructure/liquidity-treasury",
    questions: [
      { id: "lt-1", question: "O que é gestão de liquidez?", options: ["Investir em ações", "Garantir que há fundos disponíveis para honrar obrigações", "Vender ativos rapidamente", "Calcular impostos"], correctIndex: 1, explanation: "Gestão de liquidez assegura que a instituição tenha fundos suficientes para honrar pagamentos e obrigações no momento certo, equilibrando rentabilidade e disponibilidade." },
    ],
  },
  {
    pageRoute: "/crypto/blockchain-map",
    questions: [
      { id: "bm-1", question: "O que é um mecanismo de consenso?", options: ["Acordo entre reguladores", "Método para validar transações na blockchain", "Tipo de criptografia", "Protocolo de comunicação"], correctIndex: 1, explanation: "Mecanismo de consenso (PoW, PoS, etc.) é como os nós da rede concordam sobre quais transações são válidas, sem uma autoridade central." },
      { id: "bm-2", question: "Qual a diferença entre Layer 1 e Layer 2?", options: ["L1 é mais rápido", "L1 é a blockchain base, L2 são soluções de escalabilidade sobre ela", "L2 é mais seguro", "São a mesma coisa"], correctIndex: 1, explanation: "Layer 1 é a blockchain principal (Bitcoin, Ethereum). Layer 2 são protocolos construídos sobre L1 para aumentar velocidade e reduzir custos (Lightning Network, Arbitrum)." },
    ],
  },
  {
    pageRoute: "/crypto/stablecoin-systems",
    questions: [
      { id: "sc-1", question: "O que garante o valor de uma stablecoin lastreada em fiat?", options: ["Algoritmos matemáticos", "Reservas em moeda fiduciária mantidas pelo emissor", "Mineração", "Contratos inteligentes"], correctIndex: 1, explanation: "Stablecoins lastreadas em fiat (USDT, USDC) mantêm reservas equivalentes em dólares, títulos do tesouro ou equivalentes de caixa para garantir a paridade 1:1." },
    ],
  },
  {
    pageRoute: "/crypto/defi-protocols",
    questions: [
      { id: "dp-1", question: "O que é um AMM (Automated Market Maker)?", options: ["Um robô de trading", "Protocolo que usa pools de liquidez em vez de order books", "Uma exchange centralizada", "Um tipo de stablecoin"], correctIndex: 1, explanation: "AMMs como Uniswap usam pools de liquidez e fórmulas matemáticas (x*y=k) para precificar ativos, permitindo trocas sem order book tradicional." },
    ],
  },
  {
    pageRoute: "/knowledge/features",
    questions: [
      { id: "kf-1", question: "O que é tokenização de rede (network tokenization)?", options: ["Criar criptomoedas", "Substituir dados do cartão por tokens seguros", "Autenticar usuários", "Comprimir dados de rede"], correctIndex: 1, explanation: "Network tokenization substitui o PAN (número do cartão) por um token único, reduzindo o risco de fraude e simplificando compliance PCI-DSS." },
    ],
  },
  {
    pageRoute: "/knowledge/business-rules",
    questions: [
      { id: "br-1", question: "Por que existem limites de valor por transação?", options: ["Para aumentar receita", "Para mitigar risco de fraude e lavagem", "Para reduzir custos de rede", "Por limitação técnica"], correctIndex: 1, explanation: "Limites de valor são controles de risco que ajudam a prevenir fraude, lavagem de dinheiro e uso não autorizado de instrumentos de pagamento." },
    ],
  },
  {
    pageRoute: "/fraud/fraud-map",
    questions: [
      { id: "fm-1", question: "Qual a primeira linha de defesa contra fraude em pagamentos?", options: ["Revisão manual", "Regras de velocidade e triagem pré-autorização", "Chargeback", "Bloqueio de cartão"], correctIndex: 1, explanation: "A triagem pré-autorização com regras de velocidade, device fingerprinting e análise de comportamento é a primeira barreira antes mesmo da transação ser enviada ao emissor." },
      { id: "fm-2", question: "O que é 'friendly fraud'?", options: ["Fraude entre amigos", "Titular legítimo disputa compra que fez", "Fraude com desconto", "Phishing social"], correctIndex: 1, explanation: "Friendly fraud ocorre quando o próprio titular do cartão faz a compra mas depois abre uma disputa alegando não reconhecer, representando uma parcela significativa dos chargebacks." },
    ],
  },
  {
    pageRoute: "/fraud/fraud-signals",
    questions: [
      { id: "fsg-1", question: "O que é device fingerprinting?", options: ["Impressão digital biométrica", "Identificação única do dispositivo baseada em seus atributos", "Senha do aparelho", "Certificado digital"], correctIndex: 1, explanation: "Device fingerprinting cria um identificador único combinando atributos do dispositivo (browser, OS, resolução, plugins) para detectar dispositivos associados a fraude." },
    ],
  },
  {
    pageRoute: "/fraud/chargeback-lifecycle",
    questions: [
      { id: "cl-1", question: "Qual o prazo típico que o portador tem para abrir um chargeback?", options: ["7 dias", "30 dias", "120 dias", "1 ano"], correctIndex: 2, explanation: "A maioria das bandeiras permite ao portador abrir um chargeback em até 120 dias após a transação, embora prazos variem por tipo de disputa e bandeira." },
      { id: "cl-2", question: "O que é representment no ciclo de chargeback?", options: ["Segunda cobrança", "Resposta do comerciante à disputa com evidências", "Reembolso automático", "Cancelamento do cartão"], correctIndex: 1, explanation: "Representment é quando o comerciante contesta o chargeback enviando evidências (comprovante de entrega, logs, etc.) para reverter a decisão em seu favor." },
    ],
  },
  {
    pageRoute: "/diagnostics/metrics-tree",
    questions: [
      { id: "mt-1", question: "Qual métrica indica a saúde geral do funil de pagamentos?", options: ["Taxa de fraude", "Taxa de autorização", "Tempo de liquidação", "Custo por transação"], correctIndex: 1, explanation: "A taxa de autorização (aprovação) é a métrica raiz — indica que percentual das tentativas de pagamento são aprovadas pelo emissor, sendo o indicador mais direto da saúde do funil." },
    ],
  },
  {
    pageRoute: "/observability/payments-dashboard",
    questions: [
      { id: "pd-1", question: "Por que monitorar a taxa de aprovação por BIN é importante?", options: ["Para design do dashboard", "Para identificar problemas específicos por emissor", "Para calcular impostos", "Para marketing"], correctIndex: 1, explanation: "Monitorar por BIN permite identificar quando um emissor específico está recusando mais transações que o normal, possibilitando ação direcionada como contato com o emissor ou ajuste de routing." },
    ],
  },
];

export function getQuizForPage(route: string): PageQuiz | null {
  return QUIZZES.find((q) => q.pageRoute === route) || null;
}
```

**Step 4: Verify files compile**

Run: `cd frontend && npx tsc --noEmit`

**Step 5: Commit**

```bash
git add frontend/src/data/badges.ts frontend/src/data/quizzes.ts frontend/src/data/levels.ts
git commit -m "feat: add gamification data — badges, quizzes, levels"
```

---

## Task 3: Game Progress Hook

**Files:**
- Create: `frontend/src/hooks/useGameProgress.ts`

**Step 1: Create the hook**

Create `frontend/src/hooks/useGameProgress.ts`:

```typescript
"use client";
import { useState, useEffect, useCallback } from "react";
import { BADGES, type Badge } from "@/data/badges";
import { LEARNING_TRAILS } from "@/data/learning-trails";
import { getLevelForXP, getLevelProgress } from "@/data/levels";

// ── Storage keys ──────────────────────────────────────
const XP_KEY = "pks-xp";
const BADGES_KEY = "pks-badges";
const STREAK_KEY = "pks-streak";
const QUIZ_KEY = "pks-quiz-scores";
const PAGES_KEY = "pks-pages-visited";
const SESSIONS_KEY = "pks-sessions";

// ── Types ─────────────────────────────────────────────
interface StreakData {
  count: number;
  lastDate: string; // YYYY-MM-DD
}

interface QuizScore {
  correct: number;
  total: number;
}

interface GameState {
  xp: number;
  badges: string[];
  streak: StreakData;
  quizScores: Record<string, QuizScore>;
  pagesVisited: string[];
}

// ── Helpers ───────────────────────────────────────────
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): GameState {
  if (typeof window === "undefined") {
    return { xp: 0, badges: [], streak: { count: 0, lastDate: "" }, quizScores: {}, pagesVisited: [] };
  }
  try {
    return {
      xp: parseInt(localStorage.getItem(XP_KEY) || "0", 10),
      badges: JSON.parse(localStorage.getItem(BADGES_KEY) || "[]"),
      streak: JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastDate":""}'),
      quizScores: JSON.parse(localStorage.getItem(QUIZ_KEY) || "{}"),
      pagesVisited: JSON.parse(localStorage.getItem(PAGES_KEY) || "[]"),
    };
  } catch {
    return { xp: 0, badges: [], streak: { count: 0, lastDate: "" }, quizScores: {}, pagesVisited: [] };
  }
}

function persist(state: GameState) {
  localStorage.setItem(XP_KEY, String(state.xp));
  localStorage.setItem(BADGES_KEY, JSON.stringify(state.badges));
  localStorage.setItem(STREAK_KEY, JSON.stringify(state.streak));
  localStorage.setItem(QUIZ_KEY, JSON.stringify(state.quizScores));
  localStorage.setItem(PAGES_KEY, JSON.stringify(state.pagesVisited));
}

// ── Hook ──────────────────────────────────────────────
export function useGameProgress() {
  const [state, setState] = useState<GameState>(loadState);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  useEffect(() => {
    setState(loadState());
  }, []);

  // Check and award badges
  const checkBadges = useCallback((s: GameState): { badges: string[]; earned: Badge[] } => {
    const earned: Badge[] = [];
    const currentBadges = [...s.badges];

    const completedTrails = LEARNING_TRAILS.filter((t) =>
      t.pages.every((p) => s.pagesVisited.includes(p.path))
    ).length;

    const perfectQuizzes = Object.values(s.quizScores).filter(
      (q) => q.total > 0 && q.correct === q.total
    ).length;

    const completedQuizzes = Object.values(s.quizScores).filter(
      (q) => q.total > 0
    ).length;

    for (const badge of BADGES) {
      if (currentBadges.includes(badge.id)) continue;

      let met = false;
      switch (badge.condition.type) {
        case "pages_visited":
          met = s.pagesVisited.length >= badge.condition.threshold;
          break;
        case "quizzes_completed":
          met = completedQuizzes >= badge.condition.threshold;
          break;
        case "quizzes_perfect":
          met = perfectQuizzes >= badge.condition.threshold;
          break;
        case "trails_completed":
          met = completedTrails >= badge.condition.threshold;
          break;
        case "streak_days":
          met = s.streak.count >= badge.condition.threshold;
          break;
      }

      if (met) {
        currentBadges.push(badge.id);
        earned.push(badge);
      }
    }

    return { badges: currentBadges, earned };
  }, []);

  // Visit a page
  const visitPage = useCallback((pathname: string) => {
    setState((prev) => {
      if (prev.pagesVisited.includes(pathname)) {
        // Still update streak even if page already visited
        const d = today();
        let streak = { ...prev.streak };
        if (streak.lastDate !== d) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().slice(0, 10);
          streak = streak.lastDate === yesterdayStr
            ? { count: streak.count + 1, lastDate: d }
            : { count: 1, lastDate: d };
        }
        const next = { ...prev, streak };
        const { badges, earned } = checkBadges(next);
        const xpBonus = earned.reduce((sum, b) => sum + b.xpReward, 0);
        const final = { ...next, badges, xp: next.xp + xpBonus };
        persist(final);
        if (earned.length > 0) setNewBadges(earned);
        return final;
      }

      const d = today();
      let streak = { ...prev.streak };
      if (streak.lastDate !== d) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        streak = streak.lastDate === yesterdayStr
          ? { count: streak.count + 1, lastDate: d }
          : { count: 1, lastDate: d };
      }

      const next: GameState = {
        ...prev,
        xp: prev.xp + 5, // +5 XP for new page
        pagesVisited: [...prev.pagesVisited, pathname],
        streak,
      };

      const { badges, earned } = checkBadges(next);
      const xpBonus = earned.reduce((sum, b) => sum + b.xpReward, 0);
      const final = { ...next, badges, xp: next.xp + xpBonus };
      persist(final);
      if (earned.length > 0) setNewBadges(earned);
      return final;
    });
  }, [checkBadges]);

  // Record quiz score
  const recordQuiz = useCallback((pageRoute: string, correct: number, total: number) => {
    setState((prev) => {
      const xpGain = correct * 5; // +5 per correct answer
      const next: GameState = {
        ...prev,
        xp: prev.xp + xpGain,
        quizScores: { ...prev.quizScores, [pageRoute]: { correct, total } },
      };

      const { badges, earned } = checkBadges(next);
      const xpBonus = earned.reduce((sum, b) => sum + b.xpReward, 0);
      const final = { ...next, badges, xp: next.xp + xpBonus };
      persist(final);
      if (earned.length > 0) setNewBadges(earned);
      return final;
    });
  }, [checkBadges]);

  // Clear new badge notification
  const dismissBadges = useCallback(() => setNewBadges([]), []);

  // Reset all progress
  const resetProgress = useCallback(() => {
    const fresh: GameState = { xp: 0, badges: [], streak: { count: 0, lastDate: "" }, quizScores: {}, pagesVisited: [] };
    persist(fresh);
    setState(fresh);
  }, []);

  return {
    ...state,
    level: getLevelForXP(state.xp),
    levelProgress: getLevelProgress(state.xp),
    newBadges,
    visitPage,
    recordQuiz,
    dismissBadges,
    resetProgress,
    getQuizScore: (route: string) => state.quizScores[route] || null,
    isPageVisited: (route: string) => state.pagesVisited.includes(route),
  };
}
```

**Step 2: Verify compilation**

Run: `cd frontend && npx tsc --noEmit`

**Step 3: Commit**

```bash
git add frontend/src/hooks/useGameProgress.ts
git commit -m "feat: add useGameProgress hook — XP, badges, streak, quiz tracking"
```

---

## Task 4: UI Components — Accordion, TrailBar, Quiz, Completion

**Files:**
- Create: `frontend/src/components/ui/Accordion.tsx`
- Create: `frontend/src/components/ui/TrailBar.tsx`
- Create: `frontend/src/components/ui/PageQuiz.tsx`
- Create: `frontend/src/components/ui/CompletionCard.tsx`
- Create: `frontend/src/components/ui/BadgeNotification.tsx`

**Step 1: Create Accordion component**

Create `frontend/src/components/ui/Accordion.tsx`:

```tsx
"use client";
import { useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  icon?: string;
  children: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

export default function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.id}>
            <button
              className="accordion-trigger"
              data-open={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {item.icon && <span>{item.icon}</span>}
                {item.title}
              </span>
              <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                ▾
              </span>
            </button>
            {isOpen && (
              <div className="accordion-content animate-fade-in">
                {item.children}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

**Step 2: Create TrailBar component**

Create `frontend/src/components/ui/TrailBar.tsx`:

```tsx
"use client";
import Link from "next/link";

interface TrailBarProps {
  trailName: string;
  currentPage: number;
  totalPages: number;
  percent: number;
  prevHref?: string;
  nextHref?: string;
}

export default function TrailBar({ trailName, currentPage, totalPages, percent, prevHref, nextHref }: TrailBarProps) {
  return (
    <div className="trail-bar">
      <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
        Trilha: {trailName}
      </span>
      <span style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>
        {currentPage} de {totalPages}
      </span>
      <div className="trail-bar-progress">
        <div className="trail-bar-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div style={{ display: "flex", gap: "0.5rem", whiteSpace: "nowrap" }}>
        {prevHref ? (
          <Link href={prevHref} style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.8125rem", fontWeight: 500 }}>
            ← Anterior
          </Link>
        ) : (
          <span style={{ color: "var(--text-light)", fontSize: "0.8125rem" }}>← Anterior</span>
        )}
        <span style={{ color: "var(--border)" }}>|</span>
        {nextHref ? (
          <Link href={nextHref} style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.8125rem", fontWeight: 500 }}>
            Próximo →
          </Link>
        ) : (
          <span style={{ color: "var(--text-light)", fontSize: "0.8125rem" }}>Próximo →</span>
        )}
      </div>
    </div>
  );
}
```

**Step 3: Create PageQuiz component**

Create `frontend/src/components/ui/PageQuiz.tsx`:

```tsx
"use client";
import { useState } from "react";
import { type QuizQuestion } from "@/data/quizzes";

interface PageQuizProps {
  questions: QuizQuestion[];
  xpPerQuestion: number;
  onComplete: (correct: number, total: number) => void;
}

export default function PageQuiz({ questions, xpPerQuestion, onComplete }: PageQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedIndex(idx);
  };

  const handleConfirm = () => {
    if (selectedIndex === null || answered) return;
    const isCorrect = selectedIndex === question.correctIndex;
    setAnswered(true);
    setResults((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      const correctCount = [...results].filter(Boolean).length;
      setFinished(true);
      onComplete(correctCount, questions.length);
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelectedIndex(null);
      setAnswered(false);
    }
  };

  if (finished) {
    const correctCount = results.filter(Boolean).length;
    return (
      <div className="quiz-card">
        <div className="quiz-header">
          <span>Quiz Completo!</span>
          <span className="xp-badge animate-xp-bounce">+{correctCount * xpPerQuestion} XP</span>
        </div>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            {correctCount === questions.length ? "🎉" : correctCount > 0 ? "👍" : "📚"}
          </p>
          <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--foreground)" }}>
            {correctCount}/{questions.length} corretas
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {correctCount === questions.length
              ? "Perfeito! Você domina este tema!"
              : "Continue estudando para melhorar!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <span>Pergunta {currentQ + 1} de {questions.length}</span>
        <span className="xp-badge">+{xpPerQuestion} XP cada</span>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <p style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--foreground)" }}>
          {question.question}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          {question.options.map((opt, i) => {
            let dataAttr: Record<string, string> = {};
            if (answered && i === question.correctIndex) dataAttr["data-correct"] = "true";
            if (answered && i === selectedIndex && i !== question.correctIndex) dataAttr["data-incorrect"] = "true";
            if (!answered && i === selectedIndex) dataAttr["data-selected"] = "true";

            return (
              <button
                key={i}
                className="quiz-option"
                onClick={() => handleSelect(i)}
                {...dataAttr}
              >
                <span style={{
                  width: "1.5rem", height: "1.5rem", borderRadius: "50%",
                  border: `2px solid ${i === selectedIndex ? "var(--primary)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", flexShrink: 0,
                  background: answered && i === question.correctIndex ? "var(--success)" : answered && i === selectedIndex ? "var(--danger)" : "transparent",
                  color: answered && (i === question.correctIndex || i === selectedIndex) ? "#fff" : "transparent",
                }}>
                  {answered && i === question.correctIndex ? "✓" : answered && i === selectedIndex && i !== question.correctIndex ? "✗" : ""}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="animate-fade-in" style={{
            padding: "0.875rem 1rem",
            background: selectedIndex === question.correctIndex ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
            borderRadius: "10px",
            borderLeft: `3px solid ${selectedIndex === question.correctIndex ? "var(--success)" : "var(--danger)"}`,
            marginBottom: "1rem",
          }}>
            <p style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem", color: selectedIndex === question.correctIndex ? "var(--success)" : "var(--danger)" }}>
              {selectedIndex === question.correctIndex ? "Correto!" : "Incorreto"}
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              {question.explanation}
            </p>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          {!answered ? (
            <button
              onClick={handleConfirm}
              disabled={selectedIndex === null}
              style={{
                padding: "0.625rem 1.5rem",
                background: selectedIndex === null ? "var(--surface-hover)" : "var(--primary)",
                color: selectedIndex === null ? "var(--text-muted)" : "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: selectedIndex === null ? "default" : "pointer",
              }}
            >
              Confirmar
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                padding: "0.625rem 1.5rem",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              {currentQ + 1 >= questions.length ? "Ver Resultado" : "Próxima →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 4: Create CompletionCard component**

Create `frontend/src/components/ui/CompletionCard.tsx`:

```tsx
"use client";
import Link from "next/link";

interface CompletionCardProps {
  xpEarned: number;
  quizScore?: { correct: number; total: number };
  prevPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
}

export default function CompletionCard({ xpEarned, quizScore, prevPage, nextPage }: CompletionCardProps) {
  return (
    <div className="completion-card animate-fade-in">
      <p style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉</p>
      <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
        Página Completa!
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        <span className="xp-badge animate-xp-bounce" style={{ fontSize: "0.875rem", padding: "0.375rem 0.75rem" }}>
          +{xpEarned} XP
        </span>
        {quizScore && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.25rem",
            padding: "0.375rem 0.75rem", background: "rgba(16, 185, 129, 0.1)",
            color: "var(--success)", fontWeight: 700, fontSize: "0.875rem", borderRadius: "999px",
          }}>
            Quiz: {quizScore.correct}/{quizScore.total}
          </span>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        {prevPage && (
          <Link href={prevPage.href} style={{
            padding: "0.625rem 1.25rem", border: "1px solid var(--border)",
            borderRadius: "8px", textDecoration: "none", color: "var(--foreground)",
            fontWeight: 500, fontSize: "0.875rem",
          }}>
            ← {prevPage.title}
          </Link>
        )}
        {nextPage && (
          <Link href={nextPage.href} style={{
            padding: "0.625rem 1.25rem", background: "var(--primary)",
            borderRadius: "8px", textDecoration: "none", color: "#fff",
            fontWeight: 600, fontSize: "0.875rem", border: "none",
          }}>
            {nextPage.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
```

**Step 5: Create BadgeNotification component**

Create `frontend/src/components/ui/BadgeNotification.tsx`:

```tsx
"use client";
import { type Badge } from "@/data/badges";

interface BadgeNotificationProps {
  badges: Badge[];
  onDismiss: () => void;
}

export default function BadgeNotification({ badges, onDismiss }: BadgeNotificationProps) {
  if (badges.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed", bottom: "1.5rem", right: "1.5rem",
        zIndex: 200, display: "flex", flexDirection: "column", gap: "0.5rem",
      }}
    >
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="animate-fade-in"
          style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "1rem 1.25rem", background: "var(--surface)",
            border: "2px solid var(--xp-gold)", borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)", cursor: "pointer",
            minWidth: "280px",
          }}
          onClick={onDismiss}
        >
          <span style={{ fontSize: "2rem" }} className="animate-confetti">{badge.icon}</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--foreground)" }}>
              Nova Conquista!
            </p>
            <p style={{ fontWeight: 600, color: "var(--xp-gold)", fontSize: "0.8125rem" }}>
              {badge.name}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              +{badge.xpReward} XP
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 6: Verify compilation**

Run: `cd frontend && npx tsc --noEmit`

**Step 7: Commit**

```bash
git add frontend/src/components/ui/Accordion.tsx frontend/src/components/ui/TrailBar.tsx frontend/src/components/ui/PageQuiz.tsx frontend/src/components/ui/CompletionCard.tsx frontend/src/components/ui/BadgeNotification.tsx
git commit -m "feat: add gamification UI components — accordion, trail bar, quiz, completion, badge notification"
```

---

## Task 5: Redesign Sidebar

**Files:**
- Modify: `frontend/src/components/layout/Sidebar.tsx` (full rewrite)
- Modify: `frontend/src/components/layout/MobileHeader.tsx` (update branding)

**Step 1: Rewrite Sidebar.tsx**

Replace the entire content of `frontend/src/components/layout/Sidebar.tsx` with a new minimal sidebar:

- 5 main items: Home, Trilhas, Explorar (with expandable sub-menu), Ferramentas, Buscar
- Footer: XP badge + streak badge
- "Explorar" expands to show the 6 categories (Pagamentos, Infraestrutura, Crypto, Knowledge Base, Fraude, Diagnóstico), each expandable to show sub-pages
- Mobile: same overlay behavior as current but with new items
- Use `useGameProgress` hook for XP/streak display
- Keep `usePathname()` for active link highlighting
- Keep mobile open/close logic with backdrop

The navigation array should be reorganized from 8 flat sections into:
```
Ferramentas = [
  { label: "Simulador", href: "/simulation/payment-simulator", icon: "⚡" },
  { label: "Consultor de Arquitetura", href: "/simulation/architecture-advisor", icon: "🏗️" },
  { label: "Dashboard", href: "/observability/payments-dashboard", icon: "📊" },
  { label: "Explorador de Eventos", href: "/observability/event-explorer", icon: "📡" },
  { label: "Consultor AI", href: "/ai/payments-advisor", icon: "🤖" },
]

Explorar categories = [
  { label: "Pagamentos", items: [payments-map, payment-rails, transaction-flows, ecosystem-map, financial-system] },
  { label: "Infraestrutura", items: [banking-systems, settlement-systems, liquidity-treasury] },
  { label: "Crypto & Web3", items: [blockchain-map, stablecoin-systems, defi-protocols] },
  { label: "Knowledge Base", items: [features, business-rules, dependency-graph, taxonomy, glossary] },
  { label: "Fraude & Risco", items: [fraud-map, fraud-signals, chargeback-lifecycle] },
  { label: "Diagnóstico", items: [conta-comigo, metrics-tree, problem-library] },
]
```

**Step 2: Update MobileHeader.tsx**

Change branding from "Payments Knowledge" to "Payments Academy" and update logo icon color to match new primary indigo.

**Step 3: Verify pages render**

Run dev server, navigate to homepage, check sidebar renders with 5 items.

**Step 4: Commit**

```bash
git add frontend/src/components/layout/Sidebar.tsx frontend/src/components/layout/MobileHeader.tsx
git commit -m "feat: redesign sidebar — 5 minimal items with expandable Explorar"
```

---

## Task 6: Redesign Homepage — Student Dashboard

**Files:**
- Modify: `frontend/src/app/page.tsx` (full rewrite)

**Step 1: Rewrite homepage**

Replace `frontend/src/app/page.tsx` with the student dashboard layout:

1. **Header**: Greeting + streak badge + XP badge (right-aligned)
2. **Continue studying card**: Active trail with progress bar and "Continuar →" button
3. **My progress**: 4 stat cards grid (pages visited/30, trails completed, badges earned/12, quiz avg %)
4. **Learning trails**: Grid of trail cards with progress %, lock indicator for recommended order
5. **Recent achievements**: Horizontal row of badge cells (earned + "???" placeholders)
6. **Quick access**: Row of links (Glossário, Busca, Simulador, Consultor AI)

For first-time visitors (0 pages visited): Show welcome card with 2 CTAs.

Use `useGameProgress()` for XP, streak, badges, pages visited.
Use `useTrailProgress()` for trail-specific progress (already exists).
Use `LEARNING_TRAILS` for trail data.

**Step 2: Verify homepage renders**

Navigate to `/` in dev server, check all sections render.

**Step 3: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat: redesign homepage as student dashboard with XP, streak, progress"
```

---

## Task 7: Add Game Progress to Layout

**Files:**
- Modify: `frontend/src/app/layout.tsx`

**Step 1: Add BadgeNotification and game tracking to layout**

The layout should:
- Import `BadgeNotification` and render it (for toast-style badge unlocks)
- The actual game state tracking happens in individual pages via `useGameProgress().visitPage()`

Since layout.tsx is a server component, create a client wrapper:

Create `frontend/src/components/layout/GameProvider.tsx`:

```tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";
import BadgeNotification from "@/components/ui/BadgeNotification";

export default function GameProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { visitPage, newBadges, dismissBadges } = useGameProgress();

  useEffect(() => {
    if (pathname) visitPage(pathname);
  }, [pathname, visitPage]);

  return (
    <>
      {children}
      <BadgeNotification badges={newBadges} onDismiss={dismissBadges} />
    </>
  );
}
```

Then in `layout.tsx`, wrap `{children}` with `<GameProvider>`:

```tsx
<GameProvider>
  {children}
</GameProvider>
```

This auto-tracks page visits and shows badge notifications globally.

**Step 2: Verify badge notification appears**

Clear localStorage, navigate to first page, check "Primeiro Passo" badge appears.

**Step 3: Commit**

```bash
git add frontend/src/components/layout/GameProvider.tsx frontend/src/app/layout.tsx
git commit -m "feat: add GameProvider to layout — auto page tracking and badge notifications"
```

---

## Task 8: Progress Page

**Files:**
- Create: `frontend/src/app/progress/page.tsx`

**Step 1: Create progress page**

Create `frontend/src/app/progress/page.tsx`:

- Header: "Meu Progresso"
- Stats row: XP total, streak days, badges earned/12, quiz average
- Level section: Current level name, progress bar to next level, XP counter
- Badges grid: 4x3 grid of all 12 badges, unlocked ones highlighted, locked ones grayed
- History section: "Compete consigo mesmo" — show current XP vs goal (next level)
- Reset button: "Recomeçar" with confirmation

Use `useGameProgress()` for all data.
Use `BADGES` and `BADGE_CATEGORIES` for rendering badge grid grouped by category.
Use `getLevelProgress()` for level bar.

**Step 2: Verify page renders**

Navigate to `/progress` in dev server.

**Step 3: Commit**

```bash
git add frontend/src/app/progress/page.tsx
git commit -m "feat: add progress page — XP, level, badges, streak stats"
```

---

## Task 9: Add Quizzes & Learning Objectives to Content Pages (batch 1 — Explorar pages)

**Files:**
- Modify: `frontend/src/app/explore/payments-map/page.tsx`
- Modify: `frontend/src/app/explore/payment-rails/page.tsx`
- Modify: `frontend/src/app/explore/transaction-flows/page.tsx`
- Modify: `frontend/src/app/explore/ecosystem-map/page.tsx`
- Modify: `frontend/src/app/explore/financial-system/page.tsx`

**Step 1: For each page, add at the top (after title/description):**

1. **TrailBar** — if the page is part of a trail, show trail progress bar with prev/next navigation. Use `findTrailForPage()` from `learning-trails.ts` and `useTrailProgress()` for progress.

2. **Learning objectives** — a "O que você vai aprender" card with 3 bullet points specific to the page. Use the `.learning-objectives` CSS class.

**Step 2: For each page, add at the bottom (before RelatedSection):**

1. **Glossary terms section** — "Termos-chave desta página" with `GlossaryTooltip` components for 3-5 relevant terms

2. **Quiz section** — Import `getQuizForPage` and `PageQuiz`, render quiz if available. Use `useGameProgress().recordQuiz()` on complete.

3. **CompletionCard** — Show after quiz is completed (or immediately if no quiz) with XP earned and prev/next navigation.

Each page needs specific learning objectives. Examples:

**payments-map:**
- Como o stack de pagamentos é organizado em 6 camadas
- O papel de cada camada no processamento
- Como as camadas se conectam entre si

**payment-rails:**
- Os 5 principais trilhos de pagamento
- Diferenças de liquidação, taxas e reversibilidade
- Quando usar cada trilho

**Step 3: Verify quizzes work**

Navigate to `/explore/payments-map`, scroll to quiz, answer questions, check XP updates.

**Step 4: Commit**

```bash
git add frontend/src/app/explore/
git commit -m "feat: add learning objectives, quizzes and completion to Explorar pages"
```

---

## Task 10: Add Quizzes to Remaining Content Pages (batch 2)

**Files:**
- Modify all remaining content pages (infrastructure, crypto, knowledge, fraud, diagnostics, observability)

Same pattern as Task 9:
1. TrailBar (if page is in a trail)
2. Learning objectives (3 bullet points)
3. Glossary terms section
4. Quiz (if quiz data exists for the page)
5. CompletionCard

**Step 1: Infrastructure pages** (banking-systems, settlement-systems, liquidity-treasury)

**Step 2: Crypto pages** (blockchain-map, stablecoin-systems, defi-protocols)

**Step 3: Knowledge pages** (features, business-rules, taxonomy, dependency-graph)

**Step 4: Fraud pages** (fraud-map, fraud-signals, chargeback-lifecycle)

**Step 5: Diagnostics pages** (metrics-tree, conta-comigo, problem-library)

**Step 6: Observability** (payments-dashboard)

**Step 7: Verify several pages**

Spot-check 3-4 pages across different sections.

**Step 8: Commit**

```bash
git add frontend/src/app/
git commit -m "feat: add learning objectives, quizzes and completion to all content pages"
```

---

## Task 11: Add Accordion-Based Progressive Disclosure to Dense Pages

**Files:**
- Modify: Key content pages that have large amounts of content

**Step 1: Identify pages with most content density**

Priority pages for accordion treatment:
- `payments-map/page.tsx` — 6 layers of content → each layer becomes an accordion section
- `payment-rails/page.tsx` — 5 rails → each rail becomes an accordion section
- `financial-system/page.tsx` — 6 financial layers → accordion sections
- `fraud-map/page.tsx` — fraud stages → accordion sections
- `business-rules/page.tsx` — rule categories → accordion sections

**Step 2: Wrap content sections in Accordion component**

For each page, identify the repeating content blocks and wrap them in `<Accordion items={[...]} defaultOpen={0} />`.

Example for `payment-rails/page.tsx`: Each rail card (Cartões, Transferências, Carteiras, Blockchain, Stablecoins) becomes an accordion item.

**Step 3: Verify accordions work**

Navigate to pages, click to expand/collapse sections.

**Step 4: Commit**

```bash
git add frontend/src/app/
git commit -m "feat: add accordion progressive disclosure to dense content pages"
```

---

## Task 12: Update Search Index

**Files:**
- Modify: `frontend/src/lib/search-index.ts`

**Step 1: Add progress page to static pages list**

Add to the `pages` array:
```typescript
{ name: "Meu Progresso", description: "XP, badges, nível e conquistas", href: "/progress" },
```

**Step 2: Verify search works**

Open Cmd+K, search for "progresso", confirm result appears.

**Step 3: Commit**

```bash
git add frontend/src/lib/search-index.ts
git commit -m "feat: add progress page to search index"
```

---

## Task 13: Add Learning Trails for Remaining Content

**Files:**
- Modify: `frontend/src/data/learning-trails.ts`

**Step 1: Add 2 more trails**

Add to the `LEARNING_TRAILS` array:

```typescript
{
  id: "crypto",
  title: "Crypto & Web3",
  subtitle: "Blockchain, stablecoins e finanças descentralizadas",
  icon: "🔗",
  color: "#10B981",
  colorBg: "rgba(16, 185, 129, 0.1)",
  pages: [
    { path: "/crypto/blockchain-map", title: "Mapa Blockchain", description: "Redes, consenso e infraestrutura", icon: "🔗" },
    { path: "/crypto/stablecoin-systems", title: "Sistemas de Stablecoin", description: "Lastro, riscos e regulação", icon: "💵" },
    { path: "/crypto/defi-protocols", title: "Protocolos DeFi", description: "AMMs, lending e derivativos", icon: "🏦" },
  ],
},
{
  id: "fraude",
  title: "Fraude & Proteção",
  subtitle: "Detecção, prevenção e gestão de disputas",
  icon: "🛡️",
  color: "#EF4444",
  colorBg: "rgba(239, 68, 68, 0.1)",
  pages: [
    { path: "/fraud/fraud-map", title: "Mapa de Fraude", description: "Pipeline de detecção em 4 estágios", icon: "🗺️" },
    { path: "/fraud/fraud-signals", title: "Sinais de Fraude", description: "Indicadores de atividade fraudulenta", icon: "🚨" },
    { path: "/fraud/chargeback-lifecycle", title: "Ciclo de Chargeback", description: "Fluxo completo de disputas", icon: "🔄" },
    { path: "/diagnostics/problem-library", title: "Biblioteca de Problemas", description: "Problemas comuns em pagamentos", icon: "📚" },
  ],
},
```

**Step 2: Update badge thresholds**

In `frontend/src/data/badges.ts`, update the "perfection" badge threshold to match total quiz count, and "master" badge threshold to match total trail count (now 5).

**Step 3: Commit**

```bash
git add frontend/src/data/learning-trails.ts frontend/src/data/badges.ts
git commit -m "feat: add crypto and fraud learning trails"
```

---

## Task 14: Final Visual Polish

**Files:**
- Modify: `frontend/src/app/globals.css` (refine existing classes)
- Modify: Various page components (remove hardcoded dark colors)

**Step 1: Update existing card/component classes for light mode**

Review and update `.card`, `.card-flat`, `.card-glow`, `.stat-card`, `.page-header`, `.badge-*` classes to work well with the new light palette. Key changes:
- Remove dark-specific shadows
- Ensure hover states use indigo tints
- Make `.page-header` gradient use light indigo background instead of dark blue

**Step 2: Search and replace hardcoded dark colors**

Search for hardcoded colors like `#0f172a`, `#1e293b`, `#334155`, `#94a3b8` in page components and replace with CSS variables (`var(--foreground)`, `var(--surface)`, `var(--surface-hover)`, `var(--text-muted)`).

**Step 3: Update gradient-text effects**

The homepage "pagamentos" gradient text needs updating for light mode visibility. Change from light-on-dark to dark gradient text.

**Step 4: Verify all pages look correct in light mode**

Navigate through 5-6 key pages, check no dark-mode remnants.

**Step 5: Commit**

```bash
git add frontend/src/app/
git commit -m "feat: visual polish — light mode consistency across all pages"
```

---

## Task 15: End-to-End Verification

**Step 1: Start dev server and verify**

Run: `cd frontend && npm run dev`

**Step 2: Test critical flows**

1. **First visit**: Clear localStorage. Visit homepage. See welcome state. Click "Começar pelos Fundamentos"
2. **Navigation**: Sidebar shows 5 items. "Explorar" expands to show categories. Click through to a page
3. **Page experience**: Page shows TrailBar, learning objectives, accordion content, glossary terms, quiz
4. **Quiz**: Answer quiz, see XP animation, see completion card, navigate to next page
5. **Badge**: After visiting first page, see "Primeiro Passo" badge notification
6. **Progress page**: Navigate to `/progress`, see stats, level bar, badge grid
7. **Search**: Cmd+K works, finds results across all data sources
8. **Mobile**: Resize to 375px, verify hamburger menu, sidebar overlay

**Step 3: Fix any issues found**

**Step 4: Final commit**

```bash
git add -A
git commit -m "fix: end-to-end verification fixes"
```
