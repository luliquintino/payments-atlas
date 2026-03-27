"use client";

import { useState, useEffect } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";
import FlowDiagram, { FlowStep } from "@/components/ui/FlowDiagram";

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

const amberBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(245,158,11,0.25)",
  background: "rgba(245,158,11,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const listStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  lineHeight: 1.7,
  color: "var(--text-secondary)",
  paddingLeft: "1.25rem",
  marginBottom: "0.75rem",
};

const badgeStyle = (color: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "0.15rem 0.5rem",
  borderRadius: 6,
  fontSize: "0.75rem",
  fontWeight: 600,
  background: color,
  color: "#fff",
  marginRight: "0.375rem",
});

// ---------------------------------------------------------------------------
// Flow: Operacao de Credito End-to-End
// ---------------------------------------------------------------------------

const creditFlowActors = [
  "Merchant",
  "Originador",
  "Motor de Credito",
  "Registradora",
  "Fundo/Banco",
  "Investidor",
];

const creditFlowSteps: FlowStep[] = [
  {
    from: "Merchant",
    to: "Originador",
    label: "1. Solicitacao",
    detail:
      "Merchant solicita credito via plataforma digital. Envia dados basicos: CNPJ, faturamento, volume de transacoes. Pode ser via API (embedded) ou portal. O originador pode ser uma fintech (SCD), marketplace ou adquirente.",
    type: "request",
  },
  {
    from: "Originador",
    to: "Motor de Credito",
    label: "2. Analise de credito",
    detail:
      "Motor de credito executa: consulta SCR (BCB), consulta bureaus (Serasa, Boa Vista), analise de transacoes (TPV, ticket medio, chargeback rate, sazonalidade), scoring proprietario com ML. Tempo tipico: 30s a 5min para decisao automatizada, 24-48h para analise manual.",
    type: "request",
  },
  {
    from: "Motor de Credito",
    to: "Originador",
    label: "3. Aprovacao/Recusa",
    detail:
      "Retorna decisao com: limite aprovado (tipicamente 30-80% do GMV mensal), taxa de juros (base rate + risk premium), prazo, garantias exigidas (recebiveis, aval). Se aprovado, gera CCB (Cedula de Credito Bancario) ou contrato de cessao.",
    type: "response",
  },
  {
    from: "Originador",
    to: "Merchant",
    label: "4. Formalizacao",
    detail:
      "Merchant aceita a proposta e assina digitalmente (ICP-Brasil ou certificado proprio). Contrato inclui: valor, taxa, prazo, garantias, clausula de vencimento antecipado, cessao fiduciaria de recebiveis. Para SCD: emissao de CCB. Para factoring: contrato de compra de titulos.",
    type: "response",
  },
  {
    from: "Originador",
    to: "Registradora",
    label: "5. Registro",
    detail:
      "Registro obrigatorio na registradora (CERC, CIP/SRR ou TAG/B3). Operacoes: trava de agenda (impede cessao dupla), registro de onus/gravame, cessao de URs especificas (por arranjo + adquirente + data). Garante unicidade e oponibilidade da operacao perante terceiros.",
    type: "request",
  },
  {
    from: "Fundo/Banco",
    to: "Merchant",
    label: "6. Desembolso",
    detail:
      "Recursos transferidos via TED/PIX para conta do merchant. Para antecipacao: valor = VF / (1 + taxa * prazo). Para capital de giro: valor integral liberado. Pode ser em conta escrow para controle. Tempo: D+0 a D+2 dependendo do veiculo.",
    type: "request",
  },
  {
    from: "Originador",
    to: "Fundo/Banco",
    label: "7. Servicing",
    detail:
      "Monitoramento continuo: acompanhamento de performance do merchant (volume, chargeback, aging), calculo de provisao (Res. 2.682), geracao de informes, reporte ao SCR. Servicing pode ser terceirizado para servicer especializado.",
    type: "async",
  },
  {
    from: "Registradora",
    to: "Fundo/Banco",
    label: "8. Cobranca/Liquidacao",
    detail:
      "Liquidacao direcionada: registradora instrui adquirente a depositar recebiveis diretamente na conta do credor (conta vinculada). Para capital de giro: cobranca via boleto/debito automatico. Regua de cobranca: D+1 (lembrete), D+5 (notificacao), D+15 (formal), D+30 (negativacao), D+60 (juridico), D+90 (cessao de inadimplente).",
    type: "response",
  },
  {
    from: "Fundo/Banco",
    to: "Investidor",
    label: "9. Retorno ao Investidor",
    detail:
      "Para FIDC: distribuicao conforme waterfall (despesas > senior > mezanino > junior). Para banco: spread bancario. Para SCD com equity: retorno para acionistas. KPIs: yield bruto, cost of risk, NPL ratio, recovery rate. Investidor acompanha via informe mensal do administrador.",
    type: "response",
  },
];

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function buildSections(): Section[] {
  return [
    // 1. Visao Geral
    {
      id: "visao-geral",
      title: "Visao Geral: Credito no Ecossistema de Pagamentos",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            No Brasil, credito e pagamentos sao indissociaveis. Mais de 70% das transacoes com cartao
            de credito sao parceladas — um fenomeno praticamente unico no mundo. A antecipacao de
            recebiveis movimenta mais de R$200 bilhoes por ano, sendo a principal linha de credito
            para pequenas e medias empresas. As fintechs de credito sao o segmento que mais cresce no
            ecossistema financeiro brasileiro.
          </p>
          <p style={paragraphStyle}>
            Essa conexao profunda significa que qualquer profissional de pagamentos precisa entender
            credito — e vice-versa. O parcelamento gera recebiveis futuros que podem ser antecipados;
            a antecipacao alimenta FIDCs que atraem investidores institucionais; e o credito embutido
            (embedded lending) transforma plataformas de pagamento em originadores de credito.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.5rem" }}>
              Como credito se conecta com pagamentos
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", fontSize: "0.85rem", color: "var(--foreground)" }}>
              <span style={badgeStyle("#6366f1")}>Parcelamento</span>
              <span>{"→"}</span>
              <span style={badgeStyle("#8b5cf6")}>Recebiveis</span>
              <span>{"→"}</span>
              <span style={badgeStyle("#a855f7")}>Antecipacao</span>
              <span>{"→"}</span>
              <span style={badgeStyle("#7c3aed")}>FIDC</span>
              <span>{"→"}</span>
              <span style={badgeStyle("#6d28d9")}>Investidor</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.6 }}>
              Merchant parcela venda → gera recebiveis futuros → antecipa com desagio →
              recebiveis sao cedidos para FIDC → investidor institucional compra cotas senior →
              ciclo se repete com mais capital disponivel.
            </p>
          </div>
          <p style={subheadingStyle}>Numeros-chave</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Valor</th>
                  <th style={thStyle}>Fonte</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Transacoes parceladas / total cartao credito</td><td style={{ ...tdStyle, fontWeight: 600 }}>~70%</td><td style={tdStyle}>ABECS / BCB</td></tr>
                <tr><td style={tdStyle}>Volume de antecipacao de recebiveis / ano</td><td style={{ ...tdStyle, fontWeight: 600 }}>R$200B+</td><td style={tdStyle}>CERC / CIP</td></tr>
                <tr><td style={tdStyle}>Fintechs de credito ativas</td><td style={{ ...tdStyle, fontWeight: 600 }}>800+</td><td style={tdStyle}>ABFintechs</td></tr>
                <tr><td style={tdStyle}>SCDs autorizadas pelo BCB</td><td style={{ ...tdStyle, fontWeight: 600 }}>100+</td><td style={tdStyle}>BCB</td></tr>
                <tr><td style={tdStyle}>FIDCs de recebiveis de cartao</td><td style={{ ...tdStyle, fontWeight: 600 }}>300+</td><td style={tdStyle}>CVM / Anbima</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    // 2. Taxonomia de Produtos
    {
      id: "taxonomia",
      title: "Taxonomia de Produtos de Credito",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O universo de credito conectado a pagamentos abrange diversos produtos, cada um com
            caracteristicas regulatorias, de funding e de risco distintas. Entender essa taxonomia
            e fundamental para posicionar-se corretamente no mercado.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
            {[
              { name: "Antecipacao de Recebiveis", desc: "Adiantamento de valores futuros de cartao. O merchant recebe hoje o que receberia em 30, 60, 90 dias. Desagio tipico: 1.5-3.5% a.m. Principal produto de credito para PMEs.", color: "#6366f1" },
              { name: "Capital de Giro", desc: "Emprestimo baseado no faturamento do merchant. Pode ter garantia de recebiveis ou ser clean (sem garantia). Prazo tipico: 3-24 meses. Taxa: 1.5-5% a.m. dependendo do risco.", color: "#8b5cf6" },
              { name: "Credito Consignado", desc: "Desconto em folha de pagamento. Menor risco = menor taxa (1-2.5% a.m.). Regulado pelo BCB. Margem consignavel: ate 35% do salario + 5% cartao consignado.", color: "#a855f7" },
              { name: "Factoring", desc: "Compra de titulos e duplicatas a desconto. Nao e instituicao financeira (nao regulado pelo BCB). Opera com capital proprio. Foco em micro e pequenas empresas. IOF nao incide.", color: "#7c3aed" },
              { name: "FIDC", desc: "Fundo de Investimento em Direitos Creditorios. Securitiza recebiveis em cotas (senior, mezanino, junior). Regulado pela CVM. Permite escala de funding com custo menor.", color: "#6d28d9" },
              { name: "Credit as a Service", desc: "Credito via API embutido em plataformas (embedded lending). Fintech origina, banco/SCD e o veiculo regulado. White-label. Exemplos: Creditas, QI Tech, Swap Financial.", color: "#4f46e5" },
              { name: "BNPL", desc: "Buy Now, Pay Later — financiamento no checkout sem cartao. Parcela em 3-12x com analise instantanea. Modelo de revenue: merchant fee (3-6%) + juros do consumidor. Crescimento acelerado no e-commerce.", color: "#4338ca" },
            ].map((product) => (
              <div key={product.name} style={{ padding: "1rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--background)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: product.color, flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--foreground)" }}>{product.name}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{product.desc}</p>
              </div>
            ))}
          </div>
          <p style={subheadingStyle}>Tabela Comparativa</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Produto</th>
                  <th style={thStyle}>Quem Financia</th>
                  <th style={thStyle}>Garantia</th>
                  <th style={thStyle}>Regulacao</th>
                  <th style={thStyle}>Custo Tipico</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Antecipacao</td><td style={tdStyle}>Adquirente, banco, FIDC</td><td style={tdStyle}>Recebiveis de cartao</td><td style={tdStyle}>BCB (se via IF)</td><td style={tdStyle}>1.5-3.5% a.m.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Capital de giro</td><td style={tdStyle}>Banco, SCD, fintech</td><td style={tdStyle}>Recebiveis ou clean</td><td style={tdStyle}>BCB</td><td style={tdStyle}>1.5-5% a.m.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Consignado</td><td style={tdStyle}>Banco, SCD</td><td style={tdStyle}>Folha de pagamento</td><td style={tdStyle}>BCB</td><td style={tdStyle}>1-2.5% a.m.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Factoring</td><td style={tdStyle}>Factoring (capital proprio)</td><td style={tdStyle}>Titulos/duplicatas</td><td style={tdStyle}>Civil (sem BCB)</td><td style={tdStyle}>3-8% a.m.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>FIDC</td><td style={tdStyle}>Investidores (cotas)</td><td style={tdStyle}>Carteira de recebiveis</td><td style={tdStyle}>CVM</td><td style={tdStyle}>CDI + 2-6% a.a.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>CaaS</td><td style={tdStyle}>Banco parceiro / SCD</td><td style={tdStyle}>Variavel</td><td style={tdStyle}>BCB (veiculo)</td><td style={tdStyle}>2-5% a.m.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>BNPL</td><td style={tdStyle}>Fintech, banco</td><td style={tdStyle}>Score do consumidor</td><td style={tdStyle}>BCB (se via IF)</td><td style={tdStyle}>0-5% a.m.</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    // 3. Fluxo End-to-End
    {
      id: "fluxo-e2e",
      title: "Fluxo End-to-End de uma Operacao de Credito",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Uma operacao de credito com lastro em recebiveis de pagamento envolve multiplos atores e
            etapas regulatorias. O diagrama abaixo mostra o fluxo completo desde a solicitacao ate o
            retorno ao investidor. Clique em cada etapa para ver os detalhes operacionais.
          </p>
          <FlowDiagram
            title="Operacao de Credito End-to-End"
            actors={creditFlowActors}
            steps={creditFlowSteps}
          />
        </>
      ),
    },

    // 4. Estruturando uma SCD
    {
      id: "scd",
      title: "Estruturando uma SCD (Sociedade de Credito Direto)",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            A SCD e o veiculo regulado mais acessivel para fintechs que querem originar credito
            diretamente. Criada pela Resolucao 4.656/2018 do BCB, permite emprestimo, financiamento
            e aquisicao de direitos creditorios exclusivamente com capital proprio.
          </p>

          <p style={subheadingStyle}>Requisitos BCB</p>
          <ul style={listStyle}>
            <li style={{ marginBottom: "0.25rem" }}>Capital minimo: R$1.000.000 (um milhao de reais)</li>
            <li style={{ marginBottom: "0.25rem" }}>Forma juridica: S.A. (Sociedade Anonima)</li>
            <li style={{ marginBottom: "0.25rem" }}>Resolucao 4.656/2018 — define SCD e SEP</li>
            <li style={{ marginBottom: "0.25rem" }}>Circular 3.898/2018 — procedimentos de autorizacao</li>
            <li style={{ marginBottom: "0.25rem" }}>Sede e administracao no Brasil</li>
          </ul>

          <p style={subheadingStyle}>Processo de Autorizacao</p>
          <div style={highlightBoxStyle}>
            <ol style={{ ...listStyle, paddingLeft: "1.5rem" }}>
              <li style={{ marginBottom: "0.375rem" }}><strong>Documentacao:</strong> Contrato social, atas, identificacao de controladores e administradores</li>
              <li style={{ marginBottom: "0.375rem" }}><strong>Plano de negocios:</strong> 3 anos de projecao financeira, modelo de credito, mercado-alvo, tecnologia</li>
              <li style={{ marginBottom: "0.375rem" }}><strong>Fit & proper:</strong> Avaliacao da idoneidade e capacidade dos controladores e administradores</li>
              <li style={{ marginBottom: "0.375rem" }}><strong>Compliance:</strong> Politica de PLD/FT (prevencao a lavagem), politica de credito, gestao de riscos</li>
              <li style={{ marginBottom: "0.375rem" }}><strong>Prazo:</strong> 6-12 meses ate a autorizacao definitiva</li>
            </ol>
          </div>

          <p style={subheadingStyle}>Operacoes Permitidas</p>
          <ul style={listStyle}>
            <li style={{ marginBottom: "0.25rem" }}>Emprestimo e financiamento (recursos proprios)</li>
            <li style={{ marginBottom: "0.25rem" }}>Aquisicao de direitos creditorios</li>
            <li style={{ marginBottom: "0.25rem" }}>Emissao de moeda eletronica</li>
            <li style={{ marginBottom: "0.25rem" }}>Venda de direitos creditorios (cessao para FIDC, banco, etc.)</li>
          </ul>

          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Vedacoes importantes
            </p>
            <ul style={{ ...listStyle, color: "var(--foreground)" }}>
              <li style={{ marginBottom: "0.25rem" }}>Nao pode captar depositos do publico</li>
              <li style={{ marginBottom: "0.25rem" }}>Nao pode emitir CDB, LCI, LCA ou letras</li>
              <li style={{ marginBottom: "0.25rem" }}>Nao pode operar com recursos de terceiros (exceto cessao de carteira)</li>
              <li style={{ marginBottom: "0.25rem" }}>Funding limitado a capital proprio — principal restricao de escala</li>
            </ul>
          </div>

          <p style={subheadingStyle}>Capital Regulatorio e Reporting</p>
          <ul style={listStyle}>
            <li style={{ marginBottom: "0.25rem" }}><strong>PR minimo:</strong> Framework de Basileia simplificado (S5 para SCDs menores)</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>SISBACEN:</strong> Envio de DLO (Demonstrativo de Limites Operacionais), SCR (Sistema de Informacoes de Credito)</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Frequencia:</strong> DLO mensal, SCR diario/mensal dependendo do porte</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Governanca:</strong> Compliance officer obrigatorio, comite de credito, auditoria independente</li>
          </ul>
        </>
      ),
    },

    // 5. Estruturando um FIDC
    {
      id: "fidc",
      title: "Estruturando um FIDC",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            O FIDC (Fundo de Investimento em Direitos Creditorios) e o principal veiculo de
            securitizacao de recebiveis no Brasil. Permite que originadores de credito escalem suas
            operacoes captando recursos de investidores institucionais a custos mais baixos que equity.
          </p>

          <p style={subheadingStyle}>Estrutura do FIDC</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", fontSize: "0.85rem", color: "var(--foreground)", marginBottom: "0.75rem" }}>
            <span style={badgeStyle("#6366f1")}>Cedente</span>
            <span>{"→"}</span>
            <span style={badgeStyle("#8b5cf6")}>Administrador</span>
            <span>{"→"}</span>
            <span style={badgeStyle("#a855f7")}>Gestor</span>
            <span>{"→"}</span>
            <span style={badgeStyle("#7c3aed")}>Custodiante</span>
            <span>{"→"}</span>
            <span style={badgeStyle("#6d28d9")}>Investidores</span>
          </div>
          <ul style={listStyle}>
            <li style={{ marginBottom: "0.25rem" }}><strong>Cedente:</strong> Origina os recebiveis (SCD, adquirente, marketplace)</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Administrador:</strong> Responsavel legal perante CVM. Controla o fundo, calcula NAV, publica informes</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Gestor:</strong> Define politica de credito, seleciona recebiveis, monitora carteira</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Custodiante:</strong> Guarda e valida os documentos dos recebiveis. Liquidacao financeira</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Investidores:</strong> Compram cotas do fundo. Podem ser qualificados ou profissionais</li>
          </ul>

          <p style={subheadingStyle}>Tipos de Cotas e Subordinacao</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Cota</th>
                  <th style={thStyle}>Prioridade</th>
                  <th style={thStyle}>Retorno Tipico</th>
                  <th style={thStyle}>Risco</th>
                  <th style={thStyle}>Investidor Tipico</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#10b981" }}>Senior</td><td style={tdStyle}>1a (preferencial)</td><td style={tdStyle}>CDI + 2-4% a.a.</td><td style={tdStyle}>Baixo</td><td style={tdStyle}>Fundos de pensao, seguradoras</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#f59e0b" }}>Mezanino</td><td style={tdStyle}>2a</td><td style={tdStyle}>CDI + 5-8% a.a.</td><td style={tdStyle}>Medio</td><td style={tdStyle}>Family offices, asset managers</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Junior (Subordinada)</td><td style={tdStyle}>Ultima (residual)</td><td style={tdStyle}>15-30%+ a.a.</td><td style={tdStyle}>Alto</td><td style={tdStyle}>Cedente, originador</td></tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Waterfall de Pagamentos</p>
          <div style={highlightBoxStyle}>
            <ol style={{ ...listStyle, paddingLeft: "1.5rem", color: "var(--foreground)" }}>
              <li style={{ marginBottom: "0.25rem" }}>Despesas do fundo (administrador, custodiante, gestor, auditoria, registradora)</li>
              <li style={{ marginBottom: "0.25rem" }}>Remuneracao da cota senior (CDI + spread contratado)</li>
              <li style={{ marginBottom: "0.25rem" }}>Remuneracao da cota mezanino (se houver)</li>
              <li style={{ marginBottom: "0.25rem" }}>Residuo para cota junior (absorve perdas primeiro, captura excess spread)</li>
            </ol>
          </div>

          <p style={subheadingStyle}>Cenario Numerico</p>
          <div style={greenBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#10b981", marginBottom: "0.5rem" }}>
              FIDC com R$100M de PL
            </p>
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <tbody>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>PL Total</td><td style={tdStyle}>R$100.000.000</td></tr>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Cotas Senior (75%)</td><td style={tdStyle}>R$75.000.000 — CDI + 3% a.a. = ~16% a.a.</td></tr>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Cotas Junior (25%)</td><td style={tdStyle}>R$25.000.000 — absorve primeiras perdas</td></tr>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Yield bruto da carteira</td><td style={tdStyle}>~24% a.a. (spread de 18% sobre CDI)</td></tr>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Despesas do fundo</td><td style={tdStyle}>~2% a.a. (R$2M)</td></tr>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Perda estimada (NPL)</td><td style={tdStyle}>~4% a.a. (R$4M)</td></tr>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Retorno liquido senior</td><td style={tdStyle}>~16% a.a. (protegido pela subordinacao)</td></tr>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Retorno liquido junior</td><td style={tdStyle}>~32% a.a. (captura excess spread, absorve perdas)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <p style={subheadingStyle}>Regulacao e Rating</p>
          <ul style={listStyle}>
            <li style={{ marginBottom: "0.25rem" }}><strong>CVM:</strong> ICVM 356/2001 (regra principal), ICVM 555 (fundos em geral)</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Registro:</strong> Obrigatorio na CVM. Informe mensal ao administrador</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Rating:</strong> S&P, Moody&apos;s, Fitch — grau de investimento requer subordinacao minima de 20-30%</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>NAV:</strong> Patrimonio Liquido / numero de cotas. Calculado diariamente pelo administrador</li>
          </ul>
        </>
      ),
    },

    // 6. SCD vs FIDC vs Banco vs Factoring
    {
      id: "comparativo",
      title: "SCD vs FIDC vs Banco vs Factoring",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Escolher o veiculo correto para operar credito e uma das decisoes mais importantes para
            fintechs e empresas de pagamento. Cada estrutura tem trade-offs entre custo, velocidade,
            escala e complexidade regulatoria.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Criterio</th>
                  <th style={{ ...thStyle, color: "#6366f1" }}>SCD</th>
                  <th style={{ ...thStyle, color: "#8b5cf6" }}>FIDC</th>
                  <th style={{ ...thStyle, color: "#10b981" }}>Banco</th>
                  <th style={{ ...thStyle, color: "#f59e0b" }}>Factoring</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Regulador</td><td style={tdStyle}>BCB</td><td style={tdStyle}>CVM</td><td style={tdStyle}>BCB</td><td style={tdStyle}>Codigo Civil</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Capital minimo</td><td style={tdStyle}>R$1M</td><td style={tdStyle}>N/A (fundo)</td><td style={tdStyle}>R$17.5M+</td><td style={tdStyle}>Nenhum</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Captacao</td><td style={tdStyle}>Proibida</td><td style={tdStyle}>Cotas</td><td style={tdStyle}>CDB/poupanca</td><td style={tdStyle}>Capital proprio</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Custo funding</td><td style={tdStyle}>Alto (equity)</td><td style={tdStyle}>Medio (cotas)</td><td style={tdStyle}>Baixo (depositos)</td><td style={tdStyle}>Alto (equity)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Escala</td><td style={tdStyle}>Media</td><td style={tdStyle}>Alta</td><td style={tdStyle}>Muito alta</td><td style={tdStyle}>Baixa</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Velocidade setup</td><td style={tdStyle}>6-12 meses</td><td style={tdStyle}>3-6 meses</td><td style={tdStyle}>Proibitivo</td><td style={tdStyle}>Imediato</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Complexidade regulatoria</td><td style={tdStyle}>Media</td><td style={tdStyle}>Media-alta</td><td style={tdStyle}>Muito alta</td><td style={tdStyle}>Baixa</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>IOF</td><td style={tdStyle}>Sim</td><td style={tdStyle}>Nao (isento)</td><td style={tdStyle}>Sim</td><td style={tdStyle}>Nao</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Melhor para</td><td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>Fintech early-stage</td><td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>Escala com custo menor</td><td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>Incumbente</td><td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>Micro/pequena empresa</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Estrategia tipica de escala
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              1. Comeca como factoring (validacao rapida, sem regulacao) → 2. Abre SCD (passa a ser IF, pode
              emitir CCB, consultar SCR) → 3. Constitui FIDC (escala o funding com cotas senior) →
              4. Eventualmente parceira com banco ou busca licenca bancaria para captar depositos.
            </p>
          </div>
        </>
      ),
    },

    // 7. Underwriting de Merchants
    {
      id: "underwriting",
      title: "Underwriting de Merchants para Credito",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Avaliar o risco de credito de um merchant conectado a pagamentos e diferente do
            underwriting tradicional. Os dados transacionais (TPV, chargeback rate, sazonalidade)
            sao tao ou mais importantes que demonstracoes financeiras.
          </p>

          <p style={subheadingStyle}>Dados Disponiveis para Analise</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
            {[
              { label: "Volume de transacoes (TPV)", detail: "Historico de 6-12 meses, tendencia de crescimento" },
              { label: "Ticket medio", detail: "Estabilidade e outliers indicam saude do negocio" },
              { label: "Chargeback rate", detail: "Acima de 1% = red flag. Acima de 1.5% = alto risco" },
              { label: "Tempo de operacao", detail: "Merchants com < 6 meses sao mais arriscados" },
              { label: "Segmento (MCC)", detail: "Airlines, crypto, adult = alto risco. Supermercado = baixo" },
              { label: "Concentracao de clientes", detail: "Top 10 clientes > 50% do volume = risco de concentracao" },
            ].map((item) => (
              <div key={item.label} style={{ padding: "0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.25rem" }}>{item.label}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.detail}</p>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Segmentacao de Risco</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Rating</th>
                  <th style={thStyle}>Perfil</th>
                  <th style={thStyle}>Limite (% GMV)</th>
                  <th style={thStyle}>Taxa</th>
                  <th style={thStyle}>Monitoramento</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#10b981" }}>A (Prime)</td><td style={tdStyle}>TPV estavel, CB &lt; 0.5%, &gt; 2 anos</td><td style={tdStyle}>60-80%</td><td style={tdStyle}>1.5-2% a.m.</td><td style={tdStyle}>Trimestral</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#3b82f6" }}>B (Standard)</td><td style={tdStyle}>TPV crescente, CB &lt; 1%, &gt; 1 ano</td><td style={tdStyle}>40-60%</td><td style={tdStyle}>2-3% a.m.</td><td style={tdStyle}>Mensal</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#f59e0b" }}>C (High-risk)</td><td style={tdStyle}>TPV volatil, CB 1-1.5%, &lt; 1 ano</td><td style={tdStyle}>20-40%</td><td style={tdStyle}>3-4.5% a.m.</td><td style={tdStyle}>Quinzenal</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>D (Watch)</td><td style={tdStyle}>TPV em queda, CB &gt; 1.5%, sinais de estresse</td><td style={tdStyle}>0-20%</td><td style={tdStyle}>4.5%+ a.m.</td><td style={tdStyle}>Semanal</td></tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Pricing Dinamico</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7, fontFamily: "monospace" }}>
              Taxa Final = Base Rate (CDI/Selic) + Risk Premium + Operational Cost + Margem
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.6 }}>
              Exemplo: CDI 13.25% a.a. + Risk premium 8% a.a. (rating B) + Op. cost 2% a.a. + Margem 3% a.a. = 26.25% a.a. = ~1.97% a.m.
            </p>
          </div>

          <p style={subheadingStyle}>KYC/AML para Credito</p>
          <ul style={listStyle}>
            <li style={{ marginBottom: "0.25rem" }}>Documentacao adicional: balanco, DRE, relacao de socios</li>
            <li style={{ marginBottom: "0.25rem" }}>Consulta SCR (Sistema de Informacoes de Credito do BCB)</li>
            <li style={{ marginBottom: "0.25rem" }}>Certidoes negativas: Receita Federal, FGTS, trabalhista, protestos</li>
            <li style={{ marginBottom: "0.25rem" }}>PEP screening (Pessoa Exposta Politicamente)</li>
            <li style={{ marginBottom: "0.25rem" }}>Listas restritivas: OFAC, UE, ONU</li>
          </ul>
        </>
      ),
    },

    // 8. Gestao de Portfolio
    {
      id: "gestao-portfolio",
      title: "Gestao de Portfolio de Credito",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Apos a originacao, a gestao do portfolio e onde o credito realmente se ganha ou se perde.
            Monitoramento proativo, provisao adequada e cobranca eficiente sao os pilares de uma
            operacao de credito saudavel.
          </p>

          <p style={subheadingStyle}>KPIs Essenciais</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
            {[
              { label: "NPL Ratio", desc: "Inadimplencia > 90 dias / carteira total. Benchmark: 3-7%", color: "#ef4444" },
              { label: "Coverage Ratio", desc: "Provisao / carteira inadimplente. Saudavel: > 100%", color: "#f59e0b" },
              { label: "Recovery Rate", desc: "% recuperado de creditos inadimplentes. Benchmark: 15-40%", color: "#10b981" },
              { label: "Yield Bruto", desc: "Receita de juros / carteira media. Mede rentabilidade", color: "#6366f1" },
              { label: "Cost of Risk", desc: "Provisao liquida / carteira media. Quanto menor, melhor", color: "#8b5cf6" },
              { label: "Vintage Loss", desc: "Perda acumulada por safra (cohort). Controle de qualidade", color: "#a855f7" },
            ].map((kpi) => (
              <div key={kpi.label} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${kpi.color}33`, background: `${kpi.color}08` }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: kpi.color, marginBottom: "0.25rem" }}>{kpi.label}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{kpi.desc}</p>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Provisao para Perdas — Resolucao BCB 2.682</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Nivel</th>
                  <th style={thStyle}>Atraso</th>
                  <th style={thStyle}>Provisao Minima</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#10b981" }}>AA</td><td style={tdStyle}>Sem atraso, excelente</td><td style={tdStyle}>0%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#22c55e" }}>A</td><td style={tdStyle}>Sem atraso</td><td style={tdStyle}>0.5%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#84cc16" }}>B</td><td style={tdStyle}>1-15 dias</td><td style={tdStyle}>1%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#eab308" }}>C</td><td style={tdStyle}>16-30 dias</td><td style={tdStyle}>3%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#f59e0b" }}>D</td><td style={tdStyle}>31-60 dias</td><td style={tdStyle}>10%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#f97316" }}>E</td><td style={tdStyle}>61-90 dias</td><td style={tdStyle}>30%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>F</td><td style={tdStyle}>91-120 dias</td><td style={tdStyle}>50%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#dc2626" }}>G</td><td style={tdStyle}>121-150 dias</td><td style={tdStyle}>70%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#991b1b" }}>H</td><td style={tdStyle}>{">"} 150 dias</td><td style={tdStyle}>100%</td></tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Regua de Cobranca</p>
          <div style={highlightBoxStyle}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", fontSize: "0.8rem", color: "var(--foreground)" }}>
              <span style={badgeStyle("#10b981")}>D+1 Lembrete</span>
              <span>{"→"}</span>
              <span style={badgeStyle("#22c55e")}>D+5 SMS/Email</span>
              <span>{"→"}</span>
              <span style={badgeStyle("#f59e0b")}>D+15 Ligacao</span>
              <span>{"→"}</span>
              <span style={badgeStyle("#f97316")}>D+30 Formal</span>
              <span>{"→"}</span>
              <span style={badgeStyle("#ef4444")}>D+60 Negativacao</span>
              <span>{"→"}</span>
              <span style={badgeStyle("#991b1b")}>D+90 Juridico</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.6 }}>
              Apos D+90, avaliar cessao de creditos inadimplentes (venda de carteira vencida) para
              empresas especializadas em recuperacao. Desconto tipico: 5-20% do valor de face.
            </p>
          </div>

          <p style={subheadingStyle}>Renegociacao</p>
          <ul style={listStyle}>
            <li style={{ marginBottom: "0.25rem" }}><strong>Reestruturacao:</strong> Extensao de prazo, reducao de taxa, carencia</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Novacao:</strong> Substituicao da divida original por nova (nova CCB)</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Desconto para liquidacao:</strong> 20-60% de desconto para pagamento a vista</li>
            <li style={{ marginBottom: "0.25rem" }}><strong>Cessao:</strong> Venda da carteira inadimplente para investidores especializados</li>
          </ul>
        </>
      ),
    },

    // 9. Registro de Recebiveis e Registradoras
    {
      id: "registradoras",
      title: "Registro de Recebiveis e Registradoras",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            As registradoras sao a infraestrutura que garante a unicidade e rastreabilidade dos
            recebiveis de cartao no Brasil. Desde 2021, com a interoperabilidade obrigatoria, todo
            recebivel de cartao deve ser registrado, permitindo consulta, trava e cessao com
            seguranca juridica.
          </p>

          <p style={subheadingStyle}>As Tres Registradoras</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Registradora</th>
                  <th style={thStyle}>Controlador</th>
                  <th style={thStyle}>Foco</th>
                  <th style={thStyle}>Market Share</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>CERC</td><td style={tdStyle}>Independente (fintechs + bancos)</td><td style={tdStyle}>Recebiveis de cartao e duplicatas</td><td style={tdStyle}>Lider em recebiveis</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>CIP/SRR</td><td style={tdStyle}>Febraban (bancos)</td><td style={tdStyle}>Sistema de Registro de Recebiveis</td><td style={tdStyle}>Forte em bancos</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>TAG/B3</td><td style={tdStyle}>B3 (Bolsa)</td><td style={tdStyle}>Recebiveis e derivativos</td><td style={tdStyle}>Crescente</td></tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>UR — Unidade de Recebivel</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7 }}>
              A UR e a menor unidade divisivel de um recebivel. E identificada univocamente pela combinacao:
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7, fontFamily: "monospace", marginTop: "0.5rem" }}>
              UR = Arranjo (Visa/Master/Elo) + Adquirente (Cielo/Rede/Stone) + Merchant + Data de liquidacao
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.6 }}>
              Exemplo: Uma UR pode ser &quot;Visa + Cielo + CNPJ 12.345.678/0001-90 + 15/04/2026&quot; representando
              todos os recebiveis desse merchant nesse arranjo/adquirente para essa data.
            </p>
          </div>

          <p style={subheadingStyle}>Operacoes nas Registradoras</p>
          <ul style={listStyle}>
            <li style={{ marginBottom: "0.375rem" }}><strong>Consulta:</strong> Verificar a agenda de recebiveis de um merchant (valores futuros por data)</li>
            <li style={{ marginBottom: "0.375rem" }}><strong>Trava (efeito de contrato):</strong> Reservar URs para garantia de operacao de credito. Impede cessao dupla</li>
            <li style={{ marginBottom: "0.375rem" }}><strong>Cessao:</strong> Transferir a titularidade dos recebiveis do cedente para o cessionario (FIDC, banco)</li>
            <li style={{ marginBottom: "0.375rem" }}><strong>Liquidacao direcionada:</strong> Instruir a adquirente a depositar diretamente na conta do credor</li>
          </ul>

          <p style={subheadingStyle}>Interoperabilidade (Resolucao BCB 264)</p>
          <div style={greenBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#10b981", marginBottom: "0.5rem" }}>
              Antes vs Depois (2021)
            </p>
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Aspecto</th>
                    <th style={thStyle}>Antes (ate 2021)</th>
                    <th style={thStyle}>Depois (interoperabilidade)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Visibilidade</td><td style={tdStyle}>Agenda controlada pela adquirente</td><td style={tdStyle}>Merchant ve toda a agenda em qualquer registradora</td></tr>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Cessao</td><td style={tdStyle}>So podia antecipar na propria adquirente</td><td style={tdStyle}>Qualquer financiador pode comprar os recebiveis</td></tr>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Competicao</td><td style={tdStyle}>Lock-in na adquirente</td><td style={tdStyle}>Livre mercado, mais opcoes para o merchant</td></tr>
                  <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Taxas</td><td style={tdStyle}>Desagio alto (3-5% a.m.)</td><td style={tdStyle}>Desagio comprimido (1.5-3% a.m.) pela competicao</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ),
    },

    // 10. Riscos Especificos
    {
      id: "riscos",
      title: "Riscos Especificos de Credito com Recebiveis",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            Operacoes de credito lastreadas em recebiveis de pagamento possuem riscos especificos
            que vao alem do risco de credito tradicional. Entender e mitigar cada um deles e
            essencial para a saude da operacao.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
            {[
              { name: "Dilution Risk", desc: "Chargebacks, cancelamentos e devolucoes reduzem o valor dos recebiveis. Se a taxa de chargeback de um merchant sobe de 1% para 5%, o lastro da operacao cai proporcionalmente. Mitigacao: monitorar CB rate, excesso de garantia (overcollateralization).", color: "#ef4444" },
              { name: "Concentration Risk", desc: "Poucos merchants representando grande parte da carteira = exposicao alta. Se os top 5 merchants sao 60% do portfolio e um deles quebra, a perda e significativa. Mitigacao: limite de concentracao por merchant (max 5-10% da carteira).", color: "#f97316" },
              { name: "Commingling Risk", desc: "Mistura de recursos do cedente com os do fundo/credor. Se o merchant recebe os recebiveis em conta propria e nao repassa, o credor perde. Mitigacao: liquidacao direcionada via registradora, conta escrow.", color: "#f59e0b" },
              { name: "Fraud Risk", desc: "Recebiveis ficticios (merchant simula vendas), duplicidade de cessao (mesmo recebivel cedido para dois credores), identidade falsa. Mitigacao: registro obrigatorio em registradora, reconciliacao com adquirente, KYC robusto.", color: "#dc2626" },
              { name: "Regulatory Risk", desc: "Mudancas nas regras de liquidacao, antecipacao ou registro podem impactar margens e operacoes. Exemplo: BCB mudou regras de liquidacao direcionada em 2023. Mitigacao: compliance proativo, monitoramento regulatorio.", color: "#8b5cf6" },
              { name: "Market Risk", desc: "Variacao na taxa de juros (Selic/CDI) afeta o custo de funding e o spread. Se a Selic sobe 3pp, o custo da cota senior do FIDC sobe junto. Mitigacao: hedge, duration matching.", color: "#6366f1" },
              { name: "Operational Risk", desc: "Falha em registradoras (indisponibilidade), erros de conciliacao entre adquirente e registradora, falhas de sistema. Mitigacao: SLAs com registradoras, reconciliacao diaria, redundancia.", color: "#0ea5e9" },
              { name: "Liquidity Risk", desc: "Resgate de cotas senior sem liquidez no mercado secundario. FIDCs fechados nao permitem resgate antes do vencimento. FIDCs abertos podem sofrer corrida de resgates. Mitigacao: reserva de liquidez, gates de resgate.", color: "#14b8a6" },
            ].map((risk) => (
              <div key={risk.name} style={{ padding: "0.75rem 1rem", borderRadius: 8, border: `1px solid ${risk.color}33`, background: `${risk.color}08` }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: risk.color, marginBottom: "0.25rem" }}>{risk.name}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{risk.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    // 11. Regulacao
    {
      id: "regulacao",
      title: "Regulacao de Credito no Brasil",
      icon: "11",
      content: (
        <>
          <p style={paragraphStyle}>
            O framework regulatorio de credito no Brasil e complexo e multifacetado, envolvendo
            BCB, CVM e legislacao federal. Conhecer as principais normas e fundamental para
            compliance e para entender os limites de cada veiculo.
          </p>

          <p style={subheadingStyle}>Banco Central do Brasil (BCB)</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Norma</th>
                  <th style={thStyle}>Tema</th>
                  <th style={thStyle}>Impacto</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Resolucao 4.656/2018</td><td style={tdStyle}>SCD e SEP</td><td style={tdStyle}>Criou fintechs de credito reguladas. SCD opera com capital proprio, SEP e marketplace</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Resolucao 2.682/1999</td><td style={tdStyle}>Provisao para perdas</td><td style={tdStyle}>9 niveis de classificacao (AA a H). Define provisao minima por atraso</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Circular 3.952/2019</td><td style={tdStyle}>Recebiveis de cartao</td><td style={tdStyle}>Regras de registro, interoperabilidade, liquidacao direcionada</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Resolucao BCB 264/2022</td><td style={tdStyle}>Interoperabilidade</td><td style={tdStyle}>Consulta cross-registradora, portabilidade de recebiveis</td></tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>CVM (Comissao de Valores Mobiliarios)</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Norma</th>
                  <th style={thStyle}>Tema</th>
                  <th style={thStyle}>Impacto</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>ICVM 356/2001</td><td style={tdStyle}>FIDC</td><td style={tdStyle}>Regra principal de FIDCs. Registro, cotas, direitos creditorios elegiveis</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>ICVM 555/2014</td><td style={tdStyle}>Fundos em geral</td><td style={tdStyle}>Regras gerais de fundos de investimento (complementar ao 356)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Resolucao CVM 175/2022</td><td style={tdStyle}>Novo marco de fundos</td><td style={tdStyle}>Moderniza regras de fundos, inclui FIDCs. Vigencia gradual 2023-2025</td></tr>
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Legislacao Federal</p>
          <ul style={listStyle}>
            <li style={{ marginBottom: "0.375rem" }}><strong>Lei 13.775/2018:</strong> Registro de recebiveis de arranjos de pagamento. Base legal para as registradoras</li>
            <li style={{ marginBottom: "0.375rem" }}><strong>Lei 12.865/2013:</strong> Arranjos de pagamento e instituicoes de pagamento. Framework geral do sistema</li>
            <li style={{ marginBottom: "0.375rem" }}><strong>Lei 14.905/2024:</strong> Atualizacao de regras de juros e correcao monetaria</li>
          </ul>

          <p style={subheadingStyle}>Timeline Regulatoria</p>
          <div style={highlightBoxStyle}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", fontSize: "0.8rem", color: "var(--foreground)" }}>
              {[
                { year: "2018", event: "Resolucao 4.656 — Nasce SCD/SEP" },
                { year: "2019", event: "Circular 3.952 — Registro de recebiveis" },
                { year: "2021", event: "Interoperabilidade — Livre mercado de recebiveis" },
                { year: "2022", event: "Resolucao CVM 175 — Novo marco de fundos" },
                { year: "2023", event: "Open Finance Fase 4 — Dados de credito compartilhados" },
                { year: "2025", event: "CVM 175 em vigor pleno — FIDCs modernizados" },
              ].map((item) => (
                <div key={item.year} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <span style={badgeStyle("#6366f1")}>{item.year}</span>
                  <span>{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },

    // 12. Casos Praticos
    {
      id: "casos-praticos",
      title: "Casos Praticos",
      icon: "12",
      content: (
        <>
          <p style={paragraphStyle}>
            Tres cenarios reais que ilustram como credito e pagamentos se conectam na pratica.
            Cada caso mostra a estrutura juridica, o fluxo operacional e os numeros envolvidos.
          </p>

          {/* Caso 1 */}
          <div style={{ ...highlightBoxStyle, borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.06)" }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.5rem" }}>
              Caso 1: Fintech de Antecipacao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              <strong>Estrutura:</strong> SCD + FIDC
            </p>
            <ul style={{ ...listStyle, color: "var(--foreground)" }}>
              <li style={{ marginBottom: "0.25rem" }}>Fintech obteve licenca de SCD (capital de R$5M, 8 meses de processo)</li>
              <li style={{ marginBottom: "0.25rem" }}>Origina credito via plataforma digital — merchants solicitam antecipacao em 3 cliques</li>
              <li style={{ marginBottom: "0.25rem" }}>Motor de credito automatizado analisa TPV, chargeback rate, vintage do merchant</li>
              <li style={{ marginBottom: "0.25rem" }}>Emite CCB via SCD, registra operacao na CERC</li>
              <li style={{ marginBottom: "0.25rem" }}>Cede os recebiveis para FIDC proprio (PL de R$80M, subordinacao de 25%)</li>
              <li style={{ marginBottom: "0.25rem" }}>Cotas senior vendidas para fundos de pensao a CDI + 3.5%</li>
              <li style={{ marginBottom: "0.25rem" }}>Fintech retem cota junior — captura excess spread (~28% a.a.)</li>
              <li style={{ marginBottom: "0.25rem" }}>Volume mensal: R$15M de antecipacao. NPL: 2.8%. Desagio medio: 2.2% a.m.</li>
            </ul>
          </div>

          {/* Caso 2 */}
          <div style={{ ...highlightBoxStyle, borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.06)" }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#10b981", marginBottom: "0.5rem" }}>
              Caso 2: Marketplace com Credito Embutido
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              <strong>Estrutura:</strong> Marketplace + SCD parceira (Credit as a Service)
            </p>
            <ul style={{ ...listStyle, color: "var(--foreground)" }}>
              <li style={{ marginBottom: "0.25rem" }}>Marketplace de e-commerce com 5.000 sellers e GMV de R$200M/mes</li>
              <li style={{ marginBottom: "0.25rem" }}>Oferece capital de giro aos sellers baseado no GMV historico</li>
              <li style={{ marginBottom: "0.25rem" }}>Usa SCD parceira (white-label) como veiculo regulado</li>
              <li style={{ marginBottom: "0.25rem" }}>Dados proprietarios do marketplace alimentam o scoring: vendas, devolucoes, reviews, tempo na plataforma</li>
              <li style={{ marginBottom: "0.25rem" }}>Credito descontado automaticamente dos repasses do marketplace</li>
              <li style={{ marginBottom: "0.25rem" }}>Limite tipico: 50% do GMV mensal do seller. Taxa: 2.5% a.m.</li>
              <li style={{ marginBottom: "0.25rem" }}>Revenue share: marketplace fica com 30% do spread, SCD com 70%</li>
              <li style={{ marginBottom: "0.25rem" }}>Carteira ativa: R$45M. NPL: 1.8% (baixo pelo controle do repasse)</li>
            </ul>
          </div>

          {/* Caso 3 */}
          <div style={{ ...highlightBoxStyle, borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.06)" }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f59e0b", marginBottom: "0.5rem" }}>
              Caso 3: Adquirente com Mesa de Antecipacao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              <strong>Estrutura:</strong> Adquirente (IF) + FIDC para escala
            </p>
            <ul style={{ ...listStyle, color: "var(--foreground)" }}>
              <li style={{ marginBottom: "0.25rem" }}>Adquirente com 200.000 merchants ativos e TPV de R$5B/mes</li>
              <li style={{ marginBottom: "0.25rem" }}>Mesa de antecipacao propria: antecipa recebiveis com funding do balanco</li>
              <li style={{ marginBottom: "0.25rem" }}>Para escalar alem do balanco, constitui FIDC (PL de R$500M)</li>
              <li style={{ marginBottom: "0.25rem" }}>Cede recebiveis do balanco para o FIDC, liberando capital para novas originacoes</li>
              <li style={{ marginBottom: "0.25rem" }}>Desagio medio: 1.8% a.m. (competitivo pela base de merchants)</li>
              <li style={{ marginBottom: "0.25rem" }}>Antecipacao automatica: merchant opta pelo &quot;recebimento automatico em D+2&quot;</li>
              <li style={{ marginBottom: "0.25rem" }}>Liquidacao direcionada via registradora garante repagamento</li>
              <li style={{ marginBottom: "0.25rem" }}>Volume de antecipacao: R$1.5B/mes. NPL: 0.8% (lastro forte em recebiveis)</li>
            </ul>
          </div>

          <div style={amberBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f59e0b", marginBottom: "0.25rem" }}>
              Ponto-chave
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Em todos os tres casos, o diferencial competitivo vem dos dados de pagamento. Quem tem
              acesso ao TPV, chargeback rate e comportamento transacional do merchant tem uma vantagem
              de informacao enorme sobre credores tradicionais. Isso resulta em menor inadimplencia,
              menor custo de aquisicao e maior velocidade de decisao.
            </p>
          </div>
        </>
      ),
    },
  ];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CreditOperationsPage() {
  const { visitPage } = useGameProgress();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    visitPage("/knowledge/credit-operations");
  }, [visitPage]);

  const sections = buildSections();

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.75rem" }}>🏦</span>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)" }}>
            Hub de Operacoes de Credito
          </h1>
        </div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 720 }}>
          Central de conhecimento conectando credito e pagamentos no Brasil. De antecipacao de
          recebiveis a FIDCs, de SCDs a underwriting de merchants — tudo o que voce precisa saber
          para operar credito no ecossistema de pagamentos.
        </p>
      </div>

      {/* Table of Contents */}
      <div style={{ ...sectionStyle, marginBottom: "1.5rem" }}>
        <h2 style={headingStyle}>Indice</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.375rem" }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSection(activeSection === s.id ? null : s.id);
                const el = document.getElementById(`section-${s.id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: activeSection === s.id ? "var(--primary-bg)" : "var(--background)",
                color: activeSection === s.id ? "var(--primary)" : "var(--foreground)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              <span style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: activeSection === s.id ? "var(--primary)" : "var(--border)",
                color: activeSection === s.id ? "#fff" : "var(--foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6875rem",
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {s.icon}
              </span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      {sections.map((s) => (
        <div key={s.id} id={`section-${s.id}`} style={sectionStyle}>
          <h2 style={headingStyle}>
            <span style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {s.icon}
            </span>
            {s.title}
          </h2>
          {s.content}
        </div>
      ))}
    </div>
  );
}
