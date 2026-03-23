"use client";

import { useState } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

const sectionStyle: React.CSSProperties = { padding: "1.5rem", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", marginBottom: "1.25rem" };
const headingStyle: React.CSSProperties = { fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" };
const paragraphStyle: React.CSSProperties = { fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "0.75rem" };
const subheadingStyle: React.CSSProperties = { fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem", marginTop: "1rem" };
const tableWrapperStyle: React.CSSProperties = { overflowX: "auto", marginTop: "0.75rem", marginBottom: "0.75rem" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" };
const thStyle: React.CSSProperties = { padding: "0.625rem 0.75rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", borderBottom: "2px solid var(--border)", background: "var(--surface)" };
const tdStyle: React.CSSProperties = { padding: "0.625rem 0.75rem", borderBottom: "1px solid var(--border)", color: "var(--foreground)", verticalAlign: "top" };
const highlightBoxStyle: React.CSSProperties = { padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.06)", marginTop: "0.75rem", marginBottom: "0.75rem" };
const codeBlockStyle: React.CSSProperties = { background: "var(--background)", border: "1px solid var(--border)", borderRadius: 8, padding: "1rem", fontSize: "0.8rem", fontFamily: "monospace", overflowX: "auto", whiteSpace: "pre", color: "var(--foreground)", lineHeight: 1.6, marginTop: "0.75rem", marginBottom: "0.75rem" };
const pillarCardStyle: React.CSSProperties = { padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--background)", marginBottom: "0.75rem" };
const tagStyle: React.CSSProperties = { display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 600, background: "var(--primary-bg)", color: "var(--primary)", marginRight: "0.375rem", marginBottom: "0.25rem" };

interface Section { id: string; title: string; icon: string; content: React.ReactNode; }

export default function ReconciliationDeepPage() {
  const quiz = getQuizForPage("/knowledge/reconciliation-deep");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "tipos",
      title: "Tipos de Reconciliacao",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Reconciliacao em pagamentos nao e um processo unico — sao multiplos processos que verificam
            diferentes dimensoes da operacao. Cada tipo tem fontes de dados, frequencia e SLAs distintos.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>O que compara</th>
                  <th style={thStyle}>Frequencia</th>
                  <th style={thStyle}>Criticidade</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tipo: "Transaction recon", comp: "Transacoes internas vs confirmacao do acquirer/PSP", freq: "Real-time ou T+1", crit: "Alta — detecta falhas de processamento" },
                  { tipo: "Settlement recon", comp: "Valores esperados de settlement vs valores recebidos", freq: "Diaria (T+1 ou T+2)", crit: "Critica — impacta caixa e payout" },
                  { tipo: "Bank recon", comp: "Settlement file vs extrato bancario", freq: "Diaria", crit: "Critica — confirma entrada/saida real" },
                  { tipo: "Merchant payout recon", comp: "Payout calculado vs payout executado vs credito bancario", freq: "Diaria", crit: "Alta — impacta merchant diretamente" },
                  { tipo: "Inter-company recon", comp: "Transacoes entre entidades do grupo (ex: PSP vs holding)", freq: "Mensal", crit: "Media — impacta contabilidade" },
                  { tipo: "Tax recon", comp: "Base de calculo vs impostos recolhidos (ISS, PIS, COFINS)", freq: "Mensal", crit: "Alta — risco fiscal" },
                  { tipo: "Fee recon", comp: "Fees cobrados vs fees contratados (MDR, interchange, scheme fees)", freq: "Mensal", crit: "Media — impacta margem" },
                ].map((item) => (
                  <tr key={item.tipo}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.tipo}</td>
                    <td style={tdStyle}>{item.comp}</td>
                    <td style={tdStyle}>{item.freq}</td>
                    <td style={tdStyle}>{item.crit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    {
      id: "three-way",
      title: "3-Way Reconciliation",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            A 3-way reconciliation e o padrao ouro em pagamentos. Cruza tres fontes independentes
            para confirmar que a transacao foi processada, liquidada e creditada corretamente.
          </p>
          <div style={codeBlockStyle}>
{`3-WAY RECONCILIATION FLOW:

SOURCE A: Internal Ledger (seu sistema)
  tx_id: TXN-001 | amount: R$ 500.00 | status: captured
  merchant: MID-12345 | date: 2024-01-15 | MDR: 3.2%

SOURCE B: Acquirer Settlement File (ex: Cielo, Rede)
  nsu: 98765 | gross: R$ 500.00 | net: R$ 484.00
  fee: R$ 16.00 (3.2%) | settlement_date: 2024-01-17

SOURCE C: Bank Statement (extrato da conta)
  date: 2024-01-17 | credit: R$ 484.00
  origin: Cielo SA | ref: SETT-20240117-001

MATCHING LOGIC:
  Step 1: A ↔ B (Ledger vs Acquirer)
    Match on: tx_id/nsu mapping, amount, date
    Validate: fee = amount × MDR rate
    Result: ✓ Match (R$ 500 gross, R$ 484 net, R$ 16 fee)

  Step 2: B ↔ C (Acquirer vs Bank)
    Match on: settlement amount, settlement date, acquirer ID
    Result: ✓ Match (R$ 484 on 2024-01-17)

  Step 3: A ↔ C (Ledger vs Bank) — derived
    Net amount from ledger = R$ 500 - R$ 16 = R$ 484
    Bank credit = R$ 484
    Result: ✓ Full 3-way match`}
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Desafio: N:M matching
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Na pratica, o matching raramente e 1:1. O acquirer pode agrupar 500 transacoes em um unico
              settlement batch. O banco pode creditar em uma unica transferencia o que o acquirer dividiu em
              3 arquivos. Isso cria matching N:M que exige: agrupamento por periodo, soma de valores com
              tolerancia, e logica de desagrupamento (unbundling) para identificar transacoes individuais.
            </p>
          </div>
        </>
      ),
    },

    {
      id: "multi-currency",
      title: "Multi-Currency Reconciliation",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Reconciliacao multi-moeda adiciona complexidade significativa. A mesma transacao pode ter
            valores diferentes dependendo da data e taxa de cambio utilizada para conversao.
          </p>

          <div style={codeBlockStyle}>
{`MULTI-CURRENCY RECON EXAMPLE:

Transaction: USD 100.00 purchase on Brazilian PSP

Date        Event              USD      FX Rate    BRL
----        -----              ---      -------    ---
Jan 15      Authorization      100.00   5.10       510.00
Jan 16      Capture            100.00   5.12       512.00
Jan 18      Settlement (Visa)  100.00   5.08       508.00
Jan 18      Bank credit         -       -          508.00

DISCREPANCIES:
  Auth vs Capture:    BRL +2.00 (FX moved 0.4%)
  Capture vs Settle:  BRL -4.00 (FX moved -0.8%)
  Settle vs Bank:     BRL  0.00 (match ✓)

RECON APPROACH:
  - Use SETTLEMENT FX rate as source of truth
  - Auth FX diff = P&L item (FX gain/loss)
  - Capture vs Settle diff = normal (different dates)
  - Book FX variance separately in accounting`}
          </div>

          <p style={subheadingStyle}>Pontos criticos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {[
              "Definir qual taxa de cambio e a referencia (auth, capture, settlement, ou spot do dia)",
              "Tolerancia para FX variance: tipicamente 0.5-1% para matching automatico",
              "Variacoes acima da tolerancia viram breaks para investigacao manual",
              "Contabilizar FX gain/loss como item separado (nao misturar com fee revenue)",
              "Manter audit trail de todas as taxas usadas em cada etapa",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0 }}>-</span>
                <span style={{ color: "var(--text-secondary)" }}>{item}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },

    {
      id: "matching",
      title: "Matching Algorithms",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Algoritmos de matching determinam como transacoes de diferentes fontes sao pareadas.
            A escolha do algoritmo impacta diretamente a taxa de reconciliacao automatica e o
            volume de trabalho manual.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              {
                algo: "Exact Match",
                color: "#22c55e",
                desc: "Match por chave unica: tx_id, NSU, authorization code. O mais confiavel quando as chaves sao consistentes.",
                proCon: "Pro: zero ambiguidade. Con: falha quando chave muda entre sistemas (ex: acquirer gera novo NSU).",
                taxa: "60-70% do volume",
              },
              {
                algo: "Fuzzy Match",
                color: "#3b82f6",
                desc: "Match por combinacao de atributos com tolerancia: amount (± R$0.01), date (± 2 dias), merchant ID. Usa score de similaridade.",
                proCon: "Pro: captura matches que exact miss. Con: risco de false positives se tolerancia for ampla demais.",
                taxa: "15-25% do volume",
              },
              {
                algo: "Rule-based Match",
                color: "#f59e0b",
                desc: "Regras de negocio especificas. Ex: se acquirer = Cielo e diferenca = taxa ISS, entao match com ajuste fiscal.",
                proCon: "Pro: captura padroes conhecidos. Con: requer manutencao constante de regras.",
                taxa: "5-10% do volume",
              },
              {
                algo: "ML-assisted Match",
                color: "#8b5cf6",
                desc: "Modelo treinado em historico de matches e breaks resolvidos. Sugere matches para analista aprovar.",
                proCon: "Pro: melhora com o tempo, captura padroes sutis. Con: requer volume de dados historicos e interpretabilidade.",
                taxa: "3-5% do volume",
              },
            ].map((item) => (
              <div key={item.algo} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.algo}</span>
                  <span style={tagStyle}>{item.taxa}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.proCon}</p>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Tolerancias tipicas</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Dimensao</th>
                  <th style={thStyle}>Tolerancia exata</th>
                  <th style={thStyle}>Tolerancia fuzzy</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dim: "Valor (BRL)", exata: "R$ 0.00", fuzzy: "± R$ 0.05 ou ± 0.01%" },
                  { dim: "Valor (FX)", exata: "N/A", fuzzy: "± 0.5% (variacao cambial)" },
                  { dim: "Data", exata: "Mesmo dia", fuzzy: "± 2 dias uteis" },
                  { dim: "Merchant ID", exata: "Match exato", fuzzy: "Mapping table (alias)" },
                ].map((item) => (
                  <tr key={item.dim}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.dim}</td>
                    <td style={tdStyle}>{item.exata}</td>
                    <td style={tdStyle}>{item.fuzzy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    {
      id: "exceptions",
      title: "Exception Handling",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Exceptions (breaks) sao discrepancias identificadas durante a reconciliacao que exigem
            investigacao e resolucao. A gestao eficiente de exceptions e o que diferencia uma operacao
            madura de uma operacao problematica.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo de break</th>
                  <th style={thStyle}>Causa comum</th>
                  <th style={thStyle}>SLA resolucao</th>
                  <th style={thStyle}>Acao</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tipo: "Missing (ledger only)", causa: "Transacao processada mas nao liquidada pelo acquirer", sla: "T+3", acao: "Verificar status no acquirer. Se confirmada, abrir disputa." },
                  { tipo: "Missing (acquirer only)", causa: "Acquirer liquidou transacao nao registrada no ledger", sla: "T+2", acao: "Buscar no ledger por chave alternativa. Se nao encontrada, investigar fraude." },
                  { tipo: "Amount mismatch", causa: "Taxa diferente da contratada, arredondamento, FX", sla: "T+3", acao: "Calcular diferenca. Se taxa, renegociar. Se FX, contabilizar." },
                  { tipo: "Duplicate", causa: "Processamento duplicado, retry sem idempotency", sla: "T+1", acao: "Identificar a duplicata, estornar, ajustar ledger." },
                  { tipo: "Timing", causa: "Liquidacao em data diferente da esperada (D+2 vs D+3)", sla: "Auto-resolve D+2", acao: "Aguardar janela de tolerancia. Se persistir, investigar." },
                  { tipo: "Status mismatch", causa: "Ledger diz captured, acquirer diz voided", sla: "T+1", acao: "Reconciliar status. Atualizar ledger. Notificar merchant se necessario." },
                ].map((item) => (
                  <tr key={item.tipo}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.tipo}</td>
                    <td style={tdStyle}>{item.causa}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>{item.sla}</td>
                    <td style={tdStyle}>{item.acao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Escalation matrix
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Breaks devem ter escalacao automatica baseada em valor e idade. Exemplo: break acima de R$10.000
              e escalado para supervisor em T+1. Acima de R$100.000, para gerente em T+1 e diretoria em T+2.
              Breaks com mais de 30 dias devem ser revisados para write-off ou provisionamento contabil.
            </p>
          </div>
        </>
      ),
    },

    {
      id: "auto-vs-manual",
      title: "Automated vs Manual Reconciliation",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            A decisao entre automacao e processo manual depende do volume, complexidade e custo.
            A maioria das empresas evolui de planilhas Excel para automacao parcial e eventualmente
            para reconciliacao totalmente automatizada.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Manual (Excel/Sheets)</th>
                  <th style={thStyle}>Semi-automatizado</th>
                  <th style={thStyle}>Totalmente automatizado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { asp: "Volume suportado", manual: "Ate 1.000 tx/dia", semi: "1.000 - 100.000 tx/dia", auto: "100.000+ tx/dia" },
                  { asp: "Custo de operacao", manual: "Baixo (1-2 analistas)", semi: "Medio (tool + analistas)", auto: "Alto upfront, baixo ongoing" },
                  { asp: "Taxa de auto-match", manual: "0% (tudo manual)", semi: "70-85%", auto: "95-99%" },
                  { asp: "Tempo de recon", manual: "2-5 dias", semi: "T+1", auto: "Real-time ou T+0" },
                  { asp: "Risco de erro", manual: "Alto (humano)", semi: "Medio", auto: "Baixo" },
                  { asp: "Escalabilidade", manual: "Nenhuma", semi: "Limitada", auto: "Alta" },
                  { asp: "Ferramentas", manual: "Excel, Google Sheets", semi: "Stripe Sigma, Adyen reports + scripts", auto: "Plataforma dedicada ou custom" },
                ].map((item) => (
                  <tr key={item.asp}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.asp}</td>
                    <td style={tdStyle}>{item.manual}</td>
                    <td style={tdStyle}>{item.semi}</td>
                    <td style={tdStyle}>{item.auto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>ROI da automacao</p>
          <div style={codeBlockStyle}>
{`CALCULO DE ROI:

Custo manual (3 analistas + erros):
  Salarios: 3 × R$ 8.000 = R$ 24.000/mes
  Erros nao detectados: ~R$ 15.000/mes (estimativa conservadora)
  Total: R$ 39.000/mes = R$ 468.000/ano

Custo automacao:
  Implementacao: R$ 200.000 (one-time)
  Licenca/manutencao: R$ 5.000/mes = R$ 60.000/ano
  1 analista para exceptions: R$ 8.000/mes = R$ 96.000/ano
  Total ano 1: R$ 356.000 | Ano 2+: R$ 156.000/ano

ROI:
  Economia ano 1: R$ 468.000 - R$ 356.000 = R$ 112.000
  Economia ano 2+: R$ 468.000 - R$ 156.000 = R$ 312.000/ano
  Payback: ~8 meses`}
          </div>
        </>
      ),
    },

    {
      id: "at-scale",
      title: "Reconciliation at Scale",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Em volumes de milhoes de transacoes por dia, a reconciliacao enfrenta desafios de engenharia
            significativos: batch vs streaming, particionamento, ordenacao, idempotency e consistencia
            eventual.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              {
                challenge: "Batch processing",
                desc: "Processar arquivos de settlement de milhoes de linhas (Visa pode enviar 5M+ registros/dia). Otimizar com: particionamento por acquirer/data, processamento paralelo, checkpoint/restart para resiliencia.",
              },
              {
                challenge: "Real-time recon",
                desc: "Reconciliar transacoes em tempo real via webhooks/events. Desafios: ordering (eventos fora de ordem), deduplication, at-least-once delivery. Usar event sourcing com idempotency keys.",
              },
              {
                challenge: "Distributed systems",
                desc: "Quando o ledger esta em um servico e o settlement em outro. Eventual consistency cria janelas onde dados parecem inconsistentes. Solucao: reconciliation como processo assincrono que tolera atrasos.",
              },
              {
                challenge: "Data quality",
                desc: "Arquivos de acquirer podem ter formatos inconsistentes, campos truncados, encoding diferente. ETL robusto com validacao de schema, tratamento de erros e alertas para anomalias.",
              },
              {
                challenge: "Performance",
                desc: "Matching de 10M transacoes contra 10M settlement records e O(n*m) se ingenuamente implementado. Otimizar com: indexacao por chave primaria, bloom filters para pre-filtering, batch inserts.",
              },
            ].map((item) => (
              <div key={item.challenge} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>
                  {item.challenge}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    {
      id: "reporting",
      title: "Reporting e Metricas",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Metricas de reconciliacao indicam a saude operacional do sistema de pagamentos.
            A metrica principal e a recon rate — percentual de volume reconciliado automaticamente.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Definicao</th>
                  <th style={thStyle}>Target</th>
                  <th style={thStyle}>Red flag</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { met: "Auto-match rate", def: "% de transacoes reconciliadas automaticamente", target: "> 95%", red: "< 85%" },
                  { met: "Overall recon rate", def: "% de volume total reconciliado (auto + manual)", target: "> 99.5%", red: "< 98%" },
                  { met: "Break resolution time", def: "Tempo medio para resolver um break", target: "< 48h", red: "> 5 dias" },
                  { met: "Aging > 30 days", def: "Volume de breaks com mais de 30 dias", target: "< 0.1% do GMV", red: "> 0.5% do GMV" },
                  { met: "Write-off rate", def: "% de breaks que resultam em perda financeira", target: "< 0.01%", red: "> 0.05%" },
                  { met: "SLA compliance", def: "% de breaks resolvidos dentro do SLA", target: "> 95%", red: "< 80%" },
                ].map((item) => (
                  <tr key={item.met}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.met}</td>
                    <td style={tdStyle}>{item.def}</td>
                    <td style={{ ...tdStyle, color: "#22c55e", fontWeight: 600 }}>{item.target}</td>
                    <td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>{item.red}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Trend Analysis</p>
          <p style={paragraphStyle}>
            Alem de metricas pontuais, e essencial analisar tendencias. Um auto-match rate que cai
            de 96% para 92% em uma semana indica problema sistemico (novo acquirer com formato diferente,
            mudanca de API, bug de processamento). Alertas devem ser configurados para variacao abrupta
            em qualquer metrica. Dashboard com grafico de tendencia dos ultimos 30/90/365 dias.
          </p>
        </>
      ),
    },

    {
      id: "arquitetura",
      title: "Ferramentas e Arquitetura",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            A arquitetura de um sistema de reconciliacao deve ser modular, escalavel e auditavel.
            Dois patterns de design dominam: event sourcing (para ledger) e batch pipeline (para recon).
          </p>

          <div style={codeBlockStyle}>
{`RECONCILIATION ENGINE ARCHITECTURE:

┌──────────────────────────────────────────────────────┐
│                   DATA INGESTION                      │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Internal │ │ Acquirer │ │   Bank   │ │  Other  │ │
│  │  Ledger  │ │  Files   │ │Statements│ │ Sources │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ │
│       │            │            │             │       │
│       v            v            v             v       │
│  ┌─────────────────────────────────────────────────┐ │
│  │           NORMALIZATION LAYER                    │ │
│  │  Parse, validate, transform to canonical format  │ │
│  └──────────────────────┬──────────────────────────┘ │
└─────────────────────────┼────────────────────────────┘
                          v
┌─────────────────────────┼────────────────────────────┐
│               MATCHING ENGINE                         │
│  ┌──────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Exact   │→│ Fuzzy  │→│ Rule-    │→│ ML-      │ │
│  │  Match   │ │ Match  │ │ Based    │ │ Assisted │ │
│  └──────────┘ └────────┘ └──────────┘ └──────────┘ │
│              ↓ matched        ↓ unmatched            │
│         ┌─────────┐    ┌──────────────┐              │
│         │ Matched │    │  Exceptions  │              │
│         │  Store  │    │    Queue     │              │
│         └─────────┘    └──────────────┘              │
└──────────────────────────────────────────────────────┘
                          v
┌──────────────────────────────────────────────────────┐
│              EXCEPTION MANAGEMENT                     │
│  Auto-resolve → Analyst queue → Escalation → Write-off│
└──────────────────────────────────────────────────────┘
                          v
┌──────────────────────────────────────────────────────┐
│              REPORTING & ANALYTICS                    │
│  Dashboard, aging reports, trend analysis, alerts     │
└──────────────────────────────────────────────────────┘`}
          </div>

          <p style={subheadingStyle}>Event Sourcing para Ledger</p>
          <p style={paragraphStyle}>
            Em vez de armazenar apenas o estado atual, event sourcing armazena todos os eventos que
            levaram ao estado atual (created, authorized, captured, settled, refunded). Isso permite:
            reconstruir o estado em qualquer ponto no tempo, auditoria completa, e reconciliacao
            retroativa. Cada evento e imutavel — erros sao corrigidos com eventos compensatorios.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.75rem" }}>
            {["Event Sourcing", "CQRS", "Idempotency", "Batch Pipeline", "Stream Processing", "Double-entry Ledger", "Canonical Format"].map((t) => (
              <span key={t} style={tagStyle}>{t}</span>
            ))}
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Reconciliation Deep Dive</h1>
        <p className="page-description">
          Guia completo sobre reconciliacao em pagamentos: tipos, 3-way recon, multi-currency,
          algoritmos de matching, exception handling, automacao, escala e arquitetura.
        </p>
      </header>
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>Tipos de reconciliacao: transaction, settlement, bank, merchant payout, tax</li>
          <li>3-way reconciliation: ledger vs acquirer vs bank</li>
          <li>Desafios de reconciliacao multi-moeda e tolerancias</li>
          <li>Algoritmos de matching: exact, fuzzy, rule-based, ML-assisted</li>
          <li>Exception handling: tipos de breaks, SLAs e escalation</li>
          <li>ROI da automacao e quando investir</li>
          <li>Reconciliacao em escala: batch, streaming e desafios distribuidos</li>
          <li>Arquitetura: event sourcing, reconciliation engine, double-entry ledger</li>
        </ul>
      </div>
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[{ val: "9", label: "Secoes" }, { val: "4", label: "Algoritmos" }, { val: "7", label: "Tipos Recon" }, { val: "6", label: "Metricas" }].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{s.val}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>
      {sections.map((section, idx) => (
        <div key={section.id} className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`} style={sectionStyle}>
          <h2 style={headingStyle}>
            <span style={{ minWidth: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0, background: "var(--primary)", color: "#fff", padding: "0 0.25rem" }}>{section.icon}</span>
            {section.title}
          </h2>
          {section.content}
        </div>
      ))}
      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>Teste seu Conhecimento</h2>
          <PageQuiz questions={quiz.questions} onComplete={(correct, total, xpEarned) => { recordQuiz(quiz.pageRoute, correct, total, xpEarned); setQuizCompleted(true); }} />
        </div>
      )}
      <div style={{ ...sectionStyle, marginTop: "2rem" }}>
        <h2 style={headingStyle}>Paginas Relacionadas</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { name: "Treasury & Float", href: "/knowledge/treasury-float" },
            { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing" },
            { name: "Webhook Patterns", href: "/knowledge/webhook-patterns" },
            { name: "Payment Methods BR", href: "/knowledge/payment-methods-br" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none", transition: "all 0.2s" }}>{link.name}</Link>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.5 }}>
          Fontes: Stripe Engineering Blog, Adyen documentation, Modern Treasury, best practices de reconciliacao bancaria.
        </p>
      </div>
    </div>
  );
}
