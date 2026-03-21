/**
 * Financial System Data
 *
 * Dados do mapa do sistema financeiro global — camadas, conexões e fluxo.
 * Extraídos do componente de página para reutilização e manutenção centralizada.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SystemLayer {
  id: string;
  name: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  subcategories: { name: string; items: string[] }[];
  examples: string[];
  atlasLinks: { name: string; href: string }[];
}

export interface FlowStep {
  layer: string;
  label: string;
}

export interface CrossConnection {
  from: string;
  to: string;
  via: string;
  direction: string;
  color: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const financialLayers: SystemLayer[] = [
  {
    id: "users",
    name: "Usuarios",
    description:
      "Todos os participantes do sistema financeiro — de consumidores individuais a governos. Cada tipo de usuario interage com camadas diferentes da infraestrutura.",
    colorFrom: "#8b5cf6",
    colorTo: "#a78bfa",
    subcategories: [
      { name: "Pessoas Fisicas", items: ["Consumidores", "Freelancers", "Investidores de varejo"] },
      { name: "Empresas", items: ["PMEs", "Marketplaces", "E-commerce", "SaaS"] },
      { name: "Instituicoes", items: ["Bancos", "Fundos", "Seguradoras", "Corporacoes"] },
      { name: "Governos", items: ["Banco Central", "Receita Federal", "Reguladores"] },
    ],
    examples: ["150M+ consumidores PIX", "~30M empresas ativas no Brasil"],
    atlasLinks: [
      { name: "Mapa de Pagamentos", href: "/explore/payments-map" },
      { name: "Mapa do Ecossistema", href: "/explore/ecosystem-map" },
    ],
  },
  {
    id: "applications",
    name: "Aplicacoes Financeiras",
    description:
      "Camada de aplicacao onde os usuarios interagem com servicos financeiros — apps de pagamento, neobancos, plataformas de trading, wallets e fintechs.",
    colorFrom: "#6366f1",
    colorTo: "#818cf8",
    subcategories: [
      { name: "Carteiras Digitais", items: ["Apple Pay", "Google Pay", "Samsung Pay", "MetaMask"] },
      { name: "Neobancos", items: ["Nubank", "Revolut", "N26", "Chime"] },
      { name: "Apps de Pagamento", items: ["PayPal", "Cash App", "Venmo", "PicPay"] },
      { name: "Plataformas de Trading", items: ["Coinbase", "Binance", "Interactive Brokers"] },
      { name: "Fintechs", items: ["Stripe", "Square", "Adyen", "Pagar.me"] },
    ],
    examples: ["PayPal (400M+ usuarios)", "Nubank (90M+ clientes)"],
    atlasLinks: [
      { name: "Mapa do Ecossistema", href: "/explore/ecosystem-map" },
      { name: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    id: "payment-systems",
    name: "Sistemas de Pagamento",
    description:
      "Infraestruturas que movimentam dinheiro — redes de cartao, transferencias bancarias, pagamentos instantaneos, carteiras digitais e rails de crypto/stablecoin.",
    colorFrom: "#2563eb",
    colorTo: "#60a5fa",
    subcategories: [
      { name: "Redes de Cartao", items: ["Visa", "Mastercard", "Elo", "Amex"] },
      { name: "Transferencias Bancarias", items: ["ACH", "SEPA", "Wire transfers"] },
      { name: "Pagamentos Instantaneos", items: ["PIX", "FedNow", "UPI", "Faster Payments"] },
      { name: "Carteiras Digitais", items: ["Apple Pay", "Google Pay", "WeChat Pay"] },
      { name: "Crypto Payments", items: ["Bitcoin Lightning", "Ethereum", "Solana Pay"] },
      { name: "Stablecoin Rails", items: ["USDC", "USDT", "PYUSD", "EURC"] },
    ],
    examples: ["Visa (~$14 trilhoes/ano)", "PIX (~4 bilhoes transacoes/mes)"],
    atlasLinks: [
      { name: "Trilhos de Pagamento", href: "/explore/payment-rails" },
      { name: "Mapa de Pagamentos", href: "/explore/payments-map" },
      { name: "Mapa Blockchain", href: "/crypto/blockchain-map" },
    ],
  },
  {
    id: "banking",
    name: "Sistema Bancario",
    description:
      "Instituicoes financeiras que mantem contas, processam transacoes, concedem credito e gerenciam risco — de bancos comerciais a digitais.",
    colorFrom: "#059669",
    colorTo: "#34d399",
    subcategories: [
      { name: "Bancos Comerciais", items: ["Itau", "Bradesco", "JPMorgan", "HSBC"] },
      { name: "Bancos Custodiantes", items: ["BNY Mellon", "State Street", "Northern Trust"] },
      { name: "Bancos de Investimento", items: ["Goldman Sachs", "Morgan Stanley", "BTG Pactual"] },
      { name: "Bancos Digitais", items: ["Nubank", "N26", "Revolut", "C6 Bank"] },
    ],
    examples: ["JPMorgan ($3.7T ativos)", "Itau (maior da America Latina)"],
    atlasLinks: [
      { name: "Sistemas Bancarios", href: "/infrastructure/banking-systems" },
      { name: "Liquidez & Tesouraria", href: "/infrastructure/liquidity-treasury" },
    ],
  },
  {
    id: "fmi",
    name: "Infraestrutura de Mercado Financeiro",
    description:
      "Sistemas criticos de clearing, liquidacao, custodia e processamento que garantem a integridade e finalidade das transacoes financeiras.",
    colorFrom: "#d97706",
    colorTo: "#fbbf24",
    subcategories: [
      { name: "Sistemas de Clearing", items: ["CCP (Central Counterparty)", "Camaras de compensacao"] },
      { name: "Sistemas de Liquidacao", items: ["Fedwire", "T2", "CHIPS", "SPI/PIX"] },
      { name: "Depositarios de Titulos", items: ["DTCC", "Euroclear", "Clearstream", "B3"] },
      { name: "Processadores de Pagamento", items: ["The Clearing House", "EBA Clearing", "CIP"] },
      { name: "Blockchain Networks", items: ["Ethereum", "Solana", "Polygon", "Arbitrum"] },
    ],
    examples: ["DTCC ($2.4 quatrilhoes/ano)", "SWIFT (42M mensagens/dia)"],
    atlasLinks: [
      { name: "Sistemas de Liquidacao", href: "/infrastructure/settlement-systems" },
      { name: "Mapa Blockchain", href: "/crypto/blockchain-map" },
      { name: "Protocolos DeFi", href: "/crypto/defi-protocols" },
    ],
  },
  {
    id: "central-banks",
    name: "Bancos Centrais",
    description:
      "Autoridades monetarias que operam sistemas de pagamento, definem politica monetaria, supervisionam instituicoes e pesquisam CBDCs (moedas digitais de banco central).",
    colorFrom: "#dc2626",
    colorTo: "#f87171",
    subcategories: [
      { name: "Bancos Centrais", items: ["Federal Reserve", "BCE", "Banco Central do Brasil", "Bank of England"] },
      { name: "Autoridades Monetarias", items: ["FMI", "BIS", "Banco Mundial"] },
      { name: "Projetos CBDC", items: ["DREX (Brasil)", "Digital Euro", "e-CNY (China)", "Digital Dollar"] },
    ],
    examples: ["Fed ($8.9T balanco)", "DREX (piloto em 2024)"],
    atlasLinks: [
      { name: "Sistemas Bancarios", href: "/infrastructure/banking-systems" },
      { name: "Sistemas de Liquidacao", href: "/infrastructure/settlement-systems" },
    ],
  },
];

export const FLOW_STEPS: FlowStep[] = [
  { layer: "users", label: "Usuario inicia transacao" },
  { layer: "applications", label: "App processa requisicao" },
  { layer: "payment-systems", label: "Rail de pagamento selecionado" },
  { layer: "banking", label: "Banco processa operacao" },
  { layer: "fmi", label: "Clearing e liquidacao" },
  { layer: "central-banks", label: "Banco central finaliza" },
];

export const CROSS_CONNECTIONS: CrossConnection[] = [
  { from: "Pagamentos Tradicionais", to: "Blockchain", via: "On-Ramps (Coinbase, MoonPay, Mercado Bitcoin)", direction: "fiat → crypto", color: "#6366f1" },
  { from: "Blockchain", to: "Sistema Bancario", via: "Off-Ramps (Exchanges, P2P, OTC)", direction: "crypto → fiat", color: "#10b981" },
  { from: "Stablecoins", to: "Liquidacao Tradicional", via: "Circle Mint, Tether Treasury", direction: "backing reserves", color: "#d97706" },
  { from: "DeFi", to: "Mercado Financeiro", via: "Tokenizacao de RWA, Titulos on-chain", direction: "ativos tokenizados", color: "#8b5cf6" },
];

export const STAT_COLORS = [
  { from: "#8b5cf6", to: "#a78bfa" },
  { from: "#2563eb", to: "#60a5fa" },
  { from: "#059669", to: "#34d399" },
  { from: "#d97706", to: "#fbbf24" },
];
