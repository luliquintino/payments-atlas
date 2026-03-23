"use client";

import { useState } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

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
  padding: "1rem 1.25rem",
  borderRadius: 10,
  background: "#1e1e2e",
  border: "1px solid var(--border)",
  fontFamily: "monospace",
  fontSize: "0.8rem",
  color: "#cdd6f4",
  overflowX: "auto",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  lineHeight: 1.6,
  whiteSpace: "pre",
};

const warningBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(239,68,68,0.25)",
  background: "rgba(239,68,68,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PCICompliancePage() {
  const quiz = getQuizForPage("/knowledge/pci-compliance");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "o-que-e-pci",
      title: "O que e PCI DSS",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            PCI DSS (Payment Card Industry Data Security Standard) e o padrao global de seguranca
            criado pelo PCI Security Standards Council — consorcio formado por Visa, Mastercard,
            American Express, Discover e JCB. Qualquer entidade que armazena, processa ou transmite
            dados de cartao deve estar em conformidade.
          </p>
          <p style={paragraphStyle}>
            O padrao nao e uma lei, mas um requisito contratual imposto pelas bandeiras. Se voce
            processa pagamentos com cartao e nao esta em compliance, a adquirente pode aplicar multas,
            aumentar taxas ou encerrar o contrato. Em caso de breach, a responsabilidade financeira
            recai sobre a entidade nao-compliance.
          </p>
          <p style={subheadingStyle}>Niveis de Merchant</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Nivel</th>
                  <th style={thStyle}>Volume Anual (Visa)</th>
                  <th style={thStyle}>Validacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Level 1</td><td style={tdStyle}>&gt; 6 milhoes de txns</td><td style={tdStyle}>QSA on-site audit + ASV scan trimestral</td></tr>
                <tr><td style={tdStyle}>Level 2</td><td style={tdStyle}>1M - 6M txns</td><td style={tdStyle}>SAQ anual + ASV scan trimestral</td></tr>
                <tr><td style={tdStyle}>Level 3</td><td style={tdStyle}>20K - 1M txns e-commerce</td><td style={tdStyle}>SAQ anual + ASV scan trimestral</td></tr>
                <tr><td style={tdStyle}>Level 4</td><td style={tdStyle}>&lt; 20K e-commerce ou &lt; 1M outras</td><td style={tdStyle}>SAQ anual + ASV scan (recomendado)</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Na pratica
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              A maioria dos merchants brasileiros e Level 4 e usa SAQ A (pagina de pagamento hospedada
              pelo gateway). O custo de compliance sobe drasticamente a partir do Level 2, onde QSA
              audits custam entre R$80K e R$300K por ano.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "saq-matrix",
      title: "Matriz de Selecao de SAQ",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O SAQ (Self-Assessment Questionnaire) e o formulario que merchants e service providers
            preenchem para validar compliance. Escolher o SAQ correto e critico — usar o errado
            invalida todo o processo. A decisao depende de como o merchant interage com dados de
            cartao.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>SAQ</th>
                  <th style={thStyle}>Requisitos</th>
                  <th style={thStyle}>Caso de Uso</th>
                  <th style={thStyle}>Esforco</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>SAQ A</td>
                  <td style={tdStyle}>22</td>
                  <td style={tdStyle}>E-commerce com pagina totalmente terceirizada (iframe/redirect). Nenhum dado de cartao toca o servidor do merchant.</td>
                  <td style={{ ...tdStyle, color: "#10b981" }}>Baixo</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>SAQ A-EP</td>
                  <td style={tdStyle}>191</td>
                  <td style={tdStyle}>E-commerce onde o site controla o redirect para o payment page. JavaScript do merchant pode afetar a pagina de pagamento.</td>
                  <td style={{ ...tdStyle, color: "#f59e0b" }}>Medio-Alto</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>SAQ B</td>
                  <td style={tdStyle}>41</td>
                  <td style={tdStyle}>Terminais standalone de imprint ou dial-up. Sem armazenamento eletronico de dados de cartao.</td>
                  <td style={{ ...tdStyle, color: "#10b981" }}>Baixo</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>SAQ B-IP</td>
                  <td style={tdStyle}>82</td>
                  <td style={tdStyle}>Terminais PTS standalone conectados via IP. Sem armazenamento eletronico.</td>
                  <td style={{ ...tdStyle, color: "#f59e0b" }}>Medio</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>SAQ C</td>
                  <td style={tdStyle}>160</td>
                  <td style={tdStyle}>Aplicacao de pagamento conectada a internet. Sem armazenamento eletronico de dados de cartao.</td>
                  <td style={{ ...tdStyle, color: "#f59e0b" }}>Medio</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "var(--primary)" }}>SAQ C-VT</td>
                  <td style={tdStyle}>79</td>
                  <td style={tdStyle}>Virtual terminal via browser, digitacao manual. Uma transacao por vez, sem armazenamento.</td>
                  <td style={{ ...tdStyle, color: "#f59e0b" }}>Medio</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>SAQ D</td>
                  <td style={tdStyle}>329</td>
                  <td style={tdStyle}>Todos os outros cenarios. Merchant armazena, processa ou transmite dados de cartao diretamente.</td>
                  <td style={{ ...tdStyle, color: "#ef4444" }}>Muito Alto</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Arvore de Decisao</p>
          <div style={codeBlockStyle}>
{`Voce armazena/processa/transmite dados de cartao?
  |
  +-- NAO --> Pagina de pagamento e 100% hosted pelo PSP?
  |             |
  |             +-- SIM (iframe/redirect) --> SAQ A
  |             +-- NAO (JS controla redirect) --> SAQ A-EP
  |
  +-- SIM --> E terminal fisico?
                |
                +-- SIM --> Conectado via IP?
                |             |
                |             +-- SIM --> SAQ B-IP
                |             +-- NAO (dial-up/imprint) --> SAQ B
                |
                +-- NAO --> Virtual terminal (browser)?
                              |
                              +-- SIM --> SAQ C-VT
                              +-- NAO --> App de pagamento sem storage?
                                            |
                                            +-- SIM --> SAQ C
                                            +-- NAO --> SAQ D (full assessment)`}
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Erro comum em auditorias
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Merchants que usam tokenizacao client-side (como Stripe.js) frequentemente assumem que
              se qualificam para SAQ A, mas se o JavaScript do merchant pode manipular o DOM da pagina
              de pagamento, o SAQ correto e A-EP. A diferenca: 22 vs 191 requisitos.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "12-requirements",
      title: "12 Requisitos — Deep Dive",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            O PCI DSS e organizado em 6 objetivos e 12 requisitos. Cada requisito tem sub-requisitos
            detalhados com testing procedures especificos. Abaixo, cada requisito com abordagens
            praticas e armadilhas comuns em auditoria.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Req</th>
                  <th style={thStyle}>O que pede</th>
                  <th style={thStyle}>Implementacao tipica</th>
                  <th style={thStyle}>Falha comum em auditoria</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>1. Firewall</td>
                  <td style={tdStyle}>Instalar e manter configuracao de firewall para proteger dados de cartao</td>
                  <td style={tdStyle}>WAF (Cloudflare/AWS WAF), network segmentation, firewall rules documentadas</td>
                  <td style={tdStyle}>Regras any-any nao removidas, falta de review semestral das rules</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>2. Senhas padrao</td>
                  <td style={tdStyle}>Nao usar defaults de vendor para senhas e parametros de seguranca</td>
                  <td style={tdStyle}>Hardening guides (CIS Benchmarks), policy de senha forte, MFA</td>
                  <td style={tdStyle}>Contas de servico com senhas default, SNMP community strings</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>3. Proteger dados armazenados</td>
                  <td style={tdStyle}>Proteger dados de cartao armazenados — minimizar retencao, criptografar</td>
                  <td style={tdStyle}>Tokenizacao, AES-256 encryption, mascaramento (6 primeiros, 4 ultimos), data retention policy</td>
                  <td style={tdStyle}>PAN em logs, backups nao criptografados, retencao indefinida</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>4. Criptografia em transito</td>
                  <td style={tdStyle}>Criptografar transmissao de dados de cartao em redes abertas</td>
                  <td style={tdStyle}>TLS 1.2+, certificados validos, HSTS, eliminacao de SSL/TLS antigo</td>
                  <td style={tdStyle}>TLS 1.0 ainda habilitado, certificados self-signed em producao</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>5. Antimalware</td>
                  <td style={tdStyle}>Proteger todos os sistemas contra malware e atualizar antivirus regularmente</td>
                  <td style={tdStyle}>EDR (CrowdStrike/SentinelOne), atualizacoes automaticas, scan periodico</td>
                  <td style={tdStyle}>Servidores Linux sem avaliacao de risco para malware documentada</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>6. Sistemas seguros</td>
                  <td style={tdStyle}>Desenvolver e manter sistemas e aplicacoes seguros</td>
                  <td style={tdStyle}>SDLC seguro, code review, SAST/DAST, patching mensal, change management</td>
                  <td style={tdStyle}>Patches criticos nao aplicados em 30 dias, falta de processo formal de change</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>7. Acesso restrito</td>
                  <td style={tdStyle}>Restringir acesso a dados de cartao por necessidade de negocio (need-to-know)</td>
                  <td style={tdStyle}>RBAC, revisao trimestral de acessos, principio de menor privilegio</td>
                  <td style={tdStyle}>Acessos genericos compartilhados, falta de revisao periodica</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>8. Identificacao unica</td>
                  <td style={tdStyle}>Identificar e autenticar acesso a componentes do sistema</td>
                  <td style={tdStyle}>MFA obrigatorio, IDs unicos, password policy (12+ chars, complexidade), session timeout</td>
                  <td style={tdStyle}>Contas compartilhadas para acesso a producao, MFA nao implementado</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>9. Acesso fisico</td>
                  <td style={tdStyle}>Restringir acesso fisico a dados de cartao</td>
                  <td style={tdStyle}>Controles de data center (biometria, cameras, logs), visitor logs, destruicao segura de midia</td>
                  <td style={tdStyle}>Logs de visitante incompletos, falta de inventario de midia</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>10. Monitoramento</td>
                  <td style={tdStyle}>Rastrear e monitorar todo acesso a recursos de rede e dados de cartao</td>
                  <td style={tdStyle}>SIEM (Splunk/Datadog), audit logging, NTP sync, retencao 12 meses (3 meses online)</td>
                  <td style={tdStyle}>Logs sem timestamp sincronizado, retencao insuficiente, alertas nao configurados</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>11. Testes de seguranca</td>
                  <td style={tdStyle}>Testar regularmente sistemas e processos de seguranca</td>
                  <td style={tdStyle}>Pentest anual (interno/externo), ASV scan trimestral, IDS/IPS, FIM (file integrity monitoring)</td>
                  <td style={tdStyle}>Scan ASV com falhas nao remediadas, pentest sem re-test de findings</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>12. Politica de seguranca</td>
                  <td style={tdStyle}>Manter politica de seguranca da informacao para todo o pessoal</td>
                  <td style={tdStyle}>ISP documentada, security awareness training anual, incident response plan testado</td>
                  <td style={tdStyle}>Politica desatualizada, funcionarios sem treinamento registrado, IR plan nao testado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "audit-prep",
      title: "Checklist de Preparacao para Auditoria",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            A preparacao para uma auditoria PCI DSS (seja via QSA on-site ou SAQ) exige organizacao
            antecipada. QSAs experientes dizem que 70% das falhas de auditoria vem de falta de
            documentacao, nao de falhas tecnicas.
          </p>
          <p style={subheadingStyle}>Timeline Recomendada</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Prazo</th>
                  <th style={thStyle}>Atividade</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>6 meses antes</td><td style={tdStyle}>Gap assessment inicial, identificar scope, contratar QSA (se Level 1/2)</td></tr>
                <tr><td style={tdStyle}>4 meses antes</td><td style={tdStyle}>Remediar gaps identificados, atualizar politicas, treinar equipe</td></tr>
                <tr><td style={tdStyle}>3 meses antes</td><td style={tdStyle}>ASV scan trimestral, pentest interno e externo</td></tr>
                <tr><td style={tdStyle}>2 meses antes</td><td style={tdStyle}>Review de documentacao, evidencias de controles, dry-run interno</td></tr>
                <tr><td style={tdStyle}>1 mes antes</td><td style={tdStyle}>Segundo ASV scan (se primeiro falhou), ultimos ajustes</td></tr>
                <tr><td style={tdStyle}>Auditoria</td><td style={tdStyle}>QSA on-site (5-15 dias uteis dependendo do scope)</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Tipos de Evidencia Esperados</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Categoria</th>
                  <th style={thStyle}>Exemplos</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Documentacao</td><td style={tdStyle}>Politicas de seguranca, network diagrams, data flow diagrams, inventario de ativos</td></tr>
                <tr><td style={tdStyle}>Screenshots</td><td style={tdStyle}>Configuracoes de firewall, RBAC configs, encryption settings, MFA enforcement</td></tr>
                <tr><td style={tdStyle}>Logs</td><td style={tdStyle}>Audit trails, access reviews, change management records, training completion</td></tr>
                <tr><td style={tdStyle}>Reports</td><td style={tdStyle}>ASV scan reports, pentest reports, vulnerability scan results, risk assessments</td></tr>
                <tr><td style={tdStyle}>Processos</td><td style={tdStyle}>Incident response runbooks, BCP/DR plans, secure coding guidelines</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Dica de QSA
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Mantenha um &quot;evidence locker&quot; — repositorio centralizado com todas as evidencias
              organizadas por requisito. Use nomes padrao como &quot;R3.4-encryption-config-2025.pdf&quot;.
              Isso reduz o tempo de auditoria em 30-40%.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "v4-changes",
      title: "PCI DSS v4.0 — Mudancas Chave",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            A versao 4.0 do PCI DSS foi publicada em marco de 2022. A v3.2.1 foi aposentada em
            31 de marco de 2024. Os requisitos &quot;future-dated&quot; da v4.0 tornaram-se obrigatorios em
            31 de marco de 2025, exigindo que todas as entidades estejam em total conformidade.
          </p>
          <p style={subheadingStyle}>Principais Diferencas v3.2.1 → v4.0</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Area</th>
                  <th style={thStyle}>v3.2.1</th>
                  <th style={thStyle}>v4.0</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Abordagem</td>
                  <td style={tdStyle}>Prescritiva (faça exatamente X)</td>
                  <td style={tdStyle}>Customized Approach — permite controles alternativos se atingem o objetivo</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Autenticacao</td>
                  <td style={tdStyle}>MFA para acesso remoto</td>
                  <td style={tdStyle}>MFA para TODOS os acessos ao CDE (Cardholder Data Environment)</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Senhas</td>
                  <td style={tdStyle}>Minimo 7 caracteres</td>
                  <td style={tdStyle}>Minimo 12 caracteres (ou 8 se sistema nao suporta 12)</td>
                </tr>
                <tr>
                  <td style={tdStyle}>E-commerce</td>
                  <td style={tdStyle}>Sem requisito especifico para scripts</td>
                  <td style={tdStyle}>Req 6.4.3: Inventario e autorizacao de todos os scripts na payment page</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Headers HTTP</td>
                  <td style={tdStyle}>Nao especificado</td>
                  <td style={tdStyle}>Req 11.6.1: Monitoramento de HTTP headers e scripts (change detection)</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Risk Assessment</td>
                  <td style={tdStyle}>Anual, generico</td>
                  <td style={tdStyle}>Targeted Risk Analysis — analise especifica por requisito</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Logs</td>
                  <td style={tdStyle}>Revisao diaria de logs</td>
                  <td style={tdStyle}>Mecanismos automatizados de deteccao de anomalias (SIEM obrigatorio na pratica)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Requisito 6.4.3 — Impacto para E-commerce
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Este requisito exige que TODOS os scripts executados na payment page sejam inventariados,
              autorizados e monitorados para integridade. Isso inclui Google Analytics, chat widgets,
              A/B testing tools. Na pratica, requer implementacao de Content Security Policy (CSP) e
              Subresource Integrity (SRI). Merchants que usam muitos third-party scripts terão trabalho
              significativo para atender este requisito.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "encryption",
      title: "Criptografia e Key Management",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            O PCI DSS exige protecao criptografica de dados de cartao tanto em repouso (at rest)
            quanto em transito (in transit). A escolha do algoritmo, o tamanho da chave e o processo
            de gerenciamento de chaves sao pontos criticos de auditoria.
          </p>
          <p style={subheadingStyle}>Algoritmos Aceitos</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Algoritmo</th>
                  <th style={thStyle}>Uso</th>
                  <th style={thStyle}>Tamanho Chave</th>
                  <th style={thStyle}>Notas</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>AES-256</td><td style={tdStyle}>Criptografia simetrica (dados em repouso)</td><td style={tdStyle}>256 bits</td><td style={tdStyle}>Padrao de mercado para PAN encryption</td></tr>
                <tr><td style={tdStyle}>AES-128</td><td style={tdStyle}>Criptografia simetrica (alternativa)</td><td style={tdStyle}>128 bits</td><td style={tdStyle}>Aceito, mas AES-256 e preferido</td></tr>
                <tr><td style={tdStyle}>RSA</td><td style={tdStyle}>Criptografia assimetrica (troca de chaves)</td><td style={tdStyle}>2048+ bits</td><td style={tdStyle}>Usado para key exchange, assinaturas digitais</td></tr>
                <tr><td style={tdStyle}>TLS 1.2/1.3</td><td style={tdStyle}>Criptografia em transito</td><td style={tdStyle}>Varia</td><td style={tdStyle}>TLS 1.0/1.1 proibidos desde 2018</td></tr>
                <tr><td style={tdStyle}>DUKPT</td><td style={tdStyle}>Terminais POS (derived unique key per transaction)</td><td style={tdStyle}>Derivada</td><td style={tdStyle}>Cada transacao usa chave unica derivada</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Key Management Lifecycle</p>
          <div style={codeBlockStyle}>
{`Key Lifecycle:

1. GERACAO     ─→ HSM (Hardware Security Module) ou key ceremony com dual control
2. DISTRIBUICAO ─→ Key wrapping, nunca em clear text, split knowledge
3. ARMAZENAMENTO ─→ HSM ou encrypted key store, nunca junto com dados
4. ROTACAO     ─→ Anual (minimo) ou ao comprometimento suspeito
5. REVOGACAO   ─→ Quando comprometida ou ao fim da vida util
6. DESTRUICAO  ─→ Crypto-shredding, zeroization, destruicao fisica

Dual Control: nenhuma pessoa possui a chave completa
Split Knowledge: a chave e dividida em componentes (2 de 3, 3 de 5)`}
          </div>
          <p style={subheadingStyle}>HSM (Hardware Security Module)</p>
          <p style={paragraphStyle}>
            HSMs sao dispositivos fisicos tamper-resistant que geram, armazenam e operam chaves
            criptograficas sem que a chave jamais saia do hardware em texto claro. Para PCI Level 1,
            o uso de HSM e praticamente obrigatorio. Cloud HSMs (AWS CloudHSM, Azure Dedicated HSM)
            sao aceitos se atendem FIPS 140-2 Level 3.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Custo de referencia
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              HSM fisico (Thales Luna, Utimaco): USD 20K-50K por unidade. AWS CloudHSM: ~USD 1.50/hora
              (~USD 1.100/mes). Para startups, key management via AWS KMS com envelope encryption
              e uma alternativa mais acessivel (centavos por operacao), aceita para SAQ A-EP.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "cost-noncompliance",
      title: "Custo da Nao-Compliance",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            O custo de nao estar em compliance com PCI DSS vai muito alem das multas diretas.
            Envolve penalidades contratuais, custos de remediacao pos-breach, perda de receita
            e dano reputacional que pode levar anos para recuperar.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Impacto</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Custo Estimado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Multas das bandeiras</td>
                  <td style={tdStyle}>Visa/Mastercard aplicam multas mensais crescentes a adquirentes de merchants nao-compliance</td>
                  <td style={tdStyle}>USD 5K-100K/mes</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Custo de breach</td>
                  <td style={tdStyle}>Forensic investigation (PFI), notificacao, monitoramento de credito, re-emissao de cartoes</td>
                  <td style={tdStyle}>USD 50-150 por cartao comprometido</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Liability shift</td>
                  <td style={tdStyle}>Merchant nao-compliance assume 100% do fraud liability em caso de breach</td>
                  <td style={tdStyle}>Variavel (potencialmente milhoes)</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Aumento de taxas</td>
                  <td style={tdStyle}>Adquirente aumenta MDR ou adiciona surcharge para compensar risco</td>
                  <td style={tdStyle}>+0.5% a +2% sobre MDR</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Perda de processamento</td>
                  <td style={tdStyle}>Adquirente pode rescindir contrato, merchant perde capacidade de aceitar cartoes</td>
                  <td style={tdStyle}>Perda total de receita via cartao</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Dano reputacional</td>
                  <td style={tdStyle}>Perda de confianca do consumidor, cobertura negativa na midia</td>
                  <td style={tdStyle}>Incalculavel (reducao de 20-30% em vendas por meses)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Caso real (anonimizado)
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Uma fintech brasileira de medio porte sofreu um breach que expôs 80K PANs. O custo
              total incluiu: PFI (R$200K), re-emissao de cartoes (R$640K cobrado pelos emissores),
              multa Visa (R$150K), multa Mastercard (R$120K), perda de receita durante investigacao
              (R$800K em 3 meses), e custo de remediacao tecnica (R$500K). Total: ~R$2.4M, alem de
              ter sido rebaixada para monitoramento especial por 18 meses.
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
          PCI Compliance Roadmap
        </h1>
        <p className="page-description">
          Guia completo de PCI DSS: niveis de compliance, selecao de SAQ, os 12 requisitos,
          preparacao para auditoria, v4.0, criptografia e o custo de nao-compliance.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Como selecionar o SAQ correto para seu modelo de negocio</li>
          <li>Os 12 requisitos do PCI DSS com abordagens praticas e falhas comuns</li>
          <li>Mudancas criticas da v4.0 e como se preparar para auditoria</li>
          <li>Criptografia, key management e o impacto financeiro da nao-compliance</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>7</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>12</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Requisitos</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>7</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tipos SAQ</div>
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
