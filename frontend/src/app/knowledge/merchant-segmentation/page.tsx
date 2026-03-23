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

export default function MerchantSegmentationPage() {
  const quiz = getQuizForPage("/knowledge/merchant-segmentation");
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
              "Entender por que segmentacao e fundamental em pagamentos",
              "Segmentar merchants por volume, vertical e perfil de risco",
              "Classificar merchants em risk tiers com criterios objetivos",
              "Identificar e gerenciar high-risk verticals",
              "Definir requisitos de underwriting por segmento",
              "Estruturar pricing diferenciado por tier e vertical",
              "Desenhar onboarding diferenciado por porte de merchant",
              "Implementar monitoring e regras de graduacao entre tiers",
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
      id: "por-que-segmentar", title: "Por que Segmentar", icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Tratar todos os merchants da mesma forma e um erro que custa caro. Cada segmento tem
            necessidades, riscos, margens e custos de servico radicalmente diferentes. Sem segmentacao,
            voce cobra demais de merchants de baixo risco (eles saem) e cobra de menos de alto risco (voce perde dinheiro).
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { dim: "Pricing", desc: "Micro-merchants toleram MDR mais alto (conveniencia). Enterprise exige taxa competitiva. High-risk paga premio pelo risco. Sem segmentacao, seu pricing e subotimo para todos.", icon: "💰" },
              { dim: "Risco", desc: "Um e-commerce de roupas e um cassino online tem perfis de risco completamente diferentes. Aplicar as mesmas regras de fraude e underwriting para ambos e receita para desastre.", icon: "⚠️" },
              { dim: "Suporte", desc: "Micro-merchants precisam de self-service. Enterprise precisa de account manager dedicado. Dar suporte errado para o segmento errado desperidca recursos ou perde clientes.", icon: "🎧" },
              { dim: "Features", desc: "SaaS precisa de recorrencia. Marketplace precisa de split payment. Travel precisa de pre-auth. O roadmap de produto deve ser priorizado por segmento-alvo.", icon: "🧩" },
              { dim: "Compliance", desc: "Merchants em verticais reguladas (saude, financas) exigem compliance adicional. Merchants internacionais exigem KYC cross-border. O nivel de due diligence varia por segmento.", icon: "⚖️" },
            ].map((item) => (
              <div key={item.dim} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <span style={{ fontSize: "1.125rem" }}>{item.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{item.dim}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "segmentacao-volume", title: "Segmentacao por Volume", icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Volume de processamento e o criterio mais fundamental de segmentacao. Ele determina o modelo
            de atendimento, a margem possivel e o custo de servico viavel.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tier</th>
                  <th style={thStyle}>GMV mensal</th>
                  <th style={thStyle}># Transacoes/mes</th>
                  <th style={thStyle}>Ticket medio</th>
                  <th style={thStyle}>Exemplo</th>
                  <th style={thStyle}>Modelo de atendimento</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: "Micro", gmv: "< R$10K", tx: "< 500", ticket: "R$20-50", ex: "Barraca de feira, MEI, artesao", modelo: "100% self-service. Chatbot. FAQ." },
                  { tier: "PME", gmv: "R$10K - R$500K", tx: "500 - 10K", ticket: "R$50-200", ex: "Loja virtual, restaurante, academia", modelo: "Self-service + chat ao vivo. Onboarding assistido." },
                  { tier: "Mid-market", gmv: "R$500K - R$10M", tx: "10K - 200K", ticket: "R$100-500", ex: "E-commerce medio, SaaS, rede de lojas", modelo: "Account manager. Suporte prioritario. Pricing custom." },
                  { tier: "Enterprise", gmv: "> R$10M", tx: "> 200K", ticket: "Variado", ex: "Marketplace, varejista grande, airline", modelo: "Enterprise sales. White-glove. SLA dedicado. Engenharia de integracao." },
                ].map((row) => (
                  <tr key={row.tier}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.tier}</td>
                    <td style={tdStyle}>{row.gmv}</td>
                    <td style={tdStyle}>{row.tx}</td>
                    <td style={tdStyle}>{row.ticket}</td>
                    <td style={tdStyle}>{row.ex}</td>
                    <td style={tdStyle}>{row.modelo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "segmentacao-vertical", title: "Segmentacao por Vertical", icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Cada vertical tem caracteristicas unicas de ticket medio, metodo de pagamento predominante,
            sazonalidade, taxa de chargeback e regulacao especifica. Entender essas nuances permite
            oferecer soluces sob medida e precificacao adequada.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Vertical</th>
                  <th style={thStyle}>Ticket medio</th>
                  <th style={thStyle}>Metodo principal</th>
                  <th style={thStyle}>Chargeback rate</th>
                  <th style={thStyle}>Risco</th>
                  <th style={thStyle}>Peculiaridades</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { v: "E-commerce geral", ticket: "R$100-300", metodo: "Cartao credito + Pix", cb: "0.5-1.5%", risco: "Medio", pecul: "Parcelamento importante. Sazonalidade (Black Friday). Fraude de identidade." },
                  { v: "SaaS / Recorrencia", ticket: "R$50-500/mes", metodo: "Cartao credito recorrente", cb: "0.1-0.5%", risco: "Baixo", pecul: "Involuntary churn (cartao expirado). Retry logic essencial. Dunning management." },
                  { v: "Marketplace", ticket: "R$80-400", metodo: "Cartao + Pix + Boleto", cb: "0.5-2.0%", risco: "Medio-Alto", pecul: "Split payment. KYC de sellers. Escrow. Disputas entre buyer e seller." },
                  { v: "Travel / Airlines", ticket: "R$500-5000", metodo: "Cartao credito (parcelado)", cb: "1.0-3.0%", risco: "Alto", pecul: "Compra antecipada, entrega futura. Cancelamentos massivos (COVID). Pre-auth." },
                  { v: "Gaming / Digital goods", ticket: "R$5-100", metodo: "Cartao + Pix + Wallets", cb: "0.5-2.0%", risco: "Medio-Alto", pecul: "Micropagamentos. Friendly fraud (crianca compra sem permissao). Global." },
                  { v: "Food / Delivery", ticket: "R$30-80", metodo: "Cartao + Pix + Voucher", cb: "0.3-1.0%", risco: "Baixo-Medio", pecul: "Alto volume, baixo ticket. Velocidade de checkout critica. Multiplos sellers." },
                  { v: "Educacao", ticket: "R$200-2000", metodo: "Boleto + Cartao + Pix", cb: "0.3-0.8%", risco: "Baixo", pecul: "Recorrencia semestral/anual. Boleto ainda forte. Desistencia = chargeback." },
                ].map((row) => (
                  <tr key={row.v}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.v}</td>
                    <td style={tdStyle}>{row.ticket}</td>
                    <td style={tdStyle}>{row.metodo}</td>
                    <td style={tdStyle}>{row.cb}</td>
                    <td style={tdStyle}><span style={{ ...tagStyle, background: row.risco.includes("Alto") ? "rgba(239,68,68,0.1)" : row.risco.includes("Medio") ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)", color: row.risco.includes("Alto") ? "#ef4444" : row.risco.includes("Medio") ? "#f59e0b" : "#22c55e" }}>{row.risco}</span></td>
                    <td style={tdStyle}>{row.pecul}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "risk-tiers", title: "Risk Tiers — Low, Medium, High, Prohibited", icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Todo PSP e acquirer classifica merchants em tiers de risco. Essa classificacao determina
            o nivel de due diligence, reservas financeiras, limites de processamento e monitoramento.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tier</th>
                  <th style={thStyle}>Chargeback rate</th>
                  <th style={thStyle}>Fraud rate</th>
                  <th style={thStyle}>Exemplos</th>
                  <th style={thStyle}>Tratamento</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: "Low Risk", cb: "< 0.5%", fraud: "< 0.1%", ex: "SaaS, educacao, utilities, supermercados", trat: "Onboarding simplificado. Sem reserva. Limites altos. Monitoramento padrao." },
                  { tier: "Medium Risk", cb: "0.5-1.5%", fraud: "0.1-0.5%", ex: "E-commerce geral, marketplaces, delivery, servicos", trat: "KYB completo. Reserva de 5-10% por 90 dias. Monitoramento semanal. Limites progressivos." },
                  { tier: "High Risk", cb: "1.5-3.0%", fraud: "0.5-2.0%", ex: "Travel, gaming, nutraceuticals, dating, streaming", trat: "KYB estendido + entrevista. Reserva de 10-20%. Monitoramento diario. Limites conservadores. Pricing premium." },
                  { tier: "Prohibited", cb: "N/A", fraud: "N/A", ex: "Piramides financeiras, drogas ilegais, armas, pornografia infantil, terrorismo", trat: "PROIBIDO. Nao aceitar sob nenhuma circunstancia. Compliance com OFAC, PEP lists, TMF/MATCH." },
                ].map((row) => (
                  <tr key={row.tier}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.tier}</td>
                    <td style={tdStyle}>{row.cb}</td>
                    <td style={tdStyle}>{row.fraud}</td>
                    <td style={tdStyle}>{row.ex}</td>
                    <td style={tdStyle}>{row.trat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>MATCH/TMF List</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O MATCH (Member Alert To Control High-risk merchants) e a lista negra das bandeiras.
              Merchants adicionados ao MATCH ficam impedidos de processar cartoes por 5 anos.
              Causas: chargeback excessivo (&gt;1% por 2+ meses), fraude, lavagem de dinheiro, PCI breach.
              Verificar o MATCH e obrigatorio durante o onboarding.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "high-risk-verticals", title: "High-Risk Verticals — Por que Cada Uma e Alto Risco", icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Verticais de alto risco nao sao necessariamente ilegais — muitas sao negocios legitimos que
            apresentam risco elevado para o processador de pagamentos por razoes especificas.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { vertical: "Gambling / Apostas", icon: "🎰", reason: "Regulacao complexa e variavel por jurisdicao. Alto volume de chargebacks (arrependimento de apostas perdidas). Risco de lavagem de dinheiro. No Brasil, regulacao de apostas online (Lei 14.790/2023) trouxe framework mas enforcement ainda em evolucao." },
              { vertical: "Adult content", icon: "🔞", reason: "Alto chargeback por embaraco (titular nao quer que apareca na fatura). Regulacao de verificacao de idade. Risco reputacional para o PSP. Visa e Mastercard tem regras especificas (BRAM)." },
              { vertical: "Forex / Trading", icon: "📈", reason: "Regulacao financeira pesada (CVM no Brasil, SEC nos EUA). Alto risco de fraude e piramides. Chargebacks de clientes que perderam dinheiro. Muitos esquemas fraudulentos no setor." },
              { vertical: "Crypto exchanges", icon: "₿", reason: "Regulacao em rapida evolucao. Risco de lavagem de dinheiro (AML). Volatilidade extrema que gera chargebacks. Dificuldade de KYC para usuarios anonimos." },
              { vertical: "Farmaceuticos / Suplementos", icon: "💊", reason: "Risco regulatorio (ANVISA no Brasil, FDA nos EUA). Trial scams (free trial com cobranca recorrente escondida). Alto chargeback em subscription traps. Produtos sem comprovacao cientifica." },
              { vertical: "Travel / Airlines", icon: "✈️", reason: "Compra antecipada com entrega futura (gap de meses). Cancelamentos massivos em crises. Chargebacks por servico nao prestado. Tickets altos amplificam perdas." },
            ].map((item) => (
              <div key={item.vertical} style={{ ...pillarCardStyle, borderLeft: "4px solid #ef4444" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <span style={{ fontSize: "1.125rem" }}>{item.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{item.vertical}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.reason}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "underwriting", title: "Underwriting por Segmento", icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Underwriting e o processo de avaliacao e aprovacao de um merchant para processamento de pagamentos.
            O rigor do processo varia por segmento de risco e afeta diretamente o tempo de onboarding.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Requisito</th>
                  <th style={thStyle}>Low Risk</th>
                  <th style={thStyle}>Medium Risk</th>
                  <th style={thStyle}>High Risk</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { req: "KYB (Know Your Business)", low: "CNPJ, contrato social, socios", med: "KYB completo + demonstracoes financeiras", high: "KYB estendido + entrevista + visita (opcional)" },
                  { req: "KYC dos socios", low: "CPF, nome, data nascimento", med: "CPF + documento com foto + PEP check", high: "Full KYC + source of funds + beneficial ownership" },
                  { req: "Website review", low: "Automatico (crawler)", med: "Review manual do site e produtos", high: "Review manual detalhado + compliance review" },
                  { req: "Reserva (rolling reserve)", low: "0%", med: "5-10% por 90-180 dias", high: "10-20% por 180-365 dias" },
                  { req: "Limite de processamento", low: "Ate R$500K/mes (auto-expand)", med: "Ate R$2M/mes (review para aumento)", high: "Ate R$500K/mes (review mensal)" },
                  { req: "Monitoring", low: "Automatico (alertas)", med: "Semanal (dashboard + alertas)", high: "Diario (analista dedicado)" },
                  { req: "Tempo de aprovacao", low: "Instantaneo a 24h", med: "1-3 dias uteis", high: "5-15 dias uteis" },
                ].map((row) => (
                  <tr key={row.req}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.req}</td>
                    <td style={tdStyle}>{row.low}</td>
                    <td style={tdStyle}>{row.med}</td>
                    <td style={tdStyle}>{row.high}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "pricing-segmento", title: "Pricing por Segmento", icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            O pricing deve refletir o custo de servir cada segmento e o valor entregue.
            Merchants de maior risco pagam mais; merchants de maior volume pagam menos.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Fee</th>
                  <th style={thStyle}>Micro</th>
                  <th style={thStyle}>PME</th>
                  <th style={thStyle}>Mid-market</th>
                  <th style={thStyle}>Enterprise</th>
                  <th style={thStyle}>High-risk</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { fee: "MDR Credito", micro: "3.5-4.5%", pme: "2.5-3.5%", mid: "1.8-2.5%", ent: "1.2-1.8% (IC++)", high: "3.5-8.0%" },
                  { fee: "MDR Debito", micro: "2.0-2.5%", pme: "1.5-2.0%", mid: "1.0-1.5%", ent: "0.8-1.2%", high: "2.0-3.5%" },
                  { fee: "Pix", micro: "0.99%", pme: "0.5-0.99%", mid: "R$0.50-1.00/tx", ent: "R$0.10-0.50/tx", high: "1.0-2.0%" },
                  { fee: "Setup fee", micro: "R$0", pme: "R$0-500", mid: "R$1K-5K", ent: "R$5K-50K", high: "R$5K-20K" },
                  { fee: "Monthly fee", micro: "R$0", pme: "R$0-99", mid: "R$500-2K", ent: "R$2K-20K", high: "R$1K-5K" },
                  { fee: "Chargeback fee", micro: "R$15", pme: "R$25-50", mid: "R$50-80", ent: "R$80-150", high: "R$80-200" },
                  { fee: "Antecipacao", micro: "3.5-4.5%/mes", pme: "2.5-3.5%/mes", mid: "1.5-2.5%/mes", ent: "1.0-1.5%/mes", high: "3.0-5.0%/mes" },
                ].map((row) => (
                  <tr key={row.fee}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.fee}</td>
                    <td style={tdStyle}>{row.micro}</td>
                    <td style={tdStyle}>{row.pme}</td>
                    <td style={tdStyle}>{row.mid}</td>
                    <td style={tdStyle}>{row.ent}</td>
                    <td style={{ ...tdStyle, color: "#ef4444" }}>{row.high}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "onboarding", title: "Onboarding Diferenciado", icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            O processo de onboarding deve ser proporcional ao risco e ao valor do merchant.
            Onboarding de micro-merchants deve ser instantaneo; enterprise pode levar semanas mas com white-glove service.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { seg: "Micro / Self-service", color: "#22c55e", items: [
                "Cadastro em 5 minutos: CNPJ/CPF, email, telefone, conta bancaria",
                "KYB automatizado via APIs (Receita Federal, Bureau de credito)",
                "Aprovacao instantanea para MCCs de baixo risco",
                "Integracao: link de pagamento ou maquininha plug-and-play",
                "Primeira transacao em < 1 hora do cadastro",
              ]},
              { seg: "PME / Assisted", color: "#3b82f6", items: [
                "Cadastro online + validacao de documentos (1-2 dias)",
                "Call de onboarding com especialista de integracao",
                "SDK/API com sandbox e documentacao guiada",
                "Configuracao de antifraude e regras basicas",
                "Go-live em 1-2 semanas",
              ]},
              { seg: "Mid-market / Managed", color: "#f59e0b", items: [
                "Account manager dedicado desde pre-venda",
                "Integracao tecnica com engenheiro de solucoes dedicado",
                "Ambiente de homologacao com dados reais simulados",
                "Configuracao customizada de routing, antifraude, reconciliacao",
                "Go-live em 4-8 semanas com periodo de estabilizacao",
              ]},
              { seg: "Enterprise / White-glove", color: "#8b5cf6", items: [
                "Equipe dedicada: AM, Solutions Engineer, Risk Analyst, PM",
                "Integracao profunda com sistemas legados (ERP, OMS, CRM)",
                "Configuracao multi-acquirer com roteamento inteligente",
                "SLA customizado, reporting sob medida, compliance review",
                "Go-live em 8-16 semanas com migracao gradual",
              ]},
            ].map((item) => (
              <div key={item.seg} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>{item.seg}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {item.items.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.825rem" }}>
                      <span style={{ color: item.color, fontWeight: 600, flexShrink: 0 }}>-</span>
                      <span style={{ color: "var(--text-secondary)" }}>{step}</span>
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
      id: "monitoring-graduacao", title: "Monitoring & Graduacao entre Tiers", icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            Merchants nao sao estaticos — eles evoluem (ou regridem) entre tiers baseados em performance.
            Um sistema de monitoring continuo com triggers claros de upgrade e downgrade e essencial.
          </p>
          <p style={subheadingStyle}>Triggers de upgrade (promoção de tier)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {[
              "Volume crescente por 3+ meses consecutivos sem aumento de chargebacks",
              "Chargeback rate abaixo de 0.3% por 6+ meses",
              "Zero incidentes de fraude confirmados em 6 meses",
              "Historico de pagamento de rolling reserve sem issues",
              "NPS do merchant > 40 (satisfeito com o servico)",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>↑</span>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={subheadingStyle}>Triggers de downgrade (rebaixamento de tier)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {[
              "Chargeback rate > 1.0% por 2 meses consecutivos → acao imediata",
              "Fraud rate > 0.5% confirmado → review de risk tier em 48h",
              "Entrada em programa de monitoramento Visa VDMP ou Mastercard ECM",
              "Mudanca de modelo de negocio para vertical de maior risco",
              "Falha em fornecer documentacao solicitada em 30 dias",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0 }}>↓</span>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>Automatizacao do monitoring</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Idealmente, triggers de upgrade/downgrade sao automatizados. Dashboards mostram a posicao
              de cada merchant em tempo real. Alertas sao disparados automaticamente quando um trigger e atingido.
              A decisao de upgrade pode ser automatica; a de downgrade deve ter review humano antes de aplicar
              restricoes (reserva, limites, suspensao).
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Merchant Segmentation & Risk Tiers</h1>
        <p className="page-description">
          Guia completo sobre segmentacao de merchants por volume, vertical e perfil de risco.
          Risk tiers, high-risk verticals, underwriting, pricing diferenciado e monitoring.
        </p>
      </header>
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>Segmentar merchants por volume, vertical e risco</li>
          <li>Aplicar risk tiers com criterios objetivos</li>
          <li>Definir underwriting e pricing por segmento</li>
          <li>Monitorar e graduar merchants entre tiers</li>
        </ul>
      </div>
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[{ v: "10", l: "Secoes" }, { v: "4", l: "Risk Tiers" }, { v: "7", l: "Verticais" }, { v: "4", l: "Onboarding" }].map((s) => (
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
            { name: "Go-to-Market", href: "/knowledge/go-to-market" },
            { name: "Vendor Selection", href: "/knowledge/vendor-selection" },
            { name: "Embedded Finance", href: "/knowledge/embedded-finance" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>{link.name}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
