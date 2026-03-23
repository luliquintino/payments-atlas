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

export default function ConsorcioFactoringPage() {
  const quiz = getQuizForPage("/knowledge/consorcio-factoring");
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
              "Explicar o funcionamento do consorcio como mecanismo de poupanca programada",
              "Descrever a mecanica de grupos, parcelas, fundo comum e contemplacao",
              "Entender a regulacao de consorcios pelo BACEN e o papel da ABAC",
              "Analisar como fintechs estao digitalizando o consorcio (Mycon, Embracon digital)",
              "Definir factoring e diferenciar de antecipacao de recebiveis",
              "Classificar tipos de factoring: convencional, maturity, trustee, forfaiting, reverse",
              "Entender FIDCs como veiculo de financiamento de operacoes de factoring",
              "Conectar consorcio e factoring ao ecossistema de pagamentos",
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
      id: "o-que-e-consorcio", title: "O que e Consorcio", icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Consorcio e uma modalidade de compra programada tipicamente brasileira, onde um grupo de pessoas
            se une para formar uma poupanca coletiva com o objetivo de adquirir bens ou servicos.
            Diferente de um financiamento, nao ha cobranca de juros — apenas taxa de administracao.
            O consorcio existe no Brasil desde 1962 e movimenta mais de R$300 bilhoes por ano em creditos ativos.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Consorcio</th>
                  <th style={thStyle}>Financiamento</th>
                  <th style={thStyle}>Poupanca individual</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { asp: "Juros", cons: "Nao ha juros. Apenas taxa de administracao (10-20% diluida no prazo)", fin: "Juros de 1-2%/mes (12-24%/ano)", poup: "Rendimento (CDI, poupanca)" },
                  { asp: "Acesso ao bem", cons: "Sorteio ou lance (pode ser no 1o mes ou no ultimo)", fin: "Imediato apos aprovacao", poup: "Apenas quando juntar o total" },
                  { asp: "Custo total", cons: "Menor que financiamento na maioria dos casos", fin: "Mais caro (juros compostos)", poup: "Mais barato, mas mais lento" },
                  { asp: "Disciplina", cons: "Alta — parcela obrigatoria, grupo cobra", fin: "Alta — cobranca bancaria", poup: "Baixa — facil desistir" },
                  { asp: "Regulacao", cons: "BACEN (Lei 11.795/2008)", fin: "BACEN / CMN", poup: "Nao regulado (conta propria)" },
                ].map((row) => (
                  <tr key={row.asp}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.asp}</td>
                    <td style={tdStyle}>{row.cons}</td>
                    <td style={tdStyle}>{row.fin}</td>
                    <td style={tdStyle}>{row.poup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>Numeros do mercado</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O sistema de consorcios brasileiro tem mais de 9 milhoes de participantes ativos e mais de
              R$300 bilhoes em creditos a contemplar. Os principais segmentos sao: imoveis (50%+),
              automoveis (30%), servicos (10%) e outros bens (10%). O mercado cresce 15-20% ao ano,
              impulsionado pela digitalizacao e novas fintechs.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "mecanica-consorcio", title: "Mecanica do Consorcio", icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            O consorcio funciona atraves de grupos administrados por empresas autorizadas pelo BACEN.
            Cada grupo tem regras especificas de prazo, valor e contemplacao.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { etapa: "Formacao do grupo", desc: "Administradora reune participantes interessados em bens de valor similar. Cada grupo tem prazo definido (36 a 200+ meses), numero maximo de participantes e valor da carta de credito." },
              { etapa: "Parcelas mensais", desc: "Cada participante paga parcela mensal composta por: fundo comum (vai para o pool de contemplacao), taxa de administracao (remuneracao da administradora), fundo de reserva (cobrir inadimplencia) e seguro (opcional)." },
              { etapa: "Fundo comum", desc: "As parcelas de todos os participantes formam o fundo comum. Este fundo e usado mensalmente para contemplar um ou mais participantes com a carta de credito." },
              { etapa: "Contemplacao por sorteio", desc: "Em cada assembleia mensal, ao menos um participante e sorteado e recebe a carta de credito para adquirir o bem. O sorteio garante aleatoriedade e justica." },
              { etapa: "Contemplacao por lance", desc: "Participantes podem oferecer lances (antecipacao de parcelas) para aumentar chances de contemplacao. O maior lance vence. Tipos: lance livre (dinheiro), lance fixo (% pre-definido), lance embutido (usando a propria carta)." },
              { etapa: "Uso da carta de credito", desc: "O contemplado recebe uma carta de credito no valor do bem. Pode usar para comprar o bem em qualquer fornecedor, desde que dentro das regras do grupo. O bem fica alienado ate quitacao." },
            ].map((item) => (
              <div key={item.etapa} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>{item.etapa}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "regulacao-consorcio", title: "Regulacao do Consorcio", icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            O sistema de consorcios e regulado pelo Banco Central do Brasil com base na Lei 11.795/2008.
            A regulacao visa proteger os participantes e garantir a saude financeira dos grupos.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Orgao / Norma</th>
                  <th style={thStyle}>Papel</th>
                  <th style={thStyle}>Principais regras</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { orgao: "BACEN", papel: "Regulador e fiscalizador do sistema de consorcios", regras: "Autoriza administradoras, define regras prudenciais, fiscaliza operacoes, aplica sancoes. Circular 3.432/2009 e atualizacoes." },
                  { orgao: "Lei 11.795/2008", papel: "Marco legal do sistema de consorcios", regras: "Define direitos e obrigacoes dos participantes e administradoras. Regras de contemplacao, desistencia, exclusao e devolucao." },
                  { orgao: "ABAC", papel: "Associacao Brasileira de Administradoras de Consorcios", regras: "Autorregulacao, codigo de etica, dados de mercado, defesa dos interesses do setor. Nao e regulador, mas influente." },
                  { orgao: "Administradoras", papel: "Empresas autorizadas pelo BACEN para operar grupos", regras: "Devem ter capital minimo, controles internos, auditoria externa, separacao patrimonial (recursos do grupo separados dos da empresa)." },
                ].map((row) => (
                  <tr key={row.orgao}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.orgao}</td>
                    <td style={tdStyle}>{row.papel}</td>
                    <td style={tdStyle}>{row.regras}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "consorcio-digital", title: "Consorcio Digital — Fintechs Disrupting", icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            O consorcio tradicional sofre de UX ruim: processo burocratico, vendas presenciais, pouca
            transparencia e dificuldade de simulacao. Fintechs estao digitalizando a experiencia
            e tornando o consorcio acessivel para novas geracoes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "Mycon", desc: "Plataforma 100% digital de consorcios. Simulacao instantanea, contratacao online em minutos, acompanhamento por app. Foco em imoveis e automoveis. UX moderna, transparencia de taxas. Crescimento acelerado com marketing digital.", tag: "Digital-first" },
              { name: "Embracon Digital", desc: "Maior administradora do Brasil (40+ anos), migrando para digital. App com contratacao, lances, acompanhamento. Combinacao de marca forte com experiencia digital.", tag: "Incumbent digital" },
              { name: "Rodobens", desc: "Administradora tradicional com forte presenca digital. Pioneira em consorcio de servicos e experiencias. Diversificacao alem de imoveis e autos.", tag: "Diversificada" },
              { name: "Embedded consorcio", desc: "Consorcios oferecidos dentro de plataformas — imobiliarias, concessionarias, apps financeiros. O usuario compra consorcio sem sair do fluxo principal. Modelo BaaS aplicado a consorcios.", tag: "Tendencia futura" },
            ].map((item) => (
              <div key={item.name} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{item.name}</span>
                  <span style={tagStyle}>{item.tag}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>Oportunidade em pagamentos</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Consorcios geram fluxo previsivel de pagamentos recorrentes (parcelas mensais) por longos periodos
              (3-15 anos). Para PSPs e plataformas de pagamento, processar debito automatico de parcelas de
              consorcio e uma oportunidade de receita recorrente com churn muito baixo.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "o-que-e-factoring", title: "O que e Factoring", icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Factoring (ou fomento mercantil) e a operacao de cessao de credito em que uma empresa vende
            seus recebiveis (duplicatas, cheques, notas fiscais) a uma empresa de factoring com desconto,
            recebendo o valor antecipado. A factoring assume o risco de credito do devedor.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { asp: "Como funciona", det: "Empresa A vende produtos para Empresa B com prazo de 60 dias. Empresa A cede o recebivel (duplicata) para a factoring. A factoring paga Empresa A imediatamente com desconto (ex: desconto de 3% = R$97K por R$100K de face). Em 60 dias, Empresa B paga diretamente a factoring." },
                  { asp: "Quem usa", det: "PMEs que precisam de capital de giro imediato. Empresas com ciclo de recebimento longo (30-90-120 dias). Negocios sem acesso facil a credito bancario." },
                  { asp: "Custo tipico", det: "Fator de compra de 2-6% ao mes sobre o valor de face, dependendo do prazo, risco do sacado e volume. Mais caro que credito bancario, mas mais acessivel para PMEs." },
                  { asp: "Regulacao", det: "Factoring NAO e instituicao financeira (Lei 8.981/1995). Nao e regulada pelo BACEN. Supervisao COAF para AML. Associacao representativa: ANFAC." },
                  { asp: "Diferenca de credito", det: "Factoring e cessao de credito (compra e venda de ativo), nao emprestimo. Nao exige garantias tradicionais. Analise de credito foca no sacado (quem deve), nao no cedente (quem vende)." },
                ].map((row) => (
                  <tr key={row.asp}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.asp}</td>
                    <td style={tdStyle}>{row.det}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "factoring-vs-antecipacao", title: "Factoring vs Antecipacao de Recebiveis", icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Factoring e antecipacao de recebiveis de cartao sao frequentemente confundidos, mas sao
            operacoes distintas com regulacao, mecanica e custos diferentes.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Factoring</th>
                  <th style={thStyle}>Antecipacao de Recebiveis (cartao)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { asp: "O que e cedido", fact: "Duplicatas, cheques, notas fiscais (B2B)", ant: "Recebiveis de vendas com cartao de credito" },
                  { asp: "Quem compra", fact: "Empresa de factoring (nao e IF)", ant: "Adquirente, PSP, banco ou FIDC" },
                  { asp: "Regulacao", fact: "Nao regulada pelo BACEN. COAF para AML.", ant: "Regulada pelo BACEN (Resolucao CMN 4.734). Registradora obrigatoria." },
                  { asp: "Risco de credito", fact: "Da factoring (pro soluto) ou do cedente (pro solvendo)", ant: "Baixissimo — recebivel de cartao e garantido pela bandeira/emissor" },
                  { asp: "Custo", fact: "2-6% ao mes (alto, reflete risco)", ant: "1-3.5% ao mes (menor, recebivel mais seguro)" },
                  { asp: "Registro", fact: "Nao obrigatorio (mas recomendado)", ant: "Obrigatorio na registradora (CERC, CIP, TAG)" },
                  { asp: "Escala", fact: "~R$200B/ano no Brasil", ant: "~R$500B+ antecipados/ano pelos acquirers" },
                ].map((row) => (
                  <tr key={row.asp}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.asp}</td>
                    <td style={tdStyle}>{row.fact}</td>
                    <td style={tdStyle}>{row.ant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "tipos-factoring", title: "Tipos de Factoring", icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            O mercado de factoring evoluiu para diversos modelos, cada um atendendo necessidades
            especificas de cash flow e gestao de risco.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { tipo: "Factoring convencional", desc: "Cessao de duplicatas com antecipacao de valor. A factoring compra o recebivel com desconto e assume o risco de cobranca. Modelo mais comum no Brasil. A factoring tambem oferece servicos de cobranca e gestao de carteira.", color: "#3b82f6" },
              { tipo: "Maturity factoring", desc: "A factoring compra o recebivel mas NAO antecipa o valor. Paga ao cedente apenas no vencimento da duplicata. O beneficio para o cedente e a transferencia do risco de credito e a gestao de cobranca, nao a antecipacao de caixa.", color: "#22c55e" },
              { tipo: "Trustee factoring", desc: "A factoring atua como gestor de recebiveis. Nao compra os titulos mas administra a cobranca, controle de vencimentos e conciliacao. Cobra taxa de administracao. Util para empresas com grande volume de duplicatas.", color: "#f59e0b" },
              { tipo: "Forfaiting", desc: "Compra de recebiveis de exportacao de medio/longo prazo (1-7 anos). Comum em comercio exterior. A forfaiter compra titulos de credito (letters of credit, bills of exchange) sem recurso contra o exportador.", color: "#8b5cf6" },
              { tipo: "Reverse factoring (Supply Chain Finance)", desc: "Iniciado pelo COMPRADOR (grande empresa), nao pelo vendedor. O comprador informa a plataforma que aprovou a NF do fornecedor. O fornecedor pode antecipar com taxa menor (risco do comprador, nao do fornecedor). Modelo disruptivo, crescente globalmente.", color: "#ec4899" },
            ].map((item) => (
              <div key={item.tipo} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>{item.tipo}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "fidc", title: "FIDC como Veiculo de Financiamento", icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            FIDCs (Fundos de Investimento em Direitos Creditorios) sao veiculos de securitizacao que
            permitem que empresas de factoring e fintechs financiem suas operacoes captando recursos
            no mercado de capitais, em vez de depender exclusivamente de capital proprio.
          </p>
          <p style={subheadingStyle}>Estrutura de um FIDC</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>Funcao</th>
                  <th style={thStyle}>Exemplo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { comp: "Cedente", funcao: "Empresa que origina os recebiveis e os cede ao fundo", ex: "Factoring, fintech de credito, acquirer (recebiveis de cartao)" },
                  { comp: "Cotas Senior", funcao: "Investidores com prioridade de pagamento. Menor risco, menor retorno", ex: "Fundos de pensao, bancos, investidores conservadores. Retorno: CDI + 2-4%/ano" },
                  { comp: "Cotas Subordinadas", funcao: "Absorvem perdas primeiro (first loss). Maior risco, maior retorno", ex: "Frequentemente detidas pelo proprio cedente. Retorno: CDI + 8-15%/ano" },
                  { comp: "Custodiante", funcao: "Banco que custodia os ativos e verifica a elegibilidade dos recebiveis", ex: "Banco Itau, BTG, Bradesco. Obrigatorio pela CVM." },
                  { comp: "Gestor", funcao: "Gestora responsavel pela politica de investimento e gestao do fundo", ex: "Gestoras independentes ou ligadas a bancos. Reguladas pela CVM." },
                  { comp: "Administrador", funcao: "Instituicao responsavel pela administracao fiduciaria do fundo", ex: "Banco administrador. Reporting, compliance, assembleias." },
                ].map((row) => (
                  <tr key={row.comp}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.comp}</td>
                    <td style={tdStyle}>{row.funcao}</td>
                    <td style={tdStyle}>{row.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>FIDCs e pagamentos</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              No ecossistema de pagamentos, FIDCs sao usados para financiar antecipacao de recebiveis de cartao.
              Acquirers e PSPs cedem recebiveis de cartao para FIDCs e usam os recursos captados para antecipar
              para mais merchants. Isso permite escalar a operacao de antecipacao sem comprometer 100% do capital proprio.
              O mercado de FIDCs de recebiveis de cartao ultrapassa R$100 bilhoes em patrimonio.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "impacto-pagamentos", title: "Impacto em Pagamentos — Conectando os Pontos", icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            Consorcio e factoring podem parecer distantes do dia-a-dia de pagamentos, mas estao profundamente
            conectados ao ecossistema. Entender essas conexoes amplia a visao sobre o mercado financeiro.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { conexao: "Consorcio como pagamento recorrente", desc: "Parcelas de consorcio sao debitos automaticos mensais — processados via boleto, debito em conta ou cartao de credito. Para PSPs, representam revenue recorrente de longo prazo (3-15 anos). Administradoras de consorcio sao merchants com volume previsivel e churn quase zero." },
              { conexao: "Antecipacao de recebiveis e factoring", desc: "A antecipacao de recebiveis de cartao (produto-chave de acquirers brasileiros) e uma forma de factoring. O acquirer compra recebiveis futuros de cartao com desconto. A regulacao de registradoras (CERC, CIP) tornou este mercado mais transparente e competitivo." },
              { conexao: "FIDCs e liquidez do sistema", desc: "FIDCs proveem liquidez ao sistema de pagamentos. Sem eles, acquirers precisariam de muito mais capital proprio para oferecer antecipacao. FIDCs de recebiveis de cartao sao um dos maiores segmentos do mercado de securitizacao brasileiro." },
              { conexao: "Reverse factoring e supply chain payments", desc: "Supply chain finance (reverse factoring) esta convergindo com payments. Plataformas como C2FO, Taulia e PrimeRevenue operam na intersecao entre pagamentos B2B e financiamento de cadeia de suprimentos. No Brasil, o Pix e a registradora de duplicatas eletronicas (Lei 13.775/2018) facilitam essa convergencia." },
              { conexao: "Embedded consorcio e lending", desc: "O consorcio digital se conecta a embedded finance: plataformas imobiliarias oferecendo consorcio como alternativa ao financiamento, concessionarias digitais com consorcio integrado no checkout, apps financeiros oferecendo consorcio como produto de investimento." },
              { conexao: "Dados de pagamento para credit scoring", desc: "Dados de processamento de pagamentos (volume, sazonalidade, chargebacks) sao usados por factorings e FIDCs para avaliar o risco de credito de cedentes. O registro de recebiveis nas registradoras criou um novo ativo colateral que facilita o acesso a credito para PMEs." },
            ].map((item) => (
              <div key={item.conexao} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>{item.conexao}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>Visao holistica</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Profissionais de pagamentos que entendem consorcio, factoring e FIDCs tem uma vantagem competitiva
              significativa. Esses instrumentos estao cada vez mais integrados ao ecossistema de pagamentos,
              especialmente com a digitalizacao, o registro eletronico de recebiveis e a convergencia entre
              payments e lending.
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Consorcio & Factoring</h1>
        <p className="page-description">
          Guia completo sobre consorcio (poupanca programada brasileira) e factoring (cessao de credito):
          mecanica, regulacao, digitalizacao, tipos de factoring, FIDCs e conexao com o ecossistema de pagamentos.
        </p>
      </header>
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>Entender consorcio como mecanismo de poupanca e compra programada</li>
          <li>Diferenciar factoring de antecipacao de recebiveis</li>
          <li>Conhecer FIDCs como veiculo de securitizacao</li>
          <li>Conectar esses instrumentos ao ecossistema de pagamentos</li>
        </ul>
      </div>
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[{ v: "10", l: "Secoes" }, { v: "5", l: "Tipos Factoring" }, { v: "6", l: "Conexoes" }, { v: "R$300B+", l: "Creditos Ativos" }].map((s) => (
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
            { name: "Antecipacao de Recebiveis", href: "/knowledge/antecipacao-recebiveis" },
            { name: "Credito Estruturado", href: "/knowledge/credito-estruturado" },
            { name: "Unit Economics", href: "/knowledge/unit-economics" },
            { name: "Embedded Finance", href: "/knowledge/embedded-finance" },
            { name: "Matriz Regulatoria", href: "/knowledge/regulatory-matrix" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>{link.name}</Link>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.5 }}>
          Fontes: BACEN (regulacao de consorcios), ABAC (dados de mercado), ANFAC (factoring),
          CVM (regulacao de FIDCs), Lei 11.795/2008, Lei 13.775/2018. Dados sao estimativas publicas.
        </p>
      </div>
    </div>
  );
}
