/**
 * Registro Central de Features — Payments Knowledge System
 *
 * Fonte única de verdade para todas as features de pagamento.
 * Importado por todas as páginas que referenciam features.
 */

import { PaymentFeature } from "./types";

// ---------------------------------------------------------------------------
// Registro de Features (83 features)
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
    technicalRequirements: [
      "Integração com 3DS Server certificado EMVCo para orquestração do fluxo",
      "Coleta de device fingerprint (browser info, IP, screen resolution) para Risk-Based Authentication",
      "Implementação de challenge iframe com suporte a redirect e popup flows",
      "Webhook endpoint para receber resultado assíncrono de autenticação (RReq/RRes)",
    ],
    payloadExample: `{
  "threeDSRequestorAuthenticationInd": "01",
  "acctNumber": "tok_masked_4242",
  "cardExpiryDate": "2812",
  "purchaseAmount": "15000",
  "purchaseCurrency": "986",
  "merchantName": "Loja Example",
  "mcc": "5411",
  "deviceChannel": "02",
  "browserInfo": {
    "browserAcceptHeader": "text/html",
    "browserIP": "203.0.113.42",
    "browserLanguage": "pt-BR",
    "browserScreenHeight": "1080",
    "browserScreenWidth": "1920"
  },
  "messageVersion": "2.2.0"
}`,
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
    technicalRequirements: [
      "Integração com Token Service Provider (TSP) de cada bandeira (Visa VTS, Mastercard MDES)",
      "Armazenamento seguro do token requestor ID e mapeamento PAN-to-token no vault",
      "Geração de criptograma (TAVV/UCAF) por transação via API do TSP",
      "Webhook para receber notificações de lifecycle events (token updated, suspended, deleted)",
    ],
    payloadExample: `{
  "type": "tokenize",
  "pan_source": "vault_ref_abc123",
  "token_requestor_id": "40010030273",
  "token_type": "MERCHANT",
  "cryptogram_type": "TAVV",
  "response": {
    "network_token": "4000000000001234",
    "token_expiry": "2812",
    "cryptogram": "AgAAAAAABk4DWZ4C28yUQAAAAA==",
    "eci": "07",
    "token_reference_id": "DNITHE382000000000001234"
  }
}`,
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
    technicalRequirements: [
      "Engine de regras em tempo real com latência < 10ms para decisão de roteamento",
      "Tabela de BIN com mapeamento de bandeira, país e tipo de cartão atualizada diariamente",
      "Monitoramento contínuo de health-check e success rate por adquirente (sliding window 5min)",
      "API de configuração de pesos e regras por merchant sem necessidade de deploy",
    ],
    payloadExample: `{
  "transaction_id": "txn_9f8e7d6c",
  "routing_decision": {
    "selected_acquirer": "acquirer_stone",
    "score": 0.94,
    "criteria": {
      "success_rate_5min": 0.97,
      "avg_latency_ms": 180,
      "cost_bps": 185,
      "bin_country": "BR",
      "card_brand": "visa"
    },
    "alternatives": [
      { "acquirer": "acquirer_cielo", "score": 0.88 },
      { "acquirer": "acquirer_rede", "score": 0.82 }
    ]
  }
}`,
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
    technicalRequirements: [
      "Mapeamento de response codes retentáveis vs. definitivos por adquirente e bandeira",
      "Sistema de filas com backoff exponencial (1s, 5s, 30s) e jitter aleatório",
      "Circuit breaker por adquirente para evitar retentativas em massa durante outages",
      "Persistência de estado da transação para garantir idempotência entre retentativas",
    ],
    payloadExample: `{
  "original_transaction_id": "txn_abc123",
  "retry_attempt": 2,
  "retry_strategy": "cascading",
  "previous_attempts": [
    {
      "acquirer": "acquirer_stone",
      "response_code": "05",
      "response_message": "Do not honor",
      "retryable": true,
      "latency_ms": 2300
    },
    {
      "acquirer": "acquirer_cielo",
      "response_code": "51",
      "response_message": "Insufficient funds",
      "retryable": false,
      "latency_ms": 450
    }
  ],
  "next_action": "abort",
  "reason": "non_retryable_decline"
}`,
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
    technicalRequirements: [
      "Banco de dados de BIN com suporte a busca por prefixo (trie ou range-based lookup)",
      "Pipeline de ingestão para atualização quinzenal de tabelas BIN (Visa/MC/Elo)",
      "Cache em memória (Redis/Memcached) com TTL de 24h para lookups de alta performance",
      "API de consulta com latência < 5ms para não impactar fluxo de autorização",
    ],
    payloadExample: `{
  "bin": "45321678",
  "result": {
    "card_brand": "visa",
    "card_type": "credit",
    "card_level": "platinum",
    "issuer_name": "Banco Itaú",
    "issuer_country": "BR",
    "issuer_country_iso": "076",
    "is_prepaid": false,
    "is_commercial": false,
    "is_regulated": true,
    "bin_length": 8
  }
}`,
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
    technicalRequirements: [
      "Integração com provedor de taxas de câmbio em tempo real (ex: Reuters, Bloomberg, Open Exchange Rates)",
      "Cache de taxas com TTL de 15 minutos e invalidação manual",
      "API de cotação que retorna ambas as moedas com markup transparente",
      "Suporte a DCC opt-in/opt-out no checkout conforme regulação Visa/MC",
    ],
    payloadExample: `{
  "transaction_amount": 10000,
  "transaction_currency": "BRL",
  "cardholder_currency": "USD",
  "exchange_rate": 0.1923,
  "markup_percentage": 3.5,
  "converted_amount": 1923,
  "rate_timestamp": "2026-03-22T10:30:00Z",
  "dcc_offered": true,
  "cardholder_accepted": true
}`,
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
    technicalRequirements: [
      "Pipeline de ML com modelo de gradient boosting treinado em features transacionais (valor, horário, device, geolocalização)",
      "Feature store com cálculo em tempo real de agregações (velocity, frequência, padrões de gasto)",
      "API de scoring com latência < 50ms para não impactar fluxo de autorização",
      "Dashboard de monitoramento de model drift com re-treinamento mensal automatizado",
    ],
    payloadExample: `{
  "transaction_id": "txn_risk_001",
  "amount": 15000,
  "currency": "BRL",
  "card_token": "tok_masked_4242",
  "risk_evaluation": {
    "score": 78,
    "risk_level": "medium",
    "recommendation": "review",
    "factors": [
      { "name": "unusual_amount", "weight": 0.35, "detail": "Valor 3x acima da média do portador" },
      { "name": "new_device", "weight": 0.25, "detail": "Device não reconhecido" },
      { "name": "velocity", "weight": 0.18, "detail": "3ª transação em 10 minutos" }
    ],
    "model_version": "fraud_v3.2.1",
    "evaluated_at": "2026-03-22T14:30:00Z"
  }
}`,
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
    technicalRequirements: [
      "Integração batch com Visa VAU (arquivo mensal) e Mastercard ABU (real-time + batch)",
      "Job de envio de PANs/tokens para consulta periódica e processamento de respostas",
      "Atualização automática de credenciais no vault com versionamento e audit trail",
      "Webhook para notificar merchant sobre cards updated, closed ou expiring",
    ],
    payloadExample: `{
  "batch_id": "au_batch_20260322",
  "request_type": "account_update_inquiry",
  "cards": [
    {
      "vault_token": "tok_old_4242",
      "brand": "visa",
      "response": {
        "status": "updated",
        "new_pan_last4": "5678",
        "new_expiry": "2903",
        "reason": "card_replaced",
        "updated_at": "2026-03-22T06:00:00Z"
      }
    },
    {
      "vault_token": "tok_old_9999",
      "brand": "mastercard",
      "response": {
        "status": "closed",
        "reason": "account_closed",
        "updated_at": "2026-03-22T06:00:00Z"
      }
    }
  ],
  "summary": { "total": 1500, "updated": 42, "closed": 8, "no_change": 1450 }
}`,
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
    technicalRequirements: [
      "HSM (Hardware Security Module) para geração e armazenamento de chaves de criptografia",
      "API de tokenização com latência < 20ms e alta disponibilidade (99.99% SLA)",
      "Criptografia AES-256 para dados em repouso e TLS 1.3 para dados em trânsito",
      "Sistema de rotação automática de chaves com zero-downtime e re-criptografia em background",
      "Audit trail imutável de todos os acessos ao vault para compliance PCI DSS",
    ],
    payloadExample: `{
  "action": "tokenize",
  "card": {
    "number": "4242424242424242",
    "exp_month": 12,
    "exp_year": 2028,
    "cvc": "123"
  },
  "response": {
    "token": "tok_pci_a1b2c3d4e5f6",
    "last4": "4242",
    "brand": "visa",
    "exp_month": 12,
    "exp_year": 2028,
    "fingerprint": "fp_uniquecard123",
    "vault_provider": "internal",
    "created_at": "2026-03-22T10:00:00Z"
  }
}`,
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
    technicalRequirements: [
      "Mapeamento de response codes por adquirente para classificação soft-decline vs. hard-decline",
      "Ordenação dinâmica de adquirentes de fallback baseada em success rate em tempo real",
      "Circuit breaker por adquirente com threshold configurável (ex: 50% erro em 5min)",
      "Logging detalhado de cada tentativa para auditoria e otimização da cascata",
    ],
    payloadExample: `{
  "transaction_id": "txn_casc_001",
  "amount": 25000,
  "currency": "BRL",
  "cascade_attempts": [
    {
      "attempt": 1,
      "acquirer": "acquirer_stone",
      "response_code": "05",
      "response_message": "Do not honor",
      "classification": "soft_decline",
      "latency_ms": 2100
    },
    {
      "attempt": 2,
      "acquirer": "acquirer_cielo",
      "response_code": "00",
      "response_message": "Approved",
      "classification": "approved",
      "latency_ms": 380
    }
  ],
  "final_status": "approved",
  "total_latency_ms": 2480
}`,
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
    technicalRequirements: [
      "Sistema de filas (SQS/RabbitMQ) com dead-letter queue para webhooks falhados",
      "Geração de assinatura HMAC-SHA256 com secret rotacionável por merchant",
      "Endpoint de registro de webhooks com suporte a múltiplos eventos por URL",
      "Dashboard de monitoramento com taxa de entrega, latência e falhas por endpoint",
    ],
    payloadExample: `{
  "id": "evt_wh_001",
  "type": "payment.authorized",
  "created_at": "2026-03-22T14:30:00Z",
  "data": {
    "transaction_id": "txn_abc123",
    "status": "authorized",
    "amount": 15000,
    "currency": "BRL",
    "payment_method": "credit_card",
    "card_last4": "4242"
  },
  "delivery": {
    "webhook_url": "https://merchant.com/webhooks/payments",
    "attempt": 1,
    "signature": "sha256=a1b2c3d4e5f6...",
    "response_status": 200,
    "latency_ms": 145
  }
}`,
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
    technicalRequirements: [
      "Scheduler de cobranças com suporte a cron expressions e timezone do merchant",
      "Engine de dunning com retentativas configuráveis (intervalo, máximo, ação final)",
      "API de gestão de planos com proration automática em upgrades/downgrades",
      "Integração com Account Updater para manter credenciais atualizadas antes da cobrança",
      "Webhook de eventos de lifecycle (created, renewed, past_due, canceled, trial_ending)",
    ],
    payloadExample: `{
  "subscription_id": "sub_rec_001",
  "plan": {
    "id": "plan_premium",
    "name": "Premium Mensal",
    "amount": 9990,
    "currency": "BRL",
    "interval": "month"
  },
  "customer_id": "cus_abc123",
  "payment_method": "tok_card_4242",
  "status": "active",
  "current_period": {
    "start": "2026-03-01T00:00:00Z",
    "end": "2026-04-01T00:00:00Z"
  },
  "next_billing_date": "2026-04-01T00:00:00Z",
  "dunning": {
    "attempts": 0,
    "max_attempts": 4,
    "retry_schedule": ["1d", "3d", "7d", "14d"]
  }
}`,
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
    technicalRequirements: [
      "Integração com APIs de disputas de adquirentes (Cielo, Stone, Adyen) e bandeiras (Visa VROL, MC Connect)",
      "Sistema de upload e armazenamento de evidências (comprovantes, logs, tracking) com S3/GCS",
      "Workflow engine para gerenciar estados da disputa (notified, evidence_due, represented, won, lost)",
      "Dashboard de monitoramento de chargeback rate por MID com alertas de threshold",
    ],
    payloadExample: `{
  "dispute_id": "dsp_cb_001",
  "transaction_id": "txn_original_123",
  "type": "chargeback",
  "reason_code": "10.4",
  "reason": "Fraud - Card Absent Environment",
  "amount": 35000,
  "currency": "BRL",
  "status": "evidence_required",
  "deadlines": {
    "evidence_due": "2026-04-21T23:59:59Z",
    "days_remaining": 30
  },
  "evidence_submitted": {
    "delivery_proof": "https://storage.example.com/evidence/tracking_001.pdf",
    "authentication_log": "https://storage.example.com/evidence/3ds_log_001.json",
    "customer_communication": "https://storage.example.com/evidence/email_chain_001.pdf"
  },
  "network": "visa"
}`,
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
    technicalRequirements: [
      "Parser de arquivos de liquidação multiformat (CSV, CNAB, XML) de cada adquirente",
      "Engine de matching automático entre transações internas e registros do adquirente",
      "Fila de exceções com workflow de revisão manual e SLA configurável",
      "Relatórios de conciliação diários com breakdown por adquirente, status e diferença",
    ],
    payloadExample: `{
  "reconciliation_id": "recon_20260322",
  "period": "2026-03-22",
  "acquirer": "stone",
  "summary": {
    "internal_transactions": 15234,
    "acquirer_records": 15230,
    "matched": 15220,
    "unmatched_internal": 14,
    "unmatched_acquirer": 10,
    "amount_difference_brl": 342
  },
  "exceptions": [
    {
      "transaction_id": "txn_exc_001",
      "internal_amount": 15000,
      "acquirer_amount": 14850,
      "difference": 150,
      "type": "amount_mismatch",
      "status": "pending_review"
    }
  ],
  "status": "completed_with_exceptions"
}`,
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
    technicalRequirements: [
      "Adaptadores padronizados (interface única) para cada APM (PIX, Boleto, BNPL, Wallets)",
      "API de criação de pagamento agnóstica ao método com redirect/QR code/deep link handling",
      "Webhook unificado de status change independente do APM (pending, paid, expired, refunded)",
      "Geração de QR code PIX (EMV standard) e código copia-e-cola com expiração configurável",
    ],
    payloadExample: `{
  "payment_id": "pay_apm_001",
  "method": "pix",
  "amount": 15000,
  "currency": "BRL",
  "customer": {
    "name": "João Silva",
    "document": "123.456.789-00",
    "email": "joao@example.com"
  },
  "pix": {
    "qr_code": "00020126580014br.gov.bcb.pix...",
    "qr_code_url": "https://api.example.com/qr/pay_apm_001.png",
    "copy_paste": "00020126580014br.gov.bcb.pix...",
    "expiration": "2026-03-22T15:00:00Z"
  },
  "status": "pending",
  "created_at": "2026-03-22T14:30:00Z"
}`,
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
    technicalRequirements: [
      "API de definição de split rules com suporte a percentual, valor fixo e remainder",
      "Engine de cálculo de split em tempo real no momento da captura com arredondamento correto",
      "Sistema de ledger separado por sub-merchant com saldo, repasses e retenções",
      "Scheduler de repasses automáticos (payout) com suporte a múltiplas contas bancárias",
    ],
    payloadExample: `{
  "payment_id": "pay_split_001",
  "amount": 100000,
  "currency": "BRL",
  "split_rules": [
    {
      "recipient_id": "seller_abc",
      "type": "percentage",
      "value": 85,
      "amount": 85000,
      "payout_schedule": "D+14"
    },
    {
      "recipient_id": "platform",
      "type": "percentage",
      "value": 15,
      "amount": 15000,
      "payout_schedule": "D+2"
    }
  ],
  "platform_fee": 15000,
  "status": "split_applied",
  "settlement": {
    "seller_net": 85000,
    "platform_net": 15000
  }
}`,
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
    technicalRequirements: [
      "Redis/Memcached com contadores atômicos e sliding window para tracking de velocidade",
      "Engine de regras configurável com dimensões: cartão, IP, device, email, CPF",
      "Latência de avaliação < 10ms para não impactar fluxo de autorização",
      "API de configuração de limites por merchant com suporte a override temporário",
    ],
    payloadExample: `{
  "transaction_id": "txn_vel_001",
  "card_fingerprint": "fp_card_4242",
  "velocity_checks": [
    {
      "rule": "card_txn_count_1h",
      "window": "1h",
      "current_count": 4,
      "limit": 5,
      "status": "passed"
    },
    {
      "rule": "card_amount_24h",
      "window": "24h",
      "current_amount": 480000,
      "limit": 500000,
      "status": "passed"
    },
    {
      "rule": "ip_txn_count_10m",
      "window": "10m",
      "current_count": 8,
      "limit": 3,
      "status": "blocked"
    }
  ],
  "decision": "blocked",
  "blocked_by": "ip_txn_count_10m"
}`,
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
    technicalRequirements: [
      "API de captura que aceita amount menor ou igual ao valor autorizado original",
      "Liberação automática (auto-void) do saldo remanescente após captura parcial",
      "Tracking de estado: authorized → partially_captured → remaining_voided",
      "Validação de prazo de captura por MCC e bandeira antes de submeter ao adquirente",
    ],
    payloadExample: `{
  "authorization_id": "auth_pc_001",
  "original_amount": 50000,
  "currency": "BRL",
  "capture": {
    "amount": 35000,
    "reason": "partial_fulfillment",
    "items_shipped": 2,
    "items_total": 3
  },
  "remaining": {
    "amount": 15000,
    "action": "auto_void",
    "voided_at": "2026-03-22T16:00:00Z"
  },
  "status": "partially_captured",
  "authorization_expires_at": "2026-03-29T14:30:00Z"
}`,
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
    technicalRequirements: [
      "Armazenamento de idempotency keys em Redis/DynamoDB com TTL de 24h",
      "Middleware que intercepta request antes do processamento e verifica key existente",
      "Armazenamento completo do response original para replay em requests duplicados",
      "Header Idempotency-Key obrigatório em POST requests com validação de formato UUID v4",
    ],
    payloadExample: `{
  "request": {
    "method": "POST",
    "path": "/v1/payments",
    "headers": {
      "Idempotency-Key": "550e8400-e29b-41d4-a716-446655440000",
      "Content-Type": "application/json"
    },
    "body": {
      "amount": 15000,
      "currency": "BRL",
      "payment_method": "tok_card_4242"
    }
  },
  "idempotency": {
    "key": "550e8400-e29b-41d4-a716-446655440000",
    "status": "hit",
    "original_response_at": "2026-03-22T14:30:00Z",
    "cached_status_code": 200,
    "ttl_remaining_seconds": 72000
  }
}`,
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
    technicalRequirements: [
      "3DS Server certificado EMVCo com suporte a protocol version 2.1.0 e 2.2.0",
      "Coleta de 150+ data elements (browser info, device info, merchant risk indicator) para RBA",
      "SDK client-side (Web/iOS/Android) para 3DS Method e Challenge UI rendering",
      "Endpoint de resultado assíncrono (RReq) com validação de assinatura do DS",
      "Implementação de decoupled authentication para fluxos fora do checkout",
    ],
    payloadExample: `{
  "threeDSServerTransID": "8a880dc0-d2d2-4067-bcb1-b08d1690b26e",
  "messageVersion": "2.2.0",
  "deviceChannel": "02",
  "authenticationRequest": {
    "threeDSRequestorAuthenticationInd": "01",
    "purchaseAmount": "25000",
    "purchaseCurrency": "986",
    "cardholderName": "João Silva",
    "email": "joao@example.com",
    "acctNumber": "tok_masked_4242"
  },
  "authenticationResponse": {
    "transStatus": "Y",
    "eci": "05",
    "authenticationValue": "AJkBBkhgQQAAAEpIkEcZdJUAAAA=",
    "dsTransID": "f25084f0-5b16-4c0a-ae5d-b24808571de1",
    "acsTransID": "d7c1ee99-9478-44a6-b1f2-391e29c6b340",
    "flow_type": "frictionless"
  }
}`,
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
    technicalRequirements: [
      "Enrichment automático de dados Level II (tax, customer code) na mensagem de autorização",
      "API para submissão de line-item detail (Level III) com validação de campos obrigatórios",
      "Mapeamento de campos Level II/III para formato específico de cada adquirente/bandeira",
      "Relatório de downgrade analysis mostrando transações que perderam qualificação e motivo",
    ],
    payloadExample: `{
  "transaction_id": "txn_io_001",
  "amount": 250000,
  "currency": "BRL",
  "level2_data": {
    "customer_reference": "PO-2026-0042",
    "tax_amount": 45000,
    "tax_indicator": "provided"
  },
  "level3_data": {
    "line_items": [
      {
        "description": "Servidor Dell PowerEdge R750",
        "quantity": 2,
        "unit_price": 100000,
        "total": 200000,
        "commodity_code": "43211500",
        "unit_of_measure": "UN"
      },
      {
        "description": "SSD NVMe 1TB",
        "quantity": 4,
        "unit_price": 12500,
        "total": 50000,
        "commodity_code": "43201800",
        "unit_of_measure": "UN"
      }
    ],
    "ship_to_zip": "01310-100"
  },
  "qualification": {
    "level": "III",
    "estimated_savings_bps": 45
  }
}`,
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
    technicalRequirements: [
      "State machine para tracking de lifecycle: provisioned → active → suspended → resumed → deleted",
      "Job batch para verificação de tokens inativos e trigger de suspensão automática",
      "Integração com TSP APIs para operações de suspend, resume e delete",
      "Webhook de notificação para cada mudança de estado com detalhes do evento",
      "Dashboard de monitoring com métricas de provisioning rate, active tokens e churn",
    ],
    payloadExample: `{
  "token_reference_id": "DNITHE382000000000001234",
  "event": "token_status_changed",
  "previous_status": "active",
  "new_status": "suspended",
  "reason": "issuer_initiated",
  "details": {
    "network": "visa",
    "token_requestor_id": "40010030273",
    "pan_last4": "4242",
    "token_last4": "1234",
    "token_expiry": "2812",
    "suspension_reason": "lost_stolen",
    "initiated_by": "issuer"
  },
  "timestamp": "2026-03-22T08:00:00Z",
  "webhook_url": "https://merchant.com/webhooks/token-lifecycle"
}`,
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
    technicalRequirements: [
      "Conexão persistente (connection pooling) com adquirentes para reduzir handshake overhead",
      "Timeout configurável por adquirente com fallback automático em caso de breach de SLA",
      "Monitoramento de latência P50/P95/P99 em tempo real com alertas de degradação",
      "Mensageria ISO 8583 com parsing otimizado e serialização < 1ms",
    ],
    payloadExample: `{
  "authorization_request": {
    "message_type": "0100",
    "pan_token": "tok_card_4242",
    "amount": 15000,
    "currency_code": "986",
    "mcc": "5411",
    "merchant_name": "Supermercado Example",
    "pos_entry_mode": "010"
  },
  "authorization_response": {
    "message_type": "0110",
    "response_code": "00",
    "authorization_code": "A12345",
    "issuer": "Banco Itaú",
    "available_balance": 985000
  },
  "performance": {
    "total_latency_ms": 320,
    "acquirer_latency_ms": 180,
    "network_latency_ms": 95,
    "internal_processing_ms": 45
  }
}`,
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
    technicalRequirements: [
      "Integração com provedores de verificação de identidade (Jumio, Onfido, idwall)",
      "OCR e validação de documentos (RG, CNH, Passaporte) com detecção de fraude documental",
      "API de screening contra listas de sanções (OFAC, UE, ONU, PEP) com atualização diária",
      "Workflow de onboarding com estados (pending, documents_required, under_review, approved, rejected)",
      "Armazenamento seguro de documentos com criptografia e retenção conforme LGPD/GDPR",
    ],
    payloadExample: `{
  "kyc_id": "kyc_ver_001",
  "entity_type": "business",
  "business": {
    "legal_name": "Loja Example LTDA",
    "trade_name": "Loja Example",
    "cnpj": "12.345.678/0001-90",
    "mcc": "5411"
  },
  "representatives": [
    {
      "name": "Maria Silva",
      "cpf": "123.456.789-00",
      "document_type": "cnh",
      "document_verification": "approved",
      "liveness_check": "passed"
    }
  ],
  "sanctions_screening": {
    "status": "clear",
    "lists_checked": ["OFAC", "EU", "UN", "PEP_BR"],
    "checked_at": "2026-03-22T10:00:00Z"
  },
  "overall_status": "approved",
  "risk_level": "low",
  "next_review": "2027-03-22"
}`,
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
    technicalRequirements: [
      "Hosted fields via iframes cross-origin para isolar dados do cartão (PCI SAQ-A)",
      "Validação client-side: Luhn check, expiração, CVV length por bandeira",
      "Detecção automática de bandeira via BIN (primeiros 6-8 dígitos) com ícone dinâmico",
      "Componente responsivo com suporte a autofill do navegador e screen readers (WCAG 2.1 AA)",
    ],
    payloadExample: `{
  "checkout_session_id": "cs_ui_001",
  "merchant_id": "merch_abc",
  "config": {
    "hosted_fields": true,
    "fields": ["card_number", "expiry", "cvc", "cardholder_name"],
    "methods_enabled": ["credit_card", "pix", "boleto"],
    "locale": "pt-BR",
    "theme": {
      "primary_color": "#1A73E8",
      "font_family": "Inter",
      "border_radius": "8px"
    }
  },
  "tokenization_result": {
    "token": "tok_checkout_4242",
    "brand": "visa",
    "last4": "4242",
    "exp_month": 12,
    "exp_year": 2028
  }
}`,
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
    technicalRequirements: [
      "Engine de regras para filtrar métodos por país, valor, device e configuração do merchant",
      "Algoritmo de ranking baseado em conversão histórica por segmento e região",
      "API que retorna lista ordenada de métodos com metadata (ícone, label, campos requeridos)",
      "Cache de configuração por merchant com invalidação em tempo real via pub/sub",
    ],
    payloadExample: `{
  "session_id": "cs_pms_001",
  "context": {
    "country": "BR",
    "currency": "BRL",
    "amount": 15000,
    "device": "mobile",
    "customer_segment": "returning"
  },
  "available_methods": [
    {
      "type": "pix",
      "display_name": "PIX",
      "icon": "pix_icon",
      "rank": 1,
      "conversion_rate": 0.92,
      "instant": true
    },
    {
      "type": "credit_card",
      "display_name": "Cartão de Crédito",
      "icon": "card_icon",
      "rank": 2,
      "conversion_rate": 0.85,
      "brands": ["visa", "mastercard", "elo"]
    },
    {
      "type": "boleto",
      "display_name": "Boleto Bancário",
      "icon": "boleto_icon",
      "rank": 3,
      "conversion_rate": 0.45
    }
  ]
}`,
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
    technicalRequirements: [
      "SDK nativo para iOS (Swift/SwiftUI) e Android (Kotlin) com componentes de UI pré-construídos",
      "Tokenização in-app com chaves públicas para criptografia client-side dos dados do cartão",
      "Integração nativa com Apple Pay (PassKit) e Google Pay (Google Pay API)",
      "Coleta automática de device info para 3DS2 (OS version, screen size, device model, app ID)",
    ],
    payloadExample: `{
  "sdk": "ios",
  "version": "3.2.1",
  "initialization": {
    "merchant_id": "merch_abc",
    "public_key": "pk_live_abc123...",
    "environment": "production"
  },
  "tokenization_request": {
    "card_number_encrypted": "enc_AES256_...",
    "exp_month": 12,
    "exp_year": 2028
  },
  "device_info": {
    "os": "iOS",
    "os_version": "18.3",
    "device_model": "iPhone 16 Pro",
    "app_id": "com.merchant.app",
    "screen_resolution": "1290x2796",
    "sdk_version": "3.2.1",
    "biometric_available": true,
    "biometric_type": "face_id"
  },
  "wallet_payment": {
    "type": "apple_pay",
    "payment_data": "eyJkYXRhIjoiZW5jcnlwdGVkLi4uIn0="
  }
}`,
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
    technicalRequirements: [
      "Engine de split de tráfego com hash consistente para alocação determinística por transação",
      "Coleta de métricas em tempo real por variante (auth rate, latência, custo) com sliding window",
      "Cálculo de significância estatística (p-value < 0.05) com teste chi-squared ou Z-test",
      "API de criação e gestão de experimentos com kill switch automático por threshold",
    ],
    payloadExample: `{
  "experiment_id": "exp_route_001",
  "name": "Stone vs Cielo - Visa Credit BR",
  "status": "running",
  "variants": [
    {
      "id": "control",
      "name": "Stone (atual)",
      "traffic_percentage": 50,
      "acquirer": "stone",
      "metrics": {
        "transactions": 5200,
        "auth_rate": 0.943,
        "avg_latency_ms": 210,
        "cost_bps": 185
      }
    },
    {
      "id": "treatment",
      "name": "Cielo (teste)",
      "traffic_percentage": 50,
      "acquirer": "cielo",
      "metrics": {
        "transactions": 5180,
        "auth_rate": 0.951,
        "avg_latency_ms": 195,
        "cost_bps": 175
      }
    }
  ],
  "statistical_significance": {
    "p_value": 0.032,
    "confidence_level": 0.95,
    "is_significant": true,
    "winner": "treatment"
  }
}`,
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
    technicalRequirements: [
      "Parser/serializer ISO 8583 com suporte a formatos de cada bandeira (Visa Base I, MC MIP, Elo)",
      "Conexão TCP persistente com framing length-prefix para comunicação com redes de pagamento",
      "Mapeamento bidirecional entre API REST do gateway e campos ISO 8583 (data elements)",
      "Suporte a bitmaps primários e secundários com encoding BCD/ASCII conforme especificação",
    ],
    payloadExample: `{
  "message_type_indicator": "0100",
  "bitmap": "F23E44810AE08000",
  "data_elements": {
    "DE2": { "name": "PAN", "value": "4242424242424242", "length": 16 },
    "DE3": { "name": "Processing Code", "value": "003000" },
    "DE4": { "name": "Transaction Amount", "value": "000000015000" },
    "DE7": { "name": "Transmission Date/Time", "value": "0322143000" },
    "DE11": { "name": "STAN", "value": "123456" },
    "DE14": { "name": "Expiration Date", "value": "2812" },
    "DE22": { "name": "POS Entry Mode", "value": "010" },
    "DE25": { "name": "POS Condition Code", "value": "59" },
    "DE41": { "name": "Terminal ID", "value": "TERM0001" },
    "DE42": { "name": "Merchant ID", "value": "MERCH00000001" },
    "DE49": { "name": "Currency Code", "value": "986" }
  },
  "network": "visa_base_i"
}`,
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
    technicalRequirements: [
      "Tabelas de interchange atualizadas semestralmente por bandeira com regras de qualificação",
      "Engine de classificação que avalia critérios: tipo cartão, MCC, CP/CNP, dados Level II/III",
      "Relatório de downgrade analysis com motivos de perda de qualificação por transação",
      "Simulador de interchange que estima custo antes do processamento baseado em dados disponíveis",
    ],
    payloadExample: `{
  "transaction_id": "txn_iq_001",
  "amount": 150000,
  "currency": "BRL",
  "qualification_analysis": {
    "card_type": "commercial_credit",
    "card_brand": "visa",
    "mcc": "5045",
    "pos_entry": "ecommerce",
    "interchange_category": "Commercial Standard",
    "rate": {
      "percentage": 2.10,
      "fixed_cents": 10
    },
    "potential_category": "Commercial Level III",
    "potential_rate": {
      "percentage": 1.65,
      "fixed_cents": 10
    },
    "savings_if_qualified_bps": 45,
    "missing_data": ["level3_line_items", "ship_to_zip"],
    "recommendation": "Adicionar dados Level III para economizar ~R$ 6.75 nesta transação"
  }
}`,
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
    technicalRequirements: [
      "Sistema de monitoramento contínuo de chargeback rate e fraud rate por MID e bandeira",
      "Alertas automáticos quando métricas se aproximam dos thresholds de programas de monitoramento",
      "Calendário de mandatos (Visa/MC) com tracking de prazos de implementação obrigatória",
      "Relatórios de compliance por bandeira com status de aderência a cada mandato vigente",
    ],
    payloadExample: `{
  "merchant_id": "merch_abc",
  "compliance_report": {
    "period": "2026-03",
    "visa": {
      "program": "VDMP",
      "status": "monitoring",
      "chargeback_rate": 0.85,
      "threshold": 0.90,
      "dispute_count": 95,
      "dispute_threshold": 100,
      "months_in_program": 0,
      "estimated_fine": 0
    },
    "mastercard": {
      "program": "ECM",
      "status": "clear",
      "chargeback_rate": 0.72,
      "threshold": 1.00,
      "dispute_count": 68,
      "dispute_threshold": 100
    },
    "mandates": [
      {
        "network": "visa",
        "mandate": "Network Token Migration",
        "deadline": "2026-10-01",
        "compliance_status": "in_progress",
        "completion_pct": 65
      }
    ]
  }
}`,
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
    technicalRequirements: [
      "API de onboarding com workflow de underwriting (documentação, análise de risco, aprovação)",
      "Sistema de gestão de MIDs com configuração de MCC, limites, pricing e terminais por conta",
      "Dashboard de monitoramento de risco por merchant com alertas de anomalia",
      "Integração com provedores KYB (Know Your Business) para verificação automatizada de empresas",
    ],
    payloadExample: `{
  "merchant_id": "merch_new_001",
  "onboarding": {
    "status": "approved",
    "legal_name": "Loja Example LTDA",
    "trade_name": "Loja Example",
    "cnpj": "12.345.678/0001-90",
    "mcc": "5411",
    "business_type": "retail_food"
  },
  "account_config": {
    "mid": "MID000012345",
    "processing_limits": {
      "daily_volume": 500000,
      "single_transaction": 100000,
      "monthly_volume": 15000000
    },
    "pricing": {
      "mdr_credit": 2.49,
      "mdr_debit": 1.59,
      "mdr_pix": 0.99
    },
    "settlement_schedule": "D+1",
    "risk_category": "standard"
  },
  "activated_at": "2026-03-22T10:00:00Z"
}`,
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
    technicalRequirements: [
      "Sistema de decisão em tempo real com pipeline: saldo → fraude → geoloc → limites → aprovação",
      "Motor de regras configurável com condições por MCC, país, horário e perfil do portador",
      "Integração com sistema core banking para consulta de saldo/limite em < 100ms",
      "Stand-in parameters configurados na bandeira para processamento quando emissor offline",
    ],
    payloadExample: `{
  "authorization_id": "auth_iss_001",
  "incoming_request": {
    "pan_token": "tok_4242",
    "amount": 25000,
    "currency": "BRL",
    "mcc": "5411",
    "merchant_country": "BR",
    "pos_entry_mode": "ecommerce"
  },
  "decision_pipeline": [
    { "check": "card_status", "result": "active", "latency_ms": 2 },
    { "check": "available_balance", "result": "sufficient", "available": 985000, "latency_ms": 15 },
    { "check": "fraud_rules", "result": "passed", "score": 12, "latency_ms": 25 },
    { "check": "geo_restriction", "result": "passed", "latency_ms": 3 },
    { "check": "velocity_limit", "result": "passed", "latency_ms": 5 }
  ],
  "decision": "approved",
  "authorization_code": "A78901",
  "response_code": "00",
  "total_decision_ms": 50
}`,
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
    technicalRequirements: [
      "Sistema de ledger double-entry com imutabilidade (append-only) e audit trail completo",
      "Geração automática de lançamentos contábeis para cada evento de pagamento (auth, capture, refund)",
      "Engine de reconciliação com matching automático entre ledger interno e arquivos de adquirentes",
      "API de consulta de saldo e extrato por merchant/sub-merchant com suporte a filtros temporais",
    ],
    payloadExample: `{
  "ledger_entry_id": "le_001",
  "transaction_id": "txn_abc123",
  "event": "payment_captured",
  "entries": [
    {
      "account": "merchant_receivables",
      "type": "debit",
      "amount": 15000,
      "currency": "BRL"
    },
    {
      "account": "acquirer_payable",
      "type": "credit",
      "amount": 14625,
      "currency": "BRL"
    },
    {
      "account": "platform_revenue",
      "type": "credit",
      "amount": 375,
      "currency": "BRL",
      "description": "MDR 2.5%"
    }
  ],
  "balance_after": {
    "merchant_receivables": 1250000,
    "acquirer_payable": 1180000
  },
  "reconciliation_status": "matched",
  "created_at": "2026-03-22T14:30:00Z"
}`,
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
    technicalRequirements: [
      "Integração com feeds de mercado FX (Reuters/Refinitiv, Bloomberg, ECB) para taxas em tempo real",
      "Motor de câmbio com suporte a multi-currency pairs e cálculo de spread configurável",
      "Registro automático de contratos de câmbio no SISBACEN para operações reguladas (Brasil)",
      "API de cotação com lock de taxa por tempo limitado (30s-5min) para garantir preço ao merchant",
    ],
    payloadExample: `{
  "fx_operation_id": "fx_conv_001",
  "type": "settlement_conversion",
  "source": {
    "amount": 10000,
    "currency": "USD"
  },
  "target": {
    "amount": 51950,
    "currency": "BRL"
  },
  "rates": {
    "mid_market_rate": 5.1500,
    "applied_rate": 5.1950,
    "spread_pct": 0.87,
    "rate_source": "reuters",
    "rate_timestamp": "2026-03-22T14:30:00Z",
    "rate_locked_until": "2026-03-22T14:35:00Z"
  },
  "regulatory": {
    "bacen_contract": "CONT-2026-00042",
    "requires_sisbacen": true,
    "iof_rate_pct": 0.38,
    "iof_amount": 197
  },
  "status": "completed"
}`,
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
    technicalRequirements: [
      "Parser de arquivos de clearing: Visa TC105/TC118, Mastercard IPM, Elo CNAB",
      "Motor de netting multilateral que calcula saldos líquidos entre participantes",
      "Scheduler de geração e submissão de arquivos de clearing dentro das janelas definidas",
      "Reconciliação automática entre arquivo de clearing enviado e confirmação da bandeira",
    ],
    payloadExample: `{
  "clearing_cycle_id": "clr_20260322_001",
  "network": "visa",
  "file_type": "TC105",
  "cycle_date": "2026-03-22",
  "submission_deadline": "2026-03-24T23:59:59Z",
  "summary": {
    "total_transactions": 45230,
    "total_sales_amount": 125000000,
    "total_refunds_amount": 3200000,
    "net_amount": 121800000
  },
  "netting_result": {
    "participants": 12,
    "gross_positions": 24,
    "net_positions": 12,
    "reduction_pct": 50,
    "settlement_entries": [
      {
        "participant": "Banco Itaú",
        "net_position": "creditor",
        "amount": 45000000
      },
      {
        "participant": "Stone",
        "net_position": "debtor",
        "amount": 32000000
      }
    ]
  },
  "status": "submitted"
}`,
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
    technicalRequirements: [
      "Scheduler de liquidação com suporte a múltiplos ciclos (T+0 PIX, T+1 débito, D+30 crédito BR)",
      "Integração com sistema bancário para transferências automáticas no dia da liquidação",
      "Motor de cálculo de antecipação de recebíveis com deságio dinâmico por prazo e risco",
      "Dashboard de cash flow projetado com visibilidade de recebíveis por período",
    ],
    payloadExample: `{
  "settlement_id": "stl_cycle_001",
  "merchant_id": "merch_abc",
  "cycle_date": "2026-03-22",
  "settlements": [
    {
      "method": "pix",
      "cycle": "T+0",
      "transactions": 1250,
      "gross_amount": 3500000,
      "fees": 34650,
      "net_amount": 3465350,
      "settled_at": "2026-03-22T17:00:00Z"
    },
    {
      "method": "debit_card",
      "cycle": "T+1",
      "transactions": 890,
      "gross_amount": 2100000,
      "fees": 33390,
      "net_amount": 2066610,
      "expected_settlement": "2026-03-23"
    },
    {
      "method": "credit_card",
      "cycle": "D+30",
      "transactions": 2300,
      "gross_amount": 8500000,
      "fees": 211650,
      "net_amount": 8288350,
      "expected_settlement": "2026-04-21",
      "antecipation_available": true,
      "antecipation_discount_pct": 1.89
    }
  ],
  "total_net": 13820310
}`,
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
    technicalRequirements: [
      "Motor de cálculo de retenção configurável por merchant (percentual, período, tipo de reserva)",
      "Scheduler de release automático baseado em regras de aging e perfil de risco",
      "Ledger separado para tracking de saldo retido vs. disponível por merchant",
      "API de consulta de reservas com projeção de liberação e histórico de retenções",
    ],
    payloadExample: `{
  "merchant_id": "merch_abc",
  "reserve_config": {
    "type": "rolling_reserve",
    "retention_pct": 7.5,
    "hold_period_days": 180,
    "risk_category": "high"
  },
  "current_balance": {
    "total_retained": 2250000,
    "available_for_release": 450000,
    "next_release_date": "2026-04-01",
    "next_release_amount": 180000
  },
  "recent_activity": [
    {
      "date": "2026-03-22",
      "type": "retention",
      "transaction_amount": 100000,
      "retained_amount": 7500,
      "release_date": "2026-09-18"
    },
    {
      "date": "2026-03-22",
      "type": "release",
      "amount": 12000,
      "original_retention_date": "2025-09-22",
      "reason": "hold_period_expired"
    }
  ],
  "next_review_date": "2026-06-22"
}`,
  },

  // ── Features expandidas (45 novas) ──────────────────────────────────────

  {
    id: "ic-plus-plus",
    name: "IC++ (Interchange Plus Plus)",
    description:
      "Modelo de precificação transparente onde o custo total da transação é decomposto em três componentes separados: interchange fee (paga ao emissor), scheme fee (paga à bandeira) e markup do adquirente, permitindo visibilidade total de custos.",
    layer: "settlement",
    category: "Otimização de Custo",
    complexity: "medium",
    actors: ["Adquirente", "Merchant", "Bandeira", "Emissor"],
    metricsImpacted: ["Custo de Processamento", "Transparência de Pricing", "Margem Líquida"],
    aliases: ["IC++", "Interchange Plus Plus", "Interchange++", "Cost Plus Pricing"],
    dependencies: ["interchange-qualification", "bin-lookup"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Interchange varia por tipo de cartão (débito, crédito, premium), MCC e presença do portador",
      "Scheme fees incluem assessment fee, cross-border fee e technology fee da bandeira",
      "Acquirer markup é negociável e geralmente cobrado como percentual + fixo por transação",
    ],
    technicalRequirements: [
      "Motor de cálculo de interchange com tabelas atualizadas por bandeira (Visa, MC, Elo)",
      "Pipeline de ingestão de tabelas de scheme fees atualizadas semestralmente",
      "Dashboard de cost breakdown por transação com drill-down por componente",
      "API de simulação de custo para merchants estimarem pricing antes de processar",
    ],
    payloadExample: `{
  "transaction_id": "txn_cost_001",
  "amount": 10000,
  "currency": "BRL",
  "cost_breakdown": {
    "interchange_fee": {
      "rate_pct": 1.65,
      "amount": 165,
      "category": "Consumer Credit Premium",
      "recipient": "Banco Itaú (emissor)"
    },
    "scheme_fee": {
      "rate_pct": 0.12,
      "amount": 12,
      "components": {
        "assessment": 8,
        "technology_fee": 3,
        "cross_border": 1
      },
      "recipient": "Visa"
    },
    "acquirer_markup": {
      "rate_pct": 0.45,
      "fixed_cents": 15,
      "amount": 60,
      "recipient": "Stone (adquirente)"
    },
    "total_cost": 237,
    "effective_mdr_pct": 2.37
  }
}`,
  },
  {
    id: "pre-authorization",
    name: "Pre-Authorization",
    description:
      "Autorização prévia que reserva o valor no cartão sem efetuar a captura, usado em hotéis, locadoras e postos de combustível para garantir fundos antes do valor final ser conhecido.",
    layer: "processing",
    category: "Autorização",
    complexity: "medium",
    actors: ["Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Taxa de Autorização", "Utilização de Limite", "Taxa de Conversão"],
    aliases: ["Pré-Autorização", "Auth Only", "Authorization Hold", "Pre-Auth"],
    dependencies: ["real-time-auth", "partial-capture"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Hold máximo de 30 dias para hotelaria, 7 dias para varejo geral",
      "Valor de captura pode ser até 15% acima do valor pré-autorizado (Visa) ou 20% (Mastercard)",
      "Liberação automática do hold se não houver captura dentro do prazo",
    ],
    technicalRequirements: [
      "API deve suportar flag capture=false no endpoint de autorização",
      "Sistema de agendamento para auto-release de holds expirados",
      "Suporte a multiple captures contra uma única autorização (multi-capture)",
      "Webhook de notificação quando hold está próximo de expirar",
    ],
    payloadExample: `{
  "type": "authorization",
  "capture": false,
  "amount": 50000,
  "currency": "BRL",
  "card": {
    "token": "tok_abc123",
    "cryptogram": "AABBCCDD..."
  },
  "merchant": {
    "mcc": "7011",
    "name": "Hotel Example"
  },
  "metadata": {
    "estimated_checkout": "2026-03-25"
  }
}`,
  },
  {
    id: "incremental-authorization",
    name: "Incremental Authorization",
    description:
      "Permite aumentar o valor de uma autorização existente sem necessidade de cancelar e reautorizar, essencial para indústrias onde o valor final pode exceder a estimativa inicial (hotéis, locadoras, restaurantes).",
    layer: "processing",
    category: "Autorização",
    complexity: "medium",
    actors: ["Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Taxa de Autorização", "Utilização de Limite", "Experiência do Cliente"],
    aliases: ["Autorização Incremental", "Auth Increment", "Top-Up Authorization"],
    dependencies: ["pre-authorization", "real-time-auth"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Cada incremento requer nova autorização contra o emissor",
      "Valor total acumulado deve respeitar o limite do cartão",
      "Incrementos devem referenciar o authorization_id original",
    ],
    technicalRequirements: [
      "API de incremento com referência ao authorization_id original",
      "Tracking de valor total autorizado (original + incrementos) por transação",
      "Suporte a reversal parcial ou total do valor incremental",
      "Notificação ao portador via emissor a cada incremento autorizado",
    ],
    payloadExample: `{
  "type": "incremental_authorization",
  "original_authorization_id": "auth_xyz789",
  "increment_amount": 15000,
  "new_total_amount": 65000,
  "currency": "BRL",
  "reason": "minibar_charges",
  "merchant": {
    "mcc": "7011",
    "name": "Hotel Example"
  }
}`,
  },
  {
    id: "multi-capture",
    name: "Multi-Capture",
    description:
      "Permite realizar múltiplas capturas parciais contra uma única autorização, ideal para e-commerces que fazem envio fracionado de pedidos (split shipment) onde cada envio gera uma captura separada.",
    layer: "processing",
    category: "Autorização",
    complexity: "medium",
    actors: ["Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Utilização de Autorização", "Satisfação do Cliente", "Complexidade de Liquidação"],
    aliases: ["Captura Múltipla", "Multiple Captures", "Split Capture", "Partial Multi-Capture"],
    dependencies: ["pre-authorization", "partial-capture"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Soma de todas as capturas não pode exceder o valor autorizado original",
      "Máximo de 10 capturas parciais por autorização (varia por adquirente)",
      "Autorização remanescente é liberada automaticamente na última captura (final_capture=true)",
    ],
    technicalRequirements: [
      "API de captura com flag is_final_capture para sinalizar última captura",
      "Controle de saldo restante de autorização em tempo real",
      "Reconciliação que agrupa múltiplas capturas sob uma única autorização",
      "Suporte a void individual por captura parcial",
    ],
    payloadExample: `{
  "type": "capture",
  "authorization_id": "auth_xyz789",
  "capture_amount": 8500,
  "is_final_capture": false,
  "capture_sequence": 2,
  "total_captured_so_far": 22000,
  "remaining_authorized": 28000,
  "reference": "shipment_002",
  "items": [
    { "sku": "PROD-456", "name": "Fone Bluetooth", "amount": 8500 }
  ]
}`,
  },
  {
    id: "void-reversal",
    name: "Void / Reversal",
    description:
      "Cancelamento de uma autorização antes da liquidação, liberando imediatamente o limite do cartão do portador. Diferente de refund, não gera movimentação financeira pois os fundos ainda não foram liquidados.",
    layer: "processing",
    category: "Cancelamento",
    complexity: "low",
    actors: ["Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Satisfação do Cliente", "Utilização de Limite", "Custo de Processamento"],
    aliases: ["Void", "Reversal", "Cancelamento", "Estorno de Autorização", "Auth Reversal"],
    dependencies: ["real-time-auth"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Void só é possível antes do batch de liquidação (geralmente até 23:59 do dia da transação)",
      "Após a liquidação, apenas refund é possível",
      "Void não gera custo de interchange para o merchant",
    ],
    technicalRequirements: [
      "API de void com referência ao transaction_id ou authorization_id",
      "Verificação de status da transação (authorized vs. captured vs. settled) antes de processar",
      "Timeout de void: se não houver resposta do emissor em 30s, marcar como pending_void",
      "Webhook de confirmação de void para o merchant",
    ],
    payloadExample: `{
  "type": "void",
  "authorization_id": "auth_xyz789",
  "reason": "customer_request",
  "void_amount": 50000,
  "merchant_reference": "order_12345",
  "response": {
    "status": "voided",
    "void_id": "void_abc456",
    "timestamp": "2026-03-21T14:30:00Z"
  }
}`,
  },
  {
    id: "refund-processing",
    name: "Refund Processing",
    description:
      "Processamento de reembolsos totais ou parciais após a liquidação da transação, devolvendo fundos ao portador do cartão através da rede de pagamento com prazo de crédito de 5-10 dias úteis.",
    layer: "processing",
    category: "Cancelamento",
    complexity: "medium",
    actors: ["Merchant", "Adquirente", "Emissor", "Portador"],
    metricsImpacted: ["Taxa de Refund", "Satisfação do Cliente", "Receita Líquida", "Cash Flow"],
    aliases: ["Refund", "Reembolso", "Estorno", "Devolução de Pagamento"],
    dependencies: ["settlement-reconciliation"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Refund parcial permitido: valor do refund não pode exceder o valor original capturado",
      "Prazo máximo para refund: 120 dias da transação original (varia por bandeira)",
      "Interchange geralmente não é devolvida ao merchant em caso de refund",
    ],
    technicalRequirements: [
      "API de refund com referência ao transaction_id original e suporte a refund parcial",
      "Controle de saldo refundável por transação (original - refunds anteriores)",
      "Reconciliação de refunds com arquivo de liquidação do adquirente",
      "Idempotency key obrigatória para prevenir refunds duplicados",
    ],
    payloadExample: `{
  "type": "refund",
  "original_transaction_id": "txn_settled_789",
  "refund_amount": 5000,
  "currency": "BRL",
  "reason": "product_return",
  "idempotency_key": "ref_uuid_001",
  "response": {
    "refund_id": "ref_def789",
    "status": "processing",
    "estimated_credit_date": "2026-03-28",
    "refunded_to": "card_ending_4242"
  }
}`,
  },
  {
    id: "antecipacao-recebiveis",
    name: "Antecipação de Recebíveis",
    description:
      "Mecanismo que permite ao merchant receber antecipadamente os valores de vendas a prazo (cartão de crédito), transformando recebíveis futuros em caixa imediato mediante aplicação de uma taxa de desconto.",
    layer: "settlement",
    category: "Financeiro",
    complexity: "high",
    actors: ["Merchant", "Adquirente", "Registradora", "Banco Central"],
    metricsImpacted: ["Cash Flow do Merchant", "Custo Financeiro", "Working Capital"],
    aliases: ["Antecipação", "Receivables Anticipation", "Prepayment", "Early Settlement"],
    dependencies: ["settlement-reconciliation", "settlement-cycles"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Taxa de desconto varia de 1.5% a 3.5% ao mês dependendo do risco do merchant",
      "Recebíveis devem estar registrados em registradora autorizada pelo BCB (CIP, TAG, CERC)",
      "Agenda de recebíveis não pode ser gravada/antecipada se já estiver comprometida com outro financiador",
    ],
    technicalRequirements: [
      "Integração com registradoras (CIP, TAG, CERC) para consulta e registro de agenda",
      "Motor de cálculo de deságio com taxa configurável por merchant e prazo",
      "API de simulação de antecipação com valor líquido estimado",
      "Controle de agenda livre vs. comprometida por unidade de recebível",
    ],
    payloadExample: `{
  "type": "anticipation_request",
  "merchant_id": "merch_001",
  "anticipation": {
    "total_receivables": 150000,
    "requested_amount": 100000,
    "discount_rate_monthly": 2.5,
    "discount_amount": 4167,
    "net_amount": 95833,
    "original_settlement_dates": [
      { "date": "2026-04-20", "amount": 50000 },
      { "date": "2026-05-20", "amount": 50000 },
      { "date": "2026-06-20", "amount": 50000 }
    ],
    "registrar": "CIP",
    "status": "approved"
  }
}`,
  },
  {
    id: "mesa-antecipacao",
    name: "Mesa de Antecipação",
    description:
      "Mesa de operação especializada que gerencia a compra e venda de recebíveis de cartão em mercado secundário, negociando taxas, volumes e prazos entre originadores (adquirentes) e financiadores (bancos, FIDCs).",
    layer: "settlement",
    category: "Financeiro",
    complexity: "critical",
    actors: ["Adquirente", "FIDC", "Banco", "Registradora", "Merchant"],
    metricsImpacted: ["Custo Financeiro", "Volume de Antecipação", "Spread de Desconto"],
    aliases: ["Mesa de Antecipação", "Receivables Desk", "Antecipação B2B", "Trading Desk"],
    dependencies: ["antecipacao-recebiveis"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Operações devem respeitar a regra de exclusividade: recebível só pode estar comprometido com um financiador",
      "Taxas de desconto negociadas em leilão eletrônico ou balcão",
      "Registro obrigatório de todas as operações nas registradoras autorizadas pelo BCB",
    ],
    technicalRequirements: [
      "Plataforma de leilão eletrônico com matching engine para compra/venda de recebíveis",
      "Integração bidirecional com registradoras para consulta de agenda e registro de operações",
      "Sistema de gestão de risco com scoring de merchant e limites de exposição por financiador",
      "Relatórios regulatórios para o Banco Central (Circular 3.952)",
    ],
    payloadExample: `{
  "type": "anticipation_auction",
  "auction_id": "auc_20260321",
  "receivables_pool": {
    "total_amount": 5000000,
    "merchant_count": 150,
    "avg_settlement_days": 25,
    "acquirer": "Stone"
  },
  "bids": [
    { "bidder": "FIDC Alpha", "rate_monthly": 1.8, "amount": 2000000 },
    { "bidder": "Banco XP", "rate_monthly": 1.95, "amount": 3000000 }
  ],
  "winning_bid": {
    "bidder": "FIDC Alpha",
    "rate_monthly": 1.8,
    "net_amount": 4910000,
    "registrar_confirmation": "CIP_REG_ABC123"
  }
}`,
  },
  {
    id: "parcelado-emissor",
    name: "Parcelado Emissor",
    description:
      "Modalidade de parcelamento onde o emissor do cartão financia as parcelas, pagando o valor integral ao merchant e cobrando o portador em prestações mensais com juros definidos pelo banco emissor.",
    layer: "banking",
    category: "Parcelamento",
    complexity: "medium",
    actors: ["Emissor", "Portador", "Merchant", "Bandeira"],
    metricsImpacted: ["Ticket Médio", "Taxa de Conversão", "Custo para o Merchant"],
    aliases: ["Parcelado Banco", "Issuer Installments", "Parcelamento pelo Emissor", "Parcelado com Juros"],
    dependencies: ["real-time-auth", "issuer-authorization"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Merchant recebe valor integral em D+30 (ou antecipado) — risco de crédito é do emissor",
      "Juros são definidos pelo emissor e cobrados do portador na fatura",
      "Disponibilidade depende de acordo entre emissor e bandeira, não do merchant",
    ],
    technicalRequirements: [
      "Mensageria ISO 8583 com campo DE48 indicando tipo de parcelamento (issuer installment)",
      "Consulta de elegibilidade de parcelado emissor via API do adquirente antes da autorização",
      "Exibição de opções de parcelamento com CET (Custo Efetivo Total) ao portador no checkout",
      "Suporte a cancelamento parcial de parcelas futuras",
    ],
    payloadExample: `{
  "type": "authorization",
  "amount": 120000,
  "currency": "BRL",
  "installments": {
    "type": "issuer",
    "count": 12,
    "interest_rate_monthly": 1.99,
    "total_with_interest": 147360,
    "installment_amount": 12280
  },
  "card": { "token": "tok_card_001" },
  "merchant": {
    "mcc": "5411",
    "receives_full_amount": true
  }
}`,
  },
  {
    id: "parcelado-lojista",
    name: "Parcelado Lojista",
    description:
      "Modalidade de parcelamento sem juros onde o merchant assume o custo financeiro, recebendo o valor em parcelas ao longo dos meses enquanto o portador paga sem juros na fatura do cartão.",
    layer: "processing",
    category: "Parcelamento",
    complexity: "medium",
    actors: ["Merchant", "Adquirente", "Emissor", "Portador"],
    metricsImpacted: ["Ticket Médio", "Taxa de Conversão", "Cash Flow do Merchant"],
    aliases: ["Parcelado Sem Juros", "Merchant Installments", "Parcelamento pelo Lojista"],
    dependencies: ["real-time-auth", "settlement-cycles"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Merchant recebe cada parcela em D+30 do vencimento de cada prestação",
      "MDR geralmente maior para transações parceladas (ex: 2.5% vs 1.8% à vista)",
      "Máximo de 12x sem juros na maioria dos adquirentes brasileiros",
    ],
    technicalRequirements: [
      "API de autorização com campo installments indicando quantidade e tipo (merchant)",
      "Cálculo automático de MDR diferenciado por número de parcelas",
      "Geração de agenda de recebíveis com data de pagamento de cada parcela",
      "Suporte a antecipação de recebíveis das parcelas futuras",
    ],
    payloadExample: `{
  "type": "authorization",
  "amount": 60000,
  "currency": "BRL",
  "installments": {
    "type": "merchant",
    "count": 6,
    "interest_rate": 0,
    "installment_amount": 10000
  },
  "card": { "token": "tok_card_002" },
  "settlement_schedule": [
    { "installment": 1, "amount": 10000, "settlement_date": "2026-04-20" },
    { "installment": 2, "amount": 10000, "settlement_date": "2026-05-20" },
    { "installment": 3, "amount": 10000, "settlement_date": "2026-06-20" },
    { "installment": 4, "amount": 10000, "settlement_date": "2026-07-20" },
    { "installment": 5, "amount": 10000, "settlement_date": "2026-08-20" },
    { "installment": 6, "amount": 10000, "settlement_date": "2026-09-20" }
  ]
}`,
  },
  {
    id: "bin-attack-prevention",
    name: "BIN Attack Prevention",
    description:
      "Mecanismos de detecção e prevenção de ataques de enumeração de BIN/PAN, onde fraudadores testam sequências de números de cartão para identificar cartões válidos usando transações de baixo valor.",
    layer: "processing",
    category: "Risco",
    complexity: "high",
    actors: ["Motor de Risco", "Adquirente", "Bandeira", "Merchant"],
    metricsImpacted: ["Taxa de Fraude", "Custo de Processamento", "Taxa de Autorização"],
    aliases: ["BIN Attack", "Card Testing", "Teste de Cartão", "Enumeration Attack"],
    dependencies: ["velocity-checks", "fraud-scoring"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p2"],
    businessRules: [
      "Bloqueio automático de IP/device com > 10 tentativas falhadas em 5 minutos",
      "Rate limiting por BIN range: máximo 3 autorizações do mesmo BIN/6 dígitos por minuto por merchant",
      "Bandeiras aplicam multas a merchants com taxa de tentativas inválidas > 15%",
    ],
    technicalRequirements: [
      "Rate limiter por BIN range, IP, device fingerprint e merchant com janela deslizante",
      "CAPTCHA ou challenge progressivo após N tentativas falhadas",
      "Alertas em tempo real para equipe de fraude quando pattern de BIN attack é detectado",
      "Integração com feeds de threat intelligence para BIN ranges comprometidos",
    ],
    payloadExample: `{
  "type": "bin_attack_alert",
  "alert_id": "alert_ba_001",
  "detection": {
    "pattern": "sequential_bin_testing",
    "bin_range": "453216**",
    "attempts_last_5min": 47,
    "declined_count": 45,
    "unique_pans_tested": 47,
    "source_ip": "203.0.113.50",
    "device_fingerprint": "fp_suspect_001",
    "merchant_id": "merch_targeted_001"
  },
  "action_taken": {
    "ip_blocked": true,
    "merchant_notified": true,
    "bin_range_rate_limited": true
  }
}`,
  },
  {
    id: "device-fingerprinting",
    name: "Device Fingerprinting",
    description:
      "Coleta e análise de atributos únicos do dispositivo do comprador (browser, OS, hardware, configurações) para criar uma identidade digital que auxilia na detecção de fraude e autenticação silenciosa.",
    layer: "processing",
    category: "Risco",
    complexity: "medium",
    actors: ["Motor de Risco", "Provedor de Fingerprint", "Merchant", "Cliente"],
    metricsImpacted: ["Taxa de Fraude", "Taxa de Falso Positivo", "Qualidade da Avaliação de Risco"],
    aliases: ["Fingerprint de Dispositivo", "Device ID", "Browser Fingerprint"],
    dependencies: ["fraud-scoring"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p2"],
    businessRules: [
      "Fingerprint deve ser coletado no client-side via JavaScript/SDK antes do submit do pagamento",
      "Mesmo dispositivo deve gerar fingerprint consistente entre sessões (persistência)",
      "Dados de fingerprint são input para o modelo de fraud scoring (não decisório isolado)",
    ],
    technicalRequirements: [
      "SDK JavaScript/mobile para coleta de atributos de dispositivo (canvas, WebGL, fonts, plugins)",
      "API server-side para correlação de fingerprint com histórico de transações",
      "Banco de dados de device reputation com scoring de risco por device_id",
      "Compliance com LGPD/GDPR para coleta e armazenamento de dados de dispositivo",
    ],
    payloadExample: `{
  "device_fingerprint": {
    "device_id": "dfp_a1b2c3d4e5",
    "session_id": "sess_xyz789",
    "attributes": {
      "browser": "Chrome 120",
      "os": "Windows 11",
      "screen_resolution": "1920x1080",
      "timezone": "America/Sao_Paulo",
      "language": "pt-BR",
      "canvas_hash": "abc123def456",
      "webgl_hash": "789ghi012jkl"
    },
    "risk_signals": {
      "is_bot": false,
      "is_vpn": false,
      "is_emulator": false,
      "device_age_days": 180,
      "transactions_last_30d": 12
    }
  }
}`,
  },
  {
    id: "avs",
    name: "Address Verification System (AVS)",
    description:
      "Sistema que verifica o endereço de cobrança informado pelo portador contra o endereço registrado no emissor, fornecendo um código de match que auxilia na decisão de autorização e prevenção de fraude em transações CNP.",
    layer: "processing",
    category: "Risco",
    complexity: "low",
    actors: ["Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Taxa de Fraude", "Taxa de Autorização", "Taxa de Falso Positivo"],
    aliases: ["AVS", "Verificação de Endereço", "Address Verification"],
    dependencies: ["real-time-auth"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p2"],
    businessRules: [
      "AVS é mais efetivo nos EUA/UK/Canadá — suporte limitado na América Latina",
      "Resultado AVS é informativo (não bloqueia transação automaticamente)",
      "Merchant define regras de aceite/recusa baseadas nos códigos AVS retornados",
    ],
    technicalRequirements: [
      "Campos de endereço (street, zip) incluídos na mensagem de autorização ISO 8583 (DE43, DE60)",
      "Mapeamento de response codes AVS por bandeira (Y, N, A, Z, U, etc.)",
      "Regras configuráveis por merchant para ação baseada no resultado AVS",
      "Dashboard de análise de match rates AVS por região e segmento",
    ],
    payloadExample: `{
  "type": "authorization",
  "amount": 25000,
  "currency": "BRL",
  "billing_address": {
    "street": "Rua Augusta 1234",
    "zip": "01305-100",
    "city": "São Paulo",
    "state": "SP",
    "country": "BR"
  },
  "avs_result": {
    "code": "Y",
    "description": "Street and ZIP match",
    "street_match": true,
    "zip_match": true
  }
}`,
  },
  {
    id: "cvv-verification",
    name: "Card Verification Value (CVV)",
    description:
      "Verificação do código de segurança de 3 ou 4 dígitos impresso no cartão físico, confirmando que o portador tem posse do cartão durante transações sem presença física (CNP).",
    layer: "processing",
    category: "Risco",
    complexity: "low",
    actors: ["Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Taxa de Fraude", "Taxa de Autorização"],
    aliases: ["CVV", "CVV2", "CVC", "CVC2", "Código de Segurança", "Security Code"],
    dependencies: ["real-time-auth"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p2"],
    businessRules: [
      "CVV não pode ser armazenado após a autorização (PCI DSS requirement 3.2)",
      "CVV obrigatório para transações CIT (Cardholder Initiated Transaction) no e-commerce",
      "Para transações recorrentes (MIT), CVV é enviado apenas na primeira transação",
    ],
    technicalRequirements: [
      "Campo CVV enviado na autorização mas NUNCA persistido em banco de dados ou logs",
      "Mascaramento automático de CVV em qualquer log ou trace de transação",
      "Mapeamento de CVV response codes (M=match, N=no match, P=not processed, U=unknown)",
      "Validação client-side de formato (3 dígitos para Visa/MC, 4 para Amex)",
    ],
    payloadExample: `{
  "type": "authorization",
  "amount": 15000,
  "card": {
    "token": "tok_card_003",
    "cvv": "***",
    "cvv_provided": true
  },
  "cvv_result": {
    "code": "M",
    "description": "CVV Match",
    "is_match": true
  }
}`,
  },
  {
    id: "pix-integration",
    name: "Pix Integration",
    description:
      "Integração completa com o ecossistema Pix do Banco Central do Brasil, incluindo geração de QR codes (estático e dinâmico), Pix Copia e Cola, webhooks de confirmação e reconciliação em tempo real.",
    layer: "experience",
    category: "Meios de Pagamento",
    complexity: "high",
    actors: ["Merchant", "PSP", "Banco Central (SPI)", "Banco do Pagador"],
    metricsImpacted: ["Conversão no Checkout", "Custo de Processamento", "Velocidade de Liquidação"],
    aliases: ["Pix", "Pix QR Code", "Pix Copia e Cola", "Pagamento Instantâneo"],
    dependencies: ["webhooks"],
    relatedFlows: ["pix"],
    relatedProblems: [],
    businessRules: [
      "QR Code dinâmico expira em 30 minutos (configurável pelo merchant)",
      "Liquidação em tempo real (T+0) via SPI do Banco Central",
      "Pix tem custo zero para pessoa física e custo reduzido para merchants (0.01-0.5%)",
    ],
    technicalRequirements: [
      "Integração com API Pix do PSP para geração de cobranças (QR estático e dinâmico)",
      "Webhook endpoint para receber confirmação de pagamento em tempo real",
      "Geração de QR Code EMV conforme especificação do Banco Central (BR Code)",
      "Suporte a devolução Pix (parcial e total) com prazo de até 90 dias",
    ],
    payloadExample: `{
  "type": "pix_charge",
  "merchant_id": "merch_001",
  "amount": 15990,
  "currency": "BRL",
  "expiration_seconds": 1800,
  "payer": {
    "cpf": "***.***.***-00",
    "name": "João Silva"
  },
  "response": {
    "charge_id": "pix_ch_abc123",
    "qr_code_base64": "data:image/png;base64,iVBOR...",
    "qr_code_text": "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6...",
    "status": "active",
    "expires_at": "2026-03-21T15:30:00Z"
  }
}`,
  },
  {
    id: "pix-parcelado",
    name: "Pix Parcelado",
    description:
      "Modalidade que combina Pix com crédito, permitindo ao consumidor pagar via Pix em parcelas com financiamento do PSP ou instituição financeira, oferecendo a conveniência do Pix com a flexibilidade do parcelamento.",
    layer: "experience",
    category: "Meios de Pagamento",
    complexity: "high",
    actors: ["Merchant", "PSP", "Instituição Financeira", "Consumidor"],
    metricsImpacted: ["Ticket Médio", "Taxa de Conversão", "Custo de Processamento"],
    aliases: ["Pix Parcelado", "Pix Crediário", "Pix a Prazo", "Pix Credit"],
    dependencies: ["pix-integration"],
    relatedFlows: ["pix"],
    relatedProblems: [],
    businessRules: [
      "Merchant recebe valor integral via Pix em T+0 — risco de crédito é do financiador",
      "Parcelamento de 2x a 24x com juros definidos pela instituição financeira",
      "Aprovação de crédito em tempo real baseada em score do consumidor",
    ],
    technicalRequirements: [
      "API de análise de crédito em tempo real com resposta < 3 segundos",
      "Integração com bureaus de crédito (Serasa, SPC) para scoring",
      "Fluxo de checkout com exibição de parcelas e CET antes da confirmação",
      "Gestão de cobrança de parcelas via Pix agendado ou boleto de fallback",
    ],
    payloadExample: `{
  "type": "pix_installment",
  "amount": 200000,
  "currency": "BRL",
  "installments": {
    "count": 10,
    "interest_rate_monthly": 2.49,
    "installment_amount": 22290,
    "total_with_interest": 222900,
    "cet_annual": 34.5
  },
  "payer": {
    "cpf": "***.***.***-00",
    "credit_score": "approved"
  },
  "merchant_settlement": {
    "amount": 200000,
    "method": "pix",
    "settlement_date": "2026-03-21T14:00:00Z"
  }
}`,
  },
  {
    id: "boleto-bancario",
    name: "Boleto Bancário",
    description:
      "Emissão e gestão de boletos bancários registrados, método de pagamento offline amplamente usado no Brasil, com registro obrigatório na CIP, suporte a juros/multa por atraso e conciliação automática.",
    layer: "experience",
    category: "Meios de Pagamento",
    complexity: "medium",
    actors: ["Merchant", "Banco Emissor do Boleto", "CIP", "Consumidor"],
    metricsImpacted: ["Cobertura de Mercado", "Taxa de Conversão", "Taxa de Pagamento de Boleto"],
    aliases: ["Boleto", "Boleto Registrado", "Bank Slip", "Brazilian Boleto"],
    dependencies: ["webhooks", "settlement-reconciliation"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Boletos devem ser registrados na CIP (Nova Plataforma de Cobrança) antes da emissão",
      "Vencimento mínimo D+1, máximo D+180",
      "Juros e multa por atraso configuráveis (multa máxima 2%, juros máximo 1% ao mês por lei)",
    ],
    technicalRequirements: [
      "Integração com API do banco emissor para registro e emissão de boletos",
      "Geração de linha digitável e código de barras conforme padrão FEBRABAN",
      "Webhook para receber confirmação de pagamento (D+1 a D+3 após pagamento)",
      "Suporte a boleto híbrido (boleto + Pix QR Code no mesmo documento)",
    ],
    payloadExample: `{
  "type": "boleto",
  "amount": 35000,
  "currency": "BRL",
  "due_date": "2026-03-28",
  "payer": {
    "name": "Maria Santos",
    "cpf": "***.***.***-00",
    "address": "Rua Example 123, São Paulo - SP"
  },
  "fine": { "type": "percentage", "value": 2.0, "days_after_due": 1 },
  "interest": { "type": "monthly", "value": 1.0 },
  "response": {
    "boleto_id": "bol_abc123",
    "barcode": "23793.38128 60000.000003 00000.000405 1 88260000035000",
    "digitable_line": "23793.38128 60000.000003 00000.000405 1 88260000035000",
    "pdf_url": "https://api.example.com/boletos/bol_abc123.pdf",
    "pix_qr_code": "00020126580014br.gov.bcb.pix..."
  }
}`,
  },
  {
    id: "digital-wallets",
    name: "Apple Pay / Google Pay",
    description:
      "Integração com carteiras digitais Apple Pay e Google Pay que permitem pagamento tokenizado via NFC (presencial) ou em-app/web, com autenticação biométrica do dispositivo e network tokens para maior segurança.",
    layer: "experience",
    category: "Meios de Pagamento",
    complexity: "high",
    actors: ["Merchant", "Apple/Google", "Token Service Provider", "Emissor", "Adquirente"],
    metricsImpacted: ["Conversão no Checkout", "Taxa de Autorização", "Taxa de Fraude"],
    aliases: ["Apple Pay", "Google Pay", "Wallets Digitais", "Digital Wallets", "Mobile Wallets"],
    dependencies: ["network-tokenization", "3d-secure"],
    relatedFlows: ["wallet-payment", "card-payment"],
    relatedProblems: [],
    businessRules: [
      "Merchant deve ser registrado com Apple/Google e possuir certificados de criptografia válidos",
      "Network token + criptograma por transação substituem PAN real — taxas de auth tipicamente 2-5% maiores",
      "Apple Pay requer domínio verificado e certificado .well-known/apple-developer-merchantid-domain-association",
    ],
    technicalRequirements: [
      "Certificados de merchant identity para Apple Pay (payment processing + merchant identity)",
      "Integração com Google Pay API (PaymentsClient) e Apple Pay JS SDK",
      "Decodificação do payment token (PKCS#7 para Apple, JWE para Google) no backend",
      "Suporte a modos de pagamento: CRYPTOGRAM_3DS (network token) e PAN_ONLY (DPAN)",
    ],
    payloadExample: `{
  "type": "wallet_payment",
  "wallet": "apple_pay",
  "amount": 8990,
  "currency": "BRL",
  "payment_data": {
    "token_type": "CRYPTOGRAM_3DS",
    "network_token": "4000000000001234",
    "cryptogram": "AgAAAAAABk4DWZ4C28yUQAAAAA==",
    "eci": "07",
    "token_expiry": "2812"
  },
  "device_info": {
    "device_manufacturer": "Apple",
    "device_model": "iPhone 15",
    "authentication_method": "biometric"
  }
}`,
  },
  {
    id: "bnpl",
    name: "BNPL (Buy Now Pay Later)",
    description:
      "Modelo de crédito no ponto de venda que permite ao consumidor dividir o pagamento em parcelas sem cartão de crédito, com análise de crédito instantânea e experiência integrada ao checkout do merchant.",
    layer: "experience",
    category: "Meios de Pagamento",
    complexity: "high",
    actors: ["Merchant", "Provedor BNPL", "Consumidor", "Bureau de Crédito"],
    metricsImpacted: ["Ticket Médio", "Taxa de Conversão", "Cobertura de Mercado"],
    aliases: ["BNPL", "Buy Now Pay Later", "Compre Agora Pague Depois", "Crediário Digital"],
    dependencies: ["webhooks", "checkout-ui"],
    relatedFlows: ["bnpl"],
    relatedProblems: [],
    businessRules: [
      "Merchant recebe valor integral (menos fee) em D+1 a D+15 — risco de crédito é do provedor BNPL",
      "Análise de crédito em < 3 segundos no checkout",
      "Parcelas de 2x a 24x com ou sem juros dependendo do provedor e score do consumidor",
    ],
    technicalRequirements: [
      "SDK/API do provedor BNPL integrado ao checkout flow do merchant",
      "Webhook para confirmação de aprovação de crédito e pagamento",
      "Redirect flow ou widget inline para processo de aprovação do consumidor",
      "API de cancelamento/refund para ordens BNPL",
    ],
    payloadExample: `{
  "type": "bnpl_order",
  "provider": "exemplo_bnpl",
  "amount": 80000,
  "currency": "BRL",
  "installments": {
    "count": 4,
    "interest_free": true,
    "installment_amount": 20000
  },
  "consumer": {
    "cpf": "***.***.***-00",
    "email": "consumer@example.com",
    "credit_decision": "approved",
    "credit_limit_available": 150000
  },
  "merchant_settlement": {
    "amount": 76000,
    "fee_pct": 5.0,
    "settlement_date": "2026-03-22"
  }
}`,
  },
  {
    id: "open-finance",
    name: "Open Banking / Open Finance",
    description:
      "Pagamentos iniciados via Open Finance que permitem transferência direta da conta bancária do pagador para o recebedor, usando APIs padronizadas pelo Banco Central, sem necessidade de cartão de crédito.",
    layer: "experience",
    category: "Meios de Pagamento",
    complexity: "critical",
    actors: ["Merchant", "Iniciador de Pagamento (ITP)", "Banco do Pagador", "Banco Central"],
    metricsImpacted: ["Custo de Processamento", "Taxa de Conversão", "Cobertura de Mercado"],
    aliases: ["Open Banking", "Open Finance", "ITP", "Payment Initiation", "Iniciação de Pagamento"],
    dependencies: ["webhooks"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Consentimento explícito do pagador obrigatório via app do banco (redirect flow)",
      "ITP deve ser autorizado pelo Banco Central do Brasil",
      "Pagamento via Pix é o rail mais comum para Open Finance payments no Brasil",
    ],
    technicalRequirements: [
      "Certificação como ITP (Iniciador de Transação de Pagamento) junto ao BCB",
      "Implementação de OAuth 2.0 FAPI (Financial-grade API) para autenticação",
      "Redirect flow seguro para consentimento no app do banco do pagador",
      "API de status polling e webhook para confirmação de pagamento",
      "Compliance com padrões de segurança do Open Finance Brasil (mTLS, JWS)",
    ],
    payloadExample: `{
  "type": "open_finance_payment",
  "initiation": {
    "itp_id": "itp_licensed_001",
    "amount": 50000,
    "currency": "BRL",
    "creditor": {
      "name": "Loja Example",
      "cpf_cnpj": "12.345.678/0001-90",
      "pix_key": "loja@example.com"
    }
  },
  "consent": {
    "consent_id": "urn:amazingbank:consent:abc123",
    "status": "AUTHORISED",
    "debtor_bank": "Banco Amazing",
    "authorization_url": "https://amazingbank.com/consent/abc123"
  },
  "payment": {
    "payment_id": "pay_of_001",
    "status": "COMPLETED",
    "end_to_end_id": "E1234567820260321143000ABC"
  }
}`,
  },
  {
    id: "scd",
    name: "SCD (Sociedade de Crédito Direto)",
    description:
      "Instituição financeira autorizada pelo Banco Central para realizar operações de crédito exclusivamente com recursos próprios por meio de plataforma eletrônica, base regulatória para fintechs de crédito no Brasil.",
    layer: "banking",
    category: "Regulatório",
    complexity: "critical",
    actors: ["SCD", "Banco Central", "Tomador de Crédito", "Registradora"],
    metricsImpacted: ["Volume de Crédito", "Inadimplência", "Compliance Regulatório"],
    aliases: ["SCD", "Sociedade de Crédito Direto", "Direct Credit Society", "Fintech de Crédito"],
    dependencies: ["kyc-verification"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "SCD só pode operar com capital próprio (vedado captar recursos do público)",
      "Pode vender créditos originados a FIDCs, securitizadoras e instituições financeiras",
      "Regulamentada pela Resolução BCB 5.050/2022",
    ],
    technicalRequirements: [
      "Sistema de originação de crédito com análise de risco e scoring proprietário",
      "Integração com SCR (Sistema de Informações de Crédito) do Banco Central",
      "Motor de precificação de crédito com taxa de juros risk-adjusted",
      "Relatórios regulatórios mensais para o Banco Central (DLO, SCR)",
    ],
    payloadExample: `{
  "type": "credit_origination",
  "scd_id": "scd_fintech_001",
  "borrower": {
    "cpf": "***.***.***-00",
    "name": "Carlos Souza",
    "credit_score": 720,
    "scr_consultation": "clean"
  },
  "loan": {
    "amount": 500000,
    "currency": "BRL",
    "interest_rate_monthly": 3.5,
    "cet_annual": 51.1,
    "term_months": 12,
    "installment_amount": 51500,
    "funding_source": "own_capital"
  },
  "status": "approved",
  "disbursement_method": "pix"
}`,
  },
  {
    id: "fidc",
    name: "FIDC (Fundo de Investimento em Direitos Creditórios)",
    description:
      "Veículo de securitização que adquire direitos creditórios (recebíveis de cartão, duplicatas, empréstimos) de originadores, transformando-os em cotas negociáveis no mercado de capitais para financiar operações de crédito.",
    layer: "banking",
    category: "Securitização",
    complexity: "critical",
    actors: ["FIDC", "Gestor", "Custodiante", "Originador", "CVM", "Cotistas"],
    metricsImpacted: ["Custo de Funding", "Volume de Crédito", "Spread de Securitização"],
    aliases: ["FIDC", "Securitização", "Receivables Fund", "Credit Rights Fund"],
    dependencies: ["antecipacao-recebiveis"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Cotas sênior têm preferência na amortização; cotas subordinadas absorvem primeiras perdas",
      "Razão mínima de subordinação definida no regulamento do fundo (tipicamente 10-30%)",
      "Regulamentado pela CVM (Resolução 175) com auditoria independente obrigatória",
    ],
    technicalRequirements: [
      "Motor de cessão de créditos com validação de elegibilidade e lastro",
      "Integração com registradoras (CIP, TAG) para registro de cessão de recebíveis",
      "Sistema de waterfall de pagamentos para distribuição entre cotas sênior e subordinada",
      "Relatórios regulatórios CVM e marcação a mercado diária das cotas",
      "API de consulta de performance do pool (inadimplência, prepagamento, aging)",
    ],
    payloadExample: `{
  "type": "fidc_structure",
  "fund": {
    "name": "FIDC Pagamentos Alpha",
    "cnpj": "12.345.678/0001-90",
    "administrator": "Banco Custodiante XYZ",
    "manager": "Gestora Alpha"
  },
  "pool": {
    "total_receivables": 50000000,
    "originator": "SCD Fintech 001",
    "asset_type": "card_receivables",
    "avg_term_days": 45,
    "default_rate_pct": 2.1
  },
  "tranches": {
    "senior": { "amount": 40000000, "yield_target": "CDI + 2.5%", "rating": "AAA" },
    "subordinated": { "amount": 10000000, "yield_target": "CDI + 8.0%", "rating": "BB" }
  },
  "subordination_ratio": 20.0
}`,
  },
  {
    id: "credit-as-a-service",
    name: "Credit as a Service",
    description:
      "Modelo de crédito white-label onde uma instituição financeira regulada (SCD/SEP) disponibiliza sua infraestrutura de crédito via API para que plataformas não-financeiras ofereçam produtos de crédito a seus clientes.",
    layer: "banking",
    category: "Embedded Finance",
    complexity: "critical",
    actors: ["Plataforma", "SCD/SEP", "Tomador de Crédito", "Banco Central"],
    metricsImpacted: ["Volume de Crédito", "Receita da Plataforma", "Inadimplência"],
    aliases: ["CaaS", "Credit as a Service", "Lending as a Service", "White-Label Credit"],
    dependencies: ["scd", "kyc-verification"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "A SCD/SEP é a originadora regulada do crédito — a plataforma atua como correspondente",
      "Plataforma recebe comissão (revenue share) por cada crédito originado",
      "Compliance e risco de crédito são responsabilidade da instituição financeira regulada",
    ],
    technicalRequirements: [
      "API de originação de crédito com white-label (branding da plataforma)",
      "Motor de scoring de crédito integrado com bureaus e dados alternativos",
      "SDK para embedding de fluxo de crédito no app/site da plataforma",
      "Webhooks para status de aprovação, desembolso e cobrança",
    ],
    payloadExample: `{
  "type": "caas_loan_request",
  "platform": {
    "id": "platform_ecommerce_001",
    "name": "Marketplace Example",
    "role": "correspondent"
  },
  "regulated_entity": {
    "type": "SCD",
    "name": "Fintech Credit Corp",
    "bcb_authorization": "SCD-001"
  },
  "loan": {
    "amount": 300000,
    "purpose": "working_capital",
    "term_months": 6,
    "interest_rate_monthly": 2.99,
    "scoring_data_sources": ["serasa", "scr", "platform_history"]
  },
  "status": "approved",
  "revenue_share": {
    "platform_pct": 15,
    "amount": 8100
  }
}`,
  },
  {
    id: "embedded-finance",
    name: "Embedded Finance",
    description:
      "Integração de serviços financeiros (pagamentos, crédito, seguros, banking) diretamente na jornada de plataformas não-financeiras, oferecendo experiência seamless ao usuário final sem redirecionamento para instituição financeira.",
    layer: "experience",
    category: "Embedded Finance",
    complexity: "high",
    actors: ["Plataforma", "Provedor BaaS", "Instituição Financeira", "Usuário Final"],
    metricsImpacted: ["Receita da Plataforma", "Conversão", "Engajamento", "LTV"],
    aliases: ["Finanças Embarcadas", "Embedded Finance", "Embedded Payments", "BaaS"],
    dependencies: ["credit-as-a-service", "pix-integration"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Plataforma atua como distribuidor — produto financeiro é da instituição regulada",
      "Transparência obrigatória sobre quem é o emissor do produto financeiro (LGPD/BCB)",
      "Revenue share entre plataforma e instituição financeira por produto distribuído",
    ],
    technicalRequirements: [
      "APIs de BaaS (Banking as a Service) para contas, pagamentos e crédito",
      "SDK white-label para integração de fluxos financeiros no app da plataforma",
      "KYC/KYB compartilhado entre plataforma e instituição financeira",
      "Dashboard de gestão para a plataforma monitorar métricas financeiras",
    ],
    payloadExample: `{
  "type": "embedded_finance_products",
  "platform": "marketplace_example",
  "user_id": "user_abc123",
  "available_products": [
    {
      "type": "digital_account",
      "provider": "BaaS Provider Alpha",
      "status": "active",
      "balance": 15000
    },
    {
      "type": "credit_line",
      "provider": "SCD Fintech Corp",
      "limit": 500000,
      "available": 350000,
      "interest_rate": 2.49
    },
    {
      "type": "insurance",
      "provider": "Seguradora Beta",
      "coverage": "purchase_protection",
      "premium_monthly": 990
    }
  ]
}`,
  },
  {
    id: "multi-acquirer",
    name: "Multi-acquirer Strategy",
    description:
      "Estratégia de roteamento que distribui transações entre múltiplos adquirentes para otimizar taxas de aprovação, reduzir custos, aumentar resiliência e negociar melhores condições comerciais.",
    layer: "orchestration",
    category: "Otimização",
    complexity: "high",
    actors: ["Orquestrador de Pagamento", "Adquirente A", "Adquirente B", "Merchant"],
    metricsImpacted: ["Taxa de Autorização", "Custo de Processamento", "Disponibilidade"],
    aliases: ["Multi-Acquirer", "Multi-Adquirente", "Acquirer Diversification"],
    dependencies: ["smart-routing", "bin-lookup"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p1", "p4"],
    businessRules: [
      "Mínimo de 2 adquirentes ativos para garantir failover",
      "Distribuição de volume negociada com cada adquirente para manter SLA de pricing",
      "Monitoramento contínuo de performance por adquirente (success rate, latência, custo)",
    ],
    technicalRequirements: [
      "Integração padronizada com múltiplos adquirentes via abstraction layer",
      "Dashboard comparativo de performance por adquirente em tempo real",
      "Configuração de regras de roteamento por BIN, valor, MCC e região",
      "Health-check automático com circuit breaker por adquirente",
    ],
    payloadExample: `{
  "type": "routing_config",
  "merchant_id": "merch_001",
  "acquirers": [
    {
      "id": "stone",
      "weight": 60,
      "success_rate_7d": 97.2,
      "avg_cost_bps": 185,
      "status": "active"
    },
    {
      "id": "cielo",
      "weight": 30,
      "success_rate_7d": 96.1,
      "avg_cost_bps": 195,
      "status": "active"
    },
    {
      "id": "rede",
      "weight": 10,
      "success_rate_7d": 95.5,
      "avg_cost_bps": 175,
      "status": "active"
    }
  ],
  "failover_enabled": true,
  "max_failover_attempts": 2
}`,
  },
  {
    id: "payment-orchestration",
    name: "Payment Orchestration Platform",
    description:
      "Plataforma centralizada que abstrai a complexidade de múltiplos provedores de pagamento, gerenciando roteamento, retentativas, reconciliação e reporting em uma única camada de integração.",
    layer: "orchestration",
    category: "Plataforma",
    complexity: "critical",
    actors: ["Merchant", "Orquestrador", "Adquirentes", "PSPs", "APMs"],
    metricsImpacted: ["Taxa de Autorização", "Custo de Processamento", "Tempo de Integração"],
    aliases: ["Payment Orchestration", "Orquestração de Pagamentos", "POP", "Payment Hub"],
    dependencies: ["smart-routing", "retry-logic", "cascading", "multi-acquirer"],
    relatedFlows: ["card-payment", "pix", "wallet-payment"],
    relatedProblems: ["p1", "p4"],
    businessRules: [
      "Uma única integração de API para o merchant acessar todos os provedores",
      "Roteamento inteligente, retentativa e cascading são features nativas da plataforma",
      "Reconciliação unificada de todos os provedores em um único dashboard",
    ],
    technicalRequirements: [
      "API gateway unificado com abstração de payloads por provedor",
      "Engine de regras de roteamento com hot-reload de configurações",
      "Sistema de filas para retry e cascading com garantia de idempotência",
      "Data warehouse para analytics cross-provider e reconciliação",
    ],
    payloadExample: `{
  "type": "orchestrated_payment",
  "merchant_id": "merch_001",
  "amount": 25000,
  "currency": "BRL",
  "payment_method": "credit_card",
  "card": { "token": "tok_vault_abc" },
  "orchestration": {
    "routing_strategy": "cost_optimized",
    "retry_enabled": true,
    "max_retries": 3,
    "cascading_enabled": true,
    "providers_attempted": [
      { "provider": "stone", "status": "declined", "code": "51" },
      { "provider": "cielo", "status": "approved", "code": "00" }
    ],
    "final_status": "approved",
    "total_latency_ms": 1850
  }
}`,
  },
  {
    id: "soft-descriptor",
    name: "Soft Descriptor",
    description:
      "Personalização do texto que aparece no extrato do cartão do portador, permitindo ao merchant incluir informações legíveis como nome da loja, pedido ou telefone de contato para reduzir chargebacks por não reconhecimento.",
    layer: "processing",
    category: "Experiência",
    complexity: "low",
    actors: ["Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Taxa de Chargeback", "Reconhecimento de Compra", "Satisfação do Cliente"],
    aliases: ["Soft Descriptor", "Descritor Flexível", "Statement Descriptor", "Descritor de Fatura"],
    dependencies: [],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Máximo de 22 caracteres para soft descriptor (13 para Visa, 22 para MC)",
      "Deve incluir nome reconhecível do merchant ou referência do pedido",
      "Caracteres especiais limitados: apenas alfanuméricos, espaços e asterisco",
    ],
    technicalRequirements: [
      "Campo de soft_descriptor na API de autorização com validação de comprimento",
      "Configuração de descriptor padrão por merchant com override por transação",
      "Concatenação automática: prefix (merchant) + suffix (referência) = descriptor final",
    ],
    payloadExample: `{
  "type": "authorization",
  "amount": 12000,
  "soft_descriptor": {
    "prefix": "LOJA EX",
    "suffix": "PED12345",
    "full_descriptor": "LOJA EX*PED12345",
    "phone": "11999999999"
  }
}`,
  },
  {
    id: "surcharging",
    name: "Surcharging",
    description:
      "Prática de aplicar uma sobretaxa ao valor da transação quando o cliente escolhe um método de pagamento de maior custo (ex: cartão de crédito), repassando parte do custo de processamento ao consumidor.",
    layer: "experience",
    category: "Pricing",
    complexity: "medium",
    actors: ["Merchant", "Consumidor", "Regulador"],
    metricsImpacted: ["Mix de Meios de Pagamento", "Custo de Processamento", "Conversão no Checkout"],
    aliases: ["Surcharge", "Sobretaxa", "Convenience Fee", "Taxa de Conveniência"],
    dependencies: ["checkout-ui", "payment-method-selection"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Regulamentação varia por país: proibido na UE, permitido com limites nos EUA/Austrália",
      "No Brasil, diferenciação de preço por método de pagamento é permitida (Lei 13.455/2017)",
      "Surcharge não pode exceder o custo efetivo de aceitação do método de pagamento",
    ],
    technicalRequirements: [
      "Motor de cálculo de surcharge por método de pagamento e região",
      "Exibição transparente do surcharge no checkout antes da confirmação",
      "Validação regulatória por jurisdição para aplicação automática de regras",
      "Reporting de surcharges aplicados para compliance e contabilidade",
    ],
    payloadExample: `{
  "type": "payment_with_surcharge",
  "base_amount": 10000,
  "payment_method": "credit_card",
  "surcharge": {
    "rate_pct": 2.5,
    "amount": 250,
    "reason": "credit_card_processing_fee",
    "regulation_check": {
      "country": "BR",
      "allowed": true,
      "law": "Lei 13.455/2017"
    }
  },
  "total_amount": 10250,
  "disclosure": "Taxa de 2.5% aplicada para pagamento com cartão de crédito"
}`,
  },
  {
    id: "level-2-3-data",
    name: "Level 2/3 Data",
    description:
      "Envio de dados enriquecidos de transação (informações fiscais, line-item detail) junto com a autorização para qualificar em faixas de interchange mais baixas, especialmente relevante para transações B2B e government.",
    layer: "processing",
    category: "Otimização de Custo",
    complexity: "medium",
    actors: ["Merchant", "Adquirente", "Bandeira"],
    metricsImpacted: ["Custo de Processamento", "Taxas de Interchange", "Margem Líquida"],
    aliases: ["Level II/III", "Dados Nível 2/3", "Enhanced Data", "L2/L3 Data"],
    dependencies: ["interchange-optimization", "bin-lookup"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Level 2: tax amount, customer reference, merchant ZIP — economia de ~0.1-0.3%",
      "Level 3: line-item detail (description, quantity, unit cost, commodity code) — economia de ~0.3-0.5%",
      "Apenas transações com cartões comerciais (business/corporate/purchasing) se qualificam",
    ],
    technicalRequirements: [
      "API de autorização com campos adicionais para Level 2 e Level 3 data",
      "Detecção automática de cartões comerciais via BIN lookup para oferecer L2/L3",
      "Validação de campos obrigatórios por bandeira antes do envio",
      "Relatório de economia obtida com L2/L3 qualification vs. standard interchange",
    ],
    payloadExample: `{
  "type": "authorization",
  "amount": 250000,
  "level2_data": {
    "tax_amount": 47500,
    "customer_reference": "PO-2026-001234",
    "merchant_zip": "01305-100"
  },
  "level3_data": {
    "line_items": [
      {
        "description": "Licença Software Enterprise",
        "commodity_code": "81112200",
        "quantity": 10,
        "unit_cost": 20000,
        "total": 200000,
        "tax_amount": 38000
      },
      {
        "description": "Suporte Técnico Premium",
        "commodity_code": "81111800",
        "quantity": 1,
        "unit_cost": 50000,
        "total": 50000,
        "tax_amount": 9500
      }
    ]
  }
}`,
  },
  {
    id: "payment-links",
    name: "Payment Links",
    description:
      "Geração de links de pagamento compartilháveis via WhatsApp, email ou redes sociais, permitindo que merchants sem integração técnica aceitem pagamentos online com página de checkout hospedada.",
    layer: "experience",
    category: "Meios de Pagamento",
    complexity: "low",
    actors: ["Merchant", "PSP", "Consumidor"],
    metricsImpacted: ["Conversão", "Cobertura de Canal", "Volume de Transações"],
    aliases: ["Payment Link", "Link de Pagamento", "Pay by Link", "Checkout Link"],
    dependencies: ["checkout-ui", "webhooks"],
    relatedFlows: ["card-payment", "pix"],
    relatedProblems: [],
    businessRules: [
      "Link pode ter expiração configurável (1h a 30 dias)",
      "Suporte a pagamento único ou recorrente",
      "Link pode ser reutilizável (múltiplos pagamentos) ou single-use",
    ],
    technicalRequirements: [
      "API de criação de links com parâmetros de valor, descrição e expiração",
      "Página de checkout hospedada responsiva com múltiplos métodos de pagamento",
      "Webhook de notificação de pagamento vinculado ao link_id",
      "Dashboard de gestão de links com status e métricas de conversão",
    ],
    payloadExample: `{
  "type": "create_payment_link",
  "amount": 15000,
  "currency": "BRL",
  "description": "Consultoria - Sessão 1h",
  "expires_at": "2026-03-28T23:59:59Z",
  "reusable": false,
  "payment_methods": ["credit_card", "pix", "boleto"],
  "response": {
    "link_id": "pl_abc123",
    "url": "https://pay.example.com/pl_abc123",
    "short_url": "https://pay.ex/abc",
    "qr_code_base64": "data:image/png;base64,..."
  }
}`,
  },
  {
    id: "qr-code-payments",
    name: "QR Code Payments",
    description:
      "Pagamentos iniciados pela leitura de QR codes estáticos ou dinâmicos no ponto de venda ou em canais digitais, unificando a experiência de pagamento Pix, wallets e cartão via câmera do smartphone.",
    layer: "experience",
    category: "Meios de Pagamento",
    complexity: "medium",
    actors: ["Merchant", "PSP", "Consumidor", "Banco do Consumidor"],
    metricsImpacted: ["Conversão no Checkout", "Velocidade de Pagamento", "Custo de Processamento"],
    aliases: ["QR Code", "Pagamento QR", "QR Payment", "Pix QR Code"],
    dependencies: ["pix-integration"],
    relatedFlows: ["pix"],
    relatedProblems: [],
    businessRules: [
      "QR estático: reutilizável, sem valor fixo (tipado no app do pagador)",
      "QR dinâmico: único por transação, valor fixo, expirável",
      "Padrão EMV QR Code conforme especificação Pix do Banco Central",
    ],
    technicalRequirements: [
      "Geração de QR Code EMV conforme especificação BR Code do BCB",
      "Suporte a QR estático (merchant presented) e dinâmico (transaction-specific)",
      "Webhook para confirmação de pagamento associado ao QR code ID",
      "SDK para exibição de QR code responsivo em web e impressão em PDV",
    ],
    payloadExample: `{
  "type": "qr_code_payment",
  "qr_type": "dynamic",
  "amount": 4590,
  "currency": "BRL",
  "merchant": {
    "name": "Padaria Central",
    "city": "São Paulo"
  },
  "qr_payload": "00020126580014br.gov.bcb.pix0136a1b2c3d4...",
  "response": {
    "payment_id": "pix_pay_xyz",
    "status": "confirmed",
    "payer_bank": "Nubank",
    "confirmation_time_ms": 2300
  }
}`,
  },
  {
    id: "credential-on-file",
    name: "Credential on File (COF)",
    description:
      "Framework das bandeiras para categorização de transações que utilizam credenciais de cartão armazenadas, distinguindo entre transações iniciadas pelo portador (CIT) e pelo merchant (MIT), com indicadores obrigatórios na mensageria.",
    layer: "network",
    category: "Compliance",
    complexity: "medium",
    actors: ["Merchant", "Adquirente", "Bandeira", "Emissor"],
    metricsImpacted: ["Taxa de Autorização", "Compliance", "Taxa de Chargeback"],
    aliases: ["COF", "Credential on File", "Credencial Armazenada", "Stored Credential"],
    dependencies: ["pci-vault", "network-tokenization"],
    relatedFlows: ["card-payment", "recurring"],
    relatedProblems: [],
    businessRules: [
      "Primeira transação CIT com consentimento do portador deve usar indicador 'initial storage'",
      "Transações subsequentes devem referenciar o transaction_id da CIT inicial",
      "Indicador COF obrigatório desde 2019 (Visa) e 2020 (Mastercard) em todas as transações com credencial armazenada",
    ],
    technicalRequirements: [
      "Campo COF indicator na mensageria ISO 8583 (DE48 subelemento para Visa, DE48.22 para MC)",
      "Armazenamento do initial_transaction_id para referência em transações subsequentes",
      "Lógica de classificação CIT vs. MIT baseada no contexto da transação",
      "Validação de consentimento do portador antes do armazenamento de credencial",
    ],
    payloadExample: `{
  "type": "authorization",
  "amount": 9990,
  "credential_on_file": {
    "indicator": "subsequent",
    "initiator": "cardholder",
    "initial_transaction_id": "txn_first_abc123",
    "storage_reason": "subscription",
    "consent_date": "2025-01-15"
  },
  "card": {
    "token": "tok_stored_001",
    "network_token": true
  }
}`,
  },
  {
    id: "mit",
    name: "Merchant Initiated Transaction (MIT)",
    description:
      "Transações iniciadas pelo merchant sem a presença ativa do portador, como cobranças recorrentes, no-show fees e cobranças por uso, utilizando credenciais previamente autorizadas pelo portador.",
    layer: "processing",
    category: "Autorização",
    complexity: "medium",
    actors: ["Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Taxa de Autorização", "Taxa de Chargeback", "Receita Recorrente"],
    aliases: ["MIT", "Merchant Initiated", "Transação Iniciada pelo Merchant"],
    dependencies: ["credential-on-file", "pci-vault"],
    relatedFlows: ["recurring", "card-payment"],
    relatedProblems: [],
    businessRules: [
      "MIT requer consentimento prévio do portador documentado (CIT inicial com stored credential agreement)",
      "Categorias MIT: recurring, installment, unscheduled, resubmission, delayed charge, no-show",
      "CVV não é enviado em MITs (apenas na CIT inicial)",
    ],
    technicalRequirements: [
      "API de autorização com flag initiator=merchant e MIT category",
      "Referência obrigatória ao initial_transaction_id da CIT de consentimento",
      "SCA exemption flag para MITs em mercados com SCA (UE/EEA)",
      "Retry logic específica para MITs com response codes de 'try again later'",
    ],
    payloadExample: `{
  "type": "authorization",
  "amount": 4990,
  "initiator": "merchant",
  "mit_category": "recurring",
  "credential_on_file": {
    "initial_transaction_id": "txn_cit_original",
    "consent_type": "recurring_subscription"
  },
  "card": { "token": "tok_stored_001" },
  "sca_exemption": "merchant_initiated",
  "merchant": {
    "name": "Streaming Service",
    "mcc": "5968"
  }
}`,
  },
  {
    id: "cit",
    name: "Cardholder Initiated Transaction (CIT)",
    description:
      "Transações onde o portador do cartão está ativamente participando e autenticando o pagamento, seja em e-commerce, presencial ou em-app, podendo ser a transação inicial que estabelece consentimento para futuras MITs.",
    layer: "processing",
    category: "Autorização",
    complexity: "low",
    actors: ["Portador", "Merchant", "Adquirente", "Emissor"],
    metricsImpacted: ["Taxa de Autorização", "Taxa de Conversão", "Compliance"],
    aliases: ["CIT", "Cardholder Initiated", "Transação Iniciada pelo Portador"],
    dependencies: ["real-time-auth"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "CIT requer presença ativa do portador (pode incluir 3DS authentication)",
      "CIT com armazenamento de credencial deve incluir indicador 'initial storage' e obter consentimento",
      "Todas as transações e-commerce com portador presente no checkout são classificadas como CIT",
    ],
    technicalRequirements: [
      "API de autorização com flag initiator=cardholder",
      "Integração com 3DS para autenticação do portador quando aplicável",
      "Indicador de stored credential quando portador consente armazenamento",
      "Captura de CVV obrigatória em CITs para máxima taxa de aprovação",
    ],
    payloadExample: `{
  "type": "authorization",
  "amount": 25000,
  "initiator": "cardholder",
  "credential_on_file": {
    "indicator": "initial_storage",
    "consent_given": true,
    "future_use": "recurring"
  },
  "card": {
    "token": "tok_new_card",
    "cvv_provided": true
  },
  "authentication": {
    "method": "3ds2",
    "eci": "05",
    "cavv": "AAABBBCCCdddEEEfff..."
  }
}`,
  },
  {
    id: "stip",
    name: "Stand-In Processing (STIP)",
    description:
      "Processamento substituto onde a bandeira (Visa/Mastercard) aprova ou recusa transações em nome do emissor quando este está offline ou indisponível, usando parâmetros pré-definidos pelo emissor.",
    layer: "network",
    category: "Resiliência",
    complexity: "high",
    actors: ["Bandeira", "Emissor", "Adquirente"],
    metricsImpacted: ["Taxa de Autorização", "Disponibilidade", "Risco de Fraude"],
    aliases: ["STIP", "Stand-In Processing", "Processamento Substituto", "Visa STIP", "MC STIP"],
    dependencies: ["iso-8583", "real-time-auth"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p1"],
    businessRules: [
      "STIP é ativado quando o emissor não responde dentro de 5 segundos",
      "Parâmetros de stand-in (limites de valor, velocity checks) são definidos pelo emissor",
      "Risco de fraude é maior em STIP pois regras do emissor são simplificadas",
    ],
    technicalRequirements: [
      "Detecção de timeout do emissor com failover automático para STIP da bandeira",
      "Monitoramento de taxa de STIP por emissor para identificar problemas de conectividade",
      "Alertas quando taxa de STIP ultrapassa threshold (indica emissor com problemas)",
      "Reconciliação de transações STIP com confirmação posterior do emissor",
    ],
    payloadExample: `{
  "type": "authorization_response",
  "transaction_id": "txn_stip_001",
  "amount": 15000,
  "response_code": "00",
  "response_source": "stand_in",
  "stip_details": {
    "reason": "issuer_timeout",
    "issuer_response_time_ms": 5200,
    "stip_provider": "visa_stip",
    "parameters_used": {
      "max_amount": 50000,
      "velocity_limit": "5_per_hour",
      "approved_by": "visa_stand_in_rules"
    }
  }
}`,
  },
  {
    id: "scheme-tokenization-mandates",
    name: "Scheme Tokenization Mandates",
    description:
      "Mandatos das bandeiras de cartão (Visa, Mastercard) que exigem a adoção de network tokens em substituição a PANs armazenados, com prazos progressivos e incentivos de interchange para adoção.",
    layer: "network",
    category: "Compliance",
    complexity: "high",
    actors: ["Bandeira", "Merchant", "Adquirente", "Token Service Provider"],
    metricsImpacted: ["Compliance", "Taxa de Autorização", "Custo de Processamento"],
    aliases: ["Tokenization Mandate", "Mandato de Tokenização", "Network Token Mandate"],
    dependencies: ["network-tokenization", "network-tokens-lifecycle"],
    relatedFlows: ["card-payment", "recurring"],
    relatedProblems: [],
    businessRules: [
      "Visa: mandato de tokenização para COF transactions em mercados selecionados a partir de 2025",
      "Mastercard: mandato progressivo com incentivos de interchange para network tokens",
      "Incentivo: redução de interchange de até 10bps para transações com network token",
    ],
    technicalRequirements: [
      "Migração de PANs armazenados para network tokens em batch",
      "API de provisionamento de tokens com suporte a volume massivo",
      "Monitoramento de taxa de tokenização vs. target de compliance",
      "Fallback para PAN quando network token não está disponível (período de transição)",
    ],
    payloadExample: `{
  "type": "tokenization_mandate_status",
  "merchant_id": "merch_001",
  "compliance": {
    "visa": {
      "mandate_deadline": "2025-10-01",
      "current_token_rate": 78.5,
      "target_rate": 95.0,
      "remaining_pans_to_migrate": 15200
    },
    "mastercard": {
      "mandate_deadline": "2026-04-01",
      "current_token_rate": 65.2,
      "target_rate": 90.0,
      "remaining_pans_to_migrate": 28400
    }
  },
  "interchange_savings_monthly": 12500
}`,
  },
  {
    id: "pci-dss-v4",
    name: "PCI DSS v4.0 Compliance",
    description:
      "Versão mais recente do padrão de segurança de dados da indústria de cartões de pagamento, com requisitos ampliados para autenticação multi-fator, criptografia, monitoramento contínuo e customized approach para validação.",
    layer: "processing",
    category: "Compliance",
    complexity: "critical",
    actors: ["Merchant", "PSP", "QSA (Auditor)", "PCI Council"],
    metricsImpacted: ["Compliance", "Risco de Vazamento de Dados", "Custo de Compliance"],
    aliases: ["PCI DSS v4", "PCI v4.0", "PCI Compliance v4", "PCI DSS 4.0"],
    dependencies: ["pci-vault"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "PCI DSS v4.0 é obrigatório a partir de 31/03/2025 (future-dated requirements até 31/03/2026)",
      "Novo customized approach permite controles alternativos desde que atinjam o objetivo de segurança",
      "MFA obrigatório para todo acesso ao Cardholder Data Environment (CDE)",
    ],
    technicalRequirements: [
      "Implementação de MFA para todo acesso ao CDE (Requirement 8.4.2)",
      "Script integrity monitoring para páginas de pagamento (Requirement 6.4.3)",
      "WAF ou equivalente para proteção de aplicações web públicas (Requirement 6.4.1)",
      "Targeted risk analysis documentada para cada requisito com flexibilidade (customized approach)",
      "Monitoramento contínuo de security controls com alertas automáticos",
    ],
    payloadExample: `{
  "type": "pci_compliance_report",
  "merchant_id": "merch_001",
  "pci_level": 1,
  "standard_version": "4.0",
  "assessment": {
    "type": "ROC",
    "qsa": "Security Auditor Corp",
    "last_assessment_date": "2026-02-15",
    "next_assessment_due": "2027-02-15",
    "status": "compliant"
  },
  "requirements_status": {
    "total": 264,
    "compliant": 258,
    "in_progress": 4,
    "not_applicable": 2,
    "future_dated_requirements": {
      "total": 13,
      "implemented": 9,
      "deadline": "2026-03-31"
    }
  }
}`,
  },
  {
    id: "sca",
    name: "Strong Customer Authentication (SCA)",
    description:
      "Requisito regulatório da PSD2 (EU) que exige autenticação com pelo menos dois fatores independentes (conhecimento, posse, inerência) para pagamentos eletrônicos, com isenções para transações de baixo risco.",
    layer: "experience",
    category: "Autenticação",
    complexity: "high",
    actors: ["Merchant", "Adquirente", "Emissor", "Regulador (EBA)"],
    metricsImpacted: ["Taxa de Conversão", "Taxa de Autorização", "Compliance"],
    aliases: ["SCA", "Strong Customer Authentication", "Autenticação Forte", "PSD2 SCA"],
    dependencies: ["3d-secure", "emv-3ds"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p5"],
    businessRules: [
      "SCA obrigatória para transações eletrônicas na UE/EEA > €0 (com isenções)",
      "Isenções: low-value (<€30), TRA (baixo risco), recurring (após CIT inicial), whitelisting",
      "Merchant pode solicitar isenção, mas emissor tem a decisão final",
    ],
    technicalRequirements: [
      "Motor de isenções SCA com avaliação automática de elegibilidade por transação",
      "Integração com 3DS2 para authentication challenge quando SCA é necessária",
      "Indicadores de isenção no campo de autorização (DE48 para Visa, DE48.43 para MC)",
      "Dashboard de SCA performance: taxa de isenção, challenge rate, conversion impact",
    ],
    payloadExample: `{
  "type": "sca_assessment",
  "transaction_id": "txn_sca_001",
  "amount": 8500,
  "currency": "EUR",
  "sca_required": true,
  "exemption_requested": "transaction_risk_analysis",
  "exemption_assessment": {
    "eligible": true,
    "acquirer_fraud_rate": 0.005,
    "threshold": 0.013,
    "amount_within_limit": true,
    "limit_eur": 25000
  },
  "outcome": {
    "exemption_applied": true,
    "authentication_method": "frictionless",
    "eci": "07"
  }
}`,
  },
  {
    id: "dispute-prevention",
    name: "Dispute Prevention (CDRN/RDR)",
    description:
      "Ferramentas proativas de prevenção de disputas que interceptam chargebacks antes de serem formalizados, usando redes como Verifi CDRN (Visa) e Ethoca (Mastercard) para resolver conflitos diretamente com o emissor.",
    layer: "settlement",
    category: "Disputas",
    complexity: "high",
    actors: ["Merchant", "Adquirente", "Emissor", "Verifi/Ethoca"],
    metricsImpacted: ["Taxa de Chargeback", "Custo de Disputas", "Receita Líquida"],
    aliases: ["CDRN", "RDR", "Verifi", "Ethoca", "Dispute Prevention", "Prevenção de Disputas"],
    dependencies: ["chargeback-management"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "CDRN (Verifi/Visa): merchant recebe alerta e pode emitir refund proativo antes do chargeback formal",
      "RDR (Rapid Dispute Resolution): auto-refund baseado em regras pré-definidas pelo merchant",
      "Ethoca (Mastercard): alerta de fraude confirmada para cancelamento proativo da transação",
    ],
    technicalRequirements: [
      "Integração com Verifi CDRN API para receber alertas de disputas pendentes",
      "Integração com Ethoca API para alertas de fraude confirmada",
      "Motor de regras para auto-refund baseado em valor, MCC e tipo de disputa",
      "Dashboard de efetividade: disputas prevenidas vs. chargebacks formais",
    ],
    payloadExample: `{
  "type": "dispute_alert",
  "source": "verifi_cdrn",
  "alert_id": "cdrn_alert_001",
  "transaction": {
    "id": "txn_original_789",
    "amount": 12000,
    "date": "2026-03-10",
    "card_last4": "4242"
  },
  "dispute_reason": "fraud",
  "auto_refund_rule": {
    "matched": true,
    "rule": "auto_refund_fraud_under_50k",
    "action": "refund_issued"
  },
  "resolution": {
    "refund_id": "ref_proactive_001",
    "chargeback_prevented": true,
    "savings": {
      "chargeback_fee_avoided": 1500,
      "operational_cost_avoided": 5000
    }
  }
}`,
  },
  {
    id: "chargeback-analytics",
    name: "Chargeback Analytics & Intelligence",
    description:
      "Plataforma de analytics especializada em chargebacks que oferece dashboards de trending, análise de cohort por MCC/região/método de pagamento, modelagem de impacto financeiro e detecção preditiva de spikes para ação proativa.",
    layer: "settlement",
    category: "Disputas",
    complexity: "high",
    actors: ["Merchant", "Time de Risco", "Adquirente", "Time Financeiro"],
    metricsImpacted: ["Taxa de Chargeback", "Win Rate", "Custo por Chargeback", "Tempo de Resposta"],
    aliases: ["Chargeback Analytics", "Analytics de Disputas", "Dispute Intelligence", "Chargeback Dashboard"],
    dependencies: ["chargeback-management", "settlement-reconciliation"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p5"],
    businessRules: [
      "Trending de chargeback rate calculado em janela rolling de 30, 60 e 90 dias com comparação YoY",
      "Cohort analysis por dimensões: MCC, região do portador, método de pagamento, faixa de valor, dia da semana",
      "Revenue impact model: custo total = sum(valor_transação + fee + ops + multa) por período",
      "Early warning: alertas preditivos quando tendência de chargeback rate projeta ultrapassar 0.9% em 30 dias",
      "Benchmark comparativo: chargeback rate e win rate do merchant vs. média do setor (MCC) e top quartile",
    ],
    technicalRequirements: [
      "Time-series database (InfluxDB/TimescaleDB) para armazenar métricas de chargeback com granularidade horária",
      "Pipeline de reason code distribution com breakdown por período, região e faixa de valor",
      "Motor de win rate analytics segmentado por tipo de evidência apresentada e reason code",
      "Modelo preditivo (regressão/ARIMA) para detecção antecipada de spikes de chargeback",
      "Dashboard com drill-down interativo: rate → reason code → transações individuais → evidências",
    ],
    payloadExample: `{
  "period": "2026-03",
  "merchant_id": "mid_001",
  "summary": {
    "total_chargebacks": 47,
    "total_transactions": 5200,
    "chargeback_rate_percent": 0.90,
    "trend": "increasing",
    "projected_next_month": 1.12,
    "total_financial_impact": 198500,
    "win_rate_percent": 35.2
  },
  "by_reason_code": {
    "10.4_fraud": { "count": 22, "win_rate": 18, "avg_amount": 28000 },
    "13.1_not_recognized": { "count": 15, "win_rate": 45, "avg_amount": 8500 },
    "13.3_not_received": { "count": 7, "win_rate": 62, "avg_amount": 15000 }
  },
  "alerts": [
    { "type": "threshold_warning", "message": "Rate projetado para ultrapassar 0.9%", "severity": "high" }
  ]
}`,
  },
  {
    id: "compelling-evidence",
    name: "Compelling Evidence (Visa CE 3.0)",
    description:
      "Framework da Visa para defesa automatizada de chargebacks de fraude (reason code 10.4) usando matching de device fingerprint, endereço IP e histórico de transações anteriores não disputadas do mesmo portador. CE 3.0 pode reverter liability shift mesmo sem 3DS.",
    layer: "settlement",
    category: "Disputas",
    complexity: "high",
    actors: ["Merchant", "Visa", "Adquirente", "Processador"],
    metricsImpacted: ["Win Rate", "Taxa de Chargeback", "Receita Recuperada", "Custo de Disputas"],
    aliases: ["CE 3.0", "Compelling Evidence", "Visa CE", "Evidência Convincente", "Compelling Evidence 3.0"],
    dependencies: ["chargeback-management", "fraud-scoring"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p5"],
    businessRules: [
      "CE 3.0 aplica-se exclusivamente a chargebacks com reason code 10.4 (Fraud - Card Absent Environment)",
      "Requer match de pelo menos 2 transações anteriores não disputadas do mesmo portador nos últimos 365 dias",
      "Critérios de matching: device fingerprint OU IP address + pelo menos 1 de: email, telefone, endereço de entrega",
      "Transação disputada e transações de referência devem ter sido processadas pelo mesmo merchant ID",
      "Auto-decisioning: se critérios CE 3.0 atendidos, chargeback pode ser revertido automaticamente sem representment manual",
    ],
    technicalRequirements: [
      "Engine de device fingerprint matching com armazenamento de 365 dias de histórico por cartão/token",
      "API de correlação histórica: dado um PAN/token, retornar transações anteriores não disputadas com dados de matching",
      "Integração com Visa VROL (Visa Resolve Online) para submissão automatizada de evidências CE 3.0",
      "Sistema de scoring de elegibilidade CE 3.0: avaliar automaticamente se chargeback 10.4 tem dados suficientes",
    ],
    payloadExample: `{
  "dispute_id": "dsp_cb_ce3_001",
  "reason_code": "10.4",
  "ce3_evaluation": {
    "eligible": true,
    "confidence_score": 95,
    "matching_criteria": {
      "device_fingerprint": { "matched": true, "device_id": "dev_abc123", "match_count": 4 },
      "ip_address": { "matched": true, "ip": "189.40.xx.xx", "match_count": 3 },
      "email": { "matched": true, "email_hash": "sha256_xxxx" }
    },
    "prior_undisputed_transactions": [
      { "txn_id": "txn_prior_001", "date": "2026-01-15", "amount": 15000 },
      { "txn_id": "txn_prior_002", "date": "2026-02-20", "amount": 22000 }
    ]
  },
  "auto_decision": "reverse_chargeback",
  "submission_status": "submitted_to_vrol"
}`,
  },
  {
    id: "chargeback-alerts",
    name: "Pre-Chargeback Alert Services",
    description:
      "Serviços de alerta pré-chargeback que notificam o merchant antes da formalização da disputa, permitindo resolução proativa via refund ou crédito. Inclui Verifi CDRN (Visa), Ethoca Alerts (Mastercard) e Visa Order Insight.",
    layer: "settlement",
    category: "Disputas",
    complexity: "high",
    actors: ["Merchant", "Verifi", "Ethoca", "Emissor", "Adquirente"],
    metricsImpacted: ["Taxa de Chargeback", "Custo de Disputas", "Taxa de Deflexão", "Receita Líquida"],
    aliases: ["Pre-Chargeback Alerts", "CDRN", "Ethoca", "Order Insight", "Alertas Pré-Chargeback"],
    dependencies: ["chargeback-management", "dispute-prevention"],
    relatedFlows: ["card-payment"],
    relatedProblems: ["p5"],
    businessRules: [
      "CDRN (Verifi/Visa): merchant recebe alerta 72h antes do chargeback formal. Janela para emitir refund proativo",
      "Ethoca Alerts (Mastercard): alerta de fraude confirmada pelo emissor. Merchant cancela transação/entrega",
      "Order Insight (Visa): enriquece experiência do portador com detalhes da compra no app bancário, reduzindo 'não reconheço'",
      "Decision engine para auto-refund: regras baseadas em valor, tipo de alerta e histórico do portador",
      "ROI de prevenção: custo do alert (~R$5-15/alerta) vs. custo do chargeback (R$150-675). Break-even com deflexão > 3-5%",
    ],
    technicalRequirements: [
      "Webhook integration com Verifi CDRN API para receber alertas em real-time com SLA < 1h",
      "Integração Ethoca Alerts API com matching automático por descriptor + BIN + amount + date",
      "Motor de decisão auto-refund: regras configuráveis por merchant com thresholds de valor e tipo de fraude",
      "Dashboard de efetividade: alertas recebidos vs. chargebacks prevenidos vs. custo vs. economia",
    ],
    payloadExample: `{
  "alert_id": "cdrn_alert_001",
  "source": "verifi_cdrn",
  "type": "pre_chargeback",
  "transaction": {
    "id": "txn_original_789",
    "amount": 12000,
    "currency": "BRL",
    "date": "2026-03-10",
    "descriptor": "LOJA EXEMPLO*PEDIDO123"
  },
  "dispute_reason": "fraud_reported",
  "deadline": "2026-03-25T14:30:00Z",
  "auto_decision": {
    "rule_matched": "auto_refund_fraud_under_50k",
    "action": "refund_issued",
    "refund_id": "ref_proactive_001"
  },
  "financial_outcome": {
    "chargeback_fee_avoided": 2500,
    "alert_cost": 800,
    "net_savings": 6700
  }
}`,
  },
  {
    id: "chargeback-reason-codes",
    name: "Taxonomia de Reason Codes",
    description:
      "Classificação completa dos códigos de motivo de chargeback por bandeira (Visa, Mastercard, Elo, Amex), com estratégia de defesa, evidências necessárias e benchmark de win rate para cada código. Base para automação de classificação e roteamento de disputas.",
    layer: "settlement",
    category: "Disputas",
    complexity: "medium",
    actors: ["Bandeira", "Merchant", "Adquirente", "Time de Disputas"],
    metricsImpacted: ["Win Rate", "Tempo de Classificação", "Eficiência de Defesa"],
    aliases: ["Reason Codes", "Códigos de Motivo", "Dispute Reason Codes", "Chargeback Codes", "Taxonomia de Disputas"],
    dependencies: ["chargeback-management"],
    relatedFlows: ["card-payment"],
    relatedProblems: [],
    businessRules: [
      "Visa: 4 categorias — 10.x Fraude, 11.x Autorização, 12.x Processamento, 13.x Disputas do Consumidor",
      "Mastercard: códigos numéricos 4xxx — 4834, 4837, 4840, 4853, 4855, 4859, 4863, 4871",
      "Cada reason code tem evidências obrigatórias específicas: 10.4 aceita CE 3.0, 13.1 requer descriptor, 13.3 requer tracking",
      "Win rate varia drasticamente por código: 10.4 ~18%, 13.1 ~40%, 13.3 ~55%, 13.6 ~35%",
      "Classificação automática do reason code determina template de evidência, prioridade e decisão fight/accept",
    ],
    technicalRequirements: [
      "Database de reason codes com mapping: código → categoria → evidências → template de defesa → win rate",
      "Engine de classificação automática que parseia reason code e roteia para template de evidência",
      "Tracking de win rate por reason code com atualização mensal para ajuste de estratégia",
      "API de lookup: dado um reason code, retorna estratégia, evidências e probabilidade de sucesso",
    ],
    payloadExample: `{
  "reason_code": "10.4",
  "network": "visa",
  "category": "fraud",
  "subcategory": "card_absent_environment",
  "description": "Transação fraudulenta em ambiente CNP",
  "defense_strategy": {
    "primary": "Compelling Evidence 3.0 — device/IP matching",
    "secondary": "3DS authentication log com liability shift",
    "evidence_required": ["device_fingerprint_match", "ip_address_match", "prior_undisputed_txns"],
    "evidence_optional": ["customer_email", "delivery_proof"]
  },
  "benchmarks": {
    "win_rate_without_ce3": 15,
    "win_rate_with_ce3": 65,
    "win_rate_with_3ds": 85,
    "recommended_action": "fight_if_ce3_eligible"
  }
}`,
  },
  {
    id: "fraud-alerts-tc40-safe",
    name: "Fraud Alerts (TC40/SAFE)",
    description:
      "Relatórios de fraude confirmada emitidos pelas bandeiras — TC40 (Visa) e SAFE (Mastercard) — quando um emissor confirma que uma transação foi fraudulenta, usados para alimentar modelos de risco e identificar padrões.",
    layer: "network",
    category: "Risco",
    complexity: "medium",
    actors: ["Bandeira", "Emissor", "Adquirente", "Merchant"],
    metricsImpacted: ["Taxa de Fraude", "Qualidade do Modelo de Risco", "Taxa de Chargeback"],
    aliases: ["TC40", "SAFE", "Fraud Alerts", "Alertas de Fraude", "Visa TC40", "MC SAFE"],
    dependencies: ["fraud-scoring"],
    relatedFlows: [],
    relatedProblems: ["p2"],
    businessRules: [
      "TC40 (Visa): emitido pelo emissor quando portador reporta fraude, independente de chargeback",
      "SAFE (Mastercard): equivalente do TC40, com campos específicos da Mastercard",
      "Alta taxa de TC40/SAFE pode colocar merchant em programa de monitoramento de fraude",
    ],
    technicalRequirements: [
      "Ingestão de arquivos TC40 e SAFE via batch diário do adquirente",
      "Correlação de fraud alerts com transações internas para enriquecer modelo de risco",
      "Dashboard de fraud alert rate por merchant, BIN e região",
      "Alertas automáticos quando fraud rate se aproxima de thresholds de monitoramento",
    ],
    payloadExample: `{
  "type": "fraud_alert",
  "source": "tc40",
  "alert": {
    "transaction_id": "txn_fraud_001",
    "original_amount": 35000,
    "transaction_date": "2026-03-05",
    "card_bin": "453216",
    "fraud_type": "counterfeit",
    "reported_date": "2026-03-15",
    "chargeback_filed": false
  },
  "merchant_impact": {
    "current_fraud_rate": 0.08,
    "monitoring_threshold": 0.10,
    "status": "warning"
  }
}`,
  },
  {
    id: "cross-border-optimization",
    name: "Cross-Border Optimization",
    description:
      "Conjunto de técnicas para otimizar transações internacionais, incluindo local acquiring, moeda local, BIN routing inteligente e compliance regulatória multi-jurisdição para maximizar taxas de aprovação cross-border.",
    layer: "orchestration",
    category: "Otimização",
    complexity: "high",
    actors: ["Merchant", "Adquirente Local", "Adquirente Internacional", "Bandeira"],
    metricsImpacted: ["Taxa de Autorização Cross-Border", "Custo de FX", "Conversão Internacional"],
    aliases: ["Cross-Border Optimization", "Otimização Cross-Border", "International Optimization"],
    dependencies: ["smart-routing", "bin-lookup", "currency-conversion"],
    relatedFlows: ["cross-border"],
    relatedProblems: ["p1"],
    businessRules: [
      "Transações cross-border têm taxas de autorização 5-15% menores que domestic",
      "Local acquiring no país do emissor pode elevar auth rate em 3-8%",
      "Cross-border assessment fee adicional de 0.4-1.0% aplicada pelas bandeiras",
    ],
    technicalRequirements: [
      "BIN-based routing para direcionar transações ao adquirente local do país do emissor",
      "Suporte a Multi-Currency Pricing (MCP) para cobrar na moeda do portador",
      "Integração com adquirentes locais em múltiplos países",
      "Dashboard de performance cross-border vs. domestic por corredor de pagamento",
    ],
    payloadExample: `{
  "type": "cross_border_analysis",
  "transaction_id": "txn_xb_001",
  "amount": 10000,
  "merchant_currency": "BRL",
  "card_issuer_country": "US",
  "optimization": {
    "strategy": "local_acquiring",
    "selected_acquirer": "us_local_acquirer",
    "expected_auth_rate_uplift_pct": 6.5,
    "fx_conversion": {
      "rate": 5.05,
      "spread_pct": 0.3,
      "cardholder_amount": 1980,
      "cardholder_currency": "USD"
    },
    "fees": {
      "cross_border_assessment": 0,
      "note": "Avoided via local acquiring"
    }
  }
}`,
  },
  {
    id: "local-acquiring",
    name: "Local Acquiring",
    description:
      "Estratégia de processar transações através de um adquirente localizado no mesmo país do emissor do cartão, eliminando fees de cross-border e aumentando significativamente a taxa de autorização.",
    layer: "orchestration",
    category: "Otimização",
    complexity: "medium",
    actors: ["Merchant", "Adquirente Local", "Bandeira", "Emissor"],
    metricsImpacted: ["Taxa de Autorização", "Custo de Cross-Border Fee", "Custo de FX"],
    aliases: ["Local Acquiring", "Adquirência Local", "Domestic Acquiring", "In-Country Processing"],
    dependencies: ["smart-routing", "bin-lookup"],
    relatedFlows: ["cross-border"],
    relatedProblems: ["p1"],
    businessRules: [
      "Merchant precisa de MID (Merchant ID) em cada adquirente local",
      "Elimina cross-border assessment fee (0.4-1.0% por transação)",
      "Requer entidade legal ou facilitador de pagamento no país do adquirente local",
    ],
    technicalRequirements: [
      "Integração com adquirentes em múltiplos países com mapeamento de MIDs",
      "Roteamento automático baseado em BIN do emissor para adquirente local",
      "Gestão multi-moeda com settlement em moeda local ou consolidada",
      "Compliance regulatório por país (licenças, reporting, withholding tax)",
    ],
    payloadExample: `{
  "type": "local_acquiring_route",
  "card_issuer_country": "MX",
  "merchant_country": "BR",
  "routing_decision": {
    "strategy": "local_acquire",
    "acquirer": "mx_local_acquirer",
    "acquirer_country": "MX",
    "merchant_mid": "MID_MX_001",
    "is_domestic": true,
    "fees_saved": {
      "cross_border_fee_pct": 0.8,
      "cross_border_fee_amount": 80
    },
    "expected_auth_rate": 94.5,
    "vs_cross_border_auth_rate": 87.2
  }
}`,
  },
  {
    id: "payment-facilitator",
    name: "Payment Facilitator (PayFac)",
    description:
      "Modelo de negócio onde uma plataforma se torna facilitadora de pagamento, agregando múltiplos sub-merchants sob seu MID master, simplificando onboarding e assumindo responsabilidade de compliance e risco.",
    layer: "banking",
    category: "Modelo de Negócio",
    complexity: "critical",
    actors: ["PayFac", "Sub-merchant", "Adquirente Sponsor", "Bandeira", "Regulador"],
    metricsImpacted: ["Velocidade de Onboarding", "Revenue per Merchant", "Risco de Crédito"],
    aliases: ["PayFac", "Payment Facilitator", "Facilitador de Pagamento", "PF", "SubAcquirer"],
    dependencies: ["kyc-verification", "split-payments", "merchant-account"],
    relatedFlows: ["marketplace"],
    relatedProblems: [],
    businessRules: [
      "PayFac é responsável por KYC/KYB de todos os sub-merchants (due diligence)",
      "Sub-merchants processam sob o MID master do PayFac com identificação via sub-merchant ID",
      "PayFac assume risco de chargeback e fraude — pode reter reserva dos sub-merchants",
    ],
    technicalRequirements: [
      "Sistema de onboarding de sub-merchants com KYC/KYB automatizado",
      "Engine de split de pagamentos para distribuição de fundos entre PayFac e sub-merchants",
      "Sistema de monitoramento de risco contínuo por sub-merchant",
      "Reporting para adquirente sponsor e bandeiras com detalhamento por sub-merchant",
      "API de gestão de sub-merchants (criação, atualização, suspensão, encerramento)",
    ],
    payloadExample: `{
  "type": "payfac_transaction",
  "payfac": {
    "id": "pf_platform_001",
    "master_mid": "MID_MASTER_001",
    "name": "Marketplace Platform"
  },
  "sub_merchant": {
    "id": "sm_seller_abc",
    "name": "Loja do João",
    "mcc": "5411",
    "sub_merchant_id": "SM_ABC_123"
  },
  "transaction": {
    "amount": 15000,
    "split": {
      "sub_merchant_amount": 13500,
      "platform_fee": 1500,
      "platform_fee_pct": 10.0
    }
  }
}`,
  },
  {
    id: "sub-merchant-onboarding",
    name: "Sub-merchant Onboarding",
    description:
      "Processo de cadastro, verificação e ativação de sub-merchants em plataformas de facilitação de pagamento, incluindo KYC/KYB, análise de risco, configuração de pricing e ativação para processamento.",
    layer: "banking",
    category: "Gestão de Conta",
    complexity: "high",
    actors: ["PayFac", "Sub-merchant", "Provedor KYC", "Adquirente Sponsor"],
    metricsImpacted: ["Velocidade de Onboarding", "Taxa de Aprovação de Merchant", "Compliance"],
    aliases: ["Sub-merchant Onboarding", "Onboarding de Sub-merchant", "Seller Onboarding"],
    dependencies: ["payment-facilitator", "kyc-verification"],
    relatedFlows: ["marketplace"],
    relatedProblems: [],
    businessRules: [
      "KYC mínimo: CPF/CNPJ, comprovante de endereço, dados bancários para liquidação",
      "Ativação instantânea para micro-merchants (limite de processamento baixo) com KYC simplificado",
      "Enhanced due diligence para merchants de alto risco (MCC de jogos, adult, pharma)",
    ],
    technicalRequirements: [
      "API de onboarding com upload de documentos e verificação automática",
      "Integração com bureaus de crédito e listas de sanções para screening",
      "Workflow de aprovação com etapas configuráveis (auto-approve, review, reject)",
      "Dashboard de status de onboarding com SLA tracking",
    ],
    payloadExample: `{
  "type": "sub_merchant_onboarding",
  "sub_merchant": {
    "legal_name": "João da Silva ME",
    "trade_name": "Loja do João",
    "cnpj": "12.345.678/0001-90",
    "mcc": "5411",
    "address": {
      "street": "Rua Example 456",
      "city": "São Paulo",
      "state": "SP",
      "zip": "01310-100"
    },
    "bank_account": {
      "bank": "260",
      "branch": "0001",
      "account": "1234567-8",
      "type": "checking"
    }
  },
  "kyc_result": {
    "status": "approved",
    "risk_level": "low",
    "verification_checks": {
      "cnpj_active": true,
      "sanctions_clear": true,
      "credit_score": 750
    }
  },
  "activation": {
    "status": "active",
    "processing_limit_monthly": 5000000,
    "pricing": { "mdr_credit": 2.5, "mdr_debit": 1.5 }
  }
}`,
  },
  {
    id: "registro-recebiveis",
    name: "Registro de Recebíveis",
    description:
      "Obrigação regulatória (Circular BCB 3.952) de registro de todos os recebíveis de arranjos de pagamento em registradoras autorizadas pelo Banco Central, criando transparência e permitindo uso como garantia de crédito.",
    layer: "settlement",
    category: "Regulatório",
    complexity: "critical",
    actors: ["Adquirente", "Sub-adquirente", "Registradora (CIP/TAG/CERC)", "Banco Central", "Merchant"],
    metricsImpacted: ["Compliance Regulatório", "Custo Operacional", "Acesso a Crédito"],
    aliases: ["Registro de Recebíveis", "Receivables Registry", "Agenda de Recebíveis", "Registro BCB"],
    dependencies: ["settlement-reconciliation", "antecipacao-recebiveis"],
    relatedFlows: [],
    relatedProblems: [],
    businessRules: [
      "Todo arranjo de pagamento deve registrar recebíveis em registradora autorizada pelo BCB",
      "Registradoras autorizadas: CIP (Câmara Interbancária de Pagamentos), TAG e CERC",
      "Merchant pode usar agenda registrada como garantia para crédito em qualquer instituição financeira",
    ],
    technicalRequirements: [
      "Integração com APIs das registradoras (CIP, TAG, CERC) para registro diário de agenda",
      "Sistema de geração de arquivo de recebíveis no formato padrão da registradora",
      "Consulta de agenda livre e gravada para validação antes de antecipação",
      "Reconciliação diária entre agenda interna e registro na registradora",
      "API para merchants consultarem sua agenda registrada",
    ],
    payloadExample: `{
  "type": "receivables_registration",
  "registrar": "CIP",
  "acquirer": "Stone",
  "merchant": {
    "cnpj": "12.345.678/0001-90",
    "name": "Loja Example"
  },
  "receivables": [
    {
      "settlement_date": "2026-04-20",
      "amount": 50000,
      "card_brand": "visa",
      "status": "free",
      "unit_id": "UR_001_20260420"
    },
    {
      "settlement_date": "2026-05-20",
      "amount": 50000,
      "card_brand": "mastercard",
      "status": "pledged",
      "pledged_to": "Banco XP",
      "unit_id": "UR_002_20260520"
    }
  ],
  "registration_confirmation": {
    "protocol": "CIP_REG_20260321_001",
    "timestamp": "2026-03-21T03:00:00Z"
  }
}`,
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
