/**
 * Dados Mock de Eventos e Métricas — Payments Knowledge System
 *
 * Eventos de pagamento simulados e métricas de dashboard usados pelas
 * páginas de observabilidade (Dashboard de Pagamentos e Explorador de Eventos).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaymentEvent {
  id: string;
  type: string;
  status: "success" | "failed" | "pending";
  paymentId: string;
  amount: number;
  currency: string;
  timestamp: string;
  merchant: string;
  paymentMethod: string;
  description: string;
  payload: Record<string, unknown>;
}

export interface DashboardMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down";
  trendDelta: number;
  previousValue: number;
  sparklineData: number[];
}

export interface BreakdownItem {
  label: string;
  value: number;
  percentage: number;
}

export interface DashboardBreakdown {
  title: string;
  items: BreakdownItem[];
}

// ---------------------------------------------------------------------------
// Métricas do Dashboard
// ---------------------------------------------------------------------------

export const DASHBOARD_METRICS: DashboardMetric[] = [
  {
    id: "authorization-rate",
    name: "Taxa de Autorização",
    value: 92.4,
    unit: "%",
    trend: "up",
    trendDelta: 1.2,
    previousValue: 91.2,
    sparklineData: [88, 89, 90, 89.5, 91, 90.8, 91.2, 92, 91.8, 92.4],
  },
  {
    id: "conversion-rate",
    name: "Taxa de Conversão",
    value: 78.3,
    unit: "%",
    trend: "up",
    trendDelta: 2.1,
    previousValue: 76.2,
    sparklineData: [73, 74, 75, 74.5, 76, 75.8, 76.2, 77, 78, 78.3],
  },
  {
    id: "fraud-rate",
    name: "Taxa de Fraude",
    value: 0.42,
    unit: "%",
    trend: "down",
    trendDelta: -0.08,
    previousValue: 0.50,
    sparklineData: [0.6, 0.58, 0.55, 0.53, 0.50, 0.48, 0.47, 0.45, 0.43, 0.42],
  },
  {
    id: "chargeback-rate",
    name: "Taxa de Chargeback",
    value: 0.18,
    unit: "%",
    trend: "down",
    trendDelta: -0.03,
    previousValue: 0.21,
    sparklineData: [0.28, 0.26, 0.25, 0.24, 0.22, 0.21, 0.20, 0.19, 0.18, 0.18],
  },
];

// ---------------------------------------------------------------------------
// Breakdowns do Dashboard
// ---------------------------------------------------------------------------

export const BREAKDOWN_BY_METHOD: DashboardBreakdown = {
  title: "Por Método de Pagamento",
  items: [
    { label: "Cartão de Crédito", value: 45200, percentage: 52 },
    { label: "Cartão de Débito", value: 18700, percentage: 22 },
    { label: "PIX", value: 12400, percentage: 14 },
    { label: "Boleto", value: 5600, percentage: 6 },
    { label: "Carteira Digital", value: 3200, percentage: 4 },
    { label: "Outros", value: 1700, percentage: 2 },
  ],
};

export const BREAKDOWN_BY_REGION: DashboardBreakdown = {
  title: "Por Região",
  items: [
    { label: "Sudeste", value: 42300, percentage: 49 },
    { label: "Sul", value: 15600, percentage: 18 },
    { label: "Nordeste", value: 13400, percentage: 15 },
    { label: "Centro-Oeste", value: 8700, percentage: 10 },
    { label: "Norte", value: 6800, percentage: 8 },
  ],
};

export const BREAKDOWN_BY_ACQUIRER: DashboardBreakdown = {
  title: "Por Adquirente",
  items: [
    { label: "Cielo", value: 31200, percentage: 36 },
    { label: "Rede", value: 22100, percentage: 25 },
    { label: "Stone", value: 16800, percentage: 19 },
    { label: "PagSeguro", value: 9400, percentage: 11 },
    { label: "Getnet", value: 7300, percentage: 9 },
  ],
};

// ---------------------------------------------------------------------------
// Eventos de Pagamento Mock
// ---------------------------------------------------------------------------

export const MOCK_EVENTS: PaymentEvent[] = [
  {
    id: "evt_001",
    type: "payment.created",
    status: "success",
    paymentId: "pay_8f3a2b1c",
    amount: 249.90,
    currency: "BRL",
    timestamp: "2026-03-06T14:32:01.234Z",
    merchant: "Loja Virtual ABC",
    paymentMethod: "credit_card",
    description: "Pagamento criado via cartão de crédito",
    payload: {
      payment_id: "pay_8f3a2b1c",
      amount: 24990,
      currency: "BRL",
      method: "credit_card",
      card: { brand: "visa", last4: "4242", exp_month: 12, exp_year: 2027 },
      customer: { id: "cus_a1b2c3", email: "cliente@email.com" },
      metadata: { order_id: "order_12345" },
    },
  },
  {
    id: "evt_002",
    type: "payment.authorized",
    status: "success",
    paymentId: "pay_8f3a2b1c",
    amount: 249.90,
    currency: "BRL",
    timestamp: "2026-03-06T14:32:02.567Z",
    merchant: "Loja Virtual ABC",
    paymentMethod: "credit_card",
    description: "Pagamento autorizado pelo emissor",
    payload: {
      payment_id: "pay_8f3a2b1c",
      authorization_code: "AUTH_789456",
      acquirer: "Cielo",
      response_code: "00",
      response_message: "Aprovado",
      nsu: "123456789",
    },
  },
  {
    id: "evt_003",
    type: "payment.captured",
    status: "success",
    paymentId: "pay_8f3a2b1c",
    amount: 249.90,
    currency: "BRL",
    timestamp: "2026-03-06T14:32:05.890Z",
    merchant: "Loja Virtual ABC",
    paymentMethod: "credit_card",
    description: "Pagamento capturado com sucesso",
    payload: {
      payment_id: "pay_8f3a2b1c",
      captured_amount: 24990,
      capture_type: "full",
      settlement_date: "2026-03-08",
    },
  },
  {
    id: "evt_004",
    type: "payment.created",
    status: "success",
    paymentId: "pay_d4e5f6a7",
    amount: 1580.00,
    currency: "BRL",
    timestamp: "2026-03-06T14:28:15.112Z",
    merchant: "Tech Store Online",
    paymentMethod: "credit_card",
    description: "Pagamento criado via cartão de crédito",
    payload: {
      payment_id: "pay_d4e5f6a7",
      amount: 158000,
      currency: "BRL",
      method: "credit_card",
      card: { brand: "mastercard", last4: "5678", exp_month: 8, exp_year: 2028 },
      installments: 3,
    },
  },
  {
    id: "evt_005",
    type: "payment.declined",
    status: "failed",
    paymentId: "pay_d4e5f6a7",
    amount: 1580.00,
    currency: "BRL",
    timestamp: "2026-03-06T14:28:16.445Z",
    merchant: "Tech Store Online",
    paymentMethod: "credit_card",
    description: "Pagamento recusado pelo emissor — saldo insuficiente",
    payload: {
      payment_id: "pay_d4e5f6a7",
      decline_code: "51",
      decline_reason: "Saldo insuficiente",
      acquirer: "Rede",
      retry_eligible: true,
    },
  },
  {
    id: "evt_006",
    type: "payment.created",
    status: "success",
    paymentId: "pay_b9c0d1e2",
    amount: 89.90,
    currency: "BRL",
    timestamp: "2026-03-06T14:25:30.778Z",
    merchant: "Farmácia Saúde",
    paymentMethod: "pix",
    description: "Pagamento via PIX criado",
    payload: {
      payment_id: "pay_b9c0d1e2",
      amount: 8990,
      currency: "BRL",
      method: "pix",
      pix: { qr_code: "00020126...", expiration: "2026-03-06T14:55:30Z" },
    },
  },
  {
    id: "evt_007",
    type: "payment.authorized",
    status: "pending",
    paymentId: "pay_b9c0d1e2",
    amount: 89.90,
    currency: "BRL",
    timestamp: "2026-03-06T14:26:45.321Z",
    merchant: "Farmácia Saúde",
    paymentMethod: "pix",
    description: "Aguardando confirmação do PIX",
    payload: {
      payment_id: "pay_b9c0d1e2",
      status: "pending",
      pix_end_to_end_id: "E123456789202603061426",
      expires_at: "2026-03-06T14:55:30Z",
    },
  },
  {
    id: "evt_008",
    type: "refund.created",
    status: "success",
    paymentId: "pay_f3g4h5i6",
    amount: 320.00,
    currency: "BRL",
    timestamp: "2026-03-06T14:20:10.654Z",
    merchant: "Moda Express",
    paymentMethod: "credit_card",
    description: "Reembolso total criado",
    payload: {
      payment_id: "pay_f3g4h5i6",
      refund_id: "ref_x1y2z3",
      refund_amount: 32000,
      refund_type: "full",
      reason: "customer_request",
      original_amount: 32000,
    },
  },
  {
    id: "evt_009",
    type: "refund.processed",
    status: "success",
    paymentId: "pay_f3g4h5i6",
    amount: 320.00,
    currency: "BRL",
    timestamp: "2026-03-06T14:20:12.987Z",
    merchant: "Moda Express",
    paymentMethod: "credit_card",
    description: "Reembolso processado com sucesso",
    payload: {
      payment_id: "pay_f3g4h5i6",
      refund_id: "ref_x1y2z3",
      acquirer_refund_id: "ACQ_REF_456",
      estimated_arrival: "2026-03-13",
    },
  },
  {
    id: "evt_010",
    type: "chargeback.opened",
    status: "failed",
    paymentId: "pay_j7k8l9m0",
    amount: 450.00,
    currency: "BRL",
    timestamp: "2026-03-06T14:15:22.111Z",
    merchant: "Eletrônicos Plus",
    paymentMethod: "credit_card",
    description: "Chargeback aberto — transação não reconhecida",
    payload: {
      payment_id: "pay_j7k8l9m0",
      chargeback_id: "chb_abc123",
      reason_code: "10.4",
      reason: "Transação não reconhecida pelo portador",
      deadline: "2026-04-05",
      amount: 45000,
      card_brand: "visa",
    },
  },
  {
    id: "evt_011",
    type: "payment.created",
    status: "success",
    paymentId: "pay_n1o2p3q4",
    amount: 59.90,
    currency: "BRL",
    timestamp: "2026-03-06T14:12:05.432Z",
    merchant: "Assinatura Digital",
    paymentMethod: "credit_card",
    description: "Cobrança recorrente criada",
    payload: {
      payment_id: "pay_n1o2p3q4",
      amount: 5990,
      currency: "BRL",
      method: "credit_card",
      recurring: true,
      subscription_id: "sub_monthly_001",
      billing_cycle: "monthly",
    },
  },
  {
    id: "evt_012",
    type: "payment.authorized",
    status: "success",
    paymentId: "pay_n1o2p3q4",
    amount: 59.90,
    currency: "BRL",
    timestamp: "2026-03-06T14:12:06.789Z",
    merchant: "Assinatura Digital",
    paymentMethod: "credit_card",
    description: "Cobrança recorrente autorizada",
    payload: {
      payment_id: "pay_n1o2p3q4",
      authorization_code: "AUTH_RECUR_001",
      acquirer: "Stone",
      response_code: "00",
      network_token_used: true,
    },
  },
  {
    id: "evt_013",
    type: "payment.failed",
    status: "failed",
    paymentId: "pay_r5s6t7u8",
    amount: 2300.00,
    currency: "BRL",
    timestamp: "2026-03-06T14:08:33.210Z",
    merchant: "Viagens Express",
    paymentMethod: "credit_card",
    description: "Falha na autenticação 3DS — timeout",
    payload: {
      payment_id: "pay_r5s6t7u8",
      error_code: "3ds_timeout",
      error_message: "Autenticação 3DS expirou após 5 minutos",
      acquirer: "PagSeguro",
      threeds_version: "2.2.0",
    },
  },
  {
    id: "evt_014",
    type: "chargeback.evidence_submitted",
    status: "pending",
    paymentId: "pay_v9w0x1y2",
    amount: 189.90,
    currency: "BRL",
    timestamp: "2026-03-06T14:05:18.876Z",
    merchant: "Marketplace Central",
    paymentMethod: "credit_card",
    description: "Evidências de chargeback enviadas para análise",
    payload: {
      payment_id: "pay_v9w0x1y2",
      chargeback_id: "chb_def456",
      evidence_type: "delivery_proof",
      documents: ["tracking_number.pdf", "delivery_photo.jpg"],
      submitted_at: "2026-03-06T14:05:18Z",
    },
  },
  {
    id: "evt_015",
    type: "payment.captured",
    status: "success",
    paymentId: "pay_n1o2p3q4",
    amount: 59.90,
    currency: "BRL",
    timestamp: "2026-03-06T14:12:08.123Z",
    merchant: "Assinatura Digital",
    paymentMethod: "credit_card",
    description: "Cobrança recorrente capturada",
    payload: {
      payment_id: "pay_n1o2p3q4",
      captured_amount: 5990,
      capture_type: "full",
      settlement_date: "2026-03-08",
      recurring: true,
    },
  },
  {
    id: "evt_016",
    type: "refund.failed",
    status: "failed",
    paymentId: "pay_z3a4b5c6",
    amount: 750.00,
    currency: "BRL",
    timestamp: "2026-03-06T14:00:45.543Z",
    merchant: "Loja Virtual ABC",
    paymentMethod: "debit_card",
    description: "Reembolso falhou — prazo expirado",
    payload: {
      payment_id: "pay_z3a4b5c6",
      refund_id: "ref_failed_001",
      error_code: "refund_window_expired",
      error_message: "Prazo para reembolso expirado (> 120 dias)",
      original_date: "2025-10-15",
    },
  },
  {
    id: "evt_017",
    type: "payment.created",
    status: "success",
    paymentId: "pay_d7e8f9g0",
    amount: 42.50,
    currency: "BRL",
    timestamp: "2026-03-06T13:55:12.890Z",
    merchant: "Delivery Rápido",
    paymentMethod: "debit_card",
    description: "Pagamento criado via cartão de débito",
    payload: {
      payment_id: "pay_d7e8f9g0",
      amount: 4250,
      currency: "BRL",
      method: "debit_card",
      card: { brand: "elo", last4: "9012", exp_month: 3, exp_year: 2029 },
    },
  },
  {
    id: "evt_018",
    type: "payment.authorized",
    status: "success",
    paymentId: "pay_d7e8f9g0",
    amount: 42.50,
    currency: "BRL",
    timestamp: "2026-03-06T13:55:14.210Z",
    merchant: "Delivery Rápido",
    paymentMethod: "debit_card",
    description: "Pagamento com débito autorizado",
    payload: {
      payment_id: "pay_d7e8f9g0",
      authorization_code: "AUTH_DEB_002",
      acquirer: "Getnet",
      response_code: "00",
      response_message: "Aprovado",
    },
  },
];

// ---------------------------------------------------------------------------
// Tipos de Evento (para filtros)
// ---------------------------------------------------------------------------

export const EVENT_TYPES = [
  "payment.created",
  "payment.authorized",
  "payment.captured",
  "payment.declined",
  "payment.failed",
  "refund.created",
  "refund.processed",
  "refund.failed",
  "chargeback.opened",
  "chargeback.evidence_submitted",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

// ---------------------------------------------------------------------------
// Labels em português para tipos de evento
// ---------------------------------------------------------------------------

export const EVENT_TYPE_LABELS: Record<string, string> = {
  "payment.created": "Pagamento Criado",
  "payment.authorized": "Pagamento Autorizado",
  "payment.captured": "Pagamento Capturado",
  "payment.declined": "Pagamento Recusado",
  "payment.failed": "Pagamento Falhou",
  "refund.created": "Reembolso Criado",
  "refund.processed": "Reembolso Processado",
  "refund.failed": "Reembolso Falhou",
  "chargeback.opened": "Chargeback Aberto",
  "chargeback.evidence_submitted": "Evidência de Chargeback",
};
