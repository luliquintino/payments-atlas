"use client";

import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------
type Operation = "create_payment" | "capture" | "refund" | "void" | "get_status";

interface OperationDef {
  label: string;
  method: "POST" | "GET" | "DELETE";
  path: string;
  template: string;
  explanation: string;
}

const OPERATIONS: Record<Operation, OperationDef> = {
  create_payment: {
    label: "Create Payment",
    method: "POST",
    path: "/v1/payments",
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
          name: "João Silva",
          email: "joao@email.com",
          document: "12345678900",
        },
        metadata: { order_id: "ORD-12345" },
      },
      null,
      2
    ),
    explanation:
      "Ao criar um pagamento, o gateway envia os dados do cartão ao adquirente via ISO 8583. O adquirente roteia para a bandeira, que consulta o banco emissor. O emissor verifica saldo, limites e regras antifraude antes de aprovar ou negar. Todo esse fluxo leva ~1-3 segundos.",
  },
  capture: {
    label: "Capture",
    method: "POST",
    path: "/v1/payments/{id}/capture",
    template: JSON.stringify(
      {
        amount: 15000,
      },
      null,
      2
    ),
    explanation:
      "A captura confirma uma autorização prévia. Em fluxos de duas etapas, primeiro autoriza-se o valor (reserva no cartão) e depois captura-se. Isso é comum em hotéis, locadoras e marketplaces que precisam validar o pedido antes de cobrar.",
  },
  refund: {
    label: "Refund",
    method: "POST",
    path: "/v1/payments/{id}/refund",
    template: JSON.stringify(
      {
        amount: 15000,
        reason: "customer_request",
      },
      null,
      2
    ),
    explanation:
      "O estorno reverte total ou parcialmente uma transação capturada. O valor retorna ao cartão do cliente em 5-10 dias úteis. Estornos parciais são comuns em devoluções de itens específicos em pedidos com múltiplos produtos.",
  },
  void: {
    label: "Void",
    method: "DELETE",
    path: "/v1/payments/{id}",
    template: JSON.stringify(
      {
        reason: "order_cancelled",
      },
      null,
      2
    ),
    explanation:
      "O cancelamento (void) desfaz uma autorização antes da captura. Diferente do estorno, o void libera o limite do cartão imediatamente. Deve ser feito antes do batch de liquidação (geralmente até 23h59 do mesmo dia).",
  },
  get_status: {
    label: "Get Status",
    method: "GET",
    path: "/v1/payments/{id}",
    template: "",
    explanation:
      "Consultar o status permite verificar o estado atual de uma transação. Útil para reconciliação, webhooks perdidos e debugging. Cada PSP define seus próprios status codes — mapear para status internos é uma prática recomendada.",
  },
};

const METHOD_COLORS: Record<string, string> = {
  POST: "#10B981",
  GET: "#3B82F6",
  DELETE: "#EF4444",
};

const STATUS_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  200: { bg: "#10B98120", text: "#10B981", label: "200 OK" },
  201: { bg: "#10B98120", text: "#10B981", label: "201 Created" },
  400: { bg: "#EF444420", text: "#EF4444", label: "400 Bad Request" },
  402: { bg: "#F59E0B20", text: "#F59E0B", label: "402 Payment Required" },
  404: { bg: "#EF444420", text: "#EF4444", label: "404 Not Found" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
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

function generateId(): string {
  return "pay_" + Math.random().toString(36).substring(2, 15);
}

function generateAuthCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function simulateResponse(
  operation: Operation,
  body: string
): { status: number; body: object; time: number } {
  const time = 100 + Math.floor(Math.random() * 200);

  if (operation === "get_status") {
    return {
      status: 200,
      time,
      body: {
        id: "pay_abc123def456",
        status: "captured",
        amount: 15000,
        currency: "BRL",
        payment_method: { type: "credit_card", last4: "1111", brand: "visa" },
        authorization_code: "A1B2C3",
        created_at: new Date().toISOString(),
        captured_at: new Date().toISOString(),
        metadata: { order_id: "ORD-12345" },
      },
    };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(body);
  } catch {
    return {
      status: 400,
      time,
      body: {
        error: { code: "invalid_json", message: "Request body is not valid JSON" },
      },
    };
  }

  if (operation === "create_payment") {
    if (!parsed.amount || !parsed.currency || !parsed.payment_method) {
      return {
        status: 400,
        time,
        body: {
          error: {
            code: "missing_required_fields",
            message:
              "Campos obrigatórios: amount, currency, payment_method",
          },
        },
      };
    }
    const amount = parsed.amount as number;
    if (amount <= 0) {
      return {
        status: 400,
        time,
        body: {
          error: { code: "invalid_amount", message: "Amount deve ser maior que zero" },
        },
      };
    }

    const pm = parsed.payment_method as Record<string, unknown>;
    const card = pm?.card as Record<string, unknown> | undefined;
    const cardNumber = String(card?.number ?? "").replace(/\D/g, "");

    if (card && !luhnCheck(cardNumber)) {
      return {
        status: 402,
        time,
        body: {
          error: {
            code: "card_declined",
            message: "Cartão recusado — número inválido (falha Luhn)",
            decline_reason: "invalid_card_number",
          },
        },
      };
    }

    // Test card logic
    if (cardNumber === "4000000000000002") {
      return {
        status: 402,
        time,
        body: {
          error: {
            code: "card_declined",
            message: "Cartão recusado pelo emissor",
            decline_reason: "insufficient_funds",
          },
        },
      };
    }
    if (cardNumber === "4000000000000069") {
      return {
        status: 402,
        time,
        body: {
          error: {
            code: "card_expired",
            message: "Cartão expirado",
            decline_reason: "expired_card",
          },
        },
      };
    }

    return {
      status: 201,
      time,
      body: {
        id: generateId(),
        status: "authorized",
        amount,
        currency: parsed.currency,
        authorization_code: generateAuthCode(),
        payment_method: {
          type: "credit_card",
          last4: cardNumber.slice(-4),
          brand: cardNumber.startsWith("4") ? "visa" : "mastercard",
        },
        created_at: new Date().toISOString(),
        metadata: parsed.metadata ?? {},
      },
    };
  }

  // capture / refund / void
  if (operation === "capture") {
    return {
      status: 200,
      time,
      body: {
        id: "pay_abc123def456",
        status: "captured",
        amount: (parsed.amount as number) ?? 15000,
        captured_at: new Date().toISOString(),
      },
    };
  }
  if (operation === "refund") {
    return {
      status: 200,
      time,
      body: {
        id: "ref_" + Math.random().toString(36).substring(2, 10),
        payment_id: "pay_abc123def456",
        status: "refunded",
        amount: (parsed.amount as number) ?? 15000,
        reason: parsed.reason ?? "customer_request",
        refunded_at: new Date().toISOString(),
      },
    };
  }
  // void
  return {
    status: 200,
    time,
    body: {
      id: "pay_abc123def456",
      status: "voided",
      reason: parsed.reason ?? "order_cancelled",
      voided_at: new Date().toISOString(),
    },
  };
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
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { recordQuiz, visitPage } = useGameProgress();
  const [xpAwarded, setXpAwarded] = useState(false);
  const [endpointsTested, setEndpointsTested] = useState<Set<string>>(new Set());
  const [showXpToast, setShowXpToast] = useState<string | null>(null);

  useEffect(() => {
    visitPage("/labs/api-sandbox");
  }, [visitPage]);

  const opDef = OPERATIONS[operation];
  const methodColor = METHOD_COLORS[opDef.method];

  const handleOperationChange = useCallback(
    (op: Operation) => {
      setOperation(op);
      setRequestBody(OPERATIONS[op].template);
      setResponse(null);
      setShowExplanation(false);
    },
    []
  );

  const handleSend = useCallback(() => {
    setLoading(true);
    setShowExplanation(false);
    const delay = 100 + Math.floor(Math.random() * 200);
    setTimeout(() => {
      const result = simulateResponse(operation, requestBody);
      setResponse(result);
      setLoading(false);

      // XP rewards
      if (result.status >= 200 && result.status < 300) {
        if (!xpAwarded) {
          recordQuiz("/labs/api-sandbox", 1, 1, 15);
          setXpAwarded(true);
          setShowXpToast("+15 XP — Primeiro request!");
          setTimeout(() => setShowXpToast(null), 3000);
        } else if (!endpointsTested.has(operation)) {
          recordQuiz("/labs/api-sandbox-" + operation, 1, 1, 5);
          setShowXpToast("+5 XP — Novo endpoint!");
          setTimeout(() => setShowXpToast(null), 3000);
        }
        setEndpointsTested((prev) => new Set(prev).add(operation));
      }
    }, delay);
  }, [operation, requestBody, xpAwarded, endpointsTested, recordQuiz]);

  const formatJSON = useCallback(() => {
    try {
      const parsed = JSON.parse(requestBody);
      setRequestBody(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore
    }
  }, [requestBody]);

  const statusInfo = response
    ? STATUS_COLORS[response.status] ?? { bg: "#6B728020", text: "#6B7280", label: `${response.status}` }
    : null;

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "2rem 1rem" }}>
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
          ← Labs
        </Link>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--foreground)",
            marginBottom: "0.375rem",
          }}
        >
          🔌 Sandbox de API
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Construa requests, teste validações e entenda cada etapa do fluxo de pagamento.
        </p>
      </div>

      {/* Operation selector */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        {(Object.keys(OPERATIONS) as Operation[]).map((op) => {
          const d = OPERATIONS[op];
          const active = op === operation;
          return (
            <button
              key={op}
              onClick={() => handleOperationChange(op)}
              style={{
                padding: "0.375rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.8rem",
                fontWeight: 500,
                border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
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
                  color: METHOD_COLORS[d.method],
                  fontFamily: "monospace",
                }}
              >
                {d.method}
              </span>
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Main panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* ---- LEFT: Request Builder ---- */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          {/* Endpoint bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--border)",
              background: "var(--background)",
            }}
          >
            <span
              style={{
                padding: "0.2rem 0.5rem",
                borderRadius: "0.25rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "white",
                background: methodColor,
                fontFamily: "monospace",
              }}
            >
              {opDef.method}
            </span>
            <code style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {opDef.path}
            </code>
          </div>

          {/* Body editor */}
          <div style={{ padding: "0.75rem 1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Request Body
              </span>
              {operation !== "get_status" && (
                <button
                  onClick={formatJSON}
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--primary)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Formatar JSON
                </button>
              )}
            </div>

            {operation === "get_status" ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                GET request — sem body
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                spellCheck={false}
                style={{
                  width: "100%",
                  minHeight: "320px",
                  fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            )}

            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                marginTop: "0.75rem",
                width: "100%",
                padding: "0.625rem",
                borderRadius: "0.5rem",
                background: loading ? "var(--surface-hover)" : "var(--primary)",
                color: loading ? "var(--text-muted)" : "white",
                fontWeight: 600,
                fontSize: "0.85rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Enviando..." : "Enviar Request →"}
            </button>
          </div>

          {/* Test cards hint */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              padding: "0.75rem 1rem",
              background: "var(--background)",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: "0.375rem",
                display: "block",
              }}
            >
              Cartões de teste:
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
              {[
                ["4111 1111 1111 1111", "Aprovado", "#10B981"],
                ["4000 0000 0000 0002", "Recusado (saldo)", "#EF4444"],
                ["4000 0000 0000 0069", "Expirado", "#F59E0B"],
              ].map(([num, label, color]) => (
                <div
                  key={num}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.7rem",
                  }}
                >
                  <code style={{ color: "var(--foreground)", fontFamily: "monospace" }}>
                    {num}
                  </code>
                  <span style={{ color: color as string, fontWeight: 500 }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- RIGHT: Response Viewer ---- */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          {/* Response header bar */}
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
                color: "var(--text-muted)",
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
                    color: statusInfo.text,
                    background: statusInfo.bg,
                    fontFamily: "monospace",
                  }}
                >
                  {statusInfo.label}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    fontFamily: "monospace",
                  }}
                >
                  {response.time}ms
                </span>
              </div>
            )}
          </div>

          <div style={{ padding: "0.75rem 1rem" }}>
            {!response ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "320px",
                  color: "var(--text-muted)",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "2rem" }}>📡</span>
                <span style={{ fontSize: "0.85rem" }}>
                  Envie um request para ver a resposta
                </span>
              </div>
            ) : (
              <>
                <pre
                  style={{
                    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                    fontSize: "0.8rem",
                    lineHeight: 1.5,
                    background: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    overflow: "auto",
                    maxHeight: "340px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {JSON.stringify(response.body, null, 2)}
                </pre>

                {/* Headers (collapsible) */}
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
                    }}
                  >
                    {showHeaders ? "▾" : "▸"} Response Headers
                  </button>
                  {showHeaders && (
                    <div
                      style={{
                        marginTop: "0.375rem",
                        padding: "0.5rem 0.75rem",
                        background: "var(--background)",
                        borderRadius: "0.375rem",
                        fontSize: "0.7rem",
                        fontFamily: "monospace",
                        color: "var(--text-muted)",
                        lineHeight: 1.7,
                      }}
                    >
                      <div>content-type: application/json</div>
                      <div>x-request-id: {Math.random().toString(36).substring(2, 14)}</div>
                      <div>x-ratelimit-remaining: 99</div>
                      <div>x-idempotency-key: {crypto.randomUUID?.() ?? "idem-" + Date.now()}</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Explanation section */}
          {response && (
            <div
              style={{
                borderTop: "1px solid var(--border)",
                padding: "0.75rem 1rem",
              }}
            >
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                style={{
                  fontSize: "0.8rem",
                  color: "var(--primary)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {showExplanation ? "▾" : "▸"} 📚 O que acontece neste passo?
              </button>
              {showExplanation && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    background: "var(--primary-bg)",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                  }}
                >
                  {opDef.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
