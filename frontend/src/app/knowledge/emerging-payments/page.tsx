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

export default function EmergingPaymentsPage() {
  const quiz = getQuizForPage("/knowledge/emerging-payments");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "a2a",
      title: "A2A — Account-to-Account Payments",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            A2A (Account-to-Account) sao pagamentos que movem dinheiro diretamente entre contas bancarias,
            sem intermediarios de cartao (Visa, Mastercard). Em vez do fluxo merchant → acquirer → network → issuer,
            o dinheiro vai direto da conta do pagador para a conta do recebedor via rails bancarios (Pix, ACH,
            SEPA, Faster Payments).
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>A2A (Account-to-Account)</th>
                  <th style={thStyle}>Card Payment</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Intermediarios</td><td style={tdStyle}>Banco pagador → Clearing → Banco recebedor</td><td style={tdStyle}>Acquirer → Network → Issuer</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Custo merchant</td><td style={tdStyle}>0-0.5% (Pix: gratis ou centavos)</td><td style={tdStyle}>1.5-3.5% (interchange + acquirer fee)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Settlement</td><td style={tdStyle}>Instantaneo (Pix) ou D+1 (ACH)</td><td style={tdStyle}>D+1 a D+30</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Chargebacks</td><td style={tdStyle}>Nao existe (irrevogavel na maioria)</td><td style={tdStyle}>Sim (protecao do consumidor)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Autenticacao</td><td style={tdStyle}>Banking app (biometria, senha)</td><td style={tdStyle}>Chip+PIN, 3DS, CVV</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              O Pix e o maior case de A2A do mundo
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Com mais de 150 milhoes de usuarios e custos drasticamente menores que cartao, o Pix demonstrou
              que A2A pode substituir cartoes em muitos cenarios. A Europa segue o mesmo caminho com SEPA Instant
              + Open Banking. O desafio: sem chargeback, o consumidor tem menos protecao — o que limita adocao
              em e-commerce de alto valor.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "open-banking-payments",
      title: "Open Banking Payments",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Open Banking Payments usa APIs padronizadas para iniciar pagamentos diretamente da conta bancaria
            do consumidor, sem passar por redes de cartao. O merchant (via PISP) solicita o pagamento, o
            consumidor autoriza no app do banco (ASPSP), e o dinheiro e transferido instantaneamente.
          </p>
          <p style={subheadingStyle}>Atores do ecossistema</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { role: "ASPSP", full: "Account Servicing Payment Service Provider", desc: "O banco que mantem a conta do consumidor. Expoe APIs para consulta de saldo e iniciacao de pagamento. Exemplos: Itau, Bradesco, Nubank." },
              { role: "PISP", full: "Payment Initiation Service Provider", desc: "O servico que inicia o pagamento em nome do merchant. Conecta-se ao ASPSP via API. Exemplos: TrueLayer, Yapily, Volt, Iniciador (Brasil)." },
              { role: "AISP", full: "Account Information Service Provider", desc: "Servico que acessa dados da conta (saldo, extrato) com consentimento do usuario. Usado para score de credito, PFM, open finance." },
            ].map((item) => (
              <div key={item.role} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={tagStyle}>{item.role}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{item.full}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={codeBlockStyle}>{`Fluxo Open Banking Payment (PIS):

1. Consumer no checkout do Merchant
2. Merchant chama PISP API: "iniciar pagamento de R$ 100"
3. PISP redireciona consumer ao app do banco (ASPSP)
4. Consumer autentica (biometria) e autoriza pagamento
5. ASPSP executa transferencia (Pix/SEPA Instant)
6. PISP recebe confirmacao via webhook
7. Merchant recebe notificacao: pagamento confirmado
8. Consumer redirecionado de volta ao merchant

Tempo total: 5-15 segundos
Custo: R$ 0.01-0.10 (vs R$ 1.50-3.00 cartao)`}</div>
        </>
      ),
    },
    {
      id: "request-to-pay",
      title: "Request to Pay (RTP)",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Request to Pay (RTP) inverte o fluxo de pagamento: em vez do pagador iniciar, o recebedor envia
            uma solicitacao de pagamento que o pagador pode aprovar, rejeitar, ou pedir alteracao. E o equivalente
            digital de apresentar uma fatura e esperar o pagamento — mas com confirmacao instantanea.
          </p>
          <p style={paragraphStyle}>
            No Brasil, o Pix Cobranca ja implementa esse conceito: o recebedor gera um QR code com valor e dados
            do pagamento, o pagador escaneia e confirma. O proximo passo e Pix Automatico (debito recorrente
            autorizado), que funciona como um request-to-pay recorrente.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "SEPA Request to Pay (EU)", desc: "Padrao europeu (EPC) para solicitacao de pagamento. Merchant envia request, consumidor recebe no app do banco, aprova, e pagamento SEPA Instant e executado. Interoperavel entre todos os bancos europeus." },
              { name: "EPI (European Payments Initiative)", desc: "Iniciativa pan-europeia para criar um scheme de pagamento digital unificado. Combinacao de wallet (Wero), instant payments (SEPA) e request-to-pay. Objetivo: alternativa europeia a Visa/Mastercard para pagamentos digitais." },
              { name: "Pix Cobranca (Brasil)", desc: "QR code com valor pre-definido, data de vencimento, multa, juros e desconto. Substitui boleto bancario com liquidacao instantanea. Ja usado por utilities, e-commerce e servicos de assinatura." },
            ].map((item) => (
              <div key={item.name} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>{item.name}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "invisible-payments",
      title: "Invisible Payments",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Invisible payments (ou ambient payments) sao transacoes que acontecem sem nenhuma acao explicita
            do consumidor no momento da compra. O pagamento e automatico, baseado em contexto, sensors ou
            pre-autorizacao. O objetivo final: eliminar completamente o atrito de pagamento.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "Just Walk Out (Amazon Go)", emoji: "🏪", desc: "Combinacao de computer vision, sensor fusion e deep learning. Consumidor entra na loja, pega produtos e sai. Cameras e sensores detectam o que foi pego. Cobranca automatica no cartao cadastrado. Tecnologia licenciada para terceiros (Amazon One).", color: "#22c55e" },
              { name: "IoT Payments", emoji: "📡", desc: "Dispositivos conectados que pagam automaticamente: geladeira que faz pedido quando item acaba, carro que paga pedagio e estacionamento, impressora que compra toner. Machine-to-machine commerce via APIs de pagamento.", color: "#3b82f6" },
              { name: "Connected Cars", emoji: "🚗", desc: "Veiculos com pagamento integrado: combustivel, pedagio, estacionamento, drive-through. Mercedes me, BMW Connected Drive. Autenticacao por VIN + localizacao. Pagamento de combustivel sem sair do carro (Shell + Mercedes).", color: "#8b5cf6" },
              { name: "Vending & Self-Checkout", emoji: "🏧", desc: "Vending machines com NFC, QR code e reconhecimento facial. Self-checkout em supermercados com visao computacional. Scan & Go (Walmart): consumidor escaneia com o celular e paga sem fila.", color: "#f59e0b" },
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
    {
      id: "voice-payments",
      title: "Voice Payments",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Voice payments permitem que consumidores facam transacoes usando comandos de voz em assistentes
            virtuais como Alexa, Google Assistant e Siri. O desafio principal e autenticacao — como garantir
            que quem esta falando e realmente o titular da conta.
          </p>
          <p style={subheadingStyle}>Desafios de autenticacao</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { challenge: "Voice spoofing", desc: "Gravacoes ou deepfakes de voz podem imitar o usuario. Solucao: voice biometrics com liveness detection (anti-replay)." },
              { challenge: "Ambient listening", desc: "TV, radio ou pessoa proxima pode acionar pagamento acidentalmente. Solucao: confirmation steps, PINs de voz, limites de valor." },
              { challenge: "Shared devices", desc: "Multiplas pessoas usam o mesmo Echo/Google Home. Quem autorizou? Solucao: voice profiles por usuario, autenticacao multifator." },
              { challenge: "PCI compliance", desc: "Se o dispositivo captura dados de cartao por voz, entra no escopo PCI. Solucao: tokenizacao, uso de cartao ja salvo no perfil." },
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
      id: "biometric-payments",
      title: "Biometric Payments",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Biometric payments usam caracteristicas fisicas unicas do consumidor (face, palma, iris, impressao
            digital) como credencial de pagamento. O corpo humano se torna o cartao — sem necessidade de
            dispositivo, cartao ou PIN.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Modalidade</th>
                  <th style={thStyle}>Tecnologia</th>
                  <th style={thStyle}>Players</th>
                  <th style={thStyle}>Adocao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Face Pay</td><td style={tdStyle}>Reconhecimento facial 3D, liveness detection</td><td style={tdStyle}>Mastercard Biometric Checkout, PopPay (BR)</td><td style={tdStyle}>China avancado, global em teste</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Palm Pay</td><td style={tdStyle}>Leitura de veias da palma (IR)</td><td style={tdStyle}>Amazon One, Tencent, Fujitsu PalmSecure</td><td style={tdStyle}>EUA (Whole Foods), Japao</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Fingerprint</td><td style={tdStyle}>Sensor capacitivo/optico no cartao</td><td style={tdStyle}>Visa biometric card, IDEMIA, Thales</td><td style={tdStyle}>Pilotos em multiplos paises</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Iris</td><td style={tdStyle}>Scan da iris (padrao unico)</td><td style={tdStyle}>Samsung Iris, pesquisa academica</td><td style={tdStyle}>Nicho — aeroportos, alta seguranca</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>Privacidade e LGPD</p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Dados biometricos sao dados sensiveis sob LGPD (Brasil) e GDPR (Europa). Coleta exige consentimento
              explicito, proposito especifico e base legal. Armazenamento deve ser criptografado e, idealmente,
              o template biometrico (nao a imagem) fica no dispositivo do usuario (on-device). Violacao de dados
              biometricos e irreversivel — voce nao pode trocar seu rosto como troca uma senha.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "wearable-payments",
      title: "Wearable Payments",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Wearable payments permitem pagar com dispositivos vestiveis equipados com NFC: relogios inteligentes,
            aneis, pulseiras e outros acessorios. O wearable armazena credenciais tokenizadas e comunica
            com terminais contactless exatamente como um cartao NFC.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "Apple Watch (Apple Pay)", desc: "Dominante em wearable payments. Double-click no botao lateral + aproximar do terminal. Tokenizacao via Apple Pay. Funciona sem iPhone por perto (com cellular)." },
              { name: "Samsung Galaxy Watch (Samsung Pay)", desc: "NFC + MST (Magnetic Secure Transmission) — funciona ate em terminais sem contactless. Samsung Pay tokeniza via Visa/Mastercard network tokens." },
              { name: "Garmin Pay / Fitbit Pay", desc: "Focados em atletas e fitness. Pagar no cafe apos a corrida sem levar carteira. Setup via app no celular. Suporte limitado a bancos parceiros." },
              { name: "Payment Rings (McLEAR, Visa)", desc: "Anel com chip NFC passivo — nao precisa de bateria. Tap no terminal como contactless. Visa e Mastercard certificaram aneis de pagamento. Nicho premium por enquanto." },
              { name: "Pulseiras (Barclays bPay, CaixaBank)", desc: "Pulseiras de silicone/tecido com chip NFC embutido. Populares em eventos, festivais e resorts all-inclusive. Pre-pagas ou vinculadas a conta." },
            ].map((item) => (
              <div key={item.name} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>{item.name}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "super-apps",
      title: "Super Apps",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Super apps sao plataformas que integram multiplos servicos — messaging, commerce, pagamentos,
            financas, transporte, delivery — em um unico aplicativo. O pagamento e o cimento que conecta
            todos os servicos, criando ecossistemas fechados com network effects poderosos.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "WeChat (China)", emoji: "💬", desc: "1.3 bilhao de usuarios. Messaging + WeChat Pay + mini programs (apps dentro do app). Mini programs permitem que qualquer merchant tenha presenca dentro do WeChat sem app proprio. WeChat Pay processa trilhoes de yuan/ano.", users: "1.3B", gmv: "~US$ 16T/ano" },
              { name: "Alipay (China)", emoji: "🏦", desc: "Nasceu como payment para Alibaba, virou super app financeiro. Alipay+ conecta wallets de 12 paises asiaticos para pagamentos cross-border. Investimentos (Yu'e Bao), seguros, credito, tudo dentro do app.", users: "1.3B", gmv: "~US$ 17T/ano" },
              { name: "Grab (Sudeste Asiatico)", emoji: "🚗", desc: "Comecou como ride-hailing (tipo Uber), adicionou delivery, pagamentos (GrabPay), seguros, investimentos e emprestimos. Super app dominante em Singapura, Malasia, Indonesia, Tailandia.", users: "187M", gmv: "~US$ 20B/ano" },
              { name: "Rappi (America Latina)", emoji: "📦", desc: "Delivery → super app. RappiPay, RappiCard (cartao credito), RappiBank (conta digital), RappiCredito. Estrategia de embedded finance para monetizar base de usuarios. Presente em 9 paises da America Latina.", users: "40M+", gmv: "~US$ 5B/ano" },
            ].map((item) => (
              <div key={item.name} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                  <span style={tagStyle}>{item.users} users</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600 }}>GMV estimado: {item.gmv}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "futuro",
      title: "O Futuro dos Pagamentos",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            As proximas fronteiras de pagamentos combinam tecnologias emergentes com novos modelos de dinheiro.
            O resultado: pagamentos programaveis, autonomos e verdadeiramente universais.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "Programmable Money", emoji: "💻", desc: "Dinheiro com logica embutida: pagamento que so executa se condicao for atendida (delivery confirmado), pagamento que se divide automaticamente (royalties), dinheiro com data de validade (subsidios). Requer CBDC ou stablecoins programaveis.", color: "#22c55e" },
              { name: "Smart Contracts for Payments", emoji: "📜", desc: "Contratos auto-executaveis em blockchain que gerenciam pagamentos complexos: escrow automatico, split condicional, streaming payments (pagar por segundo/minuto). Superfluid, Sablier ja permitem salary streaming em crypto.", color: "#3b82f6" },
              { name: "CBDCs (Central Bank Digital Currencies)", emoji: "🏛️", desc: "Moeda digital emitida pelo banco central. Drex (Brasil), Digital Euro (BCE), Digital Yuan (China). Permite programmable money a nivel nacional. Potencial para eliminar intermediarios em pagamentos simples. Privacidade e design arquitetural sao os maiores debates.", color: "#8b5cf6" },
              { name: "Embedded Everywhere", emoji: "🌐", desc: "Pagamentos embutidos em qualquer superficie digital: chat (WhatsApp Pay), social media (Instagram Checkout), games (in-app purchases), metaverso. O pagamento desaparece como experiencia separada — se torna parte invisivel de qualquer interacao.", color: "#f59e0b" },
              { name: "AI-Powered Payments", emoji: "🤖", desc: "Agentes de IA que fazem compras autonomamente: booking de viagens, compra de suprimentos, negociacao de precos. AI agents com wallet proprio e limites de gasto. Autorizacao delegada com guardrails. O futuro: seu AI assistant gerencia seus pagamentos.", color: "#ef4444" },
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
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Emerging Payments — A2A, RTP & Invisible</h1>
        <p className="page-description">
          Guia completo sobre os novos modelos de pagamento: account-to-account, open banking payments,
          biometria, wearables, super apps, invisible payments e o futuro com programmable money.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>A2A payments: como funcionam, vantagens sobre cartoes e o case do Pix</li>
          <li>Open Banking Payments: PIS, consent flow, ASPSP vs PISP</li>
          <li>Request to Pay e a evolucao do faturamento digital</li>
          <li>Invisible payments: Just Walk Out, IoT, connected cars</li>
          <li>Biometric payments: face pay, palm pay e desafios de privacidade (LGPD)</li>
          <li>Super apps: WeChat, Alipay, Grab e o modelo de ecossistema fechado</li>
          <li>O futuro: programmable money, smart contracts, CBDCs e AI-powered payments</li>
        </ul>
      </div>

      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>4</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Super Apps</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>4</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Biometrias</div></div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}><div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Futuro</div></div>
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
            { name: "Card-Present & POS", href: "/knowledge/card-present-pos" },
            { name: "Embedded Finance", href: "/knowledge/embedded-finance" },
            { name: "ISO 20022 & SWIFT", href: "/knowledge/iso20022-swift" },
            { name: "Cross-Border Payments", href: "/knowledge/cross-border" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>{link.name}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
