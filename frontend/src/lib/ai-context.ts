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
  // Features: first 40, name + description + business rules
  const featuresContext = FEATURES_REGISTRY.slice(0, 40)
    .map((f) => {
      let entry = `- ${f.name}: ${f.description}`;
      if (f.businessRules && f.businessRules.length > 0) {
        entry += ` | Regras: ${f.businessRules.join("; ")}`;
      }
      return entry;
    })
    .join("\n");

  // Glossary: first 60, term + definition
  const glossaryContext = GLOSSARY_TERMS.slice(0, 60)
    .map((t) => `- ${t.term}: ${t.definition}`)
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

Use this knowledge to provide accurate, detailed answers about payment systems, features, architecture, compliance, and best practices. When relevant, reference specific features, terms, or rules from the knowledge base. Format your answers with markdown (bold, lists, tables) for readability.`;
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
