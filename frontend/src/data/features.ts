/**
 * Registro Central de Features — Payments Knowledge System
 *
 * Fonte única de verdade para todas as features de pagamento.
 * Importado por todas as páginas que referenciam features.
 */

import { PaymentFeature } from "./types";

// ---------------------------------------------------------------------------
// Registro de Features (38 features)
// ---------------------------------------------------------------------------

export const FEATURES_REGISTRY: PaymentFeature[] = [
  {
    id: "3d-secure",
    name: "3D Secure",
    description:
      "Protocolo de autenticação do portador do cartão que adiciona uma etapa extra de verificação durante transações online para reduzir fraudes.",
    layer: "experience",
    category: "Autenticação",
    complexity: "high",
    actors: ["Emissor", "Merchant", "ACS", "DS"],
    metricsImpacted: ["Taxa de Autorização", "Taxa de Fraude", "Conversão no Checkout"],
    aliases: ["3DS", "3-D Secure", "3DS1", "Autenticação 3DS"],
    dependencies: ["pci-vault", "fraud-scoring"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p5"],
    businessRules: [
      "SCA é obrigatória para todas as transações eletrônicas na UE/EEA (PSD2). Isenções incluem: low-value (<€30), TRA (baixo risco), recorrência e whitelisting",
      "Isenção TRA (Transaction Risk Analysis): transações abaixo dos thresholds de fraude do adquirente podem ser isentas de SCA",
      "Fallback para 3DS1 quando emissor não suporta 3DS2",
    ],
  },
  {
    id: "network-tokenization",
    name: "Network Tokenization",
    description:
      "Substitui dados sensíveis do cartão por tokens em nível de rede fornecidos pelas bandeiras, melhorando segurança e taxas de autorização.",
    layer: "network",
    category: "Segurança",
    complexity: "high",
    actors: ["Bandeira", "Token Service Provider", "Emissor"],
    metricsImpacted: ["Taxa de Autorização", "Taxa de Fraude", "Taxa de Provisionamento de Token"],
    aliases: ["Network Tokens", "Tokenização de Rede", "Token de Rede"],
    dependencies: ["pci-vault"],
    relatedFlows: ["card-payment", "wallet-payment"],
    relatedProblems: ["p3"],
    businessRules: [
      "Network tokens são específicos por merchant e dispositivo",
      "Criptogramas gerados por transação para prevenção de replay",
      "Atualização automática quando credenciais do cartão mudam",
    ],
  },
  {
    id: "smart-routing",
    name: "Smart Routing",
    description:
      "Seleciona dinamicamente o adquirente ou processador de pagamento ideal com base em custo, taxa de sucesso e latência.",
    layer: "orchestration",
    category: "Otimização",
    complexity: "high",
    actors: ["Orquestrador de Pagamento", "Adquirente", "Merchant"],
    metricsImpacted: ["Taxa de Autorização", "Custo de Processamento", "Latência"],
    aliases: ["Roteamento Inteligente", "Dynamic Routing", "Roteamento Dinâmico"],
    dependencies: ["bin-lookup"],
    relatedFlows: ["card-payment", "cross-border"],
    relatedProblems: ["p1", "p4"],
    businessRules: [
      "Peso de roteamento configurável por adquirente (custo vs. performance)",
      "Regras de roteamento geográfico baseadas no BIN do emissor",
      "Fallback automático quando adquirente primário está indisponível",
    ],
  },
  {
    id: "retry-logic",
    name: "Retry Logic",
    description:
      "Retenta automaticamente transações falhas pela mesma rota ou rotas alternativas com base nos códigos de recusa.",
    layer: "orchestration",
    category: "Resiliência",
    complexity: "medium",
    actors: ["Orquestrador de Pagamento", "Adquirente"],
    metricsImpacted: ["Taxa de Autorização", "Recuperação de Receita", "Taxa de Recusa"],
    aliases: ["Lógica de Retentativa", "Retentativa Automática", "Auto-Retry"],
    dependencies: ["smart-routing"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p1"],
    businessRules: [
      "Máximo de 3 retentativas por transação",
      "Backoff exponencial entre retentativas",
      "Não retenta em recusas definitivas (cartão roubado, conta fechada)",
    ],
  },
  {
    id: "bin-lookup",
    name: "BIN Lookup",
    description:
      "Identifica tipo de cartão, emissor, país e nível do produto a partir do BIN para informar decisões de roteamento e risco.",
    layer: "processing",
    category: "Enriquecimento de Dados",
    complexity: "low",
    actors: ["Processador de Pagamento", "Provedor de Base BIN"],
    metricsImpacted: ["Precisão de Roteamento", "Qualidade da Avaliação de Risco"],
    aliases: ["Consulta de BIN", "BIN Table", "Tabela BIN"],
    dependencies: [],
    relatedFlows: ["card-payment", "cross-border"],
    relatedProblems: [],
    businessRules: [
      "Base de BIN atualizada quinzenalmente via provedores certificados",
      "BINs de 8 dígitos (IIN estendido) para identificação mais precisa",
      "Cache local de BIN com TTL de 24 horas",
    ],
  },
  {
    id: "currency-conversion",
    name: "Currency Conversion (DCC)",
    description:
      "Converte o valor da transação para a moeda do portador do cartão no ponto de venda, proporcionando transparência.",
    layer: "processing",
    category: "FX",
    complexity: "medium",
    actors: ["Merchant", "Provedor DCC", "Adquirente"],
    metricsImpacted: ["Conversão no Checkout", "Receita por Transação", "Margem de FX"],
    aliases: ["DCC", "Conversão Dinâmica de Moeda", "Dynamic Currency Conversion"],
    dependencies: ["bin-lookup"],
    relatedFlows: ["cross-border"],
    relatedProblems: [],
    businessRules: [
      "Obrigatório exibir ambas as moedas ao cliente (regulação Visa/MC)",
      "Markup máximo de FX regulado em alguns mercados (UE: transparência obrigatória)",
      "Taxas de câmbio atualizadas a cada 15 minutos em horário comercial",
    ],
  },
  {
    id: "fraud-scoring",
    name: "Fraud Scoring",
    description:
      "Avaliação de risco em tempo real usando modelos de ML que atribuem uma pontuação de probabilidade de fraude a cada transação.",
    layer: "processing",
    category: "Risco",
    complexity: "critical",
    actors: ["Motor de Risco", "Processador de Pagamento", "Merchant"],
    metricsImpacted: ["Taxa de Fraude", "Taxa de Falso Positivo", "Taxa de Autorização"],
    aliases: ["Scoring de Fraude", "Pontuação de Fraude", "Risk Scoring", "Avaliação de Risco"],
    dependencies: ["velocity-checks", "bin-lookup"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p2"],
    businessRules: [
      "Score de 0-100, threshold configurável por merchant e região",
      "Bloqueio automático para scores acima de 90",
      "Revisão manual obrigatória para scores entre 70-90",
    ],
  },
  {
    id: "account-updater",
    name: "Account Updater",
    description:
      "Atualiza automaticamente credenciais de cartão armazenadas quando cartões são renovados, perdidos ou substituídos pelos emissores.",
    layer: "network",
    category: "Ciclo de Vida",
    complexity: "medium",
    actors: ["Bandeira", "Emissor", "Vault do Merchant"],
    metricsImpacted: ["Taxa de Autorização", "Churn Involuntário", "Atualidade do Token"],
    aliases: ["Atualizador de Conta", "Card Updater", "VAU", "ABU"],
    dependencies: ["network-tokenization"],
    relatedFlows: ["recurring"],
    relatedProblems: ["p3"],
    businessRules: [
      "Consultas em lote mensais via Visa Account Updater (VAU)",
      "Atualizações em tempo real via Mastercard ABU (Automatic Billing Updater)",
      "Notificação ao merchant quando cartão é substituído vs. cancelado",
    ],
  },
  {
    id: "pci-vault",
    name: "PCI Vault (Tokenização)",
    description:
      "Armazena com segurança dados sensíveis do portador do cartão em um vault compatível com PCI, substituindo-os por tokens não sensíveis.",
    layer: "processing",
    category: "Segurança",
    complexity: "high",
    actors: ["Provedor de Vault", "Merchant", "Processador de Pagamento"],
    metricsImpacted: ["Redução do Escopo PCI", "Risco de Vazamento de Dados", "Compliance"],
    aliases: ["Vault PCI", "Tokenização", "Card Vault", "Cofre PCI"],
    dependencies: [],
    relatedFlows: ["card-payment", "recurring"],
    relatedProblems: [],
    businessRules: [
      "Tokens devem ser irrecuperáveis (não é possível derivar PAN a partir do token)",
      "Rotação de chaves de criptografia a cada 90 dias",
      "Auditoria PCI DSS anual obrigatória",
    ],
  },
  {
    id: "cascading",
    name: "Cascading (Failover)",
    description:
      "Roteia transações recusadas para adquirentes ou processadores de backup para maximizar chances de aprovação.",
    layer: "orchestration",
    category: "Resiliência",
    complexity: "medium",
    actors: ["Orquestrador de Pagamento", "Adquirente Primário", "Adquirente de Backup"],
    metricsImpacted: ["Taxa de Autorização", "Recuperação de Receita", "Latência"],
    aliases: ["Failover", "Roteamento de Failover", "Cascata"],
    dependencies: ["retry-logic", "smart-routing"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p4"],
    businessRules: [
      "Cascading apenas para recusas soft (timeout, erro de processamento)",
      "Máximo de 2 tentativas de cascading por transação",
      "Blacklist temporária de adquirente com taxa de erro > 50% nos últimos 5 minutos",
    ],
  },
  {
    id: "webhooks",
    name: "Webhooks & Notificações",
    description:
      "Notificações assíncronas orientadas a eventos para mudanças de status de transação, reembolsos e chargebacks.",
    layer: "experience",
    category: "Integração",
    complexity: "low",
    actors: ["Gateway de Pagamento", "Backend do Merchant"],
    metricsImpacted: ["Confiabilidade da Integração", "Velocidade de Conciliação"],
    aliases: ["Webhook", "Notificação via Webhook", "Event Notifications"],
    dependencies: ["idempotency"],
    relatedFlows: ["card-payment", "pix"],
    relatedProblems: [],
    businessRules: [
      "Retentativa exponencial: 1s, 5s, 30s, 5min, 30min, 1h, 6h, 24h",
      "Assinatura HMAC obrigatória para verificação de autenticidade",
      "Timeout de resposta de 30 segundos antes de retentativa",
    ],
  },
  {
    id: "recurring-billing",
    name: "Recurring Billing",
    description:
      "Gerencia pagamentos baseados em assinatura com agendamento automático de cobranças, dunning e gestão de retentativas.",
    layer: "orchestration",
    category: "Cobrança",
    complexity: "high",
    actors: ["Motor de Cobrança", "Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Receita Recorrente", "Churn Involuntário", "Taxa de Sucesso de Pagamento"],
    aliases: ["Cobrança Recorrente", "Assinatura", "Subscription Billing"],
    dependencies: ["account-updater", "retry-logic", "pci-vault"],
    relatedFlows: ["recurring"],
    relatedProblems: [],
    businessRules: [
      "Dunning: até 4 tentativas de cobrança em 14 dias antes de cancelamento",
      "Notificação prévia ao cliente 3 dias antes da cobrança",
      "Suporte a upgrade/downgrade de plano com proration",
    ],
  },
  {
    id: "chargeback-management",
    name: "Chargeback Management",
    description:
      "Gestão completa de disputas incluindo submissão de evidências, representment e pré-arbitragem.",
    layer: "settlement",
    category: "Disputas",
    complexity: "high",
    actors: ["Merchant", "Adquirente", "Emissor", "Bandeira"],
    metricsImpacted: ["Taxa de Chargeback", "Taxa de Ganho", "Receita Líquida"],
    aliases: ["Gestão de Chargeback", "Gestão de Disputas", "Disputas"],
    dependencies: ["settlement-reconciliation"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Prazo de resposta: 30 dias para Visa, 45 dias para Mastercard",
      "Alerta de programa de monitoramento quando chargeback rate > 0.9%",
      "Documentação obrigatória: comprovante de entrega, logs de autenticação",
    ],
  },
  {
    id: "settlement-reconciliation",
    name: "Settlement Reconciliation",
    description:
      "Faz a conciliação de transações processadas com arquivos de liquidação de adquirentes e bancos para garantir precisão.",
    layer: "settlement",
    category: "Financeiro",
    complexity: "medium",
    actors: ["Time Financeiro", "Adquirente", "Banco"],
    metricsImpacted: ["Taxa de Conciliação", "Precisão de Liquidação", "Dias para Fechamento"],
    aliases: ["Conciliação", "Reconciliação", "Settlement"],
    dependencies: [],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Conciliação automática diária com tolerância de R$ 0.01",
      "Relatório de exceções para diferenças acima do threshold",
      "Fechamento contábil mensal em D+5",
    ],
  },
  {
    id: "apm-integration",
    name: "Meios de Pagamento Alternativos",
    description:
      "Integração de meios de pagamento não-cartão como PIX, Boleto, carteiras digitais, BNPL e transferências bancárias.",
    layer: "experience",
    category: "Meios de Pagamento",
    complexity: "medium",
    actors: ["PSP", "Provedor de APM", "Merchant"],
    metricsImpacted: ["Conversão no Checkout", "Cobertura de Mercado", "Mix de Meios de Pagamento"],
    aliases: ["APM", "Meios Alternativos", "Alternative Payment Methods"],
    dependencies: ["smart-routing"],
    relatedFlows: ["pix", "bnpl", "wallet-payment"],
    relatedProblems: [],
    businessRules: [
      "Exibir apenas métodos relevantes para a região do comprador",
      "PIX: expiração de QR code configurável (padrão: 30 minutos)",
      "Boleto: vencimento mínimo de D+1, máximo de D+30",
    ],
  },
  {
    id: "split-payments",
    name: "Split Payments",
    description:
      "Divide um pagamento único entre múltiplos recebedores, comumente usado em modelos de marketplace e plataforma.",
    layer: "orchestration",
    category: "Marketplace",
    complexity: "high",
    actors: ["Plataforma", "Sub-merchants", "Adquirente", "Facilitador de Pagamento"],
    metricsImpacted: ["Complexidade de Liquidação", "Precisão de Repasses", "GMV do Marketplace"],
    aliases: ["Pagamento Dividido", "Split", "Liquidação Dividida"],
    dependencies: [],
    relatedFlows: ["marketplace"],
    relatedProblems: [],
    businessRules: [
      "Split pode ser definido por percentual ou valor fixo",
      "Retenção de taxa da plataforma aplicada antes do repasse",
      "Prazo de repasse configurável por sub-merchant (D+2 a D+30)",
    ],
  },
  {
    id: "velocity-checks",
    name: "Velocity Checks",
    description:
      "Monitora padrões de frequência e volume de transações para detectar potencial fraude ou abuso em tempo real.",
    layer: "processing",
    category: "Risco",
    complexity: "medium",
    actors: ["Motor de Risco", "Processador de Pagamento"],
    metricsImpacted: ["Taxa de Fraude", "Taxa de Falso Positivo", "Taxa de Bloqueio"],
    aliases: ["Verificação de Velocidade", "Rate Limiting", "Limites de Velocidade"],
    dependencies: [],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p2"],
    businessRules: [
      "Limite padrão: 5 transações por cartão em 1 hora",
      "Bloqueio automático em valor acumulado > R$ 5.000 em 24h para novo cartão",
      "Regras personalizáveis por merchant e segmento",
    ],
  },
  {
    id: "partial-capture",
    name: "Partial Capture",
    description:
      "Captura apenas uma parte de um valor previamente autorizado, comumente usado em fulfillment de e-commerce.",
    layer: "processing",
    category: "Autorização",
    complexity: "low",
    actors: ["Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Utilização de Autorização", "Satisfação do Cliente"],
    aliases: ["Captura Parcial", "Partial Auth"],
    dependencies: [],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Valor de captura não pode exceder o valor autorizado",
      "Autorização remanescente é liberada automaticamente após captura",
      "Prazo máximo de captura: 7-30 dias dependendo do MCC e bandeira (hotelaria/locação pode ser 30 dias, varejo geral ~7 dias)",
    ],
  },
  {
    id: "idempotency",
    name: "Idempotency Keys",
    description:
      "Garante que requisições de API duplicadas produzam o mesmo resultado, prevenindo cobranças duplicadas e inconsistência de dados.",
    layer: "experience",
    category: "Integração",
    complexity: "low",
    actors: ["Gateway de Pagamento", "Backend do Merchant"],
    metricsImpacted: ["Taxa de Transação Duplicada", "Confiabilidade da API"],
    aliases: ["Idempotência", "Chave de Idempotência"],
    dependencies: [],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Chave de idempotência deve ser UUID v4 gerado pelo cliente",
      "TTL de idempotência: 24 horas",
      "Respostas idempotentes retornam HTTP 200 com o resultado original",
    ],
  },
  {
    id: "emv-3ds",
    name: "EMV 3D Secure 2.x",
    description:
      "Protocolo 3DS de nova geração com fluxos de autenticação sem fricção e troca de dados enriquecida com emissores.",
    layer: "experience",
    category: "Autenticação",
    complexity: "critical",
    actors: ["Merchant", "3DS Server", "ACS", "Directory Server", "Emissor"],
    metricsImpacted: ["Taxa de Auth Sem Fricção", "Taxa de Conversão", "Taxa de Fraude"],
    aliases: ["3DS2", "EMV 3DS", "3D Secure 2", "Autenticação Frictionless"],
    dependencies: ["3d-secure", "fraud-scoring"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p5"],
    businessRules: [
      "Fluxo frictionless para transações classificadas como baixo risco pelo emissor",
      "Dados obrigatórios: device info, browser info, IP, email do portador",
      "Fallback para challenge flow quando dados insuficientes",
    ],
  },
  {
    id: "interchange-optimization",
    name: "Interchange Optimization",
    description:
      "Submete dados enriquecidos de transação (Nível II/III) para qualificar em faixas de interchange mais baixas.",
    layer: "settlement",
    category: "Otimização de Custo",
    complexity: "medium",
    actors: ["Merchant", "Adquirente", "Bandeira"],
    metricsImpacted: ["Custo de Processamento", "Taxas de Interchange", "Margem Líquida"],
    aliases: ["Otimização de Interchange", "Level II/III Data", "Dados Nível 2/3"],
    dependencies: ["bin-lookup"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Nível II: informações fiscais (tax amount, customer reference)",
      "Nível III: line-item detail para transações B2B/government",
      "Economia média de 0.3-0.5% por transação qualificada",
    ],
  },
  {
    id: "network-tokens-lifecycle",
    name: "Token Lifecycle Management",
    description:
      "Gerencia provisionamento, suspensão, reativação e exclusão de network tokens ao longo de seu ciclo de vida.",
    layer: "network",
    category: "Ciclo de Vida",
    complexity: "high",
    actors: ["Token Service Provider", "Emissor", "Bandeira"],
    metricsImpacted: ["Atualidade do Token", "Taxa de Autorização", "Overhead Operacional"],
    aliases: ["Gestão de Ciclo de Vida de Token", "Token Lifecycle"],
    dependencies: ["network-tokenization"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Provisionamento automático na primeira transação com cartão",
      "Suspensão automática após 12 meses sem uso",
      "Notificação de status change via webhook para o merchant",
    ],
  },
  {
    id: "real-time-auth",
    name: "Real-Time Authorization",
    description:
      "Decisão de autorização em sub-segundo com caminhos de rede otimizados entre adquirente e emissor.",
    layer: "banking",
    category: "Autorização",
    complexity: "medium",
    actors: ["Emissor", "Adquirente", "Bandeira"],
    metricsImpacted: ["Latência", "Taxa de Autorização", "Taxa de Timeout"],
    aliases: ["Autorização em Tempo Real", "Real-Time Auth"],
    dependencies: ["network-tokenization"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "SLA de resposta: < 2 segundos end-to-end",
      "Timeout de conexão: 5 segundos com failover automático",
      "Monitoramento de latência P99 por adquirente",
    ],
  },
  {
    id: "kyc-verification",
    name: "KYC / Verificação de Identidade",
    description:
      "Verificações Know-Your-Customer incluindo verificação de documentos, detecção de vivacidade e triagem de sanções.",
    layer: "banking",
    category: "Compliance",
    complexity: "critical",
    actors: ["Provedor KYC", "Banco", "Regulador"],
    metricsImpacted: ["Conversão de Onboarding", "Taxa de Compliance", "Taxa de Rejeição Falsa"],
    aliases: ["KYC", "Know Your Customer", "Verificação de Identidade"],
    dependencies: ["fraud-scoring"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Verificação de documentos obrigatória para sub-merchants em marketplace",
      "Triagem de sanções contra listas OFAC, UE e ONU",
      "Revisão periódica de KYC a cada 12 meses para contas ativas",
    ],
  },

  // ── Novas features vinculadas ao Mapa de Pagamentos ──────────────────────

  {
    id: "checkout-ui",
    name: "Interface de Checkout",
    description:
      "Componente de UI que renderiza o formulário de pagamento no front-end do merchant — campos de cartão, botões de carteira digital, PIX e APMs — com validação em tempo real, formatação automática e acessibilidade.",
    layer: "experience",
    category: "UX",
    complexity: "medium",
    actors: ["Merchant", "PSP", "Cliente"],
    metricsImpacted: ["Conversão no Checkout", "Taxa de Abandono", "Tempo Médio de Checkout"],
    aliases: ["Checkout UI", "Formulário de Pagamento", "Checkout Form", "Hosted Fields"],
    dependencies: ["idempotency", "webhooks"],
    relatedFlows: ["card-payment", "pix", "wallet-payment"],
    relatedProblems: [],
    businessRules: [
      "Campos de cartão devem usar iframes isolados (PCI compliance) ou hosted fields",
      "Validação Luhn em tempo real no campo de número do cartão",
      "Detecção automática de bandeira a partir do BIN para exibir ícone correto",
    ],
  },
  {
    id: "payment-method-selection",
    name: "Seleção de Método de Pagamento",
    description:
      "Lógica que determina quais métodos de pagamento são exibidos ao cliente com base em região, valor, dispositivo e configuração do merchant, ordenando por relevância e conversão.",
    layer: "experience",
    category: "UX",
    complexity: "medium",
    actors: ["PSP", "Merchant", "Cliente"],
    metricsImpacted: ["Conversão no Checkout", "Mix de Meios de Pagamento", "Cobertura de Mercado"],
    aliases: ["Payment Method Selection", "Seleção de Meio de Pagamento", "APM Routing"],
    dependencies: ["bin-lookup", "checkout-ui"],
    relatedFlows: ["card-payment", "pix", "wallet-payment", "bnpl"],
    relatedProblems: [],
    businessRules: [
      "Exibir apenas métodos disponíveis para a região do comprador (geo-filtering)",
      "Priorizar métodos com maior taxa de conversão histórica para o segmento",
      "PIX exibido como primeiro método para transações domésticas no Brasil",
    ],
  },
  {
    id: "mobile-sdks",
    name: "SDKs Mobile (iOS / Android)",
    description:
      "Kits de desenvolvimento para integração nativa de pagamentos em apps mobile, incluindo componentes de UI pré-construídos, tokenização in-app, biometria e suporte a wallets nativas (Apple Pay, Google Pay).",
    layer: "experience",
    category: "Integração",
    complexity: "medium",
    actors: ["PSP", "Merchant", "Cliente"],
    metricsImpacted: ["Conversão no Checkout", "Tempo de Integração", "Taxa de Autorização"],
    aliases: ["Mobile SDK", "SDK iOS", "SDK Android", "In-App Payments"],
    dependencies: ["checkout-ui", "3d-secure", "pci-vault"],
    relatedFlows: ["card-payment", "wallet-payment"],
    relatedProblems: [],
    businessRules: [
      "SDKs devem suportar PCI SAQ-A com tokenização client-side",
      "Coleta obrigatória de device fingerprint para 3DS2 (device info, OS version)",
      "Suporte a biometria nativa (Face ID, Touch ID, Fingerprint) para autenticação",
    ],
  },
  {
    id: "ab-testing-routes",
    name: "Testes A/B de Rotas",
    description:
      "Framework de experimentação que divide tráfego entre diferentes configurações de roteamento para medir impacto em taxa de autorização, custo e latência de forma controlada e estatisticamente significativa.",
    layer: "orchestration",
    category: "Otimização",
    complexity: "medium",
    actors: ["Orquestrador de Pagamento", "Time de Produto", "Adquirente"],
    metricsImpacted: ["Taxa de Autorização", "Custo de Processamento", "Receita Líquida"],
    aliases: ["A/B Testing", "Teste A/B de Roteamento", "Route Experimentation", "Split Testing"],
    dependencies: ["smart-routing"],
    relatedFlows: ["card-payment", "cross-border"],
    relatedProblems: [],
    businessRules: [
      "Mínimo de 1.000 transações por variante antes de avaliar significância estatística",
      "Tráfego alocado aleatoriamente com seed consistente por merchant",
      "Kill switch automático se variante apresentar queda > 5% na taxa de autorização",
    ],
  },
  {
    id: "iso-8583",
    name: "Mensageria ISO 8583",
    description:
      "Protocolo de mensageria padrão da indústria financeira para comunicação entre terminais de pagamento, adquirentes, redes de cartão e emissores, definindo formato de campos de dados para autorização, captura e estorno.",
    layer: "network",
    category: "Mensageria",
    complexity: "high",
    actors: ["Adquirente", "Bandeira", "Emissor", "Processador de Pagamento"],
    metricsImpacted: ["Latência", "Taxa de Autorização", "Interoperabilidade"],
    aliases: ["ISO 8583", "Mensageria Financeira", "Financial Messaging", "Protocolo ISO"],
    dependencies: [],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Mensagens de autorização (0100/0110) devem incluir campos obrigatórios DE2, DE3, DE4, DE14, DE22, DE25",
      "Timeout de resposta padrão de 30 segundos para mensagens de autorização",
      "Formato de bitmap (primário + secundário) para indicar campos presentes na mensagem",
    ],
  },
  {
    id: "interchange-qualification",
    name: "Qualificação de Interchange",
    description:
      "Processo de categorização de transações em faixas de interchange definidas pelas bandeiras, baseado em tipo de cartão, presença do portador, dados enviados e tipo de merchant (MCC), determinando o custo final de processamento.",
    layer: "network",
    category: "Otimização de Custo",
    complexity: "medium",
    actors: ["Bandeira", "Adquirente", "Merchant"],
    metricsImpacted: ["Custo de Processamento", "Taxas de Interchange", "Margem Líquida"],
    aliases: ["Interchange Qualification", "Qualificação de Taxa", "Rate Qualification"],
    dependencies: ["bin-lookup", "interchange-optimization"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Transações CNP (Card Not Present) qualificam em faixas mais altas que CP (Card Present)",
      "Dados Level II/III reduzem interchange em até 0.5% para transações B2B/government",
      "Downgrade automático para faixa mais cara quando dados obrigatórios estão ausentes",
    ],
  },
  {
    id: "network-compliance",
    name: "Regras e Compliance da Bandeira",
    description:
      "Conjunto de regras, mandatos e programas de monitoramento das bandeiras de cartão (Visa, Mastercard) que regulam práticas de aceitação, limites de chargeback, segurança de dados e obrigações dos participantes do ecossistema.",
    layer: "network",
    category: "Compliance",
    complexity: "high",
    actors: ["Bandeira", "Adquirente", "Merchant", "Emissor"],
    metricsImpacted: ["Taxa de Compliance", "Taxa de Chargeback", "Multas e Penalidades"],
    aliases: ["Network Rules", "Regras da Bandeira", "Card Scheme Compliance", "Visa/MC Rules"],
    dependencies: [],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Visa VDMP: merchant entra em monitoramento com chargeback rate > 0.9% e > 100 disputas/mês. Multas Visa: $50-$25K/mês progressivas",
      "Mastercard ECM (alerta): chargeback rate > 1.0% + 100 chargebacks. ECP (penalidade): > 1.5% + 100 chargebacks. Programas distintos com thresholds diferentes",
      "Multas Mastercard: $1K-$200K/mês progressivas (ECP). Estrutura diferente de Visa — verificar cada bandeira separadamente",
    ],
  },
  {
    id: "merchant-account",
    name: "Gestão de Conta do Lojista",
    description:
      "Administração completa da conta merchant no adquirente, incluindo onboarding, configuração de MCC, limites de processamento, gestão de terminais, pricing e monitoramento de risco contínuo.",
    layer: "banking",
    category: "Gestão de Conta",
    complexity: "medium",
    actors: ["Adquirente", "Merchant", "Underwriter", "Compliance"],
    metricsImpacted: ["Conversão de Onboarding", "Tempo de Ativação", "Revenue per Merchant"],
    aliases: ["Merchant Account", "Conta do Lojista", "Merchant Management", "MID Management"],
    dependencies: ["kyc-verification"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Underwriting obrigatório com análise de risco antes de ativação da conta",
      "MCC (Merchant Category Code) deve refletir a atividade principal do lojista",
      "Limites de processamento revisados trimestralmente com base no histórico de transações",
    ],
  },
  {
    id: "issuer-authorization",
    name: "Autorização do Emissor",
    description:
      "Processo de decisão do banco emissor que avalia saldo, limites de crédito, regras de fraude, status do cartão e restrições geográficas para aprovar ou recusar uma transação em tempo real.",
    layer: "banking",
    category: "Autorização",
    complexity: "high",
    actors: ["Emissor", "Portador do Cartão", "Bandeira"],
    metricsImpacted: ["Taxa de Autorização", "Taxa de Fraude", "Taxa de Falso Positivo"],
    aliases: ["Issuer Auth", "Autorização Bancária", "Issuer Decision", "Authorization Decision"],
    dependencies: ["real-time-auth", "iso-8583"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p1"],
    businessRules: [
      "Verificação de saldo/limite disponível é o primeiro check na cadeia de autorização",
      "Regras de geolocalização podem bloquear transações internacionais não habilitadas",
      "Stand-in processing ativado quando emissor está offline (Visa STIP, MC STIP)",
    ],
  },
  {
    id: "ledger-reconciliation",
    name: "Ledger e Reconciliação",
    description:
      "Sistema contábil de partidas dobradas (double-entry) que registra todas as movimentações financeiras de pagamentos, com reconciliação automática entre livro interno, adquirentes e bancos para garantir integridade.",
    layer: "banking",
    category: "Financeiro",
    complexity: "high",
    actors: ["Time Financeiro", "Banco", "Adquirente", "Sistema Contábil"],
    metricsImpacted: ["Taxa de Conciliação", "Precisão de Liquidação", "Dias para Fechamento"],
    aliases: ["Ledger", "Livro Razão", "Payment Ledger", "General Ledger"],
    dependencies: ["settlement-reconciliation"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Toda transação deve gerar no mínimo 2 lançamentos contábeis (débito e crédito)",
      "Reconciliação automática diária entre ledger interno e extratos de adquirentes",
      "Diferenças acima de R$ 0.01 geram exceção para revisão manual com SLA de 48h",
    ],
  },
  {
    id: "fx-conversion",
    name: "Conversão Cambial (FX)",
    description:
      "Serviço de câmbio bancário para transações cross-border que converte valores entre moedas no momento da liquidação, aplicando taxas interbancárias, spreads e compliance regulatório de câmbio.",
    layer: "banking",
    category: "FX",
    complexity: "medium",
    actors: ["Banco", "Adquirente", "Provedor FX", "Banco Central"],
    metricsImpacted: ["Margem de FX", "Custo de Processamento", "Velocidade de Liquidação"],
    aliases: ["FX Conversion", "Câmbio", "Foreign Exchange", "Conversão de Moeda Bancária"],
    dependencies: ["currency-conversion"],
    relatedFlows: ["cross-border"],
    relatedProblems: [],
    businessRules: [
      "Taxas de câmbio atualizadas em tempo real via feeds de mercado (Reuters, Bloomberg)",
      "Spread máximo regulado pelo Banco Central para operações de câmbio de varejo",
      "Registro obrigatório de contratos de câmbio para transações acima de USD 10.000",
    ],
  },
  {
    id: "clearing-compensation",
    name: "Clearing e Compensação",
    description:
      "Processo de compensação multilateral (netting) que consolida transações entre participantes de um sistema de pagamentos, calculando saldos líquidos a pagar ou receber antes da liquidação final.",
    layer: "settlement",
    category: "Compensação",
    complexity: "high",
    actors: ["Bandeira", "Câmara de Compensação", "Adquirente", "Emissor"],
    metricsImpacted: ["Velocidade de Liquidação", "Eficiência de Capital", "Risco Sistêmico"],
    aliases: ["Clearing", "Compensação", "Netting", "Câmara de Compensação"],
    dependencies: ["settlement-reconciliation"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Arquivo de clearing (TC105/IPM) processado em janelas batch diárias (D+1)",
      "Netting multilateral reduz o número de transferências entre participantes em até 90%",
      "Deadline de submissão: 48h após a transação para inclusão no ciclo de clearing",
    ],
  },
  {
    id: "settlement-cycles",
    name: "Ciclos de Liquidação T+1 / T+2",
    description:
      "Cadência de transferência efetiva de fundos entre adquirentes, bandeiras e merchants após o clearing, com prazos T+1 (um dia útil) ou T+2 (dois dias úteis) dependendo do método e jurisdição.",
    layer: "settlement",
    category: "Liquidação",
    complexity: "medium",
    actors: ["Adquirente", "Banco", "Merchant", "Bandeira"],
    metricsImpacted: ["Cash Flow do Merchant", "Velocidade de Liquidação", "Working Capital"],
    aliases: ["Settlement Cycle", "Ciclo de Liquidação", "T+1", "T+2", "Funding Cycle"],
    dependencies: ["clearing-compensation", "settlement-reconciliation"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "PIX: liquidação em tempo real (T+0) via SPI do Banco Central",
      "Cartão de crédito no Brasil: liquidação padrão em D+30 (Circular BCB 3.952/2019). Nos EUA: T+1 a T+2",
      "Antecipação de recebíveis (Brasil): permite merchant receber antes de D+30 mediante deságio negociado com adquirente",
    ],
  },
  {
    id: "reserve-retention",
    name: "Reserva e Retenção",
    description:
      "Mecanismo de retenção de uma parcela dos recebíveis do merchant como garantia contra chargebacks, fraude e risco de crédito, com modelos de rolling reserve, upfront reserve e delay de funding.",
    layer: "settlement",
    category: "Risco Financeiro",
    complexity: "medium",
    actors: ["Adquirente", "Merchant", "Underwriter"],
    metricsImpacted: ["Cash Flow do Merchant", "Risco de Crédito", "Cobertura de Chargeback"],
    aliases: ["Reserve", "Retenção", "Rolling Reserve", "Holdback", "Security Deposit"],
    dependencies: ["chargeback-management", "settlement-reconciliation"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Rolling reserve padrão: 5-10% retido por 180 dias para merchants de alto risco",
      "Release automático de reserva após período sem chargebacks acima do threshold",
      "Revisão de percentual de retenção a cada 90 dias baseada no perfil de risco atualizado",
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers de busca
// ---------------------------------------------------------------------------

const _featureById = new Map(FEATURES_REGISTRY.map((f) => [f.id, f]));

/** Busca uma feature pelo ID exato */
export function getFeatureById(id: string): PaymentFeature | undefined {
  return _featureById.get(id);
}

/** Mapa de aliases para IDs */
const _aliasMap = new Map<string, string>();
FEATURES_REGISTRY.forEach((f) => {
  // Nome exato
  _aliasMap.set(f.name.toLowerCase(), f.id);
  // Aliases
  f.aliases?.forEach((a) => _aliasMap.set(a.toLowerCase(), f.id));
});

/** Busca uma feature pelo nome ou alias (case-insensitive) */
export function getFeatureByName(name: string): PaymentFeature | undefined {
  const id = _aliasMap.get(name.toLowerCase());
  if (id) return _featureById.get(id);

  // Busca fuzzy: tenta match parcial
  for (const [alias, fid] of _aliasMap.entries()) {
    if (alias.includes(name.toLowerCase()) || name.toLowerCase().includes(alias)) {
      return _featureById.get(fid);
    }
  }
  return undefined;
}

/** Retorna o ID da feature dado um nome/alias */
export function getFeatureIdByName(name: string): string | undefined {
  const feature = getFeatureByName(name);
  return feature?.id;
}

/** Retorna todas as features de uma camada */
export function getFeaturesByLayer(layer: string): PaymentFeature[] {
  return FEATURES_REGISTRY.filter((f) => f.layer === layer);
}

/** Retorna features que dependem de uma feature específica */
export function getDependents(featureId: string): PaymentFeature[] {
  return FEATURES_REGISTRY.filter(
    (f) => f.dependencies?.includes(featureId)
  );
}

/** Retorna features das quais uma feature depende */
export function getDependencies(featureId: string): PaymentFeature[] {
  const feature = _featureById.get(featureId);
  if (!feature?.dependencies) return [];
  return feature.dependencies
    .map((id) => _featureById.get(id))
    .filter((f): f is PaymentFeature => f !== undefined);
}
