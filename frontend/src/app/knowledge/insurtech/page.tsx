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
const codeBlockStyle: React.CSSProperties = { background: "var(--background)", border: "1px solid var(--border)", borderRadius: 8, padding: "1rem", fontSize: "0.8rem", fontFamily: "monospace", overflowX: "auto", whiteSpace: "pre", color: "var(--foreground)", lineHeight: 1.6, marginTop: "0.75rem", marginBottom: "0.75rem" };
const pillarCardStyle: React.CSSProperties = { padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--background)", marginBottom: "0.75rem" };
const tagStyle: React.CSSProperties = { display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 600, background: "var(--primary-bg)", color: "var(--primary)", marginRight: "0.375rem", marginBottom: "0.25rem" };

interface Section { id: string; title: string; icon: string; content: React.ReactNode; }

export default function InsurTechPage() {
  const quiz = getQuizForPage("/knowledge/insurtech");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "o-que-e",
      title: "O que e InsurTech",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            InsurTech e a aplicacao de tecnologia para transformar a industria de seguros: distribuicao,
            underwriting, gestao de sinistros e experiencia do cliente. Assim como fintechs disrupcaram
            bancos, insurtechs estao disrupcando seguradoras tradicionais com processos digitais,
            dados alternativos e modelos de negocio inovadores.
          </p>
          <p style={paragraphStyle}>
            O mercado de seguros brasileiro e o maior da America Latina (R$350+ bilhoes em premios anuais),
            mas tem baixa penetracao: apenas 3-4% do PIB vs 7-10% em mercados maduros. Esse gap representa
            oportunidade massiva para insurtechs e plataformas de pagamento que querem oferecer seguros embutidos.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              { area: "Distribuicao digital", desc: "Venda de seguros 100% online, sem corretores tradicionais. Cotacao em segundos, emissao instantanea, gestao pelo app.", exemplos: "Youse (Caixa Seguradora), Azos, Pier" },
              { area: "Underwriting com dados alternativos", desc: "Uso de IoT, telematica, wearables e dados de comportamento para precificar risco individualizadamente.", exemplos: "Porto Seguro (telematica auto), Vitality (saude)" },
              { area: "Claims automation", desc: "Processamento de sinistros com IA: analise de fotos, deteccao de fraude, pagamento automatico.", exemplos: "Lemonade (3 segundos para pagar sinistro)" },
              { area: "Micro-seguros", desc: "Seguros de baixo valor para populacoes desbancarizadas. Premio mensal de R$5-20. Cobertura simplificada.", exemplos: "Nubank (seguro de vida R$9/mes), Pague Menos" },
            ].map((item) => (
              <div key={item.area} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>{item.area}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--primary)" }}>Exemplos:</strong> {item.exemplos}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    {
      id: "embedded-insurance",
      title: "Embedded Insurance — Seguro no Checkout",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Embedded insurance e a oferta de seguros no momento exato da compra ou contratacao de servico,
            integrado ao checkout da plataforma. O usuario nao precisa sair do fluxo, pesquisar seguradoras
            ou preencher formularios longos. Um clique e ele esta segurado.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr><th style={thStyle}>Momento</th><th style={thStyle}>Tipo de seguro</th><th style={thStyle}>Exemplo</th><th style={thStyle}>Attach rate tipico</th></tr>
              </thead>
              <tbody>
                {[
                  { momento: "Checkout e-commerce", tipo: "Garantia estendida", ex: "Comprou TV → +2 anos de garantia por R$49", attach: "15-25%" },
                  { momento: "Checkout e-commerce", tipo: "Protecao de envio", ex: "Seguro contra extravio/dano no transporte por R$5", attach: "10-20%" },
                  { momento: "Reserva de viagem", tipo: "Seguro viagem", ex: "Reservou hotel → seguro viagem com cobertura medica", attach: "20-35%" },
                  { momento: "Aluguel de carro", tipo: "Protecao de colisao", ex: "Alugou carro → CDW (Collision Damage Waiver)", attach: "60-80%" },
                  { momento: "Compra de eletronico", tipo: "Seguro contra roubo/quebra", ex: "Comprou celular → protecao por R$15/mes", attach: "10-15%" },
                  { momento: "Contratacao de frete", tipo: "Seguro de carga", ex: "Enviou mercadoria → seguro proporcional ao valor", attach: "30-50%" },
                ].map((item) => (
                  <tr key={item.tipo + item.momento}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.momento}</td>
                    <td style={tdStyle}>{item.tipo}</td>
                    <td style={tdStyle}>{item.ex}</td>
                    <td style={{ ...tdStyle, color: "var(--primary)", fontWeight: 600 }}>{item.attach}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Receita para a plataforma
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              A plataforma que distribui seguro embutido tipicamente recebe 20-40% do premio como comissao.
              Com volume alto e attach rate de 15-20%, isso se torna uma linha de receita significativa.
              Exemplo: marketplace com 1M de pedidos/mes, attach rate 15%, premio medio R$10, comissao 30% =
              R$ 450.000/mes de receita adicional com custo marginal quase zero.
            </p>
          </div>
        </>
      ),
    },

    {
      id: "modelos-distribuicao",
      title: "Modelos de Distribuicao",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Existem diferentes modelos para distribuir seguros via plataformas digitais. A escolha
            depende de: regulacao (precisa de licenca?), investimento (build vs buy), e controle
            sobre a experiencia do usuario.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              {
                modelo: "Affinity (indicacao)",
                color: "#22c55e",
                desc: "Plataforma indica seguradora parceira. Usuario e redirecionado para contratar. Plataforma recebe comissao de indicacao.",
                pros: "Simples, sem licenca, rapido de implementar",
                cons: "Experiencia fragmentada, baixo controle, attach rate menor",
                licenca: "Nao necessaria (so indicacao)",
              },
              {
                modelo: "Embedded (white-label)",
                color: "#3b82f6",
                desc: "Seguro oferecido dentro da plataforma com marca propria. Seguradora esta por tras (risco), mas a experiencia e da plataforma.",
                pros: "Experiencia integrada, alto attach rate, marca forte",
                cons: "Requer parceria solida, SLA operacional, regulacao de corretagem",
                licenca: "Necessaria (estipulante ou corretora)",
              },
              {
                modelo: "Full-stack InsurTech",
                color: "#f59e0b",
                desc: "Plataforma se torna seguradora (ou cria uma). Detém licenca SUSEP, subscreve risco, gerencia sinistros.",
                pros: "Controle total, margem maxima, dados proprietarios",
                cons: "Capital regulatorio alto, complexidade operacional massiva",
                licenca: "Obrigatoria (sociedade seguradora SUSEP)",
              },
              {
                modelo: "Marketplace de seguros",
                color: "#8b5cf6",
                desc: "Plataforma oferece produtos de multiplas seguradoras. Usuario compara e escolhe. Modelo de corretora digital.",
                pros: "Variedade para o usuario, receita de comissao diversificada",
                cons: "Complexidade de integracao com multiplas seguradoras",
                licenca: "Necessaria (corretora de seguros SUSEP)",
              },
            ].map((item) => (
              <div key={item.modelo} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>{item.modelo}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  <strong style={{ color: "#22c55e" }}>Pros:</strong> {item.pros}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  <strong style={{ color: "#ef4444" }}>Cons:</strong> {item.cons}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--primary)" }}>Licenca:</strong> {item.licenca}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    {
      id: "parametric",
      title: "Parametric Insurance — Seguro Automatico",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Seguro parametrico paga automaticamente quando um evento predefinido ocorre, sem necessidade
            de sinistro manual, vistoria ou comprovacao de perda. O trigger e objetivo e verificavel
            por fontes externas de dados (API de voo, estacao meteorologica, sensor IoT).
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr><th style={thStyle}>Evento trigger</th><th style={thStyle}>Fonte de dados</th><th style={thStyle}>Pagamento</th><th style={thStyle}>Tempo</th></tr>
              </thead>
              <tbody>
                {[
                  { ev: "Atraso de voo > 2h", fonte: "API FlightAware / Cirium", pag: "R$ 200 automatico na conta", tempo: "Minutos apos deteccao" },
                  { ev: "Chuva > 50mm em evento", fonte: "Estacao meteorologica INMET", pag: "Reembolso do ingresso", tempo: "24h apos evento" },
                  { ev: "Terremoto > 5.0 Richter", fonte: "USGS API", pag: "Valor fixo predefinido", tempo: "48h apos evento" },
                  { ev: "Seca prolongada (agro)", fonte: "Satelite + sensores solo", pag: "Indemnizacao proporcional", tempo: "Apos periodo de medicao" },
                  { ev: "Cancelamento de hotel", fonte: "API da plataforma de reserva", pag: "Reembolso automatico", tempo: "Imediato" },
                ].map((item) => (
                  <tr key={item.ev}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.ev}</td>
                    <td style={tdStyle}>{item.fonte}</td>
                    <td style={tdStyle}>{item.pag}</td>
                    <td style={{ ...tdStyle, color: "var(--primary)", fontWeight: 600 }}>{item.tempo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Vantagem vs seguro tradicional
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Seguro tradicional: sinistro manual → documentacao → vistoria → analise → dias/semanas para pagar.
              Seguro parametrico: evento detectado automaticamente → pagamento em minutos/horas.
              Elimina: moral hazard (fraude de sinistro), custo de claims management, e insatisfacao do cliente.
              Limitacao: basis risk (o trigger pode nao refletir a perda real do segurado).
            </p>
          </div>
        </>
      ),
    },

    {
      id: "seguro-transacao",
      title: "Seguro de Transacao — Purchase Protection",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Purchase protection e um seguro que protege o comprador contra problemas na transacao:
            produto nao recebido, produto diferente do anunciado, dano no transporte, ou roubo apos
            a compra. Diferente do chargeback (que e um mecanismo de disputa com a bandeira), o
            seguro de transacao e um produto financeiro separado.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              { tipo: "Protecao de compra", cobre: "Produto nao recebido, produto errado, defeito. Ate 90 dias apos a compra.", custo: "1-3% do valor da compra", quemPaga: "Comprador (opcional no checkout) ou plataforma (como beneficio)" },
              { tipo: "Protecao de envio", cobre: "Extravio, roubo ou dano no transporte. Do envio ate a entrega.", custo: "R$ 2-15 por envio", quemPaga: "Vendedor ou comprador (checkbox no checkout)" },
              { tipo: "Protecao contra roubo", cobre: "Item roubado ate 90 dias apos compra. Exige B.O.", custo: "3-5% do valor do item", quemPaga: "Comprador (opt-in)" },
              { tipo: "Buyer protection (marketplace)", cobre: "Garantia da plataforma de que o comprador recebera o produto ou o dinheiro de volta.", custo: "Incluso na taxa da plataforma", quemPaga: "Plataforma (custo absorvido no take rate)" },
            ].map((item) => (
              <div key={item.tipo} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>{item.tipo}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  <strong style={{ color: "var(--foreground)" }}>Cobre:</strong> {item.cobre}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  <strong style={{ color: "var(--primary)" }}>Custo:</strong> {item.custo}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "#22c55e" }}>Quem paga:</strong> {item.quemPaga}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    {
      id: "iaas",
      title: "Insurance-as-a-Service — APIs",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Insurance-as-a-Service (IaaS) permite que plataformas ofereçam seguros via API sem
            precisar ser seguradora. Os providers de IaaS cuidam de: emissao de apolice, gestao de
            risco, compliance regulatorio (SUSEP) e gestao de sinistros. A plataforma so precisa
            integrar a API e oferecer no checkout.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Provider</th>
                  <th style={thStyle}>Especialidade</th>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Mercado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { prov: "Pier", esp: "Seguro auto e celular", mod: "Full-stack insurtech (seguradora propria)", merc: "Brasil" },
                  { prov: "Justos", esp: "Seguro auto com telematica", mod: "Seguradora digital com precificacao por dados", merc: "Brasil" },
                  { prov: "Azos", esp: "Seguro de vida simplificado", mod: "Distribuicao digital, emissao em minutos", merc: "Brasil" },
                  { prov: "Chubb (API)", esp: "Embedded insurance (viagem, garantia, cargo)", mod: "API white-label para plataformas", merc: "Global (forte no Brasil)" },
                  { prov: "Cover Genius", esp: "Protecao de compra, viagem, envio", mod: "API para marketplaces e OTAs", merc: "Global" },
                  { prov: "Bolttech", esp: "Device protection, embedded insurance", mod: "Plataforma de distribuicao multi-produto", merc: "Asia + Latam" },
                ].map((item) => (
                  <tr key={item.prov}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.prov}</td>
                    <td style={tdStyle}>{item.esp}</td>
                    <td style={tdStyle}>{item.mod}</td>
                    <td style={tdStyle}>{item.merc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={codeBlockStyle}>
{`INTEGRACAO TIPICA (API embedded insurance):

// 1. Obter cotacao no checkout
POST /api/v1/quotes
{
  "product": "extended_warranty",
  "item_value": 2999.00,
  "item_category": "electronics",
  "coverage_months": 24
}
→ Response: { "quote_id": "qt_123", "premium": 149.90, "coverage": 2999.00 }

// 2. Emitir apolice (apos pagamento confirmado)
POST /api/v1/policies
{
  "quote_id": "qt_123",
  "policyholder": { "name": "Joao Silva", "cpf": "123.456.789-00" },
  "order_id": "ORD-456"
}
→ Response: { "policy_id": "pol_789", "status": "active" }

// 3. Abrir sinistro (quando necessario)
POST /api/v1/claims
{
  "policy_id": "pol_789",
  "type": "product_defect",
  "description": "Tela quebrada apos 8 meses"
}
→ Response: { "claim_id": "clm_012", "status": "in_review" }`}
          </div>
        </>
      ),
    },

    {
      id: "susep",
      title: "Regulacao — SUSEP",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            A SUSEP (Superintendencia de Seguros Privados) e o orgao regulador do mercado de seguros
            no Brasil. Toda operacao de seguro deve envolver uma entidade autorizada pela SUSEP.
            Plataformas que distribuem seguros precisam entender os limites regulatorios.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr><th style={thStyle}>Entidade</th><th style={thStyle}>O que faz</th><th style={thStyle}>Capital minimo</th><th style={thStyle}>Licenca SUSEP</th></tr>
              </thead>
              <tbody>
                {[
                  { ent: "Sociedade Seguradora", faz: "Subscreve risco, emite apolice, paga sinistros", cap: "R$ 15M+ (varia por ramo)", lic: "Obrigatoria" },
                  { ent: "Corretora de Seguros", faz: "Intermediacao (vende para cliente, recebe comissao)", cap: "Nao ha capital minimo", lic: "Registro SUSEP + exame habilitacao" },
                  { ent: "Estipulante", faz: "Contrata seguro coletivo em nome de grupo (ex: plataforma para seus users)", cap: "N/A", lic: "Nao exige registro, mas regulado" },
                  { ent: "Sandbox SUSEP", faz: "Empresas testam produtos inovadores com requisitos reduzidos", cap: "Reduzido (definido caso a caso)", lic: "Autorizacao temporaria SUSEP" },
                ].map((item) => (
                  <tr key={item.ent}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.ent}</td>
                    <td style={tdStyle}>{item.faz}</td>
                    <td style={tdStyle}>{item.cap}</td>
                    <td style={tdStyle}>{item.lic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={subheadingStyle}>Sandbox Regulatorio SUSEP</p>
          <p style={paragraphStyle}>
            A SUSEP criou um sandbox regulatorio para permitir que insurtechs testem produtos inovadores
            com requisitos de capital e compliance reduzidos. Participantes podem operar por ate 3 anos
            com limites de premio e numero de apolices. O sandbox ja aprovou projetos de seguro parametrico,
            micro-seguros e novos modelos de distribuicao. E a porta de entrada para insurtechs que querem
            operar como seguradora sem o capital inicial de R$15M+.
          </p>
        </>
      ),
    },

    {
      id: "metricas",
      title: "Metricas de InsurTech",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Metricas de seguros sao diferentes de metricas de pagamentos. Entender loss ratio,
            combined ratio e attachment rate e essencial para avaliar a saude de uma operacao de
            insurance.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Formula</th>
                  <th style={thStyle}>Bom</th>
                  <th style={thStyle}>Red flag</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { met: "Loss Ratio", formula: "Sinistros pagos / Premios ganhos", bom: "< 60%", red: "> 80% (prejuizo tecnico)" },
                  { met: "Combined Ratio", formula: "(Sinistros + Despesas) / Premios", bom: "< 95%", red: "> 100% (operacao no vermelho)" },
                  { met: "Attachment Rate", formula: "Apolices vendidas / Oportunidades de oferta", bom: "15-25%", red: "< 5% (oferta ineficaz)" },
                  { met: "Premium per Policy", formula: "Receita total de premios / Numero de apolices", bom: "Depende do produto", red: "Caindo sem aumento de volume" },
                  { met: "Claims Rate", formula: "Numero de sinistros / Numero de apolices ativas", bom: "< 10% (produto, nao saude)", red: "> 20%" },
                  { met: "Claims Resolution Time", formula: "Tempo medio entre abertura e pagamento do sinistro", bom: "< 7 dias", red: "> 30 dias" },
                  { met: "Customer Lifetime Value", formula: "Premio medio × Renovacoes medias × Margem", bom: "CLV > 3× CAC", red: "CLV < CAC" },
                ].map((item) => (
                  <tr key={item.met}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.met}</td>
                    <td style={tdStyle}>{item.formula}</td>
                    <td style={{ ...tdStyle, color: "#22c55e", fontWeight: 600 }}>{item.bom}</td>
                    <td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>{item.red}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    {
      id: "casos-uso",
      title: "Casos de Uso Reais",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Empresas brasileiras e globais ja implementam embedded insurance com resultados significativos.
            Os casos abaixo mostram diferentes abordagens e resultados.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              {
                empresa: "Mercado Livre — Protecao de Compra",
                color: "#f59e0b",
                desc: "Programa de buyer protection que garante reembolso se o produto nao chegar ou for diferente do anunciado. Funciona como seguro embutido no marketplace financiado pelo take rate.",
                resultado: "Aumentou confianca dos compradores. Reduziu chargebacks. E um dos principais diferenciadores competitivos vs OLX/Shopee.",
              },
              {
                empresa: "Uber — Seguro para Motoristas",
                color: "#000000",
                desc: "Seguro de acidentes pessoais para motoristas parceiros durante viagens. Cobertura automatica sem custo adicional. Parceria com seguradoras para subsidiar premio.",
                resultado: "Atracao e retencao de motoristas. Diferencial competitivo vs 99. Compliance com regulacao trabalhista.",
              },
              {
                empresa: "iFood — Seguro de Entrega",
                color: "#ef4444",
                desc: "Protecao para entregadores parceiros: cobertura de acidentes durante entregas, auxilio por afastamento, e seguro para equipamento (celular, bag).",
                resultado: "Reducao de turnover de entregadores. Melhoria na relacao com reguladores. Parte da estrategia de responsabilidade social.",
              },
              {
                empresa: "Nubank — Seguro de Vida",
                color: "#8b5cf6",
                desc: "Seguro de vida simplificado ofertado no app. Contratacao em 3 minutos, sem exame medico. A partir de R$9/mes. Experiencia 100% digital.",
                resultado: "Milhoes de apolices vendidas. Nova linha de receita significativa. Demonstra poder de distribuicao de base instalada (90M+ clientes).",
              },
              {
                empresa: "Amazon — Garantia Estendida",
                color: "#f97316",
                desc: "Oferta de garantia estendida no checkout de eletronicos e eletrodomesticos. Parceria com Asurion. Checkbox simples no checkout com preco transparente.",
                resultado: "Attach rate de 15-20% em categorias de alto valor. Receita de comissao + melhoria na experiencia pos-venda.",
              },
            ].map((item) => (
              <div key={item.empresa} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>{item.empresa}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--primary)" }}>Resultado:</strong> {item.resultado}
                </p>
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
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>InsurTech e Embedded Insurance</h1>
        <p className="page-description">
          Guia completo sobre tecnologia aplicada a seguros: embedded insurance, seguro parametrico,
          protecao de transacao, Insurance-as-a-Service, regulacao SUSEP e casos de uso reais.
        </p>
      </header>
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>O que e InsurTech e como esta transformando a industria de seguros</li>
          <li>Embedded insurance: seguro no checkout com attach rate de 15-25%</li>
          <li>Modelos de distribuicao: affinity, embedded, full-stack, marketplace</li>
          <li>Seguro parametrico: pagamento automatico por evento, sem sinistro manual</li>
          <li>Purchase protection e seguro de transacao em marketplaces</li>
          <li>Insurance-as-a-Service: APIs para integrar seguros em minutos</li>
          <li>Regulacao SUSEP: seguradora, corretora, estipulante e sandbox</li>
          <li>Metricas: loss ratio, combined ratio, attachment rate, claims rate</li>
        </ul>
      </div>
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[{ val: "9", label: "Secoes" }, { val: "6", label: "Providers" }, { val: "5", label: "Cases" }, { val: "7", label: "Metricas" }].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{s.val}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
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
            { name: "Embedded Finance", href: "/knowledge/embedded-finance" },
            { name: "LGPD e Privacidade", href: "/knowledge/lgpd-payments" },
            { name: "Chargeback & Disputas", href: "/knowledge/chargebacks" },
            { name: "Matriz Regulatoria", href: "/knowledge/regulatory-matrix" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none", transition: "all 0.2s" }}>{link.name}</Link>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.5 }}>
          Fontes: SUSEP, CNseg, documentacao publica de Pier, Justos, Azos, Chubb API, Cover Genius.
        </p>
      </div>
    </div>
  );
}
