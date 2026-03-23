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

export default function PLDFTPage() {
  const quiz = getQuizForPage("/knowledge/pld-ft");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    /* ------------------------------------------------------------------ */
    /* 1. O que e PLD/FT                                                   */
    /* ------------------------------------------------------------------ */
    {
      id: "o-que-e",
      title: "O que e PLD/FT",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            PLD/FT significa Prevencao a Lavagem de Dinheiro e ao Financiamento do Terrorismo. E o conjunto
            de politicas, procedimentos e controles que instituicoes financeiras e de pagamento devem implementar
            para detectar, prevenir e reportar atividades suspeitas relacionadas a lavagem de dinheiro e
            financiamento do terrorismo.
          </p>
          <p style={paragraphStyle}>
            A lavagem de dinheiro segue tipicamente tres fases: Colocacao (placement) — introduzir dinheiro
            ilicito no sistema financeiro; Ocultacao (layering) — criar camadas de transacoes para dificultar
            rastreamento; e Integracao (integration) — reintroduzir o dinheiro na economia formal com aparencia licita.
          </p>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Por que PLD/FT importa para empresas de pagamento
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              PSPs, fintechs e IPs sao vetores atrativos para lavagem de dinheiro por oferecerem: velocidade
              de transacoes (especialmente Pix), anonimato relativo, volume que dificulta deteccao manual,
              e acesso digital sem presenca fisica. A responsabilidade de PLD/FT e da instituicao — nao e
              terceirizavel. Multas podem chegar a R$20M por infracao e incluir responsabilidade criminal dos diretores.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.75rem" }}>
            <span style={tagStyle}>KYC</span>
            <span style={tagStyle}>Transaction Monitoring</span>
            <span style={tagStyle}>STR/COAF</span>
            <span style={tagStyle}>Sanctions Screening</span>
            <span style={tagStyle}>PEP</span>
            <span style={tagStyle}>Enhanced Due Diligence</span>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 2. Regulacao Brasileira                                             */
    /* ------------------------------------------------------------------ */
    {
      id: "regulacao",
      title: "Regulacao Brasileira",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O arcabouco regulatorio brasileiro de PLD/FT e robusto e envolve multiplas normas e orgaos.
            A principal lei e a Lei 9.613/1998, que criminaliza a lavagem de dinheiro e criou o COAF
            (Conselho de Controle de Atividades Financeiras).
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Norma</th>
                  <th style={thStyle}>Orgao</th>
                  <th style={thStyle}>Escopo</th>
                  <th style={thStyle}>Obrigados</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { norma: "Lei 9.613/1998", orgao: "Congresso", escopo: "Tipificacao do crime de lavagem. Criacao do COAF.", obrigados: "Todos os setores obrigados" },
                  { norma: "Circular BCB 3.978/2020", orgao: "BCB", escopo: "Politica de PLD/FT para IFs. KYC, monitoramento, comunicacao.", obrigados: "Bancos, IPs, IEs, cooperativas" },
                  { norma: "Resolucao BCB 44/2020", orgao: "BCB", escopo: "Procedimentos para comunicacao ao COAF.", obrigados: "Instituicoes autorizadas pelo BCB" },
                  { norma: "Circular BCB 4.001/2020", orgao: "BCB", escopo: "Procedimentos de KYC para contas de pagamento.", obrigados: "IPs e IEs" },
                  { norma: "Instrucao CVM 617/2019", orgao: "CVM", escopo: "PLD/FT para participantes do mercado de capitais.", obrigados: "Corretoras, gestoras, administradoras" },
                  { norma: "Resolucao COAF 40/2021", orgao: "COAF", escopo: "PLD/FT para setores nao financeiros obrigados.", obrigados: "Imobiliarias, joalherias, factorings" },
                ].map((item) => (
                  <tr key={item.norma}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.norma}</td>
                    <td style={tdStyle}>{item.orgao}</td>
                    <td style={tdStyle}>{item.escopo}</td>
                    <td style={tdStyle}>{item.obrigados}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>COAF — Papel e Funcionamento</p>
          <p style={paragraphStyle}>
            O COAF e a UIF (Unidade de Inteligencia Financeira) do Brasil. Recebe comunicacoes de operacoes
            suspeitas (STR) das instituicoes obrigadas, analisa e compartilha inteligencia com orgaos de
            investigacao (Policia Federal, Ministerio Publico, Receita Federal). O COAF NAO investiga
            diretamente — ele produz inteligencia financeira. Em 2023, o COAF recebeu mais de 2,5 milhoes
            de comunicacoes e produziu mais de 15.000 relatorios de inteligencia.
          </p>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 3. KYC Obrigatorio                                                  */
    /* ------------------------------------------------------------------ */
    {
      id: "kyc",
      title: "KYC Obrigatorio — Conheca seu Cliente",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            KYC (Know Your Customer) e o processo de identificacao, qualificacao e classificacao de risco
            do cliente. A Circular BCB 3.978/2020 define tres niveis de procedimentos: identificacao
            (dados cadastrais), qualificacao (perfil de atividade) e classificacao de risco.
          </p>

          <p style={subheadingStyle}>Dados minimos de identificacao (PF)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.75rem" }}>
            {[
              "Nome completo",
              "CPF (validacao na Receita Federal)",
              "Data de nascimento",
              "Endereco completo (CEP, logradouro, numero, cidade, UF)",
              "Nacionalidade e naturalidade",
              "Documento de identificacao (RG, CNH, passaporte) — numero, orgao emissor, data",
              "Filiacao (nome da mae)",
              "PEP status (autodeclaracao + consulta em listas)",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0 }}>-</span>
                <span style={{ color: "var(--text-secondary)" }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Classificacao de Risco do Cliente</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Risco</th>
                  <th style={thStyle}>Criterios</th>
                  <th style={thStyle}>Due Diligence</th>
                  <th style={thStyle}>Revisao</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { risco: "Baixo", criterios: "PF, renda compativel, brasileiro, atividade comum", dd: "Simplificada (SDD)", rev: "A cada 5 anos" },
                  { risco: "Medio", criterios: "PJ pequena, atividade com risco moderado, movimentacao regular", dd: "Normal (CDD)", rev: "A cada 2 anos" },
                  { risco: "Alto", criterios: "PEP, pais de alto risco (FATF), atividade de alto risco, movimentacao atipica", dd: "Reforçada (EDD)", rev: "Anual" },
                  { risco: "Inaceitavel", criterios: "Shell company sem substancia, vinculacao a terrorismo, sancoes ativas", dd: "Recusar relacionamento", rev: "N/A" },
                ].map((item) => (
                  <tr key={item.risco}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.risco}</td>
                    <td style={tdStyle}>{item.criterios}</td>
                    <td style={tdStyle}>{item.dd}</td>
                    <td style={tdStyle}>{item.rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              KYC continuo (ongoing due diligence)
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              KYC nao e um evento unico no onboarding. A Circular 3.978 exige atualizacao cadastral
              periodica (minimo a cada 5 anos para baixo risco) e monitoramento continuo de mudancas
              de perfil. Trigger events: mudanca de PEP status, pais de sancao, volume atipico,
              informacao negativa em midia. Automacao via APIs de bureaus (Serasa, Boa Vista, BigData Corp).
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 4. Transaction Monitoring                                           */
    /* ------------------------------------------------------------------ */
    {
      id: "monitoramento",
      title: "Transaction Monitoring",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            O monitoramento de transacoes e o coracao do programa AML. Envolve analisar em tempo real
            (ou near-real-time) todas as transacoes para identificar padroes suspeitos. A Circular BCB
            3.978 exige monitoramento baseado em regras e cenarios tipicos de lavagem.
          </p>

          <p style={subheadingStyle}>Tipos de regras de monitoramento</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
            {[
              {
                tipo: "Threshold-based",
                desc: "Alertas quando valores excedem limites definidos. Ex: transacao unica acima de R$10.000, depositos em especie acima de R$50.000/mes.",
                exemplo: "IF single_transaction > R$10,000 AND payment_method = 'cash' THEN alert",
              },
              {
                tipo: "Pattern-based",
                desc: "Deteccao de padroes comportamentais suspeitos. Ex: structuring (multiplas transacoes abaixo do threshold), round-tripping, rapid movement of funds.",
                exemplo: "IF count(transactions < R$9,999 within 24h) > 3 AND same_beneficiary THEN alert",
              },
              {
                tipo: "Peer-group analysis",
                desc: "Comparacao com comportamento de pares similares. Ex: comerciante com ticket medio 5x acima da media do segmento.",
                exemplo: "IF merchant_avg_ticket > 5 * segment_avg_ticket THEN alert",
              },
              {
                tipo: "Network analysis",
                desc: "Analise de conexoes entre contas e entidades. Detecta redes de laranjas, contas conectadas por beneficiarios comuns.",
                exemplo: "IF transaction_network.shared_beneficiaries > 3 AND accounts_created < 30d THEN alert",
              },
              {
                tipo: "ML-based",
                desc: "Modelos de machine learning que aprendem padroes de transacoes normais e flagam anomalias. Reduzem false positives em 40-60%.",
                exemplo: "anomaly_score = model.predict(transaction_features) > threshold",
              },
            ].map((item) => (
              <div key={item.tipo} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>
                  {item.tipo}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>
                  {item.desc}
                </p>
                <div style={{ ...codeBlockStyle, marginTop: "0.25rem", marginBottom: 0, fontSize: "0.75rem", padding: "0.5rem 0.75rem" }}>
                  {item.exemplo}
                </div>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Metricas de eficacia do monitoramento</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>O que mede</th>
                  <th style={thStyle}>Benchmark</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { met: "SAR Rate", desc: "% de alertas que viram STR ao COAF", bench: "5-15% (muito alto = regras fracas, muito baixo = regras demais)" },
                  { met: "False Positive Rate", desc: "% de alertas que nao sao suspeitos apos investigacao", bench: "< 70% (industria: 80-95%, meta: < 70%)" },
                  { met: "Alert-to-case ratio", desc: "Alertas necessarios para gerar 1 caso real", bench: "10:1 a 20:1" },
                  { met: "Investigation time", desc: "Tempo medio para resolver um alerta", bench: "< 48h para prioridade alta" },
                ].map((item) => (
                  <tr key={item.met}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.met}</td>
                    <td style={tdStyle}>{item.desc}</td>
                    <td style={tdStyle}>{item.bench}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 5. STR — Comunicacao ao COAF                                        */
    /* ------------------------------------------------------------------ */
    {
      id: "str",
      title: "STR — Comunicacao ao COAF",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            A STR (Suspicious Transaction Report) ou Comunicacao de Operacao Suspeita e a obrigacao
            de reportar ao COAF transacoes que apresentem indicios de lavagem de dinheiro ou financiamento
            do terrorismo. E uma obrigacao legal — a nao comunicacao pode resultar em sancoes administrativas
            e criminais.
          </p>

          <p style={subheadingStyle}>Quando reportar (Art. 12, Circular 3.978)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.75rem" }}>
            {[
              "Operacoes inconsistentes com perfil do cliente (capacidade financeira, atividade)",
              "Operacoes que indiquem tentativa de burlar controles de PLD/FT (structuring)",
              "Operacoes envolvendo PEP sem justificativa economica clara",
              "Movimentacao de recursos de/para paises com deficiencias em AML (lista FATF)",
              "Operacoes com indicio de financiamento do terrorismo",
              "Operacoes que envolvam pessoas/entidades em listas de sancoes",
              "Comunicacao automatica: operacoes em especie acima de R$50.000",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "#ef4444", fontWeight: 600, flexShrink: 0 }}>!</span>
                <span style={{ color: "var(--text-secondary)" }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Processo de comunicacao</p>
          <div style={codeBlockStyle}>
{`FLUXO DE STR:

1. ALERTA gerado pelo sistema de monitoramento
   ↓
2. INVESTIGACAO pela equipe de compliance (analista L1/L2)
   - Prazo: 24-48h para prioridade alta
   - Revisar transacoes, perfil, documentos, midia adversa
   ↓
3. DECISAO: suspeito ou nao suspeito
   - Se nao suspeito: documentar justificativa, fechar alerta
   - Se suspeito: escalar para compliance officer
   ↓
4. PREPARACAO DA STR (compliance officer)
   - Preencher formulario SISCOAF com detalhes da operacao
   - Incluir: partes envolvidas, valores, datas, narrativa
   ↓
5. ENVIO AO COAF via SISCOAF
   - Prazo: 24h apos decisao de comunicar
   - Comunicacoes automaticas: D+1 do fato
   ↓
6. SIGILO ABSOLUTO
   - PROIBIDO informar cliente ou qualquer pessoa sobre a STR
   - Tipping-off e crime (Art. 10, Lei 9.613)
   - Manter registros por 5 anos`}
          </div>

          <div style={{ ...highlightBoxStyle, borderColor: "rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Consequencias da nao comunicacao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Nao reportar operacao suspeita pode resultar em: multa de ate R$20M por operacao (Resolucao BCB),
              responsabilidade criminal dos diretores de compliance, perda da licenca de funcionamento,
              dano reputacional severo. O BCB tem intensificado fiscalizacao — em 2023, aplicou mais de
              R$100M em multas por falhas de PLD/FT.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 6. Tipologias de Lavagem                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "tipologias",
      title: "Tipologias de Lavagem de Dinheiro",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Conhecer as tipologias (padroes/metodos) de lavagem e essencial para configurar regras
            de monitoramento eficazes. As tipologias evoluem com a tecnologia — Pix e criptoativos
            criaram novos vetores de lavagem.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              {
                tipo: "Structuring (Smurfing)",
                color: "#ef4444",
                desc: "Fracionar grandes valores em transacoes menores para evitar thresholds de reporte. Ex: depositar R$9.900 varias vezes em vez de R$50.000 de uma vez.",
                indicadores: "Multiplas transacoes logo abaixo do threshold, mesma conta/beneficiario, curto periodo, valores redondos proximos ao limite.",
                mitigacao: "Regras de agregacao temporal (soma de transacoes em janela de tempo). Monitorar por beneficiario, nao apenas por transacao.",
              },
              {
                tipo: "Layering via Pix",
                color: "#f59e0b",
                desc: "Uso de cascata de contas Pix para movimentar rapidamente dinheiro entre dezenas de contas em minutos, dificultando rastreamento.",
                indicadores: "Multiplos Pix em sequencia para contas diferentes, valores decrementais, contas recem-abertas, horarios atipicos.",
                mitigacao: "Network analysis em real-time, limitar Pix para contas novas, mecanismo de trava cautelar (DICT).",
              },
              {
                tipo: "Trade-based Money Laundering",
                color: "#8b5cf6",
                desc: "Manipulacao de valores em transacoes comerciais internacionais. Subfaturamento ou superfaturamento de importacoes/exportacoes.",
                indicadores: "Preco unitario muito acima/abaixo do mercado, comercio com paises de alto risco, inconsistencia entre volume e valor.",
                mitigacao: "Comparar precos com benchmarks de mercado (Comtrade). Cruzar dados comerciais com perfil do cliente.",
              },
              {
                tipo: "Contas de passagem (mule accounts)",
                color: "#22c55e",
                desc: "Uso de contas de terceiros (laranjas) para receber e repassar dinheiro. Comum em golpes e ransomware.",
                indicadores: "Conta recebe Pix de multiplas origens e redistribui rapidamente. Titular com perfil incompativel (estudante, aposentado com alto volume).",
                mitigacao: "Scoring de contas baseado em comportamento. Bloqueio preventivo para contas com padrao de passagem. Trava DICT.",
              },
              {
                tipo: "Criptoativos",
                color: "#3b82f6",
                desc: "Conversao de moeda fiduciaria para cripto, mixing/tumbling, conversao de volta. Dificulta rastreamento na blockchain.",
                indicadores: "Grandes volumes de compra de cripto em exchanges, uso de mixers, privacy coins (Monero), P2P trading.",
                mitigacao: "Blockchain analytics (Chainalysis, Elliptic). Travel Rule (FATF Rec. 16). KYC em on/off-ramps.",
              },
            ].map((item) => (
              <div key={item.tipo} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>
                  {item.tipo}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  {item.desc}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  <strong style={{ color: "#f59e0b" }}>Indicadores:</strong> {item.indicadores}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "#22c55e" }}>Mitigacao:</strong> {item.mitigacao}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 7. PEP                                                              */
    /* ------------------------------------------------------------------ */
    {
      id: "pep",
      title: "PEP — Pessoa Exposta Politicamente",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            PEP (Pessoa Exposta Politicamente) e toda pessoa que desempenha ou desempenhou, nos ultimos
            5 anos, cargo, emprego ou funcao publica relevante, no Brasil ou em pais estrangeiro.
            A classificacao como PEP exige Enhanced Due Diligence (EDD) — nao significa que a pessoa
            e suspeita, mas que o risco de corrupcao e maior.
          </p>

          <p style={subheadingStyle}>Quem e PEP (definicao Circular BCB 3.978)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.75rem" }}>
            {[
              "Chefes de Estado/Governo e seus familiares diretos",
              "Ministros de Estado, secretarios de governo",
              "Membros do Congresso Nacional, assembleias legislativas, camaras municipais",
              "Magistrados (STF, STJ, TSE, TRFs, TJs, TRT, TST, STM)",
              "Membros do Ministerio Publico e Tribunal de Contas",
              "Dirigentes de estatais, autarquias e fundacoes publicas",
              "Oficiais generais das Forcas Armadas",
              "Dirigentes de partidos politicos",
              "Familiares diretos (conjuge, filhos, pais) e estreitos colaboradores",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0 }}>-</span>
                <span style={{ color: "var(--text-secondary)" }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Enhanced Due Diligence para PEP</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Controle</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Frequencia</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ctrl: "Aprovacao seniority", desc: "Abertura de conta/relacionamento deve ser aprovada pela diretoria", freq: "No onboarding" },
                  { ctrl: "Origem dos recursos", desc: "Verificar e documentar origem e destino dos recursos", freq: "No onboarding + periodico" },
                  { ctrl: "Monitoramento reforçado", desc: "Thresholds menores, mais cenarios de alerta, revisao mais frequente", freq: "Continuo" },
                  { ctrl: "Midia adversa", desc: "Monitorar noticias negativas sobre o PEP e associados", freq: "Trimestral ou continuo" },
                  { ctrl: "Revisao cadastral", desc: "Atualizacao completa de dados e reavaliacao de risco", freq: "Anual" },
                ].map((item) => (
                  <tr key={item.ctrl}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.ctrl}</td>
                    <td style={tdStyle}>{item.desc}</td>
                    <td style={tdStyle}>{item.freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 8. Sanctions Screening                                              */
    /* ------------------------------------------------------------------ */
    {
      id: "sanctions",
      title: "Sanctions Screening",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Sanctions screening e o processo de verificar se clientes, contrapartes ou transacoes envolvem
            pessoas ou entidades em listas de sancoes internacionais. Diferente de AML (que busca atividade
            suspeita), sancoes sao proibicoes absolutas — nao ha tolerancia.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Lista</th>
                  <th style={thStyle}>Orgao</th>
                  <th style={thStyle}>Escopo</th>
                  <th style={thStyle}>Obrigatorio para</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { lista: "OFAC SDN List", orgao: "US Treasury", escopo: "Terrorismo, narcotrafico, proliferacao nuclear, regimes (Ira, Russia, etc.)", obrig: "Qualquer transacao em USD ou com nexo EUA" },
                  { lista: "EU Consolidated List", orgao: "Conselho da UE", escopo: "Sancoes da UE contra paises, entidades e individuos", obrig: "Transacoes em EUR ou com nexo UE" },
                  { lista: "UN Security Council", orgao: "ONU", escopo: "Terrorismo (Al-Qaeda, ISIS), proliferacao nuclear", obrig: "Todos os paises membros da ONU (Brasil incluso)" },
                  { lista: "CSNU (Brasil)", orgao: "MRE/BCB", escopo: "Listas da ONU internalizadas no Brasil", obrig: "Todas IFs brasileiras" },
                  { lista: "PEP lists", orgao: "Varios", escopo: "Pessoas expostas politicamente (nao e sancao, mas requer EDD)", obrig: "Todas IFs reguladas" },
                ].map((item) => (
                  <tr key={item.lista}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.lista}</td>
                    <td style={tdStyle}>{item.orgao}</td>
                    <td style={tdStyle}>{item.escopo}</td>
                    <td style={tdStyle}>{item.obrig}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Real-time vs Batch Screening</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              <strong>Real-time screening</strong> e executado no momento da transacao (onboarding, pagamento,
              transferencia). Latencia aceitavel: 200-500ms. Usado para: Pix (obrigatorio em tempo real),
              wire transfers, card payments.<br /><br />
              <strong>Batch screening</strong> e executado periodicamente contra toda a base de clientes
              quando listas sao atualizadas. Frequencia: diaria ou quando ha atualizacao de lista.
              OFAC atualiza frequentemente (varias vezes por semana). Ambos sao necessarios —
              real-time para novas transacoes, batch para capturar novos sancionados.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 9. Programa de Compliance AML                                       */
    /* ------------------------------------------------------------------ */
    {
      id: "programa",
      title: "Programa de Compliance AML",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Um programa de compliance AML eficaz exige cinco pilares fundamentais, conforme requerido
            pela Circular BCB 3.978/2020 e alinhado com as recomendacoes do FATF (Financial Action Task Force).
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              {
                pilar: "1. Politicas e procedimentos",
                color: "#3b82f6",
                items: [
                  "Politica de PLD/FT aprovada pela diretoria e revisada anualmente",
                  "Procedimentos de KYC (onboarding, ongoing, EDD)",
                  "Procedimentos de monitoramento de transacoes",
                  "Procedimentos de comunicacao ao COAF (STR)",
                  "Politica de retencao de registros (minimo 5 anos)",
                  "Politica de sanctions screening",
                ],
              },
              {
                pilar: "2. Governanca e responsabilidades",
                color: "#22c55e",
                items: [
                  "Diretor de PLD/FT nomeado (registrado no BCB)",
                  "Comite de PLD/FT com reunioes trimestrais",
                  "Linha de reporte direta a diretoria executiva",
                  "Independencia da area de compliance",
                  "Budget dedicado para tecnologia e equipe",
                ],
              },
              {
                pilar: "3. Treinamento",
                color: "#f59e0b",
                items: [
                  "Treinamento obrigatorio anual para todos os funcionarios",
                  "Treinamento especializado para equipe de compliance",
                  "Treinamento para frontline (atendimento, comercial) sobre red flags",
                  "Registrar presenca e avaliar compreensao",
                  "Atualizar conteudo com novas tipologias e regulacoes",
                ],
              },
              {
                pilar: "4. Auditoria e testes",
                color: "#8b5cf6",
                items: [
                  "Auditoria interna anual do programa de PLD/FT",
                  "Auditoria externa independente (recomendado a cada 2-3 anos)",
                  "Teste de eficacia dos cenarios de monitoramento",
                  "Backtesting: verificar se casos reais teriam sido detectados",
                  "Gap analysis contra regulacao vigente",
                ],
              },
              {
                pilar: "5. Cultura de compliance",
                color: "#ec4899",
                items: [
                  "Tone from the top: diretoria demonstra comprometimento",
                  "Canal de denuncia anonimo (whistleblower)",
                  "Incentivos para reporte de suspeitas (nao punitivo)",
                  "Integracao de PLD/FT no processo de desenvolvimento de produtos",
                  "Compliance by design: considerar PLD/FT desde o inicio",
                ],
              },
            ].map((item) => (
              <div key={item.pilar} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
                  {item.pilar}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {item.items.map((sub, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.825rem" }}>
                      <span style={{ color: item.color, fontWeight: 600, flexShrink: 0 }}>-</span>
                      <span style={{ color: "var(--text-secondary)" }}>{sub}</span>
                    </div>
                  ))}
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
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          PLD/FT — Anti-Money Laundering
        </h1>
        <p className="page-description">
          Guia completo sobre Prevencao a Lavagem de Dinheiro e Financiamento do Terrorismo:
          regulacao brasileira, KYC, monitoramento de transacoes, comunicacao ao COAF,
          tipologias de lavagem, PEP e programa de compliance.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>O que e PLD/FT e por que e critico para empresas de pagamento</li>
          <li>Arcabouco regulatorio brasileiro: Circular 3.978, Lei 9.613, COAF</li>
          <li>Processo completo de KYC: identificacao, qualificacao, classificacao de risco</li>
          <li>Transaction monitoring: regras, alertas, investigacao e metricas</li>
          <li>Como e quando reportar operacoes suspeitas ao COAF (STR)</li>
          <li>Tipologias de lavagem: structuring, layering, trade-based, criptoativos</li>
          <li>Enhanced Due Diligence para PEP e sanctions screening</li>
          <li>Como estruturar um programa de compliance AML completo</li>
        </ul>
      </div>

      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tipologias</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Listas Sancao</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Pilares AML</div>
        </div>
      </div>

      {sections.map((section, idx) => (
        <div key={section.id} className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`} style={sectionStyle}>
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

      <div style={{ ...sectionStyle, marginTop: "2rem" }}>
        <h2 style={headingStyle}>Paginas Relacionadas</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { name: "LGPD e Privacidade", href: "/knowledge/lgpd-payments" },
            { name: "Matriz Regulatoria", href: "/knowledge/regulatory-matrix" },
            { name: "Reconciliacao", href: "/knowledge/reconciliation-deep" },
            { name: "Payment Methods BR", href: "/knowledge/payment-methods-br" },
            { name: "Treasury & Float", href: "/knowledge/treasury-float" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{
              padding: "0.375rem 0.75rem", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--background)",
              color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500,
              textDecoration: "none", transition: "all 0.2s",
            }}>
              {link.name}
            </Link>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.5 }}>
          Fontes: Lei 9.613/1998, Circular BCB 3.978/2020, COAF, FATF Recommendations,
          OFAC SDN List, EU Consolidated List.
        </p>
      </div>
    </div>
  );
}
