# Platform Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve AI responses, quizzes, usability, data depth, and security across the Payments Academy platform.

**Architecture:** 5 parallel workstreams — AI integration (Claude API + SSE streaming), quiz engine overhaul (4 question types + difficulty levels), UX bug fixes + polish, content expansion (glossary, features, deep topics), and security hardening (password hashing, rate limiting, input validation).

**Tech Stack:** Next.js App Router, TypeScript, Anthropic SDK (`@anthropic-ai/sdk`), SHA-256 (Web Crypto API), SSE (ReadableStream), CSS variables for dark mode.

**CRITICAL CSS CONTEXT:** This project has `* { margin: 0; padding: 0; }` in globals.css. ALL margin/padding/gap MUST use inline `style={{ }}`, never Tailwind spacing classes.

---

### Task 1: Security — Password Hashing

**Files:**
- Create: `frontend/src/lib/security.ts`
- Modify: `frontend/src/app/auth/register/page.tsx`
- Modify: `frontend/src/app/auth/login/page.tsx`

**Step 1: Create security utilities**

Create `frontend/src/lib/security.ts`:
```typescript
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "pks-salt-2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getPasswordStrength(pw: string): "weak" | "medium" | "strong" {
  if (pw.length < 6) return "weak";
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = [pw.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score >= 3) return "strong";
  if (score >= 2) return "medium";
  return "weak";
}
```

**Step 2: Update register page**

In `frontend/src/app/auth/register/page.tsx`:
- Import `hashPassword`, `sanitizeInput`, `isValidEmail`, `getPasswordStrength`
- Replace the raw base64 password storage with `await hashPassword(password)`
- Add email validation with `isValidEmail`
- Add password strength indicator bar below password field
- Sanitize name input with `sanitizeInput`
- Show strength colors: red (weak), yellow (medium), green (strong)

**Step 3: Update login page**

In `frontend/src/app/auth/login/page.tsx`:
- Import `hashPassword`
- Compare `await hashPassword(inputPassword)` against stored hash
- Add rate limiting: track `pks-login-attempts` in localStorage
- After 5 failures in a row, set `pks-login-locked-until` to Date.now() + 15*60*1000
- Show countdown timer when locked
- Reset attempts on successful login

**Step 4: Add CSP meta tag**

In `frontend/src/app/layout.tsx`, add inside `<head>`:
```html
<meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://api.anthropic.com;" />
```

**Step 5: Commit**
```bash
git add frontend/src/lib/security.ts frontend/src/app/auth/register/page.tsx frontend/src/app/auth/login/page.tsx frontend/src/app/layout.tsx
git commit -m "feat: add password hashing, rate limiting, input validation and CSP"
```

---

### Task 2: UX Bug Fixes

**Files:**
- Modify: `frontend/src/app/search/page.tsx` (lines 123-161)
- Modify: `frontend/src/app/auth/profile/page.tsx` (lines 193-286)
- Modify: `frontend/src/app/tools/document-analyzer/page.tsx`
- Modify: `frontend/src/app/ai/payments-advisor/page.tsx`
- Modify: `frontend/src/data/brand-rules.ts` or `frontend/src/app/knowledge/brand-rules/page.tsx`

**Step 1: Fix search results visibility**

In `frontend/src/app/search/page.tsx`, find the results container div (around line 123). The results are rendering but likely have a parent with `overflow: hidden` or collapsed height. Ensure:
- The results container has no `max-height: 0` or `overflow: hidden`
- Each result card is visible with proper height
- Results appear immediately below the filter pills as the user types

**Step 2: Fix profile page layout**

In `frontend/src/app/auth/profile/page.tsx`:
- Move "Salvar" and "Sair da Conta" buttons to be always visible
- Add `style={{ paddingBottom: "4rem" }}` to the outer container
- Or use a sticky footer bar for the buttons with `position: sticky; bottom: 0`

**Step 3: Fix document analyzer chat layout**

In `frontend/src/app/tools/document-analyzer/page.tsx`:
- Make the chat input fixed at the bottom of the chat area
- Chat messages area should scroll independently
- Set chat container to `display: flex; flexDirection: column; height: calc(100vh - 300px)`
- Messages area: `flex: 1; overflow-y: auto`
- Input bar: `flexShrink: 0` at bottom

**Step 4: Fix consultor AI response area**

In `frontend/src/app/ai/payments-advisor/page.tsx`:
- Increase chat container height to `min-height: 500px`
- Make message text larger: `fontSize: "1rem"` instead of smaller
- Add proper line-height for readability: `lineHeight: 1.7`

**Step 5: Fix brand rules card expansion**

In `frontend/src/app/knowledge/brand-rules/page.tsx`:
- Verify that clicking a card toggles `expandedId` state
- Ensure the expanded details section has proper height transition
- Details should appear below the card header with bullet list of detail items

**Step 6: Commit**
```bash
git add frontend/src/app/search/page.tsx frontend/src/app/auth/profile/page.tsx frontend/src/app/tools/document-analyzer/page.tsx frontend/src/app/ai/payments-advisor/page.tsx frontend/src/app/knowledge/brand-rules/page.tsx
git commit -m "fix: search visibility, profile layout, chat layouts, brand rules expansion"
```

---

### Task 3: UX Polish — Toast, Skeleton, Scroll-to-Top

**Files:**
- Create: `frontend/src/components/ui/Toast.tsx`
- Create: `frontend/src/components/ui/ScrollToTop.tsx`
- Create: `frontend/src/components/ui/Skeleton.tsx`
- Modify: `frontend/src/app/globals.css` (add toast/skeleton styles)
- Modify: `frontend/src/components/layout/AppShell.tsx` (add ScrollToTop)

**Step 1: Create Toast component**

Create `frontend/src/components/ui/Toast.tsx`:
- Fixed position bottom-right
- 3 variants: success (green), error (red), info (blue)
- Auto-dismiss after 3 seconds
- Slide-in animation from right
- Export a `useToast()` hook that returns `{ showToast(message, type) }`
- Use React context or a simple event emitter pattern

**Step 2: Create ScrollToTop button**

Create `frontend/src/components/ui/ScrollToTop.tsx`:
- Shows when `scrollY > 400`
- Fixed position bottom-right (above BottomNav on mobile)
- Smooth scroll to top on click
- Fade in/out animation
- Arrow-up icon

**Step 3: Create Skeleton component**

Create `frontend/src/components/ui/Skeleton.tsx`:
- Pulsing placeholder rectangles
- Props: `width`, `height`, `borderRadius`
- Uses CSS `@keyframes skeleton-pulse` animation
- Variants: `text` (single line), `card` (rectangle), `circle` (avatar)

**Step 4: Add CSS for toast/skeleton**

In `frontend/src/app/globals.css`, add:
```css
@keyframes toast-slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes skeleton-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
.toast { animation: toast-slide-in 0.3s ease-out; }
.skeleton { animation: skeleton-pulse 1.5s infinite; background: var(--border); }
```

**Step 5: Add ScrollToTop to AppShell**

In `frontend/src/components/layout/AppShell.tsx`, render `<ScrollToTop />` inside the non-public route section.

**Step 6: Commit**
```bash
git add frontend/src/components/ui/Toast.tsx frontend/src/components/ui/ScrollToTop.tsx frontend/src/components/ui/Skeleton.tsx frontend/src/app/globals.css frontend/src/components/layout/AppShell.tsx
git commit -m "feat: add toast notifications, scroll-to-top button, skeleton loaders"
```

---

### Task 4: Quiz Engine Overhaul — Data Types & Questions

**Files:**
- Modify: `frontend/src/data/quizzes.ts`
- Modify: `frontend/src/components/ui/PageQuiz.tsx`
- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/src/hooks/useGameProgress.ts`

**Step 1: Expand quiz data types**

In `frontend/src/data/quizzes.ts`, update interfaces:
```typescript
export type QuestionType = "multiple-choice" | "true-false" | "ordering" | "scenario";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  difficulty: Difficulty;
  options: string[];
  correctIndex: number; // for multiple-choice and true-false
  correctOrder?: number[]; // for ordering questions
  explanation: string;
  wrongExplanations?: Record<number, string>; // why each wrong answer is wrong
  scenario?: string; // context text for scenario questions
}
```

**Step 2: Rewrite all quiz questions**

Replace all 18 PageQuiz entries with 3-5 questions each, using all 4 types. Each page should have:
- 1 easy question (concept recall)
- 1-2 medium questions (application)
- 1 hard question (scenario/analysis)

Example for payments-map page:
```typescript
{
  route: "/explore/payments-map",
  questions: [
    {
      id: "pm-1",
      question: "Quantas camadas tem o stack moderno de pagamentos?",
      type: "multiple-choice",
      difficulty: "easy",
      options: ["3", "4", "6", "8"],
      correctIndex: 2,
      explanation: "Sao 6 camadas: Experience, Orchestration, Processing, Network, Banking e Settlement.",
      wrongExplanations: {
        0: "3 camadas seria uma simplificacao extrema que ignora a separacao entre rede, processamento e liquidacao.",
        1: "4 camadas era comum em modelos antigos, mas o stack moderno exige mais granularidade.",
        3: "8 camadas adicionaria divisoes desnecessarias que nao refletem a arquitetura padrao do mercado."
      }
    },
    {
      id: "pm-2",
      question: "A camada de Settlement e responsavel por liquidar fundos entre participantes.",
      type: "true-false",
      difficulty: "easy",
      options: ["Verdadeiro", "Falso"],
      correctIndex: 0,
      explanation: "Verdadeiro. A camada Settlement cuida do clearing, compensacao e transferencia final de fundos."
    },
    {
      id: "pm-3",
      question: "Ordene o fluxo correto de uma transacao de cartao:",
      type: "ordering",
      difficulty: "medium",
      options: ["Checkout (Experience)", "Roteamento (Orchestration)", "Autorizacao (Processing)", "Mensageria (Network)", "Decisao do Emissor (Banking)", "Liquidacao (Settlement)"],
      correctOrder: [0, 1, 2, 3, 4, 5],
      explanation: "O fluxo segue as camadas de cima para baixo: o cliente interage no checkout, o orquestrador roteia, o processador formata, a rede transmite, o banco decide, e o settlement liquida."
    },
    {
      id: "pm-4",
      question: "Um PSP brasileiro quer aumentar a taxa de autorizacao em transacoes cross-border para a Europa. O volume e de 50K transacoes/mes com taxa atual de 68%. Qual estrategia teria maior impacto imediato?",
      type: "scenario",
      difficulty: "hard",
      scenario: "PSP com 50K txn/mes cross-border BR→EU. Taxa auth: 68%. MCC: e-commerce geral. Sem 3DS2 implementado. Um unico adquirente europeu.",
      options: [
        "Implementar Network Tokenization",
        "Adicionar 3DS2 com exemption engine",
        "Contratar segundo adquirente local europeu",
        "Todas as anteriores em conjunto"
      ],
      correctIndex: 3,
      explanation: "A combinacao das tres estrategias e a mais eficaz: 3DS2 reduz fraude e habilita SCA compliance (obrigatorio na EU/PSD2), tokenizacao melhora a taxa em 2-5%, e adquirencia local evita taxas cross-border e melhora aprovacao com emissores europeus. Implementar apenas uma isoladamente teria impacto limitado.",
      wrongExplanations: {
        0: "Tokenizacao ajuda 2-5% mas nao resolve o problema principal: sem 3DS2 as transacoes sao recusadas por SCA na Europa.",
        1: "3DS2 e essencial para EU mas sozinho nao resolve a penalidade de cross-border que um adquirente local resolveria.",
        2: "Adquirente local melhora aprovacao mas sem 3DS2 o emissor europeu ainda recusa por falta de SCA."
      }
    }
  ]
}
```

Write similar depth for ALL 18 pages. Total: ~70-90 questions.

**Step 3: Update PageQuiz component**

In `frontend/src/components/ui/PageQuiz.tsx`:
- Add rendering for `true-false` type (2 big buttons: Verdadeiro / Falso)
- Add rendering for `ordering` type (drag-and-drop or number input to set order)
- Add rendering for `scenario` type (scenario box above question, styled differently)
- Show difficulty badge: "Facil" (green), "Medio" (yellow), "Dificil" (red)
- Show wrong explanations when user gets it wrong: "Por que [selected] esta errado: ..."
- Show XP earned per question based on difficulty

**Step 4: Update XP calculation in useGameProgress**

In `frontend/src/hooks/useGameProgress.ts`, update `recordQuiz`:
- Accept difficulty info: `recordQuiz(pageRoute, correct, total, xpEarned)`
- XP by difficulty: easy +3, medium +5, hard +10, scenario +15
- Pass total XP earned from PageQuiz component

**Step 5: Add quiz CSS**

In `frontend/src/app/globals.css`, add:
```css
.quiz-difficulty-easy { background: #22c55e20; color: #22c55e; }
.quiz-difficulty-medium { background: #f59e0b20; color: #f59e0b; }
.quiz-difficulty-hard { background: #ef444420; color: #ef4444; }
.quiz-scenario { background: var(--primary-bg); border-left: 3px solid var(--primary); }
.quiz-ordering-item { cursor: grab; user-select: none; }
.quiz-wrong-explanation { color: var(--danger); font-style: italic; }
```

**Step 6: Commit**
```bash
git add frontend/src/data/quizzes.ts frontend/src/components/ui/PageQuiz.tsx frontend/src/hooks/useGameProgress.ts frontend/src/app/globals.css
git commit -m "feat: quiz engine overhaul — 4 question types, difficulty levels, detailed explanations"
```

---

### Task 5: AI Integration — Claude API

**Files:**
- Run: `cd frontend && npm install @anthropic-ai/sdk`
- Create: `frontend/src/app/api/ai/chat/route.ts`
- Create: `frontend/src/lib/ai-context.ts`
- Modify: `frontend/src/app/ai/payments-advisor/page.tsx`
- Create: `frontend/.env.local` (add ANTHROPIC_API_KEY)

**Step 1: Install Anthropic SDK**

```bash
cd frontend && npm install @anthropic-ai/sdk
```

**Step 2: Create AI context builder**

Create `frontend/src/lib/ai-context.ts`:
```typescript
import { FEATURES_REGISTRY } from "@/data/features";
import { GLOSSARY_TERMS } from "@/data/glossary";
import { RULES } from "@/data/business-rules";

export function buildKnowledgeContext(): string {
  const features = FEATURES_REGISTRY.slice(0, 40).map(f =>
    `${f.name}: ${f.description}. Rules: ${f.businessRules?.join("; ") || "N/A"}`
  ).join("\n");

  const glossary = GLOSSARY_TERMS.slice(0, 60).map(t =>
    `${t.term}: ${t.definition}`
  ).join("\n");

  const rules = RULES.slice(0, 30).map(r =>
    `${r.name}: ${r.description}`
  ).join("\n");

  return `You are an expert payments consultant for the Payments Academy platform.
You answer questions about payment systems, features, architecture, fraud, compliance, and fintech.
Always answer in Portuguese (Brazil). Be detailed and educational.

KNOWLEDGE BASE:
${features}

GLOSSARY:
${glossary}

BUSINESS RULES:
${rules}`;
}

export function buildDocumentContext(docText: string, docName: string): string {
  return `You are an AI document analyst for the Payments Academy platform.
You are analyzing the document "${docName}".
Answer questions based ONLY on the document content below.
Always answer in Portuguese (Brazil). Be precise and cite specific parts of the document.

DOCUMENT CONTENT:
${docText.slice(0, 30000)}`;
}
```

**Step 3: Create API route with SSE streaming**

Create `frontend/src/app/api/ai/chat/route.ts`:
```typescript
import Anthropic from "@anthropic-ai/sdk";
import { buildKnowledgeContext, buildDocumentContext } from "@/lib/ai-context";

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured", fallback: true }, { status: 503 });
  }

  const { message, mode, documentText, documentName } = await request.json();

  const systemPrompt = mode === "document"
    ? buildDocumentContext(documentText, documentName)
    : buildKnowledgeContext();

  const client = new Anthropic({ apiKey });

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: message }],
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

**Step 4: Update Consultor AI page to use real API**

In `frontend/src/app/ai/payments-advisor/page.tsx`:
- Replace keyword-based `generateResponse()` with:
  ```typescript
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage, mode: "knowledge" }),
  });
  ```
- If response status 503 (no API key), fall back to existing keyword matching
- Parse SSE stream and update message text incrementally (character by character appearing)
- Add rate limiting: check localStorage counter, max 20/hour
- Show "Respostas limitadas — configure ANTHROPIC_API_KEY para respostas completas" when in fallback mode

**Step 5: Update Document Analyzer page to use real API**

In `frontend/src/app/tools/document-analyzer/page.tsx`:
- When sending chat message, include `mode: "document"`, `documentText`, `documentName`
- Parse SSE stream same as Consultor AI
- Same rate limiting and fallback behavior

**Step 6: Commit**
```bash
git add frontend/src/app/api/ai/chat/route.ts frontend/src/lib/ai-context.ts frontend/src/app/ai/payments-advisor/page.tsx frontend/src/app/tools/document-analyzer/page.tsx
git commit -m "feat: integrate Claude API with SSE streaming for AI consultant and document analyzer"
```

---

### Task 6: Content Expansion — Glossary

**Files:**
- Modify: `frontend/src/data/glossary.ts`

**Step 1: Expand glossary from 58 to 120+ terms**

Add 60+ new terms covering Brazilian payments specifics:
- Antecipacao de Recebiveis, Mesa de Antecipacao, Registradora, CERC, CIP, TAG (B3)
- Parcelado Emissor, Parcelado Lojista, MDR, Taxa de Desconto
- SCD, FIDC, Cedente, Cessionario, Lastro, Subordinacao, Cotas Senior/Mezanino/Junior
- SPI (Sistema de Pagamentos Instantaneos), DICT, arranjo de pagamento
- Adquirente, Sub-adquirente, Facilitador de Pagamento, Instituidor de Arranjo
- Interchange, Interchange++, Blended Rate, MDR
- PCI DSS, PCI SAQ-A, PCI SAQ-D, PA-DSS
- Chargeback, Representment, Pre-Arbitragem, Arbitragem
- BIN, IIN, PAN, CVV, CVC, AVS
- Tokenizacao, Network Token, Criptograma, DPAN, FPAN
- DCC, MCC, TCC, SIC
- Stand-In Processing, STIP, STAR
- EMV, Chip & PIN, Contactless, NFC
- 3DS, ACS, DS (Directory Server), Frictionless, Challenge
- Pix, Pix Saque, Pix Troco, Pix Garantido, Pix Automatico
- Open Finance, Iniciador de Pagamento (ITP)
- BNPL, Credito Direto, Conta de Pagamento
- Webhook, Idempotencia, Callback URL
- Sandbox, Homologacao, Go-Live
- Liquidacao Bruta (RTGS), Liquidacao Liquida (DNS)
- Spread Cambial, IOF, Remessa Internacional
- Crypto: Bridge, MEV, Impermanent Loss, Flash Loan, Oracle, Rollup, Layer 2, Zero Knowledge Proof

Each term with: `term`, `definition` (2-3 sentences), `aliases`, `category`.

**Step 2: Commit**
```bash
git add frontend/src/data/glossary.ts
git commit -m "feat: expand glossary from 58 to 120+ terms with Brazilian payments specifics"
```

---

### Task 7: Content Expansion — Deep Topic Pages

**Files:**
- Create: `frontend/src/app/knowledge/antecipacao-recebiveis/page.tsx`
- Create: `frontend/src/app/knowledge/parcelamento/page.tsx`
- Create: `frontend/src/app/knowledge/credito-estruturado/page.tsx`
- Modify: `frontend/src/components/layout/Sidebar.tsx` (add to Knowledge Base)
- Modify: `frontend/src/lib/search-index.ts` (add to index)
- Modify: `frontend/src/data/learning-trails.ts` (add to relevant trails)

**Step 1: Create Antecipacao de Recebiveis page**

Comprehensive page covering:
- O que e antecipacao de recebiveis
- Calculo de deságio (formula: VP = VF / (1 + taxa)^n)
- Impacto no fluxo de caixa (exemplos com numeros reais)
- Mesa de antecipacao (como funciona, players)
- Registradora: CERC, CIP, TAG/B3 — papel de cada uma
- Regulacao BCB (Resolucao 4.734, Circular 3.952)
- Agenda de recebiveis e interoperabilidade
- Riscos: concentracao, fraude de duplicidade, cessao sem lastro
- Quiz com 4 perguntas

**Step 2: Create Parcelamento page**

Comprehensive page covering:
- Parcelado emissor vs parcelado lojista (tabela comparativa)
- Como o interchange muda por numero de parcelas
- Impacto no MDR do merchant
- Chargeback em transacoes parceladas (qual parcela e disputada?)
- Juros do emissor — como e calculado
- Parcelado sem juros — quem paga o custo?
- Regulacao: limite de parcelas, transparencia ao consumidor
- Impacto financeiro: receivables duration, working capital
- Quiz com 4 perguntas

**Step 3: Create Credito Estruturado page**

Comprehensive page covering:
- SCD — Sociedade de Credito Direto (modelo, regulacao BCB 4.656)
- FIDC — Fundo de Investimento em Direitos Creditorios
  - Estrutura: cedente, custodiante, administrador, gestor
  - Cotas: senior, mezanino, junior (subordinacao)
  - Lastro: recebiveis de cartao, duplicatas, cheques
- Credit as a Service — modelo de fintech embarcada
- Cessao de recebiveis — como funciona, registro
- Riscos: inadimplencia, diluicao, concentracao
- Regulacao: CVM 356, BCB resolucoes
- Quiz com 4 perguntas

**Step 4: Update sidebar, search index, and trails**

- Add 3 new pages to sidebar Knowledge Base section
- Add to search index static pages array
- Add to "Fundamentos" or create new "Credito & Recebiveis" trail

**Step 5: Commit**
```bash
git add frontend/src/app/knowledge/antecipacao-recebiveis/ frontend/src/app/knowledge/parcelamento/ frontend/src/app/knowledge/credito-estruturado/ frontend/src/components/layout/Sidebar.tsx frontend/src/lib/search-index.ts frontend/src/data/learning-trails.ts
git commit -m "feat: add deep content pages — antecipacao, parcelamento, credito estruturado"
```

---

### Task 8: Complete Features Data

**Files:**
- Modify: `frontend/src/data/features.ts`

**Step 1: Add technicalRequirements and payloadExample to remaining 78 features**

The first 5 features already have these fields. Add them to all remaining 78 features. Each feature gets:
- `technicalRequirements`: 3-5 bullet points of technical implementation details
- `payloadExample`: realistic JSON payload string

Focus on accuracy — use real API patterns from Stripe, Adyen, Cielo, PagSeguro as reference for payload formats.

**Step 2: Commit**
```bash
git add frontend/src/data/features.ts
git commit -m "feat: complete technicalRequirements and payloadExample for all 83 features"
```

---

### Task 9: Final Verification

**Step 1: TypeScript compile check**
```bash
cd frontend && npx tsc --noEmit
```
Expected: clean compile (0 errors)

**Step 2: Start dev server and test all pages**
```bash
cd frontend && npm run dev
```
- Visit every new/modified page
- Test quiz with new question types
- Test AI chat (if ANTHROPIC_API_KEY configured) or verify fallback
- Test security: register new user, verify hash stored, test rate limiting
- Test UX fixes: search results visible, profile buttons visible, scroll-to-top works

**Step 3: Commit any fixes**
```bash
git add -A && git commit -m "fix: verification fixes"
```
