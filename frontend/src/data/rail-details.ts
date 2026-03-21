/**
 * Dados detalhados dos Trilhos de Pagamento — conteúdo dos modais.
 *
 * Cada rail tem seções tipadas (cards, table, steps, comparison, text)
 * que são renderizadas dinamicamente pelo modal na página de Payment Rails.
 */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface RailCardItem {
  name: string;
  description: string;
  details: { label: string; value: string }[];
}

export interface RailSectionCards {
  type: "cards";
  title: string;
  description?: string;
  items: RailCardItem[];
}

export interface RailSectionTable {
  type: "table";
  title: string;
  description?: string;
  columns: { key: string; label: string }[];
  rows: Record<string, string>[];
}

export interface RailSectionSteps {
  type: "steps";
  title: string;
  description?: string;
  steps: { step: number; label: string; description: string }[];
}

export interface RailSectionComparison {
  type: "comparison";
  title: string;
  description?: string;
  groups: {
    name: string;
    color?: string;
    items: { label: string; value: string }[];
  }[];
}

export interface RailSectionText {
  type: "text";
  title: string;
  paragraphs: string[];
}

export type RailDetailSection =
  | RailSectionCards
  | RailSectionTable
  | RailSectionSteps
  | RailSectionComparison
  | RailSectionText;

export interface RailDetail {
  railName: string;
  sections: RailDetailSection[];
}

// ---------------------------------------------------------------------------
// Dados — 5 Rails
// ---------------------------------------------------------------------------

export const railDetails: RailDetail[] = [
  // =========================================================================
  // 1. CARTÕES
  // =========================================================================
  {
    railName: "Cartoes",
    sections: [
      {
        type: "cards",
        title: "Tipos de Cartao",
        description:
          "Os principais tipos de cartao de pagamento, cada um com caracteristicas e estruturas de taxas distintas.",
        items: [
          {
            name: "Cartao de Credito",
            description:
              "Linha de credito pre-aprovada pelo emissor. O portador paga depois do ciclo de faturamento. Maior taxa de interchange devido ao risco de credito assumido pelo emissor.",
            details: [
              { label: "Interchange Tipico", value: "1.5% - 2.5% (EUA). UE: max 0.3% (Reg. 2015/751). Brasil: regulado pelo BCB" },
              { label: "Casos de Uso", value: "E-commerce, recorrencia, viagens, parcelamento" },
              { label: "Limite", value: "Definido pela analise de credito do emissor" },
              { label: "Chargeback", value: "Ate 120 dias (Visa) / 120 dias (MC)" },
            ],
          },
          {
            name: "Cartao de Debito",
            description:
              "Debita diretamente da conta corrente do portador. Interchange mais baixo que credito pois nao ha risco de credito. Muito utilizado em POS e compras do dia a dia.",
            details: [
              { label: "Interchange Tipico", value: "0.5% - 1.5% (EUA). UE: max 0.2% (Reg. 2015/751). Brasil: regulado pelo BCB" },
              { label: "Casos de Uso", value: "Compras presenciais, supermercados, transporte" },
              { label: "Limite", value: "Saldo disponivel na conta corrente" },
              { label: "Chargeback", value: "Ate 120 dias (igual a credito, varia por reason code)" },
            ],
          },
          {
            name: "Cartao Pre-pago",
            description:
              "Carregado com valor antecipadamente. Sem vinculo a conta bancaria ou linha de credito. Usado para gift cards, beneficios (VR/VA) e inclusao financeira.",
            details: [
              { label: "Interchange Tipico", value: "1.0% - 2.0%" },
              { label: "Casos de Uso", value: "Gift cards, beneficios corporativos, viagem, teens" },
              { label: "Limite", value: "Saldo carregado (recarga opcional)" },
              { label: "Regulacao", value: "Sujeito a limites de carga por jurisdicao" },
            ],
          },
          {
            name: "Cartao Virtual",
            description:
              "Numero de cartao gerado digitalmente para uso unico ou temporario. Sem plastico fisico. Ideal para compras online seguras e controle de gastos corporativos.",
            details: [
              { label: "Interchange Tipico", value: "Igual ao tipo base (credito/debito)" },
              { label: "Casos de Uso", value: "Compras online, assinaturas trial, corporativo" },
              { label: "Seguranca", value: "Numero unico por transacao elimina reuso" },
              { label: "Emissores", value: "Nubank, C6, Revolut, Brex, Ramp" },
            ],
          },
          {
            name: "Cartao Corporate / Business",
            description:
              "Emitido para empresas com limites maiores, dados Level II/III e reporting detalhado. Qualifica em faixas de interchange reduzidas quando dados enriquecidos sao enviados.",
            details: [
              { label: "Interchange Tipico", value: "1.8% - 2.8% (reduzido com Level II/III)" },
              { label: "Casos de Uso", value: "Despesas de viagem, compras B2B, SaaS" },
              { label: "Dados Level II/III", value: "Tax amount, PO number, line items" },
              { label: "Beneficio", value: "Economia de 0.3-0.5% com dados enriquecidos" },
            ],
          },
        ],
      },
      {
        type: "table",
        title: "Tabela de Taxas por Bandeira",
        description:
          "Taxas de interchange, assessment e processamento das principais bandeiras. Valores referem-se ao mercado dos EUA e variam significativamente por regiao (UE: caps de 0.2-0.3%, Brasil: regulado pelo BCB), tipo de cartao e canal.",
        columns: [
          { key: "brand", label: "Bandeira" },
          { key: "interchangeDom", label: "Interchange Domestico" },
          { key: "interchangeCB", label: "Interchange Cross-Border" },
          { key: "assessment", label: "Assessment Fee" },
          { key: "ecommerce", label: "Adicional E-Commerce" },
          { key: "recurring", label: "Adicional Recorrente" },
          { key: "premium", label: "Premium/Rewards" },
        ],
        rows: [
          {
            brand: "Visa",
            interchangeDom: "1.15% - 2.40%",
            interchangeCB: "1.45% - 2.80%",
            assessment: "0.14%",
            ecommerce: "+0.10% - 0.15%",
            recurring: "+0.05% - 0.10%",
            premium: "+0.20% - 0.45% (Infinite/Signature)",
          },
          {
            brand: "Mastercard",
            interchangeDom: "1.15% - 2.50%",
            interchangeCB: "1.50% - 2.90%",
            assessment: "0.13% (dom) / 0.60% (intl)",
            ecommerce: "+0.10% - 0.15%",
            recurring: "+0.05% - 0.10%",
            premium: "+0.25% - 0.50% (World Elite)",
          },
          {
            brand: "American Express",
            interchangeDom: "2.00% - 3.50%",
            interchangeCB: "2.50% - 3.95%",
            assessment: "Embutido (modelo OptBlue)",
            ecommerce: "Incluso na taxa base",
            recurring: "Incluso na taxa base",
            premium: "Inerente — todos sao premium",
          },
          {
            brand: "Elo",
            interchangeDom: "0.80% - 2.30%",
            interchangeCB: "N/A (domestico BR)",
            assessment: "0.08% - 0.12%",
            ecommerce: "+0.05% - 0.10%",
            recurring: "+0.03% - 0.08%",
            premium: "+0.15% - 0.30% (Grafite/Diners)",
          },
        ],
      },
      {
        type: "steps",
        title: "Fluxo de Autorizacao de Cartao",
        description: "As etapas de uma transacao com cartao, do momento do pagamento ate a resposta ao portador.",
        steps: [
          {
            step: 1,
            label: "Portador do Cartao",
            description: "Insere ou aproxima o cartao no checkout (online ou presencial). Dados sao capturados pelo formulario ou terminal.",
          },
          {
            step: 2,
            label: "Gateway / PSP",
            description: "Recebe os dados, aplica tokenizacao PCI, enriquece com device fingerprint e envia ao processador.",
          },
          {
            step: 3,
            label: "Processador / Adquirente",
            description: "Executa fraud scoring, velocity checks, formata a mensagem ISO 8583 (0100) e roteia para a bandeira.",
          },
          {
            step: 4,
            label: "Rede / Bandeira",
            description: "Visa/Mastercard valida o BIN, aplica regras de rede, roteia para o emissor correto e cobra assessment fee.",
          },
          {
            step: 5,
            label: "Banco Emissor",
            description: "Verifica saldo/limite, aplica regras de fraude internas, verifica restricoes geograficas e decide aprovar ou recusar.",
          },
          {
            step: 6,
            label: "Resposta (Reverso)",
            description: "A decisao (aprovado/recusado + codigo de resposta) volta pela mesma cadeia: Emissor → Bandeira → Adquirente → Gateway.",
          },
          {
            step: 7,
            label: "Confirmacao ao Portador",
            description: "O merchant recebe o resultado via webhook/API, exibe confirmacao ao cliente e inicia fulfillment se aprovado.",
          },
        ],
      },
      {
        type: "cards",
        title: "Regulamentacoes Principais",
        description: "Regulacoes e padroes que governam o ecossistema de cartoes.",
        items: [
          {
            name: "PCI DSS",
            description:
              "Payment Card Industry Data Security Standard — conjunto de 12 requisitos de seguranca para proteger dados de portadores de cartao.",
            details: [
              { label: "Niveis", value: "Level 1 (>6M txns) a Level 4 (<20K txns)" },
              { label: "Requisitos", value: "Criptografia, firewall, controle de acesso, testes" },
              { label: "Penalidade", value: "Multas de $5K-$100K/mes por nao-compliance" },
            ],
          },
          {
            name: "SCA / PSD2 (Europa)",
            description:
              "Strong Customer Authentication — exige autenticacao de dois fatores para pagamentos eletronicos na UE/EEA. Parte da diretiva PSD2.",
            details: [
              { label: "Regra", value: "SCA obrigatoria para TODAS as transacoes eletronicas. Isencoes possiveis: low-value (<€30), TRA, recorrencia, whitelisting" },
              { label: "Isencoes", value: "Low-value (<€30), TRA (baixo risco), MIT (merchant-initiated), trusted beneficiary" },
              { label: "Implementacao", value: "Via 3D Secure 2.x (EMV 3DS)" },
            ],
          },
          {
            name: "Regras de Chargeback",
            description:
              "Programas de monitoramento das bandeiras que penalizam merchants com taxas excessivas de disputas.",
            details: [
              { label: "Visa VDMP", value: "Threshold: 0.9% rate + 100 disputas/mes" },
              { label: "Mastercard ECM/ECP", value: "ECM (alerta): 1.0% + 100 CB. ECP (penalidade): 1.5% + 100 CB" },
              { label: "Multas", value: "Visa: $50-$25K/mes. MC: $1K-$200K/mes. Estruturas distintas por bandeira" },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 2. TRANSFERÊNCIAS BANCÁRIAS
  // =========================================================================
  {
    railName: "Transferencias Bancarias",
    sections: [
      {
        type: "cards",
        title: "Sistemas de Transferencia",
        description:
          "Os principais sistemas de pagamento conta-a-conta ao redor do mundo, cada um com velocidade, custo e cobertura distintos.",
        items: [
          {
            name: "PIX (Brasil)",
            description:
              "Sistema de pagamento instantaneo do Banco Central do Brasil. Liquidacao em segundos, 24/7/365, sem custo para pessoa fisica.",
            details: [
              { label: "Velocidade", value: "< 10 segundos (tempo real)" },
              { label: "Taxas PF", value: "Gratuito" },
              { label: "Taxas PJ", value: "0.01% - 0.22% por transacao (valores praticados pelo mercado, nao regulados pelo BCB)" },
              { label: "Limite", value: "Configuravel pelo usuario (noturno: R$1.000)" },
              { label: "Disponibilidade", value: "24/7/365" },
            ],
          },
          {
            name: "SEPA Instant (Europa)",
            description:
              "Transferencias instantaneas em euros entre 36 paises europeus. Liquidacao em ate 10 segundos com cobertura pan-europeia.",
            details: [
              { label: "Velocidade", value: "< 10 segundos" },
              { label: "Taxas", value: "€0.20 - €1.00 por transacao" },
              { label: "Limite", value: "€100.000 por transacao (elevado de €15.000 em 2024, Reg. UE 2024/886)" },
              { label: "Cobertura", value: "36 paises (UE + EEA)" },
              { label: "Disponibilidade", value: "24/7/365" },
            ],
          },
          {
            name: "SEPA Credit Transfer",
            description:
              "Transferencia padrao em euros via batch processing. Mais lento que SEPA Instant mas com limite mais alto e custo mais baixo.",
            details: [
              { label: "Velocidade", value: "1-2 dias uteis" },
              { label: "Taxas", value: "€0.10 - €0.50" },
              { label: "Limite", value: "Sem limite definido (depende do banco)" },
              { label: "Modelo", value: "DNS (Deferred Net Settlement)" },
              { label: "Disponibilidade", value: "Dias uteis apenas" },
            ],
          },
          {
            name: "ACH (EUA)",
            description:
              "Automated Clearing House — sistema de compensacao em lote dos EUA. Usado para folha de pagamento, pagamento de contas e debito direto. Same-day ACH disponivel.",
            details: [
              { label: "Velocidade", value: "1-3 dias uteis (Same-day: mesmo dia)" },
              { label: "Taxas", value: "$0.20 - $1.50 por transacao" },
              { label: "Limite Same-Day", value: "$1.000.000 por transacao" },
              { label: "Volume Anual", value: "~30 bilhoes de transacoes/ano" },
              { label: "Operador", value: "Nacha (regras) / Fed + EPN (operacao)" },
            ],
          },
          {
            name: "Faster Payments (UK)",
            description:
              "Sistema de pagamento rapido do Reino Unido. Transferencias em tempo quase real entre contas bancarias britanicas.",
            details: [
              { label: "Velocidade", value: "< 2 horas (tipicamente segundos)" },
              { label: "Taxas", value: "Gratuito para PF na maioria dos bancos" },
              { label: "Limite", value: "£1.000.000 (varia por banco)" },
              { label: "Disponibilidade", value: "24/7/365" },
              { label: "Operador", value: "Pay.UK" },
            ],
          },
          {
            name: "SWIFT / Wire Transfer",
            description:
              "Rede global de mensageria interbancaria para transferencias de alto valor e cross-border. Usado em comercio internacional e liquidacao interbancaria.",
            details: [
              { label: "Velocidade", value: "1-5 dias uteis" },
              { label: "Taxas", value: "$15 - $50+ por transferencia" },
              { label: "Cobertura", value: "200+ paises, 11.000+ bancos" },
              { label: "Uso Principal", value: "B2B cross-border, alto valor" },
              { label: "Evolucao", value: "SWIFT gpi para rastreamento em tempo real" },
            ],
          },
          {
            name: "UPI (India)",
            description:
              "Unified Payments Interface — plataforma de pagamento instantaneo da India interoperavel entre bancos via apps como PhonePe, Google Pay e Paytm.",
            details: [
              { label: "Velocidade", value: "Instantaneo (segundos)" },
              { label: "Taxas", value: "Gratuito para PF (subsidio governamental)" },
              { label: "Volume", value: "~12-14 bilhoes de transacoes/mes (em crescimento)" },
              { label: "Limite", value: "₹1 lakh (~$1.200) por transacao" },
              { label: "Operador", value: "NPCI (National Payments Corporation)" },
            ],
          },
          {
            name: "FedNow (EUA)",
            description:
              "Sistema de pagamento instantaneo do Federal Reserve lancado em 2023. Complementa ACH com liquidacao em tempo real 24/7.",
            details: [
              { label: "Velocidade", value: "Instantaneo (segundos)" },
              { label: "Taxas", value: "$0.045 por transacao (send)" },
              { label: "Limite", value: "$500.000 por transacao (default)" },
              { label: "Disponibilidade", value: "24/7/365" },
              { label: "Status", value: "Em expansao continua (numero de instituicoes cresce mensalmente)" },
            ],
          },
        ],
      },
      {
        type: "table",
        title: "Comparacao entre Sistemas",
        description:
          "Visao comparativa dos principais sistemas de transferencia bancaria por velocidade, custo e cobertura.",
        columns: [
          { key: "system", label: "Sistema" },
          { key: "speed", label: "Velocidade" },
          { key: "cost", label: "Custo Tipico" },
          { key: "coverage", label: "Cobertura" },
          { key: "availability", label: "Disponibilidade" },
          { key: "model", label: "Modelo" },
        ],
        rows: [
          { system: "PIX", speed: "< 10s", cost: "Gratuito (PF)", coverage: "Brasil", availability: "24/7", model: "RTGS" },
          { system: "SEPA Instant", speed: "< 10s", cost: "€0.20-1.00", coverage: "36 paises UE", availability: "24/7", model: "Instant" },
          { system: "SEPA Credit", speed: "1-2 dias", cost: "€0.10-0.50", coverage: "36 paises UE", availability: "Dias uteis", model: "DNS" },
          { system: "ACH", speed: "1-3 dias", cost: "$0.20-1.50", coverage: "EUA", availability: "Dias uteis", model: "DNS" },
          { system: "Same-Day ACH", speed: "Mesmo dia", cost: "$0.50-2.50", coverage: "EUA", availability: "Dias uteis", model: "DNS" },
          { system: "Faster Pay", speed: "Segundos", cost: "Gratuito (PF)", coverage: "UK", availability: "24/7", model: "Instant" },
          { system: "SWIFT", speed: "1-5 dias", cost: "$15-50+", coverage: "Global", availability: "Dias uteis", model: "Messaging" },
          { system: "UPI", speed: "Segundos", cost: "Gratuito (PF)", coverage: "India", availability: "24/7", model: "Instant" },
          { system: "FedNow", speed: "Segundos", cost: "$0.045", coverage: "EUA", availability: "24/7", model: "RTGS" },
        ],
      },
      {
        type: "text",
        title: "Conceitos Fundamentais",
        paragraphs: [
          "RTGS (Real-Time Gross Settlement): Cada transacao e liquidada individualmente em tempo real, sem netting. Usado por PIX, FedNow e sistemas de alto valor. Elimina risco de credito entre participantes mas requer mais liquidez.",
          "DNS (Deferred Net Settlement): Transacoes sao acumuladas em lotes e compensadas periodicamente (ex: fim do dia). O saldo liquido entre bancos e transferido. Usado por ACH, SEPA Credit. Mais eficiente em liquidez mas introduz risco de credito intradiario.",
          "Hybrid: Combina elementos de RTGS e DNS. Transacoes sao agrupadas em mini-lotes frequentes com liquidacao ao longo do dia. TIPS (Target Instant Payment Settlement) na Europa e um exemplo.",
          "Instant vs Batch: Sistemas instant (PIX, UPI, SEPA Instant) liquidam em segundos 24/7. Sistemas batch (ACH, SEPA Credit) processam em janelas fixas durante dias uteis. A tendencia global e migracao para instant payments.",
        ],
      },
    ],
  },

  // =========================================================================
  // 3. CARTEIRAS DIGITAIS
  // =========================================================================
  {
    railName: "Carteiras Digitais",
    sections: [
      {
        type: "cards",
        title: "Categorias de Carteiras Digitais",
        description:
          "Carteiras digitais organizadas por modelo de operacao, cobertura geografica e integracao com o ecossistema de pagamentos.",
        items: [
          {
            name: "NFC Wallets (Apple Pay / Google Pay)",
            description:
              "Carteiras nativas do dispositivo que usam NFC (Near Field Communication) para pagamentos contactless em lojas e tokenizacao de cartoes para compras online.",
            details: [
              { label: "Modelo", value: "Open-loop (usa cartao vinculado)" },
              { label: "Funding", value: "Cartao de credito/debito tokenizado" },
              { label: "Taxas ao Merchant", value: "Igual ao cartao base (sem adicional)" },
              { label: "Regioes", value: "Global (70+ paises)" },
              { label: "Seguranca", value: "Biometria + network token + criptograma" },
            ],
          },
          {
            name: "Super Apps (Alipay / WeChat Pay)",
            description:
              "Ecosistemas completos que combinam pagamentos, social, comercio, investimentos e servicos financeiros em um unico app. Dominantes na Asia.",
            details: [
              { label: "Modelo", value: "Closed-loop + Open-loop hibrido" },
              { label: "Funding", value: "Saldo pre-carregado + conta bancaria + cartao" },
              { label: "Taxas ao Merchant", value: "0.1% - 0.6% (domestico China)" },
              { label: "Regioes", value: "China (dominante), Sudeste Asiatico" },
              { label: "Usuarios", value: "1.3B (Alipay) + 900M (WeChat Pay)" },
            ],
          },
          {
            name: "P2P Wallets (PayPal / Venmo)",
            description:
              "Plataformas de transferencia peer-to-peer que expandiram para pagamentos em e-commerce e presencial. Modelo de saldo armazenado com opcao de checkout expresso.",
            details: [
              { label: "Modelo", value: "Closed-loop (saldo) + Open-loop (cartao)" },
              { label: "Funding", value: "Saldo PayPal, conta bancaria, cartao" },
              { label: "Taxas ao Merchant", value: "2.9% + $0.30 (padrao online)" },
              { label: "Regioes", value: "Global (PayPal: 200+ mercados)" },
              { label: "Diferencial", value: "Checkout expresso, protecao ao comprador" },
            ],
          },
          {
            name: "Regional (M-Pesa / MercadoPago)",
            description:
              "Carteiras dominantes em mercados especificos, frequentemente servindo populacoes sub-bancarizadas. Foco em inclusao financeira e ecosistema local.",
            details: [
              { label: "Modelo", value: "Closed-loop (saldo pre-carregado)" },
              { label: "Funding", value: "Cash-in via agentes, transferencia" },
              { label: "Taxas", value: "Varia: 0.5% - 2% (M-Pesa: ~1%)" },
              { label: "Regioes", value: "Africa (M-Pesa), LATAM (MercadoPago)" },
              { label: "Impacto", value: "M-Pesa: 50M+ usuarios, PIB Kenya +2%" },
            ],
          },
        ],
      },
      {
        type: "comparison",
        title: "Closed-Loop vs Open-Loop",
        description: "Os dois modelos fundamentais de carteiras digitais e suas implicacoes.",
        groups: [
          {
            name: "Closed-Loop",
            color: "var(--accent-amber)",
            items: [
              { label: "Definicao", value: "Saldo armazenado no proprio provedor" },
              { label: "Exemplos", value: "Starbucks Card, M-Pesa, vale-refeicao" },
              { label: "Vantagem", value: "Controle total, dados ricos, fidelizacao" },
              { label: "Limitacao", value: "Aceito apenas na rede do emissor" },
              { label: "Regulacao", value: "Pode exigir licenca de emissao de moeda eletronica" },
            ],
          },
          {
            name: "Open-Loop",
            color: "var(--primary-lighter)",
            items: [
              { label: "Definicao", value: "Usa trilho de cartao/banco existente" },
              { label: "Exemplos", value: "Apple Pay, Google Pay, Samsung Pay" },
              { label: "Vantagem", value: "Aceito em qualquer terminal com NFC/bandeira" },
              { label: "Limitacao", value: "Depende da infraestrutura da bandeira" },
              { label: "Regulacao", value: "Regulado pelas regras da bandeira de cartao" },
            ],
          },
        ],
      },
      {
        type: "steps",
        title: "Fluxo de Tokenizacao NFC",
        description: "Como Apple Pay / Google Pay protegem os dados do cartao durante um pagamento contactless.",
        steps: [
          {
            step: 1,
            label: "Provisionamento",
            description: "Usuario adiciona cartao ao wallet. A bandeira gera um Device Account Number (DPAN) unico para aquele dispositivo.",
          },
          {
            step: 2,
            label: "Autenticacao Biometrica",
            description: "No momento do pagamento, usuario autentica via Face ID, Touch ID ou PIN do dispositivo.",
          },
          {
            step: 3,
            label: "Geracao de Criptograma",
            description: "O Secure Element do dispositivo gera um criptograma unico para esta transacao especifica (one-time use).",
          },
          {
            step: 4,
            label: "Transmissao NFC",
            description: "DPAN + criptograma sao transmitidos via NFC ao terminal POS em milissegundos.",
          },
          {
            step: 5,
            label: "Detokenizacao pela Bandeira",
            description: "A bandeira (Visa/MC) traduz o DPAN de volta para o PAN real e valida o criptograma antes de enviar ao emissor.",
          },
          {
            step: 6,
            label: "Autorizacao Normal",
            description: "A partir daqui o fluxo segue igual a um cartao fisico: emissor avalia e retorna aprovacao/recusa.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 4. PAGAMENTOS BLOCKCHAIN
  // =========================================================================
  {
    railName: "Pagamentos Blockchain",
    sections: [
      {
        type: "cards",
        title: "Principais Redes Blockchain",
        description:
          "As redes blockchain mais utilizadas para pagamentos, com suas caracteristicas tecnicas e casos de uso.",
        items: [
          {
            name: "Bitcoin (BTC)",
            description:
              "A primeira e mais conhecida blockchain. Proof-of-Work com foco em seguranca e descentralizacao maxima. Para pagamentos, Lightning Network resolve escalabilidade.",
            details: [
              { label: "Consenso", value: "Proof of Work (SHA-256)" },
              { label: "TPS Base", value: "~7 TPS (on-chain)" },
              { label: "Finality", value: "~60 minutos (6 confirmacoes)" },
              { label: "Taxa Media", value: "$1 - $5 (on-chain)" },
              { label: "Lightning", value: "Milhoes TPS, <1s, <$0.01" },
            ],
          },
          {
            name: "Ethereum (ETH)",
            description:
              "Plataforma de smart contracts mais utilizada. Pos-Merge usa Proof-of-Stake. Ecossistema DeFi maduro mas taxas de gas variaveis.",
            details: [
              { label: "Consenso", value: "Proof of Stake" },
              { label: "TPS Base", value: "~15-30 TPS (L1)" },
              { label: "Finality", value: "~13 minutos (2 epochs)" },
              { label: "Taxa Media", value: "$0.50 - $20+ (variavel com demanda)" },
              { label: "Uso Principal", value: "DeFi, NFTs, stablecoins, tokenizacao" },
            ],
          },
          {
            name: "Solana (SOL)",
            description:
              "Blockchain de alta performance com throughput massivo e taxas ultra-baixas. Popular para pagamentos em tempo real e aplicacoes consumer.",
            details: [
              { label: "Consenso", value: "Proof of History + Proof of Stake" },
              { label: "TPS", value: "~4.000 TPS (teorico: 65.000)" },
              { label: "Finality", value: "~400ms (slot time)" },
              { label: "Taxa Media", value: "~$0.00025 por transacao" },
              { label: "Uso Principal", value: "Pagamentos, DeFi, Solana Pay" },
            ],
          },
          {
            name: "Polygon (POL)",
            description:
              "Sidechain/L2 do Ethereum com compatibilidade EVM completa. Combina a seguranca do Ethereum com taxas baixas e velocidade alta.",
            details: [
              { label: "Tipo", value: "Sidechain / Layer 2 (zkEVM)" },
              { label: "TPS", value: "~7.000 TPS (PoS chain)" },
              { label: "Finality", value: "~2 segundos" },
              { label: "Taxa Media", value: "~$0.01 por transacao" },
              { label: "Uso Principal", value: "Gaming, NFTs, pagamentos corporate" },
            ],
          },
          {
            name: "Arbitrum",
            description:
              "Optimistic Rollup Layer 2 do Ethereum. Herda seguranca do Ethereum com reducao de 10-100x nas taxas. Maior TVL entre L2s.",
            details: [
              { label: "Tipo", value: "Optimistic Rollup (Layer 2)" },
              { label: "TPS", value: "~4.000 TPS (pico observado)" },
              { label: "Finality", value: "~1 semana (challenge period) / instant soft" },
              { label: "Taxa Media", value: "$0.01 - $0.10" },
              { label: "Uso Principal", value: "DeFi, stablecoin transfers, bridges" },
            ],
          },
          {
            name: "Lightning Network",
            description:
              "Rede de pagamento Layer 2 do Bitcoin usando canais bidirecionais. Permite micropagamentos instantaneos com taxas quase zero.",
            details: [
              { label: "Tipo", value: "Layer 2 (Payment Channels)" },
              { label: "TPS", value: "Milhoes (teorico, off-chain)" },
              { label: "Finality", value: "< 1 segundo" },
              { label: "Taxa Media", value: "< $0.01 (satoshis)" },
              { label: "Uso Principal", value: "Micropagamentos, remessas, POS" },
            ],
          },
        ],
      },
      {
        type: "comparison",
        title: "Layer 1 vs Layer 2",
        description: "Tradeoffs fundamentais entre redes de base (L1) e solucoes de escalabilidade (L2).",
        groups: [
          {
            name: "Layer 1 (Base)",
            color: "#7c3aed",
            items: [
              { label: "Exemplos", value: "Bitcoin, Ethereum, Solana" },
              { label: "Seguranca", value: "Maxima — validacao completa on-chain" },
              { label: "Velocidade", value: "Variavel (7 TPS a 4.000 TPS)" },
              { label: "Custo", value: "Mais alto (gas fees do L1)" },
              { label: "Descentralizacao", value: "Alta (milhares de validadores)" },
              { label: "Ideal para", value: "Liquidacao final, alto valor, custodias" },
            ],
          },
          {
            name: "Layer 2 / Sidechain",
            color: "#a78bfa",
            items: [
              { label: "Exemplos", value: "Lightning, Arbitrum, Polygon, Optimism" },
              { label: "Seguranca", value: "Herdada do L1 (com delay de finality)" },
              { label: "Velocidade", value: "Alta (1.000-40.000+ TPS)" },
              { label: "Custo", value: "10-100x mais barato que L1" },
              { label: "Descentralizacao", value: "Media (sequencers centralizados em rollups)" },
              { label: "Ideal para", value: "Micropagamentos, alto volume, consumer apps" },
            ],
          },
        ],
      },
      {
        type: "text",
        title: "Conceitos-Chave para Pagamentos Blockchain",
        paragraphs: [
          "Gas Fees: Custo computacional pago aos validadores para processar transacoes. Em Ethereum, o gas varia com a demanda da rede (EIP-1559: base fee + priority tip). Em Solana, as taxas sao fixas e ultra-baixas (~$0.00025). Gas fees sao o principal fator de custo em pagamentos on-chain.",
          "Confirmacoes e Finality: Uma transacao e considerada 'final' quando e computacionalmente impraticavel reverte-la. Bitcoin requer ~6 confirmacoes (~60min) para finality probabilistica. Ethereum atinge finality em ~12min apos o merge. Solana oferece soft finality em ~400ms. Para pagamentos, a questao e: quantas confirmacoes o merchant exige antes de considerar o pagamento recebido?",
          "Mempool e Priorizacao: Transacoes pendentes aguardam no mempool ate serem incluidas em um bloco. Usuarios podem pagar mais gas para priorizacao (front-running). Em redes congestionadas, transacoes de baixo gas podem ficar pendentes por horas. Solucoes L2 reduzem este problema ao processar transacoes off-chain com sequencers dedicados.",
        ],
      },
    ],
  },

  // =========================================================================
  // 5. STABLECOINS
  // =========================================================================
  {
    railName: "Stablecoins",
    sections: [
      {
        type: "cards",
        title: "Principais Stablecoins",
        description:
          "As stablecoins mais utilizadas para pagamentos, cada uma com modelo de lastro, regulacao e blockchains distintas.",
        items: [
          {
            name: "USDC (Circle)",
            description:
              "Stablecoin regulada lastreada 1:1 em dolares americanos e titulos do tesouro dos EUA. Emissao por Circle com auditorias mensais. A mais utilizada em pagamentos B2B.",
            details: [
              { label: "Lastro", value: "Fiat-backed (USD + T-bills)" },
              { label: "Market Cap", value: "~$45B (valores aproximados, Q4 2024)" },
              { label: "Blockchains", value: "Ethereum, Solana, Polygon, Arbitrum, Base" },
              { label: "Taxas Transfer", value: "Apenas gas fee da rede" },
              { label: "Regulacao", value: "Licenciada como Money Transmitter (EUA)" },
            ],
          },
          {
            name: "USDT (Tether)",
            description:
              "A stablecoin de maior market cap e liquidez. Amplamente utilizada em exchanges e mercados emergentes. Reservas incluem titulos, bonds e cash equivalents.",
            details: [
              { label: "Lastro", value: "Fiat-backed (mix de ativos)" },
              { label: "Market Cap", value: "~$140B (valores aproximados, Q4 2024)" },
              { label: "Blockchains", value: "Ethereum, Tron, Solana, Avalanche" },
              { label: "Dominancia", value: "~70% do volume de stablecoin" },
              { label: "Regulacao", value: "Limitada — sede em El Salvador" },
            ],
          },
          {
            name: "DAI (MakerDAO)",
            description:
              "Stablecoin descentralizada gerada por colateral cripto (ETH, USDC) via smart contracts do protocolo Maker. Governada por holders de MKR token.",
            details: [
              { label: "Lastro", value: "Crypto-backed (over-collateralized)" },
              { label: "Market Cap", value: "~$5B+" },
              { label: "Blockchains", value: "Ethereum, L2s via bridges" },
              { label: "Colateral Ratio", value: "~150% (over-collateralized)" },
              { label: "Governanca", value: "DAO descentralizada (MKR holders)" },
            ],
          },
          {
            name: "PYUSD (PayPal)",
            description:
              "Stablecoin emitida pelo PayPal via Paxos Trust. Integracao nativa com 430M+ contas PayPal e Venmo. Foco em mainstream adoption.",
            details: [
              { label: "Lastro", value: "Fiat-backed (USD deposits + T-bills)" },
              { label: "Market Cap", value: "~$500M+" },
              { label: "Blockchains", value: "Ethereum, Solana" },
              { label: "Diferencial", value: "Integracao PayPal/Venmo nativa" },
              { label: "Regulacao", value: "Emitida por Paxos (NY DFS regulated)" },
            ],
          },
          {
            name: "EURC (Circle)",
            description:
              "Stablecoin lastreada em euros, emitida pela Circle. Conforme regulacao MiCA da UE. Crescendo rapidamente para pagamentos intra-europeus on-chain.",
            details: [
              { label: "Lastro", value: "Fiat-backed (EUR)" },
              { label: "Market Cap", value: "~$100M+" },
              { label: "Blockchains", value: "Ethereum, Solana, Avalanche" },
              { label: "Diferencial", value: "Conforme MiCA (regulacao UE)" },
              { label: "Uso Principal", value: "Pagamentos B2B Europa, remessas EUR" },
            ],
          },
        ],
      },
      {
        type: "comparison",
        title: "Modelos de Lastro",
        description: "Os tres modelos fundamentais de backing de stablecoins e seus tradeoffs.",
        groups: [
          {
            name: "Fiat-Backed",
            color: "#0ea5e9",
            items: [
              { label: "Mecanismo", value: "1 token = 1 unidade de moeda fiat em reserva" },
              { label: "Exemplos", value: "USDC, USDT, PYUSD, EURC" },
              { label: "Vantagem", value: "Estabilidade maxima, facil de entender" },
              { label: "Risco", value: "Centralizado — depende do emissor e custodiante" },
              { label: "Regulacao", value: "Mais regulado (Money Transmitter, MiCA)" },
            ],
          },
          {
            name: "Crypto-Backed",
            color: "#8b5cf6",
            items: [
              { label: "Mecanismo", value: "Over-collateralizado com cripto (150%+)" },
              { label: "Exemplos", value: "DAI, LUSD, sUSD" },
              { label: "Vantagem", value: "Descentralizado, sem ponto unico de falha" },
              { label: "Risco", value: "Liquidacao em crashes, capital inefficiency" },
              { label: "Regulacao", value: "Menos claro — classificacao varia" },
            ],
          },
          {
            name: "Algorithmic",
            color: "#f43f5e",
            items: [
              { label: "Mecanismo", value: "Algoritmo ajusta supply para manter peg" },
              { label: "Exemplos", value: "FRAX (hibrido), UST (colapsou)" },
              { label: "Vantagem", value: "Capital efficient, totalmente on-chain" },
              { label: "Risco", value: "Death spiral — UST/LUNA perdeu $40B em 2022" },
              { label: "Regulacao", value: "Altamente escrutinado pos-TerraLUNA" },
            ],
          },
        ],
      },
      {
        type: "steps",
        title: "Fluxo de Settlement B2B com Stablecoins",
        description: "Como empresas usam stablecoins para liquidacao cross-border rapida e barata.",
        steps: [
          {
            step: 1,
            label: "Empresa A inicia pagamento",
            description: "Empresa no Brasil precisa pagar fornecedor nos EUA. Converte BRL para USDC via on-ramp (exchange ou OTC desk).",
          },
          {
            step: 2,
            label: "Transfer on-chain",
            description: "USDC e enviado da wallet da Empresa A para a wallet da Empresa B via Ethereum L2 ou Solana. Custo: <$0.10. Tempo: segundos.",
          },
          {
            step: 3,
            label: "Confirmacao on-chain",
            description: "Transacao e confirmada na blockchain. Ambas as partes podem verificar no explorer publico. Irreversivel apos finality.",
          },
          {
            step: 4,
            label: "Off-ramp (opcional)",
            description: "Empresa B pode manter USDC como treasury ou converter para USD via off-ramp bancario (Circle Mint, exchange, banco parceiro).",
          },
          {
            step: 5,
            label: "Reconciliacao",
            description: "Dados on-chain servem como prova de pagamento imutavel. Integracao com ERP via APIs de provedores como Circle, Fireblocks ou Coinbase Prime.",
          },
        ],
      },
      {
        type: "text",
        title: "Panorama Regulatorio",
        paragraphs: [
          "MiCA (Markets in Crypto-Assets) — UE: Regulacao abrangente da UE em vigor desde 2024. Exige que emissores de stablecoins obtenham licenca de instituicao de moeda eletronica, mantenham reservas 1:1 em bancos europeus e publiquem whitepapers detalhados. USDC (Circle) ja e conforme; USDT enfrenta desafios de compliance.",
          "Framework EUA: Regulacao fragmentada entre SEC, CFTC e reguladores estaduais. Stablecoins fiat-backed como USDC e PYUSD operam sob licencas Money Transmitter estaduais. Legislacao federal especifica (Stablecoin TRUST Act, Clarity for Payment Stablecoins Act) em discussao no Congresso.",
          "Adocao Institucional: Visa e Mastercard ja fazem settlement em USDC. Stripe lancou Stablecoin Financial Infrastructure. PayPal emitiu PYUSD. JPMorgan opera JPM Coin para liquidacao interbancaria. O mercado de stablecoins para pagamentos B2B deve ultrapassar $1T em volume anual ate 2027.",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/** Busca detalhes de um rail pelo nome */
export function getRailDetail(railName: string): RailDetail | undefined {
  return railDetails.find((d) => d.railName === railName);
}
