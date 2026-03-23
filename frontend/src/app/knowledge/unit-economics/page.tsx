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

const pillarCardStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--background)",
  marginBottom: "0.75rem",
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

export default function UnitEconomicsPage() {
  const quiz = getQuizForPage("/knowledge/unit-economics");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    /* ------------------------------------------------------------------ */
    /* 1. Learning Objectives                                              */
    /* ------------------------------------------------------------------ */
    {
      id: "objetivos",
      title: "Objetivos de Aprendizado",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Ao final deste modulo, voce sera capaz de:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              "Decompor o MDR em interchange, scheme fee e margem do adquirente",
              "Comparar modelos de precificacao: MDR, IC++, blended, flat-fee e subscription",
              "Calcular unit economics de um PSP e de um adquirente",
              "Desenhar estrategias de pricing por vertical, volume e risco",
              "Simular revenue e margem para diferentes cenarios de transacoes",
              "Entender diferencas de custo entre Brasil, EUA e Europa",
              "Identificar custos ocultos: FX, cross-border, PCI, chargebacks",
              "Conduzir negociacoes de taxa com merchants e acquirers",
            ].map((obj, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{obj}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 2. Anatomia do MDR                                                  */
    /* ------------------------------------------------------------------ */
    {
      id: "anatomia-mdr",
      title: "Anatomia do MDR — Interchange + Scheme Fee + Acquirer Margin",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O MDR (Merchant Discount Rate) e a taxa cobrada do merchant a cada transacao com cartao.
            Ele nao e um numero unico — e a soma de tres componentes distintos, cada um com donos e regras diferentes.
            Entender essa anatomia e fundamental para qualquer profissional de pagamentos, pois determina
            onde esta a margem e quem captura valor em cada transacao.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>% tipica BR</th>
                  <th style={thStyle}>Quem recebe</th>
                  <th style={thStyle}>Como e calculado</th>
                  <th style={thStyle}>Negociavel?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Interchange Fee</td>
                  <td style={tdStyle}>0.5% - 1.8%</td>
                  <td style={tdStyle}>Banco emissor do cartao</td>
                  <td style={tdStyle}>Definido pelas bandeiras (Visa/Mastercard). Varia por tipo de cartao (credito/debito/premium), MCC do merchant, se e presencial ou online, se tem 3DS</td>
                  <td style={tdStyle}>Nao — tabela fixa das bandeiras, mas influenciavel pelo mix de cartoes</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Scheme Fee</td>
                  <td style={tdStyle}>0.05% - 0.15%</td>
                  <td style={tdStyle}>Bandeira (Visa, Mastercard, Elo)</td>
                  <td style={tdStyle}>Taxa pelo uso da rede. Inclui assessment fee, processing fee, cross-border fee. Varia por volume e se e domestica ou internacional</td>
                  <td style={tdStyle}>Parcialmente — grandes volumes conseguem tier melhor</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Acquirer Margin</td>
                  <td style={tdStyle}>0.3% - 1.5%</td>
                  <td style={tdStyle}>Adquirente / PSP</td>
                  <td style={tdStyle}>Margem sobre o servico: captura, liquidacao, antifraude, suporte. E a unica parte realmente negociavel</td>
                  <td style={tdStyle}>Sim — principal alavanca de negociacao</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Formula do MDR
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6, fontFamily: "monospace" }}>
              MDR = Interchange Fee + Scheme Fee + Acquirer Margin
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "0.5rem" }}>
              Exemplo: Cartao credito Visa Gold em e-commerce = 1.2% (interchange) + 0.08% (scheme) + 0.72% (acquirer) = 2.0% MDR total.
              O merchant paga 2.0%, mas o adquirente fica apenas com 0.72%.
            </p>
          </div>

          <p style={subheadingStyle}>Interchange por tipo de cartao (Brasil)</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Debito</th>
                  <th style={thStyle}>Credito Standard</th>
                  <th style={thStyle}>Credito Premium</th>
                  <th style={thStyle}>Credito Corporate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Presencial</td>
                  <td style={tdStyle}>0.5% - 0.8%</td>
                  <td style={tdStyle}>1.0% - 1.3%</td>
                  <td style={tdStyle}>1.5% - 1.8%</td>
                  <td style={tdStyle}>1.8% - 2.2%</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>E-commerce (CNP)</td>
                  <td style={tdStyle}>0.7% - 1.0%</td>
                  <td style={tdStyle}>1.2% - 1.5%</td>
                  <td style={tdStyle}>1.7% - 2.0%</td>
                  <td style={tdStyle}>2.0% - 2.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 3. Modelos de Precificacao                                          */
    /* ------------------------------------------------------------------ */
    {
      id: "modelos-precificacao",
      title: "Modelos de Precificacao — MDR vs IC++ vs Blended vs Flat-fee vs Subscription",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Existem cinco modelos principais de precificacao em pagamentos. Cada um distribui risco e transparencia
            de forma diferente entre merchant e processor. A escolha do modelo impacta diretamente a margem do PSP
            e a satisfacao do merchant.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Como funciona</th>
                  <th style={thStyle}>Exemplo</th>
                  <th style={thStyle}>Vantagem</th>
                  <th style={thStyle}>Desvantagem</th>
                  <th style={thStyle}>Quem usa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>MDR Fixo (Blended)</td>
                  <td style={tdStyle}>Taxa unica para todas as transacoes, independente do tipo de cartao</td>
                  <td style={tdStyle}>2.99% por transacao</td>
                  <td style={tdStyle}>Simples, previsivel para o merchant</td>
                  <td style={tdStyle}>PSP assume risco de mix de cartoes. Merchant com muito debito subsidia credito</td>
                  <td style={tdStyle}>PagSeguro, SumUp, Stone (PME)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>IC++ (Interchange Plus Plus)</td>
                  <td style={tdStyle}>Interchange real + scheme fee real + markup fixo do acquirer</td>
                  <td style={tdStyle}>IC + 0.05% + R$0.10</td>
                  <td style={tdStyle}>Maxima transparencia. Merchant paga custo real</td>
                  <td style={tdStyle}>Complexo de entender. Fatura varia mes a mes</td>
                  <td style={tdStyle}>Adyen, Stripe (enterprise), Cielo (grandes contas)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Tiered</td>
                  <td style={tdStyle}>Taxas diferentes por faixa: qualified, mid-qualified, non-qualified</td>
                  <td style={tdStyle}>Qualified 1.5%, Mid 2.0%, Non 3.0%</td>
                  <td style={tdStyle}>Meio-termo de simplicidade</td>
                  <td style={tdStyle}>Classificacao opaca. PSP pode classificar desfavoravelmente</td>
                  <td style={tdStyle}>Processadores tradicionais (EUA)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Flat-fee</td>
                  <td style={tdStyle}>Percentual fixo + centavos por transacao</td>
                  <td style={tdStyle}>2.9% + $0.30</td>
                  <td style={tdStyle}>Extremamente simples. Ideal para self-service</td>
                  <td style={tdStyle}>Caro para tickets baixos (centavos pesam)</td>
                  <td style={tdStyle}>Stripe, PayPal, Square</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Subscription</td>
                  <td style={tdStyle}>Mensalidade fixa + interchange real + centavos por transacao</td>
                  <td style={tdStyle}>R$99/mes + IC + R$0.08/tx</td>
                  <td style={tdStyle}>Menor custo total para alto volume. Alinhamento de incentivos</td>
                  <td style={tdStyle}>Merchant paga mesmo com zero transacoes</td>
                  <td style={tdStyle}>Payment Depot, Stax (EUA)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Quando usar cada modelo?
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Micro-merchants e self-service → Blended/Flat-fee (simplicidade). PMEs com volume medio → Tiered ou Blended com desconto por volume.
              Enterprise com alto volume → IC++ (transparencia, menor custo). High-volume e-commerce → Subscription (custo mais baixo por tx).
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 4. Unit Economics de um PSP                                         */
    /* ------------------------------------------------------------------ */
    {
      id: "unit-economics-psp",
      title: "Unit Economics de um PSP",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Um PSP (Payment Service Provider) como Stripe, Adyen ou Stone tem uma estrutura de custos e receitas
            especifica. Entender essa estrutura permite avaliar a saude financeira do negocio e identificar
            alavancas de crescimento e margem.
          </p>

          <p style={subheadingStyle}>Estrutura de Receita</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Fonte de Receita</th>
                  <th style={thStyle}>% da Receita Total</th>
                  <th style={thStyle}>Como funciona</th>
                  <th style={thStyle}>Margem tipica</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Net MDR (apos interchange)</td>
                  <td style={tdStyle}>50-60%</td>
                  <td style={tdStyle}>MDR cobrado menos interchange e scheme fees repassados</td>
                  <td style={tdStyle}>0.3-1.0% do GMV</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Antecipacao de recebiveis</td>
                  <td style={tdStyle}>15-25%</td>
                  <td style={tdStyle}>Desconto sobre recebiveis futuros (D+2 → D+0)</td>
                  <td style={tdStyle}>1.5-3.5% ao mes</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Float income</td>
                  <td style={tdStyle}>5-10%</td>
                  <td style={tdStyle}>Rendimento do saldo em transito (settlement D+30)</td>
                  <td style={tdStyle}>CDI sobre saldo medio</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Value-added services</td>
                  <td style={tdStyle}>10-20%</td>
                  <td style={tdStyle}>Antifraude, link de pagamento, recorrencia, dashboard, APIs premium</td>
                  <td style={tdStyle}>Alta margem (70-90%)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Hardware/SaaS</td>
                  <td style={tdStyle}>5-10%</td>
                  <td style={tdStyle}>Maquininhas (aluguel/venda), mensalidade de software</td>
                  <td style={tdStyle}>Baixa em hardware, alta em SaaS</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Estrutura de Custos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {[
              { item: "Interchange + Scheme Fees", pct: "55-70%", desc: "Repassados ao emissor e bandeira. Custo variavel, inevitavel." },
              { item: "Processing costs", pct: "5-10%", desc: "Infraestrutura: servidores, cloud, certificacao PCI, data center." },
              { item: "Risk & Fraud losses", pct: "3-8%", desc: "Chargebacks absorvidos, ferramentas de fraude, provisao para perdas." },
              { item: "Customer support", pct: "3-5%", desc: "Atendimento merchant, resolucao de disputas, onboarding assistido." },
              { item: "Sales & Marketing", pct: "10-15%", desc: "Aquisicao de merchants, branding, partnerships, events." },
              { item: "R&D / Engineering", pct: "10-20%", desc: "Desenvolvimento de produto, APIs, integracao, seguranca." },
            ].map((c) => (
              <div key={c.item} style={pillarCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--foreground)" }}>{c.item}</span>
                  <span style={tagStyle}>{c.pct}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Margem liquida tipica de um PSP
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              PSPs maduros como Adyen operam com margem EBITDA de 50-60%. PSPs de long tail (Stone, PagSeguro) operam com 15-25%
              devido a custos de distribuicao e hardware. Fintechs early-stage tipicamente operam com margem negativa
              nos primeiros 2-3 anos, subsidiando pricing para ganhar market share.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 5. Unit Economics de um Adquirente                                   */
    /* ------------------------------------------------------------------ */
    {
      id: "unit-economics-acquirer",
      title: "Unit Economics de um Adquirente",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Um adquirente tradicional (Cielo, Rede, Getnet) tem um modelo de negocio diferente de um PSP puro.
            O adquirente opera com licenca propria das bandeiras, conecta-se diretamente ao sistema financeiro
            e captura valor em pontos diferentes da cadeia.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Cielo</th>
                  <th style={thStyle}>Stone</th>
                  <th style={thStyle}>Adyen (Global)</th>
                  <th style={thStyle}>Benchmark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>TPV (vol. transacionado)</td>
                  <td style={tdStyle}>~R$ 800B/ano</td>
                  <td style={tdStyle}>~R$ 350B/ano</td>
                  <td style={tdStyle}>~EUR 970B/ano</td>
                  <td style={tdStyle}>Escala define poder de barganha</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Net Take Rate</td>
                  <td style={tdStyle}>0.75-0.85%</td>
                  <td style={tdStyle}>1.8-2.2%</td>
                  <td style={tdStyle}>0.18-0.22%</td>
                  <td style={tdStyle}>Adyen cobra IC++, take rate liquido baixo mas margem alta</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Receita de antecipacao</td>
                  <td style={tdStyle}>~25% da receita</td>
                  <td style={tdStyle}>~30% da receita</td>
                  <td style={tdStyle}>N/A (nao oferece)</td>
                  <td style={tdStyle}>Produto exclusivo Brasil. Alta margem</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>EBITDA Margin</td>
                  <td style={tdStyle}>30-35%</td>
                  <td style={tdStyle}>15-20%</td>
                  <td style={tdStyle}>55-60%</td>
                  <td style={tdStyle}>Adyen = alto scale, baixo custo. Stone investe em growth</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Float Revenue</td>
                  <td style={tdStyle}>Significativo</td>
                  <td style={tdStyle}>Moderado</td>
                  <td style={tdStyle}>Alto (settlement T+3)</td>
                  <td style={tdStyle}>Quanto mais lento o settlement, mais float</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Alavancas de crescimento de receita</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {[
              "Volume: mais merchants, mais transacoes por merchant. Escala reduz custo unitario de processamento.",
              "Mix upgrade: migrar merchants de debito para credito, de domestico para cross-border (taxas maiores).",
              "Antecipacao: no Brasil, oferecer D+0 em vez de D+30 gera 1.5-3.5% ao mes de spread — enorme alavanca.",
              "Cross-sell: conta digital, credito para merchant, seguros, maquininha, ERP, gestao financeira.",
              "Pricing power: merchants com alta dependencia do acquirer aceitam reajustes — churn risk baixo em enterprise.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 6. Pricing Strategy                                                 */
    /* ------------------------------------------------------------------ */
    {
      id: "pricing-strategy",
      title: "Pricing Strategy — Como Precificar por Vertical, Volume e Risco",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Pricing em pagamentos nao e one-size-fits-all. As melhores empresas do setor precificam de forma
            segmentada, considerando vertical do merchant, volume esperado, perfil de risco e metodo de pagamento
            predominante. A estrategia de pricing define nao apenas a margem, mas tambem o posicionamento de mercado.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Dimensao</th>
                  <th style={thStyle}>Logica</th>
                  <th style={thStyle}>Exemplo pratico</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Por vertical</td>
                  <td style={tdStyle}>Verticais com margens altas toleram MDR maior. Verticais com margem apertada precisam de taxa competitiva.</td>
                  <td style={tdStyle}>SaaS (high margin) → 2.9%. Supermercado (low margin, high volume) → 1.2%. Gambling (high risk) → 4-8%.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Por volume</td>
                  <td style={tdStyle}>Volume maior = custo unitario menor. Descontos progressivos incentivam concentracao.</td>
                  <td style={tdStyle}>Ate R$100K/mes → 2.5%. R$100K-1M → 2.0%. &gt;R$1M → 1.5%. &gt;R$10M → negociado.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Por risco</td>
                  <td style={tdStyle}>Merchants com alto chargeback rate ou em verticais reguladas pagam mais para compensar perdas.</td>
                  <td style={tdStyle}>E-commerce padrao → 2.5%. Travel (alto chargeback) → 3.5%. Crypto exchange → 5.0%+.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Por metodo</td>
                  <td style={tdStyle}>Pix tem custo marginal proximo a zero. Boleto tem custo fixo. Cartao tem interchange variavel.</td>
                  <td style={tdStyle}>Pix → R$0.50-1.00/tx. Boleto → R$2.00-5.00/tx. Cartao credito → 2.0-3.5%. Debito → 1.0-1.5%.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Por parcelamento</td>
                  <td style={tdStyle}>Parcelado sem juros = custo de funding. Parcelado com juros = receita financeira adicional.</td>
                  <td style={tdStyle}>A vista → 2.0%. 2-6x sem juros → 3.5%. 7-12x sem juros → 5.0%. Com juros → 2.0% + spread.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Pricing como arma competitiva
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Stone conquistou market share com pricing agressivo + logistica de maquininhas.
              Stripe venceu com developer experience e pricing transparente. Adyen venceu enterprise
              com IC++ e plataforma unificada. O pricing ideal depende do ICP (Ideal Customer Profile)
              e do posicionamento desejado no mercado.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 7. Simulacao de Revenue                                             */
    /* ------------------------------------------------------------------ */
    {
      id: "simulacao-revenue",
      title: "Simulacao de Revenue — 1M Transacoes",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Vamos simular a receita e margem de um PSP processando 1 milhao de transacoes por mes
            com diferentes cenarios de ticket medio, MDR e estrutura de custos. Esta simulacao
            ilustra como pequenas variacoes em taxa e volume impactam dramaticamente o resultado.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Cenario</th>
                  <th style={thStyle}>Ticket Medio</th>
                  <th style={thStyle}>GMV/mes</th>
                  <th style={thStyle}>MDR</th>
                  <th style={thStyle}>Receita Bruta</th>
                  <th style={thStyle}>Interchange (65%)</th>
                  <th style={thStyle}>Net Revenue</th>
                  <th style={thStyle}>Custo Op (40%)</th>
                  <th style={thStyle}>Lucro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cenario: "Micro-merchant", ticket: "R$ 50", gmv: "R$ 50M", mdr: "3.0%", bruta: "R$ 1.5M", ic: "R$ 975K", net: "R$ 525K", custo: "R$ 210K", lucro: "R$ 315K" },
                  { cenario: "PME e-commerce", ticket: "R$ 150", gmv: "R$ 150M", mdr: "2.5%", bruta: "R$ 3.75M", ic: "R$ 2.44M", net: "R$ 1.31M", custo: "R$ 524K", lucro: "R$ 786K" },
                  { cenario: "Mid-market", ticket: "R$ 500", gmv: "R$ 500M", mdr: "2.0%", bruta: "R$ 10M", ic: "R$ 6.5M", net: "R$ 3.5M", custo: "R$ 1.4M", lucro: "R$ 2.1M" },
                  { cenario: "Enterprise", ticket: "R$ 2.000", gmv: "R$ 2B", mdr: "1.5%", bruta: "R$ 30M", ic: "R$ 19.5M", net: "R$ 10.5M", custo: "R$ 4.2M", lucro: "R$ 6.3M" },
                ].map((row) => (
                  <tr key={row.cenario}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.cenario}</td>
                    <td style={tdStyle}>{row.ticket}</td>
                    <td style={tdStyle}>{row.gmv}</td>
                    <td style={tdStyle}>{row.mdr}</td>
                    <td style={tdStyle}>{row.bruta}</td>
                    <td style={tdStyle}>{row.ic}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>{row.net}</td>
                    <td style={tdStyle}>{row.custo}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "#22c55e" }}>{row.lucro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Insight chave
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Enterprise paga MDR menor mas gera 20x mais lucro absoluto que micro-merchants.
              Porem, custo de aquisicao de enterprise e 50-100x maior e o ciclo de vendas e 6-12 meses.
              O segredo e ter long tail (volume) + enterprise (margem absoluta). Stone e PagSeguro fazem
              dinheiro com long tail; Adyen faz com enterprise.
            </p>
          </div>

          <p style={subheadingStyle}>Receita adicional: Antecipacao de Recebiveis</p>
          <p style={paragraphStyle}>
            Se 40% do GMV de cartao for antecipado com spread de 2% ao mes em media,
            sobre um GMV de R$500M: R$200M antecipado x 2% = R$4M/mes de receita adicional de antecipacao.
            Isso pode dobrar o net revenue do PSP. No Brasil, antecipacao e frequentemente a maior
            fonte de lucro de adquirentes e PSPs.
          </p>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 8. Comparativo Brasil vs Global                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "comparativo-global",
      title: "Comparativo Brasil vs Global — MDR e Custos",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            O mercado de pagamentos brasileiro tem caracteristicas unicas que o diferenciam dos mercados
            americano e europeu. Entender essas diferencas e essencial para profissionais que trabalham
            com operacoes cross-border ou que usam benchmarks internacionais.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Brasil</th>
                  <th style={thStyle}>EUA</th>
                  <th style={thStyle}>Europa (EU)</th>
                  <th style={thStyle}>Por que a diferenca</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metrica: "MDR medio credito", br: "1.8-3.0%", us: "2.5-3.5%", eu: "1.0-1.5%", why: "EU tem cap de interchange (0.3% credito). EUA nao tem cap. Brasil esta no meio." },
                  { metrica: "MDR medio debito", br: "1.0-1.5%", us: "0.5% + $0.22 (Durbin)", eu: "0.2-0.5%", why: "EU cap debito = 0.2%. EUA Durbin Amendment limita a ~$0.22. Brasil sem cap." },
                  { metrica: "Pix / Instant Payment", br: "R$0.01/tx (gratis P2P)", us: "FedNow (nascente)", eu: "SEPA Instant (EUR 0.20)", why: "Brasil e referencia mundial. Pix processa mais que cartao de debito." },
                  { metrica: "Parcelamento", br: "Ate 12x sem juros, pago pelo merchant", us: "Inexistente (BNPL e alternativa)", eu: "Raro (Klarna em paises nordicos)", why: "Peculiaridade brasileira. Merchant absorve custo de funding." },
                  { metrica: "Settlement", br: "D+1 a D+30 (padrao D+30)", us: "T+2 (em transicao para T+1)", eu: "T+1 a T+2", why: "Brasil usa settlement longo + antecipacao como produto financeiro." },
                  { metrica: "Antecipacao de recebiveis", br: "25-40% da receita do acquirer", us: "Inexistente", eu: "Inexistente", why: "Modelo unico brasileiro. Funding source importante para merchants." },
                  { metrica: "Regulacao de interchange", br: "Sem cap (autorregulacao)", us: "Durbin (debito > $10B bank)", eu: "IFR cap 0.2% debito, 0.3% credito", why: "Brasil discute cap. CMN intervem pontualmente." },
                ].map((row) => (
                  <tr key={row.metrica}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.metrica}</td>
                    <td style={tdStyle}>{row.br}</td>
                    <td style={tdStyle}>{row.us}</td>
                    <td style={tdStyle}>{row.eu}</td>
                    <td style={{ ...tdStyle, fontSize: "0.75rem" }}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Por que o MDR brasileiro nao e tao alto quanto parece
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Quando se compara o custo total incluindo parcelamento sem juros (custo de funding de 1.5-3% ao mes),
              antecipacao de recebiveis e impostos sobre a cadeia (PIS/COFINS, ISS), o custo efetivo para merchants
              brasileiros pode chegar a 5-8% do valor da venda — significativamente acima dos ~3% nominais do MDR.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 9. Hidden Costs                                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "hidden-costs",
      title: "Hidden Costs — Custos Ocultos em Pagamentos",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Alem do MDR visivel, merchants e PSPs enfrentam uma serie de custos ocultos que podem
            representar 30-50% do custo total de processamento. Identificar e gerenciar esses custos
            e uma competencia critica para otimizar a operacao de pagamentos.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              {
                cost: "FX Markup",
                icon: "💱",
                desc: "Em transacoes cross-border, o markup cambial pode variar de 0.5% a 3% sobre o mid-market rate. PSPs frequentemente nao separam o FX cost do MDR, tornando dificil comparar.",
                impact: "1-3% por transacao internacional",
              },
              {
                cost: "Cross-border & Scheme Fees",
                icon: "🌍",
                desc: "Transacoes internacionais incorrem em cross-border fees adicionais das bandeiras (0.5-1.5%), alem do interchange domestico. Algumas bandeiras cobram IACF (Inter-regional Acquirer Fee).",
                impact: "0.5-1.5% adicional por tx internacional",
              },
              {
                cost: "PCI DSS Compliance",
                icon: "🔒",
                desc: "Manter compliance PCI custa de R$50K a R$500K+/ano dependendo do nivel (1-4). Inclui pentest, ASV scans, auditorias, treinamento, infra segura.",
                impact: "R$ 50K - 500K+/ano",
              },
              {
                cost: "Chargeback Fees",
                icon: "⚠️",
                desc: "Cada chargeback custa R$30-80 em taxa fixa, alem da perda do valor da transacao e do produto. Se o chargeback rate passa de 1%, entram em programas de monitoramento das bandeiras com multas progressivas.",
                impact: "R$ 30-80/chargeback + valor perdido + multas",
              },
              {
                cost: "Tokenization & 3DS",
                icon: "🔑",
                desc: "Servicos de tokenizacao e 3D Secure podem ter custo por transacao (R$0.05-0.20/tx). Porem, 3DS reduz chargebacks (liability shift) e tokenizacao aumenta auth rate — o ROI geralmente e positivo.",
                impact: "R$ 0.05-0.20/tx, mas ROI positivo",
              },
              {
                cost: "Parcelamento sem juros (funding cost)",
                icon: "📊",
                desc: "O merchant recebe em 30 dias, mas o emissor paga em ate 12 parcelas. O custo de funding (taxa de juros sobre o prazo) e absorvido pelo merchant ou pelo acquirer que antecipa. Pode representar 2-4% adicional.",
                impact: "2-4% adicional em vendas parceladas",
              },
            ].map((item) => (
              <div key={item.cost} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.cost}</span>
                  <span style={{ ...tagStyle, background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>{item.impact}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 10. Negociacao de Taxas                                             */
    /* ------------------------------------------------------------------ */
    {
      id: "negociacao-taxas",
      title: "Negociacao de Taxas — Alavancas e Taticas",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            A negociacao de taxas de pagamento e uma arte que combina dados, leverage e timing.
            Merchants com volume, baixo risco e multiplas opcoes de provider tem as melhores posicoes
            de negociacao. Entender as alavancas disponiveis e fundamental.
          </p>

          <p style={subheadingStyle}>Alavancas do Merchant</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Alavanca</th>
                  <th style={thStyle}>Impacto</th>
                  <th style={thStyle}>Como usar</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { alavanca: "Volume commitment", impacto: "Alto", como: "Garantir volume minimo em troca de taxa menor. Exemplo: R$10M/mes = desconto de 0.3%." },
                  { alavanca: "Multi-acquirer threat", impacto: "Alto", como: "Ter segundo acquirer ativo. Demonstrar que pode migrar volume rapidamente." },
                  { alavanca: "Churn risk", impacto: "Medio-Alto", como: "Merchants com baixo churn cost tem mais poder. Enterprise com integracao profunda tem menos." },
                  { alavanca: "Exclusividade", impacto: "Medio", como: "Oferecer exclusividade em troca de taxa preferencial e suporte dedicado." },
                  { alavanca: "Mix de pagamento", impacto: "Medio", como: "Direcionar volume para debito/Pix (menor interchange) melhora o mix e justifica taxa menor no cartao." },
                  { alavanca: "Antecipacao commitment", impacto: "Alto (BR)", como: "Comprometer-se a antecipar X% dos recebiveis em troca de MDR menor. Acquirer ganha na antecipacao." },
                  { alavanca: "Benchmark data", impacto: "Medio", como: "Ter dados de mercado (pesquisas, RFP competitivo) para provar que a taxa esta acima do mercado." },
                ].map((row) => (
                  <tr key={row.alavanca}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.alavanca}</td>
                    <td style={tdStyle}><span style={tagStyle}>{row.impacto}</span></td>
                    <td style={tdStyle}>{row.como}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Timing da negociacao</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {[
              "Final de trimestre do acquirer/PSP — times de vendas mais flexiveis para bater meta.",
              "Pos-RFP competitivo — usar propostas de concorrentes como referencia de mercado.",
              "Apos atingir milestone de volume — renegociar quando passar para o proximo tier de volume.",
              "Antes de renovacao contratual — momento de maior leverage, risco real de churn.",
              "Quando o acquirer lanca produto novo — aceitar ser early adopter em troca de taxa preferencial.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0 }}>•</span>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Red flag em negociacoes
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Cuidado com MDR muito baixo que escondem custos em antecipacao cara, cobram por servicos
              antes incluidos, ou vem com SLA de suporte degradado. Sempre negocie o custo total
              (MDR + antecipacao + fees + suporte), nunca apenas o MDR headline.
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
          Unit Economics & Pricing Models
        </h1>
        <p className="page-description">
          Guia completo sobre a economia de pagamentos: anatomia do MDR, modelos de precificacao,
          unit economics de PSPs e adquirentes, estrategias de pricing e negociacao de taxas.
          Inclui simulacoes de revenue e comparativos Brasil vs mercados globais.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Decompor o MDR em interchange, scheme fee e margem do adquirente</li>
          <li>Comparar modelos de precificacao e quando usar cada um</li>
          <li>Calcular unit economics de PSPs e adquirentes</li>
          <li>Simular revenue para diferentes cenarios de mercado</li>
          <li>Negociar taxas com inteligencia usando dados de mercado</li>
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
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Modelos</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>7</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Mercados</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Hidden Costs</div>
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
            { name: "Go-to-Market", href: "/knowledge/go-to-market" },
            { name: "Merchant Segmentation", href: "/knowledge/merchant-segmentation" },
            { name: "Vendor Selection & RFP", href: "/knowledge/vendor-selection" },
            { name: "Antecipacao de Recebiveis", href: "/knowledge/antecipacao-recebiveis" },
            { name: "Embedded Finance", href: "/knowledge/embedded-finance" },
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
          Fontes: Relatorios publicos de Cielo, Stone, Adyen, Stripe. Regulacao BACEN.
          Tabelas de interchange Visa/Mastercard. Dados sao estimativas baseadas em informacoes publicas.
        </p>
      </div>
    </div>
  );
}
