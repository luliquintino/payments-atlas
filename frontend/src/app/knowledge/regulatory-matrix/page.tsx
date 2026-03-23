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

export default function RegulatoryMatrixPage() {
  const quiz = getQuizForPage("/knowledge/regulatory-matrix");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "panorama-global",
      title: "Panorama Regulatorio Global",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            O setor de pagamentos e um dos mais regulados do mundo. Cada jurisdicao possui seus proprios
            orgaos reguladores, frameworks legais e requisitos de licenciamento. Entender esse panorama
            e essencial para qualquer empresa que opere ou pretenda operar em multiplos mercados.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Regiao</th>
                  <th style={thStyle}>Regulador Principal</th>
                  <th style={thStyle}>Legislacao Chave</th>
                  <th style={thStyle}>Foco Principal</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Brasil</td><td style={tdStyle}>Banco Central (BCB), CVM</td><td style={tdStyle}>Lei 12.865/2013, Circular 3.885, LGPD</td><td style={tdStyle}>Arranjos de pagamento, PIX, Open Finance</td></tr>
                <tr><td style={tdStyle}>Uniao Europeia</td><td style={tdStyle}>EBA, autoridades nacionais</td><td style={tdStyle}>PSD2/PSD3, GDPR, EMD2</td><td style={tdStyle}>Open Banking, SCA, protecao ao consumidor</td></tr>
                <tr><td style={tdStyle}>EUA</td><td style={tdStyle}>Fed, OCC, CFPB, estados</td><td style={tdStyle}>Dodd-Frank, EFTA, state MTLs</td><td style={tdStyle}>Money transmission, protecao ao consumidor</td></tr>
                <tr><td style={tdStyle}>Reino Unido</td><td style={tdStyle}>FCA, PSR, Bank of England</td><td style={tdStyle}>PSR 2017, UK GDPR</td><td style={tdStyle}>Open Banking, inovacao regulatoria (sandbox)</td></tr>
                <tr><td style={tdStyle}>India</td><td style={tdStyle}>RBI, NPCI</td><td style={tdStyle}>Payment and Settlement Systems Act</td><td style={tdStyle}>UPI, data localization, inclusao financeira</td></tr>
                <tr><td style={tdStyle}>China</td><td style={tdStyle}>PBoC, CBIRC</td><td style={tdStyle}>Regulacao de pagamentos eletronicos 2021</td><td style={tdStyle}>Antimonopolio, data governance, supervisao de big techs</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "brasil-bcb",
      title: "Brasil (BCB)",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O framework regulatorio brasileiro para pagamentos e construido sobre a Lei 12.865/2013, que criou
            o conceito de Arranjos de Pagamento e Instituicoes de Pagamento. O Banco Central e o regulador
            principal, com poder de autorizar, supervisionar e sancionar participantes.
          </p>
          <p style={subheadingStyle}>Tipos de Instituicao de Pagamento</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Funcao</th>
                  <th style={thStyle}>Exemplos</th>
                  <th style={thStyle}>Capital Minimo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Emissor de Moeda Eletronica</td><td style={tdStyle}>Gerencia contas de pagamento pre-pagas</td><td style={tdStyle}>PicPay, Mercado Pago</td><td style={tdStyle}>R$ 2M</td></tr>
                <tr><td style={tdStyle}>Emissor de Instrumento de Pagamento Pos-Pago</td><td style={tdStyle}>Emite cartoes de credito</td><td style={tdStyle}>Nubank (como IP)</td><td style={tdStyle}>R$ 2M</td></tr>
                <tr><td style={tdStyle}>Credenciador</td><td style={tdStyle}>Habilita merchants a aceitar pagamentos</td><td style={tdStyle}>Cielo, Rede, Stone</td><td style={tdStyle}>R$ 2M</td></tr>
                <tr><td style={tdStyle}>Subcredenciador</td><td style={tdStyle}>Habilita sub-merchants via credenciador (PayFac)</td><td style={tdStyle}>iFood, PagSeguro</td><td style={tdStyle}>Variavel</td></tr>
                <tr><td style={tdStyle}>Iniciador de Transacao (ITP)</td><td style={tdStyle}>Inicia pagamentos (Open Finance)</td><td style={tdStyle}>Iniciadores via PIX/Open Finance</td><td style={tdStyle}>R$ 1M</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>PIX: Framework Regulatorio</p>
          <p style={paragraphStyle}>
            O PIX, lancado em novembro de 2020, e regulado pelo BCB atraves de um conjunto de regulamentos
            especificos. E o maior sistema de pagamentos instantaneos do mundo em volume, com mais de 150
            milhoes de usuarios e 800+ milhoes de transacoes por mes.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Regulacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Participacao</td><td style={tdStyle}>Obrigatoria para IFs com mais de 500k contas ativas; opcional para IPs</td></tr>
                <tr><td style={tdStyle}>Limites</td><td style={tdStyle}>Limite noturno de R$ 1k (ajustavel), limite diurno definido pela IF</td></tr>
                <tr><td style={tdStyle}>Mecanismo especial de devolucao (MED)</td><td style={tdStyle}>Permite bloqueio e devolucao em casos de fraude (ate 80 dias)</td></tr>
                <tr><td style={tdStyle}>PIX Automatico</td><td style={tdStyle}>Debito automatico recorrente (lancado 2024), substitui boleto recorrente</td></tr>
                <tr><td style={tdStyle}>PIX por Aproximacao</td><td style={tdStyle}>NFC/QR code em maquininhas, regulamentacao em evolucao</td></tr>
                <tr><td style={tdStyle}>Tarifas</td><td style={tdStyle}>Gratuito para PF; IF pode cobrar de PJ (limitacoes especificas)</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Open Finance Brasil</p>
          <p style={paragraphStyle}>
            O Open Finance Brasil e uma das implementacoes mais ambiciosas de open banking do mundo,
            coordenada pelo BCB e pela estrutura de governanca propria. Diferentemente do modelo europeu
            (PSD2), o brasileiro e mandatorio para grandes instituicoes e cobre muito alem de pagamentos.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Fase</th>
                  <th style={thStyle}>Escopo</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Fase 1</td><td style={tdStyle}>Dados abertos: produtos e servicos, canais, tarifas</td><td style={tdStyle}>Implementado</td></tr>
                <tr><td style={tdStyle}>Fase 2</td><td style={tdStyle}>Compartilhamento de dados do cliente (contas, cartoes, credito)</td><td style={tdStyle}>Implementado</td></tr>
                <tr><td style={tdStyle}>Fase 3</td><td style={tdStyle}>Iniciacao de pagamento (PIX via ITP)</td><td style={tdStyle}>Implementado</td></tr>
                <tr><td style={tdStyle}>Fase 4</td><td style={tdStyle}>Dados de investimentos, seguros, previdencia, cambio</td><td style={tdStyle}>Em implementacao</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "europa-psd2",
      title: "Europa (PSD2/PSD3)",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            A Payment Services Directive 2 (PSD2) revolucionou o mercado europeu ao introduzir Open Banking
            mandatorio e Strong Customer Authentication (SCA). A PSD3, em fase de aprovacao, pretende
            corrigir deficiencias da PSD2 e criar o Payment Services Regulation (PSR) com aplicacao direta.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>PSD2 (Atual)</th>
                  <th style={thStyle}>PSD3/PSR (Proposta)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Tipo de norma</td><td style={tdStyle}>Diretiva (transposta por cada pais)</td><td style={tdStyle}>Regulamento (aplicacao direta em toda UE)</td></tr>
                <tr><td style={tdStyle}>Open Banking</td><td style={tdStyle}>APIs obrigatorias (AISP/PISP), mas qualidade inconsistente</td><td style={tdStyle}>Dashboard de permissoes, melhoria das APIs</td></tr>
                <tr><td style={tdStyle}>SCA</td><td style={tdStyle}>2 de 3 fatores (conhecimento, posse, inerencia)</td><td style={tdStyle}>Mantida com ajustes, foco em fraude de engenharia social</td></tr>
                <tr><td style={tdStyle}>Licenciamento</td><td style={tdStyle}>PI (Payment Institution) ou EMI (E-Money Institution)</td><td style={tdStyle}>Unificacao de PI e EMI em um unico regime</td></tr>
                <tr><td style={tdStyle}>Passporting</td><td style={tdStyle}>Licenca em um pais EEA vale em todos</td><td style={tdStyle}>Mantido, com supervisao mais harmonizada</td></tr>
                <tr><td style={tdStyle}>IBAN discrimination</td><td style={tdStyle}>Proibida mas frequente na pratica</td><td style={tdStyle}>Enforcement mais rigoroso</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Strong Customer Authentication (SCA)</p>
          <div style={codeBlockStyle}>{`SCA: 2 de 3 fatores obrigatorios para transacoes eletronicas

Fatores:
┌─────────────────┬─────────────────┬─────────────────┐
│   CONHECIMENTO  │     POSSE       │    INERENCIA     │
│  (algo que sabe)│ (algo que tem)  │  (algo que e)    │
├─────────────────┼─────────────────┼─────────────────┤
│  Senha          │  Smartphone     │  Impressao digital│
│  PIN            │  Token fisico   │  Reconhecimento   │
│  Resposta       │  Cartao SIM     │    facial        │
│  secreta        │  Smart card     │  Padrao de voz   │
└─────────────────┴─────────────────┴─────────────────┘

Isencoes (Transaction Risk Analysis - TRA):
- Transacoes < EUR 30 (ate 5 consecutivas ou EUR 100 acumulado)
- Recurring payments (apos primeira autenticacao)
- Trusted beneficiaries (whitelist do cliente)
- Low-risk TRA: taxa de fraude do PSP abaixo dos thresholds:
  - Ate EUR 100: fraude < 0.13%
  - Ate EUR 250: fraude < 0.06%
  - Ate EUR 500: fraude < 0.01%`}</div>
        </>
      ),
    },
    {
      id: "eua",
      title: "Estados Unidos",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Os EUA tem um sistema regulatorio fragmentado para pagamentos. Nao existe um equivalente ao PSD2
            ou a Lei 12.865. A regulacao e distribuida entre nivel federal e estadual, com mais de 50
            jurisdicoes diferentes para money transmission licenses.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Regulador</th>
                  <th style={thStyle}>Jurisdicao</th>
                  <th style={thStyle}>Escopo em Pagamentos</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Federal Reserve</td><td style={tdStyle}>Federal</td><td style={tdStyle}>Supervisao de sistemas de pagamento (FedNow, ACH), Regulation E</td></tr>
                <tr><td style={tdStyle}>OCC</td><td style={tdStyle}>Federal</td><td style={tdStyle}>Licenciamento de national banks, fintech charters (controverso)</td></tr>
                <tr><td style={tdStyle}>CFPB</td><td style={tdStyle}>Federal</td><td style={tdStyle}>Protecao ao consumidor, supervisao de nonbank payment providers</td></tr>
                <tr><td style={tdStyle}>FinCEN</td><td style={tdStyle}>Federal</td><td style={tdStyle}>BSA/AML compliance, registro de MSBs (Money Services Businesses)</td></tr>
                <tr><td style={tdStyle}>State regulators</td><td style={tdStyle}>Estadual (50+)</td><td style={tdStyle}>Money Transmitter Licenses (MTL), cada estado com requisitos proprios</td></tr>
                <tr><td style={tdStyle}>SEC</td><td style={tdStyle}>Federal</td><td style={tdStyle}>Stablecoins e cripto-ativos (debate regulatorio em andamento)</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Money Transmitter Licenses (MTLs)</p>
          <p style={paragraphStyle}>
            Obter licencas de Money Transmitter em todos os 50 estados e um dos maiores desafios para
            fintechs de pagamento nos EUA. O processo pode levar 12-24 meses e custar USD 1-5M em
            compliance, bonds e capital regulatorio. Alternativas incluem: partnership com banco
            licenciado, uso de sponsor banks, ou operar sob isencoes especificas.
          </p>
          <p style={subheadingStyle}>Durbin Amendment</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Impacto no ecossistema
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O Durbin Amendment (2010) limitou as taxas de interchange de debito para bancos com mais
              de USD 10B em ativos (cap de ~USD 0.22 + 0.05% por transacao). Isso criou uma divisao
              no mercado: bancos grandes com interchange regulado e bancos/fintechs menores com
              interchange de mercado. Routing requirements tambem obrigam suporte a pelo menos 2
              redes de debito nao-afiliadas.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "matriz-comparativa",
      title: "Matriz Comparativa",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Esta matriz compara os principais aspectos regulatorios entre as tres maiores jurisdicoes
            de pagamentos. Use como referencia para planejamento de expansao internacional.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Requisito</th>
                  <th style={thStyle}>Brasil</th>
                  <th style={thStyle}>Uniao Europeia</th>
                  <th style={thStyle}>Estados Unidos</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Licenciamento</td><td style={tdStyle}>IP autorizada pelo BCB</td><td style={tdStyle}>PI/EMI autorizada por regulador nacional</td><td style={tdStyle}>MTL em cada estado + registro FinCEN</td></tr>
                <tr><td style={tdStyle}>Capital minimo</td><td style={tdStyle}>R$ 1-2M (varia por tipo)</td><td style={tdStyle}>EUR 125k (PI) a EUR 350k (EMI)</td><td style={tdStyle}>Varia: USD 25k-2M+ (bonds por estado)</td></tr>
                <tr><td style={tdStyle}>Tempo de licenciamento</td><td style={tdStyle}>6-18 meses</td><td style={tdStyle}>3-12 meses</td><td style={tdStyle}>12-24 meses (50 estados)</td></tr>
                <tr><td style={tdStyle}>Open Banking</td><td style={tdStyle}>Mandatorio (Open Finance Brasil)</td><td style={tdStyle}>Mandatorio (PSD2/PSD3)</td><td style={tdStyle}>Voluntario (CFPB 1033 em desenvolvimento)</td></tr>
                <tr><td style={tdStyle}>Pagamentos instantaneos</td><td style={tdStyle}>PIX (obrigatorio para IFs grandes)</td><td style={tdStyle}>SEPA Instant (adocao crescente)</td><td style={tdStyle}>FedNow (lancado 2023, adocao inicial)</td></tr>
                <tr><td style={tdStyle}>Autenticacao forte</td><td style={tdStyle}>Nao ha SCA mandatoria regulada</td><td style={tdStyle}>SCA obrigatoria (2FA)</td><td style={tdStyle}>Nao ha requisito federal de SCA</td></tr>
                <tr><td style={tdStyle}>Privacidade de dados</td><td style={tdStyle}>LGPD</td><td style={tdStyle}>GDPR</td><td style={tdStyle}>Fragmentada (CCPA/state laws)</td></tr>
                <tr><td style={tdStyle}>Liquidacao</td><td style={tdStyle}>D+2 obrigatorio</td><td style={tdStyle}>D+1 (SEPA), T+1 (cartoes)</td><td style={tdStyle}>T+2 (ACH), T+1 (cartoes, migrando)</td></tr>
                <tr><td style={tdStyle}>Protecao ao consumidor</td><td style={tdStyle}>CDC + regulacao BCB</td><td style={tdStyle}>Forte (PSD2, GDPR, ADR)</td><td style={tdStyle}>Regulation E (debito), Regulation Z (credito)</td></tr>
                <tr><td style={tdStyle}>Sandbox regulatoria</td><td style={tdStyle}>LIFT (BCB)</td><td style={tdStyle}>Varia por pais (UK lider)</td><td style={tdStyle}>OCC/state level (limitada)</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "lgpd-vs-gdpr",
      title: "LGPD vs GDPR para Pagamentos",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            As leis de protecao de dados impactam diretamente operacoes de pagamento: tokenizacao, armazenamento
            de dados transacionais, compartilhamento com terceiros (antifraude, bureaus) e retencao de dados.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>LGPD (Brasil)</th>
                  <th style={thStyle}>GDPR (Europa)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Base legal para processar dados de pagamento</td><td style={tdStyle}>Execucao de contrato ou interesse legitimo</td><td style={tdStyle}>Execucao de contrato, consentimento ou interesse legitimo</td></tr>
                <tr><td style={tdStyle}>Data residency</td><td style={tdStyle}>Nao ha obrigacao explicita de localizacao</td><td style={tdStyle}>Transferencia fora do EEA requer adequacy decision ou SCCs</td></tr>
                <tr><td style={tdStyle}>Direito a exclusao</td><td style={tdStyle}>Sim, com excecoes (obrigacao legal de retencao)</td><td style={tdStyle}>Sim, com excecoes similares</td></tr>
                <tr><td style={tdStyle}>Tokenizacao</td><td style={tdStyle}>Recomendada como medida de seguranca</td><td style={tdStyle}>Pseudonimizacao explicitamente incentivada (Art. 25)</td></tr>
                <tr><td style={tdStyle}>Notificacao de breach</td><td style={tdStyle}>Prazo razoavel a ANPD e titular</td><td style={tdStyle}>72 horas a autoridade; sem atraso ao titular se alto risco</td></tr>
                <tr><td style={tdStyle}>Multas</td><td style={tdStyle}>Ate 2% do faturamento, max R$ 50M por infracao</td><td style={tdStyle}>Ate 4% do faturamento global ou EUR 20M</td></tr>
                <tr><td style={tdStyle}>DPO obrigatorio</td><td style={tdStyle}>Sim (encarregado)</td><td style={tdStyle}>Sim, em certas circunstancias (Art. 37)</td></tr>
                <tr><td style={tdStyle}>Impacto em antifraude</td><td style={tdStyle}>Compartilhamento via interesse legitimo ou consentimento</td><td style={tdStyle}>Similar; interesse legitimo para prevencao de fraude</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Ponto critico para pagamentos
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O right to deletion cria tensao com obrigacoes de retencao regulatoria (BCB exige 5-10 anos
              para dados transacionais; PCI DSS tem requisitos de retencao de logs). A pratica recomendada
              e: anonimizar dados apos o periodo regulatorio minimo, ao inves de deletar completamente.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "open-finance-brasil",
      title: "Open Finance Brasil",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            O Open Finance Brasil vai alem do Open Banking europeu: alem de dados bancarios e pagamentos,
            abrange investimentos, seguros, previdencia e cambio. O framework de consentimento e robusto
            e centrado no usuario.
          </p>
          <p style={subheadingStyle}>Arquitetura de Consentimento</p>
          <div style={codeBlockStyle}>{`Fluxo de Consentimento Open Finance Brasil:

Cliente ─────► Receptora (TPP)    "Quero ver meus dados do Banco X"
                    │
                    │  1. Solicita consentimento
                    ▼
              Transmissora (Banco) ─── "Confirme o compartilhamento"
                    │
                    │  2. Cliente autentica e autoriza
                    ▼
              Token de acesso gerado (OAuth 2.0 / FAPI)
                    │
                    │  3. APIs acessadas com token
                    ▼
              Dados compartilhados    (validade: ate 12 meses)
                    │
                    │  4. Renovacao ou revogacao
                    ▼
              Cliente pode revogar a qualquer momento`}</div>
          <p style={subheadingStyle}>APIs Disponíveis</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Categoria</th>
                  <th style={thStyle}>Dados</th>
                  <th style={thStyle}>Caso de Uso</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Contas</td><td style={tdStyle}>Saldos, extratos, limites</td><td style={tdStyle}>Agregadores financeiros, PFM apps</td></tr>
                <tr><td style={tdStyle}>Cartao de credito</td><td style={tdStyle}>Fatura, transacoes, limites</td><td style={tdStyle}>Analise de credito, comparadores</td></tr>
                <tr><td style={tdStyle}>Credito</td><td style={tdStyle}>Emprestimos, financiamentos, parcelas</td><td style={tdStyle}>Portabilidade de credito, refinanciamento</td></tr>
                <tr><td style={tdStyle}>Investimentos</td><td style={tdStyle}>Posicoes, rendimentos, custodia</td><td style={tdStyle}>Consolidacao de portfolio</td></tr>
                <tr><td style={tdStyle}>Seguros</td><td style={tdStyle}>Apolices, sinistros, coberturas</td><td style={tdStyle}>Comparadores de seguros</td></tr>
                <tr><td style={tdStyle}>Pagamentos (ITP)</td><td style={tdStyle}>Iniciacao de PIX e TED</td><td style={tdStyle}>Checkout sem cartao, pagamento via Open Finance</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "compliance-checklist",
      title: "Compliance Checklist por Tipo de Empresa",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            O nivel de compliance necessario varia dramaticamente conforme o tipo de empresa e o
            escopo de atuacao no ecossistema de pagamentos. Este checklist resume as obrigacoes
            por tipo de entidade.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Obrigacao</th>
                  <th style={thStyle}>PSP/Gateway</th>
                  <th style={thStyle}>Subcredenciador</th>
                  <th style={thStyle}>Credenciador</th>
                  <th style={thStyle}>Banco/IP</th>
                  <th style={thStyle}>Fintech (sem licenca)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>PCI DSS</td><td style={tdStyle}>Level 1-4</td><td style={tdStyle}>Level 1</td><td style={tdStyle}>Level 1</td><td style={tdStyle}>Level 1</td><td style={tdStyle}>SAQ (via PSP)</td></tr>
                <tr><td style={tdStyle}>Registro BCB</td><td style={tdStyle}>Nao obrigatorio</td><td style={tdStyle}>Obrigatorio</td><td style={tdStyle}>Obrigatorio</td><td style={tdStyle}>Obrigatorio</td><td style={tdStyle}>Nao</td></tr>
                <tr><td style={tdStyle}>KYC/AML</td><td style={tdStyle}>Basico</td><td style={tdStyle}>Completo</td><td style={tdStyle}>Completo</td><td style={tdStyle}>Completo</td><td style={tdStyle}>Via parceiro</td></tr>
                <tr><td style={tdStyle}>COAF reporting</td><td style={tdStyle}>Nao</td><td style={tdStyle}>Sim</td><td style={tdStyle}>Sim</td><td style={tdStyle}>Sim</td><td style={tdStyle}>Nao</td></tr>
                <tr><td style={tdStyle}>LGPD (DPO)</td><td style={tdStyle}>Sim</td><td style={tdStyle}>Sim</td><td style={tdStyle}>Sim</td><td style={tdStyle}>Sim</td><td style={tdStyle}>Sim</td></tr>
                <tr><td style={tdStyle}>Auditoria independente</td><td style={tdStyle}>Recomendada</td><td style={tdStyle}>Obrigatoria (anual)</td><td style={tdStyle}>Obrigatoria</td><td style={tdStyle}>Obrigatoria</td><td style={tdStyle}>Nao</td></tr>
                <tr><td style={tdStyle}>Capital regulatorio</td><td style={tdStyle}>Nao</td><td style={tdStyle}>Sim (variavel)</td><td style={tdStyle}>Sim (R$ 2M+)</td><td style={tdStyle}>Sim (alto)</td><td style={tdStyle}>Nao</td></tr>
                <tr><td style={tdStyle}>Open Finance</td><td style={tdStyle}>Nao</td><td style={tdStyle}>Opcional</td><td style={tdStyle}>Mandatorio (S1-S2)</td><td style={tdStyle}>Mandatorio (S1-S2)</td><td style={tdStyle}>Nao</td></tr>
                <tr><td style={tdStyle}>Risco de chargeback</td><td style={tdStyle}>Nao assume</td><td style={tdStyle}>Assume (MoR)</td><td style={tdStyle}>Assume</td><td style={tdStyle}>Assume (emissor)</td><td style={tdStyle}>Nao</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Dica pratica
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Fintechs que atuam como correspondentes bancarios ou usam BaaS herdam parte do compliance
              do parceiro, mas continuam responsaveis por LGPD, protecao ao consumidor e suas proprias
              politicas de KYC. O regulador pode responsabilizar ambos em caso de falha.
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
          Matriz Regulatoria de Pagamentos
        </h1>
        <p className="page-description">
          Panorama regulatorio completo: Brasil, Europa, EUA. Comparativo de licenciamento, compliance,
          LGPD vs GDPR, Open Finance e checklists por tipo de empresa.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Framework regulatorio brasileiro: tipos de IP, PIX, Open Finance</li>
          <li>PSD2/PSD3 europeia: SCA, Open Banking, licenciamento e passporting</li>
          <li>Complexidade regulatoria dos EUA: MTLs, Durbin Amendment, fragmentacao</li>
          <li>Comparativo LGPD vs GDPR e impactos especificos em pagamentos</li>
          <li>Checklist de compliance por tipo de empresa no ecossistema</li>
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
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Jurisdicoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tipos de Empresa</div>
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
