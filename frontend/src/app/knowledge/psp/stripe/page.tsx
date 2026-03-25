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

export default function StripeDeepDivePage() {
  const quiz = getQuizForPage("/knowledge/psp/stripe");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "visao-geral",
      title: "Visao Geral",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Stripe foi fundada em 2010 por Patrick e John Collison em San Francisco (com sede tambem
            em Dublin). E considerada a referencia em developer experience para pagamentos, tendo
            popularizado a ideia de &quot;pagamentos como API&quot;. Ainda e uma empresa privada,
            avaliada em ~$65B (2023), e processa um volume estimado de mais de $1 trilhao por ano.
          </p>
          <p style={paragraphStyle}>
            O modelo de negocio e PayFac (Payment Facilitator): merchants sao sub-merchants sob a
            licenca da Stripe, o que permite onboarding em minutos em vez de semanas. Stripe opera
            em 46+ paises e aceita 135+ moedas.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Fundacao</td><td style={tdStyle}>2010, San Francisco / Dublin</td></tr>
                <tr><td style={tdStyle}>Status</td><td style={tdStyle}>Privada (~$65B valuation, 2023)</td></tr>
                <tr><td style={tdStyle}>Volume estimado</td><td style={tdStyle}>$1T+ por ano</td></tr>
                <tr><td style={tdStyle}>Paises</td><td style={tdStyle}>46+ (merchant onboarding)</td></tr>
                <tr><td style={tdStyle}>Moedas</td><td style={tdStyle}>135+</td></tr>
                <tr><td style={tdStyle}>Modelo</td><td style={tdStyle}>PayFac (Payment Facilitator)</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Por que Stripe domina o mindshare de developers
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Documentacao interativa com exemplos em 10+ linguagens, API consistente e previsivel,
              Stripe CLI para desenvolvimento local, test mode com cartoes de teste para cada cenario
              (3DS, decline, fraude), e uma comunidade ativa no Discord e Stack Overflow.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "modelo-negocio",
      title: "Modelo de Negocio",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Stripe opera como PayFac — o merchant e um sub-merchant sob o master merchant ID da Stripe.
            Isso permite onboarding rapido (minutos), mas significa que a Stripe tem controle total sobre
            underwriting, risk e reserves. O pricing e blended: uma taxa unica que inclui tudo.
          </p>
          <p style={subheadingStyle}>Ecossistema de Produtos</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Produto</th>
                  <th style={thStyle}>O que faz</th>
                  <th style={thStyle}>Caso de Uso</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Payments</td><td style={tdStyle}>Core: aceitar pagamentos online e presenciais</td><td style={tdStyle}>Qualquer merchant</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Connect</td><td style={tdStyle}>Plataforma para marketplaces e pagamentos split</td><td style={tdStyle}>Marketplaces, plataformas SaaS</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Billing</td><td style={tdStyle}>Subscriptions, invoices, usage-based billing</td><td style={tdStyle}>SaaS, media, servicos recorrentes</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Radar</td><td style={tdStyle}>Fraud detection com ML (incluido no preco base)</td><td style={tdStyle}>Todos os merchants</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Terminal</td><td style={tdStyle}>Hardware e SDK para pagamentos presenciais</td><td style={tdStyle}>Retail com presenca fisica</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Treasury</td><td style={tdStyle}>Banking-as-a-Service: contas, cartoes, movimentacao</td><td style={tdStyle}>Fintechs, plataformas</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Atlas</td><td style={tdStyle}>Incorporacao de empresa nos EUA</td><td style={tdStyle}>Startups internacionais</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Identity</td><td style={tdStyle}>Verificacao de identidade (documento + selfie)</td><td style={tdStyle}>KYC, onboarding</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Stripe no Brasil
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Stripe entrou oficialmente no Brasil em 2023, com pricing de 3.99% + R$0.39 por transacao
              domestica com cartao. Suporta PIX e boleto como metodos de pagamento adicionais. Para
              merchants brasileiros vendendo internacionalmente, a Stripe pode processar em 135+ moedas.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "arquitetura-tecnica",
      title: "Arquitetura Tecnica",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            O fluxo principal da Stripe e baseado em PaymentIntents — objetos que representam a
            intencao de cobrar um cliente. O PaymentIntent gerencia todo o lifecycle: criacao,
            autenticacao (3DS), autorizacao, captura e confirmacao.
          </p>
          <p style={subheadingStyle}>Fluxo de Transacao (PaymentIntents)</p>
          <div style={codeBlockStyle}>
{`Merchant Backend
    |
    | 1. POST /v1/payment_intents (create)
    v
Stripe API --> retorna client_secret
    |
    | 2. Frontend usa client_secret com Stripe.js
    v
Stripe.js / Elements (PCI SAQ-A)
    |
    | 3. stripe.confirmCardPayment(client_secret)
    v
Stripe processamento interno
    |
    v
3DS Challenge (se necessario)
    |
    v
Regional Acquirer (parceiro local)
    |
    v
Card Scheme (Visa/Mastercard/Elo)
    |
    v
Issuer Bank (autorizacao)
    |
    v
Response --> Stripe --> Frontend (real-time)
    |
    v
Webhook: payment_intent.succeeded
    |
    v
Settlement (D+2 a D+7 dependendo do pais)`}
          </div>
          <p style={subheadingStyle}>Componentes-chave</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>Funcao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Stripe.js</td><td style={tdStyle}>SDK client-side que tokeniza dados de cartao. Merchant nunca ve o PAN. Garante PCI SAQ-A.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Elements</td><td style={tdStyle}>Componentes de UI pre-construidos (card input, IBAN, ideal, etc.). Customizaveis via CSS.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>PaymentIntents</td><td style={tdStyle}>API moderna que gerencia todo o lifecycle do pagamento, incluindo 3DS e async flows.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Radar</td><td style={tdStyle}>ML-based fraud detection. Regras customizaveis. Radar for Fraud Teams ($0.07/txn extra) para review manual.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Connect</td><td style={tdStyle}>Infraestrutura para marketplaces: onboarding de sub-merchants, split payments, payouts independentes.</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              client_secret: o segredo do PaymentIntent
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O client_secret permite que o frontend confirme o pagamento sem expor a API secret key.
              Ele deve ser passado do backend para o frontend, mas nunca logado, armazenado em localStorage
              ou exposto em URLs. Se vazar, um atacante pode confirmar pagamentos.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "anatomia-api",
      title: "Anatomia da API",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            A API da Stripe e RESTful com payloads form-encoded (nao JSON!) no request e JSON no
            response. Autenticacao via Bearer token (secret key) no header. Ambientes separados por
            prefixo da key: sk_test_ para sandbox, sk_live_ para producao.
          </p>
          <p style={subheadingStyle}>POST /v1/payment_intents — Criar PaymentIntent</p>
          <div style={codeBlockStyle}>
{`// Request
POST /v1/payment_intents
Authorization: Bearer YOUR_SECRET_KEY_HERE
Content-Type: application/x-www-form-urlencoded
Idempotency-Key: order-12345-attempt-1    // Previne duplicatas

amount=15000&                              // Em centavos: R$150,00
currency=brl&                              // ISO 4217 lowercase
payment_method_types[]=card&               // Metodos aceitos
payment_method_types[]=pix&
capture_method=automatic&                  // automatic ou manual
description=Pedido+%2312345&
metadata[order_id]=ORD-789&                // Campos custom
metadata[customer_tier]=premium&
receipt_email=cliente%40email.com&
statement_descriptor=MYSHOP

// Response
{
  "id": "pi_3ABC123DEF456",
  "object": "payment_intent",
  "amount": 15000,
  "currency": "brl",
  "status": "requires_payment_method",
  "client_secret": "pi_3ABC123DEF456_secret_xyz789",  // Enviar ao frontend
  "payment_method_types": ["card", "pix"],
  "metadata": {
    "order_id": "ORD-789",
    "customer_tier": "premium"
  },
  "created": 1705312200,
  "livemode": false
}`}
          </div>
          <p style={subheadingStyle}>POST /v1/payment_intents/&#123;id&#125;/capture — Captura Manual</p>
          <div style={codeBlockStyle}>
{`// Request (quando capture_method=manual)
POST /v1/payment_intents/pi_3ABC123DEF456/capture
Authorization: Bearer YOUR_SECRET_KEY_HERE
Idempotency-Key: capture-order-12345

amount_to_capture=12000                    // Captura parcial: R$120,00

// Response
{
  "id": "pi_3ABC123DEF456",
  "status": "succeeded",
  "amount": 15000,
  "amount_capturable": 0,
  "amount_received": 12000,
  "latest_charge": "ch_3XYZ789"
}`}
          </div>
          <p style={subheadingStyle}>POST /v1/refunds — Reembolso</p>
          <div style={codeBlockStyle}>
{`// Request
POST /v1/refunds
Authorization: Bearer YOUR_SECRET_KEY_HERE
Idempotency-Key: refund-order-12345

payment_intent=pi_3ABC123DEF456&
amount=5000&                               // Reembolso parcial: R$50,00
reason=requested_by_customer

// Response
{
  "id": "re_1ABC456DEF",
  "object": "refund",
  "amount": 5000,
  "currency": "brl",
  "payment_intent": "pi_3ABC123DEF456",
  "status": "succeeded",
  "reason": "requested_by_customer"
}`}
          </div>
        </>
      ),
    },
    {
      id: "webhooks",
      title: "Webhooks",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Webhooks da Stripe sao essenciais para receber notificacoes assincronas. A Stripe recomenda
            fortemente que voce use webhooks como source of truth em vez de polling. A verificacao e
            feita pelo header <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>Stripe-Signature</code>.
          </p>
          <p style={subheadingStyle}>Verificacao de Assinatura</p>
          <div style={codeBlockStyle}>
{`// Node.js com biblioteca oficial
const stripe = require('stripe')('sk_test_...');
const endpointSecret = 'whsec_...';

app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,       // raw body (Buffer, nao parsed JSON)
      sig,
      endpointSecret
    );
  } catch (err) {
    return res.status(400).send('Webhook signature verification failed');
  }

  // Processar evento...
  res.status(200).json({ received: true });
});`}
          </div>
          <p style={subheadingStyle}>Exemplo: payment_intent.succeeded</p>
          <div style={codeBlockStyle}>
{`{
  "id": "evt_1ABC789",
  "object": "event",
  "type": "payment_intent.succeeded",
  "api_version": "2024-04-10",
  "created": 1705312300,
  "data": {
    "object": {
      "id": "pi_3ABC123DEF456",
      "object": "payment_intent",
      "amount": 15000,
      "currency": "brl",
      "status": "succeeded",
      "payment_method": "pm_1XYZ",
      "metadata": {
        "order_id": "ORD-789"
      },
      "latest_charge": "ch_3XYZ789",
      "charges": {
        "data": [{
          "id": "ch_3XYZ789",
          "amount": 15000,
          "paid": true,
          "payment_method_details": {
            "card": {
              "brand": "visa",
              "last4": "4242",
              "exp_month": 12,
              "exp_year": 2025,
              "country": "BR"
            }
          }
        }]
      }
    }
  }
}`}
          </div>
          <p style={subheadingStyle}>Principais Event Types</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Event Type</th>
                  <th style={thStyle}>Quando</th>
                  <th style={thStyle}>Acao recomendada</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>payment_intent.succeeded</td><td style={tdStyle}>Pagamento confirmado com sucesso</td><td style={tdStyle}>Liberar produto/servico, atualizar pedido</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>payment_intent.payment_failed</td><td style={tdStyle}>Pagamento falhou (decline, 3DS fail)</td><td style={tdStyle}>Notificar cliente, oferecer retry</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>charge.refunded</td><td style={tdStyle}>Reembolso processado</td><td style={tdStyle}>Atualizar status, creditar cliente</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>charge.dispute.created</td><td style={tdStyle}>Chargeback aberto</td><td style={tdStyle}>Coletar evidencias, responder em 7 dias</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>invoice.payment_succeeded</td><td style={tdStyle}>Cobranca de subscription paga</td><td style={tdStyle}>Renovar acesso, atualizar billing</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>checkout.session.completed</td><td style={tdStyle}>Checkout Session finalizada</td><td style={tdStyle}>Fulfill order (Checkout mode)</td></tr>
              </tbody>
            </table>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Armadilha: raw body obrigatorio
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              A verificacao de assinatura exige o raw body (Buffer/string) — se voce usar um JSON parser
              middleware antes (como express.json()), a assinatura vai falhar. Configure o endpoint de
              webhook para receber o body cru.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "precificacao",
      title: "Modelo de Precificacao",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Stripe usa pricing blended — uma taxa unica que inclui interchange, scheme fees e o markup
            da Stripe. E simples de entender, mas pode ser mais caro para merchants com alto volume ou
            transacoes de debito (onde o interchange e baixo).
          </p>
          <p style={subheadingStyle}>Taxas por Regiao</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Regiao / Metodo</th>
                  <th style={thStyle}>Taxa</th>
                  <th style={thStyle}>Observacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Brasil - Cartao domestico</td><td style={tdStyle}>3.99% + R$0.39</td><td style={tdStyle}>Credito e debito, mesma taxa</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Brasil - PIX</td><td style={tdStyle}>1.50% (cap R$5.00)</td><td style={tdStyle}>Mais barato para tickets altos</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Brasil - Boleto</td><td style={tdStyle}>R$3.49 por boleto pago</td><td style={tdStyle}>Apenas boletos efetivamente pagos</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>EUA - Cartao domestico</td><td style={tdStyle}>2.9% + $0.30</td><td style={tdStyle}>Referencia global</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Europa - Cartao domestico</td><td style={tdStyle}>1.5% + EUR 0.25</td><td style={tdStyle}>Interchange regulado (mais barato)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Internacional (cross-border)</td><td style={tdStyle}>+1% sobre taxa base</td><td style={tdStyle}>Cartao de outro pais</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Conversao de moeda</td><td style={tdStyle}>+1% adicional</td><td style={tdStyle}>Se settlement em moeda diferente da transacao</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Custos Adicionais</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Servico</th>
                  <th style={thStyle}>Custo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Radar (basico)</td><td style={tdStyle}>Incluido</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Radar for Fraud Teams</td><td style={tdStyle}>$0.07/txn (review manual, regras avancadas)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Connect (Standard)</td><td style={tdStyle}>Incluido</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Connect (Express/Custom)</td><td style={tdStyle}>0.25% + $0.25 por payout ao connected account</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Chargeback fee</td><td style={tdStyle}>$15.00 por disputa</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Instant Payouts</td><td style={tdStyle}>1% do payout (min $0.50)</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Volume discounts
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Para merchants com mais de $1M/mes em volume, a Stripe oferece custom pricing negociavel
              (similar a IC++). Mas o ponto de entrada para negociacao e alto — merchants de medio porte
              ficam no pricing padrao.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "melhores-casos",
      title: "Melhores Casos de Uso",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Stripe e otimizada para empresas que valorizam developer experience, velocidade de integracao
            e acesso a um ecossistema amplo de produtos financeiros.
          </p>
          <p style={subheadingStyle}>Quando escolher Stripe</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Caso de Uso</th>
                  <th style={thStyle}>Por que Stripe</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Startups / MVPs</td><td style={tdStyle}>Onboarding em minutos, sem volume minimo, documentacao excelente. Da ideia ao first payment em horas.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>SaaS / Subscriptions</td><td style={tdStyle}>Stripe Billing e a solucao mais completa: trials, proration, metered billing, dunning automatico.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Marketplaces</td><td style={tdStyle}>Connect permite onboarding de vendedores, split payments, payouts independentes e compliance automatica.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Embedded payments</td><td style={tdStyle}>Plataformas que querem oferecer pagamentos como feature para seus clientes (SaaS vertical).</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>E-commerce global</td><td style={tdStyle}>Checkout pre-construido, 135+ moedas, link payment, Apple Pay/Google Pay integrados.</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Quando NAO escolher Stripe</p>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Cenarios onde Stripe nao e ideal
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              <strong>Enterprise que precisa de IC++:</strong> O pricing blended e mais caro para alto volume.
              Renegociar exige volume significativo. <strong>Heavy POS / Retail:</strong> A Adyen tem
              solucao POS mais madura com terminais proprios. <strong>LatAm-only:</strong> Se o merchant
              opera so no Brasil, uma adquirente local (Cielo, Rede, Stone) pode oferecer taxas melhores
              e settlement mais rapido. <strong>Mercados emergentes:</strong> dLocal tem cobertura superior
              em Africa e Asia.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "dicas-integracao",
      title: "Dicas de Integracao",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            A integracao com Stripe evoluiu significativamente. A API moderna (PaymentIntents) substitui
            a legacy (Charges). Abaixo, as melhores praticas e erros mais comuns.
          </p>
          <p style={subheadingStyle}>PaymentIntents vs Legacy Charges</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>PaymentIntents (recomendado)</th>
                  <th style={thStyle}>Charges (legacy)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>3DS / SCA</td><td style={tdStyle}>Suporte nativo, gerencia todo o fluxo</td><td style={tdStyle}>Requer integracao manual separada</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Metodos locais</td><td style={tdStyle}>PIX, boleto, OXXO, etc. suportados</td><td style={tdStyle}>Apenas cartao</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Status tracking</td><td style={tdStyle}>Status machine completa (requires_*, processing, succeeded)</td><td style={tdStyle}>Binario (succeeded/failed)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Futuro</td><td style={tdStyle}>Ativo, recebendo features novas</td><td style={tdStyle}>Modo manutencao, sem features novas</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Stripe CLI para Desenvolvimento</p>
          <div style={codeBlockStyle}>
{`# Instalar
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Ouvir webhooks localmente (forward para seu servidor)
stripe listen --forward-to localhost:3000/webhook

# Trigger manual de eventos para teste
stripe trigger payment_intent.succeeded

# Listar eventos recentes
stripe events list --limit 10`}
          </div>
          <p style={subheadingStyle}>Checklist de Integracao</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.8 }}>
              <strong>1.</strong> Use PaymentIntents (nunca Charges para novas integracoes).<br />
              <strong>2.</strong> Sempre envie <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>Idempotency-Key</code> header em requests que criam ou modificam recursos.<br />
              <strong>3.</strong> Use webhooks como source of truth — nao dependa apenas da response sincrona.<br />
              <strong>4.</strong> Trate o status <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>requires_action</code> — significa que 3DS e necessario no frontend.<br />
              <strong>5.</strong> Nunca logue ou armazene o <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>client_secret</code> fora do fluxo do pagamento.<br />
              <strong>6.</strong> Use Stripe CLI para testar webhooks localmente antes de deployar.<br />
              <strong>7.</strong> Configure <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>metadata</code> para vincular pagamentos a entidades do seu sistema.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "comparacao",
      title: "Comparacao: Stripe vs Adyen vs dLocal",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Cada PSP tem forcas e fraquezas distintas. A escolha depende do perfil do merchant:
            volume, geografia, canais e prioridades (custo vs. DX vs. cobertura).
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Criterio</th>
                  <th style={thStyle}>Adyen</th>
                  <th style={{ ...thStyle, color: "var(--primary)" }}>Stripe</th>
                  <th style={thStyle}>dLocal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Pricing</td>
                  <td style={tdStyle}>IC++ (transparente, negociavel)</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Blended (3.99% + R$0.39 BR)</td>
                  <td style={tdStyle}>Custom (FX spread + processing)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Acquiring</td>
                  <td style={tdStyle}>Proprio (30+ paises)</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Via parceiros regionais</td>
                  <td style={tdStyle}>Via parceiros locais</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Forca Geografica</td>
                  <td style={tdStyle}>Europa, global enterprise</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>EUA, Europa, global</td>
                  <td style={tdStyle}>LatAm, Africa, Asia emergente</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>API DX</td>
                  <td style={tdStyle}>Boa (melhorando)</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Excelente (referencia do mercado)</td>
                  <td style={tdStyle}>Boa</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>POS / In-store</td>
                  <td style={tdStyle}>Excelente (terminais proprios)</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Bom (Terminal hardware)</td>
                  <td style={tdStyle}>Nao oferece</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Settlement</td>
                  <td style={tdStyle}>Direto, multi-currency</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Direto, payouts flexiveis</td>
                  <td style={tdStyle}>USD/EUR (cross-border)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Ideal para</td>
                  <td style={tdStyle}>Enterprise, retail, unified commerce</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Startups, SaaS, marketplaces</td>
                  <td style={tdStyle}>Cross-border para mercados emergentes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "armadilhas",
      title: "Armadilhas Comuns",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            Erros reais de integracao com Stripe, suas consequencias e como evitar.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Armadilha</th>
                  <th style={thStyle}>Consequencia</th>
                  <th style={thStyle}>Como Evitar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Nao tratar requires_action (3DS)</td>
                  <td style={tdStyle}>O pagamento fica pendente e nunca e concluido. O cliente acha que pagou, mas a cobranca nao foi efetivada. Perda de receita silenciosa.</td>
                  <td style={tdStyle}>Sempre verifique o status do PaymentIntent no frontend. Se requires_action, chame stripe.handleCardAction() para completar 3DS.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Nao usar Idempotency-Key</td>
                  <td style={tdStyle}>Retries de rede criam cobracas duplicadas. O cliente e cobrado 2x ou mais. Disputas e reembolsos manuais.</td>
                  <td style={tdStyle}>Sempre envie Idempotency-Key em POST requests. Use um ID unico e deterministico (ex: order_id + attempt).</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Confiar apenas na response sincrona</td>
                  <td style={tdStyle}>Pagamentos async (PIX, boleto, 3DS) parecem &quot;pendentes&quot; para sempre. Pedidos nunca sao liberados ou sao liberados prematuramente.</td>
                  <td style={tdStyle}>Implemente webhooks para payment_intent.succeeded e payment_intent.payment_failed. Webhooks sao a source of truth.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Expor client_secret inseguramente</td>
                  <td style={tdStyle}>Se o client_secret vazar (logs, URL, localStorage), um atacante pode confirmar pagamentos. Em combinacao com dados de cartao roubados, pode processar cobracas fraudulentas.</td>
                  <td style={tdStyle}>Passe client_secret apenas em memoria no frontend. Nunca logue, nunca inclua em URLs, nunca armazene.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Usar Charges API em nova integracao</td>
                  <td style={tdStyle}>Sem suporte a 3DS (obrigatorio na Europa e crescente no Brasil), sem metodos locais (PIX, boleto), sem status machine completa. Retrabalho futuro garantido.</td>
                  <td style={tdStyle}>Sempre use PaymentIntents para novas integracoes. Se tem Charges legado, planeje migracao.</td>
                </tr>
              </tbody>
            </table>
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
          Stripe Deep Dive
        </h1>
        <p className="page-description">
          Guia completo da Stripe: modelo PayFac, PaymentIntents, API com exemplos JSON,
          webhooks com verificacao, pricing blended e armadilhas reais de integracao.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Como funciona o modelo PayFac e o ecossistema de produtos da Stripe</li>
          <li>PaymentIntents: fluxo completo com exemplos JSON para payments, captures e refunds</li>
          <li>Webhooks com verificacao Stripe-Signature e event types criticos</li>
          <li>Pricing blended, quando compensa e armadilhas de integracao</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>10</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>$1T+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Volume Anual</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>46+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Paises</div>
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
