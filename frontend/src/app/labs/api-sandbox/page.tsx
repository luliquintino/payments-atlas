"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Operation =
  | "create_payment"
  | "authorize"
  | "capture"
  | "void_payment"
  | "refund"
  | "partial_capture"
  | "three_ds_init"
  | "tokenize";

interface OperationDef {
  label: string;
  method: string;
  path: string;
  template: string;
  requiredFields: string[];
  explanation: string;
}

interface ChaosError {
  title: string;
  description: string;
  howToHandle: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const OPERATIONS: Record<Operation, OperationDef> = {
  create_payment: {
    label: "Create Payment",
    method: "POST",
    path: "/v1/payments",
    requiredFields: ["amount", "currency", "payment_method"],
    template: JSON.stringify(
      {
        amount: 15000,
        currency: "BRL",
        payment_method: {
          type: "credit_card",
          card: {
            number: "4111111111111111",
            exp_month: 12,
            exp_year: 2027,
            cvv: "123",
            holder_name: "JOAO SILVA",
          },
          installments: 1,
        },
        customer: {
          name: "Joao Silva",
          email: "joao@email.com",
          document: "12345678900",
        },
        capture: true,
        metadata: { order_id: "ORD-12345" },
      },
      null,
      2
    ),
    explanation:
      "Cria uma nova transacao de pagamento. O gateway envia os dados ao adquirente via ISO 8583, que roteia para a bandeira e depois ao emissor. O emissor verifica saldo, limites e regras antifraude.",
  },
  authorize: {
    label: "Authorize",
    method: "POST",
    path: "/v1/payments/:id/authorize",
    requiredFields: ["amount", "currency", "payment_method"],
    template: JSON.stringify(
      {
        amount: 15000,
        currency: "BRL",
        payment_method: {
          type: "credit_card",
          card: {
            number: "4111111111111111",
            exp_month: 12,
            exp_year: 2027,
            cvv: "123",
            holder_name: "JOAO SILVA",
          },
        },
      },
      null,
      2
    ),
    explanation:
      "Autoriza o pagamento sem capturar. O valor fica reservado no cartao do cliente. Comum em hoteis, locadoras e marketplaces que precisam validar o pedido antes de cobrar efetivamente.",
  },
  capture: {
    label: "Capture",
    method: "POST",
    path: "/v1/payments/:id/capture",
    requiredFields: ["amount"],
    template: JSON.stringify(
      {
        amount: 15000,
      },
      null,
      2
    ),
    explanation:
      "Captura uma autorizacao previa, confirmando a cobranca. Em fluxos de duas etapas, primeiro autoriza-se (reserva) e depois captura-se. O prazo maximo para captura varia por adquirente (geralmente 5-30 dias).",
  },
  void_payment: {
    label: "Void",
    method: "POST",
    path: "/v1/payments/:id/void",
    requiredFields: ["reason"],
    template: JSON.stringify(
      {
        reason: "order_cancelled",
      },
      null,
      2
    ),
    explanation:
      "Cancela (void) uma autorizacao antes da captura. Diferente do estorno, o void libera o limite do cartao imediatamente. Deve ser feito antes do batch de liquidacao (geralmente ate 23h59 do mesmo dia).",
  },
  refund: {
    label: "Refund",
    method: "POST",
    path: "/v1/payments/:id/refund",
    requiredFields: ["amount"],
    template: JSON.stringify(
      {
        amount: 15000,
        reason: "customer_request",
      },
      null,
      2
    ),
    explanation:
      "Estorna total ou parcialmente uma transacao capturada. O valor retorna ao cartao do cliente em 5-10 dias uteis. Estornos parciais sao comuns em devolucoes de itens especificos.",
  },
  partial_capture: {
    label: "Partial Capture",
    method: "POST",
    path: "/v1/payments/:id/partial-capture",
    requiredFields: ["amount"],
    template: JSON.stringify(
      {
        amount: 8000,
        final: true,
      },
      null,
      2
    ),
    explanation:
      "Captura parcial de uma autorizacao. Util quando o valor final e menor que o autorizado (ex: item indisponivel). O campo 'final' indica se e a ultima captura parcial.",
  },
  three_ds_init: {
    label: "3DS Initialize",
    method: "POST",
    path: "/v1/3ds/initialize",
    requiredFields: ["payment_id", "callback_url"],
    template: JSON.stringify(
      {
        payment_id: "pay_abc123def456",
        callback_url: "https://loja.com/3ds/callback",
        browser_info: {
          accept_header: "text/html",
          java_enabled: false,
          language: "pt-BR",
          screen_height: 1080,
          screen_width: 1920,
          timezone_offset: -180,
          user_agent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        },
      },
      null,
      2
    ),
    explanation:
      "Inicializa o fluxo de autenticacao 3D Secure 2.0. O emissor avalia o risco da transacao e decide se exige challenge (interacao do portador) ou se aprova via frictionless flow. Reduz chargebacks e transfere liability.",
  },
  tokenize: {
    label: "Tokenize Card",
    method: "POST",
    path: "/v1/tokens/create",
    requiredFields: ["card"],
    template: JSON.stringify(
      {
        card: {
          number: "4111111111111111",
          exp_month: 12,
          exp_year: 2027,
          cvv: "123",
          holder_name: "JOAO SILVA",
        },
        customer_id: "cus_abc123",
      },
      null,
      2
    ),
    explanation:
      "Tokeniza os dados do cartao para uso futuro, eliminando a necessidade de armazenar dados sensiveis (PCI DSS compliance). O token pode ser reutilizado em cobrancas recorrentes e one-click checkout.",
  },
};

const OP_KEYS: Operation[] = [
  "create_payment",
  "authorize",
  "capture",
  "void_payment",
  "refund",
  "partial_capture",
  "three_ds_init",
  "tokenize",
];

const MASTERY_STORAGE_KEY = "pks-api-sandbox-mastery";

const STATUS_COLORS: Record<number, { bg: string; fg: string; label: string }> = {
  200: { bg: "#065f4620", fg: "#10B981", label: "200 OK" },
  201: { bg: "#065f4620", fg: "#10B981", label: "201 Created" },
  400: { bg: "#92400e20", fg: "#FBBF24", label: "400 Bad Request" },
  401: { bg: "#9a340020", fg: "#F97316", label: "401 Unauthorized" },
  402: { bg: "#92400e20", fg: "#FBBF24", label: "402 Payment Required" },
  403: { bg: "#9a340020", fg: "#F97316", label: "403 Forbidden" },
  500: { bg: "#7f1d1d20", fg: "#EF4444", label: "500 Internal Server Error" },
  504: { bg: "#7f1d1d20", fg: "#EF4444", label: "504 Gateway Timeout" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateId(prefix: string): string {
  return prefix + "_" + Math.random().toString(36).substring(2, 15);
}

function generateAuthCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function realisticLatency(): number {
  return 180 + Math.floor(Math.random() * 400);
}

function chaosCheck(): { type: string; delay: number } | null {
  const roll = Math.random();
  if (roll < 0.10) return { type: "timeout", delay: 5000 };
  if (roll < 0.25) return { type: "insufficient_funds", delay: 0 };
  if (roll < 0.35) return { type: "stolen_card", delay: 0 };
  if (roll < 0.40) return { type: "server_error", delay: 0 };
  if (roll < 0.45) return { type: "invalid_card", delay: 0 };
  return null;
}

function chaosErrorInfo(type: string): ChaosError {
  switch (type) {
    case "timeout":
      return {
        title: "Timeout (504 Gateway Timeout)",
        description:
          "O request demorou mais de 5 segundos e o gateway cortou a conexao. Isso pode ocorrer por instabilidade na rede entre adquirente e emissor, ou sobrecarga no PSP.",
        howToHandle:
          "Implemente retry com backoff exponencial (ex: 1s, 2s, 4s). Use chave de idempotencia para evitar cobranca duplicada. Consulte o status da transacao antes de retentar.",
      };
    case "insufficient_funds":
      return {
        title: "Saldo Insuficiente (Response Code 51)",
        description:
          "O emissor recusou a transacao porque o portador nao tem saldo/limite disponivel. Codigo ISO 8583: 51 (Insufficient Funds).",
        howToHandle:
          "Informe o cliente de forma clara sem expor detalhes do cartao. Sugira outro meio de pagamento ou cartao alternativo. Nao retente automaticamente.",
      };
    case "stolen_card":
      return {
        title: "Cartao Roubado (Response Code 43)",
        description:
          "O emissor sinalizou o cartao como roubado. Codigo ISO 8583: 43 (Stolen Card). Transacao deve ser recusada imediatamente.",
        howToHandle:
          "NAO retente. Registre o evento para analise antifraude. Considere bloquear o cliente/device. Em ambientes de alto risco, notifique o time de seguranca.",
      };
    case "server_error":
      return {
        title: "Erro Interno (500 Internal Server Error)",
        description:
          "O servidor do PSP encontrou um erro inesperado ao processar o request. Pode ser bug, deploy em andamento, ou falha de dependencia interna.",
        howToHandle:
          "Implemente retry com backoff. Use circuit breaker para evitar cascading failures. Monitore taxa de erro 5xx. Escale para o suporte do PSP se persistir.",
      };
    case "invalid_card":
      return {
        title: "Cartao Invalido (Response Code 14)",
        description:
          "O numero do cartao nao e valido. Codigo ISO 8583: 14 (Invalid Card Number). Pode ser digitacao errada ou cartao cancelado.",
        howToHandle:
          "Peca ao cliente para verificar o numero digitado. Valide localmente com algoritmo de Luhn antes de enviar ao PSP. Limite tentativas para evitar BIN attacks.",
      };
    default:
      return {
        title: "Erro desconhecido",
        description: "Um erro inesperado ocorreu.",
        howToHandle: "Consulte a documentacao do PSP.",
      };
  }
}

function buildChaosResponse(
  type: string
): { status: number; body: object } {
  switch (type) {
    case "timeout":
      return {
        status: 504,
        body: {
          error: {
            code: "gateway_timeout",
            message: "O servidor nao respondeu dentro do tempo limite (5000ms)",
            request_id: generateId("req"),
          },
        },
      };
    case "insufficient_funds":
      return {
        status: 402,
        body: {
          error: {
            code: "card_declined",
            message: "Transacao recusada pelo emissor",
            decline_code: "insufficient_funds",
            response_code: "51",
            acquirer_message: "Not sufficient funds",
            request_id: generateId("req"),
          },
        },
      };
    case "stolen_card":
      return {
        status: 402,
        body: {
          error: {
            code: "card_declined",
            message: "Transacao recusada — cartao reportado como roubado",
            decline_code: "stolen_card",
            response_code: "43",
            acquirer_message: "Pick up card (stolen)",
            request_id: generateId("req"),
          },
        },
      };
    case "server_error":
      return {
        status: 500,
        body: {
          error: {
            code: "internal_server_error",
            message: "Erro interno do servidor. Tente novamente.",
            request_id: generateId("req"),
            trace_id: generateId("trace"),
          },
        },
      };
    case "invalid_card":
      return {
        status: 402,
        body: {
          error: {
            code: "card_declined",
            message: "Numero do cartao invalido",
            decline_code: "invalid_card_number",
            response_code: "14",
            acquirer_message: "Invalid card number",
            request_id: generateId("req"),
          },
        },
      };
    default:
      return {
        status: 500,
        body: { error: { code: "unknown", message: "Erro desconhecido" } },
      };
  }
}

function simulateResponse(
  operation: Operation,
  body: string
): { status: number; body: object } {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(body);
  } catch {
    return {
      status: 400,
      body: {
        error: {
          code: "invalid_json",
          message: "O corpo do request nao e um JSON valido",
          request_id: generateId("req"),
        },
      },
    };
  }

  const now = new Date().toISOString();
  const reqId = generateId("req");

  if (operation === "create_payment") {
    if (!parsed.amount || !parsed.currency || !parsed.payment_method) {
      return {
        status: 400,
        body: {
          error: {
            code: "missing_required_fields",
            message: "Campos obrigatorios: amount, currency, payment_method",
            request_id: reqId,
          },
        },
      };
    }
    const pm = parsed.payment_method as Record<string, unknown>;
    const card = pm?.card as Record<string, unknown> | undefined;
    const cardNumber = String(card?.number ?? "").replace(/\D/g, "");
    if (card && !luhnCheck(cardNumber)) {
      return {
        status: 402,
        body: {
          error: {
            code: "card_declined",
            message: "Numero do cartao invalido (falha Luhn)",
            decline_code: "invalid_card_number",
            response_code: "14",
            request_id: reqId,
          },
        },
      };
    }
    return {
      status: 201,
      body: {
        id: generateId("pay"),
        object: "payment",
        status: parsed.capture ? "captured" : "authorized",
        amount: parsed.amount,
        amount_captured: parsed.capture ? parsed.amount : 0,
        currency: parsed.currency,
        authorization_code: generateAuthCode(),
        nsu: String(Math.floor(Math.random() * 999999999)).padStart(9, "0"),
        payment_method: {
          type: "credit_card",
          last4: cardNumber.slice(-4),
          brand: cardNumber.startsWith("4") ? "visa" : cardNumber.startsWith("5") ? "mastercard" : "elo",
          installments: (pm?.installments as number) ?? 1,
        },
        customer: parsed.customer ?? null,
        metadata: parsed.metadata ?? {},
        created_at: now,
        updated_at: now,
        request_id: reqId,
      },
    };
  }

  if (operation === "authorize") {
    if (!parsed.amount || !parsed.currency || !parsed.payment_method) {
      return {
        status: 400,
        body: {
          error: {
            code: "missing_required_fields",
            message: "Campos obrigatorios: amount, currency, payment_method",
            request_id: reqId,
          },
        },
      };
    }
    const pm = parsed.payment_method as Record<string, unknown>;
    const card = pm?.card as Record<string, unknown> | undefined;
    const cardNumber = String(card?.number ?? "").replace(/\D/g, "");
    return {
      status: 201,
      body: {
        id: generateId("pay"),
        object: "payment",
        status: "authorized",
        amount: parsed.amount,
        amount_captured: 0,
        currency: parsed.currency,
        authorization_code: generateAuthCode(),
        nsu: String(Math.floor(Math.random() * 999999999)).padStart(9, "0"),
        payment_method: {
          type: "credit_card",
          last4: cardNumber.slice(-4),
          brand: cardNumber.startsWith("4") ? "visa" : "mastercard",
        },
        expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        created_at: now,
        updated_at: now,
        request_id: reqId,
      },
    };
  }

  if (operation === "capture") {
    if (!parsed.amount) {
      return {
        status: 400,
        body: {
          error: {
            code: "missing_required_fields",
            message: "Campo obrigatorio: amount",
            request_id: reqId,
          },
        },
      };
    }
    return {
      status: 200,
      body: {
        id: "pay_abc123def456",
        object: "payment",
        status: "captured",
        amount: parsed.amount,
        amount_captured: parsed.amount,
        captured_at: now,
        settlement_date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
        updated_at: now,
        request_id: reqId,
      },
    };
  }

  if (operation === "void_payment") {
    return {
      status: 200,
      body: {
        id: "pay_abc123def456",
        object: "payment",
        status: "voided",
        reason: parsed.reason ?? "order_cancelled",
        voided_at: now,
        updated_at: now,
        request_id: reqId,
      },
    };
  }

  if (operation === "refund") {
    return {
      status: 200,
      body: {
        id: generateId("ref"),
        object: "refund",
        payment_id: "pay_abc123def456",
        status: "pending",
        amount: parsed.amount ?? 15000,
        reason: parsed.reason ?? "customer_request",
        estimated_arrival: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
        created_at: now,
        request_id: reqId,
      },
    };
  }

  if (operation === "partial_capture") {
    return {
      status: 200,
      body: {
        id: "pay_abc123def456",
        object: "payment",
        status: parsed.final ? "captured" : "partially_captured",
        amount_authorized: 15000,
        amount_captured: parsed.amount ?? 8000,
        amount_remaining: 15000 - ((parsed.amount as number) ?? 8000),
        is_final_capture: parsed.final ?? false,
        captured_at: now,
        updated_at: now,
        request_id: reqId,
      },
    };
  }

  if (operation === "three_ds_init") {
    if (!parsed.payment_id || !parsed.callback_url) {
      return {
        status: 400,
        body: {
          error: {
            code: "missing_required_fields",
            message: "Campos obrigatorios: payment_id, callback_url",
            request_id: reqId,
          },
        },
      };
    }
    const encodedData = typeof btoa === "function"
      ? btoa(JSON.stringify({ threeDSServerTransID: generateId("tds") }))
      : "base64encodeddata";
    return {
      status: 200,
      body: {
        id: generateId("3ds"),
        object: "three_d_secure",
        payment_id: parsed.payment_id,
        status: "challenge_required",
        acs_url: "https://acs.banco-emissor.com.br/3ds/challenge",
        creq: encodedData,
        protocol_version: "2.2.0",
        ds_transaction_id: generateId("ds"),
        eci: "05",
        created_at: now,
        expires_at: new Date(Date.now() + 300000).toISOString(),
        request_id: reqId,
      },
    };
  }

  // tokenize
  if (!parsed.card) {
    return {
      status: 400,
      body: {
        error: {
          code: "missing_required_fields",
          message: "Campo obrigatorio: card",
          request_id: reqId,
        },
      },
    };
  }
  const card = parsed.card as Record<string, unknown>;
  const cardNumber = String(card?.number ?? "").replace(/\D/g, "");
  return {
    status: 201,
    body: {
      id: generateId("tok"),
      object: "token",
      card: {
        last4: cardNumber.slice(-4),
        brand: cardNumber.startsWith("4") ? "visa" : "mastercard",
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        holder_name: card.holder_name,
        fingerprint: generateId("fp"),
      },
      customer_id: parsed.customer_id ?? null,
      type: "card",
      used: false,
      created_at: now,
      request_id: reqId,
    },
  };
}

// ---------------------------------------------------------------------------
// Syntax coloring helpers (all internal data, no user HTML)
// ---------------------------------------------------------------------------
function colorizeJsonLine(line: string): string {
  // This only processes our own JSON.stringify output — no external data
  return line.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let color = "#B5CEA8"; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          color = "#9CDCFE"; // key
        } else {
          color = "#CE9178"; // string
        }
      } else if (/true|false/.test(match)) {
        color = "#569CD6";
      } else if (/null/.test(match)) {
        color = "#569CD6";
      }
      return '<span style="color:' + color + '">' + match + "</span>";
    }
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function APISandbox() {
  const [operation, setOperation] = useState<Operation>("create_payment");
  const [requestBody, setRequestBody] = useState(OPERATIONS.create_payment.template);
  const [response, setResponse] = useState<{
    status: number;
    body: object;
    time: number;
    chaosError?: ChaosError;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [mastery, setMastery] = useState<Record<string, boolean>>({});
  const [showXpToast, setShowXpToast] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { recordQuiz, visitPage } = useGameProgress();
  const [xpAwarded, setXpAwarded] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load mastery from localStorage
  useEffect(() => {
    visitPage("/labs/api-sandbox");
    try {
      const saved = localStorage.getItem(MASTERY_STORAGE_KEY);
      if (saved) setMastery(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, [visitPage]);

  // Save mastery
  const saveMastery = useCallback(
    (updated: Record<string, boolean>) => {
      setMastery(updated);
      try {
        localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    },
    []
  );

  const opDef = OPERATIONS[operation];
  const completedCount = OP_KEYS.filter((k) => mastery[k]).length;
  const allComplete = completedCount === 8;

  // Validate request body
  useEffect(() => {
    try {
      const parsed = JSON.parse(requestBody);
      const missing = opDef.requiredFields.filter((f) => {
        return parsed[f] === undefined || parsed[f] === null;
      });
      setValidationErrors(missing);
    } catch {
      setValidationErrors(["JSON invalido"]);
    }
  }, [requestBody, opDef.requiredFields]);

  const handleOperationChange = useCallback((op: Operation) => {
    setOperation(op);
    setRequestBody(OPERATIONS[op].template);
    setResponse(null);
    setValidationErrors([]);
  }, []);

  const handleReset = useCallback(() => {
    setRequestBody(opDef.template);
    setResponse(null);
    setValidationErrors([]);
  }, [opDef.template]);

  const handleSend = useCallback(() => {
    setLoading(true);
    setResponse(null);

    // Check chaos
    if (chaosMode) {
      const chaos = chaosCheck();
      if (chaos) {
        const delay = chaos.delay || realisticLatency();
        setTimeout(() => {
          const chaosResp = buildChaosResponse(chaos.type);
          setResponse({
            status: chaosResp.status,
            body: chaosResp.body,
            time: delay,
            chaosError: chaosErrorInfo(chaos.type),
          });
          setLoading(false);
        }, Math.min(delay, 5000));
        return;
      }
    }

    const delay = realisticLatency();
    setTimeout(() => {
      const result = simulateResponse(operation, requestBody);
      setResponse({ ...result, time: delay });
      setLoading(false);

      // Mastery tracking
      if (result.status >= 200 && result.status < 300) {
        if (!mastery[operation]) {
          const updated = { ...mastery, [operation]: true };
          saveMastery(updated);

          // XP
          if (!xpAwarded) {
            recordQuiz("/labs/api-sandbox", 1, 1, 15);
            setXpAwarded(true);
            setShowXpToast("+15 XP — Primeiro request!");
          } else {
            recordQuiz("/labs/api-sandbox-" + operation, 1, 1, 5);
            setShowXpToast("+5 XP — Novo endpoint!");
          }

          // Check all complete
          const newCount = OP_KEYS.filter((k) => updated[k]).length;
          if (newCount === 8) {
            recordQuiz("/labs/api-sandbox-master", 1, 1, 10);
            setTimeout(() => {
              setShowXpToast("+10 XP — API Master desbloqueado!");
            }, 2000);
          }

          setTimeout(() => setShowXpToast(null), 3500);
        }
      }
    }, delay);
  }, [operation, requestBody, chaosMode, mastery, saveMastery, xpAwarded, recordQuiz]);

  const statusInfo = response
    ? STATUS_COLORS[response.status] ?? {
        bg: "#6B728020",
        fg: "#6B7280",
        label: String(response.status),
      }
    : null;

  // Build colorized response (all internal data from simulateResponse)
  const responseJson = response ? JSON.stringify(response.body, null, 2) : "";
  const responseDisplayLines = responseJson
    ? responseJson.split("\n").map((line, i) => {
        const num = String(i + 1).padStart(3, " ");
        const lineNumSpan = '<span style="color:#858585;user-select:none">' + num + "  </span>";
        return lineNumSpan + colorizeJsonLine(line);
      })
    : [];
  const responseHtml = responseDisplayLines.join("\n");

  // Request line numbers for editor
  const requestLines = requestBody.split("\n");
  const lineNumbersText = requestLines.map((_, i) => String(i + 1)).join("\n");

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* XP Toast */}
      {showXpToast && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            background: "#10B981",
            color: "white",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            fontWeight: 700,
            fontSize: "0.85rem",
            zIndex: 999,
            boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
          }}
        >
          {showXpToast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/labs"
          style={{
            color: "var(--primary)",
            fontSize: "0.8rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            marginBottom: "0.75rem",
          }}
        >
          &larr; Labs
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--foreground)",
                marginBottom: "0.375rem",
              }}
            >
              Sandbox de API
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Construa requests, teste validacoes e entenda cada etapa do fluxo de pagamento.
            </p>
          </div>
          {/* Chaos Mode Toggle */}
          <button
            onClick={() => setChaosMode(!chaosMode)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.75rem",
              border: chaosMode ? "2px solid #EF4444" : "1px solid var(--border)",
              background: chaosMode ? "#7f1d1d30" : "var(--surface)",
              color: chaosMode ? "#EF4444" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "36px",
                height: "20px",
                borderRadius: "10px",
                background: chaosMode ? "#EF4444" : "#4B5563",
                position: "relative",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: "2px",
                  left: chaosMode ? "18px" : "2px",
                  transition: "left 0.2s",
                }}
              />
            </span>
            {chaosMode ? "Modo Caos" : "Modo Normal"}
          </button>
        </div>
      </div>

      {/* Operation tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.375rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        {OP_KEYS.map((op) => {
          const d = OPERATIONS[op];
          const active = op === operation;
          const done = mastery[op];
          return (
            <button
              key={op}
              onClick={() => handleOperationChange(op)}
              style={{
                padding: "0.375rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                border: active ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                background: active ? "var(--primary-bg)" : "var(--surface)",
                color: active ? "var(--primary)" : "var(--foreground)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "#10B981",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}
              >
                {d.method}
              </span>
              {d.label}
              {done && (
                <span style={{ color: "#10B981", fontSize: "0.7rem" }}>{"\u2713"}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Top row: editor + response */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: "1rem",
          }}
        >
          {/* ---- LEFT: Request Editor ---- */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Endpoint bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid #2e2e2e",
                background: "#1e1e1e",
              }}
            >
              <span
                style={{
                  padding: "0.2rem 0.5rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "white",
                  background: "#10B981",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}
              >
                {opDef.method}
              </span>
              <code
                style={{
                  fontSize: "0.8rem",
                  color: "#9CDCFE",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}
              >
                {opDef.path}
              </code>
              <div style={{ flex: 1 }} />
              <button
                onClick={handleReset}
                style={{
                  fontSize: "0.65rem",
                  color: "#858585",
                  background: "none",
                  border: "1px solid #3e3e3e",
                  borderRadius: "0.25rem",
                  padding: "0.2rem 0.5rem",
                  cursor: "pointer",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}
              >
                Resetar
              </button>
            </div>

            {/* Validation bar */}
            {validationErrors.length > 0 && (
              <div
                style={{
                  padding: "0.375rem 1rem",
                  background: "#92400e15",
                  borderBottom: "1px solid #92400e30",
                  fontSize: "0.7rem",
                  color: "#FBBF24",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}
              >
                {validationErrors[0] === "JSON invalido"
                  ? "JSON invalido"
                  : "Campos obrigatorios faltando: " + validationErrors.join(", ")}
              </div>
            )}

            {/* Code editor area */}
            <div
              style={{
                position: "relative",
                flex: 1,
                minHeight: "320px",
                background: "#1e1e1e",
                display: "flex",
              }}
            >
              {/* Line numbers column */}
              <pre
                aria-hidden="true"
                style={{
                  margin: "0",
                  padding: "0.75rem 0.5rem",
                  fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                  fontSize: "0.8rem",
                  lineHeight: "1.5",
                  color: "#858585",
                  textAlign: "right",
                  userSelect: "none",
                  pointerEvents: "none",
                  borderRight: "1px solid #2e2e2e",
                  background: "#1a1a1a",
                  minWidth: "3rem",
                  flexShrink: 0,
                }}
              >
                {lineNumbersText}
              </pre>
              <textarea
                ref={textareaRef}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                spellCheck={false}
                style={{
                  flex: 1,
                  margin: "0",
                  padding: "0.75rem",
                  fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                  fontSize: "0.8rem",
                  lineHeight: "1.5",
                  background: "transparent",
                  color: "#D4D4D4",
                  border: "none",
                  resize: "none",
                  outline: "none",
                  display: "block",
                  boxSizing: "border-box",
                  minHeight: "320px",
                }}
              />
            </div>

            {/* Send button */}
            <div
              style={{
                padding: "0.75rem 1rem",
                borderTop: "1px solid #2e2e2e",
                background: "#1e1e1e",
              }}
            >
              <button
                onClick={handleSend}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.625rem",
                  borderRadius: "0.5rem",
                  background: loading ? "#3e3e3e" : "var(--primary)",
                  color: loading ? "#858585" : "white",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  margin: "0",
                }}
              >
                {loading ? "Enviando..." : "Enviar Request"}
              </button>
            </div>

            {/* Required fields legend */}
            <div
              style={{
                padding: "0.5rem 1rem",
                borderTop: "1px solid #2e2e2e",
                background: "#1a1a1a",
                fontSize: "0.65rem",
                color: "#858585",
              }}
            >
              <span style={{ fontWeight: 700, color: "#9CDCFE" }}>
                Campos obrigatorios:
              </span>{" "}
              {opDef.requiredFields.join(", ")}
            </div>
          </div>

          {/* ---- RIGHT: Response Panel ---- */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Response header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid var(--border)",
                background: "var(--background)",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Response
              </span>
              {response && statusInfo && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: statusInfo.fg,
                      background: statusInfo.bg,
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                    }}
                  >
                    {statusInfo.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-secondary)",
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                    }}
                  >
                    Resposta em {response.time}ms
                  </span>
                </div>
              )}
            </div>

            {/* Response body */}
            <div style={{ flex: 1, padding: "0.75rem 1rem", overflow: "auto" }}>
              {!response && !loading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "300px",
                    color: "var(--text-secondary)",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "2rem", opacity: 0.5 }}>{"{ }"}</span>
                  <span style={{ fontSize: "0.85rem" }}>
                    Envie um request para ver a resposta
                  </span>
                </div>
              ) : loading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "300px",
                    color: "var(--text-secondary)",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      border: "2.5px solid var(--border)",
                      borderTopColor: "var(--primary)",
                      borderRadius: "50%",
                      animation: "pks-spin 0.8s linear infinite",
                    }}
                  />
                  <span style={{ fontSize: "0.8rem" }}>
                    {chaosMode ? "Processando (modo caos ativo)..." : "Processando..."}
                  </span>
                  <style>{`@keyframes pks-spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <>
                  {/* Colorized response — content is entirely from our own simulateResponse */}
                  <pre
                    dangerouslySetInnerHTML={{ __html: responseHtml }}
                    style={{
                      fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                      fontSize: "0.75rem",
                      lineHeight: "1.5",
                      background: "#1e1e1e",
                      color: "#D4D4D4",
                      border: "1px solid #2e2e2e",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      overflow: "auto",
                      maxHeight: "300px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      margin: "0",
                    }}
                  />

                  {/* Headers collapsible */}
                  <div style={{ marginTop: "0.75rem" }}>
                    <button
                      onClick={() => setShowHeaders(!showHeaders)}
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--primary)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        padding: "0",
                        margin: "0",
                      }}
                    >
                      {showHeaders ? "\u25BE" : "\u25B8"} Response Headers
                    </button>
                    {showHeaders && (
                      <div
                        style={{
                          marginTop: "0.375rem",
                          padding: "0.5rem 0.75rem",
                          background: "#1e1e1e",
                          borderRadius: "0.375rem",
                          fontSize: "0.65rem",
                          fontFamily: "'SF Mono', 'Fira Code', monospace",
                          color: "#858585",
                          lineHeight: "1.8",
                          border: "1px solid #2e2e2e",
                        }}
                      >
                        <div>content-type: application/json; charset=utf-8</div>
                        <div>x-request-id: {generateId("req")}</div>
                        <div>x-ratelimit-limit: 1000</div>
                        <div>x-ratelimit-remaining: {950 + Math.floor(Math.random() * 49)}</div>
                        <div>x-idempotency-key: {generateId("idem")}</div>
                        <div>x-processing-time: {response?.time}ms</div>
                      </div>
                    )}
                  </div>

                  {/* Explanation */}
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.75rem",
                      background: "var(--primary-bg)",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "var(--primary)",
                        marginBottom: "0.375rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      O que aconteceu
                    </div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        lineHeight: "1.6",
                        margin: "0",
                      }}
                    >
                      {opDef.explanation}
                    </p>
                  </div>

                  {/* Chaos error explanation */}
                  {response?.chaosError && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.75rem",
                        background: "#7f1d1d15",
                        borderRadius: "0.5rem",
                        border: "1px solid #7f1d1d40",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#EF4444",
                          marginBottom: "0.375rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Erro do Modo Caos: {response.chaosError.title}
                      </div>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-secondary)",
                          lineHeight: "1.6",
                          margin: "0 0 0.5rem 0",
                        }}
                      >
                        {response.chaosError.description}
                      </p>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#10B981",
                          marginBottom: "0.25rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Como tratar
                      </div>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-secondary)",
                          lineHeight: "1.6",
                          margin: "0",
                        }}
                      >
                        {response.chaosError.howToHandle}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Mastery checklist */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                Checklist de Mastery
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}
              >
                {completedCount}/8
              </span>
            </div>
            {allComplete && (
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "1rem",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #F59E0B, #EF4444)",
                  color: "white",
                }}
              >
                API Master
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: "6px",
              background: "var(--border)",
              borderRadius: "3px",
              marginBottom: "0.75rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: (completedCount / 8) * 100 + "%",
                height: "100%",
                background: allComplete
                  ? "linear-gradient(90deg, #10B981, #3B82F6)"
                  : "var(--primary)",
                borderRadius: "3px",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Grid of operations */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {OP_KEYS.map((op) => {
              const d = OPERATIONS[op];
              const done = mastery[op];
              return (
                <div
                  key={op}
                  onClick={() => handleOperationChange(op)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.375rem 0.5rem",
                    borderRadius: "0.375rem",
                    background: done ? "#065f4615" : "transparent",
                    border: done ? "1px solid #065f4630" : "1px solid transparent",
                    fontSize: "0.75rem",
                    color: done ? "#10B981" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      border: done ? "2px solid #10B981" : "2px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.6rem",
                      flexShrink: 0,
                      background: done ? "#10B981" : "transparent",
                      color: done ? "white" : "transparent",
                      fontWeight: 700,
                    }}
                  >
                    {done ? "\u2713" : ""}
                  </span>
                  <span
                    style={{
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      color: "#10B981",
                      opacity: done ? 1 : 0.5,
                    }}
                  >
                    POST
                  </span>
                  <span style={{ fontWeight: done ? 600 : 400 }}>{d.label}</span>
                  {done && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.6rem",
                        color: "#10B981",
                        fontWeight: 600,
                      }}
                    >
                      +5 XP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
