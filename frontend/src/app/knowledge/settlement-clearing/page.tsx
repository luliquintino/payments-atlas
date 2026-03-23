"use client";

import { useState } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Section data
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
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "var(--primary)",
  textAlign: "center",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SettlementClearingPage() {
  const quiz = getQuizForPage("/knowledge/settlement-clearing");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "clearing-vs-settlement",
      title: "Clearing vs Settlement",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Clearing e settlement sao dois processos distintos mas complementares no ciclo de vida de
            uma transacao financeira. Clearing e o processo de validacao, reconciliacao e calculo das
            obrigacoes liquidas entre as partes. Settlement e a transferencia efetiva dos fundos para
            liquidar essas obrigacoes.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Clearing</th>
                  <th style={thStyle}>Settlement</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Definicao</td><td style={tdStyle}>Calculo e validacao das obrigacoes mutuas</td><td style={tdStyle}>Transferencia efetiva de fundos entre contas</td></tr>
                <tr><td style={tdStyle}>Timing</td><td style={tdStyle}>Ocorre primeiro, pode ser em lotes</td><td style={tdStyle}>Ocorre apos clearing, pode ser em tempo real ou batch</td></tr>
                <tr><td style={tdStyle}>Risco principal</td><td style={tdStyle}>Erros de calculo, duplicidade</td><td style={tdStyle}>Risco de contraparte, Herstatt risk</td></tr>
                <tr><td style={tdStyle}>Exemplo cartao</td><td style={tdStyle}>Bandeira calcula valores liquidos entre adquirente e emissor</td><td style={tdStyle}>Banco do adquirente transfere fundos ao banco do emissor</td></tr>
                <tr><td style={tdStyle}>Entidade</td><td style={tdStyle}>Clearinghouse (ex: CIP, LCH, DTCC)</td><td style={tdStyle}>Banco Central, bancos correspondentes</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Analogia
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Clearing e como calcular a conta de um jantar em grupo (quem deve o que a quem).
              Settlement e quando cada pessoa efetivamente transfere o dinheiro. Netting seria
              simplificar: &quot;voce me deve R$50 e eu te devo R$30, entao voce so me paga R$20&quot;.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "rtgs",
      title: "RTGS (Real-Time Gross Settlement)",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            RTGS e o modelo de liquidacao em que cada transacao e liquidada individualmente (gross) e
            em tempo real, sem netting. E o padrao para transacoes de alto valor, pois elimina o risco
            de credito entre participantes. Cada transferencia e final e irrevogavel no momento da execucao.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Sistema RTGS</th>
                  <th style={thStyle}>Pais/Regiao</th>
                  <th style={thStyle}>Operador</th>
                  <th style={thStyle}>Caracteristica</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>STR (Sistema de Transferencia de Reservas)</td><td style={tdStyle}>Brasil</td><td style={tdStyle}>Banco Central do Brasil</td><td style={tdStyle}>Liquida em tempo real, opera em contas de reserva bancaria</td></tr>
                <tr><td style={tdStyle}>Fedwire</td><td style={tdStyle}>EUA</td><td style={tdStyle}>Federal Reserve</td><td style={tdStyle}>Processa ~$4 trilhoes/dia, base do sistema financeiro americano</td></tr>
                <tr><td style={tdStyle}>TARGET2</td><td style={tdStyle}>Zona Euro</td><td style={tdStyle}>Eurosystem (ECB)</td><td style={tdStyle}>Conecta bancos centrais europeus, migrando para T2/TIPS</td></tr>
                <tr><td style={tdStyle}>CHAPS</td><td style={tdStyle}>Reino Unido</td><td style={tdStyle}>Bank of England</td><td style={tdStyle}>Liquidacao same-day para pagamentos de alto valor</td></tr>
                <tr><td style={tdStyle}>BOJ-NET</td><td style={tdStyle}>Japao</td><td style={tdStyle}>Bank of Japan</td><td style={tdStyle}>Hibrido RTGS com mecanismos de economia de liquidez</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            A principal desvantagem do RTGS e o alto consumo de liquidez: cada transacao exige que o
            participante tenha saldo suficiente no momento exato. Sistemas modernos como o T2 europeu
            incorporam mecanismos de &quot;liquidity-saving&quot; que otimizam o uso de reservas sem
            comprometer a finalidade da liquidacao.
          </p>
        </>
      ),
    },
    {
      id: "dns",
      title: "DNS (Deferred Net Settlement)",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            No modelo DNS, as transacoes sao acumuladas ao longo de um periodo (janela de clearing) e
            apenas o valor liquido (net) e liquidado no final. Isso reduz drasticamente a necessidade
            de liquidez, pois obrigacoes opostas se cancelam via netting.
          </p>
          <p style={subheadingStyle}>Netting Multilateral vs Bilateral</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Como funciona</th>
                  <th style={thStyle}>Reducao de liquidez</th>
                  <th style={thStyle}>Risco</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Bilateral</td><td style={tdStyle}>Netting entre pares de participantes</td><td style={tdStyle}>Moderada (50-70%)</td><td style={tdStyle}>Menor complexidade, mais transferencias</td></tr>
                <tr><td style={tdStyle}>Multilateral</td><td style={tdStyle}>Netting entre todos os participantes via CCP</td><td style={tdStyle}>Alta (80-95%)</td><td style={tdStyle}>Se um participante falhar, afeta todo o sistema</td></tr>
              </tbody>
            </table>
          </div>
          <div style={formulaStyle}>
            Netting Multilateral: Posicao_Liquida(A) = SUM(creditos_A) - SUM(debitos_A)
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Exemplo de Netting
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Banco A deve R$100M ao Banco B. Banco B deve R$80M ao Banco A. Sem netting: 2 transferencias
              totalizando R$180M. Com netting bilateral: 1 transferencia de R$20M (A para B). Reducao de 89%
              na liquidez necessaria.
            </p>
          </div>
          <p style={paragraphStyle}>
            O risco principal do DNS e que, se um participante falhar antes da liquidacao final, todas as
            obrigacoes podem precisar ser recalculadas (unwinding). Sistemas modernos mitigam isso com
            garantias colaterais, limites de exposicao e mecanismos de loss-sharing.
          </p>
        </>
      ),
    },
    {
      id: "ach-batch",
      title: "ACH & Batch Processing",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            ACH (Automated Clearing House) e um sistema de pagamentos eletronicos baseado em processamento
            em lote (batch). Transacoes sao coletadas durante o dia e processadas em janelas especificas.
            E o backbone para pagamentos recorrentes, folha de pagamento e transferencias de baixo valor.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Sistema</th>
                  <th style={thStyle}>Pais</th>
                  <th style={thStyle}>Operador</th>
                  <th style={thStyle}>Volume</th>
                  <th style={thStyle}>Regras</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>ACH (USA)</td><td style={tdStyle}>EUA</td><td style={tdStyle}>The Clearing House / Fed</td><td style={tdStyle}>~30B txs/ano</td><td style={tdStyle}>NACHA Operating Rules</td></tr>
                <tr><td style={tdStyle}>COMPE</td><td style={tdStyle}>Brasil</td><td style={tdStyle}>Banco do Brasil (servico)</td><td style={tdStyle}>Cheques, DOC</td><td style={tdStyle}>Regulacao BCB</td></tr>
                <tr><td style={tdStyle}>CIP (SITRAF)</td><td style={tdStyle}>Brasil</td><td style={tdStyle}>CIP</td><td style={tdStyle}>TED hibrido</td><td style={tdStyle}>Liquidacao hibrida (batch + RTGS)</td></tr>
                <tr><td style={tdStyle}>Bacs</td><td style={tdStyle}>Reino Unido</td><td style={tdStyle}>Pay.UK</td><td style={tdStyle}>~7B txs/ano</td><td style={tdStyle}>Direct Debit, Direct Credit</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Ciclo ACH nos EUA (NACHA)</p>
          <p style={paragraphStyle}>
            1. Originator submete arquivo batch ao ODFI (Originating Depository Financial Institution).
            2. ODFI envia ao operador ACH (Fed ou TCH). 3. Operador faz sorting e distribui aos RDFIs
            (Receiving DFI). 4. RDFI credita/debita a conta do receiver. 5. Settlement ocorre via Fedwire
            ou Federal Reserve. Ciclo tipico: T+1 para same-day ACH, T+2 para standard.
          </p>
          <p style={paragraphStyle}>
            No Brasil, a COMPE (Centralizadora da Compensacao de Cheques) historicamente processava cheques
            em D+1. Com a digitalizacao, a CIP assumiu papel central com o SITRAF (hibrido, liquidacao ao
            longo do dia) e o SPI (PIX, liquidacao em tempo real).
          </p>
        </>
      ),
    },
    {
      id: "sepa",
      title: "SEPA (Europa)",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            SEPA (Single Euro Payments Area) unifica os pagamentos em euros para 36 paises europeus,
            permitindo que transferencias cross-border sejam tao simples e baratas quanto pagamentos domesticos.
            Operado pelo European Payments Council (EPC), possui tres esquemas principais.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Esquema</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Timing</th>
                  <th style={thStyle}>Limite</th>
                  <th style={thStyle}>Uso Principal</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>SCT (SEPA Credit Transfer)</td><td style={tdStyle}>Push payment</td><td style={tdStyle}>D+1</td><td style={tdStyle}>Sem limite</td><td style={tdStyle}>Transferencias bancarias padrao</td></tr>
                <tr><td style={tdStyle}>SDD (SEPA Direct Debit)</td><td style={tdStyle}>Pull payment</td><td style={tdStyle}>D+2 (Core) / D+1 (B2B)</td><td style={tdStyle}>Sem limite</td><td style={tdStyle}>Cobrancas recorrentes, assinaturas</td></tr>
                <tr><td style={tdStyle}>SCT Inst (Instant)</td><td style={tdStyle}>Push payment</td><td style={tdStyle}>10 segundos</td><td style={tdStyle}>EUR 100.000</td><td style={tdStyle}>Pagamentos instantaneos P2P/B2C</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>ISO 20022 Migration</p>
          <p style={paragraphStyle}>
            A Europa esta migrando toda a infraestrutura de pagamentos para ISO 20022, o padrao de mensageria
            baseado em XML/JSON que substitui formatos legados como MT (SWIFT). Beneficios: dados mais ricos
            (structured remittance info), melhor compliance (screening automatizado), interoperabilidade global.
            TARGET2 completou migracao em marco 2023. SWIFT coexiste MT/MX ate novembro 2025.
          </p>
          <p style={paragraphStyle}>
            O regulamento europeu de 2024 torna obrigatoria a oferta de pagamentos instantaneos (SCT Inst) por
            todos os PSPs da zona euro, com pricing igual ou inferior ao SCT padrao. Isso elimina a barreira
            de adocao e posiciona o instant payment como o novo padrao default.
          </p>
        </>
      ),
    },
    {
      id: "pix-spi",
      title: "PIX Settlement (SPI)",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            O SPI (Sistema de Pagamentos Instantaneos) e a infraestrutura de liquidacao do PIX, operada
            pelo Banco Central do Brasil. Diferente de outros sistemas de pagamento instantaneo, o PIX
            liquida em tempo real no BCB, que atua como contraparte central (CCP), eliminando risco de
            credito entre participantes.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>Funcao</th>
                  <th style={thStyle}>Detalhe</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>SPI</td><td style={tdStyle}>Infraestrutura de liquidacao</td><td style={tdStyle}>Opera 24/7/365, liquidacao em conta PI no BCB</td></tr>
                <tr><td style={tdStyle}>DICT</td><td style={tdStyle}>Diretorio de identificadores</td><td style={tdStyle}>Mapeia chaves PIX (CPF, email, telefone, aleatoria) para contas</td></tr>
                <tr><td style={tdStyle}>Conta PI</td><td style={tdStyle}>Conta de liquidacao</td><td style={tdStyle}>Pre-funded, cada PSP mantem saldo para liquidar transacoes</td></tr>
                <tr><td style={tdStyle}>PSP Direto</td><td style={tdStyle}>Participante direto</td><td style={tdStyle}>Conecta diretamente ao SPI, mantem conta PI</td></tr>
                <tr><td style={tdStyle}>PSP Indireto</td><td style={tdStyle}>Participante indireto</td><td style={tdStyle}>Acessa SPI via PSP direto (liquidante)</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Fluxo de Liquidacao PIX</p>
          <p style={paragraphStyle}>
            1. Pagador inicia PIX no app do PSP. 2. PSP pagador valida e envia mensagem ao SPI. 3. BCB
            debita conta PI do PSP pagador e credita conta PI do PSP recebedor (atomico). 4. PSP recebedor
            credita conta do beneficiario. 5. Tempo total: menos de 3 segundos end-to-end. A liquidacao e
            final e irrevogavel no momento do debito/credito das contas PI.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Gestao de Liquidez no PIX
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              PSPs devem manter saldo pre-depositado na conta PI. Se o saldo zerar, o PSP nao consegue
              enviar PIX. O BCB permite recomposicao via STR durante horario comercial. Fora do horario,
              PSPs devem gerenciar cuidadosamente a liquidez, especialmente em datas de alto volume
              (Black Friday, pagamento de salarios).
            </p>
          </div>
        </>
      ),
    },
    {
      id: "clearing-cartoes",
      title: "Clearing de Cartoes",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            O clearing de cartoes e o processo pelo qual bandeiras (Visa, Mastercard) calculam as obrigacoes
            liquidas entre emissores e adquirentes. Cada bandeira tem seu formato proprietario de arquivo e
            seus deadlines especificos.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Bandeira</th>
                  <th style={thStyle}>Formato Clearing</th>
                  <th style={thStyle}>Ciclo</th>
                  <th style={thStyle}>Deadline</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Visa</td><td style={tdStyle}>TC105 (Base II)</td><td style={tdStyle}>Ate 3 ciclos/dia</td><td style={tdStyle}>Submission: ate 5 dias apos autorizacao</td></tr>
                <tr><td style={tdStyle}>Mastercard</td><td style={tdStyle}>IPM (Integrated Processing Message)</td><td style={tdStyle}>Ate 2 ciclos/dia</td><td style={tdStyle}>First presentment: ate 7 dias calendario</td></tr>
                <tr><td style={tdStyle}>Elo</td><td style={tdStyle}>Formato proprietario Elo</td><td style={tdStyle}>Diario</td><td style={tdStyle}>Varia por tipo de transacao</td></tr>
                <tr><td style={tdStyle}>Amex</td><td style={tdStyle}>Closed-loop (Amex e emissor + adquirente)</td><td style={tdStyle}>N/A</td><td style={tdStyle}>Nao ha clearing inter-banco</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Ciclo Tipico (Visa)</p>
          <p style={paragraphStyle}>
            1. Autorizacao: transacao aprovada em tempo real. 2. Captura: adquirente confirma a transacao
            (pode ser imediata ou posterior). 3. Clearing: adquirente envia TC105 a Visa, que gera arquivo
            de clearing para o emissor. 4. Settlement: Visa calcula net position e instrui transferencia
            interbancaria. Timing: autorizacao em D0, clearing em D+1, settlement em D+1 ou D+2.
          </p>
          <p style={paragraphStyle}>
            Transacoes nao capturadas dentro do prazo podem gerar mismatches entre autorizacao e clearing.
            Emissores podem reverter autorizacoes expiradas (stale authorizations), causando chargebacks
            tecnicos. A reconciliacao entre autorizacao, clearing e settlement e um dos maiores desafios
            operacionais de qualquer processador de pagamentos.
          </p>
        </>
      ),
    },
    {
      id: "reconciliacao",
      title: "Reconciliation Patterns",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Reconciliacao e o processo de comparar registros de diferentes fontes para garantir consistencia.
            Em pagamentos, a reconciliacao de 3 vias (3-way reconciliation) compara: (1) registros internos
            do processador, (2) arquivos da bandeira/clearing, (3) extratos bancarios de settlement.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Fontes Comparadas</th>
                  <th style={thStyle}>Frequencia</th>
                  <th style={thStyle}>Excecoes Comuns</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Auth vs Clearing</td><td style={tdStyle}>Log de autorizacao vs arquivo TC105/IPM</td><td style={tdStyle}>Diaria</td><td style={tdStyle}>Partial captures, auth-only, late captures</td></tr>
                <tr><td style={tdStyle}>Clearing vs Settlement</td><td style={tdStyle}>Arquivo bandeira vs extrato bancario</td><td style={tdStyle}>Diaria</td><td style={tdStyle}>Timing differences, FX adjustments</td></tr>
                <tr><td style={tdStyle}>Internal vs External</td><td style={tdStyle}>Sistema interno vs adquirente/gateway</td><td style={tdStyle}>Diaria</td><td style={tdStyle}>Missing transactions, duplicates</td></tr>
                <tr><td style={tdStyle}>Financial Recon</td><td style={tdStyle}>Ledger interno vs conta bancaria</td><td style={tdStyle}>Diaria</td><td style={tdStyle}>Float, timing, fees nao previstos</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Automated Matching</p>
          <p style={paragraphStyle}>
            Sistemas modernos usam matching automatizado em cascata: primeiro por ID exato (transaction ID),
            depois por combinacao de atributos (valor + data + merchant), e finalmente fuzzy matching para
            diferencas menores. A taxa de match automatico madura e 95-99%. Os 1-5% restantes vao para
            filas de excecao para tratamento manual ou regras especificas.
          </p>
          <p style={paragraphStyle}>
            Excecoes nao resolvidas dentro do SLA geram aging reports e podem indicar problemas sistemicos:
            divergencia consistente com um adquirente especifico, falha em captura, ou mesmo fraude. A
            analise de padroes de excecao e tao importante quanto resolver cada caso individualmente.
          </p>
        </>
      ),
    },
    {
      id: "riscos-settlement",
      title: "Riscos de Settlement",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Riscos de settlement sao os riscos de que uma das partes nao cumpra sua obrigacao na liquidacao.
            Sao os riscos mais criticos em infraestrutura financeira, pois podem causar efeito cascata
            (risco sistemico) se nao mitigados adequadamente.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Risco</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Mitigacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Herstatt Risk</td><td style={tdStyle}>Em FX, uma parte entrega a moeda A mas nao recebe a moeda B (risco de timezone)</td><td style={tdStyle}>CLS Bank (PVP), settlement simultaneous</td></tr>
                <tr><td style={tdStyle}>Principal Risk</td><td style={tdStyle}>Risco de perder o valor total da transacao se a contraparte falhar</td><td style={tdStyle}>DVP (Delivery vs Payment), CCP com garantias</td></tr>
                <tr><td style={tdStyle}>Liquidity Risk</td><td style={tdStyle}>Participante nao tem fundos suficientes no momento da liquidacao</td><td style={tdStyle}>Limites de exposicao, credit facilities, pre-funding</td></tr>
                <tr><td style={tdStyle}>Operational Risk</td><td style={tdStyle}>Falhas de sistema, erros humanos, cyberataques</td><td style={tdStyle}>Redundancia, DR, segregacao de funcoes</td></tr>
                <tr><td style={tdStyle}>Systemic Risk</td><td style={tdStyle}>Falha de um participante contamina todo o sistema</td><td style={tdStyle}>Loss-sharing, default funds, circuit breakers</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Settlement Finality</p>
          <p style={paragraphStyle}>
            Settlement finality e o momento em que uma transferencia se torna irrevogavel e incondicional.
            Antes da finality, a transacao pode ser revertida (unwound) em caso de default. A EU Settlement
            Finality Directive define que a liquidacao e final no momento designado pelas regras do sistema.
          </p>
          <p style={subheadingStyle}>DVP e PVP</p>
          <p style={paragraphStyle}>
            DVP (Delivery vs Payment) garante que a entrega do ativo ocorre se e somente se o pagamento
            ocorrer (usado em titulos). PVP (Payment vs Payment) garante que a entrega de uma moeda ocorre
            se e somente se a outra moeda for entregue (usado em FX). O CLS Bank processa ~$5 trilhoes/dia
            em FX usando PVP, eliminando o Herstatt risk para as 18 moedas participantes.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Settlement & Clearing Mechanics
        </h1>
        <p className="page-description">
          Como funciona a infraestrutura de compensacao e liquidacao: RTGS, DNS, ACH, SEPA,
          PIX/SPI, clearing de cartoes e gestao de riscos de settlement.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Diferenca fundamental entre clearing e settlement e por que ambos existem</li>
          <li>Como funcionam RTGS, DNS, ACH e os principais sistemas globais de liquidacao</li>
          <li>Arquitetura do SPI (PIX) e clearing de cartoes (Visa TC105, Mastercard IPM)</li>
          <li>Padroes de reconciliacao e riscos criticos de settlement (Herstatt, DVP, PVP)</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Sistemas RTGS</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>$5T</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>CLS Bank/dia</div>
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

      {/* Quiz */}
      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
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
    </div>
  );
}
