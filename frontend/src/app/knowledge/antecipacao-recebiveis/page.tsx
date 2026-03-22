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

export default function AntecipacaoRecebiveisPage() {
  const quiz = getQuizForPage("/knowledge/antecipacao-recebiveis");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "o-que-e",
      title: "O que e Antecipacao de Recebiveis",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Antecipacao de recebiveis e a operacao financeira em que o lojista (merchant) recebe
            antecipadamente os valores das vendas realizadas no cartao de credito, que normalmente
            so seriam liquidados em D+30 (ou mais, no caso de parcelamento). Em troca dessa
            antecipacao, o merchant paga um desagio (desconto) sobre o valor futuro.
          </p>
          <p style={paragraphStyle}>
            Essa operacao e fundamental para o fluxo de caixa de comercios que precisam de capital
            de giro imediato. No Brasil, a antecipacao de recebiveis de cartao movimenta bilhoes
            de reais por mes e e uma das principais fontes de financiamento para pequenos e medios
            comerciantes.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Exemplo Simplificado
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Merchant vende R$10.000 no cartao de credito a vista. O valor seria pago em D+30.
              Com antecipacao, recebe em D+1 com um desagio de ~1,5%/mes, recebendo R$9.852,22 ao inves de R$10.000.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "calculo-desagio",
      title: "Calculo de Desagio",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O desagio e calculado usando a formula de valor presente. A taxa aplicada depende do
            prazo de antecipacao, do risco do merchant e das condicoes de mercado.
          </p>
          <div style={formulaStyle}>
            VP = VF / (1 + taxa)^n
          </div>
          <p style={paragraphStyle}>
            Onde: VP = Valor Presente (o que o merchant recebe), VF = Valor Futuro (valor da venda),
            taxa = taxa de desagio por periodo, n = numero de periodos.
          </p>
          <p style={subheadingStyle}>Exemplo Pratico</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Parametro</th>
                  <th style={thStyle}>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Valor Futuro (VF)</td><td style={tdStyle}>R$ 10.000,00</td></tr>
                <tr><td style={tdStyle}>Prazo</td><td style={tdStyle}>D+30 (1 mes)</td></tr>
                <tr><td style={tdStyle}>Taxa de desagio</td><td style={tdStyle}>1,5% ao mes</td></tr>
                <tr><td style={tdStyle}>Calculo</td><td style={tdStyle}>10.000 / (1 + 0,015)^1</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>Valor Presente (VP)</td><td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>R$ 9.852,22</td></tr>
                <tr><td style={tdStyle}>Custo da antecipacao</td><td style={tdStyle}>R$ 147,78</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            Para parcelamento, o calculo e feito parcela a parcela, pois cada uma tem um prazo
            diferente de vencimento. A taxa efetiva total aumenta quanto maior o numero de parcelas.
          </p>
        </>
      ),
    },
    {
      id: "mesa-antecipacao",
      title: "Mesa de Antecipacao",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            A mesa de antecipacao e o ambiente (fisico ou digital) onde ocorre a negociacao e
            execucao das operacoes de antecipacao. Os principais players envolvidos sao:
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Player</th>
                  <th style={thStyle}>Papel</th>
                  <th style={thStyle}>Exemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Adquirente</td><td style={tdStyle}>Origina os recebiveis, oferece antecipacao ao merchant</td><td style={tdStyle}>Cielo, Stone, Rede</td></tr>
                <tr><td style={tdStyle}>FIDC</td><td style={tdStyle}>Compra os recebiveis via cessao, financia a antecipacao</td><td style={tdStyle}>FIDCs de cartao</td></tr>
                <tr><td style={tdStyle}>Merchant</td><td style={tdStyle}>Cede os direitos creditorios em troca de capital imediato</td><td style={tdStyle}>Lojistas, e-commerce</td></tr>
                <tr><td style={tdStyle}>Registradora</td><td style={tdStyle}>Registra e garante unicidade da cessao</td><td style={tdStyle}>CERC, TAG, SRR</td></tr>
                <tr><td style={tdStyle}>Banco/Financeira</td><td style={tdStyle}>Pode oferecer antecipacao usando recebiveis como garantia</td><td style={tdStyle}>Bancos comerciais</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            A negociacao de taxas depende de volume, historico do merchant, prazo de antecipacao e
            condicoes de mercado. Grandes varejistas conseguem taxas significativamente menores que
            pequenos comercios.
          </p>
        </>
      ),
    },
    {
      id: "registradoras",
      title: "Registradoras",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            As registradoras sao entidades autorizadas pelo Banco Central para registrar e controlar
            as operacoes com recebiveis de cartao. Seu papel e fundamental para evitar duplicidade
            de cessao e garantir transparencia ao mercado.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Registradora</th>
                  <th style={thStyle}>Controlada por</th>
                  <th style={thStyle}>Funcao Principal</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>CERC</td><td style={tdStyle}>CIP (Camara Interbancaria de Pagamentos)</td><td style={tdStyle}>Registro de recebiveis de cartao e registro de UR (Unidade de Recebiveis)</td></tr>
                <tr><td style={tdStyle}>TAG</td><td style={tdStyle}>B3 (Bolsa de Valores)</td><td style={tdStyle}>Registro e gestao de recebiveis, integracao com mercado de capitais</td></tr>
                <tr><td style={tdStyle}>SRR</td><td style={tdStyle}>Independente</td><td style={tdStyle}>Sistema de Registro de Recebiveis, foco em interoperabilidade</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            A interoperabilidade entre registradoras e obrigatoria por regulacao do BCB, permitindo
            que um financiador consulte recebiveis registrados em qualquer registradora. Isso criou
            um mercado mais competitivo e transparente para antecipacao.
          </p>
        </>
      ),
    },
    {
      id: "agenda-recebiveis",
      title: "Agenda de Recebiveis",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            A agenda de recebiveis e o cronograma de todos os valores futuros que o merchant tem a
            receber das adquirentes. Cada linha da agenda representa um valor, uma data de liquidacao
            e o adquirente/bandeira responsavel.
          </p>
          <p style={subheadingStyle}>Trava de Agenda</p>
          <p style={paragraphStyle}>
            A trava de agenda ocorre quando um financiador (banco, FIDC) registra um gravame sobre
            os recebiveis futuros do merchant como garantia de credito. Enquanto a trava estiver
            ativa, os valores sao direcionados ao financiador, nao ao merchant.
          </p>
          <p style={subheadingStyle}>Split de Recebiveis</p>
          <p style={paragraphStyle}>
            No split de recebiveis, o fluxo de pagamento e dividido na origem entre diferentes
            beneficiarios. E muito usado em marketplaces, onde parte do valor vai para o seller e
            parte para a plataforma. O split pode ocorrer na liquidacao ou via agenda.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Exemplo de Agenda
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Merchant vende R$3.000 em 3x no cartao. Agenda: Parcela 1 (R$1.000 em D+30),
              Parcela 2 (R$1.000 em D+60), Parcela 3 (R$1.000 em D+90). Se antecipar tudo,
              cada parcela tera um desagio proporcional ao prazo.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "impacto-fluxo-caixa",
      title: "Impacto no Fluxo de Caixa",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Para ilustrar o impacto da antecipacao, considere um merchant com faturamento mensal de
            R$100.000 em vendas no cartao de credito:
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Cenario</th>
                  <th style={thStyle}>Sem Antecipacao</th>
                  <th style={thStyle}>Com Antecipacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Valor bruto mensal</td><td style={tdStyle}>R$ 100.000</td><td style={tdStyle}>R$ 100.000</td></tr>
                <tr><td style={tdStyle}>MDR (2,5%)</td><td style={tdStyle}>- R$ 2.500</td><td style={tdStyle}>- R$ 2.500</td></tr>
                <tr><td style={tdStyle}>Custo antecipacao (1,5%)</td><td style={tdStyle}>R$ 0</td><td style={tdStyle}>- R$ 1.500</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Valor liquido</td><td style={{ ...tdStyle, fontWeight: 600 }}>R$ 97.500</td><td style={{ ...tdStyle, fontWeight: 600 }}>R$ 96.000</td></tr>
                <tr><td style={tdStyle}>Prazo de recebimento</td><td style={tdStyle}>D+30</td><td style={tdStyle}>D+1</td></tr>
                <tr><td style={tdStyle}>Capital de giro disponivel</td><td style={{ ...tdStyle, color: "#ef4444" }}>Somente apos 30 dias</td><td style={{ ...tdStyle, color: "#10b981" }}>Imediato</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            O custo de R$1.500/mes pode parecer alto, mas para muitos comercios o acesso imediato
            ao capital permite pagar fornecedores a vista (com desconto), reabastecer estoque e
            manter a operacao saudavel. A decisao depende do custo de oportunidade do capital.
          </p>
        </>
      ),
    },
    {
      id: "riscos",
      title: "Riscos",
      icon: "7",
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
                <tr><td style={tdStyle}>Duplicidade de cessao</td><td style={tdStyle}>Mesmo recebivel cedido a mais de um financiador</td><td style={tdStyle}>Registro obrigatorio em registradoras (CERC/TAG/SRR)</td></tr>
                <tr><td style={tdStyle}>Fraude</td><td style={tdStyle}>Vendas fictícias gerando recebiveis falsos</td><td style={tdStyle}>Validacao cruzada com bandeiras, monitoramento de padroes</td></tr>
                <tr><td style={tdStyle}>Concentracao</td><td style={tdStyle}>Excesso de exposicao a um unico merchant ou segmento</td><td style={tdStyle}>Diversificacao de carteira, limites de exposicao</td></tr>
                <tr><td style={tdStyle}>Chargeback</td><td style={tdStyle}>Vendas antecipadas que sofrem estorno posterior</td><td style={tdStyle}>Retencao de percentual como garantia, analise de historico</td></tr>
                <tr><td style={tdStyle}>Risco de liquidez</td><td style={tdStyle}>Descasamento entre antecipacao concedida e funding</td><td style={tdStyle}>Gestao de ALM (Asset Liability Management)</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "regulacao",
      title: "Regulacao",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            O marco regulatorio de recebiveis de cartao no Brasil passou por uma grande transformacao
            a partir de 2021, com o objetivo de aumentar a competicao e reduzir o custo de credito
            para o merchant.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Norma</th>
                  <th style={thStyle}>Escopo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Resolucao BCB 4.734</td><td style={tdStyle}>Estabelece regras para arranjos de pagamento e registro de recebiveis</td></tr>
                <tr><td style={tdStyle}>Circular 3.952</td><td style={tdStyle}>Regulamenta a constituicao e funcionamento das registradoras</td></tr>
                <tr><td style={tdStyle}>Marco Regulatorio de Recebiveis (2021)</td><td style={tdStyle}>Obriga registro, garante interoperabilidade, permite livre negociacao</td></tr>
                <tr><td style={tdStyle}>Resolucao CMN 4.893</td><td style={tdStyle}>Regras para cessao de recebiveis por instituicoes de pagamento</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            As principais mudancas incluem: obrigatoriedade de registro de todos os recebiveis,
            interoperabilidade entre registradoras, direito do merchant de negociar livremente
            seus recebiveis com qualquer financiador, e transparencia total sobre a agenda.
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
          Antecipacao de Recebiveis
        </h1>
        <p className="page-description">
          Como funciona a antecipacao de recebiveis de cartao no Brasil: desagio,
          registradoras, agenda e regulacao.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Como funciona o calculo de desagio e valor presente de recebiveis</li>
          <li>O papel das registradoras (CERC, TAG, SRR) e a agenda de recebiveis</li>
          <li>Riscos operacionais e marco regulatorio do BCB</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>3</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Registradoras</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>4+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Normas BCB</div>
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
