/**
 * AI Context Builder
 *
 * Builds system prompts for the Claude API by combining knowledge from
 * the Payments Academy data sources (features, glossary, business rules).
 */

import { FEATURES_REGISTRY } from "@/data/features";
import { GLOSSARY_TERMS } from "@/data/glossary";
import { RULES } from "@/data/business-rules";

// ---------------------------------------------------------------------------
// Knowledge-based context (Consultor de Pagamentos)
// ---------------------------------------------------------------------------

export function buildKnowledgeContext(): string {
  // Features: ALL, name + short description (first 80 chars)
  const featuresContext = FEATURES_REGISTRY
    .map((f) => {
      const shortDesc = f.description.length > 80
        ? f.description.slice(0, 80) + "…"
        : f.description;
      return `- ${f.name}: ${shortDesc}`;
    })
    .join("\n");

  // Glossary: ALL, term + definition (first 80 chars)
  const glossaryContext = GLOSSARY_TERMS
    .map((t) => {
      const shortDef = t.definition.length > 80
        ? t.definition.slice(0, 80) + "…"
        : t.definition;
      return `- ${t.term}: ${shortDef}`;
    })
    .join("\n");

  // Business rules: ALL, name + condition + expected_behavior
  const rulesContext = RULES
    .map((r) => `- ${r.rule_name}: ${r.condition}. ${r.expected_behavior}`)
    .join("\n");

  return `You are an expert payments consultant for the Payments Academy platform. Answer in Portuguese (Brazil). Be detailed and educational.

You have access to the following knowledge base:

## Features de Pagamento
${featuresContext}

## Glossário de Pagamentos
${glossaryContext}

## Regras de Negócio
${rulesContext}

## Programas de Monitoramento de Bandeiras
- Visa VDMP: chargeback rate > 0.9% + 100 disputes/mês → multas $50-$25K/mês
- Mastercard ECM: > 1.0% + 100 chargebacks (alerta). ECP: > 1.5% + 100 (penalidade)
- PCI DSS v4.0.1: enforcement completo desde março 2025

## Páginas Especializadas Disponíveis (49 deep dives)
- Advanced Fraud ML: Graph analysis, behavioral biometrics, multi-signal scoring
- Antecipação de Recebíveis: Mesa de antecipação, registradoras, deságio
- API Design: REST/gRPC patterns, idempotency, versionamento
- Brand Rules: Programas Visa/Mastercard, compliance de bandeira
- Business Rules: Validação, roteamento, risco, compliance, operacional
- Card Present / POS: EMV chip, contactless, PIN management
- Chargeback Deep Dive: Reason codes, defesa, monitoramento
- Consórcio & Factoring: Grupos, contemplação, cessão de crédito
- Credit API Payloads: Exemplos de payload para operações de crédito
- Credit Operations: Hub de operações de crédito estruturado
- Crédito Estruturado: SCD, FIDC, cessão, securitização
- Cross-Border: Correspondent banking, FX hedging, local acquiring
- Dependency Graph: Grafo de dependências entre features
- Embedded Finance: BaaS, white-label, embedded lending
- Emerging Payments: BNPL, A2A, request-to-pay, super apps
- Error Codes: Catálogo de códigos de erro de pagamento
- Event Architecture: Event sourcing, CQRS, async messaging
- Feature Discovery: Explorador interativo de todas as features
- Features: Catálogo completo de features de pagamento
- Go-to-Market: Estratégia comercial, pricing, sales enablement
- HSM & Cryptography: Hardware security modules, key management
- Installments: Parcelado emissor vs lojista, interchange, MDR
- Insurtech: Seguros digitais, embedded insurance, sinistros
- ISO 20022 & SWIFT: Mensageria financeira, migração ISO 20022
- Legacy Migration: Estratégias de modernização, strangler fig
- LGPD Payments: Proteção de dados em pagamentos, consentimento
- Merchant Segmentation: Classificação de merchants, MCC, risco
- Multi-Acquirer: Roteamento inteligente, failover, custo
- Open Finance: APIs abertas, compartilhamento de dados, OPIN
- Operational Excellence: DR, chaos engineering, observability
- Parcelamento: Modelos de parcelamento, impacto financeiro
- PayFac Architecture: Sub-merchant onboarding, split engine
- Payloads: Exemplos de payloads de APIs de pagamento
- Payment Methods BR: PIX, boleto, cartão, débito automático
- PCI Compliance: SAQ matrix, v4.0.1, auditoria
- PIX Advanced: PIX QR, Copia e Cola, Automático, Garantido
- PLD/FT: Prevenção à lavagem, KYC, compliance AML
- PSP Deep Dives: Adyen, Stripe, dLocal — comparativo técnico
- Reconciliation Deep: Conciliação financeira, batimento
- Regulatory Matrix: Comparação Brasil/Europa/EUA regulatória
- Settlement & Clearing: RTGS, DNS, ACH, PIX SPI, clearing
- Subscription Lifecycle: Recorrência, retry, dunning, churn
- Taxonomy: Taxonomia e classificação de features
- Team & Career: Estrutura de times de pagamentos, trilhas
- Testing Payments: Estratégias de teste, sandbox, simulação
- Treasury & Float: Gestão de caixa, float, investimento
- Unit Economics: Métricas financeiras, take rate, LTV/CAC
- Vendor Selection: Avaliação de fornecedores, RFP, scoring
- Webhook Patterns: Delivery, retry, idempotência, segurança

Use this knowledge to provide accurate, detailed answers about payment systems, features, architecture, compliance, and best practices. When relevant, reference specific features, terms, or rules from the knowledge base. Format your answers with markdown (bold, lists, tables) for readability.

Conhecimento atualizado até Q1 2025. Inclui mandatos 2025 de Visa VTS, Mastercard MDES, PCI DSS v4.0.1, Pix Automático e Drex.`;
}

// ---------------------------------------------------------------------------
// Document-based context (Analisador de Documentos)
// ---------------------------------------------------------------------------

const MAX_DOCUMENT_LENGTH = 30000;

export function buildDocumentContext(
  docText: string,
  docName: string
): string {
  const truncatedText =
    docText.length > MAX_DOCUMENT_LENGTH
      ? docText.slice(0, MAX_DOCUMENT_LENGTH) + "\n\n[... documento truncado ...]"
      : docText;

  return `You are analyzing the document "${docName}". Answer based ONLY on the document content. Answer in Portuguese (Brazil).

## Document Content
${truncatedText}

Instructions:
- Answer questions ONLY based on the document content above.
- If the information is not in the document, say so clearly.
- Use markdown formatting (bold, lists, tables) for readability.
- Be detailed and educational in your explanations.
- When quoting from the document, use bold to highlight key terms.`;
}
