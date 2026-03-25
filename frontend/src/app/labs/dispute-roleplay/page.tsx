"use client";

import Link from "next/link";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Evidence {
  id: string;
  label: string;
  description: string;
  weight: number; // 0-3 (0=irrelevant, 1=weak, 2=moderate, 3=strong)
  required: boolean; // if missing, auto-lose
}

interface Dispute {
  id: string;
  title: string;
  reasonCode: string;
  network: "Visa" | "Mastercard";
  category: string;
  merchantName: string;
  amount: number;
  currency: string;
  last4: string;
  transactionDate: string;
  deadline: string;
  threeDSStatus: string;
  deliveryInfo: string;
  productType: string;
  context: string;
  evidences: Evidence[];
  winThreshold: number; // minimum total weight to win
  expertSelection: string[]; // IDs of evidence an expert would select
  expertExplanation: string;
}

// ---------------------------------------------------------------------------
// Dispute Data
// ---------------------------------------------------------------------------
const DISPUTES: Dispute[] = [
  {
    id: "visa-fraud",
    title: "Fraude - Cartao Ausente",
    reasonCode: "Visa 10.4",
    network: "Visa",
    category: "Fraud",
    merchantName: "TechStore Brasil",
    amount: 2350,
    currency: "BRL",
    last4: "4821",
    transactionDate: "2024-11-15",
    deadline: "2024-12-15",
    threeDSStatus: "Nao utilizado",
    deliveryInfo: "Entregue em 18/11 - Endereco: Rua Augusta 1200, Sao Paulo",
    productType: "Eletronico (Smartphone)",
    context:
      "O portador do cartao alega que nao reconhece a compra de R$ 2.350 em sua fatura. A transacao foi processada sem 3DS. O produto foi entregue no endereco cadastrado no cartao.",
    evidences: [
      {
        id: "delivery_proof",
        label: "Comprovante de Entrega",
        description: "Foto da entrega com assinatura do recebedor + AR dos Correios",
        weight: 3,
        required: true,
      },
      {
        id: "ip_logs",
        label: "Logs de IP",
        description: "IP 187.45.xxx.xxx (Sao Paulo, SP) - consistente com endereco de entrega",
        weight: 2,
        required: false,
      },
      {
        id: "email_confirmation",
        label: "Confirmacao por Email",
        description: "Email de confirmacao enviado para joao.s****@gmail.com - aberto em 15/11 14:32",
        weight: 2,
        required: false,
      },
      {
        id: "device_fingerprint",
        label: "Device Fingerprint",
        description: "Device ID: iPhone 15 Pro, OS 17.2, mesmo device de 3 compras anteriores",
        weight: 3,
        required: false,
      },
      {
        id: "avs_match",
        label: "AVS Match",
        description: "Endereco de cobranca confere com endereco cadastrado no emissor",
        weight: 1,
        required: false,
      },
      {
        id: "cvv_match",
        label: "CVV Match",
        description: "CVV validado com sucesso na autorizacao",
        weight: 1,
        required: false,
      },
      {
        id: "purchase_history",
        label: "Historico de Compras",
        description: "Cliente realizou 8 compras nos ultimos 6 meses, sem disputas anteriores",
        weight: 2,
        required: false,
      },
      {
        id: "refund_policy",
        label: "Politica de Devolucao",
        description: "Politica de 30 dias aceita no checkout (checkbox obrigatorio)",
        weight: 1,
        required: false,
      },
    ],
    winThreshold: 9,
    expertSelection: [
      "delivery_proof",
      "device_fingerprint",
      "ip_logs",
      "email_confirmation",
      "purchase_history",
    ],
    expertExplanation:
      "Para Visa 10.4 (Fraud - Card Absent), o elemento mais critico e provar que o portador legitimo realizou a transacao. Comprovante de entrega + device fingerprint sao essenciais. IP logs e historico de compras reforcam o padrao de comportamento. Sem 3DS, voce precisa compensar com evidencia forte de identidade.",
  },
  {
    id: "mc-not-received",
    title: "Produto Nao Recebido",
    reasonCode: "MC 4855",
    network: "Mastercard",
    category: "Goods Not Received",
    merchantName: "Casa & Decoracao Online",
    amount: 890,
    currency: "BRL",
    last4: "7733",
    transactionDate: "2024-11-02",
    deadline: "2024-12-20",
    threeDSStatus: "3DS 2.0 - Autenticado",
    deliveryInfo: "Enviado em 04/11 - Tracking: BR123456789",
    productType: "Movel (Mesa de escritorio)",
    context:
      "O comprador alega que nunca recebeu a mesa de escritorio. O tracking mostra 'Entregue' mas o comprador contesta. Transacao autenticada com 3DS 2.0.",
    evidences: [
      {
        id: "tracking_number",
        label: "Numero de Rastreio",
        description: "BR123456789 - Status: Entregue em 08/11 as 14:22 - Transportadora: Correios",
        weight: 2,
        required: true,
      },
      {
        id: "delivery_photo",
        label: "Foto da Entrega",
        description: "Foto do pacote na portaria do edificio com carimbo de data/hora",
        weight: 3,
        required: false,
      },
      {
        id: "signed_receipt",
        label: "Recibo Assinado",
        description: "Recibo assinado pelo porteiro do edificio: 'Jose Carlos - apt 142'",
        weight: 3,
        required: false,
      },
      {
        id: "3ds_proof",
        label: "Comprovante 3DS",
        description: "Transacao autenticada via 3DS 2.0 - ECI 05 - AAV validado",
        weight: 2,
        required: false,
      },
      {
        id: "shipping_weight",
        label: "Peso do Envio",
        description: "Peso registrado: 28.5kg - Consistente com mesa de escritorio (peso anunciado: 27kg)",
        weight: 1,
        required: false,
      },
      {
        id: "delivery_address",
        label: "Endereco de Entrega",
        description: "Rua Funchal 411, apt 142, Vila Olimpia - mesmo do cadastro do cartao",
        weight: 2,
        required: false,
      },
      {
        id: "customer_contact",
        label: "Registro de Contato",
        description: "3 tentativas de contato por email e telefone sem resposta do comprador",
        weight: 1,
        required: false,
      },
      {
        id: "insurance_claim",
        label: "Seguro da Transportadora",
        description: "Apolice de seguro cobrindo perda/dano ate R$ 2.000",
        weight: 0,
        required: false,
      },
    ],
    winThreshold: 9,
    expertSelection: [
      "tracking_number",
      "delivery_photo",
      "signed_receipt",
      "3ds_proof",
      "delivery_address",
    ],
    expertExplanation:
      "Para MC 4855 (Goods Not Received), provar a entrega e fundamental. Tracking + foto + recibo assinado formam uma evidencia irrefutavel. 3DS 2.0 com ECI 05 fornece liability shift (a responsabilidade e do emissor), mas incluir mesmo assim reforca a defesa. Seguro da transportadora nao e evidencia relevante para a disputa.",
  },
  {
    id: "visa-friendly-fraud",
    title: "Friendly Fraud - Digital",
    reasonCode: "Visa 13.1",
    network: "Visa",
    category: "Merchandise Not Received",
    merchantName: "LearnPro Cursos",
    amount: 150,
    currency: "BRL",
    last4: "1156",
    transactionDate: "2024-11-20",
    deadline: "2024-12-28",
    threeDSStatus: "3DS 2.0 - Challenge completo",
    deliveryInfo: "Produto digital - acesso imediato",
    productType: "Curso online (Produto digital)",
    context:
      "O portador alega nao ter recebido o produto. Trata-se de um curso online com acesso imediato apos pagamento. Logs mostram que o usuario acessou o conteudo.",
    evidences: [
      {
        id: "download_logs",
        label: "Logs de Acesso/Download",
        description: "10 acessos entre 20/11 e 25/11. 3 aulas completas. Tempo total: 4h32min",
        weight: 3,
        required: true,
      },
      {
        id: "ip_match",
        label: "IP Match",
        description: "IP de acesso (189.34.xxx.xxx) identico ao IP da compra",
        weight: 3,
        required: false,
      },
      {
        id: "usage_logs",
        label: "Logs de Uso Detalhado",
        description: "Quiz completado com 85% de acerto. Certificado parcial gerado em 23/11.",
        weight: 3,
        required: false,
      },
      {
        id: "3ds_authentication",
        label: "Autenticacao 3DS",
        description: "3DS 2.0 Challenge completo - ECI 05 - Senha OTP validada pelo emissor",
        weight: 2,
        required: false,
      },
      {
        id: "tos_acceptance",
        label: "Aceite dos Termos",
        description: "Termos de uso aceitos em 20/11 14:01 com checkbox 'Li e aceito'",
        weight: 1,
        required: false,
      },
      {
        id: "email_welcome",
        label: "Email de Boas-vindas",
        description: "Email com credenciais enviado em 20/11 14:02 - aberto em 14:05",
        weight: 2,
        required: false,
      },
      {
        id: "social_proof",
        label: "Review do Usuario",
        description: "Usuario deixou review 4 estrelas: 'Bom conteudo mas poderia ter mais exemplos'",
        weight: 2,
        required: false,
      },
      {
        id: "refund_attempt",
        label: "Tentativa de Reembolso",
        description: "Nenhum contato previo solicitando reembolso antes do chargeback",
        weight: 1,
        required: false,
      },
    ],
    winThreshold: 9,
    expertSelection: [
      "download_logs",
      "ip_match",
      "usage_logs",
      "3ds_authentication",
      "social_proof",
    ],
    expertExplanation:
      "Friendly fraud em produtos digitais e muito comum. A defesa ideal combina: prova de uso (logs de acesso + quiz completado), consistencia de identidade (IP match + 3DS), e comportamento contraditorio (review positiva + nenhum pedido de reembolso). O review de 4 estrelas e evidencia devastadora contra a alegacao de 'nao recebido'.",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function strengthLabel(totalWeight: number, threshold: number): { label: string; color: string } {
  const ratio = totalWeight / threshold;
  if (ratio >= 1) return { label: "Compelling", color: "#10B981" };
  if (ratio >= 0.75) return { label: "Forte", color: "#3B82F6" };
  if (ratio >= 0.5) return { label: "Moderada", color: "#F59E0B" };
  return { label: "Fraca", color: "#EF4444" };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DisputeRoleplay() {
  const [disputeIndex, setDisputeIndex] = useState<number | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [showExpert, setShowExpert] = useState(false);
  const [showXpToast, setShowXpToast] = useState<string | null>(null);
  const { recordQuiz, visitPage } = useGameProgress();
  const xpAwardedForDispute = useRef<Set<number>>(new Set());

  useEffect(() => {
    visitPage("/labs/dispute-roleplay");
  }, [visitPage]);

  // Random order on mount
  const shuffledIndices = useMemo(() => {
    const arr = [0, 1, 2];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const dispute = disputeIndex !== null ? DISPUTES[shuffledIndices[disputeIndex]] : null;

  const totalWeight = useMemo(() => {
    if (!dispute) return 0;
    return dispute.evidences
      .filter((e) => selectedEvidence.has(e.id))
      .reduce((sum, e) => sum + e.weight, 0);
  }, [dispute, selectedEvidence]);

  const strength = useMemo(
    () => (dispute ? strengthLabel(totalWeight, dispute.winThreshold) : { label: "", color: "" }),
    [dispute, totalWeight]
  );

  const hasRequired = useMemo(() => {
    if (!dispute) return true;
    return dispute.evidences.filter((e) => e.required).every((e) => selectedEvidence.has(e.id));
  }, [dispute, selectedEvidence]);

  const didWin = useMemo(
    () => hasRequired && totalWeight >= (dispute?.winThreshold ?? 999),
    [hasRequired, totalWeight, dispute]
  );

  const toggleEvidence = useCallback((id: string) => {
    setSelectedEvidence((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    // XP rewards
    if (disputeIndex !== null && !xpAwardedForDispute.current.has(disputeIndex)) {
      xpAwardedForDispute.current.add(disputeIndex);
      const d = DISPUTES[shuffledIndices[disputeIndex]];
      const tw = d.evidences
        .filter((e) => selectedEvidence.has(e.id))
        .reduce((sum, e) => sum + e.weight, 0);
      const hr = d.evidences.filter((e) => e.required).every((e) => selectedEvidence.has(e.id));
      const won = hr && tw >= d.winThreshold;
      const xp = won ? 30 : 20;
      recordQuiz("/labs/dispute-" + d.id, won ? 1 : 0, 1, xp);
      setShowXpToast(`+${xp} XP${won ? " — Disputa vencida!" : ""}`);
      setTimeout(() => setShowXpToast(null), 4000);
    }
  }, [disputeIndex, shuffledIndices, selectedEvidence, recordQuiz]);

  const handleNext = useCallback(() => {
    if (disputeIndex !== null && disputeIndex < 2) {
      setDisputeIndex(disputeIndex + 1);
      setSelectedEvidence(new Set());
      setSubmitted(false);
      setShowExpert(false);
    }
  }, [disputeIndex]);

  const resetAll = useCallback(() => {
    setDisputeIndex(null);
    setSelectedEvidence(new Set());
    setSubmitted(false);
    setShowExpert(false);
  }, []);

  // -------------------------------------------------------------------------
  // Render: Selector
  // -------------------------------------------------------------------------
  if (disputeIndex === null) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
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
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.375rem",
            }}
          >
            Role-Play de Disputa
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Receba chargebacks reais e monte a defesa. Selecione as evidencias corretas para vencer
            a disputa.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {shuffledIndices.map((si, i) => {
            const d = DISPUTES[si];
            return (
              <button
                key={d.id}
                onClick={() => setDisputeIndex(i)}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    {d.title}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.25rem",
                      background: d.network === "Visa" ? "#1A1F71" : "#FF5F00",
                      color: "white",
                    }}
                  >
                    {d.reasonCode}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>R$ {d.amount.toLocaleString("pt-BR")}</span>
                  <span>{d.productType}</span>
                  <span>{d.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!dispute) return null;

  // -------------------------------------------------------------------------
  // Render: Submitted Result
  // -------------------------------------------------------------------------
  if (submitted) {
    const missingRequired = dispute.evidences.filter((e) => e.required && !selectedEvidence.has(e.id));

    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
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
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Resultado da Disputa
          </h1>
        </div>

        {/* Result Card */}
        <div
          style={{
            background: didWin ? "#10B98110" : "#EF444410",
            border: `1px solid ${didWin ? "#10B98140" : "#EF444440"}`,
            borderRadius: "0.75rem",
            padding: "2rem",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
            {didWin ? "\u2705" : "\u274C"}
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: didWin ? "#10B981" : "#EF4444",
              marginBottom: "0.5rem",
            }}
          >
            {didWin ? "Disputa Vencida!" : "Disputa Perdida"}
          </h2>
          {!hasRequired && missingRequired.length > 0 && (
            <p
              style={{
                fontSize: "0.85rem",
                color: "#EF4444",
                marginBottom: "0.5rem",
              }}
            >
              Evidencia obrigatoria ausente:{" "}
              {missingRequired.map((e) => e.label).join(", ")}
            </p>
          )}
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
            }}
          >
            Forca da evidencia: {strength.label} ({totalWeight}/{dispute.winThreshold} pontos
            necessarios)
          </p>
        </div>

        {/* Evidence Review */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.75rem",
            }}
          >
            Sua Selecao vs. Especialista
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {dispute.evidences.map((e) => {
              const userSelected = selectedEvidence.has(e.id);
              const expertSelected = dispute.expertSelection.includes(e.id);
              let statusIcon = "";
              let statusColor = "";
              if (userSelected && expertSelected) {
                statusIcon = "\u2713\u2713";
                statusColor = "#10B981";
              } else if (userSelected && !expertSelected) {
                statusIcon = "\u2713 \u00D7";
                statusColor = "#F59E0B";
              } else if (!userSelected && expertSelected) {
                statusIcon = "\u00D7 \u2713";
                statusColor = "#EF4444";
              } else {
                statusIcon = "\u00D7 \u00D7";
                statusColor = "#6B7280";
              }

              return (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.375rem 0.5rem",
                    borderRadius: "0.375rem",
                    background:
                      userSelected && expertSelected
                        ? "#10B98108"
                        : !userSelected && expertSelected
                        ? "#EF444408"
                        : "transparent",
                    fontSize: "0.8rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      color: statusColor,
                      fontWeight: 700,
                      minWidth: "36px",
                    }}
                  >
                    {statusIcon}
                  </span>
                  <span style={{ color: "var(--foreground)", flex: 1 }}>{e.label}</span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Peso: {e.weight}
                    {e.required ? " (obrigatorio)" : ""}
                  </span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.7rem",
              color: "var(--text-secondary)",
              display: "flex",
              gap: "1rem",
            }}
          >
            <span>
              <span style={{ color: "#10B981" }}>{"\u2713\u2713"}</span> Ambos selecionaram
            </span>
            <span>
              <span style={{ color: "#F59E0B" }}>{"\u2713 \u00D7"}</span> So voce
            </span>
            <span>
              <span style={{ color: "#EF4444" }}>{"\u00D7 \u2713"}</span> So especialista
            </span>
          </div>
        </div>

        {/* Expert Analysis (collapsible) */}
        <div
          style={{
            background: "var(--primary-bg)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            overflow: "hidden",
            marginBottom: "1.5rem",
          }}
        >
          <button
            onClick={() => setShowExpert(!showExpert)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "var(--primary)",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <span>Analise do Especialista</span>
            <span>{showExpert ? "\u25BE" : "\u25B8"}</span>
          </button>
          {showExpert && (
            <div style={{ padding: "0 1rem 1rem 1rem" }}>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--foreground)",
                  lineHeight: 1.6,
                }}
              >
                {dispute.expertExplanation}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          {disputeIndex < 2 ? (
            <button
              onClick={handleNext}
              style={{
                padding: "0.625rem 1.5rem",
                borderRadius: "0.5rem",
                background: "var(--primary)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Proxima Disputa &rarr;
            </button>
          ) : (
            <button
              onClick={resetAll}
              style={{
                padding: "0.625rem 1.5rem",
                borderRadius: "0.5rem",
                background: "var(--primary)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Jogar Novamente
            </button>
          )}
          <button
            onClick={resetAll}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Menu Principal
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Evidence Selection
  // -------------------------------------------------------------------------
  return (
    <div style={{ maxWidth: "950px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
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
          }}
        >
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Role-Play de Disputa
          </h1>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--primary)",
              background: "var(--primary-bg)",
              padding: "0.25rem 0.75rem",
              borderRadius: "1rem",
            }}
          >
            Disputa {disputeIndex + 1}/3
          </span>
        </div>
      </div>

      {/* Notification Card */}
      <div
        style={{
          background: "#EF444410",
          border: "1px solid #EF444430",
          borderRadius: "0.75rem",
          padding: "1rem 1.25rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.2rem 0.5rem",
                borderRadius: "0.25rem",
                background: dispute.network === "Visa" ? "#1A1F71" : "#FF5F00",
                color: "white",
              }}
            >
              {dispute.reasonCode}
            </span>
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              {dispute.title}
            </span>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#EF4444", fontWeight: 600 }}>
            Prazo: {dispute.deadline}
          </span>
        </div>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--foreground)",
            lineHeight: 1.5,
          }}
        >
          {dispute.context}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* LEFT: Transaction Details */}
        <div>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1rem 1.25rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.75rem",
              }}
            >
              Detalhes da Transacao
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                ["Merchant", dispute.merchantName],
                ["Valor", `R$ ${dispute.amount.toLocaleString("pt-BR")}`],
                ["Cartao", `**** ${dispute.last4}`],
                ["Data", dispute.transactionDate],
                ["3DS", dispute.threeDSStatus],
                ["Entrega", dispute.deliveryInfo],
                ["Produto", dispute.productType],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                  <span
                    style={{
                      color: "var(--foreground)",
                      fontWeight: 500,
                      textAlign: "right",
                      maxWidth: "60%",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strength Meter */}
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
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              Forca da Evidencia
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "8px",
                  background: "var(--background)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min((totalWeight / dispute.winThreshold) * 100, 100)}%`,
                    height: "100%",
                    background: strength.color,
                    borderRadius: "4px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: strength.color,
                  minWidth: "80px",
                  textAlign: "right",
                }}
              >
                {strength.label}
              </span>
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-secondary)",
              }}
            >
              {totalWeight}/{dispute.winThreshold} pontos |{" "}
              {selectedEvidence.size} evidencias selecionadas
            </div>
          </div>
        </div>

        {/* RIGHT: Evidence Grid */}
        <div>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            Selecione as Evidencias para a Defesa
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            {dispute.evidences.map((e) => {
              const isSelected = selectedEvidence.has(e.id);
              return (
                <button
                  key={e.id}
                  onClick={() => toggleEvidence(e.id)}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                    background: isSelected ? "var(--primary-bg)" : "var(--surface)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "3px",
                        border: `2px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                        background: isSelected ? "var(--primary)" : "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6rem",
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected ? "\u2713" : ""}
                    </span>
                    <span
                      style={{
                        fontSize: "0.825rem",
                        fontWeight: 600,
                        color: "var(--foreground)",
                      }}
                    >
                      {e.label}
                    </span>
                    {e.required && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          color: "#EF4444",
                          background: "#EF444415",
                          padding: "0.1rem 0.35rem",
                          borderRadius: "0.2rem",
                        }}
                      >
                        ESSENCIAL
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                      paddingLeft: "24px",
                    }}
                  >
                    {e.description}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedEvidence.size === 0}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              background:
                selectedEvidence.size === 0 ? "var(--surface)" : "var(--primary)",
              color: selectedEvidence.size === 0 ? "var(--text-secondary)" : "white",
              border: `1px solid ${selectedEvidence.size === 0 ? "var(--border)" : "var(--primary)"}`,
              cursor: selectedEvidence.size === 0 ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            Submeter Defesa &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
