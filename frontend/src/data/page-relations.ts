/**
 * Mapeamento de rotas para páginas relacionadas.
 * Usado pelo componente RelatedSection.
 */

export interface RelatedPage {
  name: string;
  description: string;
  href: string;
  emoji: string;
}

export const PAGE_RELATIONS: Record<string, RelatedPage[]> = {
  "/explore/payments-map": [
    { name: "Fluxos de Transação", description: "Veja transações passo a passo", href: "/explore/transaction-flows", emoji: "🔄" },
    { name: "Grafo de Dependências", description: "Relações entre features", href: "/knowledge/dependency-graph", emoji: "🔗" },
    { name: "Simulador", description: "Simule impacto de features", href: "/simulation/payment-simulator", emoji: "🧪" },
  ],
  "/explore/payment-rails": [
    { name: "Mapa de Pagamentos", description: "Arquitetura em camadas", href: "/explore/payments-map", emoji: "🗺️" },
    { name: "Mapa do Ecossistema", description: "Players do mercado", href: "/explore/ecosystem-map", emoji: "🌐" },
    { name: "Fluxos de Transação", description: "Fluxos por trilho", href: "/explore/transaction-flows", emoji: "🔄" },
  ],
  "/explore/transaction-flows": [
    { name: "Mapa de Pagamentos", description: "Onde cada etapa vive", href: "/explore/payments-map", emoji: "🗺️" },
    { name: "Biblioteca de Problemas", description: "Falhas comuns em fluxos", href: "/diagnostics/problem-library", emoji: "⚠️" },
    { name: "Simulador", description: "Simule features do fluxo", href: "/simulation/payment-simulator", emoji: "🧪" },
  ],
  "/explore/ecosystem-map": [
    { name: "Trilhos de Pagamento", description: "Infra de cada rede", href: "/explore/payment-rails", emoji: "🛤️" },
    { name: "Base de Features", description: "Capacidades dos players", href: "/knowledge/features", emoji: "📦" },
    { name: "Mapa de Pagamentos", description: "Arquitetura em camadas", href: "/explore/payments-map", emoji: "🗺️" },
  ],
  "/knowledge/features": [
    { name: "Grafo de Dependências", description: "Visualize relações", href: "/knowledge/dependency-graph", emoji: "🔗" },
    { name: "Simulador", description: "Teste impacto de features", href: "/simulation/payment-simulator", emoji: "🧪" },
    { name: "Regras de Negócio", description: "Regras por feature", href: "/knowledge/business-rules", emoji: "📋" },
  ],
  "/knowledge/dependency-graph": [
    { name: "Base de Features", description: "Detalhes de cada nó", href: "/knowledge/features", emoji: "📦" },
    { name: "Simulador", description: "Simule dependências", href: "/simulation/payment-simulator", emoji: "🧪" },
    { name: "Mapa de Pagamentos", description: "Visão em camadas", href: "/explore/payments-map", emoji: "🗺️" },
  ],
  "/knowledge/business-rules": [
    { name: "Base de Features", description: "Features relacionadas", href: "/knowledge/features", emoji: "📦" },
    { name: "Taxonomia", description: "Classificações", href: "/knowledge/taxonomy", emoji: "🏷️" },
    { name: "Biblioteca de Problemas", description: "Quando regras falham", href: "/diagnostics/problem-library", emoji: "⚠️" },
  ],
  "/diagnostics/conta-comigo": [
    { name: "Biblioteca de Problemas", description: "Problemas conhecidos", href: "/diagnostics/problem-library", emoji: "⚠️" },
    { name: "Árvore de Métricas", description: "Decomponha métricas", href: "/diagnostics/metrics-tree", emoji: "📊" },
    { name: "Simulador", description: "Teste soluções", href: "/simulation/payment-simulator", emoji: "🧪" },
  ],
  "/diagnostics/problem-library": [
    { name: "Conta Comigo", description: "Diagnóstico automatizado", href: "/diagnostics/conta-comigo", emoji: "🩺" },
    { name: "Base de Features", description: "Soluções por feature", href: "/knowledge/features", emoji: "📦" },
    { name: "Simulador", description: "Simule soluções", href: "/simulation/payment-simulator", emoji: "🧪" },
  ],
  "/diagnostics/metrics-tree": [
    { name: "Conta Comigo", description: "Diagnóstico completo", href: "/diagnostics/conta-comigo", emoji: "🩺" },
    { name: "Biblioteca de Problemas", description: "Causas de degradação", href: "/diagnostics/problem-library", emoji: "⚠️" },
  ],
  "/simulation/payment-simulator": [
    { name: "Base de Features", description: "Explore features", href: "/knowledge/features", emoji: "📦" },
    { name: "Grafo de Dependências", description: "Veja dependências", href: "/knowledge/dependency-graph", emoji: "🔗" },
    { name: "Conta Comigo", description: "Diagnóstico primeiro", href: "/diagnostics/conta-comigo", emoji: "🩺" },
  ],
  "/fraud/fraud-map": [
    { name: "Sinais de Fraude", description: "Catálogo de sinais", href: "/fraud/fraud-signals", emoji: "📡" },
    { name: "Ciclo de Chargeback", description: "Quando fraude vira disputa", href: "/fraud/chargeback-lifecycle", emoji: "⚖️" },
    { name: "Base de Features", description: "Features de fraude", href: "/knowledge/features", emoji: "📦" },
  ],
  "/fraud/fraud-signals": [
    { name: "Mapa de Fraude", description: "Pipeline de detecção", href: "/fraud/fraud-map", emoji: "🛡️" },
    { name: "Scoring de Fraude", description: "Feature de scoring", href: "/knowledge/features/fraud-scoring", emoji: "📦" },
    { name: "Explorador de Eventos", description: "Eventos de pagamento", href: "/observability/event-explorer", emoji: "📋" },
  ],
  "/fraud/chargeback-lifecycle": [
    { name: "Mapa de Fraude", description: "De onde vêm chargebacks", href: "/fraud/fraud-map", emoji: "🛡️" },
    { name: "Biblioteca de Problemas", description: "Problemas de chargeback", href: "/diagnostics/problem-library", emoji: "⚠️" },
    { name: "Chargeback Management", description: "Feature de gestão", href: "/knowledge/features/chargeback-management", emoji: "📦" },
  ],
  "/observability/event-explorer": [
    { name: "Fluxos de Transação", description: "Veja o fluxo completo", href: "/explore/transaction-flows", emoji: "🔄" },
    { name: "Árvore de Métricas", description: "Decomponha métricas", href: "/diagnostics/metrics-tree", emoji: "📊" },
    { name: "Webhooks", description: "Feature de notificações", href: "/knowledge/features/webhooks", emoji: "📦" },
  ],

  // Infraestrutura Financeira
  "/infrastructure/banking-systems": [
    { name: "Sistemas de Liquidação", description: "Como os fundos se movem", href: "/infrastructure/settlement-systems", emoji: "⚙️" },
    { name: "Mapa de Pagamentos", description: "Arquitetura em camadas", href: "/explore/payments-map", emoji: "🗺️" },
    { name: "Trilhos de Pagamento", description: "Infra de cada rede", href: "/explore/payment-rails", emoji: "🛤️" },
  ],
  "/infrastructure/settlement-systems": [
    { name: "Sistemas Bancários", description: "Mapa da infraestrutura", href: "/infrastructure/banking-systems", emoji: "🏛️" },
    { name: "Liquidez & Tesouraria", description: "Gestão de liquidez", href: "/infrastructure/liquidity-treasury", emoji: "💰" },
    { name: "Mapa de Pagamentos", description: "Visão em camadas", href: "/explore/payments-map", emoji: "🗺️" },
  ],
  "/infrastructure/liquidity-treasury": [
    { name: "Sistemas de Liquidação", description: "Onde a liquidação acontece", href: "/infrastructure/settlement-systems", emoji: "⚙️" },
    { name: "Sistemas Bancários", description: "Camadas do sistema bancário", href: "/infrastructure/banking-systems", emoji: "🏛️" },
    { name: "Trilhos de Pagamento", description: "Infra de cada trilho", href: "/explore/payment-rails", emoji: "🛤️" },
  ],

  // Crypto & Web3
  "/crypto/blockchain-map": [
    { name: "Sistemas de Stablecoin", description: "Stablecoins no blockchain", href: "/crypto/stablecoin-systems", emoji: "🪙" },
    { name: "Protocolos DeFi", description: "Finanças descentralizadas", href: "/crypto/defi-protocols", emoji: "🌀" },
    { name: "Trilhos de Pagamento", description: "Crypto como trilho", href: "/explore/payment-rails", emoji: "🛤️" },
  ],
  "/crypto/stablecoin-systems": [
    { name: "Mapa Blockchain", description: "Infraestrutura das redes", href: "/crypto/blockchain-map", emoji: "🔗" },
    { name: "Protocolos DeFi", description: "DeFi usando stablecoins", href: "/crypto/defi-protocols", emoji: "🌀" },
    { name: "Sistemas de Liquidação", description: "Liquidação tradicional vs crypto", href: "/infrastructure/settlement-systems", emoji: "⚙️" },
  ],
  "/crypto/defi-protocols": [
    { name: "Mapa Blockchain", description: "Redes que hospedam DeFi", href: "/crypto/blockchain-map", emoji: "🔗" },
    { name: "Sistemas de Stablecoin", description: "Stablecoins em DeFi", href: "/crypto/stablecoin-systems", emoji: "🪙" },
    { name: "Mapa do Ecossistema", description: "Ecossistema de pagamentos", href: "/explore/ecosystem-map", emoji: "🌐" },
  ],

  // Sistema Financeiro Global
  "/explore/financial-system": [
    { name: "Mapa de Pagamentos", description: "Arquitetura em camadas", href: "/explore/payments-map", emoji: "🗺️" },
    { name: "Sistemas Bancários", description: "Infraestrutura bancária", href: "/infrastructure/banking-systems", emoji: "🏛️" },
    { name: "Mapa Blockchain", description: "Infraestrutura cripto", href: "/crypto/blockchain-map", emoji: "🔗" },
  ],
};
