"use client";

import { useState, useEffect } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";
import FlowDiagram from "@/components/ui/FlowDiagram";
import type { FlowStep } from "@/components/ui/FlowDiagram";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

const sectionStyle: React.CSSProperties = {
  padding: "1.5rem",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  marginBottom: "1.25rem",
};

const headingStyle: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 700,
  color: "var(--foreground)",
  marginBottom: "0.75rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  lineHeight: 1.7,
  color: "var(--text-secondary)",
  marginBottom: "0.75rem",
};

const subheadingStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "var(--foreground)",
  marginBottom: "0.5rem",
  marginTop: "1rem",
};

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.8125rem",
};

const thStyle: React.CSSProperties = {
  padding: "0.625rem 0.75rem",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-secondary)",
  borderBottom: "2px solid var(--border)",
  background: "var(--surface)",
};

const tdStyle: React.CSSProperties = {
  padding: "0.625rem 0.75rem",
  borderBottom: "1px solid var(--border)",
  color: "var(--foreground)",
  verticalAlign: "top",
};

const highlightBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(59,130,246,0.25)",
  background: "rgba(59,130,246,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const codeBlockStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  background: "#1e1e2e",
  border: "1px solid var(--border)",
  fontFamily: "monospace",
  fontSize: "0.8rem",
  color: "#cdd6f4",
  overflowX: "auto",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  lineHeight: 1.6,
  whiteSpace: "pre",
};

const warningBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(239,68,68,0.25)",
  background: "rgba(239,68,68,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const endpointStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "0.25rem 0.75rem",
  borderRadius: 6,
  background: "rgba(139,92,246,0.12)",
  color: "#a78bfa",
  fontFamily: "monospace",
  fontSize: "0.85rem",
  fontWeight: 600,
  marginBottom: "0.5rem",
};

const fieldDescStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  lineHeight: 1.6,
  color: "var(--text-secondary)",
  marginBottom: "0.25rem",
};

// ---------------------------------------------------------------------------
// Flow Diagram Data
// ---------------------------------------------------------------------------

const cessaoFIDCSteps: FlowStep[] = [
  { from: "Cedente(SCD)", to: "Motor Credito", label: "1. Solicitacao", detail: "Merchant solicita antecipacao de recebiveis via API /credit/simulate. Motor avalia elegibilidade, calcula taxa e monta proposta.", type: "request" },
  { from: "Motor Credito", to: "Motor Credito", label: "2. Analise", detail: "Underwriting automatico: consulta SCR, valida agenda de recebiveis, calcula cobertura colateral (>1.1x), aplica modelo de risco e define pricing.", type: "request" },
  { from: "Motor Credito", to: "Cedente(SCD)", label: "3. Aprovacao", detail: "Retorna contrato com termos (taxa, prazo, garantias). Merchant assina digitalmente. Contrato ativado via webhook credit.contract.active.", type: "response" },
  { from: "Motor Credito", to: "Registradora", label: "4. Registro CERC", detail: "POST /registry/lock trava URs na registradora (CERC/CIP/TAG). Efeito de contrato registrado com CNPJ do beneficiario e referencia do contrato.", type: "request" },
  { from: "Registradora", to: "Motor Credito", label: "5. Confirmacao", detail: "Registradora confirma trava das URs. Status muda para 'gravada'. Lock_id retornado para rastreamento.", type: "response" },
  { from: "Motor Credito", to: "FIDC", label: "6. Cessao", detail: "POST /receivables/assign realiza cessao formal. Recebiveis transferidos do cedente para o FIDC. Liquidacao redirecionada para conta do fundo.", type: "request" },
  { from: "FIDC", to: "Custodiante", label: "7. Relatorio NAV", detail: "Custodiante calcula NAV por cota: PL total, rendimento senior/mezanino/junior, ratio de cobertura, NPL. Relatorio disponivel via GET /fidc/{id}/report.", type: "async" },
  { from: "Custodiante", to: "Investidor", label: "8. Distribuicao", detail: "Waterfall de distribuicao: despesas → rendimento senior → rendimento mezanino → residual junior. Pagamento via TED/PIX para cotistas.", type: "async" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CreditAPIPayloadsPage() {
  const { visitPage } = useGameProgress();

  useEffect(() => {
    visitPage("/knowledge/credit-api-payloads");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sections: Section[] = [
    /* ------------------------------------------------------------------ */
    /* 1. API de Simulacao de Credito                                      */
    /* ------------------------------------------------------------------ */
    {
      id: "simulacao",
      title: "API de Simulacao de Credito",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            A API de simulacao permite que o merchant visualize as condicoes de credito antes de
            formalizar um contrato. E o primeiro passo do fluxo — nao gera compromisso, nao trava
            recebiveis, e tem validade curta (tipicamente 24h). O motor de credito calcula em
            tempo real com base na agenda de recebiveis do merchant.
          </p>
          <div style={endpointStyle}>POST /api/v1/credit/simulate</div>
          <p style={subheadingStyle}>Request</p>
          <div style={codeBlockStyle}>
{`{
  "merchant_id": "mch_a1b2c3d4",
  "product": "antecipacao_recebiveis",
  "amount_cents": 5000000,
  "installments": 12,
  "receivables_schedule": [
    {
      "due_date": "2025-05-15",
      "amount_cents": 450000,
      "acquirer": "stone",
      "brand": "visa"
    },
    {
      "due_date": "2025-06-15",
      "amount_cents": 430000,
      "acquirer": "stone",
      "brand": "mastercard"
    }
  ]
}`}
          </div>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Campo</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Descricao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>merchant_id</td><td style={tdStyle}>string</td><td style={tdStyle}>Identificador unico do merchant no sistema</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>product</td><td style={tdStyle}>enum</td><td style={tdStyle}>Tipo de produto: antecipacao_recebiveis, capital_giro, conta_garantida</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>amount_cents</td><td style={tdStyle}>integer</td><td style={tdStyle}>Valor solicitado em centavos (R$ 50.000,00 = 5000000)</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>installments</td><td style={tdStyle}>integer</td><td style={tdStyle}>Numero de parcelas desejadas (1-36)</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>receivables_schedule</td><td style={tdStyle}>array</td><td style={tdStyle}>Agenda de recebiveis a serem usados como garantia. Cada item contem data de vencimento, valor, adquirente e bandeira.</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Response (200 OK)</p>
          <div style={codeBlockStyle}>
{`{
  "simulation_id": "sim_x9y8z7",
  "approved_amount_cents": 4850000,
  "net_amount_cents": 4200000,
  "discount_rate_monthly": 0.025,
  "effective_annual_rate": 0.3449,
  "iof_cents": 85000,
  "fee_cents": 565000,
  "disbursement_date": "2025-04-02",
  "receivables_used": 12,
  "collateral_coverage_ratio": 1.15
}`}
          </div>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Campo</th>
                  <th style={thStyle}>Descricao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>simulation_id</td><td style={tdStyle}>ID unico da simulacao — usar para converter em contrato</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>approved_amount_cents</td><td style={tdStyle}>Valor aprovado (pode ser menor que o solicitado se recebiveis insuficientes)</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>net_amount_cents</td><td style={tdStyle}>Valor liquido que o merchant recebe apos descontos (IOF + fees)</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>discount_rate_monthly</td><td style={tdStyle}>Taxa de deságio mensal (2.5% = 0.025)</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>effective_annual_rate</td><td style={tdStyle}>CET — Custo Efetivo Total anualizado, obrigatorio por regulacao BCB</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>iof_cents</td><td style={tdStyle}>IOF calculado conforme Decreto 6.306 (0.38% + 0.0082%/dia)</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>fee_cents</td><td style={tdStyle}>Taxa administrativa da operacao</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>disbursement_date</td><td style={tdStyle}>Data prevista para desembolso (D+0 a D+2 util)</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>receivables_used</td><td style={tdStyle}>Quantidade de URs utilizadas como garantia</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>collateral_coverage_ratio</td><td style={tdStyle}>Ratio de cobertura: valor garantias / valor emprestimo. Minimo tipico: 1.1x</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Erros Comuns</p>
          <div style={codeBlockStyle}>
{`// 422 — Recebiveis insuficientes
{
  "error": {
    "code": "INSUFFICIENT_RECEIVABLES",
    "message": "Recebiveis disponiveis (R$ 38.000) insuficientes para o valor solicitado (R$ 50.000). Coverage ratio: 0.76x (minimo: 1.1x)",
    "available_amount_cents": 3800000,
    "required_coverage": 1.1
  }
}

// 403 — Merchant nao elegivel
{
  "error": {
    "code": "MERCHANT_NOT_ELIGIBLE",
    "message": "Merchant nao atende criterios minimos: tempo de operacao < 6 meses",
    "reasons": ["operating_time_insufficient", "no_receivables_history"]
  }
}`}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Dica de integracao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              A simulacao tem TTL de 24h. Apos expirar, o simulation_id nao pode ser usado para criar contrato.
              Implemente retry com nova simulacao caso o merchant demore para aceitar. O campo collateral_coverage_ratio
              e critico — FIDCs tipicamente exigem minimo de 1.1x a 1.3x dependendo do perfil de risco.
            </p>
          </div>
        </>
      ),
    },
    /* ------------------------------------------------------------------ */
    /* 2. API de Originacao de Contrato                                    */
    /* ------------------------------------------------------------------ */
    {
      id: "originacao",
      title: "API de Originacao de Contrato",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Apos a simulacao aprovada, a API de originacao formaliza o contrato de credito. Esse endpoint
            cria o contrato juridico, vincula as garantias (recebiveis), define a conta de desembolso e
            dispara o fluxo de assinatura digital. O contrato so ativa apos assinatura — ate la, os
            recebiveis nao sao travados na registradora.
          </p>
          <div style={endpointStyle}>POST /api/v1/credit/contracts</div>
          <p style={subheadingStyle}>Request</p>
          <div style={codeBlockStyle}>
{`{
  "simulation_id": "sim_x9y8z7",
  "merchant": {
    "id": "mch_a1b2c3d4",
    "cnpj": "12345678000190",
    "legal_name": "Loja Exemplo LTDA",
    "trading_name": "Loja Exemplo"
  },
  "product": "antecipacao_recebiveis",
  "amount_cents": 4850000,
  "term_months": 12,
  "guarantees": {
    "type": "receivables",
    "receivables_schedule": [
      {
        "ur_id": "ur_001",
        "due_date": "2025-05-15",
        "amount_cents": 450000,
        "acquirer": "stone",
        "brand": "visa",
        "arranjo": "visa_credito"
      }
    ]
  },
  "disbursement_account": {
    "bank_code": "260",
    "branch": "0001",
    "account": "12345678-9",
    "type": "checking",
    "pix_key": "12345678000190"
  }
}`}
          </div>
          <p style={subheadingStyle}>Response (201 Created)</p>
          <div style={codeBlockStyle}>
{`{
  "contract_id": "ctr_abc123",
  "status": "pending_signature",
  "created_at": "2025-04-01T14:30:00Z",
  "documents_url": "https://api.example.com/docs/ctr_abc123",
  "signature_required": true,
  "signature_method": "electronic",
  "signature_deadline": "2025-04-03T23:59:59Z",
  "terms": {
    "approved_amount_cents": 4850000,
    "net_amount_cents": 4200000,
    "effective_annual_rate": 0.3449,
    "iof_cents": 85000,
    "first_installment_date": "2025-05-15",
    "last_installment_date": "2026-04-15"
  }
}`}
          </div>
          <p style={subheadingStyle}>Webhooks do Ciclo de Vida</p>
          <div style={codeBlockStyle}>
{`// credit.contract.created — Contrato criado, aguardando assinatura
{
  "event": "credit.contract.created",
  "data": {
    "contract_id": "ctr_abc123",
    "status": "pending_signature",
    "merchant_id": "mch_a1b2c3d4",
    "amount_cents": 4850000
  },
  "timestamp": "2025-04-01T14:30:00Z"
}

// credit.contract.signed — Assinatura digital confirmada
{
  "event": "credit.contract.signed",
  "data": {
    "contract_id": "ctr_abc123",
    "status": "signed",
    "signed_at": "2025-04-01T16:45:00Z",
    "signer_ip": "189.10.xxx.xxx"
  }
}

// credit.contract.active — Contrato ativado, desembolso autorizado
{
  "event": "credit.contract.active",
  "data": {
    "contract_id": "ctr_abc123",
    "status": "active",
    "activated_at": "2025-04-01T17:00:00Z",
    "disbursement_scheduled": "2025-04-02T10:00:00Z"
  }
}`}
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Atencao: CONTRACT_EXPIRED
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se o merchant nao assinar dentro do prazo (signature_deadline), o contrato expira automaticamente
              com status &quot;expired&quot; e HTTP 410 em consultas subsequentes. Os recebiveis nao sao travados
              ate a assinatura, entao nao ha cleanup necessario na registradora.
            </p>
          </div>
        </>
      ),
    },
    /* ------------------------------------------------------------------ */
    /* 3. API de Cessao de Recebiveis (para FIDC)                         */
    /* ------------------------------------------------------------------ */
    {
      id: "cessao-recebiveis",
      title: "API de Cessao de Recebiveis (para FIDC)",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            A cessao transfere formalmente os recebiveis do cedente (SCD/merchant) para o cessionario (FIDC).
            E o mecanismo juridico que permite ao FIDC ser o dono dos fluxos futuros de pagamento. Apos a cessao,
            a liquidacao e redirecionada — o adquirente paga diretamente na conta do FIDC, nao mais do merchant.
          </p>
          <div style={endpointStyle}>POST /api/v1/receivables/assign</div>
          <p style={subheadingStyle}>Request</p>
          <div style={codeBlockStyle}>
{`{
  "cedente_id": "mch_a1b2c3d4",
  "cedente_cnpj": "12345678000190",
  "cessionario_id": "fidc_xyz789",
  "cessionario_cnpj": "98765432000110",
  "contract_id": "ctr_abc123",
  "receivables": [
    {
      "ur_id": "ur_001",
      "arranjo": "visa_credito",
      "acquirer_cnpj": "11222333000181",
      "due_date": "2025-05-15",
      "amount_cents": 450000
    },
    {
      "ur_id": "ur_002",
      "arranjo": "mastercard_credito",
      "acquirer_cnpj": "11222333000181",
      "due_date": "2025-06-15",
      "amount_cents": 430000
    }
  ],
  "registrar": "cerc",
  "discount_rate": 0.025,
  "settlement_redirect": true
}`}
          </div>
          <p style={subheadingStyle}>Response (201 Created)</p>
          <div style={codeBlockStyle}>
{`{
  "assignment_id": "asg_def456",
  "status": "registered",
  "registered_at": "2025-04-01T17:05:00Z",
  "registered_urs": 2,
  "total_face_value_cents": 880000,
  "total_discounted_value_cents": 836000,
  "settlement_redirect_confirmed": true,
  "registrar": "cerc",
  "registrar_protocol": "CERC-2025-0401-00789"
}`}
          </div>
          <p style={subheadingStyle}>Ciclo de Vida Completo</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Etapa</th>
                  <th style={thStyle}>Acao</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Descricao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>1</td><td style={tdStyle}>Request</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>pending</td><td style={tdStyle}>Cessao solicitada, aguardando registro na registradora</td></tr>
                <tr><td style={tdStyle}>2</td><td style={tdStyle}>Registro CERC</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>registering</td><td style={tdStyle}>Comunicacao assincrona com CERC/CIP/TAG em andamento</td></tr>
                <tr><td style={tdStyle}>3</td><td style={tdStyle}>Confirmacao</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>registered</td><td style={tdStyle}>URs registradas e marcadas como cedidas na registradora</td></tr>
                <tr><td style={tdStyle}>4</td><td style={tdStyle}>Liquidacao</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>settled</td><td style={tdStyle}>Adquirente liquidou na conta do FIDC conforme redirect</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Cessao vs Trava
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Trava (lock) apenas reserva os recebiveis como garantia — o dinheiro ainda vai para o merchant.
              Cessao transfere a propriedade — o dinheiro vai direto para o FIDC. Na pratica, a cessao sempre
              inclui liquidacao direcionada (settlement_redirect=true) para garantir que o fluxo financeiro
              acompanhe o fluxo juridico.
            </p>
          </div>
        </>
      ),
    },
    /* ------------------------------------------------------------------ */
    /* 4. API de Registradora (CERC/CIP/TAG)                              */
    /* ------------------------------------------------------------------ */
    {
      id: "registradora",
      title: "API de Registradora (CERC/CIP/TAG)",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            As registradoras (CERC, CIP/B3, TAG) sao a infraestrutura central do mercado de recebiveis
            no Brasil. Reguladas pelo BCB (Resolucao 4.734), elas garantem transparencia sobre gravames,
            cessoes e liquidacao direcionada. Toda operacao de credito com recebiveis de cartao precisa
            ser registrada.
          </p>

          {/* 4a. Consulta de Agenda */}
          <p style={subheadingStyle}>4a. Consulta de Agenda de Recebiveis</p>
          <div style={endpointStyle}>GET /api/v1/registry/schedule?merchant_cnpj=12345678000190&start_date=2025-04-01&end_date=2025-12-31</div>
          <p style={paragraphStyle}>
            Retorna a agenda completa de recebiveis do merchant na registradora. Cada UR (Unidade de Recebivel)
            tem status que indica se esta livre, gravada (com efeito de contrato) ou cedida.
          </p>
          <div style={codeBlockStyle}>
{`// Response (200 OK)
{
  "merchant_cnpj": "12345678000190",
  "period": { "start": "2025-04-01", "end": "2025-12-31" },
  "total_urs": 48,
  "receivables": [
    {
      "ur_id": "ur_001",
      "arranjo": "visa_credito",
      "acquirer": "stone",
      "acquirer_cnpj": "11222333000181",
      "due_date": "2025-05-15",
      "amount_cents": 450000,
      "status": "livre",
      "locked_by": null,
      "assigned_to": null
    },
    {
      "ur_id": "ur_015",
      "arranjo": "mastercard_debito",
      "acquirer": "cielo",
      "acquirer_cnpj": "01027058000191",
      "due_date": "2025-07-20",
      "amount_cents": 320000,
      "status": "gravada",
      "locked_by": "ctr_old999",
      "assigned_to": null
    },
    {
      "ur_id": "ur_032",
      "arranjo": "elo_credito",
      "acquirer": "rede",
      "acquirer_cnpj": "01425787000104",
      "due_date": "2025-09-10",
      "amount_cents": 280000,
      "status": "cedida",
      "locked_by": null,
      "assigned_to": "98765432000110"
    }
  ]
}`}
          </div>

          {/* 4b. Trava */}
          <p style={subheadingStyle}>4b. Trava (Efeito de Contrato)</p>
          <div style={endpointStyle}>POST /api/v1/registry/lock</div>
          <p style={paragraphStyle}>
            Registra efeito de contrato sobre URs especificas. A trava impede que outro credor grave ou
            ceda os mesmos recebiveis. E o equivalente a uma hipoteca sobre fluxos futuros.
          </p>
          <div style={codeBlockStyle}>
{`// Request
{
  "urs": ["ur_001", "ur_002", "ur_003", "ur_004"],
  "beneficiary_cnpj": "98765432000110",
  "contract_reference": "ctr_abc123",
  "lock_type": "total",
  "expiration_date": "2026-04-15"
}

// Response (201 Created)
{
  "lock_id": "lck_789xyz",
  "status": "active",
  "locked_urs_count": 4,
  "total_locked_amount_cents": 1730000,
  "registered_at": "2025-04-01T17:02:00Z",
  "registrar_protocol": "CERC-2025-0401-00456"
}`}
          </div>

          {/* 4c. Cessao */}
          <p style={subheadingStyle}>4c. Cessao na Registradora</p>
          <div style={endpointStyle}>POST /api/v1/registry/assign</div>
          <p style={paragraphStyle}>
            Apos a trava, a cessao formal transfere a titularidade das URs. Com settlement_redirect=true,
            o adquirente passa a liquidar diretamente na conta do cessionario.
          </p>
          <div style={codeBlockStyle}>
{`// Request
{
  "lock_id": "lck_789xyz",
  "cessionario_cnpj": "98765432000110",
  "assignment_value_cents": 1680000,
  "settlement_redirect": true,
  "settlement_account": {
    "bank_code": "341",
    "branch": "1234",
    "account": "56789-0"
  }
}

// Response (201 Created)
{
  "assignment_id": "asg_abc789",
  "status": "registered",
  "registered_at": "2025-04-01T17:05:00Z",
  "settlement_redirected": true,
  "effective_from": "2025-04-02",
  "registrar_protocol": "CERC-2025-0401-00789"
}`}
          </div>

          {/* 4d. Liquidacao Direcionada */}
          <p style={subheadingStyle}>4d. Liquidacao Direcionada</p>
          <div style={endpointStyle}>POST /api/v1/registry/directed-settlement</div>
          <p style={paragraphStyle}>
            Configura o redirecionamento de liquidacao para que o adquirente deposite diretamente na conta
            do credor/FIDC ao inves da conta do merchant. E o mecanismo que garante a efetividade da garantia.
          </p>
          <div style={codeBlockStyle}>
{`// Request
{
  "assignment_id": "asg_abc789",
  "settlement_account": {
    "banco": "341",
    "agencia": "1234",
    "conta": "56789-0",
    "tipo": "corrente"
  },
  "priority": 1,
  "amount_limit_cents": null
}

// Response (200 OK)
{
  "settlement_instructions": {
    "id": "stl_instr_001",
    "assignment_id": "asg_abc789",
    "destination_bank": "341",
    "destination_branch": "1234",
    "destination_account": "56789-0",
    "priority": 1,
    "status": "active"
  },
  "effective_from": "2025-04-02",
  "acquirers_notified": ["stone", "cielo"]
}`}
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Erro: UR_ALREADY_LOCKED
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se uma UR ja esta gravada por outro contrato, a registradora retorna HTTP 409 com codigo
              UR_ALREADY_LOCKED. Isso e comum quando multiplos credores tentam gravar as mesmas URs.
              O sistema deve implementar retry com selecao de URs alternativas.
            </p>
          </div>
        </>
      ),
    },
    /* ------------------------------------------------------------------ */
    /* 5. API de Desembolso                                                */
    /* ------------------------------------------------------------------ */
    {
      id: "desembolso",
      title: "API de Desembolso",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Apos o contrato estar ativo e os recebiveis travados/cedidos, o desembolso transfere o valor
            liquido para a conta do merchant. Suporta PIX (instantaneo), TED (mesmo dia ate 17h) e
            transferencia interna (entre contas da mesma instituicao).
          </p>
          <div style={endpointStyle}>POST /api/v1/credit/disbursements</div>
          <p style={subheadingStyle}>Request</p>
          <div style={codeBlockStyle}>
{`{
  "contract_id": "ctr_abc123",
  "disbursement_method": "pix",
  "amount_cents": 4200000,
  "destination_account": {
    "pix_key": "12345678000190",
    "pix_key_type": "cnpj"
  },
  "idempotency_key": "disb_20250402_ctr_abc123"
}`}
          </div>
          <p style={subheadingStyle}>Response (201 Created)</p>
          <div style={codeBlockStyle}>
{`{
  "disbursement_id": "disb_ghi012",
  "contract_id": "ctr_abc123",
  "status": "processing",
  "amount_cents": 4200000,
  "method": "pix",
  "estimated_arrival": "2025-04-02T10:05:00Z",
  "pix_e2e_id": "E260601012025040210050000000001",
  "created_at": "2025-04-02T10:00:00Z"
}`}
          </div>
          <p style={subheadingStyle}>Webhooks</p>
          <div style={codeBlockStyle}>
{`// credit.disbursement.completed
{
  "event": "credit.disbursement.completed",
  "data": {
    "disbursement_id": "disb_ghi012",
    "contract_id": "ctr_abc123",
    "status": "completed",
    "amount_cents": 4200000,
    "pix_e2e_id": "E260601012025040210050000000001",
    "completed_at": "2025-04-02T10:02:30Z"
  }
}

// credit.disbursement.failed
{
  "event": "credit.disbursement.failed",
  "data": {
    "disbursement_id": "disb_ghi012",
    "contract_id": "ctr_abc123",
    "status": "failed",
    "failure_reason": "DESTINATION_ACCOUNT_CLOSED",
    "failure_detail": "Conta destino encerrada junto ao banco receptor",
    "retry_eligible": true
  }
}`}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Idempotencia no desembolso
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O campo idempotency_key e obrigatorio. Sem ele, uma falha de rede seguida de retry pode gerar
              desembolso duplicado — que e irrecuperavel. Use pattern: disb_ + data + contract_id. O servidor
              retorna 200 (nao 201) se a idempotency key ja foi processada.
            </p>
          </div>
        </>
      ),
    },
    /* ------------------------------------------------------------------ */
    /* 6. API de Cobranca e Regua                                          */
    /* ------------------------------------------------------------------ */
    {
      id: "cobranca-regua",
      title: "API de Cobranca e Regua de Cobranca",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            A regua de cobranca automatiza o ciclo de vida de cada parcela do contrato de credito.
            Desde o aviso pre-vencimento ate a cessao de creditos inadimplentes, cada etapa tem
            timing definido, canal de comunicacao e acao automatica.
          </p>
          <div style={endpointStyle}>GET /api/v1/credit/contracts/{"{id}"}/installments</div>
          <p style={subheadingStyle}>Response (200 OK)</p>
          <div style={codeBlockStyle}>
{`{
  "contract_id": "ctr_abc123",
  "total_installments": 12,
  "installments": [
    {
      "number": 1,
      "due_date": "2025-05-15",
      "amount_cents": 450000,
      "status": "paid",
      "paid_at": "2025-05-15T09:30:00Z",
      "paid_amount_cents": 450000,
      "payment_method": "receivable_offset"
    },
    {
      "number": 2,
      "due_date": "2025-06-15",
      "amount_cents": 430000,
      "status": "paid",
      "paid_at": "2025-06-14T16:00:00Z",
      "paid_amount_cents": 430000,
      "payment_method": "pix"
    },
    {
      "number": 3,
      "due_date": "2025-07-15",
      "amount_cents": 450000,
      "status": "overdue",
      "paid_at": null,
      "paid_amount_cents": 0,
      "days_overdue": 5,
      "penalty_cents": 9000,
      "interest_cents": 4500
    },
    {
      "number": 4,
      "due_date": "2025-08-15",
      "amount_cents": 440000,
      "status": "pending",
      "paid_at": null,
      "paid_amount_cents": 0
    }
  ]
}`}
          </div>
          <p style={subheadingStyle}>Webhook de Parcela Vencida</p>
          <div style={codeBlockStyle}>
{`{
  "event": "credit.installment.overdue",
  "data": {
    "contract_id": "ctr_abc123",
    "installment_number": 3,
    "due_date": "2025-07-15",
    "amount_cents": 450000,
    "days_overdue": 5,
    "penalty_cents": 9000,
    "interest_cents": 4500
  },
  "timestamp": "2025-07-20T06:00:00Z"
}`}
          </div>
          <p style={subheadingStyle}>Regua de Cobranca Completa</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Dia</th>
                  <th style={thStyle}>Canal</th>
                  <th style={thStyle}>Acao</th>
                  <th style={thStyle}>Detalhe</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>D-3</td><td style={tdStyle}>Email + Push</td><td style={tdStyle}>Lembrete pre-vencimento</td><td style={tdStyle}>Aviso amigavel com link para pagamento antecipado</td></tr>
                <tr><td style={tdStyle}>D+1</td><td style={tdStyle}>SMS</td><td style={tdStyle}>Aviso de atraso</td><td style={tdStyle}>SMS automatico informando vencimento ontem e valor atualizado</td></tr>
                <tr><td style={tdStyle}>D+5</td><td style={tdStyle}>Email</td><td style={tdStyle}>Cobranca formal</td><td style={tdStyle}>Email com boleto atualizado, multa (2%) e juros (1% a.m.)</td></tr>
                <tr><td style={tdStyle}>D+15</td><td style={tdStyle}>Telefone</td><td style={tdStyle}>Contato ativo</td><td style={tdStyle}>Ligacao da equipe de cobranca com opcoes de renegociacao</td></tr>
                <tr><td style={tdStyle}>D+30</td><td style={tdStyle}>Bureaus</td><td style={tdStyle}>Negativacao</td><td style={tdStyle}>Inclusao em SPC/Serasa. Notificacao previa obrigatoria (10 dias antes)</td></tr>
                <tr><td style={tdStyle}>D+60</td><td style={tdStyle}>Juridico</td><td style={tdStyle}>Cessao de inadimplentes</td><td style={tdStyle}>Cessao do credito para empresa de cobranca ou write-off contabil</td></tr>
              </tbody>
            </table>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Regulacao: CDC Art. 42
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O Codigo de Defesa do Consumidor proibe cobranca que exponha o devedor ao ridiculo ou
              interfira em seu trabalho/descanso. A regua deve respeitar horarios (8h-20h) e frequencia
              maxima por canal. Negativacao exige notificacao previa de 10 dias uteis.
            </p>
          </div>
        </>
      ),
    },
    /* ------------------------------------------------------------------ */
    /* 7. API de FIDC — Relatorios                                         */
    /* ------------------------------------------------------------------ */
    {
      id: "fidc-relatorios",
      title: "API de FIDC — Relatorios",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            FIDCs (Fundos de Investimento em Direitos Creditorios) precisam de reporting rigoroso para
            cotistas, administradores e CVM. As APIs de relatorio expoe NAV (Net Asset Value) por cota,
            composicao da carteira, indicadores de risco e a waterfall de distribuicao de rendimentos.
          </p>
          <div style={endpointStyle}>GET /api/v1/fidc/{"{fund_id}"}/report</div>
          <p style={subheadingStyle}>Response — Relatorio do Fundo</p>
          <div style={codeBlockStyle}>
{`{
  "fund_id": "fidc_xyz789",
  "fund_name": "FIDC Recebiveis Varejo I",
  "report_date": "2025-04-01",
  "nav_per_quota": {
    "senior": 1.0234,
    "mezzanine": 1.0512,
    "junior": 1.1845
  },
  "total_pl_cents": 2500000000,
  "quotas": {
    "senior": { "quantity": 1500000, "pl_cents": 1534500000, "pct": 0.6138 },
    "mezzanine": { "quantity": 500000, "pl_cents": 525600000, "pct": 0.2102 },
    "junior": { "quantity": 350000, "pl_cents": 414575000, "pct": 0.1658 }
  },
  "yield_mtd": {
    "senior": 0.0089,
    "mezzanine": 0.0112,
    "junior": 0.0245
  },
  "risk_indicators": {
    "npl_ratio": 0.032,
    "npl_90_ratio": 0.018,
    "coverage_ratio": 1.25,
    "subordination_ratio": 0.376,
    "concentration_top10": 0.15,
    "average_term_days": 45,
    "portfolio_size": 12847
  }
}`}
          </div>

          <div style={endpointStyle}>GET /api/v1/fidc/{"{fund_id}"}/waterfall</div>
          <p style={subheadingStyle}>Response — Waterfall de Distribuicao</p>
          <div style={codeBlockStyle}>
{`{
  "fund_id": "fidc_xyz789",
  "period": "2025-03",
  "gross_revenue_cents": 38500000,
  "waterfall": [
    {
      "step": 1,
      "description": "Despesas do fundo (administracao, custodia, auditoria)",
      "amount_cents": 1250000,
      "cumulative_cents": 1250000,
      "remaining_cents": 37250000
    },
    {
      "step": 2,
      "description": "Rendimento cotas senior (CDI + 2.5% a.a.)",
      "amount_cents": 13345000,
      "cumulative_cents": 14595000,
      "remaining_cents": 23905000,
      "target_yield": "CDI + 2.5%",
      "actual_yield": "CDI + 2.52%"
    },
    {
      "step": 3,
      "description": "Rendimento cotas mezzanine (CDI + 5% a.a.)",
      "amount_cents": 5256000,
      "cumulative_cents": 19851000,
      "remaining_cents": 18649000,
      "target_yield": "CDI + 5%",
      "actual_yield": "CDI + 5.01%"
    },
    {
      "step": 4,
      "description": "Residual para cotas junior (equity)",
      "amount_cents": 18649000,
      "cumulative_cents": 38500000,
      "remaining_cents": 0,
      "implied_yield": "CDI + 18.4%"
    }
  ]
}`}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Subordinacao como protecao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O subordination_ratio (37.6%) indica que as cotas junior + mezzanine absorvem perdas antes
              das cotas senior. Se o NPL subir acima de 37.6%, os cotistas senior comecam a perder capital.
              Esse ratio e o principal fator de rating do FIDC pelas agencias (Fitch, S&P, Moody&apos;s).
            </p>
          </div>
        </>
      ),
    },
    /* ------------------------------------------------------------------ */
    /* 8. Mensageria e Formatos                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "mensageria-formatos",
      title: "Mensageria e Formatos",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Alem de APIs REST, o ecossistema de credito usa formatos legados e padronizados para
            comunicacao interbancaria, cobranca e registro. Conhecer esses formatos e essencial
            para integracoes com bancos tradicionais e infraestrutura de mercado.
          </p>

          <p style={subheadingStyle}>CNAB 240 — Cobranca Bancaria</p>
          <p style={paragraphStyle}>
            Arquivo texto posicional usado para remessa (envio de titulos) e retorno (confirmacao de pagamento)
            entre empresa e banco. Cada registro tem exatamente 240 caracteres.
          </p>
          <div style={codeBlockStyle}>
{`// Estrutura do arquivo CNAB 240
Header de Arquivo     (tipo 0) — Banco, empresa, data geracao, sequencial
  Header de Lote      (tipo 1) — Tipo servico (cobranca), forma pgto
    Detalhe Seg. P    (tipo 3) — Dados do titulo (nosso numero, vencimento, valor)
    Detalhe Seg. Q    (tipo 3) — Dados do sacado (nome, CPF/CNPJ, endereco)
    Detalhe Seg. R    (tipo 3) — Multa, juros, desconto, protesto
  Trailer de Lote     (tipo 5) — Totalizadores do lote
Trailer de Arquivo    (tipo 9) — Totalizadores gerais

// Exemplo Header (posicoes 1-240):
// Pos 001-003: Banco (341=Itau)
// Pos 004-007: Lote (0000=header arquivo)
// Pos 008-008: Tipo registro (0=header)
// Pos 018-032: Inscricao empresa (CNPJ)
// Pos 033-052: Convenio
// Pos 143-148: Data geracao (DDMMAAAA)`}
          </div>

          <p style={subheadingStyle}>XML ISO 20022 — Transferencias Interbancarias</p>
          <p style={paragraphStyle}>
            Padrao internacional de mensageria financeira. pain.001 para iniciacao de pagamento,
            camt.053 para extrato bancario. Usado pelo SPI (PIX) e em evolucao para substituir
            formatos proprietarios.
          </p>
          <div style={codeBlockStyle}>
{`<!-- pain.001 — Payment Initiation -->
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.09">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSG-2025-0401-001</MsgId>
      <CreDtTm>2025-04-01T14:30:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>42000.00</CtrlSum>
    </GrpHdr>
    <PmtInf>
      <PmtMtd>TRF</PmtMtd>
      <CdtTrfTxInf>
        <Amt><InstdAmt Ccy="BRL">42000.00</InstdAmt></Amt>
        <CdtrAcct><Id><IBAN>BR1234500000000123456789C1</IBAN></Id></CdtrAcct>
      </CdtTrfTxInf>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`}
          </div>

          <p style={subheadingStyle}>Webhook Schema — Padrao de Eventos</p>
          <p style={paragraphStyle}>
            Todos os webhooks do sistema de credito seguem um schema unificado com headers de seguranca
            para validacao de autenticidade.
          </p>
          <div style={codeBlockStyle}>
{`// Headers obrigatorios
X-Webhook-ID: whk_evt_20250401_001
X-Webhook-Timestamp: 1712000000
X-Webhook-Signature: sha256=a1b2c3d4e5f6...

// Validacao HMAC-SHA256:
// payload = webhook_id + "." + timestamp + "." + body
// signature = HMAC-SHA256(payload, webhook_secret)

// Body padrao
{
  "id": "whk_evt_20250401_001",
  "type": "credit.contract.active",
  "api_version": "2025-04-01",
  "created_at": "2025-04-01T17:00:00Z",
  "data": {
    "object": { /* ... payload do evento ... */ }
  },
  "livemode": true
}`}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Tolerancia de timestamp
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Sempre valide que o X-Webhook-Timestamp esta dentro de uma janela aceitavel (tipicamente 5 minutos).
              Isso previne replay attacks. Se o timestamp for muito antigo, rejeite o webhook com HTTP 403 e
              logue o evento para investigacao de seguranca.
            </p>
          </div>
        </>
      ),
    },
    /* ------------------------------------------------------------------ */
    /* 9. Codigos de Erro                                                  */
    /* ------------------------------------------------------------------ */
    {
      id: "codigos-erro",
      title: "Codigos de Erro",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Tabela completa de codigos de erro das APIs de credito. Cada erro tem um codigo semantico,
            HTTP status code e descricao detalhada. Use os codigos para implementar retry logic
            (5xx = retry, 4xx = nao retry) e mensagens de erro ao usuario.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Codigo</th>
                  <th style={thStyle}>HTTP</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Acao Recomendada</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem" }}>INSUFFICIENT_RECEIVABLES</td>
                  <td style={tdStyle}>422</td>
                  <td style={tdStyle}>Recebiveis insuficientes para o valor solicitado</td>
                  <td style={tdStyle}>Reduzir valor ou aguardar novas vendas</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem" }}>MERCHANT_NOT_ELIGIBLE</td>
                  <td style={tdStyle}>403</td>
                  <td style={tdStyle}>Merchant nao atende criterios de credito</td>
                  <td style={tdStyle}>Verificar requisitos minimos (tempo, faturamento)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem" }}>UR_ALREADY_LOCKED</td>
                  <td style={tdStyle}>409</td>
                  <td style={tdStyle}>UR ja travada por outro contrato</td>
                  <td style={tdStyle}>Selecionar URs alternativas disponiveis</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem" }}>ASSIGNMENT_DUPLICATE</td>
                  <td style={tdStyle}>409</td>
                  <td style={tdStyle}>Cessao duplicada detectada</td>
                  <td style={tdStyle}>Verificar se cessao anterior ja foi processada</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem" }}>REGISTRAR_UNAVAILABLE</td>
                  <td style={tdStyle}>503</td>
                  <td style={tdStyle}>Registradora temporariamente indisponivel</td>
                  <td style={tdStyle}>Retry com backoff exponencial (max 3 tentativas)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem" }}>CONTRACT_EXPIRED</td>
                  <td style={tdStyle}>410</td>
                  <td style={tdStyle}>Contrato expirado antes da assinatura</td>
                  <td style={tdStyle}>Criar nova simulacao e novo contrato</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem" }}>DISBURSEMENT_FAILED</td>
                  <td style={tdStyle}>502</td>
                  <td style={tdStyle}>Falha no desembolso (banco destino)</td>
                  <td style={tdStyle}>Verificar dados bancarios e tentar via outro metodo (PIX/TED)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem" }}>INSTALLMENT_ALREADY_PAID</td>
                  <td style={tdStyle}>409</td>
                  <td style={tdStyle}>Parcela ja liquidada</td>
                  <td style={tdStyle}>Ignorar — operacao idempotente</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem" }}>SCR_QUERY_FAILED</td>
                  <td style={tdStyle}>503</td>
                  <td style={tdStyle}>Consulta ao SCR (Sistema de Credito) falhou</td>
                  <td style={tdStyle}>Retry em 30s. Se persistir, usar cache de SCR anterior</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem" }}>KYC_INCOMPLETE</td>
                  <td style={tdStyle}>422</td>
                  <td style={tdStyle}>Documentacao KYC incompleta</td>
                  <td style={tdStyle}>Solicitar documentos faltantes ao merchant</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Pattern de retry
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Erros 5xx (REGISTRAR_UNAVAILABLE, SCR_QUERY_FAILED, DISBURSEMENT_FAILED) sao transientes
              e devem ser retried com backoff exponencial: 1s → 2s → 4s → 8s, maximo 3 tentativas.
              Erros 4xx (422, 403, 409, 410) indicam problemas de negocio e nao devem ser retried
              automaticamente — requerem acao do usuario ou correcao de dados.
            </p>
          </div>
        </>
      ),
    },
    /* ------------------------------------------------------------------ */
    /* 10. FlowDiagram: Fluxo Tecnico de Cessao FIDC                      */
    /* ------------------------------------------------------------------ */
    {
      id: "fluxo-cessao-fidc",
      title: "Fluxo Tecnico de Cessao FIDC",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            Diagrama completo do fluxo tecnico de cessao de recebiveis para FIDC, desde a originacao
            no motor de credito ate a distribuicao de rendimentos aos cotistas. Cada seta representa
            uma chamada de API ou evento assincrono documentado nas secoes anteriores.
          </p>
          <FlowDiagram
            title="Fluxo de Cessao de Recebiveis — FIDC"
            actors={["Cedente(SCD)", "Motor Credito", "Registradora", "FIDC", "Custodiante", "Investidor"]}
            steps={cessaoFIDCSteps}
          />
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Mapeamento API ↔ Etapa
            </p>
            <div style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.8 }}>
              <div style={{ marginBottom: "0.25rem" }}><strong>Etapa 1-2:</strong> POST /api/v1/credit/simulate → Secao 1</div>
              <div style={{ marginBottom: "0.25rem" }}><strong>Etapa 3:</strong> POST /api/v1/credit/contracts → Secao 2</div>
              <div style={{ marginBottom: "0.25rem" }}><strong>Etapa 4-5:</strong> POST /api/v1/registry/lock → Secao 4b</div>
              <div style={{ marginBottom: "0.25rem" }}><strong>Etapa 6:</strong> POST /api/v1/receivables/assign → Secao 3</div>
              <div style={{ marginBottom: "0.25rem" }}><strong>Etapa 7:</strong> GET /api/v1/fidc/{"{fund_id}"}/report → Secao 7</div>
              <div style={{ marginBottom: "0.25rem" }}><strong>Etapa 8:</strong> GET /api/v1/fidc/{"{fund_id}"}/waterfall → Secao 7</div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Credit APIs & Payloads
        </h1>
        <p className="page-description">
          Referencia tecnica completa das APIs de credito: simulacao, originacao, cessao de recebiveis,
          registradoras (CERC/CIP/TAG), desembolso, cobranca, FIDC e mensageria financeira.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Payloads reais de simulacao, originacao e cessao de credito</li>
          <li>Como integrar com registradoras (CERC/CIP/TAG) para trava e cessao de recebiveis</li>
          <li>Webhooks e ciclo de vida completo de contratos de credito</li>
          <li>Waterfall de distribuicao e relatorios de FIDC</li>
          <li>Formatos legados (CNAB 240) e modernos (ISO 20022) de mensageria financeira</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>10</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>15+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Endpoints</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>10</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Error Codes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Webhooks</div>
        </div>
      </div>

      {/* Content Sections */}
      {sections.map((section, idx) => (
        <div
          key={section.id}
          className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`}
          style={sectionStyle}
        >
          <h2 style={headingStyle}>
            <span style={{
              width: 28, height: 28, borderRadius: "50%",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
              background: "var(--primary)", color: "#fff",
            }}>
              {section.icon}
            </span>
            {section.title}
          </h2>
          {section.content}
        </div>
      ))}
    </div>
  );
}
