/**
 * Search Index — Unified search across all data sources.
 *
 * Aggregates features, glossary terms, business rules, rails, ecosystem players,
 * and page navigation into a single searchable index.
 */

import { FEATURES_REGISTRY as FEATURES } from "@/data/features";
import { GLOSSARY_TERMS } from "@/data/glossary";
import { RULES } from "@/data/business-rules";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SearchResultType =
  | "feature"
  | "glossary"
  | "rule"
  | "page"
  | "problem"
  | "rail"
  | "flow"
  | "metric";

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  type: SearchResultType;
  category?: string;
  href: string;
  aliases?: string[];
}

// ---------------------------------------------------------------------------
// Type metadata
// ---------------------------------------------------------------------------

export const TYPE_LABELS: Record<SearchResultType, string> = {
  feature: "Feature",
  glossary: "Glossário",
  rule: "Regra",
  page: "Página",
  problem: "Problema",
  rail: "Trilho",
  flow: "Fluxo",
  metric: "Métrica",
};

export const TYPE_ICONS: Record<SearchResultType, string> = {
  feature: "📦",
  glossary: "📖",
  rule: "📋",
  page: "📄",
  problem: "⚠️",
  rail: "🛤️",
  flow: "🔄",
  metric: "📊",
};

export const TYPE_COLORS: Record<SearchResultType, { background: string; color: string }> = {
  feature: { background: "rgba(59,130,246,0.12)", color: "var(--primary-light)" },
  glossary: { background: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  rule: { background: "rgba(14,165,233,0.1)", color: "#0ea5e9" },
  page: { background: "rgba(16,185,129,0.1)", color: "#10b981" },
  problem: { background: "rgba(220,38,38,0.1)", color: "#dc2626" },
  rail: { background: "rgba(6,182,212,0.1)", color: "#06b6d4" },
  flow: { background: "rgba(245,158,11,0.1)", color: "#d97706" },
  metric: { background: "rgba(245,158,11,0.1)", color: "#d97706" },
};

// ---------------------------------------------------------------------------
// Build index
// ---------------------------------------------------------------------------

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  // Features
  FEATURES.forEach((f) => {
    results.push({
      id: `feature-${f.id}`,
      name: f.name,
      description: f.description,
      type: "feature",
      category: f.category,
      href: `/knowledge/features/${f.id}`,
      aliases: f.aliases,
    });
  });

  // Glossary terms
  GLOSSARY_TERMS.forEach((t) => {
    results.push({
      id: `glossary-${t.id}`,
      name: t.term,
      description: t.definition,
      type: "glossary",
      category: t.category,
      href: `/glossary#${t.id}`,
      aliases: t.aliases,
    });
  });

  // Business rules
  RULES.forEach((r) => {
    results.push({
      id: `rule-${r.id}`,
      name: r.rule_name,
      description: `${r.condition} → ${r.expected_behavior}`,
      type: "rule",
      category: r.rule_type,
      href: "/knowledge/business-rules",
    });
  });

  // Static pages
  const pages: { name: string; description: string; href: string }[] = [
    { name: "Mapa de Pagamentos", description: "Arquitetura visual em camadas do sistema de pagamentos", href: "/explore/payments-map" },
    { name: "Trilhos de Pagamento", description: "Comparação detalhada de todos os rails de pagamento", href: "/explore/payment-rails" },
    { name: "Fluxos de Transação", description: "Fluxos passo a passo de diferentes tipos de pagamento", href: "/explore/transaction-flows" },
    { name: "Mapa do Ecossistema", description: "Players do ecossistema de pagamentos — fintechs, bancos, redes", href: "/explore/ecosystem-map" },
    { name: "Sistema Financeiro Global", description: "Mapa completo da infraestrutura financeira mundial", href: "/explore/financial-system" },
    { name: "Sistemas Bancários", description: "Como funcionam os sistemas bancários tradicionais", href: "/infrastructure/banking-systems" },
    { name: "Sistemas de Liquidação", description: "Clearing, liquidação e infraestrutura de mercado financeiro", href: "/infrastructure/settlement-systems" },
    { name: "Liquidez & Tesouraria", description: "Gestão de liquidez e operações de tesouraria", href: "/infrastructure/liquidity-treasury" },
    { name: "Mapa Blockchain", description: "Redes blockchain, consenso e infraestrutura crypto", href: "/crypto/blockchain-map" },
    { name: "Sistemas de Stablecoin", description: "Stablecoins, lastro, riscos e regulação", href: "/crypto/stablecoin-systems" },
    { name: "Protocolos DeFi", description: "Finanças descentralizadas — AMMs, lending, derivativos", href: "/crypto/defi-protocols" },
    { name: "Base de Features", description: "Catálogo completo de features de pagamento", href: "/knowledge/features" },
    { name: "Regras de Negócio", description: "Regras de validação, roteamento, risco e compliance", href: "/knowledge/business-rules" },
    { name: "Grafo de Dependências", description: "Relações entre features de pagamento", href: "/knowledge/dependency-graph" },
    { name: "Taxonomia", description: "Classificação hierárquica do ecossistema de pagamentos", href: "/knowledge/taxonomy" },
    { name: "Glossário", description: "Termos essenciais de pagamentos e fintech", href: "/glossary" },
    { name: "Conta Comigo", description: "Diagnóstico guiado de problemas de pagamento", href: "/diagnostics/conta-comigo" },
    { name: "Árvore de Métricas", description: "Hierarquia de KPIs e métricas de pagamento", href: "/diagnostics/metrics-tree" },
    { name: "Biblioteca de Problemas", description: "Problemas comuns em sistemas de pagamento", href: "/diagnostics/problem-library" },
    { name: "Mapa de Fraude", description: "Tipos de fraude e vetores de ataque", href: "/fraud/fraud-map" },
    { name: "Sinais de Fraude", description: "Sinais e indicadores de atividade fraudulenta", href: "/fraud/fraud-signals" },
    { name: "Ciclo de Chargeback", description: "Fluxo completo de disputas e chargebacks", href: "/fraud/chargeback-lifecycle" },
    { name: "Dashboard", description: "Painel de observabilidade de pagamentos", href: "/observability/payments-dashboard" },
    { name: "Explorador de Eventos", description: "Navegação por eventos de pagamento", href: "/observability/event-explorer" },
    { name: "Simulador", description: "Simule transações de pagamento", href: "/simulation/payment-simulator" },
    { name: "Consultor de Arquitetura", description: "Recomendações de arquitetura de pagamentos", href: "/simulation/architecture-advisor" },
    { name: "Consultor de Pagamentos", description: "Assistente AI para dúvidas de pagamentos", href: "/ai/payments-advisor" },
    { name: "Meu Progresso", description: "XP, badges, nível e conquistas", href: "/progress" },
    { name: "Regras de Bandeiras", description: "Regras de Visa, Mastercard, Elo, Diners, Amex e Hipercard", href: "/knowledge/brand-rules" },
    { name: "Analisador de Documentos", description: "Upload de regulações e documentações técnicas para análise com IA", href: "/tools/document-analyzer" },
    { name: "Feature Discovery", description: "Todas as features com sequence diagrams interativos e exemplos de fluxo de pagamento", href: "/knowledge/feature-discovery" },
    { name: "Chargeback: Guia Completo", description: "Anatomia financeira, reason codes, defesa, monitoramento e KPIs de chargeback", href: "/knowledge/chargeback-deep-dive" },
    { name: "Antecipação de Recebíveis", description: "Deságio, mesa de antecipação, registradoras e regulação", href: "/knowledge/antecipacao-recebiveis" },
    { name: "Parcelamento", description: "Parcelado emissor vs lojista, interchange, chargeback em parcelas", href: "/knowledge/parcelamento" },
    { name: "Crédito Estruturado", description: "SCD, FIDC, cessão de recebíveis e credit as a service", href: "/knowledge/credito-estruturado" },
    { name: "Quiz de Pagamentos", description: "Teste seus conhecimentos com 300+ perguntas em 10 temas de pagamentos", href: "/quiz" },
  ];

  pages.forEach((p, i) => {
    results.push({
      id: `page-${i}`,
      name: p.name,
      description: p.description,
      type: "page",
      href: p.href,
    });
  });

  // Static problems/metrics/rails/flows for search variety
  const extras: SearchResult[] = [
    { id: "problem-1", name: "Alta Taxa de Recusa", description: "Taxa de aprovação abaixo dos benchmarks do setor", type: "problem", category: "autorização", href: "/diagnostics/problem-library" },
    { id: "problem-2", name: "Falso Positivo de Fraude", description: "Transações legítimas sinalizadas como fraude", type: "problem", category: "fraude", href: "/diagnostics/problem-library" },
    { id: "problem-3", name: "Atraso na Liquidação", description: "Fundos não liquidando no prazo esperado", type: "problem", category: "liquidação", href: "/diagnostics/problem-library" },
    { id: "problem-4", name: "Abandono no 3DS", description: "Clientes abandonando durante autenticação 3DS", type: "problem", category: "autorização", href: "/diagnostics/problem-library" },
    { id: "problem-5", name: "Violação de Limite de Chargeback", description: "Taxa de chargeback excedendo limites das bandeiras", type: "problem", category: "fraude", href: "/diagnostics/problem-library" },
    { id: "metric-1", name: "Taxa de Autorização", description: "Percentual de transações aprovadas pelos emissores", type: "metric", href: "/diagnostics/metrics-tree" },
    { id: "metric-2", name: "Taxa de Conversão", description: "Percentual de checkouts que resultam em pagamento", type: "metric", href: "/diagnostics/metrics-tree" },
    { id: "metric-3", name: "Taxa de Fraude", description: "Percentual de transações fraudulentas", type: "metric", href: "/diagnostics/metrics-tree" },
    { id: "metric-4", name: "Taxa de Chargeback", description: "Percentual de transações disputadas", type: "metric", href: "/diagnostics/metrics-tree" },
    { id: "rail-1", name: "Cartões", description: "Pagamentos via Visa, Mastercard, Amex, Elo", type: "rail", href: "/explore/payment-rails" },
    { id: "rail-2", name: "Transferências Bancárias", description: "PIX, SEPA, ACH — transferências diretas", type: "rail", href: "/explore/payment-rails" },
    { id: "rail-3", name: "Carteiras Digitais", description: "Apple Pay, Google Pay, PayPal", type: "rail", href: "/explore/payment-rails" },
    { id: "rail-4", name: "Crypto", description: "Pagamentos com criptomoedas e stablecoins", type: "rail", href: "/explore/payment-rails" },
    { id: "flow-1", name: "Fluxo de Pagamento com Cartão", description: "Do checkout à liquidação", type: "flow", href: "/explore/transaction-flows" },
    { id: "flow-2", name: "Fluxo PIX", description: "Pagamento instantâneo via PIX", type: "flow", href: "/explore/transaction-flows" },
    { id: "flow-3", name: "Fluxo Cross-border", description: "Pagamento internacional com câmbio", type: "flow", href: "/explore/transaction-flows" },
  ];

  results.push(...extras);

  return results;
}

// Singleton index
let _index: SearchResult[] | null = null;

export function getSearchIndex(): SearchResult[] {
  if (!_index) _index = buildIndex();
  return _index;
}

// ---------------------------------------------------------------------------
// Search function
// ---------------------------------------------------------------------------

export function searchAll(
  query: string,
  typeFilter?: SearchResultType | null,
): SearchResult[] {
  const index = getSearchIndex();
  const q = query.toLowerCase().trim();

  return index.filter((item) => {
    if (typeFilter && item.type !== typeFilter) return false;
    if (!q) return !!typeFilter;

    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.category || "").toLowerCase().includes(q) ||
      (item.aliases || []).some((a) => a.toLowerCase().includes(q))
    );
  });
}
