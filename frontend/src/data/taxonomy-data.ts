/**
 * Taxonomia Completa de Pagamentos, Fintech e Cripto.
 *
 * O "dicionário estrutural do sistema financeiro digital" — organiza conceitos
 * em 9 categorias hierárquicas com ~200+ itens. Alimenta: Features Database,
 * Knowledge Graph, Busca Global, Conta Comigo e Simulações.
 */

// ─── Types ───

export interface TaxonomyItem {
  id: string;
  label: string;
  description?: string;
  children?: TaxonomyItem[];
}

// ─── Taxonomy Tree ───

export const TAXONOMY: TaxonomyItem[] = [
  // ════════════════════════════════════════
  // 1. PAYMENTS CORE
  // ════════════════════════════════════════
  {
    id: "payments-core",
    label: "Payments Core",
    description:
      "Categoria central — meios de pagamento, fluxos de transacao e operacoes que formam o nucleo de qualquer sistema de pagamentos.",
    children: [
      {
        id: "payment-methods",
        label: "Meios de Pagamento",
        description: "Todos os instrumentos que um consumidor ou empresa pode usar para pagar.",
        children: [
          {
            id: "card-payments",
            label: "Pagamentos com Cartao",
            description: "Pagamentos via redes de cartao de credito, debito ou pre-pago.",
            children: [
              { id: "credit-card", label: "Cartoes de Credito", description: "Linha de credito rotativo emitida por um banco." },
              { id: "debit-card", label: "Cartoes de Debito", description: "Debita diretamente a conta bancaria do portador." },
              { id: "prepaid-card", label: "Cartoes Pre-pagos", description: "Carregados com fundos antes do uso." },
              { id: "virtual-card", label: "Cartoes Virtuais", description: "Numeros de cartao emitidos digitalmente para uso online." },
              { id: "corporate-card", label: "Cartoes Corporativos", description: "Cartoes emitidos pela empresa para despesas de funcionarios." },
              { id: "cnp", label: "Card Not Present (CNP)", description: "Transacao sem presenca fisica do cartao (e-commerce)." },
              { id: "cp", label: "Card Present (CP)", description: "Transacao com presenca fisica do cartao (POS terminal)." },
            ],
          },
          {
            id: "bank-transfers",
            label: "Transferencias Bancarias",
            description: "Transferencias diretas conta-a-conta via trilhos bancarios.",
            children: [
              { id: "wire-transfer", label: "Wire Transfer", description: "Liquidacao no mesmo dia, banco-a-banco, de alto valor." },
              { id: "ach", label: "ACH / Debito Direto", description: "Transferencias bancarias em lote (EUA)." },
              { id: "sepa", label: "Transferencia SEPA", description: "Transferencias em euro padronizadas pela Europa." },
              { id: "direct-debit", label: "Debito Direto", description: "Debito automatico autorizado pelo titular da conta." },
            ],
          },
          {
            id: "realtime-payments",
            label: "Pagamentos em Tempo Real",
            description: "Sistemas de pagamento instantaneo operados por bancos centrais ou consorcios.",
            children: [
              { id: "pix", label: "PIX (Brasil)", description: "Pagamento instantaneo 24/7 do Banco Central do Brasil." },
              { id: "upi", label: "UPI (India)", description: "Interface Unificada de Pagamentos para transferencias moveis." },
              { id: "fednow", label: "FedNow (EUA)", description: "Sistema de pagamento instantaneo do Federal Reserve." },
              { id: "faster-payments", label: "Faster Payments (UK)", description: "Pagamentos rapidos operados pelo Bank of England." },
              { id: "sepa-instant", label: "SEPA Instant (UE)", description: "Pagamentos instantaneos em euros na zona SEPA." },
            ],
          },
          {
            id: "digital-wallets",
            label: "Carteiras Digitais",
            description: "Conteineres baseados em software para credenciais de pagamento.",
            children: [
              { id: "mobile-wallets", label: "Carteiras Mobile", description: "Apple Pay, Google Pay, Samsung Pay — NFC + in-app." },
              { id: "super-apps", label: "Super Apps", description: "Alipay, WeChat Pay, GrabPay — ecosistema completo." },
              { id: "embedded-wallets", label: "Embedded Wallets", description: "Wallets integradas dentro de outras plataformas." },
              { id: "crypto-wallets", label: "Crypto Wallets", description: "MetaMask, Phantom — custodia de ativos digitais." },
            ],
          },
          {
            id: "bnpl",
            label: "Buy Now Pay Later (BNPL)",
            description: "Opcoes de pagamento parcelado no checkout.",
            children: [
              { id: "pay-in-4", label: "Pague em 4", description: "Divide compra em 4 parcelas sem juros (Klarna, Afterpay)." },
              { id: "pay-later", label: "Pague Depois", description: "Prazo de 30 dias para pagamento completo." },
              { id: "installment-plan", label: "Financiamento Parcelado", description: "6-36 meses com juros (Affirm)." },
            ],
          },
          {
            id: "crypto-payments",
            label: "Pagamentos Cripto",
            description: "Pagamentos utilizando criptomoedas nativas ou stablecoins.",
            children: [
              { id: "stablecoin-payments", label: "Pagamentos com Stablecoin", description: "USDC, USDT, PYUSD — valor ancorado ao fiat." },
              { id: "native-crypto-pay", label: "Pagamentos com Crypto Nativa", description: "BTC, ETH, SOL para transferencia de valor." },
              { id: "lightning-payments", label: "Lightning Network", description: "Layer 2 do Bitcoin para micropagamentos instantaneos." },
            ],
          },
          {
            id: "cash-voucher",
            label: "Dinheiro e Voucher",
            description: "Metodos de pagamento offline baseados em dinheiro.",
            children: [
              { id: "boleto", label: "Boleto Bancario", description: "Boleto brasileiro pagavel em bancos ou loterias." },
              { id: "oxxo", label: "OXXO (Mexico)", description: "Pagamento em dinheiro via voucher de conveniencia." },
              { id: "cash-on-delivery", label: "Cash on Delivery", description: "Pagamento em dinheiro na entrega." },
            ],
          },
        ],
      },
      {
        id: "payment-flows",
        label: "Fluxos de Pagamento",
        description: "Etapas de uma transacao do inicio a liquidacao.",
        children: [
          { id: "authorization", label: "Autorizacao", description: "Pedido ao emissor para reservar fundos do portador." },
          { id: "capture", label: "Captura", description: "Confirmacao de que os fundos devem ser transferidos." },
          { id: "clearing", label: "Clearing (Compensacao)", description: "Troca de informacoes de transacao entre emissor e adquirente." },
          { id: "settlement-flow", label: "Liquidacao", description: "Transferencia efetiva de fundos entre as partes." },
          { id: "auth-capture", label: "Auth + Capture", description: "Autorizacao e captura em uma unica chamada." },
          { id: "pre-auth", label: "Pre-Autorizacao", description: "Reserva de fundos sem captura imediata (hoteis, locadoras)." },
          { id: "void", label: "Void / Cancelamento", description: "Cancelamento de uma autorizacao antes da captura." },
          { id: "refund", label: "Reembolso", description: "Devolucao de fundos ja capturados ao portador." },
          { id: "partial-capture", label: "Captura Parcial", description: "Captura de valor menor que o autorizado." },
        ],
      },
      {
        id: "payment-operations",
        label: "Operacoes de Pagamento",
        description: "Processos operacionais do dia-a-dia de pagamentos.",
        children: [
          { id: "reconciliation", label: "Conciliacao", description: "Match de registros entre gateway, adquirente e banco." },
          { id: "payouts", label: "Payouts / Desembolsos", description: "Transferencias para vendedores, motoristas ou prestadores." },
          { id: "split-payments", label: "Split Payments", description: "Distribuicao de fundos entre multiplos recebedores." },
          { id: "recurring-billing", label: "Cobranca Recorrente", description: "Pagamentos automaticos em intervalos regulares." },
          { id: "refund-management", label: "Gestao de Reembolsos", description: "Processamento e tracking de devolucoes." },
          { id: "treasury-ops", label: "Operacoes de Tesouraria", description: "Gestao de liquidez, FX e cash management." },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // 2. PAYMENT INFRASTRUCTURE
  // ════════════════════════════════════════
  {
    id: "payment-infra",
    label: "Payment Infrastructure",
    description:
      "Componentes tecnicos que roteiam, autorizam e processam transacoes — PSPs, gateways, orquestracao e redes.",
    children: [
      {
        id: "psps",
        label: "Payment Service Providers (PSPs)",
        description: "Plataformas que conectam merchants ao sistema financeiro.",
        children: [
          { id: "full-stack-psp", label: "PSP Full-Stack", description: "Gateway + processamento + adquirencia integrados (Stripe, Adyen)." },
          { id: "aggregator-psp", label: "PSP Agregador", description: "Merchants transacionam sob o MID do PSP (PayFac)." },
          { id: "local-psp", label: "PSP Local", description: "Especializado em metodos de pagamento de uma regiao (dLocal)." },
        ],
      },
      {
        id: "payment-gateway",
        label: "Payment Gateways",
        description: "Ponto de entrada que aceita requisicoes e roteia para processadores.",
        children: [
          { id: "api-gateway", label: "API Gateway", description: "Endpoints REST/GraphQL para iniciacao de pagamento." },
          { id: "hosted-checkout", label: "Hosted Checkout", description: "Pagina de checkout hospedada pelo PSP." },
          { id: "hosted-fields", label: "Hosted Fields / iFrames", description: "Componentes UI que reduzem escopo PCI." },
          { id: "sdk-client", label: "SDKs Cliente", description: "Bibliotecas mobile/web para captura segura de dados." },
        ],
      },
      {
        id: "acquirers-processors",
        label: "Adquirentes e Processadores",
        description: "Entidades que processam autorizacao e captura com bandeiras.",
        children: [
          { id: "acquirer-bank", label: "Banco Adquirente", description: "Banco que processa transacoes para merchants." },
          { id: "processor", label: "Processador", description: "Entidade tecnica que roteia mensagens para bandeiras." },
          { id: "payfac", label: "Facilitador de Pagamento (PayFac)", description: "Agregador pelo qual sub-merchants transacionam." },
          { id: "iso", label: "ISO (Independent Sales Org)", description: "Revende servicos de adquirencia para merchants." },
        ],
      },
      {
        id: "card-networks",
        label: "Redes de Cartao (Schemes)",
        description: "Redes que conectam emissores e adquirentes.",
        children: [
          { id: "visa-network", label: "Visa (VisaNet)", description: "Bandeira global operando a VisaNet." },
          { id: "mastercard-network", label: "Mastercard (Banknet)", description: "Bandeira global operando a Banknet." },
          { id: "amex-network", label: "American Express", description: "Rede fechada (emissor + adquirente)." },
          { id: "elo-network", label: "Elo (Brasil)", description: "Bandeira domestica brasileira." },
          { id: "unionpay-network", label: "UnionPay (China)", description: "Maior rede de cartao do mundo por volume." },
        ],
      },
      {
        id: "payment-orchestration",
        label: "Orquestracao de Pagamento",
        description: "Camada inteligente de roteamento, retentativas e failover.",
        children: [
          { id: "smart-routing", label: "Smart Routing", description: "Seleciona adquirente ideal com base em regras e ML." },
          { id: "multi-acquirer", label: "Multi-Acquirer", description: "Roteamento entre multiplos adquirentes para redundancia." },
          { id: "retry-logic", label: "Retry Logic", description: "Retentativas automaticas baseadas em codigos de recusa." },
          { id: "bin-routing", label: "BIN Routing", description: "Roteamento baseado no BIN do cartao do portador." },
          { id: "payment-failover", label: "Payment Failover", description: "Failover automatico para processador backup." },
          { id: "cascading", label: "Cascading", description: "Tentativa sequencial em multiplos processadores." },
        ],
      },
      {
        id: "issuers",
        label: "Emissores (Issuers)",
        description: "Bancos que emitem cartoes e autorizam transacoes.",
        children: [
          { id: "issuer-bank", label: "Banco Emissor", description: "Banco que emite o cartao ao portador." },
          { id: "co-brand", label: "Co-Brand Issuing", description: "Emissao de cartao em parceria (ex: Nubank + Mastercard)." },
          { id: "virtual-issuing", label: "Virtual Card Issuing", description: "Emissao de cartoes virtuais via API (Marqeta, Lithic)." },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // 3. FRAUD & RISK
  // ════════════════════════════════════════
  {
    id: "fraud-risk",
    label: "Fraud & Risk",
    description:
      "Prevencao, deteccao e gestao de fraude, disputas e chargebacks.",
    children: [
      {
        id: "fraud-prevention",
        label: "Prevencao de Fraude",
        description: "Estrategias e ferramentas para bloquear fraude antes que aconteca.",
        children: [
          { id: "3ds-auth", label: "3D Secure (3DS)", description: "Autenticacao do portador com o emissor (SCA)." },
          { id: "avs", label: "AVS (Address Verification)", description: "Verificacao de endereco do portador." },
          { id: "cvv-check", label: "CVV/CVC Check", description: "Verificacao do codigo de seguranca do cartao." },
          { id: "velocity-checks", label: "Velocity Checks", description: "Limites de frequencia e valor de transacoes." },
          { id: "blocklists", label: "Blocklists / Allowlists", description: "Listas de BINs, IPs ou emails bloqueados/permitidos." },
        ],
      },
      {
        id: "fraud-detection",
        label: "Deteccao de Fraude",
        description: "Ferramentas para identificar fraude em tempo real.",
        children: [
          { id: "ml-scoring", label: "Risk Scoring com ML", description: "Modelos de machine learning para scoring em tempo real." },
          { id: "rules-engine", label: "Motor de Regras", description: "Regras configuraveis de velocidade, valor e padrao." },
          { id: "device-fingerprint", label: "Device Fingerprinting", description: "Identifica dispositivos entre sessoes." },
          { id: "behavioral-biometrics", label: "Biometria Comportamental", description: "Analise de padrao de digitacao, mouse e toque." },
          { id: "bot-detection", label: "Bot Detection", description: "Identificacao de trafego automatizado / bots." },
          { id: "network-analysis", label: "Network Analysis", description: "Grafo de conexoes entre contas e dispositivos." },
        ],
      },
      {
        id: "fraud-types",
        label: "Tipos de Fraude",
        description: "Categorias de fraude encontradas em pagamentos digitais.",
        children: [
          { id: "card-testing", label: "Card Testing", description: "Testes em massa de cartoes roubados com transacoes pequenas." },
          { id: "stolen-cards", label: "Cartoes Roubados", description: "Uso de dados de cartao obtidos ilegalmente." },
          { id: "account-takeover", label: "Account Takeover (ATO)", description: "Acesso nao autorizado a contas de usuarios." },
          { id: "synthetic-identity", label: "Identidade Sintetica", description: "Criacao de identidades falsas combinando dados reais e ficticios." },
          { id: "refund-abuse", label: "Refund Abuse", description: "Pedidos de reembolso fraudulentos apos receber o produto." },
          { id: "friendly-fraud", label: "Friendly Fraud", description: "Chargebacks iniciados pelo portador real alegando fraude." },
          { id: "triangulation-fraud", label: "Triangulation Fraud", description: "Merchant falso vende item e paga com cartao roubado." },
        ],
      },
      {
        id: "chargebacks",
        label: "Chargebacks & Disputas",
        description: "Ciclo de vida de disputas de transacao.",
        children: [
          { id: "chargeback-lifecycle", label: "Ciclo de Chargeback", description: "Desde a disputa do portador ate resolucao final." },
          { id: "representment", label: "Representment", description: "Submissao de evidencias pelo merchant para contestar." },
          { id: "pre-arbitration", label: "Pre-Arbitragem", description: "Segunda rodada de disputa antes da arbitragem." },
          { id: "arbitration", label: "Arbitragem", description: "Decisao final pela bandeira de cartao." },
          { id: "evidence-mgmt", label: "Gestao de Evidencias", description: "Coleta e organizacao de provas para contestacao." },
          { id: "chargeback-monitoring", label: "Monitoramento de Chargeback", description: "VDMP (Visa) e ECM (Mastercard) — programas de monitoramento." },
        ],
      },
      {
        id: "compliance",
        label: "Compliance Regulatorio",
        description: "Regulamentacoes regionais e globais de pagamento.",
        children: [
          { id: "pci-dss", label: "PCI DSS", description: "Padrao de Seguranca de Dados da Industria de Cartoes." },
          { id: "psd2-sca", label: "PSD2 / SCA (UE)", description: "Strong Customer Authentication para pagamentos europeus." },
          { id: "aml-cft", label: "AML / CFT", description: "Anti-lavagem de dinheiro e combate ao financiamento do terrorismo." },
          { id: "kyc", label: "KYC (Know Your Customer)", description: "Verificacao de identidade de clientes." },
          { id: "gdpr", label: "GDPR", description: "Regulamentacao europeia de protecao de dados." },
          { id: "tokenization-sec", label: "Tokenizacao", description: "Substituicao de PANs por tokens nao sensiveis." },
          { id: "encryption", label: "Criptografia E2E", description: "Criptografia ponta-a-ponta de dados de pagamento." },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // 4. FINANCIAL INFRASTRUCTURE
  // ════════════════════════════════════════
  {
    id: "financial-infra",
    label: "Financial Infrastructure",
    description:
      "Infraestrutura financeira global — bancos centrais, comerciais, sistemas de clearing e liquidacao.",
    children: [
      {
        id: "central-banks",
        label: "Bancos Centrais",
        description: "Autoridades monetarias que emitem moeda e regulam o sistema financeiro.",
        children: [
          { id: "federal-reserve", label: "Federal Reserve (EUA)", description: "Banco central dos EUA — opera Fedwire e FedNow." },
          { id: "ecb", label: "Banco Central Europeu (BCE)", description: "Autoridade monetaria da zona do euro — opera T2 (antigo TARGET2) e TIPS." },
          { id: "bacen", label: "Banco Central do Brasil", description: "Opera o PIX e regula o SFN." },
          { id: "boe", label: "Bank of England", description: "Banco central do UK — opera CHAPS." },
          { id: "cbdc", label: "CBDCs (Moedas Digitais)", description: "Moedas digitais de banco central em pesquisa/piloto." },
        ],
      },
      {
        id: "commercial-banks",
        label: "Bancos Comerciais",
        description: "Bancos que operam contas, emprestimos e servciso de pagamento.",
        children: [
          { id: "issuer-banks", label: "Bancos Emissores", description: "Emitem cartoes e autorizam transacoes (JPMorgan, Citi)." },
          { id: "correspondent-banks", label: "Bancos Correspondentes", description: "Facilitam pagamentos cross-border entre bancos." },
          { id: "neobanks", label: "Neobanks", description: "Bancos digitais sem agencia (Nubank, N26, Revolut)." },
          { id: "custodian-banks", label: "Bancos Custodiantes", description: "Custodia de ativos e valores mobiliarios." },
        ],
      },
      {
        id: "clearing-houses",
        label: "Camaras de Compensacao",
        description: "Entidades que fazem netting e clearing de transacoes.",
        children: [
          { id: "ccp", label: "CCP (Central Counterparty)", description: "Contraparte central que garante liquidacao." },
          { id: "ach-clearing", label: "ACH Clearing", description: "Compensacao em lote de transferencias bancarias." },
          { id: "check-clearing", label: "Check Clearing", description: "Compensacao de cheques entre bancos." },
        ],
      },
      {
        id: "settlement-systems",
        label: "Sistemas de Liquidacao",
        description: "Sistemas de liquidacao bruta/liquida em tempo real.",
        children: [
          { id: "rtgs", label: "RTGS (Real-Time Gross Settlement)", description: "Liquidacao bruta em tempo real (Fedwire, T2, CHAPS)." },
          { id: "dns", label: "DNS (Deferred Net Settlement)", description: "Compensacao multilateral netting (CHIPS)." },
          { id: "pvp", label: "PvP (Payment vs Payment)", description: "Liquidacao vinculada de duas pernas FX (CLS)." },
          { id: "swift-messaging", label: "SWIFT (Mensageria)", description: "Rede global de mensageria interbancaria (42M msgs/dia)." },
        ],
      },
      {
        id: "fmi",
        label: "Infraestrutura de Mercado Financeiro",
        description: "Sistemas criticos que garantem estabilidade do mercado.",
        children: [
          { id: "csd", label: "Depositarias de Titulos (CSD)", description: "Custodiam e transferem titulos (DTCC, Euroclear)." },
          { id: "trade-repos", label: "Trade Repositories", description: "Registram derivativos OTC para transparencia." },
          { id: "payment-networks", label: "Redes de Pagamento", description: "Redes que processam pagamentos entre instituicoes." },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // 5. CRYPTO & BLOCKCHAIN
  // ════════════════════════════════════════
  {
    id: "crypto-blockchain",
    label: "Crypto & Blockchain",
    description:
      "Infraestrutura descentralizada — redes blockchain, criptomoedas, stablecoins, smart contracts e wallets.",
    children: [
      {
        id: "blockchain-networks",
        label: "Redes Blockchain",
        description: "Infraestrutura descentralizada que processa transacoes on-chain.",
        children: [
          { id: "layer1", label: "Layer 1", description: "Blockchains base — Bitcoin, Ethereum, Solana." },
          { id: "layer2", label: "Layer 2", description: "Redes de escala sobre L1 — Arbitrum, Optimism, Base, Lightning." },
          { id: "sidechains", label: "Sidechains", description: "Blockchains independentes conectadas a uma L1 (Polygon PoS)." },
          { id: "consensus", label: "Mecanismos de Consenso", description: "Proof-of-Work, Proof-of-Stake, Proof-of-History." },
        ],
      },
      {
        id: "cryptocurrencies",
        label: "Criptomoedas",
        description: "Moedas digitais nativas de redes blockchain.",
        children: [
          { id: "bitcoin", label: "Bitcoin (BTC)", description: "Primeira criptomoeda — store of value, 21M supply cap." },
          { id: "ether", label: "Ether (ETH)", description: "Token nativo da Ethereum — gas para smart contracts." },
          { id: "sol", label: "Solana (SOL)", description: "Token nativo da Solana — alta performance e baixas taxas." },
        ],
      },
      {
        id: "stablecoins",
        label: "Stablecoins",
        description: "Tokens digitais com valor ancorado a moedas fiduciarias.",
        children: [
          { id: "fiat-backed", label: "Fiat-Backed", description: "Lastreada em reservas fiat (USDC, USDT, PYUSD)." },
          { id: "crypto-backed", label: "Crypto-Collateralized", description: "Lastreada em cripto com overcollateralization (DAI)." },
          { id: "algorithmic", label: "Algoritmicas", description: "Mantém peg via algoritmo (historicamente frageis)." },
          { id: "usdc", label: "USDC (Circle)", description: "Stablecoin regulada nos EUA — ~$45B market cap." },
          { id: "usdt", label: "USDT (Tether)", description: "Maior stablecoin do mundo — ~$140B market cap." },
          { id: "pyusd", label: "PYUSD (PayPal)", description: "Stablecoin do PayPal emitida via Paxos." },
        ],
      },
      {
        id: "smart-contracts",
        label: "Smart Contracts",
        description: "Codigo autoexecutavel deployado em blockchains.",
        children: [
          { id: "evm", label: "EVM (Ethereum Virtual Machine)", description: "Ambiente de execucao padrao para smart contracts." },
          { id: "solidity", label: "Solidity", description: "Linguagem principal para smart contracts Ethereum." },
          { id: "token-standards", label: "Token Standards", description: "ERC-20 (fungivel), ERC-721 (NFT), ERC-1155 (multi)." },
          { id: "audits", label: "Auditorias de Smart Contract", description: "Revisao de seguranca de codigo on-chain." },
        ],
      },
      {
        id: "crypto-wallets",
        label: "Wallets Cripto",
        description: "Software para custodia e transacao de ativos digitais.",
        children: [
          { id: "hot-wallet", label: "Hot Wallets", description: "Conectadas a internet (MetaMask, Phantom)." },
          { id: "cold-wallet", label: "Cold Wallets", description: "Offline para maximo seguranca (Ledger, Trezor)." },
          { id: "mpc-wallet", label: "MPC Wallets", description: "Multi-Party Computation para custodia institucional." },
          { id: "smart-wallet", label: "Smart Contract Wallets", description: "Account abstraction (ERC-4337) para UX melhorada." },
        ],
      },
      {
        id: "crypto-infra",
        label: "Infraestrutura Cripto",
        description: "Exchanges, custodiantes e ferramentas de compliance.",
        children: [
          { id: "cex", label: "Exchanges Centralizadas (CEX)", description: "Coinbase, Kraken, Binance — order book centralizado." },
          { id: "custodians", label: "Custodiantes", description: "Fireblocks, BitGo — custodia institucional." },
          { id: "on-ramps", label: "On-Ramps (Fiat → Cripto)", description: "MoonPay, Ramp, Transak — conversao de fiat." },
          { id: "off-ramps", label: "Off-Ramps (Cripto → Fiat)", description: "Conversao de cripto para moeda local." },
          { id: "chain-analytics", label: "Chain Analytics", description: "Chainalysis, Elliptic — compliance blockchain." },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // 6. DeFi
  // ════════════════════════════════════════
  {
    id: "defi",
    label: "DeFi (Financas Descentralizadas)",
    description:
      "Protocolos financeiros que operam on-chain sem intermediarios — exchanges, lending, liquidity pools.",
    children: [
      {
        id: "dex",
        label: "Exchanges Descentralizadas (DEX)",
        description: "Trading peer-to-peer sem intermediarios.",
        children: [
          { id: "amm", label: "AMM (Automated Market Maker)", description: "Uniswap, Curve — liquidez via pools algoritmicos." },
          { id: "orderbook-dex", label: "Order Book DEX", description: "dYdX, Serum — order book on-chain." },
          { id: "aggregators", label: "DEX Aggregators", description: "1inch, Paraswap — encontram melhor preco entre DEXs." },
        ],
      },
      {
        id: "lending-protocols",
        label: "Protocolos de Lending",
        description: "Emprestimo e tomada de emprestimo descentralizado.",
        children: [
          { id: "overcollateralized", label: "Overcollateralized Lending", description: "Aave, Compound — emprestimo com garantia > 100%." },
          { id: "flash-loans", label: "Flash Loans", description: "Emprestimo sem garantia que deve ser pago no mesmo bloco." },
          { id: "undercollateralized", label: "Undercollateralized Lending", description: "Maple, Goldfinch — emprestimos para instituicoes." },
        ],
      },
      {
        id: "liquidity",
        label: "Pools de Liquidez",
        description: "Mecanismos para provisao de liquidez on-chain.",
        children: [
          { id: "lp-tokens", label: "LP Tokens", description: "Tokens que representam participacao em pool de liquidez." },
          { id: "concentrated-liquidity", label: "Concentrated Liquidity", description: "Uniswap v3 — liquidez em faixas de preco especificas." },
          { id: "impermanent-loss", label: "Impermanent Loss", description: "Risco de perda temporaria para provedores de liquidez." },
        ],
      },
      {
        id: "yield",
        label: "Yield Farming & Staking",
        description: "Estrategias para gerar rendimento com ativos cripto.",
        children: [
          { id: "staking", label: "Staking", description: "Travamento de tokens para validar rede e receber recompensas." },
          { id: "liquid-staking", label: "Liquid Staking", description: "Staking com token liquido (Lido stETH, Rocket Pool rETH)." },
          { id: "yield-farming", label: "Yield Farming", description: "Provisao de liquidez em troca de recompensas." },
        ],
      },
      {
        id: "defi-derivatives",
        label: "Derivativos DeFi",
        description: "Instrumentos financeiros derivativos on-chain.",
        children: [
          { id: "perps", label: "Perpetual Futures", description: "Futuros sem vencimento (GMX, dYdX)." },
          { id: "options-defi", label: "Opcoes On-chain", description: "Lyra, Dopex — opcoes descentralizadas." },
          { id: "synthetic-assets", label: "Ativos Sinteticos", description: "Synthetix — exposicao a ativos reais on-chain." },
        ],
      },
      {
        id: "defi-stablecoins",
        label: "Stablecoins DeFi",
        description: "Stablecoins nativas de protocolos DeFi.",
        children: [
          { id: "dai", label: "DAI (Sky, antigo MakerDAO)", description: "Stablecoin descentralizada com backing cripto + RWA." },
          { id: "gho", label: "GHO (Aave)", description: "Stablecoin nativa do protocolo Aave." },
          { id: "frax", label: "FRAX", description: "Stablecoin 100% colateralizada (v3), anteriormente parcialmente algoritmica." },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // 7. PAYMENT METRICS
  // ════════════════════════════════════════
  {
    id: "payment-metrics",
    label: "Payment Metrics",
    description:
      "Metricas fundamentais para medir a saude e performance de um sistema de pagamentos.",
    children: [
      {
        id: "conversion-metrics",
        label: "Metricas de Conversao",
        description: "Medem a eficacia do funil de pagamento.",
        children: [
          { id: "approval-rate", label: "Approval Rate (Taxa de Aprovacao)", description: "% de autorizacoes aprovadas pelo emissor." },
          { id: "conversion-rate", label: "Conversion Rate (Taxa de Conversao)", description: "% de tentativas de pagamento que completam com sucesso." },
          { id: "auth-success", label: "Authorization Success Rate", description: "% de autorizacoes bem-sucedidas na primeira tentativa." },
          { id: "retry-success", label: "Retry Success Rate", description: "% de autorizacoes recuperadas apos retentativa." },
        ],
      },
      {
        id: "risk-metrics",
        label: "Metricas de Risco",
        description: "Medem o nivel de fraude e disputas.",
        children: [
          { id: "fraud-rate", label: "Fraud Rate (Taxa de Fraude)", description: "% de transacoes identificadas como fraude." },
          { id: "chargeback-rate", label: "Chargeback Rate", description: "% de transacoes que viram chargeback (limite Visa: 0.9%)." },
          { id: "false-positive-rate", label: "False Positive Rate", description: "% de transacoes legitimas bloqueadas por fraude." },
          { id: "false-decline-rate", label: "False Decline Rate", description: "% de transacoes boas recusadas pelo emissor." },
        ],
      },
      {
        id: "operational-metrics",
        label: "Metricas Operacionais",
        description: "Medem a performance tecnica e operacional.",
        children: [
          { id: "payment-latency", label: "Payment Latency", description: "Tempo total da requisicao ate resposta de autorizacao." },
          { id: "uptime", label: "Uptime / Disponibilidade", description: "% de tempo que o sistema esta operacional." },
          { id: "settlement-time", label: "Settlement Time", description: "Tempo da captura ate o deposito na conta do merchant." },
          { id: "recon-accuracy", label: "Reconciliation Accuracy", description: "% de transacoes conciliadas sem discrepancia." },
        ],
      },
      {
        id: "financial-metrics",
        label: "Metricas Financeiras",
        description: "Medem o impacto financeiro do sistema de pagamentos.",
        children: [
          { id: "gmv", label: "GMV (Gross Merchandise Value)", description: "Volume total de transacoes processadas." },
          { id: "take-rate", label: "Take Rate", description: "% de receita retida pelo PSP/plataforma por transacao." },
          { id: "interchange-cost", label: "Interchange Cost", description: "Custo de interchange pago ao emissor por transacao." },
          { id: "net-revenue", label: "Net Revenue", description: "Receita liquida apos taxas de interchange e bandeira." },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // 8. PAYMENT OPTIMIZATION
  // ════════════════════════════════════════
  {
    id: "payment-optimization",
    label: "Payment Optimization",
    description:
      "Tecnicas e ferramentas para melhorar taxa de aprovacao, reduzir custos e otimizar conversao.",
    children: [
      {
        id: "auth-optimization",
        label: "Otimizacao de Autorizacao",
        description: "Tecnicas para aumentar a taxa de aprovacao.",
        children: [
          { id: "network-tokens", label: "Network Tokens", description: "Tokens emitidos pela bandeira que substituem o PAN — +2-5% approval rate." },
          { id: "account-updater", label: "Account Updater", description: "Atualizacao automatica de cartoes expirados/renovados." },
          { id: "retry-strategies", label: "Retry Strategies", description: "Retentativas inteligentes baseadas em decline codes." },
          { id: "mit-optimization", label: "MIT Optimization", description: "Otimizacao de Merchant Initiated Transactions (recorrencias)." },
          { id: "soft-decline-handling", label: "Soft Decline Handling", description: "Tratamento de recusas reversiveis (ex: 3DS fallback)." },
        ],
      },
      {
        id: "cost-optimization",
        label: "Otimizacao de Custos",
        description: "Tecnicas para reduzir custos de processamento.",
        children: [
          { id: "interchange-opt", label: "Interchange Optimization", description: "Envio de dados Level 2/3 para qualificar menor interchange." },
          { id: "local-acquiring", label: "Local Acquiring", description: "Adquirencia local para evitar taxas cross-border." },
          { id: "least-cost-routing", label: "Least Cost Routing", description: "Roteamento para o processador com menor custo." },
          { id: "debit-routing", label: "Debit Routing (Durbin)", description: "Roteamento de debito por redes alternativas (EUA)." },
        ],
      },
      {
        id: "conversion-optimization",
        label: "Otimizacao de Conversao",
        description: "Tecnicas para melhorar a experiencia de checkout.",
        children: [
          { id: "local-payment-methods", label: "Metodos de Pagamento Locais", description: "Oferecer PIX, Boleto, iDEAL, etc. por regiao." },
          { id: "checkout-ux", label: "UX de Checkout", description: "Otimizacao de formularios, one-click, autofill." },
          { id: "dynamic-3ds", label: "3DS Dinamico", description: "Aplicar 3DS seletivamente baseado em risco." },
          { id: "currency-optimization", label: "Otimizacao de Moeda", description: "Apresentar preco na moeda local do comprador." },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // 9. SETTLEMENT & RECONCILIATION
  // ════════════════════════════════════════
  {
    id: "settlement-recon",
    label: "Settlement & Reconciliation",
    description:
      "Processos pos-autorizacao — liquidacao de fundos, conciliacao e gestao de tesouraria.",
    children: [
      {
        id: "settlement-types",
        label: "Tipos de Liquidacao",
        description: "Modelos de liquidacao entre participantes.",
        children: [
          { id: "gross-settlement", label: "Liquidacao Bruta (RTGS)", description: "Cada transacao liquidada individualmente em tempo real." },
          { id: "net-settlement", label: "Liquidacao Liquida (DNS)", description: "Posicoes agregadas e liquidadas como valores liquidos." },
          { id: "instant-settlement", label: "Liquidacao Instantanea", description: "Disponibilidade de fundos em segundos (PIX, TIPS)." },
          { id: "t-plus", label: "T+N Settlement", description: "Liquidacao em D+1, D+2, D+3 apos a transacao." },
        ],
      },
      {
        id: "reconciliation-types",
        label: "Tipos de Conciliacao",
        description: "Match de registros entre sistemas.",
        children: [
          { id: "transaction-recon", label: "Conciliacao de Transacoes", description: "Match gateway vs adquirente." },
          { id: "settlement-recon-item", label: "Conciliacao de Liquidacao", description: "Match arquivos de liquidacao vs depositos bancarios." },
          { id: "fee-recon", label: "Conciliacao de Taxas", description: "Validacao de interchange, bandeira e processamento." },
          { id: "fx-recon", label: "Conciliacao de Cambio", description: "Match de taxas de conversao e valores em moeda local." },
        ],
      },
      {
        id: "treasury-functions",
        label: "Funcoes de Tesouraria",
        description: "Gestao de liquidez, capital e risco financeiro.",
        children: [
          { id: "cash-management", label: "Cash Management", description: "Gestao de saldos, previsao de caixa e otimizacao." },
          { id: "fx-management", label: "Gestao de Cambio (FX)", description: "Operacoes de hedge e conversao de moedas." },
          { id: "liquidity-mgmt", label: "Gestao de Liquidez", description: "Monitoramento e otimizacao de liquidez intraday." },
          { id: "funding", label: "Funding & Capital", description: "Captacao de curto prazo, repos e linhas de credito." },
        ],
      },
    ],
  },
];

// ─── Colors for root categories ───

export const TAXONOMY_COLORS: Record<string, { gradient: string; accent: string }> = {
  "payments-core": { gradient: "from-blue-500 to-blue-600", accent: "#2563eb" },
  "payment-infra": { gradient: "from-indigo-500 to-indigo-600", accent: "#6366f1" },
  "fraud-risk": { gradient: "from-red-500 to-red-600", accent: "#ef4444" },
  "financial-infra": { gradient: "from-amber-500 to-amber-600", accent: "#d97706" },
  "crypto-blockchain": { gradient: "from-purple-500 to-purple-600", accent: "#7c3aed" },
  "defi": { gradient: "from-pink-500 to-pink-600", accent: "#ec4899" },
  "payment-metrics": { gradient: "from-emerald-500 to-emerald-600", accent: "#059669" },
  "payment-optimization": { gradient: "from-cyan-500 to-cyan-600", accent: "#0891b2" },
  "settlement-recon": { gradient: "from-teal-500 to-teal-600", accent: "#0d9488" },
};

// ─── Category icons ───

export const TAXONOMY_ICONS: Record<string, string> = {
  "payments-core": "💳",
  "payment-infra": "🏗️",
  "fraud-risk": "🛡️",
  "financial-infra": "🏛️",
  "crypto-blockchain": "🔗",
  "defi": "🌀",
  "payment-metrics": "📊",
  "payment-optimization": "⚡",
  "settlement-recon": "⚙️",
};

// ─── Helpers ───

export function collectIds(items: TaxonomyItem[]): string[] {
  const ids: string[] = [];
  function walk(node: TaxonomyItem) {
    ids.push(node.id);
    node.children?.forEach(walk);
  }
  items.forEach(walk);
  return ids;
}

export function countLeafNodes(items: TaxonomyItem[]): number {
  let count = 0;
  function walk(node: TaxonomyItem) {
    if (!node.children || node.children.length === 0) {
      count++;
    }
    node.children?.forEach(walk);
  }
  items.forEach(walk);
  return count;
}
