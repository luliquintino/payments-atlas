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

export default function TreasuryFloatPage() {
  const quiz = getQuizForPage("/knowledge/treasury-float");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "o-que-e-float",
      title: "O que e Float",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Float e o dinheiro em transito entre o momento da captura do pagamento e a liquidacao ao merchant.
            Quando um cliente paga com cartao de credito e o merchant recebe em D+30, os recursos ficam
            &ldquo;flutuando&rdquo; no ecossistema — tipicamente sob custodia do acquirer, sub-acquirer ou PSP.
          </p>
          <p style={paragraphStyle}>
            Para o PSP/acquirer, o float representa um ativo temporario que pode ser investido em aplicacoes
            de baixo risco e alta liquidez (CDI, compromissadas, fundos DI). A receita de float e uma das
            fontes de receita mais importantes (e menos visiveis) do negocio de pagamentos.
          </p>

          <p style={subheadingStyle}>Tipos de Float</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Prazo tipico</th>
                  <th style={thStyle}>Quem detem</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tipo: "Settlement float", desc: "Entre captura e liquidacao ao merchant", prazo: "D+1 (debito) a D+30 (credito)", quem: "Acquirer/PSP" },
                  { tipo: "Processing float", desc: "Entre autorizacao e captura (pre-auth)", prazo: "Minutos a 7 dias", quem: "Gateway/PSP" },
                  { tipo: "Payout float", desc: "Entre recebimento pelo PSP e transferencia ao merchant", prazo: "D+0 a D+2", quem: "PSP" },
                  { tipo: "Refund float", desc: "Entre solicitacao de reembolso e debito efetivo", prazo: "5-15 dias uteis", quem: "Acquirer" },
                  { tipo: "Dispute float", desc: "Recursos retidos durante processo de chargeback", prazo: "30-120 dias", quem: "Acquirer/emissor" },
                  { tipo: "Reserve float", desc: "Percentual retido como reserva de seguranca (rolling reserve)", prazo: "90-180 dias", quem: "PSP/acquirer" },
                ].map((item) => (
                  <tr key={item.tipo}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.tipo}</td>
                    <td style={tdStyle}>{item.desc}</td>
                    <td style={tdStyle}>{item.prazo}</td>
                    <td style={tdStyle}>{item.quem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    {
      id: "valor-float",
      title: "Valor do Float — Como Calcular",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O valor do float e funcao de tres variaveis: volume de transacoes (GMV), prazo medio
            de liquidacao e taxa de juros (CDI). A formula basica e simples, mas a gestao eficiente
            pode representar milhoes em receita adicional.
          </p>

          <div style={codeBlockStyle}>
{`FORMULA BASICA:
  Receita de Float = Volume medio em custodia × Taxa CDI × Periodo

EXEMPLO PRATICO:
  GMV mensal: R$ 100.000.000
  Prazo medio de liquidacao: D+30 (cartao credito parcelado)

  Volume medio em custodia = GMV × (prazo / 30)
  = R$ 100M × (30/30) = R$ 100M constantemente em custodia

  CDI anual: 13,75% → CDI mensal: ~1,08%

  Receita mensal de float = R$ 100M × 1,08% = R$ 1.080.000/mes
  Receita anual de float = ~R$ 13.000.000/ano

CENARIO COM MIX DE PRAZOS:
  40% debito (D+1):  R$ 40M × (1/30) × 1,08% = R$ 14.400
  35% credito (D+30): R$ 35M × (30/30) × 1,08% = R$ 378.000
  15% credito parc. (D+60): R$ 15M × (60/30) × 1,08% = R$ 324.000
  10% Pix (D+0):     R$ 0 (sem float)

  Total mensal com mix: ~R$ 716.400/mes`}
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Float como arma competitiva
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O float e a razao pela qual muitos PSPs oferecem taxas (MDR) aparentemente abaixo do custo:
              eles compensam com a receita de float. Com Selic alta (13,75%), o float e extremamente lucrativo.
              Porem, a tendencia de mercado para prazos mais curtos (D+2, D+1, D+0) e Pix esta comprimindo
              essa receita. PSPs que dependiam fortemente de float precisam diversificar para antecipacao,
              credito e servicos de valor agregado.
            </p>
          </div>
        </>
      ),
    },

    {
      id: "cash-positioning",
      title: "Cash Positioning Diario",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Cash positioning e o processo diario de prever e gerenciar entradas e saidas de caixa.
            Para um PSP, isso envolve: recebimentos de bandeiras/bancos emissores, pagamentos a merchants,
            custos operacionais, reservas regulatorias e investimentos de tesouraria.
          </p>

          <div style={codeBlockStyle}>
{`CASH POSITIONING DIARIO (exemplo):

ENTRADAS (previstas):
  + Liquidacao Visa:            R$ 12.500.000
  + Liquidacao Mastercard:      R$  8.300.000
  + Liquidacao Elo:             R$  2.100.000
  + Liquidacao Pix recebidos:   R$  5.600.000
  + Resgate de aplicacoes:      R$  3.000.000
  TOTAL ENTRADAS:               R$ 31.500.000

SAIDAS (previstas):
  - Payout merchants (D+1):     R$ 15.200.000
  - Payout merchants (D+2):     R$  8.400.000
  - Antecipacoes (D+0):         R$  3.800.000
  - Chargebacks/refunds:        R$    450.000
  - Custos operacionais:        R$    280.000
  - Impostos (ISS, PIS, COFINS):R$    190.000
  TOTAL SAIDAS:                 R$ 28.320.000

SALDO LIQUIDO:                  R$  3.180.000
  → Aplicar em CDI overnight
  → Manter buffer minimo de R$ 5M (conta reserva BCB)`}
          </div>

          <p style={subheadingStyle}>Conta reserva e liquidez regulatoria</p>
          <p style={paragraphStyle}>
            IPs (Instituicoes de Pagamento) devem manter recursos de clientes segregados em contas
            especificas no BCB ou em titulos publicos. Essa exigencia regulatoria (Resolucao BCB 80/2021)
            garante que os recursos dos usuarios estejam protegidos mesmo em caso de falencia do IP.
            O cash positioning deve considerar essa restricao — os recursos segregados nao podem ser usados
            para despesas operacionais.
          </p>
        </>
      ),
    },

    {
      id: "working-capital",
      title: "Working Capital para Merchants — Antecipacao",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            A antecipacao de recebiveis e um dos produtos financeiros mais rentaveis de um PSP.
            O merchant que vendeu R$100.000 em cartao de credito com liquidacao em D+30 pode
            receber antecipado em D+1 mediante um desconto (desagio). Para o PSP, e uma operacao
            de credito com garantia real (os recebiveis ja existem).
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Parametro</th>
                  <th style={thStyle}>Antecipacao automatica</th>
                  <th style={thStyle}>Antecipacao sob demanda</th>
                  <th style={thStyle}>Working Capital Loan</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { param: "Mecanismo", auto: "Toda venda e antecipada automaticamente", demand: "Merchant solicita quando precisa", loan: "Emprestimo baseado no historico" },
                  { param: "Taxa tipica", auto: "1,5-3,0% a.m.", demand: "2,0-4,0% a.m.", loan: "2,5-5,0% a.m." },
                  { param: "Garantia", auto: "Recebiveis futuros (pre-existentes)", demand: "Recebiveis futuros", loan: "Recebiveis + aval do socio" },
                  { param: "Risco de credito", auto: "Muito baixo (recebivel ja existe)", demand: "Baixo", loan: "Moderado" },
                  { param: "Regulacao", auto: "Registro na CIP/CERC obrigatorio", demand: "Registro CIP/CERC", loan: "SCD/SEP ou parceria bancaria" },
                  { param: "Margem para PSP", auto: "Alta (spread sobre CDI)", demand: "Alta", loan: "Media (risco de default)" },
                ].map((item) => (
                  <tr key={item.param}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.param}</td>
                    <td style={tdStyle}>{item.auto}</td>
                    <td style={tdStyle}>{item.demand}</td>
                    <td style={tdStyle}>{item.loan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Registro de recebiveis (CERC/CIP)
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Desde 2021, todos os recebiveis de cartao devem ser registrados em registradora autorizada
              (CERC ou CIP). Isso criou transparencia: o merchant pode usar recebiveis como garantia em
              qualquer instituicao (portabilidade). Para PSPs, significa competicao por antecipacao — o
              merchant pode escolher quem oferece a melhor taxa. A interoperabilidade entre registradoras
              e um avanço, mas adiciona complexidade operacional significativa.
            </p>
          </div>
        </>
      ),
    },

    {
      id: "fx-treasury",
      title: "FX Treasury — Gestao Cambial",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            PSPs que processam transacoes internacionais (cross-border) enfrentam risco cambial.
            Se um merchant brasileiro vende em USD e recebe em BRL, a variacao do cambio entre a
            data da venda e a data do settlement pode gerar ganho ou perda.
          </p>

          <p style={subheadingStyle}>Instrumentos de Hedging</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
            {[
              {
                instrumento: "NDF (Non-Deliverable Forward)",
                desc: "Contrato a termo sem entrega fisica. Mais usado no Brasil para hedge de BRL. Liquidacao pela diferenca entre taxa contratada e taxa spot no vencimento.",
                uso: "Hedge de recebiveis futuros em moeda estrangeira. Ex: proteger R$ equivalente de GMV em USD a ser liquidado em 30 dias.",
              },
              {
                instrumento: "Forward cambial",
                desc: "Contrato a termo com entrega fisica de moeda. Usado quando ha necessidade real de conversao.",
                uso: "Pagamento a fornecedores internacionais, remessa de lucros, pagamento de taxas de bandeira em USD.",
              },
              {
                instrumento: "Opcoes de cambio",
                desc: "Direito (nao obrigacao) de comprar/vender moeda a taxa predefinida. Premium pago upfront.",
                uso: "Protecao contra cenarios extremos. Mais caro que NDF, mas permite participar de movimentos favoraveis.",
              },
              {
                instrumento: "Natural hedge",
                desc: "Casar receitas e despesas na mesma moeda para eliminar exposicao liquida.",
                uso: "Se PSP recebe interchange em USD e paga taxas de bandeira em USD, o hedge e natural. So precisa hedgear o saldo liquido.",
              },
            ].map((item) => (
              <div key={item.instrumento} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>
                  {item.instrumento}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  {item.desc}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--primary)" }}>Uso em pagamentos:</strong> {item.uso}
                </p>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>IOF em operacoes cambiais</p>
          <p style={paragraphStyle}>
            IOF (Imposto sobre Operacoes Financeiras) incide sobre cambio a 0,38% (operacoes em geral)
            ou 1,1% (cartao de credito internacional). O IOF esta sendo gradualmente reduzido (previsao de
            eliminacao ate 2029 para operacoes comerciais). O impacto no pricing de cross-border payments
            e significativo: em uma transacao de USD 1.000, o IOF pode ser R$19-55 dependendo do tipo.
          </p>
        </>
      ),
    },

    {
      id: "liquidity",
      title: "Liquidity Management",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Gestao de liquidez e garantir que o PSP tenha caixa suficiente para honrar todos os payouts
            a merchants, mesmo em cenarios adversos. Uma crise de liquidez em PSP e catastrofica:
            merchants nao recebem, operacao para, confianca e destruida.
          </p>

          <p style={subheadingStyle}>Fontes de liquidez</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.75rem" }}>
            {[
              "Caixa proprio: capital social + lucros acumulados",
              "Float em custodia: recursos de merchants aguardando liquidacao",
              "Aplicacoes financeiras: CDI, titulos publicos, fundos DI (alta liquidez)",
              "Linhas de credito bancario: standby para emergencias",
              "FIDC (Fundo de Recebiveis): securitizacao de recebiveis para levantar capital",
              "Credito rotativo: linhas pre-aprovadas com bancos parceiros",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0 }}>-</span>
                <span style={{ color: "var(--text-secondary)" }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Stress Testing — Cenarios</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Cenario</th>
                  <th style={thStyle}>Impacto</th>
                  <th style={thStyle}>Buffer necessario</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cen: "Pico de Black Friday", imp: "GMV 3-5x acima do normal em 3 dias", buf: "3-5x do payout diario normal" },
                  { cen: "Onda de chargebacks", imp: "Merchant grande entra em disputa massiva", buf: "Rolling reserve de 5-10% do GMV do merchant" },
                  { cen: "Falha de liquidacao", imp: "Bandeira/banco atrasa liquidacao em 1-2 dias", buf: "2 dias de payout em reserva liquida" },
                  { cen: "Bank run de merchants", imp: "Todos os merchants sacam antecipacao simultaneamente", buf: "FIDC + linha de credito standby" },
                  { cen: "Fraude em larga escala", imp: "Perda de capital + chargebacks + rolling reserve insuficiente", buf: "Seguro + capital regulatorio minimo" },
                ].map((item) => (
                  <tr key={item.cen}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.cen}</td>
                    <td style={tdStyle}>{item.imp}</td>
                    <td style={tdStyle}>{item.buf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    {
      id: "settlement-optimization",
      title: "Settlement Float Optimization",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            A negociacao de prazos de settlement com bandeiras e bancos e uma das alavancas mais
            importantes de tesouraria. Cada dia de diferenca no prazo impacta diretamente a receita
            de float e o capital de giro necessario.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Prazo</th>
                  <th style={thStyle}>Float mensal (R$100M GMV)</th>
                  <th style={thStyle}>Receita CDI mensal</th>
                  <th style={thStyle}>Quem oferece</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { prazo: "D+30", float: "R$ 100M", receita: "R$ 1.080.000", quem: "Padrao historico credito" },
                  { prazo: "D+15", float: "R$ 50M", receita: "R$ 540.000", quem: "Acquirers mid-market" },
                  { prazo: "D+2", float: "R$ 6.7M", receita: "R$ 72.000", quem: "Padrao Pix, debito" },
                  { prazo: "D+1", float: "R$ 3.3M", receita: "R$ 36.000", quem: "Premium acquirers" },
                  { prazo: "D+0", float: "R$ 0", receita: "R$ 0", quem: "Pix instantaneo" },
                ].map((item) => (
                  <tr key={item.prazo}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.prazo}</td>
                    <td style={tdStyle}>{item.float}</td>
                    <td style={{ ...tdStyle, color: "var(--primary)", fontWeight: 600 }}>{item.receita}</td>
                    <td style={tdStyle}>{item.quem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Tendencia: compressao de prazos
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O mercado brasileiro esta em rapida transicao de D+30 para D+2/D+1. O Pix ja e D+0
              (instantaneo). Isso comprime drasticamente a receita de float. Estrategias de compensacao:
              (1) aumentar volume processado, (2) lancar produtos de antecipacao (receita de spread),
              (3) oferecer credito (working capital loans), (4) diversificar para servicos de valor agregado
              (dashboard, analytics, embedded finance).
            </p>
          </div>
        </>
      ),
    },

    {
      id: "reconciliacao-tesouraria",
      title: "Reconciliacao de Tesouraria",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            A reconciliacao de tesouraria garante que o dinheiro que entra e sai confere com os registros
            internos. Em pagamentos, isso e critico porque qualquer discrepancia pode significar: dinheiro
            pago a mais, dinheiro nao recebido, ou fraude.
          </p>

          <div style={codeBlockStyle}>
{`3-WAY RECON DE TESOURARIA:

1. INTERNAL LEDGER (seu sistema)
   Transacao #12345: R$ 100,00 | Merchant: Loja ABC | Status: captured

2. ACQUIRER FILE (arquivo de liquidacao)
   Settlement: R$ 97,00 (R$ 100 - MDR 3%) | Data: D+2

3. BANK STATEMENT (extrato bancario)
   Credito: R$ 97,00 | Origem: Cielo | Data: D+2

MATCHING:
   Internal (R$ 100) × Acquirer (R$ 97) → Match (diferenca = MDR 3% ✓)
   Acquirer (R$ 97)  × Bank (R$ 97)     → Match ✓

BREAKS COMUNS:
   - Timing: banco credita D+3 em vez de D+2 (break temporario)
   - Amount: acquirer cobra taxa diferente da contratada
   - Missing: transacao no ledger sem correspondente no acquirer
   - Duplicate: banco credita mesmo valor duas vezes`}
          </div>

          <p style={subheadingStyle}>Aging e SLAs</p>
          <p style={paragraphStyle}>
            Cada break deve ter SLA de resolucao baseado no tipo e valor. Breaks de valor alto
            (acima de R$10.000) devem ser escalonados em 24h. O aging report mostra breaks por idade:
            0-3 dias (aceitavel), 4-7 dias (atencao), 8-30 dias (escalacao), 30+ dias (write-off candidato).
            A meta e reconciliacao de 99,5%+ do volume em D+3.
          </p>
        </>
      ),
    },

    {
      id: "reporting",
      title: "Reporting e Controles",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Tesouraria de pagamentos exige reporting diario e controles rigorosos. O MIS (Management
            Information System) deve fornecer visibilidade completa de caixa, exposicoes e performance.
          </p>

          <p style={subheadingStyle}>Reports essenciais</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
            {[
              {
                report: "Daily Cash Position",
                freq: "Diario (9h)",
                conteudo: "Saldo por conta, entradas/saidas previstas, posicao liquida, acoes necessarias",
              },
              {
                report: "Settlement Report",
                freq: "Diario",
                conteudo: "Volume liquidado por bandeira, taxa efetiva vs contratada, timeline compliance",
              },
              {
                report: "Float Revenue Report",
                freq: "Mensal",
                conteudo: "Receita de float por produto, taxa media de remuneracao, benchmark vs CDI",
              },
              {
                report: "Reconciliation Dashboard",
                freq: "Diario",
                conteudo: "Recon rate, breaks por tipo, aging, top breaks por valor, tendencias",
              },
              {
                report: "FX Exposure Report",
                freq: "Diario",
                conteudo: "Exposicao por moeda, hedges ativos, P&L de FX, MTM de derivativos",
              },
              {
                report: "Liquidity Stress Report",
                freq: "Semanal/Mensal",
                conteudo: "Resultado dos cenarios de stress, buffer disponivel, acoes recomendadas",
              },
            ].map((item) => (
              <div key={item.report} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{item.report}</span>
                  <span style={tagStyle}>{item.freq}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {item.conteudo}
                </p>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Controles de tesouraria</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {[
              "Segregacao de funcoes: quem aprova pagamento nao executa transferencia",
              "Limites de exposicao por contraparte, moeda e instrumento",
              "Dual authorization para transferencias acima de threshold",
              "Reconciliacao diaria obrigatoria (T+1) com escalacao automatica de breaks",
              "Auditoria interna trimestral dos controles de tesouraria",
              "Mark-to-market diario de derivativos e investimentos",
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
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Treasury e Float Management</h1>
        <p className="page-description">
          Guia completo sobre gestao de tesouraria em empresas de pagamento: float, cash positioning,
          antecipacao de recebiveis, gestao cambial, liquidez e reconciliacao de tesouraria.
        </p>
      </header>
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>O que e float e como calcular sua receita potencial</li>
          <li>Cash positioning diario e gestao de conta reserva</li>
          <li>Antecipacao de recebiveis como produto financeiro</li>
          <li>Gestao cambial: NDF, forward, natural hedge, IOF</li>
          <li>Liquidity management e stress testing</li>
          <li>Otimizacao de prazos de settlement</li>
          <li>Reconciliacao de tesouraria e controles</li>
        </ul>
      </div>
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { val: "9", label: "Secoes" }, { val: "6", label: "Tipos Float" }, { val: "4", label: "Hedging" }, { val: "6", label: "Reports" },
        ].map((s) => (
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
            { name: "Reconciliacao Deep Dive", href: "/knowledge/reconciliation-deep" },
            { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing" },
            { name: "Antecipacao de Recebiveis", href: "/knowledge/antecipacao-recebiveis" },
            { name: "Payment Methods BR", href: "/knowledge/payment-methods-br" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none", transition: "all 0.2s" }}>{link.name}</Link>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.5 }}>
          Fontes: Banco Central do Brasil, Resolucao BCB 80/2021, CIP/CERC, ANBIMA, documentacao publica de acquirers.
        </p>
      </div>
    </div>
  );
}
