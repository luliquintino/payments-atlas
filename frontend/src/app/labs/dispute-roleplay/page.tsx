"use client";

import Link from "next/link";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Brand = "Visa" | "Mastercard" | "Elo";
type Difficulty = "Facil" | "Medio" | "Dificil";
type Relevance = "Alta" | "Media" | "Baixa";

interface EvidenceType {
  id: string;
  label: string;
  icon: string;
  relevanceByScenario: Record<string, Relevance>;
}

interface Scenario {
  id: string;
  reasonCode: string;
  description: string;
  brand: Brand;
  difficulty: Difficulty;
  // Transaction details
  valor: number;
  dataTransacao: string;
  merchantName: string;
  mcc: string;
  tipo: string;
  authCode: string;
  lastFour: string;
  entryMode: string;
  threeDSStatus: string;
  avsResult: string;
  cvvResult: string;
  deliveryTracking: string | null;
  // Timeline
  disputeFiledDate: string;
  responseDeadline: string;
  // Brand rules
  brandDeadlineDays: number;
  brandProcess: string;
  brandNote: string;
  // Scoring
  context: string;
  scoreBreakdown: Record<string, number>; // evidenceId -> percentage contribution
  missingPenalties: Record<string, string>; // evidenceId -> suggestion text
}

// ---------------------------------------------------------------------------
// Evidence Library (15 types)
// ---------------------------------------------------------------------------
const EVIDENCE_LIBRARY: EvidenceType[] = [
  { id: "signed_delivery", label: "Comprovante de entrega assinado", icon: "\u270D\uFE0F", relevanceByScenario: { "13.6": "Alta", "4853": "Media", "53": "Media" } },
  { id: "tracking_carrier", label: "Tracking number + confirmacao transportadora", icon: "\uD83D\uDCE6", relevanceByScenario: { "13.6": "Alta", "13.1": "Media", "4853": "Media" } },
  { id: "3ds_log", label: "Log de autenticacao 3DS", icon: "\uD83D\uDD10", relevanceByScenario: { "10.4": "Alta", "4863": "Alta", "53": "Media" } },
  { id: "checkout_tos", label: "Screenshot de checkout + aceite ToS", icon: "\uD83D\uDCCB", relevanceByScenario: { "13.1": "Media", "4853": "Media", "13.6": "Media", "10.4": "Baixa", "53": "Media" } },
  { id: "purchase_history", label: "Historico de compras do cliente", icon: "\uD83D\uDCC5", relevanceByScenario: { "10.4": "Media", "4863": "Media", "53": "Media" } },
  { id: "customer_comms", label: "Comunicacao com cliente (email/chat)", icon: "\uD83D\uDCE7", relevanceByScenario: { "13.1": "Alta", "4853": "Alta", "53": "Alta", "13.6": "Media" } },
  { id: "product_photos", label: "Fotos do produto enviado", icon: "\uD83D\uDCF7", relevanceByScenario: { "13.1": "Alta", "4853": "Alta", "53": "Media" } },
  { id: "refund_policy", label: "Politica de devolucao aceita", icon: "\uD83D\uDCC4", relevanceByScenario: { "13.1": "Media", "4853": "Media", "13.6": "Media", "53": "Media" } },
  { id: "ip_device", label: "IP address + device fingerprint", icon: "\uD83D\uDCBB", relevanceByScenario: { "10.4": "Media", "4863": "Media", "53": "Baixa" } },
  { id: "avs_cvv", label: "AVS/CVV match confirmation", icon: "\u2705", relevanceByScenario: { "10.4": "Media", "4863": "Media" } },
  { id: "refund_proof", label: "Comprovante de reembolso ja processado", icon: "\uD83D\uDCB0", relevanceByScenario: { "13.1": "Alta", "13.6": "Alta", "4853": "Alta", "10.4": "Alta", "4863": "Alta", "53": "Alta" } },
  { id: "usage_after", label: "Uso/login do cliente apos compra", icon: "\uD83D\uDC64", relevanceByScenario: { "10.4": "Alta", "4863": "Alta", "53": "Media" } },
  { id: "prior_transactions", label: "Transacoes anteriores sem disputa", icon: "\uD83D\uDCC8", relevanceByScenario: { "10.4": "Media", "4863": "Media", "53": "Baixa" } },
  { id: "shipping_insurance", label: "Documentacao de seguro de envio", icon: "\uD83D\uDEE1\uFE0F", relevanceByScenario: { "13.6": "Baixa", "4853": "Baixa" } },
  { id: "invoice_receipt", label: "Nota fiscal / recibo", icon: "\uD83E\uDDFE", relevanceByScenario: { "13.1": "Media", "13.6": "Media", "4853": "Media", "10.4": "Baixa", "4863": "Baixa", "53": "Media" } },
];

// ---------------------------------------------------------------------------
// 6 Scenarios
// ---------------------------------------------------------------------------
const SCENARIOS: Scenario[] = [
  {
    id: "visa-10.4",
    reasonCode: "10.4",
    description: "Fraude - Cartao nao reconhecido",
    brand: "Visa",
    difficulty: "Medio",
    valor: 3250.00,
    dataTransacao: "2025-02-10",
    merchantName: "TechStore Brasil",
    mcc: "5732",
    tipo: "Credito",
    authCode: "A83F21",
    lastFour: "4821",
    entryMode: "E-commerce (CNP)",
    threeDSStatus: "Nao utilizado",
    avsResult: "Match (Y)",
    cvvResult: "Match (M)",
    deliveryTracking: "BR789456123 - Entregue 13/02",
    disputeFiledDate: "2025-03-01",
    responseDeadline: "2025-03-31",
    brandDeadlineDays: 30,
    brandProcess: "VROL (Visa Resolve Online)",
    brandNote: "TC40 data e relevante. Sem 3DS, liability e do merchant.",
    context: "O portador alega que nao reconhece a compra de R$ 3.250 na fatura. A transacao foi processada sem 3DS. Produto entregue no endereco cadastrado.",
    scoreBreakdown: {
      "3ds_log": 15, "usage_after": 20, "ip_device": 12, "avs_cvv": 10,
      "purchase_history": 8, "signed_delivery": 10, "tracking_carrier": 5,
      "checkout_tos": 3, "invoice_receipt": 2, "prior_transactions": 5,
      "refund_proof": 15, "product_photos": 2, "customer_comms": 3,
      "refund_policy": 2, "shipping_insurance": 1,
    },
    missingPenalties: {
      "3ds_log": "Sem log 3DS, a defesa perde o argumento de autenticacao",
      "usage_after": "Login pos-compra provaria que o portador real usou o servico",
      "ip_device": "Device fingerprint conectaria compra ao portador",
      "avs_cvv": "Match de AVS/CVV reforcariam a legitimidade",
    },
  },
  {
    id: "visa-13.1",
    reasonCode: "13.1",
    description: "Mercadoria defeituosa/diferente",
    brand: "Visa",
    difficulty: "Facil",
    valor: 459.90,
    dataTransacao: "2025-01-22",
    merchantName: "ModaExpress",
    mcc: "5651",
    tipo: "Credito",
    authCode: "B12C45",
    lastFour: "1156",
    entryMode: "E-commerce (CNP)",
    threeDSStatus: "3DS 2.0 - Autenticado (ECI 05)",
    avsResult: "Match (Y)",
    cvvResult: "Match (M)",
    deliveryTracking: "BR321654987 - Entregue 26/01",
    disputeFiledDate: "2025-02-15",
    responseDeadline: "2025-03-17",
    brandDeadlineDays: 30,
    brandProcess: "VROL (Visa Resolve Online)",
    brandNote: "Liability shift por 3DS nao se aplica a disputas de qualidade do produto.",
    context: "Comprador alega que recebeu vestido de cor diferente do anunciado. Fotos no anuncio mostravam azul marinho, produto recebido seria preto. Solicita estorno total.",
    scoreBreakdown: {
      "product_photos": 20, "customer_comms": 20, "checkout_tos": 8,
      "refund_policy": 10, "tracking_carrier": 5, "signed_delivery": 5,
      "invoice_receipt": 7, "refund_proof": 15, "3ds_log": 2,
      "avs_cvv": 1, "ip_device": 1, "purchase_history": 3,
      "usage_after": 1, "prior_transactions": 2, "shipping_insurance": 1,
    },
    missingPenalties: {
      "product_photos": "Fotos do produto enviado provariam conformidade com anuncio",
      "customer_comms": "Comunicacao mostraria tentativa de resolucao pre-disputa",
      "refund_policy": "Politica aceita protegeria contra estorno total",
    },
  },
  {
    id: "visa-13.6",
    reasonCode: "13.6",
    description: "Mercadoria nao recebida",
    brand: "Visa",
    difficulty: "Facil",
    valor: 189.00,
    dataTransacao: "2025-02-05",
    merchantName: "LivrariaDigital",
    mcc: "5942",
    tipo: "Debito",
    authCode: "C98D12",
    lastFour: "7733",
    entryMode: "E-commerce (CNP)",
    threeDSStatus: "3DS 2.0 - Autenticado (ECI 05)",
    avsResult: "Match (Y)",
    cvvResult: "Match (M)",
    deliveryTracking: "BR567891234 - Entregue 10/02 (portaria)",
    disputeFiledDate: "2025-02-28",
    responseDeadline: "2025-03-30",
    brandDeadlineDays: 30,
    brandProcess: "VROL (Visa Resolve Online)",
    brandNote: "Prova de entrega com assinatura e a evidencia mais forte neste caso.",
    context: "Comprador alega que nunca recebeu kit de livros didaticos. Rastreio mostra entrega na portaria do edificio. Comprador diz que porteiro nao repassou.",
    scoreBreakdown: {
      "signed_delivery": 25, "tracking_carrier": 20, "customer_comms": 8,
      "checkout_tos": 5, "refund_policy": 5, "invoice_receipt": 5,
      "3ds_log": 3, "product_photos": 3, "refund_proof": 15,
      "avs_cvv": 2, "ip_device": 1, "purchase_history": 3,
      "usage_after": 2, "prior_transactions": 2, "shipping_insurance": 3,
    },
    missingPenalties: {
      "signed_delivery": "Comprovante de entrega assinado e ESSENCIAL para este reason code",
      "tracking_carrier": "Tracking confirmado pela transportadora prova o envio",
      "customer_comms": "Comunicacao mostraria boa-fe do merchant",
    },
  },
  {
    id: "mc-4853",
    reasonCode: "4853",
    description: "Bens nao conforme descricao",
    brand: "Mastercard",
    difficulty: "Medio",
    valor: 1890.00,
    dataTransacao: "2025-01-15",
    merchantName: "EletroMax",
    mcc: "5722",
    tipo: "Credito",
    authCode: "D45E78",
    lastFour: "5502",
    entryMode: "E-commerce (CNP)",
    threeDSStatus: "3DS 2.0 - Autenticado (ECI 02)",
    avsResult: "Partial (A)",
    cvvResult: "Match (M)",
    deliveryTracking: "BR234567890 - Entregue 20/01",
    disputeFiledDate: "2025-02-20",
    responseDeadline: "2025-04-06",
    brandDeadlineDays: 45,
    brandProcess: "IPM (Integrated Products and Messages)",
    brandNote: "Mastercard exige resposta via sistema IPM. Prazo de 45 dias corridos.",
    context: "Comprador adquiriu aspirador robo 'modelo premium' mas alega ter recebido modelo basico sem funcao de mapeamento. Embalagem original, porem modelo inferior ao anunciado.",
    scoreBreakdown: {
      "product_photos": 20, "customer_comms": 18, "invoice_receipt": 10,
      "checkout_tos": 8, "refund_policy": 8, "tracking_carrier": 5,
      "signed_delivery": 5, "refund_proof": 15, "3ds_log": 2,
      "avs_cvv": 1, "ip_device": 1, "purchase_history": 3,
      "usage_after": 1, "prior_transactions": 2, "shipping_insurance": 2,
    },
    missingPenalties: {
      "product_photos": "Fotos do produto e embalagem provariam envio do modelo correto",
      "customer_comms": "Registros de comunicacao mostrariam tentativa de resolucao",
      "invoice_receipt": "NF com descricao exata do modelo vincularia pedido ao produto",
    },
  },
  {
    id: "mc-4863",
    reasonCode: "4863",
    description: "Portador nao reconhece",
    brand: "Mastercard",
    difficulty: "Dificil",
    valor: 5400.00,
    dataTransacao: "2025-01-28",
    merchantName: "JoiasLuxo Online",
    mcc: "5944",
    tipo: "Credito",
    authCode: "E12F34",
    lastFour: "8891",
    entryMode: "E-commerce (CNP)",
    threeDSStatus: "Nao utilizado",
    avsResult: "No Match (N)",
    cvvResult: "Match (M)",
    deliveryTracking: "BR876543210 - Entregue 01/02",
    disputeFiledDate: "2025-02-25",
    responseDeadline: "2025-04-11",
    brandDeadlineDays: 45,
    brandProcess: "IPM (Integrated Products and Messages)",
    brandNote: "Sem 3DS e AVS No Match tornam este caso muito dificil. IPM requer documentacao robusta.",
    context: "Portador nega ter realizado compra de colar de ouro. Transacao sem 3DS, AVS nao confere. CVV correto. Alto valor em categoria de risco (joias).",
    scoreBreakdown: {
      "3ds_log": 18, "avs_cvv": 12, "ip_device": 15, "usage_after": 15,
      "purchase_history": 8, "signed_delivery": 5, "tracking_carrier": 3,
      "refund_proof": 15, "prior_transactions": 5, "checkout_tos": 2,
      "customer_comms": 2, "product_photos": 1, "invoice_receipt": 2,
      "refund_policy": 1, "shipping_insurance": 1,
    },
    missingPenalties: {
      "3ds_log": "Sem 3DS, nao ha transferencia de responsabilidade ao emissor",
      "ip_device": "Device fingerprint e IP poderiam ligar compra ao portador",
      "avs_cvv": "AVS No Match enfraquece a defesa significativamente",
      "usage_after": "Prova de uso pos-compra e critica para fraude friendly",
    },
  },
  {
    id: "elo-53",
    reasonCode: "53",
    description: "Disputa domestica",
    brand: "Elo",
    difficulty: "Medio",
    valor: 750.00,
    dataTransacao: "2025-02-01",
    merchantName: "GameZone BR",
    mcc: "5816",
    tipo: "Debito",
    authCode: "F67G89",
    lastFour: "3344",
    entryMode: "E-commerce (CNP)",
    threeDSStatus: "3DS 1.0 - Autenticado",
    avsResult: "N/A (Elo)",
    cvvResult: "Match",
    deliveryTracking: null,
    disputeFiledDate: "2025-02-20",
    responseDeadline: "2025-03-22",
    brandDeadlineDays: 30,
    brandProcess: "Sistema de Disputas Elo",
    brandNote: "Prazos domesticos brasileiros. Regras especificas BR: Bacen regulacao. Elo segue padrao local.",
    context: "Portador contesta compra de creditos em jogo online. Alega que filho menor de idade usou o cartao sem autorizacao. Produto digital consumido integralmente.",
    scoreBreakdown: {
      "3ds_log": 15, "usage_after": 20, "ip_device": 10, "customer_comms": 12,
      "purchase_history": 8, "checkout_tos": 8, "refund_proof": 15,
      "avs_cvv": 3, "prior_transactions": 3, "invoice_receipt": 3,
      "product_photos": 1, "signed_delivery": 1, "tracking_carrier": 1,
      "refund_policy": 3, "shipping_insurance": 0,
    },
    missingPenalties: {
      "usage_after": "Logs de uso mostrariam consumo do produto digital",
      "3ds_log": "Autenticacao 3DS provaria autorizacao do portador",
      "customer_comms": "Comunicacao previa mostraria ciencia da compra",
      "ip_device": "IP/device conectariam a transacao ao ambiente do portador",
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getBrandColor(brand: Brand): string {
  switch (brand) {
    case "Visa": return "#1A1F71";
    case "Mastercard": return "#FF5F00";
    case "Elo": return "#00A4E0";
  }
}

function getDifficultyStyle(d: Difficulty): { bg: string; color: string } {
  switch (d) {
    case "Facil": return { bg: "#10B98120", color: "#10B981" };
    case "Medio": return { bg: "#F59E0B20", color: "#F59E0B" };
    case "Dificil": return { bg: "#EF444420", color: "#EF4444" };
  }
}

function getRelevanceStyle(r: Relevance): { bg: string; color: string; label: string } {
  switch (r) {
    case "Alta": return { bg: "#10B98120", color: "#10B981", label: "Alta" };
    case "Media": return { bg: "#F59E0B20", color: "#F59E0B", label: "Media" };
    case "Baixa": return { bg: "#6B728020", color: "#6B7280", label: "Baixa" };
  }
}

function calculateWinProbability(scenario: Scenario, selectedIds: Set<string>): number {
  let total = 0;
  selectedIds.forEach((id) => {
    total += scenario.scoreBreakdown[id] || 0;
  });
  return Math.min(Math.max(total, 0), 98);
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
type Step = "select" | "details" | "evidence" | "defense" | "result";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DisputeRoleplay() {
  const [step, setStep] = useState<Step>("select");
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<Set<string>>(new Set());
  const [defenseText, setDefenseText] = useState("");
  const [showXpToast, setShowXpToast] = useState<string | null>(null);
  const { recordQuiz, visitPage } = useGameProgress();
  const xpAwarded = useRef<Set<string>>(new Set());

  useEffect(() => {
    visitPage("/labs/dispute-roleplay");
  }, [visitPage]);

  const winProb = useMemo(
    () => (selectedScenario ? calculateWinProbability(selectedScenario, selectedEvidence) : 0),
    [selectedScenario, selectedEvidence]
  );

  const didWin = winProb >= 60;

  const toggleEvidence = useCallback((id: string) => {
    setSelectedEvidence((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectScenario = useCallback((s: Scenario) => {
    setSelectedScenario(s);
    setSelectedEvidence(new Set());
    setDefenseText("");
    setStep("details");
  }, []);

  const handleSubmit = useCallback(() => {
    setStep("result");
    if (selectedScenario && !xpAwarded.current.has(selectedScenario.id)) {
      xpAwarded.current.add(selectedScenario.id);
      const won = calculateWinProbability(selectedScenario, selectedEvidence) >= 60;
      const xp = won ? 10 : 5;
      recordQuiz("/labs/dispute-" + selectedScenario.id, won ? 1 : 0, 1, xp);
      setShowXpToast(`+${xp} XP${won ? " -- Disputa vencida!" : ""}`);
      setTimeout(() => setShowXpToast(null), 4000);
    }
  }, [selectedScenario, selectedEvidence, recordQuiz]);

  const handleReset = useCallback(() => {
    setStep("select");
    setSelectedScenario(null);
    setSelectedEvidence(new Set());
    setDefenseText("");
  }, []);

  // =========================================================================
  // RENDER: Scenario Selection
  // =========================================================================
  if (step === "select") {
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
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
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            Selecione um cenario de chargeback e monte a defesa como merchant.
            Escolha evidencias, escreva a carta de defesa e veja o resultado.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {SCENARIOS.map((s) => {
            const diffStyle = getDifficultyStyle(s.difficulty);
            return (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(s)}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                {/* Brand + Code */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.25rem",
                      background: getBrandColor(s.brand),
                      color: "white",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {s.brand}
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.25rem",
                      background: diffStyle.bg,
                      color: diffStyle.color,
                    }}
                  >
                    {s.difficulty}
                  </span>
                </div>
                {/* Reason code */}
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    marginBottom: "0.25rem",
                    fontFamily: "monospace",
                  }}
                >
                  {s.reasonCode}
                </div>
                {/* Description */}
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  {s.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!selectedScenario) return null;
  const sc = selectedScenario;

  // =========================================================================
  // RENDER: Transaction Details
  // =========================================================================
  if (step === "details") {
    const diffStyle = getDifficultyStyle(sc.difficulty);
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={handleReset}
            style={{
              color: "var(--primary)",
              fontSize: "0.8rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              marginBottom: "0.75rem",
              padding: "0",
            }}
          >
            &larr; Voltar aos cenarios
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>
              Disputa {sc.reasonCode}
            </h1>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                padding: "0.2rem 0.5rem",
                borderRadius: "0.25rem",
                background: getBrandColor(sc.brand),
                color: "white",
              }}
            >
              {sc.brand}
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                padding: "0.2rem 0.5rem",
                borderRadius: "0.25rem",
                background: diffStyle.bg,
                color: diffStyle.color,
              }}
            >
              {sc.difficulty}
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{sc.description}</p>
        </div>

        {/* Context */}
        <div
          style={{
            background: "#EF444410",
            border: "1px solid #EF444430",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#EF4444", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Alegacao do Portador
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>{sc.context}</p>
        </div>

        {/* Two columns: Transaction + Timeline/Brand */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          {/* Transaction details */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1rem 1.25rem",
            }}
          >
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
              Detalhes da Transacao
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {([
                ["Valor", `R$ ${sc.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
                ["Data", sc.dataTransacao],
                ["Merchant", sc.merchantName],
                ["MCC", sc.mcc],
                ["Tipo", sc.tipo],
                ["Auth Code", sc.authCode],
                ["Cartao", `**** ${sc.lastFour}`],
                ["Entry Mode", sc.entryMode],
                ["3DS", sc.threeDSStatus],
                ["AVS", sc.avsResult],
                ["CVV", sc.cvvResult],
                ["Rastreio", sc.deliveryTracking || "N/A (produto digital)"],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                  <span style={{ color: "var(--foreground)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline + Brand rules */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "1rem 1.25rem",
              }}
            >
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Timeline
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {([
                  ["Compra realizada", sc.dataTransacao],
                  ["Disputa aberta", sc.disputeFiledDate],
                  ["Prazo para resposta", sc.responseDeadline],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ color: label.includes("Prazo") ? "#EF4444" : "var(--foreground)", fontWeight: label.includes("Prazo") ? 700 : 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "var(--primary-bg)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "1rem 1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.4rem",
                    borderRadius: "0.25rem",
                    background: getBrandColor(sc.brand),
                    color: "white",
                  }}
                >
                  {sc.brand}
                </span>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--foreground)" }}>
                  Regras da Bandeira
                </span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--foreground)", lineHeight: 1.5, marginBottom: "0.375rem" }}>
                <strong>Prazo:</strong> {sc.brandDeadlineDays} dias
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--foreground)", lineHeight: 1.5, marginBottom: "0.375rem" }}>
                <strong>Processo:</strong> {sc.brandProcess}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {sc.brandNote}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep("evidence")}
          style={{
            padding: "0.75rem 2rem",
            borderRadius: "0.5rem",
            background: "var(--primary)",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          Montar Defesa &rarr;
        </button>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Evidence Selection + Defense
  // =========================================================================
  if (step === "evidence" || step === "defense") {
    const evidenceForScenario = EVIDENCE_LIBRARY.map((e) => ({
      ...e,
      relevance: (e.relevanceByScenario[sc.reasonCode] || "Baixa") as Relevance,
    }));
    // Sort: Alta first, then Media, then Baixa
    const sortedEvidence = [...evidenceForScenario].sort((a, b) => {
      const order: Record<Relevance, number> = { Alta: 0, Media: 1, Baixa: 2 };
      return order[a.relevance] - order[b.relevance];
    });

    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => setStep("details")}
            style={{
              color: "var(--primary)",
              fontSize: "0.8rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              marginBottom: "0.75rem",
              padding: "0",
            }}
          >
            &larr; Voltar aos detalhes
          </button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>
              Montar Defesa - {sc.reasonCode}
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
              {selectedEvidence.size} evidencias selecionadas
            </span>
          </div>
        </div>

        {/* Strength meter */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "0.75rem 1.25rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Probabilidade
          </span>
          <div style={{ flex: 1, height: "8px", background: "var(--background)", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                width: `${winProb}%`,
                height: "100%",
                background: winProb >= 60 ? "#10B981" : winProb >= 40 ? "#F59E0B" : "#EF4444",
                borderRadius: "4px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: winProb >= 60 ? "#10B981" : winProb >= 40 ? "#F59E0B" : "#EF4444",
              minWidth: "40px",
              textAlign: "right",
            }}
          >
            {winProb}%
          </span>
        </div>

        {/* Evidence Grid */}
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
          Biblioteca de Evidencias ({sc.reasonCode})
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {sortedEvidence.map((e) => {
            const isSelected = selectedEvidence.has(e.id);
            const relStyle = getRelevanceStyle(e.relevance);
            return (
              <button
                key={e.id}
                onClick={() => toggleEvidence(e.id)}
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                  background: isSelected ? "var(--primary-bg)" : "var(--surface)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                }}
              >
                {/* Checkbox */}
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "3px",
                    border: `2px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                    background: isSelected ? "var(--primary)" : "transparent",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    color: "white",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  {isSelected ? "\u2713" : ""}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.125rem" }}>
                    <span style={{ fontSize: "0.9rem" }}>{e.icon}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3 }}>
                      {e.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      padding: "0.1rem 0.35rem",
                      borderRadius: "0.2rem",
                      background: relStyle.bg,
                      color: relStyle.color,
                    }}
                  >
                    {relStyle.label} relevancia
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Written Defense */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            Carta de Defesa do Merchant
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              background: "var(--background)",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "0.5rem",
              lineHeight: 1.5,
            }}
          >
            Estrutura sugerida: 1) Resumo da transacao &bull; 2) Evidencias apresentadas &bull; 3) Por que a disputa e invalida
          </div>
          <textarea
            value={defenseText}
            onChange={(e) => setDefenseText(e.target.value)}
            placeholder="Escreva a defesa do merchant aqui..."
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid var(--border)",
              background: "var(--background)",
              color: "var(--foreground)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textAlign: "right", marginTop: "0.25rem" }}>
            {defenseText.length} caracteres
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={selectedEvidence.size === 0}
          style={{
            width: "100%",
            padding: "0.875rem",
            borderRadius: "0.5rem",
            background: selectedEvidence.size === 0 ? "var(--surface)" : "var(--primary)",
            color: selectedEvidence.size === 0 ? "var(--text-secondary)" : "white",
            border: `1px solid ${selectedEvidence.size === 0 ? "var(--border)" : "var(--primary)"}`,
            cursor: selectedEvidence.size === 0 ? "not-allowed" : "pointer",
            fontWeight: 700,
            fontSize: "0.95rem",
          }}
        >
          Submeter Defesa &rarr;
        </button>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Result
  // =========================================================================
  if (step === "result") {
    const selectedIds = Array.from(selectedEvidence);
    const breakdown = selectedIds
      .map((id) => ({
        id,
        label: EVIDENCE_LIBRARY.find((e) => e.id === id)?.label || id,
        score: sc.scoreBreakdown[id] || 0,
      }))
      .sort((a, b) => b.score - a.score);

    const missingImportant = Object.entries(sc.missingPenalties)
      .filter(([id]) => !selectedEvidence.has(id))
      .sort((a, b) => (sc.scoreBreakdown[b[0]] || 0) - (sc.scoreBreakdown[a[0]] || 0))
      .slice(0, 3);

    const potentialGain = missingImportant.reduce((sum, [id]) => sum + (sc.scoreBreakdown[id] || 0), 0);
    const improvedProb = Math.min(winProb + potentialGain, 98);

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

        {/* Win/Lose Hero */}
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
          <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
            Veredicto Simulado
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: didWin ? "#10B981" : "#EF4444",
              marginBottom: "0.375rem",
            }}
          >
            {didWin ? "Ganhou!" : "Perdeu"}
          </h2>
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.25rem" }}>
            {winProb}% chance de ganhar
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {didWin
              ? "Sua defesa tem evidencias suficientes para vencer esta disputa."
              : "A defesa precisa de evidencias mais fortes para convencer o emissor."}
          </p>
          <div
            style={{
              marginTop: "0.75rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: didWin ? "#10B981" : "#F59E0B",
            }}
          >
            {didWin ? "+10 XP ganhos" : "+5 XP pela tentativa"}
          </div>
        </div>

        {/* Score Breakdown */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
            Detalhamento da Pontuacao
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {breakdown.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.8rem",
                  padding: "0.25rem 0",
                }}
              >
                <span style={{ color: "#10B981", fontWeight: 700, fontSize: "0.75rem", minWidth: "40px" }}>
                  +{b.score}%
                </span>
                <span style={{ color: "var(--foreground)", flex: 1 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What would strengthen */}
        {missingImportant.length > 0 && (
          <div
            style={{
              background: "#F59E0B10",
              border: "1px solid #F59E0B30",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
              O que fortaleceria o caso
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {missingImportant.map(([id, suggestion]) => {
                const evLabel = EVIDENCE_LIBRARY.find((e) => e.id === id)?.label || id;
                return (
                  <div key={id} style={{ fontSize: "0.8rem", color: "var(--foreground)", lineHeight: 1.5 }}>
                    <span style={{ color: "#EF4444", fontWeight: 700, fontSize: "0.75rem" }}>-{sc.scoreBreakdown[id]}%</span>
                    {" "}
                    <strong>{evLabel}:</strong> {suggestion}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", fontWeight: 600, color: "#F59E0B" }}>
              Adicionar essas evidencias aumentaria para ~{improvedProb}%
            </div>
          </div>
        )}

        {/* Brand-specific reminder */}
        <div
          style={{
            background: "var(--primary-bg)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                padding: "0.15rem 0.4rem",
                borderRadius: "0.25rem",
                background: getBrandColor(sc.brand),
                color: "white",
              }}
            >
              {sc.brand}
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground)" }}>
              Lembrete da Bandeira
            </span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {sc.brandNote}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={handleReset}
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
            Tentar Outro Cenario
          </button>
          <Link
            href="/labs"
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Voltar aos Labs
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
