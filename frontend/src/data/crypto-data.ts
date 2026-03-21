/**
 * Dados de Crypto & Web3 — Blockchains, Stablecoins e Protocolos DeFi.
 */

// ─── Blockchains ───

export type BlockchainCategory = "Layer 1" | "Layer 2" | "Sidechain";

export interface Blockchain {
  id: string;
  name: string;
  category: BlockchainCategory;
  consensus: string;
  description: string;
  tps: string;
  finality: string;
  fees: string;
  nativeToken: string;
  useCases: string[];
  ecosystem: string[];
}

export const BLOCKCHAIN_CATEGORY_COLORS: Record<BlockchainCategory, string> = {
  "Layer 1": "#2563eb",
  "Layer 2": "#8b5cf6",
  Sidechain: "#0ea5e9",
};

export const blockchains: Blockchain[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    category: "Layer 1",
    consensus: "Proof of Work (SHA-256)",
    description:
      "A primeira e mais descentralizada blockchain. Serve como reserva de valor digital e rede de liquidação de alto valor com segurança máxima.",
    tps: "~7 TPS (on-chain)",
    finality: "~60 minutos (6 confirmações)",
    fees: "$1–$30 (variável com demanda)",
    nativeToken: "BTC",
    useCases: ["Reserva de valor", "Liquidação de alto valor", "Pagamentos cross-border"],
    ecosystem: ["Lightning Network", "Ordinals/BRC-20", "Wrapped BTC (WBTC)"],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    category: "Layer 1",
    consensus: "Proof of Stake (Gasper/Casper)",
    description:
      "Plataforma líder de smart contracts e base da maioria dos protocolos DeFi, NFTs e aplicações descentralizadas. Migrou para PoS em 2022 (The Merge).",
    tps: "~15-30 TPS (L1)",
    finality: "~13 minutos (2 epochs / 64 slots)",
    fees: "$0.50–$50 (variável com congestionamento)",
    nativeToken: "ETH",
    useCases: ["DeFi", "NFTs", "DAOs", "Tokenização de ativos", "Stablecoins"],
    ecosystem: ["Uniswap", "Aave", "OpenSea", "Lido", "MakerDAO"],
  },
  {
    id: "solana",
    name: "Solana",
    category: "Layer 1",
    consensus: "Proof of History + Tower BFT",
    description:
      "Blockchain de alta performance focada em velocidade e baixo custo. Popular para DeFi, NFTs e pagamentos de varejo com transações quase instantâneas.",
    tps: "~4.000 TPS (teórico: 65.000)",
    finality: "~400ms",
    fees: "$0.00025 (extremamente baixo)",
    nativeToken: "SOL",
    useCases: ["DeFi de alta frequência", "NFTs", "Pagamentos", "Gaming"],
    ecosystem: ["Jupiter", "Raydium", "Magic Eden", "Marinade", "Phantom"],
  },
  {
    id: "polygon",
    name: "Polygon (PoS)",
    category: "Sidechain",
    description:
      "Sidechain compatível com EVM que oferece transações rápidas e baratas. Amplamente adotada por empresas para tokenização e pagamentos em stablecoins.",
    consensus: "Proof of Stake (Tendermint-based)",
    tps: "~7.000 TPS",
    finality: "~2 segundos",
    fees: "$0.001–$0.01",
    nativeToken: "MATIC/POL",
    useCases: ["Pagamentos corporativos", "Tokenização", "Gaming", "DeFi acessível"],
    ecosystem: ["Aave", "QuickSwap", "Starbucks Odyssey", "Reddit NFTs"],
  },
  {
    id: "arbitrum",
    name: "Arbitrum One",
    category: "Layer 2",
    consensus: "Optimistic Rollup",
    description:
      "Maior Layer 2 do Ethereum por TVL. Usa optimistic rollups para herdar a segurança do Ethereum com custos muito menores e maior throughput.",
    tps: "~4.000 TPS",
    finality: "~1 semana (challenge period) / ~minutos (soft finality)",
    fees: "$0.01–$0.50",
    nativeToken: "ARB",
    useCases: ["DeFi", "Trading", "Derivativos on-chain", "Pagamentos"],
    ecosystem: ["GMX", "Camelot", "Radiant", "Pendle"],
  },
  {
    id: "avalanche",
    name: "Avalanche (C-Chain)",
    category: "Layer 1",
    consensus: "Avalanche Consensus (Snow protocol)",
    description:
      "Plataforma de smart contracts com subnets customizáveis. Combina alta velocidade com descentralização e é popular para tokenização de ativos reais (RWA).",
    tps: "~4.500 TPS",
    finality: "< 1 segundo",
    fees: "$0.01–$0.10",
    nativeToken: "AVAX",
    useCases: ["Subnets empresariais", "RWA", "DeFi", "Gaming"],
    ecosystem: ["Trader Joe", "Benqi", "GMX", "Avalanche Subnets"],
  },
  {
    id: "base",
    name: "Base",
    category: "Layer 2",
    consensus: "Optimistic Rollup (OP Stack)",
    description:
      "Layer 2 do Ethereum incubada pela Coinbase. Foco em adoção mainstream com taxas ultra-baixas e integração com o ecossistema Coinbase.",
    tps: "~2.000 TPS",
    finality: "~1 semana (challenge) / ~minutos (soft)",
    fees: "$0.001–$0.05",
    nativeToken: "ETH (sem token nativo próprio)",
    useCases: ["Social DeFi", "Onboarding mainstream", "Pagamentos", "NFTs"],
    ecosystem: ["Aerodrome", "Friend.tech", "Coinbase Wallet"],
  },
  {
    id: "bnb-chain",
    name: "BNB Chain",
    category: "Layer 1",
    consensus: "Proof of Staked Authority (PoSA)",
    description:
      "Blockchain da Binance compatível com EVM. Alta adoção na Ásia e América Latina com taxas baixas, mas criticada por ser mais centralizada.",
    tps: "~2.000 TPS",
    finality: "~3 segundos",
    fees: "$0.01–$0.10",
    nativeToken: "BNB",
    useCases: ["DeFi acessível", "GameFi", "Pagamentos", "Trading"],
    ecosystem: ["PancakeSwap", "Venus", "Binance", "StarGate"],
  },
];

// ─── Stablecoins ───

export type StablecoinBackingType = "Fiat-backed" | "Crypto-backed" | "Algorithmic" | "Hybrid";

export interface Stablecoin {
  id: string;
  name: string;
  ticker: string;
  issuer: string;
  backingType: StablecoinBackingType;
  blockchain: string[];
  description: string;
  settlementSpeed: string;
  fees: string;
  marketCap: string;
  useCases: string[];
  regulatoryStatus: string;
}

export const STABLECOIN_BACKING_COLORS: Record<StablecoinBackingType, string> = {
  "Fiat-backed": "#10b981",
  "Crypto-backed": "#8b5cf6",
  Algorithmic: "#f59e0b",
  Hybrid: "#0ea5e9",
};

export const stablecoins: Stablecoin[] = [
  {
    id: "usdt",
    name: "Tether",
    ticker: "USDT",
    issuer: "Tether Limited",
    backingType: "Fiat-backed",
    blockchain: ["Ethereum", "Tron", "Solana", "Polygon", "Avalanche", "BNB Chain"],
    description:
      "A maior stablecoin por capitalização de mercado. Pareada 1:1 com o dólar americano, lastreada por reservas de cash, treasuries e outros ativos.",
    settlementSpeed: "Segundos a minutos (depende da blockchain)",
    fees: "Taxas de gas da blockchain + 0.1% para resgate",
    marketCap: "~$140 bilhões",
    useCases: ["Trading de crypto", "Remessas", "Reserva de valor em mercados emergentes", "DeFi"],
    regulatoryStatus: "Regulada em jurisdições selecionadas. Publica atestações trimestrais de reservas.",
  },
  {
    id: "usdc",
    name: "USD Coin",
    ticker: "USDC",
    issuer: "Circle (consórcio com Coinbase)",
    backingType: "Fiat-backed",
    blockchain: ["Ethereum", "Solana", "Polygon", "Arbitrum", "Base", "Avalanche"],
    description:
      "Stablecoin regulada e transparente, lastreada 100% por cash e U.S. Treasuries de curto prazo. Preferida por instituições e corporações.",
    settlementSpeed: "Segundos a minutos",
    fees: "Taxas de gas da blockchain",
    marketCap: "~$45 bilhões",
    useCases: ["Pagamentos corporativos", "Remessas", "DeFi institucional", "On/off-ramp"],
    regulatoryStatus: "Auditada mensalmente pela Deloitte. Circle busca licença bancária nos EUA.",
  },
  {
    id: "dai",
    name: "Dai",
    ticker: "DAI",
    issuer: "Sky (anteriormente MakerDAO)",
    backingType: "Crypto-backed",
    blockchain: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
    description:
      "Stablecoin descentralizada gerada por colateralização excessiva de crypto-ativos no protocolo Sky (antigo MakerDAO). Governada pelo token MKR. Nota: o protocolo rebrandou para Sky em 2024, introduzindo USDS como novo token, mas DAI continua ativo.",
    settlementSpeed: "Segundos a minutos",
    fees: "Taxas de gas da blockchain + stability fee variável",
    marketCap: "~$5 bilhões",
    useCases: ["DeFi nativa", "Empréstimos descentralizados", "Proteção contra censura"],
    regulatoryStatus: "Protocolo descentralizado — sem emissor central. Classificação regulatória em debate.",
  },
  {
    id: "pyusd",
    name: "PayPal USD",
    ticker: "PYUSD",
    issuer: "Paxos Trust Company (para PayPal)",
    backingType: "Fiat-backed",
    blockchain: ["Ethereum", "Solana"],
    description:
      "Stablecoin emitida pela Paxos para o PayPal. Totalmente lastreada por depósitos em dólar e U.S. Treasuries. Integrada ao ecossistema PayPal/Venmo.",
    settlementSpeed: "Segundos a minutos",
    fees: "Taxas de gas da blockchain (grátis dentro do PayPal)",
    marketCap: "~$500 milhões",
    useCases: ["Pagamentos via PayPal/Venmo", "Transferências cross-border", "Compras de crypto"],
    regulatoryStatus: "Emitida por Paxos (trust company regulada pelo NYDFS). Atestações mensais.",
  },
  {
    id: "frax",
    name: "Frax",
    ticker: "FRAX",
    issuer: "Frax Finance",
    backingType: "Fiat-backed",
    blockchain: ["Ethereum", "Arbitrum", "Polygon", "Avalanche"],
    description:
      "Stablecoin que migrou para modelo 100% colateralizado (FRAX v3) com reservas em T-Bills e depósitos bancários. Anteriormente parcialmente algorítmica.",
    settlementSpeed: "Segundos a minutos",
    fees: "Taxas de gas da blockchain",
    marketCap: "~$350 milhões",
    useCases: ["DeFi", "Yield farming", "Liquidez em AMMs"],
    regulatoryStatus: "Protocolo descentralizado. 100% colateralizado desde FRAX v3.",
  },
  {
    id: "eurc",
    name: "Euro Coin",
    ticker: "EURC",
    issuer: "Circle",
    backingType: "Fiat-backed",
    blockchain: ["Ethereum", "Solana", "Avalanche"],
    description:
      "Stablecoin pareada com o euro, emitida pela Circle. Segue os mesmos padrões de transparência do USDC, voltada para o mercado europeu.",
    settlementSpeed: "Segundos a minutos",
    fees: "Taxas de gas da blockchain",
    marketCap: "~$100 milhões",
    useCases: ["Pagamentos em euro", "Remessas Europa", "DeFi em EUR"],
    regulatoryStatus: "Emitida sob regulação MiCA na UE.",
  },
];

// ─── DeFi Protocols ───

export type DeFiCategory = "DEX" | "Lending" | "Stablecoins" | "Derivatives" | "Yield" | "Liquid Staking";

export interface DeFiProtocol {
  id: string;
  name: string;
  category: DeFiCategory;
  blockchain: string[];
  description: string;
  tvl: string;
  keyFeatures: string[];
  risks: string[];
  governance: string;
}

export const DEFI_CATEGORY_COLORS: Record<DeFiCategory, string> = {
  DEX: "#2563eb",
  Lending: "#10b981",
  Stablecoins: "#f59e0b",
  Derivatives: "#ef4444",
  Yield: "#8b5cf6",
  "Liquid Staking": "#0ea5e9",
};

export const defiProtocols: DeFiProtocol[] = [
  {
    id: "uniswap",
    name: "Uniswap",
    category: "DEX",
    blockchain: ["Ethereum", "Polygon", "Arbitrum", "Base", "BNB Chain", "Avalanche"],
    description:
      "Maior exchange descentralizada por volume. Pioneira do modelo AMM (Automated Market Maker) com pools de liquidez permissionless.",
    tvl: "~$5 bilhões",
    keyFeatures: [
      "AMM com concentrated liquidity (v3)",
      "Permissionless token listing",
      "Multi-chain deployment",
      "Uniswap X (aggregation)",
    ],
    risks: ["Impermanent loss", "Smart contract risk", "Front-running/MEV"],
    governance: "Token UNI — governança on-chain via Uniswap Governance",
  },
  {
    id: "aave",
    name: "Aave",
    category: "Lending",
    blockchain: ["Ethereum", "Polygon", "Arbitrum", "Avalanche", "Optimism", "Base"],
    description:
      "Maior protocolo de empréstimos descentralizados. Permite emprestar e tomar emprestado crypto-ativos com taxas variáveis ou estáveis.",
    tvl: "~$12 bilhões",
    keyFeatures: [
      "Flash loans (empréstimos sem colateral em uma transação)",
      "Taxas variáveis e estáveis",
      "E-Mode para ativos correlacionados",
      "GHO stablecoin nativa",
    ],
    risks: ["Risco de liquidação", "Oracle risk", "Smart contract risk"],
    governance: "Token AAVE — governança descentralizada via Aave Governance",
  },
  {
    id: "makerdao",
    name: "MakerDAO (Sky)",
    category: "Stablecoins",
    blockchain: ["Ethereum"],
    description:
      "Protocolo que emite a stablecoin DAI (e USDS) via colateralização de crypto-ativos. Um dos protocolos DeFi mais antigos e importantes. Rebrandou de MakerDAO para Sky em 2024, com novo token de governança SKY (antigo MKR).",
    tvl: "~$8 bilhões",
    keyFeatures: [
      "Emissão de DAI (stablecoin descentralizada)",
      "Multi-collateral vaults",
      "Real World Assets (RWA) como colateral",
      "Dai Savings Rate (DSR)",
    ],
    risks: ["Risco de descolamento do peg", "Liquidação de vaults", "Dependência de oracles"],
    governance: "Token MKR — governança descentralizada",
  },
  {
    id: "lido",
    name: "Lido",
    category: "Liquid Staking",
    blockchain: ["Ethereum", "Polygon"],
    description:
      "Maior protocolo de liquid staking. Permite fazer stake de ETH e receber stETH líquido que pode ser usado em DeFi simultaneamente.",
    tvl: "~$15 bilhões",
    keyFeatures: [
      "Staking de ETH sem mínimo de 32 ETH",
      "stETH como token líquido (usável em DeFi)",
      "Rebasing automático de rewards",
      "Descentralização de validadores (DVT)",
    ],
    risks: ["Risco de depeg stETH/ETH", "Slashing de validadores", "Centralização excessiva"],
    governance: "Token LDO — governança via Lido DAO",
  },
  {
    id: "curve",
    name: "Curve Finance",
    category: "DEX",
    blockchain: ["Ethereum", "Polygon", "Arbitrum", "Avalanche"],
    description:
      "DEX especializada em swaps de ativos pareados (stablecoins, wrapped tokens). Oferece o menor slippage para ativos de valor similar.",
    tvl: "~$2 bilhões",
    keyFeatures: [
      "StableSwap AMM (otimizado para pegged assets)",
      "Curve Wars (incentivos de liquidez via veCRV)",
      "crvUSD (stablecoin nativa)",
      "Multi-pool architecture",
    ],
    risks: ["Smart contract complexity", "Governance attacks", "Depeg risk em pools"],
    governance: "Token CRV — vote-escrowed (veCRV) governance",
  },
  {
    id: "gmx",
    name: "GMX",
    category: "Derivatives",
    blockchain: ["Arbitrum", "Avalanche"],
    description:
      "Protocolo de trading de perpétuos descentralizado. Permite trading com alavancagem de até 50x sem KYC, usando um pool de liquidez multi-ativo (GLP/GM).",
    tvl: "~$500 milhões",
    keyFeatures: [
      "Perpétuos com até 50x alavancagem",
      "Zero-slippage trades (oracle-based pricing)",
      "GLP/GM pool como contraparte",
      "Fee sharing com provedores de liquidez",
    ],
    risks: ["Risco direcional para LPs", "Oracle manipulation", "Liquidation cascade"],
    governance: "Token GMX — governança limitada, foco em revenue sharing",
  },
  {
    id: "pendle",
    name: "Pendle",
    category: "Yield",
    blockchain: ["Ethereum", "Arbitrum"],
    description:
      "Protocolo de yield tokenization que separa o principal do yield futuro de ativos DeFi, permitindo trading e estratégias de yield avançadas.",
    tvl: "~$3 bilhões",
    keyFeatures: [
      "Tokenização de yield (PT + YT)",
      "AMM especializado para yield tokens",
      "Fixed yield (via PT)",
      "Yield speculation (via YT)",
    ],
    risks: ["Complexidade para novos usuários", "Smart contract risk", "Impermanent loss"],
    governance: "Token PENDLE — vePENDLE governance",
  },
  {
    id: "compound",
    name: "Compound",
    category: "Lending",
    blockchain: ["Ethereum", "Polygon", "Arbitrum", "Base"],
    description:
      "Protocolo pioneiro de lending/borrowing em DeFi. Introduziu o conceito de cTokens (tokens de rendimento compostos) e governance tokens.",
    tvl: "~$2.5 bilhões",
    keyFeatures: [
      "cTokens (rendimento auto-compounding)",
      "Compound III (isolação de mercados)",
      "Taxas variáveis baseadas em utilização",
      "Pioneiro em yield farming (COMP distribution)",
    ],
    risks: ["Risco de liquidação", "Governance attack surface", "Oracle dependency"],
    governance: "Token COMP — governance descentralizada via Compound Governor",
  },
];
