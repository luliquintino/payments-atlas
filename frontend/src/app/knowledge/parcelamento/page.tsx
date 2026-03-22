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

export default function ParcelamentoPage() {
  const quiz = getQuizForPage("/knowledge/parcelamento");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "tipos",
      title: "Tipos de Parcelamento",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            No Brasil existem dois modelos principais de parcelamento no cartao de credito,
            com impactos muito diferentes na cadeia de pagamentos:
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Caracteristica</th>
                  <th style={thStyle}>Parcelado Emissor</th>
                  <th style={thStyle}>Parcelado Lojista</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Quem parcela</td><td style={tdStyle}>O banco emissor do cartao</td><td style={tdStyle}>O lojista (merchant)</td></tr>
                <tr><td style={tdStyle}>Juros</td><td style={tdStyle}>Cobrados do consumidor pelo emissor</td><td style={tdStyle}>Absorvidos pelo lojista (sem juros para consumidor)</td></tr>
                <tr><td style={tdStyle}>Liquidacao para merchant</td><td style={tdStyle}>Valor total em D+30 (ou D+2)</td><td style={tdStyle}>Parcelado: cada parcela em D+30, D+60, D+90...</td></tr>
                <tr><td style={tdStyle}>Risco de credito</td><td style={tdStyle}>Do emissor (banco)</td><td style={tdStyle}>Do emissor, mas merchant tem risco de chargeback</td></tr>
                <tr><td style={tdStyle}>Interchange</td><td style={tdStyle}>Mais baixo</td><td style={tdStyle}>Mais alto (proporcional ao numero de parcelas)</td></tr>
                <tr><td style={tdStyle}>Exemplo de uso</td><td style={tdStyle}>Parcelamento na fatura do cartao</td><td style={tdStyle}>&quot;12x sem juros&quot; no e-commerce</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "interchange",
      title: "Como o Interchange Muda",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O interchange (taxa interbancaria paga pelo adquirente ao emissor) varia conforme o
            numero de parcelas. Quanto mais parcelas, maior o interchange, pois o emissor assume
            mais risco e custo de financiamento.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Faixa de Parcelas</th>
                  <th style={thStyle}>Interchange Tipico (Credito)</th>
                  <th style={thStyle}>Observacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>A vista (1x)</td><td style={tdStyle}>1,2% - 1,8%</td><td style={tdStyle}>Taxa base mais baixa</td></tr>
                <tr><td style={tdStyle}>2x a 6x</td><td style={tdStyle}>2,0% - 2,8%</td><td style={tdStyle}>Incremento gradual por parcela</td></tr>
                <tr><td style={tdStyle}>7x a 12x</td><td style={tdStyle}>2,5% - 3,5%</td><td style={tdStyle}>Taxas mais altas pelo risco e custo de capital</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            Esses valores sao referencia do mercado brasileiro. Cada bandeira (Visa, Mastercard, Elo)
            define suas proprias tabelas de interchange, que podem variar por segmento do merchant
            (MCC), volume e tipo de cartao (standard, gold, platinum, corporate).
          </p>
        </>
      ),
    },
    {
      id: "impacto-mdr",
      title: "Impacto no MDR",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            O MDR (Merchant Discount Rate) e a taxa total que o merchant paga por transacao.
            Ele e composto por interchange + taxa do adquirente + taxa da bandeira. Como o
            interchange sobe com parcelas, o MDR tambem sobe.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Transacao</th>
                  <th style={thStyle}>MDR Tipico</th>
                  <th style={thStyle}>Em R$10.000</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Debito</td><td style={tdStyle}>1,2% - 1,5%</td><td style={tdStyle}>R$ 120 - R$ 150</td></tr>
                <tr><td style={tdStyle}>Credito a vista</td><td style={tdStyle}>2,0% - 3,0%</td><td style={tdStyle}>R$ 200 - R$ 300</td></tr>
                <tr><td style={tdStyle}>Parcelado 2-6x</td><td style={tdStyle}>3,0% - 4,0%</td><td style={tdStyle}>R$ 300 - R$ 400</td></tr>
                <tr><td style={tdStyle}>Parcelado 7-12x</td><td style={tdStyle}>3,5% - 5,0%</td><td style={tdStyle}>R$ 350 - R$ 500</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            Para o merchant, a decisao de oferecer parcelamento sem juros e um trade-off: paga-se
            mais MDR, mas aumenta a conversao e o ticket medio. Muitos varejistas consideram o
            parcelamento como custo de marketing.
          </p>
        </>
      ),
    },
    {
      id: "chargeback-parcelas",
      title: "Chargeback em Parcelas",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Quando uma venda parcelada sofre disputa (chargeback), a situacao e mais complexa do
            que em vendas a vista. O tratamento depende do motivo da disputa e do status de cada
            parcela.
          </p>
          <p style={subheadingStyle}>Qual parcela e disputada?</p>
          <p style={paragraphStyle}>
            O consumidor pode disputar a transacao inteira ou parcelas individuais. Na pratica,
            quando o motivo e fraude, geralmente todas as parcelas sao disputadas. Quando o motivo
            e mercadoria nao recebida ou servico nao prestado, pode ser parcial.
          </p>
          <p style={subheadingStyle}>Estorno Parcial</p>
          <p style={paragraphStyle}>
            No estorno parcial, apenas parte do valor e devolvido. As parcelas futuras podem ser
            canceladas enquanto as ja pagas sao estornadas. O adquirente debita o merchant pelo
            valor disputado, mesmo que parcelas futuras ainda nao tenham sido liquidadas.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Ponto de Atencao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se o merchant ja antecipou os recebiveis de uma venda parcelada e depois ocorre chargeback,
              ele precisa devolver o valor ao financiador. Isso cria risco de liquidez e e monitorado
              pelas registradoras.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "parcelado-sem-juros",
      title: "Parcelado Sem Juros",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            O &quot;parcelado sem juros&quot; e uma peculiaridade do mercado brasileiro. O consumidor
            nao paga juros, mas alguem paga o custo do dinheiro no tempo. Na maioria dos casos,
            e o merchant que absorve esse custo.
          </p>
          <p style={subheadingStyle}>Quem paga o custo?</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>Quem Paga</th>
                  <th style={thStyle}>Como</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>MDR mais alto</td><td style={tdStyle}>Merchant</td><td style={tdStyle}>Taxa maior por parcela (interchange + spread)</td></tr>
                <tr><td style={tdStyle}>Custo de capital (D+30, D+60...)</td><td style={tdStyle}>Merchant</td><td style={tdStyle}>Recebe parcelado ou paga para antecipar</td></tr>
                <tr><td style={tdStyle}>Risco de credito</td><td style={tdStyle}>Emissor</td><td style={tdStyle}>Se o consumidor nao pagar a fatura</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            Na pratica, o merchant embute o custo do parcelamento no preco do produto. Uma TV que
            custa R$2.000 a vista pode ter o preco &quot;cheio&quot; de R$2.200, sendo anunciada como
            &quot;12x de R$183,33 sem juros&quot;.
          </p>
        </>
      ),
    },
    {
      id: "juros-emissor",
      title: "Juros do Emissor",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Quando o parcelamento e feito pelo emissor (parcelado emissor), o banco cobra juros do
            consumidor. Esses juros sao a principal fonte de receita dos emissores de cartao de
            credito no Brasil.
          </p>
          <p style={subheadingStyle}>Como o banco calcula</p>
          <p style={paragraphStyle}>
            O emissor aplica uma taxa de juros mensal sobre o saldo devedor. O CET (Custo Efetivo
            Total) inclui juros, IOF, seguros e tarifas. A taxa media de juros do rotativo no
            Brasil gira em torno de 15% ao mes (dado historico), enquanto o parcelamento da fatura
            fica entre 5% e 12% ao mes.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              CET - Custo Efetivo Total
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O CET e a medida padronizada pelo BCB que inclui todos os custos da operacao de credito.
              E obrigatorio que o emissor informe o CET ao consumidor antes da contratacao.
              A taxa media do mercado brasileiro para parcelamento de fatura fica entre 5% e 12% a.m.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "impacto-financeiro",
      title: "Impacto Financeiro",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            O parcelamento tem impacto direto no working capital do merchant. Quanto mais
            parcelas, maior a duration dos recebiveis e maior a necessidade de capital de giro.
          </p>
          <p style={subheadingStyle}>Exemplo Numerico</p>
          <p style={paragraphStyle}>
            Merchant com R$100.000/mes em vendas, sendo 60% parcelado em media 6x:
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Vendas a vista (40%)</td><td style={tdStyle}>R$ 40.000 (recebe em D+30)</td></tr>
                <tr><td style={tdStyle}>Vendas parceladas (60%)</td><td style={tdStyle}>R$ 60.000 (parcelas de D+30 a D+180)</td></tr>
                <tr><td style={tdStyle}>Duration media</td><td style={tdStyle}>~75 dias</td></tr>
                <tr><td style={tdStyle}>Capital &quot;preso&quot; em recebiveis</td><td style={tdStyle}>~R$ 250.000 (acumulado)</td></tr>
                <tr><td style={tdStyle}>Custo para antecipar tudo (1,5% a.m.)</td><td style={tdStyle}>~R$ 3.750/mes</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            Esse capital &quot;preso&quot; e exatamente o que alimenta o mercado de antecipacao de
            recebiveis e FIDCs. Entender a duration dos recebiveis e fundamental para a gestao
            financeira do merchant.
          </p>
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
            O parcelamento no cartao de credito e regulado pelo BCB e pela legislacao de defesa do
            consumidor. Os principais pontos regulatorios sao:
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tema</th>
                  <th style={thStyle}>Regulacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Limite de parcelas</td><td style={tdStyle}>Nao ha limite legal fixo. Bandeiras definem limites (geralmente 12x ou 18x). Alguns segmentos permitem 24x.</td></tr>
                <tr><td style={tdStyle}>Transparencia</td><td style={tdStyle}>Obrigatorio informar CET, valor total, numero de parcelas e taxa de juros antes da compra.</td></tr>
                <tr><td style={tdStyle}>Rotativo do cartao</td><td style={tdStyle}>BCB limitou prazo do rotativo a 30 dias; apos, deve ser convertido em parcelamento com taxa menor.</td></tr>
                <tr><td style={tdStyle}>Interchange</td><td style={tdStyle}>BCB monitora mas nao tabelou interchange no Brasil (diferente de outros paises como EU).</td></tr>
                <tr><td style={tdStyle}>Defesa do consumidor</td><td style={tdStyle}>CDC garante direito a informacao clara, cancelamento e portabilidade de credito.</td></tr>
              </tbody>
            </table>
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
          Parcelamento
        </h1>
        <p className="page-description">
          Tudo sobre parcelamento no cartao de credito no Brasil: tipos, interchange,
          MDR, chargeback e impacto financeiro.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Diferenca entre parcelado emissor e parcelado lojista</li>
          <li>Como o interchange e MDR variam por numero de parcelas</li>
          <li>Impacto financeiro do parcelamento no capital de giro do merchant</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>2</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tipos</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>12x</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Maximo Comum</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
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
