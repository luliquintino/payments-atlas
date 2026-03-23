"use client";

import { useState } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

const sectionStyle: React.CSSProperties = { padding: "1.5rem", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", marginBottom: "1.25rem" };
const headingStyle: React.CSSProperties = { fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" };
const paragraphStyle: React.CSSProperties = { fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "0.75rem" };
const subheadingStyle: React.CSSProperties = { fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem", marginTop: "1rem" };
const tableWrapperStyle: React.CSSProperties = { overflowX: "auto", marginTop: "0.75rem", marginBottom: "0.75rem" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" };
const thStyle: React.CSSProperties = { padding: "0.625rem 0.75rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", borderBottom: "2px solid var(--border)", background: "var(--surface)" };
const tdStyle: React.CSSProperties = { padding: "0.625rem 0.75rem", borderBottom: "1px solid var(--border)", color: "var(--foreground)", verticalAlign: "top" };
const highlightBoxStyle: React.CSSProperties = { padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.06)", marginTop: "0.75rem", marginBottom: "0.75rem" };
const pillarCardStyle: React.CSSProperties = { padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--background)", marginBottom: "0.75rem" };
const tagStyle: React.CSSProperties = { display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 600, background: "var(--primary-bg)", color: "var(--primary)", marginRight: "0.375rem", marginBottom: "0.25rem" };

interface Section { id: string; title: string; icon: string; content: React.ReactNode; }

export default function TeamCareerPage() {
  const quiz = getQuizForPage("/knowledge/team-career");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "objetivos",
      title: "Objetivos de Aprendizado",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>Ao final deste modulo, voce sera capaz de:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              "Desenhar a estrutura organizacional de um time de pagamentos por estagio",
              "Identificar e descrever os papeis-chave: PM, Engineer, Risk, Compliance, Treasury",
              "Dimensionar o time adequado para startup, scale-up e enterprise",
              "Mapear career paths em pagamentos — IC, management e specialist tracks",
              "Definir skills essenciais tecnicos e de negocio para cada papel",
              "Conduzir processos de contratacao especificos para pagamentos",
              "Implementar cultura de on-call, incident management e compliance training",
              "Conhecer certificacoes, faixas salariais e tendencias do mercado de trabalho",
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
    {
      id: "estrutura-time",
      title: "Estrutura de um Time de Pagamentos",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Um time de pagamentos completo envolve multiplas disciplinas que nao existem em empresas de software
            tradicionais. Alem de engenharia e produto, sao necessarias areas especializadas em risco, compliance,
            operacoes financeiras e tesouraria. A estrutura varia com o estagio da empresa, mas as funcoes-chave
            sao constantes.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Area</th>
                  <th style={thStyle}>Funcao</th>
                  <th style={thStyle}>Reports para</th>
                  <th style={thStyle}>Interacao principal</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { area: "Product", funcao: "Estrategia de produto, roadmap, priorizacao de features, discovery com merchants", reports: "CPO / Head of Product", inter: "Engineering, Design, Sales, Merchants" },
                  { area: "Engineering", funcao: "Desenvolvimento de APIs, integracao com acquirers, infraestrutura de processamento, monitoring", reports: "CTO / VP Engineering", inter: "Product, DevOps, Risk, Compliance" },
                  { area: "Risk & Fraud", funcao: "Modelos de fraude, regras de risco, monitoring de transacoes, decisoes de bloqueio", reports: "CRO / Head of Risk", inter: "Engineering, Ops, Compliance, Data Science" },
                  { area: "Compliance & Legal", funcao: "Regulacao BACEN, PCI DSS, LGPD, licencas, reporting regulatorio, contratos", reports: "CLO / Head of Compliance", inter: "Risk, Product, Finance, Reguladores" },
                  { area: "Operations", funcao: "Onboarding de merchants, suporte, reconciliacao, disputas, settlement ops", reports: "COO / Head of Ops", inter: "Finance, Engineering, Support, Merchants" },
                  { area: "Finance / Treasury", funcao: "Cash management, settlement, funding, hedge, contabilidade de transacoes", reports: "CFO / Head of Treasury", inter: "Ops, Compliance, Banking partners, Acquirers" },
                ].map((row) => (
                  <tr key={row.area}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.area}</td>
                    <td style={tdStyle}>{row.funcao}</td>
                    <td style={tdStyle}>{row.reports}</td>
                    <td style={tdStyle}>{row.inter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "papeis-chave",
      title: "Papeis-Chave em Pagamentos",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Cada papel em pagamentos exige um mix unico de habilidades tecnicas e de dominio. Profissionais que
            dominam tanto a tecnologia quanto o negocio de pagamentos sao extremamente valorizados no mercado.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { role: "Payment Product Manager", emoji: "📋", skills: "Entendimento profundo de fluxos de pagamento, regulacao, unit economics. Capacidade de traduzir requisitos de compliance em features de produto. Priorizacao baseada em impacto de revenue.", day: "Discovery com merchants, analise de auth rate, definicao de requisitos para nova integracao, QBR com acquirer." },
              { role: "Payment Engineer (Backend)", emoji: "⚙️", skills: "Distributed systems, idempotency, event sourcing, financial reconciliation. Experiencia com APIs de acquirers, protocolos ISO 8583/ISO 20022. Obsessao com reliability.", day: "Implementar retry logic para webhook, investigar transacao presa, otimizar latencia de roteamento, code review." },
              { role: "Risk/Fraud Analyst", emoji: "🔍", skills: "Data analysis, ML basics, pattern recognition. Conhecimento de fraud typologies (friendly fraud, account takeover, card testing). SQL avancado, ferramentas de monitoring.", day: "Analisar spike de chargebacks, ajustar regras de fraude, investigar caso suspeito, revisar metricas de false positive rate." },
              { role: "Compliance Officer", emoji: "⚖️", skills: "Regulacao financeira (BCB, CMN, COAF), PCI DSS, LGPD, AML/KYC. Capacidade de interpretar normas e traduzi-las em processos operacionais.", day: "Revisar novo produto para compliance, preparar reporting ao BCB, atualizar politica de AML, treinar equipe." },
              { role: "Treasury / Settlement Manager", emoji: "💰", skills: "Cash management, reconciliacao financeira, contabilidade de pagamentos (double-entry). Entendimento de settlement flows e funding.", day: "Reconciliar settlement do dia anterior, gerenciar posicao de caixa, resolver break de reconciliacao, otimizar float." },
              { role: "Payment Support Specialist", emoji: "🎧", skills: "Conhecimento tecnico de APIs e fluxos de pagamento. Capacidade de diagnosticar problemas em tempo real. Empatia com merchants em situacoes de stress financeiro.", day: "Resolver ticket de transacao recusada, auxiliar integracao de novo merchant, escalar incidente de processamento." },
            ].map((item) => (
              <div key={item.role} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.role}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>
                  <strong style={{ color: "var(--foreground)" }}>Skills:</strong> {item.skills}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--foreground)" }}>Dia tipico:</strong> {item.day}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "sizing-time",
      title: "Sizing do Time por Estagio",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            O tamanho e a composicao do time de pagamentos variam dramaticamente conforme o estagio da empresa.
            E comum empresas subestimarem a necessidade de funcoes nao-engineering como compliance e treasury.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Estagio</th>
                  <th style={thStyle}>Headcount</th>
                  <th style={thStyle}>GMV tipico</th>
                  <th style={thStyle}>Composicao</th>
                  <th style={thStyle}>Prioridades</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { estagio: "Startup / MVP", hc: "5-10", gmv: "< R$50M/mes", comp: "2-3 Engineers, 1 PM, 1 Risk/Compliance (hibrido), 1 Ops. Fundadores cobrem gaps.", prior: "Ship rapido, validar PMF, compliance basico, 1-2 metodos de pagamento." },
                  { estagio: "Scale-up", hc: "20-50", gmv: "R$50M - R$1B/mes", comp: "8-15 Engineers (backend, infra, frontend), 2-3 PMs, 3-5 Risk, 2-3 Compliance, 3-5 Ops, 2-3 Finance/Treasury.", prior: "Escalar infra, multi-acquirer, antifraude proprio, compliance robusto, SLA formal." },
                  { estagio: "Enterprise", hc: "100+", gmv: "> R$1B/mes", comp: "30-50 Engineers (squads por dominio), 5-8 PMs, 10-15 Risk, 5-10 Compliance, 15-20 Ops, 5-10 Finance. Plus: Data Science, Legal, Internal Audit.", prior: "Otimizacao de margem, global expansion, regulacao multi-jurisdicao, SOX compliance, M&A de capabilities." },
                ].map((row) => (
                  <tr key={row.estagio}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.estagio}</td>
                    <td style={tdStyle}><span style={tagStyle}>{row.hc}</span></td>
                    <td style={tdStyle}>{row.gmv}</td>
                    <td style={tdStyle}>{row.comp}</td>
                    <td style={tdStyle}>{row.prior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>Erro comum</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Startups frequentemente contratam 100% engineering e zero compliance. Isso funciona ate o primeiro
              problema regulatorio ou fraude significativa. A recomendacao e ter pelo menos uma pessoa hibrida
              Risk/Compliance desde o dia 1, mesmo que part-time ou consultoria.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "career-paths",
      title: "Career Paths em Pagamentos",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Pagamentos oferece tres tracks de carreira distintos, cada um com progressao clara e teto salarial
            diferente. Profissionais podem transitar entre tracks, especialmente entre IC e Management.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { track: "IC Track (Individual Contributor)", color: "#3b82f6", levels: "Junior Engineer → Mid → Senior → Staff → Principal → Distinguished", desc: "Profundidade tecnica crescente. Staff+ define arquitetura, resolve problemas cross-team, mentora seniors. Principal/Distinguished influencia a estrategia tecnica da empresa inteira.", comp: "Senior: R$25-40K (BR) / $150-200K (US). Staff: R$40-60K (BR) / $200-300K (US). Principal: R$60-100K (BR) / $300-450K (US)." },
              { track: "Management Track", color: "#22c55e", levels: "Tech Lead → Engineering Manager → Director → VP → CTO", desc: "Responsabilidade crescente por pessoas, delivery e estrategia. Manager gerencia um squad. Director gerencia managers. VP define estrategia da area. CTO define estrategia tecnica da empresa.", comp: "Manager: R$30-50K (BR) / $180-250K (US). Director: R$50-80K (BR) / $250-350K (US). VP: R$80-150K (BR) / $350-500K (US)." },
              { track: "Specialist Track", color: "#f59e0b", levels: "Analyst → Specialist → Senior Specialist → Head → Director of [Fraud/Compliance/Treasury]", desc: "Deep expertise em dominio especifico. Fraud, Compliance, Treasury, Risk Modeling. Altamente valorizado por ser raro. Poucos profissionais dominam regulacao financeira + tecnologia.", comp: "Senior Specialist: R$20-35K (BR) / $130-180K (US). Head: R$40-60K (BR) / $180-280K (US). Director: R$60-100K (BR) / $250-400K (US)." },
            ].map((item) => (
              <div key={item.track} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>{item.track}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--primary)", marginBottom: "0.375rem", fontFamily: "monospace" }}>{item.levels}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6, fontStyle: "italic" }}>{item.comp}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "skills-essenciais",
      title: "Skills Essenciais",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Profissionais de pagamentos precisam de um mix raro de habilidades tecnicas e de dominio.
            As melhores contratacoes sao T-shaped: profundas em uma area e com conhecimento amplo do ecossistema.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Categoria</th>
                  <th style={thStyle}>Skill</th>
                  <th style={thStyle}>Nivel esperado</th>
                  <th style={thStyle}>Por que importa</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cat: "Technical", skill: "Distributed Systems", nivel: "Senior+", why: "Pagamentos = sistemas distribuidos em tempo real. Idempotency, eventual consistency, saga pattern." },
                  { cat: "Technical", skill: "API Design", nivel: "Mid+", why: "APIs sao o produto. Versionamento, backward compatibility, webhook design, error handling." },
                  { cat: "Technical", skill: "Financial Protocols", nivel: "Especialista", why: "ISO 8583 (cartoes), ISO 20022 (Pix/SWIFT), boleto specs. Necessario para integracoes diretas." },
                  { cat: "Technical", skill: "Security & Cryptography", nivel: "Senior+", why: "PCI DSS, tokenization, encryption at rest/transit, HSM, key management. Non-negotiable em pagamentos." },
                  { cat: "Business", skill: "Unit Economics", nivel: "Mid+", why: "Entender interchange, MDR, net revenue. Sem isso, impossivel tomar decisoes de produto e pricing." },
                  { cat: "Business", skill: "Regulacao financeira", nivel: "Mid+", why: "BACEN, CMN, PCI, LGPD, AML. Regulacao define o que e possivel e o que e proibido." },
                  { cat: "Business", skill: "Merchant operations", nivel: "Junior+", why: "Entender o dia-a-dia do merchant: reconciliacao, chargebacks, settlement. Empatia com o usuario." },
                  { cat: "Soft", skill: "Incident management", nivel: "Mid+", why: "Pagamentos caem, dinheiro some, fraudes acontecem. Saber agir sob pressao e comunicar claramente." },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.cat}</td>
                    <td style={tdStyle}>{row.skill}</td>
                    <td style={tdStyle}><span style={tagStyle}>{row.nivel}</span></td>
                    <td style={tdStyle}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "como-contratar",
      title: "Como Contratar em Pagamentos",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Contratar para pagamentos e desafiador porque o pool de talentos e pequeno. A maioria dos
            profissionais experientes esta em bancos, fintechs estabelecidas ou grandes acquirers.
            Saber onde encontrar e como avaliar candidatos e uma vantagem competitiva.
          </p>
          <p style={subheadingStyle}>Onde encontrar talentos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {[
              "Ex-funcionarios de banks (Itau, Bradesco) e acquirers (Cielo, Rede) — profundo conhecimento do sistema, mas podem ser lentos em ambientes ageis.",
              "Ex-funcionarios de fintechs (Stripe, Adyen, Stone, PagSeguro) — experiencia prática em escala, cultura de startup.",
              "Comunidades: Payment Nerds (Slack), Payments Association, eventos ABECS, Fintech meetups.",
              "Universidades: programas de Engenharia de Software + MBA ou especializacao em financas.",
              "Referrals de funcionarios atuais — canal #1 para pagamentos. O ecossistema e pequeno e conectado.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0 }}>•</span>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={subheadingStyle}>Perguntas de entrevista</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {[
              "Explique o que acontece quando um cliente passa o cartao ate o dinheiro cair na conta do merchant.",
              "Como voce desenharia um sistema de retry para transacoes que falham no acquirer? E se a resposta for timeout?",
              "Qual a diferenca entre interchange, scheme fee e acquirer margin? Como voce otimizaria o custo?",
              "Descreva um incidente de pagamento que voce gerenciou. Como priorizou, comunicou e resolveu?",
              "Como voce definiria regras de fraude que minimizem false positives sem aumentar chargebacks?",
            ].map((q, i) => (
              <div key={i} style={pillarCardStyle}>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--foreground)" }}>Q{i + 1}:</strong> {q}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "cultura-processos",
      title: "Cultura e Processos",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Times de pagamentos operam em regime critico — qualquer erro pode significar perda financeira
            real para merchants e usuarios. Isso exige uma cultura especifica de reliability, accountability
            e melhoria continua.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { proc: "On-call rotations", desc: "Pagamentos precisam de cobertura 24/7/365. Rotacao semanal entre engineers, com escalonamento para management. Ferramentas: PagerDuty, OpsGenie. Compensacao: adicional de on-call (10-20% do salario) ou folga compensatoria." },
              { proc: "Incident management", desc: "Classificacao por severidade: SEV1 (pagamentos parados), SEV2 (degradacao), SEV3 (bug nao-critico). War room para SEV1 com roles definidos (IC, Comms, Customer). Tempo maximo de resposta: SEV1 < 15min, SEV2 < 1h." },
              { proc: "Blameless post-mortems", desc: "Apos todo SEV1/SEV2, post-mortem em 48h. Foco em causas raiz e acoes preventivas, nao em culpados. Template: Timeline, Impact, Root Cause, Contributing Factors, Action Items com owners e deadlines." },
              { proc: "Compliance training", desc: "Treinamento obrigatorio para todo o time: PCI DSS awareness (anual), AML basics (semestral), LGPD (anual), secure coding (trimestral para eng). Documentar participacao para auditorias." },
              { proc: "Change management", desc: "Qualquer mudanca em producao que afete fluxo de dinheiro requer approval de pelo menos 2 engineers + 1 PM/Risk. Deploy em pagamentos: feature flags, canary releases, rollback automatico." },
            ].map((item) => (
              <div key={item.proc} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>{item.proc}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "certificacoes",
      title: "Certificacoes e Formacao",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Certificacoes em pagamentos sao um diferencial significativo no mercado de trabalho. Elas demonstram
            conhecimento especializado e, em alguns casos, sao requisitos regulatorios para certos papeis.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Certificacao</th>
                  <th style={thStyle}>Area</th>
                  <th style={thStyle}>Emissor</th>
                  <th style={thStyle}>Para quem</th>
                  <th style={thStyle}>Investimento</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cert: "PCI QSA / ISA", area: "Seguranca", emissor: "PCI Council", para: "Engineers, Compliance, Security", invest: "R$ 5-15K (curso) + exame" },
                  { cert: "CAMS", area: "Anti-Money Laundering", emissor: "ACAMS", para: "Compliance, Risk, Legal", invest: "US$ 1,500-2,500" },
                  { cert: "CFE", area: "Fraud Examination", emissor: "ACFE", para: "Risk, Fraud analysts", invest: "US$ 500-1,000" },
                  { cert: "CFA (Level 1-3)", area: "Financas", emissor: "CFA Institute", para: "Treasury, Finance, PM", invest: "US$ 1,000-2,500/nivel" },
                  { cert: "AWS Solutions Architect", area: "Cloud / Infra", emissor: "AWS", para: "Engineers, DevOps", invest: "US$ 300 + preparacao" },
                  { cert: "Payments Certification", area: "Pagamentos geral", emissor: "ETA (Electronic Transactions Assoc.)", para: "Todos os papeis", invest: "US$ 300-500" },
                ].map((row) => (
                  <tr key={row.cert}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.cert}</td>
                    <td style={tdStyle}>{row.area}</td>
                    <td style={tdStyle}>{row.emissor}</td>
                    <td style={tdStyle}>{row.para}</td>
                    <td style={tdStyle}>{row.invest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Recursos de formacao</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {[
              "Visa University — cursos gratuitos sobre produtos Visa, regulacao, fraude.",
              "Mastercard Academy — treinamentos sobre rede Mastercard, tokenization, 3DS.",
              "Stripe Press — livros e conteudo sobre economia de pagamentos.",
              "ABECS — Associacao Brasileira das Empresas de Cartoes de Credito e Servicos.",
              "BCB (Banco Central) — documentacao tecnica de Pix, SPB, Open Finance.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0 }}>•</span>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "salarios-mercado",
      title: "Salarios e Mercado de Trabalho",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            O mercado de pagamentos esta em alta demanda global. Profissionais com experiencia real em payment
            processing sao raros e comandam premios salariais de 20-40% sobre posicoes equivalentes em tech generica.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Papel</th>
                  <th style={thStyle}>Brasil (CLT mensal)</th>
                  <th style={thStyle}>EUA (anual)</th>
                  <th style={thStyle}>Remoto Global</th>
                  <th style={thStyle}>Demanda</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { papel: "Payment Engineer (Senior)", br: "R$ 18-35K", us: "$150-220K", remote: "$80-150K", demanda: "Muito alta" },
                  { papel: "Payment PM (Senior)", br: "R$ 20-35K", us: "$160-230K", remote: "$90-160K", demanda: "Alta" },
                  { papel: "Staff/Principal Engineer", br: "R$ 35-60K", us: "$220-350K", remote: "$120-250K", demanda: "Muito alta" },
                  { papel: "Risk/Fraud Analyst (Senior)", br: "R$ 12-22K", us: "$100-160K", remote: "$60-120K", demanda: "Alta" },
                  { papel: "Compliance Officer (Senior)", br: "R$ 15-28K", us: "$120-180K", remote: "$70-130K", demanda: "Alta" },
                  { papel: "Head of Payments", br: "R$ 40-80K", us: "$250-400K", remote: "$150-300K", demanda: "Muito alta" },
                  { papel: "Treasury Manager", br: "R$ 15-30K", us: "$120-180K", remote: "$70-130K", demanda: "Media-Alta" },
                ].map((row) => (
                  <tr key={row.papel}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.papel}</td>
                    <td style={tdStyle}>{row.br}</td>
                    <td style={tdStyle}>{row.us}</td>
                    <td style={tdStyle}>{row.remote}</td>
                    <td style={tdStyle}><span style={tagStyle}>{row.demanda}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>Tendencias do mercado</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Trabalho remoto ampliou oportunidades — engineers brasileiros trabalham para Stripe, Adyen e fintechs
              europeias ganhando em dolar/euro. Demand por Pix specialists e muito alta apos sucesso do sistema.
              Profissionais com experiencia em cross-border payments e crypto/CBDC estao entre os mais procurados.
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Organizacao de Times e Carreira em Pagamentos</h1>
        <p className="page-description">
          Guia completo sobre como estruturar times de pagamentos, papeis-chave, career paths,
          skills essenciais, certificacoes, salarios e tendencias do mercado de trabalho.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>Estruturar times de pagamentos por estagio de empresa</li>
          <li>Entender papeis, skills e career paths especificos de pagamentos</li>
          <li>Contratar e desenvolver talentos no ecossistema</li>
          <li>Implementar cultura de reliability e compliance</li>
        </ul>
      </div>

      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[{ v: "10", l: "Secoes" }, { v: "6", l: "Papeis" }, { v: "3", l: "Tracks" }, { v: "6", l: "Certificacoes" }].map((s) => (
          <div key={s.l} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{s.v}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {sections.map((section, idx) => (
        <div key={section.id} className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`} style={sectionStyle}>
          <h2 style={headingStyle}>
            <span style={{ minWidth: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0, background: "var(--primary)", color: "#fff", padding: "0 0.25rem" }}>{section.icon}</span>
            {section.title}
          </h2>
          {section.content}
        </div>
      ))}

      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>Teste seu Conhecimento</h2>
          <PageQuiz questions={quiz.questions} onComplete={(correct, total, xpEarned) => { recordQuiz(quiz.pageRoute, correct, total, xpEarned); setQuizCompleted(true); }} />
        </div>
      )}

      <div style={{ ...sectionStyle, marginTop: "2rem" }}>
        <h2 style={headingStyle}>Paginas Relacionadas</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { name: "Go-to-Market", href: "/knowledge/go-to-market" },
            { name: "Unit Economics", href: "/knowledge/unit-economics" },
            { name: "Vendor Selection", href: "/knowledge/vendor-selection" },
            { name: "Embedded Finance", href: "/knowledge/embedded-finance" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>{link.name}</Link>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.5 }}>
          Fontes: Glassdoor, Levels.fyi, LinkedIn Salary Insights, pesquisas salariais Robert Half e Michael Page.
          Faixas salariais sao estimativas e variam por empresa, localizacao e experiencia.
        </p>
      </div>
    </div>
  );
}
