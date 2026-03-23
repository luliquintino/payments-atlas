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

export default function LGPDPaymentsPage() {
  const quiz = getQuizForPage("/knowledge/lgpd-payments");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    /* ------------------------------------------------------------------ */
    /* 1. Fundamentos da LGPD                                              */
    /* ------------------------------------------------------------------ */
    {
      id: "fundamentos",
      title: "Fundamentos da LGPD",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            A Lei Geral de Protecao de Dados (Lei 13.709/2018) e o marco regulatorio brasileiro para
            protecao de dados pessoais. Entrou em vigor em setembro de 2020 e as sancoes administrativas
            passaram a ser aplicadas em agosto de 2021. A ANPD (Autoridade Nacional de Protecao de Dados)
            e o orgao responsavel pela fiscalizacao e regulamentacao.
          </p>

          <p style={subheadingStyle}>Principios Fundamentais (Art. 6o)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
            {[
              { principle: "Finalidade", desc: "Tratamento para propositos legitimos, especificos e informados ao titular." },
              { principle: "Adequacao", desc: "Compatibilidade com as finalidades informadas." },
              { principle: "Necessidade", desc: "Minimo de dados necessarios para atingir a finalidade (data minimization)." },
              { principle: "Livre acesso", desc: "Consulta facilitada e gratuita sobre forma e duracao do tratamento." },
              { principle: "Qualidade dos dados", desc: "Exatidao, clareza, relevancia e atualizacao." },
              { principle: "Transparencia", desc: "Informacoes claras e acessiveis sobre o tratamento." },
              { principle: "Seguranca", desc: "Medidas tecnicas e administrativas para proteger os dados." },
              { principle: "Prevencao", desc: "Adocao de medidas para prevenir danos." },
              { principle: "Nao discriminacao", desc: "Impossibilidade de tratamento para fins discriminatorios ilicitos." },
              { principle: "Responsabilizacao", desc: "Demonstracao de adocao de medidas eficazes de compliance." },
            ].map((item) => (
              <div key={item.principle} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0, minWidth: "1rem" }}>-</span>
                <span style={{ color: "var(--foreground)" }}>
                  <strong>{item.principle}:</strong>{" "}
                  <span style={{ color: "var(--text-secondary)" }}>{item.desc}</span>
                </span>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Bases Legais (Art. 7o)</p>
          <p style={paragraphStyle}>
            A LGPD define 10 bases legais para tratamento de dados pessoais. Em pagamentos, as mais relevantes
            sao: consentimento, execucao de contrato, cumprimento de obrigacao legal/regulatoria (ex: BCB, COAF),
            exercicio regular de direitos em processo, protecao ao credito e legitimo interesse. A escolha da base
            legal correta e critica e deve ser documentada antes do inicio do tratamento.
          </p>

          <p style={subheadingStyle}>Direitos do Titular (Art. 18)</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Direito</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Prazo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { right: "Confirmacao", desc: "Confirmar a existencia de tratamento", prazo: "Imediato (simplificado) ou 15 dias (completo)" },
                  { right: "Acesso", desc: "Acessar os dados pessoais tratados", prazo: "15 dias" },
                  { right: "Correcao", desc: "Corrigir dados incompletos, inexatos ou desatualizados", prazo: "15 dias" },
                  { right: "Eliminacao", desc: "Eliminacao de dados desnecessarios ou tratados sem base legal", prazo: "15 dias" },
                  { right: "Portabilidade", desc: "Transferir dados a outro fornecedor de servico", prazo: "15 dias" },
                  { right: "Revogacao", desc: "Revogar consentimento a qualquer momento", prazo: "Imediato" },
                ].map((item) => (
                  <tr key={item.right}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.right}</td>
                    <td style={tdStyle}>{item.desc}</td>
                    <td style={tdStyle}>{item.prazo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 2. Dados de Pagamento e LGPD                                        */
    /* ------------------------------------------------------------------ */
    {
      id: "dados-pagamento",
      title: "Dados de Pagamento e LGPD",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Uma das questoes mais complexas e definir quais dados de pagamento sao dados pessoais sob a LGPD.
            A lei define dado pessoal como &ldquo;informacao relacionada a pessoa natural identificada ou identificavel&rdquo;.
            A chave e a capacidade de identificacao — direta ou indireta.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Dado</th>
                  <th style={thStyle}>Dado pessoal?</th>
                  <th style={thStyle}>Justificativa</th>
                  <th style={thStyle}>Dado sensivel?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dado: "CPF", pessoal: "Sim", just: "Identificador direto de pessoa natural", sensivel: "Nao" },
                  { dado: "Nome do titular do cartao", pessoal: "Sim", just: "Identificacao direta", sensivel: "Nao" },
                  { dado: "Email", pessoal: "Sim", just: "Identificacao direta ou indireta", sensivel: "Nao" },
                  { dado: "PAN (numero do cartao)", pessoal: "Sim*", just: "Permite identificacao indireta via emissor. *Controverso", sensivel: "Nao" },
                  { dado: "Token de cartao", pessoal: "Nao**", just: "**Nao permite re-identificacao sem acesso ao vault", sensivel: "Nao" },
                  { dado: "Device ID / fingerprint", pessoal: "Sim", just: "Permite identificacao indireta (GDPR/ePrivacy confirmam)", sensivel: "Nao" },
                  { dado: "IP address", pessoal: "Sim", just: "Identificacao indireta (especialmente com ISP)", sensivel: "Nao" },
                  { dado: "Biometria (facial/digital)", pessoal: "Sim", just: "Dado sensivel - requer consentimento especifico", sensivel: "SIM" },
                  { dado: "Historico de transacoes", pessoal: "Sim", just: "Revela habitos e comportamento do titular", sensivel: "Nao" },
                  { dado: "Valor da transacao isolado", pessoal: "Nao", just: "Sem vinculacao a pessoa identificavel", sensivel: "Nao" },
                ].map((item) => (
                  <tr key={item.dado}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.dado}</td>
                    <td style={{ ...tdStyle, color: item.pessoal.startsWith("Sim") ? "#22c55e" : item.pessoal === "Nao" ? "var(--text-secondary)" : "#f59e0b" }}>{item.pessoal}</td>
                    <td style={tdStyle}>{item.just}</td>
                    <td style={{ ...tdStyle, fontWeight: item.sensivel === "SIM" ? 700 : 400, color: item.sensivel === "SIM" ? "#ef4444" : "var(--text-secondary)" }}>{item.sensivel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Implicacao pratica: Tokenizacao reduz escopo LGPD
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se voce substitui o PAN por um token irreversivel (sem acesso ao vault), o token deixa de ser dado
              pessoal. Isso reduz drasticamente o escopo de compliance LGPD para sistemas que so trabalham com tokens.
              Mas atencao: o vault em si continua sob escopo total da LGPD + PCI DSS.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 3. Bases Legais para Pagamentos                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "bases-legais",
      title: "Bases Legais para Pagamentos",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Escolher a base legal correta e crucial. Em pagamentos, raramente dependemos apenas de consentimento.
            A maioria das operacoes se apoia em execucao de contrato, obrigacao legal ou legitimo interesse.
            A base legal deve ser definida ANTES do tratamento e documentada no ROPA.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              {
                base: "Execucao de contrato",
                color: "#22c55e",
                uso: "Processar pagamento, entregar produto/servico",
                exemplos: "Cobrar cartao do cliente, processar Pix, enviar comprovante de pagamento",
                cuidado: "Limitar ao estritamente necessario para cumprir o contrato. Marketing nao entra aqui.",
              },
              {
                base: "Obrigacao legal/regulatoria",
                color: "#3b82f6",
                uso: "Atender exigencias do BCB, Receita Federal, COAF",
                exemplos: "Armazenar dados KYC por 5 anos (Circular 3.978), reportar STR ao COAF, enviar DIRF",
                cuidado: "Deve haver norma especifica que exija o tratamento. Manter referencia da norma.",
              },
              {
                base: "Legitimo interesse",
                color: "#f59e0b",
                uso: "Prevencao a fraude, analytics para melhoria de servico",
                exemplos: "Device fingerprinting para antifraude, scoring de risco, analise de padroes de transacao",
                cuidado: "Exige LIA (Legitimate Interest Assessment). Balancear interesse do controlador vs direitos do titular.",
              },
              {
                base: "Protecao ao credito",
                color: "#8b5cf6",
                uso: "Analise de credito, bureaus, scoring",
                exemplos: "Consultar SPC/Serasa, calcular score de credito, analise para BNPL",
                cuidado: "Base especifica do Brasil. Nao existe no GDPR. Uso restrito a protecao ao credito.",
              },
              {
                base: "Consentimento",
                color: "#ec4899",
                uso: "Compartilhamento com terceiros, marketing, Open Finance",
                exemplos: "Compartilhar dados via Open Finance, marketing personalizado, cookies nao essenciais",
                cuidado: "Deve ser livre, informado, inequivoco e para finalidade determinada. Pode ser revogado a qualquer momento.",
              },
            ].map((item) => (
              <div key={item.base} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>
                  {item.base}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  <strong style={{ color: "var(--foreground)" }}>Uso tipico:</strong> {item.uso}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  <strong style={{ color: "var(--foreground)" }}>Exemplos:</strong> {item.exemplos}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: item.color }}>Cuidado:</strong> {item.cuidado}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 4. Consentimento e Tokenizacao                                      */
    /* ------------------------------------------------------------------ */
    {
      id: "consentimento-tokenizacao",
      title: "Consentimento e Tokenizacao",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Consentimento e apenas UMA das 10 bases legais da LGPD — e na maioria das operacoes de pagamento,
            NAO e a base mais adequada. A tokenizacao, por sua vez, e uma ferramenta tecnica poderosa para
            reduzir o escopo de conformidade.
          </p>

          <p style={subheadingStyle}>Quando consentimento e necessario em pagamentos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.75rem" }}>
            {[
              "Compartilhamento de dados com terceiros para marketing",
              "Open Finance — compartilhamento entre instituicoes via API padronizada",
              "Armazenamento de cartao (card-on-file) para compras futuras",
              "Cookies e trackers nao essenciais (analytics, remarketing)",
              "Comunicacoes promocionais por email/SMS/push",
              "Uso de biometria para autenticacao de pagamento",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0 }}>-</span>
                <span style={{ color: "var(--text-secondary)" }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Como tokenizacao reduz escopo LGPD</p>
          <div style={codeBlockStyle}>
{`FLUXO SEM TOKENIZACAO (alto risco LGPD):
  Cliente → PAN 4111...1111 → Gateway → Processador → Banco
  Todos os sistemas armazenam dado pessoal → escopo LGPD total

FLUXO COM TOKENIZACAO (escopo reduzido):
  Cliente → PAN → Token Vault (unico ponto LGPD+PCI)
  Token tok_abc123 → Gateway → Processador → Banco
  Sistemas downstream so veem token → fora do escopo LGPD

RESULTADO:
  - Vault: escopo LGPD + PCI DSS (ambiente controlado)
  - Demais sistemas: SEM escopo LGPD para dados de cartao
  - Reducao de 80-90% dos sistemas em escopo de auditoria`}
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Network Tokenization (EMVCo) — nivel superior
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Alem da tokenizacao de vault (PSP-level), existe a network tokenization (Visa/Mastercard).
              O DPAN (Device PAN) substitui o PAN real ate na bandeira. Beneficios: taxa de aprovacao +2-5%,
              atualizacao automatica quando cartao expira, e o lojista NUNCA ve o PAN real.
              Em termos de LGPD, e o cenario ideal: o dado pessoal existe apenas no emissor.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 5. Data Residency                                                   */
    /* ------------------------------------------------------------------ */
    {
      id: "data-residency",
      title: "Data Residency e Transferencia Internacional",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            A LGPD permite transferencia internacional de dados pessoais, mas com restricoes (Art. 33).
            Para empresas de pagamento que usam processadores globais (Stripe, Adyen, AWS), isso e critico.
            Os dados podem sair do Brasil, mas e necessario garantir nivel adequado de protecao.
          </p>

          <p style={subheadingStyle}>Mecanismos de Transferencia (Art. 33)</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Mecanismo</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Status Atual</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { mec: "Paises com nivel adequado", desc: "ANPD reconhece que o pais destino oferece protecao equivalente", status: "Lista publicada em 2024 (UE, UK, Argentina, Uruguai e outros)" },
                  { mec: "Clausulas-padrao contratuais", desc: "Clausulas aprovadas pela ANPD inseridas em contratos entre controlador/operador", status: "Resolucao CD/ANPD publicada. Modelo disponivel." },
                  { mec: "Clausulas contratuais especificas", desc: "Clausulas customizadas para transferencia especifica", status: "Permitido, mas requer analise individual" },
                  { mec: "Consentimento especifico", desc: "Titular informado sobre riscos e consente de forma destacada", status: "Mecanismo subsidiario. Nao recomendado como base principal." },
                  { mec: "BCRs (Binding Corporate Rules)", desc: "Normas corporativas globais aprovadas pela ANPD", status: "ANPD ainda nao regulamentou o procedimento" },
                ].map((item) => (
                  <tr key={item.mec}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.mec}</td>
                    <td style={tdStyle}>{item.desc}</td>
                    <td style={tdStyle}>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Impacto pratico: Cloud providers e PSPs globais
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se voce usa AWS us-east-1 para processar pagamentos de brasileiros, esta fazendo transferencia
              internacional. Solucoes: (1) usar regiao sa-east-1 (Sao Paulo) quando possivel, (2) clausulas
              contratuais padrao com AWS/GCP/Azure, (3) para PSPs como Stripe/Adyen, garantir que o DPA
              (Data Processing Agreement) inclua clausulas-padrao ANPD. A maioria dos grandes providers
              ja atualizou seus contratos para compliance com LGPD.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 6. LGPD vs GDPR vs CCPA                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "comparativo",
      title: "LGPD vs GDPR vs CCPA — Comparativo",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Empresas de pagamento que operam globalmente precisam entender as diferencas entre os tres
            principais frameworks de protecao de dados. Embora inspirada no GDPR, a LGPD tem particularidades
            importantes, especialmente nas bases legais e sancoes.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>LGPD (Brasil)</th>
                  <th style={thStyle}>GDPR (UE)</th>
                  <th style={thStyle}>CCPA/CPRA (California)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { asp: "Ano", lgpd: "2018 (vigor 2020)", gdpr: "2016 (vigor 2018)", ccpa: "2018 (vigor 2020)" },
                  { asp: "Escopo territorial", lgpd: "Tratamento no Brasil OU dados de pessoas no Brasil", gdpr: "Tratamento na UE OU oferta a residentes da UE", ccpa: "Empresas que atendem residentes da California + thresholds de receita/volume" },
                  { asp: "Bases legais", lgpd: "10 bases (inclui protecao ao credito)", gdpr: "6 bases", ccpa: "Opt-out model (nao exige base legal)" },
                  { asp: "Dados sensiveis", lgpd: "Lista definida + biometria", gdpr: "Categorias especiais (Art. 9)", ccpa: "Sensitive personal information (CPRA)" },
                  { asp: "DPO obrigatorio?", lgpd: "Sim (todo controlador)", gdpr: "Sim (para certas atividades)", ccpa: "Nao" },
                  { asp: "Multa maxima", lgpd: "2% do faturamento Brasil (max R$50M por infracao)", gdpr: "4% do faturamento global (max EUR 20M)", ccpa: "$7.500 por violacao intencional" },
                  { asp: "Autoridade", lgpd: "ANPD", gdpr: "DPAs nacionais + EDPB", ccpa: "CPPA (California Privacy Protection Agency)" },
                  { asp: "Portabilidade", lgpd: "Sim (Art. 18)", gdpr: "Sim (Art. 20)", ccpa: "Sim (CPRA)" },
                  { asp: "Transferencia intl.", lgpd: "Adequacao, clausulas, consentimento", gdpr: "Adequacao, SCCs, BCRs", ccpa: "Sem restricao especifica" },
                  { asp: "Notificacao de breach", lgpd: "Prazo razoavel (ANPD definiu 3 dias uteis)", gdpr: "72 horas", ccpa: "Sem prazo especifico (lei estadual)" },
                ].map((item) => (
                  <tr key={item.asp}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.asp}</td>
                    <td style={tdStyle}>{item.lgpd}</td>
                    <td style={tdStyle}>{item.gdpr}</td>
                    <td style={tdStyle}>{item.ccpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Convergencia global
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Na pratica, se sua empresa esta em compliance com GDPR, adaptar para LGPD e relativamente simples.
              A maior diferenca e a base legal de &ldquo;protecao ao credito&rdquo; (exclusiva do Brasil) e o modelo de
              sancoes mais brando. Para PSPs globais, a estrategia recomendada e construir compliance
              para o framework mais restritivo (GDPR) e fazer ajustes locais.
            </p>
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 7. PCI DSS + LGPD                                                   */
    /* ------------------------------------------------------------------ */
    {
      id: "pci-lgpd",
      title: "PCI DSS + LGPD — Intercessao e Complementaridade",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            PCI DSS e LGPD sao frameworks complementares, nao substitutos. PCI DSS foca em SEGURANCA
            de dados de cartao. LGPD foca em PRIVACIDADE de dados pessoais. Um sistema pode ser PCI compliant
            mas violar LGPD (ex: armazenar dados sem base legal). E vice-versa.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>PCI DSS</th>
                  <th style={thStyle}>LGPD</th>
                  <th style={thStyle}>Sobreposicao</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { asp: "Foco", pci: "Seguranca de dados de cartao (CHD/SAD)", lgpd: "Privacidade de dados pessoais", over: "Ambos exigem protecao de dados" },
                  { asp: "Escopo de dados", pci: "PAN, CVV, expiry, track data, PIN", lgpd: "Qualquer dado pessoal (nome, CPF, email, IP...)", over: "PAN com nome = ambos" },
                  { asp: "Criptografia", pci: "Obrigatoria para CHD em repouso e transito", lgpd: "Recomendada como medida de seguranca", over: "Criptografia e melhor pratica para ambos" },
                  { asp: "Retencao", pci: "Minima necessaria. SAD nunca apos autorizacao", lgpd: "Pelo tempo necessario para a finalidade", over: "Ambos exigem minimizar retencao" },
                  { asp: "Logs/audit", pci: "Req. 10: rastrear todo acesso a CHD", lgpd: "Accountability: demonstrar compliance", over: "Logs servem para ambos" },
                  { asp: "Breach notification", pci: "Notificar bandeiras e acquirer", lgpd: "Notificar ANPD e titulares", over: "Incident response deve cobrir ambos" },
                  { asp: "Penalidade", pci: "Multas das bandeiras + perda de credenciamento", lgpd: "Multa de ate 2% faturamento (max R$50M)", over: "Dupla penalidade possivel" },
                ].map((item) => (
                  <tr key={item.asp}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.asp}</td>
                    <td style={tdStyle}>{item.pci}</td>
                    <td style={tdStyle}>{item.lgpd}</td>
                    <td style={{ ...tdStyle, fontStyle: "italic", color: "var(--primary)" }}>{item.over}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={codeBlockStyle}>
{`ESTRATEGIA UNIFICADA DE COMPLIANCE:

1. Inventario de dados unico
   - Mapear TODOS os dados (pessoais + cartao)
   - Classificar: PCI scope, LGPD scope, ambos, nenhum

2. Controles de seguranca compartilhados
   - Criptografia AES-256 (atende PCI + LGPD)
   - Controle de acesso RBAC (atende ambos)
   - Logging centralizado (atende ambos)

3. Processos distintos onde necessario
   - PCI: SAQ/ROC anual, ASV scan trimestral
   - LGPD: ROPA, DPIA, resposta a titulares

4. Incident response unificado
   - Playbook cobre notificacao a ANPD + bandeiras
   - Prazos: 72h ANPD, imediato bandeiras`}
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 8. Direitos do Titular em Pagamentos                               */
    /* ------------------------------------------------------------------ */
    {
      id: "direitos-titular",
      title: "Direitos do Titular em Pagamentos",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Implementar os direitos do titular em sistemas de pagamento e tecnicamente desafiador.
            Voce nao pode simplesmente deletar dados quando ha obrigacoes legais de retencao
            (ex: 5 anos para KYC/AML). A chave e balancear direitos do titular com obrigacoes regulatorias.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              {
                direito: "Direito de acesso",
                desafio: "Dados fragmentados entre PSP, gateway, antifraude, banco emissor",
                solucao: "Centralizar inventario de dados pessoais. API interna que consolida dados de todos os sistemas. Portal self-service para o titular.",
                prazo: "15 dias (formato simplificado imediato)",
              },
              {
                direito: "Direito de eliminacao",
                desafio: "Obrigacao legal de reter dados KYC por 5 anos (Circular BCB 3.978). Disputas de chargeback podem exigir dados por 540 dias.",
                solucao: "Negar eliminacao com base legal documentada. Implementar retencao granular: eliminar dados nao obrigatorios, reter apenas o minimo legal. Anonimizar quando possivel.",
                prazo: "15 dias para resposta (pode negar com justificativa)",
              },
              {
                direito: "Direito de portabilidade",
                desafio: "Open Finance ja regulamenta portabilidade de dados financeiros. Formato padrao: JSON via APIs reguladas pelo BCB.",
                solucao: "Implementar APIs Open Finance. Para dados fora do escopo Open Finance, exportar em formato estruturado (CSV/JSON). Garantir que dados de terceiros nao sejam incluidos.",
                prazo: "15 dias",
              },
              {
                direito: "Revogacao de consentimento",
                desafio: "Card-on-file: revogar = deletar token. Open Finance: revogar = desconectar instituicao. Marketing: revogar = parar comunicacoes.",
                solucao: "Mecanismo tao facil quanto o consentimento original. Deletar token do vault. Desconectar via API Open Finance. Unsubscribe em 1 clique.",
                prazo: "Imediato",
              },
            ].map((item) => (
              <div key={item.direito} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>
                  {item.direito}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  <strong style={{ color: "var(--foreground)" }}>Desafio:</strong> {item.desafio}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  <strong style={{ color: "#22c55e" }}>Solucao:</strong> {item.solucao}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--primary)" }}>Prazo:</strong> {item.prazo}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    /* ------------------------------------------------------------------ */
    /* 9. Implementacao Pratica                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "implementacao",
      title: "Implementacao Pratica — Programa de Privacidade",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Um programa de privacidade robusto para empresas de pagamento vai alem de politicas.
            Exige governanca, processos, tecnologia e cultura. Abaixo, os pilares de implementacao.
          </p>

          <p style={subheadingStyle}>DPO (Encarregado de Dados)</p>
          <p style={paragraphStyle}>
            A LGPD exige que todo controlador nomeie um DPO (Art. 41). Em empresas de pagamento, o DPO
            deve ter conhecimento de regulacao financeira (BCB, CVM) alem de privacidade. Pode ser pessoa
            fisica ou juridica, interna ou terceirizada. Deve ter canal de comunicacao publico.
          </p>

          <p style={subheadingStyle}>ROPA (Record of Processing Activities)</p>
          <div style={codeBlockStyle}>
{`ROPA PARA OPERACAO DE PAGAMENTO (exemplo):

| Atividade          | Dados tratados           | Base legal          | Finalidade                  | Retencao  |
|--------------------|--------------------------|--------------------|-----------------------------|-----------|
| Checkout           | Nome, CPF, email, PAN    | Exec. contrato     | Processar pagamento         | 5 anos    |
| KYC onboarding     | Nome, CPF, RG, selfie    | Obrig. legal (BCB) | Identificacao do cliente    | 5 anos    |
| Antifraude         | Device ID, IP, location  | Legit. interesse   | Prevencao a fraude          | 2 anos    |
| Marketing email    | Email, nome              | Consentimento      | Comunicacao promocional     | Ate revog.|
| Open Finance       | Dados bancarios          | Consentimento      | Compartilhamento regulado   | 12 meses  |
| Analytics          | Dados anonimizados       | N/A (anonimo)      | Metricas de negocio         | Indeter.  |`}
          </div>

          <p style={subheadingStyle}>DPIA (Data Protection Impact Assessment)</p>
          <p style={paragraphStyle}>
            Obrigatorio para tratamentos de alto risco. Em pagamentos, isso inclui: processamento em larga
            escala de dados financeiros, uso de biometria, scoring de credito, monitoramento sistematico
            de transacoes (antifraude). O DPIA deve avaliar: necessidade, proporcionalidade, riscos aos
            titulares e medidas de mitigacao.
          </p>

          <p style={subheadingStyle}>Incident Response para Breach de Dados</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {[
              { step: "1. Deteccao", desc: "Monitoramento 24/7, SIEM, alertas automaticos. Classificar severidade.", time: "0-1h" },
              { step: "2. Contencao", desc: "Isolar sistemas afetados, revogar credenciais comprometidas.", time: "1-4h" },
              { step: "3. Avaliacao", desc: "Determinar escopo: quais dados, quantos titulares, risco real.", time: "4-24h" },
              { step: "4. Notificacao ANPD", desc: "Comunicar em 3 dias uteis (Resolucao CD/ANPD). Formulario padrao.", time: "72h" },
              { step: "5. Notificacao titulares", desc: "Se risco relevante: comunicar titulares afetados de forma clara.", time: "72h" },
              { step: "6. Remediacao", desc: "Corrigir vulnerabilidade, fortalecer controles, lessions learned.", time: "1-4 sem." },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: "0.75rem", fontSize: "0.85rem", alignItems: "flex-start" }}>
                <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0, minWidth: "3rem" }}>{item.time}</span>
                <span style={{ color: "var(--foreground)" }}>
                  <strong>{item.step}:</strong>{" "}
                  <span style={{ color: "var(--text-secondary)" }}>{item.desc}</span>
                </span>
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
          LGPD e Privacidade em Pagamentos
        </h1>
        <p className="page-description">
          Guia completo sobre a aplicacao da Lei Geral de Protecao de Dados no ecossistema de pagamentos:
          bases legais, tokenizacao, PCI DSS, direitos do titular, transferencia internacional e
          implementacao pratica de um programa de privacidade.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Principios, bases legais e direitos do titular sob a LGPD</li>
          <li>Quais dados de pagamento sao dados pessoais e como classifica-los</li>
          <li>Como escolher a base legal correta para cada operacao de pagamento</li>
          <li>Tokenizacao como ferramenta de reducao de escopo LGPD</li>
          <li>Transferencia internacional de dados e data residency</li>
          <li>Comparativo LGPD vs GDPR vs CCPA para operacoes globais</li>
          <li>Intercessao PCI DSS + LGPD e estrategia unificada de compliance</li>
          <li>Implementacao pratica: DPO, ROPA, DPIA e incident response</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>10</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Bases Legais</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>3</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Frameworks</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Direitos</div>
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
            { name: "PLD/FT Anti-Lavagem", href: "/knowledge/pld-ft" },
            { name: "Matriz Regulatoria", href: "/knowledge/regulatory-matrix" },
            { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing" },
            { name: "InsurTech", href: "/knowledge/insurtech" },
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
          Fontes: Lei 13.709/2018 (LGPD), ANPD (guias e resolucoes), PCI Security Standards Council,
          GDPR (Regulamento UE 2016/679), CCPA/CPRA, Banco Central do Brasil (circulares e resolucoes).
        </p>
      </div>
    </div>
  );
}
