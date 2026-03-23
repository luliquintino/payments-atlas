"use client";

import { useState } from "react";
import Link from "next/link";
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

const pillarCardStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--background)",
  marginBottom: "0.75rem",
};

const metricCardStyle: React.CSSProperties = {
  padding: "1rem",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--background)",
  textAlign: "center" as const,
};

const tagStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "0.2rem 0.5rem",
  borderRadius: 6,
  fontSize: "0.7rem",
  fontWeight: 600,
  background: "var(--primary-bg)",
  color: "var(--primary)",
  marginRight: "0.375rem",
  marginBottom: "0.25rem",
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

export default function EmbeddedFinancePage() {
  const quiz = getQuizForPage("/knowledge/embedded-finance");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    /* ------------------------------------------------------------------ */
    /* 1. O que e Embedded Finance                                        */
    /* ------------------------------------------------------------------ */
    {
      id: "o-que-e",
      title: "O que e Embedded Finance",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Embedded Finance e a integracao de servicos financeiros — pagamentos, credito, seguros,
            investimentos e contas bancarias — diretamente dentro de plataformas nao-financeiras.
            Em vez do usuario sair do app para ir ao banco, o banco vem ate o app. O objetivo e tornar
            o servico financeiro invisivel, contextual e sem friccao.
          </p>
          <p style={paragraphStyle}>
            A evolucao do mercado segue uma trajetoria clara: Banking tradicional (agencias, burocracia) →
            Fintechs (apps financeiros nativos digitais) → Embedded Finance (financas dentro de qualquer plataforma) →
            Finance-as-a-Feature (servicos financeiros como commodity via API). Estima-se que o mercado global
            de embedded finance alcance US$ 7,2 trilhoes ate 2030 (projecao Bain & Company).
          </p>

          <p style={subheadingStyle}>Embedded Finance vs Open Banking vs BaaS</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Conceito</th>
                  <th style={thStyle}>Definicao</th>
                  <th style={thStyle}>Quem usa</th>
                  <th style={thStyle}>Exemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Embedded Finance</td>
                  <td style={tdStyle}>Servicos financeiros integrados em plataformas nao-financeiras</td>
                  <td style={tdStyle}>Marketplaces, SaaS, apps de delivery</td>
                  <td style={tdStyle}>Uber oferecendo conta digital para motoristas</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Open Banking / Open Finance</td>
                  <td style={tdStyle}>Compartilhamento de dados financeiros entre instituicoes via APIs padronizadas</td>
                  <td style={tdStyle}>Bancos, fintechs, agregadores</td>
                  <td style={tdStyle}>App que consolida saldo de varios bancos</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>BaaS (Banking-as-a-Service)</td>
                  <td style={tdStyle}>Infraestrutura bancaria oferecida via API para que outros construam produtos</td>
                  <td style={tdStyle}>Fintechs, plataformas, neobanks</td>
                  <td style={tdStyle}>Dock fornecendo conta digital white-label</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Relacao entre os conceitos
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Open Banking e a regulacao que habilita o compartilhamento de dados. BaaS e a infraestrutura tecnica
              que permite construir produtos financeiros. Embedded Finance e a estrategia de negocio que usa ambos
              para entregar servicos financeiros dentro de plataformas. BaaS e o &ldquo;como&rdquo;; Embedded Finance e o &ldquo;por que&rdquo;.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 2. Os 5 Pilares do Embedded Finance                                */
    /* ------------------------------------------------------------------ */
    {
      id: "cinco-pilares",
      title: "Os 5 Pilares do Embedded Finance",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Embedded Finance nao se limita a pagamentos. Existem cinco grandes pilares, cada um com modelos de negocio,
            regulacao e complexidade tecnica proprios.
          </p>

          {/* Pilar 1: Payments */}
          <div style={pillarCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>💳</span>
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>1. Embedded Payments</span>
              <span style={tagStyle}>Mais maduro</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
              Pagamentos invisiveis dentro da experiencia do usuario. O cliente nao percebe que esta usando um
              servico financeiro — ele simplesmente completa a acao. Exemplos classicos: Uber (corrida termina,
              pagamento automatico), iFood (pedido fechado, cobranca instantanea), Amazon 1-Click.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              <span style={tagStyle}>Tokenizacao</span>
              <span style={tagStyle}>One-click checkout</span>
              <span style={tagStyle}>Pay-by-account</span>
              <span style={tagStyle}>Split payments</span>
              <span style={tagStyle}>Checkout invisivel</span>
            </div>
          </div>

          {/* Pilar 2: Lending */}
          <div style={pillarCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>🏦</span>
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>2. Embedded Lending</span>
              <span style={tagStyle}>Maior receita</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
              Credito oferecido no ponto de decisao — no checkout, dentro da plataforma, no momento exato em que
              o usuario precisa. O poder esta no contexto: a plataforma conhece o historico do usuario e pode fazer
              underwriting muito mais preciso que um banco tradicional.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginTop: "0.5rem" }}>
              {[
                { label: "BNPL (Buy Now Pay Later)", desc: "Parcelamento sem cartao no checkout. Klarna, Affirm, Koin no Brasil." },
                { label: "Credit-as-a-Service", desc: "Oferta de credito via API usando dados da plataforma para scoring." },
                { label: "Antecipacao de recebiveis", desc: "Sellers recebem vendas futuras antecipadas (D+0 em vez de D+30)." },
                { label: "Working capital loans", desc: "Emprestimos para capital de giro de PMEs baseado no historico de vendas." },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "0.5rem", fontSize: "0.825rem" }}>
                  <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0 }}>-</span>
                  <span style={{ color: "var(--foreground)" }}><strong>{item.label}:</strong>{" "}<span style={{ color: "var(--text-secondary)" }}>{item.desc}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Pilar 3: Insurance */}
          <div style={pillarCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>🛡️</span>
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>3. Embedded Insurance</span>
              <span style={tagStyle}>Alto attach rate</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
              Seguros contextuais oferecidos no momento da compra ou contratacao. Garantia estendida no checkout de
              eletronicos, seguro de envio no marketplace, protecao de compra. O modelo parametrico (paga automaticamente
              quando o evento ocorre) elimina burocracia de sinistro.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              <span style={tagStyle}>Garantia estendida</span>
              <span style={tagStyle}>Seguro de envio</span>
              <span style={tagStyle}>Protecao de compra</span>
              <span style={tagStyle}>Parametric insurance</span>
            </div>
          </div>

          {/* Pilar 4: Banking */}
          <div style={pillarCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>🏧</span>
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>4. Embedded Banking</span>
              <span style={tagStyle}>Maior retenção</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
              Contas digitais e cartoes white-label dentro da plataforma. O seller do marketplace recebe numa conta
              propria da plataforma, usa um cartao da marca, gerencia seu fluxo de caixa sem sair do ecossistema.
              BaaS (Banking-as-a-Service) e a infraestrutura que viabiliza isso.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginTop: "0.5rem" }}>
              {[
                { label: "Conta digital white-label", desc: "Conta bancaria com a marca da plataforma, operada por BaaS provider." },
                { label: "Cartoes co-branded e private label", desc: "Cartoes fisicos/virtuais da plataforma (Rappi Card, iFood Card)." },
                { label: "Cash management para sellers", desc: "Gestao de saldo, transferencias, extratos dentro da plataforma." },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "0.5rem", fontSize: "0.825rem" }}>
                  <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0 }}>-</span>
                  <span style={{ color: "var(--foreground)" }}><strong>{item.label}:</strong>{" "}<span style={{ color: "var(--text-secondary)" }}>{item.desc}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Pilar 5: Investments */}
          <div style={pillarCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>📈</span>
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>5. Embedded Investments</span>
              <span style={tagStyle}>Emergente</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
              Investimentos integrados em apps nao-financeiros. Cashback investido automaticamente, arredondamento
              do troco para investir em acoes/cripto, treasury-as-a-service para empresas aplicarem seu saldo ocioso.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              <span style={tagStyle}>Cashback invest</span>
              <span style={tagStyle}>Micro-investimentos</span>
              <span style={tagStyle}>Treasury-as-a-Service</span>
              <span style={tagStyle}>Round-up investing</span>
            </div>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 3. Modelos de Negocio                                              */
    /* ------------------------------------------------------------------ */
    {
      id: "modelos-negocio",
      title: "Modelos de Negocio",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Existem quatro modelos principais para uma plataforma oferecer servicos financeiros embarcados.
            A escolha depende do apetite de risco, investimento, regulacao e controle desejado.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Como funciona</th>
                  <th style={thStyle}>Revenue</th>
                  <th style={thStyle}>Exemplos</th>
                  <th style={thStyle}>Complexidade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Referral</td>
                  <td style={tdStyle}>Encaminha o usuario para um parceiro financeiro. A plataforma nao assume risco nem opera o produto.</td>
                  <td style={tdStyle}>Fee por lead qualificado ou CPA (R$ 10-50 por conversao)</td>
                  <td style={tdStyle}>Marketplace encaminha seller para banco parceiro</td>
                  <td style={tdStyle}><span style={{ ...tagStyle, background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>Baixa</span></td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>White-label</td>
                  <td style={tdStyle}>Usa produto financeiro pronto de um BaaS/fintech com a marca propria da plataforma.</td>
                  <td style={tdStyle}>Revenue share (20-50% da receita financeira)</td>
                  <td style={tdStyle}>Rappi Pay, iFood Pago, 99Pay</td>
                  <td style={tdStyle}><span style={{ ...tagStyle, background: "rgba(234,179,8,0.1)", color: "#ca8a04" }}>Media</span></td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Licensed</td>
                  <td style={tdStyle}>Plataforma obtem licenca regulatoria propria (SCD, IP) e opera o produto financeiro diretamente.</td>
                  <td style={tdStyle}>Spread completo + fees de servico</td>
                  <td style={tdStyle}>Nubank, PicPay, Mercado Pago</td>
                  <td style={tdStyle}><span style={{ ...tagStyle, background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>Alta</span></td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Full-stack</td>
                  <td style={tdStyle}>Constroi toda a infraestrutura financeira, incluindo core banking, ledger, compliance.</td>
                  <td style={tdStyle}>Margem total da operacao financeira</td>
                  <td style={tdStyle}>Stripe Treasury, Marqeta</td>
                  <td style={tdStyle}><span style={{ ...tagStyle, background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>Muito Alta</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Evolucao natural
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              A maioria das plataformas comeca com Referral ou White-label para validar a demanda, e depois evolui
              para Licensed conforme o volume justifica o investimento regulatorio. Poucas chegam a Full-stack —
              somente quando servicos financeiros se tornam o core business.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 4. Regulacao Brasileira                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "regulacao-brasileira",
      title: "Regulacao Brasileira",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            O Brasil tem um framework regulatorio robusto e em rapida evolucao para embedded finance. O Banco Central
            e o principal regulador, com a CVM atuando em investimentos e a SUSEP em seguros.
          </p>

          <p style={subheadingStyle}>Tipos de Licenca</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Licenca</th>
                  <th style={thStyle}>O que e</th>
                  <th style={thStyle}>Capital Minimo</th>
                  <th style={thStyle}>Quem usa</th>
                  <th style={thStyle}>Operacoes permitidas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>SCD (Sociedade de Credito Direto)</td>
                  <td style={tdStyle}>Instituicao financeira que empresta com recursos proprios, exclusivamente por plataforma eletronica</td>
                  <td style={tdStyle}>R$ 1M</td>
                  <td style={tdStyle}>Fintechs de credito (Creditas, Rebel)</td>
                  <td style={tdStyle}>Emprestimos, financiamentos, analise de credito, cobranca, emissao de moeda eletronica</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>SEP (Sociedade de Emprestimo entre Pessoas)</td>
                  <td style={tdStyle}>Plataforma de P2P lending que conecta investidores a tomadores</td>
                  <td style={tdStyle}>R$ 1M</td>
                  <td style={tdStyle}>Plataformas P2P (Nexoos, IOUU)</td>
                  <td style={tdStyle}>Intermediacao de emprestimos P2P, analise de credito, cobranca</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>IP - Emissor</td>
                  <td style={tdStyle}>Instituicao de pagamento que gerencia contas de pagamento e emite instrumentos (cartoes pre-pagos)</td>
                  <td style={tdStyle}>Varia por volume</td>
                  <td style={tdStyle}>Neobanks, wallets (PicPay, PagSeguro)</td>
                  <td style={tdStyle}>Conta de pagamento, cartao pre-pago, Pix, transferencias</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>IP - Credenciador</td>
                  <td style={tdStyle}>Habilita merchants a aceitar pagamentos (adquirente)</td>
                  <td style={tdStyle}>Varia por volume</td>
                  <td style={tdStyle}>Cielo, Rede, Stone</td>
                  <td style={tdStyle}>Credenciamento, captura, liquidacao de transacoes</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>IP - Iniciador (ITP)</td>
                  <td style={tdStyle}>Inicia transacoes de pagamento a pedido do usuario (Open Finance)</td>
                  <td style={tdStyle}>Menor</td>
                  <td style={tdStyle}>Iniciadores de pagamento Pix</td>
                  <td style={tdStyle}>Iniciacao de Pix, transferencias via Open Finance</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Sandbox Regulatorio do BCB</p>
          <p style={paragraphStyle}>
            O Banco Central opera um sandbox regulatorio que permite testar inovacoes financeiras em ambiente
            controlado. Participantes recebem autorizacao temporaria para operar modelos que nao se encaixam
            perfeitamente na regulacao vigente. Ja foram realizados 3 ciclos com dezenas de participantes,
            testando modelos como credito com garantia em cripto, seguros parametricos e tokenizacao.
          </p>

          <p style={subheadingStyle}>Open Finance Brasil</p>
          <p style={paragraphStyle}>
            O Open Finance Brasil e um dos mais ambiciosos do mundo em escopo. Vai alem do Open Banking
            (dados bancarios) e inclui seguros, investimentos, cambio e previdencia. Impacto direto em
            embedded finance: permite que plataformas acessem dados financeiros do usuario (com consentimento)
            para oferecer produtos melhores — scoring mais preciso, ofertas personalizadas, portabilidade.
          </p>

          <p style={subheadingStyle}>Registro de Recebiveis</p>
          <p style={paragraphStyle}>
            O sistema de registro de recebiveis (CERC, CIP, TAG/B3) e fundamental para embedded lending.
            Permite que sellers usem seus recebiveis de cartao como garantia para credito, com interoperabilidade
            entre registradoras. Isso viabiliza antecipacao de recebiveis com custo menor e maior transparencia.
          </p>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 5. Arquitetura Tecnica                                             */
    /* ------------------------------------------------------------------ */
    {
      id: "arquitetura-tecnica",
      title: "Arquitetura Tecnica",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            A arquitetura de uma plataforma com embedded finance tem tres camadas principais: a plataforma
            (experiencia do usuario), uma camada de orquestracao (APIs, compliance, ledger) e os providers
            (BaaS, PSPs, insurtechs).
          </p>
          <div style={codeBlockStyle}>
{`┌──────────────────────────────────────────────────┐
│           PLATAFORMA (ex: marketplace)            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ Pagto  │ │ Credit │ │ Seguro │ │ Conta  │    │
│  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘    │
└──────┼──────────┼──────────┼──────────┼──────────┘
       │          │          │          │
┌──────┼──────────┼──────────┼──────────┼──────────┐
│      ▼          ▼          ▼          ▼           │
│   ORCHESTRATION LAYER (APIs + Webhooks)           │
│  ┌────────────────────────────────────────────┐   │
│  │  KYC  │  Ledger  │  Compliance  │ Routing  │   │
│  └────────────────────────────────────────────┘   │
└──────┬──────────┬──────────┬──────────┬──────────┘
       │          │          │          │
┌──────┼──────────┼──────────┼──────────┼──────────┐
│      ▼          ▼          ▼          ▼           │
│   PROVIDERS (BaaS, PSPs, Insurtech, etc.)        │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ Stripe │ │  Dock  │ │ Chubb  │ │Celcoin │    │
│  └────────┘ └────────┘ └────────┘ └────────┘    │
└──────────────────────────────────────────────────┘`}
          </div>

          <p style={subheadingStyle}>Requisitos tecnicos por camada</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>Funcao</th>
                  <th style={thStyle}>Requisitos</th>
                  <th style={thStyle}>Tecnologias comuns</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>APIs</td>
                  <td style={tdStyle}>Interface de comunicacao entre plataforma e providers</td>
                  <td style={tdStyle}>REST, idempotency keys, retry com backoff, webhooks com verificacao de assinatura, rate limiting</td>
                  <td style={tdStyle}>REST + JSON, gRPC para servicos internos, webhooks com HMAC</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>KYC/AML</td>
                  <td style={tdStyle}>Verificacao de identidade e prevencao a lavagem de dinheiro</td>
                  <td style={tdStyle}>Verificacao de documentos (OCR + biometria), screening de sancoes, verificacao PEP, monitoramento continuo</td>
                  <td style={tdStyle}>Idwall, BigDataCorp, Bureau de credito, OFAC/EU screening</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Ledger</td>
                  <td style={tdStyle}>Registro contabil de todas as movimentacoes financeiras</td>
                  <td style={tdStyle}>Double-entry bookkeeping, imutabilidade, reconciliacao automatica, audit trail completo</td>
                  <td style={tdStyle}>PostgreSQL, event sourcing, CQRS, ledger databases especializados</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Compliance</td>
                  <td style={tdStyle}>Garantir aderencia regulatoria em todas as operacoes</td>
                  <td style={tdStyle}>Reporting automatizado (BCB, COAF), audit trail, data residency (LGPD), controles de limites</td>
                  <td style={tdStyle}>Rules engine, SIEM, log aggregation, data warehouse</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Routing</td>
                  <td style={tdStyle}>Direcionamento inteligente para o melhor provider</td>
                  <td style={tdStyle}>Fallback automatico, load balancing, custo-beneficio por provider, circuit breaker</td>
                  <td style={tdStyle}>Service mesh, feature flags, A/B testing de providers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 6. BaaS no Brasil                                                  */
    /* ------------------------------------------------------------------ */
    {
      id: "baas-brasil",
      title: "BaaS — Banking-as-a-Service no Brasil",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            O mercado brasileiro de BaaS e um dos mais desenvolvidos da America Latina. Diversos providers
            oferecem infraestrutura bancaria via API para que plataformas construam produtos financeiros sem
            precisar de licenca propria.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Provider</th>
                  <th style={thStyle}>Especialidade</th>
                  <th style={thStyle}>Produtos via API</th>
                  <th style={thStyle}>Diferencial</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Dock</td>
                  <td style={tdStyle}>Full-stack BaaS</td>
                  <td style={tdStyle}>Conta digital, cartoes (credito/debito/pre-pago), Pix, credito, KYC</td>
                  <td style={tdStyle}>Maior BaaS da LatAm. Processa 40%+ dos cartoes pre-pagos do Brasil</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Celcoin</td>
                  <td style={tdStyle}>Banking + pagamentos</td>
                  <td style={tdStyle}>Pix, TED, boleto, conta digital, credito, cambio, recarga</td>
                  <td style={tdStyle}>API design moderno. Forte em Pix e bill payments</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Zoop</td>
                  <td style={tdStyle}>Pagamentos para marketplaces</td>
                  <td style={tdStyle}>Split payments, Pix, boleto, cartao, conta digital</td>
                  <td style={tdStyle}>Focado em marketplaces. Split nativo com agenda de recebiveis</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Matera</td>
                  <td style={tdStyle}>Core banking + instant payments</td>
                  <td style={tdStyle}>Core banking, Pix (direto e indireto), boleto, contas</td>
                  <td style={tdStyle}>Forte em Pix. Participante direto do SPI. Foco em cooperativas e bancos</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Fitbank</td>
                  <td style={tdStyle}>Banking API</td>
                  <td style={tdStyle}>Pix, TED, boleto, cartoes, contas digitais, KYC</td>
                  <td style={tdStyle}>API first. Rapida integracao. Bom para fintechs early-stage</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Swap Financial</td>
                  <td style={tdStyle}>Cartoes e beneficios</td>
                  <td style={tdStyle}>Programas de cartao, beneficios flexiveis, conta digital</td>
                  <td style={tdStyle}>Especialista em card issuing e programas de beneficio</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Como escolher um BaaS provider</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.75rem" }}>
            {[
              { criteria: "Latencia e uptime SLA", desc: "APIs financeiras precisam de 99.95%+ uptime. Latencia < 300ms para operacoes sincronas." },
              { criteria: "Cobertura regulatoria", desc: "O provider tem as licencas necessarias (IP emissor, credenciador)? Esta registrado no BCB?" },
              { criteria: "API design", desc: "Documentacao clara, SDKs, sandbox de teste, webhooks confiaveis, idempotency." },
              { criteria: "Modelo de pricing", desc: "Fee por transacao, mensalidade, revenue share? Custos de setup e minimums?" },
              { criteria: "Suporte e SLA de resposta", desc: "Tempo de resposta para incidentes criticos. Suporte tecnico dedicado." },
              { criteria: "Roadmap de produto", desc: "O provider esta investindo em novos produtos (Open Finance, Pix parcelado, DREX)?" },
            ].map((item) => (
              <div key={item.criteria} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  background: "var(--primary)", marginTop: "0.4rem",
                }} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--foreground)" }}>{item.criteria}: </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 7. Metricas de Embedded Finance                                    */
    /* ------------------------------------------------------------------ */
    {
      id: "metricas",
      title: "Metricas de Embedded Finance",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Medir o sucesso de embedded finance exige metricas especificas que vao alem de GMV e receita.
            Estas sao as metricas que diferenciam plataformas de sucesso.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>O que mede</th>
                  <th style={thStyle}>Bom</th>
                  <th style={thStyle}>Otimo</th>
                  <th style={thStyle}>Excelente</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Attach Rate</td>
                  <td style={tdStyle}>% de transacoes/usuarios que usam o produto financeiro embutido</td>
                  <td style={tdStyle}>10-15%</td>
                  <td style={tdStyle}>15-25%</td>
                  <td style={tdStyle}>25%+</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>ARPU Lift</td>
                  <td style={tdStyle}>Incremento na receita por usuario com financial products</td>
                  <td style={tdStyle}>1.5-2x</td>
                  <td style={tdStyle}>2-3x</td>
                  <td style={tdStyle}>3-5x</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Take Rate</td>
                  <td style={tdStyle}>% do GMV capturado como receita de servicos financeiros</td>
                  <td style={tdStyle}>0.5-1%</td>
                  <td style={tdStyle}>1-2%</td>
                  <td style={tdStyle}>2-4%</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Conversion Uplift</td>
                  <td style={tdStyle}>Melhoria na conversao do checkout com financiamento embutido</td>
                  <td style={tdStyle}>10-15%</td>
                  <td style={tdStyle}>15-25%</td>
                  <td style={tdStyle}>25-35%</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Credit Default Rate</td>
                  <td style={tdStyle}>Taxa de inadimplencia do credito embarcado (quanto menor, melhor)</td>
                  <td style={tdStyle}>5-8%</td>
                  <td style={tdStyle}>3-5%</td>
                  <td style={tdStyle}>&lt; 3%</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>NPS Impact</td>
                  <td style={tdStyle}>Variacao no NPS apos introducao de features financeiras</td>
                  <td style={tdStyle}>+5 pts</td>
                  <td style={tdStyle}>+10 pts</td>
                  <td style={tdStyle}>+15+ pts</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Metrica mais importante: Financial Revenue % of Total
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              A metrica que investidores mais observam e a participacao da receita financeira no total da plataforma.
              Shopify: ~75% da receita vem de Merchant Solutions (incluindo Shopify Payments, Capital, Balance).
              Mercado Livre: Mercado Pago representa ~45% da receita total. iFood: servicos financeiros ja sao
              o segundo pilar de receita apos delivery fees.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 8. Casos de Uso Reais (Brasil)                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "casos-reais",
      title: "Casos de Uso Reais (Brasil)",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Os melhores exemplos de embedded finance no Brasil vem de plataformas que transformaram servicos
            financeiros em pilar estrategico de receita e retencao.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              {
                name: "iFood",
                emoji: "🍔",
                products: "Conta digital para restaurantes, antecipacao D+0, cartao de credito iFood Card, maquininha propria",
                strategy: "Embedded finance como ferramenta de retencao de restaurantes. Antecipacao D+0 resolveu o problema #1 de cash flow de restaurantes pequenos. Receita financeira cresce mais rapido que delivery.",
              },
              {
                name: "Mercado Livre / Mercado Pago",
                emoji: "🛒",
                products: "Conta digital, cartao (debito/credito), credito para sellers e compradores, seguros, investimentos (fundo rendimento)",
                strategy: "De marketplace a ecossistema financeiro completo. Mercado Pago processa pagamentos dentro e fora do Mercado Livre. Credito para sellers baseado em historico de vendas com inadimplencia inferior a bancos tradicionais.",
              },
              {
                name: "VTEX",
                emoji: "🛍️",
                products: "Payment orchestration, split de pagamentos, antecipacao de recebiveis via parceiros",
                strategy: "Nao opera servicos financeiros diretamente, mas orquestra pagamentos para milhares de lojas. Modelo de payment orchestration que conecta merchants aos melhores acquirers.",
              },
              {
                name: "Shopify (referencia global)",
                emoji: "🏪",
                products: "Shopify Payments (adquirencia), Balance (conta), Capital (credito para merchants), Shopify Installments (BNPL)",
                strategy: "Caso classico de evolucao: comecou com gateway, virou PayFac, depois adicionou banking e credito. 75% da receita hoje vem de Merchant Solutions.",
              },
              {
                name: "Uber",
                emoji: "🚗",
                products: "Conta digital para motoristas, cartao de debito, antecipacao automatica de ganhos",
                strategy: "Embedded banking como ferramenta de retencao de motoristas. Pagamento instantaneo ao fim da corrida aumentou retencao significativamente.",
              },
              {
                name: "Rappi",
                emoji: "📦",
                products: "RappiPay, RappiCard (cartao de credito), credito no app, conta digital",
                strategy: "Super-app strategy: delivery como porta de entrada, financas como motor de receita recorrente e engagement.",
              },
            ].map((caso) => (
              <div key={caso.name} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{caso.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{caso.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>
                  <strong style={{ color: "var(--foreground)" }}>Produtos:</strong> {caso.products}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--foreground)" }}>Estrategia:</strong> {caso.strategy}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 9. Riscos e Desafios                                               */
    /* ------------------------------------------------------------------ */
    {
      id: "riscos-desafios",
      title: "Riscos e Desafios",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Embedded finance traz oportunidades enormes, mas tambem riscos significativos que precisam ser
            gerenciados desde o primeiro dia. Falhas em servicos financeiros podem destruir a reputacao da
            plataforma principal.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              {
                risk: "Regulatorio",
                icon: "⚖️",
                desc: "Complexidade de compliance (KYC, AML, reporting ao BCB/COAF). Regulacao em rapida evolucao. Risco de operar sem licenca adequada — multas e intervencao do regulador.",
                mitigation: "Contratar compliance officer desde o dia 1. Mapear todas as licencas necessarias antes de lancar. Manter dialogo ativo com regulador.",
              },
              {
                risk: "Operacional",
                icon: "⚙️",
                desc: "Gestao de multiplos parceiros/providers. Falhas em cascata quando um provider cai. Complexidade de reconciliacao entre sistemas.",
                mitigation: "Arquitetura multi-provider com fallback automatico. SLAs contratuais rigidos. Reconciliacao automatizada com alertas.",
              },
              {
                risk: "Credito",
                icon: "💰",
                desc: "Inadimplencia acima do esperado. Provisioning insuficiente. Capital requirements que limitam crescimento.",
                mitigation: "Modelos de scoring usando dados contextuais da plataforma. Limites conservadores no inicio. Stress testing regular.",
              },
              {
                risk: "Reputacional",
                icon: "🏷️",
                desc: "Falhas financeiras (contas bloqueadas, cobranças indevidas, dados vazados) afetam diretamente a marca principal da plataforma.",
                mitigation: "SLA de atendimento financeiro superior ao padrao. Processos claros de resolucao de disputas. Comunicacao transparente.",
              },
              {
                risk: "Tecnologico",
                icon: "🔧",
                desc: "Integracao complexa com multiplas APIs. Latencia inaceitavel em operacoes financeiras. Downtime afeta transacoes reais.",
                mitigation: "Circuit breakers, retry patterns, idempotency. Monitoramento 24/7 de APIs financeiras. Degradacao graciosa.",
              },
              {
                risk: "Concentracao",
                icon: "🔗",
                desc: "Dependencia excessiva de um unico BaaS provider. Se o provider falhar ou mudar termos, toda a operacao financeira para.",
                mitigation: "Estrategia multi-provider desde o inicio (ou camada de abstracao). Contratos de longo prazo com clausulas de protecao.",
              },
            ].map((item) => (
              <div key={item.risk} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>Risco {item.risk}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>
                  <strong style={{ color: "var(--foreground)" }}>Descricao:</strong> {item.desc}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--primary)" }}>Mitigacao:</strong> {item.mitigation}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 10. Roadmap para Implementar                                       */
    /* ------------------------------------------------------------------ */
    {
      id: "roadmap",
      title: "Roadmap para Implementar Embedded Finance",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            Implementar embedded finance e uma jornada de 12-18 meses quando feita de forma incremental.
            Cada fase gera receita e aprendizado que financia a proxima. Nao tente fazer tudo ao mesmo tempo.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
            {[
              {
                phase: "Fase 1",
                period: "0-3 meses",
                title: "Embedded Payments",
                color: "#22c55e",
                items: [
                  "Integrar PSP (Stripe, Adyen, Zoop) com split de pagamento",
                  "Checkout otimizado: tokenizacao, one-click, Pix",
                  "Split automatico para sellers/parceiros",
                  "Webhooks para status de pagamento em real-time",
                  "Dashboard financeiro basico para sellers",
                ],
                kpi: "Take rate de 1-2% sobre GMV. Conversao +15%.",
              },
              {
                phase: "Fase 2",
                period: "3-6 meses",
                title: "Conta Digital (BaaS)",
                color: "#3b82f6",
                items: [
                  "Integrar BaaS provider (Dock, Celcoin, Fitbank)",
                  "Conta digital white-label para sellers",
                  "Pix (envio e recebimento), boleto, TED",
                  "Cartao pre-pago virtual (opcional fisico)",
                  "KYC automatizado (documentos + biometria)",
                ],
                kpi: "60%+ dos sellers com conta ativa. Float revenue do saldo em conta.",
              },
              {
                phase: "Fase 3",
                period: "6-12 meses",
                title: "Credito Embarcado",
                color: "#f59e0b",
                items: [
                  "Antecipacao de recebiveis (D+0 / D+1)",
                  "Working capital loans para sellers",
                  "BNPL para compradores no checkout",
                  "Scoring proprietario usando dados da plataforma",
                  "Registro de recebiveis (CERC/CIP)",
                ],
                kpi: "Attach rate de 20%+ em antecipacao. Default < 5%. Receita de spread.",
              },
              {
                phase: "Fase 4",
                period: "12-18 meses",
                title: "Seguros + Investimentos",
                color: "#8b5cf6",
                items: [
                  "Integrar insurtech para seguros contextuais no checkout",
                  "Garantia estendida, seguro de envio, protecao de compra",
                  "Cashback em investimentos (fundo rendimento)",
                  "Treasury-as-a-Service para sellers (rendimento do saldo)",
                  "Programa de fidelidade com componentes financeiros",
                ],
                kpi: "Attach rate de 10-15% em seguros. NPS +10 pontos.",
              },
            ].map((phase) => (
              <div key={phase.phase} style={{ ...pillarCardStyle, borderLeft: `4px solid ${phase.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{
                    padding: "0.2rem 0.5rem", borderRadius: 6, fontSize: "0.7rem",
                    fontWeight: 700, background: phase.color, color: "#fff",
                  }}>
                    {phase.phase}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>{phase.period}</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
                  {phase.title}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.5rem" }}>
                  {phase.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.825rem" }}>
                      <span style={{ color: phase.color, fontWeight: 600, flexShrink: 0 }}>-</span>
                      <span style={{ color: "var(--text-secondary)" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  padding: "0.5rem 0.75rem", borderRadius: 8,
                  background: `${phase.color}10`, border: `1px solid ${phase.color}30`,
                }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--foreground)" }}>
                    <strong>KPIs esperados:</strong> {phase.kpi}
                  </p>
                </div>
              </div>
            ))}
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
          Embedded Finance
        </h1>
        <p className="page-description">
          Guia completo sobre como integrar servicos financeiros em plataformas nao-financeiras:
          pagamentos, credito, seguros, banking e investimentos via API. Modelos de negocio,
          regulacao brasileira e arquitetura tecnica.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>O que e Embedded Finance e por que esta transformando o mercado financeiro</li>
          <li>Os 5 pilares: payments, lending, insurance, banking e investments</li>
          <li>Como construir produtos financeiros dentro de plataformas nao-financeiras</li>
          <li>Modelos de negocio (referral, white-label, licensed, full-stack) e como escolher</li>
          <li>Regulacao brasileira: SCD, SEP, IP, Sandbox BCB, Open Finance, registro de recebiveis</li>
          <li>Arquitetura tecnica e como escolher BaaS providers</li>
          <li>Metricas, casos de uso reais e roadmap de implementacao</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>10</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Pilares</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>BaaS Providers</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Cases Reais</div>
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
              minWidth: 28, height: 28, borderRadius: "50%",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
              background: "var(--primary)", color: "#fff",
              padding: "0 0.25rem",
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

      {/* Related pages */}
      <div style={{ ...sectionStyle, marginTop: "2rem" }}>
        <h2 style={headingStyle}>Paginas Relacionadas</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { name: "Arquitetura PayFac", href: "/knowledge/payfac-architecture" },
            { name: "Antecipacao de Recebiveis", href: "/knowledge/antecipacao-recebiveis" },
            { name: "Credito Estruturado", href: "/knowledge/credito-estruturado" },
            { name: "Matriz Regulatoria", href: "/knowledge/regulatory-matrix" },
            { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing" },
            { name: "Webhook Patterns", href: "/knowledge/webhook-patterns" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.375rem 0.75rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--primary)",
                fontSize: "0.825rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.5 }}>
          Fontes: Bain & Company (Embedded Finance Market Sizing), Banco Central do Brasil (regulacao),
          documentacao publica de Dock, Celcoin, Stripe, Shopify. Dados de mercado sao estimativas
          e projecoes baseadas em relatorios publicos.
        </p>
      </div>
    </div>
  );
}
