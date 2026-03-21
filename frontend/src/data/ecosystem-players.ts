/**
 * Global Payments & Fintech Ecosystem — Players organizados por camada e categoria.
 *
 * Layers (de cima para baixo):
 *   Merchants → Payment Platforms → Payment Infrastructure →
 *   Financial Infrastructure → Blockchain Infrastructure
 */

// ─── Types ───

export interface EcosystemPlayer {
  id: string;
  name: string;
  type: string;
  keyFeatures: string[];
  regions: string[];
  connections: string[]; // IDs de outros players conectados
}

export interface EcosystemCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  players: EcosystemPlayer[];
}

export interface EcosystemLayer {
  id: string;
  name: string;
  icon: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  categories: EcosystemCategory[];
}

// ─── Layers ───

export const ecosystemLayers: EcosystemLayer[] = [
  // ════════════════════════════════════════════
  // LAYER 1 — Merchants & Platforms
  // ════════════════════════════════════════════
  {
    id: "merchants",
    name: "Merchants & Platforms",
    icon: "🏪",
    description:
      "Empresas e plataformas que vendem produtos/servicos e precisam aceitar pagamentos de consumidores.",
    colorFrom: "#6366f1",
    colorTo: "#818cf8",
    categories: [
      {
        id: "e-commerce",
        name: "E-Commerce & Marketplaces",
        icon: "🛒",
        color: "#6366f1",
        description: "Plataformas de comercio eletronico e marketplaces globais.",
        players: [
          {
            id: "amazon",
            name: "Amazon",
            type: "Marketplace Global",
            keyFeatures: ["Amazon Pay", "Fulfillment (FBA)", "Subscribe & Save", "1-Click Checkout"],
            regions: ["Global (20+ marketplaces)"],
            connections: ["stripe", "visa", "mastercard", "jpmorgan"],
          },
          {
            id: "shopify",
            name: "Shopify",
            type: "Plataforma de E-Commerce",
            keyFeatures: ["Shopify Payments (Stripe)", "Shop Pay", "Multi-canal", "Shopify Capital"],
            regions: ["Global (175+ paises)"],
            connections: ["stripe", "paypal", "klarna", "affirm"],
          },
          {
            id: "mercadolivre",
            name: "Mercado Livre",
            type: "Marketplace LATAM",
            keyFeatures: ["MercadoPago integrado", "Envios (logistica)", "Credito ao vendedor", "PIX nativo"],
            regions: ["Brasil", "Argentina", "Mexico", "LATAM"],
            connections: ["mercadopago", "pix", "visa", "mastercard"],
          },
        ],
      },
      {
        id: "platforms-services",
        name: "Plataformas de Servico",
        icon: "📱",
        color: "#8b5cf6",
        description: "Plataformas digitais que conectam usuarios a servicos sob demanda.",
        players: [
          {
            id: "uber",
            name: "Uber",
            type: "Mobilidade / Delivery",
            keyFeatures: ["Split payments", "Wallet pre-pago", "Payouts a motoristas", "Pagamento em tempo real"],
            regions: ["Global (70+ paises)"],
            connections: ["stripe", "adyen", "visa", "applepay"],
          },
          {
            id: "ifood",
            name: "iFood",
            type: "Delivery de Alimentos",
            keyFeatures: ["Pagamento na entrega", "Carteira iFood", "PIX integrado", "Maquininha propria"],
            regions: ["Brasil"],
            connections: ["pix", "visa", "mastercard", "mercadopago"],
          },
          {
            id: "airbnb",
            name: "Airbnb",
            type: "Hospedagem / Experiencias",
            keyFeatures: ["Payouts multi-moeda", "Split host/guest", "Resolucao de disputas", "Pagamento local"],
            regions: ["Global (220+ paises)"],
            connections: ["adyen", "paypal", "visa", "mastercard"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════
  // LAYER 2 — Payment Platforms
  // ════════════════════════════════════════════
  {
    id: "payment-platforms",
    name: "Payment Platforms",
    icon: "💳",
    description:
      "PSPs, gateways, carteiras digitais e provedores BNPL que conectam merchants ao sistema financeiro.",
    colorFrom: "#2563eb",
    colorTo: "#3b82f6",
    categories: [
      {
        id: "psps",
        name: "PSPs & Processadores",
        icon: "⚡",
        color: "#2563eb",
        description: "Provedores de servicos de pagamento que agregam metodos de pagamento e gerenciam integracoes.",
        players: [
          {
            id: "stripe",
            name: "Stripe",
            type: "PSP Full-Stack",
            keyFeatures: ["APIs developer-first", "Connect (marketplace)", "Radar (fraude com ML)", "Billing & Invoicing"],
            regions: ["Global (46+ paises)"],
            connections: ["visa", "mastercard", "jpmorgan", "applepay", "googlepay"],
          },
          {
            id: "adyen",
            name: "Adyen",
            type: "PSP Full-Stack / Adquirente",
            keyFeatures: ["Comercio unificado (online + POS)", "Adquirencia propria", "RevenueAccelerate", "Roteamento inteligente"],
            regions: ["Global (30+ paises diretos)"],
            connections: ["visa", "mastercard", "pix", "applepay"],
          },
          {
            id: "checkout-com",
            name: "Checkout.com",
            type: "PSP Full-Stack",
            keyFeatures: ["Plataforma API modular", "Flow (orquestracao)", "Aceitacao inteligente", "Multi-moeda"],
            regions: ["Europa", "Oriente Medio", "Asia-Pacifico", "America do Norte"],
            connections: ["visa", "mastercard", "applepay", "googlepay"],
          },
          {
            id: "worldpay",
            name: "Worldpay",
            type: "Processador / Adquirente",
            keyFeatures: ["Adquirencia em larga escala", "Omni-channel", "Liquidacao global", "146+ moedas"],
            regions: ["Global"],
            connections: ["visa", "mastercard", "fiserv", "jpmorgan"],
          },
          {
            id: "dlocal",
            name: "dLocal",
            type: "PSP Mercados Emergentes",
            keyFeatures: ["Metodos locais (40+ paises)", "API unica", "Repasses cross-border", "Gestao de FX"],
            regions: ["LATAM", "Africa", "Asia"],
            connections: ["pix", "visa", "mastercard"],
          },
        ],
      },
      {
        id: "gateways",
        name: "Payment Gateways",
        icon: "🚪",
        color: "#0ea5e9",
        description: "Infraestrutura de gateway que conecta merchants a processadores de pagamento.",
        players: [
          {
            id: "braintree",
            name: "Braintree (PayPal)",
            type: "Gateway de Pagamento",
            keyFeatures: ["Integracao PayPal/Venmo", "Drop-in UI", "Vault (tokenizacao)", "GraphQL API"],
            regions: ["Global (45+ paises)"],
            connections: ["paypal", "visa", "mastercard", "applepay"],
          },
          {
            id: "authorizenet",
            name: "Authorize.Net",
            type: "Gateway de Pagamento",
            keyFeatures: ["Integracao simples", "Recurring billing", "Deteccao de fraude (AFDS)", "Virtual terminal"],
            regions: ["EUA", "Canada", "UK", "Europa"],
            connections: ["visa", "mastercard", "fiserv"],
          },
          {
            id: "pagseguro",
            name: "PagSeguro (PagBank)",
            type: "Gateway / PSP Brasil",
            keyFeatures: ["Maquininhas POS", "Checkout transparente", "PIX nativo", "Conta digital"],
            regions: ["Brasil"],
            connections: ["pix", "visa", "mastercard", "elo"],
          },
        ],
      },
      {
        id: "wallets",
        name: "Carteiras Digitais",
        icon: "📱",
        color: "#8b5cf6",
        description: "Plataformas de carteira digital que armazenam credenciais e permitem pagamentos rapidos.",
        players: [
          {
            id: "paypal",
            name: "PayPal",
            type: "Carteira Digital / P2P",
            keyFeatures: ["Protecao ao comprador", "Checkout com um toque", "PayPal Credit", "PYUSD (stablecoin)"],
            regions: ["Global (200+ mercados)"],
            connections: ["visa", "mastercard", "braintree", "pyusd"],
          },
          {
            id: "applepay",
            name: "Apple Pay",
            type: "Carteira Mobile (NFC / Web)",
            keyFeatures: ["Tokenizacao no dispositivo", "Biometria (Face ID / Touch ID)", "In-app + web", "Apple Tap to Pay"],
            regions: ["Global (70+ paises)"],
            connections: ["visa", "mastercard", "jpmorgan"],
          },
          {
            id: "googlepay",
            name: "Google Pay",
            type: "Carteira Mobile",
            keyFeatures: ["Multiplataforma (Android / Web)", "UPI (India)", "Cartoes tokenizados", "Passes de fidelidade"],
            regions: ["Global (40+ paises)"],
            connections: ["visa", "mastercard", "upi"],
          },
          {
            id: "alipay",
            name: "Alipay",
            type: "Super-App Financeiro",
            keyFeatures: ["QR code payments", "Mini-programas", "Alipay+ (cross-border)", "Zhima Credit"],
            regions: ["China", "Sudeste Asiatico"],
            connections: ["ant-group", "visa"],
          },
          {
            id: "mercadopago",
            name: "MercadoPago",
            type: "Carteira / Fintech LATAM",
            keyFeatures: ["Ecossistema MercadoLibre", "QR code", "Conta digital", "Credito / parcelamento"],
            regions: ["Brasil", "Argentina", "Mexico", "LATAM"],
            connections: ["pix", "visa", "mastercard", "mercadolivre"],
          },
          {
            id: "mpesa",
            name: "M-Pesa",
            type: "Dinheiro Mobile",
            keyFeatures: ["Pagamentos via SMS/USSD", "Rede de agentes", "Populacao desbancarizada", "B2C payouts"],
            regions: ["Quenia", "Tanzania", "Africa"],
            connections: ["safaricom", "visa"],
          },
        ],
      },
      {
        id: "bnpl",
        name: "BNPL (Compre Agora, Pague Depois)",
        icon: "🔄",
        color: "#f59e0b",
        description: "Financiamento parcelado no ponto de venda, assumindo risco de credito.",
        players: [
          {
            id: "klarna",
            name: "Klarna",
            type: "BNPL / Fintech",
            keyFeatures: ["Pague em 4", "Pague em 30 dias", "Financiamento (6-36 meses)", "App + Cartao Klarna"],
            regions: ["Europa", "America do Norte", "Australia"],
            connections: ["stripe", "adyen", "visa"],
          },
          {
            id: "affirm",
            name: "Affirm",
            type: "BNPL / Financiamento POS",
            keyFeatures: ["Precos transparentes", "Adaptive Checkout", "Debit+ Card", "Alto valor"],
            regions: ["EUA", "Canada"],
            connections: ["shopify", "stripe", "visa"],
          },
          {
            id: "afterpay",
            name: "Afterpay (Block/Square)",
            type: "BNPL",
            keyFeatures: ["Pague em 4", "Integracao Square POS", "Cash App", "Marketplace in-app"],
            regions: ["Australia", "America do Norte", "UK"],
            connections: ["square", "visa", "mastercard"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════
  // LAYER 3 — Payment Infrastructure
  // ════════════════════════════════════════════
  {
    id: "payment-infra",
    name: "Payment Infrastructure",
    icon: "🏗️",
    description:
      "Redes de cartao, adquirentes, sistemas de pagamento instantaneo e plataformas de fraude que formam a infraestrutura dos pagamentos.",
    colorFrom: "#059669",
    colorTo: "#34d399",
    categories: [
      {
        id: "card-networks",
        name: "Redes de Cartao",
        icon: "💎",
        color: "#1e3a5f",
        description: "Redes globais que roteiam transacoes entre emissores e adquirentes.",
        players: [
          {
            id: "visa",
            name: "Visa",
            type: "Rede de Cartao Global",
            keyFeatures: ["VisaNet processing", "Tokenizacao de rede (VTS)", "Visa Direct (push payments)", "Visa B2B Connect"],
            regions: ["Global (200+ paises)"],
            connections: ["jpmorgan", "citibank", "stripe", "adyen", "applepay"],
          },
          {
            id: "mastercard",
            name: "Mastercard",
            type: "Rede de Cartao Global",
            keyFeatures: ["Banknet processing", "MDES tokenizacao", "Mastercard Send", "Decision Intelligence (AI)"],
            regions: ["Global (210+ paises)"],
            connections: ["jpmorgan", "citibank", "stripe", "adyen", "googlepay"],
          },
          {
            id: "amex",
            name: "American Express",
            type: "Rede Closed-Loop",
            keyFeatures: ["Emissor + Rede combinados", "Base premium", "Altas taxas de autorizacao", "SafeKey (3DS)"],
            regions: ["America do Norte", "Europa", "Asia-Pacifico"],
            connections: ["jpmorgan", "stripe", "adyen"],
          },
          {
            id: "elo",
            name: "Elo",
            type: "Rede de Cartao Brasil",
            keyFeatures: ["Bandeira brasileira", "Parceria com bancos locais", "Debito e credito", "Contactless"],
            regions: ["Brasil"],
            connections: ["itau", "bradesco", "pagseguro"],
          },
        ],
      },
      {
        id: "acquirers",
        name: "Adquirentes",
        icon: "🏦",
        color: "#0d9488",
        description: "Bancos e empresas que processam pagamentos para merchants e fazem a liquidacao.",
        players: [
          {
            id: "fiserv",
            name: "Fiserv (First Data)",
            type: "Adquirente / Processador",
            keyFeatures: ["Clover POS", "Carat (e-commerce)", "Processamento em escala", "Omni-channel"],
            regions: ["EUA", "Europa", "LATAM"],
            connections: ["visa", "mastercard", "jpmorgan"],
          },
          {
            id: "global-payments",
            name: "Global Payments",
            type: "Adquirente Global",
            keyFeatures: ["Heartland POS", "Adquirencia integrada", "Gaming & hospitality", "Vertical solutions"],
            regions: ["America do Norte", "Europa", "Asia-Pacifico"],
            connections: ["visa", "mastercard"],
          },
          {
            id: "elavon",
            name: "Elavon (US Bancorp)",
            type: "Adquirente",
            keyFeatures: ["Adquirencia multi-moeda", "Talech POS", "Converge gateway", "Hotel & airline"],
            regions: ["America do Norte", "Europa"],
            connections: ["visa", "mastercard", "usbank"],
          },
          {
            id: "cielo",
            name: "Cielo",
            type: "Adquirente Brasil",
            keyFeatures: ["Maior adquirente do Brasil", "Maquininhas + e-commerce", "PIX nativo", "Receba Rapido (antecipacao)"],
            regions: ["Brasil"],
            connections: ["visa", "mastercard", "elo", "pix"],
          },
        ],
      },
      {
        id: "rtp-systems",
        name: "Pagamentos em Tempo Real",
        icon: "⚡",
        color: "#0ea5e9",
        description: "Sistemas de pagamento instantaneo operados por bancos centrais ou consorcio de bancos.",
        players: [
          {
            id: "pix",
            name: "PIX",
            type: "Pagamento Instantaneo",
            keyFeatures: ["24/7/365", "< 10 segundos", "Chaves PIX", "Gratuito para PF"],
            regions: ["Brasil"],
            connections: ["bacen", "itau", "nubank", "pagseguro"],
          },
          {
            id: "upi",
            name: "UPI",
            type: "Pagamento Instantaneo",
            keyFeatures: ["VPA addressing", "Interoperavel", "QR payments", "UPI Lite"],
            regions: ["India"],
            connections: ["npci", "googlepay"],
          },
          {
            id: "fednow",
            name: "FedNow",
            type: "Pagamento Instantaneo",
            keyFeatures: ["Federal Reserve", "24/7/365", "Liquidacao em segundos", "Request for Payment"],
            regions: ["EUA"],
            connections: ["federal-reserve", "jpmorgan", "citibank"],
          },
          {
            id: "faster-payments",
            name: "Faster Payments",
            type: "Pagamento Instantaneo",
            keyFeatures: ["< 2 horas (geralmente segundos)", "24/7", "Pay.UK operador", "Ate £1M por transacao"],
            regions: ["UK"],
            connections: ["bank-of-england", "barclays", "hsbc"],
          },
          {
            id: "sepa-instant",
            name: "SEPA Instant",
            type: "Pagamento Instantaneo",
            keyFeatures: ["< 10 segundos", "Zona do euro", "€100.000 limite", "TIPS settlement"],
            regions: ["Uniao Europeia"],
            connections: ["ecb", "target2"],
          },
        ],
      },
      {
        id: "fraud-risk",
        name: "Fraude & Risco",
        icon: "🛡️",
        color: "#ef4444",
        description: "Plataformas especializadas em deteccao de fraude, scoring de risco e prevencao de chargebacks.",
        players: [
          {
            id: "sift",
            name: "Sift",
            type: "Fraude & Trust Platform",
            keyFeatures: ["ML em tempo real", "Account defense", "Payment protection", "Content integrity"],
            regions: ["Global"],
            connections: ["stripe", "adyen", "shopify"],
          },
          {
            id: "riskified",
            name: "Riskified",
            type: "Garantia de Chargeback",
            keyFeatures: ["Aprovacao garantida", "ML behavorial", "Account protection", "Policy abuse"],
            regions: ["Global"],
            connections: ["shopify", "stripe", "visa"],
          },
          {
            id: "forter",
            name: "Forter",
            type: "Fraude & Identity",
            keyFeatures: ["Decisao em tempo real", "Identity graph", "Trusted conversions", "Smart routing"],
            regions: ["Global"],
            connections: ["adyen", "checkout-com", "visa"],
          },
          {
            id: "feedzai",
            name: "Feedzai",
            type: "AI Fraud / AML",
            keyFeatures: ["Financial crime AI", "AML compliance", "Real-time scoring", "Explainable AI"],
            regions: ["Global"],
            connections: ["citibank", "hsbc", "jpmorgan"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════
  // LAYER 4 — Financial Infrastructure
  // ════════════════════════════════════════════
  {
    id: "financial-infra",
    name: "Financial Infrastructure",
    icon: "🏛️",
    description:
      "Bancos emissores, provedores de infraestrutura bancaria core e sistemas de liquidacao que sustentam todo o ecossistema.",
    colorFrom: "#d97706",
    colorTo: "#fbbf24",
    categories: [
      {
        id: "issuer-banks",
        name: "Bancos Emissores",
        icon: "🏦",
        color: "#d97706",
        description: "Bancos que emitem cartoes, mantém contas e participam da liquidacao.",
        players: [
          {
            id: "jpmorgan",
            name: "JPMorgan Chase",
            type: "Banco Global / Adquirente",
            keyFeatures: ["Chase Paymentech", "Tesouraria & Pagamentos", "Custody services", "Alto volume"],
            regions: ["America do Norte", "Europa", "Asia-Pacifico"],
            connections: ["visa", "mastercard", "fednow", "swift"],
          },
          {
            id: "citibank",
            name: "Citibank",
            type: "Banco Global",
            keyFeatures: ["Treasury & Trade Solutions", "Cross-border payments", "Clearing institucional", "Multi-moeda"],
            regions: ["Global (95+ paises)"],
            connections: ["visa", "mastercard", "swift", "cls"],
          },
          {
            id: "hsbc",
            name: "HSBC",
            type: "Banco Global",
            keyFeatures: ["Global Payment Solutions", "Trade finance", "FX & tesouraria", "SWIFT gpi"],
            regions: ["Global (60+ paises)"],
            connections: ["visa", "mastercard", "swift", "faster-payments"],
          },
          {
            id: "itau",
            name: "Itau Unibanco",
            type: "Banco Emissor / Adquirente",
            keyFeatures: ["Rede (adquirencia)", "PIX processing", "Elo (bandeira)", "Cross-border LATAM"],
            regions: ["Brasil", "LATAM"],
            connections: ["visa", "mastercard", "elo", "pix", "cielo"],
          },
          {
            id: "nubank",
            name: "Nubank",
            type: "Neobank / Emissor",
            keyFeatures: ["Cartao sem anuidade", "App-first", "PIX nativo", "NuPay (checkout)"],
            regions: ["Brasil", "Mexico", "Colombia"],
            connections: ["visa", "mastercard", "pix"],
          },
          {
            id: "barclays",
            name: "Barclays",
            type: "Banco Emissor / Adquirente",
            keyFeatures: ["Barclaycard Payments", "Adquirencia UK/UE", "POS terminals", "Merchant analytics"],
            regions: ["UK", "Europa"],
            connections: ["visa", "mastercard", "faster-payments"],
          },
        ],
      },
      {
        id: "banking-infra",
        name: "Infraestrutura Bancaria",
        icon: "⚙️",
        color: "#92400e",
        description: "Provedores de core banking, processamento e software que operam por tras dos bancos.",
        players: [
          {
            id: "fis-global",
            name: "FIS",
            type: "Core Banking / Processamento",
            keyFeatures: ["Core banking (Profile)", "Modern Banking Platform", "Capital markets tech", "Worldpay (payments)"],
            regions: ["Global"],
            connections: ["jpmorgan", "visa", "worldpay"],
          },
          {
            id: "temenos",
            name: "Temenos",
            type: "Core Banking Software",
            keyFeatures: ["Temenos Transact", "Temenos Infinity (digital)", "Cloud-native", "3.000+ bancos"],
            regions: ["Global (150+ paises)"],
            connections: ["hsbc", "barclays"],
          },
          {
            id: "mambu",
            name: "Mambu",
            type: "Cloud Banking Platform",
            keyFeatures: ["SaaS composable banking", "Lending engine", "Deposit accounts", "API-first"],
            regions: ["Global"],
            connections: ["nubank", "n26"],
          },
          {
            id: "thought-machine",
            name: "Thought Machine",
            type: "Core Banking Cloud",
            keyFeatures: ["Vault Core", "Smart contracts banking", "Cloud-native", "Ledger technology"],
            regions: ["Global"],
            connections: ["jpmorgan", "nubank"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════
  // LAYER 5 — Blockchain Infrastructure
  // ════════════════════════════════════════════
  {
    id: "blockchain-infra",
    name: "Blockchain Infrastructure",
    icon: "🔗",
    description:
      "Infraestrutura cripto — exchanges, custodia, emissores de stablecoins, redes blockchain e protocolos DeFi.",
    colorFrom: "#7c3aed",
    colorTo: "#a78bfa",
    categories: [
      {
        id: "crypto-infra",
        name: "Infraestrutura Cripto",
        icon: "🔧",
        color: "#7c3aed",
        description: "Exchanges, custodiantes e provedores de infraestrutura para ativos digitais.",
        players: [
          {
            id: "coinbase",
            name: "Coinbase",
            type: "Exchange / Custodia / Infra",
            keyFeatures: ["Exchange regulada (EUA)", "Coinbase Commerce (merchants)", "Base (L2 Ethereum)", "Custodia institucional"],
            regions: ["Global (100+ paises)"],
            connections: ["usdc", "ethereum", "bitcoin", "base-l2"],
          },
          {
            id: "kraken",
            name: "Kraken",
            type: "Exchange / Trading",
            keyFeatures: ["Trading spot & futures", "Staking", "OTC desk", "Custodia"],
            regions: ["Global"],
            connections: ["bitcoin", "ethereum", "usdt", "usdc"],
          },
          {
            id: "fireblocks",
            name: "Fireblocks",
            type: "Custodia & Infra Institucional",
            keyFeatures: ["MPC wallet technology", "Tokenizacao de ativos", "DeFi access", "Compliance integrado"],
            regions: ["Global"],
            connections: ["ethereum", "solana", "usdc", "usdt"],
          },
          {
            id: "chainalysis",
            name: "Chainalysis",
            type: "Compliance & Analytics",
            keyFeatures: ["KYT (Know Your Transaction)", "Reactor (investigacao)", "Compliance blockchain", "Risk scoring"],
            regions: ["Global"],
            connections: ["coinbase", "kraken", "ethereum", "bitcoin"],
          },
        ],
      },
      {
        id: "stablecoin-issuers",
        name: "Emissores de Stablecoin",
        icon: "🪙",
        color: "#0ea5e9",
        description: "Empresas que emitem tokens digitais ancorados a moedas fiduciarias.",
        players: [
          {
            id: "circle",
            name: "Circle",
            type: "Emissor (USDC)",
            keyFeatures: ["USDC (~$45B market cap)", "Cross-Chain Transfer Protocol", "Regulado nos EUA", "Circle Mint (API)"],
            regions: ["Global"],
            connections: ["usdc", "ethereum", "solana", "coinbase", "visa"],
          },
          {
            id: "tether",
            name: "Tether",
            type: "Emissor (USDT)",
            keyFeatures: ["USDT (~$140B market cap)", "Maior stablecoin", "Multi-chain", "Reservas em T-Bills"],
            regions: ["Global (forte em LATAM, Asia)"],
            connections: ["usdt", "ethereum", "tron", "kraken"],
          },
          {
            id: "paxos",
            name: "Paxos",
            type: "Emissor (USDP / PYUSD)",
            keyFeatures: ["PYUSD (PayPal)", "Pax Dollar (USDP)", "Regulado em NY", "Tokenizacao de ativos"],
            regions: ["EUA", "Global"],
            connections: ["pyusd", "paypal", "ethereum"],
          },
        ],
      },
      {
        id: "blockchain-networks",
        name: "Redes Blockchain",
        icon: "⛓️",
        color: "#4f46e5",
        description: "Blockchains Layer 1 e Layer 2 que processam transacoes on-chain.",
        players: [
          {
            id: "ethereum",
            name: "Ethereum",
            type: "Layer 1 (Smart Contracts)",
            keyFeatures: ["Smart contracts (EVM)", "Proof-of-Stake", "DeFi dominante", "L2 ecosystem"],
            regions: ["Global (descentralizado)"],
            connections: ["usdc", "usdt", "uniswap", "aave", "makerdao"],
          },
          {
            id: "bitcoin",
            name: "Bitcoin",
            type: "Layer 1 (Store of Value)",
            keyFeatures: ["Proof-of-Work", "Lightning Network (L2)", "Digital gold", "21M supply cap"],
            regions: ["Global (descentralizado)"],
            connections: ["coinbase", "kraken", "lightning"],
          },
          {
            id: "solana",
            name: "Solana",
            type: "Layer 1 (High Performance)",
            keyFeatures: ["65K TPS teorico", "Proof-of-History", "Baixas taxas ($0.001)", "Solana Pay"],
            regions: ["Global (descentralizado)"],
            connections: ["usdc", "coinbase", "fireblocks", "circle"],
          },
        ],
      },
      {
        id: "defi-protocols",
        name: "Protocolos DeFi",
        icon: "🌀",
        color: "#ec4899",
        description: "Protocolos de financas descentralizadas que operam on-chain sem intermediarios.",
        players: [
          {
            id: "uniswap",
            name: "Uniswap",
            type: "DEX (Automated Market Maker)",
            keyFeatures: ["AMM pools", "UNI governance", "Multi-chain", "Concentrated liquidity (v3)"],
            regions: ["Global (permissionless)"],
            connections: ["ethereum", "usdc", "usdt"],
          },
          {
            id: "aave",
            name: "Aave",
            type: "Lending / Borrowing",
            keyFeatures: ["Flash loans", "Variable/stable rates", "GHO stablecoin", "Multi-chain"],
            regions: ["Global (permissionless)"],
            connections: ["ethereum", "usdc", "usdt"],
          },
          {
            id: "makerdao",
            name: "MakerDAO",
            type: "CDP / Stablecoin (DAI)",
            keyFeatures: ["DAI stablecoin", "Collateralized debt", "RWA integration", "MKR governance"],
            regions: ["Global (permissionless)"],
            connections: ["ethereum", "dai", "usdc"],
          },
        ],
      },
    ],
  },
];

// ─── Knowledge Graph Connections ───

export interface GraphConnection {
  from: string;
  to: string;
  relationship: string;
  description: string;
}

export const knowledgeGraphConnections: GraphConnection[] = [
  // Merchant → PSP
  { from: "Shopify", to: "Stripe", relationship: "processes_payments_via", description: "Shopify Payments e powered by Stripe" },
  { from: "Amazon", to: "Visa", relationship: "accepts", description: "Visa e o principal metodo de pagamento aceito" },
  { from: "Uber", to: "Adyen", relationship: "processes_payments_via", description: "Adyen processa pagamentos globais da Uber" },

  // PSP → Card Network
  { from: "Stripe", to: "Visa", relationship: "routes_through", description: "Transacoes de cartao roteadas pela VisaNet" },
  { from: "Stripe", to: "Mastercard", relationship: "routes_through", description: "Transacoes de cartao roteadas pela Banknet" },
  { from: "Adyen", to: "Visa", relationship: "acquires_for", description: "Adyen atua como adquirente direto para Visa" },

  // Card Network → Bank
  { from: "Visa", to: "JPMorgan Chase", relationship: "settles_with", description: "JPMorgan e emissor e adquirente Visa" },
  { from: "Mastercard", to: "Citibank", relationship: "settles_with", description: "Citibank e emissor global Mastercard" },

  // Stablecoin → Blockchain
  { from: "USDC", to: "Ethereum", relationship: "runs_on", description: "USDC opera como token ERC-20 na Ethereum" },
  { from: "USDC", to: "Solana", relationship: "runs_on", description: "USDC tem emissao nativa na Solana via CCTP" },
  { from: "USDT", to: "Ethereum", relationship: "runs_on", description: "USDT e o maior token ERC-20 por market cap" },

  // Issuer → Stablecoin
  { from: "Circle", to: "USDC", relationship: "issues", description: "Circle e o emissor exclusivo do USDC" },
  { from: "Tether", to: "USDT", relationship: "issues", description: "Tether Ltd emite e gerencia reservas do USDT" },
  { from: "PayPal", to: "PYUSD", relationship: "issues_via", description: "PYUSD emitido via Paxos para PayPal" },

  // DeFi → Blockchain
  { from: "Uniswap", to: "Ethereum", relationship: "deployed_on", description: "Uniswap e o maior DEX da Ethereum" },
  { from: "Aave", to: "Ethereum", relationship: "deployed_on", description: "Aave opera lending pools na Ethereum e L2s" },

  // Traditional → Crypto bridges
  { from: "Visa", to: "USDC", relationship: "settles_in", description: "Visa aceita liquidacao em USDC via Ethereum e Solana" },
  { from: "Stripe", to: "USDC", relationship: "enables_payouts_in", description: "Stripe permite payouts em USDC para merchants" },
  { from: "Coinbase", to: "Visa", relationship: "issues_card_via", description: "Coinbase Card permite gastar cripto via rede Visa" },
];

// ─── Helpers ───

/** Conta total de players */
export function getTotalPlayers(): number {
  return ecosystemLayers.reduce(
    (total, layer) =>
      total + layer.categories.reduce((catTotal, cat) => catTotal + cat.players.length, 0),
    0
  );
}

/** Conta total de categorias */
export function getTotalCategories(): number {
  return ecosystemLayers.reduce((total, layer) => total + layer.categories.length, 0);
}
