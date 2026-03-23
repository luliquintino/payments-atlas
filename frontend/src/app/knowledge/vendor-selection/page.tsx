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

export default function VendorSelectionPage() {
  const quiz = getQuizForPage("/knowledge/vendor-selection");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "objetivos", title: "Objetivos de Aprendizado", icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>Ao final deste modulo, voce sera capaz de:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              "Identificar sinais claros de que e hora de trocar de PSP ou acquirer",
              "Classificar tipos de fornecedores: PSP, Gateway, Acquirer, Orchestrator, BaaS, Anti-fraud",
              "Aplicar 15 criterios objetivos de avaliacao em um processo de selecao",
              "Estruturar e conduzir um processo de RFP completo para pagamentos",
              "Desenhar e executar um POC (Proof of Concept) com metricas claras de sucesso",
              "Negociar contratos com clausulas de protecao: SLA, exit, price lock",
              "Conduzir due diligence tecnica: API quality, uptime, PCI, SOC 2",
              "Planejar e executar uma migracao de PSP com zero downtime",
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
      id: "quando-trocar", title: "Quando Trocar de PSP", icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Trocar de PSP e uma decisao de alto impacto que envolve meses de trabalho tecnico, risco operacional
            e custo significativo. Porem, ficar com o PSP errado custa ainda mais a longo prazo. Estes sao os
            sinais claros de que uma mudanca e necessaria.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { sinal: "Auth rate abaixo do benchmark", icon: "📉", desc: "Se sua taxa de aprovacao esta consistentemente abaixo de 90% (cartao credito domestico), ha problema. Benchmarks: e-commerce BR ~92-96%, presencial ~98%+. Cada 1% de auth rate = ~1% de revenue perdido.", severidade: "Critico" },
              { sinal: "Custo total alto vs mercado", icon: "💸", desc: "Se seu MDR + fees + antecipacao esta 20%+ acima do mercado para seu perfil de volume e risco, esta pagando demais. Faca benchmark com 2-3 concorrentes anualmente.", severidade: "Alto" },
              { sinal: "Downtime frequente", icon: "🔴", desc: "Mais de 4h de downtime por trimestre e inaceitavel para pagamentos. Cada hora de downtime em Black Friday pode custar milhoes. SLA minimo aceitavel: 99.95%.", severidade: "Critico" },
              { sinal: "Suporte deficiente", icon: "🎧", desc: "Tempo de resposta > 4h para issues criticos. Sem account manager dedicado para contas acima de R$500K/mes. Sem acesso a engenharia para debugging.", severidade: "Alto" },
              { sinal: "Features faltando", icon: "🧩", desc: "PSP nao suporta metodos de pagamento necessarios (Pix, BNPL, recorrencia), nao tem antifraude adequado, ou nao oferece ferramentas de reconciliacao.", severidade: "Medio-Alto" },
              { sinal: "Problemas de compliance", icon: "⚠️", desc: "PSP sem PCI DSS atualizado, sem SOC 2, ou com historico de data breaches. Risco regulatorio que pode afetar sua operacao.", severidade: "Critico" },
            ].map((item) => (
              <div key={item.sinal} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{item.sinal}</span>
                  <span style={{ ...tagStyle, background: item.severidade === "Critico" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", color: item.severidade === "Critico" ? "#ef4444" : "#f59e0b" }}>{item.severidade}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "tipos-fornecedores", title: "Tipos de Fornecedores", icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            O ecossistema de pagamentos tem diversos tipos de fornecedores, cada um cobrindo uma camada diferente.
            Entender o papel de cada um e essencial para montar a stack ideal.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>O que faz</th>
                  <th style={thStyle}>Exemplos</th>
                  <th style={thStyle}>Quando usar</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tipo: "PSP (Payment Service Provider)", faz: "Facilita pagamentos para merchants sem que precisem de contrato direto com acquirer", ex: "Stripe, Mercado Pago, PagSeguro, Pagar.me", quando: "PMEs, startups, quem quer simplicidade e rapidez de integracao" },
                  { tipo: "Gateway", faz: "Conecta merchant ao acquirer. Roteamento, tokenizacao, reporting. Nao processa diretamente.", ex: "Braspag, MundiPagg, Carat (Fiserv)", quando: "Mid/Enterprise que ja tem contrato com acquirer(s)" },
                  { tipo: "Acquirer (Adquirente)", faz: "Processa transacoes de cartao. Conecta-se diretamente as bandeiras. Liquida para o merchant.", ex: "Cielo, Rede, Getnet, Safrapay, Stone", quando: "Qualquer merchant que aceita cartoes. Geralmente via PSP ou gateway" },
                  { tipo: "Orchestrator", faz: "Roteia transacoes entre multiplos acquirers/PSPs para otimizar auth rate e custo", ex: "Spreedly, Primer, VTEX Payment", quando: "Enterprise com multiplos acquirers. Otimizacao de auth rate e failover" },
                  { tipo: "BaaS (Banking-as-a-Service)", faz: "Infraestrutura bancaria via API: contas, Pix, cartoes, credito", ex: "Dock, Celcoin, Zoop, Matera, QI Tech", quando: "Plataformas que querem oferecer servicos financeiros embedded" },
                  { tipo: "Anti-fraud", faz: "Detecta e previne fraude em transacoes. Scoring, rules engine, ML models", ex: "ClearSale, Konduto, Sift, Riskified", quando: "Complementar ao antifraude do PSP quando chargeback rate > 0.5%" },
                ].map((row) => (
                  <tr key={row.tipo}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.tipo}</td>
                    <td style={tdStyle}>{row.faz}</td>
                    <td style={tdStyle}>{row.ex}</td>
                    <td style={tdStyle}>{row.quando}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "criterios-avaliacao", title: "Criterios de Avaliacao — 15 Criterios", icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Uma avaliacao rigorosa de fornecedores de pagamento deve cobrir 15 criterios-chave. Pondere cada
            criterio de acordo com as prioridades do seu negocio. Use uma matriz de scoring (1-5) para comparar
            fornecedores de forma objetiva.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Criterio</th>
                  <th style={thStyle}>O que avaliar</th>
                  <th style={thStyle}>Peso sugerido</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: "1", c: "Uptime SLA", o: "99.95%+ com SLA financeiro (credito se nao cumprir). Historico de incidents.", p: "Critico" },
                  { n: "2", c: "Latencia", o: "P50 < 200ms, P99 < 500ms para auth. Medir em producao, nao sandbox.", p: "Alto" },
                  { n: "3", c: "Auth Rate", o: "Benchmark por tipo de cartao e MCC. Pedir dados historicos de merchants similares.", p: "Critico" },
                  { n: "4", c: "Cobertura de metodos", o: "Cartao (credito/debito), Pix, Boleto, BNPL, recorrencia, wallets. Cobertura geografica.", p: "Alto" },
                  { n: "5", c: "Pricing", o: "MDR, taxa fixa por tx, setup fee, monthly fee, antecipacao, cross-border. Custo TOTAL.", p: "Alto" },
                  { n: "6", c: "API Quality", o: "RESTful, docs claros, SDKs, idempotency, pagination, error codes consistentes.", p: "Alto" },
                  { n: "7", c: "Suporte", o: "SLA de resposta (< 1h critico), account manager dedicado, acesso a engenharia.", p: "Medio-Alto" },
                  { n: "8", c: "Compliance", o: "PCI DSS Level 1, SOC 2 Type II, LGPD compliance, licencas BACEN.", p: "Critico" },
                  { n: "9", c: "Scalability", o: "Capacidade de processar 10x o volume atual. Performance em Black Friday.", p: "Medio-Alto" },
                  { n: "10", c: "Settlement speed", o: "D+0, D+1, D+2, D+30. Opcoes de antecipacao e custo.", p: "Medio" },
                  { n: "11", c: "Reporting", o: "Dashboard, APIs de reporting, export de dados, reconciliacao automatica.", p: "Medio" },
                  { n: "12", c: "Integration time", o: "Dias para integrar em sandbox, dias para ir a producao. Suporte de integracao.", p: "Medio" },
                  { n: "13", c: "Documentacao", o: "Qualidade, completude, exemplos de codigo, changelog, migration guides.", p: "Medio" },
                  { n: "14", c: "Sandbox", o: "Ambiente de teste completo, dados realistas, simulacao de erros e edge cases.", p: "Medio" },
                  { n: "15", c: "Roadmap", o: "Alinhamento com suas necessidades futuras. Novos metodos, features, mercados.", p: "Medio" },
                ].map((row) => (
                  <tr key={row.n}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.n}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.c}</td>
                    <td style={tdStyle}>{row.o}</td>
                    <td style={tdStyle}><span style={{ ...tagStyle, background: row.p === "Critico" ? "rgba(239,68,68,0.1)" : row.p === "Alto" ? "rgba(245,158,11,0.1)" : "var(--primary-bg)", color: row.p === "Critico" ? "#ef4444" : row.p === "Alto" ? "#f59e0b" : "var(--primary)" }}>{row.p}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "processo-rfp", title: "Processo de RFP", icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Um RFP (Request for Proposal) bem estruturado economiza meses de avaliacao e garante comparacao
            justa entre fornecedores. O processo completo leva de 6 a 12 semanas.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
            {[
              { phase: "Semana 1-2", title: "Preparacao", color: "#f59e0b", items: ["Definir requisitos obrigatorios vs nice-to-have", "Criar shortlist de 3-5 fornecedores", "Preparar documento RFP com: contexto do negocio, requisitos tecnicos, requisitos de compliance, SLA esperados, pricing template, timeline"] },
              { phase: "Semana 3-4", title: "Envio e Q&A", color: "#3b82f6", items: ["Enviar RFP para shortlist", "Sessao de Q&A (preferencialmente conjunta para transparencia)", "Deadline para submissao de propostas (2-3 semanas)"] },
              { phase: "Semana 5-6", title: "Avaliacao", color: "#22c55e", items: ["Scoring matrix com peso por criterio", "Technical deep-dive com 2 finalistas", "Reference calls com merchants similares do fornecedor", "Analise detalhada de pricing (custo total, nao apenas MDR headline)"] },
              { phase: "Semana 7-10", title: "POC e Negociacao", color: "#8b5cf6", items: ["POC com finalista preferido (2-4 semanas)", "Negociacao de contrato em paralelo", "Aprovacao legal e compliance", "Decisao final e assinatura"] },
            ].map((phase) => (
              <div key={phase.phase} style={{ ...pillarCardStyle, borderLeft: `4px solid ${phase.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ padding: "0.2rem 0.5rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, background: phase.color, color: "#fff" }}>{phase.phase}</span>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--foreground)" }}>{phase.title}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {phase.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.825rem" }}>
                      <span style={{ color: phase.color, fontWeight: 600, flexShrink: 0 }}>-</span>
                      <span style={{ color: "var(--text-secondary)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "poc", title: "POC (Proof of Concept)", icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Um POC bem estruturado e o teste definitivo de um fornecedor de pagamentos. Deve simular condicoes
            reais de producao e ter criterios objetivos de sucesso definidos antes do inicio.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Dimensao</th>
                  <th style={thStyle}>Recomendacao</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { d: "Duracao", r: "2-4 semanas de integracao + 2-4 semanas de operacao em producao. Total: 4-8 semanas." },
                  { d: "Volume minimo", r: "Suficiente para ser estatisticamente significativo: minimo 1.000 transacoes, idealmente 10.000+." },
                  { d: "Metricas de sucesso", r: "Auth rate > X% (definir baseline), latencia P99 < 500ms, zero downtime, tempo de integracao < Y dias, suporte NPS > 40." },
                  { d: "A/B test", r: "Idealmente, rodar o novo PSP em paralelo com o atual (50/50 ou 10/90) para comparacao direta." },
                  { d: "Escopo", r: "Incluir fluxos criticos: pagamento, estorno, chargeback, reconciliacao, webhook reliability." },
                  { d: "Exit criteria", r: "Definir antecipadamente: se auth rate < X% ou downtime > Y horas, POC falhou automaticamente." },
                ].map((row) => (
                  <tr key={row.d}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.d}</td>
                    <td style={tdStyle}>{row.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "negociacao-contrato", title: "Negociacao de Contrato", icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Contratos com PSPs e acquirers tem clausulas especificas que podem impactar significativamente
            a operacao a longo prazo. Conhecer as clausulas criticas e ter posicao sobre cada uma e essencial.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { clausula: "SLA com penalidades financeiras", desc: "Nao aceite SLA sem teeth. Se o uptime SLA e 99.95%, defina credito de 10% da fatura mensal por cada 0.01% abaixo do SLA. Sem penalidade, SLA e apenas marketing." },
              { clausula: "Exit clause / Lock-in", desc: "Evite contratos com lock-in > 12 meses sem possibilidade de saida. Clausula de saida ideal: 90 dias de aviso previo, sem multa se SLAs nao foram cumpridos. Cuidado com minimum commitments." },
              { clausula: "Price lock / Reajuste", desc: "Garantir que pricing nao pode ser reajustado unilateralmente durante o contrato. Definir mecanismo de reajuste (IPCA, negociacao anual) e teto maximo." },
              { clausula: "Volume commitments", desc: "Se comprometer volume, garantir que os descontos sao proporcionais e que ha flexibilidade (80-120% do target sem penalidade)." },
              { clausula: "Token portability", desc: "Garantir que tokens de cartao sao portaveis para outro PSP/acquirer. Sem token portability, a migracao futura exige re-tokenizacao (risco de churn de clientes finais)." },
              { clausula: "Exclusividade", desc: "Evite exclusividade total. Se oferecer exclusividade parcial (ex: 80% do volume), negocie taxa premium e SLA superior em troca." },
              { clausula: "Data ownership", desc: "Garantir que todos os dados de transacao sao seus. O PSP nao pode usar seus dados para fins proprios (analytics de mercado, venda para terceiros)." },
            ].map((item) => (
              <div key={item.clausula} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>{item.clausula}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "due-diligence", title: "Due Diligence Tecnica", icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Alem da avaliacao comercial, uma due diligence tecnica rigorosa pode revelar riscos que nao aparecem
            em demos e pitches. Esse processo e obrigatorio para enterprise e altamente recomendado para mid-market.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Area</th>
                  <th style={thStyle}>O que verificar</th>
                  <th style={thStyle}>Red flags</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { area: "API quality", verificar: "Testar APIs em sandbox: error handling, idempotency, pagination, rate limits, webhook retry logic, documentacao vs realidade", red: "Documentacao desatualizada, erros 500 frequentes em sandbox, sem idempotency keys" },
                  { area: "Uptime historico", verificar: "Pedir status page publica, historico de incidentes dos ultimos 12 meses, MTTR medio", red: "Sem status page publica, MTTR > 2h, mais de 6 incidentes/ano" },
                  { area: "PCI DSS", verificar: "Certificacao Level 1 (AOC — Attestation of Compliance). Validade atual. Escopo da certificacao.", red: "Certificacao expirada, apenas Level 2/3, escopo nao cobre todos os servicos" },
                  { area: "SOC 2 Type II", verificar: "Relatorio SOC 2 Type II recente (12 meses). Verificar findings e remediation.", red: "Sem SOC 2, ou apenas Type I (ponto no tempo vs periodo), findings nao resolvidos" },
                  { area: "Disaster Recovery", verificar: "RPO/RTO documentados. Multi-region. Teste de DR regular. Plano de comunicacao em incidente.", red: "Single region, RPO > 1h, sem teste de DR documentado, sem plano de comunicacao" },
                  { area: "Seguranca", verificar: "Pentest recente (< 6 meses), bug bounty program, encryption standards, key management, access controls", red: "Sem pentest recente, sem bug bounty, sem HSM para chaves criptograficas" },
                ].map((row) => (
                  <tr key={row.area}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.area}</td>
                    <td style={tdStyle}>{row.verificar}</td>
                    <td style={{ ...tdStyle, fontSize: "0.75rem" }}>{row.red}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "migracao-psp", title: "Migracao de PSP — Playbook", icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Migrar de PSP e uma das operacoes mais arriscadas em pagamentos. Um playbook estruturado
            minimiza riscos e garante continuidade de operacao durante a transicao.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
            {[
              { step: "1", title: "Dual-running setup", desc: "Configure o novo PSP em paralelo com o atual. Comece roteando 5-10% do trafego para o novo PSP. Use feature flags para controlar o roteamento." },
              { step: "2", title: "Token migration", desc: "Migre tokens de cartao do PSP antigo para o novo. Use network tokenization (Visa/Mastercard token migration) quando possivel. Se nao, solicite ao PSP atual a exportacao de tokens (contractual)." },
              { step: "3", title: "Gradual ramp-up", desc: "Aumente o percentual gradualmente: 10% → 25% → 50% → 75% → 100%. Em cada estagio, monitore auth rate, latencia e erros. So avance se metricas estao iguais ou melhores." },
              { step: "4", title: "Reconciliacao paralela", desc: "Mantenha reconciliacao funcionando para ambos os PSPs simultaneamente. Valide que settlement esta correto em ambos. Reconcilie diariamente." },
              { step: "5", title: "Comunicacao com merchants", desc: "Para B2B/marketplace: notifique merchants sobre a migracao. Forneca timeline, impacto esperado (nenhum se bem executado), e canal de suporte dedicado para issues." },
              { step: "6", title: "Rollback plan", desc: "Mantenha o PSP antigo ativo ate 30 dias apos 100% de migracao. Tenha plano de rollback em < 15min. Nao encerre contrato com PSP antigo ate validacao completa." },
            ].map((item) => (
              <div key={item.step} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <span style={{ minWidth: 24, height: 24, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, background: "var(--primary)", color: "#fff" }}>{item.step}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{item.title}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "gestao-fornecedores", title: "Gestao Continua de Fornecedores", icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            A selecao do fornecedor e apenas o comeco. A gestao continua garante que o fornecedor
            continue entregando valor e que problemas sejam detectados e resolvidos antes de impactar o negocio.
          </p>
          <p style={subheadingStyle}>Framework de gestao</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Pratica</th>
                  <th style={thStyle}>Frequencia</th>
                  <th style={thStyle}>Participantes</th>
                  <th style={thStyle}>Output</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { pratica: "QBR (Quarterly Business Review)", freq: "Trimestral", part: "PM, Finance, Account Manager do fornecedor", out: "Review de metricas (auth rate, uptime, suporte), pricing, roadmap alignment" },
                  { pratica: "SLA monitoring", freq: "Continuo (daily dashboard)", part: "Engineering, Ops", out: "Alertas automaticos se SLA violado. Historico para QBR e negociacoes" },
                  { pratica: "Vendor scorecard", freq: "Semestral", part: "PM, Engineering, Finance", out: "Score 1-5 em cada criterio de avaliacao. Comparacao com outros fornecedores" },
                  { pratica: "Escalation matrix", freq: "Definida no onboarding", part: "Ops, Engineering, Management", out: "Documento vivo com contatos por nivel de severidade e tempo maximo de resposta" },
                  { pratica: "Annual review / Renegociacao", freq: "Anual", part: "Finance, PM, Legal", out: "Revisao de pricing, SLA, novos produtos, renewal ou exit decision" },
                ].map((row) => (
                  <tr key={row.pratica}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.pratica}</td>
                    <td style={tdStyle}>{row.freq}</td>
                    <td style={tdStyle}>{row.part}</td>
                    <td style={tdStyle}>{row.out}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>Dica</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Mantenha sempre uma alternativa viavel (segundo PSP com integracao pronta ou pelo menos avaliado).
              Ter alternativa muda completamente a dinamica de negociacao e reduz o risco de dependencia.
              O custo de manter uma segunda integracao e muito menor que o custo de ficar refem de um fornecedor.
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Vendor Selection & RFP</h1>
        <p className="page-description">
          Guia completo para selecionar, avaliar e gerenciar fornecedores de pagamentos:
          criterios de avaliacao, processo de RFP, POC, negociacao contratual, due diligence
          tecnica e playbook de migracao.
        </p>
      </header>
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>Avaliar fornecedores com 15 criterios objetivos</li>
          <li>Conduzir um RFP e POC para pagamentos</li>
          <li>Negociar contratos com clausulas de protecao</li>
          <li>Migrar de PSP com zero downtime</li>
        </ul>
      </div>
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[{ v: "10", l: "Secoes" }, { v: "15", l: "Criterios" }, { v: "6", l: "Fornecedores" }, { v: "7", l: "Clausulas" }].map((s) => (
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
            { name: "Unit Economics", href: "/knowledge/unit-economics" },
            { name: "Merchant Segmentation", href: "/knowledge/merchant-segmentation" },
            { name: "Go-to-Market", href: "/knowledge/go-to-market" },
            { name: "Embedded Finance", href: "/knowledge/embedded-finance" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>{link.name}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
