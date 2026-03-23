"use client";

import { useState } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

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

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

export default function HsmCryptographyPage() {
  const quiz = getQuizForPage("/knowledge/hsm-cryptography");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "o-que-e-hsm",
      title: "O que e HSM — Hardware Security Module",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Um HSM (Hardware Security Module) e um dispositivo fisico dedicado a proteger e gerenciar chaves
            criptograficas. Em pagamentos, HSMs sao a ancora de confianca de toda a cadeia: geram, armazenam
            e executam operacoes criptograficas sem nunca expor as chaves em texto claro. O hardware e projetado
            para ser tamper-resistant — qualquer tentativa de abertura fisica apaga automaticamente as chaves.
          </p>
          <p style={paragraphStyle}>
            A certificacao FIPS 140-2 Level 3 e o padrao minimo exigido pela industria de pagamentos. Ela garante
            que o dispositivo possui mecanismos fisicos de protecao contra tamper (epoxy, mesh de deteccao, sensores
            de temperatura/voltagem) e que as chaves sao zeradas se qualquer violacao for detectada. Level 4 adiciona
            protecao contra ataques ambientais (variacao de temperatura, voltagem), mas e raro em producao.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Nivel FIPS</th>
                  <th style={thStyle}>Protecao</th>
                  <th style={thStyle}>Uso Tipico</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Level 1</td>
                  <td style={tdStyle}>Algoritmo aprovado, sem protecao fisica</td>
                  <td style={tdStyle}>Software crypto em ambientes seguros</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Level 2</td>
                  <td style={tdStyle}>Tamper-evidence (selos visiveis)</td>
                  <td style={tdStyle}>Ambientes controlados, data centers</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Level 3</td>
                  <td style={tdStyle}>Tamper-resistant (deteccao + resposta ativa)</td>
                  <td style={tdStyle}>Pagamentos, bancos, adquirentes — padrao da industria</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Level 4</td>
                  <td style={tdStyle}>Protecao ambiental completa</td>
                  <td style={tdStyle}>Militar, governo — raro em pagamentos</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Por que software crypto nao basta?
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Chaves em memoria de um servidor convencional podem ser extraidas via memory dump, cold boot attack,
              ou side-channel attack. HSMs garantem que a chave nunca sai do hardware — operacoes criptograficas
              sao executadas dentro do modulo e apenas o resultado e retornado. Isso e fundamental para PCI DSS e PCI PIN.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "arquitetura-hsm",
      title: "Arquitetura de HSM",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Existem tres modelos principais de deploy de HSM, cada um com trade-offs entre controle, custo e
            latencia. A escolha depende do volume de transacoes, requisitos regulatorios e estrategia de cloud.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              {
                name: "Network HSM (On-Premise)",
                emoji: "🏢",
                desc: "Appliance fisico instalado no data center. Conexao via TCP/IP. Latencia minima (~1ms). Controle total sobre key ceremonies. Custo alto de aquisicao (US$ 30-100k por unidade) + manutencao. Vendors: Thales Luna Network HSM 7, Utimaco SecurityServer, Futurex.",
                pros: "Latencia minima, controle total, compliance simplificado",
                cons: "Capex alto, precisa de equipe especializada, disaster recovery complexo",
              },
              {
                name: "Cloud HSM",
                emoji: "☁️",
                desc: "HSM dedicado hospedado pelo cloud provider. O hardware e exclusivo do cliente, mas gerenciado pela infra do provider. AWS CloudHSM (Cavium/Marvell), Azure Dedicated HSM (Thales Luna), GCP Cloud HSM (Marvell). Custo: ~US$ 1.50/hora por instancia.",
                pros: "Sem capex, escalabilidade, DR automatico, latencia baixa intra-region",
                cons: "Dependencia do provider, latencia cross-region, compliance pode exigir audit do provider",
              },
              {
                name: "HSM-as-a-Service (Multi-Tenant)",
                emoji: "🔐",
                desc: "HSM compartilhado entre multiplos clientes com isolamento logico. AWS KMS, Azure Key Vault, GCP KMS. Menor custo, mas menor controle. Adequado para tokenizacao e encryption geral, mas pode nao atender PCI PIN para alguns cenarios.",
                pros: "Custo minimo (~US$ 1/key/mes), totalmente gerenciado, integrado ao ecossistema cloud",
                cons: "Shared hardware, menos controle sobre key ceremonies, pode nao atender PCI PIN",
              },
            ].map((item) => (
              <div key={item.name} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>
                  {item.desc}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "#22c55e" }}>Pros:</strong> {item.pros}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "#ef4444" }}>Contras:</strong> {item.cons}
                </p>
              </div>
            ))}
          </div>
          <div style={codeBlockStyle}>{`Arquitetura tipica de HSM em adquirente:

[POS Terminal] --TLS--> [Front-End Server]
                              |
                        [HSM Cluster] <-- PIN Translation, MAC Verification
                              |
                        [Host Application]
                              |
                  [Network HSM Pool] <-- Key Management, Digital Signatures
                              |
                    [Bandeira/Issuer]`}</div>
        </>
      ),
    },
    {
      id: "pin-block",
      title: "PIN Block Management",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            O PIN Block e o formato padronizado para criptografar e transportar o PIN do portador do cartao
            de forma segura. O PIN nunca trafega em texto claro — ele e combinado com dados do cartao (PAN)
            para gerar um bloco criptografado de 8 bytes que e traduzido (re-encrypted) a cada hop da cadeia.
          </p>
          <p style={subheadingStyle}>Formatos de PIN Block</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Formato</th>
                  <th style={thStyle}>Nome</th>
                  <th style={thStyle}>Construcao</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>ISO 9564-1 Format 0</td>
                  <td style={tdStyle}>ISO 0</td>
                  <td style={tdStyle}>PIN XOR com PAN (12 digitos do PAN right-justified)</td>
                  <td style={tdStyle}>Mais usado, sendo depreciado</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>ISO 9564-1 Format 1</td>
                  <td style={tdStyle}>ISO 1</td>
                  <td style={tdStyle}>PIN + padding aleatorio (nao usa PAN)</td>
                  <td style={tdStyle}>Usado em PIN change</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>ISO 9564-1 Format 3</td>
                  <td style={tdStyle}>ISO 3</td>
                  <td style={tdStyle}>Similar ao Format 0, mas com random fill</td>
                  <td style={tdStyle}>Mais seguro que ISO 0</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>ISO 9564-1 Format 4</td>
                  <td style={tdStyle}>ISO 4</td>
                  <td style={tdStyle}>16 bytes, usa AES, inclui PAN binding</td>
                  <td style={tdStyle}>Recomendado — futuro padrao</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>PIN Translation</p>
          <p style={paragraphStyle}>
            Quando uma transacao atravessa multiplas entidades (terminal → acquirer → network → issuer),
            o PIN block precisa ser &ldquo;traduzido&rdquo; a cada hop — decifrado com a chave do remetente e
            re-cifrado com a chave do destinatario. Essa operacao acontece dentro do HSM, garantindo que o
            PIN nunca exista em texto claro fora do hardware seguro.
          </p>
          <div style={codeBlockStyle}>{`PIN Translation Flow:

Terminal encrypts:  PIN + PAN → PIN Block (encrypted with ZPK_terminal)
                         |
Acquirer HSM:       Decrypt(ZPK_terminal) → Re-encrypt(ZPK_network)
                         |                   [PIN in clear ONLY inside HSM]
Network HSM:        Decrypt(ZPK_network) → Re-encrypt(ZPK_issuer)
                         |
Issuer HSM:         Decrypt(ZPK_issuer) → Verify PIN vs stored reference

ZPK = Zone PIN Key (symmetric key shared between two entities)`}</div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Zone PIN Key (ZPK) vs Zone Master Key (ZMK)
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              ZPK e a chave usada para criptografar PIN blocks entre duas entidades. Ela e trocada regularmente
              (a cada sessao ou periodo). ZMK (Zone Master Key) e a chave usada para proteger a troca de ZPKs —
              e a chave que criptografa chaves. A ZMK e injetada fisicamente via key ceremony.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "key-management",
      title: "Key Management",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Gerenciamento de chaves e a disciplina mais critica em criptografia de pagamentos. Uma chave comprometida
            pode expor milhoes de transacoes. A hierarquia de chaves segue um modelo em camadas onde chaves de nivel
            superior protegem as de nivel inferior.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Chave</th>
                  <th style={thStyle}>Sigla</th>
                  <th style={thStyle}>Proposito</th>
                  <th style={thStyle}>Troca</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: "Master Key (LMK)", sigla: "LMK", prop: "Chave raiz do HSM. Protege todas as outras chaves armazenadas.", troca: "Nunca (ou raramente, via key ceremony)" },
                  { key: "Zone Master Key", sigla: "ZMK", prop: "Protege a troca de chaves entre entidades. Criptografa ZPKs.", troca: "Anual (via key ceremony fisica)" },
                  { key: "Zone PIN Key", sigla: "ZPK", prop: "Criptografa PIN blocks entre duas entidades.", troca: "Diaria ou por sessao" },
                  { key: "Key Encrypting Key", sigla: "KEK", prop: "Criptografa outras chaves durante transporte e armazenamento.", troca: "Periodica" },
                  { key: "Terminal Master Key", sigla: "TMK", prop: "Chave raiz de cada terminal POS.", troca: "Na instalacao + periodica" },
                  { key: "Terminal PIN Key", sigla: "TPK", prop: "Derivada do TMK, usada para criptografar PIN no terminal.", troca: "A cada sessao" },
                  { key: "DUKPT Initial Key", sigla: "IPEK/BDK", prop: "Base Derivation Key gera chaves unicas por transacao.", troca: "BDK: nunca exposta. IPEK: na injecao" },
                ].map((row) => (
                  <tr key={row.sigla}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.key}</td>
                    <td style={tdStyle}><span style={tagStyle}>{row.sigla}</span></td>
                    <td style={tdStyle}>{row.prop}</td>
                    <td style={tdStyle}>{row.troca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>DUKPT (Derived Unique Key Per Transaction)</p>
          <p style={paragraphStyle}>
            DUKPT e o esquema mais seguro para terminais POS. A partir de uma Base Derivation Key (BDK) armazenada
            exclusivamente no HSM do acquirer, uma Initial PIN Encryption Key (IPEK) e derivada e injetada no terminal.
            A cada transacao, o terminal deriva uma chave unica usando um contador (Key Serial Number / KSN).
            Mesmo que um atacante capture uma chave de transacao, nao consegue derivar chaves passadas ou futuras
            (forward secrecy). Apos ~1 milhao de transacoes, o terminal precisa ser re-injetado.
          </p>
          <p style={subheadingStyle}>Key Injection</p>
          <p style={paragraphStyle}>
            Key injection e o processo de carregar chaves criptograficas em terminais ou HSMs. Existem dois metodos:
            injecao fisica (um operador conecta o terminal a um dispositivo de injecao em sala segura) e injecao
            remota (Remote Key Injection / RKI), onde chaves sao distribuidas via canal seguro usando chaves de
            transporte. RKI e essencial para escala — injetar fisicamente milhares de terminais e inviavel.
          </p>
        </>
      ),
    },
    {
      id: "criptografia-pagamentos",
      title: "Criptografia em Pagamentos",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Diferentes algoritmos criptograficos sao usados em diferentes pontos da cadeia de pagamentos.
            A escolha depende do tipo de operacao (encryption, signing, key exchange), performance
            requirements e compatibilidade com sistemas legados.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Algoritmo</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Uso em Pagamentos</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>3DES (Triple DES)</td>
                  <td style={tdStyle}>Simetrico, 112-168 bits</td>
                  <td style={tdStyle}>PIN encryption, MAC generation, key wrapping (legacy)</td>
                  <td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Depreciado — migrar para AES</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>AES-128/256</td>
                  <td style={tdStyle}>Simetrico, 128/256 bits</td>
                  <td style={tdStyle}>PIN Block Format 4, P2PE, data encryption, tokenization</td>
                  <td style={{ ...tdStyle, color: "#22c55e", fontWeight: 600 }}>Padrao atual e futuro</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>RSA-2048/4096</td>
                  <td style={tdStyle}>Assimetrico</td>
                  <td style={tdStyle}>Digital signatures, key exchange, certificate management, TLS</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Em uso, migrando para ECC</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>ECC (P-256, P-384)</td>
                  <td style={tdStyle}>Assimetrico (curvas elipticas)</td>
                  <td style={tdStyle}>EMV chip cryptograms, contactless, mobile payments, TLS 1.3</td>
                  <td style={{ ...tdStyle, color: "#22c55e", fontWeight: 600 }}>Padrao emergente</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>SHA-256/SHA-3</td>
                  <td style={tdStyle}>Hash</td>
                  <td style={tdStyle}>Message integrity, HMAC, password hashing, blockchain</td>
                  <td style={{ ...tdStyle, color: "#22c55e", fontWeight: 600 }}>Padrao</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Timeline de depreciacao do 3DES
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              NIST depreciou 3DES em 2023 e planeja proibicao total ate 2028. As bandeiras (Visa, Mastercard) exigem
              migracao de PIN blocks para AES (Format 4) ate 2025. Adquirentes e processadores que ainda usam 3DES
              para PIN translation devem migrar seus HSMs e chaves para suportar AES. Essa migracao e um dos
              maiores projetos de infraestrutura da industria atualmente.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "p2pe",
      title: "P2PE — Point-to-Point Encryption",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            P2PE (Point-to-Point Encryption) e uma solucao que criptografa os dados do cartao no instante da
            leitura (no terminal/POS) e so decifra no HSM do processador/acquirer. Os dados trafegam criptografados
            por toda a cadeia intermediaria, tornando-os inuteis para qualquer atacante que intercepte o trafego.
          </p>
          <p style={subheadingStyle}>Como funciona</p>
          <div style={codeBlockStyle}>{`P2PE Data Flow:

[Cartao] → [Leitor EMV/NFC no Terminal]
                |
           Encryption (AES-256 / DUKPT)
                |
           Dados criptografados
                |
    [Comerciante] → [Gateway] → [Acquirer]
    (dados sao cifrados - ninguem consegue ler)
                |
           [HSM do Processador]
                |
           Decryption → Dados em claro
                |
           [Processamento normal]`}</div>
          <p style={subheadingStyle}>Beneficios para PCI DSS</p>
          <p style={paragraphStyle}>
            O maior beneficio de P2PE e a reducao drastica do escopo PCI do comerciante. Com uma solucao P2PE
            validada pelo PCI SSC, o comerciante nao manipula dados de cartao em claro — apenas transita dados
            criptografados. Isso pode reduzir o questionario de autoavaliacao (SAQ) de ~300 controles (SAQ D)
            para ~30 controles (SAQ P2PE). Reducao de custo e complexidade de compliance estimada em 60-80%.
          </p>
          <p style={subheadingStyle}>Chain of Custody</p>
          <p style={paragraphStyle}>
            Para ser certificada como P2PE pelo PCI Council, a solucao deve demonstrar chain of custody completa:
            rastreamento de cada terminal desde a fabricacao, injecao de chaves em ambiente seguro, transporte
            seguro, instalacao controlada, e monitoramento contínuo. Qualquer quebra na cadeia invalida a certificacao.
            Vendors P2PE certificados incluem Verifone, Ingenico, Bluefin, e Adyen.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              P2PE vs E2EE
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              E2EE (End-to-End Encryption) e o conceito generico de criptografia ponta-a-ponta. P2PE e a
              implementacao especifica certificada pelo PCI SSC para pagamentos com cartao. A principal diferenca
              e que P2PE exige validacao formal, chain of custody documentada e key management auditado. Uma
              solucao E2EE nao certificada pode ser tecnicamente segura, mas nao reduz o escopo PCI do merchant.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "tokenizacao-criptografica",
      title: "Tokenizacao Criptografica",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Tokenizacao substitui dados sensiveis (como o PAN do cartao) por um token — um valor substituto que
            nao tem relacao matematica com o dado original. Diferente da criptografia (que e reversivel com a chave),
            a tokenizacao de vault nao e reversivel sem acesso ao vault database.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Vault-Based</th>
                  <th style={thStyle}>Vaultless (FPE)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Mecanismo</td>
                  <td style={tdStyle}>Tabela de mapeamento token ↔ PAN em banco de dados seguro</td>
                  <td style={tdStyle}>Format-Preserving Encryption (AES-FF1 ou AES-FF3-1)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Reversibilidade</td>
                  <td style={tdStyle}>Lookup no vault — precisa do banco de dados</td>
                  <td style={tdStyle}>Decryption com a chave — matematicamente reversivel</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Formato do token</td>
                  <td style={tdStyle}>Pode manter formato (16 digitos) ou usar formato diferente</td>
                  <td style={tdStyle}>Mesmo formato que o input (16 digitos, Luhn-valid)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Performance</td>
                  <td style={tdStyle}>Depende da latencia do vault DB (tipico: 2-5ms)</td>
                  <td style={tdStyle}>Operacao criptografica pura (sub-ms)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Escalabilidade</td>
                  <td style={tdStyle}>Vault pode ser gargalo em alto volume</td>
                  <td style={tdStyle}>Altamente escalavel (stateless)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>PCI Scope</td>
                  <td style={tdStyle}>Token fora do escopo se vault segregado</td>
                  <td style={tdStyle}>Discutivel — depende de interpretacao QSA</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Network Tokenization (Visa/Mastercard)</p>
          <p style={paragraphStyle}>
            Diferente da tokenizacao de vault (feita pelo PSP ou merchant), network tokenization e provida
            pelas proprias bandeiras (Visa VTS, Mastercard MDES, Amex tokens). O PAN real e substituido por
            um token da bandeira que e vinculado ao dispositivo ou comerciante. Beneficios: melhor taxa de
            aprovacao (issuers confiam mais em tokens da rede), atualizacao automatica quando o cartao
            expira (Account Updater), e escopo PCI reduzido para o merchant.
          </p>
        </>
      ),
    },
    {
      id: "digital-signatures",
      title: "Digital Signatures em Pagamentos",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Assinaturas digitais garantem autenticidade, integridade e nao-repudio de transacoes financeiras.
            O remetente assina a mensagem com sua chave privada (armazenada no HSM); o destinatario verifica
            com a chave publica. Se um unico bit da mensagem mudar, a verificacao falha.
          </p>
          <p style={subheadingStyle}>Aplicacoes em pagamentos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { use: "Transaction signing", desc: "Mensagens ISO 8583/20022 assinadas no HSM para garantir integridade entre acquirer e rede." },
              { use: "EMV chip cryptograms", desc: "ARQC/TC gerados pelo chip do cartao usando chaves derivadas — provam autenticidade do cartao fisico." },
              { use: "3D Secure", desc: "Autenticacao de transacoes e-commerce. Issuer assina o resultado de autenticacao (CAVV)." },
              { use: "API authentication", desc: "Requests de API assinados (HMAC-SHA256) para garantir que o caller e legitimo e a mensagem nao foi alterada." },
              { use: "Pix (SPI)", desc: "Mensagens ISO 20022 do SPI sao assinadas digitalmente. Certificados ICP-Brasil para assinatura." },
              { use: "Code signing", desc: "Firmware de terminais POS assinado pelo fabricante. Terminal verifica assinatura antes de instalar update." },
            ].map((item) => (
              <div key={item.use} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0 }}>-</span>
                <span style={{ color: "var(--foreground)" }}>
                  <strong>{item.use}:</strong>{" "}
                  <span style={{ color: "var(--text-secondary)" }}>{item.desc}</span>
                </span>
              </div>
            ))}
          </div>
          <p style={subheadingStyle}>PKI Infrastructure</p>
          <p style={paragraphStyle}>
            A PKI (Public Key Infrastructure) em pagamentos e hierarquica: uma Certificate Authority (CA) raiz
            (como a da bandeira ou do BCB) assina certificados intermediarios, que assinam certificados de entidade
            final. No Brasil, o Pix utiliza certificados ICP-Brasil para assinatura de mensagens. Cada PSP
            participante deve ter seu certificado emitido por CA autorizada pelo BCB.
          </p>
          <div style={codeBlockStyle}>{`Hierarquia PKI tipica em pagamentos:

Root CA (Bandeira/BCB)
  |
  +-- Intermediate CA (Processador/Rede)
        |
        +-- End Entity Cert (Adquirente)
        |     - Usado para assinar transacoes
        |     - Armazenado no HSM
        |     - Validade: 1-2 anos
        |
        +-- End Entity Cert (PSP Pix)
              - Assinatura de mensagens SPI
              - ICP-Brasil A1 ou A3
              - Renovacao antes do vencimento`}</div>
        </>
      ),
    },
    {
      id: "compliance-auditing",
      title: "Compliance & Auditing",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            A seguranca criptografica em pagamentos e rigorosamente regulamentada. Nao basta ter bons algoritmos —
            e necessario provar que os processos de gerenciamento de chaves sao seguros, auditaveis e seguem
            padroes reconhecidos pela industria.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Padrao</th>
                  <th style={thStyle}>Escopo</th>
                  <th style={thStyle}>Quem precisa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>PCI PIN Security</td>
                  <td style={tdStyle}>Protecao de PIN: HSM, key management, PIN translation, terminal management</td>
                  <td style={tdStyle}>Adquirentes, processadores, redes</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>PCI PTS (PIN Transaction Security)</td>
                  <td style={tdStyle}>Seguranca fisica e logica de terminais de pagamento</td>
                  <td style={tdStyle}>Fabricantes de terminais, adquirentes</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>TR-39 (ANSI)</td>
                  <td style={tdStyle}>Gerenciamento de chaves criptograficas para retail banking</td>
                  <td style={tdStyle}>Bancos, processadores, adquirentes</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>PCI P2PE</td>
                  <td style={tdStyle}>Validacao de solucoes de criptografia ponta-a-ponta</td>
                  <td style={tdStyle}>Vendors de solucoes P2PE</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>FIPS 140-2/3</td>
                  <td style={tdStyle}>Certificacao do hardware criptografico (HSM)</td>
                  <td style={tdStyle}>Fabricantes de HSM</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Key Ceremony</p>
          <p style={paragraphStyle}>
            Key ceremony e o processo formal de geracao, armazenamento ou troca de chaves mestras (LMK, ZMK).
            E realizada em sala segura com controles rigorosos: presenca de dois ou mais custodians (dual control),
            split knowledge (nenhuma pessoa conhece a chave completa), registro em video, testemunhas independentes,
            e log assinado de cada etapa. As chaves sao divididas em componentes (tipicamente 3) usando XOR —
            cada custodiante recebe um componente em um smart card ou papel lacrado.
          </p>
          <p style={subheadingStyle}>Dual Control & Split Knowledge</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { principle: "Dual Control", desc: "Nenhuma acao critica pode ser executada por uma unica pessoa. Key loading, HSM initialization e firmware updates exigem minimo 2 operadores." },
              { principle: "Split Knowledge", desc: "Nenhuma pessoa conhece a chave completa. A chave e dividida em N componentes (tipicamente 3), e M componentes sao necessarios para reconstrui-la (M-of-N, ex: 2-of-3)." },
              { principle: "Separation of Duties", desc: "Quem gera chaves nao e quem as injeta. Quem opera o HSM nao e quem audita. Roles distintos para prevenir fraude interna." },
            ].map((item) => (
              <div key={item.principle} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>
                  {item.principle}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {item.desc}
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
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          HSM & Criptografia para Pagamentos
        </h1>
        <p className="page-description">
          Guia completo sobre Hardware Security Modules, gerenciamento de chaves criptograficas,
          PIN block management, P2PE, tokenizacao e assinaturas digitais na industria de pagamentos.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>O que e um HSM, por que e essencial em pagamentos e niveis de certificacao FIPS 140-2</li>
          <li>Arquiteturas de deploy: on-premise, cloud HSM e HSM-as-a-Service</li>
          <li>Como PIN blocks funcionam (ISO 0/1/3/4) e o processo de PIN translation</li>
          <li>Hierarquia completa de chaves: LMK, ZMK, ZPK, KEK, TMK, TPK e DUKPT</li>
          <li>Algoritmos criptograficos: AES, RSA, ECC, 3DES e quando usar cada um</li>
          <li>P2PE, tokenizacao (vault vs vaultless) e assinaturas digitais</li>
          <li>Compliance: PCI PIN Security, TR-39, key ceremonies e dual control</li>
        </ul>
      </div>

      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>7</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tipos de Chave</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Algoritmos</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Padroes PCI</div>
        </div>
      </div>

      {sections.map((section, idx) => (
        <div key={section.id} className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`} style={sectionStyle}>
          <h2 style={headingStyle}>
            <span style={{ minWidth: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0, background: "var(--primary)", color: "#fff", padding: "0 0.25rem" }}>
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
            { name: "PCI Compliance", href: "/knowledge/pci-compliance" },
            { name: "Card-Present & POS", href: "/knowledge/card-present-pos" },
            { name: "Event Architecture", href: "/knowledge/event-architecture" },
            { name: "Webhook Patterns", href: "/knowledge/webhook-patterns" },
            { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
