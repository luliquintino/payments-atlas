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

export default function Iso20022SwiftPage() {
  const quiz = getQuizForPage("/knowledge/iso20022-swift");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "o-que-e-iso20022",
      title: "O que e ISO 20022",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            ISO 20022 e o padrao universal de mensageria financeira que esta substituindo todos os formatos
            legados (MT SWIFT, ISO 8583 em partes, formatos proprietarios). Baseado em XML (e cada vez mais
            JSON), oferece dados muito mais ricos e estruturados que seus predecessores — permitindo automacao,
            compliance e analytics que antes eram impossiveis.
          </p>
          <p style={paragraphStyle}>
            Desenvolvido pela ISO (International Organization for Standardization), o 20022 define um modelo
            de dados universal (business model) do qual mensagens especificas sao derivadas. Cobre pagamentos,
            titulos (securities), trade finance, forex e cartoes. Ate 2025, mais de 70 paises e infraestruturas
            de pagamento adotaram ou estao migrando para ISO 20022.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Por que ISO 20022 importa
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Dados mais ricos = melhor screening de sancoes (nome completo + endereco vs campo de 35 chars).
              Estrutura padronizada = automacao de reconciliacao (STP rates de 95%+ vs 70% com MT).
              Universal = um unico formato para pagamentos domesticos, cross-border, instant e batch.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "iso20022-vs-iso8583",
      title: "ISO 20022 vs ISO 8583",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Apesar de ambos serem padroes ISO para mensagens financeiras, 20022 e 8583 servem propositos
            diferentes e coexistirao por muitos anos. Entender quando usar cada um e fundamental.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>ISO 20022</th>
                  <th style={thStyle}>ISO 8583</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Dominio</td><td style={tdStyle}>Banking, payments, securities, FX, trade</td><td style={tdStyle}>Card payments (autorizacao, clearing)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Formato</td><td style={tdStyle}>XML / JSON (human-readable)</td><td style={tdStyle}>Binario com bitmap (machine-optimized)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Tamanho msg</td><td style={tdStyle}>Kilobytes (verbose, rico em dados)</td><td style={tdStyle}>Centenas de bytes (compacto, eficiente)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Data richness</td><td style={tdStyle}>Campos estruturados, endereco completo, remittance info</td><td style={tdStyle}>Campos fixos/variaveis, limitado em tamanho</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Latencia</td><td style={tdStyle}>Tolerante (batch e real-time)</td><td style={tdStyle}>Otimizado para baixa latencia (&lt;1s)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Uso principal</td><td style={tdStyle}>SWIFT, Pix, SEPA, FedNow, ACH</td><td style={tdStyle}>Visa, Mastercard, Elo (autorizacao e clearing)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Evolucao</td><td style={tdStyle}>Em expansao — adotado globalmente</td><td style={tdStyle}>Estavel — dominante em cards, sem substituto</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            Na pratica: quando voce passa o cartao, ISO 8583 carrega a autorizacao. Quando o banco faz o
            settlement interbancario dessa mesma transacao, ISO 20022 (ou SWIFT MT, em migracao) e usado.
            Quando voce faz um Pix, ISO 20022 e usado do inicio ao fim.
          </p>
        </>
      ),
    },
    {
      id: "swift-network",
      title: "SWIFT Network",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            SWIFT (Society for Worldwide Interbank Financial Telecommunication) e a rede de mensageria que conecta
            mais de 11.000 instituicoes financeiras em 200+ paises. SWIFT nao transfere dinheiro — transfere
            mensagens padronizadas que instruem bancos a mover fundos. E a espinha dorsal do sistema bancario
            internacional.
          </p>
          <p style={subheadingStyle}>BIC (Bank Identifier Code)</p>
          <p style={paragraphStyle}>
            Cada instituicao conectada ao SWIFT tem um BIC unico (tambem chamado SWIFT code): 8 ou 11 caracteres.
            Exemplo: ITAUBRSP (Itau, Brasil, Sao Paulo). Os primeiros 4 chars = banco, proximos 2 = pais,
            proximos 2 = localidade, ultimos 3 (opcional) = agencia.
          </p>
          <p style={subheadingStyle}>Correspondent Banking</p>
          <p style={paragraphStyle}>
            Nem todo banco tem conexao direta com todos os outros. Correspondent banking e o modelo onde bancos
            intermediarios (correspondentes) fazem a ponte. Um pagamento de Brasil para Vietnam pode passar por:
            Banco BR → Banco correspondente (NYC) → Banco correspondente (Singapore) → Banco VN. Cada hop
            adiciona custo e tempo — e por isso cross-border e caro e lento.
          </p>
          <div style={codeBlockStyle}>{`Fluxo SWIFT tipico (cross-border payment):

Banco Remetente (Brasil, ITAUBRSP)
  |
  MT103 (payment instruction) via SWIFTNet
  |
Banco Correspondente (NYC, CITIUS33)
  |
  MT103 (onward payment) via SWIFTNet
  |
Banco Beneficiario (UK, BARCGB22)
  |
Credita conta do beneficiario

Tempo total: 1-5 dias uteis
Custo: US$ 15-50 em fees intermediarios`}</div>
        </>
      ),
    },
    {
      id: "mt-para-mx",
      title: "Migracao MT → MX",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            A maior migracao da historia da mensageria financeira esta em andamento: de mensagens MT (Message Type)
            do SWIFT para mensagens MX (ISO 20022). MT e um formato de texto com campos de tamanho fixo, criado
            nos anos 70. MX e XML estruturado com dados ricos. A coexistencia (MT e MX em paralelo) vai durar
            ate novembro de 2025, quando SWIFT planeja desligar MT para pagamentos cross-border.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>MT (Legacy)</th>
                  <th style={thStyle}>MX (ISO 20022)</th>
                  <th style={thStyle}>Uso</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>MT103</td><td style={tdStyle}>pacs.008</td><td style={tdStyle}>Customer credit transfer (pagamento a beneficiario)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>MT202</td><td style={tdStyle}>pacs.009</td><td style={tdStyle}>Financial institution credit transfer (interbancario)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>MT940</td><td style={tdStyle}>camt.053</td><td style={tdStyle}>Statement of account (extrato bancario)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>MT900/910</td><td style={tdStyle}>camt.054</td><td style={tdStyle}>Debit/credit notification</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>MT199</td><td style={tdStyle}>admi.004</td><td style={tdStyle}>Free format message</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Desafio da coexistencia
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Durante a migracao, bancos precisam traduzir entre MT e MX. O problema: MX tem campos que MT nao
              suporta (endereco estruturado, LEI, purpose code). Na traducao MX→MT, dados sao perdidos (truncation).
              Na traducao MT→MX, campos ficam vazios. SWIFT oferece o Translation Service, mas cada banco deve
              validar que a traducao nao corrompe dados criticos como beneficiary name ou amount.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "anatomia-pacs008",
      title: "Anatomia de uma pacs.008",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            pacs.008 (FIToFICustomerCreditTransfer) e a mensagem mais importante do ISO 20022 para pagamentos.
            Ela substitui o MT103 e carrega toda a informacao de um pagamento de um cliente para outro.
          </p>
          <div style={codeBlockStyle}>{`<!-- pacs.008 simplificada -->
<FIToFICstmrCdtTrf>
  <GrpHdr>
    <MsgId>MSG-2024-001</MsgId>
    <CreDtTm>2024-01-15T10:00:00Z</CreDtTm>
    <NbOfTxs>1</NbOfTxs>
    <SttlmInf>
      <SttlmMtd>CLRG</SttlmMtd>
    </SttlmInf>
  </GrpHdr>
  <CdtTrfTxInf>
    <PmtId>
      <InstrId>INSTR-001</InstrId>
      <EndToEndId>E2E-PAY-12345</EndToEndId>
      <UETR>eb6305c9-1f7a-4c4b-8b3e-5a7e2a1b3c4d</UETR>
    </PmtId>
    <IntrBkSttlmAmt Ccy="BRL">1500.00</IntrBkSttlmAmt>
    <ChrgBr>SHAR</ChrgBr>
    <Dbtr>
      <Nm>Maria Silva</Nm>
      <PstlAdr>
        <Ctry>BR</Ctry>
        <AdrLine>Av Paulista 1000, Sao Paulo</AdrLine>
      </PstlAdr>
    </Dbtr>
    <DbtrAgt><FinInstnId><BICFI>ITAUBRSP</BICFI></FinInstnId></DbtrAgt>
    <CdtrAgt><FinInstnId><BICFI>BARCGB22</BICFI></FinInstnId></CdtrAgt>
    <Cdtr>
      <Nm>John Smith</Nm>
      <PstlAdr><Ctry>GB</Ctry></PstlAdr>
    </Cdtr>
    <RmtInf><Ustrd>Invoice INV-2024-001</Ustrd></RmtInf>
  </CdtTrfTxInf>
</FIToFICstmrCdtTrf>`}</div>
          <p style={subheadingStyle}>Campos-chave</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {[
              { field: "UETR", desc: "Unique End-to-End Transaction Reference — UUID que permite rastrear o pagamento de ponta a ponta (SWIFT gpi)." },
              { field: "EndToEndId", desc: "ID do pagamento mantido do originador ao beneficiario. Nao muda entre hops." },
              { field: "ChrgBr", desc: "Charge Bearer: SHA (shared), OUR (remetente paga tudo), BEN (beneficiario paga tudo)." },
              { field: "Dbtr/Cdtr", desc: "Debtor (quem paga) e Creditor (quem recebe) com dados estruturados (nome, endereco, pais)." },
              { field: "RmtInf", desc: "Remittance Information — referencia do pagamento (invoice, contrato). Ate 140 chars structured ou unstructured." },
            ].map((item) => (
              <div key={item.field} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0, minWidth: "5rem" }}>{item.field}</span>
                <span style={{ color: "var(--text-secondary)" }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "swift-gpi",
      title: "SWIFT gpi",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            SWIFT gpi (Global Payments Innovation) e a iniciativa que transformou pagamentos cross-border via SWIFT
            de opacos e lentos para rastreáveis e rapidos. Lancado em 2017, o gpi ja processa mais de 80% do
            trafego cross-border do SWIFT. A promessa: rastreamento end-to-end, SLAs de velocidade e transparencia
            de fees.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "UETR (Unique End-to-End Transaction Reference)", emoji: "🔍", desc: "UUID atribuido a cada pagamento no momento da criacao. Cada banco intermediario atualiza o status no SWIFT Tracker. O originador pode ver em tempo real: 'pagamento saiu do correspondente, aguardando credito no beneficiario'. Como um tracking number de encomenda." },
              { name: "SLA de velocidade", emoji: "⏱️", desc: "Bancos gpi se comprometem com SLA: 50% dos pagamentos creditados em 30 minutos, 40% em menos de 5 minutos, 100% no mesmo dia. Pre-gpi, pagamentos cross-border levavam 3-5 dias e ninguem sabia onde estava o dinheiro." },
              { name: "Pre-validation", emoji: "✅", desc: "Antes de enviar o pagamento, o banco originador pode validar se a conta do beneficiario existe e esta ativa. Reduz rejeicoes e returns. API: SWIFT Payment Pre-validation. Verifica BIC, account number, nome do beneficiario." },
              { name: "Fee Transparency", emoji: "💰", desc: "Cada banco intermediario deve declarar qual fee cobrou. O originador ve o breakdown completo: fee do banco correspondente A, fee do banco correspondente B, taxa de cambio aplicada. Fim das fees ocultas." },
            ].map((item) => (
              <div key={item.name} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "pix-iso20022",
      title: "Pix e ISO 20022",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            O Pix, sistema de pagamentos instantaneos do Brasil, foi construido sobre ISO 20022 desde o dia 1.
            O SPI (Sistema de Pagamentos Instantaneos) do BCB usa mensagens pacs (payments clearing and settlement)
            e o DICT (Diretorio de Identificadores de Contas Transacionais) para resolucao de chaves Pix.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Mensagem</th>
                  <th style={thStyle}>ISO 20022</th>
                  <th style={thStyle}>Uso no Pix</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Pagamento</td><td style={tdStyle}>pacs.008</td><td style={tdStyle}>Transferencia Pix (credito)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Devolucao</td><td style={tdStyle}>pacs.004</td><td style={tdStyle}>Devolucao de Pix (parcial ou total)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Status</td><td style={tdStyle}>pacs.002</td><td style={tdStyle}>Status report da transacao</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Consulta DICT</td><td style={tdStyle}>Baseado em 20022</td><td style={tdStyle}>Resolucao de chave Pix → dados da conta</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Liquidacao</td><td style={tdStyle}>pacs.009</td><td style={tdStyle}>Settlement interbancario via STR</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            O Pix e um caso de sucesso global de implementacao ISO 20022: mais de 150 milhoes de usuarios,
            4 bilhoes de transacoes/mes, settlement em menos de 10 segundos 24/7. A adocao do 20022 permitiu
            ao BCB construir funcionalidades avancadas como Pix Cobranca (com dados estruturados de pagamento),
            Pix Automatico (debito recorrente) e integracao facilitada com Open Finance.
          </p>
        </>
      ),
    },
    {
      id: "instant-payments-global",
      title: "Instant Payments Global",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            O Pix nao esta sozinho — sistemas de pagamento instantaneo baseados em ISO 20022 estao sendo
            lancados em todo o mundo. A convergencia para um padrao unico facilita futura interoperabilidade
            cross-border entre esses sistemas.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "FedNow (EUA)", emoji: "🇺🇸", desc: "Lancado em julho 2023 pelo Federal Reserve. Pagamentos instantaneos 24/7 em dolares. ISO 20022 nativo. Adocao gradual — competindo com RTP (The Clearing House). Ainda em fase inicial de adocao por bancos.", color: "#3b82f6" },
              { name: "SEPA Instant (Europa)", emoji: "🇪🇺", desc: "SCT Inst (SEPA Credit Transfer Instant): pagamentos em euros em ate 10 segundos, 24/7. Limite de 100.000 EUR. ISO 20022 via EBA STEP2. Regulamento europeu (2024) torna SEPA Instant obrigatorio para todos os bancos da UE.", color: "#22c55e" },
              { name: "UPI (India)", emoji: "🇮🇳", desc: "Unified Payments Interface: maior sistema de pagamentos instantaneos do mundo (12+ bilhoes de transacoes/mes). Operado pelo NPCI. Interface propria, mas movendo para ISO 20022 para interoperabilidade. QR code como interface principal.", color: "#f59e0b" },
              { name: "Faster Payments (UK)", emoji: "🇬🇧", desc: "Operando desde 2008 — pioneiro em instant payments. Ate 1 milhao GBP em segundos, 24/7. Migrando de formato ISO 8583 para ISO 20022 (New Payments Architecture). Operado pela Pay.UK.", color: "#ef4444" },
              { name: "PIX + Pix Internacional", emoji: "🇧🇷", desc: "BCB trabalhando em interoperabilidade cross-border do Pix. Acordos bilaterais com bancos centrais (Colombia, Chile). Nexus (BIS): plataforma que conecta sistemas instant payment de diferentes paises via ISO 20022.", color: "#8b5cf6" },
            ].map((item) => (
              <div key={item.name} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "implementacao",
      title: "Implementacao ISO 20022",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Implementar ISO 20022 e um projeto significativo que envolve mudancas em sistemas, processos e
            dados. Nao e so trocar o formato da mensagem — e repensar como dados financeiros sao capturados,
            armazenados e transmitidos.
          </p>
          <p style={subheadingStyle}>Checklist de Go-Live</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {[
              { step: "Schema & validation", desc: "Implementar parsing e validacao de XML schemas ISO 20022 (XSD). Validar campos obrigatorios, formatos de data, character sets (UTF-8, caracteres especiais)." },
              { step: "Data model expansion", desc: "Banco de dados precisa suportar campos que nao existiam em MT: endereco estruturado (5 linhas → campos separados), LEI, purpose codes, structured remittance." },
              { step: "Translation layer", desc: "Durante coexistencia, traduzir entre MT e MX. Cuidado com truncation (MT tem limites de caracteres que MX nao tem) e data loss." },
              { step: "Screening & compliance", desc: "Atualizar sistemas de screening de sancoes e AML para aproveitar dados ricos do 20022. Nome completo estruturado melhora matching significativamente." },
              { step: "Testing end-to-end", desc: "Testes com contrapartes: enviar e receber mensagens reais no ambiente de teste SWIFT. Validar todos os cenarios: happy path, rejeicao, return, cancellation." },
              { step: "Character encoding", desc: "ISO 20022 suporta UTF-8 com caracteres especiais. Garantir que todos os sistemas na cadeia suportam — um middleware que trunca acentos pode corromper nomes de beneficiarios." },
              { step: "Monitoring & alerting", desc: "Dashboards para: taxa de rejeicao de mensagens, validation errors, translation failures, STP rate. Alerta para anomalias." },
            ].map((item, i) => (
              <div key={item.step} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0, minWidth: "1.25rem" }}>{i + 1}.</span>
                <span style={{ color: "var(--foreground)" }}>
                  <strong>{item.step}:</strong>{" "}
                  <span style={{ color: "var(--text-secondary)" }}>{item.desc}</span>
                </span>
              </div>
            ))}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              API vs File-Based
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Implementacoes modernas usam APIs (REST/SOAP) para trocar mensagens ISO 20022 em tempo real.
              Implementacoes legadas usam file-based (SFTP de arquivos XML em batch). O Pix usa API. SWIFT
              oferece ambos via SWIFTNet (API via Alliance Lite2 ou file via FileAct). A tendencia e migrar
              tudo para API para suportar instant payments e real-time status.
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>ISO 20022 & SWIFT Messaging</h1>
        <p className="page-description">
          Guia completo sobre o padrao universal de mensageria financeira ISO 20022, a rede SWIFT,
          migracao MT→MX, Pix como caso de sucesso e instant payments globais.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>O que e ISO 20022 e por que esta substituindo todos os formatos legados</li>
          <li>Diferenca entre ISO 20022 (banking) e ISO 8583 (cards) e quando usar cada</li>
          <li>Como funciona a rede SWIFT: BIC codes, correspondent banking, SWIFTNet</li>
          <li>Migracao MT→MX: mapeamento de mensagens, coexistencia e desafios</li>
          <li>Anatomia de uma pacs.008 e campos-chave para pagamentos</li>
          <li>SWIFT gpi: rastreamento, SLA, pre-validation e fee transparency</li>
          <li>Pix como case de ISO 20022 e instant payments globais (FedNow, SEPA, UPI)</li>
        </ul>
      </div>

      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Sistemas Instant</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>70+</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Paises</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>11k+</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Instituicoes SWIFT</div></div>
      </div>

      {sections.map((section, idx) => (
        <div key={section.id} className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`} style={sectionStyle}>
          <h2 style={headingStyle}><span style={{ minWidth: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0, background: "var(--primary)", color: "#fff", padding: "0 0.25rem" }}>{section.icon}</span>{section.title}</h2>
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
            { name: "Cross-Border Payments", href: "/knowledge/cross-border" },
            { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing" },
            { name: "Event Architecture", href: "/knowledge/event-architecture" },
            { name: "Legacy & Migracao", href: "/knowledge/legacy-migration" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>{link.name}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
