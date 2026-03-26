"use client";

import { useState } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Styles
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

const codeBlockStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  background: "#1e1e2e",
  border: "1px solid var(--border)",
  fontFamily: "monospace",
  fontSize: "0.8rem",
  color: "#cdd6f4",
  overflowX: "auto",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  lineHeight: 1.6,
  whiteSpace: "pre",
};

const warningBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(239,68,68,0.25)",
  background: "rgba(239,68,68,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const greenBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(16,185,129,0.25)",
  background: "rgba(16,185,129,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const orangeBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(245,158,11,0.25)",
  background: "rgba(245,158,11,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

// ---------------------------------------------------------------------------
// Simulador Component
// ---------------------------------------------------------------------------

function MDRSimulator() {
  const [volume, setVolume] = useState(100000);
  const [mix1x, setMix1x] = useState(20);
  const [mix2x, setMix2x] = useState(10);
  const [mix3x, setMix3x] = useState(15);
  const [mix6x, setMix6x] = useState(20);
  const [mix10x, setMix10x] = useState(20);
  const [mix12x, setMix12x] = useState(15);

  const rates: Record<string, number> = { "1x": 1.8, "2x": 2.2, "3x": 2.5, "6x": 3.0, "10x": 3.5, "12x": 3.8 };
  const mixes: Record<string, number> = { "1x": mix1x, "2x": mix2x, "3x": mix3x, "6x": mix6x, "10x": mix10x, "12x": mix12x };

  const totalMix = Object.values(mixes).reduce((a, b) => a + b, 0);
  const weightedMDR = Object.entries(rates).reduce((acc, [key, rate]) => acc + (mixes[key] / 100) * rate, 0);
  const totalCost = volume * (weightedMDR / 100);

  const inputStyle: React.CSSProperties = {
    padding: "0.5rem",
    borderRadius: 6,
    border: "1px solid var(--border)",
    background: "var(--background)",
    color: "var(--foreground)",
    fontSize: "0.8125rem",
    width: "100%",
  };

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Volume Mensal (R$)</label>
          <input type="number" value={volume} onChange={(e) => setVolume(Number(e.target.value))} style={inputStyle} />
        </div>
        {Object.entries(mixes).map(([key, val]) => (
          <div key={key}>
            <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Mix {key} (%)</label>
            <input
              type="number"
              value={val}
              min={0}
              max={100}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (key === "1x") setMix1x(v);
                else if (key === "2x") setMix2x(v);
                else if (key === "3x") setMix3x(v);
                else if (key === "6x") setMix6x(v);
                else if (key === "10x") setMix10x(v);
                else if (key === "12x") setMix12x(v);
              }}
              style={inputStyle}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
        <div style={{ padding: "0.75rem", borderRadius: 8, background: "var(--primary-bg)", textAlign: "center" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>{weightedMDR.toFixed(2)}%</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>MDR Medio Ponderado</div>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, background: "var(--primary-bg)", textAlign: "center" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>R$ {totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Custo Total MDR</div>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, background: totalMix === 100 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", textAlign: "center" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: totalMix === 100 ? "#10b981" : "#ef4444" }}>{totalMix}%</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Soma do Mix {totalMix !== 100 ? "(deve = 100%)" : ""}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function InstallmentsDeepDivePage() {
  const { visitPage } = useGameProgress();

  useState(() => {
    visitPage("/knowledge/installments");
  });

  const sections: Section[] = [
    // -----------------------------------------------------------------------
    // 1. Visao Geral
    // -----------------------------------------------------------------------
    {
      id: "visao-geral",
      title: "Visao Geral do Parcelamento",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Parcelamento e o mecanismo que permite ao consumidor dividir o valor de uma compra em
            multiplas parcelas, geralmente mensais, cobradas no cartao de credito. No Brasil, esse
            recurso nao e apenas uma conveniencia — e a espinha dorsal do consumo. Mais de 70% das
            transacoes de cartao de credito no Brasil sao parceladas, um volume que nao encontra
            paralelo em nenhum outro pais do mundo.
          </p>
          <p style={paragraphStyle}>
            A razao historica e estrutural: o Brasil tem uma das maiores taxas de juros do mundo e
            renda per capita relativamente baixa. O parcelamento &quot;sem juros&quot; (parcelado lojista)
            emergiu como um mecanismo de credito ao consumo que permite acesso a bens de maior valor.
            Um smartphone de R$3.000 e inacessivel para a maioria, mas 12x de R$250 cabe no orcamento.
          </p>
          <p style={subheadingStyle}>Comparacao Global</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Regiao</th>
                  <th style={thStyle}>Modelo Predominante</th>
                  <th style={thStyle}>Peculiaridades</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Brasil</td><td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>Parcelado lojista (sem juros)</td><td style={tdStyle}>70%+ das txns de credito. Ate 12x sem juros e norma de mercado</td></tr>
                <tr><td style={tdStyle}>Mexico</td><td style={tdStyle}>MSI (Meses sin Intereses)</td><td style={tdStyle}>Similar ao BR, mas com limites por bandeira/emissor. 3, 6, 9, 12 MSI</td></tr>
                <tr><td style={tdStyle}>Argentina</td><td style={tdStyle}>Ahora 12 / Cuotas</td><td style={tdStyle}>Programa estatal &quot;Ahora 12&quot;, parcelas com juros subsidiados</td></tr>
                <tr><td style={tdStyle}>Europa</td><td style={tdStyle}>BNPL (Buy Now Pay Later)</td><td style={tdStyle}>Klarna, Afterpay. Nao usa cartao de credito tradicional. Regulacao crescente</td></tr>
                <tr><td style={tdStyle}>EUA</td><td style={tdStyle}>BNPL / Pay in 4</td><td style={tdStyle}>Raro em cartoes. BNPL cresce (Affirm, Klarna). Apple Pay Later descontinuado</td></tr>
                <tr><td style={tdStyle}>Turquia</td><td style={tdStyle}>Taksit</td><td style={tdStyle}>Muito similar ao BR. Ate 12x sem juros. Alto uso em e-commerce</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Regulacao BCB
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              A Circular 3.952/2019 do Banco Central regulamenta os arranjos de pagamento e
              estabelece regras sobre a liquidacao de transacoes parceladas. O BCB tambem
              determinou a portabilidade dos recebiveis de cartao (Resolucao 4.734/2019),
              permitindo que merchants antecipem recebiveis com qualquer instituicao financeira,
              nao apenas o adquirente.
            </p>
          </div>
          <p style={paragraphStyle}>
            Existem 4 modelos fundamentais de parcelamento, cada um com implicacoes distintas para
            fluxo de caixa, risco de credito, interchange e experiencia do portador. Nas secoes
            seguintes, vamos dissecar cada um.
          </p>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 2. Parcelado Lojista
    // -----------------------------------------------------------------------
    {
      id: "parcelado-lojista",
      title: "Parcelado Lojista (Merchant Installments)",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            No parcelado lojista, quem financia e o proprio merchant. O portador ve &quot;12x sem juros&quot;
            no checkout, mas nos bastidores o merchant esta abrindo mao de receber o valor total
            imediatamente. Em vez de receber R$1.200 em D+30, ele recebe R$100 por mes durante
            12 meses (D+30, D+60, D+90... D+360).
          </p>
          <p style={paragraphStyle}>
            Para o emissor, a transacao e tratada como uma compra a vista — o portador usa o limite
            do cartao pelo valor total (R$1.200), e o emissor repassa ao adquirente em uma unica
            liquidacao. O adquirente, por sua vez, retém o valor e libera parcelas mensais ao merchant.
          </p>
          <p style={subheadingStyle}>Fluxo Financeiro Detalhado</p>
          <div style={codeBlockStyle}>{`Venda: R$1.200 em 12x sem juros (parcelado lojista)

Portador:  Paga 12x R$100 no cartao (usa R$1.200 de limite)
Emissor:   Recebe R$1.200 do portador ao longo de 12 meses
           Repassa ao adquirente: R$1.200 - interchange (em D+1/D+2)
Adquirente: Recebe do emissor, retém e libera ao merchant:
           D+30:  R$100 - MDR parcela 1
           D+60:  R$100 - MDR parcela 2
           D+90:  R$100 - MDR parcela 3
           ...
           D+360: R$100 - MDR parcela 12
Merchant:  Recebe ~R$96.20/mes (MDR 3.8% por parcela)`}</div>

          <p style={subheadingStyle}>Tabela de Custo Efetivo por Parcelas</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Parcelas</th>
                  <th style={thStyle}>MDR Tipico</th>
                  <th style={thStyle}>Valor Bruto/Parcela</th>
                  <th style={thStyle}>Valor Liquido/Parcela</th>
                  <th style={thStyle}>Receita Liquida Total</th>
                  <th style={thStyle}>Custo Oportunidade (CDI)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>1x</td><td style={tdStyle}>1.8%</td><td style={tdStyle}>R$1.200,00</td><td style={tdStyle}>R$1.178,40</td><td style={{ ...tdStyle, fontWeight: 600, color: "#10b981" }}>R$1.178,40</td><td style={tdStyle}>R$0</td></tr>
                <tr><td style={tdStyle}>2x</td><td style={tdStyle}>2.2%</td><td style={tdStyle}>R$600,00</td><td style={tdStyle}>R$586,80</td><td style={tdStyle}>R$1.173,60</td><td style={tdStyle}>R$6,50</td></tr>
                <tr><td style={tdStyle}>3x</td><td style={tdStyle}>2.5%</td><td style={tdStyle}>R$400,00</td><td style={tdStyle}>R$390,00</td><td style={tdStyle}>R$1.170,00</td><td style={tdStyle}>R$13,00</td></tr>
                <tr><td style={tdStyle}>6x</td><td style={tdStyle}>3.0%</td><td style={tdStyle}>R$200,00</td><td style={tdStyle}>R$194,00</td><td style={tdStyle}>R$1.164,00</td><td style={tdStyle}>R$32,50</td></tr>
                <tr><td style={tdStyle}>10x</td><td style={tdStyle}>3.5%</td><td style={tdStyle}>R$120,00</td><td style={tdStyle}>R$115,80</td><td style={tdStyle}>R$1.158,00</td><td style={tdStyle}>R$56,00</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>12x</td><td style={{ ...tdStyle, color: "#ef4444" }}>3.8%</td><td style={tdStyle}>R$100,00</td><td style={tdStyle}>R$96,20</td><td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>R$1.154,40</td><td style={tdStyle}>R$72,00</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{ ...paragraphStyle, fontSize: "0.8rem", fontStyle: "italic" }}>
            * Custo de oportunidade calculado com CDI de 13% a.a. sobre o valor que o merchant deixa de receber antecipadamente.
          </p>

          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Risco de Chargeback em Parcelas Futuras
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se o portador abre um chargeback na parcela 6 de uma venda 12x, o merchant pode perder
              nao apenas aquela parcela, mas todas as parcelas restantes (7 a 12) que ainda nao foram
              liquidadas. O adquirente debita o merchant retroativamente. Isso amplifica o risco
              financeiro do parcelamento longo.
            </p>
          </div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 3. Parcelado Emissor
    // -----------------------------------------------------------------------
    {
      id: "parcelado-emissor",
      title: "Parcelado Emissor (Issuer Installments)",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            No parcelado emissor, o banco emissor do cartao financia o parcelamento. O merchant
            recebe o valor total da venda em D+30 (menos o MDR padrao de venda a vista), enquanto
            o portador paga parcelas mensais com juros ao emissor. Esse modelo e vantajoso para
            o merchant porque nao impacta o fluxo de caixa e nao altera o MDR.
          </p>
          <p style={paragraphStyle}>
            O emissor assume integralmente o risco de credito: se o portador nao pagar as parcelas,
            a cobranca e responsabilidade do banco. O merchant ja recebeu o valor total. Por isso,
            os juros cobrados pelo emissor sao significativos — tipicamente entre 2% e 15% ao mes,
            dependendo do perfil do cliente e do emissor.
          </p>
          <p style={subheadingStyle}>Fluxo Financeiro Detalhado</p>
          <div style={codeBlockStyle}>{`Venda: R$1.200 — portador escolhe parcelar com o emissor em 12x

Transacao:  Autorizada como venda a vista de R$1.200
Merchant:   Recebe R$1.164,00 em D+30 (MDR 3.0% padrao a vista)
            ✅ Fluxo de caixa intacto — dinheiro total em 30 dias.

Emissor:    Repassa R$1.200 ao adquirente normalmente
            Cobra do portador: 12x R$120,00 + juros (ex: 5% a.m.)
            Portador paga: 12x ~R$153,60 = R$1.843,20 total
            Receita do emissor: R$1.843,20 - R$1.200 = R$643,20

Portador:   Parcelas de ~R$153,60/mes no cartao (com juros)
            Limite bloqueado: R$1.200 (liberado conforme paga)`}</div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Quando o portador usa parcelado emissor?
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Tipicamente quando o merchant nao oferece parcelado lojista (ex: supermercados, postos
              de gasolina), ou quando o portador quer mais parcelas do que o lojista oferece. Alguns
              emissores permitem que o portador converta qualquer compra a vista em parcelado emissor
              pelo app do banco, mesmo apos a compra.
            </p>
          </div>

          <p style={subheadingStyle}>Comparacao: Parcelado Lojista vs Emissor</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Parcelado Lojista</th>
                  <th style={thStyle}>Parcelado Emissor</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Quem financia</td><td style={tdStyle}>Merchant</td><td style={tdStyle}>Emissor (banco)</td></tr>
                <tr><td style={tdStyle}>Juros para portador</td><td style={{ ...tdStyle, color: "#10b981" }}>Sem juros</td><td style={{ ...tdStyle, color: "#ef4444" }}>2-15% a.m.</td></tr>
                <tr><td style={tdStyle}>Recebimento merchant</td><td style={{ ...tdStyle, color: "#ef4444" }}>Parcelado (D+30, D+60...)</td><td style={{ ...tdStyle, color: "#10b981" }}>A vista (D+30 total)</td></tr>
                <tr><td style={tdStyle}>Impacto no MDR</td><td style={tdStyle}>MDR maior por parcela</td><td style={tdStyle}>MDR padrao a vista</td></tr>
                <tr><td style={tdStyle}>Risco de credito</td><td style={tdStyle}>Merchant (via chargeback)</td><td style={tdStyle}>Emissor (inadimplencia)</td></tr>
                <tr><td style={tdStyle}>Limite do portador</td><td style={tdStyle}>Bloqueado valor total</td><td style={tdStyle}>Bloqueado valor total</td></tr>
                <tr><td style={tdStyle}>Atratividade comercial</td><td style={{ ...tdStyle, fontWeight: 600 }}>Alta (&quot;sem juros&quot;)</td><td style={tdStyle}>Baixa (juros visiveis)</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 4. Parcelado Hibrido
    // -----------------------------------------------------------------------
    {
      id: "parcelado-hibrido",
      title: "Parcelado Hibrido",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            O modelo hibrido combina parcelado lojista e parcelado emissor na mesma transacao.
            O merchant financia as primeiras parcelas (tipicamente 3-4x) e o emissor financia
            o restante. Esse modelo e usado por grandes varejistas que precisam equilibrar
            atratividade comercial (parcelamento longo) com saude financeira (fluxo de caixa).
          </p>

          <p style={subheadingStyle}>Exemplo: 12x sendo 3x Lojista + 9x Emissor</p>
          <div style={codeBlockStyle}>{`Venda: R$1.200 em 12x (hibrido: 3x lojista + 9x emissor)

Parcelas 1-3 (Lojista):
  Merchant recebe R$400/3 = R$133,33/mes em D+30, D+60, D+90
  MDR: 2.5% → Liquido: ~R$130/mes × 3 = R$390,00

Parcelas 4-12 (Emissor):
  Merchant recebe R$800 integral em D+30 (junto com parcela 1)
  MDR: 3.0% padrao → Liquido: R$776,00
  Portador paga 9x com juros ao emissor (~4% a.m.)
  Portador paga: 9x ~R$108 = R$972 (juros de R$172)

Total liquido merchant: R$390 + R$776 = R$1.166,00
vs. 12x lojista puro: R$1.154,40
vs. a vista: R$1.178,40`}</div>

          <p style={subheadingStyle}>Trade-offs</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Vantagem</th>
                  <th style={thStyle}>Desvantagem</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Fluxo de caixa melhor que parcelado lojista puro</td><td style={tdStyle}>Complexidade operacional na integracao</td></tr>
                <tr><td style={tdStyle}>Oferta de 12x com custo menor para o merchant</td><td style={tdStyle}>Portador paga juros nas parcelas do emissor</td></tr>
                <tr><td style={tdStyle}>Menor exposicao a chargeback em parcelas futuras</td><td style={tdStyle}>Nem todos os adquirentes/emissores suportam</td></tr>
                <tr><td style={tdStyle}>Atratividade: cliente ve &quot;12x&quot; no checkout</td><td style={tdStyle}>Comunicacao confusa se mal implementado</td></tr>
              </tbody>
            </table>
          </div>

          <div style={orangeBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#d97706", marginBottom: "0.25rem" }}>
              Quando usar hibrido?
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Ideal para merchants com ticket medio alto (eletrônicos, moveis, eletrodomesticos) que
              precisam oferecer parcelamento longo mas nao podem comprometer o caixa por 12 meses.
              Requer negociacao especifica com adquirente e emissor.
            </p>
          </div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 5. Parcelado pelo Cliente (BNPL)
    // -----------------------------------------------------------------------
    {
      id: "bnpl",
      title: "Parcelado pelo Cliente (BNPL)",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            O modelo BNPL (Buy Now, Pay Later) e uma evolucao moderna do parcelamento. Em vez do
            emissor do cartao ou do merchant financiar, uma fintech ou provedor de credito
            especializado assume o papel. Exemplos globais incluem Klarna, Affirm, Afterpay; no
            Brasil, Mercado Credito, PicPay e bancos digitais oferecem variantes.
          </p>
          <p style={paragraphStyle}>
            A diferenca fundamental para o parcelado emissor: o BNPL nao usa o limite do cartao de
            credito. O provedor faz analise de credito propria (muitas vezes em tempo real, usando
            dados alternativos) e oferece uma linha especifica para aquela compra. O merchant
            recebe a vista, o provedor BNPL cobra do cliente.
          </p>

          <p style={subheadingStyle}>Fluxo BNPL</p>
          <div style={codeBlockStyle}>{`1. Cliente seleciona BNPL no checkout (ex: Mercado Credito)
2. Provedor BNPL faz analise de credito em tempo real (<2s)
3. Se aprovado: provedor paga merchant a vista (menos fee)
4. Merchant recebe valor em D+1 ou D+2
5. Cliente paga ao provedor BNPL em parcelas (boleto, PIX, debito)
6. Se cliente nao paga: inadimplencia e problema do provedor BNPL

Fee do provedor BNPL para merchant: tipicamente 3-6% flat
(vs. MDR de cartao parcelado: 2.5-3.8%)`}</div>

          <p style={subheadingStyle}>BNPL vs Parcelado Emissor</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>BNPL</th>
                  <th style={thStyle}>Parcelado Emissor</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Usa limite do cartao</td><td style={{ ...tdStyle, color: "#10b981" }}>Nao</td><td style={tdStyle}>Sim</td></tr>
                <tr><td style={tdStyle}>Analise de credito</td><td style={tdStyle}>Propria (dados alternativos)</td><td style={tdStyle}>Score bancario tradicional</td></tr>
                <tr><td style={tdStyle}>Publico-alvo</td><td style={tdStyle}>Underbanked, jovens, sem cartao</td><td style={tdStyle}>Portadores de cartao de credito</td></tr>
                <tr><td style={tdStyle}>Recebimento merchant</td><td style={{ ...tdStyle, color: "#10b981" }}>D+1 ou D+2</td><td style={tdStyle}>D+30</td></tr>
                <tr><td style={tdStyle}>Regulacao BR</td><td style={tdStyle}>Crescente (BCB + Senacon)</td><td style={tdStyle}>Consolidada (CMN)</td></tr>
              </tbody>
            </table>
          </div>

          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Riscos do Modelo BNPL
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Provedores BNPL enfrentam risco de inadimplencia significativo (5-10% em mercados
              emergentes). Diferente do emissor bancario, muitos BNPLs nao tem acesso a funding
              barato ou reservas regulatorias. Varios players globais (Afterpay, Zip) tiveram
              prejuizos bilionarios. No Brasil, a regulacao esta se endurecendo — o BCB e a
              Senacon discutem regras especificas para BNPL em 2025-2026.
            </p>
          </div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 6. Fluxo de Autorizacao por Modelo
    // -----------------------------------------------------------------------
    {
      id: "fluxo-autorizacao",
      title: "Fluxo de Autorizacao por Modelo (ISO 8583)",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Cada modelo de parcelamento tem um comportamento distinto na mensageria ISO 8583
            (o protocolo padrao de autorizacao de transacoes de cartao). Entender como o
            parcelamento e codificado na mensagem e essencial para quem trabalha com integracao
            de gateways e adquirentes.
          </p>

          <p style={subheadingStyle}>Parcelado Lojista</p>
          <div style={codeBlockStyle}>{`MTI: 0100 (Authorization Request)
DE3  (Processing Code):    003000  (purchase, installment)
DE25 (POS Condition Code): 28      (installment transaction)
DE48 (Additional Data):    Installment data (varies by acquirer)
DE63 (Private Data):       Number of installments (ex: 012)
                           First installment amount
                           Subsequent installment amount

Exemplo Cielo:
DE63.022 = "012"  (12 parcelas)
DE63.023 = "000000010000" (R$100,00 por parcela)`}</div>

          <p style={subheadingStyle}>Parcelado Emissor</p>
          <div style={codeBlockStyle}>{`MTI: 0100 (Authorization Request)
DE3  (Processing Code):    000000  (purchase — NORMAL, a vista)
DE25 (POS Condition Code): 00      (normal transaction)

A transacao e enviada como COMPRA A VISTA.
O emissor, internamente, parcela para o portador.
Nenhum campo de parcelamento e enviado na ISO 8583.
A decisao de parcelar e do emissor, pos-autorizacao.`}</div>

          <p style={subheadingStyle}>Parcelado Hibrido</p>
          <div style={codeBlockStyle}>{`Depende do adquirente. Exemplo Rede/Getnet:
DE48: Flag indicando hibrido
DE63: Numero total de parcelas (12)
      Parcelas lojista (03)
      Parcelas emissor (09)

Nao e padronizado — cada adquirente tem campos privados
diferentes. Requer documentacao especifica do adquirente.`}</div>

          <p style={subheadingStyle}>BNPL</p>
          <div style={codeBlockStyle}>{`Nao usa ISO 8583 para o parcelamento.

A transacao de pagamento (se houver) e uma compra a vista:
MTI: 0100
DE3:  000000 (purchase normal)
DE25: 00     (normal)

O parcelamento e uma relacao contratual SEPARADA entre
o provedor BNPL e o cliente. O merchant recebe a vista.
O BNPL usa APIs proprietarias, nao ISO 8583.`}</div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Implicacao pratica
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Um erro comum em integracoes e enviar uma transacao parcelado lojista com os campos
              de parcelamento incorretos. Isso pode resultar em autorizacao como venda a vista
              (merchant recebe tudo em D+30, mas com MDR de a vista, e o portador e cobrado de uma
              vez), ou recusa pela bandeira/emissor.
            </p>
          </div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 7. Impacto no Interchange
    // -----------------------------------------------------------------------
    {
      id: "interchange",
      title: "Impacto no Interchange",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            O interchange rate (taxa interbancaria paga pelo adquirente ao emissor) varia
            significativamente com o numero de parcelas. Mais parcelas = maior interchange, porque
            o emissor precisa financiar o repasse ao adquirente enquanto aguarda o pagamento do
            portador. Essa dinamica e crucial para entender o custo real do parcelamento.
          </p>

          <p style={subheadingStyle}>Tabela de Interchange por Bandeira e Parcelas</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Parcelas</th>
                  <th style={thStyle}>Visa (credito)</th>
                  <th style={thStyle}>Mastercard (credito)</th>
                  <th style={thStyle}>Elo (credito)</th>
                  <th style={thStyle}>Impacto</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>1x (a vista)</td><td style={tdStyle}>1.20%</td><td style={tdStyle}>1.15%</td><td style={tdStyle}>1.05%</td><td style={{ ...tdStyle, color: "#10b981" }}>Baseline</td></tr>
                <tr><td style={tdStyle}>2x</td><td style={tdStyle}>1.65%</td><td style={tdStyle}>1.60%</td><td style={tdStyle}>1.45%</td><td style={tdStyle}>+0.40-0.45pp</td></tr>
                <tr><td style={tdStyle}>3x</td><td style={tdStyle}>1.80%</td><td style={tdStyle}>1.75%</td><td style={tdStyle}>1.60%</td><td style={tdStyle}>+0.55-0.60pp</td></tr>
                <tr><td style={tdStyle}>6x</td><td style={tdStyle}>2.00%</td><td style={tdStyle}>1.95%</td><td style={tdStyle}>1.80%</td><td style={tdStyle}>+0.75-0.80pp</td></tr>
                <tr><td style={tdStyle}>10x</td><td style={tdStyle}>2.15%</td><td style={tdStyle}>2.10%</td><td style={tdStyle}>1.95%</td><td style={tdStyle}>+0.90-0.95pp</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>12x</td><td style={{ ...tdStyle, color: "#ef4444" }}>2.25%</td><td style={{ ...tdStyle, color: "#ef4444" }}>2.20%</td><td style={{ ...tdStyle, color: "#ef4444" }}>2.05%</td><td style={{ ...tdStyle, color: "#ef4444" }}>+0.95-1.05pp</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{ ...paragraphStyle, fontSize: "0.8rem", fontStyle: "italic" }}>
            * Valores representativos de mercado. Interchange real varia por categoria de merchant (MCC), tipo de cartao (standard/premium/corporate) e acordo bilateral.
          </p>

          <p style={subheadingStyle}>IC++ vs Blended: Impacto do Parcelamento</p>
          <p style={paragraphStyle}>
            Em modelos IC++ (Interchange Plus Plus), o merchant paga interchange + scheme fee +
            margem do adquirente. Nesse caso, o custo do parcelamento e transparente — o merchant
            ve exatamente quanto o interchange aumentou. Em modelos blended (taxa unica), o
            adquirente absorve a variacao de interchange e cobra uma taxa fixa por faixa de parcelas.
          </p>
          <div style={codeBlockStyle}>{`IC++ (transparente):
  1x: 1.20% (interchange) + 0.10% (scheme) + 0.50% (acquirer) = 1.80%
  12x: 2.25% (interchange) + 0.10% (scheme) + 0.50% (acquirer) = 2.85%
  Diferenca visivel: +1.05pp

Blended (opaco):
  1x: 1.80% (taxa unica)
  12x: 3.80% (taxa unica)
  Diferenca visivel: +2.00pp (adquirente embute margem extra)

Em IC++, o merchant tem visibilidade e pode negociar.
Em blended, o adquirente captura margem adicional no parcelado.`}</div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 8. Impacto no Chargeback
    // -----------------------------------------------------------------------
    {
      id: "chargeback",
      title: "Impacto no Chargeback",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Chargebacks em transacoes parceladas sao significativamente mais complexos do que em
            transacoes a vista. Quando um portador disputa uma transacao parcelada, a pergunta
            central e: disputa-se o valor total ou apenas uma parcela? A resposta depende da
            bandeira, do reason code e do timing.
          </p>

          <p style={subheadingStyle}>Cenario 1: Chargeback na Parcela 3 de 12</p>
          <div style={codeBlockStyle}>{`Venda: R$1.200 em 12x parcelado lojista
Parcela 3 (D+90): portador disputa — "nao reconheco"

Visa:
  - Chargeback sobre o VALOR TOTAL restante (parcelas 3-12)
  - Merchant perde R$1.000 (10 parcelas × R$100)
  - Parcelas 1-2 ja liquidadas nao sao afetadas
  - Merchant deve fazer representment mostrando entrega do produto

Mastercard:
  - Chargeback pode ser sobre parcela individual OU valor total
  - Depende do reason code
  - RC 4853 (goods not received): valor total
  - RC 4837 (fraud): valor total
  - RC 4860 (credit not processed): parcela individual

Elo:
  - Segue regras similares a Mastercard
  - Chargeback pode ser parcial ou total`}</div>

          <p style={subheadingStyle}>Cenario 2: Devolucao na Parcela 1, Parcelas Continuam</p>
          <div style={codeBlockStyle}>{`Venda: R$1.200 em 12x, produto devolvido na semana 1
Merchant processa estorno total? Ou parcial?

Correto: Merchant deve processar REFUND TOTAL (R$1.200)
  - Adquirente cancela todas as parcelas futuras
  - Parcelas ja liquidadas sao debitadas do merchant
  - Portador recebe credito total na fatura

ERRO COMUM: Merchant faz refund apenas da parcela 1 (R$100)
  - Portador continua sendo cobrado nas parcelas 2-12
  - Portador abre chargeback por "credito nao processado"
  - Merchant perde o chargeback + taxa de chargeback (~R$50)`}</div>

          <p style={subheadingStyle}>Cenario 3: Representment em Parcelado</p>
          <p style={paragraphStyle}>
            Para defender um chargeback em transacao parcelada, o merchant precisa demonstrar
            que o servico/produto foi entregue integralmente na parcela 1. Evidencias criticas:
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Evidencia</th>
                  <th style={thStyle}>Peso</th>
                  <th style={thStyle}>Descricao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Comprovante de entrega com assinatura</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>Alto</td><td style={tdStyle}>Tracking + foto de entrega + assinatura digital</td></tr>
                <tr><td style={tdStyle}>IP e device fingerprint do checkout</td><td style={tdStyle}>Medio</td><td style={tdStyle}>Prova que o portador iniciou a compra</td></tr>
                <tr><td style={tdStyle}>3DS authentication data</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>Alto</td><td style={tdStyle}>Se 3DS foi usado, liability shift protege o merchant</td></tr>
                <tr><td style={tdStyle}>Historico de compras do cliente</td><td style={tdStyle}>Baixo</td><td style={tdStyle}>Mostra padrao de compra legitimo</td></tr>
                <tr><td style={tdStyle}>Nota fiscal eletronica</td><td style={tdStyle}>Medio</td><td style={tdStyle}>Prova fiscal da transacao</td></tr>
              </tbody>
            </table>
          </div>

          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Chargeback rate em parcelados longos
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Transacoes parceladas em 10-12x tem chargeback rate 2-3x maior que transacoes a vista.
              Razao: o portador tem mais tempo para &quot;esquecer&quot; a compra, a satisfacao com o produto
              diminui ao longo do tempo, e a probabilidade de fraude friendly (chargeback por
              conveniencia) aumenta. Merchants com alto % de 12x devem monitorar isso de perto.
            </p>
          </div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 9. Antecipacao de Recebiveis
    // -----------------------------------------------------------------------
    {
      id: "antecipacao",
      title: "Antecipacao de Recebiveis",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            A antecipacao de recebiveis e a solucao direta para o problema de caixa do parcelado
            lojista. Se o merchant vendeu R$1.200 em 12x e receberia R$100/mes por 12 meses,
            ele pode &quot;vender&quot; esses recebiveis futuros para uma instituicao financeira e
            receber o valor antecipado, com um desagio (desconto).
          </p>
          <p style={paragraphStyle}>
            A instituicao que antecipa pode ser o proprio adquirente, um banco, uma FIDC (Fundo de
            Investimento em Direitos Creditorios), ou qualquer instituicao autorizada pelo BCB.
            A taxa de desagio tipica varia entre 1.5% e 3.5% ao mes, dependendo do risco do
            merchant e do prazo.
          </p>

          <p style={subheadingStyle}>Calculo de Antecipacao</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Parcela</th>
                  <th style={thStyle}>Vencimento</th>
                  <th style={thStyle}>Valor Nominal</th>
                  <th style={thStyle}>Desagio (2.5% a.m.)</th>
                  <th style={thStyle}>Valor Antecipado</th>
                  <th style={thStyle}>Custo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>1</td><td style={tdStyle}>D+30</td><td style={tdStyle}>R$100,00</td><td style={tdStyle}>R$2,50</td><td style={tdStyle}>R$97,50</td><td style={tdStyle}>2.5%</td></tr>
                <tr><td style={tdStyle}>2</td><td style={tdStyle}>D+60</td><td style={tdStyle}>R$100,00</td><td style={tdStyle}>R$5,00</td><td style={tdStyle}>R$95,00</td><td style={tdStyle}>5.0%</td></tr>
                <tr><td style={tdStyle}>3</td><td style={tdStyle}>D+90</td><td style={tdStyle}>R$100,00</td><td style={tdStyle}>R$7,50</td><td style={tdStyle}>R$92,50</td><td style={tdStyle}>7.5%</td></tr>
                <tr><td style={tdStyle}>6</td><td style={tdStyle}>D+180</td><td style={tdStyle}>R$100,00</td><td style={tdStyle}>R$15,00</td><td style={tdStyle}>R$85,00</td><td style={tdStyle}>15.0%</td></tr>
                <tr><td style={tdStyle}>9</td><td style={tdStyle}>D+270</td><td style={tdStyle}>R$100,00</td><td style={tdStyle}>R$22,50</td><td style={tdStyle}>R$77,50</td><td style={tdStyle}>22.5%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>12</td><td style={tdStyle}>D+360</td><td style={tdStyle}>R$100,00</td><td style={{ ...tdStyle, color: "#ef4444" }}>R$30,00</td><td style={{ ...tdStyle, color: "#ef4444" }}>R$70,00</td><td style={{ ...tdStyle, color: "#ef4444" }}>30.0%</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            Antecipando todas as 12 parcelas de R$100, o merchant receberia ~R$1.044,50 em vez de
            R$1.200 ao longo de 12 meses. O custo efetivo da antecipacao total: ~13% do valor nominal.
            Somado ao MDR (3.8%), o custo total da venda 12x antecipada chega a ~16.8% do valor bruto.
          </p>

          <p style={subheadingStyle}>Registradoras de Recebiveis</p>
          <p style={paragraphStyle}>
            Desde 2021, o BCB obriga que todos os recebiveis de cartao sejam registrados em uma
            registradora autorizada: CERC, CIP (B3/Nuclea) ou TAG (B3). Isso permite:
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.8 }}>
              <strong>CERC</strong> — Camara Interbancaria de Pagamentos. Maior registradora de recebiveis do Brasil.<br />
              <strong>CIP/Nuclea</strong> — Infraestrutura de pagamentos do sistema financeiro. Opera a registradora de recebiveis.<br />
              <strong>TAG (B3)</strong> — Registradora ligada a bolsa de valores.<br /><br />
              Funcao principal: permitir que o merchant grave seus recebiveis como garantia e negocie
              antecipacao com qualquer instituicao, nao apenas o adquirente original. Isso aumenta a
              concorrencia e reduz o custo de antecipacao.
            </p>
          </div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 10. Regulacao BCB
    // -----------------------------------------------------------------------
    {
      id: "regulacao",
      title: "Regulacao BCB",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            O Banco Central do Brasil tem papel ativo na regulacao do parcelamento e da antecipacao
            de recebiveis, buscando aumentar a concorrencia, proteger o merchant e reduzir custos
            sistemicos.
          </p>

          <p style={subheadingStyle}>Marcos Regulatorios Chave</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Regulacao</th>
                  <th style={thStyle}>Ano</th>
                  <th style={thStyle}>Impacto</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Circular 3.952</td><td style={tdStyle}>2019</td><td style={tdStyle}>Regulamenta arranjos de pagamento. Define regras de liquidacao de transacoes parceladas entre adquirentes e emissores.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Resolucao CMN 4.734</td><td style={tdStyle}>2019</td><td style={tdStyle}>Arranjos de pagamento devem garantir interoperabilidade. Portabilidade de recebiveis entre instituicoes.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Resolucao BCB 24</td><td style={tdStyle}>2020</td><td style={tdStyle}>Regras de registro de recebiveis. Obriga registro em registradoras autorizadas (CERC, CIP, TAG).</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Resolucao CMN 4.893</td><td style={tdStyle}>2021</td><td style={tdStyle}>Merchant pode constituir recebiveis como garantia e negocia-los com qualquer instituicao financeira.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Consulta Publica BCB 98</td><td style={tdStyle}>2023</td><td style={tdStyle}>Discussao sobre limites de parcelamento sem juros e impacto no sistema financeiro.</td></tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Agenda de Recebiveis</p>
          <p style={paragraphStyle}>
            A &quot;agenda de recebiveis&quot; e o cronograma de todos os valores que um merchant tem a receber
            dos adquirentes. Inclui vendas a vista e cada parcela de vendas parceladas. Com a
            obrigatoriedade de registro, o merchant pode visualizar sua agenda completa e usar
            como garantia para credito.
          </p>

          <div style={codeBlockStyle}>{`Agenda de Recebiveis — Merchant "Loja XYZ" (CNPJ 12.345.678/0001-90)

Adquirente: Cielo
  D+30 (01/04): R$45.200,00 (vendas a vista + parcela 1 de parcelados)
  D+60 (01/05): R$38.100,00 (parcelas 2 de vendas parceladas)
  D+90 (01/06): R$31.400,00 (parcelas 3)
  ...
  D+360 (01/03 prox): R$8.200,00 (parcelas 12)

Adquirente: Rede
  D+30: R$22.800,00
  D+60: R$18.500,00
  ...

Total agenda: R$420.000,00 em 12 meses
Disponivel para antecipacao: R$374.800,00 (descontando ja antecipados)
Disponivel como garantia: R$374.800,00`}</div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Impacto na concorrencia
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Antes da regulacao, o merchant so podia antecipar recebiveis com o proprio adquirente
              (ex: Cielo antecipa recebiveis da Cielo). Com a portabilidade, o merchant pode pegar
              recebiveis da Cielo e antecipar no Itau, ou usar como garantia para um emprestimo no
              Nubank. Isso reduziu a taxa media de antecipacao de ~3.5% a.m. para ~2.0% a.m. entre
              2019 e 2024.
            </p>
          </div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 11. Parcelamento e MDR
    // -----------------------------------------------------------------------
    {
      id: "mdr",
      title: "Parcelamento e MDR",
      icon: "11",
      content: (
        <>
          <p style={paragraphStyle}>
            O MDR (Merchant Discount Rate) e a taxa que o adquirente cobra do merchant por cada
            transacao. No Brasil, o MDR varia significativamente com o numero de parcelas, criando
            uma escala de custo que o merchant precisa entender para precificar corretamente.
          </p>

          <p style={subheadingStyle}>Formula do MDR Efetivo</p>
          <div style={codeBlockStyle}>{`MDR_efetivo = MDR_base + (parcelas - 1) × spread_por_parcela

Onde:
  MDR_base = taxa para transacao a vista (tipicamente 1.8%)
  spread_por_parcela = incremento por cada parcela adicional
                       (tipicamente 0.15-0.20% por parcela)

Exemplo:
  MDR 1x  = 1.80% (base)
  MDR 2x  = 1.80% + 1 × 0.20% = 2.00% → negociado: 2.20%
  MDR 3x  = 1.80% + 2 × 0.20% = 2.20% → negociado: 2.50%
  MDR 6x  = 1.80% + 5 × 0.20% = 2.80% → negociado: 3.00%
  MDR 10x = 1.80% + 9 × 0.20% = 3.60% → negociado: 3.50%
  MDR 12x = 1.80% + 11 × 0.20% = 4.00% → negociado: 3.80%

Na pratica, adquirentes usam tabelas escalonadas negociadas,
nao uma formula linear. Volumes maiores = taxas menores.`}</div>

          <p style={subheadingStyle}>Tabela MDR de Mercado</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Parcelas</th>
                  <th style={thStyle}>MDR Medio</th>
                  <th style={thStyle}>Range de Mercado</th>
                  <th style={thStyle}>Custo em R$1.000</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>1x</td><td style={tdStyle}>1.80%</td><td style={tdStyle}>1.2% - 2.5%</td><td style={tdStyle}>R$18,00</td></tr>
                <tr><td style={tdStyle}>2x</td><td style={tdStyle}>2.20%</td><td style={tdStyle}>1.8% - 3.0%</td><td style={tdStyle}>R$22,00</td></tr>
                <tr><td style={tdStyle}>3x</td><td style={tdStyle}>2.50%</td><td style={tdStyle}>2.0% - 3.3%</td><td style={tdStyle}>R$25,00</td></tr>
                <tr><td style={tdStyle}>6x</td><td style={tdStyle}>3.00%</td><td style={tdStyle}>2.5% - 3.8%</td><td style={tdStyle}>R$30,00</td></tr>
                <tr><td style={tdStyle}>10x</td><td style={tdStyle}>3.50%</td><td style={tdStyle}>3.0% - 4.5%</td><td style={tdStyle}>R$35,00</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>12x</td><td style={{ ...tdStyle, color: "#ef4444" }}>3.80%</td><td style={tdStyle}>3.2% - 5.0%</td><td style={{ ...tdStyle, color: "#ef4444" }}>R$38,00</td></tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Simulador de MDR Medio Ponderado</p>
          <p style={paragraphStyle}>
            Insira seu volume mensal e o mix de parcelas para calcular o MDR medio ponderado real:
          </p>
          <MDRSimulator />
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 12. Casos Praticos
    // -----------------------------------------------------------------------
    {
      id: "casos-praticos",
      title: "Casos Praticos",
      icon: "12",
      content: (
        <>
          <p style={subheadingStyle}>Caso 1: E-commerce de Eletronicos</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.8 }}>
              <strong>Perfil:</strong> Loja online de smartphones e notebooks. Ticket medio: R$2.500. Volume: R$5M/mes.<br />
              <strong>Mix:</strong> 80% em 10-12x, 15% em 3-6x, 5% a vista.<br /><br />
              <strong>Problema:</strong> Com 80% em 12x, o merchant tem R$4M/mes em recebiveis futuros e recebe
              apenas ~R$400K/mes em caixa. Custo operacional mensal: R$600K. Caixa negativo de R$200K/mes.<br /><br />
              <strong>Solucao:</strong> Antecipacao automatica diaria dos recebiveis com taxa negociada de 1.8% a.m.
              (volume alto). Custo de antecipacao: ~R$43K/mes. Total custo (MDR + antecipacao): 4.7% do volume.
              Alternativa: negociar hibrido com emissor para reduzir parcelas lojista.
            </p>
          </div>

          <p style={subheadingStyle}>Caso 2: SaaS B2B — Recorrente vs Parcelado</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.8 }}>
              <strong>Perfil:</strong> Plataforma SaaS B2B. Plano anual: R$12.000. 500 clientes.<br /><br />
              <strong>Opcao A — Recorrencia:</strong> Cobra R$1.000/mes no cartao. Cada cobranca e uma transacao
              a vista (MDR 1.8%). Custo: R$18/mes por cliente. Risco: cliente cancela a qualquer momento.
              Receita previsivel mensal.<br /><br />
              <strong>Opcao B — Parcelado 12x:</strong> Cobra R$12.000 em 12x lojista. MDR 3.8%. Custo: R$456 total
              (vs R$216 em recorrencia). Mas cliente se compromete com 12 meses. Menor churn.<br /><br />
              <strong>Recomendacao:</strong> Para SaaS B2B, recorrencia e quase sempre melhor. Menor MDR, maior
              flexibilidade, e as bandeiras tem programas especificos (Visa Recurring, MC Recurring Payments)
              com interchange preferencial.
            </p>
          </div>

          <p style={subheadingStyle}>Caso 3: Marketplace — Split de Parcelado</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.8 }}>
              <strong>Perfil:</strong> Marketplace com 10K sellers. GMV: R$50M/mes. 60% em 6-12x.<br /><br />
              <strong>Desafio 1:</strong> Quem financia o parcelado? Se o marketplace assume, precisa de capital de
              giro massivo. Se o seller assume, muitos sellers pequenos nao aguentam o fluxo de caixa.<br /><br />
              <strong>Desafio 2:</strong> Split payment em parcelado. Venda de R$1.000 em 10x: marketplace fee 15%,
              seller recebe 85%. Cada parcela de R$100 e dividida: R$15 marketplace + R$85 seller. O
              adquirente (ou sub-adquirente) precisa fazer split automatico em cada liquidacao.<br /><br />
              <strong>Solucao:</strong> Marketplace antecipa para sellers (com markup) e absorve o risco de
              parcelamento. Usa sub-adquirente com split automatico (ex: Pagarme, Zoop). Custo: MDR 3.5%
              + antecipacao 2% = 5.5% do GMV. Marketplace repassa parte ao seller via taxa de servico.
            </p>
          </div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 13. Armadilhas Comuns
    // -----------------------------------------------------------------------
    {
      id: "armadilhas",
      title: "Armadilhas Comuns",
      icon: "13",
      content: (
        <>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>
              Erro 1: Nao calcular o custo de oportunidade do parcelado lojista
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Muitos merchants olham apenas o MDR e ignoram o custo de oportunidade de ter o
              dinheiro parado por 12 meses. Com CDI a 13% a.a., R$100 recebidos em 12 meses valem
              ~R$88 em valor presente. O custo real do 12x nao e 3.8% (MDR) — e 3.8% + ~10% (custo
              oportunidade) = ~13.8%. Se antecipar, adicione a taxa de antecipacao.
            </p>
          </div>

          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>
              Erro 2: Confundir parcelado lojista com parcelado emissor na integracao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Na API do adquirente, o campo &quot;installment_type&quot; diferencia os dois. Enviar
              &quot;merchant&quot; quando deveria ser &quot;issuer&quot; (ou vice-versa) resulta em: MDR incorreto cobrado,
              liquidacao em agenda errada, portador cobrado diferente do esperado. Sempre valide
              o tipo de parcelamento nos testes de integracao.
            </p>
          </div>

          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>
              Erro 3: Nao antecipar e ficar com caixa negativo
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Merchants com alto volume de parcelado lojista (especialmente 10-12x) frequentemente
              entram em crise de caixa nos primeiros meses de operacao. A receita existe (na agenda),
              mas o caixa nao. Regra: se mais de 50% do volume e parcelado em 6x+, antecipacao
              automatica e praticamente obrigatoria.
            </p>
          </div>

          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>
              Erro 4: Nao considerar chargeback rate maior em parcelados longos
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Transacoes 12x tem chargeback rate 2-3x maior que a vista. Isso nao aparece na analise
              de custo do parcelamento, mas impacta diretamente a rentabilidade. Se o chargeback rate
              em 12x e 1.5% (vs 0.5% em a vista), o custo adicional em uma venda de R$1.200 e R$18.
              Em volume, isso e significativo.
            </p>
          </div>

          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>
              Erro 5: Ignorar o impacto do parcelamento no limite do portador
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Uma compra de R$1.200 em 12x bloqueia R$1.200 do limite do cartao, nao R$100. Isso
              afeta a taxa de aprovacao: clientes com limite de R$2.000 que tentam comprar R$1.200
              em 12x precisam de 60% do limite disponivel. Se ja usaram R$1.000 do limite, a
              transacao sera recusada por &quot;insufficient funds&quot; — mesmo que a parcela mensal (R$100)
              caiba no limite. Isso reduz a conversao em parcelamentos longos com tickets altos.
            </p>
          </div>
        </>
      ),
    },

    // -----------------------------------------------------------------------
    // 14. Comparacao Internacional
    // -----------------------------------------------------------------------
    {
      id: "comparacao-internacional",
      title: "Comparacao Internacional",
      icon: "14",
      content: (
        <>
          <p style={paragraphStyle}>
            O parcelamento no cartao de credito e um fenomeno predominantemente latino-americano
            e de alguns mercados emergentes. Na maioria dos paises desenvolvidos, o conceito de
            &quot;parcelar no cartao sem juros&quot; simplesmente nao existe. Entender essas diferencas e
            essencial para quem trabalha com pagamentos cross-border.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Pais</th>
                  <th style={thStyle}>Nome Local</th>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Max Parcelas</th>
                  <th style={thStyle}>Quem Financia</th>
                  <th style={thStyle}>Peculiaridades</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Brasil</td>
                  <td style={tdStyle}>Parcelado</td>
                  <td style={tdStyle}>Lojista + Emissor</td>
                  <td style={tdStyle}>Ate 24x</td>
                  <td style={tdStyle}>Merchant ou Banco</td>
                  <td style={tdStyle}>70%+ das txns. &quot;Sem juros&quot; e norma. Regulacao BCB forte.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Mexico</td>
                  <td style={tdStyle}>MSI (Meses sin Intereses)</td>
                  <td style={tdStyle}>Lojista (merchant absorve)</td>
                  <td style={tdStyle}>3, 6, 9, 12, 18</td>
                  <td style={tdStyle}>Merchant</td>
                  <td style={tdStyle}>Requer BIN especifico do emissor. Nao funciona com todos os cartoes.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Colombia</td>
                  <td style={tdStyle}>Cuotas</td>
                  <td style={tdStyle}>Emissor (com juros)</td>
                  <td style={tdStyle}>Ate 36x</td>
                  <td style={tdStyle}>Banco</td>
                  <td style={tdStyle}>Juros sempre visiveis. Merchant nao financia. Diferente do BR.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Argentina</td>
                  <td style={tdStyle}>Ahora 12 / Cuotas</td>
                  <td style={tdStyle}>Governo + Banco</td>
                  <td style={tdStyle}>3, 6, 12, 18</td>
                  <td style={tdStyle}>Estado + Banco</td>
                  <td style={tdStyle}>Programa estatal &quot;Ahora 12&quot; subsidia juros. Inflacao alta distorce calculos.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Chile</td>
                  <td style={tdStyle}>Cuotas</td>
                  <td style={tdStyle}>Emissor (com juros)</td>
                  <td style={tdStyle}>Ate 48x</td>
                  <td style={tdStyle}>Banco</td>
                  <td style={tdStyle}>Portador escolhe parcelas no POS. Ate 48x com juros bancarios.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Turquia</td>
                  <td style={tdStyle}>Taksit</td>
                  <td style={tdStyle}>Lojista</td>
                  <td style={tdStyle}>Ate 12x</td>
                  <td style={tdStyle}>Merchant</td>
                  <td style={tdStyle}>Muito similar ao Brasil. &quot;Sem juros&quot; e norma. Alto uso em e-commerce.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Europa</td>
                  <td style={tdStyle}>BNPL</td>
                  <td style={tdStyle}>Fintech/BNPL</td>
                  <td style={tdStyle}>3-4x (Pay in 4)</td>
                  <td style={tdStyle}>Provedor BNPL</td>
                  <td style={tdStyle}>Klarna, Afterpay. Nao usa cartao. Regulacao EU crescente (2024+).</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>EUA</td>
                  <td style={tdStyle}>BNPL / Pay Later</td>
                  <td style={tdStyle}>Fintech/BNPL</td>
                  <td style={tdStyle}>4x (Pay in 4)</td>
                  <td style={tdStyle}>Provedor BNPL</td>
                  <td style={tdStyle}>Affirm, Klarna, Afterpay. Apple Pay Later encerrado. Crescimento rapido.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={greenBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#10b981", marginBottom: "0.25rem" }}>
              Por que o Brasil e unico?
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Tres fatores convergiram para criar o modelo brasileiro: (1) taxas de juros historicamente
              altas que tornam credito bancario inacessivel — o parcelado &quot;sem juros&quot; e um credito
              disfarçado; (2) cultura de consumo onde o parcelamento e socialmente aceito e esperado;
              (3) infraestrutura adquirente que desde os anos 90 suporta parcelamento nativo via
              bandeiras domesticas (Elo, Hipercard). Nenhum outro pais tem essa combinacao na mesma
              intensidade.
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
          Installments (Parcelamento) Deep Dive
        </h1>
        <p className="page-description">
          Guia completo e senior-level sobre parcelamento no Brasil: 4 modelos (lojista, emissor,
          hibrido, BNPL), impacto em interchange, chargeback, MDR, antecipacao de recebiveis e
          regulacao BCB. Com simulador interativo e casos praticos.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Os 4 modelos de parcelamento e quando usar cada um</li>
          <li>Como o parcelamento afeta interchange, MDR e fluxo de caixa</li>
          <li>Chargebacks em transacoes parceladas — cenarios e defesa</li>
          <li>Antecipacao de recebiveis, registradoras e regulacao BCB</li>
          <li>Comparacao internacional e por que o Brasil e unico</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>14</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>4</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Modelos</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>70%+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Txns Parceladas BR</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Paises Comparados</div>
        </div>
      </div>

      {/* Table of Contents */}
      <div style={{ ...sectionStyle, marginBottom: "2rem" }}>
        <h2 style={headingStyle}>Indice</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem" }}>
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                fontSize: "0.8125rem",
                color: "var(--primary)",
                textDecoration: "none",
                padding: "0.375rem 0.5rem",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary-bg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", fontWeight: 700, flexShrink: 0,
                background: "var(--primary)", color: "#fff",
              }}>
                {i + 1}
              </span>
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {sections.map((section, idx) => (
        <div
          key={section.id}
          id={section.id}
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
    </div>
  );
}
