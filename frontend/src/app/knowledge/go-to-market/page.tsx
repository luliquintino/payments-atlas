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

export default function GoToMarketPage() {
  const quiz = getQuizForPage("/knowledge/go-to-market");
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
              "Dimensionar o mercado brasileiro de pagamentos e identificar oportunidades",
              "Segmentar merchants e definir ICP (Ideal Customer Profile) por vertical e porte",
              "Escolher a estrategia de distribuicao ideal: self-service, sales-led, channel ou embedded",
              "Identificar sinais de Product-Market Fit especificos para produtos de pagamento",
              "Usar pricing como alavanca de growth — free tier, descontos, interchange optimization",
              "Estruturar parcerias estrategicas com ERPs, plataformas de e-commerce e bancos",
              "Medir GTM com metricas certas: CAC, LTV, payback, NRR, logo vs revenue churn",
              "Executar um playbook de lancamento de 90 dias para produtos de pagamento",
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
      id: "mercado-brasil",
      title: "O Mercado de Pagamentos no Brasil",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O Brasil e o maior mercado de pagamentos da America Latina e um dos mais dinamicos do mundo.
            Com GMV superior a R$10 trilhoes/ano (incluindo Pix, cartoes, boleto e transferencias),
            o mercado brasileiro apresenta caracteristicas unicas: alta penetracao de Pix (140M+ usuarios),
            cultura de parcelamento, regulacao progressiva do BACEN e forte competicao entre incumbentes e fintechs.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Segmento</th>
                  <th style={thStyle}>GMV estimado</th>
                  <th style={thStyle}>Players principais</th>
                  <th style={thStyle}>Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { seg: "Adquirencia (cartoes)", gmv: "~R$ 3.5T/ano", players: "Cielo, Rede, Getnet, Stone, PagSeguro, Safrapay", trend: "Consolidacao. Margem caindo. Diferenciacao via software." },
                  { seg: "Pix", gmv: "~R$ 17T/ano (vol. total)", players: "Todos os bancos e fintechs", trend: "Crescimento exponencial. Pix parcelado em 2025. Pix automatico." },
                  { seg: "PSP / Payment Facilitator", gmv: "~R$ 800B/ano", players: "Stripe, Adyen, PagSeguro, Mercado Pago, Pagar.me", trend: "Verticalizacao. Embedded finance. Platform payments." },
                  { seg: "Boleto bancario", gmv: "~R$ 5T/ano", players: "Bancos tradicionais, fintechs de cobranca", trend: "Declinio relativo vs Pix. Ainda forte em B2B e governo." },
                  { seg: "BaaS / Embedded", gmv: "~R$ 200B/ano (nascente)", players: "Dock, Celcoin, Zoop, Matera, QI Tech", trend: "Hipercrescimento. Plataformas virando bancos." },
                ].map((row) => (
                  <tr key={row.seg}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.seg}</td>
                    <td style={tdStyle}>{row.gmv}</td>
                    <td style={tdStyle}>{row.players}</td>
                    <td style={tdStyle}>{row.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>Macro tendencias</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Pix como rail universal (P2P, P2B, B2B, governo). Open Finance criando novos modelos de negocio.
              DREX (CBDC) com potencial transformador em 2025-2026. Consolidacao de acquirers (Cielo reestruturando,
              Stone expandindo para banking). Embedded finance acelerando — plataformas SaaS e marketplaces virando
              empresas de pagamento.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "segmentacao-merchants",
      title: "Segmentacao de Merchants",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Segmentar merchants corretamente e a base de qualquer estrategia GTM. Cada segmento tem necessidades,
            custos de aquisicao, LTV e canais de distribuicao diferentes. Errar a segmentacao e a causa #1 de
            falha de GTM em empresas de pagamento.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Segmento</th>
                  <th style={thStyle}>GMV mensal</th>
                  <th style={thStyle}>Necessidades</th>
                  <th style={thStyle}>Canal ideal</th>
                  <th style={thStyle}>CAC tipico</th>
                  <th style={thStyle}>LTV/CAC</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { seg: "Micro", gmv: "< R$10K", needs: "Simplicidade, custo baixo, maquininha, suporte basico", canal: "Self-service, redes sociais, indicacao", cac: "R$ 50-200", ltv: "2-4x" },
                  { seg: "PME", gmv: "R$10K - R$500K", needs: "Integracao, dashboard, antecipacao, multiplos metodos", canal: "Inside sales, partnerships, digital ads", cac: "R$ 500-2K", ltv: "3-6x" },
                  { seg: "Mid-market", gmv: "R$500K - R$10M", needs: "API robusta, suporte dedicado, pricing customizado, compliance", canal: "Field sales, integradores, ERPs", cac: "R$ 5K-20K", ltv: "5-10x" },
                  { seg: "Enterprise", gmv: "> R$10M", needs: "Customizacao total, SLA, multi-acquirer, treasury, global", canal: "Enterprise sales, RFP, C-level network", cac: "R$ 50K-500K", ltv: "10-20x" },
                ].map((row) => (
                  <tr key={row.seg}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.seg}</td>
                    <td style={tdStyle}>{row.gmv}</td>
                    <td style={tdStyle}>{row.needs}</td>
                    <td style={tdStyle}>{row.canal}</td>
                    <td style={tdStyle}>{row.cac}</td>
                    <td style={tdStyle}>{row.ltv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Segmentacao por vertical</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
            {[
              { v: "E-commerce", tag: "Alto volume, fraude media" },
              { v: "SaaS", tag: "Recorrencia, low churn" },
              { v: "Marketplace", tag: "Split payment, KYC sellers" },
              { v: "Travel", tag: "High ticket, alto chargeback" },
              { v: "Gaming", tag: "Micropagamentos, global" },
              { v: "Food/Delivery", tag: "Alto volume, ticket baixo" },
              { v: "Educacao", tag: "Recorrencia, boleto forte" },
              { v: "Saude", tag: "Alto ticket, regulado" },
            ].map((item) => (
              <div key={item.v} style={{ ...pillarCardStyle, display: "inline-flex", flexDirection: "column", minWidth: "180px", flex: "1 1 180px" }}>
                <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>{item.v}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{item.tag}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "distribuicao",
      title: "Estrategias de Distribuicao",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            A estrategia de distribuicao define como o produto chega ao merchant. Em pagamentos, as quatro
            estrategias principais nao sao mutuamente exclusivas — os melhores players combinam multiplos canais.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { modelo: "Self-service", emoji: "🖥️", desc: "Merchant se cadastra, integra e comeca a processar sozinho. Exige excelente UX, documentacao e sandbox. Ideal para micro/PME e developers.", exemplos: "Stripe, Mercado Pago, PagSeguro (online)", metricas: "Activation rate > 30%, Time to first tx < 24h, Support tickets/merchant < 2" },
              { modelo: "Sales-led", emoji: "🤝", desc: "Time de vendas (inside ou field) prospecta, demonstra e fecha. Necessario para mid-market e enterprise. Ciclo de 30-180 dias.", exemplos: "Adyen, Cielo Enterprise, Stone (mid-market)", metricas: "Win rate > 20%, Deal cycle < 90 dias, ACV > R$50K" },
              { modelo: "Channel Partners", emoji: "🔗", desc: "Distribuicao via parceiros: ERPs (TOTVS, SAP), plataformas de e-commerce (VTEX, Shopify), ISVs, contadores, agencias. Revenue share ou referral fee.", exemplos: "Pagar.me via VTEX, Stripe via Shopify, processadores via ERP", metricas: "Partner activation > 40%, Revenue per partner > R$10K/mes" },
              { modelo: "Embedded", emoji: "🧩", desc: "Pagamento integrado nativamente em plataformas verticais. O merchant nem percebe que esta usando um PSP separado. Maximo lock-in, minimo churn.", exemplos: "Shopify Payments, iFood Pagamentos, Rappi Pay", metricas: "Attach rate > 60%, Net revenue retention > 120%" },
            ].map((item) => (
              <div key={item.modelo} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.modelo}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  <strong style={{ color: "var(--foreground)" }}>Exemplos:</strong> {item.exemplos}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--foreground)" }}>Metricas-chave:</strong> {item.metricas}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "product-market-fit",
      title: "Product-Market Fit em Pagamentos",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            PMF em pagamentos tem sinais especificos. Diferente de SaaS generico, pagamentos envolvem dinheiro real
            e compliance — o PMF precisa ser validado em mais dimensoes. Um produto pode ter PMF de features
            mas falhar em unit economics ou compliance.
          </p>
          <p style={subheadingStyle}>Sinais fortes de PMF</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Sinal</th>
                  <th style={thStyle}>Meta</th>
                  <th style={thStyle}>Como medir</th>
                  <th style={thStyle}>Red flag se</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { sinal: "Activation rate", meta: "> 30%", medir: "% de signups que processam 1a transacao em 7 dias", red: "< 15% — onboarding ou produto com friccao" },
                  { sinal: "Net Revenue Retention", meta: "> 110%", medir: "Receita dos merchants existentes mes/mes (expansao - churn)", red: "< 90% — merchants saindo ou reduzindo volume" },
                  { sinal: "NPS", meta: "> 40", medir: "Survey trimestral com merchants ativos", red: "< 20 — insatisfacao generalizada" },
                  { sinal: "Organic growth %", meta: "> 30%", medir: "% de novos merchants via referral / organic / word-of-mouth", red: "< 10% — depende 100% de paid acquisition" },
                  { sinal: "Time to first transaction", meta: "< 24h", medir: "Tempo entre signup e primeira transacao processada", red: "> 7 dias — integracao complexa ou burocracia" },
                  { sinal: "Auth rate", meta: "> 95%", medir: "% de transacoes autorizadas pelo emissor", red: "< 90% — problemas tecnicos ou de roteamento" },
                  { sinal: "Churn rate (logo)", meta: "< 3%/mes", medir: "% de merchants que param de processar em 30 dias", red: "> 5%/mes — produto ou pricing inadequado" },
                ].map((row) => (
                  <tr key={row.sinal}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.sinal}</td>
                    <td style={tdStyle}><span style={tagStyle}>{row.meta}</span></td>
                    <td style={tdStyle}>{row.medir}</td>
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
      id: "pricing-growth",
      title: "Pricing como Alavanca de Growth",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Em pagamentos, pricing nao e apenas uma decisao financeira — e uma das alavancas mais poderosas
            de growth. As empresas que melhor cresceram no setor usaram pricing de forma estrategica
            para adquirir, reter e expandir merchants.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { strategy: "Free tier / Freemium", desc: "Oferecer processamento gratuito ate certo volume (ex: primeiros R$10K sem MDR). Reduz barreira de entrada. Merchant experimenta sem risco. Converte para pago quando atinge escala.", example: "Square: gratis para as primeiras transacoes. Stripe: sem monthly fee, so paga por tx." },
              { strategy: "Volume discounts com escada", desc: "Taxas regressivas conforme volume aumenta. Incentiva concentracao e loyalty. Merchant tem incentivo para crescer com voce.", example: "Stone: 2.5% ate R$50K, 2.0% ate R$200K, 1.5% acima. Cria stickiness." },
              { strategy: "Interchange optimization como valor", desc: "Ajudar merchant a otimizar interchange (routing, 3DS, Level 2/3 data). Merchant paga menos, PSP vira consultor estrategico.", example: "Adyen: interchange optimization automatico. Paga IC real e mostra economia." },
              { strategy: "Bundling com value-added services", desc: "Incluir antifraude, dashboard, links de pagamento no preco base. Competidores cobram extra. Aumenta perceived value.", example: "Stripe: antifraude (Radar) incluso. Concorrentes cobram 0.1-0.5% extra." },
              { strategy: "Pricing inverso (cashback)", desc: "Em vez de cobrar menos, devolver parte do MDR como cashback para o merchant. Diferencial em verticais price-sensitive.", example: "Programas de rebate por volume ou por atingir metas de processamento." },
            ].map((item) => (
              <div key={item.strategy} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>{item.strategy}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6, fontStyle: "italic" }}>{item.example}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "partnerships",
      title: "Partnerships & Integracoes",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            No ecossistema de pagamentos, ninguem cresce sozinho. Parcerias estrategicas com ERPs, plataformas
            de e-commerce e bancos sao frequentemente o canal mais eficiente de distribuicao e a principal
            barreira competitiva.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo de parceiro</th>
                  <th style={thStyle}>Exemplos</th>
                  <th style={thStyle}>Modelo de parceria</th>
                  <th style={thStyle}>Beneficio</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tipo: "E-commerce platforms", ex: "VTEX, Shopify, WooCommerce, Nuvemshop", modelo: "Plugin nativo, revenue share, preferred partner", beneficio: "Acesso a base instalada. Merchant ja esta no fluxo de compra." },
                  { tipo: "ERPs", ex: "TOTVS, SAP, Bling, Omie, Conta Azul", modelo: "Integracao nativa, co-sell, referral fee", beneficio: "Merchants empresariais. Alta retencao (ERPs tem churn < 5%)." },
                  { tipo: "Banking partners", ex: "Itau, Bradesco, BTG, bancos digitais", modelo: "White-label, BaaS, conta escrow, co-branded", beneficio: "Licencas regulatorias, capital, distribuicao via agencias." },
                  { tipo: "ISVs verticais", ex: "Software de gestao de restaurantes, clinicas, academias", modelo: "Embedded payment, API partnership, rev share", beneficio: "Acesso vertical profundo. Lock-in por integracao." },
                  { tipo: "Contadores / Agencias", ex: "Escritorios de contabilidade, agencias digitais", modelo: "Referral fee, partner portal, treinamento", beneficio: "Influencia na decisao de PMEs. Custo de aquisicao baixo." },
                ].map((row) => (
                  <tr key={row.tipo}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.tipo}</td>
                    <td style={tdStyle}>{row.ex}</td>
                    <td style={tdStyle}>{row.modelo}</td>
                    <td style={tdStyle}>{row.beneficio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "metricas-gtm",
      title: "Metricas de GTM",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Metricas de GTM em pagamentos diferem de SaaS tradicional porque a receita e baseada em volume
            transacionado (variavel), nao em assinatura fixa. Isso exige metricas especificas e um olhar
            cuidadoso para logo churn vs revenue churn.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Definicao</th>
                  <th style={thStyle}>Benchmark bom</th>
                  <th style={thStyle}>Como melhorar</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { m: "CAC", def: "Custo total de aquisicao por merchant (marketing + vendas + onboarding)", bench: "< 6 meses de revenue", how: "Melhorar conversion rate, usar channel partners, product-led growth" },
                  { m: "LTV", def: "Revenue total esperado ao longo da vida do merchant (net revenue x meses)", bench: "> 3x CAC", how: "Aumentar retencao, upsell services, crescer com o merchant" },
                  { m: "Payback period", def: "Meses ate recuperar o CAC", bench: "< 12 meses", how: "Reduzir CAC ou aumentar ARPU inicial (ex: setup fee + processamento)" },
                  { m: "Net Revenue Retention", def: "Revenue dos merchants existentes apos 12 meses (expansao - contraction - churn)", bench: "> 110%", how: "Crescer com merchants (mais volume), cross-sell, pricing upgrades" },
                  { m: "Logo churn", def: "% de merchants que param de processar por mes", bench: "< 3%/mes", how: "Melhorar onboarding, suporte, detectar churn risk early" },
                  { m: "Revenue churn", def: "% de receita perdida por merchants que saem", bench: "< 1%/mes", how: "Focar em retencao de merchants de alto volume" },
                  { m: "Take rate", def: "Receita liquida / GMV total processado", bench: "0.5-2.0%", how: "Optimize mix (mais credito, mais cross-border, antecipacao)" },
                ].map((row) => (
                  <tr key={row.m}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.m}</td>
                    <td style={tdStyle}>{row.def}</td>
                    <td style={tdStyle}><span style={tagStyle}>{row.bench}</span></td>
                    <td style={tdStyle}>{row.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Logo churn vs Revenue churn
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Em pagamentos, e normal ter logo churn alto (micro-merchants saindo) mas revenue churn baixo
              (grandes merchants ficam). Um PSP pode perder 5% dos merchants por mes mas crescer 20% em receita
              se os merchants que ficam estao expandindo volume. Monitore ambas metricas separadamente.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "case-studies",
      title: "Case Studies — Estrategias GTM de Sucesso",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Analisar as estrategias de go-to-market das empresas mais bem-sucedidas em pagamentos revela
            padroes claros de como diferentes posicionamentos geram diferentes vantagens competitivas.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "Stone", emoji: "🪨", gtm: "Long tail + logistica. Contratou milhares de agentes de campo (Stone Hubs) para vender maquininhas presencialmente. Diferenciou com suporte humanizado e rapidez no settlement. Expandiu para banking e software (Linx).", resultado: "350B+ TPV. Lider em PMEs. Margem menor que Adyen mas base massiva." },
              { name: "Stripe", emoji: "💜", gtm: "Developer-first. API impecavel, documentacao referencia, sandbox funcional. Self-service puro. Pricing transparente (2.9% + $0.30). Cresceu via word-of-mouth entre developers. Depois adicionou enterprise sales.", resultado: "Valuation $50B+. Dominante em startups e tech companies. NPS > 60." },
              { name: "Adyen", emoji: "🟢", gtm: "Enterprise unified commerce. Uma plataforma para online + in-store + mobile. IC++ transparente. Zero escritorio local (vendas remotas). Foco em enterprise com deal size > EUR 1M/ano. Nao compete em long tail.", resultado: "EUR 970B+ TPV. Margem EBITDA > 50%. Clientes: Uber, Spotify, McDonalds." },
              { name: "PagSeguro", emoji: "🟡", gtm: "Micro-merchants. Maquininha barata (a partir de R$39). Zero mensalidade. Self-service total. Distribuicao via e-commerce (vendia maquininha no site). Depois expandiu para PagBank (banking).", resultado: "Milhoes de merchants. Maior base de micro-merchants do Brasil." },
            ].map((c) => (
              <div key={c.name} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{c.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{c.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>
                  <strong style={{ color: "var(--foreground)" }}>Estrategia:</strong> {c.gtm}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--foreground)" }}>Resultado:</strong> {c.resultado}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "playbook-lancamento",
      title: "Playbook de Lancamento — 90 Dias",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            Lancar um produto de pagamento exige planejamento especifico. Diferente de SaaS generico,
            voce lida com dinheiro real, compliance e integracao tecnica. Este playbook cobre os 90 dias
            criticos do pre-lancamento ao scale inicial.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
            {[
              { phase: "Pre-Launch", period: "Dia -30 a 0", color: "#f59e0b", items: [
                "Fechar 5-10 design partners (merchants beta) com commitment por escrito",
                "Completar certificacao PCI DSS e compliance regulatorio",
                "Testar fluxo completo: signup → integracao → tx de teste → settlement → reconciliacao",
                "Definir pricing final baseado em feedback dos betas",
                "Preparar documentacao, SDK, sandbox, FAQs",
                "Setup de monitoring: uptime, latencia, auth rate, erros por tipo",
              ]},
              { phase: "Beta / Soft Launch", period: "Dia 0 a 30", color: "#3b82f6", items: [
                "Abrir para design partners em producao com volume real",
                "White-glove onboarding para cada merchant beta",
                "Medir: time to first tx, auth rate, conversion, suporte tickets",
                "Daily standup de produto + engenharia para resolver issues rapido",
                "Coletar NPS e feedback qualitativo semanal",
                "Iterar pricing se necessario baseado em dados reais",
              ]},
              { phase: "GA (General Availability)", period: "Dia 30 a 60", color: "#22c55e", items: [
                "Abrir self-service signup (se aplicavel)",
                "Lancar campanha de awareness: blog, PR, partnerships",
                "Ativar channel partners (ERPs, plataformas, integradores)",
                "Iniciar inside sales para segmento PME/Mid",
                "Meta: 50-100 merchants ativos processando",
                "Estabelecer QBR process com merchants top 10",
              ]},
              { phase: "Scale", period: "Dia 60 a 90", color: "#8b5cf6", items: [
                "Otimizar funil: signup → activation → first tx → recurring",
                "Implementar automated onboarding (KYB, integracao assistida)",
                "Lancar referral program para merchants existentes",
                "Expandir time de vendas se unit economics validados (CAC < 6mo revenue)",
                "Meta: 500+ merchants ativos, LTV/CAC > 3x confirmado",
                "Planejar fase 2: features adicionais, novos segmentos, expansao geografica",
              ]},
            ].map((phase) => (
              <div key={phase.phase} style={{ ...pillarCardStyle, borderLeft: `4px solid ${phase.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ padding: "0.2rem 0.5rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, background: phase.color, color: "#fff" }}>{phase.phase}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>{phase.period}</span>
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
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Go-to-Market para Produtos de Pagamento</h1>
        <p className="page-description">
          Guia completo sobre estrategias de go-to-market no mercado de pagamentos brasileiro:
          segmentacao de merchants, canais de distribuicao, product-market fit, metricas GTM,
          case studies e playbook de lancamento de 90 dias.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>Dimensionar o mercado e segmentar merchants estrategicamente</li>
          <li>Escolher e combinar canais de distribuicao por segmento</li>
          <li>Validar PMF com metricas especificas de pagamentos</li>
          <li>Executar um lancamento de produto em 90 dias</li>
        </ul>
      </div>

      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[{ v: "10", l: "Secoes" }, { v: "4", l: "Estrategias" }, { v: "4", l: "Cases" }, { v: "90", l: "Dias Playbook" }].map((s) => (
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
            { name: "Vendor Selection", href: "/knowledge/vendor-selection" },
            { name: "Embedded Finance", href: "/knowledge/embedded-finance" },
            { name: "Team & Career", href: "/knowledge/team-career" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>{link.name}</Link>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.5 }}>
          Fontes: Relatorios publicos de Stone, Stripe, Adyen, PagSeguro. Dados ABECS. BACEN. Estimativas baseadas em informacoes publicas.
        </p>
      </div>
    </div>
  );
}
