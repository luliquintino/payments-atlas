"use client";

import { useState } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Shared styles
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

const formulaStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  background: "var(--surface)",
  border: "1px solid var(--border)",
  fontFamily: "monospace",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "var(--primary)",
  textAlign: "center",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  lineHeight: 1.6,
};

const cardStyle: React.CSSProperties = {
  padding: "1.25rem",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--background)",
  marginBottom: "1rem",
};

const kpiCardStyle = (color: string): React.CSSProperties => ({
  padding: "1.25rem",
  borderRadius: 10,
  border: `1px solid var(--border)`,
  borderLeft: `4px solid ${color}`,
  background: "var(--background)",
  marginBottom: "0.75rem",
});

const stepCardStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--background)",
  marginBottom: "0.75rem",
  alignItems: "flex-start",
};

// ---------------------------------------------------------------------------
// Collapsible section wrapper
// ---------------------------------------------------------------------------

function CollapsibleSection({ section, index }: { section: Section; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      className={`animate-fade-in stagger-${Math.min(index + 2, 5)}`}
      style={sectionStyle}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          ...headingStyle,
          cursor: "pointer",
          width: "100%",
          background: "none",
          border: "none",
          textAlign: "left",
          justifyContent: "space-between",
          marginBottom: open ? "0.75rem" : 0,
        }}
        aria-expanded={open}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
              flexShrink: 0,
              background: "var(--primary)",
              color: "#fff",
            }}
          >
            {section.icon}
          </span>
          {section.title}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            flexShrink: 0,
            color: "var(--text-secondary)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && section.content}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ChargebackDeepDivePage() {
  const quiz = getQuizForPage("/knowledge/chargeback-deep-dive");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  // -----------------------------------------------------------------------
  // Sections
  // -----------------------------------------------------------------------

  const sections: Section[] = [
    /* ─── Secao 1: Anatomia Financeira ─── */
    {
      id: "anatomia-financeira",
      title: "Anatomia Financeira do Chargeback",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Um chargeback custa muito mais do que o valor da transacao original. Alem do debito
            integral, o merchant arca com taxas do adquirente, custos operacionais internos
            (analise, documentacao, equipe dedicada) e, caso esteja em programa de monitoramento,
            multas que podem ultrapassar centenas de dolares por mes.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>Valor Tipico</th>
                  <th style={thStyle}>Descricao</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Valor da transacao</td>
                  <td style={tdStyle}>R$100</td>
                  <td style={tdStyle}>Debito integral do valor</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Taxa de chargeback</td>
                  <td style={tdStyle}>R$15-50</td>
                  <td style={tdStyle}>Cobrada pelo adquirente</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Custo operacional</td>
                  <td style={tdStyle}>R$40-100</td>
                  <td style={tdStyle}>Analise, documentacao, equipe</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Multa potencial (VDMP)</td>
                  <td style={tdStyle}>R$0-500+</td>
                  <td style={tdStyle}>Se em programa de monitoramento</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 700, color: "var(--primary)" }}>Total</td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: "var(--primary)" }}>R$155-750+</td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: "var(--primary)" }}>Por chargeback</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={formulaStyle}>
            Impacto mensal = (chargebacks x custo medio) + (multa programa x meses) + (perda de receita por restricao)
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Exemplo Pratico
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Para recuperar a perda de 1 chargeback de R$100 (custo real R$300), com margem de 10%,
              o merchant precisa processar R$3.000 em novas vendas.
            </p>
          </div>
        </>
      ),
    },

    /* ─── Secao 2: Taxonomia de Reason Codes ─── */
    {
      id: "reason-codes",
      title: "Taxonomia de Reason Codes",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Cada bandeira possui uma taxonomia propria de reason codes que classifica o motivo da
            disputa. Conhecer os codigos e fundamental para montar a estrategia de defesa correta
            e estimar a probabilidade de sucesso (win rate) da contestacao.
          </p>

          {/* Visa */}
          <p style={subheadingStyle}>Visa Reason Codes</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Codigo</th>
                  <th style={thStyle}>Categoria</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["10.1", "Fraude", "EMV Liability Shift Counterfeit", "~10%"],
                  ["10.2", "Fraude", "EMV Liability Shift Non-Counterfeit", "~10%"],
                  ["10.3", "Fraude", "Other Fraud — Card Present", "~15%"],
                  ["10.4", "Fraude", "Other Fraud — Card Absent", "~18%"],
                  ["10.5", "Fraude", "Visa Fraud Monitoring Program", "~5%"],
                  ["11.1", "Autorizacao", "Card Recovery Bulletin", "~25%"],
                  ["11.2", "Autorizacao", "Declined Authorization", "~60%"],
                  ["11.3", "Autorizacao", "No Authorization", "~55%"],
                  ["12.1", "Processamento", "Late Presentment", "~20%"],
                  ["12.2", "Processamento", "Incorrect Transaction Code", "~30%"],
                  ["12.3", "Processamento", "Incorrect Currency", "~35%"],
                  ["12.4", "Processamento", "Incorrect Account Number", "~40%"],
                  ["12.5", "Processamento", "Incorrect Amount", "~45%"],
                  ["12.6", "Processamento", "Duplicate Processing", "~70%"],
                  ["12.7", "Processamento", "Invalid Data", "~30%"],
                  ["13.1", "Consumidor", "Merchandise/Services Not Received", "~55%"],
                  ["13.2", "Consumidor", "Cancelled Recurring", "~40%"],
                  ["13.3", "Consumidor", "Not as Described", "~35%"],
                  ["13.4", "Consumidor", "Counterfeit Merchandise", "~20%"],
                  ["13.5", "Consumidor", "Misrepresentation", "~25%"],
                  ["13.6", "Consumidor", "Credit Not Processed", "~50%"],
                  ["13.7", "Consumidor", "Cancelled Service", "~45%"],
                  ["13.8", "Consumidor", "Original Credit Transaction", "~30%"],
                  ["13.9", "Consumidor", "Non-Receipt of Cash", "~60%"],
                ].map(([code, cat, desc, wr]) => (
                  <tr key={code}>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontWeight: 600 }}>{code}</td>
                    <td style={tdStyle}>{cat}</td>
                    <td style={tdStyle}>{desc}</td>
                    <td style={tdStyle}>{wr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mastercard */}
          <p style={{ ...subheadingStyle, marginTop: "1.5rem" }}>Mastercard Reason Codes</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Codigo</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["4834", "Point of Interaction Error", "~35%"],
                  ["4837", "No Cardholder Authorization", "~15%"],
                  ["4840", "Fraudulent Processing of Transaction", "~12%"],
                  ["4853", "Cardholder Dispute — Defective/Not as Described", "~35%"],
                  ["4854", "Cardholder Dispute — Not Elsewhere Classified", "~30%"],
                  ["4855", "Goods or Services Not Provided", "~55%"],
                  ["4859", "Services Not Rendered", "~50%"],
                  ["4860", "Credit Not Processed", "~50%"],
                  ["4863", "Cardholder Does Not Recognize", "~40%"],
                  ["4871", "Chip/PIN Liability Shift", "~10%"],
                ].map(([code, desc, wr]) => (
                  <tr key={code}>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontWeight: 600 }}>{code}</td>
                    <td style={tdStyle}>{desc}</td>
                    <td style={tdStyle}>{wr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    /* ─── Secao 3: Estrategias de Defesa ─── */
    {
      id: "estrategias-defesa",
      title: "Estrategias de Defesa por Cenario",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            A abordagem de defesa depende diretamente do tipo de disputa. Cada cenario exige
            evidencias especificas e tem uma taxa de sucesso diferente.
          </p>

          {/* Fraude Real */}
          <div style={cardStyle}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>
              Fraude Real (10.4 / 4837 / 4840)
            </p>
            <p style={paragraphStyle}>
              <strong>Evidencias:</strong> 3DS log (CAVV/ECI), CE 3.0 data, device fingerprint, IP geolocation
            </p>
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Cenario</th>
                    <th style={thStyle}>Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={tdStyle}>Sem CE 3.0</td><td style={tdStyle}>15-20%</td></tr>
                  <tr><td style={tdStyle}>Com CE 3.0</td><td style={{ ...tdStyle, color: "#f59e0b", fontWeight: 600 }}>60-65%</td></tr>
                  <tr><td style={tdStyle}>Com 3DS liability shift</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>80-85%</td></tr>
                </tbody>
              </table>
            </div>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              <strong>Decisao:</strong> fight se CE 3.0 elegivel ou 3DS presente; accept se nenhuma evidencia forte.
            </p>
          </div>

          {/* Friendly Fraud */}
          <div style={cardStyle}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f59e0b", marginBottom: "0.5rem" }}>
              Friendly Fraud (13.1 / 4863)
            </p>
            <p style={paragraphStyle}>
              <strong>Evidencias:</strong> descriptor claro, email de confirmacao, historico de compras, IP match
            </p>
            <p style={paragraphStyle}>
              <strong>Win rate:</strong> 35-45%
            </p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              <strong>Prevencao:</strong> otimizar soft descriptor, Order Insight, pagina de reconhecimento de transacoes.
            </p>
          </div>

          {/* Nao-Recebimento */}
          <div style={cardStyle}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#3b82f6", marginBottom: "0.5rem" }}>
              Nao-Recebimento (13.1 Visa / 4855 MC)
            </p>
            <p style={paragraphStyle}>
              <strong>Evidencias:</strong> tracking com comprovante de entrega, assinatura, foto, GPS
            </p>
            <p style={paragraphStyle}>
              <strong>Win rate:</strong> 50-60%
            </p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              <strong>Decisao:</strong> fight se tem tracking + delivery proof.
            </p>
          </div>

          {/* Diferente do Descrito */}
          <div style={cardStyle}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#8b5cf6", marginBottom: "0.5rem" }}>
              Diferente do Descrito (13.3 / 4853)
            </p>
            <p style={paragraphStyle}>
              <strong>Evidencias:</strong> T&C aceitos, descricao do produto, fotos, comunicacao com cliente
            </p>
            <p style={paragraphStyle}>
              <strong>Win rate:</strong> 30-40%
            </p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              <strong>Decisao:</strong> avaliar custo vs valor da disputa antes de contestar.
            </p>
          </div>
        </>
      ),
    },

    /* ─── Secao 4: Programas de Monitoramento ─── */
    {
      id: "programas-monitoramento",
      title: "Programas de Monitoramento",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Visa e Mastercard operam programas que penalizam merchants com taxas de chargeback
            elevadas. Entrar nesses programas gera multas crescentes e pode levar ao
            descredenciamento.
          </p>

          {/* VDMP */}
          <p style={subheadingStyle}>Visa VDMP (Visa Dispute Monitoring Program)</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Mes</th>
                  <th style={thStyle}>Threshold</th>
                  <th style={thStyle}>Multa/Mes</th>
                  <th style={thStyle}>Acoes Obrigatorias</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>1-4</td>
                  <td style={tdStyle}>{"\u2265"}0.9% + {"\u2265"}100</td>
                  <td style={tdStyle}>$0-$50</td>
                  <td style={tdStyle}>Plano de remediacao em 10 dias</td>
                </tr>
                <tr>
                  <td style={tdStyle}>5-6</td>
                  <td style={tdStyle}>Mantem</td>
                  <td style={{ ...tdStyle, color: "#f59e0b", fontWeight: 600 }}>$10.000</td>
                  <td style={tdStyle}>Revisao de compliance pelo adquirente</td>
                </tr>
                <tr>
                  <td style={tdStyle}>7-9</td>
                  <td style={tdStyle}>Mantem</td>
                  <td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>$25.000</td>
                  <td style={tdStyle}>Auditoria de processamento obrigatoria</td>
                </tr>
                <tr>
                  <td style={tdStyle}>10-12</td>
                  <td style={tdStyle}>Mantem</td>
                  <td style={{ ...tdStyle, color: "#ef4444", fontWeight: 700 }}>$25.000+</td>
                  <td style={tdStyle}>Risco de descredenciamento</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ECM/ECP */}
          <p style={{ ...subheadingStyle, marginTop: "1.5rem" }}>Mastercard ECM/ECP</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Programa</th>
                  <th style={thStyle}>Threshold</th>
                  <th style={thStyle}>Multa</th>
                  <th style={thStyle}>Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>ECM (Alert)</td>
                  <td style={tdStyle}>{"\u2265"}1.0% + {"\u2265"}100/mes</td>
                  <td style={tdStyle}>$1K-$2K/mes</td>
                  <td style={tdStyle}>Monitoramento, plano em 5 dias</td>
                </tr>
                <tr>
                  <td style={tdStyle}>ECP (Penalty)</td>
                  <td style={tdStyle}>{"\u2265"}1.5% + {"\u2265"}100/mes</td>
                  <td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>$25K/mes + $25/cb</td>
                  <td style={tdStyle}>Multas imediatas, risco de encerramento apos 6 meses</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Criterios de Saida
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              3 meses consecutivos abaixo do threshold de entrada do programa.
            </p>
          </div>
        </>
      ),
    },

    /* ─── Secao 5: Prevencao Proativa ─── */
    {
      id: "prevencao-proativa",
      title: "Prevencao Proativa",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Ferramentas de prevencao permitem interceptar disputas antes que se tornem chargebacks
            formais, reduzindo taxas e custos operacionais.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Servico</th>
                  <th style={thStyle}>Bandeira</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Custo/Alerta</th>
                  <th style={thStyle}>Efetividade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Verifi CDRN</td>
                  <td style={tdStyle}>Visa</td>
                  <td style={tdStyle}>Alerta 72h</td>
                  <td style={tdStyle}>R$5-15</td>
                  <td style={tdStyle}>20-40% deflexao</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Verifi RDR</td>
                  <td style={tdStyle}>Visa</td>
                  <td style={tdStyle}>Auto-refund</td>
                  <td style={tdStyle}>R$5-15</td>
                  <td style={tdStyle}>30-50% deflexao</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Ethoca Alerts</td>
                  <td style={tdStyle}>Visa+MC</td>
                  <td style={tdStyle}>Fraude confirmada</td>
                  <td style={tdStyle}>R$8-20</td>
                  <td style={tdStyle}>25-45% deflexao</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Order Insight</td>
                  <td style={tdStyle}>Visa</td>
                  <td style={tdStyle}>Enriquecimento</td>
                  <td style={tdStyle}>R$2-5</td>
                  <td style={tdStyle}>10-20% deflexao</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Calculo de ROI
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se chargeback custa R$300 e alerta custa R$10, o break-even ocorre com deflexao de apenas 3.3%.
              Qualquer taxa de deflexao acima disso gera economia liquida.
            </p>
          </div>

          <p style={{ ...paragraphStyle, marginTop: "1rem" }}>
            <strong>Features relacionadas:</strong>{" "}
            <Link href="/knowledge/features" style={{ color: "var(--primary)", textDecoration: "underline" }}>
              Chargeback Alerts
            </Link>
            {" / "}
            <Link href="/knowledge/features" style={{ color: "var(--primary)", textDecoration: "underline" }}>
              Dispute Prevention
            </Link>
            {" / "}
            <Link href="/knowledge/features" style={{ color: "var(--primary)", textDecoration: "underline" }}>
              Soft Descriptor
            </Link>
          </p>
        </>
      ),
    },

    /* ─── Secao 6: Metricas e KPIs ─── */
    {
      id: "metricas-kpis",
      title: "Metricas e KPIs",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Monitorar os KPIs corretos e essencial para gestao proativa de chargebacks. Abaixo, os
            6 indicadores fundamentais com formulas e benchmarks.
          </p>

          {/* KPI 1 */}
          <div style={kpiCardStyle("#10b981")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)" }}>
                1. Chargeback Rate
              </p>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#10b981", color: "#fff", fontWeight: 600 }}>&lt;0.5%</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#f59e0b", color: "#fff", fontWeight: 600 }}>0.5-0.9%</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#ef4444", color: "#fff", fontWeight: 600 }}>&gt;0.9%</span>
              </div>
            </div>
            <p style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--primary)", marginBottom: "0.25rem" }}>
              (chargebacks / transacoes mes anterior) x 100
            </p>
          </div>

          {/* KPI 2 */}
          <div style={kpiCardStyle("#3b82f6")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)" }}>
                2. Win Rate
              </p>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#10b981", color: "#fff", fontWeight: 600 }}>&gt;40%</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#f59e0b", color: "#fff", fontWeight: 600 }}>20-40%</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#ef4444", color: "#fff", fontWeight: 600 }}>&lt;20%</span>
              </div>
            </div>
            <p style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--primary)", marginBottom: "0.25rem" }}>
              (chargebacks revertidos / total contestados) x 100
            </p>
          </div>

          {/* KPI 3 */}
          <div style={kpiCardStyle("#8b5cf6")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)" }}>
                3. Custo por Chargeback
              </p>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#10b981", color: "#fff", fontWeight: 600 }}>&lt;R$200</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#f59e0b", color: "#fff", fontWeight: 600 }}>R$200-400</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#ef4444", color: "#fff", fontWeight: 600 }}>&gt;R$400</span>
              </div>
            </div>
            <p style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--primary)", marginBottom: "0.25rem" }}>
              sum(fees + ops + fines) / total chargebacks
            </p>
          </div>

          {/* KPI 4 */}
          <div style={kpiCardStyle("#f59e0b")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)" }}>
                4. Taxa de Deflexao
              </p>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#10b981", color: "#fff", fontWeight: 600 }}>&gt;30%</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#f59e0b", color: "#fff", fontWeight: 600 }}>15-30%</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#ef4444", color: "#fff", fontWeight: 600 }}>&lt;15%</span>
              </div>
            </div>
            <p style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--primary)", marginBottom: "0.25rem" }}>
              alertas resolvidos / alertas recebidos x 100
            </p>
          </div>

          {/* KPI 5 */}
          <div style={kpiCardStyle("#ec4899")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)" }}>
                5. Tempo de Resposta
              </p>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#10b981", color: "#fff", fontWeight: 600 }}>&lt;10d</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#f59e0b", color: "#fff", fontWeight: 600 }}>10-20d</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#ef4444", color: "#fff", fontWeight: 600 }}>&gt;20d</span>
              </div>
            </div>
            <p style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--primary)", marginBottom: "0.25rem" }}>
              dias entre notificacao e submissao de evidencias
            </p>
          </div>

          {/* KPI 6 */}
          <div style={kpiCardStyle("#06b6d4")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)" }}>
                6. Recovery Rate
              </p>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#10b981", color: "#fff", fontWeight: 600 }}>&gt;25%</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#f59e0b", color: "#fff", fontWeight: 600 }}>10-25%</span>
                <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: 6, background: "#ef4444", color: "#fff", fontWeight: 600 }}>&lt;10%</span>
              </div>
            </div>
            <p style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--primary)", marginBottom: "0.25rem" }}>
              valor recuperado / valor total de chargebacks x 100
            </p>
          </div>
        </>
      ),
    },

    /* ─── Secao 7: Fluxo Operacional Completo ─── */
    {
      id: "fluxo-operacional",
      title: "Fluxo Operacional Completo",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            O fluxo operacional de gestao de chargebacks envolve 7 etapas, cada uma com SLA e
            responsaveis definidos.
          </p>

          {/* Steps */}
          {[
            { step: 1, title: "Receber Alerta", sla: "SLA: <1h", desc: "Integracao com CDRN/Ethoca + notificacao interna automatica" },
            { step: 2, title: "Classificar Reason Code", sla: "SLA: <2h", desc: "Auto-classificacao via regras + roteamento para template de defesa" },
            { step: 3, title: "Avaliar Fight/Accept", sla: "SLA: <4h", desc: "Decision engine baseado em valor, evidencias disponiveis e win rate historico" },
            { step: 4, title: "Coletar Evidencias", sla: "SLA: <5 dias", desc: "Assembly automatico de OMS, CRM, 3DS, delivery e comunicacao com cliente" },
            { step: 5, title: "Submeter Representment", sla: "SLA: <15 dias", desc: "Submissao via API do adquirente ou VROL com documentacao compilada" },
            { step: 6, title: "Acompanhar Resultado", sla: "SLA: continuo", desc: "Tracking de status ate resolucao final ou pre-arbitragem" },
            { step: 7, title: "Documentar Aprendizado", sla: "SLA: mensal", desc: "Analise de root cause, atualizacao de regras e melhoria de processos" },
          ].map(({ step, title, sla, desc }) => (
            <div key={step} style={stepCardStyle}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  flexShrink: 0,
                  background: "var(--primary-bg)",
                  color: "var(--primary)",
                  border: "1px solid var(--primary)",
                }}
              >
                {step}
              </span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)" }}>{title}</span>
                  <span style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem", borderRadius: 4, background: "var(--primary-bg)", color: "var(--primary)", fontWeight: 600 }}>
                    {sla}
                  </span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}

          {/* Team structure */}
          <p style={{ ...subheadingStyle, marginTop: "1.5rem" }}>Estrutura de Equipe</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Papel</th>
                  <th style={thStyle}>Responsabilidade</th>
                  <th style={thStyle}>Volume Tipico</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Analista de Disputas</td>
                  <td style={tdStyle}>Classificacao e coleta de evidencias</td>
                  <td style={tdStyle}>50-100 chargebacks/mes</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Especialista Senior</td>
                  <td style={tdStyle}>Casos complexos, pre-arbitragem</td>
                  <td style={tdStyle}>10-20 casos/mes</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Gerente de Risco</td>
                  <td style={tdStyle}>Monitoring programs, remediation plans</td>
                  <td style={tdStyle}>Estrategico</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
  ];

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Chargeback: Guia Completo de Produto
        </h1>
        <p className="page-description">
          Guia de nivel product-discovery cobrindo anatomia financeira, reason codes,
          estrategias de defesa, programas de monitoramento, prevencao e KPIs operacionais.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "var(--primary)",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          O que voce vai aprender
        </p>
        <ul>
          <li>Anatomia financeira completa de um chargeback</li>
          <li>Taxonomia de reason codes Visa e Mastercard</li>
          <li>Estrategias de defesa por tipo de disputa</li>
          <li>Como funcionam os programas de monitoramento (VDMP/ECM)</li>
        </ul>
      </div>

      {/* Stats */}
      <div
        className="animate-fade-in stagger-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { value: "7", label: "Secoes" },
          { value: "50+", label: "Reason Codes" },
          { value: "6", label: "KPIs" },
          { value: "6", label: "Bandeiras" },
        ].map(({ value, label }) => (
          <div key={label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>
              {value}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Sections (collapsible) */}
      {sections.map((section, idx) => (
        <CollapsibleSection key={section.id} section={section} index={idx} />
      ))}

      {/* Quiz */}
      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "var(--foreground)",
            }}
          >
            Teste seu Conhecimento
          </h2>
          <PageQuiz
            questions={quiz.questions}
            onComplete={(correct, total, xpEarned) => {
              recordQuiz(quiz.pageRoute, correct, total, xpEarned);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}

      {/* Related Pages */}
      <div
        style={{
          marginTop: "2.5rem",
          padding: "1.25rem",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <p
          style={{
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "var(--foreground)",
            marginBottom: "0.75rem",
          }}
        >
          Paginas Relacionadas
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {[
            { href: "/fraud/chargeback-lifecycle", label: "Ciclo de Chargeback" },
            { href: "/knowledge/regras-bandeiras", label: "Regras de Bandeiras" },
            { href: "/knowledge/features", label: "Base de Features" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.5rem 1rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--primary)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              {label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
