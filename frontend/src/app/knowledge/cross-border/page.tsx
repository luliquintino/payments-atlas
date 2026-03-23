"use client";

import { useState } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CrossBorderPage() {
  const quiz = getQuizForPage("/knowledge/cross-border");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "anatomia",
      title: "Anatomia de um Pagamento Cross-Border",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Um pagamento cross-border ocorre quando o emissor do cartao (issuer) esta em um pais
            diferente do adquirente (acquirer) do merchant. Isso adiciona camadas de complexidade:
            conversao cambial, taxas adicionais, regulacao de dois paises e maior risco de fraude.
          </p>
          <p style={subheadingStyle}>Fluxo Completo — Passo a Passo</p>
          <div style={codeBlockStyle}>
{`Cardholder (UK) ─→ Merchant (Brasil) ─→ Gateway/PSP
       │                                      │
       │                                      ▼
       │                              Acquirer (BR)
       │                                      │
       │                              ┌───────┴───────┐
       │                              │  Bandeira     │
       │                              │  (Visa/MC)    │
       │                              └───────┬───────┘
       │                                      │
       │                              ┌───────┴───────┐
       │                              │  Issuer (UK)  │
       │                              └───────────────┘
       │
       ▼  Fluxo de FX (Foreign Exchange):

  1. Merchant precifica em BRL
  2. Acquirer envia auth em BRL para bandeira
  3. Bandeira converte BRL → GBP (taxa da bandeira)
  4. Issuer autoriza em GBP contra limite do cardholder
  5. Settlement: Issuer paga bandeira em GBP
  6. Bandeira converte GBP → BRL e paga acquirer
  7. Acquirer liquida para merchant em BRL

  Taxas no caminho:
  - Cross-border assessment fee (bandeira): 0.8-1.2%
  - FX markup (bandeira): 1-3% sobre mid-market rate
  - International processing fee: 0.1-0.4%
  - IOF (Brasil): 6.38% sobre compras internacionais`}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Ponto critico
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              A conversao cambial pode ocorrer em dois momentos: na autorizacao (DCC — Dynamic
              Currency Conversion) ou no settlement. Quando ocorre na autorizacao via DCC, o
              cardholder ve o valor em sua moeda no checkout, mas a taxa de cambio e geralmente
              pior (4-7% acima do mid-market). Quando ocorre no settlement, a taxa da bandeira
              se aplica (1-3% acima do mid-market).
            </p>
          </div>
        </>
      ),
    },
    {
      id: "correspondent-banking",
      title: "Correspondent Banking",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Para pagamentos cross-border que nao passam por redes de cartao (wire transfers, B2B
            payments), o mecanismo e o correspondent banking via rede SWIFT. Entender nostro/vostro
            accounts e fundamental para quem opera com settlement internacional.
          </p>
          <p style={subheadingStyle}>Nostro e Vostro</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Conta</th>
                  <th style={thStyle}>Definicao</th>
                  <th style={thStyle}>Exemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Nostro</td>
                  <td style={tdStyle}>&quot;Nossa conta no seu banco&quot; — conta que Banco A mantem no Banco B em moeda estrangeira</td>
                  <td style={tdStyle}>Itau mantem conta em USD no JPMorgan (Nova York)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Vostro</td>
                  <td style={tdStyle}>&quot;Sua conta no nosso banco&quot; — a mesma conta vista pela perspectiva do banco correspondente</td>
                  <td style={tdStyle}>JPMorgan ve a conta do Itau como &quot;vostro account&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Mensageria SWIFT</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Mensagem</th>
                  <th style={thStyle}>Uso</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>MT103</td><td style={tdStyle}>Single Customer Credit Transfer</td><td style={tdStyle}>Transferencia de pagamento entre bancos para cliente final. Contem dados do beneficiario.</td></tr>
                <tr><td style={tdStyle}>MT202</td><td style={tdStyle}>General Financial Institution Transfer</td><td style={tdStyle}>Transferencia interbancaria (cover payment). Movimenta fundos entre correspondentes.</td></tr>
                <tr><td style={tdStyle}>MT199</td><td style={tdStyle}>Free Format Message</td><td style={tdStyle}>Comunicacao livre entre bancos para resolucao de issues, investigacao.</td></tr>
                <tr><td style={tdStyle}>MT940</td><td style={tdStyle}>Customer Statement Message</td><td style={tdStyle}>Extrato bancario para reconciliacao de nostro/vostro accounts.</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Cadeia de Taxas em Wire Transfer</p>
          <div style={codeBlockStyle}>
{`Banco Remetente ──→ Banco Correspondente 1 ──→ Banco Correspondente 2 ──→ Banco Beneficiario

Cada intermediario cobra:
  - Lifting fee: USD 10-35 por transacao
  - Cable/SWIFT fee: USD 15-25
  - FX spread: 0.5-2% se conversao necessaria

Exemplo: Wire de BRL → PHP (Real para Peso Filipino)
  Itau (BR) → JPMorgan (US, correspondente) → BDO (PH)
  Custo total: R$80-200 em taxas + spread FX em duas pernas
  Prazo: 2-5 dias uteis (D+2 tipico para USD, D+3-5 para exotic currencies)`}
          </div>
        </>
      ),
    },
    {
      id: "fx-risk",
      title: "Gestao de Risco Cambial (FX)",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Qualquer empresa que recebe ou paga em moeda estrangeira esta exposta a risco cambial.
            O tempo entre a transacao e o settlement (tipicamente D+2 a D+30) cria uma janela onde
            a variacao cambial pode corroer margens.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Estrategia</th>
                  <th style={thStyle}>Como Funciona</th>
                  <th style={thStyle}>Quando Usar</th>
                  <th style={thStyle}>Custo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Spot</td>
                  <td style={tdStyle}>Conversao na taxa de mercado do momento. Sem protecao.</td>
                  <td style={tdStyle}>Volumes pequenos, settlement rapido (D+1/D+2)</td>
                  <td style={tdStyle}>Spread do banco (0.5-2%)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Forward (NDF)</td>
                  <td style={tdStyle}>Trava a taxa de cambio hoje para liquidacao futura. No Brasil, NDFs sao liquidados em BRL (non-deliverable).</td>
                  <td style={tdStyle}>Receitas recorrentes em USD, ciclos de settlement longos</td>
                  <td style={tdStyle}>Custo embutido na taxa forward (diferencial de juros)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Natural Hedging</td>
                  <td style={tdStyle}>Casar receitas e despesas na mesma moeda. Se recebe USD e paga fornecedores em USD, o risco se anula.</td>
                  <td style={tdStyle}>Empresas com operacoes em multiplos paises</td>
                  <td style={tdStyle}>Zero (estrutural)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Opcoes de FX</td>
                  <td style={tdStyle}>Compra o direito (mas nao a obrigacao) de converter a uma taxa pre-definida.</td>
                  <td style={tdStyle}>Proteção com upside — quando quer se proteger mas nao quer perder se o cambio favorece</td>
                  <td style={tdStyle}>Premio da opcao (0.5-3% do notional)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Mark-to-Market
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Posicoes de hedge (forwards, opcoes) precisam ser marcadas a mercado diariamente para
              fins contabeis (CPC 48 / IFRS 9). Se voce tem um NDF de USD 1M a 5.20 e o spot esta
              em 5.50, voce tem um ganho nao-realizado de R$300K que precisa ser reportado. Isso
              impacta o balanco e pode gerar chamada de margem no banco.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "local-vs-crossborder",
      title: "Local Acquiring vs Cross-Border",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            A decisao entre processar via acquirer local (no pais do cardholder) ou cross-border
            (no pais do merchant) impacta diretamente custo, taxa de aprovacao e experiencia do
            consumidor. Essa decisao e uma das mais criticas para merchants com operacao global.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Local Acquiring</th>
                  <th style={thStyle}>Cross-Border</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Auth Rate</td>
                  <td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>85-95% (issuer vê como domestica)</td>
                  <td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>60-80% (issuer aplica mais fricção)</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Interchange</td>
                  <td style={tdStyle}>Domestic rate (0.5-2%)</td>
                  <td style={tdStyle}>International rate (1.5-3%) + cross-border fee</td>
                </tr>
                <tr>
                  <td style={tdStyle}>FX</td>
                  <td style={tdStyle}>Nao necessario (mesma moeda)</td>
                  <td style={tdStyle}>Spread de 1-3% sobre mid-market</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Setup</td>
                  <td style={tdStyle}>Requer entidade legal ou parceiro local</td>
                  <td style={tdStyle}>Processamento centralizado, mais simples</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Settlement</td>
                  <td style={tdStyle}>Em moeda local, precisa repatriar</td>
                  <td style={tdStyle}>Direto na moeda do merchant</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Regulacao</td>
                  <td style={tdStyle}>Compliance local obrigatoria</td>
                  <td style={tdStyle}>Compliance do pais do merchant</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Regra pratica
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se voce tem mais de USD 500K/ano de volume em um pais especifico, o ganho em auth rate
              e reducao de fees com local acquiring geralmente justifica o custo de setup (entidade
              local ou partnership). A diferenca de auth rate de 15-25pp pode representar centenas de
              milhares de dolares em receita recuperada.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "regulacao-cambial-br",
      title: "Regulacao Cambial Brasil",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            O Brasil tem uma das regulacoes cambiais mais complexas do mundo. Qualquer empresa que
            recebe ou envia pagamentos internacionais precisa entender IOF, registro no BCB e os
            limites operacionais.
          </p>
          <p style={subheadingStyle}>IOF (Imposto sobre Operacoes Financeiras)</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Operacao</th>
                  <th style={thStyle}>Aliquota IOF</th>
                  <th style={thStyle}>Exemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Compra internacional com cartao de credito</td><td style={tdStyle}>6.38%</td><td style={tdStyle}>Brasileiro comprando em site americano</td></tr>
                <tr><td style={tdStyle}>Remessa de lucros/dividendos ao exterior</td><td style={tdStyle}>0%</td><td style={tdStyle}>Subsidiaria BR pagando holding no exterior</td></tr>
                <tr><td style={tdStyle}>Emprestimo externo (prazo &gt; 180 dias)</td><td style={tdStyle}>0%</td><td style={tdStyle}>Captacao em USD com prazo longo</td></tr>
                <tr><td style={tdStyle}>Emprestimo externo (prazo &lt;= 180 dias)</td><td style={tdStyle}>6%</td><td style={tdStyle}>Bridge loan curto prazo</td></tr>
                <tr><td style={tdStyle}>Ingresso de capital estrangeiro (investimento direto)</td><td style={tdStyle}>0%</td><td style={tdStyle}>Aporte de VC/PE em startup brasileira</td></tr>
                <tr><td style={tdStyle}>Transferencia pessoal (mesma titularidade)</td><td style={tdStyle}>1.1%</td><td style={tdStyle}>Envio para conta propria no exterior</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Registro no Banco Central</p>
          <p style={paragraphStyle}>
            Toda operacao de cambio deve ser registrada no Sistema de Informacoes do Banco Central
            (SISBACEN). Para empresas de pagamento, isso significa que cada settlement internacional
            precisa de contrato de cambio registrado. O marco regulatorio de cambio (Lei 14.286/2021)
            simplificou alguns processos, mas a obrigatoriedade de registro permanece.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Requisito</th>
                  <th style={thStyle}>Descricao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Contrato de cambio</td><td style={tdStyle}>Obrigatorio para operacoes acima de USD 50K. Abaixo disso, pode usar cambio simplificado.</td></tr>
                <tr><td style={tdStyle}>Declaracao CBE</td><td style={tdStyle}>Capitais Brasileiros no Exterior — obrigatorio para ativos &gt; USD 1M no exterior (trimestral) ou &gt; USD 100K (anual)</td></tr>
                <tr><td style={tdStyle}>RDE-IED</td><td style={tdStyle}>Registro Declaratorio Eletronico — obrigatorio para investimento estrangeiro direto no Brasil</td></tr>
                <tr><td style={tdStyle}>SISCOSERV</td><td style={tdStyle}>Registro de operacoes de servicos internacionais (descontinuado em 2022, substituido por obrigacoes EFD)</td></tr>
              </tbody>
            </table>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Armadilha para fintechs
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Fintechs brasileiras que processam pagamentos cross-border precisam de licenca de
              correspondente cambial ou parceria com banco autorizado a operar cambio. Operar sem
              autorizacao e infracão cambial, sujeita a multas de ate 200% do valor da operacao
              pelo Banco Central.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "auth-rate-optimization",
      title: "Otimizacao de Auth Rate Cross-Border",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            A taxa de autorizacao em transacoes cross-border e tipicamente 15-25 pontos percentuais
            menor que em transacoes domesticas. Cada ponto percentual de auth rate pode representar
            milhoes em receita. Existem tecnicas especificas para otimizar.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tecnica</th>
                  <th style={thStyle}>Como Funciona</th>
                  <th style={thStyle}>Impacto Esperado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Network Tokens</td>
                  <td style={tdStyle}>Substitui PAN por token da bandeira (TRID). Issuer ve como credencial de maior confianca.</td>
                  <td style={tdStyle}>+2-6% auth rate, menor fraude</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Local BINs / Local Entity</td>
                  <td style={tdStyle}>Usar um BIN (Bank Identification Number) local faz a transacao parecer domestica para o issuer.</td>
                  <td style={tdStyle}>+10-20% auth rate (maior impacto)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Smart Retry</td>
                  <td style={tdStyle}>Quando decline soft (issuer unavailable, insufficient funds temporario), retry com logica inteligente.</td>
                  <td style={tdStyle}>Recupera 5-15% dos declines</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Cascading / Failover</td>
                  <td style={tdStyle}>Se acquirer A declina, tenta acquirer B (em outro pais ou rede).</td>
                  <td style={tdStyle}>Recupera 3-8% dos declines</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Optimal Routing</td>
                  <td style={tdStyle}>ML model decide qual acquirer/rota tem maior probabilidade de aprovacao para cada transacao.</td>
                  <td style={tdStyle}>+2-5% auth rate overall</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>3DS Smart Triggers</td>
                  <td style={tdStyle}>Aplicar 3DS apenas quando necessario (risk-based). 3DS excessivo reduz conversao.</td>
                  <td style={tdStyle}>+1-3% conversao (menos abandono)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Exemplo quantificado
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Merchant com USD 10M/ano em vendas cross-border e auth rate de 70%. Implementando
              network tokens (+4%) e smart retry (+8%), auth rate sobe para 82%. Receita adicional:
              USD 10M x 12% = USD 1.2M/ano em vendas que antes eram declinadas. Custo de
              implementacao: tipicamente 2-4 meses de engenharia.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "multi-currency-settlement",
      title: "Settlement em Multiplas Moedas",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Merchants globais precisam gerenciar settlement em multiplas moedas. A decisao de quando
            converter (no momento da transacao vs no settlement vs ao repatriar) impacta diretamente
            o custo e a previsibilidade do fluxo de caixa.
          </p>
          <p style={subheadingStyle}>Modelos de Settlement</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Quando Usar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Single-currency settlement</td>
                  <td style={tdStyle}>Todas as transacoes convertidas para uma moeda base (ex: USD) antes do settlement.</td>
                  <td style={tdStyle}>Empresa centralizada, sem operacoes locais nos paises</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Multi-currency accounts</td>
                  <td style={tdStyle}>Manter contas em cada moeda relevante. Settlement em moeda local, conversao sob demanda.</td>
                  <td style={tdStyle}>Operacoes em 3+ paises, despesas locais a pagar</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Local settlement + repatriation</td>
                  <td style={tdStyle}>Settlement em moeda local no pais, repatriacao periodica (semanal/mensal) para pais-sede.</td>
                  <td style={tdStyle}>Alto volume em mercados especificos, otimizacao de FX</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Reconciliacao Multi-Moeda</p>
          <p style={paragraphStyle}>
            A reconciliacao em ambiente multi-moeda e significativamente mais complexa. Cada transacao
            pode ter ate 3 valores diferentes: o valor apresentado ao cardholder (moeda do cardholder),
            o valor processado pelo acquirer (moeda do merchant ou do acquirer), e o valor liquidado
            (moeda de settlement, que pode ser outra).
          </p>
          <div style={codeBlockStyle}>
{`Exemplo de Reconciliacao:

Transacao: Cardholder japones compra em site brasileiro

  Valor apresentado:  JPY 15,000  (cardholder ve em ienes)
  Valor processado:   BRL 550.00  (acquirer BR processa em reais)
  Valor liquidado:    USD 108.50  (settlement em dolares)

  FX Rate 1 (JPY→BRL): 0.0367 (aplicado pela bandeira na auth)
  FX Rate 2 (BRL→USD): 0.1973 (aplicado no settlement)

  Para reconciliar: merchant precisa rastrear ambas as taxas
  e os timestamps de cada conversao.

  Discrepancias comuns:
  - Rate da auth ≠ rate do settlement (gap de D+2)
  - Rounding differences entre moedas
  - Partial refunds com rate diferente do original`}
          </div>
        </>
      ),
    },
    {
      id: "case-studies",
      title: "Case Studies",
      icon: "8",
      content: (
        <>
          <p style={subheadingStyle}>Case 1: Merchant LATAM aceitando EUR</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7 }}>
              <strong>Cenario:</strong> E-commerce de moda brasileiro quer expandir para Europa.
              Volume projetado: EUR 200K/mes. Opcoes avaliadas:
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7, marginTop: "0.5rem" }}>
              <strong>Opcao A — Cross-border puro:</strong> Acquirer brasileiro (Adyen BR) processa
              transacoes europeias. Auth rate: ~68%. Custo total: MDR 3.2% + cross-border fee 1.0% +
              FX spread 2.5% = 6.7%. Receita efetiva: EUR 200K x 93.3% = EUR 186.6K/mes.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7, marginTop: "0.5rem" }}>
              <strong>Opcao B — Local acquiring EU:</strong> Abrir entidade na Holanda, usar Adyen EU.
              Auth rate: ~89%. Custo total: MDR 1.8% + FX spread ao repatriar 0.5% = 2.3%. Setup cost:
              EUR 15K (entidade + compliance). Receita efetiva: EUR 200K x 97.7% = EUR 195.4K/mes.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7, marginTop: "0.5rem" }}>
              <strong>Decisao:</strong> Opcao B gera EUR 8.8K/mes a mais. Setup se paga em menos de
              2 meses. Alem disso, auth rate 21pp maior significa ~EUR 42K/mes em vendas que seriam
              perdidas por decline.
            </p>
          </div>
          <p style={subheadingStyle}>Case 2: SaaS Brasileiro cobrando USD globalmente</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7 }}>
              <strong>Cenario:</strong> SaaS B2B brasileiro com 2.000 clientes em 40 paises. MRR:
              USD 500K. 80% das transacoes sao recorrentes (subscription). Problema: auth rate
              caiu de 92% para 78% apos migrar de Stripe US para processamento local.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7, marginTop: "0.5rem" }}>
              <strong>Diagnostico:</strong> Ao processar via acquirer brasileiro, todas as transacoes
              de clientes nos EUA/EU tornaram-se cross-border (antes eram domesticas no Stripe US).
              Issuers americanos e europeus declinaram mais por nao reconhecerem o BIN brasileiro.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.7, marginTop: "0.5rem" }}>
              <strong>Solucao:</strong> Arquitetura multi-acquirer: Stripe US para clientes nos
              EUA/Canada (60% do volume), Adyen EU para Europa (25%), acquirer BR para LATAM (15%).
              Network tokens habilitados em todos os acquirers. Smart retry com cascading entre acquirers.
              Auth rate subiu para 91%. Receita mensal recuperada: USD 65K.
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
          Cross-Border Payments Guide
        </h1>
        <p className="page-description">
          Guia completo de pagamentos internacionais: correspondent banking, risco cambial,
          local acquiring, regulacao brasileira e otimizacao de auth rate.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>A anatomia completa de um pagamento cross-border e todos os atores envolvidos</li>
          <li>Correspondent banking, mensageria SWIFT e contas nostro/vostro</li>
          <li>Estrategias de hedge cambial e quando usar cada uma</li>
          <li>Local acquiring vs cross-border: decisao de custo e auth rate</li>
          <li>Regulacao cambial brasileira (IOF, BCB, compliance)</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>2</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Case Studies</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Estrategias FX</div>
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
