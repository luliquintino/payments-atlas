/**
 * Dados de Infraestrutura Financeira — Settlement Systems e Treasury/Liquidez.
 */

// ─── Settlement Systems ───

export type SettlementType = "RTGS" | "DNS" | "Hybrid" | "Messaging" | "ACH";

export interface SettlementSystem {
  id: string;
  name: string;
  type: SettlementType;
  region: string;
  description: string;
  settlementModel: string;
  operator: string;
  currency: string[];
  settlementSpeed: string;
  volume: string;
  participants: string[];
}

export const SETTLEMENT_TYPE_COLORS: Record<SettlementType, string> = {
  RTGS: "#1e3a5f",
  DNS: "#0ea5e9",
  Hybrid: "#8b5cf6",
  Messaging: "#f59e0b",
  ACH: "#10b981",
};

export const settlementSystems: SettlementSystem[] = [
  {
    id: "swift",
    name: "SWIFT",
    type: "Messaging",
    region: "Global",
    description:
      "Rede global de mensageria financeira interbancária que conecta mais de 11.000 instituições financeiras em 200+ países. Não realiza liquidação diretamente — facilita a comunicação entre bancos.",
    settlementModel: "Mensageria (não liquida diretamente)",
    operator: "SWIFT SCRL (Bélgica)",
    currency: ["Multi-moeda"],
    settlementSpeed: "1–5 dias úteis (via bancos correspondentes)",
    volume: "~42 milhões de mensagens/dia",
    participants: ["Bancos comerciais", "Bancos centrais", "Corretoras", "Custódia"],
  },
  {
    id: "fedwire",
    name: "Fedwire",
    type: "RTGS",
    region: "Estados Unidos",
    description:
      "Sistema de liquidação bruta em tempo real operado pelo Federal Reserve. Processa pagamentos de alto valor entre bancos membros com finalidade imediata e irrevogável.",
    settlementModel: "Liquidação bruta em tempo real (RTGS)",
    operator: "Federal Reserve System",
    currency: ["USD"],
    settlementSpeed: "Segundos (tempo real)",
    volume: "~$3.5 trilhões/dia",
    participants: ["Bancos membros do Fed", "Instituições de poupança", "Cooperativas de crédito"],
  },
  {
    id: "t2",
    name: "T2 (antigo TARGET2)",
    type: "RTGS",
    region: "União Europeia",
    description:
      "Sistema consolidado de liquidação do Eurosistema (desde março 2023), unificando TARGET2, T2S e TIPS em uma plataforma única. Processa pagamentos em euros de alto valor entre bancos centrais e comerciais.",
    settlementModel: "Liquidação bruta em tempo real (RTGS)",
    operator: "Eurosistema (BCE)",
    currency: ["EUR"],
    settlementSpeed: "Segundos (tempo real)",
    volume: "~€1.7 trilhão/dia",
    participants: ["Bancos centrais da zona do euro", "Bancos comerciais", "Câmaras de compensação"],
  },
  {
    id: "chips",
    name: "CHIPS",
    type: "DNS",
    region: "Estados Unidos",
    description:
      "Clearing House Interbank Payments System — sistema de compensação multilateral netting que processa a maioria dos pagamentos internacionais em dólar entre grandes bancos.",
    settlementModel: "Compensação multilateral netting (DNS)",
    operator: "The Clearing House",
    currency: ["USD"],
    settlementSpeed: "Mesmo dia (final do dia)",
    volume: "~$1.5 trilhão/dia",
    participants: ["~50 grandes bancos internacionais"],
  },
  {
    id: "cls",
    name: "CLS (Continuous Linked Settlement)",
    type: "Hybrid",
    region: "Global",
    description:
      "Sistema de liquidação payment-versus-payment (PvP) para transações de câmbio. Elimina o risco de liquidação Herstatt ao vincular as duas pernas de cada operação FX.",
    settlementModel: "Payment-versus-Payment (PvP)",
    operator: "CLS Bank International",
    currency: ["18 moedas principais (USD, EUR, GBP, JPY...)"],
    settlementSpeed: "Mesmo dia (janelas de liquidação)",
    volume: "~$6 trilhões/dia em FX",
    participants: ["Bancos globais de FX", "Fundos de investimento", "Corporações multinacionais"],
  },
  {
    id: "spi-pix",
    name: "SPI / PIX",
    type: "RTGS",
    region: "Brasil",
    description:
      "Sistema de Pagamentos Instantâneos operado pelo Banco Central do Brasil. Permite transferências 24/7/365 em até 10 segundos entre qualquer conta bancária no país.",
    settlementModel: "Liquidação instantânea em tempo real",
    operator: "Banco Central do Brasil",
    currency: ["BRL"],
    settlementSpeed: "< 10 segundos (24/7/365)",
    volume: "~4 bilhões de transações/mês",
    participants: ["800+ instituições financeiras", "Fintechs", "Cooperativas"],
  },
  {
    id: "chaps",
    name: "CHAPS",
    type: "RTGS",
    region: "Reino Unido",
    description:
      "Clearing House Automated Payment System — sistema RTGS do Reino Unido para pagamentos em libras esterlinas de alto valor com liquidação no mesmo dia.",
    settlementModel: "Liquidação bruta em tempo real (RTGS)",
    operator: "Bank of England",
    currency: ["GBP"],
    settlementSpeed: "Mesmo dia (tempo real)",
    volume: "~£400 bilhões/dia",
    participants: ["Bancos e building societies do Reino Unido", "Bancos internacionais com acesso"],
  },
  {
    id: "tips",
    name: "TIPS",
    type: "RTGS",
    region: "União Europeia",
    description:
      "TARGET Instant Payment Settlement — serviço de liquidação de pagamentos instantâneos em euros, operando 24/7/365. Integrado ao T2 desde março 2023.",
    settlementModel: "Liquidação instantânea em tempo real",
    operator: "Eurosistema (BCE)",
    currency: ["EUR"],
    settlementSpeed: "< 10 segundos (24/7/365)",
    volume: "Crescendo rapidamente (~milhões/dia)",
    participants: ["Bancos da zona do euro", "PSPs participantes do SEPA Instant"],
  },
  {
    id: "ach-us",
    name: "ACH (Automated Clearing House)",
    type: "ACH",
    region: "Estados Unidos",
    description:
      "Rede de pagamentos eletrônicos em lote para transferências de baixo valor nos EUA. Processa folha de pagamento, pagamentos de contas, transferências bancárias e débito direto.",
    settlementModel: "Compensação em lote (batch)",
    operator: "Nacha / Federal Reserve / EPN",
    currency: ["USD"],
    settlementSpeed: "1–2 dias úteis (same-day ACH disponível)",
    volume: "~75 milhões de transações/dia",
    participants: ["Praticamente todos os bancos e credit unions dos EUA"],
  },
];

// ─── Treasury / Liquidity Functions ───

export type TreasuryCategory = "Liquidez" | "FX" | "Cash Management" | "Funding" | "Risk";

export interface TreasuryFunction {
  id: string;
  name: string;
  category: TreasuryCategory;
  description: string;
  keyActivities: string[];
  relatedSystems: string[];
  actors: string[];
}

export const TREASURY_CATEGORY_COLORS: Record<TreasuryCategory, string> = {
  Liquidez: "#2563eb",
  FX: "#8b5cf6",
  "Cash Management": "#0ea5e9",
  Funding: "#f59e0b",
  Risk: "#ef4444",
};

export const treasuryFunctions: TreasuryFunction[] = [
  {
    id: "intraday-liquidity",
    name: "Liquidez Intraday",
    category: "Liquidez",
    description:
      "Gestão de fundos disponíveis ao longo do dia para garantir que obrigações de pagamento sejam cumpridas em tempo real nos sistemas RTGS.",
    keyActivities: [
      "Monitoramento de saldos em tempo real",
      "Gestão de filas de pagamento",
      "Otimização de timing de pagamentos",
      "Uso de facilidades de crédito intraday do banco central",
    ],
    relatedSystems: ["Fedwire", "T2", "CHAPS"],
    actors: ["Tesouraria bancária", "Operações de pagamento", "Risk management"],
  },
  {
    id: "cash-pooling",
    name: "Cash Pooling",
    category: "Liquidez",
    description:
      "Consolidação de saldos de múltiplas contas ou entidades para otimizar a posição de caixa agregada e reduzir custos de financiamento.",
    keyActivities: [
      "Pooling físico (zero balancing)",
      "Pooling nocional (virtual)",
      "Cross-border pooling",
      "Sweep automático entre contas",
    ],
    relatedSystems: ["SWIFT", "Sistemas bancários internos"],
    actors: ["Tesouraria corporativa", "Bancos custodiantes", "Cash managers"],
  },
  {
    id: "reserve-requirements",
    name: "Reservas Compulsórias",
    category: "Liquidez",
    description:
      "Manutenção de reservas mínimas exigidas pelo banco central, equilibrando conformidade regulatória com eficiência de capital.",
    keyActivities: [
      "Cálculo de reservas obrigatórias",
      "Gestão de depósitos no banco central",
      "Otimização de excess reserves",
      "Reporte regulatório",
    ],
    relatedSystems: ["Banco Central", "Sistemas de reporte"],
    actors: ["Compliance", "Tesouraria", "Banco central"],
  },
  {
    id: "fx-spot",
    name: "Câmbio Spot & Forward",
    category: "FX",
    description:
      "Operações de compra e venda de moedas estrangeiras, tanto para liquidação imediata (spot T+2) quanto para datas futuras (forward).",
    keyActivities: [
      "Execução de ordens spot e forward",
      "Precificação e cotação",
      "Gestão de posição cambial",
      "Netting de operações",
    ],
    relatedSystems: ["CLS", "SWIFT", "Plataformas de trading (Reuters, Bloomberg)"],
    actors: ["Mesa de câmbio", "Sales FX", "Clientes corporativos"],
  },
  {
    id: "fx-hedging",
    name: "Hedge Cambial",
    category: "FX",
    description:
      "Estratégias de proteção contra variações cambiais usando derivativos (swaps, opções, NDFs) para empresas com exposição internacional.",
    keyActivities: [
      "Identificação de exposição cambial",
      "Estruturação de derivativos FX",
      "Mark-to-market de posições",
      "Hedge accounting (IFRS 9)",
    ],
    relatedSystems: ["CLS", "Câmaras de compensação", "Sistemas de risco"],
    actors: ["Tesouraria corporativa", "Bancos de investimento", "Risk managers"],
  },
  {
    id: "cash-forecasting",
    name: "Previsão de Caixa",
    category: "Cash Management",
    description:
      "Projeção de fluxos de caixa futuros para antecipar necessidades de liquidez, otimizar investimentos e evitar gaps de financiamento.",
    keyActivities: [
      "Modelagem de fluxos de caixa",
      "Integração com ERP e sistemas bancários",
      "Análise de variância (forecast vs. actual)",
      "Cenários de stress testing",
    ],
    relatedSystems: ["ERP (SAP, Oracle)", "TMS", "Portais bancários"],
    actors: ["Tesouraria", "Planejamento financeiro", "Controllers"],
  },
  {
    id: "payments-operations",
    name: "Operações de Pagamento",
    category: "Cash Management",
    description:
      "Execução e controle de pagamentos a fornecedores, folha de pagamento, impostos e outras obrigações. Inclui aprovação, routing e reconciliação.",
    keyActivities: [
      "Processamento de batch de pagamentos",
      "Aprovação e controle dual",
      "Escolha de trilho de pagamento (ACH, wire, check)",
      "Reconciliação bancária",
    ],
    relatedSystems: ["ACH", "SWIFT", "Fedwire", "SPI/PIX"],
    actors: ["Contas a pagar", "Tesouraria", "Compliance"],
  },
  {
    id: "short-term-funding",
    name: "Funding de Curto Prazo",
    category: "Funding",
    description:
      "Captação de recursos de curto prazo para cobrir gaps de liquidez — incluindo repos, commercial papers, linhas de crédito e mercado interbancário.",
    keyActivities: [
      "Emissão de commercial paper",
      "Operações de repo/reverse repo",
      "Gestão de linhas de crédito",
      "Participação no mercado interbancário",
    ],
    relatedSystems: ["Câmaras de compensação", "Depositárias (DTCC, Euroclear)"],
    actors: ["Tesouraria", "Desk de funding", "Investidores institucionais"],
  },
  {
    id: "capital-management",
    name: "Gestão de Capital",
    category: "Funding",
    description:
      "Otimização da estrutura de capital para atender requisitos regulatórios (Basileia III/IV), minimizar custo de capital e manter buffers adequados.",
    keyActivities: [
      "Cálculo de capital regulatório (CET1, Tier 1, Total)",
      "Stress testing e ICAAP",
      "Planejamento de dividendos e recompras",
      "Emissão de instrumentos de capital",
    ],
    relatedSystems: ["Sistemas de risco", "Reporte regulatório"],
    actors: ["CFO", "Tesouraria", "Risk management", "Reguladores"],
  },
  {
    id: "interest-rate-risk",
    name: "Risco de Taxa de Juros",
    category: "Risk",
    description:
      "Gestão da exposição a variações nas taxas de juros que afetam o valor de ativos, passivos e margem financeira da instituição.",
    keyActivities: [
      "Gap analysis (repricing)",
      "Duration e convexidade",
      "Hedge com swaps de taxa",
      "NII sensitivity analysis",
    ],
    relatedSystems: ["Bloomberg Terminal", "Sistemas ALM"],
    actors: ["ALM desk", "Risk management", "Comitê ALCO"],
  },
  {
    id: "counterparty-risk",
    name: "Risco de Contraparte",
    category: "Risk",
    description:
      "Avaliação e gestão do risco de que uma contraparte não honre suas obrigações em transações financeiras (derivativos, empréstimos, FX).",
    keyActivities: [
      "Análise de crédito de contrapartes",
      "Cálculo de limites de exposição",
      "Gestão de colateral e margem",
      "CVA/DVA calculation",
    ],
    relatedSystems: ["CLS", "Câmaras de compensação (CCP)", "Sistemas de risco de crédito"],
    actors: ["Credit risk", "Middle office", "Compliance"],
  },
];
