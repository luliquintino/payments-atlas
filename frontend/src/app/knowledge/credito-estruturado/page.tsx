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

export default function CreditoEstruturadoPage() {
  const quiz = getQuizForPage("/knowledge/credito-estruturado");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "scd",
      title: "SCD - Sociedade de Credito Direto",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            A SCD (Sociedade de Credito Direto) e uma instituicao financeira autorizada pelo Banco
            Central do Brasil, regulada pela Resolucao 4.656/2018. Ela pode realizar operacoes de
            credito exclusivamente com recursos proprios, sem captar depositos do publico.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Caracteristica</th>
                  <th style={thStyle}>SCD</th>
                  <th style={thStyle}>Banco Tradicional</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Captacao de depositos</td><td style={tdStyle}>Nao permitido</td><td style={tdStyle}>Permitido (conta corrente, poupanca)</td></tr>
                <tr><td style={tdStyle}>Origem dos recursos</td><td style={tdStyle}>Capital proprio</td><td style={tdStyle}>Depositos + capital + mercado</td></tr>
                <tr><td style={tdStyle}>Regulacao</td><td style={tdStyle}>BCB Resolucao 4.656</td><td style={tdStyle}>Multiplas normas CMN/BCB</td></tr>
                <tr><td style={tdStyle}>Capital minimo</td><td style={tdStyle}>R$ 1 milhao</td><td style={tdStyle}>R$ 17,5 milhoes+</td></tr>
                <tr><td style={tdStyle}>Complexidade operacional</td><td style={tdStyle}>Baixa a media</td><td style={tdStyle}>Alta</td></tr>
                <tr><td style={tdStyle}>Pode emitir cartao?</td><td style={tdStyle}>Nao diretamente</td><td style={tdStyle}>Sim</td></tr>
                <tr><td style={tdStyle}>Cessao de creditos</td><td style={tdStyle}>Permitido (para IFs e FIDCs)</td><td style={tdStyle}>Permitido</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            As SCDs se tornaram o veiculo preferido de fintechs que querem oferecer credito de forma
            regulada. Muitas fintechs de &quot;Credit as a Service&quot; operam via SCD proprio ou
            parceiro.
          </p>
        </>
      ),
    },
    {
      id: "fidc",
      title: "FIDC - Fundo de Investimento em Direitos Creditorios",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O FIDC e um fundo de investimento regulado pela CVM (Instrucao 356 e atualizacoes)
            que compra direitos creditorios (recebiveis) e os transforma em cotas negociaveis.
            E um dos principais instrumentos de securitizacao no Brasil.
          </p>
          <p style={subheadingStyle}>Estrutura do FIDC</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Participante</th>
                  <th style={thStyle}>Funcao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Cedente</td><td style={tdStyle}>Origina os recebiveis e os cede ao fundo (ex: merchant, fintech)</td></tr>
                <tr><td style={tdStyle}>Administrador</td><td style={tdStyle}>Responsavel legal pelo fundo, supervisao geral</td></tr>
                <tr><td style={tdStyle}>Gestor</td><td style={tdStyle}>Define a politica de investimento, seleciona recebiveis</td></tr>
                <tr><td style={tdStyle}>Custodiante</td><td style={tdStyle}>Guarda os documentos, valida a existencia dos recebiveis</td></tr>
                <tr><td style={tdStyle}>Agencia de Rating</td><td style={tdStyle}>Avalia o risco das cotas (opcional mas comum)</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Tipos de Cotas</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Cota</th>
                  <th style={thStyle}>Prioridade</th>
                  <th style={thStyle}>Risco</th>
                  <th style={thStyle}>Retorno</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Senior</td><td style={tdStyle}>Primeira a receber</td><td style={tdStyle}>Menor</td><td style={tdStyle}>CDI + spread (menor)</td></tr>
                <tr><td style={tdStyle}>Mezanino</td><td style={tdStyle}>Apos a senior</td><td style={tdStyle}>Medio</td><td style={tdStyle}>CDI + spread (medio)</td></tr>
                <tr><td style={tdStyle}>Junior (Subordinada)</td><td style={tdStyle}>Ultima a receber, absorve perdas primeiro</td><td style={tdStyle}>Maior</td><td style={tdStyle}>Residual (maior potencial)</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Tipos de Lastro</p>
          <p style={paragraphStyle}>
            Os FIDCs podem ter como lastro diversos tipos de recebiveis: recebiveis de cartao de
            credito (o mais comum em pagamentos), duplicatas mercantis, contratos de emprestimo,
            recebiveis de consignado, alugueis, entre outros.
          </p>
        </>
      ),
    },
    {
      id: "credit-as-a-service",
      title: "Credit as a Service",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Credit as a Service (CaaS) e o modelo em que fintechs oferecem credito ao usuario final
            sem ser uma instituicao financeira diretamente. Isso e possivel atraves de parcerias com
            SCDs, bancos ou via estruturas de FIDC.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Como Funciona</th>
                  <th style={thStyle}>Exemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Correspondente Bancario</td><td style={tdStyle}>Fintech atua como correspondente de um banco/SCD</td><td style={tdStyle}>Fintech de emprestimo pessoal via app</td></tr>
                <tr><td style={tdStyle}>SCD Propria</td><td style={tdStyle}>Fintech obtem licenca de SCD no BCB</td><td style={tdStyle}>Nubank (iniciou como SCD), Creditas</td></tr>
                <tr><td style={tdStyle}>Banking as a Service</td><td style={tdStyle}>Usa infraestrutura de BaaS para originar credito</td><td style={tdStyle}>Plataformas usando Dock, Bankly, etc.</td></tr>
                <tr><td style={tdStyle}>Marketplace de Credito</td><td style={tdStyle}>Conecta tomadores a financiadores (P2P)</td><td style={tdStyle}>Plataformas de peer-to-peer lending</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Embedded Finance
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O CaaS e um pilar do embedded finance: empresas nao-financeiras (e-commerce, ERPs,
              marketplaces) podem oferecer credito dentro de sua propria plataforma, aumentando
              retencao e monetizacao da base de clientes.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "cessao-recebiveis",
      title: "Cessao de Recebiveis",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            A cessao de recebiveis e o ato juridico pelo qual o cedente (quem tem o recebivel)
            transfere seus direitos creditorios ao cessionario (quem compra). E a operacao que
            viabiliza a antecipacao e a securitizacao.
          </p>
          <p style={subheadingStyle}>Fluxo Operacional</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.75rem", marginBottom: "0.75rem" }}>
            {[
              { step: "1", text: "Cedente (merchant/fintech) identifica recebiveis elegiveis" },
              { step: "2", text: "Consulta a registradora para verificar se o recebivel esta livre (sem gravames)" },
              { step: "3", text: "Negocia termos com o cessionario (FIDC, banco, financeira)" },
              { step: "4", text: "Cessao e formalizada e registrada na registradora" },
              { step: "5", text: "Custodiante valida a documentacao e existencia do credito" },
              { step: "6", text: "Recurso financeiro e liberado ao cedente" },
              { step: "7", text: "Na data de vencimento, o pagamento flui diretamente ao cessionario" },
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
          <p style={paragraphStyle}>
            O registro na registradora e obrigatorio e garante que o mesmo recebivel nao seja
            cedido a mais de um cessionario (evitando duplicidade de cessao).
          </p>
        </>
      ),
    },
    {
      id: "riscos",
      title: "Riscos",
      icon: "5",
      content: (
        <>
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
                <tr><td style={tdStyle}>Inadimplencia</td><td style={tdStyle}>Tomador de credito nao paga. Em FIDCs, afeta o retorno das cotas.</td><td style={tdStyle}>Subordinacao (cota junior absorve perdas), diversificacao, credit scoring</td></tr>
                <tr><td style={tdStyle}>Diluicao</td><td style={tdStyle}>Recebiveis sao reduzidos por devolucoes, descontos ou disputas</td><td style={tdStyle}>Reserva de diluicao, monitoramento continuo, over-collateralization</td></tr>
                <tr><td style={tdStyle}>Concentracao</td><td style={tdStyle}>Excesso de exposicao a poucos cedentes ou sacados</td><td style={tdStyle}>Limites de concentracao por cedente/sacado, diversificacao</td></tr>
                <tr><td style={tdStyle}>Fraude</td><td style={tdStyle}>Recebiveis ficticios, duplicidade de cessao, conluio</td><td style={tdStyle}>Due diligence, auditoria, registro em registradoras, custodia independente</td></tr>
                <tr><td style={tdStyle}>Risco operacional</td><td style={tdStyle}>Falhas nos sistemas de originacao, registro ou cobranca</td><td style={tdStyle}>Backup operacional, plano de contingencia, SLA com prestadores</td></tr>
                <tr><td style={tdStyle}>Risco regulatorio</td><td style={tdStyle}>Mudancas na regulacao que afetem a operacao</td><td style={tdStyle}>Monitoramento regulatorio, compliance dedicado</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "regulacao",
      title: "Regulacao",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            O credito estruturado no Brasil e regulado por duas esferas principais: o Banco Central
            (para instituicoes financeiras como SCDs) e a CVM (para fundos como FIDCs).
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Norma</th>
                  <th style={thStyle}>Regulador</th>
                  <th style={thStyle}>Escopo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Resolucao 4.656/2018</td><td style={tdStyle}>BCB</td><td style={tdStyle}>Cria SCD e SEP; define regras de operacao, capital minimo, cessao</td></tr>
                <tr><td style={tdStyle}>CVM 356 (e atualizacoes)</td><td style={tdStyle}>CVM</td><td style={tdStyle}>Regulamenta FIDCs: constituicao, administracao, custodia, cotas</td></tr>
                <tr><td style={tdStyle}>CVM 175/2022</td><td style={tdStyle}>CVM</td><td style={tdStyle}>Novo marco regulatorio de fundos (inclui FIDCs), vigente a partir de 2023</td></tr>
                <tr><td style={tdStyle}>Resolucao BCB 4.734</td><td style={tdStyle}>BCB</td><td style={tdStyle}>Arranjos de pagamento, registro de recebiveis</td></tr>
                <tr><td style={tdStyle}>Circular 3.952</td><td style={tdStyle}>BCB</td><td style={tdStyle}>Registradoras de recebiveis</td></tr>
                <tr><td style={tdStyle}>Lei 13.775/2018</td><td style={tdStyle}>Congresso</td><td style={tdStyle}>Duplicata eletronica, facilita cessao de recebiveis</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            O compliance nessas operacoes envolve KYC/AML (conheca seu cliente e prevencao a
            lavagem de dinheiro), reporting ao BCB e CVM, auditoria independente e aderencia a
            limites de concentracao e alavancagem.
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
          Credito Estruturado (SCD, FIDC)
        </h1>
        <p className="page-description">
          Estruturas de credito no ecossistema de pagamentos: SCDs, FIDCs, cessao de
          recebiveis e Credit as a Service.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Diferenca entre SCD e banco tradicional e como fintechs usam a licenca</li>
          <li>Estrutura de um FIDC: cotas senior, mezanino e junior</li>
          <li>Fluxo de cessao de recebiveis e riscos associados</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>3</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tipos de Cota</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Normas</div>
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
