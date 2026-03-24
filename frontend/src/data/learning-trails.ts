export interface TrailPage {
  path: string;
  title: string;
  description: string;
  icon: string;
}

export interface LearningTrail {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  colorBg: string;
  pages: TrailPage[];
}

export const LEARNING_TRAILS: LearningTrail[] = [
  {
    id: "fundamentos",
    title: "Fundamentos",
    subtitle: "Entenda como pagamentos funcionam do zero",
    icon: "🏦",
    color: "#3b82f6",
    colorBg: "rgba(59,130,246,0.1)",
    pages: [
      { path: "/explore/payments-map", title: "Mapa de Pagamentos", description: "Visao em camadas da stack de pagamentos", icon: "🗺️" },
      { path: "/explore/payment-rails", title: "Trilhos de Pagamento", description: "Cartoes, PIX, transferencias e mais", icon: "🛤️" },
      { path: "/explore/transaction-flows", title: "Fluxos de Transacao", description: "Passo a passo de 8 tipos de transacao", icon: "🔄" },
      { path: "/explore/financial-system", title: "Sistema Financeiro Global", description: "Bancos centrais, redes e reguladores", icon: "🌍" },
      { path: "/explore/ecosystem-map", title: "Mapa do Ecossistema", description: "Players do mercado e suas conexoes", icon: "🌐" },
      { path: "/infrastructure/banking-systems", title: "Sistemas Bancarios", description: "Infraestrutura do consumidor ao banco central", icon: "🏛️" },
      { path: "/infrastructure/settlement-systems", title: "Sistemas de Liquidacao", description: "RTGS, DNS, ACH e como o dinheiro se move", icon: "⚙️" },
      { path: "/infrastructure/liquidity-treasury", title: "Liquidez & Tesouraria", description: "Gestao de caixa e funding", icon: "💰" },
    ],
  },
  {
    id: "operacoes",
    title: "Operacoes & Risco",
    subtitle: "Diagnostique problemas e entenda fraude",
    icon: "⚡",
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.1)",
    pages: [
      { path: "/diagnostics/metrics-tree", title: "Arvore de Metricas", description: "Hierarquia de KPIs de pagamento", icon: "📊" },
      { path: "/diagnostics/conta-comigo", title: "Conta Comigo", description: "Diagnostico inteligente do seu setup", icon: "🩺" },
      { path: "/diagnostics/problem-library", title: "Biblioteca de Problemas", description: "Catalogo de problemas e solucoes", icon: "⚠️" },
      { path: "/fraud/fraud-map", title: "Mapa de Fraude", description: "Pipeline de deteccao de fraude", icon: "🛡️" },
      { path: "/fraud/fraud-signals", title: "Sinais de Fraude", description: "16 sinais que indicam fraude", icon: "📡" },
      { path: "/fraud/chargeback-lifecycle", title: "Ciclo de Chargeback", description: "Da disputa a resolucao", icon: "⚖️" },
      { path: "/knowledge/chargeback-deep-dive", title: "Chargeback: Guia Completo", description: "Anatomia financeira, reason codes e defesa", icon: "📋" },
    ],
  },
  {
    id: "arquitetura",
    title: "Arquitetura",
    subtitle: "Construa e simule sistemas de pagamento",
    icon: "🏗️",
    color: "#8b5cf6",
    colorBg: "rgba(139,92,246,0.1)",
    pages: [
      { path: "/knowledge/features", title: "Base de Features", description: "Catalogo de 300+ features", icon: "📦" },
      { path: "/knowledge/taxonomy", title: "Taxonomia", description: "Classificacao do ecossistema", icon: "🏷️" },
      { path: "/knowledge/business-rules", title: "Regras de Negocio", description: "Restricoes e validacoes", icon: "📋" },
      { path: "/knowledge/dependency-graph", title: "Grafo de Dependencias", description: "Como features se conectam", icon: "🔗" },
      { path: "/simulation/payment-simulator", title: "Simulador", description: "Simule impacto de features", icon: "🧪" },
      { path: "/simulation/architecture-advisor", title: "Consultor de Arquitetura", description: "Recomendacoes por perfil", icon: "🏗️" },
      { path: "/crypto/blockchain-map", title: "Mapa Blockchain", description: "Redes e consenso", icon: "🔗" },
      { path: "/crypto/defi-protocols", title: "Protocolos DeFi", description: "AMMs, lending, bridges", icon: "🌀" },
    ],
  },
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
];

// Helper: find which trail a page belongs to
export function findTrailForPage(pathname: string): { trail: LearningTrail; index: number } | null {
  for (const trail of LEARNING_TRAILS) {
    const index = trail.pages.findIndex((p) => p.path === pathname);
    if (index !== -1) return { trail, index };
  }
  return null;
}

// Helper: get prev/next pages in a trail
export function getTrailNavigation(pathname: string, activeTrailId?: string) {
  // If user has an active trail preference, check that first
  if (activeTrailId) {
    const trail = LEARNING_TRAILS.find((t) => t.id === activeTrailId);
    if (trail) {
      const index = trail.pages.findIndex((p) => p.path === pathname);
      if (index !== -1) {
        return {
          trail,
          currentIndex: index,
          prev: index > 0 ? trail.pages[index - 1] : null,
          next: index < trail.pages.length - 1 ? trail.pages[index + 1] : null,
        };
      }
    }
  }
  // Fallback: find any trail containing this page
  const found = findTrailForPage(pathname);
  if (!found) return null;
  const { trail, index } = found;
  return {
    trail,
    currentIndex: index,
    prev: index > 0 ? trail.pages[index - 1] : null,
    next: index < trail.pages.length - 1 ? trail.pages[index + 1] : null,
  };
}
