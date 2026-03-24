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
  | "risk"
  | "antecipacao"
  | "credito"
  | "pix"
  | "precificacao"
  | "settlement"
  | "tecnologia"
  | "autenticacao";

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
  antecipacao: {
    label: "Antecipação",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  },
  credito: {
    label: "Crédito",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  },
  pix: {
    label: "Pix",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  },
  precificacao: {
    label: "Precificação",
    color: "bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300",
  },
  settlement: {
    label: "Settlement",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  },
  tecnologia: {
    label: "Tecnologia",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  },
  autenticacao: {
    label: "Autenticação",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  },
};

export const ALL_CATEGORIES: GlossaryCategory[] = [
  "processing",
  "infrastructure",
  "security",
  "regulation",
  "crypto",
  "risk",
  "antecipacao",
  "credito",
  "pix",
  "precificacao",
  "settlement",
  "tecnologia",
  "autenticacao",
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
    id: "friendly-fraud",
    term: "Friendly Fraud (Fraude Amigável)",
    definition:
      "Friendly fraud (ou fraude amigável) ocorre quando o titular legítimo do cartão realiza uma compra e posteriormente contesta a transação junto ao emissor, alegando não reconhecê-la ou não tê-la autorizado. Representa 40-70% dos chargebacks no e-commerce. Difere de fraude real pois o portador é quem fez a compra.",
    aliases: ["friendly fraud", "fraude amigável", "first-party fraud"],
    category: "risk",
    relatedTerms: ["chargeback", "representment", "fraud"],
  },
  {
    id: "tc40-safe",
    term: "TC40 / SAFE Reports",
    definition:
      "TC40 (Visa) e SAFE (Mastercard) são relatórios de fraude emitidos pelo banco emissor quando o portador reporta uma transação como fraudulenta, independentemente de abrir chargeback. Alta taxa de TC40/SAFE pode colocar o merchant em programas de monitoramento de fraude da bandeira (VFMP/GMAP).",
    aliases: ["TC40", "SAFE", "fraud report", "relatório de fraude"],
    category: "risk",
    relatedTerms: ["chargeback", "fraud", "reason-code"],
  },
  {
    id: "reason-code",
    term: "Reason Code (Código de Motivo)",
    definition:
      "Código padronizado atribuído pela bandeira a cada chargeback indicando o motivo da disputa. Visa usa categorias 10.x (fraude), 11.x (autorização), 12.x (processamento), 13.x (consumidor). Mastercard usa códigos 48xx-49xx. O reason code determina a estratégia de defesa e evidências necessárias.",
    aliases: ["reason code", "código de motivo", "dispute reason code"],
    category: "risk",
    relatedTerms: ["chargeback", "representment", "compelling-evidence"],
  },
  {
    id: "compelling-evidence",
    term: "Compelling Evidence (CE)",
    definition:
      "Compelling Evidence (CE) é o framework da Visa para defesa de chargebacks de fraude (reason code 10.4). CE 3.0 permite matching automático de device fingerprint, IP e histórico de transações para provar que o portador é o mesmo de compras anteriores não disputadas. Pode reverter liability shift sem 3DS.",
    aliases: ["compelling evidence", "CE 3.0", "evidência convincente"],
    category: "risk",
    relatedTerms: ["chargeback", "reason-code", "representment"],
  },
  {
    id: "cdrn",
    term: "CDRN (Cardholder Dispute Resolution Network)",
    definition:
      "CDRN (Cardholder Dispute Resolution Network) é um serviço da Verifi (Visa) que envia alertas ao merchant antes da formalização do chargeback, dando janela de 72 horas para resolver proativamente via refund. Custo típico: R$5-15 por alerta. Pode prevenir 20-40% dos chargebacks.",
    aliases: ["CDRN", "Verifi CDRN", "chargeback alert", "alerta de chargeback"],
    category: "risk",
    relatedTerms: ["chargeback", "rdr", "ethoca-alerts"],
  },
  {
    id: "rdr",
    term: "RDR (Rapid Dispute Resolution)",
    definition:
      "RDR (Rapid Dispute Resolution) é um serviço da Verifi (Visa) que permite ao merchant definir regras para auto-refund de disputas antes de se tornarem chargebacks. Diferente do CDRN que envia alerta para decisão manual, o RDR automatiza a resolução baseado em regras pré-configuradas.",
    aliases: ["RDR", "Rapid Dispute Resolution", "resolução rápida de disputas"],
    category: "risk",
    relatedTerms: ["chargeback", "cdrn", "ethoca-alerts"],
  },
  {
    id: "ethoca-alerts",
    term: "Ethoca Alerts",
    definition:
      "Ethoca Alerts é um serviço da Ethoca (adquirida pela Mastercard) que envia alertas de fraude confirmada ao merchant quando o emissor identifica uma transação como fraudulenta. Permite cancelar a entrega ou emitir refund antes do chargeback formal. Cobre tanto Visa quanto Mastercard.",
    aliases: ["Ethoca Alerts", "Ethoca", "alerta Ethoca", "fraud alert"],
    category: "risk",
    relatedTerms: ["chargeback", "cdrn", "rdr"],
  },
  {
    id: "pre-arbitration",
    term: "Pré-Arbitragem",
    definition:
      "Pré-arbitragem é a etapa intermediária do ciclo de disputas entre o representment e a arbitragem final. Ocorre quando o emissor rejeita as evidências do representment e o merchant decide escalar. Envolve taxas ($300-500) e evidências adicionais. Prazo: 30 dias (Visa), 45 dias (Mastercard).",
    aliases: ["pre-arbitration", "pré-arbitragem", "pre-arb"],
    category: "risk",
    relatedTerms: ["chargeback", "representment", "arbitration"],
  },
  {
    id: "dispute-lifecycle",
    term: "Ciclo de Vida da Disputa",
    definition:
      "Ciclo completo de uma disputa de pagamento, desde a contestação do portador até a resolução final. Etapas: transação → contestação → análise do emissor → notificação → coleta de evidências → representment → pré-arbitragem → arbitragem. Duração total: até 120 dias + 60-90 dias de arbitragem.",
    aliases: ["dispute lifecycle", "ciclo de vida da disputa", "dispute cycle"],
    category: "risk",
    relatedTerms: ["chargeback", "representment", "pre-arbitration", "arbitration"],
  },
  {
    id: "chargeback-rate",
    term: "Chargeback Rate (Taxa de Chargeback)",
    definition:
      "Métrica que indica a proporção de transações que resultam em chargebacks. Calculado como: (número de chargebacks no mês / número de transações no mês anterior) × 100. Thresholds críticos: Visa VDMP ≥ 0.9%, Mastercard ECM ≥ 1.0%. Calculado separadamente por bandeira e por MID.",
    aliases: ["chargeback rate", "taxa de chargeback", "dispute rate"],
    category: "risk",
    relatedTerms: ["chargeback", "win-rate"],
  },
  {
    id: "win-rate",
    term: "Win Rate (Taxa de Vitória)",
    definition:
      "Taxa de sucesso do merchant em contestar chargebacks via representment. Calculado como: (chargebacks revertidos / total de chargebacks contestados) × 100. Média do mercado: 20-40% dependendo do reason code. Fatores: qualidade da evidência, reason code, 3DS liability shift, CE 3.0 elegibilidade.",
    aliases: ["win rate", "taxa de vitória", "representment win rate"],
    category: "risk",
    relatedTerms: ["chargeback", "representment", "chargeback-rate"],
  },
  {
    id: "evidence-package",
    term: "Pacote de Evidências",
    definition:
      "Pacote consolidado de evidências que o merchant submete durante o representment para contestar um chargeback. Conteúdo típico: comprovante de entrega, logs de autenticação 3DS (CAVV/ECI), correspondência com o cliente, prints do pedido, tracking de envio, IP/device fingerprint do comprador.",
    aliases: ["evidence package", "pacote de evidências", "representment evidence"],
    category: "risk",
    relatedTerms: ["chargeback", "representment", "compelling-evidence"],
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

  // --- Antecipação & Recebíveis ---
  {
    id: "antecipacao-recebiveis",
    term: "Antecipação de Recebíveis",
    definition:
      "Operação financeira em que o lojista recebe antecipadamente os valores de vendas parceladas no cartão, mediante desconto (deságio). Permite ao merchant melhorar o fluxo de caixa sem recorrer a empréstimos tradicionais. Regulada pelo BCB e sujeita a regras de interoperabilidade.",
    aliases: ["antecipação", "prepayment of receivables", "antecipação de recebíveis"],
    category: "antecipacao",
    relatedTerms: ["agenda-recebiveis", "desagio", "cessao-credito"],
  },
  {
    id: "mesa-antecipacao",
    term: "Mesa de Antecipação",
    definition:
      "Área ou sistema dentro de adquirentes e fintechs responsável por precificar e executar operações de antecipação de recebíveis. Define taxas de deságio com base no risco do merchant, prazo e volume. Pode operar via leilão ou taxa fixa.",
    aliases: ["mesa de antecipação", "prepayment desk"],
    category: "antecipacao",
    relatedTerms: ["antecipacao-recebiveis", "desagio"],
  },
  {
    id: "registradora",
    term: "Registradora",
    definition:
      "Entidade autorizada pelo BCB a registrar recebíveis de arranjos de pagamento. Garante transparência e unicidade de registro, evitando que o mesmo recebível seja dado em garantia a múltiplas instituições. Exemplos: CERC, CIP, TAG (B3).",
    aliases: ["registradora", "registro de recebíveis"],
    category: "antecipacao",
    relatedTerms: ["cerc", "cip", "tag-b3", "agenda-recebiveis"],
  },
  {
    id: "cerc",
    term: "CERC",
    definition:
      "Câmara Interbancária de Pagamentos que atua como registradora de recebíveis de cartão e outros arranjos de pagamento. Concentra o registro e a consulta de agendas de recebíveis, permitindo operações de cessão e garantia com segurança jurídica.",
    aliases: ["CERC", "Câmara Interbancária de Pagamentos"],
    category: "antecipacao",
    relatedTerms: ["registradora", "cip", "agenda-recebiveis"],
  },
  {
    id: "cip",
    term: "CIP (Câmara Interbancária de Pagamentos)",
    definition:
      "Infraestrutura de mercado financeiro que opera sistemas de liquidação e registro de ativos. No contexto de recebíveis, atua como registradora autorizada pelo BCB. Também opera a C3 (plataforma de registro de recebíveis de cartão).",
    aliases: ["CIP", "Câmara Interbancária de Pagamentos"],
    category: "antecipacao",
    relatedTerms: ["registradora", "cerc", "tag-b3"],
  },
  {
    id: "tag-b3",
    term: "TAG (B3)",
    definition:
      "Registradora de recebíveis controlada pela B3 (bolsa de valores brasileira). Compete com CERC e CIP no registro de agendas de recebíveis de arranjos de pagamento. Oferece serviços de registro, consulta e gestão de garantias.",
    aliases: ["TAG", "TAG B3", "B3 registradora"],
    category: "antecipacao",
    relatedTerms: ["registradora", "cerc", "cip"],
  },
  {
    id: "agenda-recebiveis",
    term: "Agenda de Recebíveis",
    definition:
      "Relação de todos os valores a receber de um merchant provenientes de vendas com cartão, organizados por data de liquidação. É o ativo base para operações de antecipação e cessão de crédito. Registrada obrigatoriamente em registradoras autorizadas.",
    aliases: ["agenda de recebíveis", "receivables schedule", "agenda"],
    category: "antecipacao",
    relatedTerms: ["antecipacao-recebiveis", "registradora", "cessao-credito"],
  },
  {
    id: "desagio",
    term: "Deságio",
    definition:
      "Desconto aplicado sobre o valor nominal de um recebível quando antecipado. Representa o custo financeiro da antecipação para o merchant. Calculado com base na taxa de desconto, prazo até o vencimento e risco de crédito do estabelecimento.",
    aliases: ["deságio", "desconto", "discount rate"],
    category: "antecipacao",
    relatedTerms: ["antecipacao-recebiveis", "mesa-antecipacao"],
  },
  {
    id: "cessao-credito",
    term: "Cessão de Crédito",
    definition:
      "Transferência de titularidade de um recebível do cedente (merchant/adquirente) para o cessionário (banco, FIDC, fintech). Permite ao merchant monetizar recebíveis futuros. O registro em registradora garante a oponibilidade contra terceiros.",
    aliases: ["cessão de crédito", "credit assignment", "cessão"],
    category: "antecipacao",
    relatedTerms: ["antecipacao-recebiveis", "registradora", "fidc"],
  },
  {
    id: "interoperabilidade-recebiveis",
    term: "Interoperabilidade de Recebíveis",
    definition:
      "Capacidade de um merchant oferecer seus recebíveis como garantia a qualquer instituição financeira, não apenas ao adquirente original. Regulamentada pelo BCB desde 2021, promove concorrência e melhores taxas para o lojista.",
    aliases: ["interoperabilidade de recebíveis", "receivables interoperability"],
    category: "antecipacao",
    relatedTerms: ["agenda-recebiveis", "registradora", "antecipacao-recebiveis"],
  },

  // --- Crédito & Estruturação ---
  {
    id: "scd",
    term: "SCD (Sociedade de Crédito Direto)",
    definition:
      "Instituição financeira autorizada pelo BCB a conceder crédito exclusivamente com recursos próprios, por meio de plataforma eletrônica. Não pode captar depósitos do público. Base regulatória para fintechs de crédito no Brasil.",
    aliases: ["SCD", "Sociedade de Crédito Direto"],
    category: "credito",
    relatedTerms: ["embedded-finance", "credit-as-a-service"],
  },
  {
    id: "fidc",
    term: "FIDC (Fundo de Investimento em Direitos Creditórios)",
    definition:
      "Fundo que compra recebíveis (direitos creditórios) e emite cotas para investidores. Estruturado com cotas sênior (menor risco, retorno fixo), mezanino e júnior (absorve primeiras perdas). Instrumento fundamental para securitização de recebíveis de cartão.",
    aliases: ["FIDC", "Fundo de Direitos Creditórios", "receivables fund"],
    category: "credito",
    relatedTerms: ["cota-senior", "cota-mezanino", "cota-junior", "cessao-credito"],
  },
  {
    id: "cedente",
    term: "Cedente",
    definition:
      "Parte que transfere (cede) seus direitos creditórios a outra instituição. Na antecipação de recebíveis, o cedente é tipicamente o merchant ou sub-adquirente que vende seus recebíveis futuros em troca de liquidez imediata.",
    aliases: ["cedente", "assignor"],
    category: "credito",
    relatedTerms: ["cessionario", "cessao-credito"],
  },
  {
    id: "cessionario",
    term: "Cessionário",
    definition:
      "Parte que adquire os direitos creditórios do cedente. Pode ser um banco, FIDC, fintech ou outra instituição financeira. O cessionário assume o risco de crédito do recebível adquirido e recebe os pagamentos futuros.",
    aliases: ["cessionário", "assignee"],
    category: "credito",
    relatedTerms: ["cedente", "cessao-credito", "fidc"],
  },
  {
    id: "lastro",
    term: "Lastro",
    definition:
      "Ativo real que serve de garantia ou suporte para uma operação financeira. Em FIDCs, o lastro são os recebíveis de cartão. Em stablecoins, o lastro são reservas em moeda fiduciária ou títulos. A qualidade do lastro determina o risco da operação.",
    aliases: ["lastro", "collateral", "backing"],
    category: "credito",
    relatedTerms: ["fidc", "cessao-credito"],
  },
  {
    id: "subordinacao",
    term: "Subordinação",
    definition:
      "Estrutura de proteção em FIDCs onde cotas júnior absorvem perdas antes das cotas sênior. A razão de subordinação (ex.: 20%) define o colchão de segurança. Quanto maior a subordinação, mais protegida a cota sênior.",
    aliases: ["subordinação", "subordination", "credit enhancement"],
    category: "credito",
    relatedTerms: ["fidc", "cota-senior", "cota-junior"],
  },
  {
    id: "cota-senior",
    term: "Cota Sênior",
    definition:
      "Classe de cotas de um FIDC com prioridade no recebimento de rendimentos e amortização. Possui retorno-alvo prefixado e menor risco, pois é protegida pela subordinação das cotas mezanino e júnior.",
    aliases: ["cota sênior", "senior tranche", "senior quota"],
    category: "credito",
    relatedTerms: ["fidc", "cota-mezanino", "cota-junior", "subordinacao"],
  },
  {
    id: "cota-mezanino",
    term: "Cota Mezanino",
    definition:
      "Classe intermediária de cotas de um FIDC, entre a sênior e a júnior em termos de risco e retorno. Absorve perdas após a cota júnior ser consumida, oferecendo retorno maior que a sênior como compensação pelo risco adicional.",
    aliases: ["cota mezanino", "mezzanine tranche", "cota intermediária"],
    category: "credito",
    relatedTerms: ["fidc", "cota-senior", "cota-junior"],
  },
  {
    id: "cota-junior",
    term: "Cota Júnior",
    definition:
      "Classe de cotas de um FIDC que absorve as primeiras perdas do fundo. Oferece o maior retorno potencial, mas também o maior risco. Frequentemente retida pelo originador dos recebíveis como forma de alinhar incentivos.",
    aliases: ["cota júnior", "junior tranche", "equity tranche", "cota subordinada"],
    category: "credito",
    relatedTerms: ["fidc", "cota-senior", "cota-mezanino", "subordinacao"],
  },
  {
    id: "credit-as-a-service",
    term: "Credit as a Service",
    definition:
      "Modelo onde uma fintech ou plataforma oferece infraestrutura de crédito (originação, análise, cobrança) como serviço para terceiros. Permite que empresas não financeiras ofereçam crédito sem precisar de licença bancária própria.",
    aliases: ["Credit as a Service", "CaaS", "crédito como serviço"],
    category: "credito",
    relatedTerms: ["embedded-finance", "scd"],
  },
  {
    id: "embedded-finance",
    term: "Embedded Finance",
    definition:
      "Integração de serviços financeiros (pagamentos, crédito, seguros) diretamente em plataformas não financeiras. Exemplo: marketplace oferecendo crédito ao lojista ou app de transporte com carteira digital. Habilita BaaS (Banking as a Service).",
    aliases: ["embedded finance", "finanças embarcadas", "finanças integradas"],
    category: "credito",
    relatedTerms: ["credit-as-a-service", "scd", "psp"],
  },

  // --- Parcelamento ---
  {
    id: "parcelado-emissor",
    term: "Parcelado Emissor",
    definition:
      "Modalidade de parcelamento onde o emissor do cartão financia as parcelas. O merchant recebe o valor integral em D+30 e o portador paga ao emissor em parcelas mensais com ou sem juros. O risco de crédito é do emissor.",
    aliases: ["parcelado emissor", "issuer installment", "parcelamento pelo banco"],
    category: "processing",
    relatedTerms: ["parcelado-lojista", "issuer"],
  },
  {
    id: "parcelado-lojista",
    term: "Parcelado Lojista",
    definition:
      "Modalidade de parcelamento onde o merchant financia as parcelas. O adquirente liquida cada parcela ao merchant na data de vencimento (D+30, D+60, etc.). O merchant pode antecipar esses recebíveis para melhorar o fluxo de caixa.",
    aliases: ["parcelado lojista", "merchant installment", "parcelamento pela loja"],
    category: "processing",
    relatedTerms: ["parcelado-emissor", "antecipacao-recebiveis", "merchant"],
  },
  {
    id: "taxa-desconto",
    term: "Taxa de Desconto",
    definition:
      "Taxa percentual descontada do valor de cada transação pelo adquirente ou sub-adquirente. Sinônimo de MDR na prática, embora possa incluir custos adicionais. Composta por interchange, scheme fee e markup do credenciador.",
    aliases: ["taxa de desconto", "discount rate", "taxa do adquirente"],
    category: "processing",
    relatedTerms: ["mdr", "interchange", "acquirer"],
  },
  {
    id: "parcelado-sem-juros",
    term: "Parcelado Sem Juros",
    definition:
      "Modalidade brasileira onde o merchant assume o custo do parcelamento para o consumidor. O portador paga parcelas iguais sem acréscimo, mas o merchant recebe cada parcela apenas no vencimento (ou antecipa com deságio). Amplamente utilizado no e-commerce brasileiro.",
    aliases: ["parcelado sem juros", "interest-free installment", "PSJ"],
    category: "processing",
    relatedTerms: ["parcelado-lojista", "antecipacao-recebiveis", "desagio"],
  },

  // --- PIX & Pagamentos Instantâneos ---
  {
    id: "dict",
    term: "DICT (Diretório de Identificadores de Contas Transacionais)",
    definition:
      "Base de dados centralizada do BCB que mapeia chaves PIX (CPF, CNPJ, e-mail, telefone, chave aleatória) às contas bancárias dos usuários. Permite enviar PIX usando apenas a chave, sem informar agência e conta.",
    aliases: ["DICT", "diretório PIX", "diretório de identificadores"],
    category: "pix",
    relatedTerms: ["pix", "spi"],
  },
  {
    id: "pix-saque",
    term: "Pix Saque",
    definition:
      "Modalidade que permite ao usuário sacar dinheiro em estabelecimentos comerciais por meio de transação PIX. O merchant entrega dinheiro em espécie ao cliente e recebe o valor via PIX. Limite de R$500 por transação durante o dia.",
    aliases: ["Pix Saque", "pix withdrawal"],
    category: "pix",
    relatedTerms: ["pix", "pix-troco"],
  },
  {
    id: "pix-troco",
    term: "Pix Troco",
    definition:
      "Modalidade que permite ao usuário receber dinheiro em espécie como troco ao pagar uma compra via PIX com valor acima do total. Combina pagamento da compra com saque de dinheiro em uma única operação.",
    aliases: ["Pix Troco", "pix cashback"],
    category: "pix",
    relatedTerms: ["pix", "pix-saque"],
  },
  {
    id: "pix-garantido",
    term: "Pix Garantido",
    definition:
      "Modalidade de PIX que permite pagamentos parcelados com garantia de recebimento pelo merchant, mesmo sem saldo na conta do pagador no momento. Funciona como um crédito atrelado ao PIX, com débito automático nas datas acordadas.",
    aliases: ["Pix Garantido", "pix parcelado"],
    category: "pix",
    relatedTerms: ["pix", "pix-automatico"],
  },
  {
    id: "pix-automatico",
    term: "Pix Automático",
    definition:
      "Modalidade de PIX para pagamentos recorrentes com autorização prévia do pagador. Permite débitos automáticos (assinaturas, contas) sem necessidade de autenticação a cada transação. Alternativa ao débito automático tradicional.",
    aliases: ["Pix Automático", "pix recorrente", "automatic pix"],
    category: "pix",
    relatedTerms: ["pix", "pix-garantido"],
  },
  {
    id: "itp",
    term: "Iniciador de Pagamento (ITP)",
    definition:
      "Instituição autorizada pelo BCB a iniciar transações de pagamento a pedido do cliente, sem deter os fundos. Funciona como um intermediário que conecta o pagador à sua instituição financeira. Pilar do Open Finance e do PIX por aproximação.",
    aliases: ["ITP", "iniciador de pagamento", "PISP", "payment initiation service provider"],
    category: "pix",
    relatedTerms: ["pix", "open-banking"],
  },

  // --- Arranjo de Pagamento ---
  {
    id: "arranjo-pagamento",
    term: "Arranjo de Pagamento",
    definition:
      "Conjunto de regras e procedimentos que disciplina a prestação de serviço de pagamento ao público. Inclui regras de participação, liquidação, segurança e governança. Exemplos: arranjos Visa, Mastercard, PIX, boleto.",
    aliases: ["arranjo de pagamento", "payment scheme", "payment arrangement"],
    category: "regulation",
    relatedTerms: ["instituidor-arranjo", "card-scheme"],
  },
  {
    id: "instituidor-arranjo",
    term: "Instituidor de Arranjo",
    definition:
      "Pessoa jurídica responsável por criar e gerir as regras de um arranjo de pagamento. Define taxas, padrões técnicos, regras de participação e governança. Visa, Mastercard, Elo e o BCB (PIX) são exemplos de instituidores.",
    aliases: ["instituidor de arranjo", "scheme owner", "payment scheme manager"],
    category: "regulation",
    relatedTerms: ["arranjo-pagamento", "card-scheme"],
  },
  {
    id: "sub-adquirente",
    term: "Sub-adquirente",
    definition:
      "Intermediário entre o merchant e o adquirente. Não se conecta diretamente às bandeiras; utiliza a conexão do adquirente parceiro. Facilita a aceitação de pagamentos para pequenos merchants. Exemplos: PagSeguro (inicialmente), Mercado Pago.",
    aliases: ["sub-adquirente", "subacquirer", "sub-credenciadora"],
    category: "processing",
    relatedTerms: ["acquirer", "facilitador-pagamento", "payfac"],
  },
  {
    id: "facilitador-pagamento",
    term: "Facilitador de Pagamento",
    definition:
      "Empresa que agrega múltiplos merchants sob seu cadastro de adquirente (master merchant). Simplifica o onboarding e elimina a necessidade de cada merchant ter contrato direto com adquirente. Modelo regulado pelo BCB no Brasil.",
    aliases: ["facilitador de pagamento", "payment facilitator", "subcredenciador"],
    category: "processing",
    relatedTerms: ["sub-adquirente", "payfac", "acquirer"],
  },
  {
    id: "payfac",
    term: "PayFac (Payment Facilitator)",
    definition:
      "Modelo de negócio onde uma empresa se cadastra como master merchant junto a um adquirente e processa transações em nome de sub-merchants. Permite onboarding rápido e experiência integrada. Equivalente internacional do facilitador de pagamento.",
    aliases: ["PayFac", "payment facilitator", "payfac"],
    category: "processing",
    relatedTerms: ["sub-adquirente", "facilitador-pagamento", "acquirer"],
  },

  // --- Precificação ---
  {
    id: "interchange-plus-plus",
    term: "Interchange++ (IC++)",
    definition:
      "Modelo de precificação transparente onde o merchant paga interchange real + scheme fee real + markup fixo do adquirente. Diferente do modelo blended (taxa única), permite ao merchant ver exatamente o custo de cada componente.",
    aliases: ["IC++", "interchange plus plus", "interchange++", "cost plus"],
    category: "precificacao",
    relatedTerms: ["interchange", "blended-rate", "scheme-fee"],
  },
  {
    id: "blended-rate",
    term: "Blended Rate (Taxa Única)",
    definition:
      "Modelo de precificação onde o adquirente cobra uma taxa fixa única para todas as transações, independente do tipo de cartão ou bandeira. Mais simples para o merchant, mas geralmente mais caro que IC++ para volumes altos.",
    aliases: ["blended rate", "taxa única", "flat rate"],
    category: "precificacao",
    relatedTerms: ["interchange-plus-plus", "mdr"],
  },
  {
    id: "scheme-fee",
    term: "Scheme Fee",
    definition:
      "Taxa cobrada pelas bandeiras (Visa, Mastercard, Elo) sobre cada transação processada. Compõe o MDR junto com o interchange e o markup do adquirente. Inclui assessment fees, transaction fees, cross-border fees, entre outros componentes.",
    aliases: ["scheme fee", "brand fee", "taxa da bandeira"],
    category: "precificacao",
    relatedTerms: ["interchange", "mdr", "assessment-fee"],
  },
  {
    id: "assessment-fee",
    term: "Assessment Fee",
    definition:
      "Taxa cobrada pela bandeira sobre o volume total de transações processadas. Diferente do interchange (que vai ao emissor), o assessment fee remunera diretamente a bandeira por manter a rede. Componente do scheme fee.",
    aliases: ["assessment fee", "network assessment", "taxa de rede"],
    category: "precificacao",
    relatedTerms: ["scheme-fee", "interchange", "card-scheme"],
  },

  // --- Segurança & Compliance ---
  {
    id: "pci-saq-a",
    term: "PCI SAQ-A",
    definition:
      "Questionário de autoavaliação PCI DSS para merchants que terceirizam completamente o processamento de cartão (ex.: redirect para página do PSP). Menor escopo de conformidade, sem armazenamento ou transmissão de dados de cartão pelo merchant.",
    aliases: ["SAQ-A", "PCI SAQ A", "self-assessment questionnaire A"],
    category: "security",
    relatedTerms: ["pci-dss", "pci-saq-d"],
  },
  {
    id: "pci-saq-d",
    term: "PCI SAQ-D",
    definition:
      "Questionário de autoavaliação PCI DSS mais abrangente, para merchants que armazenam, processam ou transmitem dados de cartão. Contém todos os requisitos PCI DSS e exige controles rigorosos de segurança.",
    aliases: ["SAQ-D", "PCI SAQ D", "self-assessment questionnaire D"],
    category: "security",
    relatedTerms: ["pci-dss", "pci-saq-a"],
  },
  {
    id: "pa-dss",
    term: "PA-DSS (Payment Application Data Security Standard)",
    definition:
      "Padrão de segurança para softwares de pagamento comercializados e instalados em múltiplos clientes. Substituído pelo PCI Software Security Framework (SSF) em 2022. Garantia de que o aplicativo de pagamento não armazena dados proibidos.",
    aliases: ["PA-DSS", "payment application DSS"],
    category: "security",
    relatedTerms: ["pci-dss"],
  },
  {
    id: "avs",
    term: "AVS (Address Verification Service)",
    definition:
      "Serviço antifraude que compara o endereço informado pelo comprador com o endereço cadastrado no emissor do cartão. Retorna códigos indicando match total, parcial ou sem match. Comum nos EUA e Reino Unido, pouco utilizado no Brasil.",
    aliases: ["AVS", "address verification service", "verificação de endereço"],
    category: "security",
    relatedTerms: ["cvv", "fraud", "3ds"],
  },
  {
    id: "dpan",
    term: "DPAN (Device Primary Account Number)",
    definition:
      "Token gerado pela bandeira que substitui o PAN real em carteiras digitais (Apple Pay, Google Pay). Vinculado a um dispositivo específico, o DPAN é inútil se interceptado em outro contexto. Diferente do FPAN (PAN real do cartão físico).",
    aliases: ["DPAN", "device PAN", "device account number"],
    category: "security",
    relatedTerms: ["pan", "fpan", "tokenization"],
  },
  {
    id: "fpan",
    term: "FPAN (Funding Primary Account Number)",
    definition:
      "Número real do cartão de pagamento (o PAN impresso no cartão físico), em contraste com o DPAN (token do dispositivo). Usado internamente pelo emissor para identificar a conta. Deve ser protegido conforme PCI DSS.",
    aliases: ["FPAN", "funding PAN", "funding primary account number"],
    category: "security",
    relatedTerms: ["pan", "dpan", "tokenization", "pci-dss"],
  },
  {
    id: "bin-iin",
    term: "BIN/IIN (Bank Identification Number / Issuer Identification Number)",
    definition:
      "Primeiros 6 a 8 dígitos de um cartão de pagamento que identificam o emissor e a bandeira. IIN é o termo mais recente da ISO, mas BIN ainda é amplamente utilizado. Permite roteamento inteligente e regras de risco baseadas no emissor.",
    aliases: ["BIN", "IIN", "bank identification number", "issuer identification number"],
    category: "security",
    relatedTerms: ["bin", "pan", "issuer"],
  },

  // --- Autenticação ---
  {
    id: "acs",
    term: "ACS (Access Control Server)",
    definition:
      "Servidor do emissor do cartão que participa do fluxo 3D Secure. Recebe a requisição de autenticação, avalia o risco da transação e decide se aprova com autenticação frictionless ou exige challenge (OTP, biometria, etc.).",
    aliases: ["ACS", "access control server"],
    category: "autenticacao",
    relatedTerms: ["3ds", "ds-directory-server", "frictionless-auth"],
  },
  {
    id: "ds-directory-server",
    term: "DS (Directory Server)",
    definition:
      "Componente da infraestrutura 3D Secure operado pela bandeira (Visa, Mastercard). Roteia mensagens de autenticação entre o 3DS Server do merchant e o ACS do emissor. Determina se o cartão está inscrito no 3DS.",
    aliases: ["DS", "directory server", "3DS directory server"],
    category: "autenticacao",
    relatedTerms: ["3ds", "acs", "card-scheme"],
  },
  {
    id: "frictionless-auth",
    term: "Frictionless Authentication",
    definition:
      "Fluxo do 3DS 2.x onde a transação é autenticada sem interação do portador. O ACS do emissor avalia dados contextuais (dispositivo, histórico, valor) e aprova silenciosamente. Resulta em melhor experiência de checkout e maior taxa de conversão.",
    aliases: ["frictionless", "frictionless authentication", "autenticação sem fricção"],
    category: "autenticacao",
    relatedTerms: ["3ds", "acs", "challenge-flow"],
  },
  {
    id: "challenge-flow",
    term: "Challenge Flow",
    definition:
      "Fluxo do 3DS 2.x onde o ACS do emissor exige verificação adicional do portador do cartão. Apresenta um desafio (OTP via SMS, biometria, push notification) em um iframe ou redirect. Usado quando o risco da transação é considerado elevado.",
    aliases: ["challenge flow", "fluxo de desafio", "3DS challenge"],
    category: "autenticacao",
    relatedTerms: ["3ds", "acs", "frictionless-auth"],
  },

  // --- Tecnologia ---
  {
    id: "emv-tech",
    term: "EMV (Europay, Mastercard, Visa)",
    definition:
      "Especificação técnica global para cartões com chip e pagamentos contactless. Define padrões de comunicação entre cartão e terminal, gerando criptogramas únicos por transação. Administrado pela EMVCo, consórcio das principais bandeiras.",
    aliases: ["EMV", "EMVCo", "chip and PIN"],
    category: "tecnologia",
    relatedTerms: ["nfc", "tokenization", "3ds"],
  },
  {
    id: "contactless-nfc",
    term: "Contactless/NFC",
    definition:
      "Tecnologia que permite pagamentos por aproximação usando NFC (Near Field Communication) a 13.56 MHz. Cartões e dispositivos móveis se comunicam com o terminal a distâncias de até 4cm. Padrão EMV Contactless define os protocolos de comunicação.",
    aliases: ["contactless", "NFC", "pagamento por aproximação", "tap to pay"],
    category: "tecnologia",
    relatedTerms: ["emv", "tokenization"],
  },
  {
    id: "hosted-fields",
    term: "Hosted Fields",
    definition:
      "Técnica de integração onde campos sensíveis do formulário de pagamento (número do cartão, CVV) são renderizados em iframes controlados pelo PSP. O merchant nunca recebe dados de cartão, reduzindo escopo PCI DSS para SAQ-A.",
    aliases: ["hosted fields", "campos hospedados", "secure fields"],
    category: "tecnologia",
    relatedTerms: ["pci-dss", "pci-saq-a", "psp"],
  },
  {
    id: "tokenizacao-client-side",
    term: "Tokenização Client-Side",
    definition:
      "Processo onde dados do cartão são convertidos em token diretamente no navegador ou app do cliente via JavaScript SDK do PSP, antes de chegar ao servidor do merchant. Protege dados em trânsito e simplifica conformidade PCI.",
    aliases: ["client-side tokenization", "tokenização no cliente", "browser tokenization"],
    category: "tecnologia",
    relatedTerms: ["tokenization", "pci-dss", "hosted-fields"],
  },
  {
    id: "webhook",
    term: "Webhook",
    definition:
      "Mecanismo de notificação HTTP onde o PSP/adquirente envia requisições POST ao endpoint do merchant quando eventos ocorrem (pagamento aprovado, chargeback, etc.). Alternativa a polling. Requer validação de assinatura e tratamento idempotente.",
    aliases: ["webhook", "callback", "notificação HTTP"],
    category: "tecnologia",
    relatedTerms: ["idempotency", "psp"],
  },
  {
    id: "idempotencia-tech",
    term: "Idempotência (API)",
    definition:
      "Garantia de que múltiplas requisições idênticas produzem o mesmo resultado. Em APIs de pagamento, implementada via idempotency key no header. Previne cobranças duplicadas em cenários de retry após timeout ou erro de rede.",
    aliases: ["idempotency key", "chave de idempotência"],
    category: "tecnologia",
    relatedTerms: ["webhook", "psp"],
  },
  {
    id: "sandbox",
    term: "Sandbox",
    definition:
      "Ambiente de teste fornecido por PSPs e adquirentes que simula transações sem movimentar dinheiro real. Permite desenvolvedores integrar e testar fluxos de pagamento com cartões de teste, respostas simuladas e cenários de erro.",
    aliases: ["sandbox", "ambiente de testes", "test environment"],
    category: "tecnologia",
    relatedTerms: ["homologacao", "webhook"],
  },
  {
    id: "homologacao",
    term: "Homologação",
    definition:
      "Processo de validação e certificação de uma integração de pagamento antes de entrar em produção. Envolve testes funcionais, de segurança e de conformidade com requisitos do adquirente ou bandeira. Etapa obrigatória para ir ao ar.",
    aliases: ["homologação", "certification", "UAT", "user acceptance testing"],
    category: "tecnologia",
    relatedTerms: ["sandbox"],
  },

  // --- Settlement ---
  {
    id: "rtgs-settlement",
    term: "RTGS (Real-Time Gross Settlement)",
    definition:
      "Sistema onde cada transação é liquidada individualmente e em tempo real, com finalidade imediata. Usado para transferências de grandes valores entre bancos. Exemplos: Fedwire (EUA), TARGET2 (Europa), STR (Brasil).",
    aliases: ["RTGS", "liquidação bruta em tempo real", "LBTR"],
    category: "settlement",
    relatedTerms: ["dns-settlement", "str", "settlement"],
  },
  {
    id: "dns-settlement",
    term: "DNS (Deferred Net Settlement)",
    definition:
      "Modelo de liquidação onde transações são acumuladas durante o dia e compensadas em lote, transferindo apenas o valor líquido entre as partes. Reduz o volume de transferências, mas não oferece finalidade em tempo real.",
    aliases: ["DNS", "deferred net settlement", "liquidação diferida"],
    category: "settlement",
    relatedTerms: ["rtgs-settlement", "netting", "clearing"],
  },
  {
    id: "spread-cambial",
    term: "Spread Cambial",
    definition:
      "Diferença entre a taxa de câmbio de compra e venda praticada por uma instituição financeira. Em pagamentos internacionais com cartão, o spread é cobrado pelo emissor ou bandeira sobre a cotação do dólar no dia da conversão.",
    aliases: ["spread cambial", "FX spread", "spread de câmbio"],
    category: "settlement",
    relatedTerms: ["dcc", "remessa-internacional"],
  },
  {
    id: "iof",
    term: "IOF (Imposto sobre Operações Financeiras)",
    definition:
      "Tributo federal brasileiro incidente sobre operações de crédito, câmbio, seguros e valores mobiliários. Em compras internacionais com cartão, a alíquota é de 4,38% sobre o valor convertido. Em PIX e transferências domésticas, não há incidência.",
    aliases: ["IOF", "imposto sobre operações financeiras"],
    category: "settlement",
    relatedTerms: ["spread-cambial", "remessa-internacional"],
  },
  {
    id: "remessa-internacional",
    term: "Remessa Internacional",
    definition:
      "Transferência de valores entre países, tipicamente via SWIFT ou correspondente bancário. Envolve conversão cambial, IOF, taxas de intermediários e compliance AML/KYC. Fintechs como Wise e Remessa Online oferecem alternativas mais baratas.",
    aliases: ["remessa internacional", "international remittance", "cross-border transfer"],
    category: "settlement",
    relatedTerms: ["swift", "correspondent-banking", "iof", "spread-cambial"],
  },

  // --- Crypto Avançado ---
  {
    id: "bridge-blockchain",
    term: "Bridge (Blockchain)",
    definition:
      "Protocolo que permite transferir ativos e dados entre blockchains diferentes (ex.: Ethereum para Solana). Funciona bloqueando ativos na chain de origem e emitindo equivalentes na chain de destino. Ponto crítico de segurança no ecossistema cripto.",
    aliases: ["bridge", "cross-chain bridge", "ponte blockchain"],
    category: "crypto",
    relatedTerms: ["blockchain", "layer-2"],
  },
  {
    id: "mev",
    term: "MEV (Maximal Extractable Value)",
    definition:
      "Valor que mineradores ou validadores podem extrair reordenando, incluindo ou excluindo transações em um bloco. Inclui arbitragem, liquidações e front-running. Fenômeno significativo em DeFi que afeta custos de transação dos usuários.",
    aliases: ["MEV", "maximal extractable value", "miner extractable value"],
    category: "crypto",
    relatedTerms: ["defi", "blockchain"],
  },
  {
    id: "impermanent-loss",
    term: "Impermanent Loss",
    definition:
      "Perda temporária sofrida por provedores de liquidez em AMMs quando o preço relativo dos tokens no pool muda em relação ao momento do depósito. Torna-se permanente se os tokens são retirados antes de o preço retornar. Risco inerente a pools de liquidez.",
    aliases: ["impermanent loss", "perda impermanente", "IL"],
    category: "crypto",
    relatedTerms: ["amm", "liquidity-pool", "defi"],
  },
  {
    id: "flash-loan",
    term: "Flash Loan",
    definition:
      "Empréstimo sem colateral que deve ser tomado e devolvido na mesma transação de blockchain. Se não for devolvido, toda a transação é revertida. Usado para arbitragem, refinanciamento e ataques. Inovação única de DeFi sem paralelo em finanças tradicionais.",
    aliases: ["flash loan", "empréstimo relâmpago"],
    category: "crypto",
    relatedTerms: ["defi", "smart-contract"],
  },
  {
    id: "oracle-blockchain",
    term: "Oracle (Blockchain)",
    definition:
      "Serviço que fornece dados do mundo real (preços, clima, resultados) para smart contracts na blockchain. Essencial para DeFi (feeds de preço), seguros paramétricos e mercados de previsão. Principal provedor: Chainlink.",
    aliases: ["oracle", "blockchain oracle", "oráculo"],
    category: "crypto",
    relatedTerms: ["smart-contract", "defi"],
  },
  {
    id: "rollup",
    term: "Rollup",
    definition:
      "Solução de escalabilidade Layer 2 que processa transações fora da chain principal e publica provas compactadas de volta nela. Dois tipos: Optimistic Rollups (assumem validade, permitem desafios) e ZK-Rollups (provam validade matematicamente).",
    aliases: ["rollup", "optimistic rollup", "ZK rollup"],
    category: "crypto",
    relatedTerms: ["layer-2", "blockchain", "zk-proof"],
  },
  {
    id: "layer-2",
    term: "Layer 2",
    definition:
      "Protocolo construído sobre uma blockchain principal (Layer 1) para aumentar escalabilidade e reduzir custos de transação. Herda a segurança da chain base. Exemplos: Lightning Network (Bitcoin), Arbitrum e Optimism (Ethereum).",
    aliases: ["Layer 2", "L2", "segunda camada"],
    category: "crypto",
    relatedTerms: ["rollup", "blockchain"],
  },
  {
    id: "zk-proof",
    term: "Zero Knowledge Proof (ZKP)",
    definition:
      "Método criptográfico que permite provar a veracidade de uma informação sem revelar a informação em si. Aplicações em blockchain: privacidade de transações (Zcash), escalabilidade (ZK-Rollups) e identidade descentralizada.",
    aliases: ["ZKP", "zero knowledge proof", "prova de conhecimento zero", "ZK"],
    category: "crypto",
    relatedTerms: ["rollup", "blockchain"],
  },
  {
    id: "liquidity-pool",
    term: "Liquidity Pool",
    definition:
      "Par de tokens depositados em um smart contract que fornece liquidez para trocas em DEXs baseadas em AMM. Provedores de liquidez recebem fees proporcionais à sua participação no pool. Base da infraestrutura de DeFi.",
    aliases: ["liquidity pool", "pool de liquidez", "LP"],
    category: "crypto",
    relatedTerms: ["amm", "defi", "impermanent-loss"],
  },

  // --- 2025 Updates ---
  {
    id: "pix-automatico",
    term: "Pix Automático",
    definition:
      "Modalidade do Pix que permite débito automático recorrente, similar ao débito automático bancário. Lançado pelo BCB em junho de 2025, permite que empresas debitem automaticamente a conta do pagador em datas pré-acordadas, ideal para assinaturas, mensalidades e contas recorrentes.",
    aliases: ["pix automático", "pix recorrente", "débito automático pix"],
    category: "pix",
    relatedTerms: ["pix", "pix-garantido", "request-to-pay"],
  },
  {
    id: "pix-garantido",
    term: "Pix Garantido",
    definition:
      "Funcionalidade do Pix que permite parcelamento com garantia de pagamento pelo PSP do pagador. O recebedor recebe o valor integral à vista, enquanto o pagador parcela. Similar ao cartão de crédito mas usando infraestrutura Pix.",
    aliases: ["pix garantido", "pix parcelado", "pix crédito"],
    category: "pix",
    relatedTerms: ["pix", "pix-automatico", "bnpl-regulation"],
  },
  {
    id: "drex",
    term: "Drex (Real Digital)",
    definition:
      "Moeda digital de banco central (CBDC) brasileira emitida pelo Banco Central do Brasil. Baseada em tecnologia DLT (Distributed Ledger Technology), permite liquidação instantânea de ativos tokenizados, contratos inteligentes e interoperabilidade com o sistema financeiro tradicional. Piloto iniciado em 2024, com lançamento previsto para 2025.",
    aliases: ["drex", "real digital", "CBDC brasileira", "moeda digital BCB"],
    category: "crypto",
    relatedTerms: ["real-digital", "tokenized-deposits", "blockchain"],
  },
  {
    id: "itp",
    term: "ITP (Iniciador de Transação de Pagamento)",
    definition:
      "Instituição regulada pelo BCB no âmbito do Open Finance que pode iniciar transações de pagamento em nome do cliente, sem ser detentora da conta. Permite que fintechs e apps iniciem Pix ou transferências diretamente da conta bancária do usuário via APIs padronizadas.",
    aliases: ["ITP", "iniciador de transação", "payment initiation service", "PISP"],
    category: "regulation",
    relatedTerms: ["open-finance-fase-4", "pix", "a2a-payments"],
  },
  {
    id: "pci-dss-v4-0-1",
    term: "PCI DSS v4.0.1",
    definition:
      "Versão atualizada do padrão de segurança de dados da indústria de cartões. Enforcement completo em 31 de março de 2025, eliminando período de transição. Principais mudanças: MFA obrigatório para todos os acessos ao CDE, scripts de terceiros monitorados, inventário de componentes de software, e targeted risk analysis para controles flexíveis.",
    aliases: ["PCI DSS 4.0.1", "PCI v4", "PCI DSS v4", "PCI 4.0.1"],
    category: "security",
    relatedTerms: ["pci-dss", "tokenization"],
  },
  {
    id: "click-to-pay",
    term: "Click to Pay",
    definition:
      "Padrão de checkout padronizado pela EMVCo que unifica a experiência de pagamento online entre Visa, Mastercard, Amex e Discover. O consumidor se registra uma vez e paga com um clique em qualquer merchant habilitado, sem digitar dados do cartão. Substitui o guest checkout com cards on file.",
    aliases: ["click to pay", "CTP", "SRC", "secure remote commerce"],
    category: "tecnologia",
    relatedTerms: ["tokenization", "3ds"],
  },
  {
    id: "tap-to-pay",
    term: "Tap to Pay (SoftPOS)",
    definition:
      "Tecnologia que transforma smartphones em terminais de pagamento contactless (NFC), eliminando a necessidade de maquininhas físicas. O merchant recebe pagamentos por aproximação diretamente no celular. Habilitado por Apple, Google e Samsung em parceria com adquirentes.",
    aliases: ["tap to pay", "SoftPOS", "soft POS", "NFC payment", "contactless no celular"],
    category: "tecnologia",
    relatedTerms: ["nfc", "pos", "acquirer"],
  },
  {
    id: "a2a-payments",
    term: "A2A Payments (Account-to-Account)",
    definition:
      "Transferências bancárias diretas entre contas sem intermediação de redes de cartão. Inclui Pix no Brasil, SEPA Instant na Europa, FedNow nos EUA, e UPI na Índia. Custo significativamente menor que cartão, liquidação instantânea, sem interchange.",
    aliases: ["A2A", "account to account", "transferência direta", "bank transfer"],
    category: "processing",
    relatedTerms: ["pix", "interchange", "request-to-pay"],
  },
  {
    id: "request-to-pay",
    term: "Request to Pay (R2P)",
    definition:
      "Mensagem padronizada que permite ao recebedor solicitar pagamento ao pagador, que pode aprovar, recusar ou negociar. Implementado sobre infraestrutura de instant payments (Pix Cobrança no Brasil, SEPA R2P na Europa). Ideal para B2B e cobranças recorrentes.",
    aliases: ["R2P", "request to pay", "solicitação de pagamento", "pix cobrança"],
    category: "processing",
    relatedTerms: ["pix", "a2a-payments", "pix-automatico"],
  },
  {
    id: "bnpl-regulation",
    term: "Regulação de BNPL",
    definition:
      "Enquadramento regulatório de serviços Buy Now Pay Later. No Brasil, BNPL se enquadra como operação de crédito (Resolução BCB 4.656). Na Europa, incluído na Consumer Credit Directive revisada (2023). Nos EUA, sob supervisão do CFPB desde 2024. Exige análise de crédito, transparência de custos e reporting.",
    aliases: ["BNPL regulation", "regulação buy now pay later", "compre agora pague depois"],
    category: "regulation",
    relatedTerms: ["embedded-lending", "pix-garantido"],
  },
  {
    id: "embedded-lending",
    term: "Embedded Lending",
    definition:
      "Oferta de crédito integrada em plataformas não-financeiras (e-commerce, SaaS, marketplaces). O crédito é oferecido no ponto de necessidade do cliente, com underwriting automatizado via APIs de instituições financeiras parceiras (SCDs, FIDCs). Modelo BaaS (Banking as a Service).",
    aliases: ["embedded lending", "crédito embarcado", "lending as a service"],
    category: "credito",
    relatedTerms: ["bnpl-regulation", "baas"],
  },
  {
    id: "tokenized-deposits",
    term: "Depósitos Tokenizados",
    definition:
      "Representação digital de depósitos bancários em blockchain/DLT, mantendo lastro 1:1 com depósito real. Diferente de stablecoins (emitidas por empresas cripto), depósitos tokenizados são emitidos por bancos regulados. Pilar central do Drex e de iniciativas de CBDC wholesale.",
    aliases: ["tokenized deposits", "depósitos tokenizados", "deposit tokens"],
    category: "crypto",
    relatedTerms: ["drex", "real-digital", "stablecoin"],
  },
  {
    id: "real-digital",
    term: "Real Digital",
    definition:
      "Nome original da CBDC brasileira, posteriormente renomeada para Drex. Projeto do Banco Central do Brasil para criar representação digital da moeda nacional em infraestrutura DLT, com foco em liquidação de ativos tokenizados e programabilidade.",
    aliases: ["real digital", "CBDC Brasil", "moeda digital brasileira"],
    category: "crypto",
    relatedTerms: ["drex", "tokenized-deposits", "blockchain"],
  },
  {
    id: "pix-por-aproximacao",
    term: "Pix por Aproximação",
    definition:
      "Modalidade do Pix que permite pagamento via NFC (Near Field Communication) sem necessidade de escanear QR code. Em piloto pelo BCB desde 2025, funciona aproximando o celular do terminal. Combina a velocidade do contactless com o custo zero do Pix.",
    aliases: ["pix NFC", "pix contactless", "pix por aproximação", "pix tap"],
    category: "pix",
    relatedTerms: ["pix", "nfc", "tap-to-pay"],
  },
  {
    id: "open-finance-fase-4",
    term: "Open Finance Fase 4",
    definition:
      "Quarta fase do Open Finance Brasil que inclui compartilhamento de dados de investimentos, seguros, previdência e câmbio. Expande o escopo além de banking e pagamentos, criando um ecossistema financeiro aberto completo. Implementação progressiva ao longo de 2024-2025.",
    aliases: ["open finance fase 4", "open finance phase 4", "open banking fase 4"],
    category: "regulation",
    relatedTerms: ["itp", "pix"],
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
