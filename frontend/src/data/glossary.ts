/**
 * Glossary Data
 *
 * Termos do domínio de pagamentos, infraestrutura financeira, crypto e compliance.
 * Cada termo inclui aliases (para busca) e links para termos relacionados.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GlossaryCategory =
  | "processing"
  | "infrastructure"
  | "security"
  | "regulation"
  | "crypto"
  | "risk";

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  aliases: string[];
  category: GlossaryCategory;
  relatedTerms: string[];
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const CATEGORY_META: Record<
  GlossaryCategory,
  { label: string; color: string }
> = {
  processing: {
    label: "Processamento",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
  infrastructure: {
    label: "Infraestrutura",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  },
  security: {
    label: "Segurança",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  regulation: {
    label: "Regulação",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
  crypto: {
    label: "Crypto",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  },
  risk: {
    label: "Risco",
    color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
};

export const ALL_CATEGORIES: GlossaryCategory[] = [
  "processing",
  "infrastructure",
  "security",
  "regulation",
  "crypto",
  "risk",
];

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // --- Processing ---
  {
    id: "interchange",
    term: "Interchange",
    definition:
      "Taxa paga pelo adquirente ao emissor em cada transação de cartão. Definida pelas bandeiras (Visa, Mastercard) e varia por MCC, tipo de cartão, modalidade (presencial/online) e região. É o maior componente do MDR.",
    aliases: ["interchange fee", "taxa de intercâmbio"],
    category: "processing",
    relatedTerms: ["mdr", "acquirer", "issuer", "card-scheme"],
  },
  {
    id: "mdr",
    term: "MDR (Merchant Discount Rate)",
    definition:
      "Taxa total cobrada do merchant (lojista) por cada transação. Composta por interchange + taxa da bandeira (scheme fee) + markup do adquirente. Tipicamente entre 1,5% e 3,5% no Brasil.",
    aliases: ["merchant discount rate", "taxa do lojista", "taxa de desconto"],
    category: "processing",
    relatedTerms: ["interchange", "acquirer", "card-scheme"],
  },
  {
    id: "acquirer",
    term: "Adquirente (Acquirer)",
    definition:
      "Instituição que processa pagamentos em nome do merchant. Conecta o merchant às bandeiras de cartão e realiza a liquidação dos fundos. Exemplos: Cielo, Rede, Stone, Adyen.",
    aliases: ["acquirer", "credenciadora", "adquirente"],
    category: "processing",
    relatedTerms: ["issuer", "card-scheme", "mdr", "merchant"],
  },
  {
    id: "issuer",
    term: "Emissor (Issuer)",
    definition:
      "Instituição financeira que emite o cartão de pagamento ao portador (consumidor). Responsável pela aprovação/recusa de transações, gestão de crédito e cobrança. Exemplos: Itaú, Nubank, Bradesco.",
    aliases: ["issuer", "emissor", "banco emissor"],
    category: "processing",
    relatedTerms: ["acquirer", "bin", "card-scheme", "authorization"],
  },
  {
    id: "authorization",
    term: "Autorização",
    definition:
      "Primeira etapa de uma transação de cartão. O emissor verifica saldo/limite, regras de risco e retorna aprovação ou recusa. A autorização reserva o valor mas não transfere fundos — isso ocorre na captura/liquidação.",
    aliases: ["authorization", "auth", "autorização"],
    category: "processing",
    relatedTerms: ["capture", "settlement", "issuer"],
  },
  {
    id: "capture",
    term: "Captura",
    definition:
      "Confirmação de que a transação autorizada deve ser liquidada. Pode ser automática (no momento da autorização) ou manual (merchant confirma depois, ex.: após envio do produto). Sem captura, a autorização expira.",
    aliases: ["capture", "captura"],
    category: "processing",
    relatedTerms: ["authorization", "settlement"],
  },
  {
    id: "settlement",
    term: "Liquidação (Settlement)",
    definition:
      "Transferência efetiva dos fundos entre as partes. O adquirente recebe da bandeira e repassa ao merchant, descontando o MDR. No Brasil, prazos variam de D+1 (débito) a D+30 (crédito parcelado).",
    aliases: ["settlement", "liquidação", "liquidacao"],
    category: "processing",
    relatedTerms: ["authorization", "capture", "acquirer", "clearing"],
  },
  {
    id: "clearing",
    term: "Clearing (Compensação)",
    definition:
      "Processo de reconciliação e netteamento de transações entre instituições antes da liquidação final. Reduz o número e valor bruto das transferências necessárias.",
    aliases: ["clearing", "compensação", "compensacao"],
    category: "processing",
    relatedTerms: ["settlement", "netting"],
  },
  {
    id: "card-scheme",
    term: "Bandeira (Card Scheme)",
    definition:
      "Rede que conecta emissores e adquirentes, definindo regras, taxas e padrões. Principais: Visa, Mastercard, Elo, Amex. A bandeira não processa pagamentos diretamente — define as regras do ecossistema.",
    aliases: ["card scheme", "card network", "bandeira", "rede de cartão"],
    category: "processing",
    relatedTerms: ["interchange", "acquirer", "issuer"],
  },
  {
    id: "bin",
    term: "BIN (Bank Identification Number)",
    definition:
      "Primeiros 6-8 dígitos do número do cartão. Identificam o emissor, bandeira, tipo (crédito/débito), categoria (premium/standard) e país de emissão. Usado em roteamento e regras de risco.",
    aliases: ["BIN", "bank identification number", "IIN", "issuer identification number"],
    category: "processing",
    relatedTerms: ["pan", "issuer", "card-scheme"],
  },
  {
    id: "pan",
    term: "PAN (Primary Account Number)",
    definition:
      "Número completo impresso no cartão (tipicamente 16 dígitos). Deve ser protegido conforme PCI DSS — nunca armazenado em texto plano após autorização. A tokenização substitui o PAN por um token não-sensível.",
    aliases: ["PAN", "primary account number", "número do cartão"],
    category: "processing",
    relatedTerms: ["bin", "tokenization", "pci-dss"],
  },
  {
    id: "psp",
    term: "PSP (Payment Service Provider)",
    definition:
      "Intermediário que oferece uma interface unificada para merchants aceitarem múltiplos métodos de pagamento. Agrega adquirentes, carteiras, PIX, boleto, etc. Exemplos: Stripe, Pagar.me, Mercado Pago.",
    aliases: ["PSP", "payment service provider", "facilitador de pagamento", "payment facilitator"],
    category: "processing",
    relatedTerms: ["acquirer", "merchant", "payment-gateway"],
  },
  {
    id: "payment-gateway",
    term: "Gateway de Pagamento",
    definition:
      "Sistema que transmite dados da transação entre o merchant e o adquirente/processador. Pode ser um serviço separado ou integrado ao PSP. Responsável por criptografia, roteamento e retorno de status.",
    aliases: ["payment gateway", "gateway"],
    category: "processing",
    relatedTerms: ["psp", "acquirer"],
  },
  {
    id: "merchant",
    term: "Merchant (Lojista)",
    definition:
      "Estabelecimento comercial que aceita pagamentos eletrônicos. Identificado por um Merchant ID (MID) único e classificado por MCC (Merchant Category Code). Paga MDR ao adquirente por cada transação.",
    aliases: ["merchant", "lojista", "estabelecimento comercial", "EC"],
    category: "processing",
    relatedTerms: ["mdr", "acquirer", "mcc"],
  },
  {
    id: "mcc",
    term: "MCC (Merchant Category Code)",
    definition:
      "Código de 4 dígitos que classifica o tipo de negócio do merchant (ex.: 5411 = supermercados). Determina taxas de interchange, elegibilidade para programas de benefícios e regras regulatórias.",
    aliases: ["MCC", "merchant category code"],
    category: "processing",
    relatedTerms: ["merchant", "interchange"],
  },
  {
    id: "iso-8583",
    term: "ISO 8583",
    definition:
      "Padrão de mensageria financeira usado em transações de cartão. Define o formato de mensagens entre terminais, adquirentes, bandeiras e emissores. Cada mensagem contém campos como valor, PAN, MCC, etc.",
    aliases: ["ISO 8583", "ISO8583"],
    category: "processing",
    relatedTerms: ["iso-20022", "authorization"],
  },
  {
    id: "iso-20022",
    term: "ISO 20022",
    definition:
      "Novo padrão universal de mensageria financeira baseado em XML/JSON. Substitui formatos legados (ISO 8583, SWIFT MT). Adotado por PIX, SWIFT, T2, FedNow. Permite dados mais ricos e estruturados.",
    aliases: ["ISO 20022", "ISO20022"],
    category: "processing",
    relatedTerms: ["iso-8583", "swift", "pix"],
  },
  {
    id: "netting",
    term: "Netting (Netteamento)",
    definition:
      "Processo de compensar créditos e débitos mútuos entre instituições, resultando em um único valor líquido a transferir. Reduz drasticamente o volume de liquidação necessário.",
    aliases: ["netting", "netteamento"],
    category: "processing",
    relatedTerms: ["clearing", "settlement"],
  },

  // --- Infrastructure ---
  {
    id: "pix",
    term: "PIX",
    definition:
      "Sistema de pagamentos instantâneos do Banco Central do Brasil. Opera 24/7/365 com liquidação em até 10 segundos. Gratuito para pessoas físicas. Usa SPI (Sistema de Pagamentos Instantâneos) como infraestrutura.",
    aliases: ["PIX", "pagamento instantâneo"],
    category: "infrastructure",
    relatedTerms: ["spi", "rtgs", "iso-20022"],
  },
  {
    id: "spi",
    term: "SPI (Sistema de Pagamentos Instantâneos)",
    definition:
      "Infraestrutura operada pelo BCB que processa transações PIX. Usa mensagens ISO 20022 e liquida em tempo real no STR (Sistema de Transferência de Reservas).",
    aliases: ["SPI"],
    category: "infrastructure",
    relatedTerms: ["pix", "str", "iso-20022"],
  },
  {
    id: "str",
    term: "STR (Sistema de Transferência de Reservas)",
    definition:
      "Sistema RTGS do Banco Central do Brasil. Liquida transferências de grandes valores entre instituições financeiras em tempo real e com finalidade. Base da liquidação do PIX.",
    aliases: ["STR", "sistema de transferência de reservas"],
    category: "infrastructure",
    relatedTerms: ["rtgs", "spi", "pix"],
  },
  {
    id: "rtgs",
    term: "RTGS (Real-Time Gross Settlement)",
    definition:
      "Sistema de liquidação bruta em tempo real. Cada transação é liquidada individualmente e com finalidade imediata. Exemplos: Fedwire (EUA), T2 (Europa), STR (Brasil).",
    aliases: ["RTGS", "real-time gross settlement", "LBTR"],
    category: "infrastructure",
    relatedTerms: ["str", "settlement", "clearing"],
  },
  {
    id: "ach",
    term: "ACH (Automated Clearing House)",
    definition:
      "Sistema de pagamentos em lote dos EUA. Processa débitos e créditos diretos (salários, contas, transferências). Liquidação em D+1 ou same-day. Mais de 30 bilhões de transações/ano.",
    aliases: ["ACH", "automated clearing house"],
    category: "infrastructure",
    relatedTerms: ["sepa", "clearing", "settlement"],
  },
  {
    id: "sepa",
    term: "SEPA (Single Euro Payments Area)",
    definition:
      "Zona de pagamentos unificada da Europa com 36 países. Padroniza transferências, débitos diretos e cartões em euros. SEPA Instant (SCT Inst) permite transferências em até 10 segundos.",
    aliases: ["SEPA", "single euro payments area"],
    category: "infrastructure",
    relatedTerms: ["ach", "iso-20022", "pix"],
  },
  {
    id: "swift",
    term: "SWIFT",
    definition:
      "Rede global de mensageria financeira que conecta 11.000+ instituições em 200+ países. Não transfere dinheiro — transmite instruções padronizadas (mensagens MT e MX/ISO 20022) entre bancos.",
    aliases: ["SWIFT", "Society for Worldwide Interbank Financial Telecommunication"],
    category: "infrastructure",
    relatedTerms: ["iso-20022", "correspondent-banking"],
  },
  {
    id: "correspondent-banking",
    term: "Banco Correspondente",
    definition:
      "Modelo em que bancos mantêm contas (nostro/vostro) em outros bancos para facilitar pagamentos internacionais. Banco A envia instrução SWIFT ao Banco B para debitar sua conta nostro e creditar o beneficiário.",
    aliases: ["correspondent banking", "banco correspondente", "nostro vostro"],
    category: "infrastructure",
    relatedTerms: ["swift", "rtgs"],
  },
  {
    id: "fednow",
    term: "FedNow",
    definition:
      "Sistema de pagamentos instantâneos do Federal Reserve (EUA). Lançado em julho 2023. Opera 24/7, liquidação em segundos. Competidor do RTP (The Clearing House). Adoção ainda em fase inicial.",
    aliases: ["FedNow", "Fed Now"],
    category: "infrastructure",
    relatedTerms: ["pix", "rtgs", "ach"],
  },

  // --- Security ---
  {
    id: "tokenization",
    term: "Tokenização",
    definition:
      "Substituição de dados sensíveis (PAN) por um identificador não-sensível (token). Tokens são inúteis se interceptados. Usada por Apple Pay, Google Pay, e para armazenamento seguro de cartões em e-commerce (card-on-file).",
    aliases: ["tokenization", "tokenização"],
    category: "security",
    relatedTerms: ["pan", "pci-dss", "emv"],
  },
  {
    id: "3ds",
    term: "3D Secure (3DS)",
    definition:
      "Protocolo de autenticação para transações online. Versão 2.x usa dados contextuais (dispositivo, histórico) para autenticar sem fricção na maioria dos casos, exigindo desafio (OTP, biometria) apenas quando necessário.",
    aliases: ["3DS", "3D Secure", "3DS2", "Verified by Visa", "Mastercard SecureCode"],
    category: "security",
    relatedTerms: ["sca", "emv", "authorization"],
  },
  {
    id: "emv",
    term: "EMV",
    definition:
      "Padrão global para cartões com chip (Europay, Mastercard, Visa). O chip gera um criptograma único por transação, impedindo clonagem. Inclui especificações para contactless (NFC), QR code e tokenização.",
    aliases: ["EMV", "chip card", "cartão com chip"],
    category: "security",
    relatedTerms: ["nfc", "tokenization", "3ds"],
  },
  {
    id: "nfc",
    term: "NFC (Near Field Communication)",
    definition:
      "Tecnologia de comunicação por proximidade usada em pagamentos contactless. Permite pagar aproximando cartão ou celular do terminal. Opera a ~13.56 MHz com alcance de ~4cm.",
    aliases: ["NFC", "near field communication", "contactless", "pagamento por aproximação"],
    category: "security",
    relatedTerms: ["emv", "tokenization"],
  },
  {
    id: "pci-dss",
    term: "PCI DSS",
    definition:
      "Padrão de segurança da indústria de cartões (Payment Card Industry Data Security Standard). Define requisitos para proteger dados de cartão: criptografia, segmentação de rede, controle de acesso, monitoramento. 4 níveis baseados em volume de transações.",
    aliases: ["PCI DSS", "PCI", "payment card industry"],
    category: "security",
    relatedTerms: ["pan", "tokenization", "cvv"],
  },
  {
    id: "cvv",
    term: "CVV/CVC",
    definition:
      "Código de verificação impresso no cartão (3 dígitos na maioria, 4 na Amex). Prova que o portador tem posse física do cartão em transações card-not-present. Proibido armazenar após autorização (PCI DSS).",
    aliases: ["CVV", "CVC", "CVV2", "código de segurança"],
    category: "security",
    relatedTerms: ["pci-dss", "pan"],
  },
  {
    id: "encryption",
    term: "Criptografia Ponto-a-Ponto (P2PE)",
    definition:
      "Criptografia de dados do cartão desde o terminal de pagamento até o processador, sem que o merchant tenha acesso ao PAN em texto plano. Reduz escopo de conformidade PCI DSS.",
    aliases: ["P2PE", "point-to-point encryption", "criptografia ponto a ponto"],
    category: "security",
    relatedTerms: ["pci-dss", "tokenization"],
  },

  // --- Regulation ---
  {
    id: "sca",
    term: "SCA (Strong Customer Authentication)",
    definition:
      "Requisito da PSD2 europeia: transações online devem usar 2 de 3 fatores — algo que o cliente sabe (senha), possui (celular) ou é (biometria). Isenções: low-value <€30, TRA, MIT, beneficiário confiável.",
    aliases: ["SCA", "strong customer authentication", "autenticação forte"],
    category: "regulation",
    relatedTerms: ["3ds", "psd2"],
  },
  {
    id: "psd2",
    term: "PSD2 (Payment Services Directive 2)",
    definition:
      "Diretiva europeia que regulamenta serviços de pagamento. Introduziu SCA obrigatória, Open Banking (acesso a contas via API) e proteção ao consumidor. Base regulatória para fintechs no EEA.",
    aliases: ["PSD2", "payment services directive"],
    category: "regulation",
    relatedTerms: ["sca", "open-banking"],
  },
  {
    id: "open-banking",
    term: "Open Banking",
    definition:
      "Modelo regulatório que obriga bancos a compartilhar dados financeiros (com consentimento) via APIs padronizadas. No Brasil, regulado pelo BCB desde 2021. Evoluiu para Open Finance incluindo seguros, investimentos e câmbio.",
    aliases: ["open banking", "open finance"],
    category: "regulation",
    relatedTerms: ["psd2", "pix"],
  },
  {
    id: "kyc",
    term: "KYC (Know Your Customer)",
    definition:
      "Processo de identificação e verificação de clientes antes de abrir contas ou processar transações. Inclui verificação de documentos, checagem em listas de sanções e avaliação de risco. Obrigatório por regulações AML.",
    aliases: ["KYC", "know your customer", "conheça seu cliente"],
    category: "regulation",
    relatedTerms: ["aml", "sanctions-screening"],
  },
  {
    id: "aml",
    term: "AML (Anti-Money Laundering)",
    definition:
      "Conjunto de leis e procedimentos para detectar e prevenir lavagem de dinheiro. Inclui monitoramento de transações, reporte de atividades suspeitas (SAR/COAF), KYC e due diligence reforçada para clientes de alto risco.",
    aliases: ["AML", "anti-money laundering", "anti-lavagem", "prevenção à lavagem"],
    category: "regulation",
    relatedTerms: ["kyc", "sanctions-screening"],
  },
  {
    id: "sanctions-screening",
    term: "Triagem de Sanções",
    definition:
      "Verificação de transações e clientes contra listas de sanções (OFAC, UE, ONU). Transações envolvendo entidades/países sancionados devem ser bloqueadas. Falhas de compliance resultam em multas severas.",
    aliases: ["sanctions screening", "OFAC", "triagem de sanções"],
    category: "regulation",
    relatedTerms: ["aml", "kyc"],
  },

  // --- Crypto ---
  {
    id: "stablecoin",
    term: "Stablecoin",
    definition:
      "Criptomoeda com valor atrelado a um ativo estável (geralmente USD). Tipos: fiat-backed (USDC, USDT — lastreadas em reservas), crypto-backed (DAI — sobre-colateralizada), algorítmica. Usadas para pagamentos, remessas e DeFi.",
    aliases: ["stablecoin", "moeda estável"],
    category: "crypto",
    relatedTerms: ["defi", "cbdc", "usdc"],
  },
  {
    id: "usdc",
    term: "USDC",
    definition:
      "Stablecoin emitida pela Circle, atrelada 1:1 ao dólar. Reservas em títulos do tesouro e depósitos bancários, auditadas mensalmente. Presente em Ethereum, Solana, Polygon, Base e outras redes.",
    aliases: ["USDC", "USD Coin"],
    category: "crypto",
    relatedTerms: ["stablecoin", "usdt"],
  },
  {
    id: "usdt",
    term: "USDT (Tether)",
    definition:
      "Maior stablecoin por market cap. Emitida pela Tether Limited. Histórico de controvérsias sobre composição de reservas, mas publica relatórios de atestação trimestrais. Dominante em mercados emergentes e exchanges asiáticas.",
    aliases: ["USDT", "Tether"],
    category: "crypto",
    relatedTerms: ["stablecoin", "usdc"],
  },
  {
    id: "defi",
    term: "DeFi (Finanças Descentralizadas)",
    definition:
      "Serviços financeiros construídos em blockchains públicas via smart contracts, sem intermediários tradicionais. Inclui empréstimos (Aave), exchanges descentralizadas (Uniswap), derivativos e yield farming.",
    aliases: ["DeFi", "decentralized finance", "finanças descentralizadas"],
    category: "crypto",
    relatedTerms: ["smart-contract", "amm", "stablecoin"],
  },
  {
    id: "smart-contract",
    term: "Smart Contract",
    definition:
      "Programa auto-executável armazenado em blockchain. Executa automaticamente quando condições predefinidas são atendidas. Base de DeFi, NFTs e DAOs. Principais plataformas: Ethereum (Solidity), Solana (Rust).",
    aliases: ["smart contract", "contrato inteligente"],
    category: "crypto",
    relatedTerms: ["defi", "blockchain"],
  },
  {
    id: "blockchain",
    term: "Blockchain",
    definition:
      "Registro distribuído e imutável de transações organizado em blocos encadeados criptograficamente. Mecanismos de consenso (PoW, PoS) garantem acordo entre nós sem autoridade central.",
    aliases: ["blockchain", "distributed ledger", "DLT"],
    category: "crypto",
    relatedTerms: ["smart-contract", "defi"],
  },
  {
    id: "amm",
    term: "AMM (Automated Market Maker)",
    definition:
      "Modelo de exchange descentralizada que usa pools de liquidez e fórmulas matemáticas (ex.: x*y=k) em vez de order books. Provedores de liquidez depositam pares de tokens e recebem fees. Exemplo: Uniswap.",
    aliases: ["AMM", "automated market maker"],
    category: "crypto",
    relatedTerms: ["defi", "smart-contract"],
  },
  {
    id: "cbdc",
    term: "CBDC (Moeda Digital de Banco Central)",
    definition:
      "Versão digital da moeda fiduciária emitida pelo banco central. DREX (Brasil), Digital Euro (BCE), e-CNY (China) são projetos em andamento. Diferente de stablecoins: é moeda soberana com garantia estatal.",
    aliases: ["CBDC", "central bank digital currency", "moeda digital", "DREX"],
    category: "crypto",
    relatedTerms: ["stablecoin", "pix"],
  },

  // --- Risk ---
  {
    id: "chargeback",
    term: "Chargeback (Estorno)",
    definition:
      "Contestação de transação iniciada pelo portador do cartão junto ao emissor. Se o emissor aceita, o valor é debitado do merchant via adquirente. Merchant pode apresentar evidências (representment). Prazo: 120 dias da transação.",
    aliases: ["chargeback", "estorno", "contestação", "disputa"],
    category: "risk",
    relatedTerms: ["fraud", "representment", "arbitration"],
  },
  {
    id: "representment",
    term: "Representment",
    definition:
      "Resposta do merchant a um chargeback, apresentando evidências de que a transação é legítima (comprovante de entrega, logs de acesso, etc.). Se aceito pelo emissor, o chargeback é revertido.",
    aliases: ["representment", "representação"],
    category: "risk",
    relatedTerms: ["chargeback", "arbitration"],
  },
  {
    id: "arbitration",
    term: "Arbitragem (Bandeira)",
    definition:
      "Última etapa de disputa de chargeback: a bandeira (Visa/Mastercard) decide o caso quando emissor e adquirente não chegam a acordo. Envolve taxas elevadas (~$500 por caso).",
    aliases: ["arbitration", "arbitragem"],
    category: "risk",
    relatedTerms: ["chargeback", "representment"],
  },
  {
    id: "fraud",
    term: "Fraude em Pagamentos",
    definition:
      "Uso não autorizado de instrumento de pagamento. Tipos principais: fraude de cartão (clonagem, CNP fraud), account takeover, friendly fraud (consumidor contesta compra legítima), fraude de identidade.",
    aliases: ["fraud", "fraude", "payment fraud"],
    category: "risk",
    relatedTerms: ["chargeback", "velocity-check", "3ds"],
  },
  {
    id: "velocity-check",
    term: "Velocity Check",
    definition:
      "Regra antifraude que limita a frequência de transações em um período. Ex.: máximo 5 transações do mesmo cartão em 10 minutos. Padrões anômalos de velocidade indicam fraude ou teste de cartão.",
    aliases: ["velocity check", "verificação de velocidade"],
    category: "risk",
    relatedTerms: ["fraud", "risk-scoring"],
  },
  {
    id: "risk-scoring",
    term: "Risk Scoring",
    definition:
      "Pontuação de risco atribuída a cada transação com base em múltiplos sinais: device fingerprint, geolocalização, histórico do cartão, valor, hora, etc. Score alto aciona revisão manual, 3DS ou bloqueio.",
    aliases: ["risk scoring", "pontuação de risco", "fraud score"],
    category: "risk",
    relatedTerms: ["fraud", "velocity-check", "3ds"],
  },
  {
    id: "dcc",
    term: "DCC (Dynamic Currency Conversion)",
    definition:
      "Serviço que permite ao portador pagar na moeda do seu país de origem ao comprar no exterior. O merchant/adquirente aplica a conversão com markup. Geralmente desfavorável ao consumidor comparado ao câmbio do emissor.",
    aliases: ["DCC", "dynamic currency conversion", "conversão dinâmica de moeda"],
    category: "risk",
    relatedTerms: ["interchange", "acquirer"],
  },
  {
    id: "idempotency",
    term: "Idempotência",
    definition:
      "Propriedade de uma operação que produz o mesmo resultado se executada múltiplas vezes. Em APIs de pagamento, chaves de idempotência previnem cobranças duplicadas em caso de retry após timeout ou erro de rede.",
    aliases: ["idempotency", "idempotência", "idempotent"],
    category: "risk",
    relatedTerms: ["authorization"],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Busca um termo pelo ID */
export function getTermById(id: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.id === id);
}

/** Busca um termo pelo nome ou alias (case-insensitive) */
export function getTermByName(name: string): GlossaryTerm | undefined {
  const lower = name.toLowerCase();
  return GLOSSARY_TERMS.find(
    (t) =>
      t.term.toLowerCase() === lower ||
      t.aliases.some((a) => a.toLowerCase() === lower),
  );
}

/** Retorna todas as letras iniciais para navegação A-Z */
export function getAlphabetLetters(): string[] {
  const letters = new Set(
    GLOSSARY_TERMS.map((t) => t.term[0].toUpperCase()),
  );
  return Array.from(letters).sort();
}
