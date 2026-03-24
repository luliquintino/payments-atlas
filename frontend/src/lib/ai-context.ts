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

  // Glossary: ALL, term + definition (first 100 chars)
  const glossaryContext = GLOSSARY_TERMS
    .map((t) => {
      const shortDef = t.definition.length > 100
        ? t.definition.slice(0, 100) + "…"
        : t.definition;
      return `- ${t.term}: ${shortDef}`;
    })
    .join("\n");

  // Business rules: first 30, name + description (condition + expected_behavior)
  const rulesContext = RULES.slice(0, 30)
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

## Páginas Especializadas Disponíveis
- Antecipação de Recebíveis: Mesa de antecipação, registradoras, cálculo de deságio
- Parcelamento: Parcelado emissor vs lojista, impacto no interchange e chargeback
- Crédito Estruturado: SCD, FIDC, cessão de créditos, securitização
- Chargeback Deep Dive: Reason codes, defesa por cenário, programas de monitoramento
- PCI Compliance: SAQ selection matrix, v4.0.1 mudanças, preparação de auditoria
- Cross-Border: Correspondent banking, FX hedging, estratégias de local acquiring
- PayFac Architecture: Sub-merchant onboarding, split engine, regulação brasileira
- Regulatory Matrix: Comparação Brasil/Europa/EUA, LGPD vs GDPR
- Advanced Fraud ML: Graph analysis, behavioral biometrics, multi-signal scoring
- Settlement & Clearing: RTGS, DNS, ACH, PIX SPI, clearing de cartões
- Crypto Avançado: Layer 2, bridges, CBDC/Drex, stablecoin risk
- Operational Excellence: DR, chaos engineering, incident response, observability

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
