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

export default function LegacyMigrationPage() {
  const quiz = getQuizForPage("/knowledge/legacy-migration");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "o-que-sao-legacy",
      title: "O que sao Legacy Systems",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Legacy systems sao sistemas de tecnologia antigos que continuam em operacao porque sao criticos
            para o negocio, mesmo que a tecnologia esteja obsoleta. Em pagamentos e banking, isso significa
            mainframes IBM z/OS rodando COBOL, processamento batch noturno, bancos de dados hierarquicos
            (IMS DB/DC) e interfaces de terminal verde (3270).
          </p>
          <p style={paragraphStyle}>
            Por que ainda existem? Porque funcionam. Esses sistemas processam trilhoes de dolares diariamente
            com uptime de 99.999%. Substitui-los e arriscado, caro e politicamente dificil. A estimativa e que
            ainda existam mais de 220 bilhoes de linhas de COBOL em producao globalmente, processando 95% das
            transacoes ATM e 80% das transacoes presenciais.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tecnologia</th>
                  <th style={thStyle}>Era</th>
                  <th style={thStyle}>Onde esta</th>
                  <th style={thStyle}>Por que persiste</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>COBOL</td><td style={tdStyle}>1959</td><td style={tdStyle}>Core banking, processamento de cartoes, clearing</td><td style={tdStyle}>Estavel, performatico, 65+ anos de regras de negocio embutidas</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>IBM Mainframe (z/OS)</td><td style={tdStyle}>1964</td><td style={tdStyle}>Bancos top-tier, bandeiras, processadores</td><td style={tdStyle}>Throughput inigualavel, RAS (Reliability, Availability, Serviceability)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>IMS DB/DC</td><td style={tdStyle}>1966</td><td style={tdStyle}>Databases hierarquicos de core banking</td><td style={tdStyle}>Performance para workloads transacionais especificos</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Batch Processing</td><td style={tdStyle}>1960s</td><td style={tdStyle}>Clearing, settlement, reporting, EOD</td><td style={tdStyle}>Eficiente para processamento em massa; reconciliacao nocturna</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "landscape",
      title: "Landscape de Sistemas Legados",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Sistemas legados estao em pontos criticos da cadeia de pagamentos. Entender onde eles estao
            e fundamental para planejar modernizacao sem interromper operacoes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "Core Banking", emoji: "🏛️", desc: "O coracao do banco: contas, saldos, transacoes, ledger. Grandes bancos brasileiros (Itau, Bradesco, BB) ainda rodam core banking em mainframe COBOL. Alguns componentes tem 40+ anos. O custo de manter um mainframe e alto (US$ 1M+/ano em licencas IBM), mas o custo de substituir e astronomico.", examples: "Itau (mainframe IBM), BB (mainframe), Bradesco (Unisys)" },
              { name: "Card Processors", emoji: "💳", desc: "Processadoras de cartao como VisaNet, Mastercard Network, e processadoras locais (Cielo/Rede backend). Muitas ainda usam ISO 8583 sobre mainframe para autorizacao, com batch COBOL para clearing e settlement.", examples: "VisaNet (mainframe), Mastercard (migrando), ELO (hibrido)" },
              { name: "Clearing Houses", emoji: "⚙️", desc: "CIP (Camara Interbancaria de Pagamentos), Nuclea (ex-CIP), COMPE (cheques). Sistemas de clearing que processam bilhoes em transacoes diariamente. Muitos componentes em COBOL/mainframe com interfaces modernizadas (APIs).", examples: "CIP/Nuclea, COMPE, B3 (clearing de titulos)" },
              { name: "Payment Networks", emoji: "🌐", desc: "SWIFT (rede de mensageria), SPB (Sistema de Pagamentos Brasileiro), STR (Sistema de Transferencia de Reservas). Infraestrutura critica com componentes legados interagindo com camadas modernas (Pix e ISO 20022 sobre infraestrutura STR).", examples: "SWIFT (migrando MT→MX), STR, RSFN" },
            ].map((item) => (
              <div key={item.name} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 500 }}>Exemplos: {item.examples}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "riscos-legacy",
      title: "Riscos de Legacy",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Manter sistemas legados nao e gratis. O custo de nao modernizar cresce exponencialmente com o tempo,
            e os riscos se acumulam silenciosamente ate se manifestarem como crises.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { risk: "Technical Debt", icon: "🏗️", desc: "Decadas de patches, workarounds e regras de negocio acumuladas em codigo que ninguem entende completamente. Alterar uma regra de negocio pode quebrar 15 outros processos porque as dependencias nao sao documentadas.", impact: "Custo de mudanca cresce 10-50x comparado a sistemas modernos" },
              { risk: "Security Vulnerabilities", icon: "🔓", desc: "Sistemas que nunca foram projetados para internet. Protocolos obsoletos, criptografia fraca (DES, MD5), falta de patching. COBOL nao tem conceito de SQL injection, mas tem seus proprios vetores de ataque.", impact: "Maior superficie de ataque, compliance gaps com PCI e LGPD" },
              { risk: "Talent Shortage", icon: "👤", desc: "Programadores COBOL estao se aposentando e nao estao sendo substituidos. A idade media de um programador COBOL e 55+ anos. Universidades nao ensinam COBOL. O custo de contratar um especialista COBOL senior pode ser 2-3x um developer cloud-native.", impact: "Risco operacional — se as pessoas-chave saem, ninguem mantem o sistema" },
              { risk: "Scalability Limits", icon: "📈", desc: "Mainframes escalam verticalmente (mais CPU, mais memoria no mesmo box). Modelos cloud-native escalam horizontalmente (mais instancias). Para Pix (4B txn/mes) e real-time payments, a demanda pode exceder a capacidade vertical.", impact: "Incapacidade de atender picos de demanda e novos produtos" },
              { risk: "Vendor Lock-in", icon: "🔗", desc: "Dependencia total de IBM (mainframe), Unisys, ou vendors especificos. Renovacoes de licenca sem alternativa. O vendor dita preco, roadmap e timeline de support.", impact: "Custos de licenca crescentes, sem poder de negociacao" },
            ].map((item) => (
              <div key={item.risk} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.risk}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.8rem", color: "#ef4444", fontWeight: 500 }}>Impacto: {item.impact}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "estrategias-migracao",
      title: "Estrategias de Migracao",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Nao existe abordagem unica para migrar sistemas legados. A escolha depende do risco toleravel,
            orcamento, timeline e complexidade do sistema. As tres estrategias principais sao:
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Estrategia</th>
                  <th style={thStyle}>Como funciona</th>
                  <th style={thStyle}>Risco</th>
                  <th style={thStyle}>Timeline</th>
                  <th style={thStyle}>Quando usar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Big Bang</td>
                  <td style={tdStyle}>Substitui tudo de uma vez. Desliga o legado, liga o novo em uma data definida.</td>
                  <td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Muito alto</td>
                  <td style={tdStyle}>12-24 meses</td>
                  <td style={tdStyle}>Sistema pequeno, equipe experiente, downtime toleravel</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Strangler Fig</td>
                  <td style={tdStyle}>Substitui incrementalmente. Novas funcionalidades no novo sistema; legado vai sendo desligado aos poucos.</td>
                  <td style={{ ...tdStyle, color: "#22c55e", fontWeight: 600 }}>Baixo a medio</td>
                  <td style={tdStyle}>2-5 anos</td>
                  <td style={tdStyle}>Sistemas grandes e criticos (padrao para banking)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Parallel Run</td>
                  <td style={tdStyle}>Roda os dois sistemas simultaneamente com os mesmos inputs. Compara outputs. Quando novo = legado, desliga legado.</td>
                  <td style={{ ...tdStyle, color: "#f59e0b", fontWeight: 600 }}>Medio</td>
                  <td style={tdStyle}>3-5 anos</td>
                  <td style={tdStyle}>Sistemas financeiros onde precisao e critica (ledger, clearing)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>Recomendacao da industria</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Para sistemas de pagamento em producao, Strangler Fig e quase universalmente recomendado. Big Bang
              falhou em multiplos projetos de core banking (famosos por estourar orcamento em 5-10x). Parallel
              Run e ideal para ledger e settlement onde voce precisa provar que o novo sistema produz resultados
              identicos antes de desligar o legado.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "strangler-fig",
      title: "Strangler Fig Pattern",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            O Strangler Fig Pattern (inspirado na figueira estranguladora que cresce ao redor de uma arvore
            hospedeira ate substitui-la) e a abordagem mais segura para modernizar sistemas legados criticos.
            A ideia: construir o novo sistema ao redor do legado, desviando trafego incrementalmente.
          </p>
          <div style={codeBlockStyle}>{`Strangler Fig — Evolucao em fases:

Fase 1: API Facade
  [Clientes] → [API Gateway / Facade] → [Sistema Legado]
  Nenhuma funcionalidade nova. Facade apenas roteia tudo ao legado.

Fase 2: Primeiro modulo migrado
  [Clientes] → [API Gateway] → [Novo: Onboarding Service]
                             → [Legado: tudo o resto]

Fase 3: Mais modulos migrados
  [Clientes] → [API Gateway] → [Novo: Onboarding]
                             → [Novo: Payments]
                             → [Novo: Notifications]
                             → [Legado: Ledger, Settlement]

Fase N: Legado desligado
  [Clientes] → [API Gateway] → [Todos os servicos novos]
  (legado descomissionado)`}</div>
          <p style={subheadingStyle}>Componentes-chave</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { comp: "API Facade", desc: "Camada que abstrai o legado atras de APIs modernas (REST/gRPC). Clientes so conhecem a facade. Permite trocar a implementacao atras sem afetar os consumidores." },
              { comp: "Event Bridge", desc: "Mecanismo para sincronizar dados entre legado e novo sistema. Pode ser CDC (Change Data Capture), event sourcing ou scheduled sync. Garante que ambos tem dados consistentes durante a transicao." },
              { comp: "Feature Flags", desc: "Controle granular de qual trafego vai para o legado vs novo sistema. Permite rollback instantaneo se o novo falhar. Permite migrar por merchant, por regiao, por porcentagem." },
              { comp: "Data Sync", desc: "Sincronizacao bidirecional de dados entre sistemas durante o periodo de coexistencia. Complexo e error-prone — exige reconciliacao continua e resolucao de conflitos." },
            ].map((item) => (
              <div key={item.comp} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>{item.comp}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "core-banking-migration",
      title: "Core Banking Migration",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Migrar core banking de mainframe para cloud-native e um dos projetos mais complexos e caros da industria
            financeira. Envolve mover o ledger (razao geral), motor de produtos (contas, cartoes, credito),
            processamento de transacoes e integracao com dezenas de sistemas adjacentes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "DBS Bank (Singapura)", emoji: "🇸🇬", desc: "Migrou de mainframe para plataforma cloud-native propria hospedada em AWS. Levou ~5 anos. Abordagem: construiu core banking novo em paralelo, migrou produtos um a um. Resultado: time-to-market de novos produtos caiu de meses para dias. Referencia global em migracao de core banking.", result: "5 anos, cloud-native on AWS, referencia global", color: "#22c55e" },
              { name: "BBVA (Espanha)", emoji: "🇪🇸", desc: "Investiu mais de 1 bilhao de euros em transformacao digital. Migrou core banking para plataforma Alnova (cloud-native). Abordagem mais agressiva que a maioria — reescreveu componentes significativos. Tornou-se referencia europeia em digital banking.", result: "EUR 1B+, plataforma Alnova, lider digital EU", color: "#3b82f6" },
              { name: "Commonwealth Bank (Australia)", emoji: "🇦🇺", desc: "Projeto de AUD 750M para substituir core banking por SAP. Um dos primeiros mega-projetos de core banking. Demorou mais que o planejado (5+ anos) e custou mais, mas o resultado transformou o banco no lider digital da Australia.", result: "AUD 750M, SAP core, 5+ anos", color: "#f59e0b" },
            ].map((item) => (
              <div key={item.name} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.8rem", color: item.color, fontWeight: 600 }}>{item.result}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "data-migration",
      title: "Data Migration",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Data migration e frequentemente o aspecto mais subestimado e o maior causador de falhas em projetos
            de modernizacao. Mover dados de um sistema legado (formato proprietario, charset EBCDIC, campos
            packed-decimal) para um sistema moderno (UTF-8, JSON, PostgreSQL) exige transformacao, validacao
            e reconciliacao em cada etapa.
          </p>
          <p style={subheadingStyle}>Fases da migracao de dados</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {[
              { step: "1. Discovery & profiling", desc: "Mapear todos os dados no legado: schemas, volumes, qualidade, dependencias. Ferramentas: Informatica, Talend. Descobrir: quais dados sao lixo? quais sao criticos? quais tem problemas de qualidade?" },
              { step: "2. Data quality remediation", desc: "Limpar dados antes de migrar: duplicatas, formatos inconsistentes, dados orfaos. Em core banking, e comum encontrar contas abertas ha 30 anos com enderecos invalidos e CPFs formatados de 5 formas diferentes." },
              { step: "3. Schema mapping", desc: "Mapear de-para: campo X no legado = campo Y no novo sistema. Nem sempre e 1:1 — um campo legado pode virar 3 campos, ou 3 campos podem virar 1. Documentar cada transformacao." },
              { step: "4. ETL (Extract, Transform, Load)", desc: "Extrair do legado, transformar (formatos, encoding, regras), carregar no novo. Para volumes grandes, pode levar horas/dias. Execucao em janelas de manutencao." },
              { step: "5. Validation & reconciliation", desc: "Comparar dados no legado vs novo: saldos batem? contagem de registros? checksums? Qualquer discrepancia deve ser investigada e corrigida ANTES do go-live." },
              { step: "6. Rollback strategy", desc: "Se a migracao falhar ou dados estiverem incorretos, como reverter? Manter o legado read-only durante a migracao. Backup completo antes de qualquer operacao destrutiva." },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0, minWidth: "1.25rem" }}>{item.step.charAt(0)}</span>
                <span style={{ color: "var(--foreground)" }}>
                  <strong>{item.step.substring(3)}:</strong>{" "}
                  <span style={{ color: "var(--text-secondary)" }}>{item.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "coexistencia",
      title: "Coexistencia Legacy + Modern",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Durante a migracao (que pode levar anos), legado e moderno coexistem. Gerenciar essa coexistencia
            e tao importante quanto construir o sistema novo. O Anti-Corruption Layer (ACL) e o padrao
            arquitetural que protege o sistema novo da &ldquo;contaminacao&rdquo; do legado.
          </p>
          <p style={subheadingStyle}>Anti-Corruption Layer (ACL)</p>
          <p style={paragraphStyle}>
            O ACL e uma camada que traduz entre o modelo do legado e o modelo do novo sistema. O novo sistema
            nunca fala diretamente com o legado — sempre passa pelo ACL. Isso isola o novo sistema dos formatos,
            protocolos e particularidades do legado (EBCDIC, packed decimal, campos de tamanho fixo, date formats
            peculiares).
          </p>
          <div style={codeBlockStyle}>{`Anti-Corruption Layer — Arquitetura:

[Novo Sistema (cloud-native)]
        |
  [Anti-Corruption Layer]
  - Traduz REST/JSON ↔ COBOL copybooks
  - Converte EBCDIC ↔ UTF-8
  - Mapeia domain models (new ↔ legacy)
  - Trata erros e retry
        |
  [Message Translation]
  - ISO 20022 ↔ formato proprietario
  - Event → batch file (para processos EOD)
        |
[Sistema Legado (mainframe)]`}</div>
          <p style={subheadingStyle}>Desafios de coexistencia</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { challenge: "Dual writes", desc: "Algumas operacoes precisam ser gravadas em ambos os sistemas. Se um falha e o outro nao, os dados ficam inconsistentes. Solucao: saga pattern com compensating transactions." },
              { challenge: "Data consistency", desc: "Enquanto ambos rodam, qual e a source of truth? Para cada entidade, definir claramente qual sistema e master. CDC (Change Data Capture) para propagar mudancas." },
              { challenge: "Routing decisions", desc: "Qual transacao vai para qual sistema? Feature flags por merchant, produto, regiao. Routing complexo pode gerar bugs sutis." },
            ].map((item) => (
              <div key={item.challenge} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>{item.challenge}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "case-studies",
      title: "Case Studies",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Tres abordagens radicalmente diferentes para lidar com legacy em pagamentos, cada uma com licoes valiosas.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              {
                name: "Nubank — Cloud-Native from Day 1",
                emoji: "🟣",
                approach: "Evitou o problema completamente. Construiu core banking 100% cloud-native desde o primeiro dia (2013). Stack: Clojure, Datomic, Kafka, AWS. Sem mainframe, sem COBOL, sem batch noturno.",
                lesson: "Para novos entrantes, comecar sem legacy e a maior vantagem competitiva. O Nubank processa milhoes de transacoes/dia em infraestrutura que custa uma fracao do mainframe de um banco tradicional.",
                result: "100M+ clientes, custo por cliente ~1/5 de banco tradicional",
                color: "#8b5cf6",
              },
              {
                name: "Itau — Gradual Modernization",
                emoji: "🟠",
                approach: "Estrategia de modernizacao incremental. Mantem mainframe para core banking mas construiu camadas modernas ao redor: iti (conta digital), Pix nativo em cloud, APIs sobre legado. Investimentos bilionarios em tecnologia nos ultimos 5 anos.",
                lesson: "Para bancos incumbentes, o strangler fig pattern e a abordagem mais pragmatica. Modernizar a periferia primeiro (canais digitais, APIs) e ir gradualmente substituindo o core.",
                result: "Banco mais valioso da America Latina, digital + legado coexistindo",
                color: "#f59e0b",
              },
              {
                name: "BBVA — Bold Migration",
                emoji: "🔵",
                approach: "Investiu EUR 1B+ para reescrever core banking. Plataforma Alnova: cloud-native, microservicos, API-first. Migracao pais a pais (comecando por mercados menores). Turkiye e Mexico como pilotos antes de Espanha.",
                lesson: "Para bancos que decidem reescrever, comecar por mercados menores para validar a plataforma antes de migrar o mercado principal. O investimento e enorme, mas o payoff em agilidade e time-to-market transforma o banco.",
                result: "Referencia europeia em digital banking, plataforma global",
                color: "#3b82f6",
              },
            ].map((item) => (
              <div key={item.name} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>
                  <strong style={{ color: "var(--foreground)" }}>Abordagem:</strong> {item.approach}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>
                  <strong style={{ color: "var(--primary)" }}>Licao:</strong> {item.lesson}
                </p>
                <p style={{ fontSize: "0.8rem", color: item.color, fontWeight: 600 }}>{item.result}</p>
              </div>
            ))}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              A verdade sobre migracao de legacy
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Nao existe bala de prata. Cada banco, processador ou adquirente deve avaliar sua situacao especifica:
              volume de transacoes, complexidade de produtos, restricoes regulatorias, orcamento disponivel e apetite
              de risco. O importante e comecar — a inacao e a opcao mais cara a longo prazo.
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Legacy Systems & Migracao</h1>
        <p className="page-description">
          Guia completo sobre sistemas legados em pagamentos: COBOL, mainframes, estrategias de migracao
          (strangler fig, big bang, parallel run), core banking migration e case studies reais.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>O que sao legacy systems, por que ainda existem e onde estao em pagamentos</li>
          <li>Riscos de manter legacy: technical debt, security, talent shortage, scalability</li>
          <li>Estrategias de migracao: big bang vs strangler fig vs parallel run</li>
          <li>Strangler Fig Pattern em detalhe: API facade, event bridge, feature flags</li>
          <li>Core banking migration: exemplos reais (DBS, BBVA, CBA)</li>
          <li>Data migration: ETL, quality, validation, reconciliation e rollback</li>
          <li>Case studies: Nubank (greenfield), Itau (gradual), BBVA (bold migration)</li>
        </ul>
      </div>

      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>3</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Estrategias</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>220B</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Linhas COBOL</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>3</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Cases Reais</div></div>
      </div>

      {sections.map((section, idx) => (
        <div key={section.id} className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`} style={sectionStyle}>
          <h2 style={headingStyle}><span style={{ minWidth: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0, background: "var(--primary)", color: "#fff", padding: "0 0.25rem" }}>{section.icon}</span>{section.title}</h2>
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
            { name: "ISO 20022 & SWIFT", href: "/knowledge/iso20022-swift" },
            { name: "Event Architecture", href: "/knowledge/event-architecture" },
            { name: "Operational Excellence", href: "/knowledge/operational-excellence" },
            { name: "Embedded Finance", href: "/knowledge/embedded-finance" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>{link.name}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
