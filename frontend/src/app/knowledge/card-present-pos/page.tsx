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

export default function CardPresentPosPage() {
  const quiz = getQuizForPage("/knowledge/card-present-pos");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "ecossistema",
      title: "Ecossistema Card-Present",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Card-present (CP) refere-se a transacoes onde o cartao fisico (ou dispositivo com credenciais) esta
            presente no ponto de venda. A presenca fisica do cartao e do portador reduz drasticamente o risco de
            fraude comparado a card-not-present (CNP). Isso se reflete em interchange fees menores (CP: 1.5-2.0%
            vs CNP: 2.5-3.5%) e taxas de chargeback significativamente mais baixas.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Card-Present</th>
                  <th style={thStyle}>Card-Not-Present</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Autenticacao</td><td style={tdStyle}>Chip EMV + PIN / Contactless</td><td style={tdStyle}>3D Secure / CVV / OTP</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Fraude</td><td style={tdStyle}>~0.01% das transacoes</td><td style={tdStyle}>~0.15% das transacoes</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Interchange</td><td style={tdStyle}>Menor (presenca = menos risco)</td><td style={tdStyle}>Maior (sem presenca = mais risco)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Liability</td><td style={tdStyle}>Issuer (se chip usado corretamente)</td><td style={tdStyle}>Merchant (se sem 3DS)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Cryptogram</td><td style={tdStyle}>ARQC gerado pelo chip (unico por txn)</td><td style={tdStyle}>Nao aplicavel</td></tr>
              </tbody>
            </table>
          </div>
          <div style={codeBlockStyle}>{`Fluxo Card-Present simplificado:

[Portador] → insere/aproxima cartao → [Terminal POS]
                                           |
              Leitura EMV chip / NFC → gera cryptogram (ARQC)
                                           |
              Monta mensagem ISO 8583 → [Adquirente]
                                           |
              Roteia para bandeira → [Visa/Mastercard]
                                           |
              Encaminha para emissor → [Banco Emissor]
                                           |
              Verificacao: saldo, limite, fraude, cryptogram
                                           |
              Response: aprovado/negado → caminho reverso → [Terminal]`}</div>
        </>
      ),
    },
    {
      id: "tipos-terminais",
      title: "Tipos de Terminais",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O ecossistema de terminais evoluiu significativamente nos ultimos anos. De terminais dial-up que
            conectavam via linha telefonica, chegamos a smart terminals com Android, 4G e processamento local.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "POS Tradicional", emoji: "🖥️", desc: "Terminal fixo com display, teclado PIN pad, leitor de chip e contactless. Conecta via Ethernet ou Wi-Fi. Vendors: Ingenico (Desk 5000), Verifone (V240m), PAX (A920). Robusto, ideal para varejo fixo.", tag: "Mais confiavel" },
              { name: "mPOS (Mobile POS)", emoji: "📱", desc: "Leitor de cartao compacto que conecta via Bluetooth a um smartphone. App no celular controla a transacao. Exemplos: Stone Ton, PagSeguro Minizinha, SumUp. Custo baixo, ideal para autonomos e pequenos comerciantes.", tag: "Menor custo" },
              { name: "Smart POS (Android)", emoji: "🤖", desc: "Terminal com sistema operacional Android, touchscreen, camera, impressora. Permite instalar apps (delivery, fidelidade, gestao). Exemplos: PAX A920 Pro, Ingenico Axium, Stone Smart. Convergencia entre POS e PDV.", tag: "Mais versatil" },
              { name: "PIN Pad", emoji: "🔢", desc: "Dispositivo apenas para entrada de PIN e leitura de cartao, conectado a um PDV (automacao comercial). Nao processa sozinho — depende do software do PDV. Exemplos: Gertec PPC 920, Ingenico iPP 320.", tag: "Integracao PDV" },
              { name: "Unattended Terminal", emoji: "🏧", desc: "Terminal para autoatendimento: totens, maquinas de vending, estacionamentos, pedagios. Sem interacao humana do lado do comerciante. Requisitos especiais de PCI (device security, tamper detection).", tag: "Self-service" },
            ].map((item) => (
              <div key={item.name} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                  <span style={tagStyle}>{item.tag}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "emv-chip",
      title: "EMV Chip",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            EMV (Europay, Mastercard, Visa) e o padrao global para cartoes com chip. O chip e um microprocessador
            que executa aplicacoes criptograficas — diferente da tarja magnetica (dados estaticos que podem ser
            clonados), o chip gera um cryptogram unico a cada transacao, tornando clonagem praticamente impossivel.
          </p>
          <p style={subheadingStyle}>Fluxo de uma transacao EMV</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {[
              { step: "1. Application Selection", desc: "Terminal e chip negociam qual aplicacao usar (Visa credit, Mastercard debit, etc.). Chip pode ter multiplas aplicacoes (multi-app card)." },
              { step: "2. Application Processing", desc: "Chip envia dados ao terminal: PAN, expiry, Application Interchange Profile (AIP), Application File Locator (AFL)." },
              { step: "3. Card Risk Management", desc: "Chip avalia internamente: velocity checks (quantas transacoes offline), floor limits, transacao forcada online." },
              { step: "4. Terminal Risk Management", desc: "Terminal avalia: floor limit, random selection para ir online, terminal action codes." },
              { step: "5. CVM (Cardholder Verification)", desc: "Metodo de verificacao: PIN online, PIN offline, assinatura, no CVM (contactless < limite)." },
              { step: "6. Cryptogram Generation", desc: "Chip gera ARQC (Authorization Request Cryptogram) usando chaves derivadas, dados da transacao e contador (ATC)." },
              { step: "7. Online Authorization", desc: "Terminal envia ARQC ao issuer via acquirer/network. Issuer verifica cryptogram e aprova/nega." },
              { step: "8. Issuer Authentication", desc: "Issuer envia ARPC (Authorization Response Cryptogram) de volta ao chip para confirmar a resposta." },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0, minWidth: "1.5rem" }}>{item.step.split(".")[0]}.</span>
                <span style={{ color: "var(--foreground)" }}>
                  <strong>{item.step.split(". ")[1]}:</strong>{" "}
                  <span style={{ color: "var(--text-secondary)" }}>{item.desc}</span>
                </span>
              </div>
            ))}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>EMV Liability Shift</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Com EMV, a responsabilidade por fraude de cartao presente e do issuer (desde que o merchant aceite chip).
              Se o merchant nao suporta chip e so aceita tarja, a liability e do merchant. Isso incentivou a migracao
              global para EMV — no Brasil, 99%+ das transacoes presenciais ja usam chip.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "contactless-nfc",
      title: "Contactless / NFC",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Contactless (tap-to-pay) usa NFC (Near Field Communication) para comunicacao entre cartao/dispositivo
            e terminal a distancias de ate 4cm. A transacao e significativamente mais rapida (2-3 segundos vs
            5-10 segundos para chip inserido) e nao exige PIN abaixo de certos limites.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Pais</th>
                  <th style={thStyle}>Limite sem PIN</th>
                  <th style={thStyle}>Adocao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Brasil</td><td style={tdStyle}>R$ 200 (bandeira define)</td><td style={tdStyle}>~60% das transacoes presenciais</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>UK</td><td style={tdStyle}>100 GBP</td><td style={tdStyle}>~85%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Australia</td><td style={tdStyle}>200 AUD</td><td style={tdStyle}>~95%</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>EUA</td><td style={tdStyle}>Varia por issuer</td><td style={tdStyle}>~40%</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Kernel Configuration</p>
          <p style={paragraphStyle}>
            Cada bandeira tem seu proprio contactless kernel (software que gerencia a comunicacao NFC): Visa payWave,
            Mastercard PayPass, Amex ExpressPay, Elo Contactless. O terminal deve ter todos os kernels configurados
            e certificados separadamente. A configuracao de kernel define: CVM limits, floor limits, terminal
            transaction qualifiers (TTQ), e offline data authentication (ODA) requirements.
          </p>
          <p style={subheadingStyle}>Dual-Interface Cards</p>
          <p style={paragraphStyle}>
            Cartoes dual-interface possuem tanto chip de contato (inserir) quanto antena NFC (aproximar) no mesmo
            cartao. O chip e um unico — a interface muda, mas a aplicacao EMV e a mesma. O terminal decide qual
            interface usar baseado na preferencia do portador e configuracao do merchant.
          </p>
        </>
      ),
    },
    {
      id: "pin-management",
      title: "PIN Management",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            O PIN (Personal Identification Number) e o metodo primario de autenticacao em transacoes card-present.
            Sua protecao e regulada por PCI PIN Security e envolve criptografia desde o momento da digitacao ate
            a verificacao pelo issuer.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Como funciona</th>
                  <th style={thStyle}>Quando usar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Online PIN</td>
                  <td style={tdStyle}>PIN encriptado no PIN pad, enviado ao issuer para verificacao online</td>
                  <td style={tdStyle}>Padrao para transacoes com conectividade (maioria)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Offline PIN (plaintext)</td>
                  <td style={tdStyle}>PIN verificado localmente pelo chip do cartao, sem ir ao issuer</td>
                  <td style={tdStyle}>Transacoes offline, baixo risco, chip suporta</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Offline PIN (enciphered)</td>
                  <td style={tdStyle}>PIN encriptado com chave publica do chip, verificado pelo chip</td>
                  <td style={tdStyle}>Mais seguro que plaintext offline, chip com RSA</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>No CVM</td>
                  <td style={tdStyle}>Sem verificacao de portador (contactless abaixo do limite)</td>
                  <td style={tdStyle}>Transacoes contactless de baixo valor</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>PIN Bypass</td>
                  <td style={tdStyle}>Portador pressiona Enter sem digitar PIN (quando permitido)</td>
                  <td style={tdStyle}>Cartoes de credito onde assinatura e aceita</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Seguranca do PIN Pad
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O PIN pad e um Secure Cryptographic Device (SCD) certificado PCI PTS. O PIN e criptografado dentro
              do hardware do PIN pad — o software do terminal nunca tem acesso ao PIN em claro. Tentativas de
              tamper (abertura, drilling, probing) apagam as chaves armazenadas. O PIN pad tem seu proprio
              processador criptografico isolado do processador principal do terminal.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "tef",
      title: "TEF — Transferencia Eletronica de Fundos",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            TEF e o sistema brasileiro de integracao entre o PDV (ponto de venda / automacao comercial) e os
            adquirentes de cartao. Em vez de um terminal POS standalone, a transacao e iniciada pelo sistema
            do comerciante e executada via PIN pad conectado ao PDV.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Como funciona</th>
                  <th style={thStyle}>Latencia</th>
                  <th style={thStyle}>Uso</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>SiTef (Software in TEF)</td>
                  <td style={tdStyle}>Servidor SiTef (Software Express) centraliza comunicacao com adquirentes. PDV conversa com SiTef via protocolo proprietario.</td>
                  <td style={tdStyle}>~2-5s (via rede local)</td>
                  <td style={tdStyle}>Redes de varejo, supermercados, grandes lojistas</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>TEF Discado (Dial-Up)</td>
                  <td style={tdStyle}>Terminal disca diretamente para o adquirente via linha telefonica. Sem intermediario.</td>
                  <td style={tdStyle}>~10-15s</td>
                  <td style={tdStyle}>Legacy, praticamente extinto</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>TEF IP (Dedicado)</td>
                  <td style={tdStyle}>Comunicacao direta IP entre PDV e adquirente. Pode usar gateway do proprio adquirente.</td>
                  <td style={tdStyle}>~1-3s</td>
                  <td style={tdStyle}>Grandes redes com link dedicado</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>TEF via API</td>
                  <td style={tdStyle}>API REST/gRPC do adquirente consumida diretamente pelo PDV. Modelo moderno, cloud-native.</td>
                  <td style={tdStyle}>~500ms-2s</td>
                  <td style={tdStyle}>Fintechs, startups, automacao moderna</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            O SiTef (Software Express, agora Fiserv) domina o mercado brasileiro de TEF, com mais de 70% de market
            share em grandes varejistas. Ele funciona como orquestrador: o PDV envia a transacao ao servidor SiTef,
            que roteia para o adquirente correto (Cielo, Rede, Stone, Getnet) baseado em regras configuradas
            (menor taxa, roteamento por bandeira, fallback).
          </p>
        </>
      ),
    },
    {
      id: "captura-comunicacao",
      title: "Captura e Comunicacao",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            A comunicacao entre terminal e adquirente segue o protocolo ISO 8583 — o padrao da industria de cartoes
            para mensagens de transacao financeira. Cada mensagem tem um MTI (Message Type Indicator) que identifica
            o tipo de operacao, seguido de campos (data elements) com os dados da transacao.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>MTI</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Descricao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>0100</td><td style={tdStyle}>Authorization Request</td><td style={tdStyle}>Terminal solicita autorizacao ao issuer</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>0110</td><td style={tdStyle}>Authorization Response</td><td style={tdStyle}>Issuer responde aprovando/negando</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>0200</td><td style={tdStyle}>Financial Request</td><td style={tdStyle}>Transacao completa (auth + capture em uma msg)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>0210</td><td style={tdStyle}>Financial Response</td><td style={tdStyle}>Resposta a transacao financeira</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>0400</td><td style={tdStyle}>Reversal Request</td><td style={tdStyle}>Cancelamento de transacao (timeout, erro)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>0500</td><td style={tdStyle}>Batch Upload</td><td style={tdStyle}>Envio de lote de transacoes para settlement</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Store-and-Forward</p>
          <p style={paragraphStyle}>
            Quando a conectividade cai, o terminal pode operar em modo store-and-forward: autoriza transacoes
            localmente (usando floor limits e offline risk management do chip) e armazena para envio posterior.
            Quando a conexao retorna, as transacoes pendentes sao enviadas em batch. Risco: transacoes offline
            podem ser negadas posteriormente pelo issuer.
          </p>
          <p style={subheadingStyle}>Batch Settlement</p>
          <p style={paragraphStyle}>
            No final do dia (ou em horarios configurados), o terminal envia um batch de todas as transacoes
            capturadas para o adquirente. O adquirente reconcilia com as autorizacoes ja recebidas e envia
            para a bandeira para clearing e settlement. Discrepancias (transacao no batch sem autorizacao
            correspondente) geram chargebacks ou rejeicoes.
          </p>
        </>
      ),
    },
    {
      id: "certificacao-terminais",
      title: "Certificacao de Terminais",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Antes de processar transacoes em producao, um terminal deve ser certificado por multiplas entidades.
            Cada certificacao valida um aspecto diferente: seguranca fisica, software de pagamento e compatibilidade
            com as redes.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Certificacao</th>
                  <th style={thStyle}>Entidade</th>
                  <th style={thStyle}>O que valida</th>
                  <th style={thStyle}>Validade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>PCI PTS</td>
                  <td style={tdStyle}>PCI SSC</td>
                  <td style={tdStyle}>Seguranca fisica e logica do hardware (tamper resistance, key protection)</td>
                  <td style={tdStyle}>~5 anos (versao)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>EMVCo Level 1</td>
                  <td style={tdStyle}>EMVCo (via lab acreditado)</td>
                  <td style={tdStyle}>Interface eletrica e mecanica (contato + contactless) — hardware funciona corretamente</td>
                  <td style={tdStyle}>Por modelo de hardware</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>EMVCo Level 2</td>
                  <td style={tdStyle}>EMVCo (via lab acreditado)</td>
                  <td style={tdStyle}>Software de aplicacao EMV — processa corretamente as etapas da transacao</td>
                  <td style={tdStyle}>Por versao de software</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>EMVCo Level 3</td>
                  <td style={tdStyle}>Bandeiras individuais</td>
                  <td style={tdStyle}>Compatibilidade end-to-end com a rede especifica (Visa ADVT, Mastercard TQM)</td>
                  <td style={tdStyle}>Por bandeira + adquirente</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Homologacao Adquirente</td>
                  <td style={tdStyle}>Cielo, Rede, Stone, etc.</td>
                  <td style={tdStyle}>Integracao funcional com o host do adquirente (mensageria, protocolos)</td>
                  <td style={tdStyle}>Por adquirente</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Custo e timeline de certificacao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Certificar um novo terminal do zero leva 12-18 meses e custa centenas de milhares de dolares.
              PCI PTS: ~US$ 50-100k. EMVCo L1+L2: ~US$ 30-60k. L3 por bandeira: ~US$ 20-40k cada. Homologacao
              por adquirente: ~US$ 10-20k cada. Por isso, fabricantes como PAX e Ingenico dominam — o custo de
              entrada e uma barreira enorme para novos players.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "tendencias",
      title: "Tendencias",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            O futuro de card-present esta convergindo para menos hardware, mais software e autenticacao biometrica.
            O terminal fisico como conhecemos esta sendo transformado — ou eliminado — por novas tecnologias.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "Tap on Phone (SoftPOS)", emoji: "📲", desc: "Transforma qualquer smartphone com NFC em um terminal de pagamento. O telefone do comerciante aceita pagamentos contactless diretamente, sem hardware adicional. Visa Tap to Phone, Mastercard Tap on Phone. Certificacao PCI CPoC (Contactless Payments on COTS). Disruptivo para mPOS.", color: "#22c55e" },
              { name: "QR Code Payments", emoji: "📷", desc: "Merchant exibe QR code, comprador escaneia e paga (ou vice-versa). Amplamente adotado na Asia (WeChat Pay, Alipay) e America Latina (Pix QR Code). Custo zero de hardware para o merchant — basta imprimir o QR.", color: "#3b82f6" },
              { name: "Face Pay", emoji: "😊", desc: "Reconhecimento facial para autenticacao e pagamento. Mastercard Biometric Checkout, PopPay (Brasil). Camera do terminal identifica o portador e debita automaticamente. Desafios: privacidade, bias algoritmico, regulacao (LGPD).", color: "#8b5cf6" },
              { name: "Palm Pay", emoji: "🤚", desc: "Pagamento via leitura da palma da mao (veias e linhas). Amazon One: pague com a palma em lojas Whole Foods e Amazon Go. Tencent e Alibaba testam na China. Biometria mais aceita culturalmente que face.", color: "#f59e0b" },
              { name: "Unattended Commerce", emoji: "🏪", desc: "Lojas autonomas (Amazon Go, Zaitt no Brasil), vending machines inteligentes, delivery lockers, estacionamentos automatizados. Combinacao de sensors, computer vision e pagamento invisivel. O terminal desaparece — o pagamento acontece automaticamente.", color: "#ef4444" },
            ].map((item) => (
              <div key={item.name} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
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
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Card-Present & Arquitetura POS</h1>
        <p className="page-description">
          Guia completo sobre o ecossistema card-present: terminais POS, EMV chip, contactless/NFC,
          PIN management, TEF, certificacao de terminais e tendencias como SoftPOS e face pay.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>Ecossistema card-present: fluxo terminal → acquirer → network → issuer</li>
          <li>Tipos de terminais: POS, mPOS, Smart POS, PIN pad e unattended</li>
          <li>EMV chip em detalhe: application selection, CVM, cryptograms (ARQC/ARPC)</li>
          <li>Contactless/NFC: tap-to-pay, limites sem PIN, kernel configuration</li>
          <li>TEF no Brasil: SiTef, TEF IP e integracao com automacao comercial</li>
          <li>ISO 8583 message flow, store-and-forward e batch settlement</li>
          <li>Certificacoes: PCI PTS, EMVCo Level 1/2/3 e homologacao por bandeira</li>
        </ul>
      </div>

      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tipos Terminal</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Etapas EMV</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tendencias</div></div>
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
            { name: "HSM & Criptografia", href: "/knowledge/hsm-cryptography" },
            { name: "PCI Compliance", href: "/knowledge/pci-compliance" },
            { name: "Emerging Payments", href: "/knowledge/emerging-payments" },
            { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>{link.name}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
