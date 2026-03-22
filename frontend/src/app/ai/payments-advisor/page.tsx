"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Rate limiting helper
// ---------------------------------------------------------------------------

interface RateLimitData {
  count: number;
  resetAt: number;
}

function checkRateLimit(): { allowed: boolean; minutesLeft: number } {
  const key = "pks-ai-requests";
  const now = Date.now();
  const raw = localStorage.getItem(key);
  let data: RateLimitData = raw ? JSON.parse(raw) : { count: 0, resetAt: now + 3600000 };

  // Reset if window expired
  if (now > data.resetAt) {
    data = { count: 0, resetAt: now + 3600000 };
  }

  if (data.count >= 20) {
    const minutesLeft = Math.ceil((data.resetAt - now) / 60000);
    return { allowed: false, minutesLeft };
  }

  data.count++;
  localStorage.setItem(key, JSON.stringify(data));
  return { allowed: true, minutesLeft: 0 };
}

// ---------------------------------------------------------------------------
// SSE stream parser helper
// ---------------------------------------------------------------------------

async function parseSSEStream(
  response: Response,
  onText: (fullText: string) => void
): Promise<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
    for (const line of lines) {
      const data = line.slice(6);
      if (data === "[DONE]") break;
      try {
        const parsed = JSON.parse(data);
        if (parsed.text) {
          fullText += parsed.text;
          onText(fullText);
        }
      } catch {
        // skip malformed lines
      }
    }
  }

  return fullText;
}

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Predefined Q&A knowledge base
// ---------------------------------------------------------------------------

/** Maps question keywords to detailed responses. The matcher uses simple
 *  keyword overlap so the user doesn't need to type the exact question. */
const QA_PAIRS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["authorization", "rate", "improve", "auth", "feature", "autorização", "taxa", "melhorar"],
    answer: `Diversas features podem melhorar significativamente sua taxa de autorização:

1. **Network Tokens** (+3-5%): Substituem PANs por tokens de rede. Permanecem válidos após reemissão do cartão e são reconhecidos pelos emissores como de menor risco, levando a maiores taxas de aprovação.

2. **Smart Routing** (+2-4%): Roteia dinamicamente cada transação para o adquirente com maior probabilidade de aprovação com base em BIN, emissor, valor e dados históricos de performance.

3. **Account Updater** (+2-3%): Atualiza automaticamente credenciais de cartões expirados ou reemitidos para que pagamentos recorrentes não sejam recusados.

4. **Retry Logic** (+1-2%): Retenta automaticamente soft declines (ex: timeout do emissor, saldo insuficiente) com timing e seleção de adquirente otimizados.

5. **Cascade Routing** (+1-2%): Quando um adquirente primário recusa, a transação é enviada a um adquirente secundário antes de retornar a recusa ao cliente.

Para o maior impacto, comece com Network Tokens e Smart Routing -- são complementares e entregam o maior ROI combinado.`,
  },
  {
    keywords: ["3d", "secure", "3ds", "how", "work", "como", "funciona"],
    answer: `**3D Secure (3DS)** é um protocolo de autenticação do titular do cartão originalmente criado pela Visa ("Verified by Visa") e adotado por todas as principais bandeiras (Mastercard SecureCode, Amex SafeKey, etc.).

**Como funciona o fluxo:**

1. O cliente insere os dados do cartão no checkout.
2. Seu gateway de pagamento envia uma requisição de autenticação ao Directory Server da bandeira.
3. O Directory Server roteia para o Access Control Server (ACS) do emissor.
4. O ACS determina se autenticação adicional é necessária (ex: OTP, biometria, push no app) com base em sinais de risco.
5. Se o cliente passa na autenticação, o emissor retorna uma prova criptográfica (CAVV) que viaja com a requisição de autorização.

**3DS2 vs 3DS1:**
- 3DS2 suporta fluxos frictionless (autenticação baseada em risco), então transações de baixo risco podem ser aprovadas sem interação do cliente.
- 3DS2 passa 10x mais dados ao emissor, permitindo melhores decisões de risco.
- 3DS1 sempre aciona um redirect e challenge, aumentando o abandono de carrinho.

**Impacto nas métricas:**
- Taxa de fraude: -2 a -4% (grande redução)
- Taxa de chargeback: -2 a -3% (liability shift para o emissor)
- Taxa de conversão: -1 a -3% (fricção dos challenges)
- Dica: Use 3DS baseado em risco ("Dynamic 3DS") para desafiar apenas transações de alto risco, equilibrando redução de fraude com conversão.`,
  },
  {
    keywords: ["cross-border", "cross", "border", "failing", "international", "pagamentos", "falhando"],
    answer: `Falhas em pagamentos cross-border geralmente têm várias causas raiz:

**1. Recusas do Emissor (mais comum)**
- Muitos emissores têm regras mais rígidas para transações cross-border. Eles sinalizam códigos de país ou moedas desconhecidas como potencial fraude.
- **Solução:** Use adquirentes locais na região do cliente para que as transações pareçam domésticas para o emissor.

**2. Incompatibilidade de Moeda**
- Apresentar um preço em uma moeda que o emissor não espera aumenta as taxas de recusa.
- **Solução:** Implemente Dynamic Currency Conversion (DCC) ou Multi-Currency Pricing para apresentar a moeda local do titular do cartão.

**3. Métodos de Pagamento Locais Ausentes**
- Em muitas regiões (Brasil, Holanda, Sudeste Asiático), a penetração de cartões é baixa e métodos locais dominam (Pix, iDEAL, GrabPay).
- **Solução:** Integre Alternative Payment Methods (APMs) para seus principais mercados.

**4. Bloqueios Regulatórios (SCA/PSD2)**
- Emissores europeus podem recusar transações sem Strong Customer Authentication (SCA), que inclui 3DS.
- **Solução:** Implemente 3D Secure 2 com tratamento adequado de isenções.

**5. Roteamento de Rede**
- Algumas redes roteiam transações cross-border por caminhos subótimos.
- **Solução:** Smart Routing com lógica baseada em BIN pode selecionar o melhor adquirente para o país de emissão de cada cartão.

**Ganhos rápidos:** Adicione adquirência local nos seus 2-3 principais mercados, habilite 3DS2 e integre 1-2 APMs chave por região.`,
  },
  {
    keywords: ["network", "token", "tokenization", "what", "why", "tokens", "devo"],
    answer: `**Network Tokens** são tokens emitidos pela bandeira do cartão (Visa, Mastercard, etc.) que substituem o PAN real (número do cartão) para um par específico de merchant-cartão.

**Diferenças chave dos tokens de PSP/gateway:**
- Tokens de PSP são proprietários e funcionam apenas dentro do sistema daquele PSP.
- Network tokens são emitidos pela própria bandeira, então são reconhecidos por todos os participantes da cadeia (adquirente, bandeira, emissor).

**Benefícios:**

| Benefício | Detalhes |
|-----------|----------|
| Maiores taxas de auth | Emissores consideram network tokens mais confiáveis (+3-5% de lift na auth) |
| Auto-atualização | Quando um cartão é reemitido, a bandeira atualiza automaticamente o token -- sem recusa |
| Menos fraude | Tokens são restritos ao domínio, então uma violação em um merchant não compromete o cartão em todos os lugares |
| Menor interchange | Algumas bandeiras oferecem interchange reduzido para transações tokenizadas |

**Como funcionam:**
1. Você solicita um token ao Token Service Provider (TSP) da bandeira usando o PAN do titular.
2. O TSP retorna um token + criptograma específico para seu merchant ID.
3. Você armazena o token no lugar do PAN e o usa para todas as transações futuras.
4. A bandeira faz a de-tokenização no momento da autorização, então o emissor vê o PAN real.

Network tokens são a base para Account Updater, Apple Pay / Google Pay (que usam network tokens no nível do dispositivo) e billing recorrente aprimorado.`,
  },
  {
    keywords: ["chargeback", "reduce", "dispute", "prevention", "reduzir", "chargebacks"],
    answer: `Reduzir chargebacks requer uma estratégia multicamadas entre prevenção, detecção e resposta:

**Camada de Prevenção:**
1. **Fraud Scoring** -- Use scoring baseado em ML para bloquear transações fraudulentas antes da autorização. Isso elimina a principal fonte de chargebacks.
2. **3D Secure** -- Transfere a responsabilidade para o emissor em transações autenticadas. Mesmo se um chargeback for registrado, você está protegido.
3. **Descriptors claros no billing** -- Muitos chargebacks de "friendly fraud" acontecem porque clientes não reconhecem a cobrança. Use nomes de marca reconhecíveis no seu billing descriptor.
4. **Confirmação de entrega** -- Para bens físicos, sempre capture rastreamento de envio e confirmação de entrega como evidência.

**Camada de Detecção:**
5. **Velocity Checks** -- Sinalizam contas fazendo compras incomumente frequentes ou pedidos de alto valor.
6. **Device Fingerprinting** -- Detecta quando o mesmo dispositivo é usado em múltiplas contas ou foi sinalizado por fraude anterior.
7. **Address Verification (AVS)** -- Verifica se o endereço de cobrança corresponde ao que o emissor tem em arquivo.

**Camada de Resposta:**
8. **Alertas de Chargeback (Ethoca/Verifi)** -- Receba notificações de disputas antes que se tornem chargebacks e emita reembolsos proativos.
9. **Compelling Evidence 3.0** -- O programa CE3.0 da Visa permite responder automaticamente a certas disputas de fraude com dados de transação provando que o titular fez a compra.

**Benchmarks alvo:** Mantenha sua taxa de chargeback abaixo de 0.65% (Visa) e 1.0% (Mastercard) para evitar programas de monitoramento.`,
  },
  {
    keywords: ["smart", "routing", "route", "acquirer", "how", "roteamento", "funciona"],
    answer: `**Smart Routing** é uma estratégia de orquestração de pagamentos que seleciona dinamicamente o adquirente ou processador de pagamento ideal para cada transação em tempo real.

**Como funciona:**

1. Quando uma transação chega, o engine de roteamento avalia múltiplos sinais:
   - BIN do cartão / banco emissor / país
   - Valor e moeda da transação
   - Merchant category code (MCC)
   - Taxa de aprovação histórica por adquirente para transações similares
   - Uptime e tempos de resposta do adquirente
   - Custo por transação em cada adquirente

2. Pontua cada adquirente disponível e roteia para aquele com a maior probabilidade de aprovação esperada (ou menor custo, dependendo do seu objetivo de otimização).

**Abordagens de implementação:**
- **Baseada em regras:** Regras estáticas como "Rotear todos os cartões brasileiros para o adquirente local." Simples mas limitada.
- **Baseada em score:** Pondera fatores (taxa de auth, custo, velocidade) e escolhe o maior score. Mais flexível.
- **Baseada em ML:** Treina modelos com dados históricos de transações para prever probabilidade de aprovação por adquirente. Mais eficaz mas requer dados.

**Resultados típicos:**
- +2 a 4% de melhoria na taxa de autorização
- -15 a 30% de redução de custo (ao rotear para adquirentes mais baratos quando apropriado)
- +1 a 2% de melhoria na taxa de conversão

**Pré-requisitos:** Você precisa de pelo menos 2 adquirentes (idealmente 3+) e uma camada de orquestração de pagamentos acima deles. Muitos PSPs modernos oferecem isso nativamente.`,
  },
];

/** Suggested questions displayed before the first message */
const SUGGESTED_QUESTIONS = [
  "Quais features melhoram a taxa de autorização?",
  "Como funciona o 3D Secure?",
  "Por que meus pagamentos cross-border estão falhando?",
  "O que são network tokens e por que devo usá-los?",
  "Como posso reduzir chargebacks?",
  "Como funciona o smart routing?",
];

// ---------------------------------------------------------------------------
// Response matching logic
// ---------------------------------------------------------------------------

/**
 * Find the best matching Q&A pair for a user query.
 * Uses simple keyword overlap scoring.
 */
function findBestAnswer(query: string): string {
  const queryWords = query.toLowerCase().split(/\s+/);
  let bestScore = 0;
  let bestAnswer = "";

  for (const pair of QA_PAIRS) {
    const score = pair.keywords.reduce((acc, kw) => {
      return acc + (queryWords.some((w) => w.includes(kw) || kw.includes(w)) ? 1 : 0);
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = pair.answer;
    }
  }

  if (bestScore === 0) {
    return `Ótima pergunta! Embora eu não tenha uma resposta pré-carregada para esse tópico, posso ajudar com as seguintes áreas:

- **Taxas de autorização** -- quais features melhoram as taxas de aprovação
- **3D Secure** -- como protocolos de autenticação funcionam
- **Pagamentos cross-border** -- diagnóstico de falhas em pagamentos internacionais
- **Network Tokens** -- estratégias e benefícios de tokenização
- **Chargebacks** -- estratégias de prevenção e redução
- **Smart Routing** -- seleção de adquirentes e orquestração de pagamentos

Tente perguntar sobre um desses tópicos, ou reformule sua pergunta com palavras-chave diferentes!`;
  }

  return bestAnswer;
}

/** Generate a unique message ID */
let messageCounter = 0;
function generateId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

// ---------------------------------------------------------------------------
// Simple markdown-to-JSX renderer (supports bold, bullet lists, tables)
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table detection: if line contains | and next line is a separator
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|[-\s|:]+\|\s*$/.test(lines[i + 1])) {
      // Collect table rows
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headerCells = tableLines[0].split("|").filter(Boolean).map((c) => c.trim());
      const bodyRows = tableLines.slice(2); // skip header + separator
      elements.push(
        <div key={i} className="overflow-x-auto" style={{ margin: "8px 0" }}>
          <table className="text-xs w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {headerCells.map((cell, ci) => (
                  <th key={ci} className="text-left font-semibold" style={{ border: "1px solid var(--border)", padding: "4px 8px", background: "var(--surface-hover)" }}>
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => {
                const cells = row.split("|").filter(Boolean).map((c) => c.trim());
                return (
                  <tr key={ri}>
                    {cells.map((cell, ci) => (
                      <td key={ci} style={{ border: "1px solid var(--border)", padding: "4px 8px" }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Empty line -> spacer
    if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 8 }} />);
      i++;
      continue;
    }

    // Numbered list item (e.g., "1. **Text** -- description")
    if (/^\d+\.\s/.test(line.trim())) {
      elements.push(
        <div key={i} className="flex items-start" style={{ gap: 8, marginLeft: 8, margin: "2px 0 2px 8px" }}>
          <span className="shrink-0" style={{ color: "var(--text-muted)" }}>{line.trim().match(/^(\d+\.)/)?.[1]}</span>
          <span>{renderInline(line.trim().replace(/^\d+\.\s*/, ""))}</span>
        </div>,
      );
      i++;
      continue;
    }

    // Bullet list item
    if (/^[-*]\s/.test(line.trim())) {
      elements.push(
        <div key={i} className="flex items-start" style={{ gap: 8, marginLeft: 16, margin: "2px 0 2px 16px" }}>
          <span className="shrink-0" style={{ marginTop: 6, width: 6, height: 6, borderRadius: "50%", background: "var(--text-muted)" }} />
          <span>{renderInline(line.trim().replace(/^[-*]\s*/, ""))}</span>
        </div>,
      );
      i++;
      continue;
    }

    // Regular line
    elements.push(
      <p key={i} style={{ margin: "2px 0" }}>
        {renderInline(line)}
      </p>,
    );
    i++;
  }

  return <>{elements}</>;
}

/** Render inline markdown (bold only) */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Consultor de Pagamentos
 * Interface de chat onde usuários fazem perguntas sobre pagamentos e recebem
 * respostas detalhadas de uma base de conhecimento curada.
 */
export default function PaymentsAdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [rateLimitToast, setRateLimitToast] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-dismiss rate limit toast
  useEffect(() => {
    if (rateLimitToast) {
      const timer = setTimeout(() => setRateLimitToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [rateLimitToast]);

  /** Send message — tries AI API first, falls back to keyword-based */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      // Rate limit check
      const rateCheck = checkRateLimit();
      if (!rateCheck.allowed) {
        setRateLimitToast(
          `Limite de requisicoes atingido. Tente novamente em ${rateCheck.minutesLeft} minutos.`
        );
        return;
      }

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim(), mode: "knowledge" }),
        });

        // Fallback to keyword-based if API not configured
        if (response.status === 503) {
          setIsFallbackMode(true);
          const answer = findBestAnswer(text);
          const assistantMessage: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: answer,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsTyping(false);
          return;
        }

        if (!response.ok) {
          throw new Error("API error");
        }

        // SSE streaming
        setIsFallbackMode(false);
        const placeholderId = generateId();
        setMessages((prev) => [
          ...prev,
          { id: placeholderId, role: "assistant", content: "", timestamp: new Date() },
        ]);

        await parseSSEStream(response, (fullText) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: fullText,
            };
            return updated;
          });
        });

        setIsTyping(false);
      } catch {
        // Network error or other failure — fallback
        setIsFallbackMode(true);
        const answer = findBestAnswer(text);
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: answer,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }
    },
    [isTyping],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="max-w-4xl" style={{ margin: "0 auto", display: "flex", flexDirection: "column", height: "calc(100vh - 48px)" }}>
      {/* Page header */}
      <div className="page-header shrink-0 animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: 12 }}>Consultor de Pagamentos</h1>
        <p className="page-description">
          Faça perguntas sobre sistemas de pagamento, features e arquitetura. Alimentado por uma base de conhecimento curada.
        </p>
      </div>

      {/* Stats section */}
      <div
        className="animate-fade-in stagger-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div className="stat-card" style={{ padding: "16px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
            Cobertura
          </div>
          <div className="metric-value" style={{ fontSize: 26 }}>30</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Paginas</div>
        </div>

        <div className="stat-card" style={{ padding: "16px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
            Catalogo
          </div>
          <div className="metric-value" style={{ fontSize: 26 }}>300+</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Features</div>
        </div>

        <div className="stat-card" style={{ padding: "16px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
            Motor
          </div>
          <div className="metric-value" style={{ fontSize: 26 }}>IA</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Especializada</div>
        </div>

        <div className="stat-card" style={{ padding: "16px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
            Velocidade
          </div>
          <div className="metric-value" style={{ fontSize: 26 }}>~1s</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Respostas Instantaneas</div>
        </div>
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16, fontStyle: "italic" }}>
        * Esses números podem ter sofrido alteração com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* Rate limit toast */}
      {rateLimitToast && (
        <div
          style={{
            padding: "10px 16px",
            marginBottom: 12,
            borderRadius: 8,
            background: "var(--danger, #ef4444)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {rateLimitToast}
        </div>
      )}

      {/* Fallback mode banner */}
      {isFallbackMode && messages.length > 0 && (
        <div
          style={{
            padding: "8px 16px",
            marginBottom: 12,
            borderRadius: 8,
            background: "var(--surface-hover)",
            border: "1px solid var(--border)",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Respostas limitadas — configure ANTHROPIC_API_KEY para respostas completas
        </div>
      )}

      {/* Chat area */}
      <div className="card-glow flex flex-col animate-fade-in stagger-2" style={{ flex: 1, padding: 0, overflow: "hidden", minHeight: 500 }}>
        {/* Messages list */}
        <div className="overflow-y-auto" style={{ flex: 1, padding: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center text-center" style={{ height: "100%", minHeight: 300 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                    fontSize: 24,
                    color: "#fff",
                    marginBottom: 16,
                  }}
                >
                  AI
                </div>
                <h3 className="text-lg font-semibold" style={{ marginBottom: 4 }}>Consultor de Pagamentos</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)", marginBottom: 24, maxWidth: 448 }}>
                  Posso responder perguntas sobre features de pagamento, taxas de autorização, prevenção de fraude, estratégias de roteamento e mais.
                </p>

                {/* Suggested questions */}
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 8, width: "100%", maxWidth: 512 }}>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestionClick(q)}
                      className="text-left text-sm transition-all"
                      style={{
                        padding: "12px 16px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "transparent",
                        cursor: "pointer",
                        color: "var(--foreground)",
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className="flex"
                style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    borderRadius: 16,
                    padding: "12px 16px",
                    ...(msg.role === "user"
                      ? { background: "var(--primary)", color: "#fff", borderBottomRightRadius: 6 }
                      : { background: "var(--surface-hover)", borderBottomLeftRadius: 6 }),
                  }}
                >
                  {/* Role label */}
                  <div
                    className="font-semibold"
                    style={{
                      fontSize: 10,
                      marginBottom: 4,
                      color: msg.role === "user" ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
                    }}
                  >
                    {msg.role === "user" ? "Você" : "Consultor de Pagamentos"}
                  </div>
                  {/* Message content */}
                  <div style={{ fontSize: "1rem", lineHeight: 1.7 }}>
                    {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                  </div>
                  {/* Timestamp */}
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 8,
                      color: msg.role === "user" ? "rgba(255,255,255,0.5)" : "var(--text-muted)",
                    }}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex" style={{ justifyContent: "flex-start" }}>
                <div style={{ background: "var(--surface-hover)", borderRadius: 16, borderBottomLeftRadius: 6, padding: "12px 16px" }}>
                  <div className="font-semibold" style={{ fontSize: 10, marginBottom: 4, color: "var(--text-muted)" }}>
                    Consultor de Pagamentos
                  </div>
                  <div className="flex items-center" style={{ gap: 4 }}>
                    <span className="animate-bounce" style={{ width: 8, height: 8, background: "var(--text-muted)", borderRadius: "50%", animationDelay: "0ms" }} />
                    <span className="animate-bounce" style={{ width: 8, height: 8, background: "var(--text-muted)", borderRadius: "50%", animationDelay: "150ms" }} />
                    <span className="animate-bounce" style={{ width: 8, height: 8, background: "var(--text-muted)", borderRadius: "50%", animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested questions when there are messages */}
        {messages.length > 0 && !isTyping && (
          <div className="flex overflow-x-auto shrink-0" style={{ padding: "0 16px 8px 16px", gap: 8 }}>
            {SUGGESTED_QUESTIONS.filter(
              (q) => !messages.some((m) => m.role === "user" && m.content === q),
            )
              .slice(0, 3)
              .map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestionClick(q)}
                  className="text-xs transition-all whitespace-nowrap shrink-0"
                  style={{
                    padding: "6px 12px",
                    borderRadius: 9999,
                    border: "1px solid var(--border)",
                    background: "transparent",
                    cursor: "pointer",
                    color: "var(--foreground)",
                  }}
                >
                  {q}
                </button>
              ))}
          </div>
        )}

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center shrink-0"
          style={{ borderTop: "1px solid var(--border)", padding: 12, gap: 8 }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre sistemas de pagamento, features ou arquitetura..."
            disabled={isTyping}
            className="text-sm"
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              outline: "none",
              color: "var(--foreground)",
              opacity: isTyping ? 0.5 : 1,
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="text-sm font-medium transition-all"
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
              color: "#fff",
              cursor: !input.trim() || isTyping ? "not-allowed" : "pointer",
              opacity: !input.trim() || isTyping ? 0.5 : 1,
            }}
          >
            Enviar
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="divider-text animate-fade-in stagger-3" style={{ marginTop: 24, marginBottom: 16 }}>Páginas Relacionadas</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 animate-fade-in stagger-4" style={{ gap: 12, marginBottom: 32 }}>
        {[
          { label: "Base de Features", desc: "Catálogo completo de features de pagamento", href: "/knowledge/features", icon: "📦" },
          { label: "Simulador", desc: "Simule o impacto de features na performance", href: "/simulation/payment-simulator", icon: "⚡" },
          { label: "Mapa de Pagamentos", desc: "Arquitetura visual em camadas do sistema", href: "/explore/payments-map", icon: "🗺️" },
        ].map((p) => (
          <Link key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <span style={{ fontSize: 24 }}>{p.icon}</span>
            <div>
              <div className="text-sm font-semibold">{p.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
