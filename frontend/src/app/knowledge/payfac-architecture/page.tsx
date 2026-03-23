"use client";

import { useState } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

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
  background: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "1rem",
  fontSize: "0.8rem",
  fontFamily: "monospace",
  overflowX: "auto",
  whiteSpace: "pre",
  color: "var(--foreground)",
  lineHeight: 1.6,
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

// ---------------------------------------------------------------------------
// Section type
// ---------------------------------------------------------------------------

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PayFacArchitecturePage() {
  const quiz = getQuizForPage("/knowledge/payfac-architecture");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "o-que-e-payfac",
      title: "O que e um PayFac",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Um Payment Facilitator (PayFac) e uma entidade que se registra junto a uma bandeira de cartao
            (Visa, Mastercard) como Merchant of Record e, a partir dessa conta mestre, habilita sub-merchants
            a processar pagamentos sem que cada um precise de um relacionamento direto com um adquirente.
            O PayFac assume responsabilidade pelo onboarding, compliance, liquidacao e risco dos seus sub-merchants.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Modelo Tradicional (ISO)</th>
                  <th style={thStyle}>Modelo PayFac</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Registro na bandeira</td><td style={tdStyle}>Cada merchant tem MID proprio</td><td style={tdStyle}>PayFac tem MID mestre; sub-merchants usam sub-MIDs</td></tr>
                <tr><td style={tdStyle}>Onboarding</td><td style={tdStyle}>Dias a semanas (adquirente faz underwriting)</td><td style={tdStyle}>Minutos a horas (PayFac faz underwriting proprio)</td></tr>
                <tr><td style={tdStyle}>Liquidacao</td><td style={tdStyle}>Adquirente liquida direto ao merchant</td><td style={tdStyle}>Adquirente liquida ao PayFac, que repassa aos sub-merchants</td></tr>
                <tr><td style={tdStyle}>Risco de chargeback</td><td style={tdStyle}>Merchant e responsavel direto</td><td style={tdStyle}>PayFac e responsavel perante o adquirente</td></tr>
                <tr><td style={tdStyle}>Compliance PCI</td><td style={tdStyle}>Cada merchant precisa de certificacao</td><td style={tdStyle}>PayFac certifica; sub-merchants seguem requisitos simplificados</td></tr>
                <tr><td style={tdStyle}>Controle de preco</td><td style={tdStyle}>Merchant negocia com adquirente</td><td style={tdStyle}>PayFac define pricing para sub-merchants</td></tr>
                <tr><td style={tdStyle}>Investimento inicial</td><td style={tdStyle}>Baixo (ISO nao assume risco)</td><td style={tdStyle}>Alto (registro, tecnologia, reservas, compliance)</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Por que se tornar PayFac?
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Controle total da experiencia de pagamento, onboarding instantaneo de merchants, monetizacao
              do processamento (spread no interchange), dados transacionais proprietarios e maior retencao
              de clientes na plataforma.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "arquitetura-tecnica",
      title: "Arquitetura Tecnica",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            A arquitetura de um PayFac e composta por camadas que vao desde a integracao com bandeiras e
            adquirentes ate os sistemas internos de gestao de sub-merchants, risco e liquidacao.
          </p>
          <div style={codeBlockStyle}>{`
┌─────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA PAYFAC                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Sub-Merch │  │ Sub-Merch │  │ Sub-Merch │  │ Sub-Merch│       │
│  │    001    │  │    002    │  │    003    │  │    N     │       │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘       │
│        │             │             │             │               │
│  ┌─────▼─────────────▼─────────────▼─────────────▼─────┐       │
│  │              PAYMENT GATEWAY (API Layer)              │       │
│  │   Tokenization │ 3DS │ Retry Logic │ Idempotency     │       │
│  └──────────────────────┬──────────────────────────────┘       │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────┐       │
│  │              PAYFAC CORE ENGINE                       │       │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────┐   │       │
│  │  │ Onboarding │ │    Risk    │ │   Settlement   │   │       │
│  │  │  & KYC/KYB │ │   Engine   │ │    & Split     │   │       │
│  │  └────────────┘ └────────────┘ └────────────────┘   │       │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────┐   │       │
│  │  │  Pricing   │ │ Chargeback │ │   Reporting    │   │       │
│  │  │  Engine    │ │  Handler   │ │   & Analytics  │   │       │
│  │  └────────────┘ └────────────┘ └────────────────┘   │       │
│  └──────────────────────┬──────────────────────────────┘       │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────┐       │
│  │              MASTER MERCHANT ACCOUNT (MID)            │       │
│  └──────────────────────┬──────────────────────────────┘       │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────┐       │
│  │     ADQUIRENTE (Sponsor Bank / Processor)             │       │
│  └──────────────────────┬──────────────────────────────┘       │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────┐       │
│  │          BANDEIRAS (Visa / Mastercard / Elo)          │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
`}</div>
          <p style={subheadingStyle}>Componentes Criticos</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>Funcao</th>
                  <th style={thStyle}>Tecnologias Comuns</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Payment Gateway</td><td style={tdStyle}>Recebe transacoes via API, tokeniza dados, roteia ao processador</td><td style={tdStyle}>REST/gRPC APIs, HSM para criptografia, PCI DSS Level 1</td></tr>
                <tr><td style={tdStyle}>Onboarding Engine</td><td style={tdStyle}>KYC/KYB automatizado, verificacao documental, scoring de risco</td><td style={tdStyle}>OCR, APIs de bureau de credito, workflow engines</td></tr>
                <tr><td style={tdStyle}>Risk Engine</td><td style={tdStyle}>Monitoramento em tempo real, regras antifraude, velocity checks</td><td style={tdStyle}>Stream processing (Kafka/Flink), ML models, rules engine</td></tr>
                <tr><td style={tdStyle}>Settlement Engine</td><td style={tdStyle}>Split de transacoes, calculo de fees, agendamento de payouts</td><td style={tdStyle}>Double-entry ledger, event sourcing, reconciliacao automatica</td></tr>
                <tr><td style={tdStyle}>Chargeback Handler</td><td style={tdStyle}>Recepcao de disputas, coleta de evidencias, resposta a bandeiras</td><td style={tdStyle}>Integracoes com VROL/Ethoca, workflow de disputa</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "sub-merchant-onboarding",
      title: "Sub-Merchant Onboarding",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            O onboarding de sub-merchants e uma das responsabilidades mais criticas do PayFac. E necessario
            equilibrar velocidade de ativacao com rigor no combate a fraude e lavagem de dinheiro. A abordagem
            mais comum e a verificacao em camadas (tiered verification).
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tier</th>
                  <th style={thStyle}>Volume Mensal</th>
                  <th style={thStyle}>Verificacoes</th>
                  <th style={thStyle}>Tempo de Ativacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Tier 1 (Instant)</td><td style={tdStyle}>Ate R$ 50k</td><td style={tdStyle}>CPF/CNPJ validacao, listas restritivas (OFAC, PEP), email/telefone</td><td style={tdStyle}>Minutos</td></tr>
                <tr><td style={tdStyle}>Tier 2 (Standard)</td><td style={tdStyle}>R$ 50k - R$ 500k</td><td style={tdStyle}>Tier 1 + documentos societarios, comprovante de endereco, bureaus</td><td style={tdStyle}>1-3 dias</td></tr>
                <tr><td style={tdStyle}>Tier 3 (Enhanced)</td><td style={tdStyle}>Acima de R$ 500k</td><td style={tdStyle}>Tier 2 + visita presencial, demonstracoes financeiras, referencias</td><td style={tdStyle}>5-15 dias</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Pipeline de KYC/KYB</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.75rem", marginBottom: "0.75rem" }}>
            {[
              { step: "1", text: "Coleta de dados: nome, CNPJ/CPF, endereco, socios, faturamento esperado, MCC (Merchant Category Code)" },
              { step: "2", text: "Validacao automatica: consulta Receita Federal, Serasa/SPC, listas OFAC/PEP, validacao de e-mail e telefone" },
              { step: "3", text: "Risk scoring: modelo de risco avalia probabilidade de fraude, chargeback excessivo, lavagem" },
              { step: "4", text: "Decisao: aprovacao automatica, rejeicao ou encaminhamento para revisao manual" },
              { step: "5", text: "Ativacao: criacao do sub-MID, configuracao de pricing, limites transacionais e rolling reserve" },
              { step: "6", text: "Monitoramento continuo: revisao periodica, triggers automaticos para re-verificacao" },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, background: "var(--primary)", color: "#fff",
                }}>
                  {item.step}
                </span>
                <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Regra de ouro do onboarding PayFac
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O PayFac e responsavel por cada transacao que passa pela sua conta mestre. Se um sub-merchant
              gera chargebacks excessivos ou e envolvido em fraude, o PayFac responde perante o adquirente
              e as bandeiras. Por isso, o rigor no onboarding e existencial.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "split-settlement",
      title: "Split & Settlement Engine",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            O motor de split e liquidacao e o coracao financeiro do PayFac. Ele precisa calcular corretamente
            a divisao de cada transacao entre sub-merchant, PayFac (fees), adquirente e eventuais terceiros,
            alem de gerenciar holdbacks e rolling reserves.
          </p>
          <div style={codeBlockStyle}>{`Exemplo de Split de uma Transacao de R$ 100,00:

┌─────────────────────────────────────────────────────────┐
│  TRANSACAO ORIGINAL: R$ 100,00                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Interchange Fee (bandeira/emissor):  R$  1,50  (1.50%) │
│  Taxa do Adquirente:                 R$  0,30  (0.30%) │
│  Fee do PayFac (markup):             R$  1,70  (1.70%) │
│  Rolling Reserve (5%):               R$  5,00  (5.00%) │
│  ─────────────────────────────────────────────────       │
│  Liquido para Sub-Merchant:          R$ 91,50           │
│                                                         │
│  Rolling Reserve: retido por 180 dias, liberado em D+180│
│  Payout: D+2 via TED/PIX para conta do sub-merchant    │
└─────────────────────────────────────────────────────────┘`}</div>
          <p style={subheadingStyle}>Modelo de Dados do Ledger</p>
          <div style={codeBlockStyle}>{`{
  "transaction_id": "txn_abc123",
  "amount": 10000,
  "currency": "BRL",
  "splits": [
    {
      "recipient": "sub_merchant_001",
      "type": "merchant_payout",
      "amount": 9150,
      "scheduled_date": "2025-01-17",
      "status": "scheduled"
    },
    {
      "recipient": "payfac_revenue",
      "type": "payfac_fee",
      "amount": 170,
      "status": "settled"
    },
    {
      "recipient": "acquirer",
      "type": "acquirer_fee",
      "amount": 180,
      "status": "settled"
    },
    {
      "recipient": "rolling_reserve_pool",
      "type": "reserve",
      "amount": 500,
      "release_date": "2025-07-15",
      "status": "held"
    }
  ]
}`}</div>
          <p style={subheadingStyle}>Estrategias de Rolling Reserve</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Estrategia</th>
                  <th style={thStyle}>Como Funciona</th>
                  <th style={thStyle}>Quando Usar</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Rolling Reserve</td><td style={tdStyle}>X% retido por N dias, liberado em base continua</td><td style={tdStyle}>Sub-merchants de risco medio, e-commerce</td></tr>
                <tr><td style={tdStyle}>Up-front Reserve</td><td style={tdStyle}>Deposito fixo antes de comecar a processar</td><td style={tdStyle}>Sub-merchants de alto risco, viagens</td></tr>
                <tr><td style={tdStyle}>Capped Reserve</td><td style={tdStyle}>Rolling reserve ate atingir um teto maximo</td><td style={tdStyle}>Sub-merchants estabelecidos com historico</td></tr>
                <tr><td style={tdStyle}>Dynamic Reserve</td><td style={tdStyle}>% varia conforme risco em tempo real</td><td style={tdStyle}>Modelo sofisticado com ML de risco</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "risk-compliance",
      title: "Risk & Compliance Framework",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Como Merchant of Record, o PayFac assume responsabilidades significativas de compliance. O framework
            de risco deve cobrir desde PCI DSS ate AML/CFT, passando por monitoramento continuo de sub-merchants.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Dominio</th>
                  <th style={thStyle}>Obrigacao</th>
                  <th style={thStyle}>Consequencia do Nao-Cumprimento</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>PCI DSS Level 1</td><td style={tdStyle}>Auditoria anual, ASV scan trimestral, protecao de dados do cartao</td><td style={tdStyle}>Multas de USD 5k-100k/mes, perda do registro</td></tr>
                <tr><td style={tdStyle}>AML/KYC</td><td style={tdStyle}>Identificacao de clientes, monitoramento de transacoes suspeitas</td><td style={tdStyle}>Multas regulatorias, responsabilidade criminal</td></tr>
                <tr><td style={tdStyle}>Chargeback Monitoring</td><td style={tdStyle}>Manter ratio abaixo de 1% (Visa) / 1.5% (Mastercard)</td><td style={tdStyle}>Programas de monitoramento (VDMP/ECMP), multas escalonadas</td></tr>
                <tr><td style={tdStyle}>MATCH List</td><td style={tdStyle}>Nao onboardar merchants na lista MATCH/TMF</td><td style={tdStyle}>Multas de USD 25k+ por violacao</td></tr>
                <tr><td style={tdStyle}>Prohibited Merchants</td><td style={tdStyle}>Bloquear MCCs proibidos (gambling ilegal, drogas, etc.)</td><td style={tdStyle}>Descredenciamento, multas severas</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Monitoramento Continuo de Sub-Merchants</p>
          <div style={codeBlockStyle}>{`Triggers Automaticos de Revisao:

1. Chargeback ratio > 0.65%     → Alerta amarelo, revisao em 48h
2. Chargeback ratio > 0.90%     → Alerta vermelho, suspensao de payouts
3. Volume mensal > 200% do esperado → Revisao de atividade
4. Transacao unitaria > R$ 50k  → Revisao manual obrigatoria
5. Mudanca de MCC detectada     → Re-underwriting automatico
6. Alerta de bureau/watchlist   → Suspensao imediata + investigacao
7. Refund ratio > 15%           → Investigacao de fraude amigavel`}</div>
        </>
      ),
    },
    {
      id: "pricing-models",
      title: "Pricing Models",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            A definicao do modelo de pricing e estrategica para o PayFac. Ele precisa cobrir custos (interchange,
            scheme fees, processamento, risco) e gerar margem, enquanto permanece competitivo.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Vantagens</th>
                  <th style={thStyle}>Desvantagens</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Flat Rate</td><td style={tdStyle}>Taxa unica (ex: 2.99% + R$ 0,49)</td><td style={tdStyle}>Simples de entender, previsivel</td><td style={tdStyle}>Margem variavel, pode ser caro para altos volumes</td></tr>
                <tr><td style={tdStyle}>IC++ (Interchange Plus)</td><td style={tdStyle}>Interchange real + markup fixo</td><td style={tdStyle}>Transparente, justo para merchants grandes</td><td style={tdStyle}>Complexo de explicar, fatura variavel</td></tr>
                <tr><td style={tdStyle}>Tiered</td><td style={tdStyle}>Qualified / Mid-Qualified / Non-Qualified</td><td style={tdStyle}>Margem otimizada pelo PayFac</td><td style={tdStyle}>Opaco, gera desconfianca</td></tr>
                <tr><td style={tdStyle}>Blended</td><td style={tdStyle}>Taxa unica para debito + credito</td><td style={tdStyle}>Simplicidade maxima</td><td style={tdStyle}>Margem alta em debito, baixa em credito parcelado</td></tr>
                <tr><td style={tdStyle}>Subscription</td><td style={tdStyle}>Mensalidade fixa + taxa minima por txn</td><td style={tdStyle}>Receita recorrente previsivel</td><td style={tdStyle}>Barreira de entrada para pequenos merchants</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Unit Economics de um PayFac (exemplo simplificado)
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Taxa cobrada ao merchant: 3.49% | Interchange medio: 1.65% | Scheme fees: 0.15% |
              Custo de processamento: 0.10% | Reserva de risco: 0.15% | Margem bruta: 1.44%.
              Para um TPV de R$ 100M/mes, isso representa ~R$ 1.44M/mes de receita bruta.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "regulacao-brasil",
      title: "Regulacao no Brasil",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            No Brasil, o modelo de PayFac se enquadra na figura do Subcredenciador, regulado pelo Banco Central
            desde a Circular 3.885/2018. O subcredenciador e uma instituicao de pagamento que habilita outros
            participantes (sub-merchants) a aceitar pagamentos, sendo responsavel pela liquidacao e pelo risco.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Subcredenciador (BCB)</th>
                  <th style={thStyle}>PayFac (Bandeiras Internacionais)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Regulador</td><td style={tdStyle}>Banco Central do Brasil</td><td style={tdStyle}>Visa/Mastercard</td></tr>
                <tr><td style={tdStyle}>Base legal</td><td style={tdStyle}>Circular 3.885/2018 e alteracoes</td><td style={tdStyle}>Visa PFSP Program / MC PF Program</td></tr>
                <tr><td style={tdStyle}>Registro obrigatorio</td><td style={tdStyle}>Sim, como Instituicao de Pagamento</td><td style={tdStyle}>Sim, junto a bandeira via sponsor bank</td></tr>
                <tr><td style={tdStyle}>Capital minimo</td><td style={tdStyle}>Depende do volume (a partir de R$ 2M)</td><td style={tdStyle}>Definido pela bandeira</td></tr>
                <tr><td style={tdStyle}>Obrigacoes de reporte</td><td style={tdStyle}>SCR, COAF, BCB (mensalmente)</td><td style={tdStyle}>Reports trimestrais a bandeira</td></tr>
                <tr><td style={tdStyle}>Prazo de liquidacao</td><td style={tdStyle}>D+2 obrigatorio para sub-merchants</td><td style={tdStyle}>Definido em contrato</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Obrigacoes Regulatorias Chave</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.75rem", marginBottom: "0.75rem" }}>
            {[
              { step: "1", text: "Registro como Instituicao de Pagamento no BCB (modalidade Subcredenciador)" },
              { step: "2", text: "Aderencia a Circular 3.885: domicilio bancario, liquidacao centralizada, registro de recebiveis" },
              { step: "3", text: "Compliance com arranjos de pagamento (Visa, Mastercard, Elo) e suas regras especificas" },
              { step: "4", text: "Reporte ao COAF (transacoes suspeitas) e ao SCR (Sistema de Informacoes de Credito)" },
              { step: "5", text: "Aderencia a LGPD para dados de sub-merchants e seus clientes" },
              { step: "6", text: "Auditoria independente anual e certificacao PCI DSS" },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, background: "var(--primary)", color: "#fff",
                }}>
                  {item.step}
                </span>
                <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "build-vs-buy",
      title: "Build vs Buy Decision",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            A decisao de construir uma infraestrutura PayFac propria versus usar uma solucao BaaS (Banking as a Service)
            ou um PayFac-as-a-Service (como Stripe Connect, Adyen for Platforms) e uma das mais criticas para
            marketplaces e plataformas.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Criterio</th>
                  <th style={thStyle}>Build (PayFac Proprio)</th>
                  <th style={thStyle}>Buy (PayFac-as-a-Service)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Investimento inicial</td><td style={tdStyle}>R$ 5-15M+ (tecnologia, compliance, registro)</td><td style={tdStyle}>R$ 50-500k (integracao, customizacao)</td></tr>
                <tr><td style={tdStyle}>Time to market</td><td style={tdStyle}>12-24 meses</td><td style={tdStyle}>2-6 meses</td></tr>
                <tr><td style={tdStyle}>Controle</td><td style={tdStyle}>Total (pricing, UX, dados, roadmap)</td><td style={tdStyle}>Parcial (limitado a APIs do provider)</td></tr>
                <tr><td style={tdStyle}>Margem por transacao</td><td style={tdStyle}>Maior (voce define o spread completo)</td><td style={tdStyle}>Menor (provider cobra sua margem)</td></tr>
                <tr><td style={tdStyle}>Compliance</td><td style={tdStyle}>Responsabilidade propria (PCI, AML, BCB)</td><td style={tdStyle}>Compartilhada com o provider</td></tr>
                <tr><td style={tdStyle}>Equipe necessaria</td><td style={tdStyle}>20-50+ engenheiros, compliance, operacoes</td><td style={tdStyle}>3-10 engenheiros de integracao</td></tr>
                <tr><td style={tdStyle}>Break-even</td><td style={tdStyle}>TPV de R$ 500M-1B+/ano</td><td style={tdStyle}>Qualquer volume</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Framework de Decisao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se seu TPV e menor que R$ 200M/ano: use PayFac-as-a-Service.
              Entre R$ 200M-1B: considere um modelo hibrido (BaaS com customizacao).
              Acima de R$ 1B/ano: o investimento em PayFac proprio se justifica pela margem capturada.
              Excecao: se pagamentos sao core do seu produto (e nao meio), considere construir independente do volume.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "case-studies",
      title: "Case Studies",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Analisar como grandes plataformas implementaram (ou escolheram nao implementar) o modelo PayFac
            revela padroes importantes para a tomada de decisao.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Empresa</th>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Abordagem</th>
                  <th style={thStyle}>Licoes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>iFood</td><td style={tdStyle}>Subcredenciador proprio</td><td style={tdStyle}>Construiu infra de pagamentos, registro BCB como IP, onboarding de restaurantes</td><td style={tdStyle}>Volume altissimo justifica build; controle do fluxo financeiro e diferencial competitivo</td></tr>
                <tr><td style={tdStyle}>Shopify</td><td style={tdStyle}>PayFac (Shopify Payments)</td><td style={tdStyle}>Registro como PayFac via Stripe, depois internalizou processamento em mercados chave</td><td style={tdStyle}>Comecou como buy, migrou para build conforme volume cresceu</td></tr>
                <tr><td style={tdStyle}>Square</td><td style={tdStyle}>PayFac nativo</td><td style={tdStyle}>Construiu toda a stack desde o dia 1, incluindo hardware (maquininhas)</td><td style={tdStyle}>PayFac como DNA da empresa; onboarding em minutos como vantagem principal</td></tr>
                <tr><td style={tdStyle}>VTEX</td><td style={tdStyle}>Gateway + integracao com adquirentes</td><td style={tdStyle}>Nao e PayFac; conecta merchants a adquirentes tradicionais</td><td style={tdStyle}>Modelo valido quando a plataforma nao quer assumir risco financeiro</td></tr>
                <tr><td style={tdStyle}>Mercado Pago</td><td style={tdStyle}>Subcredenciador + IP completa</td><td style={tdStyle}>Ecossistema financeiro completo: pagamentos, credito, conta digital</td><td style={tdStyle}>PayFac como porta de entrada para servicos financeiros mais amplos</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Padrao observado
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              A maioria das plataformas bem-sucedidas segue o caminho: Buy (PayFac-as-a-Service) para validar
              o modelo, depois Build (PayFac proprio) quando o volume e a importancia estrategica justificam.
              O Shopify e o exemplo classico dessa transicao.
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Arquitetura PayFac
        </h1>
        <p className="page-description">
          Guia avancado sobre como construir e operar um Payment Facilitator: arquitetura tecnica,
          onboarding, split de liquidacao, compliance e modelos de negocio.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Diferencas fundamentais entre PayFac, ISO e adquirente tradicional</li>
          <li>Arquitetura tecnica completa de um PayFac: gateway, onboarding, risco, liquidacao</li>
          <li>Como funciona o split de transacoes, rolling reserves e payout scheduling</li>
          <li>Framework regulatorio brasileiro (Subcredenciador) e internacional</li>
          <li>Criterios para decidir entre Build vs Buy na infraestrutura de pagamentos</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Modelos de Pricing</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Case Studies</div>
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
