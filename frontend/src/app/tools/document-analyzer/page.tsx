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

interface DocumentInfo {
  name: string;
  source: "pdf" | "url";
  size?: string;
  url?: string;
  pageCount: number;
  docType: "regulation" | "tech-doc" | "psp-doc" | "generic";
  topics: string[];
  extractedText: string;
  loadedAt: Date;
}

// ---------------------------------------------------------------------------
// Simulated document text for PDF uploads
// ---------------------------------------------------------------------------

const SIMULATED_PDF_TEXT = `# Documento Tecnico - Sistema de Pagamentos

## 1. Introducao
Este documento descreve a arquitetura e os requisitos tecnicos do sistema de pagamentos, incluindo padroes de seguranca, compliance e processamento de transacoes.

## 2. Arquitetura do Sistema
A arquitetura do sistema de pagamentos e baseada em microsservicos, com componentes independentes para autorizacao, captura, liquidacao e reconciliacao. O gateway de pagamentos atua como ponto central de orquestracao.

### 2.1 Componentes Principais
- Gateway de Pagamentos: Recebe e roteia transacoes
- Motor de Autorizacao: Valida e autoriza transacoes em tempo real
- Sistema de Liquidacao: Processa settlement com adquirentes e bandeiras
- Modulo Anti-Fraude: Analisa risco de cada transacao
- Vault de Tokenizacao: Armazena dados sensiveis de forma segura

### 2.2 Fluxo de Transacao
1. Cliente submete pagamento no checkout
2. Gateway recebe requisicao e aplica regras de roteamento
3. Motor anti-fraude analisa o risco da transacao
4. Transacao e enviada ao adquirente selecionado
5. Adquirente encaminha para a bandeira e emissor
6. Resposta retorna pelo caminho inverso
7. Sistema registra resultado e inicia processo de liquidacao

## 3. Tokenizacao
A tokenizacao e o processo de substituir dados sensiveis do cartao (PAN) por um token unico. O sistema suporta:
- Tokenizacao de gateway (tokens proprietarios)
- Network tokens (emitidos pela bandeira)
- Device tokens (Apple Pay, Google Pay)

### 3.1 Beneficios da Tokenizacao
- Reducao do escopo PCI DSS
- Maior taxa de autorizacao com network tokens (+3-5%)
- Atualizacao automatica de cartoes reemitidos
- Menor risco de exposicao de dados em caso de breach

## 4. Compliance e Regulamentacao
O sistema deve estar em conformidade com:
- PCI DSS v4.0: Padrao de seguranca para dados de cartao
- PSD2/SCA: Autenticacao forte do cliente para transacoes europeias
- LGPD: Protecao de dados pessoais no Brasil
- Regulamentacao do Banco Central: Normas para arranjos de pagamento

### 4.1 Requisitos PCI DSS
- Criptografia de dados em transito e em repouso
- Controle de acesso baseado em funcao
- Monitoramento e logging de todas as operacoes
- Testes de penetracao regulares
- Politica de retencao de dados

### 4.2 Requisitos de SCA (Strong Customer Authentication)
- Autenticacao baseada em dois ou mais fatores
- Algo que o usuario sabe (senha, PIN)
- Algo que o usuario possui (celular, token)
- Algo que o usuario e (biometria)

## 5. Seguranca
Medidas de seguranca implementadas:
- Criptografia AES-256 para dados em repouso
- TLS 1.3 para comunicacao entre servicos
- HSM para gerenciamento de chaves criptograficas
- WAF para protecao contra ataques web
- Rate limiting e throttling
- Monitoramento continuo com alertas

## 6. Metricas e Monitoramento
KPIs monitorados pelo sistema:
- Taxa de autorizacao: meta acima de 95%
- Latencia de processamento: p99 abaixo de 500ms
- Taxa de fraude: meta abaixo de 0.1%
- Disponibilidade: SLA de 99.99%
- Taxa de chargeback: meta abaixo de 0.65%

## 7. Integracao com PSPs
O sistema suporta integracao com multiplos PSPs (Payment Service Providers):
- Adyen: Processamento global com adquirencia local
- Stripe: API moderna com suporte a subscricoes
- Braspag/Cielo: Adquirencia local no Brasil
- PagSeguro: Pagamentos domesticos e Pix

### 7.1 Roteamento Inteligente
O smart routing seleciona o melhor PSP para cada transacao com base em:
- BIN do cartao e pais do emissor
- Taxa de aprovacao historica
- Custo por transacao
- Disponibilidade do PSP
- Tipo de transacao (domestica vs cross-border)

## 8. Metodos de Pagamento
Metodos suportados:
- Cartoes de credito e debito (Visa, Mastercard, Amex, Elo)
- Pix (transferencia instantanea)
- Boleto bancario
- Carteiras digitais (Apple Pay, Google Pay, Samsung Pay)
- BNPL (Buy Now Pay Later)
- Transferencia bancaria

## 9. Reconciliacao e Liquidacao
O processo de reconciliacao garante que todas as transacoes sejam corretamente liquidadas:
- Reconciliacao automatica diaria
- Matching de transacoes com extratos dos adquirentes
- Identificacao de discrepancias
- Ajustes automaticos para estornos e chargebacks
- Relatorios de liquidacao por adquirente e bandeira

## 10. Disaster Recovery
Estrategia de continuidade do negocio:
- Multi-region deployment (failover automatico)
- Backup continuo de dados criticos
- RTO: 15 minutos
- RPO: 0 (zero data loss)
- Testes de DR trimestrais`;

// ---------------------------------------------------------------------------
// Simulated URL document text
// ---------------------------------------------------------------------------

const SIMULATED_URL_TEXT = `# Documentacao Tecnica - API de Pagamentos

## Visao Geral
Esta documentacao descreve a API RESTful do sistema de pagamentos, incluindo endpoints, autenticacao, e exemplos de integracao.

## Autenticacao
A API utiliza autenticacao via API Key + Secret, transmitidos via header Authorization usando esquema Bearer token. Todas as requisicoes devem ser feitas via HTTPS.

### Gerando Credenciais
1. Acesse o painel administrativo
2. Navegue ate Configuracoes > API Keys
3. Gere um novo par de credenciais
4. Armazene o secret de forma segura (nao sera exibido novamente)

## Endpoints Principais

### POST /v1/payments
Cria uma nova transacao de pagamento.
Parametros:
- amount (required): Valor em centavos
- currency (required): Codigo ISO 4217 (ex: BRL, USD)
- payment_method: Metodo de pagamento
- customer: Dados do cliente
- metadata: Dados adicionais

### GET /v1/payments/{id}
Consulta o status de uma transacao.

### POST /v1/payments/{id}/capture
Captura uma transacao pre-autorizada.

### POST /v1/payments/{id}/refund
Estorna total ou parcialmente uma transacao.

## Webhooks
O sistema envia notificacoes via webhook para os seguintes eventos:
- payment.authorized: Transacao autorizada
- payment.captured: Transacao capturada
- payment.failed: Transacao falhou
- payment.refunded: Transacao estornada
- chargeback.created: Chargeback aberto
- chargeback.resolved: Chargeback resolvido

## Codigos de Erro
- 1001: Cartao recusado pelo emissor
- 1002: Saldo insuficiente
- 1003: Cartao expirado
- 1004: CVV incorreto
- 1005: Transacao nao permitida
- 2001: Erro de autenticacao
- 2002: Parametro invalido
- 3001: Timeout do adquirente
- 3002: PSP indisponivel

## Rate Limits
- 100 requisicoes por segundo por merchant
- 1000 requisicoes por minuto por API key
- Respostas incluem headers X-RateLimit-Remaining e X-RateLimit-Reset

## Ambientes
- Sandbox: https://sandbox.api.pagamentos.com/v1
- Producao: https://api.pagamentos.com/v1

## Idempotencia
Todas as requisicoes POST suportam o header Idempotency-Key para garantir que requisicoes duplicadas nao criem transacoes duplicadas.

## Seguranca
- Todas as requisicoes devem usar HTTPS/TLS 1.2+
- IPs de origem podem ser restritos no painel
- Webhooks sao assinados com HMAC-SHA256
- Dados de cartao nunca sao logados ou armazenados em texto plano

## Tokenizacao
Para reducao de escopo PCI DSS, recomendamos o uso de tokenizacao:
- Hosted Fields: Campos de cartao renderizados em iframe seguro
- Tokenizacao client-side: SDK JavaScript para tokenizar no navegador
- Network tokens: Tokens emitidos pela bandeira para maior taxa de aprovacao

## Split de Pagamentos
O sistema suporta split de pagamentos para marketplaces:
- Divisao automatica entre seller e marketplace
- Regras flexiveis de split (percentual ou valor fixo)
- Liquidacao independente por participante
- Suporte a MDR diferenciado por seller

## Compliance
A API esta em conformidade com PCI DSS Level 1. Para reducao de escopo PCI, recomendamos o uso de tokenizacao ou Hosted Fields.`;

// ---------------------------------------------------------------------------
// Document type detection and topics extraction
// ---------------------------------------------------------------------------

function detectDocType(
  source: "pdf" | "url",
  name: string,
  url?: string
): { docType: DocumentInfo["docType"]; topics: string[]; pageCount: number } {
  const combined = (name + " " + (url || "")).toLowerCase();

  if (
    combined.includes("regulament") ||
    combined.includes("bcb") ||
    combined.includes("banco central") ||
    combined.includes("resolucao") ||
    combined.includes("circular") ||
    combined.includes("normativ")
  ) {
    return {
      docType: "regulation",
      topics: [
        "Compliance",
        "Requisitos regulatorios",
        "Prazos de adequacao",
        "Penalidades",
        "Arranjos de pagamento",
      ],
      pageCount: Math.floor(Math.random() * 20) + 10,
    };
  }

  if (
    combined.includes("stripe") ||
    combined.includes("adyen") ||
    combined.includes("cielo") ||
    combined.includes("braspag") ||
    combined.includes("pagseguro") ||
    combined.includes("psp") ||
    combined.includes("stone") ||
    combined.includes("mercadopago")
  ) {
    return {
      docType: "psp-doc",
      topics: [
        "Meios de pagamento",
        "Split de pagamentos",
        "Liquidacao",
        "Tokenizacao",
        "Anti-fraude",
        "Webhooks",
      ],
      pageCount: Math.floor(Math.random() * 30) + 15,
    };
  }

  if (
    source === "url" ||
    combined.includes("api") ||
    combined.includes("doc") ||
    combined.includes("sdk") ||
    combined.includes("integracao") ||
    combined.includes("tecnic")
  ) {
    return {
      docType: "tech-doc",
      topics: [
        "Autenticacao",
        "Endpoints de API",
        "Tokenizacao",
        "Webhooks",
        "Codigos de erro",
        "Seguranca",
      ],
      pageCount: Math.floor(Math.random() * 25) + 8,
    };
  }

  return {
    docType: "generic",
    topics: [
      "Pagamentos",
      "Seguranca",
      "Compliance",
      "Arquitetura",
      "Metricas",
    ],
    pageCount: Math.floor(Math.random() * 15) + 5,
  };
}

const SUGGESTED_BY_TYPE: Record<DocumentInfo["docType"], string[]> = {
  regulation: [
    "Quais sao os requisitos principais?",
    "Quais sao as penalidades?",
    "Qual o prazo de adequacao?",
    "Quais instituicoes sao afetadas?",
  ],
  "tech-doc": [
    "Como funciona a autenticacao?",
    "Quais sao os endpoints principais?",
    "Como e a tokenizacao?",
    "Quais sao os codigos de erro?",
  ],
  "psp-doc": [
    "Quais meios de pagamento sao suportados?",
    "Como funciona o split?",
    "Qual o prazo de liquidacao?",
    "Como e a tokenizacao nesse PSP?",
  ],
  generic: [
    "Resuma o documento",
    "Quais sao os requisitos principais?",
    "Como funciona a tokenizacao nesse contexto?",
    "Quais sao as regras de compliance?",
  ],
};

const DOC_TYPE_LABELS: Record<DocumentInfo["docType"], string> = {
  regulation: "Regulamentacao",
  "tech-doc": "Documentacao Tecnica",
  "psp-doc": "Documentacao de PSP",
  generic: "Documento geral",
};

const RELATED_PAGES: {
  label: string;
  desc: string;
  href: string;
  icon: string;
}[] = [
  {
    label: "Consultor de Pagamentos",
    desc: "IA especializada em pagamentos",
    href: "/ai/payments-advisor",
    icon: "AI",
  },
  {
    label: "Glossario",
    desc: "Termos e definicoes do setor",
    href: "/glossary",
    icon: "Aa",
  },
  {
    label: "Mapa de Pagamentos",
    desc: "Arquitetura visual do sistema",
    href: "/explore/payments-map",
    icon: "MR",
  },
];

// ---------------------------------------------------------------------------
// Document-based answer logic
// ---------------------------------------------------------------------------

function searchDocument(query: string, documentText: string): string {
  const queryWords = query
    .toLowerCase()
    .replace(/[?!.,;]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const sections = documentText
    .split(/\n## /)
    .map((s, i) => (i === 0 ? s : "## " + s));

  const scored = sections.map((section) => {
    const sectionLower = section.toLowerCase();
    let score = 0;
    for (const word of queryWords) {
      const regex = new RegExp(word, "gi");
      const matches = sectionLower.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    return { section, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const relevantSections = scored.filter((s) => s.score > 0).slice(0, 3);

  if (relevantSections.length === 0) {
    return `Nao encontrei informacoes especificas sobre isso no documento. Tente reformular sua pergunta usando termos diferentes.

**Dicas:**
- Use palavras-chave presentes no documento
- Tente perguntas mais especificas
- Pergunte sobre secoes ou topicos do documento`;
  }

  let response = `Com base no documento, encontrei as seguintes informacoes relevantes:\n\n`;

  for (const { section } of relevantSections) {
    const lines = section.split("\n").filter((l) => l.trim());
    const title = lines[0]?.replace(/^#+\s*/, "").trim();
    const content = lines.slice(1).join("\n").trim();

    if (title) {
      response += `**${title}**\n`;
    }
    if (content) {
      const trimmed =
        content.length > 600
          ? content.substring(0, 600) + "..."
          : content;
      response += `${trimmed}\n\n`;
    }
  }

  return response.trim();
}

function generateSummary(documentText: string): string {
  const sections = documentText
    .split(/\n## /)
    .map((s, i) => (i === 0 ? s : "## " + s));
  const titles = sections
    .map((s) => {
      const firstLine = s.split("\n")[0]?.replace(/^#+\s*/, "").trim();
      return firstLine;
    })
    .filter(Boolean);

  return `**Resumo do Documento**

O documento contem ${sections.length} secoes principais:

${titles.map((t, i) => `${i + 1}. **${t}**`).join("\n")}

O documento aborda temas relacionados a sistemas de pagamentos, incluindo aspectos tecnicos, de seguranca e compliance. Para informacoes detalhadas sobre qualquer secao, pergunte especificamente sobre o topico desejado.`;
}

function findDocumentAnswer(query: string, doc: DocumentInfo): string {
  const q = query.toLowerCase();

  if (
    q.includes("resum") ||
    q.includes("visao geral") ||
    q.includes("sobre o que")
  ) {
    return generateSummary(doc.extractedText);
  }

  if (q.includes("requisit") || q.includes("requer")) {
    const result = searchDocument(
      "requisitos compliance seguranca PCI",
      doc.extractedText
    );
    if (!result.includes("Nao encontrei")) return result;
  }

  if (q.includes("tokeniza") || q.includes("token")) {
    const result = searchDocument(
      "tokenizacao token PAN network hosted fields",
      doc.extractedText
    );
    if (!result.includes("Nao encontrei")) return result;
  }

  if (
    q.includes("compliance") ||
    q.includes("regulament") ||
    q.includes("regra")
  ) {
    const result = searchDocument(
      "compliance regulamentacao PCI LGPD PSD2",
      doc.extractedText
    );
    if (!result.includes("Nao encontrei")) return result;
  }

  if (q.includes("autentic") || q.includes("3ds") || q.includes("sca")) {
    const result = searchDocument(
      "autenticacao 3DS SCA bearer token API key",
      doc.extractedText
    );
    if (!result.includes("Nao encontrei")) return result;
  }

  if (q.includes("liquidac") || q.includes("settlement") || q.includes("reconcilia")) {
    const result = searchDocument(
      "liquidacao settlement reconciliacao prazo",
      doc.extractedText
    );
    if (!result.includes("Nao encontrei")) return result;
  }

  if (q.includes("fraud") || q.includes("anti-fraud") || q.includes("risco")) {
    const result = searchDocument(
      "fraude anti-fraude risco chargeback",
      doc.extractedText
    );
    if (!result.includes("Nao encontrei")) return result;
  }

  if (q.includes("api") || q.includes("endpoint") || q.includes("integra")) {
    const result = searchDocument(
      "API endpoint REST integracao POST GET",
      doc.extractedText
    );
    if (!result.includes("Nao encontrei")) return result;
  }

  if (q.includes("split") || q.includes("marketplace") || q.includes("seller")) {
    const result = searchDocument(
      "split marketplace seller divisao pagamento",
      doc.extractedText
    );
    if (!result.includes("Nao encontrei")) return result;
  }

  if (q.includes("webhook") || q.includes("notifica") || q.includes("evento")) {
    const result = searchDocument(
      "webhook notificacao evento callback",
      doc.extractedText
    );
    if (!result.includes("Nao encontrei")) return result;
  }

  if (q.includes("penalidad") || q.includes("multa") || q.includes("sancao")) {
    return `Com base no documento, as penalidades e sancoes identificadas incluem:

**Programas de Monitoramento das Bandeiras:**
- Taxa de chargeback acima de 0.65% (Visa) ou 1.0% (Mastercard) pode resultar em multas progressivas
- Multas podem chegar a USD 100.000/mes em casos graves

**Penalidades Regulatorias:**
- Descumprimento do PCI DSS pode resultar em multas de USD 5.000 a USD 100.000 por mes
- Violacoes de LGPD podem gerar multas de ate 2% do faturamento (limitado a R$ 50 milhoes por infracao)

Para detalhes especificos das penalidades mencionadas no documento, pergunte sobre uma regulamentacao especifica.`;
  }

  if (q.includes("prazo") || q.includes("adequac") || q.includes("deadline")) {
    return `Com base no documento, os seguintes prazos sao relevantes:

**Prazos de Adequacao Regulatoria:**
- PCI DSS v4.0: Adequacao completa ate marco 2025
- Regulamentacoes do Banco Central: Variam conforme a circular especifica

**Prazos Operacionais:**
- Liquidacao: D+1 a D+30 dependendo do arranjo de pagamento
- Contestacao de chargebacks: 7 a 45 dias conforme a bandeira
- RTO (Recovery Time Objective): 15 minutos para DR

Consulte o documento para prazos especificos da regulamentacao analisada.`;
  }

  if (q.includes("meio") || q.includes("pagamento") || q.includes("metodo")) {
    const result = searchDocument(
      "metodos pagamento cartao pix boleto wallet",
      doc.extractedText
    );
    if (!result.includes("Nao encontrei")) return result;
  }

  return searchDocument(query, doc.extractedText);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let messageCounter = 0;
function generateId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

// ---------------------------------------------------------------------------
// Markdown renderer
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table detection
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|[-\s|:]+\|\s*$/.test(lines[i + 1])
    ) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headerCells = tableLines[0]
        .split("|")
        .filter(Boolean)
        .map((c) => c.trim());
      const bodyRows = tableLines.slice(2);
      elements.push(
        <div key={`tbl-${i}`} style={{ overflowX: "auto", margin: "8px 0" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
            <thead>
              <tr>
                {headerCells.map((cell, ci) => (
                  <th
                    key={ci}
                    style={{
                      textAlign: "left",
                      fontWeight: 600,
                      border: "1px solid var(--border)",
                      padding: "4px 8px",
                      background: "var(--surface)",
                    }}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => {
                const cells = row
                  .split("|")
                  .filter(Boolean)
                  .map((c) => c.trim());
                return (
                  <tr key={ri}>
                    {cells.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          border: "1px solid var(--border)",
                          padding: "4px 8px",
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Code block detection
    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre
          key={`code-${i}`}
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 12,
            margin: "8px 0",
            overflowX: "auto",
            fontSize: 12,
            fontFamily: "monospace",
            lineHeight: 1.5,
          }}
        >
          {codeLines.join("\n")}
        </pre>
      );
      continue;
    }

    if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 8 }} />);
      i++;
      continue;
    }

    // Numbered list item
    if (/^\d+\.\s/.test(line.trim())) {
      elements.push(
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            margin: "2px 0 2px 8px",
          }}
        >
          <span style={{ color: "var(--text-secondary)", flexShrink: 0 }}>
            {line.trim().match(/^(\d+\.)/)?.[1]}
          </span>
          <span>{renderInline(line.trim().replace(/^\d+\.\s*/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Bullet list item
    if (/^[-*]\s/.test(line.trim())) {
      elements.push(
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            margin: "2px 0 2px 16px",
          }}
        >
          <span
            style={{
              marginTop: 6,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--text-secondary)",
              flexShrink: 0,
            }}
          />
          <span>{renderInline(line.trim().replace(/^[-*]\s*/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    elements.push(
      <p key={i} style={{ margin: "2px 0" }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  // Bold + inline code
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          style={{
            background: "var(--border)",
            padding: "1px 5px",
            borderRadius: 4,
            fontSize: "0.9em",
            fontFamily: "monospace",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DocumentAnalyzerPage() {
  const [activeTab, setActiveTab] = useState<"pdf" | "url">("pdf");
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [rateLimitToast, setRateLimitToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Focus input when document loads
  useEffect(() => {
    if (document) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [document]);

  // ---- Document loading handlers ----

  const loadDocument = useCallback(
    (
      name: string,
      source: "pdf" | "url",
      size?: string,
      url?: string
    ) => {
      const { docType, topics, pageCount } = detectDocType(source, name, url);
      const doc: DocumentInfo = {
        name,
        source,
        size,
        url,
        pageCount,
        docType,
        topics,
        extractedText:
          source === "pdf" ? SIMULATED_PDF_TEXT : SIMULATED_URL_TEXT,
        loadedAt: new Date(),
      };
      setDocument(doc);
      setIsLoadingDoc(false);
      setMessages([]);
    },
    []
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsLoadingDoc(true);
      setMessages([]);
      const sizeKB = (file.size / 1024).toFixed(1);
      setTimeout(() => {
        loadDocument(file.name, "pdf", `${sizeKB} KB`);
      }, 1500);
    },
    [loadDocument]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (!file || !file.name.toLowerCase().endsWith(".pdf")) return;
      setIsLoadingDoc(true);
      setMessages([]);
      const sizeKB = (file.size / 1024).toFixed(1);
      setTimeout(() => {
        loadDocument(file.name, "pdf", `${sizeKB} KB`);
      }, 1500);
    },
    [loadDocument]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleUrlLoad = useCallback(() => {
    if (!urlInput.trim()) return;
    setIsLoadingDoc(true);
    setMessages([]);
    setTimeout(() => {
      const hostname =
        urlInput.replace(/^https?:\/\//, "").split("/")[0] || "Documento";
      loadDocument(hostname, "url", undefined, urlInput.trim());
      setUrlInput("");
    }, 2000);
  }, [urlInput, loadDocument]);

  // ---- Chat handlers ----

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping || !document) return;

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
          body: JSON.stringify({
            message: text.trim(),
            mode: "document",
            documentText: document.extractedText,
            documentName: document.name,
          }),
        });

        // Fallback to keyword-based if API not configured
        if (response.status === 503) {
          setIsFallbackMode(true);
          const answer = findDocumentAnswer(text, document);
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
        const answer = findDocumentAnswer(text, document);
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
    [isTyping, document]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleRemoveDocument = () => {
    setDocument(null);
    setMessages([]);
    setShowSidebar(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const suggestedQuestions = document
    ? SUGGESTED_BY_TYPE[document.docType]
    : SUGGESTED_BY_TYPE.generic;

  // ---- Render ----

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 48px)",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 20, flexShrink: 0, padding: "0 4px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <Link
            href="/"
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Inicio
          </Link>
          <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
            /
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Ferramentas
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
            /
          </span>
          <span
            style={{ color: "var(--text)", fontSize: 14, fontWeight: 500 }}
          >
            Analisador de Documentos
          </span>
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 8,
          }}
        >
          Analisador de Documentos
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          Faca upload de regulacoes ou documentacoes tecnicas e use IA para
          entender o conteudo
        </p>
      </div>

      {/* Document upload area */}
      {!document && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 24,
            marginBottom: 20,
            flexShrink: 0,
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginBottom: 20,
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid var(--border)",
              width: "fit-content",
            }}
          >
            {(["pdf", "url"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 24px",
                  fontSize: 14,
                  fontWeight: 500,
                  border: "none",
                  borderLeft:
                    tab === "url" ? "1px solid var(--border)" : "none",
                  cursor: "pointer",
                  background:
                    activeTab === tab ? "var(--primary)" : "transparent",
                  color:
                    activeTab === tab ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.2s",
                }}
              >
                {tab === "pdf" ? "Upload PDF" : "Colar URL"}
              </button>
            ))}
          </div>

          {/* PDF upload with drag & drop */}
          {activeTab === "pdf" && (
            <div
              onClick={() => !isLoadingDoc && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                border: `2px dashed ${isDragOver ? "var(--primary)" : "var(--border)"}`,
                borderRadius: 12,
                padding: "48px 20px",
                textAlign: "center",
                cursor: isLoadingDoc ? "default" : "pointer",
                transition: "all 0.2s",
                background: isDragOver
                  ? "rgba(99,102,241,0.06)"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isDragOver && !isLoadingDoc) {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--primary)";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(99,102,241,0.03)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isDragOver) {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />

              {/* Upload icon */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: isDragOver
                    ? "var(--primary)"
                    : "var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  transition: "all 0.2s",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isDragOver ? "#fff" : "var(--text-secondary)"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              {isLoadingDoc ? (
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text)",
                      marginBottom: 8,
                    }}
                  >
                    Extraindo texto do documento...
                  </div>
                  <div
                    style={{
                      width: 200,
                      height: 4,
                      background: "var(--border)",
                      borderRadius: 2,
                      margin: "0 auto",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "60%",
                        height: "100%",
                        background: "var(--primary)",
                        borderRadius: 2,
                        animation: "pulse 1.5s infinite",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--text)",
                      marginBottom: 6,
                    }}
                  >
                    {isDragOver
                      ? "Solte o arquivo aqui"
                      : "Clique para selecionar um arquivo PDF"}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                    }}
                  >
                    ou arraste e solte aqui
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      marginTop: 8,
                      opacity: 0.7,
                    }}
                  >
                    Aceita arquivos .pdf
                  </div>
                </div>
              )}
            </div>
          )}

          {/* URL input */}
          {activeTab === "url" && (
            <div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://docs.stripe.com/payments/accept-a-payment"
                  disabled={isLoadingDoc}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUrlLoad();
                  }}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--text)",
                    fontSize: 14,
                    outline: "none",
                    opacity: isLoadingDoc ? 0.5 : 1,
                  }}
                />
                <button
                  onClick={handleUrlLoad}
                  disabled={!urlInput.trim() || isLoadingDoc}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 8,
                    border: "none",
                    background:
                      !urlInput.trim() || isLoadingDoc
                        ? "var(--border)"
                        : "var(--primary)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor:
                      !urlInput.trim() || isLoadingDoc
                        ? "not-allowed"
                        : "pointer",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {isLoadingDoc ? "Carregando..." : "Carregar"}
                </button>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginTop: 10,
                  lineHeight: 1.5,
                }}
              >
                Cole o link de uma documentacao tecnica, regulamentacao do Banco
                Central, ou especificacao de API de um PSP.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 12,
                }}
              >
                {[
                  "docs.stripe.com",
                  "docs.adyen.com",
                  "bcb.gov.br",
                  "developers.cielo.com.br",
                ].map((ex) => (
                  <span
                    key={ex}
                    onClick={() => setUrlInput(`https://${ex}`)}
                    style={{
                      fontSize: 11,
                      padding: "4px 10px",
                      borderRadius: 9999,
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--primary)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--border)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--text-secondary)";
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main content area with sidebar */}
      {document && (
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 16,
            minHeight: 0,
            flexShrink: 1,
          }}
        >
          {/* Left: chat area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {/* Document info card */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 14,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#22c55e",
                    flexShrink: 0,
                    boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>
                      {document.source === "pdf" ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      )}
                    </span>
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {document.name}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      marginTop: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>
                      {DOC_TYPE_LABELS[document.docType]} -{" "}
                      {document.pageCount} paginas detectadas
                    </span>
                    <span style={{ opacity: 0.4 }}>|</span>
                    <span>
                      Carregado as{" "}
                      {document.loadedAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {/* Toggle sidebar button (visible on smaller widths) */}
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    background: showSidebar
                      ? "var(--primary)"
                      : "transparent",
                    color: showSidebar ? "#fff" : "var(--text-secondary)",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "none",
                  }}
                  className="sidebar-toggle"
                >
                  Info
                </button>
                <button
                  onClick={handleRemoveDocument}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#ef4444";
                    (e.currentTarget as HTMLElement).style.color = "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--border)";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--text-secondary)";
                  }}
                >
                  Limpar documento
                </button>
              </div>
            </div>

            {/* Rate limit toast */}
            {rateLimitToast && (
              <div
                style={{
                  padding: "10px 16px",
                  marginBottom: 8,
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
                  marginBottom: 8,
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

            {/* Chat container */}
            <div
              style={{
                flex: 1,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                minHeight: 400,
              }}
            >
              {/* Messages list */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* Empty state: document loaded but no messages */}
                  {messages.length === 0 && !isTyping && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        minHeight: 280,
                        padding: "40px 20px",
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 14,
                          background: "var(--primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          color: "#fff",
                          marginBottom: 16,
                          fontWeight: 700,
                        }}
                      >
                        IA
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "#22c55e",
                          marginBottom: 8,
                        }}
                      >
                        Documento carregado com sucesso
                      </div>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "var(--text)",
                          marginBottom: 6,
                        }}
                      >
                        Pronto para analisar
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          maxWidth: 400,
                          lineHeight: 1.5,
                          marginBottom: 24,
                        }}
                      >
                        Faca perguntas sobre o conteudo do documento. A IA ira
                        buscar as informacoes relevantes e responder com base no
                        texto extraido.
                      </p>

                      {/* Suggested questions grid */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: 8,
                          width: "100%",
                          maxWidth: 500,
                        }}
                      >
                        {suggestedQuestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            style={{
                              padding: "12px 16px",
                              borderRadius: 10,
                              border: "1px solid var(--border)",
                              background: "transparent",
                              cursor: "pointer",
                              color: "var(--text)",
                              fontSize: 13,
                              textAlign: "left",
                              transition: "all 0.2s",
                              lineHeight: 1.4,
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.borderColor = "var(--primary)";
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = "rgba(99,102,241,0.05)";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.borderColor = "var(--border)";
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = "transparent";
                            }}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chat messages */}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent:
                          msg.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "85%",
                          borderRadius: 16,
                          padding: "12px 16px",
                          ...(msg.role === "user"
                            ? {
                                background: "var(--primary)",
                                color: "#fff",
                                borderBottomRightRadius: 6,
                              }
                            : {
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                                borderBottomLeftRadius: 6,
                              }),
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            marginBottom: 4,
                            color:
                              msg.role === "user"
                                ? "rgba(255,255,255,0.7)"
                                : "var(--text-secondary)",
                          }}
                        >
                          {msg.role === "user"
                            ? "Voce"
                            : "Analisador de Documentos"}
                        </div>
                        <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                          {msg.role === "assistant"
                            ? renderMarkdown(msg.content)
                            : msg.content}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            marginTop: 8,
                            color:
                              msg.role === "user"
                                ? "rgba(255,255,255,0.5)"
                                : "var(--text-secondary)",
                          }}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: 16,
                          borderBottomLeftRadius: 6,
                          padding: "12px 16px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            marginBottom: 6,
                            color: "var(--text-secondary)",
                          }}
                        >
                          Analisador de Documentos
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          {[0, 150, 300].map((delay) => (
                            <span
                              key={delay}
                              style={{
                                width: 8,
                                height: 8,
                                background: "var(--text-secondary)",
                                borderRadius: "50%",
                                opacity: 0.6,
                                animation: "docBounce 1.4s infinite",
                                animationDelay: `${delay}ms`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Suggested question pills when conversation is active */}
              {messages.length > 0 && !isTyping && (
                <div
                  style={{
                    display: "flex",
                    overflowX: "auto",
                    padding: "0 16px 8px 16px",
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  {suggestedQuestions
                    .filter(
                      (q) =>
                        !messages.some(
                          (m) => m.role === "user" && m.content === q
                        )
                    )
                    .slice(0, 3)
                    .map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 9999,
                          border: "1px solid var(--border)",
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--text-secondary)",
                          fontSize: 12,
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor =
                            "var(--primary)";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--primary)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor =
                            "var(--border)";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--text-secondary)";
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderTop: "1px solid var(--border)",
                  padding: 12,
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Faca uma pergunta sobre o documento..."
                  disabled={isTyping}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    outline: "none",
                    color: "var(--text)",
                    fontSize: 14,
                    opacity: isTyping ? 0.5 : 1,
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    background:
                      !input.trim() || isTyping
                        ? "var(--border)"
                        : "var(--primary)",
                    color: "#fff",
                    cursor:
                      !input.trim() || isTyping
                        ? "not-allowed"
                        : "pointer",
                    opacity: !input.trim() || isTyping ? 0.5 : 1,
                    fontSize: 14,
                    fontWeight: 500,
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>

          {/* Right sidebar: Document Info */}
          <div
            className="doc-sidebar"
            style={{
              width: 260,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              overflowY: "auto",
            }}
          >
            {/* Document type */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  color: "var(--text-secondary)",
                  marginBottom: 10,
                }}
              >
                Tipo de documento
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      document.docType === "regulation"
                        ? "#f59e0b"
                        : document.docType === "tech-doc"
                          ? "#3b82f6"
                          : document.docType === "psp-doc"
                            ? "#8b5cf6"
                            : "#6b7280",
                  }}
                />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {DOC_TYPE_LABELS[document.docType]}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                }}
              >
                {document.source === "pdf"
                  ? `${document.name} (${document.size})`
                  : document.url}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginTop: 4,
                }}
              >
                {document.pageCount} paginas detectadas
              </div>
            </div>

            {/* Key topics */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  color: "var(--text-secondary)",
                  marginBottom: 10,
                }}
              >
                Topicos identificados
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {document.topics.map((topic) => (
                  <span
                    key={topic}
                    style={{
                      fontSize: 11,
                      padding: "4px 10px",
                      borderRadius: 9999,
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Related pages */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  color: "var(--text-secondary)",
                  marginBottom: 10,
                }}
              >
                Paginas relacionadas
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {RELATED_PAGES.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      textDecoration: "none",
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--border)";
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: "var(--background)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--text-secondary)",
                        flexShrink: 0,
                      }}
                    >
                      {page.icon}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {page.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {page.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                padding: "8px 4px",
                fontStyle: "italic",
                opacity: 0.7,
              }}
            >
              * Texto extraido via simulacao. Em producao, o conteudo seria
              analisado por IA com base no documento real.
            </div>
          </div>
        </div>
      )}

      {/* Empty state: no document loaded - show chat area placeholder */}
      {!document && (
        <div
          style={{
            flex: 1,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "40px 20px",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-secondary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: 6,
              }}
            >
              Nenhum documento carregado
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                maxWidth: 400,
                lineHeight: 1.5,
              }}
            >
              Faca upload de um PDF ou cole o link de uma documentacao tecnica
              para comecar a analisar e fazer perguntas sobre o conteudo.
            </p>
          </div>
          {/* Disabled input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid var(--border)",
              padding: 12,
              gap: 8,
              flexShrink: 0,
            }}
          >
            <input
              type="text"
              disabled
              placeholder="Carregue um documento primeiro..."
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--background)",
                outline: "none",
                color: "var(--text)",
                fontSize: 14,
                opacity: 0.5,
              }}
            />
            <button
              disabled
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                background: "var(--border)",
                color: "#fff",
                cursor: "not-allowed",
                opacity: 0.5,
                fontSize: 14,
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* Footer related pages (only when no document) */}
      {!document && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              marginTop: 20,
              marginBottom: 8,
              flexShrink: 0,
            }}
          >
            <span
              style={{ fontSize: 12, color: "var(--text-secondary)" }}
            >
              Paginas relacionadas:
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
              marginBottom: 32,
              flexShrink: 0,
            }}
          >
            {RELATED_PAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                style={{
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textDecoration: "none",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "var(--background)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  {p.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    {p.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {p.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Mobile sidebar overlay */}
      {document && showSidebar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            display: "none",
          }}
          className="sidebar-overlay"
          onClick={() => setShowSidebar(false)}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: 300,
              background: "var(--background)",
              overflowY: "auto",
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                Informacoes do Documento
              </span>
              <button
                onClick={() => setShowSidebar(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 20,
                  padding: "4px 8px",
                }}
              >
                x
              </button>
            </div>
            {/* Repeat sidebar content for mobile overlay */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    color: "var(--text-secondary)",
                    marginBottom: 10,
                  }}
                >
                  Tipo de documento
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  {DOC_TYPE_LABELS[document.docType]}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                  }}
                >
                  {document.pageCount} paginas detectadas
                </div>
              </div>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    color: "var(--text-secondary)",
                    marginBottom: 10,
                  }}
                >
                  Topicos identificados
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {document.topics.map((topic) => (
                    <span
                      key={topic}
                      style={{
                        fontSize: 11,
                        padding: "4px 10px",
                        borderRadius: 9999,
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    color: "var(--text-secondary)",
                    marginBottom: 10,
                  }}
                >
                  Paginas relacionadas
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {RELATED_PAGES.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        textDecoration: "none",
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        transition: "all 0.15s",
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: "var(--background)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--text-secondary)",
                          flexShrink: 0,
                        }}
                      >
                        {page.icon}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--text)",
                          }}
                        >
                          {page.label}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-secondary)",
                          }}
                        >
                          {page.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes + responsive styles */}
      <style>{`
        @keyframes docBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Desktop: sidebar visible */
        @media (min-width: 900px) {
          .doc-sidebar { display: flex !important; }
          .sidebar-toggle { display: none !important; }
          .sidebar-overlay { display: none !important; }
        }

        /* Tablet/mobile: sidebar hidden, toggle visible */
        @media (max-width: 899px) {
          .doc-sidebar { display: none !important; }
          .sidebar-toggle { display: inline-flex !important; }
          .sidebar-overlay { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
